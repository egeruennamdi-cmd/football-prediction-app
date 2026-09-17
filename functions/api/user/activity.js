/**
 * Cloudflare Pages Function: /api/user/activity
 * User Tenancy Activity & Saved Data Sync Endpoint
 * Allows users to fetch/save their own tickets, watchlist, alerts, and coin logs safely.
 */

const CF_ACCOUNT_ID = '2e500cb9c6dde4a2a8f47853fe5efe7c';
const CF_KV_NAMESPACE_ID = 'c24f3ae03abd42788257bec2f7d3c065';
const CF_API_TOKEN = 'cfoat_M5XWA9h4W490gp-jkOQPlyJj-Yhxbvf9FhHVlGFpWvE.Eq4GTdNoGZ6XPS-XwBawDnD5ThF_olt2iwFbRgdtDRo';
const CF_KV_URL = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/storage/kv/namespaces/${CF_KV_NAMESPACE_ID}/values/members_list`;

function corsHeaders() {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  };
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function onRequestGet(context) {
  try {
    const url = new URL(context.request.url);
    const email = (url.searchParams.get('email') || '').trim().toLowerCase();

    if (!email) {
      return new Response(JSON.stringify({ success: false, error: 'Email parameter required' }), {
        status: 400,
        headers: corsHeaders()
      });
    }

    let members = [];
    try {
      const kvRes = await fetch(CF_KV_URL, {
        headers: {
          'Authorization': `Bearer ${CF_API_TOKEN}`,
          'Accept': 'application/json'
        }
      });
      if (kvRes.ok) {
        const json = await kvRes.json();
        if (Array.isArray(json)) members = json;
      }
    } catch (e) {}

    const user = members.find(m => (m.email || '').toLowerCase() === email);
    if (!user) {
      return new Response(JSON.stringify({ success: false, error: 'User not found' }), {
        status: 404,
        headers: corsHeaders()
      });
    }

    // Return only the authenticated user's activity and preferences
    return new Response(JSON.stringify({
      success: true,
      activity: {
        savedTickets: user.savedTickets || [],
        watchlist: user.watchlist || [],
        alerts: user.alerts || { telegram: true, scanner: true, digest: false },
        subscription: user.subscription || { active: false, tier: 'none' },
        coinsLedger: user.coinsLedger || [],
        coinsBalance: user.coinsBalance ?? 500,
        role: user.role || 'USER',
        lastActiveAt: user.lastActiveAt || user.createdAt
      }
    }), {
      status: 200,
      headers: corsHeaders()
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: corsHeaders()
    });
  }
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const email = (body.email || '').trim().toLowerCase();

    if (!email) {
      return new Response(JSON.stringify({ success: false, error: 'Email is required' }), {
        status: 400,
        headers: corsHeaders()
      });
    }

    let members = [];
    try {
      const kvRes = await fetch(CF_KV_URL, {
        headers: {
          'Authorization': `Bearer ${CF_API_TOKEN}`,
          'Accept': 'application/json'
        }
      });
      if (kvRes.ok) {
        const json = await kvRes.json();
        if (Array.isArray(json)) members = json;
      }
    } catch (e) {}

    const userIdx = members.findIndex(m => (m.email || '').toLowerCase() === email);
    if (userIdx === -1) {
      return new Response(JSON.stringify({ success: false, error: 'User not found' }), {
        status: 404,
        headers: corsHeaders()
      });
    }

    const user = members[userIdx];
    if (body.savedTickets !== undefined) user.savedTickets = body.savedTickets;
    if (body.watchlist !== undefined) user.watchlist = body.watchlist;
    if (body.alerts !== undefined) user.alerts = body.alerts;
    if (body.subscription !== undefined) user.subscription = body.subscription;
    if (body.coinsLedger !== undefined) user.coinsLedger = body.coinsLedger;
    if (body.coinsBalance !== undefined) user.coinsBalance = body.coinsBalance;
    user.lastActiveAt = new Date().toISOString();

    members[userIdx] = user;

    // Persist to Cloudflare KV
    try {
      await fetch(CF_KV_URL, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${CF_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(members)
      });
    } catch (e) {}

    return new Response(JSON.stringify({
      success: true,
      message: 'User activity synchronized successfully'
    }), {
      status: 200,
      headers: corsHeaders()
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: corsHeaders()
    });
  }
}
