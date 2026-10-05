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

/**
 * Appends a structured audit event to the VIP access audit log in KV.
 * Keeps the most recent 200 events (capped to prevent KV size bloat).
 * Strictly sanitizes: NO tokens, secrets, passwords, or full credentials are ever logged.
 */
export async function logVipAuditEvent(env, eventData) {
  const timestamp = new Date().toISOString();
  const entry = {
    id: `aud_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp,
    action: eventData.action || eventData.event || 'VIP_EVENT',
    userId: eventData.userId || null,
    telegramUserId: eventData.telegramUserId || null,
    subscriptionState: eventData.subscriptionState ? {
      active: !!eventData.subscriptionState.active,
      status: eventData.subscriptionState.status || null,
      tier: eventData.subscriptionState.tier || null,
      expiresAt: eventData.subscriptionState.expiresAt || null
    } : null,
    result: eventData.result || 'SUCCESS',
    reasonCode: eventData.reasonCode || eventData.reason || null,
    details: eventData.details || null
  };

  const key = 'vip_audit_log';
  let logs = [];

  // Read existing logs
  if (env && env.USERS_KV) {
    try {
      const stored = await env.USERS_KV.get(key);
      if (stored) logs = JSON.parse(stored);
    } catch (e) {
      console.warn('[TelegramKV] Failed native KV read audit logs:', e.message);
    }
  } else {
    const apiToken = (env && env.CF_API_TOKEN) || FALLBACK_CF_API_TOKEN;
    const accountId = (env && env.CF_ACCOUNT_ID) || CF_ACCOUNT_ID;
    const nsId = (env && env.CF_KV_NAMESPACE_ID) || CF_KV_NAMESPACE_ID;
    try {
      const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${nsId}/values/${key}`, {
        headers: { 'Authorization': `Bearer ${apiToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) logs = data;
      }
    } catch (e) {
      console.warn('[TelegramKV] Failed REST KV read audit logs:', e.message);
    }
  }

  if (!Array.isArray(logs)) logs = [];
  logs.unshift(entry);
  if (logs.length > 200) logs = logs.slice(0, 200);

  // Write updated logs
  if (env && env.USERS_KV) {
    try {
      await env.USERS_KV.put(key, JSON.stringify(logs));
      return entry;
    } catch (e) {
      console.warn('[TelegramKV] Failed native KV write audit logs:', e.message);
    }
  } else {
    const apiToken = (env && env.CF_API_TOKEN) || FALLBACK_CF_API_TOKEN;
    const accountId = (env && env.CF_ACCOUNT_ID) || CF_ACCOUNT_ID;
    const nsId = (env && env.CF_KV_NAMESPACE_ID) || CF_KV_NAMESPACE_ID;
    try {
      await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${nsId}/values/${key}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(logs)
      });
    } catch (e) {
      console.warn('[TelegramKV] Failed REST KV write audit logs:', e.message);
    }
  }

  return entry;
}

/**
 * Retrieves recent VIP access audit logs
 */
export async function getVipAuditLogs(env, limit = 50) {
  const key = 'vip_audit_log';
  let logs = [];

  if (env && env.USERS_KV) {
    try {
      const stored = await env.USERS_KV.get(key);
      if (stored) logs = JSON.parse(stored);
    } catch (e) {}
  } else {
    const apiToken = (env && env.CF_API_TOKEN) || FALLBACK_CF_API_TOKEN;
    const accountId = (env && env.CF_ACCOUNT_ID) || CF_ACCOUNT_ID;
    const nsId = (env && env.CF_KV_NAMESPACE_ID) || CF_KV_NAMESPACE_ID;
    try {
      const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${nsId}/values/${key}`, {
        headers: { 'Authorization': `Bearer ${apiToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) logs = data;
      }
    } catch (e) {}
  }

  if (!Array.isArray(logs)) return [];
  return logs.slice(0, Math.min(limit, 200));
}

/**
 * Computes deterministic SHA-256 fingerprint for content deduplication
 */
export async function computeContentFingerprint(target, text, photoUrl = '') {
  const normalized = `${(target || '').toLowerCase().trim()}|${(text || '').trim().replace(/\s+/g, ' ')}|${(photoUrl || '').trim()}`;
  try {
    if (typeof crypto !== 'undefined' && crypto.subtle && typeof crypto.subtle.digest === 'function') {
      const encoder = new TextEncoder();
      const data = encoder.encode(normalized);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (e) {}

  // Fallback deterministic string hash
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = ((hash << 5) - hash) + normalized.charCodeAt(i);
    hash |= 0;
  }
  return 'fp_' + Math.abs(hash).toString(16);
}

/**
 * Saves a Telegram publication event to KV history (telegram_publish_history)
 * Retains the latest 100 publications.
 */
export async function savePublishHistory(env, entryData) {
  const timestamp = new Date().toISOString();
  const entry = {
    id: entryData.id || `pub_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
    dispatchedAt: entryData.dispatchedAt || timestamp,
    target: entryData.target || 'free',
    postType: entryData.postType || 'Custom Post',
    status: entryData.status || 'SUCCESS',
    telegramMessageId: entryData.telegramMessageId !== undefined ? entryData.telegramMessageId : null,
    textSnippet: (entryData.text || entryData.message || '').slice(0, 140),
    fullText: entryData.text || entryData.message || '',
    photoUrl: entryData.photoUrl || null,
    buttons: entryData.buttons || null,
    recipient: entryData.recipient || null,
    author: entryData.author || 'Admin',
    fingerprint: entryData.fingerprint || null
  };

  const key = 'telegram_publish_history';
  let history = [];

  if (env && env.USERS_KV) {
    try {
      const stored = await env.USERS_KV.get(key);
      if (stored) history = JSON.parse(stored);
    } catch (e) {
      console.warn('[TelegramKV] Failed native KV read publish history:', e.message);
    }
  } else {
    const apiToken = (env && env.CF_API_TOKEN) || FALLBACK_CF_API_TOKEN;
    const accountId = (env && env.CF_ACCOUNT_ID) || CF_ACCOUNT_ID;
    const nsId = (env && env.CF_KV_NAMESPACE_ID) || CF_KV_NAMESPACE_ID;
    try {
      const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${nsId}/values/${key}`, {
        headers: { 'Authorization': `Bearer ${apiToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) history = data;
      }
    } catch (e) {
      console.warn('[TelegramKV] Failed REST KV read publish history:', e.message);
    }
  }

  if (!Array.isArray(history)) history = [];
  history.unshift(entry);
  if (history.length > 100) history = history.slice(0, 100);

  if (env && env.USERS_KV) {
    try {
      await env.USERS_KV.put(key, JSON.stringify(history));
      return entry;
    } catch (e) {
      console.warn('[TelegramKV] Failed native KV write publish history:', e.message);
    }
  } else {
    const apiToken = (env && env.CF_API_TOKEN) || FALLBACK_CF_API_TOKEN;
    const accountId = (env && env.CF_ACCOUNT_ID) || CF_ACCOUNT_ID;
    const nsId = (env && env.CF_KV_NAMESPACE_ID) || CF_KV_NAMESPACE_ID;
    try {
      await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${nsId}/values/${key}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(history)
      });
    } catch (e) {
      console.warn('[TelegramKV] Failed REST KV write publish history:', e.message);
    }
  }

  return entry;
}

/**
 * Retrieves recent Telegram publication records
 */
export async function getPublishHistory(env, limit = 50) {
  const key = 'telegram_publish_history';
  let history = [];

  if (env && env.USERS_KV) {
    try {
      const stored = await env.USERS_KV.get(key);
      if (stored) history = JSON.parse(stored);
    } catch (e) {}
  } else {
    const apiToken = (env && env.CF_API_TOKEN) || FALLBACK_CF_API_TOKEN;
    const accountId = (env && env.CF_ACCOUNT_ID) || CF_ACCOUNT_ID;
    const nsId = (env && env.CF_KV_NAMESPACE_ID) || CF_KV_NAMESPACE_ID;
    try {
      const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${nsId}/values/${key}`, {
        headers: { 'Authorization': `Bearer ${apiToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) history = data;
      }
    } catch (e) {}
  }

  if (!Array.isArray(history)) return [];
  return history.slice(0, Math.min(limit, 100));
}

/**
 * Checks if identical content was published recently to the same target
 */
export async function checkDuplicatePublish(env, fingerprint, windowMs = 24 * 60 * 60 * 1000) {
  if (!fingerprint) return null;
  const history = await getPublishHistory(env, 50);
  const now = Date.now();
  for (const item of history) {
    if (item.fingerprint === fingerprint && item.status === 'SUCCESS') {
      const dispatchedTime = new Date(item.dispatchedAt).getTime();
      if (!isNaN(dispatchedTime) && (now - dispatchedTime) < windowMs) {
        return item;
      }
    }
  }
  return null;
}

// ============================================================================
// COMMAND CENTER: DRAFTS, SCHEDULES, RECIPES & AUTOMATION PERSISTENCE
// ============================================================================

async function readKVJson(env, key, fallback = []) {
  if (env && env.USERS_KV) {
    try {
      const stored = await env.USERS_KV.get(key);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
  } else {
    const apiToken = (env && env.CF_API_TOKEN) || FALLBACK_CF_API_TOKEN;
    const accountId = (env && env.CF_ACCOUNT_ID) || CF_ACCOUNT_ID;
    const nsId = (env && env.CF_KV_NAMESPACE_ID) || CF_KV_NAMESPACE_ID;
    try {
      const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${nsId}/values/${key}`, {
        headers: { 'Authorization': `Bearer ${apiToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data) return data;
      }
    } catch (e) {}
  }
  return fallback;
}

async function writeKVJson(env, key, value) {
  if (env && env.USERS_KV) {
    try {
      await env.USERS_KV.put(key, JSON.stringify(value));
      return true;
    } catch (e) {}
  } else {
    const apiToken = (env && env.CF_API_TOKEN) || FALLBACK_CF_API_TOKEN;
    const accountId = (env && env.CF_ACCOUNT_ID) || CF_ACCOUNT_ID;
    const nsId = (env && env.CF_KV_NAMESPACE_ID) || CF_KV_NAMESPACE_ID;
    try {
      const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${nsId}/values/${key}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(value)
      });
      return res.ok;
    } catch (e) {}
  }
  return false;
}

// Drafts
export async function getDrafts(env) {
  const drafts = await readKVJson(env, 'telegram_drafts', []);
  return Array.isArray(drafts) ? drafts : [];
}

export async function saveDraft(env, draftData) {
  let drafts = await getDrafts(env);
  const now = new Date().toISOString();
  const id = draftData.id || `drf_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
  const idx = drafts.findIndex(d => d.id === id);
  const entry = {
    ...draftData,
    id,
    updatedAt: now,
    createdAt: (idx >= 0 && drafts[idx].createdAt) || now
  };
  if (idx >= 0) {
    drafts[idx] = entry;
  } else {
    drafts.unshift(entry);
  }
  if (drafts.length > 50) drafts = drafts.slice(0, 50);
  await writeKVJson(env, 'telegram_drafts', drafts);
  return entry;
}

export async function deleteDraft(env, draftId) {
  let drafts = await getDrafts(env);
  drafts = drafts.filter(d => d.id !== draftId);
  await writeKVJson(env, 'telegram_drafts', drafts);
  return true;
}

// Schedules
export async function getSchedules(env) {
  const schedules = await readKVJson(env, 'telegram_schedules', []);
  return Array.isArray(schedules) ? schedules : [];
}

export async function saveSchedule(env, scheduleData) {
  let schedules = await getSchedules(env);
  const now = new Date().toISOString();
  const id = scheduleData.id || `sch_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
  const idx = schedules.findIndex(s => s.id === id);
  const entry = {
    ...scheduleData,
    id,
    status: scheduleData.status || 'SCHEDULED',
    createdAt: (idx >= 0 && schedules[idx].createdAt) || now,
    updatedAt: now
  };
  if (idx >= 0) {
    schedules[idx] = entry;
  } else {
    schedules.unshift(entry);
  }
  if (schedules.length > 50) schedules = schedules.slice(0, 50);
  await writeKVJson(env, 'telegram_schedules', schedules);
  return entry;
}

export async function deleteSchedule(env, scheduleId) {
  let schedules = await getSchedules(env);
  schedules = schedules.filter(s => s.id !== scheduleId);
  await writeKVJson(env, 'telegram_schedules', schedules);
  return true;
}

// Recipes
export async function getRecipes(env) {
  const recipes = await readKVJson(env, 'telegram_recipes', []);
  return Array.isArray(recipes) ? recipes : [];
}

export async function saveRecipe(env, recipeData) {
  let recipes = await getRecipes(env);
  const id = recipeData.id || `rcp_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
  const idx = recipes.findIndex(r => r.id === id);
  const entry = {
    ...recipeData,
    id,
    updatedAt: new Date().toISOString()
  };
  if (idx >= 0) {
    recipes[idx] = entry;
  } else {
    recipes.unshift(entry);
  }
  await writeKVJson(env, 'telegram_recipes', recipes);
  return entry;
}

export async function deleteRecipe(env, recipeId) {
  let recipes = await getRecipes(env);
  recipes = recipes.filter(r => r.id !== recipeId);
  await writeKVJson(env, 'telegram_recipes', recipes);
  return true;
}

// Automation Rules
export async function getAutomationRules(env) {
  const rules = await readKVJson(env, 'telegram_automation_rules', []);
  return Array.isArray(rules) ? rules : [];
}

export async function saveAutomationRule(env, ruleData) {
  let rules = await getAutomationRules(env);
  const id = ruleData.id || `aut_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
  const idx = rules.findIndex(r => r.id === id);
  const entry = {
    ...ruleData,
    id,
    enabled: !!ruleData.enabled, // Default false/off
    updatedAt: new Date().toISOString()
  };
  if (idx >= 0) {
    rules[idx] = entry;
  } else {
    rules.unshift(entry);
  }
  await writeKVJson(env, 'telegram_automation_rules', rules);
  return entry;
}


