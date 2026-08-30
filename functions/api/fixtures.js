/**
 * Cloudflare Pages Function: /api/fixtures
 * Edge Proxy with Cloudflare native Cache API (5-minute TTL)
 */

const API_KEY = '2a68951288bede4261ef3365fa11f2c8';
const API_HOST = 'https://v3.football.api-sports.io';

export async function onRequest(context) {
  const cache = caches.default;
  const url = new URL(context.request.url);
  const live = url.searchParams.get('live');
  const league = url.searchParams.get('league') || (live ? '' : '39');
  const next = url.searchParams.get('next') || '15';

  const cacheKey = new Request(url.toString());
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
    let fixtures = [];

    if (live === 'all' || live === 'true') {
      // Fetch all currently in-play live matches across global leagues
      const resLive = await fetch(`${API_HOST}/fixtures?live=all`, { headers });
      if (resLive.ok) {
        const jsonLive = await resLive.json();
        if (Array.isArray(jsonLive.response)) {
          fixtures = jsonLive.response;
        }
      }
    } else if (league) {
      // Fetch upcoming and recent fixtures for the specified league
      const [resNext, resLast] = await Promise.allSettled([
        fetch(`${API_HOST}/fixtures?league=${league}&next=${next}`, { headers }),
        fetch(`${API_HOST}/fixtures?league=${league}&last=15`, { headers })
      ]);

      let upcomingFixtures = [];
      let pastFixtures = [];

      if (resNext.status === 'fulfilled' && resNext.value.ok) {
        const jsonNext = await resNext.value.json();
        if (Array.isArray(jsonNext.response)) upcomingFixtures = jsonNext.response;
      }

      if (resLast.status === 'fulfilled' && resLast.value.ok) {
        const jsonLast = await resLast.value.json();
        if (Array.isArray(jsonLast.response)) pastFixtures = jsonLast.response;
      }

      fixtures = [...upcomingFixtures, ...pastFixtures];
    }

    const payload = {
      success: true,
      league: league || 'all',
      live: !!live,
      count: fixtures.length,
      response: fixtures
    };

    const ttl = (live === 'all' || live === 'true') ? 30 : 300; // 30s cache for live, 5m for fixtures
    const response = new Response(JSON.stringify(payload), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': `public, max-age=${ttl}, s-maxage=${ttl}`,
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
