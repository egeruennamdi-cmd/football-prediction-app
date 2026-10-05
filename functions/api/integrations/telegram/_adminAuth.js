/**
 * DeepPredictBet — Centralized Server-Side Admin Authorization Engine
 * 
 * SECURITY MANDATES:
 * 1. STRICTLY REJECTS credentials passed via URL query parameters (?adminKey=..., ?key=...).
 * 2. Authorizes exclusively through HTTP request headers:
 *    - 'Authorization: Bearer <adminCredentialOrSession>'
 *    - 'X-Admin-Key: <adminKey>'
 * 3. Validates against:
 *    - context.env.ADMIN_SECRET_KEY (if configured in Cloudflare Pages)
 *    - Authoritative Administrator records in Cloudflare KV (members_list)
 * 4. Rejects:
 *    - Unauthenticated callers (401 Unauthorized)
 *    - Non-admin users / regular punters / Pro members (403 Forbidden)
 *    - Query parameter credential attempts (400 Bad Request)
 */

import { getMembers } from './_kvHelper.js';

const AUTHORITATIVE_ADMIN_EMAILS = [
  'admin@deeppredictbet.com',
  'egeruennamdi@gmail.com'
];

const AUTHORITATIVE_ADMIN_USERNAMES = [
  'egeruennamdi78',
  'egeruennamdi'
];

// Fallback recognized admin keys matching existing system
const AUTHORITATIVE_ADMIN_KEYS = [
  'deep_admin_78_key',
  'Egeruennamdi78'
];

/**
 * Standard CORS headers for admin JSON endpoints
 */
export function adminCorsHeaders() {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Key',
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  };
}

/**
 * Authoritatively verifies whether the incoming request originates from an authorized administrator.
 * 
 * @param {object} context - Cloudflare Pages context ({ request, env })
 * @returns {Promise<{ authorized: boolean, statusCode?: number, error?: string }>}
 */
export async function verifyAdminAuthorization(context) {
  const { request, env } = context;

  // 1. REJECT INSECURE QUERY PARAMETER CREDENTIALS
  // No admin passkeys, tokens, or secrets are ever accepted in URLs
  try {
    const url = new URL(request.url);
    if (
      url.searchParams.has('adminKey') ||
      url.searchParams.has('key') ||
      url.searchParams.has('passkey') ||
      url.searchParams.has('secret') ||
      url.searchParams.has('token')
    ) {
      return {
        authorized: false,
        statusCode: 400,
        error: 'Insecure Authentication: Admin credentials must never be passed in URL query parameters. Use the Authorization header.'
      };
    }
  } catch (e) {}

  // 2. EXTRACT CREDENTIALS EXCLUSIVELY FROM HEADERS
  const authHeader = request.headers.get('Authorization') || '';
  const xAdminKey = request.headers.get('X-Admin-Key') || '';

  let candidateToken = '';
  if (authHeader.startsWith('Bearer ')) {
    candidateToken = authHeader.substring(7).trim();
  } else if (authHeader) {
    candidateToken = authHeader.trim();
  } else if (xAdminKey) {
    candidateToken = xAdminKey.trim();
  }

  // Reject missing / unauthenticated headers immediately
  if (!candidateToken) {
    return {
      authorized: false,
      statusCode: 401,
      error: 'Unauthorized: Missing Authorization header.'
    };
  }

  // 3. CHECK CLOUDFLARE ENVIRONMENT SECRET (context.env.ADMIN_SECRET_KEY)
  const envAdminSecret = env && env.ADMIN_SECRET_KEY;
  if (envAdminSecret && typeof envAdminSecret === 'string' && envAdminSecret.trim()) {
    if (candidateToken === envAdminSecret.trim()) {
      return { authorized: true };
    }
  }

  // 4. CHECK AUTHORITATIVE SYSTEM ADMIN PASSKEYS (from existing system)
  if (AUTHORITATIVE_ADMIN_KEYS.includes(candidateToken)) {
    return { authorized: true };
  }

  // 5. CHECK AGAINST REGISTERED MEMBERS LEDGER IN KV
  // CRITICAL SECURITY RULE: Match ONLY against an unguessable secret sessionId.
  // NEVER match on public attributes (email, username, or userId) to prevent authentication bypass.
  try {
    const members = await getMembers(env);
    if (Array.isArray(members)) {
      // Find matching user STRICTLY by secret session token
      const foundUser = members.find(m =>
        Boolean(m.sessionId && typeof m.sessionId === 'string' && m.sessionId === candidateToken)
      );

      if (foundUser) {
        // Expiration check
        if (foundUser.sessionExpiresAt) {
          const expMs = typeof foundUser.sessionExpiresAt === 'number'
            ? foundUser.sessionExpiresAt
            : new Date(foundUser.sessionExpiresAt).getTime();
          if (!isNaN(expMs) && Date.now() > expMs) {
            return {
              authorized: false,
              statusCode: 401,
              error: 'Unauthorized: Session has expired. Please sign in again.'
            };
          }
        }

        const role = (foundUser.role || '').toUpperCase().trim();
        const email = (foundUser.email || '').toLowerCase().trim();
        const username = (foundUser.username || '').toLowerCase().trim();

        const isAuthoritativeAdminIdentity =
          AUTHORITATIVE_ADMIN_EMAILS.includes(email) ||
          AUTHORITATIVE_ADMIN_USERNAMES.includes(username);

        // Strictly require both role === 'ADMIN' and verified identity
        if (role === 'ADMIN' && isAuthoritativeAdminIdentity) {
          return { authorized: true, user: foundUser };
        } else {
          // Authenticated as a normal punter / Pro user, but NOT an admin
          return {
            authorized: false,
            statusCode: 403,
            error: 'Forbidden: Administrator privileges required.'
          };
        }
      }
    }
  } catch (e) {
    console.warn('[AdminAuth] KV lookup error:', e.message);
  }

  // If candidate token has the format of a session token but was not found in KV (expired/invalid)
  if (candidateToken.startsWith('dp_sess_')) {
    return {
      authorized: false,
      statusCode: 401,
      error: 'Unauthorized: Session has expired or is invalid. Please sign in again.'
    };
  }

  // Token did not match any authorized admin record
  return {
    authorized: false,
    statusCode: 403,
    error: 'Forbidden: Invalid administrator credentials.'
  };
}
