/**
 * Cloudflare Pages Function: /api/integrations/telegram/sweep
 * 
 * Privileged VIP Telegram Expiration & Access Re-Synchronization Sweeper
 * Designed for execution by Cloudflare Scheduled Workers or authorized administrators.
 * 
 * SECURITY MANDATES:
 * - Requires strong administrator authorization via Authorization or X-Admin-Key headers.
 * - Insecure query parameters (?adminKey=...) are strictly rejected.
 * - Prevents overlapping runs using a short-lived KV distributed lock (vip_sweep_lock).
 * - Bounded, paginated execution (batch size default 25, max 50) to prevent Cloudflare/Telegram limit exhaustion.
 * - Resumable cursor stored in KV (vip_sweep_cursor).
 * - NEVER touches active entitled subscribers or administrators.
 * - Zero secret leakage: No tokens, passwords, or credentials logged or exposed.
 */

import { getMembers, saveMembers, logVipAuditEvent } from './_kvHelper.js';
import { isVipEligible } from './_vipAccessService.js';
import { getChatMember, removeChatMember, revokeInviteLink } from './_telegramService.js';
import { verifyAdminAuthorization, adminCorsHeaders } from './_adminAuth.js';

const LOCK_KEY = 'vip_sweep_lock';
const CURSOR_KEY = 'vip_sweep_cursor';
const RETRIES_KEY = 'vip_sweep_retries';
const LOCK_TTL_MS = 300000; // 5 minutes max lock duration
const DEFAULT_BATCH_SIZE = 25;
const MAX_BATCH_SIZE = 50;

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: adminCorsHeaders() });
}

/**
 * Acquire distributed sweep lock to prevent overlapping runs
 */
async function acquireSweepLock(env) {
  const now = Date.now();
  if (env && env.USERS_KV) {
    try {
      const existing = await env.USERS_KV.get(LOCK_KEY);
      if (existing) {
        const parsed = JSON.parse(existing);
        if (parsed.timestamp && (now - parsed.timestamp < LOCK_TTL_MS)) {
          return { acquired: false, reason: 'SWEEP_IN_PROGRESS', lockedAt: parsed.timestamp };
        }
      }
      await env.USERS_KV.put(LOCK_KEY, JSON.stringify({ timestamp: now, runId: `run_${now.toString(36)}` }), {
        expirationTtl: 300 // 5 minutes
      });
      return { acquired: true };
    } catch (e) {
      console.warn('[VipSweep] Lock acquire warning:', e.message);
    }
  }
  return { acquired: true };
}

/**
 * Release distributed sweep lock
 */
async function releaseSweepLock(env) {
  if (env && env.USERS_KV) {
    try {
      await env.USERS_KV.delete(LOCK_KEY);
    } catch (e) {}
  }
}

/**
 * Get current sweep cursor for paginated scanning
 */
async function getSweepCursor(env) {
  if (env && env.USERS_KV) {
    try {
      const stored = await env.USERS_KV.get(CURSOR_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return typeof parsed.cursorIndex === 'number' ? parsed.cursorIndex : 0;
      }
    } catch (e) {}
  }
  return 0;
}

/**
 * Update sweep cursor
 */
async function updateSweepCursor(env, nextIndex, totalMembers) {
  if (env && env.USERS_KV) {
    try {
      const data = {
        cursorIndex: nextIndex >= totalMembers ? 0 : nextIndex,
        totalMembers,
        updatedAt: new Date().toISOString()
      };
      await env.USERS_KV.put(CURSOR_KEY, JSON.stringify(data));
    } catch (e) {}
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;

  // 1. Authoritative Administrator Authorization Gate
  const auth = await verifyAdminAuthorization(context);
  if (!auth.authorized) {
    return new Response(JSON.stringify({
      success: false,
      code: 'UNAUTHORIZED',
      error: auth.error || 'Forbidden: Administrator privileges required.'
    }), {
      status: auth.statusCode || 403,
      headers: adminCorsHeaders()
    });
  }

  // 2. Acquire Sweep Lock
  const lock = await acquireSweepLock(env);
  if (!lock.acquired) {
    return new Response(JSON.stringify({
      success: false,
      code: lock.reason,
      message: 'A VIP expiration sweep is currently running. Overlapping sweeps are prevented.'
    }), {
      status: 409,
      headers: adminCorsHeaders()
    });
  }

  try {
    let body = {};
    try { body = await request.json(); } catch (e) {}

    const url = new URL(request.url);
    const requestedBatch = Number(body.batchSize || url.searchParams.get('batchSize') || DEFAULT_BATCH_SIZE);
    const batchSize = Math.max(1, Math.min(MAX_BATCH_SIZE, isNaN(requestedBatch) ? DEFAULT_BATCH_SIZE : requestedBatch));

    const vipChannelId = env && env.TELEGRAM_VIP_CHANNEL_ID;
    if (!vipChannelId) {
      return new Response(JSON.stringify({
        success: false,
        code: 'VIP_CHANNEL_UNCONFIGURED',
        error: 'TELEGRAM_VIP_CHANNEL_ID is not configured in environment.'
      }), {
        status: 500,
        headers: adminCorsHeaders()
      });
    }

    const members = await getMembers(env);
    const totalMembers = members.length;
    const startIndex = await getSweepCursor(env);
    const endIndex = Math.min(startIndex + batchSize, totalMembers);
    const batch = members.slice(startIndex, endIndex);

    let processedCount = 0;
    let evictedCount = 0;
    let revokedInviteCount = 0;
    let errorsCount = 0;
    let rosterModified = false;

    // 3. Process Batch
    for (let i = 0; i < batch.length; i++) {
      const user = batch[i];
      processedCount++;

      // Immediately evaluate entitlement
      const entitlement = isVipEligible(user);

      // ACTIVE SUBSCRIBERS OR ADMINS ARE NEVER TOUCHED
      if (entitlement.eligible) {
        continue;
      }

      // User is INELIGIBLE: perform clean-up
      let userModified = false;

      // A. Revoke any pending invite links
      if (user.vipInvite && user.vipInvite.inviteLink) {
        try {
          await revokeInviteLink(env, vipChannelId, user.vipInvite.inviteLink);
          revokedInviteCount++;
        } catch (e) {
          console.warn('[VipSweep] Revoke invite non-blocking error:', e.message);
        }
        delete user.vipInvite;
        userModified = true;
      }

      // B. If user has a linked Telegram ID, verify and evict from channel if present
      if (user.telegram && user.telegram.id) {
        try {
          const membershipCheck = await getChatMember(env, vipChannelId, user.telegram.id);
          if (membershipCheck.success && membershipCheck.result) {
            const status = (membershipCheck.result.status || '').toLowerCase();
            // If user is currently a regular member or restricted, kick them
            if (['member', 'restricted'].includes(status)) {
              const kickRes = await removeChatMember(env, vipChannelId, user.telegram.id);
              if (kickRes.success) {
                evictedCount++;
                await logVipAuditEvent(env, {
                  action: 'SWEEP_USER_EVICTED',
                  userId: user.id,
                  telegramUserId: user.telegram.id,
                  subscriptionState: user.subscription,
                  result: 'SUCCESS',
                  reasonCode: entitlement.reason
                });
              } else {
                errorsCount++;
                console.warn('[VipSweep] Eviction failed for user', user.id, kickRes.error);
              }
            }
          }
        } catch (tgErr) {
          errorsCount++;
          console.warn('[VipSweep] Telegram inspection error for user', user.id, tgErr.message);
        }
      }

      if (userModified) {
        // Reflect in master array
        const memberIdx = members.findIndex(m => m.id === user.id);
        if (memberIdx >= 0) {
          members[memberIdx] = user;
          rosterModified = true;
        }
      }
    }

    // 4. Persist updated roster if modified
    if (rosterModified) {
      await saveMembers(env, members);
    }

    // 5. Update cursor
    const nextCursor = endIndex >= totalMembers ? 0 : endIndex;
    await updateSweepCursor(env, nextCursor, totalMembers);

    const hasMore = endIndex < totalMembers;

    const summary = {
      batchSize,
      startIndex,
      endIndex,
      totalMembers,
      processedCount,
      evictedCount,
      revokedInviteCount,
      errorsCount,
      nextCursor,
      hasMore
    };

    return new Response(JSON.stringify({
      success: true,
      summary,
      ...summary,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: adminCorsHeaders()
    });

  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Sweep process exception: ' + err.message
    }), {
      status: 500,
      headers: adminCorsHeaders()
    });
  } finally {
    await releaseSweepLock(env);
  }
}
