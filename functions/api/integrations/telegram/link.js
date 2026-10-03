/**
 * Cloudflare Pages Function: /api/integrations/telegram/link
 * 
 * Account Linking Service for DeepPredictBet <-> Telegram Bot
 * 
 * Methods:
 * - POST: Generates a secure, cryptographically random, single-use linking token (15m TTL)
 * - GET: Queries the current Telegram link status of a user
 * - DELETE: Safely unlinks a Telegram account from DeepPredictBet
 */

import { getMembers, saveMembers, setLinkToken, logVipAuditEvent } from './_kvHelper.js';
import { getBotInfo, revokeInviteLink, removeChatMember, getChatMember } from './_telegramService.js';
import { verifyAdminAuthorization } from './_adminAuth.js';

function corsHeaders() {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  };
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

/**
 * POST /api/integrations/telegram/link
 * Generates single-use account linking token and deep link
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

    const userId = (body.userId || '').trim();
    const email = (body.email || '').trim().toLowerCase();
    const username = (body.username || '').trim();

    if (!userId && !email) {
      return new Response(JSON.stringify({
        success: false,
        error: 'userId or email is required to generate account linking token.'
      }), {
        status: 400,
        headers: corsHeaders()
      });
    }

    // Verify user exists in global members registry
    const members = await getMembers(env);
    const existingUser = members.find(m =>
      (userId && m.id === userId) ||
      (email && (m.email || '').toLowerCase() === email)
    );

    if (!existingUser) {
      return new Response(JSON.stringify({
        success: false,
        error: 'User account not found. Please log in first.'
      }), {
        status: 404,
        headers: corsHeaders()
      });
    }

    // Generate cryptographically secure one-time token
    let randomPart = '';
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      randomPart = crypto.randomUUID().replace(/-/g, '');
    } else {
      randomPart = Math.random().toString(36).substring(2) + Date.now().toString(36);
    }
    const linkToken = `dplink_${randomPart}`;

    // Store in KV with 15-minute expiration
    const TTL_SECONDS = 900;
    await setLinkToken(env, linkToken, {
      userId: existingUser.id,
      email: existingUser.email,
      username: existingUser.username,
      createdAt: Date.now()
    }, TTL_SECONDS);

    // Determine bot username
    let botUsername = (env && env.TELEGRAM_BOT_USERNAME) || 'DeepPredictBetBot';
    try {
      const botInfo = await getBotInfo(env);
      if (botInfo.success && botInfo.result && botInfo.result.username) {
        botUsername = botInfo.result.username;
      }
    } catch (e) {}

    const deepLink = `https://t.me/${botUsername}?start=${linkToken}`;

    return new Response(JSON.stringify({
      success: true,
      linkToken,
      botUsername,
      deepLink,
      expiresInSeconds: TTL_SECONDS
    }), {
      status: 200,
      headers: corsHeaders()
    });

  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: err.message
    }), {
      status: 500,
      headers: corsHeaders()
    });
  }
}

/**
 * GET /api/integrations/telegram/link?userId=...
 * Queries the current Telegram link status
 */
export async function onRequestGet(context) {
  const { request, env } = context;

  try {
    const url = new URL(request.url);
    const userId = (url.searchParams.get('userId') || '').trim();
    const email = (url.searchParams.get('email') || '').trim().toLowerCase();

    if (!userId && !email) {
      return new Response(JSON.stringify({
        success: false,
        error: 'userId or email parameter required'
      }), {
        status: 400,
        headers: corsHeaders()
      });
    }

    const members = await getMembers(env);
    const user = members.find(m =>
      (userId && m.id === userId) ||
      (email && (m.email || '').toLowerCase() === email)
    );

    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        error: 'User not found'
      }), {
        status: 404,
        headers: corsHeaders()
      });
    }

    const isLinked = !!(user.telegram && user.telegram.linked);

    return new Response(JSON.stringify({
      success: true,
      linked: isLinked,
      telegram: isLinked ? {
        id: user.telegram.id,
        username: user.telegram.username || '',
        firstName: user.telegram.firstName || '',
        linkedAt: user.telegram.linkedAt || '',
        alertsEnabled: !!user.telegram.alertsEnabled
      } : null
    }), {
      status: 200,
      headers: corsHeaders()
    });

  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: err.message
    }), {
      status: 500,
      headers: corsHeaders()
    });
  }
}

/**
 * DELETE /api/integrations/telegram/link
 * Unlinks Telegram account from DeepPredictBet
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

    const authHeader = request.headers.get('Authorization') || '';
    let token = '';
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    } else if (authHeader) {
      token = authHeader.trim();
    }

    const members = await getMembers(env);
    let userIndex = -1;

    // 1. Session or admin token resolution
    if (token) {
      const adminCheck = await verifyAdminAuthorization(context);
      if (adminCheck.authorized) {
        const targetId = (body.userId || '').trim();
        const targetEmail = (body.email || '').trim().toLowerCase();
        userIndex = members.findIndex(m =>
          (targetId && m.id === targetId) ||
          (targetEmail && (m.email || '').toLowerCase() === targetEmail)
        );
      } else {
        userIndex = members.findIndex(m => m.sessionId === token);
      }
    }

    // 2. Fallback to userId/email
    if (userIndex < 0) {
      const userId = (body.userId || '').trim();
      const email = (body.email || '').trim().toLowerCase();
      if (userId || email) {
        userIndex = members.findIndex(m =>
          (userId && m.id === userId) ||
          (email && (m.email || '').toLowerCase() === email)
        );
      }
    }

    if (userIndex < 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'User account not found.'
      }), {
        status: 404,
        headers: corsHeaders()
      });
    }

    const user = members[userIndex];
    // Authoritative Telegram ID strictly from KV; never trust client
    const linkedTgId = user.telegram && user.telegram.id ? user.telegram.id : null;
    const vipChannelId = env && env.TELEGRAM_VIP_CHANNEL_ID;

    let inviteRevoked = false;
    let channelMemberRemoved = false;

    // 3. Revoke any pending VIP invite link
    if (user.vipInvite && user.vipInvite.inviteLink && vipChannelId) {
      try {
        await revokeInviteLink(env, vipChannelId, user.vipInvite.inviteLink);
        inviteRevoked = true;
      } catch (e) {
        console.warn('[TelegramUnlink] Failed to revoke invite link:', e.message);
      }
      delete user.vipInvite;
    }

    // 4. Apply Access Policy: If user is inside the VIP channel, evict them upon unlinking
    // (An unlinked Telegram account cannot remain in the private VIP channel)
    if (linkedTgId && vipChannelId) {
      try {
        const memberCheck = await getChatMember(env, vipChannelId, linkedTgId);
        if (memberCheck.success && memberCheck.result) {
          const status = (memberCheck.result.status || '').toLowerCase();
          if (['member', 'restricted'].includes(status)) {
            const kickRes = await removeChatMember(env, vipChannelId, linkedTgId);
            if (kickRes.success) {
              channelMemberRemoved = true;
            }
          }
        }
      } catch (e) {
        console.warn('[TelegramUnlink] Member eviction error (non-blocking):', e.message);
      }
    }

    // 5. Authoritatively remove Telegram connection from KV
    delete user.telegram;
    if (user.alerts) {
      user.alerts.telegram = false;
    }
    members[userIndex] = user;

    await saveMembers(env, members);

    await logVipAuditEvent(env, {
      action: 'TELEGRAM_UNLINKED',
      userId: user.id,
      telegramUserId: linkedTgId,
      result: 'SUCCESS',
      details: { inviteRevoked, channelMemberRemoved }
    });

    return new Response(JSON.stringify({
      success: true,
      unlinked: true,
      message: 'Telegram account unlinked successfully.',
      inviteRevoked,
      channelMemberRemoved
    }), {
      status: 200,
      headers: corsHeaders()
    });

  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: err.message
    }), {
      status: 500,
      headers: corsHeaders()
    });
  }
}
