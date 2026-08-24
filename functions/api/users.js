/**
 * Cloudflare Pages Function: /api/users
 * Real-time Global User Ledger backed by Cloudflare KV Storage (USERS_KV)
 */

const SEED_ADMIN = [
  {
    id: 'usr_adm1',
    fullName: 'Alex Nnamdi (Admin)',
    email: 'admin@deeppredictbet.com',
    username: 'Egeruennamdi78',
    role: 'PRO',
    coinsBalance: 1500,
    createdAt: '2026-08-01T10:00:00.000Z'
  }
];

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
    let members = [];
    
    if (context.env && context.env.USERS_KV) {
      const stored = await context.env.USERS_KV.get('members_list');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            members = parsed;
          }
        } catch (e) {}
      }
    }

    if (members.length === 0) {
      members = [...SEED_ADMIN];
      if (context.env && context.env.USERS_KV) {
        await context.env.USERS_KV.put('members_list', JSON.stringify(members));
      }
    }

    return new Response(JSON.stringify({
      success: true,
      totalUsers: members.length,
      users: members
    }), {
      status: 200,
      headers: corsHeaders()
    });
  } catch (err) {
    return new Response(JSON.stringify({
      success: true,
      totalUsers: 1,
      users: SEED_ADMIN
    }), {
      status: 200,
      headers: corsHeaders()
    });
  }
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const cleanEmail = (body.email || '').trim().toLowerCase();
    const cleanUser = (body.username || '').trim();
    const cleanName = (body.fullName || '').trim() || cleanUser || 'DeepPredict Member';

    if (!cleanEmail) {
      return new Response(JSON.stringify({ success: false, error: 'Email is required' }), {
        status: 400,
        headers: corsHeaders()
      });
    }

    let members = [];
    
    if (context.env && context.env.USERS_KV) {
      const stored = await context.env.USERS_KV.get('members_list');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            members = parsed;
          }
        } catch (e) {}
      }
    }

    if (members.length === 0) {
      members = [...SEED_ADMIN];
    }

    const existingIndex = members.findIndex(m =>
      (m.email || '').toLowerCase() === cleanEmail ||
      (cleanUser && (m.username || '').toLowerCase() === cleanUser.toLowerCase())
    );

    let registeredUser;
    if (existingIndex >= 0) {
      registeredUser = members[existingIndex];
      if (cleanName) registeredUser.fullName = cleanName;
      if (cleanUser) registeredUser.username = cleanUser;
      members[existingIndex] = registeredUser;
    } else {
      registeredUser = {
        id: body.id || `usr_${Math.random().toString(36).substring(2, 9)}`,
        fullName: cleanName,
        email: cleanEmail,
        username: cleanUser || cleanName.split(' ')[0] || 'Punter',
        role: body.role || 'PRO',
        coinsBalance: body.coinsBalance ?? 500,
        createdAt: body.createdAt || new Date().toISOString()
      };
      members.unshift(registeredUser);
    }

    // Persist to Cloudflare KV
    if (context.env && context.env.USERS_KV) {
      await context.env.USERS_KV.put('members_list', JSON.stringify(members));
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Account registered and synced to global cloud database!',
      user: registeredUser,
      totalUsers: members.length
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
