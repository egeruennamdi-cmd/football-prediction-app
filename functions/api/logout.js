/**
 * Cloudflare Pages Function: /api/logout
 * Server-Side Session Revocation Endpoint
 */

const CF_ACCOUNT_ID = '2e500cb9c6dde4a2a8f47853fe5efe7c';
const CF_KV_NAMESPACE_ID = 'c24f3ae03abd42788257bec2f7d3c065';
const FALLBACK_CF_API_TOKEN = 'cfoat_M5XWA9h4W490gp-jkOQPlyJj-Yhxbvf9FhHVlGFpWvE.Eq4GTdNoGZ6XPS-XwBawDnD5ThF_olt2iwFbRgdtDRo';

function corsHeaders() {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  };
}

async function getMembers(context) {
  if (context.env && context.env.USERS_KV) {
    try {
      const stored = await context.env.USERS_KV.get('members_list');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
  }
  const token = (context.env && context.env.CF_API_TOKEN) || FALLBACK_CF_API_TOKEN;
  const accountId = (context.env && context.env.CF_ACCOUNT_ID) || CF_ACCOUNT_ID;
  const nsId = (context.env && context.env.CF_KV_NAMESPACE_ID) || CF_KV_NAMESPACE_ID;
  const kvUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${nsId}/values/members_list`;
  try {
    const kvRes = await fetch(kvUrl, { headers: { 'Authorization': `Bearer ${token}` } });
    if (kvRes.ok) return await kvRes.json();
  } catch (e) {}
  return [];
}

async function saveMembers(context, members) {
  if (context.env && context.env.USERS_KV) {
    try {
      await context.env.USERS_KV.put('members_list', JSON.stringify(members));
      return true;
    } catch (e) {}
  }
  const token = (context.env && context.env.CF_API_TOKEN) || FALLBACK_CF_API_TOKEN;
  const accountId = (context.env && context.env.CF_ACCOUNT_ID) || CF_ACCOUNT_ID;
  const nsId = (context.env && context.env.CF_KV_NAMESPACE_ID) || CF_KV_NAMESPACE_ID;
  const kvUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${nsId}/values/members_list`;
  try {
    const kvRes = await fetch(kvUrl, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(members)
    });
    return kvRes.ok;
  } catch (e) {
    return false;
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function onRequestPost(context) {
  try {
    const authHeader = context.request.headers.get('Authorization') || '';
    let token = '';
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    } else if (authHeader) {
      token = authHeader.trim();
    }

    let body = {};
    try { body = await context.request.json(); } catch (e) {}
    if (!token && body.sessionId) {
      token = String(body.sessionId).trim();
    }

    if (token) {
      const members = await getMembers(context);
      const userIndex = members.findIndex(m => m.sessionId === token);
      if (userIndex >= 0) {
        delete members[userIndex].sessionId;
        delete members[userIndex].sessionExpiresAt;
        await saveMembers(context, members);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Logged out successfully'
    }), {
      status: 200,
      headers: corsHeaders()
    });
  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: err.message
    }), {
      status: 500,
      headers: corsHeaders()
    });
  }
}
