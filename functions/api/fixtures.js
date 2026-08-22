/**
 * Cloudflare Pages Function: /api/fixtures
 * Rate-limit safe Edge Proxy with 5-minute Cloudflare cache
 */

const API_KEY = '2a68951288bede4261ef3365fa11f2c8';
const API_HOST = 'https://v3.football.api-sports.io';

const workerCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

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
        'Cache-Control': 'public, max-age=300, s-maxage=300',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  const headers = {
    'x-apisports-key': API_KEY,
    'User-Agent': 'DeepPredictBet/1.0',
    'Accept': 'application/json'
  };

  try {
    // Exactly 1 single query to preserve strict per-minute quota
    const res = await fetch(`${API_HOST}/fixtures?league=${league}&next=20`, { headers });
    const json = await res.json();
    let fixtures = Array.isArray(json.response) ? json.response : [];

    // If next=20 returned 0 (e.g. season ended or in break), fetch last 15
    if (fixtures.length === 0) {
      const resLast = await fetch(`${API_HOST}/fixtures?league=${league}&last=15`, { headers });
      const jsonLast = await resLast.json();
      if (Array.isArray(jsonLast.response)) {
        fixtures = jsonLast.response;
      }
    }

    const payload = {
      success: true,
      league,
      count: fixtures.length,
      response: fixtures
    };

    if (fixtures.length > 0) {
      workerCache.set(cacheKey, { timestamp: Date.now(), data: payload });
    }

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300, s-maxage=300',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: err.message,
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
