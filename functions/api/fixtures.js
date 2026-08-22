/**
 * Cloudflare Pages Function: /api/fixtures
 * Bulletproof Edge Proxy for API-Football with Pro Plan key
 */

const API_KEY = '2a68951288bede4261ef3365fa11f2c8';
const API_HOST = 'https://v3.football.api-sports.io';

const workerCache = new Map();
const CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes

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
    let list = [];

    // Parallel fetch: next 14 upcoming, last 10 completed, and live in-play
    const [nextData, lastData, liveData] = await Promise.all([
      fetchEndpoint(`fixtures?league=${league}&next=14`),
      fetchEndpoint(`fixtures?league=${league}&last=10`),
      fetchEndpoint(`fixtures?league=${league}&live=all`)
    ]);

    if (Array.isArray(liveData)) list.push(...liveData);
    if (Array.isArray(nextData)) list.push(...nextData);
    if (Array.isArray(lastData)) list.push(...lastData);

    // If still empty, query full season as fallback
    if (list.length === 0) {
      const seasonData = await fetchEndpoint(`fixtures?league=${league}&season=2026`);
      if (Array.isArray(seasonData) && seasonData.length > 0) {
        list.push(...seasonData);
      } else {
        const seasonData2025 = await fetchEndpoint(`fixtures?league=${league}&season=2025`);
        if (Array.isArray(seasonData2025)) list.push(...seasonData2025);
      }
    }

    // Deduplicate by fixture id
    const seen = new Set();
    const unique = [];
    for (const item of list) {
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
