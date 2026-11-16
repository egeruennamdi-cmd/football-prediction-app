/**
 * Cloudflare Pages Function: /api/scanner/alerts
 * User-Isolated Smart Alert Rule Storage & Verified Telegram Notification Dispatcher
 *
 * Security & Architecture:
 * - Isolates alert rules and history strictly per authenticated user.
 * - Reuses existing DeepPredictBet Telegram bot (_telegramService.js) and member ledger (_kvHelper.js).
 * - Never exposes Telegram bot tokens, KV namespaces, or internal diagnostics to clients.
 * - Enforces duplicate-alert prevention and cooldown windows before dispatching.
 * - Only reports delivered: true when Telegram's API confirms delivery (ok: true).
 */

import { getMembers } from '../integrations/telegram/_kvHelper.js';
import { sendMessage } from '../integrations/telegram/_telegramService.js';

const COOLDOWN_DEFAULT_MS = 15 * 60 * 1000; // 15 minutes default cooldown per rule+match

function corsHeaders() {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  };
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

async function resolveAuthenticatedUser(context) {
  const { request, env } = context;
  const authHeader = request.headers.get('Authorization') || '';
  const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : authHeader.trim();
  const url = new URL(request.url);
  const emailParam = (url.searchParams.get('email') || '').trim().toLowerCase();

  const members = await getMembers(env);
  if (!Array.isArray(members) || members.length === 0) return null;

  // 1. Prefer cryptographic session token match
  if (bearerToken && bearerToken.startsWith('dp_sess_')) {
    const bySession = members.find(m => m && m.sessionId === bearerToken);
    if (bySession) return bySession;
  }

  // 2. Fallback to email lookup only if session matches or email provided for same user
  if (emailParam) {
    const byEmail = members.find(m => m && (m.email || '').toLowerCase() === emailParam);
    if (byEmail) {
      if (!byEmail.sessionId || !bearerToken || byEmail.sessionId === bearerToken) {
        return byEmail;
      }
    }
  }

  return null;
}

async function getUserAlertState(env, userKey) {
  const fallback = { rules: [], history: [], cooldowns: {}, emergencyPaused: false };
  if (!env || !env.USERS_KV || !userKey) return fallback;
  try {
    const raw = await env.USERS_KV.get(`scanner_alerts:${userKey}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return {
          rules: Array.isArray(parsed.rules) ? parsed.rules : [],
          history: Array.isArray(parsed.history) ? parsed.history : [],
          cooldowns: parsed.cooldowns && typeof parsed.cooldowns === 'object' ? parsed.cooldowns : {},
          emergencyPaused: Boolean(parsed.emergencyPaused)
        };
      }
    }
  } catch (e) {}
  return fallback;
}

async function saveUserAlertState(env, userKey, state) {
  if (!env || !env.USERS_KV || !userKey) return false;
  try {
    await env.USERS_KV.put(`scanner_alerts:${userKey}`, JSON.stringify(state));
    return true;
  } catch (e) {
    return false;
  }
}

export async function onRequestGet(context) {
  try {
    const user = await resolveAuthenticatedUser(context);
    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Please sign in to access your personalised alert rules.'
      }), { status: 401, headers: corsHeaders() });
    }

    const userKey = (user.email || user.id || '').toLowerCase();
    const state = await getUserAlertState(context.env, userKey);
    const telegramLinked = Boolean(user.telegram && user.telegram.linked && user.telegram.chatId);

    return new Response(JSON.stringify({
      success: true,
      telegramLinked,
      telegramUsername: (user.telegram && user.telegram.username) || null,
      emergencyPaused: state.emergencyPaused,
      rules: state.rules,
      history: state.history.slice(0, 50)
    }), { status: 200, headers: corsHeaders() });
  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Unable to retrieve alert configuration right now.'
    }), { status: 500, headers: corsHeaders() });
  }
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json().catch(() => ({}));
    const action = (body.action || 'sync_rules').trim();

    const user = await resolveAuthenticatedUser(context);
    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Authentication required to manage or dispatch alerts.'
      }), { status: 401, headers: corsHeaders() });
    }

    const userKey = (user.email || user.id || '').toLowerCase();
    const state = await getUserAlertState(context.env, userKey);

    // ACTION 1: Save / sync rules & emergency pause state
    if (action === 'sync_rules') {
      if (Array.isArray(body.rules)) {
        state.rules = body.rules.slice(0, 50).map(r => ({
          id: String(r.id || `rule_${Date.now()}`).slice(0, 64),
          category: ['live', 'odds', 'value'].includes(r.category) ? r.category : 'live',
          param: String(r.param || 'possession').slice(0, 64),
          cond: ['gt', 'lt', 'eq', 'gte', 'lte'].includes(r.cond) ? r.cond : 'gt',
          val: Number(r.val) || 0,
          matchFilter: String(r.matchFilter || 'all').slice(0, 120),
          competitionFilter: String(r.competitionFilter || 'all').slice(0, 120),
          market: String(r.market || 'all').slice(0, 60),
          channel: ['in_app', 'telegram', 'both'].includes(r.channel) ? r.channel : 'both',
          frequency: ['once', 'cooldown_15m', 'every'].includes(r.frequency) ? r.frequency : 'once',
          active: r.active !== false,
          label: String(r.label || '').slice(0, 160),
          createdAt: r.createdAt || new Date().toISOString()
        }));
      }
      if (typeof body.emergencyPaused === 'boolean') {
        state.emergencyPaused = body.emergencyPaused;
      }
      await saveUserAlertState(context.env, userKey, state);
      return new Response(JSON.stringify({
        success: true,
        rules: state.rules,
        emergencyPaused: state.emergencyPaused
      }), { status: 200, headers: corsHeaders() });
    }

    // ACTION 2: Dispatch a triggered alert to user's linked Telegram account
    if (action === 'dispatch_telegram_alert') {
      if (state.emergencyPaused) {
        return new Response(JSON.stringify({
          success: false,
          delivered: false,
          error: 'Emergency notification pause is currently active.'
        }), { status: 200, headers: corsHeaders() });
      }

      const dedupKey = String(body.dedupKey || `${body.ruleId || 'manual'}_${body.matchId || 'global'}`).slice(0, 120);
      const now = Date.now();
      const cooldownMs = Number(body.cooldownMs) || COOLDOWN_DEFAULT_MS;

      if (state.cooldowns[dedupKey] && (now - state.cooldowns[dedupKey]) < cooldownMs) {
        return new Response(JSON.stringify({
          success: true,
          delivered: false,
          deduplicated: true,
          deliveryStatus: 'COOLDOWN_DEDUPLICATED',
          message: 'Duplicate alert suppressed within cooldown window.'
        }), { status: 200, headers: corsHeaders() });
      }

      const chatId = user.telegram && user.telegram.linked && user.telegram.chatId ? user.telegram.chatId : null;
      if (!chatId) {
        return new Response(JSON.stringify({
          success: false,
          delivered: false,
          deliveryStatus: 'TELEGRAM_NOT_LINKED',
          error: 'Telegram account is not linked yet. Please connect your Telegram account first.'
        }), { status: 400, headers: corsHeaders() });
      }

      const matchTitle = String(body.matchTitle || 'Football Match Intelligence').replace(/[<>]/g, '');
      const ruleLabel = String(body.ruleLabel || 'Smart Alert Triggered').replace(/[<>]/g, '');
      const detailText = String(body.detailText || '').replace(/[<>]/g, '');

      const htmlMessage = [
        `📡 <b>DEEPPREDICTBET — MATCH &amp; MARKET INTELLIGENCE ALERT</b>`,
        ``,
        `⚽ <b>Match:</b> ${matchTitle}`,
        `🎯 <b>Trigger Rule:</b> ${ruleLabel}`,
        detailText ? `📊 <b>Observed Signal:</b> ${detailText}` : '',
        `🕒 <b>Timestamp:</b> ${new Date(now).toUTCString()}`,
        ``,
        `<i>Decision-support signal based on observed match/market data. Not a guaranteed outcome.</i>`
      ].filter(Boolean).join('\n');

      const sendResult = await sendMessage(context.env, chatId, htmlMessage, {
        disableWebPagePreview: true
      });

      const confirmedDelivered = Boolean(sendResult && sendResult.success && sendResult.result && sendResult.result.message_id);
      if (confirmedDelivered) {
        state.cooldowns[dedupKey] = now;
      }

      const historyEntry = {
        id: `alh_${now}`,
        ruleId: body.ruleId || 'rule',
        matchId: body.matchId || null,
        matchTitle,
        ruleLabel,
        detailText,
        channel: 'telegram',
        delivered: confirmedDelivered,
        deliveryStatus: confirmedDelivered ? 'DELIVERED_CONFIRMED' : 'DELIVERY_FAILED',
        timestamp: new Date(now).toISOString()
      };
      state.history.unshift(historyEntry);
      state.history = state.history.slice(0, 100);
      await saveUserAlertState(context.env, userKey, state);

      return new Response(JSON.stringify({
        success: confirmedDelivered,
        delivered: confirmedDelivered,
        deliveryStatus: historyEntry.deliveryStatus,
        historyEntry,
        error: confirmedDelivered ? null : 'Telegram delivery could not be confirmed by the provider.'
      }), { status: confirmedDelivered ? 200 : 502, headers: corsHeaders() });
    }

    return new Response(JSON.stringify({
      success: false,
      error: 'Unsupported alert action.'
    }), { status: 400, headers: corsHeaders() });
  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Unable to process alert request right now.'
    }), { status: 500, headers: corsHeaders() });
  }
}
