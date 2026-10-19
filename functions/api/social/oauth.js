/**
 * Cloudflare Pages Function: /api/social/oauth
 * 
 * Secure OAuth 2.0 and API Connection Gateway for Social Channels:
 * - Instagram Professional (Meta Graph API)
 * - Facebook Pages (Meta Graph API)
 * - 𝕏 (Twitter API v2 PKCE)
 * - TikTok Content Posting API
 * - YouTube Data API v3 (Google OAuth 2.0)
 * 
 * Endpoints:
 * - GET ?action=authorize&platform=... -> Returns authorizationUrl with secure state
 * - GET ?action=callback&code=...&state=... -> OAuth callback, token exchange & KV persistence
 * - POST { action: 'disconnect', platform: '...' } -> Revokes and purges stored credentials
 * - POST { action: 'refresh', platform: '...' } -> Forces token refresh
 * - POST { action: 'test-publish', platform: '...' } -> Controlled publication test
 */

import { verifyAdminAuthorization, adminCorsHeaders } from '../integrations/telegram/_adminAuth.js';
import {
  buildPlatformAuthorizationUrl,
  verifyAndConsumeOAuthState,
  exchangeOAuthCodeForTokens,
  savePlatformConnection,
  deletePlatformConnection,
  getPlatformConnection,
  refreshPlatformTokenIfNeeded
} from './_socialAuth.js';
import { dispatchInstagram, dispatchFacebook, dispatchX, dispatchTikTok, dispatchYouTube } from './_socialAdapters.js';

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: adminCorsHeaders() });
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const action = url.searchParams.get('action') || 'authorize';

  // 1. OAUTH CALLBACK (Provider redirects here with code & state)
  if (action === 'callback' || url.searchParams.has('code')) {
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error') || url.searchParams.get('error_description');

    if (error) {
      return renderOAuthResultHtml(false, `Provider returned authorization error: ${error}`);
    }

    if (!code || !state) {
      return renderOAuthResultHtml(false, 'Missing authorization code or state parameter.');
    }

    // Determine platform prefix from state e.g. "instagram_abc123"
    const platform = state.split('_')[0];
    const stateVerification = await verifyAndConsumeOAuthState(env, state, platform);
    if (!stateVerification.valid) {
      return renderOAuthResultHtml(false, stateVerification.error);
    }

    // Resolve redirectUri strictly from the validated server-side state record
    const storedRedirectUri = stateVerification.record && stateVerification.record.redirectUri;
    let redirectUri = storedRedirectUri;

    if (platform === 'tiktok') {
      const expectedCleanCallback = `${url.origin}/api/social/oauth`;
      if (!storedRedirectUri || storedRedirectUri !== expectedCleanCallback) {
        return renderOAuthResultHtml(false, `Invalid OAuth redirect URI for TikTok. Expected "${expectedCleanCallback}".`);
      }
      redirectUri = storedRedirectUri;
    } else {
      const defaultCallback = `${url.origin}/api/social/oauth?action=callback`;
      if (!redirectUri) {
        redirectUri = defaultCallback;
      }
    }

    try {
      const tokens = await exchangeOAuthCodeForTokens(env, platform, code, redirectUri, stateVerification.record);

      await savePlatformConnection(env, platform, tokens);

      return renderOAuthResultHtml(true, `Successfully connected ${tokens.accountName || platform} (${tokens.accountHandle || 'Authorized'})!`);
    } catch (err) {
      return renderOAuthResultHtml(false, `Token exchange failed: ${err.message}`);
    }
  }

  // 2. AUTHORIZE URL GENERATOR (Requires Admin Auth)
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

  const platform = url.searchParams.get('platform');
  if (!platform) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Missing required parameter: platform.'
    }), { status: 400, headers: adminCorsHeaders() });
  }

  try {
    const redirectUri = platform === 'tiktok'
      ? `${url.origin}/api/social/oauth`
      : `${url.origin}/api/social/oauth?action=callback`;
    const { authorizationUrl, state } = await buildPlatformAuthorizationUrl(env, platform, redirectUri);

    return new Response(JSON.stringify({
      success: true,
      platform,
      authorizationUrl,
      state
    }), { status: 200, headers: adminCorsHeaders() });
  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: `Failed to generate authorization URL: ${err.message}`
    }), { status: 500, headers: adminCorsHeaders() });
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;

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
    const { action, platform } = body;

    if (!platform) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required parameter: platform.'
      }), { status: 400, headers: adminCorsHeaders() });
    }

    // 1. DISCONNECT
    if (action === 'disconnect') {
      await deletePlatformConnection(env, platform);
      return new Response(JSON.stringify({
        success: true,
        platform,
        status: 'DISCONNECTED',
        message: `${platform.toUpperCase()} account has been securely disconnected and revoked.`
      }), { status: 200, headers: adminCorsHeaders() });
    }

    // 2. REFRESH TOKEN
    if (action === 'refresh') {
      const refreshed = await refreshPlatformTokenIfNeeded(env, platform);
      return new Response(JSON.stringify({
        success: true,
        platform,
        status: refreshed && !refreshed.isExpired ? 'CONNECTED' : 'EXPIRED',
        expiresAt: refreshed ? refreshed.expiresAt : null
      }), { status: 200, headers: adminCorsHeaders() });
    }

    // 3. CONTROLLED TEST PUBLISH
    if (action === 'test-publish') {
      const testPayload = {
        copy: body.copy || `⚡ [DeepPredictBet Test Beacon] Statistical AI Engine sync verified at ${new Date().toLocaleTimeString()} UTC. 18+ gamble responsibly.`,
        mediaUrl: body.mediaUrl || 'https://deeppredictbet.com/assets/logo-3d.png',
        title: 'DeepPredictBet AI Engine Beacon Test'
      };

      let dispatchRes;
      switch (platform) {
        case 'instagram':
          dispatchRes = await dispatchInstagram(env, testPayload);
          break;
        case 'facebook':
          dispatchRes = await dispatchFacebook(env, testPayload);
          break;
        case 'x':
          dispatchRes = await dispatchX(env, testPayload);
          break;
        case 'tiktok':
          dispatchRes = await dispatchTikTok(env, testPayload);
          break;
        case 'youtube':
          dispatchRes = await dispatchYouTube(env, testPayload);
          break;
        default:
          throw new Error(`Unsupported test platform: ${platform}`);
      }

      if (dispatchRes.status === 'SUCCESS') {
        const conn = await getPlatformConnection(env, platform);
        if (conn) {
          conn.verifiedPublish = true;
          conn.lastTestPostId = dispatchRes.externalPostId || null;
          conn.lastTestPostUrl = dispatchRes.publishedUrl || null;
          conn.lastVerifiedAt = new Date().toISOString();
          await savePlatformConnection(env, platform, conn);
        }
      }

      return new Response(JSON.stringify({
        success: dispatchRes.status === 'SUCCESS',
        platform,
        result: dispatchRes
      }), { status: 200, headers: adminCorsHeaders() });
    }

    return new Response(JSON.stringify({
      success: false,
      error: `Unrecognized action: ${action}`
    }), { status: 400, headers: adminCorsHeaders() });

  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: `OAuth API error: ${err.message}`
    }), { status: 500, headers: adminCorsHeaders() });
  }
}

function renderOAuthResultHtml(success, message) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>DeepPredictBet &bull; Social Connection</title>
  <style>
    body {
      background: #0b1329;
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
    }
    .card {
      background: rgba(15, 23, 42, 0.9);
      border: 1px solid ${success ? '#10b981' : '#ef4444'};
      border-radius: 16px;
      padding: 32px 28px;
      text-align: center;
      max-width: 440px;
      box-shadow: 0 12px 40px rgba(0,0,0,0.6);
    }
    .icon { font-size: 3rem; margin-bottom: 12px; }
    h2 { margin: 0 0 10px; font-size: 1.3rem; }
    p { font-size: 0.9rem; color: #94a3b8; line-height: 1.5; margin-bottom: 24px; }
    a {
      display: inline-block;
      background: #38bdf8;
      color: #022c22;
      font-weight: 800;
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 8px;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">${success ? '✅' : '❌'}</div>
    <h2>${success ? 'Account Connected' : 'Connection Failed'}</h2>
    <p>${message}</p>
    <a href="/admin#social">Return to Founder Command Center</a>
  </div>
  <script>
    setTimeout(() => {
      if (window.opener) {
        window.opener.postMessage({ type: 'DP_SOCIAL_OAUTH_COMPLETE', success: ${success} }, '*');
        window.close();
      } else {
        window.location.href = '/admin#social';
      }
    }, 2500);
  </script>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}
