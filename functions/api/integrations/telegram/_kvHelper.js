/**
 * DeepPredictBet — KV Persistence Helper for Telegram Integration
 * Provides zero-downtime access to Cloudflare KV (USERS_KV) for:
 * - Members list retrieval & update
 * - Single-use account linking tokens (with TTL)
 */

const CF_ACCOUNT_ID = '2e500cb9c6dde4a2a8f47853fe5efe7c';
const CF_KV_NAMESPACE_ID = 'c24f3ae03abd42788257bec2f7d3c065';
const FALLBACK_CF_API_TOKEN = 'cfoat_M5XWA9h4W490gp-jkOQPlyJj-Yhxbvf9FhHVlGFpWvE.Eq4GTdNoGZ6XPS-XwBawDnD5ThF_olt2iwFbRgdtDRo';

const SEED_ADMIN = [
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

export async function getMembers(env) {
  // 1. Native Cloudflare Pages KV binding
  if (env && env.USERS_KV) {
    try {
      const stored = await env.USERS_KV.get('members_list');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return [...SEED_ADMIN];
    } catch (e) {
      console.warn('[TelegramKV] Failed native KV read:', e.message);
    }
  }

  // 2. Direct Cloudflare KV REST fetch fallback
  const token = (env && env.CF_API_TOKEN) || FALLBACK_CF_API_TOKEN;
  const accountId = (env && env.CF_ACCOUNT_ID) || CF_ACCOUNT_ID;
  const nsId = (env && env.CF_KV_NAMESPACE_ID) || CF_KV_NAMESPACE_ID;

  try {
    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${nsId}/values/members_list`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (e) {
    console.warn('[TelegramKV] Failed REST KV read:', e.message);
  }

  return [...SEED_ADMIN];
}

export async function saveMembers(env, members) {
  if (env && env.USERS_KV) {
    try {
      await env.USERS_KV.put('members_list', JSON.stringify(members));
      return true;
    } catch (e) {
      console.warn('[TelegramKV] Failed native KV write:', e.message);
    }
  }

  const token = (env && env.CF_API_TOKEN) || FALLBACK_CF_API_TOKEN;
  const accountId = (env && env.CF_ACCOUNT_ID) || CF_ACCOUNT_ID;
  const nsId = (env && env.CF_KV_NAMESPACE_ID) || CF_KV_NAMESPACE_ID;

  try {
    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${nsId}/values/members_list`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(members)
    });
    return res.ok;
  } catch (e) {
    console.warn('[TelegramKV] Failed REST KV write:', e.message);
    return false;
  }
}

/**
 * Stores a single-use account-linking token
 * @param {object} env 
 * @param {string} token 
 * @param {object} data - { userId, email, username }
 * @param {number} ttlSeconds - Expiration in seconds (default 900s = 15m)
 */
export async function setLinkToken(env, token, data, ttlSeconds = 900) {
  const key = `tg_link:${token}`;
  const value = JSON.stringify({ ...data, expiresAt: Date.now() + (ttlSeconds * 1000) });

  if (env && env.USERS_KV) {
    try {
      await env.USERS_KV.put(key, value, { expirationTtl: ttlSeconds });
      return true;
    } catch (e) {
      console.warn('[TelegramKV] Failed native KV put link token:', e.message);
    }
  }

  const apiToken = (env && env.CF_API_TOKEN) || FALLBACK_CF_API_TOKEN;
  const accountId = (env && env.CF_ACCOUNT_ID) || CF_ACCOUNT_ID;
  const nsId = (env && env.CF_KV_NAMESPACE_ID) || CF_KV_NAMESPACE_ID;

  try {
    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${nsId}/values/${key}?expiration_ttl=${ttlSeconds}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: value
    });
    return res.ok;
  } catch (e) {
    console.warn('[TelegramKV] Failed REST KV put link token:', e.message);
    return false;
  }
}

/**
 * Retrieves a single-use account-linking token
 */
export async function getLinkToken(env, token) {
  const key = `tg_link:${token}`;

  if (env && env.USERS_KV) {
    try {
      const stored = await env.USERS_KV.get(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
          await deleteLinkToken(env, token);
          return null;
        }
        return parsed;
      }
      return null;
    } catch (e) {
      console.warn('[TelegramKV] Failed native KV get link token:', e.message);
    }
  }

  const apiToken = (env && env.CF_API_TOKEN) || FALLBACK_CF_API_TOKEN;
  const accountId = (env && env.CF_ACCOUNT_ID) || CF_ACCOUNT_ID;
  const nsId = (env && env.CF_KV_NAMESPACE_ID) || CF_KV_NAMESPACE_ID;

  try {
    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${nsId}/values/${key}`, {
      headers: { 'Authorization': `Bearer ${apiToken}` }
    });
    if (res.ok) {
      const parsed = await res.json();
      if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
        await deleteLinkToken(env, token);
        return null;
      }
      return parsed;
    }
  } catch (e) {
    console.warn('[TelegramKV] Failed REST KV get link token:', e.message);
  }

  return null;
}

/**
 * Deletes a single-use account-linking token after consumption
 */
export async function deleteLinkToken(env, token) {
  const key = `tg_link:${token}`;

  if (env && env.USERS_KV) {
    try {
      await env.USERS_KV.delete(key);
      return true;
    } catch (e) {
      console.warn('[TelegramKV] Failed native KV delete link token:', e.message);
    }
  }

  const apiToken = (env && env.CF_API_TOKEN) || FALLBACK_CF_API_TOKEN;
  const accountId = (env && env.CF_ACCOUNT_ID) || CF_ACCOUNT_ID;
  const nsId = (env && env.CF_KV_NAMESPACE_ID) || CF_KV_NAMESPACE_ID;

  try {
    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${nsId}/values/${key}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${apiToken}` }
    });
    return res.ok;
  } catch (e) {
    console.warn('[TelegramKV] Failed REST KV delete link token:', e.message);
    return false;
  }
}
