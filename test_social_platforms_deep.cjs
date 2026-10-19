/**
 * DeepPredictBet — Five Social Media Channels Activation & Security Deep Test Suite
 * 
 * Verifies the transformation of the 5 channels (Instagram, Facebook, X, TikTok, YouTube)
 * from manual-only workflows into real, authorized, secure integrations.
 * 
 * Test Categories:
 * 1. Unauthorized Access & Insecure Query Param Rejection (Admin RBAC Gate)
 * 2. OAuth State Security, PKCE Generation & CSRF Consumption
 * 3. Instagram Professional (Meta Graph API) Integration & Lifecycle
 * 4. Facebook Pages (Meta Graph API) Integration & Lifecycle
 * 5. 𝕏 (Twitter API v2) Integration & Character Limits
 * 6. TikTok Content Posting API Integration & Video Requirements
 * 7. YouTube Data API v3 Shorts/Video Integration & Metadata Limits
 * 8. Account Disconnection, Reconnection & Token Expiration
 * 9. Multi-Platform Dispatch, Idempotency & Duplicate Prevention
 * 10. Uncertain Outome Handling & Status Reconciliation
 * 11. Preservation of Existing Telegram Broadcaster & Platform Systems
 */

const assert = require('assert');

// In-Memory Cloudflare KV Mock
class MockKV {
  constructor() {
    this.store = new Map();
  }
  async get(key) {
    return this.store.has(key) ? this.store.get(key) : null;
  }
  async put(key, value) {
    this.store.set(key, typeof value === 'string' ? value : JSON.stringify(value));
    return true;
  }
  async delete(key) {
    this.store.delete(key);
    return true;
  }
}

let passedCount = 0;
let failedCount = 0;

async function test(name, fn) {
  try {
    await fn();
    console.log(`  ✅ PASS: ${name}`);
    passedCount++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}`);
    failedCount++;
  }
}

async function runAllTests() {
  console.log('🧪 Starting DeepPredictBet Social Media Activation Deep Test Suite...\n');

  // Import Backend Modules
  const {
    getPlatformConnection,
    savePlatformConnection,
    deletePlatformConnection,
    createOAuthStateRecord,
    verifyAndConsumeOAuthState,
    generatePkcePair,
    buildPlatformAuthorizationUrl
  } = await import('./functions/api/social/_socialAuth.js');

  const {
    getSocialAccountsHealth,
    dispatchInstagram,
    dispatchFacebook,
    dispatchX,
    dispatchTikTok,
    dispatchYouTube,
    executeMultiPlatformDispatch,
    reconcilePlatformPublication
  } = await import('./functions/api/social/_socialAdapters.js');

  const {
    saveSocialContent,
    checkDuplicateSocialContent,
    computeContentFingerprint,
    SOCIAL_LIFECYCLE_STATES,
    SOCIAL_CONTENT_CATEGORIES
  } = await import('./functions/api/social/_socialKv.js');

  const { onRequestGet: oauthGet, onRequestPost: oauthPost } = await import('./functions/api/social/oauth.js');
  const { onRequestGet: accountsGet } = await import('./functions/api/social/accounts.js');
  const { onRequestPost: publishPost } = await import('./functions/api/social/publish.js');

  // Base mock environment with USERS_KV
  const mockEnv = {
    USERS_KV: new MockKV(),
    ADMIN_SECRET_KEY: 'test_admin_secret_key_2026',
    TELEGRAM_BOT_TOKEN: '123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11',
    META_APP_ID: 'mock_meta_app_id_999',
    META_APP_SECRET: 'mock_meta_app_secret_888',
    X_CLIENT_ID: 'mock_x_client_id_777',
    X_CLIENT_SECRET: 'mock_x_client_secret_666',
    TIKTOK_CLIENT_KEY: 'mock_tiktok_client_key_555',
    TIKTOK_CLIENT_SECRET: 'mock_tiktok_client_secret_444',
    GOOGLE_CLIENT_ID: 'mock_google_client_id_333',
    GOOGLE_CLIENT_SECRET: 'mock_google_client_secret_222'
  };

  const adminHeaders = {
    'Authorization': 'Bearer deep_admin_78_key',
    'Content-Type': 'application/json'
  };

  // Mock Global Fetch
  const originalFetch = global.fetch;

  // ==========================================================================
  // SECTION 1: UNAUTHORIZED ACCESS & ADMIN SECURITY
  // ==========================================================================
  console.log('--- 1. Unauthorized Access & Admin RBAC Gate ---');

  await test('GET /api/social/oauth: Rejects missing Authorization header with 401', async () => {
    const res = await oauthGet({
      request: new Request('https://deeppredictbet.com/api/social/oauth?action=authorize&platform=instagram', {
        headers: {}
      }),
      env: mockEnv
    });
    assert.strictEqual(res.status, 401);
    const data = await res.json();
    assert.strictEqual(data.success, false);
  });

  await test('GET /api/social/oauth: Rejects credential passed in URL query param with 400', async () => {
    const res = await oauthGet({
      request: new Request('https://deeppredictbet.com/api/social/oauth?action=authorize&platform=instagram&adminKey=deep_admin_78_key', {
        headers: adminHeaders
      }),
      env: mockEnv
    });
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.ok(data.error.includes('URL query parameters'));
  });

  await test('POST /api/social/oauth: Rejects non-admin session with 403 Forbidden', async () => {
    const res = await oauthPost({
      request: new Request('https://deeppredictbet.com/api/social/oauth', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer punter_regular_user_token' },
        body: JSON.stringify({ action: 'disconnect', platform: 'instagram' })
      }),
      env: mockEnv
    });
    assert.strictEqual(res.status, 403);
  });

  await test('GET /api/social/oauth: Authorizes administrator and generates Instagram OAuth URL', async () => {
    const res = await oauthGet({
      request: new Request('https://deeppredictbet.com/api/social/oauth?action=authorize&platform=instagram', {
        headers: adminHeaders
      }),
      env: mockEnv
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.platform, 'instagram');
    assert.ok(data.authorizationUrl.includes('facebook.com/v21.0/dialog/oauth'));
    assert.ok(data.authorizationUrl.includes('instagram_basic'));
    assert.ok(data.authorizationUrl.includes('mock_meta_app_id_999'));
  });

  // ==========================================================================
  // SECTION 2: OAUTH STATE SECURITY & PKCE
  // ==========================================================================
  console.log('\n--- 2. OAuth State Security, PKCE & Anti-CSRF Defense ---');

  await test('Creates secure state record and consumes it once', async () => {
    const stateRecord = await createOAuthStateRecord(mockEnv, 'x', { redirectUri: 'https://deeppredictbet.com/callback' });
    assert.ok(stateRecord.state.startsWith('x_'));

    // First consumption: Valid
    const verify1 = await verifyAndConsumeOAuthState(mockEnv, stateRecord.state, 'x');
    assert.strictEqual(verify1.valid, true);

    // Replay attempt: Must fail (consumed)
    const verify2 = await verifyAndConsumeOAuthState(mockEnv, stateRecord.state, 'x');
    assert.strictEqual(verify2.valid, false);
    assert.ok(verify2.error.includes('Invalid or unrecognized'));
  });

  await test('Rejects state platform mismatch', async () => {
    const stateRecord = await createOAuthStateRecord(mockEnv, 'facebook');
    const verify = await verifyAndConsumeOAuthState(mockEnv, stateRecord.state, 'instagram');
    assert.strictEqual(verify.valid, false);
    assert.ok(verify.error.includes('mismatch'));
  });

  await test('Generates valid PKCE code_verifier and code_challenge', async () => {
    const pkce = await generatePkcePair();
    assert.ok(pkce.verifier.length >= 32);
    assert.ok(pkce.challenge.length >= 32);
  });

  // ==========================================================================
  // SECTION 2B: TIKTOK CLEAN REDIRECT URI & OAUTH SECURITY
  // ==========================================================================
  console.log('\n--- 2b. TikTok Clean Redirect URI & OAuth Callback Security ---');

  await test('TikTok Authorization URL: Constructs clean redirect URI without query parameters', async () => {
    const res = await oauthGet({
      request: new Request('https://deeppredictbet.com/api/social/oauth?action=authorize&platform=tiktok', {
        headers: adminHeaders
      }),
      env: mockEnv
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.platform, 'tiktok');

    // Verify authorization URL has clean redirect URI (URL encoded https://deeppredictbet.com/api/social/oauth)
    assert.ok(data.authorizationUrl.includes('redirect_uri=https%3A%2F%2Fdeeppredictbet.com%2Fapi%2Fsocial%2Foauth'), 'Redirect URI in auth URL must be clean without query parameters');
    assert.strictEqual(data.authorizationUrl.includes('action=callback'), false, 'TikTok auth URL must NOT contain action=callback');

    // Verify stored state record has clean redirect URI
    const rawState = await mockEnv.USERS_KV.get(`social_oauth_state_${data.state}`);
    assert.ok(rawState, 'OAuth state record must exist in KV');
    const parsedState = JSON.parse(rawState);
    assert.strictEqual(parsedState.redirectUri, 'https://deeppredictbet.com/api/social/oauth', 'Stored state redirect URI must be clean');
  });

  await test('Non-TikTok Authorization URL: Preserves ?action=callback redirect URI for all other platforms', async () => {
    const platforms = ['x', 'instagram', 'facebook', 'youtube'];
    for (const plat of platforms) {
      const res = await oauthGet({
        request: new Request(`https://deeppredictbet.com/api/social/oauth?action=authorize&platform=${plat}`, {
          headers: adminHeaders
        }),
        env: mockEnv
      });
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.ok(data.authorizationUrl.includes('redirect_uri=https%3A%2F%2Fdeeppredictbet.com%2Fapi%2Fsocial%2Foauth%3Faction%3Dcallback'), `Platform ${plat} must preserve ?action=callback in redirect_uri`);
    }
  });

  await test('TikTok OAuth Callback: Successfully exchanges code with clean redirect URI from state and persists connection', async () => {
    const stateRecord = await createOAuthStateRecord(mockEnv, 'tiktok', {
      redirectUri: 'https://deeppredictbet.com/api/social/oauth'
    });

    let capturedPostUrl = null;
    let capturedBodyParams = null;

    global.fetch = async (url, options) => {
      const urlStr = url.toString();
      if (urlStr.includes('open.tiktokapis.com/v2/oauth/token/')) {
        capturedPostUrl = urlStr;
        capturedBodyParams = new URLSearchParams(options.body);
        return new Response(JSON.stringify({
          data: {
            access_token: 'mock_tt_access_token_clean_123',
            refresh_token: 'mock_tt_refresh_token_clean_456',
            open_id: 'tt_clean_open_id_789',
            expires_in: 86400,
            scope: 'video.publish,video.upload'
          }
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      return originalFetch(url, options);
    };

    try {
      // Clean callback URL invoked by TikTok redirect (no action=callback in query)
      const res = await oauthGet({
        request: new Request(`https://deeppredictbet.com/api/social/oauth?code=mock_tt_auth_code_clean&state=${stateRecord.state}`),
        env: mockEnv
      });

      assert.strictEqual(res.status, 200);
      const html = await res.text();
      assert.ok(html.includes('Successfully connected'), 'Callback HTML should indicate success');
      assert.ok(html.includes('DeepPredictBet Official'), 'Callback HTML should show account name');

      // Verify token exchange request parameters sent to TikTok API
      assert.ok(capturedPostUrl, 'Token endpoint must have been called');
      assert.strictEqual(capturedBodyParams.get('redirect_uri'), 'https://deeppredictbet.com/api/social/oauth', 'TikTok token exchange must use clean redirect URI');
      assert.strictEqual(capturedBodyParams.get('code'), 'mock_tt_auth_code_clean');
      assert.strictEqual(capturedBodyParams.get('grant_type'), 'authorization_code');

      // Verify connection in KV
      const conn = await getPlatformConnection(mockEnv, 'tiktok');
      assert.ok(conn, 'TikTok connection must be saved to KV');
      assert.strictEqual(conn.accessToken, 'mock_tt_access_token_clean_123');
      assert.strictEqual(conn.accountId, 'tt_clean_open_id_789');
    } finally {
      global.fetch = originalFetch;
    }
  });

  await test('TikTok OAuth Callback: Rejects mismatched redirect URI stored in state record', async () => {
    // State record has non-clean redirect URI (tampered or legacy ?action=callback)
    const stateRecord = await createOAuthStateRecord(mockEnv, 'tiktok', {
      redirectUri: 'https://deeppredictbet.com/api/social/oauth?action=callback'
    });

    let tokenEndpointCalled = false;
    global.fetch = async (url, options) => {
      if (url.toString().includes('open.tiktokapis.com')) {
        tokenEndpointCalled = true;
      }
      return originalFetch(url, options);
    };

    try {
      const res = await oauthGet({
        request: new Request(`https://deeppredictbet.com/api/social/oauth?code=mock_tt_code&state=${stateRecord.state}`),
        env: mockEnv
      });

      assert.strictEqual(res.status, 200);
      const html = await res.text();
      assert.ok(html.includes('Invalid OAuth redirect URI for TikTok'), 'Must reject mismatched redirect URI');
      assert.ok(html.includes('Expected &quot;https://deeppredictbet.com/api/social/oauth&quot;') || html.includes('Expected "https://deeppredictbet.com/api/social/oauth"'), 'Must mention expected clean URL');
      assert.strictEqual(tokenEndpointCalled, false, 'Must never call TikTok token endpoint if redirect URI validation fails');
    } finally {
      global.fetch = originalFetch;
    }
  });

  await test('TikTok OAuth Callback: Rejects unknown, missing, or consumed state', async () => {
    const res = await oauthGet({
      request: new Request('https://deeppredictbet.com/api/social/oauth?code=mock_code&state=tiktok_nonexistent_state_999'),
      env: mockEnv
    });

    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('Invalid or unrecognized OAuth state') || html.includes('state parameter'), 'Must reject invalid state');
  });

  // ==========================================================================
  // SECTION 3: INSTAGRAM GRAPH API INTEGRATION & LIFECYCLE
  // ==========================================================================
  console.log('\n--- 3. Instagram Professional Graph API Integration ---');

  await test('Instagram: Returns MANUAL_REQUIRED when account is not connected', async () => {
    const payload = { copy: 'Premier League Matchday 28 Value Pick: Arsenal vs Chelsea' };
    const res = await dispatchInstagram(mockEnv, payload);
    assert.strictEqual(res.status, 'MANUAL_REQUIRED');
    assert.strictEqual(res.platform, 'instagram');
    assert.ok(res.manualPayload.aspectRatio.includes('Portrait'));
  });

  await test('Instagram: Connects account via server-side KV tokens', async () => {
    await savePlatformConnection(mockEnv, 'instagram', {
      accountHandle: '@deeppredictbet',
      accountName: 'DeepPredictBet Official',
      accountId: 'ig_biz_acc_1001',
      accessToken: 'EAAB_test_mock_instagram_token',
      expiresAt: Date.now() + 30 * 24 * 3600 * 1000,
      scopes: ['instagram_basic', 'instagram_content_publish']
    });

    const conn = await getPlatformConnection(mockEnv, 'instagram');
    assert.ok(conn);
    assert.strictEqual(conn.accountHandle, '@deeppredictbet');
    assert.strictEqual(conn.isExpired, false);

    const accounts = await getSocialAccountsHealth(mockEnv);
    assert.strictEqual(accounts.instagram.connected, true);
    assert.strictEqual(accounts.instagram.status, 'CONNECTED');
    assert.strictEqual(accounts.instagram.accountHandle, '@deeppredictbet');
  });

  await test('Instagram: Rejects post without media asset', async () => {
    const payload = { copy: 'Text only post without photo or video' };
    const res = await dispatchInstagram(mockEnv, payload);
    assert.strictEqual(res.status, 'FAILED');
    assert.ok(res.error.includes('media asset'));
  });

  await test('Instagram: Successfully publishes photo post through Graph API container workflow', async () => {
    // Mock Graph API container and publish responses
    global.fetch = async (url, options) => {
      const urlStr = url.toString();
      if (urlStr.includes('/media?') && (!options || options.method === 'POST')) {
        return new Response(JSON.stringify({ id: 'container_ig_999' }), { status: 200 });
      }
      if (urlStr.includes('/media_publish')) {
        return new Response(JSON.stringify({ id: 'ig_media_post_888' }), { status: 200 });
      }
      if (urlStr.includes('/ig_media_post_888?fields=')) {
        return new Response(JSON.stringify({ id: 'ig_media_post_888', permalink: 'https://instagram.com/p/C_mock123' }), { status: 200 });
      }
      return originalFetch(url, options);
    };

    const payload = {
      copy: 'Arsenal vs Chelsea: AI Poisson model predicts 2-1 (64.2% confidence).',
      mediaUrl: 'https://deeppredictbet.com/assets/match-card-arsenal.png'
    };

    const res = await dispatchInstagram(mockEnv, payload);
    assert.strictEqual(res.status, 'SUCCESS');
    assert.strictEqual(res.platform, 'instagram');
    assert.strictEqual(res.externalPostId, 'ig_media_post_888');
    assert.strictEqual(res.publishedUrl, 'https://instagram.com/p/C_mock123');
    assert.strictEqual(res.format, 'PHOTO');
  });

  await test('Instagram: Marks network timeout as UNCERTAIN rather than assumed failed', async () => {
    global.fetch = async () => {
      throw new Error('ETIMEDOUT: Connection reset by peer');
    };

    const payload = {
      copy: 'Test timeout post',
      mediaUrl: 'https://deeppredictbet.com/assets/logo.png'
    };

    const res = await dispatchInstagram(mockEnv, payload);
    assert.strictEqual(res.status, 'UNCERTAIN');
    assert.strictEqual(res.reconciliationRequired, true);
  });

  // ==========================================================================
  // SECTION 4: FACEBOOK PAGES GRAPH API INTEGRATION & LIFECYCLE
  // ==========================================================================
  console.log('\n--- 4. Facebook Pages Graph API Integration ---');

  await test('Facebook: Connects Page via server-side KV tokens', async () => {
    await savePlatformConnection(mockEnv, 'facebook', {
      accountHandle: 'DeepPredictBet Official',
      accountName: 'DeepPredictBet Official',
      accountId: 'fb_page_id_555',
      accessToken: 'EAAB_test_mock_facebook_token',
      expiresAt: Date.now() + 60 * 24 * 3600 * 1000,
      scopes: ['pages_manage_posts', 'pages_read_engagement']
    });

    const accounts = await getSocialAccountsHealth(mockEnv);
    assert.strictEqual(accounts.facebook.connected, true);
    assert.strictEqual(accounts.facebook.status, 'CONNECTED');
    assert.strictEqual(accounts.facebook.accountHandle, 'DeepPredictBet Official');
  });

  await test('Facebook: Successfully publishes photo post and resolves permalink', async () => {
    global.fetch = async (url, options) => {
      const urlStr = url.toString();
      if (urlStr.includes('/photos')) {
        return new Response(JSON.stringify({ id: 'fb_photo_777', post_id: '555_777' }), { status: 200 });
      }
      return originalFetch(url, options);
    };

    const payload = {
      copy: 'Weekend Accumulator Alert: 4.85 Total Odds analyzed by AI Scout.',
      mediaUrl: 'https://deeppredictbet.com/assets/slip.png'
    };

    const res = await dispatchFacebook(mockEnv, payload);
    assert.strictEqual(res.status, 'SUCCESS');
    assert.strictEqual(res.platform, 'facebook');
    assert.strictEqual(res.externalPostId, 'fb_photo_777');
    assert.ok(res.publishedUrl.includes('facebook.com/fb_photo_777'));
  });

  // ==========================================================================
  // SECTION 5: 𝕏 (TWITTER API v2) INTEGRATION
  // ==========================================================================
  console.log('\n--- 5. 𝕏 (Twitter API v2) Integration ---');

  await test('𝕏: Connects account via server-side KV tokens', async () => {
    await savePlatformConnection(mockEnv, 'x', {
      accountHandle: '@DeepPredictBet',
      accountName: 'DeepPredictBet',
      accountId: 'x_user_id_444',
      accessToken: 'x_oauth2_mock_access_token',
      expiresAt: Date.now() + 2 * 3600 * 1000,
      scopes: ['tweet.read', 'tweet.write', 'users.read']
    });

    const accounts = await getSocialAccountsHealth(mockEnv);
    assert.strictEqual(accounts.x.connected, true);
    assert.strictEqual(accounts.x.status, 'CONNECTED');
  });

  await test('𝕏: Rejects tweet exceeding 280 character limit', async () => {
    const oversizedText = 'A'.repeat(281);
    const res = await dispatchX(mockEnv, { copy: oversizedText });
    assert.strictEqual(res.status, 'FAILED');
    assert.ok(res.error.includes('280 character limit'));
  });

  await test('𝕏: Successfully publishes tweet and captures post identifier', async () => {
    global.fetch = async (url, options) => {
      if (url.toString().includes('api.twitter.com/2/tweets')) {
        return new Response(JSON.stringify({
          data: { id: 'tweet_id_177298371928', text: 'Manchester City vs Liverpool tactical preview' }
        }), { status: 201 });
      }
      return originalFetch(url, options);
    };

    const res = await dispatchX(mockEnv, { copy: 'Manchester City vs Liverpool tactical preview' });
    assert.strictEqual(res.status, 'SUCCESS');
    assert.strictEqual(res.platform, 'x');
    assert.strictEqual(res.externalPostId, 'tweet_id_177298371928');
    assert.ok(res.publishedUrl.includes('x.com/DeepPredictBet/status/tweet_id_177298371928'));
  });

  await test('𝕏: Strips HTML formatting tags before dispatching to Twitter API', async () => {
    let capturedBody = null;
    global.fetch = async (url, options) => {
      if (url.toString().includes('api.twitter.com/2/tweets')) {
        capturedBody = JSON.parse(options.body);
        return new Response(JSON.stringify({
          data: { id: 'tweet_id_999888', text: capturedBody.text }
        }), { status: 201 });
      }
      return originalFetch(url, options);
    };

    const htmlCopy = '👑 <b>TOP TIP OF THE DAY: Brentford vs Liverpool</b>\n🏆 <i>Premier League</i>\n🎯 <b>Official AI Selection:</b> Draw';
    const res = await dispatchX(mockEnv, { copy: htmlCopy });

    assert.strictEqual(res.status, 'SUCCESS');
    assert.ok(capturedBody);
    assert.strictEqual(capturedBody.text.includes('<b>'), false);
    assert.strictEqual(capturedBody.text.includes('</b>'), false);
    assert.strictEqual(capturedBody.text.includes('<i>'), false);
    assert.strictEqual(capturedBody.text.includes('</i>'), false);
    assert.ok(capturedBody.text.includes('👑 TOP TIP OF THE DAY: Brentford vs Liverpool'));
  });

  // ==========================================================================
  // SECTION 6: TIKTOK CONTENT POSTING API INTEGRATION
  // ==========================================================================
  console.log('\n--- 6. TikTok Content Posting API (v2) Integration ---');

  await test('TikTok: Connects creator account via KV tokens', async () => {
    await savePlatformConnection(mockEnv, 'tiktok', {
      accountHandle: '@deeppredictbet',
      accountName: 'DeepPredictBet TikTok',
      accountId: 'tt_open_id_333',
      accessToken: 'tiktok_mock_access_token_123',
      expiresAt: Date.now() + 24 * 3600 * 1000,
      scopes: ['video.publish', 'video.upload']
    });

    const accounts = await getSocialAccountsHealth(mockEnv);
    assert.strictEqual(accounts.tiktok.connected, true);
    assert.strictEqual(accounts.tiktok.status, 'CONNECTED');
  });

  await test('TikTok: Requires video asset URL for direct publishing', async () => {
    const res = await dispatchTikTok(mockEnv, { copy: 'Text post without video asset' });
    assert.strictEqual(res.status, 'MANUAL_REQUIRED');
    assert.ok(res.message.includes('requires approved video asset'));
  });

  await test('TikTok: Initiates video direct-post with PULL_FROM_URL and records publish_id', async () => {
    global.fetch = async (url) => {
      if (url.toString().includes('tiktokapis.com/v2/post/publish/video/init/')) {
        return new Response(JSON.stringify({
          data: { publish_id: 'tt_pub_task_987654321' }
        }), { status: 200 });
      }
      return originalFetch(url);
    };

    const res = await dispatchTikTok(mockEnv, {
      copy: 'Stop guessing your football bets. AI Poisson prediction for El Clasico! #BettingTok',
      videoUrl: 'https://deeppredictbet.com/media/videos/clasico-preview.mp4'
    });

    assert.strictEqual(res.status, 'SUCCESS');
    assert.strictEqual(res.platform, 'tiktok');
    assert.strictEqual(res.externalPostId, 'tt_pub_task_987654321');
    assert.strictEqual(res.statusDetails, 'VIDEO_SUBMITTED_FOR_PROCESSING');
  });

  // ==========================================================================
  // SECTION 7: YOUTUBE DATA API V3 SHORTS/VIDEO INTEGRATION
  // ==========================================================================
  console.log('\n--- 7. YouTube Data API v3 Shorts & Videos Integration ---');

  await test('YouTube OAuth: Missing GOOGLE_CLIENT_ID produces controlled 500 error without exposing secrets', async () => {
    const envWithoutGoogle = { ...mockEnv, GOOGLE_CLIENT_ID: undefined, YOUTUBE_CLIENT_ID: undefined };
    const res = await oauthGet({
      request: new Request('https://deeppredictbet.com/api/social/oauth?action=authorize&platform=youtube', {
        headers: adminHeaders
      }),
      env: envWithoutGoogle
    });
    assert.strictEqual(res.status, 500);
    const data = await res.json();
    assert.strictEqual(data.success, false);
    assert.strictEqual(data.error, 'Failed to generate authorization URL: GOOGLE_CLIENT_ID is not configured in server environment.');
  });

  await test('YouTube OAuth: Configured GOOGLE_CLIENT_ID generates valid authorization URL with callback URI & scopes', async () => {
    const res = await oauthGet({
      request: new Request('https://deeppredictbet.com/api/social/oauth?action=authorize&platform=youtube', {
        headers: adminHeaders
      }),
      env: mockEnv
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.platform, 'youtube');
    assert.ok(data.authorizationUrl.startsWith('https://accounts.google.com/o/oauth2/v2/auth'));
    assert.ok(data.authorizationUrl.includes('client_id=mock_google_client_id_333'));
    assert.ok(data.authorizationUrl.includes('redirect_uri=https%3A%2F%2Fdeeppredictbet.com%2Fapi%2Fsocial%2Foauth%3Faction%3Dcallback'));
    assert.ok(data.authorizationUrl.includes('access_type=offline'));
    assert.ok(data.authorizationUrl.includes('prompt=consent'));
    assert.ok(data.authorizationUrl.includes('youtube.upload'));
    assert.ok(data.authorizationUrl.includes('youtube.readonly'));
  });

  await test('YouTube OAuth: Token exchange rejects missing GOOGLE_CLIENT_SECRET with controlled error', async () => {
    const stateRecord = await createOAuthStateRecord(mockEnv, 'youtube', {
      redirectUri: 'https://deeppredictbet.com/api/social/oauth?action=callback'
    });
    const envWithoutSecret = { ...mockEnv, GOOGLE_CLIENT_SECRET: undefined, YOUTUBE_CLIENT_SECRET: undefined };
    const res = await oauthGet({
      request: new Request(`https://deeppredictbet.com/api/social/oauth?action=callback&code=mock_code&state=${stateRecord.state}`),
      env: envWithoutSecret
    });
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET missing in server environment'));
  });

  await test('YouTube OAuth: Successful token exchange discovers channel and stores connection in KV', async () => {
    const stateRecord = await createOAuthStateRecord(mockEnv, 'youtube', {
      redirectUri: 'https://deeppredictbet.com/api/social/oauth?action=callback'
    });

    global.fetch = async (url) => {
      const urlStr = url.toString();
      if (urlStr.includes('oauth2.googleapis.com/token')) {
        return new Response(JSON.stringify({
          access_token: 'mock_google_access_token_valid',
          refresh_token: 'mock_google_refresh_token_valid',
          expires_in: 3600
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      if (urlStr.includes('googleapis.com/youtube/v3/channels')) {
        return new Response(JSON.stringify({
          items: [{ id: 'UC_mock_channel_live_777', snippet: { title: 'DeepPredictBet TV' } }]
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      return originalFetch(url);
    };

    try {
      const res = await oauthGet({
        request: new Request(`https://deeppredictbet.com/api/social/oauth?action=callback&code=mock_google_auth_code&state=${stateRecord.state}`),
        env: mockEnv
      });
      assert.strictEqual(res.status, 200);
      const html = await res.text();
      assert.ok(html.includes('Successfully connected DeepPredictBet TV'));

      const conn = await getPlatformConnection(mockEnv, 'youtube');
      assert.ok(conn);
      assert.strictEqual(conn.accountHandle, 'DeepPredictBet TV');
      assert.strictEqual(conn.accessToken, 'mock_google_access_token_valid');
      assert.strictEqual(conn.refreshToken, 'mock_google_refresh_token_valid');
      assert.strictEqual(conn.accountId, 'UC_mock_channel_live_777');
    } finally {
      global.fetch = originalFetch;
    }
  });

  await test('YouTube: Connects channel via Google OAuth tokens', async () => {
    await savePlatformConnection(mockEnv, 'youtube', {
      accountHandle: 'DeepPredictBet TV',
      accountName: 'DeepPredictBet TV',
      accountId: 'UC_mock_channel_id_111',
      accessToken: 'google_youtube_mock_access_token_456',
      refreshToken: 'google_youtube_mock_refresh_token_789',
      expiresAt: Date.now() + 3600 * 1000,
      scopes: ['https://www.googleapis.com/auth/youtube.upload']
    });

    const accounts = await getSocialAccountsHealth(mockEnv);
    assert.strictEqual(accounts.youtube.connected, true);
    assert.strictEqual(accounts.youtube.status, 'CONNECTED');
    assert.strictEqual(accounts.youtube.accountHandle, 'DeepPredictBet TV');
  });

  await test('YouTube: Successfully posts video metadata and captures video ID', async () => {
    global.fetch = async (url) => {
      if (url.toString().includes('googleapis.com/youtube/v3/videos')) {
        return new Response(JSON.stringify({
          id: 'yt_vid_abc987xyz',
          snippet: { title: 'Arsenal vs Chelsea AI Match Breakdown' }
        }), { status: 200 });
      }
      return originalFetch(url);
    };

    const res = await dispatchYouTube(mockEnv, {
      title: 'Arsenal vs Chelsea AI Match Breakdown #Shorts',
      copy: 'Expected goals, tactical analysis and statistical probabilities from DeepPredictBet.'
    });

    assert.strictEqual(res.status, 'SUCCESS');
    assert.strictEqual(res.platform, 'youtube');
    assert.strictEqual(res.externalPostId, 'yt_vid_abc987xyz');
    assert.strictEqual(res.publishedUrl, 'https://youtube.com/watch?v=yt_vid_abc987xyz');
  });

  // ==========================================================================
  // SECTION 8: TOKEN EXPIRATION, REVOCATION & DISCONNECTION
  // ==========================================================================
  console.log('\n--- 8. Token Expiration, Revocation & Disconnection ---');

  await test('Truthfully marks expired token as TOKEN_EXPIRED and disallows direct dispatch', async () => {
    // Set X token expired 1 hour ago
    await savePlatformConnection(mockEnv, 'x', {
      accountHandle: '@DeepPredictBet',
      accessToken: 'expired_token',
      expiresAt: Date.now() - 3600 * 1000
    });

    const accounts = await getSocialAccountsHealth(mockEnv);
    assert.strictEqual(accounts.x.connected, false);
    assert.strictEqual(accounts.x.status, 'TOKEN_EXPIRED');
    assert.ok(accounts.x.reason.includes('expired'));
  });

  await test('Disconnects platform account and purges credentials from KV', async () => {
    const res = await oauthPost({
      request: new Request('https://deeppredictbet.com/api/social/oauth', {
        method: 'POST',
        headers: adminHeaders,
        body: JSON.stringify({ action: 'disconnect', platform: 'x' })
      }),
      env: mockEnv
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.status, 'DISCONNECTED');

    const conn = await getPlatformConnection(mockEnv, 'x');
    assert.strictEqual(conn, null);
  });

  // ==========================================================================
  // SECTION 9: MULTI-PLATFORM DISPATCH & DUPLICATE PREVENTION
  // ==========================================================================
  console.log('\n--- 9. Multi-Platform Dispatch & Duplicate Prevention ---');

  await test('Dispatches approved content across enabled platforms simultaneously', async () => {
    global.fetch = async (url) => {
      const urlStr = url.toString();
      if (urlStr.includes('/photos')) return new Response(JSON.stringify({ id: 'fb_post_111' }), { status: 200 });
      if (urlStr.includes('/media?') || urlStr.includes('/media_publish')) return new Response(JSON.stringify({ id: 'ig_post_222' }), { status: 200 });
      return originalFetch(url);
    };

    const contentItem = {
      id: 'soc_multi_dispatch_test',
      category: SOCIAL_CONTENT_CATEGORIES.FOOTBALL_INTELLIGENCE_BRIEF,
      matchId: 'fixture_liv_mci_2026',
      mediaUrl: 'https://deeppredictbet.com/assets/tactics.png',
      platforms: {
        facebook: { enabled: true, copy: 'Liverpool vs Manchester City Statistical Preview' },
        instagram: { enabled: true, copy: 'Liverpool vs Manchester City Statistical Preview' }
      }
    };

    const results = await executeMultiPlatformDispatch(mockEnv, contentItem);
    assert.strictEqual(results.facebook.status, 'SUCCESS');
    assert.strictEqual(results.instagram.status, 'SUCCESS');
    assert.strictEqual(results.facebook.externalPostId, 'fb_post_111');
    assert.strictEqual(results.instagram.externalPostId, 'ig_post_222');
  });

  await test('Rejects duplicate post within 24 hours (HTTP 409) and allows forceDuplicate override', async () => {
    // Reconnect Instagram
    await savePlatformConnection(mockEnv, 'instagram', {
      accountHandle: '@deeppredictbet',
      accessToken: 'valid_ig_token',
      expiresAt: Date.now() + 3600000
    });

    global.fetch = async () => new Response(JSON.stringify({ id: 'ig_dup_post' }), { status: 200 });

    const postPayload = {
      action: 'publish_now',
      channel: 'instagram',
      copy: 'Duplicate prevention test copy with unique timestamp 20261014_A',
      mediaUrl: 'https://deeppredictbet.com/assets/logo.png'
    };

    // First dispatch: 200 OK
    const res1 = await publishPost({
      request: new Request('https://deeppredictbet.com/api/social/publish', {
        method: 'POST',
        headers: adminHeaders,
        body: JSON.stringify(postPayload)
      }),
      env: mockEnv
    });
    assert.strictEqual(res1.status, 200);

    // Second dispatch without override: 409 Conflict
    const res2 = await publishPost({
      request: new Request('https://deeppredictbet.com/api/social/publish', {
        method: 'POST',
        headers: adminHeaders,
        body: JSON.stringify(postPayload)
      }),
      env: mockEnv
    });
    assert.strictEqual(res2.status, 409);
    const data2 = await res2.json();
    assert.strictEqual(data2.duplicateDetected, true);

    // Third dispatch with forceDuplicate: 200 OK
    const res3 = await publishPost({
      request: new Request('https://deeppredictbet.com/api/social/publish', {
        method: 'POST',
        headers: adminHeaders,
        body: JSON.stringify({ ...postPayload, forceDuplicate: true })
      }),
      env: mockEnv
    });
    assert.strictEqual(res3.status, 200);
  });

  // ==========================================================================
  // SECTION 10: UNCERTAIN OUTCOMES & RECONCILIATION
  // ==========================================================================
  console.log('\n--- 10. Uncertain Outcomes & Status Reconciliation ---');

  await test('Reconciles uncertain Instagram publication against live Graph API endpoint', async () => {
    global.fetch = async (url) => {
      if (url.toString().includes('ig_reconcile_999')) {
        return new Response(JSON.stringify({ id: 'ig_reconcile_999', permalink: 'https://instagram.com/p/reconciled_123' }), { status: 200 });
      }
      return originalFetch(url);
    };

    const reconciliation = await reconcilePlatformPublication(mockEnv, 'instagram', 'ig_reconcile_999');
    assert.strictEqual(reconciliation.reconciled, true);
    assert.strictEqual(reconciliation.exists, true);
    assert.strictEqual(reconciliation.status, 'CONFIRMED');
    assert.strictEqual(reconciliation.publishedUrl, 'https://instagram.com/p/reconciled_123');
  });

  await test('Reports NOT_FOUND when uncertain externalPostId returns 404 from provider', async () => {
    global.fetch = async () => new Response('Not Found', { status: 404 });

    const reconciliation = await reconcilePlatformPublication(mockEnv, 'facebook', 'fb_missing_id_404');
    assert.strictEqual(reconciliation.reconciled, true);
    assert.strictEqual(reconciliation.exists, false);
    assert.strictEqual(reconciliation.status, 'NOT_FOUND');
  });

  // ==========================================================================
  // SECTION 12: PRODUCTION READINESS GATE & LIFECYCLE STATES (Section 6)
  // ==========================================================================
  console.log('\n--- 12. Production Readiness Gate, Meta v21.0 & Status Lifecycle ---');

  await test('Meta Graph API v21.0 endpoints are enforced across Instagram & Facebook', async () => {
    const { OAUTH_CONFIGS } = await import('./functions/api/social/_socialAuth.js');
    assert.ok(OAUTH_CONFIGS.instagram.authUrl.includes('v21.0'), 'Instagram authUrl must use v21.0');
    assert.ok(OAUTH_CONFIGS.instagram.tokenUrl.includes('v21.0'), 'Instagram tokenUrl must use v21.0');
    assert.ok(OAUTH_CONFIGS.facebook.authUrl.includes('v21.0'), 'Facebook authUrl must use v21.0');
    assert.ok(OAUTH_CONFIGS.facebook.tokenUrl.includes('v21.0'), 'Facebook tokenUrl must use v21.0');
  });

  await test('Truthful Status: Distinguishes AUTHORIZED vs LIVE (publishing enabled)', async () => {
    // 1. Newly connected account without verified publication -> AUTHORIZED, not LIVE
    await savePlatformConnection(mockEnv, 'x', {
      accountHandle: '@DeepPredictBet',
      accessToken: 'x_oauth_tok_123',
      expiresAt: Date.now() + 7200000,
      verifiedPublish: false
    });

    let health = await getSocialAccountsHealth(mockEnv);
    assert.strictEqual(health.x.connected, true);
    assert.strictEqual(health.x.publishingState, 'AUTHORIZED');
    assert.strictEqual(health.x.isLive, false);
    assert.strictEqual(health.x.requiresTestPublish, true);

    // 2. Mark account with verified publication -> LIVE
    await savePlatformConnection(mockEnv, 'x', {
      accountHandle: '@DeepPredictBet',
      accessToken: 'x_oauth_tok_123',
      expiresAt: Date.now() + 7200000,
      verifiedPublish: true,
      lastTestPostId: 'tweet_verified_999'
    });

    health = await getSocialAccountsHealth(mockEnv);
    assert.strictEqual(health.x.publishingState, 'LIVE');
    assert.strictEqual(health.x.isLive, true);
    assert.strictEqual(health.x.requiresTestPublish, false);
  });

  await test('Truthful Status: Distinguishes REVIEW_PENDING and REVOKED states', async () => {
    // Review Pending
    await savePlatformConnection(mockEnv, 'tiktok', {
      accountHandle: '@DeepPredictBetTikTok',
      accessToken: 'tk_tok_456',
      reviewPending: true
    });
    let health = await getSocialAccountsHealth(mockEnv);
    assert.strictEqual(health.tiktok.status, 'REVIEW_PENDING');
    assert.strictEqual(health.tiktok.publishingState, 'REVIEW_PENDING');
    assert.strictEqual(health.tiktok.isLive, false);

    // Revoked
    await savePlatformConnection(mockEnv, 'tiktok', {
      accountHandle: '@DeepPredictBetTikTok',
      accessToken: 'tk_tok_456',
      revoked: true
    });
    health = await getSocialAccountsHealth(mockEnv);
    assert.strictEqual(health.tiktok.status, 'REVOKED');
    assert.strictEqual(health.tiktok.publishingState, 'REVOKED');
    assert.strictEqual(health.tiktok.isLive, false);
  });

  await test('Preserves Telegram 100% LIVE and operational', async () => {
    const health = await getSocialAccountsHealth(mockEnv);
    assert.strictEqual(health.telegram.connected, true);
    assert.strictEqual(health.telegram.isLive, true);
    assert.strictEqual(health.telegram.publishingState, 'LIVE');
  });

  await test('UI / Omni-Channel: setActiveChannel("x") switches to Compose tab, updates simulator pill, highlights channel chip, and provides 1-click Web Intent & auto-population', async () => {
    await import('./js/telegramPublisher.js');
    const publisher = globalThis.TelegramPublisher;
    assert.ok(publisher, 'TelegramPublisher module must be defined');

    const channelChips = [
      { attrs: { 'data-channel': 'telegram' }, getAttribute(n) { return this.attrs[n]; }, style: {} },
      { attrs: { 'data-channel': 'x' }, getAttribute(n) { return this.attrs[n]; }, style: {} },
      { attrs: { 'data-channel': 'instagram' }, getAttribute(n) { return this.attrs[n]; }, style: {} },
      { attrs: { 'data-channel': 'facebook' }, getAttribute(n) { return this.attrs[n]; }, style: {} },
      { attrs: { 'data-channel': 'tiktok' }, getAttribute(n) { return this.attrs[n]; }, style: {} },
      { attrs: { 'data-channel': 'youtube' }, getAttribute(n) { return this.attrs[n]; }, style: {} }
    ];

    const simButtons = [
      { attrs: { 'data-channel': 'telegram' }, getAttribute(n) { return this.attrs[n]; }, style: {} },
      { attrs: { 'data-channel': 'x' }, getAttribute(n) { return this.attrs[n]; }, style: {} }
    ];

    const tabButtons = [
      { attrs: { 'data-tab': 'overview' }, getAttribute(n) { return this.attrs[n]; }, style: {} },
      { attrs: { 'data-tab': 'compose' }, getAttribute(n) { return this.attrs[n]; }, style: {} }
    ];

    const mockElements = {
      'tg-sim-platform-pill': { textContent: '' },
      'tg-pub-copy-manual-btn': { innerHTML: '' },
      'tg-pub-x-intent-btn': { style: { display: 'none' } },
      'tg-cc-char-counter': { textContent: '', style: {} },
      'tg-sim-text': { textContent: '', style: {} },
      'tg-pub-message-input': { value: '' },
      'tg-cc-tab-content': { innerHTML: '', scrollIntoView: () => {} },
      'tg-social-prereq-modal': { style: { display: 'none' } },
      'tg-social-prereq-body': { innerHTML: '' },
      'tg-pub-buttons-container': { innerHTML: '' }
    };

    const prevDoc = global.document;
    const prevWin = global.window;
    let openedUrl = null;

    global.document = {
      getElementById: (id) => mockElements[id] || null,
      querySelectorAll: (sel) => {
        if (sel.includes('.tg-cc-channel-chip') || sel.includes('.tg-channel-pill')) return channelChips;
        if (sel.includes('.tg-sim-channel-btn')) return simButtons;
        if (sel.includes('.tg-cc-tab-btn')) return tabButtons;
        return [];
      }
    };

    global.window = {
      ...global.window,
      open: (url) => { openedUrl = url; return true; },
      innerHeight: 900
    };

    try {
      // 1. Reset state to overview with empty message
      publisher.switchTab('overview');
      publisher.setMessageText('');

      // 2. Click on 𝕏 X (Twitter) channel chip
      publisher.setActiveChannel('x');

      const state = publisher.getState();
      assert.strictEqual(state.activeChannel, 'x', 'Active channel must be updated to x');
      assert.strictEqual(state.charLimit, 280, 'Character limit for x must be 280');
      assert.strictEqual(state.activeTab, 'compose', 'setActiveChannel must switch active tab to compose so simulator and output are visible');

      // 3. Channel chip styling
      assert.strictEqual(channelChips[1].style.color, '#38bdf8', 'X channel chip must be highlighted with cyan color');
      assert.strictEqual(channelChips[1].style.borderColor, '#38bdf8', 'X channel chip must have cyan border');
      assert.strictEqual(channelChips[0].style.color, '#cbd5e1', 'Telegram chip must be unhighlighted');

      // 4. Simulator Mini Buttons
      assert.strictEqual(simButtons[1].style.color, '#38bdf8', 'Simulator mini X button must be highlighted with cyan');
      assert.strictEqual(simButtons[0].style.color, '#94a3b8', 'Simulator mini Telegram button must be muted');

      // 5. Simulator Pill & Buttons
      assert.strictEqual(mockElements['tg-sim-platform-pill'].textContent, 'X SIMULATOR', 'Platform pill must display X SIMULATOR');
      assert.ok(mockElements['tg-pub-copy-manual-btn'].innerHTML.includes('X Manual Post'), 'Manual copy button must specify X');
      assert.strictEqual(mockElements['tg-pub-x-intent-btn'].style.display, 'flex', '1-Click X intent button must be visible');

      // 6. Output auto-population
      assert.ok(state.messageText && state.messageText.length > 0, 'Post message must be auto-populated so simulator has immediate output');

      // 7. 1-Click Twitter Intent Trigger
      publisher.openTwitterIntent();
      assert.ok(openedUrl, 'openTwitterIntent must invoke window.open');
      assert.ok(openedUrl.startsWith('https://twitter.com/intent/tweet?text='), 'Intent URL must target twitter.com/intent/tweet');
      assert.ok(openedUrl.includes('deeppredictbet.com'), 'Intent URL must include deeppredictbet.com reference');

      // 8. Prerequisites Modal Open & Close
      publisher.openSocialPrerequisitesModal('x');
      assert.strictEqual(mockElements['tg-social-prereq-modal'].style.display, 'flex', 'Prerequisites modal must open');
      assert.ok(mockElements['tg-social-prereq-body'].innerHTML.includes('X_CLIENT_ID'), 'Prerequisites modal body must show X secrets');

      publisher.closeSocialPrerequisitesModal();
      assert.strictEqual(mockElements['tg-social-prereq-modal'].style.display, 'none', 'Prerequisites modal must close');
    } finally {
      global.document = prevDoc;
      global.window = prevWin;
    }
  });

  // Restore Global Fetch
  global.fetch = originalFetch;

  console.log('\n==================================================');
  console.log(`SOCIAL PLATFORMS ACTIVATION RESULTS: ${passedCount} passed, ${failedCount} failed.`);
  console.log('==================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runAllTests().catch(err => {
  console.error('Fatal test runner failure:', err);
  process.exit(1);
});
