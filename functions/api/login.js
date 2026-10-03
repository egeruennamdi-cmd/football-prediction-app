/**
 * Cloudflare Pages Function: /api/login
 * Authoritative Server-Side User Credential Verification
 * Backed by Cloudflare KV Storage (members_list ledger)
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
  // 1. Native Cloudflare Pages KV binding
  if (context.env && context.env.USERS_KV) {
    try {
      const stored = await context.env.USERS_KV.get('members_list');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return [...SEED_ADMIN];
    } catch (e) {}
  }

  // 2. Direct Cloudflare KV REST fetch fallback
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

  return [...SEED_ADMIN];
}

async function saveMembers(context, members) {
  // 1. Native Cloudflare Pages KV binding
  if (context.env && context.env.USERS_KV) {
    try {
      await context.env.USERS_KV.put('members_list', JSON.stringify(members));
      return true;
    } catch (e) {}
  }

  // 2. Direct Cloudflare KV REST fetch fallback
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

async function sha256(plain) {
  if (!plain) return '';
  try {
    const enc = new TextEncoder().encode(plain);
    const buf = await crypto.subtle.digest('SHA-256', enc);
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    return '';
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json().catch(() => ({}));
    const rawIdentifier = (body.identifier || body.email || body.username || '').trim();
    const cleanId = rawIdentifier.toLowerCase();
    const inputHash = (body.passwordHash || '').trim();
    const rawPassword = (body.password || '').trim();

    if (!cleanId) {
      return new Response(JSON.stringify({
        success: false,
        code: 'MISSING_IDENTIFIER',
        error: 'Please enter your registered email address or username.'
      }), {
        status: 400,
        headers: corsHeaders()
      });
    }

    if (!inputHash && !rawPassword) {
      return new Response(JSON.stringify({
        success: false,
        code: 'MISSING_PASSWORD',
        error: 'Please enter your password.'
      }), {
        status: 400,
        headers: corsHeaders()
      });
    }

    const members = await getMembers(context);

    // Locate user in authoritative KV ledger by normalized email or username
    const userIndex = members.findIndex(m =>
      (m.email && m.email.trim().toLowerCase() === cleanId) ||
      (m.username && m.username.trim().toLowerCase() === cleanId)
    );

    if (userIndex < 0) {
      return new Response(JSON.stringify({
        success: false,
        code: 'USER_NOT_FOUND',
        error: `No registered account found for "${rawIdentifier}". Unregistered users are not permitted to log in. Please click Create Account to register.`
      }), {
        status: 404,
        headers: corsHeaders()
      });
    }

    const user = members[userIndex];

    const isAdminUser = (
      user.email === 'admin@deeppredictbet.com' ||
      user.email === 'egeruennamdi@gmail.com' ||
      (user.username && user.username.toLowerCase() === 'egeruennamdi78') ||
      (user.username && user.username.toLowerCase() === 'egeruennamdi')
    );

    const isPasskeyMatch = isAdminUser && (
      rawPassword === 'Egeruennamdi78' ||
      rawPassword === 'deep_admin_78_key' ||
      rawPassword === 'admin123'
    );

    // Compute server-side SHA-256 hash if rawPassword is provided
    const serverHash = rawPassword ? await sha256(rawPassword) : '';
    const candidateHash = inputHash || serverHash;

    // Authoritative credential verification:
    // 1. Hardcoded admin master key (if admin)
    // 2. SHA-256 hash match against stored passwordHash
    // 3. Client inputHash match against stored passwordHash
    // 4. Plaintext match against stored passwordHash (legacy accounts)
    // 5. Plaintext match against stored password (legacy accounts)
    // 6. SHA-256 match if stored password was plaintext
    // 7. Fallback for unconfigured accounts without password or hash
    const isPasswordValid = isPasskeyMatch ||
      (user.passwordHash && candidateHash && user.passwordHash === candidateHash) ||
      (user.passwordHash && inputHash && user.passwordHash === inputHash) ||
      (user.passwordHash && rawPassword && user.passwordHash === rawPassword) ||
      (user.password && rawPassword && user.password === rawPassword) ||
      (user.password && candidateHash && await sha256(user.password) === candidateHash) ||
      (!user.passwordHash && !user.password && rawPassword === 'password123');

    if (!isPasswordValid) {
      return new Response(JSON.stringify({
        success: false,
        code: 'INVALID_PASSWORD',
        error: 'Incorrect Password. The password you entered does not match our records. Please try again or click Forgot Password to reset it.'
      }), {
        status: 401,
        headers: corsHeaders()
      });
    }

    // If user's stored hash is legacy plaintext, upgrade to SHA-256 hash in ledger
    if (candidateHash && (!user.passwordHash || user.passwordHash === rawPassword)) {
      user.passwordHash = candidateHash;
      user.passwordUpdatedAt = new Date().toISOString();
    }

    // Create cryptographically secure session metadata
    let randomPart = '';
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      randomPart = crypto.randomUUID().replace(/-/g, '');
    } else {
      randomPart = Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    }
    const sessionId = `dp_sess_${randomPart}`;
    const sessionExpiresAt = Date.now() + (30 * 24 * 60 * 60 * 1000); // 30 days

    user.sessionId = sessionId;
    user.sessionExpiresAt = sessionExpiresAt;
    user.lastActiveAt = new Date().toISOString();
    user.lastLoginAt = new Date().toISOString();
    members[userIndex] = user;

    // Persist session update authoritatively to KV
    await saveMembers(context, members);

    const safeUser = { ...user };
    delete safeUser.passwordHash;
    delete safeUser.resetToken;
    delete safeUser.resetTokenExpires;

    return new Response(JSON.stringify({
      success: true,
      message: 'Login successful',
      user: safeUser,
      sessionId: sessionId,
      sessionExpiresAt: sessionExpiresAt
    }), {
      status: 200,
      headers: corsHeaders()
    });

  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      code: 'SERVER_ERROR',
      error: err.message || 'Authentication service error'
    }), {
      status: 500,
      headers: corsHeaders()
    });
  }
}
