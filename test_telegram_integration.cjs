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
      subscription: { active: false, tier: 'none' },
      telegram: { linked: true, id: 111111, username: 'admin_tg' }
    },
    {
      id: 'usr_annual_vip',
      fullName: 'VIP Annual User',
      email: 'vip_annual@deeppredictbet.com',
      username: 'vip_annual',
      role: 'VIP',
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
      subscription: { active: false, tier: 'none' },
      telegram: { linked: true, id: 777777, username: 'free_tg' }
    },
    {
      id: 'usr_suspended',
      fullName: 'Suspended VIP',
      email: 'suspended@deeppredictbet.com',
      username: 'suspended_user',
      role: 'VIP',
      status: 'suspended',
      subscription: {
        active: true,
        tier: 'annual',
        status: 'ACTIVE',
        expiresAt: new Date(Date.now() + 30 * 86400000).toISOString()
      },
      telegram: { linked: true, id: 888888, username: 'suspended_tg' }
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
      json: async () => ({ ok: true, result: {} })
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

  await testAsync('POST /vip-access: SERVER-AUTHORITATIVE: Rejects client-supplied isVip=true on free account with 403', async () => {
    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/vip-access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'free@deeppredictbet.com',
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'unlinked_vip@deeppredictbet.com'
      })
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'vip_annual@deeppredictbet.com'
      })
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'vip_annual@deeppredictbet.com'
      })
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@deeppredictbet.com'
      })
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

  // 3. VIP Access Endpoint (GET) status tests
  await testAsync('GET /vip-access: Returns normalized State A (Active VIP + Linked + Not Member)', async () => {
    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/vip-access?email=vip_monthly@deeppredictbet.com');
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
    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/vip-access?email=unlinked_vip@deeppredictbet.com');
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
    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/vip-access?email=free@deeppredictbet.com');
    const res = await vipAccessModule.onRequestGet({ request: req, env: vipTestEnv });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.eligible, false);
    assert.ok(json.access.message.includes('available to eligible subscribers'));
  });

  await testAsync('GET /vip-access: Returns normalized State D (Active VIP + Already Member)', async () => {
    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/vip-access?email=admin@deeppredictbet.com');
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
    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/vip-access?email=expired@deeppredictbet.com');
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
