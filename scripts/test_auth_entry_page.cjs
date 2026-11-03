/**
 * scripts/test_auth_entry_page.cjs
 * Comprehensive test suite validating the Premium Cinematic Stadium Login Page (Design 1),
 * Entry-Point Routing, Authentication, Registration, Protected Routes, and Role-Based Redirection.
 */

const assert = require('assert');
const fs = require('fs');
const { JSDOM } = require('jsdom');

console.log('🧪 Starting DeepPredictBet Premium Cinematic Stadium Login Page Test Suite...\n');

let passCount = 0;
let failCount = 0;

function it(desc, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${desc}`);
    passCount++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${desc}`);
    console.error(`     Error: ${err.message}`);
    failCount++;
  }
}

// 1. Setup DOM environment
const indexHtml = fs.readFileSync('index.html', 'utf8');

function createFreshEnvironment(url = 'https://deeppredictbet.com/') {
  const dom = new JSDOM(indexHtml, {
    url: url,
    runScripts: 'dangerously',
    resources: 'usable'
  });

  const { window } = dom;

  global.window = window;
  global.document = window.document;
  global.navigator = window.navigator;
  global.localStorage = window.localStorage;
  global.sessionStorage = window.sessionStorage;

  // Stub scrollTo
  window.scrollTo = () => {};

  // Mock fetch
  window.fetch = async (url, opts) => {
    if (url === '/api/login') {
      const body = JSON.parse(opts.body || '{}');
      if (body.identifier === 'admin@deeppredictbet.com' && (body.password === 'Egeruennamdi78' || body.passwordHash === 'Egeruennamdi78')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            success: true,
            sessionId: 'sess_admin_test_123',
            user: {
              id: 'usr_adm1',
              fullName: 'Alex Nnamdi (Admin)',
              email: 'admin@deeppredictbet.com',
              username: 'Egeruennamdi78',
              role: 'ADMIN'
            }
          })
        };
      } else if (body.identifier === 'punter@test.com' && body.password === 'correctpass') {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            success: true,
            sessionId: 'sess_punter_test_456',
            user: {
              id: 'usr_punter_1',
              fullName: 'John Punter',
              email: 'punter@test.com',
              username: 'john_punter',
              role: 'USER'
            }
          })
        };
      } else if (body.password === 'wrongpass') {
        return {
          ok: false,
          status: 401,
          json: async () => ({ success: false, error: 'Incorrect password' })
        };
      } else {
        return {
          ok: false,
          status: 404,
          json: async () => ({ success: false, error: 'Account not found' })
        };
      }
    } else if (url === '/api/users' || url === '/api/register') {
      return {
        ok: true,
        status: 200,
        json: async () => ({ success: true })
      };
    } else if (url === '/api/reset-password') {
      return {
        ok: true,
        status: 200,
        json: async () => ({ success: true, emailSent: true, email: 'punter@test.com' })
      };
    }
    return { ok: true, status: 200, json: async () => ({}) };
  };

  // Load scripts into window
  const authManagerCode = fs.readFileSync('js/authManager.js', 'utf8');
  window.eval(authManagerCode);

  const authEntryCode = fs.readFileSync('js/authEntry.js', 'utf8');
  window.eval(authEntryCode);

  const routerCode = fs.readFileSync('js/router.js', 'utf8');
  window.eval(routerCode);

  const appCode = fs.readFileSync('js/app.js', 'utf8');
  window.eval(appCode);

  return { window, dom };
}

console.log('--- TEST GROUP 1: ENTRY POINT & ROUTE PROTECTION ---');

it('Test 1: Unauthenticated visitor accessing root "/" opens the authentication page first', () => {
  const { window } = createFreshEnvironment('https://deeppredictbet.com/');
  window.handleRouteNavigation();

  const authView = window.document.getElementById('view-auth-entry');
  const homeView = window.document.getElementById('view-command-center');

  assert.ok(authView, 'view-auth-entry must exist in DOM');
  assert.strictEqual(authView.style.display, 'flex', 'view-auth-entry must be displayed as flex');
  assert.ok(authView.classList.contains('active'), 'view-auth-entry must have active class');
  assert.strictEqual(homeView.style.display, 'none', 'view-command-center must be hidden for unauthenticated users');
  assert.ok(window.document.body.classList.contains('auth-view-active'), 'body must have auth-view-active class');
});

it('Test 2: Unauthenticated visitor accessing protected route (/predictions) is redirected to /login with target preserved', () => {
  const { window } = createFreshEnvironment('https://deeppredictbet.com/predictions');
  window.handleRouteNavigation();

  const authView = window.document.getElementById('view-auth-entry');
  const predictionsView = window.document.getElementById('view-predictions-hub');

  assert.strictEqual(authView.style.display, 'flex', 'view-auth-entry must be mounted');
  assert.strictEqual(predictionsView.style.display, 'none', 'view-predictions-hub must remain hidden');
  assert.strictEqual(window.sessionStorage.getItem('auth_redirect_target'), '/predictions', 'auth_redirect_target must preserve /predictions');

  const notice = window.document.getElementById('auth-entry-notice');
  assert.ok(notice.textContent.includes('PREDICTIONS'), 'Notice must prompt user to sign in for predictions');
  assert.strictEqual(notice.style.display, 'block');
});

it('Test 3: Unauthenticated visitor can access public legal routes (/privacy, /terms, /responsible-gambling)', () => {
  const { window } = createFreshEnvironment('https://deeppredictbet.com/privacy');
  window.handleRouteNavigation();

  assert.ok(!window.document.body.classList.contains('auth-view-active'), 'Public legal route does not force auth-view-active');
});

console.log('\n--- TEST GROUP 2: AUTHENTICATED USER ROUTING & ROLE DISPATCH ---');

it('Test 4: Authenticated Administrator accessing root "/" opens the restored Command Center (view-command-center)', () => {
  const { window } = createFreshEnvironment('https://deeppredictbet.com/');
  window.localStorage.setItem('userLoggedIn', 'true');
  window.localStorage.setItem('currentUserEmail', 'admin@deeppredictbet.com');
  window.localStorage.setItem('currentUsername', 'Egeruennamdi78');
  window.localStorage.setItem('user_role', 'ADMIN');

  window.handleRouteNavigation();

  assert.strictEqual(window.location.pathname, '/', 'Authenticated admin accessing / stays on Command Center');
  assert.ok(!window.document.body.classList.contains('auth-view-active'), 'auth-view-active must be removed for authenticated user');
  const commandCenterView = window.document.getElementById('view-command-center');
  const founderView = window.document.getElementById('view-founder-analytics');
  assert.strictEqual(commandCenterView.style.display, 'block', 'view-command-center must be active');
  assert.strictEqual(founderView.style.display, 'none', 'view-founder-analytics must remain hidden on Command Center');
});

it('Test 5: Authenticated Punter accessing root "/" opens the restored Command Center (view-command-center)', () => {
  const { window } = createFreshEnvironment('https://deeppredictbet.com/');
  window.localStorage.setItem('userLoggedIn', 'true');
  window.localStorage.setItem('currentUserEmail', 'punter@test.com');
  window.localStorage.setItem('currentUsername', 'john_punter');
  window.localStorage.setItem('user_role', 'USER');

  window.handleRouteNavigation();

  assert.strictEqual(window.location.pathname, '/', 'Authenticated punter accessing / stays on Command Center');
  assert.ok(!window.document.body.classList.contains('auth-view-active'));
  const commandCenterView = window.document.getElementById('view-command-center');
  const dashView = window.document.getElementById('view-my-deeppredict');
  assert.strictEqual(commandCenterView.style.display, 'block', 'view-command-center must be active');
  assert.strictEqual(dashView.style.display, 'none', 'view-my-deeppredict must remain hidden on Command Center');
});

it('Test 6: Authenticated user visiting /login with preserved redirect target is returned to their requested destination', () => {
  const { window } = createFreshEnvironment('https://deeppredictbet.com/login');
  window.localStorage.setItem('userLoggedIn', 'true');
  window.localStorage.setItem('currentUserEmail', 'punter@test.com');
  window.localStorage.setItem('currentUsername', 'john_punter');
  window.localStorage.setItem('user_role', 'USER');
  window.sessionStorage.setItem('auth_redirect_target', '/bet-doctor');

  window.handleRouteNavigation();

  assert.strictEqual(window.location.pathname, '/bet-doctor', 'User must land on preserved /bet-doctor');
  assert.strictEqual(window.sessionStorage.getItem('auth_redirect_target'), null, 'auth_redirect_target must be consumed');
});

console.log('\n--- TEST GROUP 3: AUTHENTICATION, REGISTRATION & PASSWORD RECOVERY ---');

it('Test 7: switchAuthEntryTab toggles between login, signup, and forgot password modes', () => {
  const { window } = createFreshEnvironment('https://deeppredictbet.com/');
  window.handleRouteNavigation();

  // Test switch to signup
  window.switchAuthEntryTab('signup');
  assert.ok(window.document.getElementById('auth-mode-signup').classList.contains('active'), 'Signup mode should be active');
  assert.ok(!window.document.getElementById('auth-mode-login').classList.contains('active'), 'Login mode should not be active');
  assert.ok(window.document.getElementById('auth-tab-signup').classList.contains('active'), 'Signup tab should be active');

  // Test switch to forgot password
  window.switchAuthEntryTab('forgot');
  assert.ok(window.document.getElementById('auth-mode-forgot').classList.contains('active'), 'Forgot mode should be active');

  // Test switch back to login
  window.switchAuthEntryTab('login');
  assert.ok(window.document.getElementById('auth-mode-login').classList.contains('active'), 'Login mode should be active');
  assert.ok(window.document.getElementById('auth-tab-login').classList.contains('active'), 'Login tab should be active');
});

it('Test 8: Password visibility toggle changes input type between password and text', () => {
  const { window } = createFreshEnvironment('https://deeppredictbet.com/');
  const passInput = window.document.getElementById('auth-entry-password');
  const toggleBtn = window.document.querySelector('#auth-mode-login .auth-password-toggle');

  assert.strictEqual(passInput.type, 'password');
  window.toggleAuthPasswordVisibility('auth-entry-password', toggleBtn);
  assert.strictEqual(passInput.type, 'text', 'Input type should toggle to text');
  window.toggleAuthPasswordVisibility('auth-entry-password', toggleBtn);
  assert.strictEqual(passInput.type, 'password', 'Input type should toggle back to password');
});

it('Test 9: Successful login sets session and redirects to authorized dashboard', async () => {
  const { window } = createFreshEnvironment('https://deeppredictbet.com/');
  window.handleRouteNavigation();

  const idInput = window.document.getElementById('auth-entry-identifier');
  const passInput = window.document.getElementById('auth-entry-password');
  idInput.value = 'punter@test.com';
  passInput.value = 'correctpass';

  await window.handleAuthEntryLogin({ preventDefault: () => {} });

  assert.strictEqual(window.localStorage.getItem('userLoggedIn'), 'true', 'userLoggedIn must be true');
  assert.strictEqual(window.localStorage.getItem('currentUsername'), 'john_punter');
  assert.strictEqual(window.localStorage.getItem('currentUserEmail'), 'punter@test.com');
  assert.strictEqual(window.location.pathname, '/dashboard', 'Should navigate to /dashboard');
});

it('Test 10: Successful signup registers member and sets session', async () => {
  const { window } = createFreshEnvironment('https://deeppredictbet.com/');
  window.handleRouteNavigation();

  window.document.getElementById('auth-signup-fullname').value = 'New Bettor';
  window.document.getElementById('auth-signup-email').value = 'newbettor@example.com';
  window.document.getElementById('auth-signup-username').value = 'new_bettor';
  window.document.getElementById('auth-signup-password').value = 'secret123';
  window.document.getElementById('auth-signup-terms').checked = true;

  await window.handleAuthEntrySignup({ preventDefault: () => {} });

  assert.strictEqual(window.localStorage.getItem('userLoggedIn'), 'true', 'userLoggedIn must be true after signup');
  assert.strictEqual(window.localStorage.getItem('currentUsername'), 'new_bettor');
  assert.strictEqual(window.localStorage.getItem('currentUserEmail'), 'newbettor@example.com');
});

it('Test 11: logoutUser clears session and immediately transitions to / authentication page', () => {
  const { window } = createFreshEnvironment('https://deeppredictbet.com/dashboard');
  window.localStorage.setItem('userLoggedIn', 'true');
  window.localStorage.setItem('currentUsername', 'john_punter');
  window.localStorage.setItem('currentUserEmail', 'punter@test.com');

  window.logoutUser({ preventDefault: () => {} });

  assert.strictEqual(window.localStorage.getItem('userLoggedIn'), null, 'userLoggedIn must be cleared');
  assert.strictEqual(window.location.pathname, '/', 'Must navigate to /');
  assert.ok(window.document.body.classList.contains('auth-view-active'), 'auth-view-active must be added to body');
  assert.strictEqual(window.document.getElementById('view-auth-entry').style.display, 'flex');
});

console.log('\n--- TEST GROUP 4: VISUAL SPECIFICATION & DESIGN 1 FIDELITY ---');

it('Test 12: Top branding displays authentic DeepPredictBet logo and AI-POWERED FOOTBALL PREDICTIONS tagline', () => {
  const { window } = createFreshEnvironment('https://deeppredictbet.com/');
  const header = window.document.querySelector('.auth-cinematic-header');
  const logo = header.querySelector('.auth-brand-logo-img');
  const tagline = header.querySelector('.auth-brand-tagline');

  assert.ok(logo.src.includes('logo-3d.png'), 'Must display authentic logo-3d.png');
  assert.strictEqual(tagline.textContent.trim(), 'AI-POWERED FOOTBALL PREDICTIONS');
});

it('Test 13: Four feature cards exist with correct titles and icons', () => {
  const { window } = createFreshEnvironment('https://deeppredictbet.com/');
  const cards = window.document.querySelectorAll('.auth-feature-card');
  assert.strictEqual(cards.length, 4, 'Must have exactly 4 feature cards');

  const titles = Array.from(cards).map(c => c.querySelector('.auth-feature-title').textContent.trim());
  assert.deepStrictEqual(titles, ['AI Predictions', 'Live Matches', 'League Standings', 'Audited Results']);
});

it('Test 14: Trust strip displays accurate predictions, real-time updates, and trusted results', () => {
  const { window } = createFreshEnvironment('https://deeppredictbet.com/');
  const strip = window.document.querySelector('.auth-trust-strip');
  const text = strip.textContent;

  assert.ok(text.includes('Accurate Predictions'));
  assert.ok(text.includes('Real-Time Updates'));
  assert.ok(text.includes('Trusted Results'));
});

it('Test 15: 18+ circular badge is present and positioned bottom-right with responsible gambling link', () => {
  const { window } = createFreshEnvironment('https://deeppredictbet.com/');
  const badge = window.document.querySelector('.auth-18plus-badge');

  assert.ok(badge, '18+ badge must exist');
  assert.strictEqual(badge.textContent.trim(), '18+');
  assert.strictEqual(badge.getAttribute('href'), '/responsible-gambling');
});

it('Test 16: CSS file authEntry.css is linked in index.html and exists on disk', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  assert.ok(html.includes('authEntry.css'), 'authEntry.css must be linked in index.html');
  assert.ok(fs.existsSync('css/authEntry.css'), 'css/authEntry.css must exist');
  assert.ok(fs.existsSync('public/css/authEntry.css'), 'public/css/authEntry.css must exist');
});

console.log('\n==================================================');
console.log(`AUTH ENTRY TEST RESULTS: ${passCount} passed, ${failCount} failed.`);
console.log('==================================================\n');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
