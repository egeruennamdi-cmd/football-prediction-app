/**
 * Cloudflare Pages Function: POST /api/integrations/telegram/test
 * 
 * Controlled Test Message Endpoint for Administrator Diagnostics
 * Validates backend -> Telegram connectivity without publishing live betting intelligence.
 * Protected strictly by Administrator Authorization Headers.
 */

import { getBotInfo, callTelegramApi, sendMessage } from './_telegramService.js';
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

    const destinationChatId = (body.destinationChatId || body.chatId || (env && env.TELEGRAM_FREE_CHANNEL_ID) || '@DeepPredictBetFree').trim();
    const verifyOnly = Boolean(body.verifyOnly);
    const customMessage = (body.message || '').trim() || [
      '⚽ <b>DeepPredictBet Telegram Integration Test</b>',
      '',
      '✅ Free Channel connection successful.',
      '',
      'This is a technical connection test. No betting prediction is contained in this message.'
    ].join('\n');

    // 1. Verify Bot Identity (getMe)
    const botRes = await getBotInfo(env);
    if (!botRes.success || !botRes.result) {
      return new Response(JSON.stringify({
        success: false,
        stage: 'BOT_INFO',
        error: botRes.error || 'Failed to authenticate bot with Telegram API.'
      }), {
        status: 400,
        headers: adminCorsHeaders()
      });
    }

    const botId = botRes.result.id;
    const botUsername = botRes.result.username;

    // 2. Step 1: Verify destination with Telegram getChat
    const chatRes = await callTelegramApi(env, 'getChat', { chat_id: destinationChatId });
    if (!chatRes.success || !chatRes.result) {
      return new Response(JSON.stringify({
        success: false,
        stage: 'GET_CHAT',
        destinationChatId,
        botUsername,
        error: chatRes.error || 'getChat failed: destination not found or inaccessible.',
        getChatResult: null
      }), {
        status: 400,
        headers: adminCorsHeaders()
      });
    }

    const chatInfo = {
      id: chatRes.result.id,
      title: chatRes.result.title,
      type: chatRes.result.type,
      username: chatRes.result.username ? `@${chatRes.result.username}` : null
    };

    // 3. Step 2: Verify that bot has permission to post (getChatMember)
    const memberRes = await callTelegramApi(env, 'getChatMember', {
      chat_id: destinationChatId,
      user_id: botId
    });

    if (!memberRes.success || !memberRes.result) {
      return new Response(JSON.stringify({
        success: false,
        stage: 'GET_CHAT_MEMBER',
        destinationChatId,
        chatInfo,
        botUsername,
        error: memberRes.error || 'Failed to inspect bot permissions in destination chat.',
        memberResult: null
      }), {
        status: 400,
        headers: adminCorsHeaders()
      });
    }

    const memberStatus = memberRes.result.status; // 'creator', 'administrator', 'member', 'restricted', 'left', 'kicked'
    const isAdministrator = memberStatus === 'administrator' || memberStatus === 'creator';
    const canPost = memberStatus === 'creator' || (memberRes.result.can_post_messages !== undefined ? !!memberRes.result.can_post_messages : true);

    if (!isAdministrator) {
      return new Response(JSON.stringify({
        success: false,
        stage: 'VERIFY_PERMISSIONS',
        destinationChatId,
        chatInfo,
        botUsername,
        memberStatus,
        canPostMessages: false,
        error: `Bot is not an administrator in ${destinationChatId}. Current status: ${memberStatus}. Please add @${botUsername} as an administrator.`
      }), {
        status: 400,
        headers: adminCorsHeaders()
      });
    }

    if (!canPost) {
      return new Response(JSON.stringify({
        success: false,
        stage: 'VERIFY_PERMISSIONS',
        destinationChatId,
        chatInfo,
        botUsername,
        memberStatus,
        canPostMessages: false,
        error: `Bot is an administrator but lacks "can_post_messages" permission in ${destinationChatId}. Please enable "Post Messages" permission in channel settings.`
      }), {
        status: 400,
        headers: adminCorsHeaders()
      });
    }

    // If caller requested verifyOnly, return verification without posting
    if (verifyOnly) {
      return new Response(JSON.stringify({
        success: true,
        stage: 'VERIFIED_READY',
        destinationChatId,
        chatInfo,
        botUsername,
        memberStatus,
        canPostMessages: true,
        messageAccepted: false,
        message: 'Destination and bot posting permissions verified successfully.'
      }), {
        status: 200,
        headers: adminCorsHeaders()
      });
    }

    // 4. Step 3: If both checks pass, send the harmless connection-test message
    const sendRes = await sendMessage(env, destinationChatId, customMessage);

    if (sendRes.success && sendRes.result) {
      return new Response(JSON.stringify({
        success: true,
        destinationChatId,
        chatInfo,
        botUsername,
        memberStatus,
        canPostMessages: true,
        messageAccepted: true,
        messageId: sendRes.result.message_id,
        telegramResponse: 'SUCCESS',
        message: 'Test message transmitted successfully to Telegram.',
        dispatchedAt: new Date().toISOString()
      }), {
        status: 200,
        headers: adminCorsHeaders()
      });
    } else {
      return new Response(JSON.stringify({
        success: false,
        stage: 'SEND_MESSAGE',
        destinationChatId,
        chatInfo,
        botUsername,
        memberStatus,
        canPostMessages: true,
        messageAccepted: false,
        error: sendRes.error || 'Failed to dispatch test message to destination.'
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
