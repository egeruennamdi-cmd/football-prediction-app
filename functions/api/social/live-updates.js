/**
 * Cloudflare Pages Function: /api/social/live-updates
 * 
 * DeepPredictBet Live Match Update Publisher & Auto-Pilot Engine
 * Supports manual live updates dispatch, real-time match events inspection,
 * auto-pilot background polling, per-channel deduplication, and emergency stop.
 * 
 * Protected by Administrator Authorization Headers or secure CRON_SECRET.
 */

import { verifyAdminAuthorization, adminCorsHeaders } from '../integrations/telegram/_adminAuth.js';
import {
  getLiveUpdatesConfig,
  saveLiveUpdatesConfig,
  checkLiveEventDeduplication,
  recordLiveUpdateDispatch,
  getLiveUpdateDispatchHistory,
  validateSocialContentFacts,
  SOCIAL_CONTENT_CATEGORIES
} from './_socialKv.js';
import {
  getSocialAccountsHealth,
  dispatchTelegram,
  dispatchX,
  dispatchFacebook,
  dispatchInstagram,
  dispatchYouTube,
  dispatchTikTok,
  stripHtmlForSocial
} from './_socialAdapters.js';

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: adminCorsHeaders() });
}

/**
 * Validates request authorization:
 * Accepts valid admin session token OR secure CRON_SECRET for background tasks.
 */
async function verifyRequestAuth(context) {
  const { request, env } = context;

  // 1. Check CRON_SECRET header for background execution
  const cronSecret = request.headers.get('x-cron-secret');
  if (cronSecret && ((env && env.CRON_SECRET && cronSecret === env.CRON_SECRET) || (env && env.ADMIN_SECRET_KEY && cronSecret === env.ADMIN_SECRET_KEY))) {
    return { authorized: true, user: { email: 'cron@deeppredictbet.com', role: 'admin' }, isCron: true };
  }

  // 2. Fall back to standard Admin Authorization
  return await verifyAdminAuthorization(context);
}

/**
 * GET /api/social/live-updates
 * Returns:
 * - Current auto-pilot config & emergency stop status
 * - Connected accounts health
 * - Recent live dispatch history
 * - Optional: Live fixtures / single fixture events
 */
export async function onRequestGet(context) {
  const { env, request } = context;

  const auth = await verifyRequestAuth(context);
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
    const url = new URL(request.url);
    const fixtureId = url.searchParams.get('fixtureId') || url.searchParams.get('id');
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);

    const [config, accounts, history] = await Promise.all([
      getLiveUpdatesConfig(env),
      getSocialAccountsHealth(env),
      getLiveUpdateDispatchHistory(env, limit)
    ]);

    let fixtureData = null;
    if (fixtureId) {
      // Query single fixture details if requested
      const activeApiKey = (env && (env.FOOTBALL_API_KEY || env.API_FOOTBALL_KEY)) || '2a68951288bede4261ef3365fa11f2c8';
      try {
        const res = await fetch(`https://v3.football.api-sports.io/fixtures?id=${fixtureId}`, {
          headers: {
            'x-apisports-key': activeApiKey,
            'User-Agent': 'DeepPredictBet/1.0',
            'Accept': 'application/json'
          }
        });
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json.response) && json.response[0]) {
            fixtureData = json.response[0];
          }
        }
      } catch (e) {
        console.warn('[LiveUpdates] Failed to fetch external fixture data:', e.message);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      timestamp: new Date().toISOString(),
      config,
      accounts,
      history,
      fixtureData
    }), {
      status: 200,
      headers: adminCorsHeaders()
    });
  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: `Failed to retrieve live updates state: ${err.message}`
    }), {
      status: 500,
      headers: adminCorsHeaders()
    });
  }
}

/**
 * POST /api/social/live-updates
 * Handles:
 * - DISPATCH_EVENT: Manually publish live update to selected connected channels
 * - UPDATE_CONFIG: Update auto-pilot settings and allowed events
 * - EMERGENCY_STOP: Immediate kill-switch for auto-pilot
 * - POLL_AND_AUTO_DISPATCH: Scheduled execution endpoint for background auto-pilot
 */
export async function onRequestPost(context) {
  const { env, request } = context;

  const auth = await verifyRequestAuth(context);
  if (!auth.authorized) {
    return new Response(JSON.stringify({
      success: false,
      error: auth.error || 'Forbidden: Administrator privileges required.'
    }), {
      status: auth.statusCode || 403,
      headers: adminCorsHeaders()
    });
  }

  const userEmail = (auth.user && auth.user.email) || 'admin@deeppredictbet.com';

  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return new Response(JSON.stringify({ success: false, error: 'Invalid JSON request body.' }), {
        status: 400,
        headers: adminCorsHeaders()
      });
    }

    const { action = 'DISPATCH_EVENT' } = body;

    // ------------------------------------------------------------------------
    // 1. ACTION: UPDATE_CONFIG
    // ------------------------------------------------------------------------
    if (action === 'UPDATE_CONFIG') {
      const { config: newConfig } = body;
      if (!newConfig || typeof newConfig !== 'object') {
        return new Response(JSON.stringify({ success: false, error: 'Missing config payload.' }), {
          status: 400,
          headers: adminCorsHeaders()
        });
      }

      const updated = await saveLiveUpdatesConfig(env, newConfig, userEmail);
      return new Response(JSON.stringify({
        success: true,
        message: 'Live updates configuration successfully saved.',
        config: updated
      }), {
        status: 200,
        headers: adminCorsHeaders()
      });
    }

    // ------------------------------------------------------------------------
    // 2. ACTION: EMERGENCY_STOP
    // ------------------------------------------------------------------------
    if (action === 'EMERGENCY_STOP') {
      const updated = await saveLiveUpdatesConfig(env, {
        autoPilotEnabled: false,
        emergencyStop: true
      }, userEmail);

      return new Response(JSON.stringify({
        success: true,
        message: 'EMERGENCY STOP ACTIVATED: Auto-pilot publishing has been halted immediately.',
        config: updated
      }), {
        status: 200,
        headers: adminCorsHeaders()
      });
    }

    // ------------------------------------------------------------------------
    // 3. ACTION: DISPATCH_EVENT (Manual Live Update Publish)
    // ------------------------------------------------------------------------
    if (action === 'DISPATCH_EVENT' || action === 'PUBLISH_NOW') {
      const {
        fixtureId,
        competition = 'Football',
        homeTeam,
        awayTeam,
        homeScore = 0,
        awayScore = 0,
        minute = '',
        status = 'LIVE',
        eventType = 'GOAL',
        eventId = null,
        eventDescription = '',
        copy,
        mediaUrl = null,
        channels = {},
        forceDuplicate = false
      } = body;

      if (!fixtureId || !homeTeam || !awayTeam) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Missing required match parameters (fixtureId, homeTeam, awayTeam).'
        }), {
          status: 400,
          headers: adminCorsHeaders()
        });
      }

      // Check factual validation
      const contentItem = {
        category: SOCIAL_CONTENT_CATEGORIES.LIVE_MATCH_UPDATE,
        matchId: String(fixtureId),
        sourceLineage: {
          competition,
          homeTeam,
          awayTeam,
          homeScore,
          awayScore,
          minute,
          status,
          eventType,
          eventId
        },
        platforms: {}
      };

      // Determine target channels
      const targetChannels = Array.isArray(channels)
        ? channels
        : Object.keys(channels).filter(c => channels[c]);

      if (targetChannels.length === 0) {
        return new Response(JSON.stringify({
          success: false,
          error: 'No target channels selected for live match dispatch.'
        }), {
          status: 400,
          headers: adminCorsHeaders()
        });
      }

      targetChannels.forEach(c => {
        contentItem.platforms[c] = {
          enabled: true,
          copy: copy || '',
          mediaUrl
        };
      });

      const validation = validateSocialContentFacts(contentItem);
      if (!validation.valid) {
        return new Response(JSON.stringify({
          success: false,
          error: `FACTUAL_VALIDATION_FAILED: ${validation.errors.join('; ')}`,
          validationErrors: validation.errors
        }), {
          status: 400,
          headers: adminCorsHeaders()
        });
      }

      const scoreStr = `${homeScore}-${awayScore}`;
      const platformResults = {};
      let anySuccess = false;

      for (const ch of targetChannels) {
        // Deduplication check
        if (!forceDuplicate) {
          const isDuplicate = await checkLiveEventDeduplication(env, fixtureId, eventId, eventType, ch);
          if (isDuplicate) {
            platformResults[ch] = {
              status: 'DUPLICATE_REJECTED',
              message: `Identical live event (${eventType}) was already dispatched to ${ch} for match ${fixtureId}.`
            };
            continue;
          }
        }

        // Format channel-specific payload
        const rawCopy = copy || '';
        const resolvedVideoUrl = body.videoUrl || (mediaUrl && (/\.(mp4|mov|webm|m4v)(\?.*)?$/i.test(mediaUrl) || mediaUrl.startsWith('data:video/')) ? mediaUrl : null);
        const payload = {
          copy: rawCopy,
          text: rawCopy,
          mediaUrl,
          photoUrl: !resolvedVideoUrl ? mediaUrl : undefined,
          videoUrl: resolvedVideoUrl || undefined,
          mediaType: resolvedVideoUrl ? 'VIDEO' : (mediaUrl ? 'IMAGE' : undefined),
          title: `⚽ ${competition}: ${homeTeam} ${scoreStr} ${awayTeam} (${minute || status})`,
          target: 'free'
        };

        let result = null;
        switch (ch) {
          case 'telegram':
            result = await dispatchTelegram(env, payload);
            break;
          case 'x':
            result = await dispatchX(env, payload);
            break;
          case 'facebook':
            result = await dispatchFacebook(env, payload);
            break;
          case 'instagram':
            result = await dispatchInstagram(env, payload);
            break;
          case 'youtube':
            result = await dispatchYouTube(env, payload);
            break;
          case 'tiktok':
            result = await dispatchTikTok(env, payload);
            break;
          default:
            result = { status: 'FAILED', error: `Unsupported platform channel "${ch}".` };
        }

        platformResults[ch] = result;

        if (result.status === 'SUCCESS') {
          anySuccess = true;
          // Record deduplication and history
          await recordLiveUpdateDispatch(env, {
            fixtureId: String(fixtureId),
            eventId,
            eventType,
            channel: ch,
            publishedUrl: result.publishedUrl || null,
            status: result.status,
            copy,
            homeTeam,
            awayTeam,
            score: scoreStr
          });
        } else if (result.status === 'MANUAL_REQUIRED') {
          // Record manual payload in history as MANUAL_REQUIRED
          await recordLiveUpdateDispatch(env, {
            fixtureId: String(fixtureId),
            eventId,
            eventType,
            channel: ch,
            status: 'MANUAL_REQUIRED',
            copy,
            homeTeam,
            awayTeam,
            score: scoreStr
          });
        }
      }

      return new Response(JSON.stringify({
        success: anySuccess || Object.values(platformResults).some(r => r.status === 'MANUAL_REQUIRED'),
        dispatchedAt: new Date().toISOString(),
        fixtureId,
        eventType,
        platformResults
      }), {
        status: 200,
        headers: adminCorsHeaders()
      });
    }

    // ------------------------------------------------------------------------
    // 4. ACTION: POLL_AND_AUTO_DISPATCH (Background execution for Auto-Pilot)
    // ------------------------------------------------------------------------
    if (action === 'POLL_AND_AUTO_DISPATCH') {
      const config = await getLiveUpdatesConfig(env);

      if (!config.autoPilotEnabled) {
        return new Response(JSON.stringify({
          success: true,
          message: 'Auto-pilot is disabled.',
          dispatchedCount: 0
        }), {
          status: 200,
          headers: adminCorsHeaders()
        });
      }

      if (config.emergencyStop) {
        return new Response(JSON.stringify({
          success: true,
          message: 'EMERGENCY STOP is currently active. Auto-pilot is paused.',
          dispatchedCount: 0
        }), {
          status: 200,
          headers: adminCorsHeaders()
        });
      }

      // Fetch active live fixtures
      const activeApiKey = (env && (env.FOOTBALL_API_KEY || env.API_FOOTBALL_KEY)) || '2a68951288bede4261ef3365fa11f2c8';
      let liveFixtures = [];

      try {
        const resLive = await fetch('https://v3.football.api-sports.io/fixtures?live=all', {
          headers: {
            'x-apisports-key': activeApiKey,
            'User-Agent': 'DeepPredictBet/1.0',
            'Accept': 'application/json'
          }
        });
        if (resLive.ok) {
          const jsonLive = await resLive.json();
          if (Array.isArray(jsonLive.response)) {
            liveFixtures = jsonLive.response;
          }
        }
      } catch (err) {
        console.warn('[LiveUpdates Auto-Pilot] Live fetch error:', err.message);
      }

      const enabledChannels = Object.keys(config.enabledChannels || {}).filter(c => config.enabledChannels[c]);
      const allowedEvents = config.allowedEventTypes || {};

      let totalDispatched = 0;
      const dispatchLog = [];

      for (const item of liveFixtures) {
        const fId = item.fixture?.id;
        if (!fId) continue;

        const homeTeam = item.teams?.home?.name || 'Home';
        const awayTeam = item.teams?.away?.name || 'Away';
        const homeScore = item.goals?.home ?? 0;
        const awayScore = item.goals?.away ?? 0;
        const elapsed = item.fixture?.status?.elapsed || '';
        const statusShort = item.fixture?.status?.short || '';
        const competition = item.league?.name || 'League';
        const events = Array.isArray(item.events) ? item.events : [];

        // 1. Process match-level status transitions (Half-Time & Full-Time)
        if (statusShort === 'HT' && allowedEvents.HALF_TIME) {
          for (const ch of enabledChannels) {
            const isDup = await checkLiveEventDeduplication(env, fId, null, 'HALF_TIME', ch);
            if (!isDup) {
              const copy = `⏸️ HALF-TIME: ${competition}\n\n${homeTeam} ${homeScore} – ${awayScore} ${awayTeam}\n45' First-half concluded.\n\n📊 Live probabilities & in-play tactical data: https://deeppredictbet.com`;
              const payload = { copy, text: copy, target: 'free' };
              let res = null;
              if (ch === 'telegram') res = await dispatchTelegram(env, payload);
              else if (ch === 'x') res = await dispatchX(env, payload);
              if (res && res.status === 'SUCCESS') {
                totalDispatched++;
                await recordLiveUpdateDispatch(env, {
                  fixtureId: String(fId),
                  eventType: 'HALF_TIME',
                  channel: ch,
                  publishedUrl: res.publishedUrl,
                  status: res.status,
                  copy,
                  homeTeam,
                  awayTeam,
                  score: `${homeScore}-${awayScore}`
                });
                dispatchLog.push({ fixtureId: fId, event: 'HALF_TIME', channel: ch });
              }
            }
          }
        }

        if ((statusShort === 'FT' || statusShort === 'AET') && allowedEvents.FULL_TIME) {
          for (const ch of enabledChannels) {
            const isDup = await checkLiveEventDeduplication(env, fId, null, 'FULL_TIME', ch);
            if (!isDup) {
              const copy = `🏁 FULL-TIME RESULT: ${competition}\n\n${homeTeam} ${homeScore} – ${awayScore} ${awayTeam}\nFinal whistle confirmed.\n\n📈 Post-match stats & AI debrief: https://deeppredictbet.com`;
              const payload = { copy, text: copy, target: 'free' };
              let res = null;
              if (ch === 'telegram') res = await dispatchTelegram(env, payload);
              else if (ch === 'x') res = await dispatchX(env, payload);
              if (res && res.status === 'SUCCESS') {
                totalDispatched++;
                await recordLiveUpdateDispatch(env, {
                  fixtureId: String(fId),
                  eventType: 'FULL_TIME',
                  channel: ch,
                  publishedUrl: res.publishedUrl,
                  status: res.status,
                  copy,
                  homeTeam,
                  awayTeam,
                  score: `${homeScore}-${awayScore}`
                });
                dispatchLog.push({ fixtureId: fId, event: 'FULL_TIME', channel: ch });
              }
            }
          }
        }

        // 2. Process timeline events (Goals, Red Cards, Penalties)
        for (const ev of events) {
          const evType = (ev.type || '').toLowerCase();
          const evDetail = (ev.detail || '').toLowerCase();
          const evTime = ev.time?.elapsed || elapsed;
          const evPlayer = ev.player?.name || '';
          const evTeam = ev.team?.name || '';
          const evKey = `ev_${evTime}_${ev.team?.id || ''}_${ev.player?.id || ''}_${evType}`;

          let canonicalType = null;
          let headline = '';

          if (evType === 'goal' && allowedEvents.GOAL) {
            canonicalType = 'GOAL';
            headline = `⚽ GOAL! ${competition}\n\n${homeTeam} ${homeScore} – ${awayScore} ${awayTeam}\n⏱️ ${evTime}' ${evPlayer ? `${evPlayer} (${evTeam})` : evTeam}\n\n🔴 Follow live updates: https://deeppredictbet.com`;
          } else if (evType === 'card' && evDetail.includes('red') && allowedEvents.RED_CARD) {
            canonicalType = 'RED_CARD';
            headline = `🟥 RED CARD! ${competition}\n\n${homeTeam} ${homeScore} – ${awayScore} ${awayTeam}\n⏱️ ${evTime}' ${evPlayer ? `${evPlayer} (${evTeam})` : `${evTeam} dismissal`}\n\n🔴 Tactical shifts live: https://deeppredictbet.com`;
          } else if (evDetail.includes('penalty') && allowedEvents.PENALTY) {
            canonicalType = 'PENALTY';
            headline = `⚠️ PENALTY: ${competition}\n\n${homeTeam} ${homeScore} – ${awayScore} ${awayTeam}\n⏱️ ${evTime}' Penalty awarded to ${evTeam}.\n\nhttps://deeppredictbet.com`;
          }

          if (canonicalType) {
            for (const ch of enabledChannels) {
              const isDup = await checkLiveEventDeduplication(env, fId, evKey, canonicalType, ch);
              if (!isDup) {
                const payload = { copy: headline, text: headline, target: 'free' };
                let res = null;
                if (ch === 'telegram') res = await dispatchTelegram(env, payload);
                else if (ch === 'x') res = await dispatchX(env, payload);
                if (res && res.status === 'SUCCESS') {
                  totalDispatched++;
                  await recordLiveUpdateDispatch(env, {
                    fixtureId: String(fId),
                    eventId: evKey,
                    eventType: canonicalType,
                    channel: ch,
                    publishedUrl: res.publishedUrl,
                    status: res.status,
                    copy: headline,
                    homeTeam,
                    awayTeam,
                    score: `${homeScore}-${awayScore}`
                  });
                  dispatchLog.push({ fixtureId: fId, event: canonicalType, eventKey: evKey, channel: ch });
                }
              }
            }
          }
        }
      }

      // Update last poll timestamp in config
      await saveLiveUpdatesConfig(env, {
        lastPollTimestamp: new Date().toISOString()
      }, 'cron@deeppredictbet.com');

      return new Response(JSON.stringify({
        success: true,
        timestamp: new Date().toISOString(),
        scannedMatches: liveFixtures.length,
        dispatchedCount: totalDispatched,
        dispatchLog
      }), {
        status: 200,
        headers: adminCorsHeaders()
      });
    }

    return new Response(JSON.stringify({ success: false, error: `Unrecognized action "${action}".` }), {
      status: 400,
      headers: adminCorsHeaders()
    });

  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: `Live updates dispatch error: ${err.message}`
    }), {
      status: 500,
      headers: adminCorsHeaders()
    });
  }
}
