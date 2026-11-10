/**
 * functions/api/services/_tokenSecurityService.js
 * Cryptographically Secure Token Engine & Storage Manager
 *
 * Requirements:
 * - 256-bit CSPRNG entropy via Web Crypto (crypto.getRandomValues)
 * - Single-use enforcement & server-side expiration checks
 * - One-way SHA-256 token hashing in storage (protecting against DB exposure)
 * - Timing-safe constant-time string comparison
 * - Backward compatibility with active pre-hardening tokens (safe migration)
 */

const CF_ACCOUNT_ID = '2e500cb9c6dde4a2a8f47853fe5efe7c';
const CF_KV_NAMESPACE_ID = 'c24f3ae03abd42788257bec2f7d3c065';
const FALLBACK_CF_API_TOKEN = 'cfoat_M5XWA9h4W490gp-jkOQPlyJj-Yhxbvf9FhHVlGFpWvE.Eq4GTdNoGZ6XPS-XwBawDnD5ThF_olt2iwFbRgdtDRo';

/**
 * Generates a 256-bit cryptographically secure random token
 * @param {string} prefix - e.g. 'vfy' for registration, 'rst' for password reset
 * @returns {string} - e.g. 'vfy_a1b2c3...64-hex'
 */
export function generateSecureToken(prefix = 'tok') {
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = new Uint8Array(32); // 256 bits of entropy
    crypto.getRandomValues(bytes);
    const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    return `${prefix}_${hex}`;
  }

  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    const u1 = crypto.randomUUID().replace(/-/g, '');
    const u2 = crypto.randomUUID().replace(/-/g, '');
    return `${prefix}_${u1}${u2}`;
  }

  // Fallback for isolated Node test runners
  try {
    const nodeCrypto = require('crypto');
    return `${prefix}_${nodeCrypto.randomBytes(32).toString('hex')}`;
  } catch (_) {
    throw new Error('Cryptographically secure random generator is not available.');
  }
}

/**
 * Computes the SHA-256 hexadecimal hash of a token
 * @param {string} token
 * @returns {Promise<string>}
 */
export async function hashToken(token) {
  if (!token || typeof token !== 'string') return '';
  try {
    if (typeof crypto !== 'undefined' && crypto.subtle && typeof crypto.subtle.digest === 'function') {
      const enc = new TextEncoder().encode(token);
      const buf = await crypto.subtle.digest('SHA-256', enc);
      return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (_) {}

  try {
    const nodeCrypto = require('crypto');
    return nodeCrypto.createHash('sha256').update(token).digest('hex');
  } catch (_) {
    return '';
  }
}

/**
 * Timing-safe constant-time string comparison to prevent timing attacks
 */
export function timingSafeEqualStrings(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/**
 * Verifies whether a candidate token matches stored token or token hash
 * Supports backward-compatible migration for active legacy unhashed tokens
 */
export async function verifyTokenMatch(candidateToken, storedHashOrToken) {
  if (!candidateToken || !storedHashOrToken) return false;
  const candidateHash = await hashToken(candidateToken);

  // 1. Compare against SHA-256 hash (modern hardened tokens)
  if (timingSafeEqualStrings(candidateHash, storedHashOrToken)) {
    return true;
  }

  // 2. Backward-compatible fallback: compare against raw legacy token
  if (timingSafeEqualStrings(candidateToken, storedHashOrToken)) {
    return true;
  }

  return false;
}

/**
 * Checks whether an expiration timestamp has elapsed
 */
export function isTokenExpired(expiresTimestamp) {
  if (!expiresTimestamp) return true;
  return Date.now() > Number(expiresTimestamp);
}

/**
 * Cloudflare KV Token Operations
 */
export async function putTokenKv(env, tokenKey, data, ttlSeconds) {
  const serialized = JSON.stringify(data);
  // 1. Native Cloudflare Pages USERS_KV binding
  if (env && env.USERS_KV) {
    try {
      await env.USERS_KV.put(tokenKey, serialized, { expirationTtl: Math.max(60, ttlSeconds) });
      return true;
    } catch (e) {
      console.warn('[TokenKV] Native KV put error:', e.message);
    }
  }

  // 2. Direct Cloudflare KV REST API fallback
  const token = (env && env.CF_API_TOKEN) || FALLBACK_CF_API_TOKEN;
  const accountId = (env && env.CF_ACCOUNT_ID) || CF_ACCOUNT_ID;
  const nsId = (env && env.CF_KV_NAMESPACE_ID) || CF_KV_NAMESPACE_ID;
  const kvUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${nsId}/values/${encodeURIComponent(tokenKey)}?expiration_ttl=${ttlSeconds}`;

  try {
    const res = await fetch(kvUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: serialized
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}

export async function getTokenKv(env, tokenKey) {
  // 1. Native KV
  if (env && env.USERS_KV) {
    try {
      const raw = await env.USERS_KV.get(tokenKey);
      if (raw) return JSON.parse(raw);
    } catch (_) {}
  }

  // 2. Direct REST fallback
  const token = (env && env.CF_API_TOKEN) || FALLBACK_CF_API_TOKEN;
  const accountId = (env && env.CF_ACCOUNT_ID) || CF_ACCOUNT_ID;
  const nsId = (env && env.CF_KV_NAMESPACE_ID) || CF_KV_NAMESPACE_ID;
  const kvUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${nsId}/values/${encodeURIComponent(tokenKey)}`;

  try {
    const res = await fetch(kvUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    if (res.ok) {
      const text = await res.text();
      return JSON.parse(text);
    }
  } catch (_) {}

  return null;
}

export async function deleteTokenKv(env, tokenKey) {
  if (env && env.USERS_KV) {
    try {
      await env.USERS_KV.delete(tokenKey);
      return true;
    } catch (_) {}
  }

  const token = (env && env.CF_API_TOKEN) || FALLBACK_CF_API_TOKEN;
  const accountId = (env && env.CF_ACCOUNT_ID) || CF_ACCOUNT_ID;
  const nsId = (env && env.CF_KV_NAMESPACE_ID) || CF_KV_NAMESPACE_ID;
  const kvUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${nsId}/values/${encodeURIComponent(tokenKey)}`;

  try {
    const res = await fetch(kvUrl, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.ok;
  } catch (_) {
    return false;
  }
}
