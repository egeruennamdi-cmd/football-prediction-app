/**
 * scripts/test_remove_internal_telemetry_screens.cjs
 * Comprehensive Security, Routing & Public UX Verification Suite:
 * 1. Confirms "Authenticating Server-Side & Aggregating Telemetry..." and "Querying Cloudflare KV edge ledger"
 *    are permanently removed from the codebase and never rendered to any user.
 * 2. Tests logged-out visitors across public, protected, and admin routes.
 * 3. Tests ordinary registered users (USER, PRO, VIP) including stale session/redirect tampering scenarios.
 * 4. Tests authorized administrators (ADMIN) across normal login, Command Center, and Founder BI Console.
 * 5. Tests server-side API authorization (/api/admin/metrics, /api/admin/export, /api/admin/converter-stats, /api/users).
 * 6. Tests Desktop, Tablet, and Mobile layouts.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { JSDOM, VirtualConsole } = require('jsdom');

console.log('🛡️ Starting Internal Telemetry & Admin Screen Removal Verification Suite...\n');

const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const authManagerJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'authManager.js'), 'utf8');
const authEntryJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'authEntry.js'), 'utf8');
const routerJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'router.js'), 'utf8');
const dashboardJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'dashboard.js'), 'utf8');
const appJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');

function createDomEnv(url = 'https://deeppredictbet.com/', viewportWidth = 1440) {
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
  window.innerWidth = viewportWidth;
  window.Element.prototype.scrollIntoView = () => {};
  window.scrollTo = () => {};
  window.alert = () => {};
  window.showToast = () => {};
  window.showAppNotification = () => {};

  window.fetch = async (reqUrl, opts = {}) => {
    const u = String(reqUrl);
    if (u === '/api/login') {
      const body = JSON.parse(opts.body || '{}');
      if (body.identifier === 'admin@deeppredictbet.com' || body.identifier === 'Egeruennamdi78') {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            success: true,
            sessionId: 'dp_sess_admin_verified_999',
            user: {
              id: 'usr_adm1',
              fullName: 'Alex Nnamdi (Admin)',
              email: 'admin@deeppredictbet.com',
              username: 'Egeruennamdi78',
              role: 'ADMIN'
            }
          })
        };
      }
      return {
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          sessionId: 'dp_sess_punter_123',
          user: {
            id: 'usr_punter_1',
            fullName: 'Regular Punter',
            email: 'punter@example.com',
            username: 'regular_punter',
            role: 'USER'
          }
        })
      };
    }
    if (u.includes('/api/admin/metrics')) {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          period: { id: '30d', label: '30D' },
          kpi: {
            totalUsers: { value: 25, label: 'TOTAL USERS' },
            newUsers: { value: 6, label: 'NEW USERS' },
            monthlyRevenue: { value: 185000, formatted: '₦185,000' }
          }
        })
      };
    }
    if (u.includes('/api/users')) {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          users: [
            { id: 'usr_adm1', email: 'admin@deeppredictbet.com', username: 'Egeruennamdi78', role: 'ADMIN', coinsBalance: 1500 },
            { id: 'usr_punter_1', email: 'punter@example.com', username: 'regular_punter', role: 'USER', coinsBalance: 500 }
          ]
        })
      };
    }
    return { ok: true, status: 200, json: async () => ({ success: true }) };
  };

  window.eval(authManagerJs);
  window.eval(authEntryJs);
  window.eval(routerJs);
  window.eval(dashboardJs);
  window.eval(appJs);

  return { dom, window };
}

let passed = 0;
let failed = 0;
const tests = [];

function it(name, fn) {
  tests.push({ name, fn });
}

// ============================================================================
// 1. STATIC CODEBASE AUDIT: NO INTERNAL TELEMETRY SCREENS
// ============================================================================
it('1.1 Codebase contains zero instances of "Authenticating Server-Side & Aggregating Telemetry..." or "Querying Cloudflare KV edge ledger"', () => {
  const filesToCheck = [
    'index.html',
    'js/dashboard.js',
    'public/js/dashboard.js',
    'js/router.js',
    'public/js/router.js',
    'js/app.js',
    'public/js/app.js',
    'js/ui.js',
    'public/js/ui.js'
  ];

  for (const rel of filesToCheck) {
    const content = fs.readFileSync(path.join(__dirname, '..', rel), 'utf8');
    assert.ok(!content.includes('Authenticating Server-Side & Aggregating Telemetry'), `${rel} must not contain "Authenticating Server-Side & Aggregating Telemetry"`);
    assert.ok(!content.includes('Querying Cloudflare KV edge ledger'), `${rel} must not contain "Querying Cloudflare KV edge ledger"`);
  }
});

// ============================================================================
// 2. LOGGED-OUT VISITOR TESTS
// ============================================================================
it('2.1 Logged-out visitor accessing "/" sees clean authentication entry page with zero telemetry or KV messages', () => {
  const { window } = createDomEnv('https://deeppredictbet.com/');
  window.handleRouteNavigation();

  const bodyText = window.document.body.innerHTML;
  assert.ok(!bodyText.includes('Authenticating Server-Side'), 'Must not contain internal authenticating message');
  assert.ok(!bodyText.includes('Querying Cloudflare KV'), 'Must not contain KV edge ledger message');

  const founderView = window.document.getElementById('view-founder-analytics');
  assert.strictEqual(founderView.style.display, 'none', 'Founder analytics view must be hidden');
  assert.strictEqual(founderView.innerHTML.trim(), '', 'Founder analytics view must be empty');
});

it('2.2 Logged-out visitor attempting to access "/admin" or "/founder-analytics" is redirected to "/" without saving admin redirect target', () => {
  const { window } = createDomEnv('https://deeppredictbet.com/admin');
  window.handleRouteNavigation();

  assert.strictEqual(window.location.pathname, '/', 'Logged-out visitor on /admin must be redirected to /');
  assert.strictEqual(window.sessionStorage.getItem('auth_redirect_target'), null, 'Must not store /admin in auth_redirect_target');

  const noticeEl = window.document.getElementById('auth-entry-notice');
  assert.strictEqual(noticeEl.style.display, 'none', 'Must not display admin redirect notice to visitor');
  const founderView = window.document.getElementById('view-founder-analytics');
  assert.strictEqual(founderView.style.display, 'none', 'Founder view must remain hidden');
});

it('2.3 Logged-out visitor accessing public pages (/contact, /about, /support) sees normal content immediately', () => {
  for (const pubRoute of ['/contact', '/about', '/support']) {
    const { window } = createDomEnv(`https://deeppredictbet.com${pubRoute}`);
    window.handleRouteNavigation();

    assert.strictEqual(window.location.pathname, pubRoute, `Public route ${pubRoute} must render directly`);
    const founderView = window.document.getElementById('view-founder-analytics');
    assert.strictEqual(founderView.style.display, 'none', `Founder view must be hidden on ${pubRoute}`);
  }
});

// ============================================================================
// 3. ORDINARY REGISTERED USER TESTS (USER / PRO / VIP)
// ============================================================================
it('3.1 Ordinary user logging in even with stale dp_founder_authenticated or /admin redirect target lands on /dashboard, never /admin', async () => {
  const { window } = createDomEnv('https://deeppredictbet.com/');
  // Simulate leftover flags from a prior session
  window.sessionStorage.setItem('dp_founder_authenticated', 'true');
  window.localStorage.setItem('dp_founder_authenticated', 'true');
  window.sessionStorage.setItem('auth_redirect_target', '/admin');

  window.handleRouteNavigation();

  window.document.getElementById('auth-entry-identifier').value = 'punter@example.com';
  window.document.getElementById('auth-entry-password').value = 'password123';

  await window.handleAuthEntryLogin({ preventDefault: () => {} });

  assert.strictEqual(window.location.pathname, '/dashboard', 'Ordinary user must land on /dashboard, never /admin');
  assert.strictEqual(window.sessionStorage.getItem('dp_founder_authenticated'), null, 'Stale sessionStorage dp_founder_authenticated must be wiped');
  assert.strictEqual(window.localStorage.getItem('dp_founder_authenticated'), null, 'Stale localStorage dp_founder_authenticated must be wiped');

  const founderView = window.document.getElementById('view-founder-analytics');
  const customerView = window.document.getElementById('view-my-deeppredict');
  assert.strictEqual(founderView.style.display, 'none', 'Founder view must be hidden');
  assert.strictEqual(customerView.style.display, 'block', 'Customer dashboard must be displayed');
});

it('3.2 Ordinary user attempting to navigate to /admin, /admin/analytics, /founder-analytics, /social, or /telegram-publisher is redirected to /dashboard', async () => {
  const restrictedRoutes = ['/admin', '/admin/analytics', '/founder-analytics', '/social', '/telegram-publisher'];
  for (const r of restrictedRoutes) {
    const { window } = createDomEnv(`https://deeppredictbet.com${r}`);
    window.localStorage.setItem('userLoggedIn', 'true');
    window.localStorage.setItem('currentUserEmail', 'punter@example.com');
    window.localStorage.setItem('currentUsername', 'regular_punter');
    window.localStorage.setItem('user_role', 'USER');
    window.sessionStorage.setItem('dp_founder_authenticated', 'true'); // Even with tampered sessionStorage

    window.handleRouteNavigation();
    await window.renderFounderDashboard();

    assert.strictEqual(window.location.pathname, '/dashboard', `Route ${r} must redirect ordinary user to /dashboard`);
    const founderView = window.document.getElementById('view-founder-analytics');
    assert.strictEqual(founderView.style.display, 'none', `Founder view must be hidden for ${r}`);
    assert.strictEqual(founderView.innerHTML.trim(), '', `Founder view HTML must be empty for ${r}`);
  }
});

it('3.3 Admin broadcast buttons (Send to Telegram Command Center) are hidden from ordinary users', () => {
  const { window } = createDomEnv('https://deeppredictbet.com/generator');
  window.localStorage.setItem('userLoggedIn', 'true');
  window.localStorage.setItem('currentUserEmail', 'punter@example.com');
  window.localStorage.setItem('currentUsername', 'regular_punter');
  window.localStorage.setItem('user_role', 'USER');

  window.updateAuthUIState();
  window.handleRouteNavigation();

  const genTgBtn = window.document.getElementById('generator-send-telegram-btn');
  const profFounderBtn = window.document.getElementById('prof-founder-console-btn');
  assert.strictEqual(genTgBtn.style.display, 'none', 'Generator Telegram button must be hidden for normal user');
  assert.strictEqual(profFounderBtn.style.display, 'none', 'Profile Founder Console button must be hidden for normal user');
});

// ============================================================================
// 4. AUTHORIZED ADMINISTRATOR TESTS
// ============================================================================
it('4.1 Administrator logging in at "/" lands on normal website (/dashboard) rather than being hijacked into /admin', async () => {
  const { window } = createDomEnv('https://deeppredictbet.com/');
  window.handleRouteNavigation();

  window.document.getElementById('auth-entry-identifier').value = 'admin@deeppredictbet.com';
  window.document.getElementById('auth-entry-password').value = 'Egeruennamdi78';

  await window.handleAuthEntryLogin({ preventDefault: () => {} });

  assert.strictEqual(window.location.pathname, '/dashboard', 'Admin normal login lands on /dashboard');
  const customerView = window.document.getElementById('view-my-deeppredict');
  assert.strictEqual(customerView.style.display, 'block', 'Customer dashboard is displayed immediately');
});

it('4.2 Administrator explicitly accessing "/admin" renders Founder BI Hub immediately without any blocking telemetry screen', async () => {
  const { window } = createDomEnv('https://deeppredictbet.com/admin');
  window.localStorage.setItem('userLoggedIn', 'true');
  window.localStorage.setItem('currentUserEmail', 'admin@deeppredictbet.com');
  window.localStorage.setItem('currentUsername', 'Egeruennamdi78');
  window.localStorage.setItem('user_role', 'ADMIN');

  window.handleRouteNavigation();
  const founderView = window.document.getElementById('view-founder-analytics');

  // Must render Founder BI Hub immediately BEFORE awaiting async network calls
  assert.strictEqual(founderView.style.display, 'block', 'Founder view must be displayed for admin');
  assert.ok(founderView.innerHTML.includes('DeepPredictBet Admin'), 'Admin header must be rendered immediately at 0ms');
  assert.ok(!founderView.innerHTML.includes('Authenticating Server-Side'), 'Must never show Authenticating Server-Side screen');
  assert.ok(!founderView.innerHTML.includes('Querying Cloudflare KV'), 'Must never show Querying Cloudflare KV screen');

  // After background fetch completes, live KPI data is populated
  await window.renderFounderDashboard();
  assert.ok(founderView.innerHTML.includes('DeepPredictBet Admin'), 'Admin header remains intact after background refresh');
  assert.ok(founderView.innerHTML.includes('TOTAL USERS'), 'KPI tiles remain intact');
});

// ============================================================================
// 5. SERVER-SIDE ENDPOINT AUTHORIZATION TESTS
// ============================================================================
it('5.1 Server-side /api/admin/metrics, /api/admin/export, /api/admin/converter-stats, and /api/users reject unauthenticated and spoofed requests with 403', async () => {
  const metricsMod = await import('../functions/api/admin/metrics.js');
  const exportMod = await import('../functions/api/admin/export.js');
  const convStatsMod = await import('../functions/api/admin/converter-stats.js');
  const usersMod = await import('../functions/api/users.js');

  const mockKv = {
    get: async (key) => {
      if (key === 'members_list') {
        return JSON.stringify([
          {
            id: 'usr_adm1',
            email: 'admin@deeppredictbet.com',
            username: 'Egeruennamdi78',
            role: 'ADMIN',
            sessionId: 'dp_sess_valid_admin_token'
          },
          {
            id: 'usr_punter_1',
            email: 'punter@example.com',
            username: 'regular_punter',
            role: 'USER',
            sessionId: 'dp_sess_valid_punter_token'
          }
        ]);
      }
      return null;
    }
  };

  // A. Unauthenticated request
  const unauthReq = new Request('https://deeppredictbet.com/api/admin/metrics');
  const unauthRes = await metricsMod.onRequestGet({ request: unauthReq, env: { USERS_KV: mockKv } });
  assert.strictEqual(unauthRes.status, 403, 'Unauthenticated /api/admin/metrics must return 403');

  // B. Spoofed email in Authorization header (must be rejected!)
  const spoofReq = new Request('https://deeppredictbet.com/api/admin/metrics', {
    headers: { 'Authorization': 'Bearer admin@deeppredictbet.com', 'X-User-Email': 'admin@deeppredictbet.com' }
  });
  const spoofRes = await metricsMod.onRequestGet({ request: spoofReq, env: { USERS_KV: mockKv } });
  assert.strictEqual(spoofRes.status, 403, 'Spoofed email header on /api/admin/metrics must return 403');

  const spoofConvRes = await convStatsMod.onRequestGet({ request: spoofReq, env: { USERS_KV: mockKv } });
  assert.strictEqual(spoofConvRes.status, 403, 'Spoofed email header on /api/admin/converter-stats must return 403');

  // C. Normal registered punter session token (must be rejected with 403!)
  const punterReq = new Request('https://deeppredictbet.com/api/admin/metrics', {
    headers: { 'Authorization': 'Bearer dp_sess_valid_punter_token' }
  });
  const punterRes = await metricsMod.onRequestGet({ request: punterReq, env: { USERS_KV: mockKv } });
  assert.strictEqual(punterRes.status, 403, 'Normal user session on /api/admin/metrics must return 403');

  const punterUsersReq = new Request('https://deeppredictbet.com/api/users', {
    headers: { 'Authorization': 'Bearer dp_sess_valid_punter_token' }
  });
  const punterUsersRes = await usersMod.onRequestGet({ request: punterUsersReq, env: { USERS_KV: mockKv } });
  assert.strictEqual(punterUsersRes.status, 403, 'Normal user session on /api/users roster must return 403');

  // D. Verified Admin session token (must succeed with 200!)
  const adminSessReq = new Request('https://deeppredictbet.com/api/admin/metrics', {
    headers: { 'Authorization': 'Bearer dp_sess_valid_admin_token' }
  });
  const adminSessRes = await metricsMod.onRequestGet({ request: adminSessReq, env: { USERS_KV: mockKv } });
  assert.strictEqual(adminSessRes.status, 200, 'Verified admin session token on /api/admin/metrics must return 200');

  const adminExportReq = new Request('https://deeppredictbet.com/api/admin/export', {
    headers: { 'Authorization': 'Bearer dp_sess_valid_admin_token' }
  });
  const adminExportRes = await exportMod.onRequestGet({ request: adminExportReq, env: { USERS_KV: mockKv } });
  assert.strictEqual(adminExportRes.status, 200, 'Verified admin session token on /api/admin/export must return 200');
  const csvBody = await adminExportRes.text();
  assert.ok(!csvBody.includes('c24f3ae03abd42788257bec2f7d3c065'), 'Export CSV must not leak raw KV namespace ID');
});

// ============================================================================
// 6. DESKTOP, TABLET & MOBILE VIEWPORT CHECKS
// ============================================================================
it('6.1 Desktop (1440px), Tablet (768px), and Mobile (375px) layouts render cleanly for public and user views', () => {
  for (const width of [1440, 768, 375]) {
    const { window } = createDomEnv('https://deeppredictbet.com/', width);
    window.localStorage.setItem('userLoggedIn', 'true');
    window.localStorage.setItem('currentUserEmail', 'punter@example.com');
    window.localStorage.setItem('currentUsername', 'regular_punter');
    window.localStorage.setItem('user_role', 'USER');

    window.handleRouteNavigation();
    const cmdView = window.document.getElementById('view-command-center');
    const founderView = window.document.getElementById('view-founder-analytics');
    assert.strictEqual(cmdView.style.display, 'block', `Command Center visible at ${width}px`);
    assert.strictEqual(founderView.style.display, 'none', `Founder view hidden at ${width}px`);

    window.navigateTo('/dashboard');
    const dashView = window.document.getElementById('view-my-deeppredict');
    assert.strictEqual(dashView.style.display, 'block', `Customer dashboard visible at ${width}px`);
    assert.ok(dashView.innerHTML.includes('MY DEEPPREDICT'), `Customer dashboard content rendered at ${width}px`);
    assert.ok(!dashView.innerHTML.includes('Founder BI'), `Founder BI links hidden from normal user at ${width}px`);
  }
});

async function run() {
  for (const t of tests) {
    try {
      await t.fn();
      console.log(`  ✅ PASS: ${t.name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${t.name}`);
      console.error(`     ${err.message}`);
      failed++;
    }
  }

  console.log('\n============================================================');
  console.log(`VERIFICATION RESULTS: ${passed} passed, ${failed} failed.`);
  console.log('============================================================\n');

  if (failed > 0) process.exit(1);
}

run();
