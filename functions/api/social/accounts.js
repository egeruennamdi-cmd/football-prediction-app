/**
 * Cloudflare Pages Function: /api/social/accounts
 * 
 * Inspects connection health, OAuth prerequisites, and credentials for all 6 social channels:
 * Telegram, X (Twitter), Instagram, Facebook Pages, TikTok, YouTube.
 * 
 * Protected strictly by Administrator Authorization Headers.
 */

import { verifyAdminAuthorization, adminCorsHeaders } from '../integrations/telegram/_adminAuth.js';
import { getSocialAccountsHealth, reconcilePlatformPublication } from './_socialAdapters.js';

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: adminCorsHeaders() });
}

export async function onRequestGet(context) {
  const { env } = context;

  // Strict Admin Privilege Verification
  const auth = await verifyAdminAuthorization(context);
  if (!auth.authorized) {
    return new Response(JSON.stringify({
      success: false,
      error: auth.error || 'Forbidden: Administrator privileges required.'
    }), {
      status: auth.statusCode || 403,
      headers: adminCorsHeaders()
    });
  }

  try {
    const accounts = await getSocialAccountsHealth(env);

    const rawMetaId = env.META_APP_ID || env.FACEBOOK_APP_ID || '';
    const rawMetaSecret = env.META_APP_SECRET || env.FACEBOOK_APP_SECRET || '';
    const cleanMetaId = String(rawMetaId).trim().replace(/^['"]|['"]$/g, '');
    const cleanMetaSecret = String(rawMetaSecret).trim().replace(/^['"]|['"]$/g, '');

    const metaDiagnostics = {
      appIdConfigured: Boolean(rawMetaId),
      appIdCleanValue: cleanMetaId || null,
      appIdMatchesExpected: cleanMetaId === '2207122310233778',
      appSecretConfigured: Boolean(rawMetaSecret),
      appSecretRawLength: rawMetaSecret.length,
      appSecretCleanLength: cleanMetaSecret.length,
      appSecretHadWhitespace: rawMetaSecret !== rawMetaSecret.trim(),
      appSecretHadQuotes: /^['"]|['"]$/.test(rawMetaSecret),
      appSecretIsHex32: /^[0-9a-f]{32}$/i.test(cleanMetaSecret),
      appSecretLooksLikeAccessToken: cleanMetaSecret.startsWith('EAA'),
      appSecretEqualsAppId: cleanMetaSecret === cleanMetaId
    };

    return new Response(JSON.stringify({
      success: true,
      timestamp: new Date().toISOString(),
      accounts,
      metaDiagnostics,
      activeChannelsCount: Object.values(accounts).filter(a => a.connected).length,
      totalChannelsCount: Object.keys(accounts).length
    }), {
      status: 200,
      headers: adminCorsHeaders()
    });
  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: `Failed to inspect social accounts: ${err.message}`
    }), {
      status: 500,
      headers: adminCorsHeaders()
    });
  }
}

export async function onRequestPost(context) {
  const { env, request } = context;

  // Strict Admin Privilege Verification
  const auth = await verifyAdminAuthorization(context);
  if (!auth.authorized) {
    return new Response(JSON.stringify({
      success: false,
      error: auth.error || 'Forbidden: Administrator privileges required.'
    }), {
      status: auth.statusCode || 403,
      headers: adminCorsHeaders()
    });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { platform, externalPostId } = body;

    if (!platform || !externalPostId) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required parameters: platform and externalPostId.'
      }), {
        status: 400,
        headers: adminCorsHeaders()
      });
    }

    const reconciliation = await reconcilePlatformPublication(env, platform, externalPostId);

    return new Response(JSON.stringify({
      success: true,
      reconciliation
    }), {
      status: 200,
      headers: adminCorsHeaders()
    });
  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: `Reconciliation error: ${err.message}`
    }), {
      status: 500,
      headers: adminCorsHeaders()
    });
  }
}
