/**
 * Cloudflare Pages Function: /api/fixtures
 * High-performance Edge Proxy for API-Football with Pro Plan key
 */

const API_KEY = '2a68951288bede4261ef3365fa11f2c8';
const API_HOST = 'https://v3.football.api-sports.io';

const workerCache = new Map();
const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes edge cache

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const league = url.searchParams.get('league') || '39';

  const cacheKey = `league_${league}`;
  const cached = workerCache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS) && cached.data?.count > 0) {
    return new Response(JSON.stringify(cached.data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=180',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  const headers = {
    'x-apisports-key': API_KEY,
    'User-Agent': 'DeepPredictBet-Pro/1.0',
    'Accept': 'application/json'
  };

  try {
    // 1. Fetch full season fixtures for this league
    let rawList = [];
    let res = await fetch(`${API_HOST}/fixtures?league=${league}&season=2026`, { headers });
    let json = await res.json();

    if (Array.isArray(json.response) && json.response.length > 0) {
      rawList = json.response;
    } else {
      // Fallback to season 2025 if 2026 calendar is not active yet
      res = await fetch(`${API_HOST}/fixtures?league=${league}&season=2025`, { headers });
      json = await res.json();
      if (Array.isArray(json.response)) {
        rawList = json.response;
      }
    }

    // Process & select representative window: live + recent completed (8) + next upcoming (12)
    const live = [];
    const finished = [];
    const upcoming = [];

    const now = Date.now();
    const LIVE_STATUSES = new Set(['1H','HT','2H','ET','BT','P','SUSP','INT','LIVE']);
    const FT_STATUSES = new Set(['FT','AET','PEN']);

    for (const item of rawList) {
      const status = item.fixture?.status?.short;
      if (LIVE_STATUSES.has(status)) {
        live.push(item);
      } else if (FT_STATUSES.has(status)) {
        finished.push(item);
      } else {
        upcoming.push(item);
      }
    }

    // Sort finished matches descending (most recent first)
    finished.sort((a, b) => new Date(b.fixture?.date).getTime() - new Date(a.fixture?.date).getTime());
    // Sort upcoming matches ascending (soonest first)
    upcoming.sort((a, b) => new Date(a.fixture?.date).getTime() - new Date(b.fixture?.date).getTime());

    // Take top 8 recent finished + top 12 soonest upcoming + all live
    const selected = [
      ...live,
      ...upcoming.slice(0, 14),
      ...finished.slice(0, 10)
    ];

    // Deduplicate by fixture id
    const seen = new Set();
    const unique = [];
    for (const item of selected) {
      const id = item.fixture?.id;
      if (id && !seen.has(id)) {
        seen.add(id);
        unique.push(item);
      }
    }

    const payload = {
      success: true,
      league,
      count: unique.length,
      response: unique
    };

    if (unique.length > 0) {
      workerCache.set(cacheKey, { timestamp: Date.now(), data: payload });
    }

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=180',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: err.message || 'Error fetching fixtures',
      response: []
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
