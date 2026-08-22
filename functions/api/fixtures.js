/**
 * Cloudflare Pages Function: /api/fixtures
 * High-performance Edge Proxy for API-Football with Pro Plan key
 */

const API_KEY = '2a68951288bede4261ef3365fa11f2c8';
const API_HOST = 'https://v3.football.api-sports.io';

const workerCache = new Map();
const CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes edge cache

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
        'Cache-Control': 'public, max-age=120',
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
    let rawList = [];
    let res = await fetch(`${API_HOST}/fixtures?league=${league}&season=2026`, { headers });
    let json = await res.json();

    if (Array.isArray(json.response) && json.response.length > 0) {
      rawList = json.response;
    } else {
      res = await fetch(`${API_HOST}/fixtures?league=${league}&season=2025`, { headers });
      json = await res.json();
      if (Array.isArray(json.response) && json.response.length > 0) {
        rawList = json.response;
      }
    }

    const live = [];
    const finished = [];
    const upcoming = [];

    const LIVE_STATUSES = new Set(['1H','HT','2H','ET','BT','P','SUSP','INT','LIVE']);
    const FT_STATUSES = new Set(['FT','AET','PEN']);

    const getTime = (item) => {
      if (item.fixture?.timestamp) return item.fixture.timestamp * 1000;
      if (item.fixture?.date) return Date.parse(item.fixture.date) || 0;
      return 0;
    };

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

    // Sort finished descending (most recent first)
    finished.sort((a, b) => getTime(b) - getTime(a));
    // Sort upcoming ascending (soonest first)
    upcoming.sort((a, b) => getTime(a) - getTime(b));

    const selected = [
      ...live,
      ...upcoming.slice(0, 14),
      ...finished.slice(0, 10)
    ];

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
        'Cache-Control': 'public, max-age=120',
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
