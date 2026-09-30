/**
 * Cloudflare Pages Function: POST /api/integrations/telegram/test
 * 
 * Controlled Test Message Endpoint for Administrator Diagnostics
 * Validates backend -> Telegram connectivity without publishing live betting intelligence.
 * Protected strictly by Administrator Authorization Headers.
 */

import { sendTestMessage, sendMessage } from './_telegramService.js';
import { verifyAdminAuthorization, adminCorsHeaders } from './_adminAuth.js';

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: adminCorsHeaders() });
}

export async function onRequestPost(context) {
  const { request, env } = context;

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

  try {
    let body = {};
    try {
      body = await request.json();
    } catch (e) {
      body = {};
    }

    const destinationChatId = (body.destinationChatId || body.chatId || '').trim();
    const customMessage = (body.message || '').trim();

    let res;
    if (customMessage && destinationChatId) {
      res = await sendMessage(env, destinationChatId, `🧪 <b>DeepPredictBet Diagnostic Test:</b>\n\n${customMessage}`);
    } else {
      res = await sendTestMessage(env, destinationChatId);
    }

    if (res.success) {
      return new Response(JSON.stringify({
        success: true,
        message: 'Test message transmitted successfully to Telegram.',
        destination: destinationChatId || 'Default channel',
        resultId: res.result ? res.result.message_id : null
      }), {
        status: 200,
        headers: adminCorsHeaders()
      });
    } else {
      return new Response(JSON.stringify({
        success: false,
        error: res.error || 'Failed to dispatch test message.',
        configured: res.configured
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
