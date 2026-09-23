/**
 * Cloudflare Pages Function: /api/reset-password
 * Handles self-service password resets synchronized across Cloudflare KV members_list
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
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
  }

  const token = (context.env && context.env.CF_API_TOKEN) || FALLBACK_CF_API_TOKEN;
  const accountId = (context.env && context.env.CF_ACCOUNT_ID) || CF_ACCOUNT_ID;
  const nsId = (context.env && context.env.CF_KV_NAMESPACE_ID) || CF_KV_NAMESPACE_ID;
  const kvUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${nsId}/values/members_list`;

  try {
    const kvRes = await fetch(kvUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    if (kvRes.ok) {
      const json = await kvRes.json();
      if (Array.isArray(json) && json.length > 0) return json;
    }
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
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
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
    const body = await context.request.json();
    const cleanEmail = (body.email || '').trim().toLowerCase();
    const cleanUser = (body.username || '').trim().toLowerCase();
    const newPasswordHash = (body.passwordHash || '').trim();

    if (!cleanEmail && !cleanUser) {
      return new Response(JSON.stringify({ success: false, error: 'Registered Email or Username is required' }), {
        status: 400,
        headers: corsHeaders()
      });
    }

    if (!newPasswordHash) {
      return new Response(JSON.stringify({ success: false, error: 'New password is required' }), {
        status: 400,
        headers: corsHeaders()
      });
    }

    const members = await getMembers(context);
    const existingIndex = members.findIndex(m =>
      (cleanEmail && (m.email || '').toLowerCase() === cleanEmail) ||
      (cleanUser && (m.username || '').toLowerCase() === cleanUser)
    );

    if (existingIndex < 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'No registered account found with that email or username. Please create an account first.'
      }), {
        status: 404,
        headers: corsHeaders()
      });
    }

    members[existingIndex].passwordHash = newPasswordHash;
    members[existingIndex].passwordUpdatedAt = new Date().toISOString();

    await saveMembers(context, members);

    return new Response(JSON.stringify({
      success: true,
      message: 'Password reset successfully! You can now log in with your new password.',
      username: members[existingIndex].username || members[existingIndex].fullName
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
