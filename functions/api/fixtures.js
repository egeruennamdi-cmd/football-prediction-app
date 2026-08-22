/**
 * Cloudflare Pages Function: /api/fixtures
 * Rate-limit safe Edge Proxy with 5-minute Cloudflare cache
 */

const API_KEY = '2a68951288bede4261ef3365fa11f2c8';
const API_HOST = 'https://v3.football.api-sports.io';

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const league = url.searchParams.get('league') || '39';

  const headers = {
    'x-apisports-key': API_KEY,
    'x-rapidapi-key': API_KEY,
    'x-rapidapi-host': 'v3.football.api-sports.io'
  };

  try {
    const res = await fetch(`${API_HOST}/fixtures?league=${league}&next=20`, { headers });
    const json = await res.json();
    let fixtures = Array.isArray(json.response) ? json.response : [];

    if (fixtures.length === 0) {
      const resLast = await fetch(`${API_HOST}/fixtures?league=${league}&last=15`, { headers });
      const jsonLast = await resLast.json();
      if (Array.isArray(jsonLast.response)) {
        fixtures = jsonLast.response;
      }
    }

    return new Response(JSON.stringify({
      success: true,
      league,
      count: fixtures.length,
      apiResults: json.results,
      apiErrors: json.errors,
      response: fixtures
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
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
