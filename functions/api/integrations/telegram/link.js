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

import { getMembers, saveMembers, setLinkToken } from './_kvHelper.js';
import { getBotInfo } from './_telegramService.js';

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

    const userId = (body.userId || '').trim();
    const email = (body.email || '').trim().toLowerCase();

    if (!userId && !email) {
      return new Response(JSON.stringify({
        success: false,
        error: 'userId or email is required to unlink account.'
      }), {
        status: 400,
        headers: corsHeaders()
      });
    }

    const members = await getMembers(env);
    const userIndex = members.findIndex(m =>
      (userId && m.id === userId) ||
      (email && (m.email || '').toLowerCase() === email)
    );

    if (userIndex < 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'User not found'
      }), {
        status: 404,
        headers: corsHeaders()
      });
    }

    delete members[userIndex].telegram;
    if (members[userIndex].alerts) {
      members[userIndex].alerts.telegram = false;
    }

    await saveMembers(env, members);

    return new Response(JSON.stringify({
      success: true,
      message: 'Telegram account unlinked successfully.'
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
