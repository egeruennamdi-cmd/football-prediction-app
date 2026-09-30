/**
 * User Conversion History Endpoint
 * Cloudflare Pages Function: /api/user/conversions
 * Retrieves recent booking code conversion records for the authenticated user.
 */

const CF_ACCOUNT_ID = '2e500cb9c6dde4a2a8f47853fe5efe7c';
const CF_KV_NAMESPACE_ID = 'c24f3ae03abd42788257bec2f7d3c065';
const FALLBACK_CF_API_TOKEN = 'cfoat_M5XWA9h4W490gp-jkOQPlyJj-Yhxbvf9FhHVlGFpWvE.Eq4GTdNoGZ6XPS-XwBawDnD5ThF_olt2iwFbRgdtDRo';

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-User-Email, x-user-email",
    "Content-Type": "application/json"
  };
}

async function kvGet(context, key) {
  if (context.env && context.env.USERS_KV) {
    try {
      return await context.env.USERS_KV.get(key);
    } catch (e) {}
  }
  const token = (context.env && context.env.CF_API_TOKEN) || FALLBACK_CF_API_TOKEN;
  const accountId = (context.env && context.env.CF_ACCOUNT_ID) || CF_ACCOUNT_ID;
  const nsId = (context.env && context.env.CF_KV_NAMESPACE_ID) || CF_KV_NAMESPACE_ID;
  const kvUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${nsId}/values/${encodeURIComponent(key)}`;
  try {
    const res = await fetch(kvUrl, { headers: { 'Authorization': `Bearer ${token}` } });
    if (res.ok) return await res.text();
  } catch (e) {}
  return null;
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function onRequestGet(context) {
  try {
    const emailHeader = (context.request.headers.get("X-User-Email") || context.request.headers.get("x-user-email") || "").trim().toLowerCase();
    const clientIp = context.request.headers.get("cf-connecting-ip") || "unknown_ip";
    
    // Resolve identity key
    const identityKey = emailHeader ? `user_${emailHeader}` : `anon_${clientIp}`;
    const historyKey = `conv_hist_${identityKey}`;

    const raw = await kvGet(context, historyKey);
    let history = [];
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) history = parsed;
      } catch (e) {}
    }

    return new Response(JSON.stringify({
      success: true,
      history,
      count: history.length,
      user: emailHeader || 'Guest'
    }), {
      status: 200,
      headers: corsHeaders()
    });
  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: err.message || "Failed to retrieve conversion history."
    }), {
      status: 500,
      headers: corsHeaders()
    });
  }
}
