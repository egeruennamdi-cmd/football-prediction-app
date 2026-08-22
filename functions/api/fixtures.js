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
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'application/json'
  };

  const fetchEndpoint = async (endpoint) => {
    try {
      const res = await fetch(`${API_HOST}/${endpoint}`, { headers });
      if (!res.ok) return [];
      const json = await res.json();
      return Array.isArray(json.response) ? json.response : [];
    } catch (e) {
      return [];
    }
  };

  try {
    // 1. Fetch next upcoming matches for this league
    const nextMatches = await fetchEndpoint(`fixtures?league=${league}&next=12`);

    // 2. Fetch recent completed matches for this league
    const lastMatches = await fetchEndpoint(`fixtures?league=${league}&last=8`);

    // 3. Fetch live in-play matches
    const liveMatches = await fetchEndpoint(`fixtures?live=all`);
    const leagueLive = liveMatches.filter(m => String(m.league?.id) === String(league));

    const combined = [...leagueLive, ...nextMatches, ...lastMatches];

    // Deduplicate by fixture id
    const seen = new Set();
    const unique = [];
    for (const item of combined) {
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
