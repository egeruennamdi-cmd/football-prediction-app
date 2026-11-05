/**
 * DeepPredictBet — Comprehensive Test Suite for Authentication-Aware Header
 * Verifies all 10 Acceptance Tests from Section 12 of the Specification:
 * - TEST 1: First Website Visit (Logged-out state empty)
 * - TEST 2: Successful Login (Dynamic identity & Logout button, NO balance/coins)
 * - TEST 3: Username Fallback (Hierarchy: Full Name -> Username -> Account ID)
 * - TEST 4: Logout (Session revocation, immediate header wipe, redirect to /)
 * - TEST 5: Browser Refresh & Session Persistence
 * - TEST 6: Direct Access to Protected Routes (Access denied, redirected to login)
 * - TEST 7: Cross-Tab Logout Synchronization (storage & broadcast events)
 * - TEST 8: Role-Based Access Control (Admin vs ordinary punter)
 * - TEST 9: Mobile Responsiveness & Layout
 * - TEST 10: Existing Authentication & Platform Regression
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`  ❌ FAILED: ${message}`);
    throw new Error(message);
  }
  passedTests++;
  console.log(`  ✅ PASSED: ${message}`);
}

async function runTestSuite() {
  console.log('===============================================================');
  console.log('🚀 DEEPPREDICTBET: AUTHENTICATION-AWARE HEADER VERIFICATION');
  console.log('===============================================================\n');

  const htmlContent = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf-8');
  const appJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf-8');
  const authEntryJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'authEntry.js'), 'utf-8');
  const authManagerJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'authManager.js'), 'utf-8');
  const routerJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'router.js'), 'utf-8');
  const cssContent = fs.readFileSync(path.join(__dirname, '..', 'css', 'main.css'), 'utf-8');

  // --- HTML & CSS STATIC INTEGRITY CHECKS ---
  console.log('--- STATIC MARKUP & CSS AUDIT ---');
  assert(htmlContent.includes('id="header-account-area"'), 'index.html contains #header-account-area element');
  assert(!htmlContent.includes('top-header-coins-pill'), 'index.html top-right header does not contain top-header-coins-pill');
  assert(cssContent.includes('.header-account-area'), 'css/main.css defines .header-account-area styles');
  assert(cssContent.includes('.header-user-identity'), 'css/main.css defines .header-user-identity styles');
  assert(cssContent.includes('.header-logout-btn'), 'css/main.css defines .header-logout-btn styles');
  assert(cssContent.includes('display: none !important') && cssContent.includes('.top-header-coins-pill'), 'css/main.css strictly suppresses coins/balance pills in header');

  // Initialize JSDOM Environment
  const dom = new JSDOM(htmlContent, {
    url: 'https://deeppredictbet.com/',
    runScripts: 'outside-only'
  });

  const { window } = dom;
  const { document } = window;

  // Mock BroadcastChannel if missing in JSDOM
  class MockBroadcastChannel {
    constructor(name) { this.name = name; this.onmessage = null; }
    postMessage(data) { if (MockBroadcastChannel.instances[this.name]) { MockBroadcastChannel.instances[this.name].forEach(inst => { if (inst !== this && inst.onmessage) inst.onmessage({ data }); }); } }
    close() {}
  }
  MockBroadcastChannel.instances = {};
  window.BroadcastChannel = MockBroadcastChannel;

  // Mock global storage
  const storage = {};
  const mockLocalStorage = {
    getItem: (k) => storage[k] || null,
    setItem: (k, v) => { storage[k] = String(v); },
    removeItem: (k) => { delete storage[k]; },
    clear: () => { Object.keys(storage).forEach(k => delete storage[k]); }
  };
  Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });
  Object.defineProperty(window, 'sessionStorage', { value: mockLocalStorage });

  const uiJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'ui.js'), 'utf-8');
  // Load UI Layer
  window.eval(uiJs);
  // Load RBAC Auth Manager
  window.eval(authManagerJs);
  // Load App & Auth Logic
  window.eval(appJs);

  // =========================================================================
  // TEST 1 — FIRST WEBSITE VISIT (LOGGED-OUT STATE COMPLETELY EMPTY)
  // =========================================================================
  console.log('\n--- TEST 1: FIRST WEBSITE VISIT (LOGGED OUT) ---');
  mockLocalStorage.clear();
  window.updateAuthUIState();

  const headerAccountArea = document.getElementById('header-account-area');
  assert(headerAccountArea !== null, 'Header account area element exists in DOM');
  assert(headerAccountArea.style.display === 'none', 'Header account area has style.display === "none" when logged out');
  assert(headerAccountArea.innerHTML.trim() === '', 'Header account area innerHTML is completely empty when logged out');
  assert(!headerAccountArea.textContent.includes('Login'), 'Header account area contains NO Login button or text');
  assert(!headerAccountArea.textContent.includes('Log out'), 'Header account area contains NO Logout button');
  assert(!headerAccountArea.textContent.includes('500') && !headerAccountArea.textContent.includes('🪙'), 'Header account area contains NO coins or monetary balance');
  assert(document.getElementById('nav-user-label') === null || document.getElementById('nav-auth-container').style.display === 'none', 'Legacy login button container is null or hidden');

  // =========================================================================
  // TEST 2 — SUCCESSFUL LOGIN (IDENTITY & LOGOUT DISPLAYED, NO BALANCE)
  // =========================================================================
  console.log('\n--- TEST 2: SUCCESSFUL LOGIN ---');
  mockLocalStorage.setItem('userLoggedIn', 'true');
  mockLocalStorage.setItem('currentUserFullName', 'Nnamdi Egerue');
  mockLocalStorage.setItem('currentUsername', 'egeruennamdi78');
  mockLocalStorage.setItem('currentUserEmail', 'egeruennamdi@gmail.com');
  mockLocalStorage.setItem('user_role', 'ADMIN');
  mockLocalStorage.setItem('dp_session_id', 'dp_sess_test_12345');
  mockLocalStorage.setItem('dp_session_expires_at', String(Date.now() + 3600000));

  window.updateAuthUIState();

  assert(headerAccountArea.style.display === 'flex', 'Header account area has style.display === "flex" when logged in');
  const userIdentityEl = document.getElementById('header-user-identity');
  assert(userIdentityEl !== null, '#header-user-identity is rendered in the header');
  assert(userIdentityEl.textContent.trim() === 'Nnamdi Egerue', 'Displays actual authenticated full name: "Nnamdi Egerue"');

  const logoutBtn = document.getElementById('header-logout-btn');
  assert(logoutBtn !== null, '#header-logout-btn is rendered beside user identity');
  assert(logoutBtn.textContent.trim() === 'Log out', 'Logout button text is "Log out"');
  assert(typeof logoutBtn.onclick === 'function' || logoutBtn.getAttribute('onclick').includes('logoutUser'), 'Logout button is wired to logoutUser()');

  // Strict display restriction: verify NO monetary figures anywhere in header-account-area
  const rawAccountHtml = headerAccountArea.innerHTML.toLowerCase();
  assert(!rawAccountHtml.includes('coin'), 'Header account area contains NO coins');
  assert(!rawAccountHtml.includes('balance'), 'Header account area contains NO balance label');
  assert(!rawAccountHtml.includes('wallet'), 'Header account area contains NO wallet');
  assert(!rawAccountHtml.includes('$') && !rawAccountHtml.includes('€') && !rawAccountHtml.includes('£'), 'Header account area contains NO currency symbols');

  // =========================================================================
  // TEST 3 — USERNAME FALLBACK HIERARCHY
  // =========================================================================
  console.log('\n--- TEST 3: USERNAME FALLBACK HIERARCHY ---');
  // Scenario A: Full name is missing, username is present
  mockLocalStorage.setItem('currentUserFullName', '');
  mockLocalStorage.setItem('currentUsername', 'speedy_punter_42');
  window.updateAuthUIState();
  const identityFallback1 = document.getElementById('header-user-identity');
  assert(identityFallback1.textContent.trim() === 'speedy_punter_42', 'Falls back to username "speedy_punter_42" when full name is empty');

  // Scenario B: Full name and username are missing, email identifier is present
  mockLocalStorage.setItem('currentUserFullName', '');
  mockLocalStorage.setItem('currentUsername', '');
  mockLocalStorage.setItem('currentUserEmail', 'chelseafan99@deeppredictbet.com');
  window.updateAuthUIState();
  const identityFallback2 = document.getElementById('header-user-identity');
  assert(identityFallback2.textContent.trim() === 'chelseafan99', 'Falls back to email prefix "chelseafan99" when name and username are empty');
  assert(!identityFallback2.textContent.includes('undefined') && !identityFallback2.textContent.includes('null'), 'No undefined or null displayed');

  // =========================================================================
  // TEST 4 — LOGOUT OPERATION (SESSION REVOCATION & IMMEDIATE HEADER WIPE)
  // =========================================================================
  console.log('\n--- TEST 4: LOGOUT OPERATION ---');
  let navigatedTo = null;
  window.navigateTo = (target) => { navigatedTo = target; };

  // Trigger logout
  window.logoutUser();

  assert(mockLocalStorage.getItem('userLoggedIn') === null, 'localStorage userLoggedIn is cleared on logout');
  assert(mockLocalStorage.getItem('currentUsername') === null, 'localStorage currentUsername is cleared on logout');
  assert(mockLocalStorage.getItem('currentUserFullName') === null, 'localStorage currentUserFullName is cleared on logout');
  assert(mockLocalStorage.getItem('currentUserEmail') === null, 'localStorage currentUserEmail is cleared on logout');
  assert(mockLocalStorage.getItem('user_role') === null, 'localStorage user_role is cleared on logout');
  assert(mockLocalStorage.getItem('dp_session_id') === null, 'localStorage dp_session_id is cleared on logout');
  assert(headerAccountArea.style.display === 'none', 'Header account area is immediately hidden on logout (display: none)');
  assert(headerAccountArea.innerHTML.trim() === '', 'Header account area is completely empty on logout');
  assert(navigatedTo === '/', 'Logout automatically redirects to root login page ("/")');

  // =========================================================================
  // TEST 5 — BROWSER REFRESH & SESSION PERSISTENCE
  // =========================================================================
  console.log('\n--- TEST 5: BROWSER REFRESH & SESSION PERSISTENCE ---');
  // Scenario A: Active valid session on refresh
  mockLocalStorage.setItem('userLoggedIn', 'true');
  mockLocalStorage.setItem('currentUserFullName', 'Alex Nnamdi (Admin)');
  mockLocalStorage.setItem('currentUsername', 'Egeruennamdi78');
  mockLocalStorage.setItem('dp_session_expires_at', String(Date.now() + 1000000));
  window.updateAuthUIState();
  assert(document.getElementById('header-user-identity').textContent.trim() === 'Alex Nnamdi (Admin)', 'Valid session restored correctly on refresh');

  // Scenario B: Expired session triggers automatic purge
  mockLocalStorage.setItem('dp_session_expires_at', String(Date.now() - 5000)); // expired 5 seconds ago
  window.verifyActiveUserSession();
  assert(mockLocalStorage.getItem('userLoggedIn') === null, 'Expired session is automatically purged by verifyActiveUserSession()');
  assert(headerAccountArea.style.display === 'none', 'Header account area remains empty after expired session');

  // =========================================================================
  // TEST 6 — DIRECT ACCESS TO PROTECTED ROUTES
  // =========================================================================
  console.log('\n--- TEST 6: DIRECT ACCESS TO PROTECTED ROUTES ---');
  mockLocalStorage.clear(); // Ensure logged out

  // Load router in test window
  window.eval(routerJs);

  // Simulate unauthenticated visitor accessing /dashboard
  let routerRedirect = null;
  window.history.replaceState(null, '', '/dashboard');
  window.handleRouteNavigation();

  assert(mockLocalStorage.getItem('auth_redirect_target') === '/dashboard', 'Original intended destination "/dashboard" was safely preserved');
  assert(document.body.classList.contains('auth-view-active') || window.location.pathname === '/login' || window.location.pathname === '/', 'Visitor is redirected to login page');

  // =========================================================================
  // TEST 7 — CROSS-TAB SYNCHRONIZATION
  // =========================================================================
  console.log('\n--- TEST 7: CROSS-TAB SYNCHRONIZATION ---');
  // Simulate tab being logged in first
  mockLocalStorage.setItem('userLoggedIn', 'true');
  mockLocalStorage.setItem('currentUserFullName', 'CrossTab User');
  window.updateAuthUIState();
  assert(headerAccountArea.style.display === 'flex', 'Tab is initially logged in');

  // Simulate logout happening in another tab via storage event
  mockLocalStorage.removeItem('userLoggedIn');
  const storageEvent = new window.Event('storage');
  storageEvent.key = 'dp_auth_sync';
  storageEvent.newValue = 'logout_' + Date.now();
  window.dispatchEvent(storageEvent);

  assert(headerAccountArea.style.display === 'none', 'Header immediately responds to cross-tab logout and hides');
  assert(headerAccountArea.innerHTML.trim() === '', 'Header account area is wiped clean by cross-tab event');

  // =========================================================================
  // TEST 8 — ROLE-BASED ACCESS CONTROL (ADMIN VS ORDINARY PUNTER)
  // =========================================================================
  console.log('\n--- TEST 8: ROLE-BASED ACCESS CONTROL ---');
  // Punter
  mockLocalStorage.setItem('userLoggedIn', 'true');
  mockLocalStorage.setItem('currentUserEmail', 'punter@gmail.com');
  mockLocalStorage.setItem('currentUsername', 'punter123');
  mockLocalStorage.setItem('user_role', 'USER');
  assert(window.isAdmin() === false, 'Ordinary punter is NOT an administrator');
  assert(window.hasPermission('ADMIN_ANALYTICS') === false, 'Ordinary punter has NO admin analytics permission');

  // Admin
  mockLocalStorage.setItem('currentUserEmail', 'admin@deeppredictbet.com');
  mockLocalStorage.setItem('currentUsername', 'Egeruennamdi78');
  mockLocalStorage.setItem('user_role', 'ADMIN');
  assert(window.isAdmin() === true, 'Authoritative admin credentials recognized as administrator');
  assert(window.hasPermission('ADMIN_ANALYTICS') === true, 'Admin has full ADMIN_ANALYTICS permission');

  // =========================================================================
  // TEST 9 — MOBILE RESPONSIVENESS
  // =========================================================================
  console.log('\n--- TEST 9: MOBILE RESPONSIVENESS ---');
  // Test mobile drawer username display sync
  window.updateAuthUIState();
  const drawerUser = document.getElementById('mobile-drawer-username');
  if (drawerUser) {
    const txt = drawerUser.textContent || drawerUser.innerText || '';
    assert(txt.includes('Alex Nnamdi') || txt.includes('Egeruennamdi78') || txt.includes('User'), 'Mobile drawer username updates to authenticated user: ' + txt);
  }
  assert(cssContent.includes('@media (max-width: 640px)'), 'Mobile CSS media queries exist for header account area');
  assert(cssContent.includes('@media (max-width: 380px)'), 'Small smartphone CSS media queries exist for header account area');

  // =========================================================================
  // TEST 10 — EXISTING AUTHENTICATION & PLATFORM REGRESSION
  // =========================================================================
  console.log('\n--- TEST 10: PLATFORM FUNCTIONALITY PRESERVATION ---');
  assert(typeof window.executeCommandScoutPrompt === 'function', 'Ask AI Scout function executeCommandScoutPrompt remains intact');
  assert(typeof window.handleCommandScoutSubmit === 'function', 'Ask AI Scout handler handleCommandScoutSubmit remains intact');
  assert(typeof window.openProfileModal === 'function', 'User Account Profile modal remains intact');
  assert(typeof window.toggleMobileDrawer === 'function', 'Mobile navigation drawer remains intact');

  console.log('\n===============================================================');
  console.log(`🎉 ALL ${passedTests}/${totalTests} TESTS PASSED PERFECTLY!`);
  console.log('===============================================================\n');
  process.exit(0);
}

runTestSuite().catch(err => {
  console.error('\n❌ Test suite failed:', err);
  process.exit(1);
});
