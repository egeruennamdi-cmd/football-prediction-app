/**
 * Cloudflare Pages Function: /api/analytics/track
 * Edge Ingestion & Real-Time Telemetry Aggregator
 * 
 * Strict Privacy & Security:
 * - Rejects sensitive properties (passwords, card credentials, raw booking codes, private betslips).
 * - Only records non-invasive, aggregated product telemetry to power the Founder Dashboard.
 */

const CORE_EVENTS = new Set([
  'USER_REGISTERED',
  'USER_LOGIN',
  'USER_RETURNED',
  'PREDICTION_VIEWED',
  'PREDICTION_SAVED',
  'BET_DOCTOR_STARTED',
  'BET_DOCTOR_COMPLETED',
  'TICKET_SAVED',
  'TICKET_VIEWED',
  'CONVERTER_STARTED',
  'CONVERTER_COMPLETED',
  'CONVERTER_FAILED',
  'GENERATOR_USED',
  'SCANNER_USED',
  'WATCHLIST_ADDED',
  'WATCHLIST_REMOVED',
  'ALERT_CREATED',
  'ALERT_OPENED',
  'SUBSCRIPTION_VIEWED',
  'CHECKOUT_STARTED',
  'SUBSCRIPTION_STARTED',
  'SUBSCRIPTION_CANCELLED',
  'PAYMENT_SUCCEEDED',
  'PAYMENT_FAILED'
]);

const SENSITIVE_KEY_REGEX = /pass|pwd|token|secret|auth|card|cvv|cvc|expir|booking.*code|raw.*code|ticket.*code|selection.*data|picks/i;

function corsHeaders() {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  };
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function onRequestPost(context) {
  try {
    let body = null;
    const contentType = context.request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      body = await context.request.json().catch(() => null);
    } else {
      // Handles navigator.sendBeacon (sent as text/plain or blob)
      const rawText = await context.request.text().catch(() => '');
      if (rawText) {
        try {
          body = JSON.parse(rawText);
        } catch (e) {
          body = null;
        }
      }
    }

    if (!body) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid JSON payload' }), {
        status: 400,
        headers: corsHeaders()
      });
    }

    // Normalize raw events into an array
    const rawEvents = Array.isArray(body.events) ? body.events : (body.event_name ? [body] : []);
    if (rawEvents.length === 0) {
      return new Response(JSON.stringify({ success: true, processed: 0 }), {
        status: 200,
        headers: corsHeaders()
      });
    }

    // 1. Sanitize & Filter Events
    const sanitizedEvents = [];
    for (const ev of rawEvents) {
      if (!ev || typeof ev !== 'object') continue;

      const eventName = (ev.event_name || '').toUpperCase().trim();
      if (!CORE_EVENTS.has(eventName)) continue;

      // Clean metadata
      const cleanMeta = {};
      if (ev.metadata && typeof ev.metadata === 'object') {
        for (const [k, v] of Object.entries(ev.metadata)) {
          if (SENSITIVE_KEY_REGEX.test(k)) continue;
          if (typeof v === 'string') {
            if (v.length > 100 || /^\d{13,19}$/.test(v.replace(/\s+/g, ''))) continue;
            cleanMeta[k] = v;
          } else if (typeof v === 'number' || typeof v === 'boolean') {
            cleanMeta[k] = v;
          }
        }
      }

      sanitizedEvents.push({
        event_name: eventName,
        timestamp: ev.timestamp || new Date().toISOString(),
        anonymous_id: typeof ev.anonymous_id === 'string' ? ev.anonymous_id.substring(0, 64) : null,
        session_id: typeof ev.session_id === 'string' ? ev.session_id.substring(0, 64) : null,
        user_id: typeof ev.user_id === 'string' ? ev.user_id.substring(0, 64) : null,
        plan: typeof ev.plan === 'string' ? ev.plan.toUpperCase().substring(0, 20) : 'FREE',
        tool: typeof ev.tool === 'string' ? ev.tool.toLowerCase().substring(0, 40) : 'platform',
        success: Boolean(ev.success !== false),
        metadata: cleanMeta
      });
    }

    if (sanitizedEvents.length === 0) {
      return new Response(JSON.stringify({ success: true, processed: 0 }), {
        status: 200,
        headers: corsHeaders()
      });
    }

    // 2. Fetch or initialize KV Telemetry Summary
    const KV = context.env && context.env.USERS_KV ? context.env.USERS_KV : null;
    let telemetry = null;

    if (KV) {
      try {
        const existingRaw = await KV.get('product_telemetry_v1');
        if (existingRaw) {
          telemetry = JSON.parse(existingRaw);
        }
      } catch (e) {}
    }

    if (!telemetry || typeof telemetry !== 'object') {
      telemetry = {
        initializedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        totalTrackedEvents: 0,
        events: {},
        tools: {},
        converter: { started: 0, completed: 0, failed: 0, topSourceBookies: {}, topDestBookies: {} },
        betDoctor: { started: 0, completed: 0, free: 0, paid: 0, totalHealthScore: 0, trapMatchesDetected: 0 },
        funnel: { visitors: 0, toolUsers: 0, registeredUsers: 0, activeUsers: 0, paidUsers: 0, retainedUsers: 0 }
      };
    }

    // 3. Increment Real Telemetry Counters
    for (const ev of sanitizedEvents) {
      telemetry.totalTrackedEvents = (telemetry.totalTrackedEvents || 0) + 1;
      telemetry.events[ev.event_name] = (telemetry.events[ev.event_name] || 0) + 1;

      const isPaid = ['PRO', 'VIP', 'ANNUAL', 'WEEKLY', 'MONTHLY', 'ADMIN'].includes(ev.plan);

      // Tool Invocations
      const toolId = ev.tool || 'platform';
      if (!telemetry.tools[toolId]) {
        telemetry.tools[toolId] = { total: 0, free: 0, paid: 0 };
      }
      telemetry.tools[toolId].total += 1;
      if (isPaid) telemetry.tools[toolId].paid += 1;
      else telemetry.tools[toolId].free += 1;

      // Converter
      if (ev.event_name === 'CONVERTER_STARTED') {
        telemetry.converter.started = (telemetry.converter.started || 0) + 1;
        if (ev.metadata && ev.metadata.source_bookmaker) {
          const sb = ev.metadata.source_bookmaker;
          telemetry.converter.topSourceBookies[sb] = (telemetry.converter.topSourceBookies[sb] || 0) + 1;
        }
        if (ev.metadata && ev.metadata.destination_bookmaker) {
          const db = ev.metadata.destination_bookmaker;
          telemetry.converter.topDestBookies[db] = (telemetry.converter.topDestBookies[db] || 0) + 1;
        }
      } else if (ev.event_name === 'CONVERTER_COMPLETED') {
        telemetry.converter.completed = (telemetry.converter.completed || 0) + 1;
      } else if (ev.event_name === 'CONVERTER_FAILED') {
        telemetry.converter.failed = (telemetry.converter.failed || 0) + 1;
      }

      // Bet Doctor
      if (ev.event_name === 'BET_DOCTOR_STARTED') {
        telemetry.betDoctor.started = (telemetry.betDoctor.started || 0) + 1;
      } else if (ev.event_name === 'BET_DOCTOR_COMPLETED') {
        telemetry.betDoctor.completed = (telemetry.betDoctor.completed || 0) + 1;
        if (isPaid) telemetry.betDoctor.paid += 1;
        else telemetry.betDoctor.free += 1;
        if (typeof ev.metadata?.health_score === 'number') {
          telemetry.betDoctor.totalHealthScore = (telemetry.betDoctor.totalHealthScore || 0) + ev.metadata.health_score;
        }
        if (typeof ev.metadata?.trap_matches_detected === 'number') {
          telemetry.betDoctor.trapMatchesDetected = (telemetry.betDoctor.trapMatchesDetected || 0) + ev.metadata.trap_matches_detected;
        }
      }

      // Funnel Pipeline
      if (ev.session_id) {
        // Track general visitor activity
        telemetry.funnel.visitors = (telemetry.funnel.visitors || 0) + 1;
      }
      if (['PREDICTION_VIEWED', 'BET_DOCTOR_STARTED', 'CONVERTER_STARTED', 'GENERATOR_USED', 'SCANNER_USED'].includes(ev.event_name)) {
        telemetry.funnel.toolUsers = (telemetry.funnel.toolUsers || 0) + 1;
      }
      if (ev.event_name === 'USER_REGISTERED') {
        telemetry.funnel.registeredUsers = (telemetry.funnel.registeredUsers || 0) + 1;
      }
      if (ev.event_name === 'USER_LOGIN' || (ev.user_id && ['BET_DOCTOR_STARTED', 'CONVERTER_STARTED', 'TICKET_SAVED'].includes(ev.event_name))) {
        telemetry.funnel.activeUsers = (telemetry.funnel.activeUsers || 0) + 1;
      }
      if (['PAYMENT_SUCCEEDED', 'SUBSCRIPTION_STARTED'].includes(ev.event_name)) {
        telemetry.funnel.paidUsers = (telemetry.funnel.paidUsers || 0) + 1;
      }
      if (ev.event_name === 'USER_RETURNED') {
        telemetry.funnel.retainedUsers = (telemetry.funnel.retainedUsers || 0) + 1;
      }
    }

    telemetry.lastUpdated = new Date().toISOString();

    // 4. Save to Cloudflare KV Edge
    if (KV) {
      try {
        await KV.put('product_telemetry_v1', JSON.stringify(telemetry));
      } catch (e) {}
    }

    return new Response(JSON.stringify({
      success: true,
      processed: sanitizedEvents.length,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: corsHeaders()
    });

  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: err.message
    }), {
      status: 500,
      headers: corsHeaders()
    });
  }
}
