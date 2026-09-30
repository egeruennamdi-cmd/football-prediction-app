/**
 * Cloudflare Pages Function: GET /api/integrations/telegram/webhook-status
 * 
 * Safe Webhook Diagnostic Status Endpoint
 * Reports Telegram getWebhookInfo metrics without exposing server secrets.
 * Gated strictly by server-side administrator authorization headers.
 */

import { getWebhookInfo } from './_telegramService.js';
import { verifyAdminAuthorization, adminCorsHeaders } from './_adminAuth.js';

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: adminCorsHeaders() });
}

export async function onRequestGet(context) {
  const { env } = context;

  // Authoritative Administrator Authorization Gate
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
    const res = await getWebhookInfo(env);

    if (res.success && res.result) {
      const info = res.result;
      return new Response(JSON.stringify({
        success: true,
        webhookUrl: info.url || 'Not registered',
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
        error: res.error || 'Unable to retrieve webhook info.',
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
