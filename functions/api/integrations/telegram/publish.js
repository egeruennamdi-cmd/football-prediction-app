/**
 * Cloudflare Pages Function: POST /api/integrations/telegram/publish
 * 
 * Secure Broadcast Endpoint for Banker Signals & Community Intelligence
 * Protected strictly by Administrator Authorization Headers
 */

import { publishToFreeChannel, publishToVipChannel, sendUserNotification, sendPhoto } from './_telegramService.js';
import { verifyAdminAuthorization, adminCorsHeaders } from './_adminAuth.js';

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: adminCorsHeaders() });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  // 1. Authoritative Admin Privilege Gate
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

    const target = (body.target || 'free').toLowerCase(); // 'free', 'vip', 'user'
    const text = (body.text || body.message || '').trim();
    const photoUrl = (body.photoUrl || '').trim();
    const telegramUserId = (body.telegramUserId || body.chatId || '').trim();

    if (!text && !photoUrl) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Message text or photoUrl is required.'
      }), {
        status: 400,
        headers: adminCorsHeaders()
      });
    }

    let result;
    if (photoUrl && target === 'user' && telegramUserId) {
      result = await sendPhoto(env, telegramUserId, photoUrl, text);
    } else if (target === 'vip') {
      result = await publishToVipChannel(env, text);
    } else if (target === 'user') {
      if (!telegramUserId) {
        return new Response(JSON.stringify({ success: false, error: 'telegramUserId is required for user target.' }), {
          status: 400,
          headers: adminCorsHeaders()
        });
      }
      result = await sendUserNotification(env, telegramUserId, text);
    } else {
      // Default: Free Channel
      result = await publishToFreeChannel(env, text);
    }

    if (result.success) {
      return new Response(JSON.stringify({
        success: true,
        target,
        messageId: result.result ? result.result.message_id : null,
        dispatchedAt: new Date().toISOString()
      }), {
        status: 200,
        headers: adminCorsHeaders()
      });
    } else {
      return new Response(JSON.stringify({
        success: false,
        target,
        error: result.error || 'Failed to broadcast message to Telegram.'
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
