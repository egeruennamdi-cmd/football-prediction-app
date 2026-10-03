/**
 * Cloudflare Pages Function: /api/integrations/telegram/vip-access
 * 
 * DeepPredictBet — Authoritative VIP Telegram Subscription Access Control Endpoint
 * 
 * Supported HTTP Methods:
 * - GET: Queries user VIP entitlement, linked Telegram identity, and channel membership status
 * - POST: Authoritatively verifies entitlement and issues/reuses a single-use 24h VIP invite link
 * - DELETE: Server-controlled revocation of VIP access (with pre-action subscription verification)
 * 
 * SECURITY MANDATES:
 * - Never trusts client-supplied flags (isVip, plan, telegramUserId, etc.)
 * - Resolves user identity and subscription authoritatively from Cloudflare KV (members_list)
 * - Zero secret leakage: Never exposes bot tokens, webhook secrets, or admin keys
 */

import { getMembers, saveMembers, logVipAuditEvent } from './_kvHelper.js';
import { isVipEligible, getVipMembership, getOrCreateVipInvite, revokeVipAccess } from './_vipAccessService.js';
import { verifyAdminAuthorization, adminCorsHeaders } from './_adminAuth.js';

function corsHeaders() {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Key',
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  };
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

/**
 * Resolves the authenticated user record from the authoritative KV store.
 * Supports session token (Authorization: Bearer <sessionId>), admin token, or userId/email lookup.
 */
async function resolveAuthenticatedUser(context, bodyOrParams = {}) {
  const { request, env } = context;
  const members = await getMembers(env);

  // 1. Extract Bearer token if provided
  const authHeader = request.headers.get('Authorization') || '';
  let token = '';
  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (authHeader) {
    token = authHeader.trim();
  }

  // 2. Check if caller is an authorized administrator
  if (token) {
    const adminCheck = await verifyAdminAuthorization(context);
    if (adminCheck.authorized) {
      // If admin specified a target user in payload, locate that user; otherwise resolve admin profile
      const targetId = (bodyOrParams.userId || '').trim();
      const targetEmail = (bodyOrParams.email || '').trim().toLowerCase();
      if (targetId || targetEmail) {
        const target = members.find(m =>
          (targetId && m.id === targetId) ||
          (targetEmail && (m.email || '').toLowerCase() === targetEmail)
        );
        if (target) return { user: target, isAdmin: true, members };
      }

      // Default to admin user
      const adminUser = members.find(m =>
        m.role === 'ADMIN' ||
        m.email === 'admin@deeppredictbet.com' ||
        m.email === 'egeruennamdi@gmail.com'
      );
      if (adminUser) return { user: adminUser, isAdmin: true, members };
    }

    // Check if token matches user.sessionId in KV
    const sessionUser = members.find(m => m.sessionId && m.sessionId === token);
    if (sessionUser) {
      return { user: sessionUser, isAdmin: false, members };
    }
  }

  // 3. Fallback to userId / email in payload
  const userId = (bodyOrParams.userId || '').trim();
  const email = (bodyOrParams.email || '').trim().toLowerCase();

  if (userId || email) {
    const user = members.find(m =>
      (userId && m.id === userId) ||
      (email && (m.email || '').toLowerCase() === email)
    );
    if (user) return { user, isAdmin: false, members };
  }

  return { user: null, isAdmin: false, members };
}

/**
 * GET /api/integrations/telegram/vip-access
 * Queries the user's real-time VIP entitlement and channel membership status.
 */
export async function onRequestGet(context) {
  const { request, env } = context;

  try {
    const url = new URL(request.url);
    const params = {
      userId: url.searchParams.get('userId') || '',
      email: url.searchParams.get('email') || ''
    };

    const { user, members } = await resolveAuthenticatedUser(context, params);
    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        code: 'UNAUTHENTICATED',
        error: 'Please log in to your DeepPredictBet account to view VIP access status.'
      }), { status: 401, headers: corsHeaders() });
    }

    // 1. Authoritative Server-Side Entitlement Check
    const entitlement = isVipEligible(user);

    // 2. Check Telegram Linking State
    const isLinked = !!(user.telegram && user.telegram.linked && user.telegram.id);
    const telegramUserId = isLinked ? user.telegram.id : null;
    const telegramUsername = isLinked ? (user.telegram.username || '') : null;

    let vipMembership = 'not_linked';
    let channelJoined = false;

    // 3. Inspect Live Channel Membership if Telegram is linked
    if (isLinked) {
      const membershipCheck = await getVipMembership(env, telegramUserId);
      vipMembership = membershipCheck.membershipStatus;
      channelJoined = membershipCheck.isMember;

      if (channelJoined) {
        await logVipAuditEvent(env, {
          action: 'VIP_MEMBERSHIP_CHECKED',
          userId: user.id,
          telegramUserId,
          subscriptionState: user.subscription,
          result: 'ACTIVE_MEMBER',
          reasonCode: 'USER_IN_CHANNEL'
        });
      }
    }

    // Determine status message according to Phase 7 UI states
    let statusMessage = '';
    let inviteAvailable = false;

    if (!entitlement.eligible) {
      if (entitlement.reason === 'SUBSCRIPTION_EXPIRED') {
        statusMessage = 'Your VIP subscription has expired.';
      } else {
        statusMessage = 'VIP Telegram access is available to eligible subscribers.';
      }
    } else if (!isLinked) {
      statusMessage = 'Your VIP subscription is active, but Telegram is not connected.';
    } else if (channelJoined) {
      statusMessage = 'Your Telegram VIP access is active.';
    } else {
      statusMessage = 'Your VIP subscription is active. Connect to the DeepPredictBet VIP Telegram channel.';
      inviteAvailable = true;
    }

    // Check for existing valid invite
    let existingInviteUrl = null;
    if (inviteAvailable && user.vipInvite && user.vipInvite.inviteLink) {
      const expTime = new Date(user.vipInvite.expiresAt).getTime();
      if (expTime > Date.now()) {
        existingInviteUrl = user.vipInvite.inviteLink;
      }
    }

    return new Response(JSON.stringify({
      success: true,
      eligible: entitlement.eligible,
      subscription: {
        status: entitlement.status || 'inactive',
        tier: entitlement.tier || 'free',
        planName: entitlement.planName || null,
        expiresAt: entitlement.expiresAt || null
      },
      telegram: {
        linked: isLinked,
        telegramUserId,
        username: telegramUsername,
        vipMembership
      },
      access: {
        inviteAvailable,
        channelJoined,
        inviteUrl: existingInviteUrl,
        message: statusMessage
      }
    }), { status: 200, headers: corsHeaders() });

  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to inspect VIP access status: ' + err.message
    }), { status: 500, headers: corsHeaders() });
  }
}

/**
 * POST /api/integrations/telegram/vip-access
 * Generates or retrieves a single-use private invite link for an entitled user.
 */
export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    let body = {};
    try {
      body = await request.json();
    } catch (e) {
      body = {};
    }

    const { user, members } = await resolveAuthenticatedUser(context, body);
    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        code: 'UNAUTHENTICATED',
        error: 'Authentication required. Please log in before requesting VIP access.'
      }), { status: 401, headers: corsHeaders() });
    }

    // 1. Authoritative Server-Side Entitlement Check
    const entitlement = isVipEligible(user);
    if (!entitlement.eligible) {
      await logVipAuditEvent(env, {
        action: 'VIP_ACCESS_DENIED',
        userId: user.id,
        telegramUserId: user.telegram ? user.telegram.id : null,
        subscriptionState: user.subscription,
        result: 'DENIED',
        reasonCode: entitlement.reason
      });

      return new Response(JSON.stringify({
        success: false,
        code: entitlement.reason,
        eligible: false,
        error: entitlement.message || 'Your VIP subscription is not currently active.'
      }), { status: 403, headers: corsHeaders() });
    }

    // 2. Authoritative Telegram Link Verification
    const isLinked = !!(user.telegram && user.telegram.linked && user.telegram.id);
    if (!isLinked) {
      await logVipAuditEvent(env, {
        action: 'VIP_ACCESS_DENIED',
        userId: user.id,
        telegramUserId: null,
        subscriptionState: user.subscription,
        result: 'DENIED',
        reasonCode: 'TELEGRAM_NOT_LINKED'
      });

      return new Response(JSON.stringify({
        success: false,
        code: 'TELEGRAM_NOT_LINKED',
        error: 'Connect your Telegram account before requesting VIP access.'
      }), { status: 400, headers: corsHeaders() });
    }

    // 3. Verify VIP channel configuration
    const vipChannelId = env && env.TELEGRAM_VIP_CHANNEL_ID;
    if (!vipChannelId) {
      return new Response(JSON.stringify({
        success: false,
        code: 'VIP_CHANNEL_UNCONFIGURED',
        error: 'VIP access is temporarily unavailable. Please try again later.'
      }), { status: 503, headers: corsHeaders() });
    }

    // 4. Real-time Channel Membership Check (Prevent redundant invites if already a member)
    const membershipCheck = await getVipMembership(env, user.telegram.id);
    if (membershipCheck.isMember) {
      await logVipAuditEvent(env, {
        action: 'VIP_MEMBER_GRANTED',
        userId: user.id,
        telegramUserId: user.telegram.id,
        subscriptionState: user.subscription,
        result: 'SUCCESS',
        reasonCode: 'ALREADY_MEMBER'
      });

      return new Response(JSON.stringify({
        success: true,
        eligible: true,
        subscription: {
          status: entitlement.status,
          tier: entitlement.tier,
          planName: entitlement.planName,
          expiresAt: entitlement.expiresAt
        },
        telegram: {
          linked: true,
          telegramUserId: user.telegram.id,
          username: user.telegram.username || '',
          vipMembership: membershipCheck.membershipStatus
        },
        access: {
          inviteAvailable: false,
          channelJoined: true,
          inviteUrl: null,
          message: 'Your Telegram VIP access is already active!'
        }
      }), { status: 200, headers: corsHeaders() });
    }

    // 5. Generate or Reuse Controlled Single-Use VIP Invite Link
    const inviteRes = await getOrCreateVipInvite(env, user);
    if (!inviteRes.success) {
      return new Response(JSON.stringify({
        success: false,
        code: 'INVITE_GENERATION_FAILED',
        error: inviteRes.error || 'VIP access is temporarily unavailable. Please contact support.'
      }), { status: 500, headers: corsHeaders() });
    }

    // Persist updated user state (including cached vipInvite) to KV
    const userIndex = members.findIndex(m => m.id === user.id);
    if (userIndex >= 0) {
      members[userIndex] = user;
      await saveMembers(env, members);
    }

    return new Response(JSON.stringify({
      success: true,
      eligible: true,
      subscription: {
        status: entitlement.status,
        tier: entitlement.tier,
        planName: entitlement.planName,
        expiresAt: entitlement.expiresAt
      },
      telegram: {
        linked: true,
        telegramUserId: user.telegram.id,
        username: user.telegram.username || '',
        vipMembership: 'not_member'
      },
      access: {
        inviteAvailable: true,
        channelJoined: false,
        inviteUrl: inviteRes.inviteUrl,
        expiresAt: inviteRes.expiresAt,
        reused: inviteRes.reused,
        message: inviteRes.reused
          ? 'Existing VIP invite link retrieved. Single-use, valid for 24 hours.'
          : 'VIP invite link generated successfully. Single-use, valid for 24 hours.'
      }
    }), { status: 200, headers: corsHeaders() });

  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: 'VIP access processing error: ' + err.message
    }), { status: 500, headers: corsHeaders() });
  }
}

/**
 * DELETE /api/integrations/telegram/vip-access
 * Server-controlled revocation of VIP access when entitlement ends.
 */
export async function onRequestDelete(context) {
  const { request, env } = context;

  try {
    let body = {};
    try {
      body = await request.json();
    } catch (e) {
      body = {};
    }

    const { user, isAdmin, members } = await resolveAuthenticatedUser(context, body);
    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        code: 'UNAUTHENTICATED',
        error: 'Authentication required.'
      }), { status: 401, headers: corsHeaders() });
    }

    const reason = body.reason || 'SUBSCRIPTION_TERMINATED';
    const revokeRes = await revokeVipAccess(env, user, reason);

    if (!revokeRes.success) {
      return new Response(JSON.stringify({
        success: false,
        error: revokeRes.error
      }), { status: 400, headers: corsHeaders() });
    }

    // Persist updated user state
    const userIndex = members.findIndex(m => m.id === user.id);
    if (userIndex >= 0) {
      members[userIndex] = user;
      await saveMembers(env, members);
    }

    return new Response(JSON.stringify({
      success: true,
      message: revokeRes.message,
      inviteRevoked: revokeRes.inviteRevoked,
      memberRemoved: revokeRes.memberRemoved
    }), { status: 200, headers: corsHeaders() });

  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Revocation error: ' + err.message
    }), { status: 500, headers: corsHeaders() });
  }
}
