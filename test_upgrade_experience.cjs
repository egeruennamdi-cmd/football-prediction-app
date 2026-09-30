/**
 * DEEPPREDICTBET: UNIFIED UPGRADE EXPERIENCE TEST SUITE
 *
 * Verifies:
 * 1. Dual-File Parity for newly introduced & modified components
 * 2. Unified Module Exports & Architecture (window.DeepPredictUpgrade & window.Entitlements)
 * 3. Core Design Principle: Never "You are blocked" -> Always "You have discovered a capability"
 * 4. Booking Code Converter Quota Exhaustion matching exact user specification
 * 5. FeatureUpgradePrompt discovery card functionality across tools
 * 6. UsageLimitBanner states (Active, Caution, Exhausted, Unlimited)
 * 7. UpgradeModal controller (open, close, Paywall 2.0 orchestration)
 * 8. LockedCapability discovery preview overlay & non-destructive DOM wrap
 * 9. PlanComparison 3-column transparent matrix (Free vs Pro vs VIP)
 * 10. UsageMeter visual percentage gauge & UTC reset notices
 * 11. Universal Escape Hatch: "Continue exploring DeepPredictBet" keeping app 100% intact
 * 12. DOM & CSS styling integration across index.html and css/main.css
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

async function runTests() {
  console.log('================================================================');
  console.log('DEEPPREDICTBET: UNIFIED UPGRADE EXPERIENCE TEST SUITE');
  console.log('================================================================\n');

  // --- TEST SUITE 1: Dual-File Parity Checks ---
  console.log('--- TEST SUITE 1: Dual-File Parity Checks ---');
  const criticalPairs = [
    ['js/upgradeExperience.js', 'public/js/upgradeExperience.js'],
    ['js/entitlements.js', 'public/js/entitlements.js'],
    ['css/main.css', 'public/css/main.css'],
    ['index.html', 'public/index.html']
  ];

  for (const [rootRel, pubRel] of criticalPairs) {
    const rootPath = path.join(__dirname, rootRel);
    const pubPath = path.join(__dirname, pubRel);
    assert(fs.existsSync(rootPath), `${rootRel} must exist`);
    assert(fs.existsSync(pubPath), `${pubRel} must exist`);
    const rootBuf = fs.readFileSync(rootPath);
    const pubBuf = fs.readFileSync(pubPath);
    assert(rootBuf.equals(pubBuf), `100% byte parity violation: ${rootRel} !== ${pubRel}`);
    console.log(`✅ Parity verified: ${rootRel} === ${pubRel} (${rootBuf.length} bytes)`);
  }
  console.log('');

  // --- HELPER: Mock DOM & Upgrade Experience Environment ---
  function createMockEnvironment(initialState = {}) {
    const localStorageStore = Object.assign({}, initialState.localStorage || {});
    const elements = {};
    const events = [];
    const notifications = [];
    let modalClosed = false;
    let paywallOpenedWith = null;

    const doc = {
      readyState: 'complete',
      getElementById: (id) => {
        if (!elements[id]) {
          elements[id] = {
            id,
            className: '',
            classList: {
              classes: new Set(),
              add(c) { this.classes.add(c); },
              remove(c) { this.classes.delete(c); },
              contains(c) { return this.classes.has(c); }
            },
            style: {},
            innerHTML: '',
            innerText: '',
            disabled: false,
            attributes: {},
            parentNode: {
              insertBefore: () => {}
            },
            appendChild: () => {},
            setAttribute(k, v) { this.attributes[k] = String(v); },
            getAttribute(k) { return this.attributes[k] !== undefined ? this.attributes[k] : null; },
            removeAttribute(k) { delete this.attributes[k]; }
          };
        }
        return elements[id];
      },
      createElement: (tagName) => ({
        tagName,
        className: '',
        style: {},
        innerHTML: '',
        appendChild: () => {}
      }),
      addEventListener: () => {}
    };

    const mockWindow = {
      document: doc,
      localStorage: {
        getItem: (k) => (localStorageStore[k] !== undefined ? localStorageStore[k] : null),
        setItem: (k, v) => { localStorageStore[k] = String(v); },
        removeItem: (k) => { delete localStorageStore[k]; }
      },
      isAdmin: () => Boolean(initialState.isAdminUser),
      getStoredVipSubscription: () => initialState.vipSubscription || { active: false, tier: 'none' },
      trackEvent: (name, data) => { events.push({ name, data }); },
      showAppNotification: (msg, type) => { notifications.push({ msg, type }); },
      closeVipSubscriptionModal: () => { modalClosed = true; },
      openPremiumPaywall: (tier, feature) => { paywallOpenedWith = { tier, feature }; },
      openVipSubscriptionModal: (tier, feature) => { paywallOpenedWith = { tier, feature }; }
    };

    // Load converterConfig.js
    const configSrc = fs.readFileSync(path.join(__dirname, 'js', 'converterConfig.js'), 'utf8');
    new Function('module', 'exports', 'globalThis', 'window', configSrc)(
      { exports: {} }, {}, mockWindow, mockWindow
    );

    // Load upgradeExperience.js
    const upgradeSrc = fs.readFileSync(path.join(__dirname, 'js', 'upgradeExperience.js'), 'utf8');
    new Function('module', 'exports', 'globalThis', 'window', upgradeSrc)(
      { exports: {} }, {}, mockWindow, mockWindow
    );

    // Load entitlements.js
    const entSrc = fs.readFileSync(path.join(__dirname, 'js', 'entitlements.js'), 'utf8');
    new Function('window', 'document', 'module', 'exports', 'localStorage', 'CODE_CONVERTER_CONFIG', entSrc)(
      mockWindow, doc, { exports: {} }, {}, mockWindow.localStorage, mockWindow.CODE_CONVERTER_CONFIG
    );

    return {
      window: mockWindow,
      doc,
      upgrade: mockWindow.DeepPredictUpgrade,
      entitlements: mockWindow.Entitlements,
      events,
      notifications,
      getModalClosed: () => modalClosed,
      getPaywallOpenedWith: () => paywallOpenedWith,
      elements
    };
  }

  // --- TEST SUITE 2: Module Architecture & Export Verifications ---
  console.log('--- TEST SUITE 2: Module Architecture & Export Verifications ---');
  {
    const env = createMockEnvironment();
    const up = env.upgrade;
    const ent = env.entitlements;

    assert(up, 'window.DeepPredictUpgrade must exist');
    assert(up.FeatureUpgradePrompt, 'FeatureUpgradePrompt component must be exported');
    assert(up.UsageLimitBanner, 'UsageLimitBanner component must be exported');
    assert(up.UpgradeModal, 'UpgradeModal component must be exported');
    assert(up.LockedCapability, 'LockedCapability component must be exported');
    assert(up.PlanComparison, 'PlanComparison component must be exported');
    assert(up.UsageMeter, 'UsageMeter component must be exported');
    assert.strictEqual(typeof up.continueExploring, 'function', 'continueExploring function must be exported');

    // Verify Entitlements integration
    assert.strictEqual(ent.FeatureUpgradePrompt, up.FeatureUpgradePrompt, 'Entitlements.FeatureUpgradePrompt getter must link to upgrade experience');
    assert.strictEqual(ent.UsageLimitBanner, up.UsageLimitBanner, 'Entitlements.UsageLimitBanner getter must link to upgrade experience');
    assert.strictEqual(ent.UpgradeModal, up.UpgradeModal, 'Entitlements.UpgradeModal getter must link to upgrade experience');
    assert.strictEqual(ent.LockedCapability, up.LockedCapability, 'Entitlements.LockedCapability getter must link to upgrade experience');
    assert.strictEqual(ent.PlanComparison, up.PlanComparison, 'Entitlements.PlanComparison getter must link to upgrade experience');
    assert.strictEqual(ent.UsageMeter, up.UsageMeter, 'Entitlements.UsageMeter getter must link to upgrade experience');
    assert.strictEqual(typeof ent.continueExploring, 'function', 'Entitlements.continueExploring must be exposed');

    console.log('✅ Module architecture & component linkages successfully verified across DeepPredictUpgrade and Entitlements\n');
  }

  // --- TEST SUITE 3: Core Design Principle (Never "Blocked", Always "Discovered") ---
  console.log('--- TEST SUITE 3: Core Design Principle Audit ---');
  {
    const env = createMockEnvironment();
    const up = env.upgrade;

    const samples = [
      up.FeatureUpgradePrompt.createHtml({ featureKey: 'converter' }),
      up.FeatureUpgradePrompt.createHtml({ featureKey: 'valuebot' }),
      up.UsageLimitBanner.createHtml({ featureKey: 'converter' }),
      up.LockedCapability.createHtml({ featureKey: 'arbitrage' }),
      up.LockedCapability.createHtml({ featureKey: 'backtester' }),
      up.PlanComparison.createHtml(),
      up.UsageMeter.createHtml('converter')
    ];

    const forbiddenPhrases = [
      'you are blocked',
      'access denied',
      'blocked user',
      'you have been blocked',
      'forbidden action',
      'access strictly restricted'
    ];

    for (const html of samples) {
      const lower = html.toLowerCase();
      for (const phrase of forbiddenPhrases) {
        assert(!lower.includes(phrase), `Design principle violation! Output contains negative phrasing: "${phrase}"`);
      }
    }

    // Assert discovery language
    const promptHtml = up.FeatureUpgradePrompt.createHtml({ featureKey: 'valuebot' });
    assert(promptHtml.includes('DISCOVERED'), 'Must highlight discovered capability');
    assert(promptHtml.includes('Continue exploring DeepPredictBet'), 'Must provide continue exploring escape hatch');

    const lockedHtml = up.LockedCapability.createHtml({ featureKey: 'arbitrage' });
    assert(lockedHtml.includes('YOU HAVE DISCOVERED A CAPABILITY'), 'Must highlight discovery in locked capability overlay');
    assert(lockedHtml.includes("Here's what you can unlock by upgrading:"), 'Must present clear unlocking value proposition');

    console.log('✅ Core design principle verified: 0 instances of negative "blocked" messaging; positive discovery-first phrasing used consistently\n');
  }

  // --- TEST SUITE 4: Booking Code Converter Quota Exhaustion Specification ---
  console.log('--- TEST SUITE 4: Booking Code Converter Quota Exhaustion Verification ---');
  {
    const env = createMockEnvironment({
      localStorage: { userLoggedIn: 'true', currentUserEmail: 'free_punter@example.com', user_role: 'USER' }
    });

    // Exhaust all 3 free conversions
    env.entitlements.recordFeatureUsage('converter', 3);
    const status = env.entitlements.getFeatureEntitlement('converter');
    assert.strictEqual(status.remaining, 0, 'Remaining conversions must be 0');
    assert.strictEqual(status.isQuotaExhausted, true, 'Quota must be exhausted');

    const bannerHtml = env.upgrade.UsageLimitBanner.createHtml({ featureKey: 'converter' });

    // 1. Headline check
    assert(bannerHtml.includes("Today's free conversion allowance has been reached."), 'Must include exact headline: "Today\'s free conversion allowance has been reached."');

    // 2. Used count check
    assert(bannerHtml.includes("You've used your 3 free conversions for today."), 'Must include exact used count: "You\'ve used your 3 free conversions for today."');

    // 3. Pro expansion check
    assert(bannerHtml.includes("PRO gives you expanded booking-code conversion access."), 'Must include exact pro expansion copy: "PRO gives you expanded booking-code conversion access."');

    // 4. Upgrade button check
    assert(bannerHtml.includes('Upgrade to Pro'), 'Must provide Upgrade to Pro button');

    // 5. Continue exploring escape hatch
    assert(bannerHtml.includes('Continue exploring DeepPredictBet'), 'Must provide "Continue exploring DeepPredictBet" escape hatch');

    // 6. Intact reassurance note
    assert(bannerHtml.includes('All other app functionality, predictions, and tools remain 100% intact.'), 'Must explicitly reassure the user that other tools remain intact');

    console.log('✅ Converter quota exhaustion banner strictly matches the user prompt specification & non-blocking requirements\n');
  }

  // --- TEST SUITE 5: FeatureUpgradePrompt Component Tests ---
  console.log('--- TEST SUITE 5: FeatureUpgradePrompt Component Tests ---');
  {
    const env = createMockEnvironment();
    const up = env.upgrade;

    // Test across several tools
    const tools = ['doctor', 'valuebot', 'scout', 'generator', 'viptips'];
    for (const tool of tools) {
      const html = up.FeatureUpgradePrompt.createHtml({ featureKey: tool });
      assert(html.includes('feature-upgrade-prompt-card'), `Card class must be present for ${tool}`);
      assert(html.includes('fup-discovery-badge'), `Discovery badge must be present for ${tool}`);
      assert(html.includes('fup-benefits-grid'), `Benefits grid must be present for ${tool}`);
      assert(html.includes('Continue exploring DeepPredictBet'), `Continue exploring must be present for ${tool}`);
      assert(html.includes('fup-reassurance-note'), `Reassurance note must be present for ${tool}`);
    }

    // Test DOM render method
    const testContainer = env.doc.getElementById('test-prompt-container');
    up.FeatureUpgradePrompt.render(testContainer, { featureKey: 'valuebot' });
    assert(testContainer.innerHTML.includes('Value Bet Bot'), 'Rendered container must include feature name');
    console.log('✅ FeatureUpgradePrompt verified across multiple tools and DOM rendering\n');
  }

  // --- TEST SUITE 6: UsageLimitBanner State Tests ---
  console.log('--- TEST SUITE 6: UsageLimitBanner State Tests ---');
  {
    // A. Active State (> 1 remaining)
    {
      const env = createMockEnvironment({
        localStorage: { userLoggedIn: 'true', currentUserEmail: 'active_user@example.com', user_role: 'USER' }
      });
      const html = env.upgrade.UsageLimitBanner.createHtml({ featureKey: 'converter' });
      assert(html.includes('banner-active'), 'Must have banner-active class');
      assert(html.includes('Free conversions remaining today:'), 'Must show remaining count');
      assert(html.includes('Explore PRO benefits'), 'Must offer proactive exploration link');
    }

    // B. Caution State (1 remaining)
    {
      const env = createMockEnvironment({
        localStorage: { userLoggedIn: 'true', currentUserEmail: 'caution_user@example.com', user_role: 'USER' }
      });
      env.entitlements.recordFeatureUsage('converter', 2);
      const html = env.upgrade.UsageLimitBanner.createHtml({ featureKey: 'converter' });
      assert(html.includes('banner-caution'), 'Must have banner-caution class when 1 remaining');
      assert(html.includes('1'), 'Must show 1 remaining');
    }

    // C. Unlimited State (VIP)
    {
      const env = createMockEnvironment({
        vipSubscription: { active: true, tier: 'annual' },
        localStorage: { userLoggedIn: 'true', currentUserEmail: 'vip_user@example.com', user_role: 'VIP' }
      });
      const html = env.upgrade.UsageLimitBanner.createHtml({ featureKey: 'converter' });
      assert(html.includes('banner-unlimited'), 'Must have banner-unlimited class');
      assert(html.includes('VIP Access Active'), 'Must announce VIP Access');
      assert(html.includes('Unlimited Active'), 'Must show Unlimited status pill');
    }

    console.log('✅ UsageLimitBanner active, caution, and unlimited states verified\n');
  }

  // --- TEST SUITE 7: UpgradeModal Controller Tests ---
  console.log('--- TEST SUITE 7: UpgradeModal Controller Tests ---');
  {
    const env = createMockEnvironment();
    const up = env.upgrade;

    // Test Open
    up.UpgradeModal.open('backtester', 'annual');
    const opened = env.getPaywallOpenedWith();
    assert.deepStrictEqual(opened, { tier: 'annual', feature: 'backtester' }, 'UpgradeModal.open must route to Paywall 2.0 with correct tier & feature');

    // Test Close
    up.UpgradeModal.close();
    assert.strictEqual(env.getModalClosed(), true, 'UpgradeModal.close must invoke closeVipSubscriptionModal');

    console.log('✅ UpgradeModal controller cleanly coordinates with existing Paywall 2.0 architecture\n');
  }

  // --- TEST SUITE 8: LockedCapability Discovery & Wrap Tests ---
  console.log('--- TEST SUITE 8: LockedCapability Discovery & Wrap Tests ---');
  {
    const env = createMockEnvironment();
    const up = env.upgrade;

    const html = up.LockedCapability.createHtml({ featureKey: 'arbitrage' });
    assert(html.includes('lc-surface-preview'), 'Must include surface preview');
    assert(html.includes('lc-watermark'), 'Must include Illustrative Data watermark');
    assert(html.includes('lc-discovery-overlay'), 'Must include discovery overlay');
    assert(html.includes('YOU HAVE DISCOVERED A CAPABILITY'), 'Must include discovery badge');
    assert(html.includes("Here's what you can unlock by upgrading:"), 'Must include unlocks list');
    assert(html.includes('Continue exploring DeepPredictBet'), 'Must include Continue exploring link');

    // Test DOM Wrap
    const tableEl = env.doc.getElementById('arbitrage-table');
    up.LockedCapability.wrap(tableEl, { featureKey: 'arbitrage' });
    assert(tableEl.classList.contains('capability-wrapped'), 'Target element must be tagged with capability-wrapped');

    console.log('✅ LockedCapability discovery teaser, metrics preview, and DOM wrap verified\n');
  }

  // --- TEST SUITE 9: PlanComparison Matrix Tests ---
  console.log('--- TEST SUITE 9: PlanComparison Matrix Tests ---');
  {
    const env = createMockEnvironment();
    const up = env.upgrade;

    const html = up.PlanComparison.createHtml({ highlightedTier: 'PRO' });
    assert(html.includes('Transparent Tier Comparison'), 'Must include title');
    assert(html.includes('Public Punter'), 'Must include Free Plan');
    assert(html.includes('Pro Bettor'), 'Must include Pro Plan');
    assert(html.includes('Syndicate Pass'), 'Must include VIP Plan');
    assert(html.includes('3 booking code conversions / day'), 'Must display Free conversions');
    assert(html.includes('30 conversions / day'), 'Must display Pro conversions');
    assert(html.includes('UNLIMITED booking code conversions'), 'Must display VIP conversions');
    assert(html.includes('Arbitrage SureBet Finder (VIP Only)'), 'Must clearly specify VIP exclusivity for Arbitrage');
    assert(html.includes('Strategy Backtesting (VIP Only)'), 'Must clearly specify VIP exclusivity for Backtesting');
    assert(html.includes('1-Click Cancellation Anytime'), 'Must include cancellation reassurance');

    console.log('✅ PlanComparison transparent 3-column matrix verified across all tiers & limits\n');
  }

  // --- TEST SUITE 10: UsageMeter Gauge & Percentage Tests ---
  console.log('--- TEST SUITE 10: UsageMeter Gauge & Percentage Tests ---');
  {
    const env = createMockEnvironment({
      localStorage: { userLoggedIn: 'true', currentUserEmail: 'meter_user@example.com', user_role: 'USER' }
    });
    const up = env.upgrade;

    // Test 0/3 (0%)
    let meterHtml = up.UsageMeter.createHtml('converter');
    assert(meterHtml.includes('0 / 3'), 'Must display 0 / 3 fraction');
    assert(meterHtml.includes('width: 0%;'), 'Width must be 0%');
    assert(meterHtml.includes('meter-normal'), 'Must have meter-normal class');

    // Test 1/3 (33%)
    env.entitlements.recordFeatureUsage('converter', 1);
    meterHtml = up.UsageMeter.createHtml('converter');
    assert(meterHtml.includes('1 / 3'), 'Must display 1 / 3 fraction');
    assert(meterHtml.includes('width: 33%;'), 'Width must be 33%');

    // Test 2/3 (67% - Caution state)
    env.entitlements.recordFeatureUsage('converter', 1);
    meterHtml = up.UsageMeter.createHtml('converter');
    assert(meterHtml.includes('2 / 3'), 'Must display 2 / 3 fraction');
    assert(meterHtml.includes('width: 67%;'), 'Width must be 67%');
    assert(meterHtml.includes('meter-caution'), 'Must have meter-caution class');

    // Test 3/3 (100% - Exhausted state)
    env.entitlements.recordFeatureUsage('converter', 1);
    meterHtml = up.UsageMeter.createHtml('converter');
    assert(meterHtml.includes('3 / 3'), 'Must display 3 / 3 fraction');
    assert(meterHtml.includes('width: 100%;'), 'Width must be 100%');
    assert(meterHtml.includes('meter-exhausted'), 'Must have meter-exhausted class');
    assert(meterHtml.includes('Allowance reached · Resets at 00:00 UTC'), 'Must show reset at 00:00 UTC');

    console.log('✅ UsageMeter percentage calculations, caution/exhausted color states, and UTC reset verified\n');
  }

  // --- TEST SUITE 11: Universal Escape Hatch & Intact App Reassurance ---
  console.log('--- TEST SUITE 11: Universal Escape Hatch & Intact App Reassurance ---');
  {
    const env = createMockEnvironment();
    const up = env.upgrade;

    up.continueExploring('converter_quota_banner');
    assert.strictEqual(env.getModalClosed(), true, 'continueExploring must close active subscription modal');
    assert(env.notifications.length > 0, 'Reassurance toast must be broadcast');
    assert(env.notifications[0].msg.includes('All standard predictions and tools remain fully active'), 'Reassurance toast must confirm tools remain fully active');

    assert.strictEqual(env.events.length, 1, 'Event must be logged');
    assert.strictEqual(env.events[0].name, 'UPGRADE_CONTINUE_EXPLORING', 'Event name must be UPGRADE_CONTINUE_EXPLORING');
    assert.strictEqual(env.events[0].data.context, 'converter_quota_banner', 'Event context must match');

    console.log('✅ Universal Escape Hatch verified: Closes modals, shows non-blocking toast, and tracks event\n');
  }

  // --- TEST SUITE 12: DOM & CSS Integration Across index.html and main.css ---
  console.log('--- TEST SUITE 12: DOM & CSS Integration Verification ---');
  {
    const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
    const mainCss = fs.readFileSync(path.join(__dirname, 'css', 'main.css'), 'utf8');

    // Verify script registration in index.html
    assert(indexHtml.includes('/js/upgradeExperience.js'), 'index.html must load upgradeExperience.js');

    // Verify escape hatch in modal
    assert(indexHtml.includes('vip-continue-exploring-link'), 'index.html must contain #vip-continue-exploring-link');
    assert(indexHtml.includes('Continue exploring DeepPredictBet'), 'index.html modal must contain "Continue exploring DeepPredictBet" text');

    // Verify CSS classes
    const requiredCssClasses = [
      '.feature-upgrade-prompt-card',
      '.usage-limit-banner',
      '.banner-exhausted',
      '.banner-caution',
      '.banner-unlimited',
      '.locked-capability-card',
      '.lc-surface-preview',
      '.lc-discovery-overlay',
      '.plan-comparison-container',
      '.usage-meter-widget',
      '.continue-exploring-link'
    ];

    for (const cls of requiredCssClasses) {
      assert(mainCss.includes(cls), `main.css must define style rule for ${cls}`);
    }

    console.log('✅ DOM & CSS integration confirmed across index.html and css/main.css\n');
  }

  console.log('================================================================');
  console.log('ALL 12 UPGRADE EXPERIENCE TEST SUITES PASSED (100% SUCCESS)');
  console.log('================================================================');
}

runTests().catch(err => {
  console.error('\n❌ TEST FAILURE:', err);
  process.exit(1);
});
