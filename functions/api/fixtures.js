/**
 * Cloudflare Pages Function: /api/fixtures
 * Edge Proxy with Cloudflare native Cache API (5-minute TTL)
 */

const API_KEY = '2a68951288bede4261ef3365fa11f2c8';
const API_HOST = 'https://v3.football.api-sports.io';

export async function onRequest(context) {
  const cache = caches.default;
  const url = new URL(context.request.url);
  const league = url.searchParams.get('league') || '39';

  // Construct cache key based on league
  const cacheKey = new Request(`https://deeppredictbet.pages.dev/api/fixtures?league=${league}`);
  const cachedResponse = await cache.match(cacheKey);
  if (cachedResponse) {
    return cachedResponse;
  }

  const headers = {
    'x-apisports-key': API_KEY,
    'User-Agent': 'DeepPredictBet/1.0',
    'Accept': 'application/json'
  };

  try {
    // 1. Fetch upcoming fixtures
    let res = await fetch(`${API_HOST}/fixtures?league=${league}&next=15`, { headers });
    let json = await res.json();
    let fixtures = Array.isArray(json.response) ? json.response : [];

    // 2. If next=15 had 0 or rate-limited, try last=15 completed
    if (fixtures.length === 0) {
      const resLast = await fetch(`${API_HOST}/fixtures?league=${league}&last=15`, { headers });
      const jsonLast = await resLast.json();
      if (Array.isArray(jsonLast.response) && jsonLast.response.length > 0) {
        fixtures = jsonLast.response;
      }
    }

    const payload = {
      success: true,
      league,
      count: fixtures.length,
      response: fixtures
    };

    const response = new Response(JSON.stringify(payload), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300, s-maxage=300',
        'Access-Control-Allow-Origin': '*'
      }
    });

    if (fixtures.length > 0) {
      context.waitUntil(cache.put(cacheKey, response.clone()));
    }

    return response;
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
