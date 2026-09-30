/**
 * Cloudflare Pages Function: GET /api/integrations/telegram/health
 * 
 * Safe Internal / Administrator Diagnostic Health Check
 * Strictly isolates and guards server secrets:
 * - NEVER leaks TELEGRAM_BOT_TOKEN
 * - Validates administrator privileges exclusively via HTTP headers
 * - Inspects bot connectivity, webhook configuration, and channel bindings
 */

import { getBotInfo, callTelegramApi } from './_telegramService.js';
import { verifyAdminAuthorization, adminCorsHeaders } from './_adminAuth.js';

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: adminCorsHeaders() });
}

export async function onRequestGet(context) {
  const { env } = context;

  // 1. Authoritative Administrator Authorization Check
  const auth = await verifyAdminAuthorization(context);
  if (!auth.authorized) {
    return new Response(JSON.stringify({
      success: false,
      error: auth.error || 'Forbidden: Administrator privileges required.'
    }), {
      status: auth.statusCode || 403,
      headers: adminCorsHeaders()
    });
  }

  // 2. Check configuration state (without revealing secret values)
  const hasBotToken = !!(env && env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_BOT_TOKEN.trim());
  const hasWebhookSecret = !!(env && env.TELEGRAM_WEBHOOK_SECRET && env.TELEGRAM_WEBHOOK_SECRET.trim());
  const hasFreeChannel = !!(env && env.TELEGRAM_FREE_CHANNEL_ID);
  const hasVipChannel = !!(env && env.TELEGRAM_VIP_CHANNEL_ID);

  if (!hasBotToken) {
    return new Response(JSON.stringify({
      success: true,
      configured: false,
      botUsername: null,
      webhookStatus: null,
      integrationStatus: 'AWAITING_BOT_TOKEN',
      message: 'TELEGRAM_BOT_TOKEN secret is not yet configured in Cloudflare Pages.',
      checks: {
        hasBotToken: false,
        hasWebhookSecret,
        hasFreeChannel,
        hasVipChannel
      },
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: adminCorsHeaders()
    });
  }

  // 3. Inspect Live Telegram Connectivity
  let botUsername = null;
  let botFirstName = null;
  let webhookStatus = null;
  let integrationStatus = 'OPERATIONAL';

  try {
    const botInfo = await getBotInfo(env);
    if (botInfo.success && botInfo.result) {
      botUsername = botInfo.result.username;
      botFirstName = botInfo.result.first_name;
    } else {
      integrationStatus = 'BOT_AUTHENTICATION_ERROR';
    }

    const webhookRes = await callTelegramApi(env, 'getWebhookInfo');
    if (webhookRes.success && webhookRes.result) {
      webhookStatus = {
        url: webhookRes.result.url || 'Not set',
        hasCustomCertificate: !!webhookRes.result.has_custom_certificate,
        pendingUpdateCount: webhookRes.result.pending_update_count || 0,
        lastErrorDate: webhookRes.result.last_error_date ? new Date(webhookRes.result.last_error_date * 1000).toISOString() : null,
        lastErrorMessage: webhookRes.result.last_error_message || null,
        maxConnections: webhookRes.result.max_connections || 40
      };
    }
  } catch (err) {
    integrationStatus = 'DIAGNOSTIC_FETCH_ERROR';
  }

  // Safe response strictly free of tokens or secret values
  return new Response(JSON.stringify({
    success: true,
    configured: true,
    botUsername,
    botFirstName,
    webhookStatus,
    integrationStatus,
    checks: {
      hasBotToken: true,
      hasWebhookSecret,
      hasFreeChannel,
      hasVipChannel
    },
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: adminCorsHeaders()
  });
}
