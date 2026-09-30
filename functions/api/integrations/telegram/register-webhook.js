/**
 * Cloudflare Pages Function: /api/integrations/telegram/register-webhook
 * 
 * Secure Server-Side Telegram Webhook Registration & Management
 * Reads TELEGRAM_BOT_TOKEN and TELEGRAM_WEBHOOK_SECRET strictly from context.env.
 * 
 * Methods:
 * - POST: Authoritatively registers https://deeppredictbet.com/api/integrations/telegram/webhook with Telegram
 * - GET: Retrieves real-time webhook status via getWebhookInfo
 * - DELETE: Safely unregisters/drops the webhook if resetting
 * 
 * SECURITY MANDATES:
 * - Admin authentication strictly enforced via Authorization header.
 * - Insecure query parameters (?adminKey=...) are strictly rejected.
 * - Never returns, logs, or exposes TELEGRAM_BOT_TOKEN or secret values.
 * - Server-to-server TLS connection directly with api.telegram.org.
 */

import { setWebhook, getWebhookInfo, deleteWebhook } from './_telegramService.js';
import { verifyAdminAuthorization, adminCorsHeaders } from './_adminAuth.js';

const DEFAULT_WEBHOOK_URL = 'https://deeppredictbet.com/api/integrations/telegram/webhook';

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: adminCorsHeaders() });
}

/**
 * POST /api/integrations/telegram/register-webhook
 * Server-side execution of Telegram setWebhook method
 */
export async function onRequestPost(context) {
  const { request, env } = context;

  // 1. Authoritative Administrator Authorization Gate
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

  // 2. Verify TELEGRAM_BOT_TOKEN presence in server environment
  if (!env || !env.TELEGRAM_BOT_TOKEN || typeof env.TELEGRAM_BOT_TOKEN !== 'string' || !env.TELEGRAM_BOT_TOKEN.trim()) {
    return new Response(JSON.stringify({
      success: false,
      error: 'TELEGRAM_BOT_TOKEN secret is not configured in the Cloudflare Pages environment.'
    }), {
      status: 400,
      headers: adminCorsHeaders()
    });
  }

  try {
    let body = {};
    try {
      body = await request.json();
    } catch (e) {
      body = {};
    }

    // Default to authoritative production webhook URL unless explicitly overridden for staging
    const webhookUrl = (body.webhookUrl || body.url || DEFAULT_WEBHOOK_URL).trim();

    // Call setWebhook server-side (incorporates env.TELEGRAM_WEBHOOK_SECRET automatically)
    const result = await setWebhook(env, webhookUrl, {
      dropPendingUpdates: body.dropPendingUpdates !== undefined ? !!body.dropPendingUpdates : false
    });

    if (result.success) {
      return new Response(JSON.stringify({
        success: true,
        webhookUrl: webhookUrl,
        message: 'Telegram webhook registered successfully.',
        hasSecretToken: !!(env.TELEGRAM_WEBHOOK_SECRET),
        timestamp: new Date().toISOString()
      }), {
        status: 200,
        headers: adminCorsHeaders()
      });
    } else {
      return new Response(JSON.stringify({
        success: false,
        error: result.error || 'Failed to register webhook with Telegram.',
        webhookUrl: webhookUrl,
        timestamp: new Date().toISOString()
      }), {
        status: 400,
        headers: adminCorsHeaders()
      });
    }
  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: err.message
    }), {
      status: 500,
      headers: adminCorsHeaders()
    });
  }
}

/**
 * GET /api/integrations/telegram/register-webhook
 * Safe Webhook Diagnostic Status (calls Telegram getWebhookInfo)
 */
export async function onRequestGet(context) {
  const { env } = context;

  // 1. Authoritative Administrator Authorization Gate
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

  // 2. Query Telegram getWebhookInfo server-side
  try {
    const res = await getWebhookInfo(env);

    if (res.success && res.result) {
      const info = res.result;
      return new Response(JSON.stringify({
        success: true,
        webhookUrl: info.url || 'Not configured',
        pendingUpdateCount: info.pending_update_count || 0,
        hasCustomCertificate: !!info.has_custom_certificate,
        lastErrorDate: info.last_error_date ? new Date(info.last_error_date * 1000).toISOString() : null,
        lastErrorMessage: info.last_error_message || null,
        maxConnections: info.max_connections || 40,
        allowedUpdates: info.allowed_updates || [],
        hasWebhookSecret: !!(env && env.TELEGRAM_WEBHOOK_SECRET),
        timestamp: new Date().toISOString()
      }), {
        status: 200,
        headers: adminCorsHeaders()
      });
    } else {
      return new Response(JSON.stringify({
        success: false,
        error: res.error || 'Could not retrieve webhook information from Telegram.',
        configured: res.configured,
        timestamp: new Date().toISOString()
      }), {
        status: 400,
        headers: adminCorsHeaders()
      });
    }
  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: err.message
    }), {
      status: 500,
      headers: adminCorsHeaders()
    });
  }
}

/**
 * DELETE /api/integrations/telegram/register-webhook
 * Safely unregisters/deletes the webhook on Telegram servers
 */
export async function onRequestDelete(context) {
  const { env } = context;

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

  try {
    const result = await deleteWebhook(env);

    if (result.success) {
      return new Response(JSON.stringify({
        success: true,
        message: 'Telegram webhook deleted successfully.',
        timestamp: new Date().toISOString()
      }), {
        status: 200,
        headers: adminCorsHeaders()
      });
    } else {
      return new Response(JSON.stringify({
        success: false,
        error: result.error || 'Failed to delete webhook.'
      }), {
        status: 400,
        headers: adminCorsHeaders()
      });
    }
  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: err.message
    }), {
      status: 500,
      headers: adminCorsHeaders()
    });
  }
}
