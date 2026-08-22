/**
 * Cloudflare Pages Function: /api/fixtures
 * Edge proxy for API-Football with Pro Plan key
 */

const API_KEY = '2a68951288bede4261ef3365fa11f2c8';
const API_HOST = 'https://v3.football.api-sports.io';

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const league = url.searchParams.get('league') || '39';
  const type = url.searchParams.get('type') || 'all'; // 'all', 'next', 'last', 'live'

  const headers = {
    'x-apisports-key': API_KEY,
    'x-rapidapi-key': API_KEY,
    'x-rapidapi-host': 'v3.football.api-sports.io'
  };

  try {
    let rawList = [];

    if (type === 'next') {
      const res = await fetch(`${API_HOST}/fixtures?league=${league}&next=12`, { headers });
      const json = await res.json();
      rawList = json.response || [];
    } else if (type === 'last') {
      const res = await fetch(`${API_HOST}/fixtures?league=${league}&last=8`, { headers });
      const json = await res.json();
      rawList = json.response || [];
    } else if (type === 'live') {
      const res = await fetch(`${API_HOST}/fixtures?league=${league}&live=all`, { headers });
      const json = await res.json();
      rawList = json.response || [];
    } else {
      // 'all' -> parallel fetch of live, next 12, and last 8
      const [nextRes, lastRes, liveRes] = await Promise.allSettled([
        fetch(`${API_HOST}/fixtures?league=${league}&next=12`, { headers }).then(r => r.json()),
        fetch(`${API_HOST}/fixtures?league=${league}&last=8`, { headers }).then(r => r.json()),
        fetch(`${API_HOST}/fixtures?league=${league}&live=all`, { headers }).then(r => r.json())
      ]);

      if (liveRes.status === 'fulfilled' && Array.isArray(liveRes.value?.response)) {
        rawList.push(...liveRes.value.response);
      }
      if (nextRes.status === 'fulfilled' && Array.isArray(nextRes.value?.response)) {
        rawList.push(...nextRes.value.response);
      }
      if (lastRes.status === 'fulfilled' && Array.isArray(lastRes.value?.response)) {
        rawList.push(...lastRes.value.response);
      }
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

    return new Response(JSON.stringify({
      success: true,
      league,
      count: unique.length,
      response: unique
    }), {
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
      error: err.message || 'Error fetching fixtures'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
