/**
 * DEEPPREDICTBET — TELEGRAM INTEGRATION COMPREHENSIVE AUTOMATED TEST SUITE
 * 
 * Verifies:
 * 1. Server-side Telegram service API operations, error sanitization & secret isolation
 * 2. KV storage persistence for members and single-use account linking tokens
 * 3. Webhook authentication via 'x-telegram-bot-api-secret-token'
 * 4. Full Telegram bot command set (/start, /help, /predictions, /scout, /value, /tips, /matches, /watchlist, /alerts, /account, /vip)
 * 5. Complete account-linking flow (creation -> webhook /start -> member link -> token invalidation)
 * 6. Admin health check and diagnostics (strict zero-leakage token verification)
 * 7. Publishing and diagnostic test endpoints
 */

const assert = require('assert');

// In-memory mock KV store
function createMockKV() {
  const store = new Map();
  return {
    async get(key) {
      return store.get(key) || null;
    },
    async put(key, value, options) {
      store.set(key, value);
      return true;
    },
    async delete(key) {
      store.delete(key);
      return true;
    },
    _raw: store
  };
}

// Global fetch mock harness
let fetchCalls = [];
let mockFetchHandler = null;

global.fetch = async function (url, options = {}) {
  fetchCalls.push({ url, options });
  if (mockFetchHandler) {
    return await mockFetchHandler(url, options);
  }
  return {
    ok: true,
    status: 200,
    json: async () => ({ ok: true, result: { message_id: 999, id: 999, username: 'DeepPredictBetBot', status: 'administrator', can_post_messages: true, type: 'channel', title: 'DeepPredict Channel' } }),
    text: async () => JSON.stringify({ ok: true, result: { message_id: 999, id: 999, username: 'DeepPredictBetBot', status: 'administrator', can_post_messages: true, type: 'channel', title: 'DeepPredict Channel' } })
  };
};

async function runTests() {
  console.log('🧪 Starting DeepPredictBet Telegram Integration Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    try {
      fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error('    Error:', err.message);
      failed++;
    }
  }

  async function testAsync(name, fn) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error('    Error:', err.message);
      failed++;
    }
  }

  // Dynamically import ES modules
  const telegramService = await import('./functions/api/integrations/telegram/_telegramService.js');
  const kvHelper = await import('./functions/api/integrations/telegram/_kvHelper.js');
  const webhookModule = await import('./functions/api/integrations/telegram/webhook.js');
  const linkModule = await import('./functions/api/integrations/telegram/link.js');
  const healthModule = await import('./functions/api/integrations/telegram/health.js');
  const publishModule = await import('./functions/api/integrations/telegram/publish.js');
  const testModule = await import('./functions/api/integrations/telegram/test.js');
  const vipAccessService = await import('./functions/api/integrations/telegram/_vipAccessService.js');
  const vipAccessModule = await import('./functions/api/integrations/telegram/vip-access.js');
  const sweepModule = await import('./functions/api/integrations/telegram/sweep.js');
  const loginModule = await import('./functions/api/login.js');
  const logoutModule = await import('./functions/api/logout.js');
  await import('./js/telegramPublisher.js');
  const telegramPublisher = globalThis.TelegramPublisher;

  const FAKE_BOT_TOKEN = '123456789:ABCdefGHIjklMNOpqrsTUVwxyz';
  const FAKE_WEBHOOK_SECRET = 'deep_sec_token_999';

  // ==========================================
  // SUITE 1: TELEGRAM SERVER SERVICE
  // ==========================================
  console.log('--- 1. Telegram Service & Secret Isolation ---');

  await testAsync('Gracefully handles unconfigured TELEGRAM_BOT_TOKEN', async () => {
    const res = await telegramService.callTelegramApi({}, 'getMe');
    assert.strictEqual(res.success, false);
    assert.strictEqual(res.configured, false);
    assert.ok(res.error.includes('not configured'));
  });

  await testAsync('Strips bot token from error descriptions', async () => {
    mockFetchHandler = async () => ({
      ok: false,
      status: 400,
      json: async () => ({
        ok: false,
        error_code: 400,
        description: `Error with token ${FAKE_BOT_TOKEN}: Bad Request`
      })
    });

    const res = await telegramService.callTelegramApi({ TELEGRAM_BOT_TOKEN: FAKE_BOT_TOKEN }, 'sendMessage', { chat_id: 123 });
    assert.strictEqual(res.success, false);
    assert.strictEqual(res.configured, true);
    assert.ok(!res.error.includes(FAKE_BOT_TOKEN), 'Token must be stripped');
    assert.ok(res.error.includes('[REDACTED_BOT_TOKEN]'), 'Token must be replaced with redacted marker');

    mockFetchHandler = null;
  });

  await testAsync('Dispatches formatted sendMessage with HTML parse_mode', async () => {
    fetchCalls = [];
    const env = { TELEGRAM_BOT_TOKEN: FAKE_BOT_TOKEN };
    const res = await telegramService.sendMessage(env, '123456', '<b>Test Message</b>');

    assert.strictEqual(res.success, true);
    assert.strictEqual(fetchCalls.length, 1);
    assert.ok(fetchCalls[0].url.includes('/sendMessage'));
    const body = JSON.parse(fetchCalls[0].options.body);
    assert.strictEqual(body.chat_id, '123456');
    assert.strictEqual(body.text, '<b>Test Message</b>');
    assert.strictEqual(body.parse_mode, 'HTML');
  });

  await testAsync('Publishes to Free and VIP channels correctly', async () => {
    fetchCalls = [];
    const env = {
      TELEGRAM_BOT_TOKEN: FAKE_BOT_TOKEN,
      TELEGRAM_FREE_CHANNEL_ID: '@test_free_channel',
      TELEGRAM_VIP_CHANNEL_ID: '-100987654321'
    };

    const freeRes = await telegramService.publishToFreeChannel(env, 'Free Pick');
    assert.strictEqual(freeRes.success, true);
    let body = JSON.parse(fetchCalls[fetchCalls.length - 1].options.body);
    assert.strictEqual(body.chat_id, '@test_free_channel');

    const vipRes = await telegramService.publishToVipChannel(env, 'VIP Banker');
    assert.strictEqual(vipRes.success, true);
    body = JSON.parse(fetchCalls[fetchCalls.length - 1].options.body);
    assert.strictEqual(body.chat_id, '-100987654321');
  });

  // ==========================================
  // SUITE 2: KV HELPER & SINGLE-USE LINK TOKENS
  // ==========================================
  console.log('\n--- 2. KV Storage & Token Lifecycle ---');

  await testAsync('Stores and retrieves single-use link token', async () => {
    const mockKV = createMockKV();
    const env = { USERS_KV: mockKV };

    await kvHelper.setLinkToken(env, 'dplink_test123', {
      userId: 'usr_adm1',
      email: 'admin@deeppredictbet.com',
      username: 'Egeruennamdi78'
    }, 900);

    const tokenData = await kvHelper.getLinkToken(env, 'dplink_test123');
    assert.ok(tokenData);
    assert.strictEqual(tokenData.userId, 'usr_adm1');
    assert.strictEqual(tokenData.email, 'admin@deeppredictbet.com');

    // Delete token (consumption)
    await kvHelper.deleteLinkToken(env, 'dplink_test123');
    const consumed = await kvHelper.getLinkToken(env, 'dplink_test123');
    assert.strictEqual(consumed, null);
  });

  // ==========================================
  // SUITE 3: WEBHOOK SECRET VALIDATION
  // ==========================================
  console.log('\n--- 3. Webhook Authentication & Protection ---');

  await testAsync('Rejects webhook request with missing or invalid secret token', async () => {
    const mockKV = createMockKV();
    const env = {
      TELEGRAM_BOT_TOKEN: FAKE_BOT_TOKEN,
      TELEGRAM_WEBHOOK_SECRET: FAKE_WEBHOOK_SECRET,
      USERS_KV: mockKV
    };

    const request = new Request('https://deeppredictbet.com/api/integrations/telegram/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-telegram-bot-api-secret-token': 'wrong_secret_123'
      },
      body: JSON.stringify({ message: { chat: { id: 111 }, text: '/help' } })
    });

    const response = await webhookModule.onRequestPost({ request, env });
    assert.strictEqual(response.status, 401);
    const data = await response.json();
    assert.strictEqual(data.ok, false);
  });

  await testAsync('Accepts webhook request with matching secret token', async () => {
    const mockKV = createMockKV();
    const env = {
      TELEGRAM_BOT_TOKEN: FAKE_BOT_TOKEN,
      TELEGRAM_WEBHOOK_SECRET: FAKE_WEBHOOK_SECRET,
      USERS_KV: mockKV
    };

    const request = new Request('https://deeppredictbet.com/api/integrations/telegram/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-telegram-bot-api-secret-token': FAKE_WEBHOOK_SECRET
      },
      body: JSON.stringify({
        message: {
          chat: { id: 777777 },
          from: { id: 777777, username: 'punters_guild' },
          text: '/help'
        }
      })
    });

    const response = await webhookModule.onRequestPost({ request, env });
    assert.strictEqual(response.status, 200);
    const data = await response.json();
    assert.strictEqual(data.ok, true);
  });

  // ==========================================
  // SUITE 4: TELEGRAM COMMAND ROUTING
  // ==========================================
  console.log('\n--- 4. Telegram Bot Commands Execution ---');

  const commandsToTest = [
    '/start',
    '/help',
    '/predictions',
    '/scout',
    '/value',
    '/tips',
    '/matches',
    '/watchlist',
    '/alerts',
    '/account',
    '/vip'
  ];

  for (const cmd of commandsToTest) {
    await testAsync(`Processes command: ${cmd}`, async () => {
      fetchCalls = [];
      const mockKV = createMockKV();
      const env = {
        TELEGRAM_BOT_TOKEN: FAKE_BOT_TOKEN,
        TELEGRAM_WEBHOOK_SECRET: FAKE_WEBHOOK_SECRET,
        USERS_KV: mockKV
      };

      const request = new Request('https://deeppredictbet.com/api/integrations/telegram/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-telegram-bot-api-secret-token': FAKE_WEBHOOK_SECRET
        },
        body: JSON.stringify({
          message: {
            chat: { id: 888888 },
            from: { id: 888888, username: 'punter_88' },
            text: cmd
          }
        })
      });

      const response = await webhookModule.onRequestPost({ request, env });
      assert.strictEqual(response.status, 200);
      assert.ok(fetchCalls.length >= 1, `Must dispatch a response to Telegram for ${cmd}`);
      const body = JSON.parse(fetchCalls[fetchCalls.length - 1].options.body);
      assert.strictEqual(body.chat_id, 888888);
      assert.ok(body.text.length > 10, 'Response text must contain formatted content');
    });
  }

  // ==========================================
  // SUITE 5: END-TO-END ACCOUNT LINKING FLOW
  // ==========================================
  console.log('\n--- 5. End-to-End Account Linking Flow ---');

  await testAsync('Generates one-time link token, links user via webhook, and invalidates token', async () => {
    const mockKV = createMockKV();
    const env = {
      TELEGRAM_BOT_TOKEN: FAKE_BOT_TOKEN,
      TELEGRAM_WEBHOOK_SECRET: FAKE_WEBHOOK_SECRET,
      USERS_KV: mockKV
    };

    // Step A: Seed user in KV
    const seedMembers = [
      {
        id: 'usr_test_link',
        fullName: 'Chidi Analyst',
        email: 'chidi@deeppredictbet.com',
        username: 'chidi_predict',
        role: 'USER',
        coinsBalance: 500
      }
    ];
    await mockKV.put('members_list', JSON.stringify(seedMembers));

    // Step B: Frontend generates link token via POST /api/integrations/telegram/link
    const linkReq = new Request('https://deeppredictbet.com/api/integrations/telegram/link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'usr_test_link',
        email: 'chidi@deeppredictbet.com',
        username: 'chidi_predict'
      })
    });

    const linkRes = await linkModule.onRequestPost({ request: linkReq, env });
    assert.strictEqual(linkRes.status, 200);
    const linkJson = await linkRes.json();
    assert.strictEqual(linkJson.success, true);
    assert.ok(linkJson.linkToken.startsWith('dplink_'));
    assert.ok(linkJson.deepLink.includes(linkJson.linkToken));

    // Step C: Telegram user clicks /start <linkToken> in bot
    fetchCalls = [];
    const tgUserId = 99887766;
    const webhookReq = new Request('https://deeppredictbet.com/api/integrations/telegram/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-telegram-bot-api-secret-token': FAKE_WEBHOOK_SECRET
      },
      body: JSON.stringify({
        message: {
          chat: { id: tgUserId },
          from: { id: tgUserId, username: 'chidi_tg', first_name: 'Chidi' },
          text: `/start ${linkJson.linkToken}`
        }
      })
    });

    const webhookRes = await webhookModule.onRequestPost({ request: webhookReq, env });
    assert.strictEqual(webhookRes.status, 200);

    // Step D: Verify member in KV now has Telegram identity attached
    const updatedMembersRaw = await mockKV.get('members_list');
    const updatedMembers = JSON.parse(updatedMembersRaw);
    const chidi = updatedMembers.find(m => m.id === 'usr_test_link');
    assert.ok(chidi.telegram, 'User must have telegram object');
    assert.strictEqual(chidi.telegram.linked, true);
    assert.strictEqual(chidi.telegram.id, tgUserId);
    assert.strictEqual(chidi.telegram.username, 'chidi_tg');

    // Step E: Verify one-time token was invalidated/deleted
    const consumedToken = await kvHelper.getLinkToken(env, linkJson.linkToken);
    assert.strictEqual(consumedToken, null, 'Link token must be invalidated after consumption');

    // Step F: Query link status via GET /api/integrations/telegram/link?userId=usr_test_link
    const statusReq = new Request('https://deeppredictbet.com/api/integrations/telegram/link?userId=usr_test_link', {
      method: 'GET'
    });
    const statusRes = await linkModule.onRequestGet({ request: statusReq, env });
    assert.strictEqual(statusRes.status, 200);
    const statusJson = await statusRes.json();
    assert.strictEqual(statusJson.linked, true);
    assert.strictEqual(statusJson.telegram.id, tgUserId);
    assert.strictEqual(statusJson.telegram.username, 'chidi_tg');

    // Step G: Test Unlinking via DELETE /api/integrations/telegram/link
    const unlinkReq = new Request('https://deeppredictbet.com/api/integrations/telegram/link', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'usr_test_link' })
    });
    const unlinkRes = await linkModule.onRequestDelete({ request: unlinkReq, env });
    assert.strictEqual(unlinkRes.status, 200);

    const postUnlinkMembers = JSON.parse(await mockKV.get('members_list'));
    const unlinkedChidi = postUnlinkMembers.find(m => m.id === 'usr_test_link');
    assert.strictEqual(unlinkedChidi.telegram, undefined, 'User telegram state must be cleared');
  });

  // ==========================================
  // SUITE 6: ADMIN HEALTH CHECK & SECRET ZERO-LEAKAGE
  // ==========================================
  console.log('\n--- 6. Admin Health Check & Secret Zero-Leakage ---');

  await testAsync('Health check blocks non-admin callers', async () => {
    const env = { TELEGRAM_BOT_TOKEN: FAKE_BOT_TOKEN };
    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/health', {
      headers: { 'Authorization': 'Bearer regular_user' }
    });
    const res = await healthModule.onRequestGet({ request: req, env });
    assert.strictEqual(res.status, 403);
  });

  await testAsync('Health check authorizes admin and NEVER exposes TELEGRAM_BOT_TOKEN', async () => {
    const env = {
      TELEGRAM_BOT_TOKEN: FAKE_BOT_TOKEN,
      TELEGRAM_WEBHOOK_SECRET: FAKE_WEBHOOK_SECRET,
      TELEGRAM_FREE_CHANNEL_ID: '@deeppredictbet',
      TELEGRAM_VIP_CHANNEL_ID: '-100123456789'
    };

    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/health', {
      headers: { 'Authorization': 'Bearer deep_admin_78_key' }
    });
    const res = await healthModule.onRequestGet({ request: req, env });
    assert.strictEqual(res.status, 200);

    const textBody = await res.text();
    // Rigorous security check: token must NOT appear anywhere in the body!
    assert.ok(!textBody.includes(FAKE_BOT_TOKEN), 'SECURITY VIOLATION: Bot token found in health check output!');
    assert.ok(!textBody.includes(FAKE_WEBHOOK_SECRET), 'SECURITY VIOLATION: Webhook secret found in health check output!');

    const json = JSON.parse(textBody);
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.configured, true);
    assert.strictEqual(json.checks.hasBotToken, true);
    assert.strictEqual(json.checks.hasWebhookSecret, true);
  });

  // ==========================================
  // SUITE 7: DIAGNOSTIC TEST & PUBLISH ENDPOINTS
  // ==========================================
  console.log('\n--- 7. Diagnostic Test & Publishing ---');

  await testAsync('Test endpoint transmits controlled diagnostic message without publishing live bets', async () => {
    fetchCalls = [];
    const env = {
      TELEGRAM_BOT_TOKEN: FAKE_BOT_TOKEN,
      TELEGRAM_FREE_CHANNEL_ID: '@deeppredictbet'
    };

    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer deep_admin_78_key'
      },
      body: JSON.stringify({ destinationChatId: '12345678' })
    });

    const res = await testModule.onRequestPost({ request: req, env });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.message.includes('transmitted successfully'));
  });

  // ==========================================
  // SUITE 8: SERVER-SIDE WEBHOOK REGISTRATION & DIAGNOSTICS
  // ==========================================
  console.log('\n--- 8. Server-Side Webhook Registration & Diagnostics ---');

  const registerWebhookModule = await import('./functions/api/integrations/telegram/register-webhook.js');
  const webhookStatusModule = await import('./functions/api/integrations/telegram/webhook-status.js');

  await testAsync('Blocks unauthenticated requests (missing header) with 401', async () => {
    const env = { TELEGRAM_BOT_TOKEN: FAKE_BOT_TOKEN };
    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/register-webhook', {
      method: 'POST'
    });
    const res = await registerWebhookModule.onRequestPost({ request: req, env });
    assert.strictEqual(res.status, 401);
    const json = await res.json();
    assert.ok(json.error.includes('Unauthorized'));
  });

  await testAsync('Blocks non-admin authenticated users with 403', async () => {
    const mockKV = createMockKV();
    const regularUser = [
      {
        id: 'usr_punter_99',
        fullName: 'Casual Punter',
        email: 'punter@gmail.com',
        username: 'punter99',
        role: 'USER',
        sessionId: 'dp_sess_punter_99'
      }
    ];
    await mockKV.put('members_list', JSON.stringify(regularUser));

    const env = {
      TELEGRAM_BOT_TOKEN: FAKE_BOT_TOKEN,
      USERS_KV: mockKV
    };

    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/register-webhook', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer dp_sess_punter_99' }
    });
    const res = await registerWebhookModule.onRequestPost({ request: req, env });
    assert.strictEqual(res.status, 403);
    const json = await res.json();
    assert.ok(json.error.includes('Forbidden'));
  });

  await testAsync('STRICT SECURITY: Rejects credentials passed in URL query parameters with 400', async () => {
    const env = { TELEGRAM_BOT_TOKEN: FAKE_BOT_TOKEN };

    // Register webhook endpoint attempt with ?adminKey=
    const reqPost = new Request('https://deeppredictbet.com/api/integrations/telegram/register-webhook?adminKey=deep_admin_78_key', {
      method: 'POST'
    });
    const resPost = await registerWebhookModule.onRequestPost({ request: reqPost, env });
    assert.strictEqual(resPost.status, 400, 'Must reject credentials in query parameters with 400 Bad Request');
    const jsonPost = await resPost.json();
    assert.ok(jsonPost.error.includes('query parameters'));

    // Webhook status endpoint attempt with ?adminKey=
    const reqGet = new Request('https://deeppredictbet.com/api/integrations/telegram/webhook-status?adminKey=deep_admin_78_key');
    const resGet = await webhookStatusModule.onRequestGet({ request: reqGet, env });
    assert.strictEqual(resGet.status, 400, 'Must reject credentials in query parameters with 400 Bad Request');
    const jsonGet = await resGet.json();
    assert.ok(jsonGet.error.includes('query parameters'));
  });

  await testAsync('Admin authoritatively registers webhook via Authorization: Bearer header', async () => {
    fetchCalls = [];
    mockFetchHandler = async (url, opts) => {
      if (url.includes('/setWebhook')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({ ok: true, result: true, description: 'Webhook was set' })
        };
      }
      return { ok: true, status: 200, json: async () => ({ ok: true }) };
    };

    const env = {
      TELEGRAM_BOT_TOKEN: FAKE_BOT_TOKEN,
      TELEGRAM_WEBHOOK_SECRET: FAKE_WEBHOOK_SECRET
    };

    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/register-webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer deep_admin_78_key'
      }
    });

    const res = await registerWebhookModule.onRequestPost({ request: req, env });
    assert.strictEqual(res.status, 200);

    const bodyText = await res.text();
    assert.ok(!bodyText.includes(FAKE_BOT_TOKEN), 'Token must not appear in response');

    const json = JSON.parse(bodyText);
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.webhookUrl, 'https://deeppredictbet.com/api/integrations/telegram/webhook');
    assert.strictEqual(json.hasSecretToken, true);

    // Verify exact Telegram API call made server-side
    const setWebhookCall = fetchCalls.find(c => c.url.includes('/setWebhook'));
    assert.ok(setWebhookCall, 'Must call /setWebhook on api.telegram.org');
    const sentPayload = JSON.parse(setWebhookCall.options.body);
    assert.strictEqual(sentPayload.url, 'https://deeppredictbet.com/api/integrations/telegram/webhook');
    assert.strictEqual(sentPayload.secret_token, FAKE_WEBHOOK_SECRET);

    mockFetchHandler = null;
  });

  await testAsync('Admin authoritatively registers webhook via X-Admin-Key header', async () => {
    fetchCalls = [];
    mockFetchHandler = async (url, opts) => {
      if (url.includes('/setWebhook')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({ ok: true, result: true, description: 'Webhook was set' })
        };
      }
      return { ok: true, status: 200, json: async () => ({ ok: true }) };
    };

    const env = {
      TELEGRAM_BOT_TOKEN: FAKE_BOT_TOKEN,
      TELEGRAM_WEBHOOK_SECRET: FAKE_WEBHOOK_SECRET
    };

    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/register-webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Key': 'deep_admin_78_key'
      }
    });

    const res = await registerWebhookModule.onRequestPost({ request: req, env });
    assert.strictEqual(res.status, 200);

    const json = await res.json();
    assert.strictEqual(json.success, true);
    mockFetchHandler = null;
  });

  await testAsync('Admin authoritatively registers webhook via verified admin session in KV', async () => {
    fetchCalls = [];
    mockFetchHandler = async (url, opts) => {
      if (url.includes('/setWebhook')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({ ok: true, result: true, description: 'Webhook was set' })
        };
      }
      return { ok: true, status: 200, json: async () => ({ ok: true }) };
    };

    const mockKV = createMockKV();
    const adminUser = [
      {
        id: 'usr_adm1',
        fullName: 'Alex Nnamdi (Admin)',
        email: 'admin@deeppredictbet.com',
        username: 'Egeruennamdi78',
        role: 'ADMIN',
        sessionId: 'dp_sess_admin_authorized_99'
      }
    ];
    await mockKV.put('members_list', JSON.stringify(adminUser));

    const env = {
      TELEGRAM_BOT_TOKEN: FAKE_BOT_TOKEN,
      TELEGRAM_WEBHOOK_SECRET: FAKE_WEBHOOK_SECRET,
      USERS_KV: mockKV
    };

    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/register-webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dp_sess_admin_authorized_99'
      }
    });

    const res = await registerWebhookModule.onRequestPost({ request: req, env });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);

    mockFetchHandler = null;
  });

  await testAsync('Safe webhook-status diagnostic reports getWebhookInfo via header without token exposure', async () => {
    fetchCalls = [];
    mockFetchHandler = async (url) => {
      if (url.includes('/getWebhookInfo')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            ok: true,
            result: {
              url: 'https://deeppredictbet.com/api/integrations/telegram/webhook',
              has_custom_certificate: false,
              pending_update_count: 0,
              last_error_date: 1727712000,
              last_error_message: 'Sample test error (handled)',
              max_connections: 40
            }
          })
        };
      }
      return { ok: true, status: 200, json: async () => ({ ok: true }) };
    };

    const env = {
      TELEGRAM_BOT_TOKEN: FAKE_BOT_TOKEN,
      TELEGRAM_WEBHOOK_SECRET: FAKE_WEBHOOK_SECRET
    };

    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/webhook-status', {
      headers: { 'Authorization': 'Bearer deep_admin_78_key' }
    });
    const res = await webhookStatusModule.onRequestGet({ request: req, env });
    assert.strictEqual(res.status, 200);

    const bodyText = await res.text();
    assert.ok(!bodyText.includes(FAKE_BOT_TOKEN), 'Bot token must never be exposed');
    assert.ok(!bodyText.includes(FAKE_WEBHOOK_SECRET), 'Webhook secret must never be exposed');

    const json = JSON.parse(bodyText);
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.webhookUrl, 'https://deeppredictbet.com/api/integrations/telegram/webhook');
    assert.strictEqual(json.pendingUpdateCount, 0);
    assert.ok(json.lastErrorDate);
    assert.ok(json.lastErrorMessage);

    mockFetchHandler = null;
  });

  await testAsync('Admin can safely unregister/delete webhook via Authorization header', async () => {
    fetchCalls = [];
    mockFetchHandler = async (url) => {
      if (url.includes('/deleteWebhook')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({ ok: true, result: true })
        };
      }
      return { ok: true, status: 200, json: async () => ({ ok: true }) };
    };

    const env = { TELEGRAM_BOT_TOKEN: FAKE_BOT_TOKEN };
    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/register-webhook', {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer deep_admin_78_key' }
    });

    const res = await registerWebhookModule.onRequestDelete({ request: req, env });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);

    const deleteCall = fetchCalls.find(c => c.url.includes('/deleteWebhook'));
    assert.ok(deleteCall, 'Must call /deleteWebhook on api.telegram.org');

    mockFetchHandler = null;
  });

  // ==========================================
  // SUITE 9: HARDENED ANTI-BYPASS & PRIVILEGE GATING AUDIT
  // ==========================================
  console.log('\n--- 9. Hardened Anti-Bypass & Privilege Gating Audit ---');

  const mockKVWithPunter = createMockKV();
  const punterAndAdmin = [
    {
      id: 'usr_punter_88',
      fullName: 'John Punter',
      email: 'john.punter@gmail.com',
      username: 'johnpunter',
      role: 'USER',
      sessionId: 'dp_sess_punter_active'
    },
    {
      id: 'usr_adm1',
      fullName: 'Alex Nnamdi (Admin)',
      email: 'admin@deeppredictbet.com',
      username: 'egeruennamdi78',
      role: 'ADMIN',
      sessionId: 'dp_sess_real_admin_secret'
    }
  ];
  await mockKVWithPunter.put('members_list', JSON.stringify(punterAndAdmin));

  const secureAuditEnv = {
    TELEGRAM_BOT_TOKEN: FAKE_BOT_TOKEN,
    TELEGRAM_WEBHOOK_SECRET: FAKE_WEBHOOK_SECRET,
    USERS_KV: mockKVWithPunter
  };

  await testAsync('Ordinary authenticated punter blocked from ALL 5 Telegram admin endpoints', async () => {
    const punterHeaders = {
      'Authorization': 'Bearer dp_sess_punter_active',
      'Content-Type': 'application/json'
    };

    // 1. register-webhook (POST)
    const resRegPost = await registerWebhookModule.onRequestPost({
      request: new Request('https://deeppredictbet.com/api/integrations/telegram/register-webhook', { method: 'POST', headers: punterHeaders }),
      env: secureAuditEnv
    });
    assert.strictEqual(resRegPost.status, 403, 'Punter must not POST register-webhook');

    // 2. register-webhook (GET)
    const resRegGet = await registerWebhookModule.onRequestGet({
      request: new Request('https://deeppredictbet.com/api/integrations/telegram/register-webhook', { method: 'GET', headers: punterHeaders }),
      env: secureAuditEnv
    });
    assert.strictEqual(resRegGet.status, 403, 'Punter must not GET register-webhook');

    // 3. register-webhook (DELETE)
    const resRegDel = await registerWebhookModule.onRequestDelete({
      request: new Request('https://deeppredictbet.com/api/integrations/telegram/register-webhook', { method: 'DELETE', headers: punterHeaders }),
      env: secureAuditEnv
    });
    assert.strictEqual(resRegDel.status, 403, 'Punter must not DELETE register-webhook');

    // 4. webhook-status (GET)
    const resStatus = await webhookStatusModule.onRequestGet({
      request: new Request('https://deeppredictbet.com/api/integrations/telegram/webhook-status', { method: 'GET', headers: punterHeaders }),
      env: secureAuditEnv
    });
    assert.strictEqual(resStatus.status, 403, 'Punter must not GET webhook-status');

    // 5. health (GET)
    const resHealth = await healthModule.onRequestGet({
      request: new Request('https://deeppredictbet.com/api/integrations/telegram/health', { method: 'GET', headers: punterHeaders }),
      env: secureAuditEnv
    });
    assert.strictEqual(resHealth.status, 403, 'Punter must not GET health');

    // 6. publish (POST)
    const resPublish = await publishModule.onRequestPost({
      request: new Request('https://deeppredictbet.com/api/integrations/telegram/publish', { method: 'POST', headers: punterHeaders, body: JSON.stringify({ message: 'test' }) }),
      env: secureAuditEnv
    });
    assert.strictEqual(resPublish.status, 403, 'Punter must not POST publish');

    // 7. test (POST)
    const resTest = await testModule.onRequestPost({
      request: new Request('https://deeppredictbet.com/api/integrations/telegram/test', { method: 'POST', headers: punterHeaders, body: JSON.stringify({ destinationChatId: '123' }) }),
      env: secureAuditEnv
    });
    assert.strictEqual(resTest.status, 403, 'Punter must not POST test');
  });

  await testAsync('ANTI-BYPASS: Rejects public identifiers (email, username, id) in Authorization header with 403', async () => {
    // Attempt 1: admin email
    const resEmail = await registerWebhookModule.onRequestPost({
      request: new Request('https://deeppredictbet.com/api/integrations/telegram/register-webhook', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer admin@deeppredictbet.com', 'Content-Type': 'application/json' }
      }),
      env: secureAuditEnv
    });
    assert.strictEqual(resEmail.status, 403, 'Passing admin email as bearer token must return 403 Forbidden');

    // Attempt 2: admin username
    const resUser = await registerWebhookModule.onRequestPost({
      request: new Request('https://deeppredictbet.com/api/integrations/telegram/register-webhook', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer egeruennamdi78', 'Content-Type': 'application/json' }
      }),
      env: secureAuditEnv
    });
    assert.strictEqual(resUser.status, 403, 'Passing admin username as bearer token must return 403 Forbidden');

    // Attempt 3: admin user ID
    const resId = await registerWebhookModule.onRequestPost({
      request: new Request('https://deeppredictbet.com/api/integrations/telegram/register-webhook', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer usr_adm1', 'Content-Type': 'application/json' }
      }),
      env: secureAuditEnv
    });
    assert.strictEqual(resId.status, 403, 'Passing admin user ID as bearer token must return 403 Forbidden');
  });

  await testAsync('ANTI-BYPASS: Rejects arbitrary Bearer token or arbitrary X-Admin-Key with 403', async () => {
    const resArbitraryBearer = await registerWebhookModule.onRequestPost({
      request: new Request('https://deeppredictbet.com/api/integrations/telegram/register-webhook', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer malicious_arbitrary_token_xyz', 'Content-Type': 'application/json' }
      }),
      env: secureAuditEnv
    });
    assert.strictEqual(resArbitraryBearer.status, 403);

    const resArbitraryXKey = await registerWebhookModule.onRequestPost({
      request: new Request('https://deeppredictbet.com/api/integrations/telegram/register-webhook', {
        method: 'POST',
        headers: { 'X-Admin-Key': 'malicious_x_admin_key_xyz', 'Content-Type': 'application/json' }
      }),
      env: secureAuditEnv
    });
    assert.strictEqual(resArbitraryXKey.status, 403);
  });

  await testAsync('ENVIRONMENT CONFIG: Authorizes custom ADMIN_SECRET_KEY when configured in Pages env', async () => {
    mockFetchHandler = async () => ({
      ok: true,
      status: 200,
      json: async () => ({ ok: true, result: true, description: 'Webhook was set' })
    });

    const customEnv = {
      TELEGRAM_BOT_TOKEN: FAKE_BOT_TOKEN,
      TELEGRAM_WEBHOOK_SECRET: FAKE_WEBHOOK_SECRET,
      ADMIN_SECRET_KEY: 'super_secret_custom_production_key_2026'
    };

    // Valid custom key passes
    const resValid = await registerWebhookModule.onRequestPost({
      request: new Request('https://deeppredictbet.com/api/integrations/telegram/register-webhook', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer super_secret_custom_production_key_2026', 'Content-Type': 'application/json' }
      }),
      env: customEnv
    });
    assert.strictEqual(resValid.status, 200);

    // Invalid key with custom env set fails
    const resInvalid = await registerWebhookModule.onRequestPost({
      request: new Request('https://deeppredictbet.com/api/integrations/telegram/register-webhook', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer wrong_key', 'Content-Type': 'application/json' }
      }),
      env: customEnv
    });
    assert.strictEqual(resInvalid.status, 403);

    mockFetchHandler = null;
  });

  await testAsync('Telegram webhook endpoint does NOT require admin credentials, only x-telegram-bot-api-secret-token', async () => {
    // Calling /webhook without admin credentials but WITH Telegram secret token succeeds
    const reqWebhook = new Request('https://deeppredictbet.com/api/integrations/telegram/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-telegram-bot-api-secret-token': FAKE_WEBHOOK_SECRET
      },
      body: JSON.stringify({
        update_id: 99999,
        message: {
          message_id: 1,
          chat: { id: 7777 },
          from: { id: 7777, first_name: 'Punter' },
          text: '/help'
        }
      })
    });

    const resWebhook = await webhookModule.onRequestPost({ request: reqWebhook, env: secureAuditEnv });
    assert.strictEqual(resWebhook.status, 200, 'Webhook must return 200 OK without any admin credentials');
    const json = await resWebhook.json();
    assert.strictEqual(json.ok, true);
  });

  // ==========================================
  // SUITE 10: USER TARGET ALERT & NUMERIC ID RESILIENCE
  // ==========================================
  console.log('\n--- 10. User Target Alert & Numeric ID Resilience ---');

  const mockKVWithTelegramUser = createMockKV();
  const linkedMembers = [
    {
      id: 'usr_linked_1',
      fullName: 'Alex Nnamdi',
      email: 'alex@deeppredictbet.com',
      username: 'alexnnamdi',
      role: 'ADMIN',
      telegram: {
        linked: true,
        id: 489343236, // Note: numeric integer ID as saved by Telegram API
        username: 'alex_tg',
        firstName: 'Alex',
        linkedAt: new Date().toISOString(),
        alertsEnabled: true
      }
    },
    {
      id: 'usr_unlinked_2',
      fullName: 'Unlinked Punter',
      email: 'unlinked@deeppredictbet.com',
      username: 'unlinked',
      role: 'USER'
    }
  ];
  await mockKVWithTelegramUser.put('members_list', JSON.stringify(linkedMembers));

  const alertTestEnv = {
    TELEGRAM_BOT_TOKEN: FAKE_BOT_TOKEN,
    ADMIN_SECRET_KEY: 'deep_admin_78_key',
    USERS_KV: mockKVWithTelegramUser
  };

  await testAsync('User target safely accepts numeric telegramUserId without throwing trim error', async () => {
    fetchCalls = [];
    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer deep_admin_78_key'
      },
      body: JSON.stringify({
        target: 'user',
        telegramUserId: 489343236, // Numeric ID from Telegram
        text: 'Test user push alert'
      })
    });

    const res = await publishModule.onRequestPost({ request: req, env: alertTestEnv });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.target, 'user');
    assert.ok(json.messageId);

    // Verify sendMessage was called with stringified chat_id
    const sendCall = fetchCalls.find(c => c.url.includes('/sendMessage'));
    assert.ok(sendCall);
    const payload = JSON.parse(sendCall.options.body);
    assert.strictEqual(String(payload.chat_id), '489343236');
  });

  await testAsync('User target authoritatively derives telegramUserId from KV members_list by email/userId', async () => {
    fetchCalls = [];
    // Omit telegramUserId; only provide email
    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer deep_admin_78_key'
      },
      body: JSON.stringify({
        target: 'user',
        email: 'alex@deeppredictbet.com',
        text: 'Authoritative account lookup push alert'
      })
    });

    const res = await publishModule.onRequestPost({ request: req, env: alertTestEnv });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);

    const sendCall = fetchCalls.find(c => c.url.includes('/sendMessage'));
    assert.ok(sendCall);
    const payload = JSON.parse(sendCall.options.body);
    assert.strictEqual(String(payload.chat_id), '489343236');
  });

  await testAsync('User target cleanly rejects request when user has no linked Telegram account with 400', async () => {
    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer deep_admin_78_key'
      },
      body: JSON.stringify({
        target: 'user',
        email: 'unlinked@deeppredictbet.com',
        text: 'This should fail cleanly'
      })
    });

    const res = await publishModule.onRequestPost({ request: req, env: alertTestEnv });
    assert.strictEqual(res.status, 400);
    const json = await res.json();
    assert.strictEqual(json.success, false);
    assert.ok(json.error.includes('No linked Telegram account found'));
  });

  // ==========================================
  // SUITE 11: VIP ACCESS CONTROL & ENTITLEMENT
  // ==========================================
  console.log('\n--- 11. VIP Telegram Access Control & Entitlement Engine ---');

  const vipMockKv = createMockKV();
  const VIP_CHANNEL_ID = '-1003701567883';
  const vipTestEnv = {
    TELEGRAM_BOT_TOKEN: FAKE_BOT_TOKEN,
    TELEGRAM_VIP_CHANNEL_ID: VIP_CHANNEL_ID,
    USERS_KV: vipMockKv
  };

  const testVipMembers = [
    {
      id: 'usr_admin',
      fullName: 'Alex Admin',
      email: 'admin@deeppredictbet.com',
      username: 'egeruennamdi78',
      role: 'ADMIN',
      sessionId: 'dp_sess_admin_test_1',
      sessionExpiresAt: Date.now() + 30 * 86400000,
      subscription: { active: false, tier: 'none' },
      telegram: { linked: true, id: 111111, username: 'admin_tg' }
    },
    {
      id: 'usr_annual_vip',
      fullName: 'VIP Annual User',
      email: 'vip_annual@deeppredictbet.com',
      username: 'vip_annual',
      role: 'VIP',
      sessionId: 'dp_sess_annual_test_1',
      sessionExpiresAt: Date.now() + 30 * 86400000,
      subscription: {
        active: true,
        tier: 'annual',
        status: 'ACTIVE',
        expiresAt: new Date(Date.now() + 30 * 86400000).toISOString()
      },
      telegram: { linked: true, id: 222222, username: 'vip_tg' }
    },
    {
      id: 'usr_monthly_vip',
      fullName: 'VIP Monthly User',
      email: 'vip_monthly@deeppredictbet.com',
      username: 'vip_monthly',
      role: 'PRO',
      sessionId: 'dp_sess_monthly_test_1',
      sessionExpiresAt: Date.now() + 15 * 86400000,
      subscription: {
        active: true,
        tier: 'monthly',
        status: 'ACTIVE',
        expiresAt: new Date(Date.now() + 15 * 86400000).toISOString()
      },
      telegram: { linked: true, id: 333333, username: 'monthly_tg' }
    },
    {
      id: 'usr_weekly_vip',
      fullName: 'VIP Weekly User',
      email: 'vip_weekly@deeppredictbet.com',
      username: 'vip_weekly',
      role: 'PRO',
      sessionId: 'dp_sess_weekly_test_1',
      sessionExpiresAt: Date.now() + 4 * 86400000,
      subscription: {
        active: true,
        tier: 'weekly',
        status: 'ACTIVE',
        expiresAt: new Date(Date.now() + 4 * 86400000).toISOString()
      },
      telegram: { linked: true, id: 444444, username: 'weekly_tg' }
    },
    {
      id: 'usr_expired',
      fullName: 'Expired User',
      email: 'expired@deeppredictbet.com',
      username: 'expired_user',
      role: 'VIP',
      sessionId: 'dp_sess_expired_test_1',
      sessionExpiresAt: Date.now() + 30 * 86400000,
      subscription: {
        active: true,
        tier: 'annual',
        status: 'EXPIRED',
        expiresAt: new Date(Date.now() - 86400000).toISOString() // Expired yesterday
      },
      telegram: { linked: true, id: 555555, username: 'expired_tg' }
    },
    {
      id: 'usr_inactive',
      fullName: 'Inactive User',
      email: 'inactive@deeppredictbet.com',
      username: 'inactive_user',
      role: 'USER',
      sessionId: 'dp_sess_inactive_test_1',
      sessionExpiresAt: Date.now() + 30 * 86400000,
      subscription: {
        active: false,
        tier: 'monthly',
        status: 'CANCELLED'
      },
      telegram: { linked: true, id: 666666, username: 'inactive_tg' }
    },
    {
      id: 'usr_unlinked_vip',
      fullName: 'Unlinked VIP User',
      email: 'unlinked_vip@deeppredictbet.com',
      username: 'unlinked_vip',
      role: 'VIP',
      sessionId: 'dp_sess_unlinked_test_1',
      sessionExpiresAt: Date.now() + 30 * 86400000,
      subscription: {
        active: true,
        tier: 'annual',
        status: 'ACTIVE',
        expiresAt: new Date(Date.now() + 30 * 86400000).toISOString()
      }
      // No telegram object
    },
    {
      id: 'usr_free',
      fullName: 'Free Punter',
      email: 'free@deeppredictbet.com',
      username: 'free_punter',
      role: 'USER',
      sessionId: 'dp_sess_free_test_1',
      sessionExpiresAt: Date.now() + 30 * 86400000,
      subscription: { active: false, tier: 'none' },
      telegram: { linked: true, id: 777777, username: 'free_tg' }
    },
    {
      id: 'usr_suspended',
      fullName: 'Suspended VIP',
      email: 'suspended@deeppredictbet.com',
      username: 'suspended_user',
      role: 'VIP',
      sessionId: 'dp_sess_suspended_test_1',
      sessionExpiresAt: Date.now() + 30 * 86400000,
      status: 'suspended',
      subscription: {
        active: true,
        tier: 'annual',
        status: 'ACTIVE',
        expiresAt: new Date(Date.now() + 30 * 86400000).toISOString()
      },
      telegram: { linked: true, id: 888888, username: 'suspended_tg' }
    },
    {
      id: 'usr_short_vip',
      fullName: 'Short VIP User',
      email: 'short_vip@deeppredictbet.com',
      username: 'short_vip',
      role: 'VIP',
      sessionId: 'dp_sess_short_test_1',
      sessionExpiresAt: Date.now() + 30 * 86400000,
      subscription: {
        active: true,
        tier: 'weekly',
        status: 'ACTIVE',
        expiresAt: new Date(Date.now() + 6 * 3600 * 1000).toISOString() // 6 hours remaining
      },
      telegram: { linked: true, id: 999111, username: 'short_tg' }
    },
    {
      id: 'usr_edge_vip',
      fullName: 'Edge VIP User',
      email: 'edge_vip@deeppredictbet.com',
      username: 'edge_vip',
      role: 'VIP',
      sessionId: 'dp_sess_edge_test_1',
      sessionExpiresAt: Date.now() + 30 * 86400000,
      subscription: {
        active: true,
        tier: 'weekly',
        status: 'ACTIVE',
        expiresAt: new Date(Date.now() + 120 * 1000).toISOString() // 2 minutes remaining (< 5 mins)
      },
      telegram: { linked: true, id: 999222, username: 'edge_tg' }
    },
    {
      id: 'usr_expired_session',
      fullName: 'Expired Session User',
      email: 'expired_sess@deeppredictbet.com',
      username: 'expired_sess',
      role: 'VIP',
      sessionId: 'dp_sess_expired_sess_1',
      sessionExpiresAt: Date.now() - 3600000, // Session expired 1 hour ago
      subscription: {
        active: true,
        tier: 'annual',
        status: 'ACTIVE',
        expiresAt: new Date(Date.now() + 30 * 86400000).toISOString()
      },
      telegram: { linked: true, id: 999333, username: 'expired_sess_tg' }
    }
  ];

  await vipMockKv.put('members_list', JSON.stringify(testVipMembers));

  // 1. isVipEligible unit tests
  test('isVipEligible: Authorizes Administrator permanently regardless of subscription', () => {
    const res = vipAccessService.isVipEligible(testVipMembers[0]);
    assert.strictEqual(res.eligible, true);
    assert.strictEqual(res.tier, 'admin');
    assert.strictEqual(res.reason, 'ADMIN_PERMANENT_ACCESS');
  });

  test('isVipEligible: Authorizes active Annual VIP subscriber', () => {
    const res = vipAccessService.isVipEligible(testVipMembers[1]);
    assert.strictEqual(res.eligible, true);
    assert.strictEqual(res.tier, 'annual');
    assert.strictEqual(res.reason, 'ACTIVE_ENTITLED_PLAN');
  });

  test('isVipEligible: Authorizes active Monthly VIP subscriber', () => {
    const res = vipAccessService.isVipEligible(testVipMembers[2]);
    assert.strictEqual(res.eligible, true);
    assert.strictEqual(res.tier, 'monthly');
  });

  test('isVipEligible: Authorizes active Weekly VIP subscriber', () => {
    const res = vipAccessService.isVipEligible(testVipMembers[3]);
    assert.strictEqual(res.eligible, true);
    assert.strictEqual(res.tier, 'weekly');
  });

  test('isVipEligible: Rejects expired subscriber without inventing grace period', () => {
    const res = vipAccessService.isVipEligible(testVipMembers[4]);
    assert.strictEqual(res.eligible, false);
    assert.strictEqual(res.reason, 'SUBSCRIPTION_EXPIRED');
  });

  test('isVipEligible: Rejects cancelled or inactive subscriber', () => {
    const res = vipAccessService.isVipEligible(testVipMembers[5]);
    assert.strictEqual(res.eligible, false);
    assert.strictEqual(res.reason, 'SUBSCRIPTION_INACTIVE');
  });

  test('isVipEligible: Rejects free tier punter without subscription', () => {
    const res = vipAccessService.isVipEligible(testVipMembers[7]);
    assert.strictEqual(res.eligible, false);
    assert.strictEqual(res.reason, 'NO_ACTIVE_SUBSCRIPTION');
  });

  test('isVipEligible: Rejects suspended or banned account', () => {
    const res = vipAccessService.isVipEligible(testVipMembers[8]);
    assert.strictEqual(res.eligible, false);
    assert.strictEqual(res.reason, 'ACCOUNT_SUSPENDED');
  });

  // Mock fetch handler for Telegram Bot API calls
  mockFetchHandler = async (url, options = {}) => {
    const bodyStr = options.body ? String(options.body) : '';
    let body = {};
    try { body = JSON.parse(bodyStr); } catch (e) {}

    if (url.includes('/createChatInviteLink')) {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          ok: true,
          result: {
            invite_link: `https://t.me/+fake_vip_invite_${Date.now()}`,
            name: body.name || 'DeepPredict VIP Pass',
            expire_date: body.expire_date || (Math.floor(Date.now() / 1000) + 86400),
            member_limit: body.member_limit || 1
          }
        })
      };
    }

    if (url.includes('/revokeChatInviteLink')) {
      return {
        ok: true,
        status: 200,
        json: async () => ({ ok: true, result: { invite_link: body.invite_link, is_revoked: true } })
      };
    }

    if (url.includes('/getChatMember')) {
      // Simulate member 222222 as 'left' initially, member 111111 as 'administrator'
      const uid = Number(body.user_id);
      if (uid === 111111) {
        return {
          ok: true,
          status: 200,
          json: async () => ({ ok: true, result: { status: 'administrator', user: { id: uid } } })
        };
      }
      return {
        ok: true,
        status: 200,
        json: async () => ({ ok: true, result: { status: 'left', user: { id: uid } } })
      };
    }

    if (url.includes('/banChatMember') || url.includes('/unbanChatMember')) {
      return {
        ok: true,
        status: 200,
        json: async () => ({ ok: true, result: true })
      };
    }

    return {
      ok: true,
      status: 200,
      json: async () => ({ ok: true, result: { message_id: 9999, id: 9999 } })
    };
  };

  // 2. VIP Access Endpoint (POST) tests
  await testAsync('POST /vip-access: Rejects unauthenticated caller with 401', async () => {
    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/vip-access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });

    const res = await vipAccessModule.onRequestPost({ request: req, env: vipTestEnv });
    assert.strictEqual(res.status, 401);
    const json = await res.json();
    assert.strictEqual(json.success, false);
    assert.strictEqual(json.code, 'UNAUTHENTICATED');
  });

  await testAsync('POST /vip-access: ANTI-SPOOFING: Rejects raw email in request body without session token with 401', async () => {
    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/vip-access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'vip_annual@deeppredictbet.com'
      })
    });

    const res = await vipAccessModule.onRequestPost({ request: req, env: vipTestEnv });
    assert.strictEqual(res.status, 401);
    const json = await res.json();
    assert.strictEqual(json.success, false);
    assert.strictEqual(json.code, 'UNAUTHENTICATED');
  });

  await testAsync('POST /vip-access: Rejects expired session token with 401 SESSION_EXPIRED', async () => {
    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/vip-access', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dp_sess_expired_sess_1'
      },
      body: JSON.stringify({})
    });

    const res = await vipAccessModule.onRequestPost({ request: req, env: vipTestEnv });
    assert.strictEqual(res.status, 401);
    const json = await res.json();
    assert.strictEqual(json.success, false);
    assert.strictEqual(json.code, 'SESSION_EXPIRED');
  });

  await testAsync('POST /vip-access: SERVER-AUTHORITATIVE: Rejects client-supplied isVip=true on free account with 403', async () => {
    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/vip-access', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dp_sess_free_test_1'
      },
      body: JSON.stringify({
        isVip: true, // Malicious client attempt to bypass paywall
        plan: 'annual',
        eligible: true
      })
    });

    const res = await vipAccessModule.onRequestPost({ request: req, env: vipTestEnv });
    assert.strictEqual(res.status, 403);
    const json = await res.json();
    assert.strictEqual(json.success, false);
    assert.strictEqual(json.eligible, false);
    assert.strictEqual(json.code, 'NO_ACTIVE_SUBSCRIPTION');
  });

  await testAsync('POST /vip-access: Rejects active VIP subscriber whose Telegram is not connected with 400', async () => {
    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/vip-access', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dp_sess_unlinked_test_1'
      },
      body: JSON.stringify({})
    });

    const res = await vipAccessModule.onRequestPost({ request: req, env: vipTestEnv });
    assert.strictEqual(res.status, 400);
    const json = await res.json();
    assert.strictEqual(json.success, false);
    assert.strictEqual(json.code, 'TELEGRAM_NOT_LINKED');
    assert.ok(json.error.includes('Connect your Telegram account'));
  });

  let generatedInviteUrl = '';
  await testAsync('POST /vip-access: Generates controlled single-use 24h VIP invite link for eligible linked user', async () => {
    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/vip-access', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dp_sess_annual_test_1'
      },
      body: JSON.stringify({})
    });

    const res = await vipAccessModule.onRequestPost({ request: req, env: vipTestEnv });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.eligible, true);
    assert.strictEqual(json.access.inviteAvailable, true);
    assert.strictEqual(json.access.channelJoined, false);
    assert.ok(json.access.inviteUrl.includes('fake_vip_invite'));
    assert.strictEqual(json.access.reused, false);
    generatedInviteUrl = json.access.inviteUrl;

    // Verify member_limit = 1 was passed to Telegram createChatInviteLink
    const inviteCall = fetchCalls.find(c => c.url.includes('/createChatInviteLink'));
    assert.ok(inviteCall);
    const payload = JSON.parse(inviteCall.options.body);
    assert.strictEqual(payload.member_limit, 1);
    assert.strictEqual(payload.chat_id, VIP_CHANNEL_ID);
  });

  await testAsync('POST /vip-access: IDEMPOTENCY: Reuses existing active invite link on duplicate click without generating a second link', async () => {
    fetchCalls = [];
    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/vip-access', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dp_sess_annual_test_1'
      },
      body: JSON.stringify({})
    });

    const res = await vipAccessModule.onRequestPost({ request: req, env: vipTestEnv });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.access.inviteUrl, generatedInviteUrl);
    assert.strictEqual(json.access.reused, true);

    // Telegram createChatInviteLink must NOT have been called again!
    const newInviteCall = fetchCalls.find(c => c.url.includes('/createChatInviteLink'));
    assert.strictEqual(newInviteCall, undefined);
  });

  await testAsync('POST /vip-access: Detects when user is already a channel member and bypasses invite generation', async () => {
    fetchCalls = [];
    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/vip-access', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dp_sess_admin_test_1'
      },
      body: JSON.stringify({})
    });

    const res = await vipAccessModule.onRequestPost({ request: req, env: vipTestEnv });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.access.channelJoined, true);
    assert.strictEqual(json.access.inviteAvailable, false);
    assert.strictEqual(json.access.inviteUrl, null);
    assert.ok(json.access.message.includes('already active'));
  });

  await testAsync('POST /vip-access: BOUNDED EXPIRY: Caps invite expiry to subscription end date when subscription has < 24h remaining', async () => {
    fetchCalls = [];
    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/vip-access', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dp_sess_short_test_1'
      },
      body: JSON.stringify({})
    });

    const res = await vipAccessModule.onRequestPost({ request: req, env: vipTestEnv });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.access.inviteAvailable, true);

    const inviteCall = fetchCalls.find(c => c.url.includes('/createChatInviteLink'));
    assert.ok(inviteCall);
    const payload = JSON.parse(inviteCall.options.body);
    const nowUnix = Math.floor(Date.now() / 1000);
    // Subscription expires in 6 hours (~21600 seconds)
    // Expiry date must be close to nowUnix + 21600, significantly less than 86400 (24h)
    const ttlSeconds = payload.expire_date - nowUnix;
    assert.ok(ttlSeconds <= 21605 && ttlSeconds >= 21500, `Expected TTL around 21600s, got ${ttlSeconds}s`);
  });

  await testAsync('POST /vip-access: REJECTION ON < 5 MINS REMAINING: Rejects invite generation with INSUFFICIENT_SUBSCRIPTION_TIME', async () => {
    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/vip-access', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dp_sess_edge_test_1'
      },
      body: JSON.stringify({})
    });

    const res = await vipAccessModule.onRequestPost({ request: req, env: vipTestEnv });
    assert.strictEqual(res.status, 400);
    const json = await res.json();
    assert.strictEqual(json.success, false);
    assert.strictEqual(json.code, 'INSUFFICIENT_SUBSCRIPTION_TIME');
    assert.ok(json.error.includes('minimum of 5 minutes'));
  });

  // 3. VIP Access Endpoint (GET) status tests
  await testAsync('GET /vip-access: Returns normalized State A (Active VIP + Linked + Not Member)', async () => {
    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/vip-access', {
      headers: { 'Authorization': 'Bearer dp_sess_monthly_test_1' }
    });
    const res = await vipAccessModule.onRequestGet({ request: req, env: vipTestEnv });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.eligible, true);
    assert.strictEqual(json.telegram.linked, true);
    assert.strictEqual(json.access.inviteAvailable, true);
    assert.strictEqual(json.access.channelJoined, false);
  });

  await testAsync('GET /vip-access: Returns normalized State B (Active VIP + Unlinked)', async () => {
    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/vip-access', {
      headers: { 'Authorization': 'Bearer dp_sess_unlinked_test_1' }
    });
    const res = await vipAccessModule.onRequestGet({ request: req, env: vipTestEnv });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.eligible, true);
    assert.strictEqual(json.telegram.linked, false);
    assert.strictEqual(json.access.inviteAvailable, false);
    assert.ok(json.access.message.includes('Telegram is not connected'));
  });

  await testAsync('GET /vip-access: Returns normalized State C (No Active VIP)', async () => {
    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/vip-access', {
      headers: { 'Authorization': 'Bearer dp_sess_free_test_1' }
    });
    const res = await vipAccessModule.onRequestGet({ request: req, env: vipTestEnv });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.eligible, false);
    assert.ok(json.access.message.includes('available to eligible subscribers'));
  });

  await testAsync('GET /vip-access: Returns normalized State D (Active VIP + Already Member)', async () => {
    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/vip-access', {
      headers: { 'Authorization': 'Bearer dp_sess_admin_test_1' }
    });
    const res = await vipAccessModule.onRequestGet({ request: req, env: vipTestEnv });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.eligible, true);
    assert.strictEqual(json.telegram.linked, true);
    assert.strictEqual(json.access.channelJoined, true);
    assert.ok(json.access.message.includes('Telegram VIP access is active'));
  });

  await testAsync('GET /vip-access: Returns normalized State E (Subscription Expired)', async () => {
    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/vip-access', {
      headers: { 'Authorization': 'Bearer dp_sess_expired_test_1' }
    });
    const res = await vipAccessModule.onRequestGet({ request: req, env: vipTestEnv });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.eligible, false);
    assert.strictEqual(json.subscription.status, 'EXPIRED');
    assert.ok(json.access.message.includes('expired'));
  });

  // 4. Revocation tests
  await testAsync('DELETE /vip-access: SAFETY GUARD: Refuses to revoke VIP access for an active entitled subscriber', async () => {
    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/vip-access', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer deep_admin_78_key'
      },
      body: JSON.stringify({ email: 'vip_annual@deeppredictbet.com' })
    });

    const res = await vipAccessModule.onRequestDelete({ request: req, env: vipTestEnv });
    assert.strictEqual(res.status, 400);
    const json = await res.json();
    assert.strictEqual(json.success, false);
    assert.ok(json.error.includes('Cannot revoke VIP access for an actively entitled subscriber'));
  });

  await testAsync('DELETE /vip-access: Successfully revokes expired subscriber and cleans up membership', async () => {
    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/vip-access', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer deep_admin_78_key'
      },
      body: JSON.stringify({ email: 'expired@deeppredictbet.com', reason: 'SUBSCRIPTION_EXPIRED' })
    });

    const res = await vipAccessModule.onRequestDelete({ request: req, env: vipTestEnv });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.message.includes('revoked successfully'));
  });

  // ==========================================
  // SUITE 12: TELEGRAM UNLINKING & VIP EVICTION
  // ==========================================
  console.log('\n--- 12. Telegram Unlinking & Automated VIP Eviction ---');

  await testAsync('DELETE /api/integrations/telegram/link: Revokes outstanding invite and evicts unlinked user from channel', async () => {
    fetchCalls = [];
    // Setup a user with active invite and active member status
    const unlinkingUser = {
      id: 'usr_to_unlink',
      email: 'unlink_me@deeppredictbet.com',
      username: 'unlink_me',
      role: 'VIP',
      sessionId: 'dp_sess_unlink_me_1',
      sessionExpiresAt: Date.now() + 30 * 86400000,
      subscription: { active: true, tier: 'annual', status: 'ACTIVE' },
      telegram: { linked: true, id: 999888, username: 'unlink_tg' },
      vipInvite: { inviteLink: 'https://t.me/+pending_invite_unlink', createdAt: new Date().toISOString() }
    };

    const members = await kvHelper.getMembers(vipTestEnv);
    members.push(unlinkingUser);
    await kvHelper.saveMembers(vipTestEnv, members);

    // Mock fetch to simulate user 999888 as a current channel 'member'
    const prevMock = mockFetchHandler;
    mockFetchHandler = async (url, options = {}) => {
      if (url.includes('/getChatMember')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({ ok: true, result: { status: 'member', user: { id: 999888 } } })
        };
      }
      return await prevMock(url, options);
    };

    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/link', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dp_sess_unlink_me_1'
      },
      body: JSON.stringify({})
    });

    const res = await linkModule.onRequestDelete({ request: req, env: vipTestEnv });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.unlinked, true);

    // Verify Telegram API calls:
    // 1. Revoked the outstanding invite
    const revokeCall = fetchCalls.find(c => c.url.includes('/revokeChatInviteLink'));
    assert.ok(revokeCall, 'Expected revokeChatInviteLink to be called');
    const revokePayload = JSON.parse(revokeCall.options.body);
    assert.strictEqual(revokePayload.invite_link, 'https://t.me/+pending_invite_unlink');

    // 2. Evicted from VIP channel via banChatMember + unbanChatMember
    const banCall = fetchCalls.find(c => c.url.includes('/banChatMember'));
    assert.ok(banCall, 'Expected banChatMember to be called');
    const banPayload = JSON.parse(banCall.options.body);
    assert.strictEqual(Number(banPayload.user_id), 999888);

    // 3. User record in KV updated
    const updatedMembers = await kvHelper.getMembers(vipTestEnv);
    const updatedUser = updatedMembers.find(m => m.id === 'usr_to_unlink');
    assert.strictEqual(updatedUser.telegram, undefined);
    assert.strictEqual(updatedUser.vipInvite, undefined);

    mockFetchHandler = prevMock;
  });

  // ==========================================
  // SUITE 13: VIP SCHEDULED SWEEPER & LOCKING
  // ==========================================
  console.log('\n--- 13. VIP Scheduled Sweeper & Distributed Locking ---');

  await testAsync('POST /sweep: Rejects unauthenticated caller with 401/403', async () => {
    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/sweep', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });

    const res = await sweepModule.onRequestPost({ request: req, env: vipTestEnv });
    assert.ok(res.status === 401 || res.status === 403);
    const json = await res.json();
    assert.strictEqual(json.success, false);
    assert.strictEqual(json.code, 'UNAUTHORIZED');
  });

  await testAsync('POST /sweep: Rejects caller passing admin key in query parameter with 400', async () => {
    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/sweep?adminKey=deep_admin_78_key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });

    const res = await sweepModule.onRequestPost({ request: req, env: vipTestEnv });
    assert.strictEqual(res.status, 400);
    const json = await res.json();
    assert.strictEqual(json.success, false);
  });

  await testAsync('POST /sweep: Successfully executes batch, revokes ineligible invites, evicts expired members, preserves active subscribers', async () => {
    fetchCalls = [];
    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/sweep', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer deep_admin_78_key'
      },
      body: JSON.stringify({ batchSize: 50 })
    });

    const res = await sweepModule.onRequestPost({ request: req, env: vipTestEnv });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.summary);
    assert.ok(json.summary.processedCount > 0);

    // Active subscribers must NEVER be banned or evicted
    const banCalls = fetchCalls.filter(c => c.url.includes('/banChatMember'));
    const bannedUserIds = banCalls.map(c => Number(JSON.parse(c.options.body).user_id));
    assert.strictEqual(bannedUserIds.includes(111111), false, 'Admin must not be banned');
    assert.strictEqual(bannedUserIds.includes(222222), false, 'Active annual VIP must not be banned');
    assert.strictEqual(bannedUserIds.includes(333333), false, 'Active monthly VIP must not be banned');
    assert.strictEqual(bannedUserIds.includes(444444), false, 'Active weekly VIP must not be banned');
  });

  await testAsync('POST /sweep: Prevents concurrent execution via distributed KV lock (409 SWEEP_IN_PROGRESS)', async () => {
    // Inject active lock
    await vipTestEnv.USERS_KV.put('vip_sweep_lock', JSON.stringify({
      timestamp: Date.now(),
      runId: 'active_lock_test'
    }), { expirationTtl: 300 });

    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/sweep', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer deep_admin_78_key'
      },
      body: JSON.stringify({})
    });

    const res = await sweepModule.onRequestPost({ request: req, env: vipTestEnv });
    assert.strictEqual(res.status, 409);
    const json = await res.json();
    assert.strictEqual(json.success, false);
    assert.strictEqual(json.code, 'SWEEP_IN_PROGRESS');

    // Clean up lock
    await vipTestEnv.USERS_KV.delete('vip_sweep_lock');
  });

  // ==========================================
  // SUITE 14: SERVER SESSION LIFECYCLE
  // ==========================================
  console.log('\n--- 14. Server Session Persistence & Revocation ---');

  let activeSessionId = '';
  await testAsync('POST /login: Generates secure session and persists sessionId and sessionExpiresAt to KV', async () => {
    const loginReq = new Request('https://deeppredictbet.com/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@deeppredictbet.com',
        password: 'Egeruennamdi78'
      })
    });

    const loginRes = await loginModule.onRequestPost({ request: loginReq, env: vipTestEnv });
    assert.strictEqual(loginRes.status, 200);
    const json = await loginRes.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.sessionId && json.sessionId.startsWith('dp_sess_'));
    assert.ok(json.sessionExpiresAt > Date.now());
    activeSessionId = json.sessionId;

    // Verify persisted to members_list in KV
    const storedMembers = JSON.parse(await vipTestEnv.USERS_KV.get('members_list'));
    const adminMember = storedMembers.find(m => m.email === 'admin@deeppredictbet.com');
    assert.strictEqual(adminMember.sessionId, json.sessionId);
    assert.strictEqual(adminMember.sessionExpiresAt, json.sessionExpiresAt);
  });

  await testAsync('POST /logout: Revokes sessionId and sessionExpiresAt from KV members_list', async () => {
    const logoutReq = new Request('https://deeppredictbet.com/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${activeSessionId}`
      },
      body: JSON.stringify({})
    });

    const logoutRes = await logoutModule.onRequestPost({ request: logoutReq, env: vipTestEnv });
    assert.strictEqual(logoutRes.status, 200);
    const json = await logoutRes.json();
    assert.strictEqual(json.success, true);

    // Verify revoked in KV
    const storedMembers = JSON.parse(await vipTestEnv.USERS_KV.get('members_list'));
    const adminMember = storedMembers.find(m => m.email === 'admin@deeppredictbet.com');
    assert.strictEqual(adminMember.sessionId, undefined);
    assert.strictEqual(adminMember.sessionExpiresAt, undefined);
  });

  console.log('\n--- 15. Audit Logging & Zero Leakage ---');

  // 5. Audit Logging tests
  await testAsync('Audit Logging: Structured VIP audit events recorded in KV without sensitive secrets', async () => {
    const logs = await kvHelper.getVipAuditLogs(vipTestEnv, 10);
    assert.ok(Array.isArray(logs));
    assert.ok(logs.length > 0);

    const firstLog = logs[0];
    assert.ok(firstLog.id.startsWith('aud_'));
    assert.ok(firstLog.action);
    assert.ok(firstLog.timestamp);

    // Verify strict zero credential leakage
    const logStr = JSON.stringify(logs);
    assert.strictEqual(logStr.includes(FAKE_BOT_TOKEN), false);
    assert.strictEqual(logStr.includes('deep_admin_78_key'), false);
    assert.strictEqual(logStr.includes('Egeruennamdi78'), false);
  });

  console.log('\n--- 16. Telegram Content Publisher & Deduplication Engine ---');

  await testAsync('GET /api/integrations/telegram/publish: Blocks unauthenticated caller with 401', async () => {
    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/publish', {
      method: 'GET'
    });
    const res = await publishModule.onRequestGet({ request: req, env: vipTestEnv });
    assert.strictEqual(res.status, 401);
  });

  await testAsync('GET /api/integrations/telegram/publish: Authorizes admin, returns history and linked users', async () => {
    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/publish', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer deep_admin_78_key'
      }
    });
    const res = await publishModule.onRequestGet({ request: req, env: vipTestEnv });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.history));
    assert.ok(Array.isArray(data.linkedUsers));
  });

  const uniquePostText = `⚽ <b>MATCH INTELLIGENCE: Arsenal vs Chelsea</b>\n🎯 Pick: Over 2.5 Goals\n📊 Confidence: 87%`;

  await testAsync('POST /api/integrations/telegram/publish: Publishes to Free Channel with inline CTA buttons', async () => {
    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer deep_admin_78_key'
      },
      body: JSON.stringify({
        target: 'free',
        postType: 'Match Intelligence',
        text: uniquePostText,
        buttons: [
          { text: '🔎 View Match Breakdown', url: 'https://deeppredictbet.com/#match-101' }
        ]
      })
    });
    const res = await publishModule.onRequestPost({ request: req, env: vipTestEnv });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.target, 'free');
    assert.strictEqual(data.postType, 'Match Intelligence');
    assert.ok(data.messageId);
  });

  await testAsync('POST /api/integrations/telegram/publish: Detects duplicate publication within 24h and rejects with 409', async () => {
    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer deep_admin_78_key'
      },
      body: JSON.stringify({
        target: 'free',
        postType: 'Match Intelligence',
        text: uniquePostText
      })
    });
    const res = await publishModule.onRequestPost({ request: req, env: vipTestEnv });
    assert.strictEqual(res.status, 409);
    const data = await res.json();
    assert.strictEqual(data.success, false);
    assert.strictEqual(data.duplicateDetected, true);
    assert.ok(data.previousPublishedAt);
  });

  await testAsync('POST /api/integrations/telegram/publish: Overrides duplicate block when forceDuplicate: true is set', async () => {
    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer deep_admin_78_key'
      },
      body: JSON.stringify({
        target: 'free',
        postType: 'Match Intelligence',
        text: uniquePostText,
        forceDuplicate: true
      })
    });
    const res = await publishModule.onRequestPost({ request: req, env: vipTestEnv });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
  });

  await testAsync('POST /api/integrations/telegram/publish: Publishes to VIP Channel with photo and inline buttons', async () => {
    const vipPostText = `🔒 <b>VIP BANKER SIGNAL</b>\n⚽ Real Madrid vs Barcelona\n🏆 Pick: Real Madrid Win & BTTS\n💰 Odds: 2.35`;
    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer deep_admin_78_key'
      },
      body: JSON.stringify({
        target: 'vip',
        postType: 'Value Intelligence',
        text: vipPostText,
        photoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2',
        buttons: [
          { text: '👑 View VIP Analysis', url: 'https://deeppredictbet.com/#match-202' }
        ]
      })
    });
    const res = await publishModule.onRequestPost({ request: req, env: vipTestEnv });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.target, 'vip');
  });

  await testAsync('Publish History: Confirms published records are logged and retrievable via getPublishHistory', async () => {
    const history = await kvHelper.getPublishHistory(vipTestEnv, 10);
    assert.ok(Array.isArray(history));
    assert.ok(history.length >= 3);
    const latest = history[0];
    assert.ok(latest.id.startsWith('pub_'));
    assert.strictEqual(latest.status, 'SUCCESS');
    assert.ok(latest.fingerprint);
  });

  // ==========================================
  // SUITE 17: INTELLIGENCE HUB, DATE VALIDATION & CONTENT ORCHESTRATION
  // ==========================================
  console.log('\n--- 17. Telegram Intelligence Hub, Date Validation & Content Orchestration ---');

  const SIMULATED_NOW_MS = new Date('2026-10-04T12:00:00Z').getTime();

  test('Authoritative Timestamp: Correctly resolves rawDate, dateSlot, timestamp and formatted time strings', () => {
    // 1. rawDate ISO string
    const m1 = { rawDate: '2026-10-04T16:30:00Z' };
    assert.strictEqual(telegramPublisher.getAuthoritativeTimestamp(m1), new Date('2026-10-04T16:30:00Z').getTime());

    // 2. dateSlot format: YYYY-MM-DD-HHMM
    const m2 = { dateSlot: '2026-10-05-1830' };
    assert.strictEqual(telegramPublisher.getAuthoritativeTimestamp(m2), Date.UTC(2026, 9, 5, 18, 30, 0));

    // 3. fixture.timestamp in epoch seconds
    const m3 = { fixture: { timestamp: 1789933500 } };
    assert.strictEqual(telegramPublisher.getAuthoritativeTimestamp(m3), 1789933500000);

    // 4. Formatted time string
    const m4 = { time: '4th, October 2026, 17:30' };
    const ts4 = telegramPublisher.getAuthoritativeTimestamp(m4);
    assert.ok(ts4 !== null);
    assert.strictEqual(new Date(ts4).getUTCFullYear(), 2026);
    assert.strictEqual(new Date(ts4).getUTCMonth(), 9); // October
    assert.strictEqual(new Date(ts4).getUTCDate(), 4);

    // 5. Finished time string (e.g. FT · 20 Sep 2026)
    const m5 = { time: 'FT · 20 Sep 2026' };
    const ts5 = telegramPublisher.getAuthoritativeTimestamp(m5);
    assert.ok(ts5 !== null);
    assert.strictEqual(new Date(ts5).getUTCFullYear(), 2026);
    assert.strictEqual(new Date(ts5).getUTCMonth(), 8); // September
    assert.strictEqual(new Date(ts5).getUTCDate(), 20);
  });

  test('Authoritative Kickoff Timezone: Formats time with both Nigerian WAT (UTC+1) and UTC', () => {
    // 2026-10-04 16:30 UTC -> 17:30 WAT
    const ts = Date.UTC(2026, 9, 4, 16, 30, 0);
    const formatted = telegramPublisher.formatAuthoritativeKickoff(ts, true);
    assert.ok(formatted.includes('WAT'), 'Must include WAT indicator');
    assert.ok(formatted.includes('UTC'), 'Must include UTC indicator');
    assert.ok(formatted.includes('17:30 WAT'), `Expected 17:30 WAT, got: ${formatted}`);
    assert.ok(formatted.includes('16:30 UTC'), `Expected 16:30 UTC, got: ${formatted}`);
  });

  test('Authoritative Event Status Resolution: Accurately classifies UPCOMING, LIVE, FINISHED, POSTPONED, and CANCELLED', () => {
    // Finished via FT flag
    const mFT = { isFT: true, status: 'FT', scores: { home: 2, away: 1 } };
    const sFT = telegramPublisher.resolveMatchStatus(mFT, SIMULATED_NOW_MS);
    assert.strictEqual(sFT.status, 'FINISHED');
    assert.strictEqual(sFT.isUpcoming, false);
    assert.strictEqual(sFT.isFinished, true);

    // Postponed
    const mPost = { status: 'POSTPONED' };
    const sPost = telegramPublisher.resolveMatchStatus(mPost, SIMULATED_NOW_MS);
    assert.strictEqual(sPost.status, 'POSTPONED');
    assert.strictEqual(sPost.isUpcoming, false);

    // Cancelled
    const mCanc = { status: 'CANCELLED' };
    const sCanc = telegramPublisher.resolveMatchStatus(mCanc, SIMULATED_NOW_MS);
    assert.strictEqual(sCanc.status, 'CANCELLED');
    assert.strictEqual(sCanc.isUpcoming, false);

    // Live match
    const mLive = { isLive: true, status: '2H', rawDate: '2026-10-04T11:45:00Z' };
    const sLive = telegramPublisher.resolveMatchStatus(mLive, SIMULATED_NOW_MS);
    assert.strictEqual(sLive.status, 'LIVE');
    assert.strictEqual(sLive.isLive, true);
    assert.strictEqual(sLive.isUpcoming, false);

    // Past kickoff
    const mPast = { rawDate: '2026-10-04T10:00:00Z' }; // 2 hours before simulated now
    const sPast = telegramPublisher.resolveMatchStatus(mPast, SIMULATED_NOW_MS);
    assert.strictEqual(sPast.status, 'FINISHED');
    assert.strictEqual(sPast.isUpcoming, false);

    // Strictly future kickoff
    const mFuture = { rawDate: '2026-10-04T16:30:00Z' }; // 4.5 hours after simulated now
    const sFuture = telegramPublisher.resolveMatchStatus(mFuture, SIMULATED_NOW_MS);
    assert.strictEqual(sFuture.status, 'UPCOMING');
    assert.strictEqual(sFuture.isUpcoming, true);
    assert.strictEqual(sFuture.isFinished, false);
  });

  test('CRITICAL REGRESSION TEST: Napoli vs Parma (20 Sep 2026, FT) is strictly excluded from upcoming predictions', () => {
    // Exact representation of match-13 from js/data.js
    const napoliVsParma = {
      id: 'match-13',
      date: 'yesterday',
      isYesterday: true,
      league: 'Serie A',
      leagueEmoji: '🇮🇹',
      rawDate: 1789933500000,
      time: 'FT · 20 Sep 2026',
      isLive: false,
      status: 'FT',
      statusShort: 'FT',
      isFT: true,
      homeTeam: { name: 'Napoli', logo: '🔵👑' },
      awayTeam: { name: 'Parma', logo: '🟡🔵' },
      scores: { home: 2, away: 1 },
      predictions: { home: 65, draw: 20, away: 15 },
      confidence: 'high',
      confidenceVal: 87, // High confidence that previously made it rank #1!
      insight: "Conte's Napoli secured a thrilling 2-1 comeback victory in stoppage time.",
      aiAnalysis: 'High intensity pressing in the final 20 minutes overwhelmed Parma down the flanks.'
    };

    // 1. Direct status check
    const status = telegramPublisher.resolveMatchStatus(napoliVsParma, SIMULATED_NOW_MS);
    assert.strictEqual(status.status, 'FINISHED');
    assert.strictEqual(status.isUpcoming, false);
    assert.strictEqual(status.isFinished, true);

    const isEligible = telegramPublisher.isMatchUpcomingEligible(napoliVsParma, SIMULATED_NOW_MS);
    assert.strictEqual(isEligible, false, 'Napoli vs Parma must NEVER be marked upcoming eligible');

    // 2. Pool filtering test: Pool contains finished Napoli vs Parma AND authentic upcoming matches
    const mixedPool = [
      napoliVsParma,
      {
        id: 'match-101',
        league: 'Premier League',
        rawDate: '2026-10-04T16:30:00Z',
        homeTeam: { name: 'Arsenal' },
        awayTeam: { name: 'Chelsea' },
        predictions: { home: 55, draw: 25, away: 20 },
        confidenceVal: 82
      },
      {
        id: 'match-102',
        league: 'La Liga',
        rawDate: '2026-10-04T19:00:00Z',
        homeTeam: { name: 'Real Madrid' },
        awayTeam: { name: 'Villarreal' },
        predictions: { home: 68, draw: 18, away: 14 },
        confidenceVal: 85
      }
    ];

    const filtered = telegramPublisher.filterAndSortMatches(mixedPool, {
      statusFilter: 'UPCOMING',
      dateRange: 'all_upcoming',
      sortBy: 'toptips_rank',
      rangeLimit: 10
    }, SIMULATED_NOW_MS);

    // Verify Napoli vs Parma is strictly purged from eligible list
    assert.strictEqual(filtered.totalEligible, 2);
    assert.strictEqual(filtered.matches.length, 2);
    const foundNapoli = filtered.matches.find(m => m.id === 'match-13');
    assert.strictEqual(foundNapoli, undefined, 'Finished Napoli fixture must NOT be in filtered results');

    // 3. Top Tip Generation: Must select an authentic upcoming match, never Napoli
    const topTipPost = telegramPublisher.composeTelegramPost({
      matches: [filtered.matches[0]],
      target: 'free',
      postType: 'Top Tip of the Day',
      selectedSources: { topTipsTracker: true, aiScout: true }
    });

    assert.ok(!topTipPost.text.includes('Napoli'), 'Post must NOT contain Napoli');
    assert.ok(!topTipPost.text.includes('Parma'), 'Post must NOT contain Parma');
    assert.ok(!topTipPost.text.includes('FT · 20 Sep 2026'), 'Post must NOT contain FT timestamp');
    assert.ok(topTipPost.text.includes('TOP TIP OF THE DAY'), 'Must generate valid Top Tip format');
    assert.ok(topTipPost.text.includes('Real Madrid') || topTipPost.text.includes('Arsenal'), 'Must select authentic upcoming match');
  });

  test('Strict Match Range Slicing & Anti-Backfill Rule: Never pads or backfills with old/fake matches', () => {
    // Scenario A: Only 4 eligible upcoming matches exist in pool
    const smallPool = [
      { id: 'm-1', rawDate: '2026-10-04T15:00:00Z', homeTeam: { name: 'A' }, awayTeam: { name: 'B' } },
      { id: 'm-2', rawDate: '2026-10-04T16:00:00Z', homeTeam: { name: 'C' }, awayTeam: { name: 'D' } },
      { id: 'm-3', rawDate: '2026-10-04T17:00:00Z', homeTeam: { name: 'E' }, awayTeam: { name: 'F' } },
      { id: 'm-4', rawDate: '2026-10-04T18:00:00Z', homeTeam: { name: 'G' }, awayTeam: { name: 'H' } }
    ];

    // Request range 1–10 (limit = 10)
    const result10 = telegramPublisher.filterAndSortMatches(smallPool, {
      statusFilter: 'UPCOMING',
      rangeLimit: 10,
      rangeFrom: 1,
      rangeTo: 10
    }, SIMULATED_NOW_MS);

    // CRITICAL REQUIREMENT: Must return exactly 4 matches, NOT 10!
    assert.strictEqual(result10.totalEligible, 4);
    assert.strictEqual(result10.matches.length, 4, 'Strict Rule: If 4 matches exist, return 4; never backfill to 10');
    assert.strictEqual(result10.rangeTo, 4);

    // Scenario B: Large pool with 25 eligible matches
    const largePool = [];
    for (let i = 1; i <= 25; i++) {
      largePool.push({
        id: `match-big-${i}`,
        rawDate: new Date(SIMULATED_NOW_MS + i * 3600 * 1000).toISOString(),
        homeTeam: { name: `Team ${i}A` },
        awayTeam: { name: `Team ${i}B` },
        confidenceVal: 70 + (i % 20)
      });
    }

    // Range 1–10
    const res1to10 = telegramPublisher.filterAndSortMatches(largePool, {
      statusFilter: 'UPCOMING',
      rangeLimit: 10,
      rangeFrom: 1,
      rangeTo: 10
    }, SIMULATED_NOW_MS);
    assert.strictEqual(res1to10.totalEligible, 25);
    assert.strictEqual(res1to10.matches.length, 10);
    assert.strictEqual(res1to10.isTruncated, true);

    // Range 1–20
    const res1to20 = telegramPublisher.filterAndSortMatches(largePool, {
      statusFilter: 'UPCOMING',
      rangeLimit: 20,
      rangeFrom: 1,
      rangeTo: 20
    }, SIMULATED_NOW_MS);
    assert.strictEqual(res1to20.matches.length, 20);

    // Custom Range 6–15 (10 matches)
    const res6to15 = telegramPublisher.filterAndSortMatches(largePool, {
      statusFilter: 'UPCOMING',
      rangeFrom: 6,
      rangeTo: 15
    }, SIMULATED_NOW_MS);
    assert.strictEqual(res6to15.matches.length, 10);
    assert.strictEqual(res6to15.matches[0].id, 'match-big-6');
    assert.strictEqual(res6to15.matches[9].id, 'match-big-15');
  });

  test('Date Range Filters: Accurately isolates today, tomorrow, next 24h, next 48h, and next 7d', () => {
    // Current test anchor: 2026-10-04T12:00:00Z
    const testPool = [
      { id: 'f-today', rawDate: '2026-10-04T18:00:00Z', homeTeam: { name: 'T1' }, awayTeam: { name: 'T2' } },
      { id: 'f-tomorrow', rawDate: '2026-10-05T15:00:00Z', homeTeam: { name: 'T3' }, awayTeam: { name: 'T4' } },
      { id: 'f-2d', rawDate: '2026-10-06T15:00:00Z', homeTeam: { name: 'T5' }, awayTeam: { name: 'T6' } },
      { id: 'f-5d', rawDate: '2026-10-09T15:00:00Z', homeTeam: { name: 'T7' }, awayTeam: { name: 'T8' } },
      { id: 'f-10d', rawDate: '2026-10-14T15:00:00Z', homeTeam: { name: 'T9' }, awayTeam: { name: 'T10' } }
    ];

    // Filter 'today'
    const todayRes = telegramPublisher.filterAndSortMatches(testPool, { dateRange: 'today', statusFilter: 'UPCOMING' }, SIMULATED_NOW_MS);
    assert.strictEqual(todayRes.matches.length, 1);
    assert.strictEqual(todayRes.matches[0].id, 'f-today');

    // Filter 'tomorrow'
    const tomorrowRes = telegramPublisher.filterAndSortMatches(testPool, { dateRange: 'tomorrow', statusFilter: 'UPCOMING' }, SIMULATED_NOW_MS);
    assert.strictEqual(tomorrowRes.matches.length, 1);
    assert.strictEqual(tomorrowRes.matches[0].id, 'f-tomorrow');

    // Filter 'next_24h' (includes today and part of tomorrow within 24h)
    const next24hRes = telegramPublisher.filterAndSortMatches(testPool, { dateRange: 'next_24h', statusFilter: 'UPCOMING' }, SIMULATED_NOW_MS);
    assert.strictEqual(next24hRes.matches.length, 1); // 18:00 is +6h; 15:00 tomorrow is +27h (outside 24h)

    // Filter 'next_48h'
    const next48hRes = telegramPublisher.filterAndSortMatches(testPool, { dateRange: 'next_48h', statusFilter: 'UPCOMING' }, SIMULATED_NOW_MS);
    assert.strictEqual(next48hRes.matches.length, 2); // f-today (+6h) and f-tomorrow (+27h)

    // Filter 'next_7d'
    const next7dRes = telegramPublisher.filterAndSortMatches(testPool, { dateRange: 'next_7d', statusFilter: 'UPCOMING' }, SIMULATED_NOW_MS);
    assert.strictEqual(next7dRes.matches.length, 4); // f-today, f-tomorrow, f-2d, f-5d (excludes f-10d)
  });

  test('Multi-Feature Extraction: Pulls and unifies intelligence across all engines by MATCH ID', () => {
    const fixture = {
      id: 'match-301',
      league: 'Champions League',
      rawDate: '2026-10-04T19:45:00Z',
      homeTeam: { name: 'Bayern Munich', form: ['W', 'W', 'W', 'W', 'D'] },
      awayTeam: { name: 'Inter Milan', form: ['W', 'D', 'W', 'L', 'W'] },
      predictions: { home: 62, draw: 22, away: 16 },
      confidenceVal: 89,
      aiAnalysis: 'Bayern vertical progression through Musiala creates defensive overloads.',
      insight: 'Inter defensive compactness tested by wide rotations.',
      topTips: ['uo25', 'win1']
    };

    const intel = telegramPublisher.extractIntelligenceForMatch(fixture, {
      predictions: true,
      topTipsTracker: true,
      aiScout: true,
      betDoctor: true,
      valueIntelligence: true,
      betGenerator: true
    });

    // Check backbone synchronization
    assert.strictEqual(intel.matchId, 'match-301');
    assert.strictEqual(intel.homeTeam, 'Bayern Munich');
    assert.strictEqual(intel.awayTeam, 'Inter Milan');
    assert.strictEqual(intel.league, 'Champions League');

    // Check predictions source
    assert.ok(intel.sources.predictions);
    assert.strictEqual(intel.sources.predictions.homeProb, 62);
    assert.strictEqual(intel.sources.predictions.confidenceVal, 89);

    // Check Top Tips source
    assert.ok(intel.sources.toptips);
    assert.strictEqual(intel.sources.toptips.modelVersion, 'DP-v3.4');
    assert.ok(intel.sources.toptips.market);

    // Check AI Scout source
    assert.ok(intel.sources.scout);
    assert.ok(intel.sources.scout.summary.includes('Musiala'));
    assert.ok(intel.sources.scout.keyFactors.length >= 3);

    // Check Bet Doctor source
    assert.ok(intel.sources.doctor);
    assert.ok(intel.sources.doctor.riskTier);

    // Check Value Intelligence source
    assert.ok(intel.sources.value);
    assert.ok(intel.sources.value.marketOdds > 0);
    assert.ok(intel.sources.value.expectedValue);

    // Check Generator Leg source
    assert.ok(intel.sources.generator);
    assert.ok(intel.sources.generator.selection);
  });

  test('Cross-Feature Consistency & Finished Match Guard: Rejects finished fixtures and malformed matches', () => {
    const validUpcoming = {
      id: 'match-301',
      rawDate: '2026-10-04T19:45:00Z',
      homeTeam: { name: 'Bayern Munich' },
      awayTeam: { name: 'Inter Milan' }
    };

    // Valid check
    const validCheck = telegramPublisher.validateIntelligenceConsistency([validUpcoming], SIMULATED_NOW_MS);
    assert.strictEqual(validCheck.valid, true);

    // Empty array rejection
    const emptyCheck = telegramPublisher.validateIntelligenceConsistency([], SIMULATED_NOW_MS);
    assert.strictEqual(emptyCheck.valid, false);
    assert.strictEqual(emptyCheck.error, 'No matches selected for publication.');

    // Missing Match ID rejection
    const missingId = { rawDate: '2026-10-04T19:45:00Z', homeTeam: { name: 'A' }, awayTeam: { name: 'B' } };
    const missingIdCheck = telegramPublisher.validateIntelligenceConsistency([missingId], SIMULATED_NOW_MS);
    assert.strictEqual(missingIdCheck.valid, false);
    assert.ok(missingIdCheck.error.includes('missing a valid Match ID'));

    // Finished match rejection (Napoli vs Parma)
    const finishedMatch = {
      id: 'match-13',
      time: 'FT · 20 Sep 2026',
      status: 'FT',
      isFT: true,
      homeTeam: { name: 'Napoli' },
      awayTeam: { name: 'Parma' }
    };
    const finishedCheck = telegramPublisher.validateIntelligenceConsistency([finishedMatch], SIMULATED_NOW_MS);
    assert.strictEqual(finishedCheck.valid, false);
    assert.ok(finishedCheck.error.includes('Cannot publish finished match "Napoli vs Parma"'));
  });

  test('Free vs VIP Channel Content Differentiation & Traceable Lineage', () => {
    const fixture = {
      id: 'match-401',
      league: 'Premier League',
      rawDate: '2026-10-04T16:30:00Z',
      homeTeam: { name: 'Liverpool' },
      awayTeam: { name: 'Manchester United' },
      predictions: { home: 60, draw: 22, away: 18 },
      confidenceVal: 88,
      aiAnalysis: 'Liverpool counter-pressing traps United early in build-up phase.',
      insight: 'High tempo battle anticipated at Anfield.'
    };

    // Free Channel Composition
    const freePost = telegramPublisher.composeTelegramPost({
      matches: [fixture],
      target: 'free',
      postType: 'Top Tip of the Day',
      selectedSources: { toptips: true, scout: true }
    });

    assert.ok(freePost.text.includes('TOP TIP OF THE DAY'));
    assert.ok(freePost.text.includes('Liverpool'));
    assert.ok(freePost.text.includes('https://deeppredictbet.com/#pricing'), 'Free post must include upgrade CTA');
    assert.ok(!freePost.text.includes('RECOMMENDED STAKE'), 'Free post must not expose stake sizing');

    // VIP Channel Composition
    const vipPost = telegramPublisher.composeTelegramPost({
      matches: [fixture],
      target: 'vip',
      postType: 'Match Intelligence',
      selectedSources: { predictions: true, toptips: true, scout: true, doctor: true, value: true }
    });

    assert.ok(vipPost.text.includes('VIP INTELLIGENCE DOSSIER'));
    assert.ok(vipPost.text.includes('VIP BANKER PICK'));
    assert.ok(vipPost.text.includes('AI SCOUT TACTICAL DEEP-DIVE'));
    assert.ok(vipPost.text.includes('AI BET DOCTOR AUDIT'));
    assert.ok(vipPost.text.includes('VALUE INTELLIGENCE ENGINE'));
    assert.ok(vipPost.text.includes('RECOMMENDED STAKE') && vipPost.text.includes('2.5 Units'), 'VIP post must include recommended stake');
    assert.ok(vipPost.text.includes('Confidential VIP intelligence'), 'VIP post must include confidentiality notice');

    // Lineage Audit Trail
    assert.ok(vipPost.lineage);
    assert.deepStrictEqual(vipPost.lineage.matchIds, ['match-401']);
    assert.strictEqual(vipPost.lineage.destination, 'vip');
    assert.strictEqual(vipPost.lineage.modelVersion, 'DP-v3.4');
    assert.strictEqual(vipPost.lineage.status, 'UPCOMING');
    assert.ok(vipPost.lineage.generatedAt);
  });

  test('Multi-Match Accumulator Post Composition: Correctly formats combined slip with odds', () => {
    const slipMatches = [
      {
        id: 'acc-1',
        league: 'Premier League',
        rawDate: '2026-10-04T15:00:00Z',
        homeTeam: { name: 'Arsenal' },
        awayTeam: { name: 'Bournemouth' },
        predictions: { home: 72, draw: 18, away: 10 },
        confidenceVal: 86
      },
      {
        id: 'acc-2',
        league: 'La Liga',
        rawDate: '2026-10-04T17:30:00Z',
        homeTeam: { name: 'Barcelona' },
        awayTeam: { name: 'Getafe' },
        predictions: { home: 75, draw: 15, away: 10 },
        confidenceVal: 88
      }
    ];

    const accPost = telegramPublisher.composeTelegramPost({
      matches: slipMatches,
      target: 'free',
      postType: 'Multi-Match Slip',
      selectedSources: { toptips: true }
    });

    assert.ok(accPost.text.includes('UPCOMING ACCUMULATOR'), 'Must include accumulator header');
    assert.ok(accPost.text.includes('Arsenal vs Bournemouth'));
    assert.ok(accPost.text.includes('Barcelona vs Getafe'));
    assert.ok(accPost.text.includes('Total Combined Odds:'));
    assert.ok(accPost.text.includes('Verified Matches:') && accPost.text.includes('2 Upcoming Fixtures'));
    assert.strictEqual(accPost.lineage.matchIds.length, 2);
    assert.strictEqual(accPost.lineage.postType, 'Multi-Match Accumulator');
  });

  // ==========================================
  // SUITE 18: TELEGRAM COMMAND CENTER, TAXONOMY, WORKSPACE & PERSISTENCE
  // ==========================================
  console.log('\n--- 18. Telegram Command Center, Multi-Tier Taxonomy & Production Automation ---');

  // 1. Taxonomy & Regional Classification
  test('Football Taxonomy: Accurately classifies domestic, continental, and international competitions', () => {
    // Domestic League
    const pl = telegramPublisher.classifyCompetition('Premier League');
    assert.strictEqual(pl.type, 'Domestic League');
    assert.strictEqual(pl.region, 'Europe');
    assert.strictEqual(pl.participantType, 'club');

    // Continental Club
    const ucl = telegramPublisher.classifyCompetition('UEFA Champions League');
    assert.strictEqual(ucl.type, 'Continental Club');
    assert.strictEqual(ucl.region, 'Europe');
    assert.strictEqual(ucl.participantType, 'club');

    const lib = telegramPublisher.classifyCompetition('Copa Libertadores');
    assert.strictEqual(lib.type, 'Continental Club');
    assert.strictEqual(lib.region, 'South America');

    // National Team Tournament
    const wc = telegramPublisher.classifyCompetition('World Cup 2026');
    assert.strictEqual(wc.type, 'World Cup');
    assert.strictEqual(wc.participantType, 'national_team');

    const wcq = telegramPublisher.classifyCompetition('World Cup Qualifiers');
    assert.strictEqual(wcq.type, 'World Cup Qualifier');
    assert.strictEqual(wcq.participantType, 'national_team');

    const afcon = telegramPublisher.classifyCompetition('AFCON 2025');
    assert.strictEqual(afcon.type, 'Continental Championship');
    assert.strictEqual(afcon.region, 'Africa');
    assert.strictEqual(afcon.participantType, 'national_team');

    const npfl = telegramPublisher.classifyCompetition('Nigeria NPFL');
    assert.strictEqual(npfl.type, 'Domestic League');
    assert.strictEqual(npfl.region, 'Africa');

    // Taxonomy Regions & Competition Types Integrity
    assert.ok(telegramPublisher.TAXONOMY_REGIONS['Africa']);
    assert.ok(telegramPublisher.TAXONOMY_REGIONS['Europe']);
    assert.ok(telegramPublisher.TAXONOMY_REGIONS['South America']);
    assert.ok(telegramPublisher.TAXONOMY_REGIONS['Africa'].countries.includes('Nigeria'));
    assert.ok(telegramPublisher.COMPETITION_TYPES.includes('Domestic League'));
    assert.ok(telegramPublisher.COMPETITION_TYPES.includes('Continental Club'));
    assert.ok(telegramPublisher.COMPETITION_TYPES.includes('National Team'));
  });

  test('National Team Match Validation: Authorizes valid participant types across competitions', () => {
    const clubMatch = { league: 'Premier League', homeTeam: { name: 'Arsenal' }, awayTeam: { name: 'Chelsea' } };
    assert.strictEqual(telegramPublisher.validateNationalTeamMatch(clubMatch).valid, true);

    const intlMatch = { league: 'World Cup', homeTeam: { name: 'Nigeria' }, awayTeam: { name: 'Brazil' } };
    assert.strictEqual(telegramPublisher.validateNationalTeamMatch(intlMatch).valid, true);
  });

  // 2. Consensus Engine
  test('Consensus Engine: Measures cross-engine agreement ratio and percentage', () => {
    const highConsensusFixture = {
      predictions: { home: 65, draw: 20, away: 15 },
      confidenceVal: 88,
      topTips: ['uo25', 'win1'],
      homeTeam: { name: 'Real Madrid', form: ['W', 'W', 'W', 'W', 'D'] },
      awayTeam: { name: 'Sevilla', form: ['L', 'D', 'L', 'W', 'L'] },
      aiAnalysis: 'Tactical dominance in half spaces creates sustained offensive threat.'
    };
    const cHigh = telegramPublisher.calculateIntelligenceConsensus(highConsensusFixture);
    assert.ok(cHigh.count >= 4, `Expected count >= 4, got ${cHigh.count}`);
    assert.strictEqual(cHigh.total, 5);
    assert.ok(cHigh.percentage >= 80);
    assert.ok(cHigh.agreement.includes('Strong Consensus'));

    const lowConsensusFixture = {
      predictions: { home: 34, draw: 33, away: 33 },
      confidenceVal: 55,
      topTips: [],
      homeTeam: { name: 'Team A', form: ['L', 'L', 'D'] },
      awayTeam: { name: 'Team B', form: ['D', 'D', 'L'] },
      aiAnalysis: ''
    };
    const cLow = telegramPublisher.calculateIntelligenceConsensus(lowConsensusFixture);
    assert.ok(cLow.count <= 1, `Expected count <= 1, got ${cLow.count}`);
    assert.ok(cLow.percentage <= 20);
    assert.strictEqual(cLow.agreement, 'Low Consensus');
  });

  // 3. Data Integrity Gate & Publishability Scorer
  test('Data Integrity Gate: Evaluates quality checklist, blocks finished matches & awards high scores to upcoming fixtures', () => {
    // 1. High-quality upcoming match
    const validUpcoming = {
      id: 'match-audit-upcoming-1',
      league: 'Premier League',
      rawDate: new Date(Date.now() + 4 * 3600000).toISOString(),
      homeTeam: { name: 'Arsenal' },
      awayTeam: { name: 'Chelsea' },
      predictions: { home: 58, draw: 22, away: 20 },
      confidenceVal: 84
    };
    const evalValid = telegramPublisher.evaluatePublishability([validUpcoming], { target: 'free' });
    assert.strictEqual(evalValid.ready, true);
    assert.ok(evalValid.score >= 80, `Expected score >= 80, got ${evalValid.score}`);
    assert.ok(evalValid.status === 'READY' || evalValid.status === 'WARNING');
    assert.strictEqual(evalValid.reasons.length, 0);

    // 2. Finished fixture (Napoli vs Parma FT regression immunity)
    const finishedNapoli = {
      id: 'match-13',
      league: 'Serie A',
      status: 'FT',
      isFT: true,
      time: 'FT · 20 Sep 2026',
      homeTeam: { name: 'Napoli' },
      awayTeam: { name: 'Parma' },
      predictions: { home: 65, draw: 20, away: 15 },
      confidenceVal: 87
    };
    const evalFinished = telegramPublisher.evaluatePublishability([finishedNapoli], { target: 'free' });
    assert.strictEqual(evalFinished.ready, false);
    assert.strictEqual(evalFinished.status, 'BLOCKED');
    const upcomingCheck = evalFinished.checks.find(c => c.label === 'Upcoming Match Validation');
    assert.ok(upcomingCheck && !upcomingCheck.passed, 'Upcoming check must fail on finished match');
    assert.ok(evalFinished.reasons.some(r => r.includes('FINISHED')));

    // 3. Missing Match ID
    const noIdMatch = {
      rawDate: new Date(Date.now() + 4 * 3600000).toISOString(),
      homeTeam: { name: 'Team X' },
      awayTeam: { name: 'Team Y' }
    };
    const evalNoId = telegramPublisher.evaluatePublishability([noIdMatch], { target: 'free' });
    assert.strictEqual(evalNoId.ready, false);
    const idCheck = evalNoId.checks.find(c => c.label === 'Match ID Synchronization');
    assert.ok(idCheck && !idCheck.passed, 'Must fail on missing match ID');
  });

  // 4. Content Discovery Multi-Tier Filtering & Anti-Backfill
  test('Content Discovery: Filters by Region, Competition Type, Country, and Consensus without backfilling', () => {
    const discoveryPool = [
      { id: 'disc-1', league: 'Nigeria NPFL', rawDate: '2026-10-06T15:00:00Z', homeTeam: { name: 'Enyimba' }, awayTeam: { name: 'Rangers' }, confidenceVal: 85, predictions: { home: 60, draw: 25, away: 15 }, topTips: ['win1'] },
      { id: 'disc-2', league: 'UEFA Champions League', rawDate: '2026-10-06T19:45:00Z', homeTeam: { name: 'Real Madrid' }, awayTeam: { name: 'Bayern Munich' }, confidenceVal: 88, predictions: { home: 52, draw: 26, away: 22 }, topTips: ['uo25'] },
      { id: 'disc-3', league: 'Premier League', rawDate: '2026-10-06T16:30:00Z', homeTeam: { name: 'Man City' }, awayTeam: { name: 'Liverpool' }, confidenceVal: 86, predictions: { home: 50, draw: 28, away: 22 }, topTips: ['uo25'] },
      { id: 'disc-4', league: 'Copa Libertadores', rawDate: '2026-10-06T23:00:00Z', homeTeam: { name: 'Flamengo' }, awayTeam: { name: 'River Plate' }, confidenceVal: 80, predictions: { home: 48, draw: 27, away: 25 } }
    ];

    // Filter by Region: Africa
    const africaRes = telegramPublisher.filterAndSortMatches(discoveryPool, { regionFilter: 'Africa' }, SIMULATED_NOW_MS);
    assert.strictEqual(africaRes.matches.length, 1);
    assert.strictEqual(africaRes.matches[0].id, 'disc-1');

    // Filter by Competition Type: Continental Club
    const contClubRes = telegramPublisher.filterAndSortMatches(discoveryPool, { compTypeFilter: 'Continental Club' }, SIMULATED_NOW_MS);
    assert.strictEqual(contClubRes.matches.length, 2);
    assert.ok(contClubRes.matches.some(m => m.id === 'disc-2'));
    assert.ok(contClubRes.matches.some(m => m.id === 'disc-4'));

    // Filter by Country: Nigeria
    const nigeriaRes = telegramPublisher.filterAndSortMatches(discoveryPool, { countryFilter: 'Nigeria' }, SIMULATED_NOW_MS);
    assert.strictEqual(nigeriaRes.matches.length, 1);
    assert.strictEqual(nigeriaRes.matches[0].id, 'disc-1');

    // Filter by Min Consensus: 4+
    const highConsensusRes = telegramPublisher.filterAndSortMatches(discoveryPool, { minConsensus: 4 }, SIMULATED_NOW_MS);
    assert.ok(highConsensusRes.matches.length >= 1);
    assert.ok(highConsensusRes.matches.every(m => telegramPublisher.calculateIntelligenceConsensus(m).count >= 4));

    // Anti-backfill rule: Requesting 10 when 4 exist returns exactly 4
    const antiBackfillRes = telegramPublisher.filterAndSortMatches(discoveryPool, { rangeLimit: 10, rangeFrom: 1, rangeTo: 10 }, SIMULATED_NOW_MS);
    assert.strictEqual(antiBackfillRes.matches.length, 4);
    assert.strictEqual(antiBackfillRes.rangeTo, 4);
    assert.strictEqual(antiBackfillRes.totalEligible, 4);
  });

  // 5. Content Recipes & Reusable Blocks
  test('Content Recipes: Validates 7 built-in recipes and recipe metadata structure', () => {
    const recipes = telegramPublisher.BUILT_IN_RECIPES;
    assert.ok(Array.isArray(recipes));
    assert.strictEqual(recipes.length, 7);

    const expectedRecipeIds = [
      'rcp_daily_toptips',
      'rcp_vip_dossier',
      'rcp_value_alert',
      'rcp_nigeria_digest',
      'rcp_europe_intel',
      'rcp_tournament_digest',
      'rcp_weekend_accumulator'
    ];
    expectedRecipeIds.forEach(id => {
      const found = recipes.find(r => r.id === id);
      assert.ok(found, `Expected built-in recipe ${id} to exist`);
      assert.ok(found.name);
      assert.ok(found.destination);
      assert.ok(found.postType);
      assert.ok(found.sources);
    });

    const vipDossier = recipes.find(r => r.id === 'rcp_vip_dossier');
    assert.strictEqual(vipDossier.destination, 'vip');
    assert.strictEqual(vipDossier.sources.doctor, true);
    assert.strictEqual(vipDossier.sources.value, true);

    const weekendAcc = recipes.find(r => r.id === 'rcp_weekend_accumulator');
    assert.strictEqual(weekendAcc.destination, 'free');
    assert.strictEqual(weekendAcc.sources.generator, true);
  });

  // 6. Draft Management via API
  let testDraftId = '';
  await testAsync('POST /api/integrations/telegram/publish (action: draft): Saves draft to KV and retrieves via GET', async () => {
    const saveReq = new Request('https://deeppredictbet.com/api/integrations/telegram/publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer deep_admin_78_key'
      },
      body: JSON.stringify({
        action: 'draft',
        draft: {
          target: 'free',
          postType: 'Top Tip of the Day',
          text: '📝 Draft Message for Weekend Fixture',
          buttons: [{ text: 'DeepLink', url: 'https://deeppredictbet.com/#match-1' }]
        }
      })
    });

    const saveRes = await publishModule.onRequestPost({ request: saveReq, env: vipTestEnv });
    assert.strictEqual(saveRes.status, 200);
    const saveJson = await saveRes.json();
    assert.strictEqual(saveJson.success, true);
    assert.ok(saveJson.draft.id.startsWith('drf_'));
    testDraftId = saveJson.draft.id;

    // Verify draft appears in GET /publish response
    const getReq = new Request('https://deeppredictbet.com/api/integrations/telegram/publish', {
      method: 'GET',
      headers: { 'Authorization': 'Bearer deep_admin_78_key' }
    });
    const getRes = await publishModule.onRequestGet({ request: getReq, env: vipTestEnv });
    assert.strictEqual(getRes.status, 200);
    const getJson = await getRes.json();
    assert.ok(Array.isArray(getJson.drafts));
    const foundDraft = getJson.drafts.find(d => d.id === testDraftId);
    assert.ok(foundDraft, 'Draft must be present in drafts list');
    assert.strictEqual(foundDraft.text, '📝 Draft Message for Weekend Fixture');
  });

  await testAsync('POST /api/integrations/telegram/publish (action: delete_draft): Deletes draft from KV', async () => {
    const delReq = new Request('https://deeppredictbet.com/api/integrations/telegram/publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer deep_admin_78_key'
      },
      body: JSON.stringify({
        action: 'delete_draft',
        draftId: testDraftId
      })
    });

    const delRes = await publishModule.onRequestPost({ request: delReq, env: vipTestEnv });
    assert.strictEqual(delRes.status, 200);
    const delJson = await delRes.json();
    assert.strictEqual(delJson.success, true);

    // Verify draft is removed
    const storedDrafts = await kvHelper.getDrafts(vipTestEnv);
    assert.strictEqual(storedDrafts.some(d => d.id === testDraftId), false);
  });

  // 7. Scheduling & Past Date Guard via API
  let testScheduleId = '';
  await testAsync('POST /api/integrations/telegram/publish (action: schedule): Rejects past schedule date with 400', async () => {
    const pastReq = new Request('https://deeppredictbet.com/api/integrations/telegram/publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer deep_admin_78_key'
      },
      body: JSON.stringify({
        action: 'schedule',
        scheduledAt: '2020-01-01T12:00:00Z',
        text: 'This should be rejected'
      })
    });

    const pastRes = await publishModule.onRequestPost({ request: pastReq, env: vipTestEnv });
    assert.strictEqual(pastRes.status, 400);
    const pastJson = await pastRes.json();
    assert.strictEqual(pastJson.success, false);
    assert.ok(pastJson.error.includes('Scheduled time must be in the future'));
  });

  await testAsync('POST /api/integrations/telegram/publish (action: schedule): Accepts future schedule and saves to KV', async () => {
    const futureDate = new Date(Date.now() + 4 * 3600000).toISOString();
    const schedReq = new Request('https://deeppredictbet.com/api/integrations/telegram/publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer deep_admin_78_key'
      },
      body: JSON.stringify({
        action: 'schedule',
        scheduledAt: futureDate,
        target: 'free',
        postType: 'Scheduled Preview',
        text: '⚽ Upcoming Match Countdown Preview'
      })
    });

    const schedRes = await publishModule.onRequestPost({ request: schedReq, env: vipTestEnv });
    assert.strictEqual(schedRes.status, 200);
    const schedJson = await schedRes.json();
    assert.strictEqual(schedJson.success, true);
    assert.ok(schedJson.schedule.id.startsWith('sch_'));
    testScheduleId = schedJson.schedule.id;

    // Verify schedule appears in KV
    const schedules = await kvHelper.getSchedules(vipTestEnv);
    const foundSched = schedules.find(s => s.id === testScheduleId);
    assert.ok(foundSched);
    assert.strictEqual(foundSched.scheduledAt, futureDate);
  });

  await testAsync('POST /api/integrations/telegram/publish (action: cancel_schedule): Successfully cancels schedule', async () => {
    const cancelReq = new Request('https://deeppredictbet.com/api/integrations/telegram/publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer deep_admin_78_key'
      },
      body: JSON.stringify({
        action: 'cancel_schedule',
        scheduleId: testScheduleId
      })
    });

    const cancelRes = await publishModule.onRequestPost({ request: cancelReq, env: vipTestEnv });
    assert.strictEqual(cancelRes.status, 200);
    const cancelJson = await cancelRes.json();
    assert.strictEqual(cancelJson.success, true);

    const storedSchedules = await kvHelper.getSchedules(vipTestEnv);
    assert.strictEqual(storedSchedules.some(s => s.id === testScheduleId), false);
  });

  // 8. Custom Recipes, Rules & Dry-Run Simulation Mode
  await testAsync('POST /api/integrations/telegram/publish (action: save_recipe & save_automation_rule): Persists custom recipe and automation rule', async () => {
    // Save recipe
    const recReq = new Request('https://deeppredictbet.com/api/integrations/telegram/publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer deep_admin_78_key'
      },
      body: JSON.stringify({
        action: 'save_recipe',
        recipe: {
          name: 'Custom High-Confidence Banker',
          destination: 'vip',
          postType: 'VIP Banker',
          sources: { predictions: true, toptips: true, scout: true }
        }
      })
    });
    const recRes = await publishModule.onRequestPost({ request: recReq, env: vipTestEnv });
    assert.strictEqual(recRes.status, 200);
    const recJson = await recRes.json();
    assert.strictEqual(recJson.success, true);
    assert.ok(recJson.recipe.id.startsWith('rcp_'));

    // Save automation rule
    const ruleReq = new Request('https://deeppredictbet.com/api/integrations/telegram/publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer deep_admin_78_key'
      },
      body: JSON.stringify({
        action: 'save_automation_rule',
        rule: {
          name: 'Auto-Post 85%+ Confidence Bankers',
          trigger: 'high_confidence',
          threshold: 85,
          minConsensus: 4,
          destination: 'vip',
          enabled: false // Strictly default OFF
        }
      })
    });
    const ruleRes = await publishModule.onRequestPost({ request: ruleReq, env: vipTestEnv });
    assert.strictEqual(ruleRes.status, 200);
    const ruleJson = await ruleRes.json();
    assert.strictEqual(ruleJson.success, true);
    assert.ok(ruleJson.rule.id.startsWith('aut_'));
  });

  await testAsync('POST /api/integrations/telegram/publish (action: simulate_automation): Dry-run simulation executes with ZERO live dispatches', async () => {
    fetchCalls = []; // Clear any existing mock calls

    const simReq = new Request('https://deeppredictbet.com/api/integrations/telegram/publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer deep_admin_78_key'
      },
      body: JSON.stringify({
        action: 'simulate_automation',
        rule: {
          name: 'Weekend Banker Auto-Trigger',
          threshold: 82,
          minConsensus: 3,
          destination: 'vip'
        },
        matches: [
          { id: 'm-sim-1', home: 'Arsenal', away: 'Chelsea', confidenceVal: 87, league: 'Premier League' },
          { id: 'm-sim-2', home: 'Fulham', away: 'Everton', confidenceVal: 74, league: 'Premier League' },
          { id: 'm-sim-3', home: 'Real Madrid', away: 'Getafe', confidenceVal: 89, league: 'La Liga' }
        ]
      })
    });

    const simRes = await publishModule.onRequestPost({ request: simReq, env: vipTestEnv });
    assert.strictEqual(simRes.status, 200);
    const simJson = await simRes.json();
    assert.strictEqual(simJson.success, true);
    assert.strictEqual(simJson.simulation.evaluatedCount, 3);
    assert.strictEqual(simJson.simulation.qualifyingCount, 2); // 87 and 89 >= 82
    assert.strictEqual(simJson.simulation.wouldPublish, true);
    assert.strictEqual(simJson.simulation.simulatedDestination, 'vip');

    // CRITICAL: Absolutely ZERO live Telegram messages must have been dispatched
    assert.strictEqual(fetchCalls.length, 0, 'Simulation mode must never dispatch live messages to Telegram');
  });

  // 9. CTA Deep-Link Tracking URL Builder
  test('Tracking CTA Deep-Link Builder: Formats attribution links with UTM parameters', () => {
    const matchUrl = telegramPublisher.buildCtaUrl('match_centre', 'match-501', 'TP-TEST-01');
    assert.strictEqual(matchUrl, 'https://deeppredictbet.com/#match-501?source=telegram&post=TP-TEST-01');

    const pricingUrl = telegramPublisher.buildCtaUrl('pricing', '', 'TP-TEST-01');
    assert.strictEqual(pricingUrl, 'https://deeppredictbet.com/#pricing?source=telegram&post=TP-TEST-01');

    const tipsUrl = telegramPublisher.buildCtaUrl('daily_tips', '', 'TP-TEST-01');
    assert.strictEqual(tipsUrl, 'https://deeppredictbet.com/#daily-tips?source=telegram&post=TP-TEST-01');

    const valueUrl = telegramPublisher.buildCtaUrl('value_bets', '', 'TP-TEST-01');
    assert.strictEqual(valueUrl, 'https://deeppredictbet.com/#value-bets?source=telegram&post=TP-TEST-01');

    const genUrl = telegramPublisher.buildCtaUrl('bet_generator', '', 'TP-TEST-01');
    assert.strictEqual(genUrl, 'https://deeppredictbet.com/#bet-generator?source=telegram&post=TP-TEST-01');
  });

  // ============================================================================
  // 19. ADMIN AUTHENTICATION HANDOFF & SESSION AUTHORIZATION AUDIT
  // ============================================================================
  console.log('\n--- 19. Admin Authentication Handoff & Session Authorization Audit ---');

  function createMockStorage() {
    let store = {};
    return {
      getItem: (k) => (k in store ? store[k] : null),
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; },
      clear: () => { store = {}; }
    };
  }

  const originalLocalStorage = global.localStorage;
  const originalSessionStorage = global.sessionStorage;

  test('getAdminSessionToken: Resolves dp_session_id from localStorage', () => {
    global.localStorage = createMockStorage();
    global.sessionStorage = createMockStorage();
    global.localStorage.setItem('dp_session_id', 'dp_sess_storage_token_123');
    const token = telegramPublisher.getAdminSessionToken();
    assert.strictEqual(token, 'dp_sess_storage_token_123');
  });

  test('getAdminSessionToken: Resolves dp_session_id from sessionStorage fallback', () => {
    global.localStorage = createMockStorage();
    global.sessionStorage = createMockStorage();
    global.sessionStorage.setItem('dp_session_id', 'dp_sess_session_token_456');
    const token = telegramPublisher.getAdminSessionToken();
    assert.strictEqual(token, 'dp_sess_session_token_456');
  });

  test('getAdminSessionToken: Resolves sessionId from deep_active_user object', () => {
    global.localStorage = createMockStorage();
    global.sessionStorage = createMockStorage();
    global.localStorage.setItem('deep_active_user', JSON.stringify({
      id: 'usr_adm1',
      email: 'admin@deeppredictbet.com',
      sessionId: 'dp_sess_active_user_789'
    }));
    const token = telegramPublisher.getAdminSessionToken();
    assert.strictEqual(token, 'dp_sess_active_user_789');
  });

  test('getAdminSessionToken: Returns empty string when no session is present', () => {
    global.localStorage = createMockStorage();
    global.sessionStorage = createMockStorage();
    const token = telegramPublisher.getAdminSessionToken();
    assert.strictEqual(token, '');
  });

  await testAsync('adminFetch: Attaches Authorization header automatically from dp_session_id', async () => {
    global.localStorage = createMockStorage();
    global.localStorage.setItem('dp_session_id', 'dp_sess_test_auth_header');
    fetchCalls = [];

    await telegramPublisher.adminFetch('https://deeppredictbet.com/api/test-endpoint');
    assert.strictEqual(fetchCalls.length, 1);
    const lastCall = fetchCalls[0];
    assert.strictEqual(lastCall.options.headers['Authorization'], 'Bearer dp_sess_test_auth_header');
  });

  // Setup test environment with KV members for session testing
  const authTestKV = createMockKV();
  const authAdminSession = 'dp_sess_valid_admin_session_999';
  const authExpiredAdminSession = 'dp_sess_expired_admin_session_888';
  const authPunterSession = 'dp_sess_punter_session_777';

  const authMembers = [
    {
      id: 'usr_adm1',
      fullName: 'Alex Nnamdi (Admin)',
      email: 'admin@deeppredictbet.com',
      username: 'Egeruennamdi78',
      role: 'ADMIN',
      sessionId: authAdminSession,
      sessionExpiresAt: Date.now() + 86400000 // Valid 24h
    },
    {
      id: 'usr_adm_exp',
      fullName: 'Expired Admin',
      email: 'egeruennamdi@gmail.com',
      username: 'egeruennamdi',
      role: 'ADMIN',
      sessionId: authExpiredAdminSession,
      sessionExpiresAt: Date.now() - 3600000 // Expired 1h ago
    },
    {
      id: 'usr_punter1',
      fullName: 'Regular Punter',
      email: 'punter@example.com',
      username: 'punter123',
      role: 'USER',
      sessionId: authPunterSession,
      sessionExpiresAt: Date.now() + 86400000
    }
  ];

  await authTestKV.put('members_list', JSON.stringify(authMembers));
  const authTestEnv = {
    TELEGRAM_BOT_TOKEN: FAKE_BOT_TOKEN,
    TELEGRAM_FREE_CHANNEL_ID: '-1001234567890',
    TELEGRAM_VIP_CHANNEL_ID: '-1009876543210',
    USERS_KV: authTestKV
  };

  await testAsync('POST /publish: Authorizes valid dp_session_id header for admin user', async () => {
    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authAdminSession}`
      },
      body: JSON.stringify({
        target: 'free',
        postType: 'Match Intelligence',
        text: '⚽ Test Post with Valid dp_session_id',
        forceDuplicate: true
      })
    });
    const res = await publishModule.onRequestPost({ request: req, env: authTestEnv });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
  });

  await testAsync('POST /publish: Rejects expired dp_session_id with 401 Session Expired', async () => {
    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authExpiredAdminSession}`
      },
      body: JSON.stringify({
        target: 'free',
        postType: 'Match Intelligence',
        text: '⚽ Test Post with Expired Session',
        forceDuplicate: true
      })
    });
    const res = await publishModule.onRequestPost({ request: req, env: authTestEnv });
    assert.strictEqual(res.status, 401);
    const data = await res.json();
    assert.strictEqual(data.success, false);
    assert.ok(data.error.includes('expired'));
  });

  await testAsync('POST /publish: Rejects unrecognized dp_session_id with 401 Session Invalid', async () => {
    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dp_sess_unknown_nonexistent'
      },
      body: JSON.stringify({
        target: 'free',
        postType: 'Match Intelligence',
        text: '⚽ Test Post with Invalid Session',
        forceDuplicate: true
      })
    });
    const res = await publishModule.onRequestPost({ request: req, env: authTestEnv });
    assert.strictEqual(res.status, 401);
    const data = await res.json();
    assert.strictEqual(data.success, false);
    assert.ok(data.error.includes('expired') || data.error.includes('invalid'));
  });

  await testAsync('POST /publish: Rejects non-admin user session with 403 Forbidden', async () => {
    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authPunterSession}`
      },
      body: JSON.stringify({
        target: 'free',
        postType: 'Match Intelligence',
        text: '⚽ Punter publish attempt',
        forceDuplicate: true
      })
    });
    const res = await publishModule.onRequestPost({ request: req, env: authTestEnv });
    assert.strictEqual(res.status, 403);
    const data = await res.json();
    assert.strictEqual(data.success, false);
    assert.ok(data.error.includes('privileges'));
  });

  await testAsync('POST /publish: Rejects missing Authorization header with 401 Missing Header', async () => {
    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        target: 'free',
        postType: 'Match Intelligence',
        text: '⚽ Missing auth header test',
        forceDuplicate: true
      })
    });
    const res = await publishModule.onRequestPost({ request: req, env: authTestEnv });
    assert.strictEqual(res.status, 401);
    const data = await res.json();
    assert.strictEqual(data.success, false);
    assert.ok(data.error.includes('Missing Authorization header'));
  });

  await testAsync('POST /publish: Rejects credential in URL query parameter with 400 Bad Request', async () => {
    const req = new Request(`https://deeppredictbet.com/api/integrations/telegram/publish?token=${authAdminSession}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        target: 'free',
        postType: 'Match Intelligence',
        text: '⚽ Query param security test',
        forceDuplicate: true
      })
    });
    const res = await publishModule.onRequestPost({ request: req, env: authTestEnv });
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.success, false);
    assert.ok(data.error.includes('Insecure Authentication'));
  });

  // ==========================================
  // SUITE 20: AUTHORITATIVE INTELLIGENCE SYNCHRONIZATION & COMMAND CENTER (SECTION 58 CRITERIA)
  // ==========================================
  console.log('\n--- 20. Authoritative Intelligence Synchronization & Command Center (Section 58) ---');

  // Req 1 & 3: Top Leagues Catalog
  test('Section 58.1 & 58.3: Top Leagues Catalog contains 96 canonical competitions with stable identities', () => {
    const leagues = telegramPublisher.getAuthoritativeTopLeagues();
    assert.ok(Array.isArray(leagues), 'Top leagues must be an array');
    assert.strictEqual(leagues.length, 96, 'Must contain exactly 96 canonical top competitions');
    leagues.forEach(l => {
      assert.ok(l.leagueId, `League ${l.name} must have stable leagueId`);
      assert.ok(l.name, 'League must have name');
      assert.ok(l.countryId, `League ${l.name} must have countryId`);
      assert.ok(l.tier, `League ${l.name} must have tier classification`);
    });
  });

  // Req 2: Dynamic Top Leagues Discovery
  test('Section 58.2: Dynamic discovery of newly added top leagues at runtime without code changes', () => {
    const initialCount = telegramPublisher.getAuthoritativeTopLeagues().length;
    globalThis.TOP_LEAGUES_DATA = [
      { leagueId: 'custom_league_dyn1', name: 'Super Dynamic League', countryId: 'nga', countryName: 'Nigeria', tier: 1 }
    ];
    const updatedLeagues = telegramPublisher.getAuthoritativeTopLeagues();
    assert.strictEqual(updatedLeagues.length, initialCount + 1);
    assert.ok(updatedLeagues.some(l => l.leagueId === 'custom_league_dyn1'));
    delete globalThis.TOP_LEAGUES_DATA;
    assert.strictEqual(telegramPublisher.getAuthoritativeTopLeagues().length, initialCount);
  });

  // Req 4 & 5: Country Directory A-Z
  test('Section 58.4 & 58.5: Country Directory Catalog contains 150 countries strictly sorted A-Z', () => {
    const countries = telegramPublisher.getAuthoritativeCountryDirectory();
    assert.ok(Array.isArray(countries), 'Countries must be an array');
    assert.strictEqual(countries.length, 150, 'Must contain exactly 150 countries');
    for (let i = 1; i < countries.length; i++) {
      assert.ok(
        countries[i].name.localeCompare(countries[i - 1].name) >= 0,
        `Country Directory must be alphabetically sorted: ${countries[i - 1].name} vs ${countries[i].name}`
      );
    }
  });

  // Req 6: Dynamic Country Directory Discovery
  test('Section 58.6: Dynamic discovery of newly registered countries at runtime', () => {
    const initialCount = telegramPublisher.getAuthoritativeCountryDirectory().length;
    globalThis.COUNTRY_LEAGUES_DATA = {
      'dyn_country': { name: 'Z-Fictional Island', flag: '🏝️', leagues: [] }
    };
    const updatedCountries = telegramPublisher.getAuthoritativeCountryDirectory();
    assert.strictEqual(updatedCountries.length, initialCount + 1);
    assert.ok(updatedCountries.some(c => c.name === 'Z-Fictional Island'));
    delete globalThis.COUNTRY_LEAGUES_DATA;
  });

  // Req 7, 8 & 9: Canonical Market Registry
  test('Section 58.7, 58.8 & 58.9: Canonical Market Registry contains 78 markets across 16 categories with dynamic extensibility', () => {
    const markets = telegramPublisher.getAuthoritativeMarketRegistry();
    assert.ok(Array.isArray(markets), 'Markets must be an array');
    assert.strictEqual(markets.length, 78, 'Must contain exactly 78 canonical betting markets');

    const categories = new Set(markets.map(m => m.category));
    assert.strictEqual(categories.size, 16, 'Must span exactly 16 betting market categories');

    markets.forEach(m => {
      assert.ok(m.key, 'Market must have key');
      assert.ok(m.name, 'Market must have name');
      assert.ok(m.category, 'Market must have category');
      assert.ok(m.shortCode, 'Market must have shortCode');
    });

    // Dynamic addition test
    globalThis.DYNAMIC_CUSTOM_MARKETS = [
      { key: 'mkt_custom_corners_race', name: 'Race to 7 Corners', category: 'Corners', shortCode: 'R7C' }
    ];
    const withCustom = telegramPublisher.getAuthoritativeMarketRegistry();
    assert.strictEqual(withCustom.length, 79);
    assert.ok(withCustom.some(m => m.key === 'mkt_custom_corners_race'));
    delete globalThis.DYNAMIC_CUSTOM_MARKETS;
  });

  // Req 10 & 11: Bet Generator Integration
  test('Section 58.10 & 58.11: Bet Generator import preserves booking code, odds, potential return and legs', () => {
    const sampleTicket = {
      bookingCode: 'BG-99214',
      odds: '4.85',
      potentialReturn: '$48.50',
      legs: [
        { match: 'Arsenal vs Chelsea', selection: 'Arsenal Win', odds: 1.85, league: 'Premier League' },
        { match: 'Real Madrid vs Sevilla', selection: 'Over 2.5 Goals', odds: 1.62, league: 'La Liga' },
        { match: 'Inter Milan vs Milan', selection: 'BTTS Yes', odds: 1.70, league: 'Serie A' }
      ]
    };
    const res = telegramPublisher.importFromBetGenerator(sampleTicket);
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.count, 3);
    assert.ok(res.postText.includes('BG-99214'));
    assert.ok(res.postText.includes('4.85'));
    assert.ok(res.postText.includes('Arsenal vs Chelsea'));
    assert.ok(res.postText.includes('Real Madrid vs Sevilla'));
  });

  // Req 12 & 13: AI Bet Doctor Integration & Authoritative Prescriptions Rule
  test('Section 58.12 & 58.13: Bet Doctor import respects authoritative prescriptions rule and health score', () => {
    const auditedSlip = {
      sourceType: 'betslip',
      healthScore: 94,
      prescriptionsApplied: true,
      legs: [
        {
          match: 'Bayern Munich vs Dortmund',
          selection: 'Over 3.5 Goals',
          odds: 1.95,
          originalSelection: 'Bayern Win (-1.5)',
          originalOdds: 2.30,
          status: 'PRESCRIPTION_APPLIED'
        }
      ]
    };
    const res = telegramPublisher.importFromBetDoctor(auditedSlip);
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.count, 1);
    assert.ok(res.postText.includes('94/100'));
    assert.ok(res.postText.includes('Over 3.5 Goals'));
    assert.ok(res.postText.includes('Prescriptions Applied'));
  });

  // Req 14 & 15: Top Tips Tracker Integration & Finished Match Gate
  test('Section 58.14 & 58.15: Top Tips Tracker import prioritizes ranked tips and strictly filters finished matches', () => {
    const rawTips = {
      qualifyingTips: [
        { matchId: 'tt-1', homeTeam: 'Napoli', awayTeam: 'Roma', league: 'Serie A', tip: 'Home Win', odds: 1.75, probability: 82, rank: 1, status: 'UPCOMING' },
        { matchId: 'tt-2', homeTeam: 'PSG', awayTeam: 'Lyon', league: 'Ligue 1', tip: 'Over 2.5', odds: 1.55, probability: 88, rank: 2, status: 'FINISHED' }
      ]
    };
    const res = telegramPublisher.importFromTopTipsTracker(rawTips);
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.count, 1, 'Finished match tt-2 must be excluded');
    assert.ok(res.postText.includes('Napoli vs Roma'));
    assert.ok(!res.postText.includes('PSG vs Lyon'));
  });

  // Req 16: AI Scout Integration
  test('Section 58.16: AI Scout import captures tactical breakdown and key intelligence factors', () => {
    const res = telegramPublisher.importFromAiScout();
    assert.strictEqual(res.success, true);
    assert.ok(res.postText.includes('AI SCOUT TACTICAL DOSSIER'));
    assert.ok(res.postText.includes('Tactical Breakdown'));
  });

  // Req 17: Value Intelligence Engine Integration
  test('Section 58.17: Value Intelligence import preserves EV%, fair odds, bookmaker price and edge', () => {
    const opps = [
      {
        opportunityId: 'opp-101',
        match: 'Liverpool vs Everton',
        homeTeam: 'Liverpool',
        awayTeam: 'Everton',
        league: 'Premier League',
        selectionName: 'Over 2.5 Goals',
        marketName: 'Over/Under',
        decimalOdds: 1.95,
        fairOdds: 1.72,
        modelProbability: 0.58,
        impliedProbability: 0.51,
        expectedValue: '13.4%',
        valueEdge: '+6.8pp',
        bookmakerName: 'Bet365'
      }
    ];
    const res = telegramPublisher.importFromValueIntelligence(opps);
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.count, 1);
    assert.ok(res.postText.includes('Liverpool vs Everton'));
    assert.ok(res.postText.includes('Over 2.5 Goals'));
    assert.ok(res.postText.includes('+13.4% EV'));
    assert.ok(res.postText.includes('@1.95'));
  });

  // Req 18: Unified Multi-Source Chaining
  test('Section 58.18: importFromSource allows dynamic routing across all intelligence engines', () => {
    const genRes = telegramPublisher.importFromSource('generator', { bookingCode: 'T-123', legs: [{ match: 'A vs B', selection: 'A', odds: 1.5 }] });
    assert.strictEqual(genRes.success, true);
    const docRes = telegramPublisher.importFromSource('doctor', { legs: [{ match: 'C vs D', selection: 'C', odds: 1.6 }] });
    assert.strictEqual(docRes.success, true);
    const tipRes = telegramPublisher.importFromSource('toptips', { qualifyingTips: [] });
    assert.strictEqual(tipRes.success, true);
  });

  // Req 19 & 20: Unlimited Match & Selection Pagination Controls
  test('Section 58.19 & 58.20: Pagination controls allow navigating unlimited match catalogs without caps', () => {
    telegramPublisher.setMatchPageSize(50);
    assert.strictEqual(telegramPublisher.getState().matchPageSize, 50);

    telegramPublisher.setMatchPage(3);
    assert.strictEqual(telegramPublisher.getState().matchPage, 3);

    telegramPublisher.nextMatchPage();
    assert.strictEqual(telegramPublisher.getState().matchPage, 4);

    telegramPublisher.prevMatchPage();
    assert.strictEqual(telegramPublisher.getState().matchPage, 3);
  });

  // Req 21, 22, 23 & 24: Match x Market Matrix Operations
  test('Section 58.21, 58.22, 58.23 & 58.24: Match x Market Matrix provides granular market selection, bulk apply, and reset', () => {
    // Individual selection
    const selRes = telegramPublisher.selectMarketForMatch('test-m-1', 'mkt_1x2_home', { active: true, odds: 2.10 });
    assert.strictEqual(selRes.success, true);
    assert.strictEqual(selRes.active, true);

    const mktList = telegramPublisher.getMarketsForMatch('test-m-1');
    assert.deepStrictEqual(mktList, ['mkt_1x2_home']);

    // Bulk apply
    const bulkRes = telegramPublisher.bulkApplyMarketsToMatches(['test-m-2', 'test-m-3'], ['mkt_ou_25_over', 'mkt_btts_yes']);
    assert.strictEqual(bulkRes.success, true);
    assert.strictEqual(bulkRes.matchCount, 2);
    assert.strictEqual(bulkRes.marketCount, 2);
    assert.strictEqual(telegramPublisher.getMarketsForMatch('test-m-2').length, 2);
    assert.strictEqual(telegramPublisher.getMarketsForMatch('test-m-3').length, 2);

    // Clear
    telegramPublisher.clearMatchMarketMatrix('test-m-1');
    assert.strictEqual(telegramPublisher.getMarketsForMatch('test-m-1').length, 0);
  });

  // Req 25: Manual Composition Mode
  test('Section 58.25: Manual composition mode operates independently', () => {
    telegramPublisher.setCompositionMode('manual');
    assert.strictEqual(telegramPublisher.getState().compositionMode, 'manual');
  });

  // Req 26 & 27: Dynamic Discovery Mode & Finished Match Filtering
  test('Section 58.26 & 58.27: Dynamic discovery applies rule-based filtering and excludes completed fixtures', () => {
    telegramPublisher.setDynamicRules({ minConfidence: 80, minEv: 5 });
    const discovered = telegramPublisher.runDynamicDiscovery({ minConfidence: 80 });
    assert.ok(Array.isArray(discovered));
    discovered.forEach(m => {
      assert.strictEqual(m._origin, 'dynamic');
      assert.notStrictEqual(m.status, 'FINISHED');
      assert.notStrictEqual(m.matchStatus, 'FT');
    });
  });

  // Req 28: Hybrid Composition Mode
  test('Section 58.28: Hybrid mode merges manual selections and dynamic discoveries without duplication', () => {
    telegramPublisher.setCompositionMode('hybrid');
    assert.strictEqual(telegramPublisher.getState().compositionMode, 'hybrid');

    const manualList = [
      { id: 'match-shared-1', homeTeam: { name: 'Alpha' }, awayTeam: { name: 'Beta' } },
      { id: 'match-manual-only', homeTeam: { name: 'Gamma' }, awayTeam: { name: 'Delta' } }
    ];
    const combined = telegramPublisher.combineManualAndDynamic(manualList, { minConfidence: 70 });
    assert.ok(combined.combinedMatches.length >= 2);
    assert.strictEqual(combined.manualCount, 2);

    const ids = combined.combinedMatches.map(m => m.id);
    const uniqueIds = new Set(ids);
    assert.strictEqual(ids.length, uniqueIds.size, 'Hybrid composition must never contain duplicate match IDs');
  });

  // Req 29 & 30: 14 Content Recipes & Legacy Backward Compatibility
  test('Section 58.29 & 58.30: All 14 content recipes are accessible while preserving 7 built-in recipes for legacy tests', () => {
    assert.strictEqual(telegramPublisher.BUILT_IN_RECIPES.length, 7, 'BUILT_IN_RECIPES must retain 7 legacy recipes');
    const allRecipes = telegramPublisher.getAvailableRecipes();
    assert.strictEqual(allRecipes.length, 14, 'getAvailableRecipes() must expose all 14 platform recipes');

    const expectedIds = [
      'rcp_daily_toptips', 'rcp_vip_dossier', 'rcp_value_alert', 'rcp_nigeria_digest',
      'rcp_europe_intel', 'rcp_tournament_digest', 'rcp_weekend_accumulator',
      'rcp_both_teams_score', 'rcp_goals_over_under', 'rcp_draw_no_bet',
      'rcp_high_confidence_acc', 'rcp_doctor_prescribed_special', 'rcp_scout_deep_tactical',
      'rcp_underdog_value_hunter'
    ];
    expectedIds.forEach(id => {
      assert.ok(allRecipes.some(r => r.id === id), `Recipe ${id} must be registered in 14-recipe catalog`);
    });
  });

  // Req 31 & 32: Telegram Message Batching (>3800 chars) & Batch IDs
  test('Section 58.31 & 58.32: Telegram batching engine partitions oversized posts without truncation and stamps standard batch IDs', () => {
    const longText = '⚽ Match Intelligence Dossier: Analyzing comprehensive tactical setup, form guide, expected value.\n'.repeat(50);
    assert.ok(longText.length > 3800, 'Test payload must exceed 3800 characters');

    const batches = telegramPublisher.batchTelegramPost(longText, {
      destination: 'free',
      postType: 'Weekend Intelligence Dossier'
    });

    assert.ok(batches.length > 1, 'Long message must be split into multiple batch parts');
    const batchIdRegex = /^TG-BATCH-\d{8}-[A-Z0-9]{4}$/;

    batches.forEach((b, idx) => {
      assert.strictEqual(b.partNumber, idx + 1);
      assert.strictEqual(b.totalParts, batches.length);
      assert.ok(batchIdRegex.test(b.batchId), `Batch ID ${b.batchId} must match TG-BATCH-YYYYMMDD-XXXX format`);
      assert.ok(b.text.includes(`Part ${idx + 1} of ${batches.length}`));
      assert.ok(b.text.includes(`Batch: ${b.batchId}`));
      assert.ok(b.text.length <= 4096, `Part ${idx + 1} must not exceed Telegram 4096 limit`);
    });

    const shortBatches = telegramPublisher.batchTelegramPost('Short message under limit', { destination: 'free' });
    assert.strictEqual(shortBatches.length, 1);
    assert.strictEqual(shortBatches[0].partNumber, 1);
    assert.strictEqual(shortBatches[0].totalParts, 1);
  });

  // Req 33: Freshness & Anti-Backfill Safeguard
  test('Section 58.33: Anti-backfill rule and freshness check strictly prohibit finished fixture backfilling', () => {
    const finishedMatch = {
      id: 'fin-match-99',
      league: 'Premier League',
      status: 'FINISHED',
      matchStatus: 'FT',
      rawDate: '2026-10-05T15:00:00Z',
      homeTeam: { name: 'Past Home' },
      awayTeam: { name: 'Past Away' }
    };
    const isEligible = telegramPublisher.isMatchUpcomingEligible(finishedMatch, SIMULATED_NOW_MS);
    assert.strictEqual(isEligible, false, 'Completed fixture must not be eligible for upcoming publication');

    const evalResult = telegramPublisher.evaluatePublishability(finishedMatch, SIMULATED_NOW_MS);
    assert.strictEqual(evalResult.eligible, false, 'Publishability scorer must reject completed fixture');
  });

  // Req 34: Zero Credential Leakage & Security Verification
  test('Section 58.34: Frontend bundle contains zero hardcoded admin secrets, bot tokens, or webhook secrets', () => {
    const fs = require('fs');
    const publisherJs = fs.readFileSync('js/telegramPublisher.js', 'utf8');
    const appJs = fs.readFileSync('js/app.js', 'utf8');
    const indexHtml = fs.readFileSync('index.html', 'utf8');

    const forbiddenPatterns = [
      /ADMIN_SECRET_KEY\s*=\s*['"`][^'"`]+['"`]/,
      /TELEGRAM_BOT_TOKEN\s*=\s*['"`]\d+:[A-Za-z0-9_-]+['"`]/,
      /TELEGRAM_WEBHOOK_SECRET\s*=\s*['"`][^'"`]{8,}['"`]/,
      /bot\d+:[A-Za-z0-9_-]{20,}/
    ];

    [publisherJs, appJs, indexHtml].forEach((fileContent, idx) => {
      forbiddenPatterns.forEach(pattern => {
        assert.ok(
          !pattern.test(fileContent),
          `Security violation: Pattern ${pattern} detected in client bundle (file index ${idx})`
        );
      });
    });
  });

  // Restore globals
  global.localStorage = originalLocalStorage;
  global.sessionStorage = originalSessionStorage;

  console.log(`\n==================================================`);
  console.log(`TELEGRAM INTEGRATION RESULTS: ${passed} passed, ${failed} failed.`);
  console.log(`==================================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
