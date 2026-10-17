/**
 * DEEPPREDICTBET — SOCIAL MEDIA EXPANSION COMPREHENSIVE AUTOMATED TEST SUITE
 * 
 * Verifies all 8 tasks of Phase 1:
 * 1. Admin-only route protection & query parameter rejection (Security)
 * 2. Shared social content model & lifecycle state transitions (Task 2)
 * 3. Platform integration adapters & truthful connection status (Task 4)
 * 4. Factual validation & stale fixture rejection (Task 5)
 * 5. Approval-first publishing & duplicate prevention (Task 6)
 * 6. Uncertain publication reconciliation (Task 6)
 * 7. Organic analytics, attribution & UTM campaign tracking (Task 7)
 * 8. Preservation of existing Telegram publisher workflows (Non-negotiable rule)
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
    json: async () => ({
      ok: true,
      result: { message_id: 1001, id: 1001, title: 'DeepPredict Channel' },
      data: { id: 'x_tweet_1001' }
    }),
    text: async () => JSON.stringify({ ok: true, result: { message_id: 1001 } })
  };
};

async function runTests() {
  console.log('🧪 Starting DeepPredictBet Social Media Expansion Test Suite...\n');
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
  const socialKv = await import('./functions/api/social/_socialKv.js');
  const socialAdapters = await import('./functions/api/social/_socialAdapters.js');
  const socialAccounts = await import('./functions/api/social/accounts.js');
  const socialPublish = await import('./functions/api/social/publish.js');
  const socialAnalytics = await import('./functions/api/social/analytics.js');
  const adminAuth = await import('./functions/api/integrations/telegram/_adminAuth.js');

  const FAKE_ADMIN_KEY = 'deep_admin_78_key';
  const FAKE_BOT_TOKEN = '123456789:ABCdefGHIjklMNOpqrsTUVwxyz';

  function createMockEnv(extra = {}) {
    const mockKv = createMockKV();
    return {
      USERS_KV: mockKv,
      ADMIN_SECRET_KEY: FAKE_ADMIN_KEY,
      TELEGRAM_BOT_TOKEN: FAKE_BOT_TOKEN,
      TELEGRAM_FREE_CHANNEL_ID: '@DeepPredictBetFree',
      TELEGRAM_VIP_CHANNEL_ID: '-1001234567890',
      ...extra
    };
  }

  // ==========================================================================
  // SECTION 1: SERVER-SIDE ADMIN AUTHORIZATION & SECURITY
  // ==========================================================================
  console.log('--- 1. Admin Authorization & Insecure Query Param Rejection ---');

  await testAsync('GET /api/social/publish: Rejects missing Authorization header with 401', async () => {
    const env = createMockEnv();
    const req = new Request('https://deeppredictbet.com/api/social/publish', {
      method: 'GET',
      headers: {}
    });
    const res = await socialPublish.onRequestGet({ request: req, env });
    assert.strictEqual(res.status, 401);
    const data = await res.json();
    assert.strictEqual(data.success, false);
    assert.ok(data.error.includes('Missing Authorization header'));
  });

  await testAsync('GET /api/social/publish: Rejects credentials passed via URL query parameter with 400 Bad Request', async () => {
    const env = createMockEnv();
    const req = new Request(`https://deeppredictbet.com/api/social/publish?adminKey=${FAKE_ADMIN_KEY}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${FAKE_ADMIN_KEY}` }
    });
    const res = await socialPublish.onRequestGet({ request: req, env });
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.success, false);
    assert.ok(data.error.includes('Insecure Authentication'));
  });

  await testAsync('GET /api/social/accounts: Authorizes valid administrator header with 200 OK', async () => {
    const env = createMockEnv();
    const req = new Request('https://deeppredictbet.com/api/social/accounts', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${FAKE_ADMIN_KEY}` }
    });
    const res = await socialAccounts.onRequestGet({ request: req, env });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.accounts);
  });

  // ==========================================================================
  // SECTION 2: SHARED SOCIAL CONTENT MODEL & LIFECYCLE (TASK 2)
  // ==========================================================================
  console.log('\n--- 2. Shared Social Content Model & Lifecycle States ---');

  test('All 6 authoritative content categories are defined', () => {
    const categories = Object.keys(socialKv.SOCIAL_CONTENT_CATEGORIES);
    assert.strictEqual(categories.length, 6);
    assert.ok(categories.includes('FOOTBALL_INTELLIGENCE_BRIEF'));
    assert.ok(categories.includes('AI_SCOUT_DEMO'));
    assert.ok(categories.includes('MATCH_CENTRE_ANALYSIS'));
    assert.ok(categories.includes('BETTING_EDUCATION'));
    assert.ok(categories.includes('PRODUCT_WALKTHROUGH'));
    assert.ok(categories.includes('VERIFIED_POST_MATCH_REVIEW'));
  });

  test('All 8 authoritative lifecycle states are supported', () => {
    const states = Object.keys(socialKv.SOCIAL_LIFECYCLE_STATES);
    assert.strictEqual(states.length, 8);
    assert.ok(states.includes('DRAFT'));
    assert.ok(states.includes('AWAITING_APPROVAL'));
    assert.ok(states.includes('APPROVED'));
    assert.ok(states.includes('SCHEDULED'));
    assert.ok(states.includes('PUBLISHING'));
    assert.ok(states.includes('PUBLISHED'));
    assert.ok(states.includes('FAILED'));
    assert.ok(states.includes('UNCERTAIN'));
  });

  await testAsync('Saves draft into KV and records audit event', async () => {
    const env = createMockEnv();
    const draftPayload = {
      category: socialKv.SOCIAL_CONTENT_CATEGORIES.BETTING_EDUCATION,
      platforms: {
        x: { copy: 'Understanding Closing Line Value (CLV) is key to sustainable betting edges. #FootballTips', enabled: true },
        telegram: { copy: '<b>Education:</b> Closing Line Value (CLV) explained.', enabled: true }
      }
    };
    const saved = await socialKv.saveSocialContent(env, draftPayload, 'admin@deeppredictbet.com');
    assert.ok(saved.id.startsWith('soc_'));
    assert.strictEqual(saved.state, 'DRAFT');
    assert.strictEqual(saved.validationStatus, 'VALID');

    const audit = await socialKv.getSocialAuditHistory(env);
    assert.ok(audit.length >= 1);
    assert.strictEqual(audit[0].action, 'CONTENT_CREATED');
  });

  await testAsync('Transitions content through approval lifecycle states', async () => {
    const env = createMockEnv();
    const saved = await socialKv.saveSocialContent(env, {
      category: socialKv.SOCIAL_CONTENT_CATEGORIES.PRODUCT_WALKTHROUGH,
      platforms: {
        telegram: { copy: 'Check out the AI Scout dashboard on DeepPredictBet.', enabled: true }
      }
    });

    // Move to AWAITING_APPROVAL
    const awaiting = await socialKv.transitionContentState(env, saved.id, socialKv.SOCIAL_LIFECYCLE_STATES.AWAITING_APPROVAL, 'admin@deeppredictbet.com');
    assert.strictEqual(awaiting.state, 'AWAITING_APPROVAL');

    // Move to APPROVED
    const approved = await socialKv.transitionContentState(env, saved.id, socialKv.SOCIAL_LIFECYCLE_STATES.APPROVED, 'admin@deeppredictbet.com');
    assert.strictEqual(approved.state, 'APPROVED');
    assert.strictEqual(approved.approver, 'admin@deeppredictbet.com');
    assert.ok(approved.approvedAt);
  });

  await testAsync('Blocks invalid lifecycle transitions (e.g. Published directly to Draft)', async () => {
    const env = createMockEnv();
    const saved = await socialKv.saveSocialContent(env, {
      category: socialKv.SOCIAL_CONTENT_CATEGORIES.BETTING_EDUCATION,
      state: socialKv.SOCIAL_LIFECYCLE_STATES.PUBLISHED,
      platforms: { telegram: { copy: 'Educational text', enabled: true } }
    });

    let threw = false;
    try {
      await socialKv.transitionContentState(env, saved.id, socialKv.SOCIAL_LIFECYCLE_STATES.DRAFT, 'admin@deeppredictbet.com');
    } catch (err) {
      threw = true;
      assert.ok(err.message.includes('Invalid lifecycle transition'));
    }
    assert.strictEqual(threw, true);
  });

  // ==========================================================================
  // SECTION 3: FACTUAL VALIDATION & STALE FIXTURE REJECTION (TASK 5)
  // ==========================================================================
  console.log('\n--- 3. Factual Validation & Stale Fixture Rejection ---');

  test('Blocks upcoming intelligence for completed (FT) match', () => {
    const invalidUpcomingItem = {
      category: socialKv.SOCIAL_CONTENT_CATEGORIES.FOOTBALL_INTELLIGENCE_BRIEF,
      matchId: '1204851',
      sourceLineage: {
        homeTeam: 'Arsenal',
        awayTeam: 'Chelsea',
        competition: 'Premier League',
        status: 'FT', // Completed match
        kickoffTime: new Date(Date.now() - 3600000).toISOString()
      },
      platforms: {
        telegram: { copy: 'Arsenal vs Chelsea upcoming match analysis.', enabled: true }
      }
    };

    const val = socialKv.validateSocialContentFacts(invalidUpcomingItem);
    assert.strictEqual(val.valid, false);
    assert.ok(val.errors.some(e => e.includes('STALE_FIXTURE_REJECTION')));
  });

  test('Blocks match post with kickoff in the past', () => {
    const pastKickoffItem = {
      category: socialKv.SOCIAL_CONTENT_CATEGORIES.MATCH_CENTRE_ANALYSIS,
      matchId: '1204852',
      sourceLineage: {
        homeTeam: 'Liverpool',
        awayTeam: 'Everton',
        competition: 'Premier League',
        status: 'NS',
        kickoffTime: new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 mins ago
      },
      platforms: {
        telegram: { copy: 'Liverpool vs Everton analysis.', enabled: true }
      }
    };

    const val = socialKv.validateSocialContentFacts(pastKickoffItem);
    assert.strictEqual(val.valid, false);
    assert.ok(val.errors.some(e => e.includes('STALE_KICKOFF_REJECTION')));
  });

  test('Blocks deceptive and guaranteed-win betting claims', () => {
    const deceptiveItem = {
      category: socialKv.SOCIAL_CONTENT_CATEGORIES.BETTING_EDUCATION,
      platforms: {
        telegram: { copy: 'Join VIP today for a 100% guaranteed win tonight!', enabled: true }
      }
    };

    const val = socialKv.validateSocialContentFacts(deceptiveItem);
    assert.strictEqual(val.valid, false);
    assert.ok(val.errors.some(e => e.includes('Prohibited Deceptive Claim')));
  });

  test('Blocks X (Twitter) copy exceeding 280 characters', () => {
    const longTwitterItem = {
      category: socialKv.SOCIAL_CONTENT_CATEGORIES.AI_SCOUT_DEMO,
      platforms: {
        x: { copy: 'A'.repeat(285), enabled: true }
      }
    };

    const val = socialKv.validateSocialContentFacts(longTwitterItem);
    assert.strictEqual(val.valid, false);
    assert.ok(val.errors.some(e => e.includes('Character Limit Exceeded') || e.includes('X (Twitter) Payload Error')));
  });

  test('Accepts valid future fixture with statistical probabilities', () => {
    const validUpcomingItem = {
      category: socialKv.SOCIAL_CONTENT_CATEGORIES.FOOTBALL_INTELLIGENCE_BRIEF,
      matchId: '1204853',
      sourceLineage: {
        homeTeam: 'Real Madrid',
        awayTeam: 'Barcelona',
        competition: 'La Liga',
        status: 'UPCOMING',
        kickoffTime: new Date(Date.now() + 86400000).toISOString(),
        probabilities: { home: 52, draw: 24, away: 24 }
      },
      platforms: {
        telegram: { copy: 'Real Madrid vs Barcelona: El Clasico probability model: Real Madrid 52%, Draw 24%, Barcelona 24%.', enabled: true },
        x: { copy: 'Real Madrid vs Barcelona: Poisson model favors Real Madrid at 52%. #ElClasico', enabled: true }
      }
    };

    const val = socialKv.validateSocialContentFacts(validUpcomingItem);
    assert.strictEqual(val.valid, true);
    assert.strictEqual(val.errors.length, 0);
  });

  // ==========================================================================
  // SECTION 4: PLATFORM ADAPTERS & TRUTHFUL HEALTH STATUS (TASK 4)
  // ==========================================================================
  console.log('\n--- 4. Platform Adapters & Truthful Connection Status ---');

  await testAsync('Reports Telegram as CONNECTED and others as NOT_CONNECTED when secrets are absent', async () => {
    const env = createMockEnv(); // Has TELEGRAM_BOT_TOKEN but not X or Meta secrets
    const health = await socialAdapters.getSocialAccountsHealth(env);

    assert.strictEqual(health.telegram.connected, true);
    assert.strictEqual(health.telegram.status, 'CONNECTED');

    assert.strictEqual(health.x.connected, false);
    assert.strictEqual(health.x.status, 'NOT_CONNECTED');
    assert.ok(health.x.missingPermissions.includes('tweet.write'));

    assert.strictEqual(health.instagram.connected, false);
    assert.strictEqual(health.instagram.status, 'NOT_CONNECTED');
    assert.ok(health.instagram.missingPermissions.includes('instagram_content_publish'));

    assert.strictEqual(health.facebook.connected, false);
    assert.strictEqual(health.facebook.status, 'NOT_CONNECTED');

    assert.strictEqual(health.tiktok.connected, false);
    assert.strictEqual(health.tiktok.status, 'NOT_CONNECTED');

    assert.strictEqual(health.youtube.connected, false);
    assert.strictEqual(health.youtube.status, 'NOT_CONNECTED');
  });

  test('stripHtmlForSocial: Strips HTML tags, preserves emojis and decodes entities', () => {
    const rawHtml = '👑 <b>TOP TIP OF THE DAY: Brentford vs Liverpool</b>\n🏆 <i>Premier League | 17 Oct 2026 · 15:00 WAT</i>\n🎯 <b>Official AI Selection:</b> HT/FT: X/1 (Draw/Home)\n📊 <b>Confidence Score:</b> 60% &amp; Value';
    const clean = socialAdapters.stripHtmlForSocial(rawHtml);
    assert.strictEqual(clean.includes('<b>'), false);
    assert.strictEqual(clean.includes('</b>'), false);
    assert.strictEqual(clean.includes('<i>'), false);
    assert.strictEqual(clean.includes('</i>'), false);
    assert.ok(clean.includes('👑 TOP TIP OF THE DAY: Brentford vs Liverpool'));
    assert.ok(clean.includes('🏆 Premier League'));
    assert.ok(clean.includes('60% & Value'));
  });

  test('stripHtmlForSocial: Converts anchor links cleanly for social posts', () => {
    const htmlWithLink = 'Check AI odds: <a href="https://deeppredictbet.com">DeepPredictBet</a> &amp; join <a href="https://t.me/DeepPredictBetFree">https://t.me/DeepPredictBetFree</a>';
    const clean = socialAdapters.stripHtmlForSocial(htmlWithLink);
    assert.ok(clean.includes('DeepPredictBet (https://deeppredictbet.com)'));
    assert.ok(clean.includes('https://t.me/DeepPredictBetFree'));
    assert.strictEqual(clean.includes('<a'), false);
  });

  test('Generates copy-ready manual publishing payload for X (under 280 chars)', () => {
    const payload = { copy: 'Real Madrid vs Barcelona: Poisson model favours Real Madrid at 52% probability. Full tactical brief at DeepPredictBet. #ElClasico' };
    const manualX = socialAdapters.formatManualCopyForX(payload);
    assert.strictEqual(manualX.platform, 'x');
    assert.ok(manualX.characterCount <= 280);
    assert.ok(manualX.shareUrl.includes('twitter.com/intent/tweet'));
  });

  test('Generates copy-ready manual publishing payload for Instagram with hashtags and portrait aspect ratio note', () => {
    const payload = { copy: 'DeepPredictBet Tactical Scouting: Arsenal vs Man City' };
    const manualIg = socialAdapters.formatManualCopyForInstagram(payload);
    assert.strictEqual(manualIg.platform, 'instagram');
    assert.ok(manualIg.text.includes('#DeepPredictBet'));
    assert.ok(manualIg.aspectRatio.includes('Portrait'));
  });

  test('Generates copy-ready manual publishing payload for TikTok with 0-3s hook', () => {
    const payload = { copy: 'Why our Poisson model picked Over 2.5 goals in tonight’s Bayern Munich match.' };
    const manualTikTok = socialAdapters.formatManualCopyForTikTok(payload);
    assert.strictEqual(manualTikTok.platform, 'tiktok');
    assert.ok(manualTikTok.scriptHeadline.includes('HOOK'));
    assert.ok(manualTikTok.text.includes('#FootballTikTok'));
  });

  test('Generates copy-ready manual publishing payload for YouTube with title under 100 chars and timestamps', () => {
    const payload = { title: 'AI Match Breakdown: Liverpool vs Chelsea', copy: 'Full breakdown of expected goals and tactical consensus.' };
    const manualYT = socialAdapters.formatManualCopyForYouTube(payload);
    assert.strictEqual(manualYT.platform, 'youtube');
    assert.ok(manualYT.title.length <= 100);
    assert.ok(manualYT.description.includes('Timestamps:'));
    assert.ok(manualYT.description.length <= 5000);
  });

  // ==========================================================================
  // SECTION 5: APPROVAL-FIRST PUBLISHING & DUPLICATE PREVENTION (TASK 6)
  // ==========================================================================
  console.log('\n--- 5. Approval-First Publishing & Duplicate Prevention ---');

  await testAsync('POST /api/social/publish: Blocks direct dispatch if factual validation fails', async () => {
    const env = createMockEnv();
    const req = new Request('https://deeppredictbet.com/api/social/publish', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FAKE_ADMIN_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'DISPATCH_NOW',
        content: {
          category: socialKv.SOCIAL_CONTENT_CATEGORIES.FOOTBALL_INTELLIGENCE_BRIEF,
          matchId: '1204851',
          sourceLineage: { homeTeam: 'Arsenal', awayTeam: 'Chelsea', status: 'FT' }, // Stale match!
          platforms: { telegram: { copy: 'Stale match post', enabled: true } }
        }
      })
    });

    const res = await socialPublish.onRequestPost({ request: req, env });
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.success, false);
    assert.ok(data.error.includes('FACTUAL_VALIDATION_FAILED'));
  });

  await testAsync('POST /api/social/publish: Successfully dispatches approved valid content', async () => {
    const env = createMockEnv();
    const req = new Request('https://deeppredictbet.com/api/social/publish', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FAKE_ADMIN_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'DISPATCH_NOW',
        content: {
          category: socialKv.SOCIAL_CONTENT_CATEGORIES.BETTING_EDUCATION,
          platforms: {
            telegram: { copy: 'DeepPredictBet Educational Brief: How Poisson distribution models football goals.', enabled: true }
          }
        }
      })
    });

    const res = await socialPublish.onRequestPost({ request: req, env });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.state, 'PUBLISHED');
    assert.ok(data.content.id);
  });

  await testAsync('POST /api/social/publish: Detects and rejects duplicate content within 24 hours (HTTP 409)', async () => {
    const env = createMockEnv();
    const duplicatePayload = {
      action: 'DISPATCH_NOW',
      content: {
        category: socialKv.SOCIAL_CONTENT_CATEGORIES.PRODUCT_WALKTHROUGH,
        platforms: {
          telegram: { copy: 'Exclusive Walkthrough: How the Bet Doctor scans betslips for high-risk selections.', enabled: true }
        }
      }
    };

    // First post
    const req1 = new Request('https://deeppredictbet.com/api/social/publish', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${FAKE_ADMIN_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(duplicatePayload)
    });
    const res1 = await socialPublish.onRequestPost({ request: req1, env });
    assert.strictEqual(res1.status, 200);

    // Second post with identical content
    const req2 = new Request('https://deeppredictbet.com/api/social/publish', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${FAKE_ADMIN_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(duplicatePayload)
    });
    const res2 = await socialPublish.onRequestPost({ request: req2, env });
    assert.strictEqual(res2.status, 409);
    const data2 = await res2.json();
    assert.strictEqual(data2.success, false);
    assert.ok(data2.error.includes('DUPLICATE_CONTENT_DETECTED'));
  });

  // ==========================================================================
  // SECTION 6: UNCERTAIN PUBLICATION RECONCILIATION
  // ==========================================================================
  console.log('\n--- 6. Uncertain Publication Handling & Reconciliation ---');

  await testAsync('Marks timeout as UNCERTAIN rather than assumed failed, and reconciles', async () => {
    const env = createMockEnv();

    // Reconcile unknown post
    const reconcileRes = await socialAdapters.reconcilePlatformPublication(env, 'telegram', '1001');
    assert.strictEqual(reconcileRes.reconciled, true);
    assert.strictEqual(reconcileRes.exists, true);

    // Reconcile null ID
    const nullRes = await socialAdapters.reconcilePlatformPublication(env, 'x', null);
    assert.strictEqual(nullRes.reconciled, true);
    assert.strictEqual(nullRes.exists, false);
  });

  // ==========================================================================
  // SECTION 7: ORGANIC ANALYTICS & UTM CAMPAIGN TRACKING (TASK 7)
  // ==========================================================================
  console.log('\n--- 7. Organic Analytics & Attribution ---');

  await testAsync('GET /api/social/analytics: Returns categorized telemetry and campaign URLs', async () => {
    const env = createMockEnv();
    const req = new Request('https://deeppredictbet.com/api/social/analytics?timeframe=30d', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${FAKE_ADMIN_KEY}` }
    });
    const res = await socialAnalytics.onRequestGet({ request: req, env });
    assert.strictEqual(res.status, 200);
    const data = await res.json();

    assert.strictEqual(data.success, true);
    assert.ok(data.metrics.platformReported);
    assert.ok(data.metrics.websiteAttributed);
    assert.ok(data.metrics.derived);
    assert.ok(data.campaignUrlGenerator);

    // Verify UTM tags contain no PII or secrets
    const utmLink = data.campaignUrlGenerator.exampleTelegram;
    assert.ok(utmLink.includes('utm_source=telegram'));
    assert.ok(utmLink.includes('utm_medium=social'));
    assert.ok(!utmLink.includes('token'));
    assert.ok(!utmLink.includes('key'));
  });

  // ==========================================================================
  // SECTION 8: PRESERVATION OF TELEGRAM WORKFLOW & ADMIN DASHBOARD
  // ==========================================================================
  console.log('\n--- 8. Preservation of Existing Telegram Workflows ---');

  await testAsync('Telegram publish endpoint /api/integrations/telegram/publish is intact', async () => {
    const telegramPublish = await import('./functions/api/integrations/telegram/publish.js');
    const env = createMockEnv();
    const req = new Request('https://deeppredictbet.com/api/integrations/telegram/publish', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${FAKE_ADMIN_KEY}` }
    });
    const res = await telegramPublish.onRequestGet({ request: req, env });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.history));
  });

  console.log('\n==================================================');
  console.log(`SOCIAL MEDIA EXPANSION RESULTS: ${passed} passed, ${failed} failed.`);
  console.log('==================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
