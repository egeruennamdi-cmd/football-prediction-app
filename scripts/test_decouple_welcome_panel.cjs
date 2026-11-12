/**
 * Comprehensive Automated Test Suite:
 * DEEPPREDICTBET — DECOUPLE THE AUTHENTICATED WELCOME PANEL FROM ALL CORE APPLICATION FEATURES
 *
 * Verifies:
 * TEST A: Normal Operation (All core features operational with welcome panel present).
 * TEST B: Welcome Panel Hidden (style="display:none", Scout, Bet Doctor, Generator, Betslip operational).
 * TEST C: Welcome Panel Component Removed (Element deleted from DOM, no cascade failures).
 * TEST D: Welcome Panel API / Storage Data Failure (Corrupt JSON in storage handled gracefully).
 * TEST E: Welcome Panel JavaScript Exception Boundary (Runtime error isolated, other features initialize 100%).
 * TEST F: Authentication & Permission Separation (Logged-out, Free, VIP, Admin tier isolation).
 * TEST G: Security & Diagnostics (Zero secrets/tokens in event log, DPFeatureHealth diagnostic status).
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

let totalTests = 0;
let passedTests = 0;

async function it(name, fn) {
  totalTests++;
  try {
    if (fn.length > 0) {
      await new Promise((resolve, reject) => {
        fn((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    } else {
      const res = fn();
      if (res && typeof res.then === 'function') {
        await res;
      }
    }
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(err);
    process.exitCode = 1;
  }
}

function createTestEnvironment(customHtml) {
  const defaultHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const htmlToLoad = customHtml || defaultHtml;

  const dom = new JSDOM(htmlToLoad, {
    runScripts: "outside-only",
    url: "https://deeppredictbet.com"
  });

  const { window } = dom;

  window.localStorage.clear();

  // Mock navigation
  window.currentPath = '/';
  window.navigateTo = (p) => { window.currentPath = p; };

  // Mock match data
  window.MATCH_DATA = [
    {
      id: "test-match-1",
      homeTeam: { name: "Manchester United", crest: "" },
      awayTeam: { name: "Chelsea", crest: "" },
      date: "2026-11-12",
      kickoff: "16:30",
      status: "SCHEDULED",
      league: "Premier League",
      predictions: {
        tip: "1X",
        prob: 0.68,
        homeWinProb: 44,
        drawProb: 28,
        awayWinProb: 28
      },
      odds: { "1": 2.10, "X": 3.40, "2": 3.10 }
    },
    {
      id: "test-match-2",
      homeTeam: { name: "Arsenal", crest: "" },
      awayTeam: { name: "Newcastle United", crest: "" },
      date: "2026-11-12",
      kickoff: "19:00",
      status: "SCHEDULED",
      league: "Premier League",
      predictions: {
        tip: "Home Win",
        prob: 0.72,
        homeWinProb: 55,
        drawProb: 25,
        awayWinProb: 20
      },
      odds: { "1": 1.75, "X": 3.60, "2": 4.50 }
    }
  ];

  // Load featureRegistry first
  const featureRegistryCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'featureRegistry.js'), 'utf8');
  window.eval(featureRegistryCode);

  // Load app.js
  const appCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');
  window.eval(appCode);

  return { dom, window };
}

async function runDecoupleWelcomePanelTests() {
  console.log('🧪 Starting Critical Platform Stability & Decoupling Test Suite...\n');

  // ==========================================
  // TEST A: NORMAL OPERATION
  // ==========================================
  console.log('🔹 GROUP A: Normal Operation (Welcome Panel Present & Authenticated)');

  await it('A1: Welcome panel renders greeting, user tier, and 4 quick-access tiles when authenticated', () => {
    const { window } = createTestEnvironment();
    window.localStorage.setItem('userLoggedIn', 'true');
    window.localStorage.setItem('currentUsername', 'Egeruennamdi78');
    window.localStorage.setItem('dp_saved_tickets', JSON.stringify([{ id: 'slip-1' }]));
    window.localStorage.setItem('dp_doctor_history', JSON.stringify([{ id: 'audit-1' }, { id: 'audit-2' }]));
    window.localStorage.setItem('dp_watchlist', JSON.stringify(['test-match-1']));

    const res = window.renderWelcomePanel();
    assert.strictEqual(res.rendered, true);

    const welcomeEl = window.document.getElementById('command-center-welcome');
    assert.ok(welcomeEl, '#command-center-welcome should exist');
    assert.strictEqual(welcomeEl.style.display, 'block');
    assert.ok(welcomeEl.innerHTML.includes('Egeruennamdi78'), 'Should display username');
    assert.ok(welcomeEl.innerHTML.includes('FREE ACCOUNT'), 'Should display Free Account badge');
    assert.ok(welcomeEl.innerHTML.includes('1 active ticket'), 'Should display saved slips count');
    assert.ok(welcomeEl.innerHTML.includes('2 audited slips'), 'Should display doctor audits count');
    assert.ok(welcomeEl.innerHTML.includes('1 monitored fixture'), 'Should display watchlist count');
    assert.ok(welcomeEl.innerHTML.includes('Bet Generator'), 'Should display Bet Generator shortcut');
  });

  await it('A2: Core app engine initializes without errors when welcome panel is present', () => {
    const { window } = createTestEnvironment();
    window.localStorage.setItem('userLoggedIn', 'true');
    window.localStorage.setItem('currentUsername', 'Egeruennamdi78');

    assert.doesNotThrow(() => {
      window.initAppEngine();
    });

    const status = window.DPFeatureHealth.getStatus();
    assert.strictEqual(status.features.welcome_panel.status, 'INITIALIZED');
    assert.strictEqual(status.features.ask_ai_scout.status, 'INITIALIZED');
    assert.strictEqual(status.features.ai_bet_doctor.status, 'INITIALIZED');
    assert.strictEqual(status.features.bet_generator.status, 'INITIALIZED');
    assert.strictEqual(status.features.active_betslip_builder.status, 'INITIALIZED');
  });

  await it('A3: Ask AI Scout generates selections and updates betslip in normal operation', () => {
    const { window } = createTestEnvironment();
    window.localStorage.setItem('userLoggedIn', 'true');
    window.initAppEngine();

    window.executeCommandScoutPrompt('Generate 40 selections');
    const betslip = window.appState.betslip;
    assert.ok(Array.isArray(betslip), 'Betslip should be an array');
    assert.ok(betslip.length > 0, 'Betslip should contain selections');

    const drawer = window.document.getElementById('floating-betslip-drawer');
    if (drawer) {
      assert.ok(drawer.classList.contains('open'), 'Betslip drawer should be open');
    }
  });

  await it('A4: AI Bet Doctor audits active betslip in normal operation', () => {
    const { window } = createTestEnvironment();
    window.localStorage.setItem('userLoggedIn', 'true');
    window.initAppEngine();

    // Ensure betslip has selections
    window.appState.betslip = [
      { id: 'sel-1', match: 'Man United vs Chelsea', odds: 2.10, pick: '1X' }
    ];

    assert.doesNotThrow(() => {
      window.runBetDoctorAudit(false, 'betslip');
    });
  });

  // ==========================================
  // TEST B: WELCOME PANEL HIDDEN
  // ==========================================
  console.log('\n🔹 GROUP B: Welcome Panel Hidden (style="display:none")');

  await it('B1: Ask AI Scout loads and responds when welcome panel is hidden', () => {
    const { window } = createTestEnvironment();
    window.localStorage.setItem('userLoggedIn', 'true');
    window.initAppEngine();

    const welcomeEl = window.document.getElementById('command-center-welcome');
    if (welcomeEl) welcomeEl.style.display = 'none';

    assert.doesNotThrow(() => {
      window.executeCommandScoutPrompt('Generate 10 selections');
    });

    const betslip = window.appState.betslip;
    assert.ok(Array.isArray(betslip) && betslip.length > 0, 'Scout selections must generate when panel is hidden');
  });

  await it('B2: Ask AI Scout routes to Bet Doctor when welcome panel is hidden', (done) => {
    const { window } = createTestEnvironment();
    window.localStorage.setItem('userLoggedIn', 'true');
    window.initAppEngine();

    const welcomeEl = window.document.getElementById('command-center-welcome');
    if (welcomeEl) welcomeEl.style.display = 'none';

    window.executeCommandScoutPrompt('Check my bet');

    setTimeout(() => {
      try {
        assert.strictEqual(window.currentPath, '/bet-doctor', 'Must navigate to /bet-doctor on check my bet prompt');
        done();
      } catch (e) {
        done(e);
      }
    }, 850);
  });

  await it('B3: AI Bet Doctor executes audit and prescription when welcome panel is hidden', () => {
    const { window } = createTestEnvironment();
    window.localStorage.setItem('userLoggedIn', 'true');
    window.initAppEngine();

    const welcomeEl = window.document.getElementById('command-center-welcome');
    if (welcomeEl) welcomeEl.style.display = 'none';

    window.appState.betslip = [
      { id: 'sel-1', match: 'Arsenal vs Newcastle', odds: 1.75, pick: '1' }
    ];

    assert.doesNotThrow(() => {
      window.runBetDoctorAudit(false, 'betslip');
    });
  });

  await it('B4: Bet Generator and Active Betslip Builder remain operational when welcome panel is hidden', () => {
    const { window } = createTestEnvironment();
    window.localStorage.setItem('userLoggedIn', 'true');
    window.initAppEngine();

    const welcomeEl = window.document.getElementById('command-center-welcome');
    if (welcomeEl) welcomeEl.style.display = 'none';

    assert.doesNotThrow(() => {
      if (typeof window.generateMachineTicket === 'function') window.generateMachineTicket();
      if (typeof window.renderBetslip === 'function') window.renderBetslip();
    });
  });

  // ==========================================
  // TEST C: WELCOME PANEL COMPONENT REMOVED FROM DOM
  // ==========================================
  console.log('\n🔹 GROUP C: Welcome Panel Component Removed Completely from DOM');

  await it('C1: renderWelcomePanel exits safely with mount_absent when element is missing', () => {
    const { window } = createTestEnvironment();
    window.localStorage.setItem('userLoggedIn', 'true');

    // Remove element from DOM
    const welcomeEl = window.document.getElementById('command-center-welcome');
    if (welcomeEl) welcomeEl.remove();
    assert.strictEqual(window.document.getElementById('command-center-welcome'), null);

    const res = window.renderWelcomePanel();
    assert.strictEqual(res.rendered, false);
    assert.strictEqual(res.reason, 'mount_absent');

    const status = window.DPFeatureHealth.getStatus();
    const lastEvent = status.recentEvents[status.recentEvents.length - 1];
    assert.strictEqual(lastEvent.event, 'FEATURE_DEPENDENCY_UNAVAILABLE');
    assert.strictEqual(lastEvent.details.feature, 'welcome_panel');
  });

  await it('C2: initAppEngine completes 100% of other features when welcome panel element is removed from DOM', () => {
    const { window } = createTestEnvironment();
    window.localStorage.setItem('userLoggedIn', 'true');

    // Remove element before initAppEngine
    const welcomeEl = window.document.getElementById('command-center-welcome');
    if (welcomeEl) welcomeEl.remove();

    assert.doesNotThrow(() => {
      window.initAppEngine();
    });

    const status = window.DPFeatureHealth.getStatus();
    assert.strictEqual(status.features.welcome_panel.status, 'UNAVAILABLE');
    assert.strictEqual(status.features.ask_ai_scout.status, 'INITIALIZED');
    assert.strictEqual(status.features.ai_bet_doctor.status, 'INITIALIZED');
    assert.strictEqual(status.features.bet_generator.status, 'INITIALIZED');
    assert.strictEqual(status.features.active_betslip_builder.status, 'INITIALIZED');
  });

  await it('C3: Ask AI Scout executes seamlessly with zero errors when welcome panel DOM is absent', () => {
    const { window } = createTestEnvironment();
    window.localStorage.setItem('userLoggedIn', 'true');

    const welcomeEl = window.document.getElementById('command-center-welcome');
    if (welcomeEl) welcomeEl.remove();

    window.initAppEngine();

    assert.doesNotThrow(() => {
      window.executeCommandScoutPrompt('Generate 40 selections');
    });
    assert.ok(window.appState.betslip.length > 0, 'Betslip picks must generate without welcome panel in DOM');
  });

  await it('C4: AI Bet Doctor audits tickets when welcome panel DOM is absent', () => {
    const { window } = createTestEnvironment();
    window.localStorage.setItem('userLoggedIn', 'true');

    const welcomeEl = window.document.getElementById('command-center-welcome');
    if (welcomeEl) welcomeEl.remove();

    window.initAppEngine();

    window.appState.betslip = [{ id: 'b1', match: 'A vs B', odds: 1.5, pick: '1' }];
    assert.doesNotThrow(() => {
      window.runBetDoctorAudit(false, 'betslip');
    });
  });

  // ==========================================
  // TEST D: WELCOME PANEL STORAGE / DATA FAILURE
  // ==========================================
  console.log('\n🔹 GROUP D: Welcome Panel Storage / Corrupt Data Failure');

  await it('D1: Corrupt JSON in saved tickets, doctor history, or watchlist does not crash renderWelcomePanel', () => {
    const { window } = createTestEnvironment();
    window.localStorage.setItem('userLoggedIn', 'true');
    window.localStorage.setItem('currentUsername', 'SurvivorUser');
    window.localStorage.setItem('dp_saved_tickets', '{corrupt-json!');
    window.localStorage.setItem('dp_doctor_history', 'undefined');
    window.localStorage.setItem('dp_watchlist', '["unterminated');

    let res;
    assert.doesNotThrow(() => {
      res = window.renderWelcomePanel();
    });
    assert.strictEqual(res.rendered, true);

    const welcomeEl = window.document.getElementById('command-center-welcome');
    assert.ok(welcomeEl.innerHTML.includes('0 active tickets'), 'Should fallback to 0 tickets');
    assert.ok(welcomeEl.innerHTML.includes('Audit new ticket'), 'Should fallback to Audit new ticket');
    assert.ok(welcomeEl.innerHTML.includes('0 monitored fixtures'), 'Should fallback to 0 monitored fixtures');
  });

  await it('D2: Corrupt storage data in welcome panel does not stop Ask AI Scout or Bet Doctor', () => {
    const { window } = createTestEnvironment();
    window.localStorage.setItem('userLoggedIn', 'true');
    window.localStorage.setItem('dp_saved_tickets', '{{bad}}');

    window.initAppEngine();

    assert.doesNotThrow(() => {
      window.executeCommandScoutPrompt('Generate 40 selections');
      window.runBetDoctorAudit(false, 'betslip');
    });
  });

  // ==========================================
  // TEST E: WELCOME PANEL JAVASCRIPT EXCEPTION BOUNDARY
  // ==========================================
  console.log('\n🔹 GROUP E: Welcome Panel JavaScript Failure & Error Boundary Isolation');

  await it('E1: A fatal runtime exception in renderWelcomePanel is safely isolated by DPFeatureHealth', () => {
    const { window } = createTestEnvironment();
    window.localStorage.setItem('userLoggedIn', 'true');

    // Inject throwing mock into renderWelcomePanel
    window.renderWelcomePanel = () => {
      throw new Error('SIMULATED_FATAL_WELCOME_PANEL_CRASH');
    };

    assert.doesNotThrow(() => {
      window.initAppEngine();
    });

    const status = window.DPFeatureHealth.getStatus();
    assert.strictEqual(status.features.welcome_panel.status, 'FAILED');
    assert.ok(status.features.welcome_panel.error.includes('SIMULATED_FATAL_WELCOME_PANEL_CRASH'));

    // Verify all other core features successfully initialized!
    assert.strictEqual(status.features.ask_ai_scout.status, 'INITIALIZED');
    assert.strictEqual(status.features.ai_bet_doctor.status, 'INITIALIZED');
    assert.strictEqual(status.features.bet_generator.status, 'INITIALIZED');
    assert.strictEqual(status.features.active_betslip_builder.status, 'INITIALIZED');
  });

  await it('E2: Ask AI Scout operates even when renderWelcomePanel previously crashed', () => {
    const { window } = createTestEnvironment();
    window.localStorage.setItem('userLoggedIn', 'true');

    window.renderWelcomePanel = () => {
      throw new Error('PANEL_CRASH');
    };
    window.initAppEngine();

    assert.doesNotThrow(() => {
      window.executeCommandScoutPrompt('Generate 40 selections');
    });
    assert.ok(window.appState.betslip.length > 0);
  });

  await it('E3: AI Bet Doctor operates even when renderWelcomePanel previously crashed', () => {
    const { window } = createTestEnvironment();
    window.localStorage.setItem('userLoggedIn', 'true');

    window.renderWelcomePanel = () => {
      throw new Error('PANEL_CRASH');
    };
    window.initAppEngine();

    window.appState.betslip = [{ id: 'b2', match: 'X vs Y', odds: 1.8, pick: 'X' }];
    assert.doesNotThrow(() => {
      window.runBetDoctorAudit(false, 'betslip');
    });
  });

  // ==========================================
  // TEST F: AUTHENTICATION AND PERMISSION SEPARATION
  // ==========================================
  console.log('\n🔹 GROUP F: Authentication & Permission Separation');

  await it('F1: Logged-out visitor has welcome panel hidden and guest link rendered', () => {
    const { window } = createTestEnvironment();
    window.localStorage.setItem('userLoggedIn', 'false');
    window.localStorage.removeItem('currentUsername');

    const res = window.renderWelcomePanel();
    assert.strictEqual(res.rendered, false);
    assert.strictEqual(res.reason, 'unauthenticated');

    const welcomeEl = window.document.getElementById('command-center-welcome');
    assert.strictEqual(welcomeEl.style.display, 'none');

    const guestLink = window.document.getElementById('cmd-guest-auth-link');
    if (guestLink) {
      assert.ok(guestLink.innerHTML.includes('Sign In'), 'Should offer guest sign-in CTA');
    }
  });

  await it('F2: Logged-in ordinary user gets FREE ACCOUNT badge', () => {
    const { window } = createTestEnvironment();
    window.localStorage.setItem('userLoggedIn', 'true');
    window.localStorage.setItem('currentUsername', 'RegularFan');

    window.renderWelcomePanel();
    const welcomeEl = window.document.getElementById('command-center-welcome');
    assert.ok(welcomeEl.innerHTML.includes('FREE ACCOUNT'));
    assert.ok(welcomeEl.innerHTML.includes('RegularFan'));
  });

  await it('F3: Logged-in VIP user gets VIP badge', () => {
    const { window } = createTestEnvironment();
    window.localStorage.setItem('userLoggedIn', 'true');
    window.localStorage.setItem('currentUsername', 'VipPunter');
    window.localStorage.setItem('deeppredictbet_vip', JSON.stringify({ plan: 'VIP Syndicate' }));
    window.Entitlements = { getUserTier: () => 'VIP' };

    window.renderWelcomePanel();
    const welcomeEl = window.document.getElementById('command-center-welcome');
    assert.ok(welcomeEl.innerHTML.includes('VIP SYNDICATE'));
    assert.ok(welcomeEl.innerHTML.includes('VipPunter'));
  });

  await it('F4: Administrator gets ADMIN PASS badge but security is server-enforced', () => {
    const { window } = createTestEnvironment();
    window.localStorage.setItem('userLoggedIn', 'true');
    window.localStorage.setItem('currentUsername', 'AdminCommander');
    window.Entitlements = { getUserTier: () => 'ADMIN' };

    window.renderWelcomePanel();
    const welcomeEl = window.document.getElementById('command-center-welcome');
    assert.ok(welcomeEl.innerHTML.includes('ADMIN PASS'));
    assert.ok(welcomeEl.innerHTML.includes('AdminCommander'));
  });

  // ==========================================
  // TEST G: SECURITY, DIAGNOSTICS & CLEAN LOGGING
  // ==========================================
  console.log('\n🔹 GROUP G: Diagnostics & Security Compliance');

  await it('G1: DPFeatureHealth event log redacts all sensitive credential fields', () => {
    const { window } = createTestEnvironment();
    window.DPFeatureHealth.recordEvent('TEST_LOGIN', {
      user: 'testuser',
      password: 'SuperSecretPassword123!',
      token: 'jwt.token.secret',
      apiKey: 'CF_API_KEY_SECRET',
      authorization: 'Bearer 123456789'
    });

    const status = window.DPFeatureHealth.getStatus();
    const lastEvent = status.recentEvents[status.recentEvents.length - 1];

    assert.strictEqual(lastEvent.details.password, '[REDACTED]');
    assert.strictEqual(lastEvent.details.token, '[REDACTED]');
    assert.strictEqual(lastEvent.details.apiKey, '[REDACTED]');
    assert.strictEqual(lastEvent.details.authorization, '[REDACTED]');
    assert.strictEqual(lastEvent.details.user, 'testuser');
  });

  await it('G2: DPFeatureHealth.getStatus() returns comprehensive operational snapshot', () => {
    const { window } = createTestEnvironment();
    window.initAppEngine();

    const status = window.DPFeatureHealth.getStatus();
    assert.ok(typeof status.timestamp === 'string');
    assert.ok(typeof status.totalFeatures === 'number');
    assert.ok(typeof status.initializedCount === 'number');
    assert.ok(Array.isArray(status.recentEvents));
    assert.strictEqual(status.failedCount, 0);
    assert.strictEqual(status.allOperational, true);
  });

  console.log(`\n🎉 Verification Completed: ${passedTests}/${totalTests} tests passed.`);
  process.exit(passedTests === totalTests ? 0 : 1);
}

runDecoupleWelcomePanelTests();
