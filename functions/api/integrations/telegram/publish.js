/**
 * Cloudflare Pages Function: POST /api/integrations/telegram/publish
 * 
 * Secure Broadcast Endpoint for Banker Signals & Community Intelligence
 * Protected strictly by Administrator Authorization Headers
 */

import { publishToFreeChannel, publishToVipChannel, sendUserNotification, sendPhoto } from './_telegramService.js';
import { verifyAdminAuthorization, adminCorsHeaders } from './_adminAuth.js';
import {
  getMembers,
  savePublishHistory,
  getPublishHistory,
  checkDuplicatePublish,
  computeContentFingerprint,
  getDrafts,
  saveDraft,
  deleteDraft,
  getSchedules,
  saveSchedule,
  deleteSchedule,
  getRecipes,
  saveRecipe,
  deleteRecipe,
  getAutomationRules,
  saveAutomationRule
} from './_kvHelper.js';

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: adminCorsHeaders() });
}

/**
 * GET /api/integrations/telegram/publish
 * Returns publication history, linked users, drafts, schedules, recipes & automation rules
 */
export async function onRequestGet(context) {
  const { env } = context;

  // Authoritative Admin Privilege Gate
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
    const history = await getPublishHistory(env, 50);
    const members = await getMembers(env);
    const drafts = await getDrafts(env);
    const schedules = await getSchedules(env);
    const recipes = await getRecipes(env);
    const automationRules = await getAutomationRules(env);

    const linkedUsers = (members || [])
      .filter(m => m && m.telegram && m.telegram.id)
      .map(m => ({
        id: m.id,
        email: m.email || '',
        username: m.username || '',
        fullName: m.fullName || '',
        telegramId: m.telegram.id,
        telegramUsername: m.telegram.username || '',
        tier: m.role === 'ADMIN' ? 'ADMIN' : ((m.subscription && m.subscription.active) ? 'VIP' : (m.role || 'USER'))
      }));

    return new Response(JSON.stringify({
      success: true,
      history,
      linkedUsers,
      totalLinked: linkedUsers.length,
      drafts,
      schedules,
      recipes,
      automationRules
    }), {
      status: 200,
      headers: adminCorsHeaders()
    });
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

    const action = (body.action || 'publish').toLowerCase().trim();

    // --- COMMAND CENTER ACTION: DRAFTS ---
    if (action === 'draft' || action === 'save_draft') {
      const draft = await saveDraft(env, body.draft || body);
      return new Response(JSON.stringify({ success: true, draft }), {
        status: 200,
        headers: adminCorsHeaders()
      });
    }

    if (action === 'delete_draft') {
      await deleteDraft(env, body.draftId || body.id);
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: adminCorsHeaders()
      });
    }

    // --- COMMAND CENTER ACTION: SCHEDULES ---
    if (action === 'schedule' || action === 'save_schedule') {
      const scheduledAt = body.scheduledAt;
      if (!scheduledAt) {
        return new Response(JSON.stringify({ success: false, error: 'scheduledAt is required.' }), {
          status: 400,
          headers: adminCorsHeaders()
        });
      }
      const schedTime = new Date(scheduledAt).getTime();
      if (isNaN(schedTime) || schedTime <= Date.now()) {
        return new Response(JSON.stringify({ success: false, error: 'Scheduled time must be in the future.' }), {
          status: 400,
          headers: adminCorsHeaders()
        });
      }
      const schedule = await saveSchedule(env, body.schedule || body);
      return new Response(JSON.stringify({ success: true, schedule }), {
        status: 200,
        headers: adminCorsHeaders()
      });
    }

    if (action === 'cancel_schedule' || action === 'delete_schedule') {
      await deleteSchedule(env, body.scheduleId || body.id);
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: adminCorsHeaders()
      });
    }

    // --- COMMAND CENTER ACTION: RECIPES ---
    if (action === 'save_recipe') {
      const recipe = await saveRecipe(env, body.recipe || body);
      return new Response(JSON.stringify({ success: true, recipe }), {
        status: 200,
        headers: adminCorsHeaders()
      });
    }

    if (action === 'delete_recipe') {
      await deleteRecipe(env, body.recipeId || body.id);
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: adminCorsHeaders()
      });
    }

    // --- COMMAND CENTER ACTION: AUTOMATION RULES ---
    if (action === 'save_automation_rule') {
      const rule = await saveAutomationRule(env, body.rule || body);
      return new Response(JSON.stringify({ success: true, rule }), {
        status: 200,
        headers: adminCorsHeaders()
      });
    }

    // --- COMMAND CENTER ACTION: AUTOMATION SIMULATION ---
    if (action === 'simulate_automation') {
      const rule = body.rule || {};
      const candidateMatches = Array.isArray(body.matches) ? body.matches : [];
      const threshold = parseFloat(rule.threshold || 75);
      const minConsensus = parseInt(rule.minConsensus || 3, 10);

      // Simulation evaluation without dispatching any messages
      const simulatedMatches = candidateMatches.filter(m => {
        const conf = m.confidenceVal || (m.confidence === 'high' ? 85 : 70);
        return conf >= threshold;
      });

      return new Response(JSON.stringify({
        success: true,
        simulation: {
          ruleName: rule.name || 'Unnamed Rule',
          evaluatedCount: candidateMatches.length,
          qualifyingCount: simulatedMatches.length,
          qualifyingMatches: simulatedMatches.map(m => ({
            id: m.id,
            home: m.homeTeam?.name || m.home,
            away: m.awayTeam?.name || m.away,
            league: m.league,
            confidenceVal: m.confidenceVal || 80
          })),
          wouldPublish: simulatedMatches.length > 0,
          simulatedDestination: rule.destination || 'vip'
        }
      }), {
        status: 200,
        headers: adminCorsHeaders()
      });
    }

    // --- STANDARD IMMEDIATE PUBLISHING FLOW ---
    const target = (body.target || 'free').toLowerCase(); // 'free', 'vip', 'user'
    const text = (body.text || body.message || '').trim();
    const photoUrl = (body.photoUrl || '').trim();
    const postType = (body.postType || 'Custom Post').trim();
    const forceDuplicate = !!body.forceDuplicate;

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

    // 2. Duplicate Publication Detection
    const fingerprint = await computeContentFingerprint(target, text, photoUrl);
    if (!forceDuplicate) {
      const duplicate = await checkDuplicatePublish(env, fingerprint, 24 * 60 * 60 * 1000);
      if (duplicate) {
        return new Response(JSON.stringify({
          success: false,
          duplicateDetected: true,
          previousPublishedAt: duplicate.dispatchedAt,
          previousMessageId: duplicate.telegramMessageId,
          message: `Duplicate content detected: This exact message was already published to ${target.toUpperCase()} on ${new Date(duplicate.dispatchedAt).toLocaleString()}.`
        }), {
          status: 409,
          headers: adminCorsHeaders()
        });
      }
    }

    // 3. Prepare Rich Message Options
    const options = {
      parseMode: 'HTML',
      photoUrl: photoUrl || undefined
    };

    if (Array.isArray(body.buttons) && body.buttons.length > 0) {
      const validButtons = body.buttons.filter(b => b && b.text && b.url).map(b => ({
        text: String(b.text).trim(),
        url: String(b.url).trim()
      }));
      if (validButtons.length > 0) {
        options.replyMarkup = {
          inline_keyboard: [validButtons]
        };
      }
    } else if (body.replyMarkup) {
      options.replyMarkup = body.replyMarkup;
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
        result = await sendPhoto(env, telegramUserId, photoUrl, text, options);
      } else {
        result = await sendUserNotification(env, telegramUserId, text, options);
      }
    } else if (target === 'vip') {
      result = await publishToVipChannel(env, text, options);
    } else {
      // Default: Free Channel
      result = await publishToFreeChannel(env, text, options);
    }

    const adminAuthor = (auth.user && (auth.user.username || auth.user.email)) || 'Admin';

    if (result.success) {
      const messageId = result.result ? result.result.message_id : null;
      const dispatchedAt = new Date().toISOString();

      // Record in KV Publish History
      try {
        await savePublishHistory(env, {
          target,
          postType,
          text,
          photoUrl: photoUrl || null,
          buttons: options.replyMarkup ? options.replyMarkup.inline_keyboard : null,
          telegramMessageId: messageId,
          status: 'SUCCESS',
          recipient: target === 'user' ? telegramUserId : null,
          author: adminAuthor,
          fingerprint,
          dispatchedAt
        });
      } catch (histErr) {
        console.warn('[TelegramPublish] History record write error:', histErr.message);
      }

      return new Response(JSON.stringify({
        success: true,
        target,
        postType,
        messageId,
        dispatchedAt
      }), {
        status: 200,
        headers: adminCorsHeaders()
      });
    } else {
      // Record failed publication in KV history for operational tracking
      try {
        await savePublishHistory(env, {
          target,
          postType,
          text,
          photoUrl: photoUrl || null,
          buttons: options.replyMarkup ? options.replyMarkup.inline_keyboard : null,
          status: 'FAILED',
          recipient: target === 'user' ? telegramUserId : null,
          author: adminAuthor,
          fingerprint
        });
      } catch (e) {}

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
