/**
 * DEEPPREDICTBET — SERVER-SIDE MATCH & MARKET INTELLIGENCE ENDPOINT
 * Provides server-side cached odds snapshot persistence (`scanner_odds_snapshots_v1` in KV),
 * market movement ledger sync, and provider feed freshness metadata.
 */

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-User-Email, X-Session-Token',
  'Cache-Control': 'public, max-age=15'
};

const SNAPSHOT_KV_KEY = 'scanner_odds_snapshots_v1';

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const kv = env.AUTH_STORE || env.DEEPPREDICT_KV || env.USERS_KV;
  const url = new URL(request.url);
  const matchKey = url.searchParams.get('matchKey') || '';

  let ledger = {};
  if (kv) {
    try {
      const raw = await kv.get(SNAPSHOT_KV_KEY);
      if (raw) ledger = JSON.parse(raw);
    } catch (e) {
      ledger = {};
    }
  }

  if (matchKey) {
    return new Response(JSON.stringify({
      ok: true,
      matchKey,
      entry: ledger[matchKey] || null,
      feedStatus: {
        provider: 'API-Sports v3 + DeepPredict Calibrated Poisson-DC Engine',
        liveRefreshSec: 30,
        preMatchRefreshSec: 300,
        timestamp: new Date().toISOString()
      }
    }), { status: 200, headers: CORS_HEADERS });
  }

  return new Response(JSON.stringify({
    ok: true,
    snapshotCount: Object.keys(ledger).length,
    snapshots: ledger,
    feedStatus: {
      provider: 'API-Sports v3 + DeepPredict Calibrated Poisson-DC Engine',
      liveRefreshSec: 30,
      preMatchRefreshSec: 300,
      timestamp: new Date().toISOString()
    }
  }), { status: 200, headers: CORS_HEADERS });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const kv = env.AUTH_STORE || env.DEEPPREDICT_KV || env.USERS_KV;

  let body = {};
  try {
    body = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({
      ok: false,
      error: 'Invalid JSON request body.'
    }), { status: 400, headers: CORS_HEADERS });
  }

  const snapshots = body.snapshots && typeof body.snapshots === 'object' ? body.snapshots : {};
  let ledger = {};
  if (kv) {
    try {
      const raw = await kv.get(SNAPSHOT_KV_KEY);
      if (raw) ledger = JSON.parse(raw);
    } catch (e) {
      ledger = {};
    }
  }

  const nowIso = new Date().toISOString();
  let updatedCount = 0;

  for (const [key, incoming] of Object.entries(snapshots)) {
    if (!key || !incoming || typeof incoming !== 'object') continue;
    if (!ledger[key]) {
      ledger[key] = {
        matchTitle: String(incoming.matchTitle || key).slice(0, 140),
        opening: incoming.opening || incoming.current || {},
        previous: incoming.previous || incoming.current || {},
        current: incoming.current || {},
        high: incoming.high || incoming.current || {},
        low: incoming.low || incoming.current || {},
        openingAt: incoming.openingAt || nowIso,
        updatedAt: nowIso
      };
      updatedCount++;
    } else {
      const entry = ledger[key];
      const curr = incoming.current || {};
      ['homeWin', 'draw', 'awayWin', 'over25', 'under25', 'bttsYes', 'bttsNo'].forEach(mkt => {
        const val = Number(curr[mkt]);
        if (!Number.isFinite(val) || val <= 1.0) return;
        if (!entry.opening[mkt]) entry.opening[mkt] = val;
        if (entry.current[mkt] && Math.abs(entry.current[mkt] - val) >= 0.01) {
          entry.previous[mkt] = entry.current[mkt];
        }
        entry.current[mkt] = val;
        entry.high[mkt] = Math.max(Number(entry.high[mkt]) || val, val);
        entry.low[mkt] = Math.min(Number(entry.low[mkt]) || val, val);
      });
      entry.updatedAt = nowIso;
      updatedCount++;
    }
  }

  // Prune to max 250 recent fixtures to prevent unbounded KV growth
  const keys = Object.keys(ledger);
  if (keys.length > 250) {
    const sorted = keys.sort((a, b) => new Date(ledger[b].updatedAt || 0) - new Date(ledger[a].updatedAt || 0));
    const pruned = {};
    sorted.slice(0, 250).forEach(k => { pruned[k] = ledger[k]; });
    ledger = pruned;
  }

  if (kv && updatedCount > 0) {
    try {
      await kv.put(SNAPSHOT_KV_KEY, JSON.stringify(ledger));
    } catch (e) {
      // Non-blocking KV error
    }
  }

  return new Response(JSON.stringify({
    ok: true,
    updatedCount,
    totalTracked: Object.keys(ledger).length,
    updatedAt: nowIso
  }), { status: 200, headers: { ...CORS_HEADERS, 'Cache-Control': 'no-store' } });
}
