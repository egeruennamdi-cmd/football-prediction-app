/**
 * DEEPPREDICTBET — MONETIZATION & ENTITLEMENTS ARCHITECTURE TEST SUITE
 * Validates:
 * 1. Tier Resolution (PUBLIC, FREE, PRO, VIP, ADMIN)
 * 2. Metered Daily Quotas (Converter, Doctor, Generator, Scout, Saved Slips)
 * 3. Gated Features (ValueBot for PRO+, Arbitrage, Backtester, VIP Bankers for VIP+)
 * 4. Zero-Deduction on Error / Failure
 * 5. UTC Date Rollover & Daily Usage Reset
 * 6. Dual-File Parity (js/ vs public/js/)
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('================================================================');
console.log('DEEPPREDICTBET: ENTITLEMENTS & MONETIZATION ARCHITECTURE TESTS');
console.log('================================================================\n');

// 1. Dual-File Parity Check
console.log('--- TEST SUITE 1: Dual-File Parity Check ---');
const rootEntitlementsPath = path.join(__dirname, 'js', 'entitlements.js');
const publicEntitlementsPath = path.join(__dirname, 'public', 'js', 'entitlements.js');

assert(fs.existsSync(rootEntitlementsPath), 'js/entitlements.js must exist');
assert(fs.existsSync(publicEntitlementsPath), 'public/js/entitlements.js must exist');

const rootContent = fs.readFileSync(rootEntitlementsPath, 'utf8');
const publicContent = fs.readFileSync(publicEntitlementsPath, 'utf8');
assert.strictEqual(rootContent, publicContent, 'js/entitlements.js and public/js/entitlements.js must have 100% byte parity');
console.log('✅ 100% byte parity confirmed between js/entitlements.js and public/js/entitlements.js\n');

// 2. Load Entitlements Engine in a Mocked Environment
console.log('--- TEST SUITE 2: Tier Resolution Engine ---');

function createMockEnvironment(mockState = {}) {
  const localStorageStore = Object.assign({}, mockState.localStorage || {});
  const sessionStorageStore = Object.assign({}, mockState.sessionStorage || {});

  const mockWindow = {
    localStorage: {
      getItem: (k) => (localStorageStore[k] !== undefined ? localStorageStore[k] : null),
      setItem: (k, v) => { localStorageStore[k] = String(v); },
      removeItem: (k) => { delete localStorageStore[k]; }
    },
    sessionStorage: {
      getItem: (k) => (sessionStorageStore[k] !== undefined ? sessionStorageStore[k] : null),
      setItem: (k, v) => { sessionStorageStore[k] = String(v); },
      removeItem: (k) => { delete sessionStorageStore[k]; }
    },
    isAdmin: () => Boolean(mockState.isAdminUser),
    getStoredVipSubscription: () => mockState.vipSubscription || { active: false, tier: 'none' },
    trackEvent: () => {}
  };

  // Execute entitlements module
  const sandbox = { window: mockWindow, module: { exports: {} }, exports: {} };
  const fn = new Function('window', 'module', 'exports', 'localStorage', rootContent);
  fn(mockWindow, sandbox.module, sandbox.exports, mockWindow.localStorage);

  return {
    entitlements: mockWindow.Entitlements || sandbox.module.exports,
    mockWindow,
    localStorageStore
  };
}

// Test A: Unauthenticated Visitor -> PUBLIC
{
  const env = createMockEnvironment({ localStorage: { userLoggedIn: 'false' } });
  const tier = env.entitlements.getUserTier();
  assert.strictEqual(tier, 'PUBLIC', 'Unauthenticated visitor must resolve to PUBLIC tier');
  console.log('✅ Guest visitor correctly resolves to PUBLIC');
}

// Test B: Registered Account -> FREE
{
  const env = createMockEnvironment({
    localStorage: {
      userLoggedIn: 'true',
      currentUserEmail: 'punter@example.com',
      user_role: 'USER'
    }
  });
  const tier = env.entitlements.getUserTier();
  assert.strictEqual(tier, 'FREE', 'Registered user must resolve to FREE tier');
  console.log('✅ Registered user correctly resolves to FREE');
}

// Test C: Weekly / Monthly Subscriber -> PRO
{
  const env = createMockEnvironment({
    localStorage: {
      userLoggedIn: 'true',
      currentUserEmail: 'pro_analyst@example.com',
      user_role: 'PRO'
    },
    vipSubscription: { active: true, tier: 'monthly' }
  });
  const tier = env.entitlements.getUserTier();
  assert.strictEqual(tier, 'PRO', 'Monthly subscriber must resolve to PRO tier');
  console.log('✅ Monthly subscriber correctly resolves to PRO');
}

// Test D: Annual Subscriber -> VIP
{
  const env = createMockEnvironment({
    localStorage: {
      userLoggedIn: 'true',
      currentUserEmail: 'vip_punter@example.com',
      user_role: 'VIP'
    },
    vipSubscription: { active: true, tier: 'annual' }
  });
  const tier = env.entitlements.getUserTier();
  assert.strictEqual(tier, 'VIP', 'Annual subscriber must resolve to VIP tier');
  console.log('✅ Annual subscriber correctly resolves to VIP');
}

// Test E: Authoritative Admin -> ADMIN
{
  const env = createMockEnvironment({
    localStorage: {
      userLoggedIn: 'true',
      currentUserEmail: 'admin@deeppredictbet.com',
      user_role: 'ADMIN'
    },
    isAdminUser: true
  });
  const tier = env.entitlements.getUserTier();
  assert.strictEqual(tier, 'ADMIN', 'Verified admin must resolve to ADMIN tier');
  console.log('✅ Administrator correctly resolves to ADMIN\n');
}

// 3. Quota & Limits Verification
console.log('--- TEST SUITE 3: Quota Allowances & Gating ---');

// Test FREE Tier Quotas
{
  const env = createMockEnvironment({
    localStorage: {
      userLoggedIn: 'true',
      currentUserEmail: 'free_user@example.com',
      user_role: 'USER'
    }
  });
  const ent = env.entitlements;

  // Code Converter: 3/day
  const convEnt = ent.getFeatureEntitlement('converter');
  assert.strictEqual(convEnt.dailyLimit, 3, 'Free tier converter quota must be 3');
  assert.strictEqual(convEnt.remaining, 3, 'Remaining converter quota initially 3');
  assert.strictEqual(convEnt.allowed, true, 'Free user allowed initially');

  // Bet Doctor: 1/day
  const docEnt = ent.getFeatureEntitlement('doctor');
  assert.strictEqual(docEnt.dailyLimit, 1, 'Free tier Bet Doctor quota must be 1');

  // Accumulator Machine: 1/day
  const genEnt = ent.getFeatureEntitlement('generator');
  assert.strictEqual(genEnt.dailyLimit, 1, 'Free tier Generator quota must be 1');

  // AI Scout: 1/day
  const scoutEnt = ent.getFeatureEntitlement('scout');
  assert.strictEqual(scoutEnt.dailyLimit, 1, 'Free tier AI Scout quota must be 1');

  // Gated Tools: ValueBot (needs PRO), Arbitrage (needs VIP), Backtester (needs VIP)
  assert.strictEqual(ent.canAccessFeature('valuebot'), false, 'Free user must not access ValueBot');
  assert.strictEqual(ent.canAccessFeature('arbitrage'), false, 'Free user must not access Arbitrage');
  assert.strictEqual(ent.canAccessFeature('backtester'), false, 'Free user must not access Backtester');

  console.log('✅ Free Account quotas verified (3 conversions, 1 audit, 1 gen, 1 scout)');
  console.log('✅ Gated features (ValueBot, Arbitrage, Backtester) properly locked for Free tier');
}

// Test PRO Tier Quotas
{
  const env = createMockEnvironment({
    localStorage: {
      userLoggedIn: 'true',
      currentUserEmail: 'pro_user@example.com',
      user_role: 'PRO'
    },
    vipSubscription: { active: true, tier: 'monthly' }
  });
  const ent = env.entitlements;

  assert.strictEqual(ent.getFeatureEntitlement('converter').dailyLimit, 30, 'PRO converter quota must be 30');
  assert.strictEqual(ent.getFeatureEntitlement('doctor').dailyLimit, 15, 'PRO Bet Doctor quota must be 15');
  assert.strictEqual(ent.getFeatureEntitlement('generator').dailyLimit, 10, 'PRO Generator quota must be 10');
  assert.strictEqual(ent.getFeatureEntitlement('scout').dailyLimit, 10, 'PRO AI Scout quota must be 10');

  // ValueBot is unlocked for PRO!
  assert.strictEqual(ent.canAccessFeature('valuebot'), true, 'PRO user must have access to ValueBot');
  // Arbitrage and Backtester remain locked for PRO (require VIP)
  assert.strictEqual(ent.canAccessFeature('arbitrage'), false, 'PRO user must not access Arbitrage');
  assert.strictEqual(ent.canAccessFeature('backtester'), false, 'PRO user must not access Backtester');

  console.log('✅ PRO tier quotas verified (30 conversions, 15 audits, 10 gen, 10 scout)');
  console.log('✅ ValueBot (+EV) unlocked for PRO; Arbitrage and Backtester reserved for VIP');
}

// Test VIP Tier Quotas
{
  const env = createMockEnvironment({
    localStorage: {
      userLoggedIn: 'true',
      currentUserEmail: 'vip_club@example.com',
      user_role: 'VIP'
    },
    vipSubscription: { active: true, tier: 'annual' }
  });
  const ent = env.entitlements;

  assert.strictEqual(ent.getFeatureEntitlement('converter').dailyLimit, Infinity, 'VIP converter quota must be unlimited');
  assert.strictEqual(ent.getFeatureEntitlement('doctor').dailyLimit, Infinity, 'VIP Bet Doctor quota must be unlimited');
  assert.strictEqual(ent.getFeatureEntitlement('generator').dailyLimit, Infinity, 'VIP Generator quota must be unlimited');
  assert.strictEqual(ent.getFeatureEntitlement('scout').dailyLimit, Infinity, 'VIP AI Scout quota must be unlimited');

  // Everything unlocked for VIP!
  assert.strictEqual(ent.canAccessFeature('valuebot'), true, 'VIP must access ValueBot');
  assert.strictEqual(ent.canAccessFeature('arbitrage'), true, 'VIP must access Arbitrage');
  assert.strictEqual(ent.canAccessFeature('backtester'), true, 'VIP must access Backtester');
  assert.strictEqual(ent.canAccessFeature('viptips'), true, 'VIP must access VIP Banker Tips');

  console.log('✅ VIP tier unlimited quotas and full tool access verified\n');
}

// 4. Usage Recording, Quota Depletion & UTC Rollover
console.log('--- TEST SUITE 4: Usage Recording & UTC Rollover ---');
{
  const env = createMockEnvironment({
    localStorage: {
      userLoggedIn: 'true',
      currentUserEmail: 'test_punter@example.com',
      user_role: 'USER'
    }
  });
  const ent = env.entitlements;

  // Use 1 conversion
  let status = ent.recordFeatureUsage('converter');
  assert.strictEqual(status.usedToday, 1, 'Used today must be 1');
  assert.strictEqual(status.remaining, 2, 'Remaining must be 2');
  assert.strictEqual(status.allowed, true, 'Still allowed');

  // Use 2nd conversion
  status = ent.recordFeatureUsage('converter');
  assert.strictEqual(status.usedToday, 2, 'Used today must be 2');
  assert.strictEqual(status.remaining, 1, 'Remaining must be 1');
  assert.strictEqual(status.allowed, true, 'Still allowed');

  // Use 3rd conversion (exhausts quota)
  status = ent.recordFeatureUsage('converter');
  assert.strictEqual(status.usedToday, 3, 'Used today must be 3');
  assert.strictEqual(status.remaining, 0, 'Remaining must be 0');
  assert.strictEqual(status.isQuotaExhausted, true, 'Quota must be exhausted');
  assert.strictEqual(status.allowed, false, 'Access must now be disallowed');
  assert.strictEqual(status.upgradeTarget, 'PRO', 'Upgrade target for exhausted Free user must be PRO');

  console.log('✅ Daily usage increments properly and correctly exhausts at quota ceiling');

  // Simulate Date Rollover to tomorrow (UTC)
  const tomorrowUsage = {
    date: '2099-01-01',
    converter: 3
  };
  env.mockWindow.localStorage.setItem('dp_user_daily_usage', JSON.stringify(tomorrowUsage));

  // Today's getDailyUsage must detect old date and reset to 0!
  const resetUsage = ent.getDailyUsage();
  assert.strictEqual(resetUsage.converter, 0, 'Converter usage must reset to 0 upon UTC date change');
  const freshStatus = ent.getFeatureEntitlement('converter');
  assert.strictEqual(freshStatus.remaining, 3, 'Remaining quota must be restored to 3 after rollover');
  assert.strictEqual(freshStatus.allowed, true, 'User must be allowed access again on the new day');

  console.log('✅ Automatic UTC daily rollover and quota reset verified\n');
}

// 5. Server-Side convert-code.js Inspection & Security Verification
console.log('--- TEST SUITE 5: Server-Side Enforcement in convert-code.js ---');
const convertCodePath = path.join(__dirname, 'functions', 'api', 'convert-code.js');
const convertCodeSrc = fs.readFileSync(convertCodePath, 'utf8');

assert(convertCodeSrc.includes('QUOTA_EXHAUSTED'), 'convert-code.js must return QUOTA_EXHAUSTED code');
assert(convertCodeSrc.includes('X-DailyLimit-Limit'), 'convert-code.js must return X-DailyLimit-Limit header');
assert(convertCodeSrc.includes('recordSuccessfulConversion'), 'convert-code.js must have recordSuccessfulConversion helper');
assert(convertCodeSrc.includes('status: 429'), 'convert-code.js must return HTTP 429 when quota exceeded');

// Verify Zero-Deduction Guarantee on Error:
const errorBlockIndex = convertCodeSrc.indexOf('// 6. Upstream Failure / Invalid Code: Zero Quota Deduction!');
assert(errorBlockIndex !== -1, 'Zero-deduction block must exist');
const postErrorBlock = convertCodeSrc.slice(errorBlockIndex, errorBlockIndex + 500);
assert(!postErrorBlock.includes('recordSuccessfulConversion()'), 'Quota must NEVER be decremented in failure block');

console.log('✅ Server-side convert-code.js enforces HTTP 429 on quota exhaustion');
console.log('✅ Fairness Guarantee: 0 quota deduction verified on invalid codes or upstream errors\n');

// 6. VIP Manager Integration & Delegation
console.log('--- TEST SUITE 6: VIP Manager Delegation & Integration ---');
const vipManagerPath = path.join(__dirname, 'js', 'vipManager.js');
const vipManagerSrc = fs.readFileSync(vipManagerPath, 'utf8');

assert(vipManagerSrc.includes('window.Entitlements.canAccessFeature(featureId)'), 'vipManager.js canAccessFeature must delegate to window.Entitlements');
assert(vipManagerSrc.includes('window.Entitlements.showUpgradePrompt(featureId)'), 'vipManager.js checkFeatureVipAccess must delegate to window.Entitlements.showUpgradePrompt');
console.log('✅ vipManager.js successfully delegates access checks to window.Entitlements\n');

// 7. Saved Slips & Watchlist Capacity Limits
console.log('--- TEST SUITE 7: Saved Slips & Watchlist Capacity Limits ---');
{
  const publicEnv = createMockEnvironment({ localStorage: { userLoggedIn: 'false' } });
  const publicTickets = publicEnv.entitlements.getFeatureEntitlement('saved_tickets');
  assert.strictEqual(publicTickets.dailyLimit, 1, 'Public user allowed max 1 ticket');

  const freeEnv = createMockEnvironment({ localStorage: { userLoggedIn: 'true', user_role: 'USER' } });
  const freeTickets = freeEnv.entitlements.getFeatureEntitlement('saved_tickets');
  assert.strictEqual(freeTickets.dailyLimit, 3, 'Free user allowed max 3 saved tickets');

  const proEnv = createMockEnvironment({ localStorage: { userLoggedIn: 'true', user_role: 'PRO' }, vipSubscription: { active: true, tier: 'monthly' } });
  const proTickets = proEnv.entitlements.getFeatureEntitlement('saved_tickets');
  assert.strictEqual(proTickets.dailyLimit, 25, 'PRO user allowed max 25 saved tickets');

  const vipEnv = createMockEnvironment({ localStorage: { userLoggedIn: 'true', user_role: 'VIP' }, vipSubscription: { active: true, tier: 'annual' } });
  const vipTickets = vipEnv.entitlements.getFeatureEntitlement('saved_tickets');
  assert.strictEqual(vipTickets.dailyLimit, Infinity, 'VIP user allowed unlimited saved tickets');

  console.log('✅ Saved Slips capacity limits verified (Public: 1, Free: 3, Pro: 25, VIP: Unlimited)\n');
}

// 8. Suite Gating Handlers in app.js and ui.js
console.log('--- TEST SUITE 8: Suite Gating in app.js and ui.js ---');
const appSrc = fs.readFileSync(path.join(__dirname, 'js', 'app.js'), 'utf8');
const uiSrc = fs.readFileSync(path.join(__dirname, 'js', 'ui.js'), 'utf8');

assert(appSrc.includes("window.Entitlements.canAccessFeature('backtester')"), 'app.js syncBacktesterPremiumState must check backtester entitlement');
assert(uiSrc.includes("window.Entitlements.canAccessFeature('backtester')"), 'ui.js syncBacktesterPremiumState must check backtester entitlement');
assert(appSrc.includes("window.Entitlements.canAccessFeature('arbitrage')"), 'app.js runArbitrageScanner must check arbitrage entitlement');
assert(uiSrc.includes("window.Entitlements.canAccessFeature('arbitrage')"), 'ui.js runArbitrageScanner must check arbitrage entitlement');
assert(appSrc.includes("window.Entitlements.getFeatureEntitlement('saved_tickets')"), 'app.js saveGeneratedTicket must check saved_tickets limit');
assert(uiSrc.includes("window.Entitlements.getFeatureEntitlement('saved_tickets')"), 'ui.js saveGeneratedTicket must check saved_tickets limit');

console.log('✅ Backtester, Arbitrage, and Saved Tickets gating checks verified across app.js and ui.js\n');

console.log('================================================================');
console.log('ALL ENTITLEMENTS ARCHITECTURE TESTS PASSED (100% SUCCESS)');
console.log('================================================================');

