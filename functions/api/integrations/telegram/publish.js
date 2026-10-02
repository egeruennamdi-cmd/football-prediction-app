/**
 * Cloudflare Pages Function: POST /api/integrations/telegram/publish
 * 
 * Secure Broadcast Endpoint for Banker Signals & Community Intelligence
 * Protected strictly by Administrator Authorization Headers
 */

import { publishToFreeChannel, publishToVipChannel, sendUserNotification, sendPhoto } from './_telegramService.js';
import { verifyAdminAuthorization, adminCorsHeaders } from './_adminAuth.js';
import { getMembers } from './_kvHelper.js';

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

    // Safely coerce target ID to string to prevent ".trim is not a function" on numeric IDs
    const rawTargetId = body.telegramUserId !== undefined ? body.telegramUserId : (body.chatId !== undefined ? body.chatId : '');
    let telegramUserId = String(rawTargetId || '').trim();

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
    if (target === 'user') {
      // Authoritatively resolve from server-side KV account record if userId or email is provided
      const cleanUserId = (body.userId || '').trim();
      const cleanEmail = (body.email || '').trim().toLowerCase();

      if (cleanUserId || cleanEmail || telegramUserId) {
        try {
          const members = await getMembers(env);
          const targetUser = members.find(m =>
            (cleanUserId && m.id === cleanUserId) ||
            (cleanEmail && (m.email || '').toLowerCase() === cleanEmail) ||
            (telegramUserId && m.telegram && String(m.telegram.id) === telegramUserId)
          );

          if (targetUser && targetUser.telegram && targetUser.telegram.id) {
            telegramUserId = String(targetUser.telegram.id).trim();
          }
        } catch (e) {
          console.warn('[TelegramPublish] Member lookup fallback error:', e.message);
        }
      }

      if (!telegramUserId) {
        return new Response(JSON.stringify({
          success: false,
          error: 'No linked Telegram account found for this user.'
        }), {
          status: 400,
          headers: adminCorsHeaders()
        });
      }

      if (photoUrl) {
        result = await sendPhoto(env, telegramUserId, photoUrl, text);
      } else {
        result = await sendUserNotification(env, telegramUserId, text);
      }
    } else if (target === 'vip') {
      result = await publishToVipChannel(env, text);
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
