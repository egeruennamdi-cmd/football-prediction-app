/**
 * Test Suite: Paywall & Entitlements Consistency Audit
 * Validates that DeepPredictBet has ONE authoritative source of truth for entitlements,
 * with zero accidental Pro/VIP leakage, zero accidental downgrading of paying users,
 * and 100% byte parity between root and public/ files.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('====================================================');
console.log('🧪 RUNNING PAYWALL & ENTITLEMENTS CONSISTENCY AUDIT');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✅ [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${name}: ${err.message}`);
    throw err;
  }
}

// ---------------------------------------------------------------------------
// TEST 1: Zero Accidental Pro Leakage on Registration & Password Reset
// ---------------------------------------------------------------------------
runTest('Zero accidental PRO role leakage in auth flows', () => {
  const filesToCheck = [
    'js/app.js',
    'public/js/app.js',
    'js/ui.js',
    'public/js/ui.js'
  ];

  filesToCheck.forEach(relPath => {
    const fullPath = path.resolve(__dirname, relPath);
    const content = fs.readFileSync(fullPath, 'utf8');

    // Registration must not set user_role to PRO
    assert.strictEqual(
      content.includes('localStorage.setItem("user_role", "PRO")'),
      false,
      `Found hardcoded user_role = "PRO" in ${relPath}`
    );

    // Password reset fallback must not default to PRO
    assert.strictEqual(
      content.includes("role: data.role || 'PRO'"),
      false,
      `Found fallback role || 'PRO' in ${relPath}`
    );
  });
});

// ---------------------------------------------------------------------------
// TEST 2: Authoritative Entitlements Engine Exports & Semantic API
// ---------------------------------------------------------------------------
runTest('Entitlements exports authoritative API and semantic aliases', () => {
  // Mock browser window and localStorage
  const mockStorage = {};
  global.localStorage = {
    getItem: (k) => mockStorage[k] !== undefined ? mockStorage[k] : null,
    setItem: (k, v) => { mockStorage[k] = String(v); },
    removeItem: (k) => { delete mockStorage[k]; },
    clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }
  };
  global.window = {
    localStorage: global.localStorage,
    addEventListener: () => {}
  };
  global.document = {
    readyState: 'complete',
    getElementById: () => null,
    querySelectorAll: () => []
  };

  require('./js/entitlements.js');
  const Entitlements = global.Entitlements || global.window.Entitlements;

  assert.ok(Entitlements, 'Entitlements object must be exported');
  assert.strictEqual(typeof Entitlements.getUserTier, 'function');
  assert.strictEqual(typeof Entitlements.getFeatureEntitlement, 'function');
  assert.strictEqual(typeof Entitlements.canAccessFeature, 'function');
  assert.strictEqual(typeof Entitlements.canAccess, 'function', 'Semantic alias canAccess must exist');
  assert.strictEqual(typeof Entitlements.getEntitlement, 'function', 'Semantic alias getEntitlement must exist');
  assert.strictEqual(typeof global.window.canAccess, 'function', 'Global window.canAccess must exist');
  assert.strictEqual(typeof global.window.getEntitlement, 'function', 'Global window.getEntitlement must exist');
});

// ---------------------------------------------------------------------------
// TEST 3: Tier Resolution & Downgrade Prevention
// ---------------------------------------------------------------------------
runTest('Tier resolution: paying passes take precedence, preventing accidental downgrades', () => {
  require('./js/entitlements.js');
  const Entitlements = global.Entitlements || global.window.Entitlements;

  // Case A: Fresh session with active VIP pass in localStorage, but userLoggedIn not set
  localStorage.clear();
  localStorage.setItem('deeppredictbet_vip', JSON.stringify({
    active: true,
    package: 'VIP Annual Pass',
    expiresAt: new Date(Date.now() + 86400000 * 30).toISOString()
  }));

  assert.strictEqual(
    Entitlements.getUserTier(),
    'VIP',
    'Active VIP subscription must resolve to VIP even before login flag is set'
  );

  // Case B: Expired subscription falls back to Free (if logged in) or Public
  localStorage.setItem('deeppredictbet_vip', JSON.stringify({
    active: true,
    expiresAt: new Date(Date.now() - 86400000).toISOString() // expired yesterday
  }));
  localStorage.setItem('userLoggedIn', 'true');
  localStorage.setItem('user_role', 'USER');

  assert.strictEqual(
    Entitlements.getUserTier(),
    'FREE',
    'Expired VIP pass with logged in USER role must resolve to FREE'
  );

  // Case C: Pro analyst
  localStorage.removeItem('deeppredictbet_vip');
  localStorage.setItem('userLoggedIn', 'true');
  localStorage.setItem('user_role', 'PRO');

  assert.strictEqual(
    Entitlements.getUserTier(),
    'PRO',
    'User with role PRO must resolve to PRO'
  );

  // Case D: Guest visitor (not logged in, no pass)
  localStorage.clear();
  assert.strictEqual(
    Entitlements.getUserTier(),
    'PUBLIC',
    'Guest visitor must resolve to PUBLIC'
  );

  // Case E: Admin
  localStorage.setItem('userLoggedIn', 'true');
  localStorage.setItem('user_role', 'ADMIN');
  assert.strictEqual(
    Entitlements.getUserTier(),
    'ADMIN',
    'User with role ADMIN must resolve to ADMIN'
  );
});

// ---------------------------------------------------------------------------
// TEST 4: Binary Feature Access Matrix
// ---------------------------------------------------------------------------
runTest('Feature access matrix adheres strictly to minimum tier rules', () => {
  require('./js/entitlements.js');
  const Entitlements = global.Entitlements || global.window.Entitlements;

  // Matrix definition
  const testMatrix = [
    {
      tier: 'PUBLIC',
      role: 'PUBLIC',
      expected: {
        predictions: false,
        valuebot: false,
        backtester: false,
        viptips: false,
        arbitrage: false
      }
    },
    {
      tier: 'FREE',
      role: 'USER',
      setup: () => {
        localStorage.clear();
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('user_role', 'USER');
      },
      expected: {
        predictions: false,
        valuebot: false,
        backtester: false,
        viptips: false,
        arbitrage: false
      }
    },
    {
      tier: 'PRO',
      role: 'PRO',
      setup: () => {
        localStorage.clear();
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('user_role', 'PRO');
      },
      expected: {
        predictions: true,
        valuebot: true,
        backtester: false,
        viptips: false,
        arbitrage: false
      }
    },
    {
      tier: 'VIP',
      role: 'VIP',
      setup: () => {
        localStorage.clear();
        localStorage.setItem('deeppredictbet_vip', JSON.stringify({
          active: true,
          package: 'Annual VIP',
          expiresAt: new Date(Date.now() + 864000000).toISOString()
        }));
      },
      expected: {
        predictions: true,
        valuebot: true,
        backtester: true,
        viptips: true,
        arbitrage: true
      }
    },
    {
      tier: 'ADMIN',
      role: 'ADMIN',
      setup: () => {
        localStorage.clear();
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('user_role', 'ADMIN');
      },
      expected: {
        predictions: true,
        valuebot: true,
        backtester: true,
        viptips: true,
        arbitrage: true
      }
    }
  ];

  testMatrix.forEach(tc => {
    if (tc.setup) tc.setup();
    else localStorage.clear();

    Object.keys(tc.expected).forEach(feat => {
      const allowed = Entitlements.canAccess(feat);
      assert.strictEqual(
        allowed,
        tc.expected[feat],
        `Tier ${tc.tier} access to "${feat}" was expected to be ${tc.expected[feat]} but got ${allowed}`
      );
    });
  });
});

// ---------------------------------------------------------------------------
// TEST 5: AI Scout Quota Enforcing & Usage Recording
// ---------------------------------------------------------------------------
runTest('AI Scout quotas and usage tracking are centrally enforced', () => {
  require('./js/entitlements.js');
  const Entitlements = global.Entitlements || global.window.Entitlements;

  // FREE user has 1 inquiry per day
  localStorage.clear();
  localStorage.setItem('userLoggedIn', 'true');
  localStorage.setItem('user_role', 'USER');

  const entBefore = Entitlements.getFeatureEntitlement('scout');
  assert.strictEqual(entBefore.tier, 'FREE');
  assert.strictEqual(entBefore.dailyLimit, 1);
  assert.strictEqual(entBefore.allowed, true);

  // Consume 1 inquiry
  Entitlements.recordFeatureUsage('scout');

  const entAfter = Entitlements.getFeatureEntitlement('scout');
  assert.strictEqual(entAfter.usedToday, 1);
  assert.strictEqual(entAfter.remaining, 0);
  assert.strictEqual(entAfter.allowed, false);
  assert.strictEqual(entAfter.isQuotaExhausted, true);
  assert.strictEqual(entAfter.requiresUpgrade, true);
  assert.strictEqual(entAfter.upgradeTarget, 'PRO');

  // PRO user has 10 inquiries per day
  localStorage.setItem('user_role', 'PRO');
  const entPro = Entitlements.getFeatureEntitlement('scout');
  assert.strictEqual(entPro.tier, 'PRO');
  assert.strictEqual(entPro.dailyLimit, 10);
  assert.strictEqual(entPro.remaining, 9);
  assert.strictEqual(entPro.allowed, true);

  // VIP user has unlimited inquiries
  localStorage.setItem('deeppredictbet_vip', JSON.stringify({
    active: true,
    expiresAt: new Date(Date.now() + 864000000).toISOString()
  }));
  const entVip = Entitlements.getFeatureEntitlement('scout');
  assert.strictEqual(entVip.tier, 'VIP');
  assert.strictEqual(entVip.dailyLimit, Infinity);
  assert.strictEqual(entVip.remaining, Infinity);
  assert.strictEqual(entVip.allowed, true);
});

// ---------------------------------------------------------------------------
// TEST 6: 100% Byte Parity Across All Paired Files
// ---------------------------------------------------------------------------
runTest('Root files and public/ mirrored files have 100% byte parity', () => {
  const pairs = [
    ['index.html', 'public/index.html'],
    ['js/app.js', 'public/js/app.js'],
    ['js/ui.js', 'public/js/ui.js'],
    ['js/entitlements.js', 'public/js/entitlements.js'],
    ['js/vipManager.js', 'public/js/vipManager.js'],
    ['js/dashboard.js', 'public/js/dashboard.js'],
    ['js/upgradeExperience.js', 'public/js/upgradeExperience.js'],
    ['js/converterConfig.js', 'public/js/converterConfig.js']
  ];

  pairs.forEach(([rootRel, pubRel]) => {
    const rootPath = path.resolve(__dirname, rootRel);
    const pubPath = path.resolve(__dirname, pubRel);

    const rootBuf = fs.readFileSync(rootPath);
    const pubBuf = fs.readFileSync(pubPath);

    assert.strictEqual(
      rootBuf.length,
      pubBuf.length,
      `Byte length mismatch between ${rootRel} (${rootBuf.length}) and ${pubRel} (${pubBuf.length})`
    );

    assert.ok(
      rootBuf.equals(pubBuf),
      `Content difference detected between ${rootRel} and ${pubRel}`
    );
  });
});

console.log('\n====================================================');
console.log(`🎉 ALL ${passedTests}/${totalTests} PAYWALL AUDIT TESTS PASSED!`);
console.log('====================================================\n');
