/**
 * functions/api/_kvHelper.js
 * Authoritative Server-Side User Ledger Access Backed by Cloudflare KV
 */

const CF_ACCOUNT_ID = '2e500cb9c6dde4a2a8f47853fe5efe7c';
const CF_KV_NAMESPACE_ID = 'c24f3ae03abd42788257bec2f7d3c065';
const FALLBACK_CF_API_TOKEN = 'cfoat_M5XWA9h4W490gp-jkOQPlyJj-Yhxbvf9FhHVlGFpWvE.Eq4GTdNoGZ6XPS-XwBawDnD5ThF_olt2iwFbRgdtDRo';

export const SEED_ADMIN = [
  {
    id: 'usr_adm1',
    fullName: 'Alex Nnamdi (Admin)',
    email: 'admin@deeppredictbet.com',
    username: 'Egeruennamdi78',
    role: 'ADMIN',
    coinsBalance: 1500,
    passwordHash: 'Egeruennamdi78',
    createdAt: '2026-08-01T10:00:00.000Z'
  },
  {
    id: 'usr_adm2',
    fullName: 'Alex Nnamdi (Owner)',
    email: 'egeruennamdi@gmail.com',
    username: 'egeruennamdi',
    role: 'ADMIN',
    coinsBalance: 1500,
    passwordHash: 'Egeruennamdi78',
    createdAt: '2026-08-01T10:00:00.000Z'
  }
];

export function corsHeaders() {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  };
}

function resolveEnv(contextOrEnv) {
  if (!contextOrEnv) return {};
  if (contextOrEnv.env) return contextOrEnv.env;
  return contextOrEnv;
}

export async function getMembers(contextOrEnv) {
  const env = resolveEnv(contextOrEnv);

  // 1. Native Cloudflare Pages KV binding
  if (env && env.USERS_KV) {
    try {
      const stored = await env.USERS_KV.get('members_list');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return [...SEED_ADMIN];
    } catch (e) {}
  }

  // 2. Direct Cloudflare KV REST fetch fallback
  const token = (env && env.CF_API_TOKEN) || FALLBACK_CF_API_TOKEN;
  const accountId = (env && env.CF_ACCOUNT_ID) || CF_ACCOUNT_ID;
  const nsId = (env && env.CF_KV_NAMESPACE_ID) || CF_KV_NAMESPACE_ID;
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

  return [...SEED_ADMIN];
}

export async function saveMembers(contextOrEnv, members) {
  const env = resolveEnv(contextOrEnv);

  // 1. Native Cloudflare Pages KV binding
  if (env && env.USERS_KV) {
    try {
      await env.USERS_KV.put('members_list', JSON.stringify(members));
      return true;
    } catch (e) {}
  }

  // 2. Direct Cloudflare KV REST fetch fallback
  const token = (env && env.CF_API_TOKEN) || FALLBACK_CF_API_TOKEN;
  const accountId = (env && env.CF_ACCOUNT_ID) || CF_ACCOUNT_ID;
  const nsId = (env && env.CF_KV_NAMESPACE_ID) || CF_KV_NAMESPACE_ID;
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
