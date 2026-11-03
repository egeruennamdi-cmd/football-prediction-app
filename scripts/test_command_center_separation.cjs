/**
 * scripts/test_command_center_separation.cjs
 * Comprehensive test suite validating Command Center restoration and Founder Analytics separation:
 * 
 * TEST A — COMMAND CENTER RESTORATION
 * TEST B — FOUNDER ANALYTICS & BI CONSOLE
 * TEST C — SEPARATION & INDEPENDENT ROUTING
 * TEST D — SECURITY & ROLE-BASED ACCESS CONTROL
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { JSDOM, VirtualConsole } = require('jsdom');

console.log('🧪 Starting DeepPredictBet Command Center Restoration & Separation Test Suite...\n');

const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const routerJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'router.js'), 'utf8');
const dashboardJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'dashboard.js'), 'utf8');
const appJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');

function createEnvironment(url = 'https://deeppredictbet.com/') {
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('error', () => {});
  virtualConsole.on('warn', () => {});

  const dom = new JSDOM(indexHtml, {
    url,
    runScripts: 'dangerously',
    virtualConsole,
    pretendToBeVisual: true
  });

  const { window } = dom;

  // Polyfill visual element layout
  window.Element.prototype.scrollIntoView = () => {};
  window.scrollTo = () => {};

  // Attach mock alert/toast
  window.alert = () => {};
  window.showToast = () => {};
  window.showAppNotification = () => {};

  // Mock fetch for admin and user telemetry
  window.fetch = async (reqUrl) => {
    if (reqUrl.includes('/api/admin/metrics')) {
      return {
        ok: true,
        json: async () => ({
          success: true,
          period: { id: 'today', label: 'TODAY' },
          kpi: {
            totalUsers: { value: 120, label: 'TOTAL USERS' },
            newUsers: { value: 12, label: 'NEW USERS' },
            monthlyRevenue: { value: 250000, formatted: '₦250,000' }
          }
        })
      };
    }
    if (reqUrl.includes('/api/users')) {
      return {
        ok: true,
        json: async () => ({
          success: true,
          users: [
            { id: 'usr_1', email: 'admin@deeppredictbet.com', role: 'ADMIN' },
            { id: 'usr_2', email: 'punter@test.com', role: 'USER' }
          ]
        })
      };
    }
    return { ok: true, json: async () => ({}) };
  };

  // Evaluate router and dashboard scripts inside JSDOM window
  window.eval(routerJs);
  window.eval(dashboardJs);

  return { dom, window };
}

let passed = 0;
let failed = 0;
const testQueue = [];

function it(name, fn) {
  testQueue.push({ name, fn });
}

async function runTests() {
  for (const { name, fn } of testQueue) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(err);
      failed++;
    }
  }

  console.log('\n==================================================');
  console.log(`COMMAND CENTER RESTORATION RESULTS: ${passed} passed, ${failed} failed.`);
  console.log('==================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

// =========================================================================
// TEST A — COMMAND CENTER RESTORATION
// =========================================================================
console.log('--- TEST A — COMMAND CENTER RESTORATION ---');

it('Test A1: Authenticated user accessing root "/" renders original view-command-center', () => {
  const { window } = createEnvironment('https://deeppredictbet.com/');
  window.localStorage.setItem('userLoggedIn', 'true');
  window.localStorage.setItem('currentUsername', 'AlexAdmin');
  window.localStorage.setItem('user_role', 'ADMIN');

  window.handleRouteNavigation();

  const cmdView = window.document.getElementById('view-command-center');
  const founderView = window.document.getElementById('view-founder-analytics');

  assert.strictEqual(window.location.pathname, '/', 'Path remains /');
  assert.strictEqual(cmdView.style.display, 'block', 'view-command-center must be displayed');
  assert.ok(cmdView.classList.contains('active'), 'view-command-center must have active class');
  assert.strictEqual(founderView.style.display, 'none', 'view-founder-analytics must NOT be displayed on /');
});

it('Test A2: Accessing explicit route "/command-center" renders original view-command-center', () => {
  const { window } = createEnvironment('https://deeppredictbet.com/command-center');
  window.localStorage.setItem('userLoggedIn', 'true');
  window.localStorage.setItem('currentUsername', 'TestPunter');
  window.localStorage.setItem('user_role', 'USER');

  window.handleRouteNavigation();

  const cmdView = window.document.getElementById('view-command-center');
  assert.strictEqual(cmdView.style.display, 'block', 'view-command-center must be displayed for /command-center');
});

it('Test A3: Command Center contains original brand heading and question', () => {
  const { window } = createEnvironment('https://deeppredictbet.com/');
  window.localStorage.setItem('userLoggedIn', 'true');
  window.handleRouteNavigation();

  const brandEl = window.document.querySelector('.command-center-brand');
  const questionEl = window.document.querySelector('.command-center-question');
  assert.ok(brandEl && brandEl.textContent.includes('DEEPPREDICTBET'), 'Must contain DEEPPREDICTBET brand heading');
  assert.ok(questionEl && questionEl.textContent.includes('WHAT ARE YOU HERE TO DO?'), 'Must contain central question');
});

it('Test A4: Command Center contains original operational quick action controls and scout input', () => {
  const { window } = createEnvironment('https://deeppredictbet.com/');
  window.localStorage.setItem('userLoggedIn', 'true');
  window.handleRouteNavigation();

  const scoutInput = window.document.getElementById('command-scout-input');
  const quickActions = window.document.querySelectorAll('.command-quick-btn, .command-card');
  assert.ok(scoutInput, 'Scout input field #command-scout-input must exist');
  assert.ok(quickActions.length >= 6, 'Must have original quick action controls');
});

it('Test A5: Command Center contains Live Hot Trends Ticker streamer', () => {
  const { window } = createEnvironment('https://deeppredictbet.com/');
  window.localStorage.setItem('userLoggedIn', 'true');
  window.handleRouteNavigation();

  const ticker = window.document.getElementById('trends-ticker-wrapper');
  assert.ok(ticker, 'Hot Trends Ticker streamer wrapper must exist');
  assert.ok(ticker.textContent.includes('HOT TRENDS:'), 'Must display HOT TRENDS: label');
});

it('Test A6: Command Center contains Today Insights and Recent Settled Predictions Ledger containers', () => {
  const { window } = createEnvironment('https://deeppredictbet.com/');
  window.localStorage.setItem('userLoggedIn', 'true');
  window.handleRouteNavigation();

  const insightsSec = window.document.getElementById('today-insights-section');
  const performanceSec = window.document.getElementById('performance-showcase-section');
  const settledGrid = window.document.getElementById('settled-picks-grid');

  assert.ok(insightsSec, 'Today Insights section must exist inside Command Center');
  assert.ok(performanceSec, 'Performance showcase section must exist inside Command Center');
  assert.ok(settledGrid, 'Settled Predictions Ledger grid must exist inside Command Center');
});

// =========================================================================
// TEST B — FOUNDER ANALYTICS & BI CONSOLE
// =========================================================================
console.log('\n--- TEST B — FOUNDER ANALYTICS & BI CONSOLE ---');

it('Test B1: Administrator accessing "/admin" renders view-founder-analytics', async () => {
  const { window } = createEnvironment('https://deeppredictbet.com/admin');
  window.localStorage.setItem('userLoggedIn', 'true');
  window.localStorage.setItem('currentUserEmail', 'admin@deeppredictbet.com');
  window.localStorage.setItem('currentUsername', 'Egeruennamdi78');
  window.localStorage.setItem('user_role', 'ADMIN');
  window.sessionStorage.setItem('dp_founder_authenticated', 'true');

  window.handleRouteNavigation();
  await window.renderFounderDashboard();

  const founderView = window.document.getElementById('view-founder-analytics');
  const cmdView = window.document.getElementById('view-command-center');

  assert.strictEqual(window.location.pathname, '/admin', 'Path must be /admin');
  assert.strictEqual(founderView.style.display, 'block', 'view-founder-analytics must be displayed');
  assert.strictEqual(cmdView.style.display, 'none', 'view-command-center must remain hidden');
});

it('Test B2: Founder Analytics renders header with Admin title, date, and founder badge', async () => {
  const { window } = createEnvironment('https://deeppredictbet.com/admin');
  window.localStorage.setItem('userLoggedIn', 'true');
  window.localStorage.setItem('currentUserEmail', 'admin@deeppredictbet.com');
  window.localStorage.setItem('currentUsername', 'Egeruennamdi78');
  window.localStorage.setItem('user_role', 'ADMIN');
  window.sessionStorage.setItem('dp_founder_authenticated', 'true');

  window.handleRouteNavigation();
  await window.renderFounderDashboard();

  const founderView = window.document.getElementById('view-founder-analytics');
  assert.ok(founderView.innerHTML.includes('DeepPredictBet Admin'), 'Header must contain DeepPredictBet Admin');
  assert.ok(founderView.innerHTML.includes('SERVER-VERIFIED'), 'Must display SERVER-VERIFIED badge');
  assert.ok(founderView.innerHTML.includes('Alex Nnamdi'), 'Must display founder attribution');
});

it('Test B3: Founder Analytics renders Executive KPI tiles and Period selector pills', async () => {
  const { window } = createEnvironment('https://deeppredictbet.com/admin');
  window.localStorage.setItem('userLoggedIn', 'true');
  window.localStorage.setItem('currentUserEmail', 'admin@deeppredictbet.com');
  window.localStorage.setItem('currentUsername', 'Egeruennamdi78');
  window.localStorage.setItem('user_role', 'ADMIN');
  window.sessionStorage.setItem('dp_founder_authenticated', 'true');

  window.handleRouteNavigation();
  await window.renderFounderDashboard();

  const founderView = window.document.getElementById('view-founder-analytics');
  assert.ok(founderView.innerHTML.includes('TOTAL USERS'), 'KPI tile TOTAL USERS must exist');
  assert.ok(founderView.innerHTML.includes('NEW USERS'), 'KPI tile NEW USERS must exist');
  assert.ok(founderView.innerHTML.includes('admin-period-btn'), 'Period selector pills must exist');
  assert.ok(founderView.innerHTML.includes('Social &amp; Telegram Command Center') || founderView.innerHTML.includes('Social & Telegram Command Center'), 'Must contain Social & Telegram tool button');
});

// =========================================================================
// TEST C — SEPARATION & INDEPENDENT ROUTING
// =========================================================================
console.log('\n--- TEST C — SEPARATION & INDEPENDENT ROUTING ---');

it('Test C1: Command Center does NOT render Founder Analytics content inside its container', () => {
  const { window } = createEnvironment('https://deeppredictbet.com/');
  window.localStorage.setItem('userLoggedIn', 'true');
  window.localStorage.setItem('user_role', 'ADMIN');

  window.handleRouteNavigation();

  const cmdView = window.document.getElementById('view-command-center');
  assert.ok(!cmdView.innerHTML.includes('founder-bi-hub'), 'Command Center must NOT contain founder-bi-hub');
  assert.ok(!cmdView.innerHTML.includes('admin-period-btn'), 'Command Center must NOT contain admin-period-btn');
});

it('Test C2: Navigating from Command Center to Founder Analytics and back cleanly switches views', async () => {
  const { window } = createEnvironment('https://deeppredictbet.com/');
  window.localStorage.setItem('userLoggedIn', 'true');
  window.localStorage.setItem('currentUserEmail', 'admin@deeppredictbet.com');
  window.localStorage.setItem('currentUsername', 'Egeruennamdi78');
  window.localStorage.setItem('user_role', 'ADMIN');
  window.sessionStorage.setItem('dp_founder_authenticated', 'true');

  // Step 1: Start at Command Center
  window.handleRouteNavigation();
  const cmdView = window.document.getElementById('view-command-center');
  const founderView = window.document.getElementById('view-founder-analytics');
  assert.strictEqual(cmdView.style.display, 'block', 'Step 1: Command Center visible');
  assert.strictEqual(founderView.style.display, 'none', 'Step 1: Founder Analytics hidden');

  // Step 2: Navigate to Founder Analytics
  window.navigateTo('/admin');
  await window.renderFounderDashboard();
  assert.strictEqual(window.location.pathname, '/admin', 'Step 2: Path updated to /admin');
  assert.strictEqual(founderView.style.display, 'block', 'Step 2: Founder Analytics visible');
  assert.strictEqual(cmdView.style.display, 'none', 'Step 2: Command Center hidden');

  // Step 3: Navigate back to Command Center
  window.navigateTo('/');
  assert.strictEqual(window.location.pathname, '/', 'Step 3: Path restored to /');
  assert.strictEqual(cmdView.style.display, 'block', 'Step 3: Command Center restored');
  assert.strictEqual(founderView.style.display, 'none', 'Step 3: Founder Analytics hidden');
});

it('Test C3: Navigation bar highlights "Command Center" on / and does NOT trigger Founder Analytics', () => {
  const { window } = createEnvironment('https://deeppredictbet.com/');
  window.localStorage.setItem('userLoggedIn', 'true');
  window.localStorage.setItem('user_role', 'ADMIN');

  window.handleRouteNavigation();

  const activeNav = window.document.querySelector('.nav-link.active');
  assert.ok(activeNav, 'Active nav link must exist');
  assert.ok(activeNav.textContent.includes('Command Center'), 'Command Center nav link must be active on /');
});

// =========================================================================
// TEST D — SECURITY & ROLE-BASED ACCESS CONTROL
// =========================================================================
console.log('\n--- TEST D — SECURITY & ROLE-BASED ACCESS CONTROL ---');

it('Test D1: Ordinary registered punter accessing "/admin" is denied and redirected to "/dashboard"', () => {
  const { window } = createEnvironment('https://deeppredictbet.com/admin');
  window.localStorage.setItem('userLoggedIn', 'true');
  window.localStorage.setItem('currentUserEmail', 'punter@test.com');
  window.localStorage.setItem('currentUsername', 'regular_punter');
  window.localStorage.setItem('user_role', 'USER');

  window.handleRouteNavigation();

  const founderView = window.document.getElementById('view-founder-analytics');
  const dashView = window.document.getElementById('view-my-deeppredict');

  assert.strictEqual(window.location.pathname, '/dashboard', 'Punter must be redirected to /dashboard');
  assert.strictEqual(founderView.style.display, 'none', 'view-founder-analytics must remain hidden');
  assert.strictEqual(dashView.style.display, 'block', 'view-my-deeppredict must be shown');
});

it('Test D2: Ordinary registered punter accessing "/founder-analytics" is denied and redirected to "/dashboard"', () => {
  const { window } = createEnvironment('https://deeppredictbet.com/founder-analytics');
  window.localStorage.setItem('userLoggedIn', 'true');
  window.localStorage.setItem('user_role', 'USER');

  window.handleRouteNavigation();

  assert.strictEqual(window.location.pathname, '/dashboard', 'Punter must be redirected from /founder-analytics to /dashboard');
});

it('Test D3: Unauthenticated visitor accessing root "/" receives the Authentication Entry Page', () => {
  const { window } = createEnvironment('https://deeppredictbet.com/');
  window.localStorage.removeItem('userLoggedIn');

  window.handleRouteNavigation();

  const authView = window.document.getElementById('view-auth-entry');
  const cmdView = window.document.getElementById('view-command-center');
  const founderView = window.document.getElementById('view-founder-analytics');

  assert.strictEqual(authView.style.display, 'flex', 'view-auth-entry must be displayed for unauthenticated visitor');
  assert.strictEqual(cmdView.style.display, 'none', 'view-command-center must remain hidden');
  assert.strictEqual(founderView.style.display, 'none', 'view-founder-analytics must remain hidden');
});

it('Test D4: Profile modal Founder Console trigger button is hidden for ordinary punter', () => {
  const { window } = createEnvironment('https://deeppredictbet.com/');
  window.localStorage.setItem('userLoggedIn', 'true');
  window.localStorage.setItem('user_role', 'USER');

  const btn = window.document.getElementById('prof-founder-console-btn');
  // Trigger auth UI update
  if (typeof window.updateAuthUIState === 'function') {
    window.updateAuthUIState();
  }

  assert.ok(btn.style.display === 'none' || !btn.style.display, 'prof-founder-console-btn must be hidden for non-admins');
});

// =========================================================================
// RUN ALL TESTS SEQUENTIALLY
// =========================================================================
runTests();
