/**
 * Cloudflare Pages Function: GET/POST /api/integrations/telegram/connection-test
 * 
 * Safe Telegram Bot Authentication & Connectivity Diagnostic
 * Tests server-side authentication with the official Telegram API using TELEGRAM_BOT_TOKEN.
 * 
 * SECURITY MANDATES:
 * - NEVER logs, returns, or displays TELEGRAM_BOT_TOKEN.
 * - Returns only safe diagnostic properties: connection status, bot name, bot username.
 */

import { getBotInfo } from './_telegramService.js';

function corsHeaders() {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  };
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function onRequest(context) {
  const { env } = context;

  // 1. Verify existence of TELEGRAM_BOT_TOKEN binding in Cloudflare Pages
  const hasToken = !!(env && env.TELEGRAM_BOT_TOKEN && typeof env.TELEGRAM_BOT_TOKEN === 'string' && env.TELEGRAM_BOT_TOKEN.trim().length > 0);

  if (!hasToken) {
    return new Response(JSON.stringify({
      telegramConnection: "FAILED",
      status: "AWAITING_SECRET",
      message: "TELEGRAM_BOT_TOKEN is not found in the Cloudflare Pages runtime environment. Please ensure the secret is saved under Pages Settings -> Variables and Secrets and that a new deployment has run.",
      botName: null,
      botUsername: null,
      authenticated: false,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: corsHeaders()
    });
  }

  // 2. Perform safe authenticated handshake with Telegram API (getMe)
  try {
    const res = await getBotInfo(env);

    if (res.success && res.result) {
      const bot = res.result;
      return new Response(JSON.stringify({
        telegramConnection: "SUCCESS",
        botName: bot.first_name || "DeepPredictBet Bot",
        botUsername: bot.username || "DeepPredictBetBot",
        botId: bot.id,
        canJoinGroups: !!bot.can_join_groups,
        canReadAllGroupMessages: !!bot.can_read_all_group_messages,
        supportsInlineQueries: !!bot.supports_inline_queries,
        authenticated: true,
        status: "Operational",
        timestamp: new Date().toISOString()
      }), {
        status: 200,
        headers: corsHeaders()
      });
    } else {
      return new Response(JSON.stringify({
        telegramConnection: "FAILED",
        status: "AUTHENTICATION_FAILED",
        message: "Telegram API rejected the token or the request failed.",
        error: res.error || "Authentication error",
        botName: null,
        botUsername: null,
        authenticated: false,
        timestamp: new Date().toISOString()
      }), {
        status: 200,
        headers: corsHeaders()
      });
    }
  } catch (err) {
    return new Response(JSON.stringify({
      telegramConnection: "FAILED",
      status: "HANDSHAKE_EXCEPTION",
      message: "Edge runtime encountered an exception during Telegram handshake.",
      botName: null,
      botUsername: null,
      authenticated: false,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: corsHeaders()
    });
  }
}
