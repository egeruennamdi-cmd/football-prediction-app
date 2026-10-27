/**
 * DeepPredictBet — Server-Side Social OAuth & Secure Token Management
 * 
 * Manages official OAuth 2.0 and Graph API authorization workflows for:
 * - Meta (Instagram Professional & Facebook Pages)
 * - 𝕏 (Twitter API v2 with PKCE)
 * - TikTok Content Posting API
 * - YouTube Data API v3 (Google OAuth 2.0)
 * 
 * SECURITY RULES:
 * - Tokens are NEVER returned or exposed to client browsers.
 * - Access and refresh tokens are persisted exclusively in protected Cloudflare KV (USERS_KV).
 * - CSRF-safe state validation with cryptographically secure tokens.
 * - Automatic token refresh before expiration where providers support it.
 */

import { readKVJson, writeKVJson } from './_socialKv.js';

const STATE_TTL_SECONDS = 900; // 15 minutes

// Base OAuth Endpoints
export const OAUTH_CONFIGS = {
  instagram: {
    name: 'Instagram Business',
    authUrl: 'https://www.facebook.com/v21.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v21.0/oauth/access_token',
    scopes: ['pages_show_list', 'pages_read_engagement', 'pages_manage_posts', 'instagram_basic', 'instagram_content_publish']
  },
  facebook: {
    name: 'Facebook Pages',
    authUrl: 'https://www.facebook.com/v21.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v21.0/oauth/access_token',
    scopes: ['pages_show_list', 'pages_manage_posts', 'pages_read_engagement']
  },
  x: {
    name: '𝕏 (Twitter)',
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    tokenUrl: 'https://api.twitter.com/2/oauth2/token',
    scopes: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
    usesPkce: true
  },
  tiktok: {
    name: 'TikTok Creator',
    authUrl: 'https://www.tiktok.com/v2/auth/authorize/',
    tokenUrl: 'https://open.tiktokapis.com/v2/oauth/token/',
    scopes: ['video.publish', 'video.upload']
  },
  youtube: {
    name: 'YouTube Shorts & Channel',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scopes: ['https://www.googleapis.com/auth/youtube.upload', 'https://www.googleapis.com/auth/youtube.readonly']
  }
};

// ============================================================================
// 1. SECURE STATE & PKCE UTILITIES
// ============================================================================

/**
 * Trims extraneous whitespace, newlines, and enclosing quotes from environment credentials
 */
export function sanitizeCredential(val) {
  if (!val) return '';
  return String(val).trim().replace(/^['"]|['"]$/g, '').trim();
}

export function generateSecureRandomString(bytes = 32) {
  const array = new Uint8Array(bytes);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    // Fallback for node test runners
    for (let i = 0; i < bytes; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export async function generatePkcePair() {
  const verifier = generateSecureRandomString(32);
  let challenge = verifier;
  
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(verifier);
      const hash = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hash));
      challenge = btoa(String.fromCharCode.apply(null, hashArray))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    } catch (e) {
      challenge = verifier;
    }
  }
  return { verifier, challenge };
}

/**
 * Creates and registers a secure authorization state in KV
 */
export async function createOAuthStateRecord(env, platform, extraData = {}) {
  const state = `${platform}_${generateSecureRandomString(24)}`;
  const record = {
    state,
    platform,
    createdAt: Date.now(),
    expiresAt: Date.now() + (STATE_TTL_SECONDS * 1000),
    ...extraData
  };
  await writeKVJson(env, `social_oauth_state_${state}`, record);
  return record;
}

/**
 * Validates and consumes an OAuth state record from KV
 */
export async function verifyAndConsumeOAuthState(env, state, expectedPlatform) {
  if (!state || typeof state !== 'string') return { valid: false, error: 'Missing state parameter.' };

  const key = `social_oauth_state_${state}`;
  const record = await readKVJson(env, key, null);

  if (!record) {
    return { valid: false, error: 'Invalid or unrecognized OAuth state parameter.' };
  }

  // Check expiration
  if (Date.now() > record.expiresAt) {
    await writeKVJson(env, key, null);
    return { valid: false, error: 'OAuth state parameter has expired. Please restart the authorization.' };
  }

  // Check matching platform
  if (record.platform !== expectedPlatform) {
    return { valid: false, error: `State platform mismatch. Expected ${expectedPlatform}, got ${record.platform}.` };
  }

  // Consume state (one-time use CSRF defense)
  await writeKVJson(env, key, null);

  return { valid: true, record };
}

// ============================================================================
// 2. TOKEN STORAGE & RETRIEVAL (SERVER-SIDE KV)
// ============================================================================

export async function getPlatformConnection(env, platform) {
  const key = `social_connection_${platform}`;
  const data = await readKVJson(env, key, null);
  if (!data) return null;

  // Check token expiration
  const now = Date.now();
  const isExpired = data.expiresAt && now > data.expiresAt;
  
  return {
    ...data,
    isExpired: Boolean(isExpired)
  };
}

export async function savePlatformConnection(env, platform, connectionData) {
  const key = `social_connection_${platform}`;
  const record = {
    platform,
    accountHandle: connectionData.accountHandle || null,
    accountName: connectionData.accountName || null,
    accountId: connectionData.accountId || null,
    accessToken: connectionData.accessToken,
    refreshToken: connectionData.refreshToken || null,
    expiresAt: connectionData.expiresAt || null,
    scopes: connectionData.scopes || [],
    connectedAt: connectionData.connectedAt || new Date().toISOString(),
    lastVerifiedAt: new Date().toISOString(),
    verifiedPublish: Boolean(connectionData.verifiedPublish),
    lastTestPostId: connectionData.lastTestPostId || null,
    lastTestPostUrl: connectionData.lastTestPostUrl || null,
    reviewPending: Boolean(connectionData.reviewPending),
    revoked: Boolean(connectionData.revoked),
    extra: connectionData.extra || {}
  };
  await writeKVJson(env, key, record);
  return record;
}

export async function deletePlatformConnection(env, platform) {
  const key = `social_connection_${platform}`;
  await writeKVJson(env, key, null);
  return true;
}

// ============================================================================
// 3. AUTHORIZATION URL BUILDER
// ============================================================================

export async function buildPlatformAuthorizationUrl(env, platform, redirectUri, options = {}) {
  const config = OAUTH_CONFIGS[platform];
  if (!config) throw new Error(`Unsupported OAuth platform: ${platform}`);

  let pkce = null;
  if (config.usesPkce) {
    pkce = await generatePkcePair();
  }

  const stateRecord = await createOAuthStateRecord(env, platform, {
    redirectUri,
    codeVerifier: pkce ? pkce.verifier : null
  });

  const url = new URL(config.authUrl);

  switch (platform) {
    case 'instagram':
    case 'facebook': {
      const clientId = sanitizeCredential(env.META_APP_ID || env.FACEBOOK_APP_ID);
      if (!clientId) {
        throw new Error(`META_APP_ID is not configured in server environment.`);
      }
      url.searchParams.set('client_id', clientId);
      url.searchParams.set('redirect_uri', redirectUri);
      url.searchParams.set('state', stateRecord.state);
      url.searchParams.set('response_type', 'code');

      // Support Facebook Login for Business configuration if provided
      const platformConfigId = platform === 'instagram'
        ? (env.INSTAGRAM_CONFIG_ID || env.META_INSTAGRAM_CONFIG_ID)
        : (env.FACEBOOK_CONFIG_ID || env.META_FACEBOOK_CONFIG_ID);
      const configId = sanitizeCredential(options.configId || platformConfigId || env.META_CONFIG_ID);
      if (configId) {
        url.searchParams.set('config_id', configId);
        url.searchParams.set('override_default_response_type', 'true');
      } else {
        url.searchParams.set('scope', config.scopes.join(','));
      }
      break;
    }
    case 'x': {
      const clientId = sanitizeCredential(env.X_CLIENT_ID || env.X_API_CLIENT_ID);
      if (!clientId) {
        throw new Error(`X_CLIENT_ID is not configured in server environment.`);
      }
      url.searchParams.set('response_type', 'code');
      url.searchParams.set('client_id', clientId);
      url.searchParams.set('redirect_uri', redirectUri);
      url.searchParams.set('scope', config.scopes.join(' '));
      url.searchParams.set('state', stateRecord.state);
      url.searchParams.set('code_challenge', pkce.challenge);
      url.searchParams.set('code_challenge_method', 'S256');
      break;
    }
    case 'tiktok': {
      const clientKey = sanitizeCredential(env.TIKTOK_CLIENT_KEY);
      if (!clientKey) {
        throw new Error(`TIKTOK_CLIENT_KEY is not configured in server environment.`);
      }
      url.searchParams.set('client_key', clientKey);
      url.searchParams.set('scope', config.scopes.join(','));
      url.searchParams.set('response_type', 'code');
      url.searchParams.set('redirect_uri', redirectUri);
      url.searchParams.set('state', stateRecord.state);
      break;
    }
    case 'youtube': {
      const clientId = sanitizeCredential(env.GOOGLE_CLIENT_ID || env.YOUTUBE_CLIENT_ID);
      if (!clientId) {
        throw new Error(`GOOGLE_CLIENT_ID is not configured in server environment.`);
      }
      url.searchParams.set('client_id', clientId);
      url.searchParams.set('redirect_uri', redirectUri);
      url.searchParams.set('response_type', 'code');
      url.searchParams.set('scope', config.scopes.join(' '));
      url.searchParams.set('access_type', 'offline');
      url.searchParams.set('prompt', 'consent');
      url.searchParams.set('state', stateRecord.state);
      break;
    }
  }

  return {
    authorizationUrl: url.toString(),
    state: stateRecord.state
  };
}

// ============================================================================
// 4. TOKEN EXCHANGE & ACCOUNT DISCOVERY
// ============================================================================

export async function exchangeOAuthCodeForTokens(env, platform, code, redirectUri, stateRecord) {
  switch (platform) {
    case 'instagram':
    case 'facebook':
      return exchangeMetaCode(env, platform, code, redirectUri);
    case 'x':
      return exchangeXCode(env, code, redirectUri, stateRecord.codeVerifier);
    case 'tiktok':
      return exchangeTikTokCode(env, code, redirectUri);
    case 'youtube':
      return exchangeYouTubeCode(env, code, redirectUri);
    default:
      throw new Error(`Unsupported OAuth platform: ${platform}`);
  }
}

/**
 * META (Instagram & Facebook Pages) Token Exchange
 */
async function exchangeMetaCode(env, platform, code, redirectUri) {
  const rawClientId = env.META_APP_ID || env.FACEBOOK_APP_ID;
  const rawClientSecret = env.META_APP_SECRET || env.FACEBOOK_APP_SECRET;

  const clientId = sanitizeCredential(rawClientId);
  const clientSecret = sanitizeCredential(rawClientSecret);

  if (!clientId || !clientSecret) {
    throw new Error('META_APP_ID or META_APP_SECRET missing in server environment.');
  }

  // Step 1: Exchange code for short-lived User Access Token
  // Use POST with application/x-www-form-urlencoded to prevent query string encoding issues
  const tokenParams = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    code: sanitizeCredential(code)
  });

  const tokenRes = await fetch('https://graph.facebook.com/v21.0/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: tokenParams.toString()
  });

  if (!tokenRes.ok) {
    const errText = await tokenRes.text();
    let isSecretMismatch = false;
    try {
      const errJson = JSON.parse(errText);
      if (errJson?.error?.code === 1 || errJson?.error?.message?.includes('validating client secret')) {
        isSecretMismatch = true;
      }
    } catch (_) {}

    if (isSecretMismatch) {
      throw new Error(`Meta token exchange failed (400): Error validating client secret. The META_APP_SECRET configured in Cloudflare Pages does not match Meta App ID ${clientId}. Please verify the App Secret in Meta for Developers under App settings > Basic.`);
    }

    throw new Error(`Meta token exchange failed (${tokenRes.status}): ${errText}`);
  }

  const tokenData = await tokenRes.json();
  const shortLivedUserToken = tokenData.access_token;

  // Step 2: Exchange for long-lived User Access Token (valid for 60 days)
  const longLivedParams = new URLSearchParams({
    grant_type: 'fb_exchange_token',
    client_id: clientId,
    client_secret: clientSecret,
    fb_exchange_token: shortLivedUserToken
  });

  const longLivedRes = await fetch('https://graph.facebook.com/v21.0/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: longLivedParams.toString()
  });

  let userToken = shortLivedUserToken;
  let expiresIn = tokenData.expires_in || 5184000; // default 60 days

  if (longLivedRes.ok) {
    const longLivedData = await longLivedRes.json();
    if (longLivedData.access_token) {
      userToken = longLivedData.access_token;
      expiresIn = longLivedData.expires_in || 5184000;
    }
  } else {
    const errText = await longLivedRes.text();
    console.warn(`[Meta OAuth] Long-lived token exchange warning (${longLivedRes.status}): ${errText}`);
  }

  // Step 3: Resilient Multi-Stage Discovery of Facebook Pages & Connected Instagram Business Accounts
  const pages = [];
  const candidatePageIds = new Set();

  // Known production page ID
  candidatePageIds.add('1395609626974327');

  // Check env bindings for configured page ID
  if (env && env.FACEBOOK_PAGE_ID) {
    candidatePageIds.add(String(env.FACEBOOK_PAGE_ID).trim());
  }

  // Check existing Facebook connection in KV for page ID
  let existingFbConn = null;
  try {
    existingFbConn = await getPlatformConnection(env, 'facebook');
    if (existingFbConn && existingFbConn.accountId) {
      candidatePageIds.add(String(existingFbConn.accountId).trim());
    }
  } catch (_) {}

  // Stage 3A: Inspect token via debug_token to extract granted target_ids from granular_scopes
  try {
    const debugUrl = `https://graph.facebook.com/v21.0/debug_token?input_token=${encodeURIComponent(userToken)}&access_token=${encodeURIComponent(`${clientId}|${clientSecret}`)}`;
    const debugRes = await fetch(debugUrl);
    if (debugRes.ok) {
      const debugData = await debugRes.json();
      const granularScopes = debugData?.data?.granular_scopes || [];
      for (const gs of granularScopes) {
        if (Array.isArray(gs.target_ids)) {
          for (const tid of gs.target_ids) {
            if (tid) candidatePageIds.add(String(tid).trim());
          }
        }
      }
    }
  } catch (err) {
    console.warn(`[Meta OAuth] debug_token inspection warning: ${err.message}`);
  }

  // Stage 3B: Query /me/accounts with limit=100 and pagination
  try {
    let nextUrl = `https://graph.facebook.com/v21.0/me/accounts?fields=id,name,access_token,instagram_business_account{id,username,name}&limit=100&access_token=${encodeURIComponent(userToken)}`;
    let pageIterations = 0;
    while (nextUrl && pageIterations < 3) {
      pageIterations++;
      const meAccountsRes = await fetch(nextUrl);
      if (meAccountsRes.ok) {
        const meAccountsData = await meAccountsRes.json();
        const batch = meAccountsData.data || [];
        for (const p of batch) {
          if (p && p.id && !pages.some(existing => existing.id === p.id)) {
            pages.push(p);
          }
        }
        nextUrl = meAccountsData.paging?.next || null;
      } else {
        const errText = await meAccountsRes.text();
        console.warn(`[Meta OAuth] /me/accounts warning (${meAccountsRes.status}): ${errText}`);
        break;
      }
    }
  } catch (err) {
    console.warn(`[Meta OAuth] /me/accounts fetch error: ${err.message}`);
  }

  // Stage 3C: Fallback Direct Page Node Query for all Candidate Page IDs
  // If pages list is empty OR none of the pages have an instagram_business_account (when platform === 'instagram')
  const needsDirectLookup = pages.length === 0 || (platform === 'instagram' && !pages.some(p => p.instagram_business_account?.id));

  if (needsDirectLookup && candidatePageIds.size > 0) {
    for (const pageId of candidatePageIds) {
      if (!pageId) continue;
      // 1. Query with userToken
      try {
        const directPageRes = await fetch(
          `https://graph.facebook.com/v21.0/${encodeURIComponent(pageId)}?fields=id,name,access_token,instagram_business_account{id,username,name}&access_token=${encodeURIComponent(userToken)}`
        );
        if (directPageRes.ok) {
          const directPageData = await directPageRes.json();
          if (directPageData && directPageData.id) {
            const existingIdx = pages.findIndex(p => p.id === directPageData.id);
            if (existingIdx >= 0) {
              pages[existingIdx] = { ...pages[existingIdx], ...directPageData };
            } else {
              pages.push(directPageData);
            }
          }
        }
      } catch (err) {
        console.warn(`[Meta OAuth] Direct query for page ${pageId} with user token warning: ${err.message}`);
      }

      // 2. Query with fallback Page Access Token (from existing Facebook connection in KV or env)
      const existingPage = pages.find(p => p.id === pageId);
      const fallbackToken = existingPage?.access_token || existingFbConn?.accessToken || (env && env.FACEBOOK_PAGE_ACCESS_TOKEN);

      if (fallbackToken && (!existingPage || !existingPage.instagram_business_account?.id)) {
        try {
          const directTokenRes = await fetch(
            `https://graph.facebook.com/v21.0/${encodeURIComponent(pageId)}?fields=id,name,access_token,instagram_business_account{id,username,name}&access_token=${encodeURIComponent(fallbackToken)}`
          );
          if (directTokenRes.ok) {
            const tokenPageData = await directTokenRes.json();
            if (tokenPageData && tokenPageData.id) {
              tokenPageData.access_token = tokenPageData.access_token || fallbackToken;
              const existingIdx = pages.findIndex(p => p.id === tokenPageData.id);
              if (existingIdx >= 0) {
                pages[existingIdx] = { ...pages[existingIdx], ...tokenPageData };
              } else {
                pages.push(tokenPageData);
              }
            }
          }
        } catch (err) {
          console.warn(`[Meta OAuth] Direct query for page ${pageId} with page token warning: ${err.message}`);
        }
      }

      // 3. Dedicated edge query for instagram_business_account or connected_instagram_account
      const curPage = pages.find(p => p.id === pageId);
      if (curPage && !curPage.instagram_business_account?.id) {
        const queryToken = curPage.access_token || fallbackToken || userToken;
        try {
          const igEdgeRes = await fetch(
            `https://graph.facebook.com/v21.0/${encodeURIComponent(pageId)}?fields=connected_instagram_account,instagram_business_account{id,username,name}&access_token=${encodeURIComponent(queryToken)}`
          );
          if (igEdgeRes.ok) {
            const edgeData = await igEdgeRes.json();
            if (edgeData.instagram_business_account?.id) {
              curPage.instagram_business_account = edgeData.instagram_business_account;
            } else if (edgeData.connected_instagram_account?.id) {
              curPage.instagram_business_account = edgeData.connected_instagram_account;
            }
          }
        } catch (_) {}
      }
    }
  }

  // If still no pages found at all
  if (pages.length === 0) {
    throw new Error('No Facebook Pages found for this user. A Facebook Page is required to publish.');
  }

  // Select target page: prioritize DeepPredictBet if available, otherwise first
  let targetPage;
  if (platform === 'instagram') {
    targetPage = pages.find(p => p.instagram_business_account && p.instagram_business_account.id && p.name && p.name.toLowerCase().includes('deeppredictbet'))
      || pages.find(p => p.instagram_business_account && p.instagram_business_account.id)
      || pages.find(p => p.name && p.name.toLowerCase().includes('deeppredictbet'))
      || pages[0];
  } else {
    targetPage = pages.find(p => p.name && p.name.toLowerCase().includes('deeppredictbet')) || pages[0];
  }

  // Page token resolution
  let pageAccessToken = targetPage.access_token;
  if (!pageAccessToken) {
    if (existingFbConn && existingFbConn.accountId === targetPage.id && existingFbConn.accessToken) {
      pageAccessToken = existingFbConn.accessToken;
    } else if (env && env.FACEBOOK_PAGE_ACCESS_TOKEN && (!env.FACEBOOK_PAGE_ID || env.FACEBOOK_PAGE_ID === targetPage.id)) {
      pageAccessToken = env.FACEBOOK_PAGE_ACCESS_TOKEN;
    }
  }

  const pageId = targetPage.id;
  const pageName = targetPage.name || 'DeepPredictBet';

  if (platform === 'facebook') {
    if (!pageAccessToken) {
      throw new Error(`Unable to resolve Page Access Token for Facebook Page "${pageName}" (${pageId}).`);
    }
    return {
      accessToken: pageAccessToken,
      accountId: pageId,
      accountName: pageName,
      accountHandle: pageName,
      expiresAt: Date.now() + (expiresIn * 1000),
      scopes: OAUTH_CONFIGS.facebook.scopes,
      extra: { pageId, pageName }
    };
  }

  // Instagram resolution
  let igAccount = targetPage.instagram_business_account;

  // If igAccount was not nested, try direct edge check one more time with pageAccessToken
  if ((!igAccount || !igAccount.id) && pageAccessToken) {
    try {
      const igEdgeRes = await fetch(`https://graph.facebook.com/v21.0/${encodeURIComponent(pageId)}?fields=instagram_business_account{id,username,name}&access_token=${encodeURIComponent(pageAccessToken)}`);
      if (igEdgeRes.ok) {
        const edgeData = await igEdgeRes.json();
        if (edgeData.instagram_business_account?.id) {
          igAccount = edgeData.instagram_business_account;
        }
      }
    } catch (_) {}
  }

  if (!igAccount || !igAccount.id) {
    throw new Error(`No Instagram Professional account found connected to Facebook Page "${pageName}" (${pageId}). Please ensure your Instagram profile (@deeppredictbet) is converted to a Professional (Business or Creator) account and linked to "${pageName}" in Meta Business Suite or Facebook Page Settings > Linked Accounts.`);
  }

  // Ensure Instagram username and name are resolved
  let igUsername = igAccount.username;
  let igName = igAccount.name;
  if (!igUsername && (pageAccessToken || userToken)) {
    try {
      const tokenToUse = pageAccessToken || userToken;
      const igDetailRes = await fetch(`https://graph.facebook.com/v21.0/${encodeURIComponent(igAccount.id)}?fields=id,username,name&access_token=${encodeURIComponent(tokenToUse)}`);
      if (igDetailRes.ok) {
        const igDetail = await igDetailRes.json();
        igUsername = igDetail.username || igUsername;
        igName = igDetail.name || igName;
      }
    } catch (_) {}
  }

  // Format account handle cleanly (e.g. "@deeppredictbet")
  const resolvedHandle = igUsername
    ? (igUsername.startsWith('@') ? igUsername : `@${igUsername}`)
    : '@deeppredictbet';

  return {
    accessToken: pageAccessToken || userToken, // Page access token publishes on behalf of linked IG account
    accountId: igAccount.id,
    accountName: igName || igUsername || 'DeepPredictBet',
    accountHandle: resolvedHandle,
    expiresAt: Date.now() + (expiresIn * 1000),
    scopes: OAUTH_CONFIGS.instagram.scopes,
    extra: {
      instagramAccountId: igAccount.id,
      linkedPageId: pageId,
      linkedPageName: pageName
    }
  };
}

/**
 * 𝕏 (Twitter) Token Exchange with PKCE
 */
async function exchangeXCode(env, code, redirectUri, codeVerifier) {
  const clientId = sanitizeCredential(env.X_CLIENT_ID || env.X_API_CLIENT_ID);
  const clientSecret = sanitizeCredential(env.X_CLIENT_SECRET || env.X_API_CLIENT_SECRET);

  if (!clientId) {
    throw new Error('X_CLIENT_ID is not configured in server environment.');
  }

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  // If clientSecret is configured (confidential client), pass Basic Auth
  if (clientSecret) {
    headers['Authorization'] = `Basic ${btoa(`${clientId}:${clientSecret}`)}`;
  }

  const bodyParams = new URLSearchParams({
    code: sanitizeCredential(code),
    grant_type: 'authorization_code',
    client_id: clientId,
    redirect_uri: redirectUri,
    code_verifier: sanitizeCredential(codeVerifier) || ''
  });

  const res = await fetch('https://api.twitter.com/2/oauth2/token', {
    method: 'POST',
    headers,
    body: bodyParams.toString()
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`X token exchange failed (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const accessToken = data.access_token;
  const refreshToken = data.refresh_token || null;
  const expiresIn = data.expires_in || 7200; // 2 hours default

  // Discover authenticated user handle
  let userHandle = '@DeepPredictBet';
  let userId = null;
  try {
    const userRes = await fetch('https://api.twitter.com/2/users/me', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    if (userRes.ok) {
      const userData = await userRes.json();
      if (userData.data) {
        userHandle = `@${userData.data.username}`;
        userId = userData.data.id;
      }
    }
  } catch (e) {}

  return {
    accessToken,
    refreshToken,
    accountId: userId,
    accountHandle: userHandle,
    accountName: 'DeepPredictBet',
    expiresAt: Date.now() + (expiresIn * 1000),
    scopes: data.scope ? data.scope.split(' ') : OAUTH_CONFIGS.x.scopes
  };
}

/**
 * TikTok Token Exchange
 */
async function exchangeTikTokCode(env, code, redirectUri) {
  const clientKey = sanitizeCredential(env.TIKTOK_CLIENT_KEY);
  const clientSecret = sanitizeCredential(env.TIKTOK_CLIENT_SECRET);

  if (!clientKey || !clientSecret) {
    throw new Error('TIKTOK_CLIENT_KEY or TIKTOK_CLIENT_SECRET missing in server environment.');
  }

  const bodyParams = new URLSearchParams({
    client_key: clientKey,
    client_secret: clientSecret,
    code: sanitizeCredential(code),
    grant_type: 'authorization_code',
    redirect_uri: redirectUri
  });

  const res = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: bodyParams.toString()
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`TikTok token exchange failed (${res.status}): ${errText}`);
  }

  const data = await res.json();
  if (data.error && data.error.code) {
    throw new Error(`TikTok token error: ${data.error.message}`);
  }

  const tokenPayload = data.data || data;
  return {
    accessToken: tokenPayload.access_token,
    refreshToken: tokenPayload.refresh_token,
    accountId: tokenPayload.open_id,
    accountHandle: '@deeppredictbet',
    accountName: 'DeepPredictBet Official',
    expiresAt: Date.now() + ((tokenPayload.expires_in || 86400) * 1000),
    scopes: tokenPayload.scope ? tokenPayload.scope.split(',') : OAUTH_CONFIGS.tiktok.scopes
  };
}

/**
 * YouTube (Google OAuth 2.0) Token Exchange
 */
async function exchangeYouTubeCode(env, code, redirectUri) {
  const clientId = sanitizeCredential(env.GOOGLE_CLIENT_ID || env.YOUTUBE_CLIENT_ID);
  const clientSecret = sanitizeCredential(env.GOOGLE_CLIENT_SECRET || env.YOUTUBE_CLIENT_SECRET);

  if (!clientId || !clientSecret) {
    throw new Error('GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET missing in server environment.');
  }

  const bodyParams = new URLSearchParams({
    code: sanitizeCredential(code),
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code'
  });

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: bodyParams.toString()
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Google YouTube token exchange failed (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const accessToken = data.access_token;
  const refreshToken = data.refresh_token || null;
  const expiresIn = data.expires_in || 3600;

  // Discover channel title
  let channelTitle = 'DeepPredictBet TV';
  let channelId = null;
  try {
    const chRes = await fetch('https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    if (chRes.ok) {
      const chData = await chRes.json();
      if (chData.items && chData.items[0]) {
        channelTitle = chData.items[0].snippet.title;
        channelId = chData.items[0].id;
      }
    }
  } catch (e) {}

  return {
    accessToken,
    refreshToken,
    accountId: channelId,
    accountHandle: channelTitle,
    accountName: channelTitle,
    expiresAt: Date.now() + (expiresIn * 1000),
    scopes: OAUTH_CONFIGS.youtube.scopes
  };
}

// ============================================================================
// 5. AUTOMATIC REFRESH ROUTINE
// ============================================================================

/**
 * Refreshes an expired or expiring access token using stored refresh token
 */
export async function refreshPlatformTokenIfNeeded(env, platform) {
  const conn = await getPlatformConnection(env, platform);
  if (!conn || !conn.refreshToken) return conn;

  // If token expires in more than 10 minutes, no refresh needed
  const tenMinutesMs = 10 * 60 * 1000;
  if (conn.expiresAt && (conn.expiresAt - Date.now()) > tenMinutesMs) {
    return conn;
  }

  try {
    let newAccessToken = null;
    let newExpiresIn = null;

    if (platform === 'youtube') {
      const clientId = env.GOOGLE_CLIENT_ID || env.YOUTUBE_CLIENT_ID;
      const clientSecret = env.GOOGLE_CLIENT_SECRET || env.YOUTUBE_CLIENT_SECRET;
      const res = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: conn.refreshToken,
          grant_type: 'refresh_token'
        }).toString()
      });
      if (res.ok) {
        const data = await res.json();
        newAccessToken = data.access_token;
        newExpiresIn = data.expires_in;
      }
    } else if (platform === 'x') {
      const clientId = env.X_CLIENT_ID || env.X_API_CLIENT_ID;
      const clientSecret = env.X_CLIENT_SECRET || env.X_API_CLIENT_SECRET;
      const res = await fetch('https://api.twitter.com/2/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          ...(clientSecret ? { 'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}` } : {})
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: clientId,
          refresh_token: conn.refreshToken
        }).toString()
      });
      if (res.ok) {
        const data = await res.json();
        newAccessToken = data.access_token;
        newExpiresIn = data.expires_in;
        if (data.refresh_token) conn.refreshToken = data.refresh_token;
      }
    }

    if (newAccessToken) {
      conn.accessToken = newAccessToken;
      conn.expiresAt = Date.now() + ((newExpiresIn || 3600) * 1000);
      conn.lastVerifiedAt = new Date().toISOString();
      await savePlatformConnection(env, platform, conn);
    }
  } catch (e) {
    console.warn(`[SocialAuth] Token refresh failed for ${platform}:`, e.message);
  }

  return conn;
}
