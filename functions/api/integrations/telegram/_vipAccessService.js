/**
 * DeepPredictBet — Centralized Server-Side VIP Telegram Entitlement & Access Engine
 * 
 * CORE RESPONSIBILITIES:
 * 1. isVipEligible(user) — Authoritative subscription entitlement verification.
 *    - Rejects client-supplied flags, local storage, cookies, and URL params.
 *    - Validates active subscription, eligible tier, expiration, cancellation, and account status.
 * 2. getVipMembership(env, telegramUserId) — Telegram Bot API membership lookup in VIP channel.
 * 3. getOrCreateVipInvite(env, user) — Controlled, single-use, 24h-expiring invite link generation with deduplication.
 * 4. revokeVipAccess(env, user, reason) — Server-controlled access revocation with pre-action subscription verification.
 * 
 * SECURITY MANDATE:
 * Never exposes bot tokens, webhook secrets, admin keys, or full credentials.
 */

import { getChatMember, createInviteLink, revokeInviteLink, removeChatMember } from './_telegramService.js';
import { logVipAuditEvent } from './_kvHelper.js';

export const VIP_ELIGIBLE_TIERS = ['annual', 'monthly', 'weekly', 'vip', 'syndicate', 'pro'];

/**
 * Authoritative Server-Side VIP Entitlement Decision Function
 * 
 * @param {object} user - User record loaded directly from authoritative KV storage (members_list)
 * @returns {{ eligible: boolean, reason: string, tier?: string, planName?: string, expiresAt?: string|null, message?: string }}
 */
export function isVipEligible(user) {
  if (!user || typeof user !== 'object') {
    return {
      eligible: false,
      reason: 'INVALID_USER_RECORD',
      message: 'Authentication required. User record not found.'
    };
  }

  // 1. Account status check: Reject suspended or banned punters immediately
  const accountStatus = (user.status || '').toLowerCase().trim();
  if (accountStatus === 'banned' || accountStatus === 'suspended') {
    return {
      eligible: false,
      reason: 'ACCOUNT_SUSPENDED',
      message: 'Account access has been suspended. Please contact support.'
    };
  }

  // 2. Authoritative Administrator check: Admins maintain permanent VIP access
  const email = (user.email || '').toLowerCase().trim();
  const username = (user.username || '').toLowerCase().trim();
  const role = (user.role || '').toUpperCase().trim();

  const isPrimaryAdmin =
    role === 'ADMIN' ||
    ['admin@deeppredictbet.com', 'egeruennamdi@gmail.com'].includes(email) ||
    ['egeruennamdi78', 'egeruennamdi'].includes(username);

  if (isPrimaryAdmin) {
    return {
      eligible: true,
      tier: 'admin',
      planName: 'Administrator All-Access',
      expiresAt: null,
      status: 'ACTIVE',
      reason: 'ADMIN_PERMANENT_ACCESS'
    };
  }

  // 3. Inspect Authoritative Subscription Object
  const sub = user.subscription;
  if (!sub || typeof sub !== 'object') {
    return {
      eligible: false,
      reason: 'NO_ACTIVE_SUBSCRIPTION',
      tier: 'free',
      status: 'none',
      message: 'VIP Telegram access is available to eligible subscribers.'
    };
  }

  // 4. Free or unconfigured tier check
  const candidateTier = String(sub.tier || sub.plan || sub.package || user.role || '').toLowerCase().trim();
  const isFreeOrNone = !candidateTier || ['none', 'free', 'free_tier', ''].includes(candidateTier);
  if (isFreeOrNone) {
    return {
      eligible: false,
      reason: 'NO_ACTIVE_SUBSCRIPTION',
      tier: 'free',
      status: 'none',
      message: 'VIP Telegram access is available to eligible subscribers.'
    };
  }

  // 5. Expiration Date Verification (UTC timestamp comparison)
  // NOTE: Business rules provide no grace period; access ends strictly at expiresAt.
  const subStatus = (sub.status || '').toUpperCase().trim();
  const isExpired = subStatus === 'EXPIRED' || (sub.expiresAt && !isNaN(new Date(sub.expiresAt).getTime()) && new Date(sub.expiresAt).getTime() <= Date.now());

  if (isExpired) {
    return {
      eligible: false,
      reason: 'SUBSCRIPTION_EXPIRED',
      tier: candidateTier,
      expiresAt: sub.expiresAt || null,
      status: 'EXPIRED',
      message: 'Your VIP subscription has expired.'
    };
  }

  // 6. Cancellation & Inactive status check
  const isExplicitlyActive = sub.active === true || subStatus === 'ACTIVE';
  if (!isExplicitlyActive || ['CANCELLED', 'INACTIVE', 'TERMINATED'].includes(subStatus)) {
    return {
      eligible: false,
      reason: 'SUBSCRIPTION_INACTIVE',
      tier: candidateTier,
      status: subStatus || 'INACTIVE',
      message: 'Your VIP subscription is not currently active.'
    };
  }

  // 7. Tier / Plan Eligibility Verification
  if (!VIP_ELIGIBLE_TIERS.includes(candidateTier)) {
    return {
      eligible: false,
      reason: 'TIER_INELIGIBLE',
      tier: candidateTier,
      status: subStatus || 'ACTIVE',
      message: 'Your current subscription plan does not include VIP Telegram channel access.'
    };
  }

  // Entitlement Confirmed
  return {
    eligible: true,
    tier: candidateTier,
    planName: sub.name || `${candidateTier.toUpperCase()} VIP Pass`,
    expiresAt: sub.expiresAt || null,
    status: 'ACTIVE',
    reason: 'ACTIVE_ENTITLED_PLAN'
  };
}

/**
 * Checks the user's real-time membership in the private VIP Telegram channel.
 * 
 * @param {object} env - Cloudflare Pages environment
 * @param {string|number} telegramUserId - Authoritative linked Telegram user ID
 * @returns {Promise<{ isMember: boolean, membershipStatus: string, details?: object, error?: string }>}
 */
export async function getVipMembership(env, telegramUserId) {
  const vipChannelId = env && env.TELEGRAM_VIP_CHANNEL_ID;
  if (!vipChannelId) {
    return {
      isMember: false,
      membershipStatus: 'unconfigured',
      error: 'TELEGRAM_VIP_CHANNEL_ID is not configured in environment.'
    };
  }

  if (!telegramUserId) {
    return {
      isMember: false,
      membershipStatus: 'not_linked',
      error: 'No Telegram user ID provided.'
    };
  }

  try {
    const memberRes = await getChatMember(env, vipChannelId, telegramUserId);

    if (memberRes.success && memberRes.result) {
      const status = (memberRes.result.status || '').toLowerCase(); // 'creator', 'administrator', 'member', 'restricted', 'left', 'kicked'
      const isMember = ['creator', 'administrator', 'member', 'restricted'].includes(status);

      return {
        isMember,
        membershipStatus: status,
        details: {
          status,
          untilDate: memberRes.result.until_date || null
        }
      };
    } else {
      const err = (memberRes.error || '').toLowerCase();
      // Telegram returns "USER_NOT_PARTICIPANT" or similar when user has never joined or left
      if (err.includes('user not found') || err.includes('not participant') || err.includes('chat not found') || err.includes('bad request')) {
        return {
          isMember: false,
          membershipStatus: 'not_member',
          details: null
        };
      }

      return {
        isMember: false,
        membershipStatus: 'unknown',
        error: memberRes.error || 'Failed to inspect Telegram membership.'
      };
    }
  } catch (err) {
    return {
      isMember: false,
      membershipStatus: 'error',
      error: err.message
    };
  }
}

/**
 * Generates or reuses a single-use private invite link for an entitled user.
 * Prevents unnecessary multiple active link generation (idempotent).
 * 
 * @param {object} env - Cloudflare Pages environment
 * @param {object} user - Authoritative user record (must have eligible subscription & linked Telegram)
 * @returns {Promise<{ success: boolean, inviteUrl?: string, expiresAt?: string, reused?: boolean, error?: string }>}
 */
export async function getOrCreateVipInvite(env, user) {
  const vipChannelId = env && env.TELEGRAM_VIP_CHANNEL_ID;
  if (!vipChannelId) {
    return {
      success: false,
      error: 'VIP channel configuration error: TELEGRAM_VIP_CHANNEL_ID missing.'
    };
  }

  // 1. Deduplication: Check if user already holds a valid, unexpired invite
  const existing = user.vipInvite;
  if (existing && existing.inviteLink && existing.expiresAt) {
    const expiresTimestamp = new Date(existing.expiresAt).getTime();
    // If the existing invite is still valid for at least 5 minutes, reuse it
    if (expiresTimestamp > Date.now() + 300000) {
      await logVipAuditEvent(env, {
        action: 'VIP_INVITE_REUSED',
        userId: user.id,
        telegramUserId: user.telegram ? user.telegram.id : null,
        subscriptionState: user.subscription,
        result: 'SUCCESS',
        reasonCode: 'REUSED_EXISTING_INVITE',
        details: { expiresAt: existing.expiresAt }
      });

      return {
        success: true,
        inviteUrl: existing.inviteLink,
        expiresAt: new Date(expiresTimestamp).toISOString(),
        reused: true
      };
    }
  }

  // 2. Generate a new single-use, 24-hour expiring invite link
  const TTL_SECONDS = 86400; // 24 hours
  const expireDateUnix = Math.floor(Date.now() / 1000) + TTL_SECONDS;
  const inviteName = `DP-VIP-${String(user.id || 'usr').substring(0, 16)}`;

  const createRes = await createInviteLink(env, vipChannelId, {
    name: inviteName,
    expireDate: expireDateUnix,
    memberLimit: 1
  });

  if (createRes.success && createRes.result && createRes.result.invite_link) {
    const inviteLink = createRes.result.invite_link;
    const expiresAtIso = new Date(expireDateUnix * 1000).toISOString();

    // Associate invite with the user record
    user.vipInvite = {
      inviteLink,
      expiresAt: expiresAtIso,
      createdAt: new Date().toISOString()
    };

    await logVipAuditEvent(env, {
      action: 'VIP_INVITE_CREATED',
      userId: user.id,
      telegramUserId: user.telegram ? user.telegram.id : null,
      subscriptionState: user.subscription,
      result: 'SUCCESS',
      reasonCode: 'NEW_INVITE_GENERATED',
      details: { expiresAt: expiresAtIso, memberLimit: 1 }
    });

    return {
      success: true,
      inviteUrl: inviteLink,
      expiresAt: expiresAtIso,
      reused: false
    };
  } else {
    await logVipAuditEvent(env, {
      action: 'VIP_INVITE_FAILED',
      userId: user.id,
      telegramUserId: user.telegram ? user.telegram.id : null,
      subscriptionState: user.subscription,
      result: 'FAILED',
      reasonCode: 'TELEGRAM_API_ERROR',
      details: { error: createRes.error }
    });

    return {
      success: false,
      error: createRes.error || 'Failed to generate VIP channel invite link.'
    };
  }
}

/**
 * Server-controlled revocation of VIP Telegram access.
 * Performs real-time subscription entitlement check before taking any destructive action.
 * 
 * @param {object} env - Cloudflare Pages environment
 * @param {object} user - User record
 * @param {string} reason - Revocation reason
 * @returns {Promise<{ success: boolean, message?: string, error?: string }>}
 */
export async function revokeVipAccess(env, user, reason = 'SUBSCRIPTION_TERMINATED') {
  if (!user) return { success: false, error: 'User record required.' };

  // SAFETY CHECK: Verify entitlement immediately prior to destructive action
  const entitlement = isVipEligible(user);
  if (entitlement.eligible) {
    return {
      success: false,
      error: 'Safety guard: Cannot revoke VIP access for an actively entitled subscriber.'
    };
  }

  const vipChannelId = env && env.TELEGRAM_VIP_CHANNEL_ID;
  let inviteRevoked = false;
  let memberRemoved = false;

  // 1. Revoke any pending invite link
  if (user.vipInvite && user.vipInvite.inviteLink && vipChannelId) {
    try {
      await revokeInviteLink(env, vipChannelId, user.vipInvite.inviteLink);
      inviteRevoked = true;
    } catch (e) {}
    delete user.vipInvite;
  }

  // 2. Remove member from Telegram channel if linked
  if (user.telegram && user.telegram.id && vipChannelId) {
    try {
      const kickRes = await removeChatMember(env, vipChannelId, user.telegram.id);
      if (kickRes.success) memberRemoved = true;
    } catch (e) {}
  }

  await logVipAuditEvent(env, {
    action: 'VIP_ACCESS_REVOKED',
    userId: user.id,
    telegramUserId: user.telegram ? user.telegram.id : null,
    subscriptionState: user.subscription,
    result: 'SUCCESS',
    reasonCode: reason,
    details: { inviteRevoked, memberRemoved }
  });

  return {
    success: true,
    message: 'VIP access revoked successfully.',
    inviteRevoked,
    memberRemoved
  };
}
