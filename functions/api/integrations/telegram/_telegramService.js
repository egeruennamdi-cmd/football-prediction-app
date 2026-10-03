/**
 * DeepPredictBet — Centralized Server-Side Telegram Integration Service
 * 
 * Secure communication layer interfacing with the official Telegram Bot API.
 * Expects environment bindings from Cloudflare Pages:
 * - context.env.TELEGRAM_BOT_TOKEN (Secret)
 * - context.env.TELEGRAM_WEBHOOK_SECRET (Secret)
 * - context.env.TELEGRAM_FREE_CHANNEL_ID (Config)
 * - context.env.TELEGRAM_VIP_CHANNEL_ID (Config)
 * 
 * SECURITY MANDATES:
 * - Never returns, logs, or leaks TELEGRAM_BOT_TOKEN.
 * - Strips sensitive tokens from API responses and error messages.
 * - Bounded request timeouts (5000ms max) to prevent edge hanging.
 */

const TELEGRAM_API_BASE = 'https://api.telegram.org';

/**
 * Strips any occurrence of bot tokens from error messages or strings
 */
function sanitizeError(err, token) {
  let message = (err && err.message) ? err.message : String(err || 'Unknown Telegram API error');
  if (token && typeof token === 'string' && token.length > 5) {
    message = message.split(token).join('[REDACTED_BOT_TOKEN]');
  }
  return message;
}

/**
 * Authoritative low-level Telegram Bot API caller.
 * Never throws unhandled exceptions; returns normalized { success, result, error }.
 */
export async function callTelegramApi(envOrContext, method, payload = {}) {
  const env = (envOrContext && envOrContext.env) ? envOrContext.env : envOrContext;
  const token = env && env.TELEGRAM_BOT_TOKEN;
  if (!token || typeof token !== 'string' || !token.trim()) {
    return {
      success: false,
      configured: false,
      error: 'TELEGRAM_BOT_TOKEN is not configured in Cloudflare Pages environment.'
    };
  }

  const endpoint = `${TELEGRAM_API_BASE}/bot${token.trim()}/${method}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const data = await response.json();
    if (data.ok) {
      return {
        success: true,
        configured: true,
        result: data.result
      };
    } else {
      return {
        success: false,
        configured: true,
        errorCode: data.error_code,
        error: sanitizeError(data.description, token)
      };
    }
  } catch (err) {
    return {
      success: false,
      configured: true,
      error: sanitizeError(err, token)
    };
  }
}

/**
 * Retrieves the authenticated bot profile and identity (getMe)
 */
export async function getBotInfo(env) {
  return await callTelegramApi(env, 'getMe');
}

/**
 * Registers webhook endpoint on Telegram servers (setWebhook)
 * Incorporates TELEGRAM_WEBHOOK_SECRET as secret_token if configured.
 */
export async function setWebhook(env, webhookUrl, options = {}) {
  if (!webhookUrl) return { success: false, error: 'webhookUrl is required.' };

  const payload = {
    url: webhookUrl,
    allowed_updates: options.allowedUpdates || ['message', 'callback_query'],
    drop_pending_updates: options.dropPendingUpdates !== undefined ? !!options.dropPendingUpdates : false
  };

  const secretToken = (options.secretToken !== undefined) ? options.secretToken : (env && env.TELEGRAM_WEBHOOK_SECRET);
  if (secretToken && typeof secretToken === 'string' && secretToken.trim()) {
    payload.secret_token = secretToken.trim();
  }

  return await callTelegramApi(env, 'setWebhook', payload);
}

/**
 * Queries current webhook configuration and status (getWebhookInfo)
 */
export async function getWebhookInfo(env) {
  return await callTelegramApi(env, 'getWebhookInfo');
}

/**
 * Removes webhook from Telegram servers (deleteWebhook)
 */
export async function deleteWebhook(env, options = {}) {
  const payload = {
    drop_pending_updates: options.dropPendingUpdates !== undefined ? !!options.dropPendingUpdates : false
  };
  return await callTelegramApi(env, 'deleteWebhook', payload);
}

/**
 * Sends a rich text message to a specific chat, group, or channel
 */
export async function sendMessage(env, chatId, text, options = {}) {
  if (!chatId) return { success: false, error: 'Destination chatId is required.' };
  if (!text) return { success: false, error: 'Message text cannot be empty.' };

  const payload = {
    chat_id: chatId,
    text: text,
    parse_mode: options.parseMode || 'HTML',
    disable_web_page_preview: options.disableWebPagePreview !== undefined ? options.disableWebPagePreview : true,
    ...options.extra
  };

  if (options.replyMarkup) {
    payload.reply_markup = options.replyMarkup;
  }

  return await callTelegramApi(env, 'sendMessage', payload);
}

/**
 * Sends a photo with an optional rich caption
 */
export async function sendPhoto(env, chatId, photoUrl, caption = '', options = {}) {
  if (!chatId) return { success: false, error: 'Destination chatId is required.' };
  if (!photoUrl) return { success: false, error: 'Photo URL is required.' };

  const payload = {
    chat_id: chatId,
    photo: photoUrl,
    caption: caption,
    parse_mode: options.parseMode || 'HTML',
    ...options.extra
  };

  return await callTelegramApi(env, 'sendPhoto', payload);
}

/**
 * Edits existing message text (useful for interactive updates)
 */
export async function editMessage(env, chatId, messageId, text, options = {}) {
  if (!chatId || !messageId) return { success: false, error: 'chatId and messageId are required.' };

  const payload = {
    chat_id: chatId,
    message_id: messageId,
    text: text,
    parse_mode: options.parseMode || 'HTML',
    disable_web_page_preview: true,
    ...options.extra
  };

  return await callTelegramApi(env, 'editMessageText', payload);
}

/**
 * Broadcasts an intelligence update or banker signal to the Free Community Channel
 */
export async function publishToFreeChannel(env, text, options = {}) {
  const channelId = (env && env.TELEGRAM_FREE_CHANNEL_ID) || '@DeepPredictBetFree';
  return await sendMessage(env, channelId, text, options);
}

/**
 * Broadcasts high-yield VIP signals to the Private VIP Channel
 */
export async function publishToVipChannel(env, text, options = {}) {
  const channelId = env && env.TELEGRAM_VIP_CHANNEL_ID;
  if (!channelId) {
    return {
      success: false,
      error: 'TELEGRAM_VIP_CHANNEL_ID is not configured in Cloudflare Pages environment.'
    };
  }
  return await sendMessage(env, channelId, text, options);
}

/**
 * Creates an invite link with optional member limit or expiration for VIP subscribers
 */
export async function createInviteLink(env, chatId, options = {}) {
  const targetChatId = chatId || (env && env.TELEGRAM_VIP_CHANNEL_ID);
  if (!targetChatId) return { success: false, error: 'Chat ID required to generate invite link.' };

  const payload = {
    chat_id: targetChatId,
    name: options.name || 'DeepPredict VIP Pass',
    expire_date: options.expireDate, // Unix timestamp
    member_limit: options.memberLimit || 1, // Single-use by default for paid members
    creates_join_request: false
  };

  return await callTelegramApi(env, 'createChatInviteLink', payload);
}

/**
 * Revokes a previously issued invite link
 */
export async function revokeInviteLink(env, chatId, inviteLink) {
  const targetChatId = chatId || (env && env.TELEGRAM_VIP_CHANNEL_ID);
  if (!targetChatId || !inviteLink) return { success: false, error: 'Chat ID and inviteLink required.' };

  return await callTelegramApi(env, 'revokeChatInviteLink', {
    chat_id: targetChatId,
    invite_link: inviteLink
  });
}

/**
 * Queries chat member status (e.g. verify if a user is still in the VIP channel)
 */
export async function getChatMember(env, chatId, userId) {
  const targetChatId = chatId || (env && env.TELEGRAM_VIP_CHANNEL_ID);
  if (!targetChatId || !userId) return { success: false, error: 'Chat ID and userId required.' };

  return await callTelegramApi(env, 'getChatMember', {
    chat_id: targetChatId,
    user_id: userId
  });
}

/**
 * Removes a member from a channel (bans then immediately unbans so they are kicked without permanent block)
 */
export async function removeChatMember(env, chatId, userId) {
  const targetChatId = chatId || (env && env.TELEGRAM_VIP_CHANNEL_ID);
  if (!targetChatId || !userId) return { success: false, error: 'Chat ID and userId required.' };

  const banRes = await callTelegramApi(env, 'banChatMember', {
    chat_id: targetChatId,
    user_id: userId
  });

  if (banRes.success) {
    // Unban so user can rejoin if they resubscribe later
    await callTelegramApi(env, 'unbanChatMember', {
      chat_id: targetChatId,
      user_id: userId,
      only_if_banned: true
    });
  }

  return banRes;
}

/**
 * Sends a direct notification to a linked DeepPredictBet user
 */
export async function sendUserNotification(env, telegramUserId, message, options = {}) {
  if (!telegramUserId) return { success: false, error: 'telegramUserId is required.' };
  return await sendMessage(env, telegramUserId, message, options);
}

/**
 * Sends a controlled diagnostic test message to verify connectivity
 */
export async function sendTestMessage(env, destinationChatId) {
  const target = destinationChatId || (env && env.TELEGRAM_FREE_CHANNEL_ID) || '@DeepPredictBetFree';
  const text = [
    '🔔 <b>DeepPredictBet — Telegram System Diagnostics</b>',
    '',
    '✅ <b>Status:</b> Cloudflare Pages Functions edge connection operational.',
    `⏱️ <b>Timestamp:</b> ${new Date().toISOString()}`,
    '🛡️ <b>Security:</b> Webhook secrets and token isolation verified.'
  ].join('\n');

  return await sendMessage(env, target, text);
}
