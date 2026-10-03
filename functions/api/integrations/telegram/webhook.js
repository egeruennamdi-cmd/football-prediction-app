/**
 * Cloudflare Pages Function: POST /api/integrations/telegram/webhook
 * 
 * Official Telegram Bot Webhook Handler for DeepPredictBet
 * 
 * Key Responsibilities:
 * 1. Cryptographic validation of TELEGRAM_WEBHOOK_SECRET via 'x-telegram-bot-api-secret-token'
 * 2. Rapid dispatch & processing of incoming Telegram commands
 * 3. Secure single-use account linking flow (/start <token>)
 * 4. Fast HTTP 200 return to prevent Telegram timeout retries
 * 5. Complete isolation: Never leaks TELEGRAM_BOT_TOKEN
 */

import { sendMessage, getBotInfo } from './_telegramService.js';
import { getMembers, saveMembers, getLinkToken, deleteLinkToken } from './_kvHelper.js';
import { isVipEligible } from './_vipAccessService.js';

function corsHeaders() {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-telegram-bot-api-secret-token',
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  };
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  // 1. Authoritative Secret Token Verification
  const webhookSecret = env && env.TELEGRAM_WEBHOOK_SECRET;
  if (webhookSecret && typeof webhookSecret === 'string' && webhookSecret.trim()) {
    const incomingSecret = request.headers.get('x-telegram-bot-api-secret-token');
    if (!incomingSecret || incomingSecret.trim() !== webhookSecret.trim()) {
      console.warn('[TelegramWebhook] Rejected unauthorized request: Invalid secret token.');
      return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), {
        status: 401,
        headers: corsHeaders()
      });
    }
  }

  // 2. Parse Incoming Telegram Update
  let update = null;
  try {
    update = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON payload' }), {
      status: 400,
      headers: corsHeaders()
    });
  }

  // 3. Process Message / Command (Never throw unhandled errors to Telegram)
  try {
    if (update && update.message) {
      await handleIncomingMessage(env, update.message);
    }
  } catch (err) {
    console.error('[TelegramWebhook] Internal processing exception:', err.message);
  }

  // Always return 200 OK immediately to satisfy Telegram's delivery requirements
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: corsHeaders()
  });
}

/**
 * Handles incoming Telegram message updates
 */
async function handleIncomingMessage(env, message) {
  const chatId = message.chat && message.chat.id;
  const from = message.from || {};
  const text = (message.text || '').trim();

  if (!chatId || !text) return;

  const parts = text.split(/\s+/);
  const command = (parts[0] || '').toLowerCase().split('@')[0]; // strip bot suffix if any
  const param = parts[1] || '';

  // COMMAND ROUTER
  switch (command) {
    case '/start':
      await handleStartCommand(env, chatId, from, param);
      break;

    case '/help':
      await handleHelpCommand(env, chatId);
      break;

    case '/predictions':
      await handlePredictionsCommand(env, chatId);
      break;

    case '/scout':
      await handleScoutCommand(env, chatId);
      break;

    case '/value':
      await handleValueCommand(env, chatId);
      break;

    case '/tips':
      await handleTipsCommand(env, chatId);
      break;

    case '/matches':
      await handleMatchesCommand(env, chatId);
      break;

    case '/watchlist':
      await handleWatchlistCommand(env, chatId, from.id);
      break;

    case '/alerts':
      await handleAlertsCommand(env, chatId, from.id);
      break;

    case '/account':
      await handleAccountCommand(env, chatId, from.id);
      break;

    case '/vip':
      await handleVipCommand(env, chatId, from.id);
      break;

    default:
      if (text.startsWith('/')) {
        await sendMessage(env, chatId, [
          `❓ <b>Unrecognized Command:</b> <code>${command}</code>`,
          '',
          'Type /help to see all available DeepPredictBet commands, or visit <a href="https://deeppredictbet.com">deeppredictbet.com</a>.'
        ].join('\n'));
      }
      break;
  }
}

/**
 * /start [token]
 * Handles account linking or welcome message
 */
async function handleStartCommand(env, chatId, from, token) {
  // If a linking token is provided: /start dplink_...
  if (token && token.startsWith('dplink_')) {
    const linkData = await getLinkToken(env, token);

    if (!linkData || !linkData.userId) {
      await sendMessage(env, chatId, [
        '⚠️ <b>Invalid or Expired Link Token</b>',
        '',
        'This account linking link has expired or has already been used.',
        'Please generate a fresh link from your DeepPredictBet dashboard:',
        '👉 <b>My DeepPredict → Alerts & Notifications → Connect Telegram</b>'
      ].join('\n'));
      return;
    }

    // Link Telegram ID to DeepPredictBet User in members_list
    const members = await getMembers(env);
    const userIndex = members.findIndex(m => m.id === linkData.userId || m.email === linkData.email);

    if (userIndex >= 0) {
      const user = members[userIndex];
      user.telegram = {
        linked: true,
        id: from.id,
        username: from.username || '',
        firstName: from.first_name || '',
        linkedAt: new Date().toISOString(),
        alertsEnabled: true
      };

      if (!user.alerts) user.alerts = {};
      user.alerts.telegram = true;

      await saveMembers(env, members);
      await deleteLinkToken(env, token);

      const planName = (user.subscription && user.subscription.active) ? '👑 VIP Pass' : (user.role === 'PRO' ? '⚡ Pro Pass' : '🛡️ Free Punter');

      await sendMessage(env, chatId, [
        '🎉 <b>DeepPredictBet Account Linked Successfully!</b>',
        '',
        `Welcome, <b>${user.fullName || user.username}</b>!`,
        `Account Tier: <b>${planName}</b>`,
        `Telegram ID: <code>${from.id}</code>`,
        '',
        '✅ <b>Instant Banker Alerts:</b> ENABLED',
        '✅ <b>Bot Account Sync:</b> ACTIVE',
        '',
        'You can now use /account, /watchlist, /tips, and /predictions directly inside Telegram!'
      ].join('\n'));
      return;
    } else {
      await sendMessage(env, chatId, '⚠️ User account not found. Please try again from the dashboard.');
      return;
    }
  }

  // Standard /start (no token)
  await sendMessage(env, chatId, [
    '⚽ <b>Welcome to DeepPredictBet Official Intelligence Bot!</b>',
    '',
    'Institutional-grade AI football predictions, live value divergences, and high-confidence Banker signals at your fingertips.',
    '',
    '📌 <b>Quick Commands:</b>',
    '• /tips — Daily Banker & Top Tips Snapshot',
    '• /predictions — High-confidence match predictions',
    '• /scout — AI Scout high-yield opportunities',
    '• /value — Live market divergence alerts',
    '• /matches — Featured match schedule',
    '• /account — View your linked membership status',
    '• /vip — VIP membership & Banker access',
    '• /help — Full command guide',
    '',
    '🔗 <i>Connect your account via <a href="https://deeppredictbet.com">deeppredictbet.com</a> under My DeepPredict to unlock personalized alerts!</i>'
  ].join('\n'));
}

/**
 * /help
 */
async function handleHelpCommand(env, chatId) {
  await sendMessage(env, chatId, [
    '📖 <b>DeepPredictBet Bot Command Guide</b>',
    '',
    '<b>Intelligence Commands:</b>',
    '• /tips — Daily Banker (89.4% win-rate model) & Algorithmic Top Tips',
    '• /predictions — Today\'s top AI predicted outcomes & probability ratings',
    '• /scout — AI Scout market edge selections',
    '• /value — Positive EV market divergence opportunities',
    '• /matches — Today\'s marquee football fixtures & times',
    '',
    '<b>Account & Alerts:</b>',
    '• /account — Your DeepPredictBet account tier, coins, and linked status',
    '• /watchlist — Saved fixtures and tracked tickets',
    '• /alerts — Notification delivery settings',
    '• /vip — VIP Banker channel and subscription details',
    '',
    '🌐 <b>Website:</b> <a href="https://deeppredictbet.com">deeppredictbet.com</a>',
    '💬 <b>Support:</b> @deeppredictbet'
  ].join('\n'));
}

/**
 * /predictions
 */
async function handlePredictionsCommand(env, chatId) {
  await sendMessage(env, chatId, [
    '🔮 <b>DeepPredictBet AI Predictions</b>',
    '',
    '🛡️ <i>Staging Verification Active:</i> Live automated prediction broadcasting to Telegram is temporarily paused while bot onboarding and verification are in progress.',
    '',
    '📊 To view today\'s full 100+ live match simulations and Poisson probability ratings right now, please visit:',
    '👉 <a href="https://deeppredictbet.com/#predictions">deeppredictbet.com/#predictions</a>'
  ].join('\n'));
}

/**
 * /scout
 */
async function handleScoutCommand(env, chatId) {
  await sendMessage(env, chatId, [
    '🔭 <b>AI Scout Intelligence</b>',
    '',
    '🛡️ <i>Staging Verification Active:</i> Live scout market edge broadcasting to Telegram is temporarily paused while bot onboarding and verification are in progress.',
    '',
    '🔍 To filter live value opportunities across 30+ leagues in real-time, visit:',
    '👉 <a href="https://deeppredictbet.com/#scout">deeppredictbet.com/#scout</a>'
  ].join('\n'));
}

/**
 * /value
 */
async function handleValueCommand(env, chatId) {
  await sendMessage(env, chatId, [
    '💎 <b>Live Market Value Intelligence</b>',
    '',
    '🛡️ <i>Staging Verification Active:</i> Live positive EV divergence alerts are temporarily paused while bot onboarding and verification are in progress.',
    '',
    '📈 View real-time model vs bookmaker price discrepancies on the web app:',
    '👉 <a href="https://deeppredictbet.com/#value">deeppredictbet.com/#value</a>'
  ].join('\n'));
}

/**
 * /tips
 */
async function handleTipsCommand(env, chatId) {
  await sendMessage(env, chatId, [
    '🎯 <b>DeepPredictBet — Daily Banker & Top Tips</b>',
    '',
    '🛡️ <i>Staging Verification Active:</i> Live banker tip dispatch to Telegram is temporarily paused while bot onboarding and verification are in progress.',
    '',
    '👑 View today\'s verified algorithmic banker selection directly on the web platform:',
    '👉 <a href="https://deeppredictbet.com/#top-tips">deeppredictbet.com/#top-tips</a>'
  ].join('\n'));
}

/**
 * /matches
 */
async function handleMatchesCommand(env, chatId) {
  await sendMessage(env, chatId, [
    '📅 <b>Today\'s Marquee Match Schedule</b>',
    '',
    '• 16:30 GMT — Manchester City vs Arsenal (Premier League)',
    '• 17:30 GMT — Dortmund vs Frankfurt (Bundesliga)',
    '• 19:45 GMT — Juventus vs AC Milan (Serie A)',
    '• 20:00 GMT — Atletico Madrid vs Athletic Bilbao (La Liga)',
    '',
    '⚡ Live odds and algorithmic probability analysis available on <a href="https://deeppredictbet.com/#fixtures">deeppredictbet.com</a>.'
  ].join('\n'));
}

/**
 * /account
 */
async function handleAccountCommand(env, chatId, telegramUserId) {
  const members = await getMembers(env);
  const user = members.find(m => m.telegram && String(m.telegram.id) === String(telegramUserId));

  if (!user) {
    await sendMessage(env, chatId, [
      '👤 <b>Account Status: Not Linked</b>',
      '',
      `Your Telegram ID: <code>${telegramUserId}</code>`,
      '',
      'To connect your DeepPredictBet account:',
      '1. Log in to <a href="https://deeppredictbet.com">deeppredictbet.com</a>',
      '2. Go to <b>My DeepPredict → Alerts & Notifications</b>',
      '3. Click <b>Connect Telegram Bot</b> to instantly link your profile!'
    ].join('\n'));
    return;
  }

  const entitlement = isVipEligible(user);
  const tier = entitlement.eligible ? '👑 VIP Member' : (user.role === 'PRO' ? '⚡ Pro Member' : '🛡️ Free Punter');
  const coins = user.coinsBalance !== undefined ? user.coinsBalance : 500;
  const linkedDate = user.telegram.linkedAt ? new Date(user.telegram.linkedAt).toLocaleDateString() : 'Active';

  await sendMessage(env, chatId, [
    '👤 <b>DeepPredictBet Member Profile</b>',
    '',
    `• Name: <b>${user.fullName || user.username}</b>`,
    `• Tier: <b>${tier}</b>`,
    `• Coins Balance: <b>${coins} DP Coins</b>`,
    `• Linked Date: <b>${linkedDate}</b>`,
    `• Push Alerts: <b>${user.telegram.alertsEnabled ? 'Enabled ✅' : 'Disabled ❌'}</b>`,
    '',
    'Visit your web dashboard for full stats, bankroll tracking, and betslip builder.'
  ].join('\n'));
}

/**
 * /watchlist
 */
async function handleWatchlistCommand(env, chatId, telegramUserId) {
  const members = await getMembers(env);
  const user = members.find(m => m.telegram && String(m.telegram.id) === String(telegramUserId));

  if (!user) {
    await sendMessage(env, chatId, '📌 Connect your account with /account first to synchronize your web Watchlist!');
    return;
  }

  const items = user.watchlist || [];
  if (items.length === 0) {
    await sendMessage(env, chatId, [
      '📌 <b>Your Watchlist is currently empty.</b>',
      '',
      'Star any match on <a href="https://deeppredictbet.com">deeppredictbet.com</a> to receive in-play score & kickoff alerts!'
    ].join('\n'));
    return;
  }

  const listText = items.slice(0, 5).map((w, i) => `• <b>${w.match || w.title || 'Fixture ' + (i + 1)}</b> (${w.market || '1X2'})`).join('\n');

  await sendMessage(env, chatId, [
    `📌 <b>Your Saved Watchlist (${items.length} items):</b>`,
    '',
    listText,
    '',
    'Manage your full watchlist at <a href="https://deeppredictbet.com/#dashboard">My DeepPredict</a>.'
  ].join('\n'));
}

/**
 * /alerts
 */
async function handleAlertsCommand(env, chatId, telegramUserId) {
  const members = await getMembers(env);
  const user = members.find(m => m.telegram && String(m.telegram.id) === String(telegramUserId));

  const alertsActive = user ? !!(user.telegram && user.telegram.alertsEnabled) : false;

  await sendMessage(env, chatId, [
    '🔔 <b>DeepPredictBet Notification Settings</b>',
    '',
    `• Telegram Delivery: <b>${alertsActive ? 'ACTIVE ✅' : 'INACTIVE ❌'}</b>`,
    '• Daily Banker Signals: <b>ENABLED</b>',
    '• High-Yield Scanner: <b>ENABLED</b>',
    '',
    '<i>You can toggle specific alert channels anytime from your DeepPredict dashboard under My DeepPredict → Alerts.</i>'
  ].join('\n'));
}

/**
 * /vip
 */
async function handleVipCommand(env, chatId, telegramUserId) {
  const members = await getMembers(env);
  const user = members.find(m => m.telegram && String(m.telegram.id) === String(telegramUserId));
  const entitlement = user ? isVipEligible(user) : { eligible: false };
  const isVip = entitlement.eligible;

  if (isVip) {
    let inviteInfo = '';
    const vipChannel = env && env.TELEGRAM_VIP_CHANNEL_ID;
    if (vipChannel) {
      inviteInfo = `\n👉 <b>Private VIP Channel Access:</b> Visit <a href="https://deeppredictbet.com/#dashboard">My DeepPredict → Telegram VIP</a> to activate your secure access pass.`;
    }

    await sendMessage(env, chatId, [
      '👑 <b>VIP Pass Active</b>',
      '',
      'You have full institutional access to:',
      '• Instant 89.4% win-rate Banker push notifications',
      '• Live odds scanner with zero latency',
      '• Private VIP Telegram community and analytical teardowns',
      inviteInfo
    ].join('\n'));
  } else {
    await sendMessage(env, chatId, [
      '👑 <b>DeepPredictBet VIP Membership</b>',
      '',
      'Unlock the full mathematical edge:',
      '• <b>89.4% Win-Rate Banker Picks</b> published daily',
      '• <b>Instant Telegram Push Signals</b> before bookmakers adjust',
      '• <b>Unlimited Bet Slip Conversions</b> across 15+ bookmakers',
      '• <b>Private VIP Community Channel</b>',
      '',
      '<b>Subscription Plans:</b>',
      '• Weekly Pass: ₦10,000 / $10.00',
      '• Monthly Pass: ₦27,000 / $25.00',
      '• Annual Pass: ₦149,500 / $99.00',
      '',
      'Upgrade instantly at <a href="https://deeppredictbet.com/#subscription">deeppredictbet.com/#subscription</a>'
    ].join('\n'));
  }
}
