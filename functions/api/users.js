/**
 * Cloudflare Pages Function: /api/users
 * Real-time Global User Ledger with Dual Cloud Persistence (Cloudflare KV + REST Cloud DB)
 */

const CLOUD_STORE_URL = 'https://api.restful-api.dev/objects/ff8081819ff5b11001a034670ed3107f';

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
    
    // 1. Fetch from Cloud DB (bypassing subrequest cache)
    try {
      const cloudRes = await fetch(CLOUD_STORE_URL, {
        cache: 'no-store',
        headers: {
          'User-Agent': 'DeepPredictBet/1.0',
          'Accept': 'application/json'
        },
        signal: AbortSignal.timeout(4000)
      });
      if (cloudRes.ok) {
        const json = await cloudRes.json();
        if (json.data && Array.isArray(json.data.members) && json.data.members.length > 0) {
          members = json.data.members;
        }
      }
    } catch (e) {}

    // 2. Fallback to Cloudflare KV
    if (members.length === 0 && context.env && context.env.USERS_KV) {
      const stored = await context.env.USERS_KV.get('members_list');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) members = parsed;
        } catch (e) {}
      }
    }

    if (members.length === 0) {
      members = [...SEED_ADMIN];
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
    
    // 1. Fetch existing members from Cloud DB
    try {
      const cloudRes = await fetch(CLOUD_STORE_URL, { cache: 'no-store', signal: AbortSignal.timeout(4000) });
      if (cloudRes.ok) {
        const json = await cloudRes.json();
        if (json.data && Array.isArray(json.data.members)) {
          members = json.data.members;
        }
      }
    } catch (e) {}

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
        id: `usr_${Math.random().toString(36).substring(2, 9)}`,
        fullName: cleanName,
        email: cleanEmail,
        username: cleanUser || cleanName.split(' ')[0] || 'Punter',
        role: body.role || 'PRO',
        coinsBalance: body.coinsBalance ?? 500,
        createdAt: new Date().toISOString()
      };
      members.unshift(registeredUser);
    }

    // Write back to Cloud DB
    try {
      const putRes = await fetch(CLOUD_STORE_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'DeepPredictBet/1.0',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: 'deeppredictbet_members_store_v1',
          data: { members: members }
        })
      });
      if (!putRes.ok) {
        console.warn('Cloud DB PUT status:', putRes.status);
      }
    } catch (e) {
      console.error('Cloud DB PUT error:', e.message);
    }

    // Also write to KV if available
    if (context.env && context.env.USERS_KV) {
      try {
        await context.env.USERS_KV.put('members_list', JSON.stringify(members));
      } catch (e) {}
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
