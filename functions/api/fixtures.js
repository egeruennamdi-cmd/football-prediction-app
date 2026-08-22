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
  const type = url.searchParams.get('type') || 'all';

  const cacheKey = `${league}_${type}`;
  const cached = workerCache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
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
    'x-rapidapi-key': API_KEY,
    'x-rapidapi-host': 'v3.football.api-sports.io',
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
    let rawList = [];

    if (type === 'next') {
      rawList = await fetchEndpoint(`fixtures?league=${league}&next=12`);
    } else if (type === 'last') {
      rawList = await fetchEndpoint(`fixtures?league=${league}&last=8`);
    } else if (type === 'live') {
      rawList = await fetchEndpoint(`fixtures?league=${league}&live=all`);
    } else {
      // Fetch next upcoming fixtures
      const nextData = await fetchEndpoint(`fixtures?league=${league}&next=12`);
      // Fetch recent completed fixtures
      const lastData = await fetchEndpoint(`fixtures?league=${league}&last=8`);
      // Fetch any in-play live fixtures
      const liveData = await fetchEndpoint(`fixtures?league=${league}&live=all`);

      rawList = [...liveData, ...nextData, ...lastData];
    }

    // Deduplicate by fixture id
    const seen = new Set();
    const unique = [];
    for (const item of rawList) {
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

    workerCache.set(cacheKey, { timestamp: Date.now(), data: payload });

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
