/**
 * Cloudflare Pages Function: /api/fixtures
 * Edge proxy for API-Football with Pro Plan key
 */

const API_KEY = '2a68951288bede4261ef3365fa11f2c8';
const API_HOST = 'https://v3.football.api-sports.io';

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const league = url.searchParams.get('league') || '39';
  const type = url.searchParams.get('type') || 'all';

  const headers = {
    'x-apisports-key': API_KEY,
    'x-rapidapi-key': API_KEY,
    'x-rapidapi-host': 'v3.football.api-sports.io',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'application/json'
  };

  try {
    let rawList = [];

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

    if (type === 'next') {
      rawList = await fetchEndpoint(`fixtures?league=${league}&next=12`);
    } else if (type === 'last') {
      rawList = await fetchEndpoint(`fixtures?league=${league}&last=8`);
    } else if (type === 'live') {
      rawList = await fetchEndpoint(`fixtures?league=${league}&live=all`);
    } else {
      const [nextData, lastData, liveData] = await Promise.all([
        fetchEndpoint(`fixtures?league=${league}&next=12`),
        fetchEndpoint(`fixtures?league=${league}&last=8`),
        fetchEndpoint(`fixtures?league=${league}&live=all`)
      ]);
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

    return new Response(JSON.stringify({
      success: true,
      league,
      count: unique.length,
      response: unique
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60',
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
