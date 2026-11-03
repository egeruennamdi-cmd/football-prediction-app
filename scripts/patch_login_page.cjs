/**
 * scripts/patch_login_page.cjs
 * Integrates the Premium Cinematic Stadium Login Page (Design 1)
 * into index.html, public/index.html, router.js, public/js/router.js, app.js, and public/js/app.js.
 */

const fs = require('fs');
const path = require('path');

const AUTH_VIEW_HTML = `
  <!-- --- PAGE VIEW: PREMIUM CINEMATIC STADIUM AUTHENTICATION (DESIGN 1) --- -->
  <main id="view-auth-entry" class="page-view auth-cinematic-page" style="display: none;">
    <!-- Top Branding Section -->
    <header class="auth-cinematic-header">
      <div class="auth-brand-lockup">
        <a href="/" onclick="return false;" style="text-decoration: none;">
          <img src="/assets/logo-3d.png?v=20261020_brand_logo_v4" alt="DeepPredictBet" class="auth-brand-logo-img">
        </a>
        <div class="auth-brand-tagline-wrap">
          <span class="auth-tagline-line"></span>
          <span class="auth-brand-tagline">AI-POWERED FOOTBALL PREDICTIONS</span>
          <span class="auth-tagline-line"></span>
        </div>
      </div>
    </header>

    <!-- Main 2-Column Cinematic Stage -->
    <div class="auth-cinematic-stage">
      
      <!-- Left Column: Hero Footballer & Capability Cards -->
      <section class="auth-stage-left">
        <!-- Spacer keeping space open for the background footballer -->
        <div class="auth-footballer-spacer"></div>

        <!-- Four Feature Cards -->
        <div class="auth-features-grid">
          <!-- Card 1: AI Predictions -->
          <div class="auth-feature-card" onclick="handleFeatureCardClick('predictions')" title="AI Match Probabilities & Predictions">
            <div class="auth-feature-icon-wrap icon-green">
              <svg class="auth-feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
                <path d="M4 8l5-5 5 5 6-6"></path>
              </svg>
            </div>
            <span class="auth-feature-title">AI Predictions</span>
          </div>

          <!-- Card 2: Live Matches -->
          <div class="auth-feature-card" onclick="handleFeatureCardClick('matches')" title="Live Real-Time In-Play Tracking">
            <div class="auth-feature-icon-wrap icon-blue">
              <svg class="auth-feature-icon" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2.2"></circle>
                <polygon points="10 8 16 12 10 16 10 8"></polygon>
              </svg>
            </div>
            <span class="auth-feature-title">Live Matches</span>
          </div>

          <!-- Card 3: League Standings -->
          <div class="auth-feature-card" onclick="handleFeatureCardClick('standings')" title="Dynamic Live League Standings">
            <div class="auth-feature-icon-wrap icon-gold">
              <svg class="auth-feature-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 9V4h12v5c0 3.31-2.69 6-6 6s-6-2.69-6-6z"></path>
                <path d="M19 6h2c.55 0 1 .45 1 1v1c0 2.21-1.79 4-4 4v-2c1.1 0 2-.9 2-2V7c0-.55-.45-1-1-1h-1v-1z" opacity="0.85"></path>
                <path d="M5 6H3c-.55 0-1 .45-1 1v1c0 2.21 1.79 4 4 4v-2c-1.1 0-2-.9-2-2V7c0-.55.45-1 1-1h1v-1z" opacity="0.85"></path>
                <path d="M10 15h4v3h-4z"></path>
                <path d="M7 21h10v-3H7v3z"></path>
              </svg>
            </div>
            <span class="auth-feature-title">League Standings</span>
          </div>

          <!-- Card 4: Audited Results -->
          <div class="auth-feature-card" onclick="handleFeatureCardClick('results')" title="Audited Match Ledger & Transparency">
            <div class="auth-feature-icon-wrap icon-cyan">
              <svg class="auth-feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <polyline points="9 12 11 14 15 10"></polyline>
              </svg>
            </div>
            <span class="auth-feature-title">Audited Results</span>
          </div>
        </div>

        <!-- Trust and Product Information Strip -->
        <div class="auth-trust-strip">
          <div class="auth-trust-item">
            <span class="auth-trust-check">✓</span>
            <span class="auth-trust-label">Accurate Predictions</span>
          </div>
          <span class="auth-trust-divider">|</span>
          <div class="auth-trust-item">
            <span class="auth-trust-check">✓</span>
            <span class="auth-trust-label">Real-Time Updates</span>
          </div>
          <span class="auth-trust-divider">|</span>
          <div class="auth-trust-item">
            <span class="auth-trust-check">✓</span>
            <span class="auth-trust-label">Trusted Results</span>
          </div>
        </div>
      </section>

      <!-- Right Column: Premium Glassmorphism Login Panel -->
      <section class="auth-stage-right">
        <div class="auth-glass-panel" id="auth-main-panel">
          
          <!-- Tab Bar: Login / Create Account -->
          <div class="auth-tab-bar" role="tablist">
            <button type="button" class="auth-tab-btn active" id="auth-tab-login" onclick="switchAuthEntryTab('login')" role="tab" aria-selected="true">
              <svg class="auth-tab-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
              </svg>
              <span>Login</span>
            </button>
            <button type="button" class="auth-tab-btn" id="auth-tab-signup" onclick="switchAuthEntryTab('signup')" role="tab" aria-selected="false">
              <svg class="auth-tab-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
              </svg>
              <span>Create Account</span>
            </button>
          </div>

          <!-- Protected Route Interception Notice Banner -->
          <div id="auth-entry-notice" class="auth-entry-notice" style="display: none;"></div>

          <!-- --- FORM 1: LOGIN MODE --- -->
          <div id="auth-mode-login" class="auth-mode-container active">
            <div class="auth-form-header">
              <h2 class="auth-form-title">Welcome Back</h2>
              <p class="auth-form-subtitle">Log in to your DeepPredictBet account</p>
            </div>

            <form id="auth-login-form" onsubmit="return handleAuthEntryLogin(event);">
              <!-- Identifier -->
              <div class="auth-input-group">
                <label for="auth-entry-identifier" class="sr-only">Email address or Username</label>
                <div class="auth-input-wrapper">
                  <span class="auth-input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </span>
                  <input type="text" id="auth-entry-identifier" class="auth-text-input" placeholder="Email address or Username" autocomplete="username" required>
                </div>
              </div>

              <!-- Password -->
              <div class="auth-input-group">
                <label for="auth-entry-password" class="sr-only">Password</label>
                <div class="auth-input-wrapper">
                  <span class="auth-input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </span>
                  <input type="password" id="auth-entry-password" class="auth-text-input" placeholder="Password" autocomplete="current-password" required>
                  <button type="button" class="auth-password-toggle" onclick="toggleAuthPasswordVisibility('auth-entry-password', this)" title="Show or hide password" aria-label="Toggle password visibility">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Utility Row -->
              <div class="auth-utility-row">
                <label class="auth-remember-label">
                  <input type="checkbox" id="auth-entry-remember" class="auth-checkbox" checked>
                  <span>Remember me on this device</span>
                </label>
                <a href="#" class="auth-forgot-link" onclick="switchAuthEntryTab('forgot'); return false;">Forgot Password?</a>
              </div>

              <!-- Submit Button -->
              <button type="submit" id="auth-entry-signin-btn" class="auth-primary-btn">
                <span>Sign In to DeepPredictBet</span>
                <svg class="auth-btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </form>

            <!-- Bottom Switch Prompt -->
            <div class="auth-switch-prompt">
              <span>New to DeepPredictBet? </span>
              <button type="button" class="auth-inline-link" onclick="switchAuthEntryTab('signup')">Create an Account</button>
            </div>
          </div>

          <!-- --- FORM 2: CREATE ACCOUNT MODE --- -->
          <div id="auth-mode-signup" class="auth-mode-container">
            <div class="auth-form-header">
              <h2 class="auth-form-title">Create Account</h2>
              <p class="auth-form-subtitle">Join thousands of punters on DeepPredictBet</p>
            </div>

            <form id="auth-signup-form" onsubmit="return handleAuthEntrySignup(event);">
              <!-- Full Name -->
              <div class="auth-input-group">
                <label for="auth-signup-fullname" class="sr-only">Full Name</label>
                <div class="auth-input-wrapper">
                  <span class="auth-input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </span>
                  <input type="text" id="auth-signup-fullname" class="auth-text-input" placeholder="Full Name" autocomplete="name" required>
                </div>
              </div>

              <!-- Email -->
              <div class="auth-input-group">
                <label for="auth-signup-email" class="sr-only">Email address</label>
                <div class="auth-input-wrapper">
                  <span class="auth-input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </span>
                  <input type="email" id="auth-signup-email" class="auth-text-input" placeholder="Email address" autocomplete="email" required>
                </div>
              </div>

              <!-- Username -->
              <div class="auth-input-group">
                <label for="auth-signup-username" class="sr-only">Username</label>
                <div class="auth-input-wrapper">
                  <span class="auth-input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="4"></circle>
                      <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path>
                    </svg>
                  </span>
                  <input type="text" id="auth-signup-username" class="auth-text-input" placeholder="Username" autocomplete="username" required>
                </div>
              </div>

              <!-- Password -->
              <div class="auth-input-group">
                <label for="auth-signup-password" class="sr-only">Password</label>
                <div class="auth-input-wrapper">
                  <span class="auth-input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </span>
                  <input type="password" id="auth-signup-password" class="auth-text-input" placeholder="Password (min 6 characters)" minlength="6" autocomplete="new-password" required oninput="evaluatePasswordStrength(this.value)">
                  <button type="button" class="auth-password-toggle" onclick="toggleAuthPasswordVisibility('auth-signup-password', this)" title="Show or hide password" aria-label="Toggle password visibility">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                </div>
                <div id="auth-pw-strength-bar" class="auth-pw-strength-bar"><div id="auth-pw-strength-fill" class="auth-pw-strength-fill"></div></div>
              </div>

              <!-- Terms agreement -->
              <div class="auth-utility-row">
                <label class="auth-remember-label">
                  <input type="checkbox" id="auth-signup-terms" class="auth-checkbox" required checked>
                  <span>I agree to the <a href="/terms" target="_blank" class="auth-legal-link">Terms</a> &amp; <a href="/privacy" target="_blank" class="auth-legal-link">Privacy Policy</a> (18+)</span>
                </label>
              </div>

              <!-- Submit Button -->
              <button type="submit" id="auth-entry-signup-btn" class="auth-primary-btn">
                <span>Create DeepPredictBet Account</span>
                <svg class="auth-btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </form>

            <div class="auth-switch-prompt">
              <span>Already have an account? </span>
              <button type="button" class="auth-inline-link" onclick="switchAuthEntryTab('login')">Sign In</button>
            </div>
          </div>

          <!-- --- FORM 3: FORGOT PASSWORD MODE --- -->
          <div id="auth-mode-forgot" class="auth-mode-container">
            <div class="auth-form-header">
              <h2 class="auth-form-title">Reset Password</h2>
              <p class="auth-form-subtitle">Enter your registered email address or username</p>
            </div>

            <form id="auth-forgot-form" onsubmit="return handleAuthEntryForgotPassword(event);">
              <div class="auth-input-group">
                <label for="auth-forgot-identifier" class="sr-only">Email address or Username</label>
                <div class="auth-input-wrapper">
                  <span class="auth-input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </span>
                  <input type="text" id="auth-forgot-identifier" class="auth-text-input" placeholder="Registered Email or Username" required>
                </div>
              </div>

              <button type="submit" id="auth-forgot-submit-btn" class="auth-primary-btn">
                <span>Send Password Reset Link</span>
                <svg class="auth-btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </form>

            <div id="auth-forgot-feedback" class="auth-forgot-feedback" style="display: none;"></div>

            <div class="auth-switch-prompt">
              <span>Remember your password? </span>
              <button type="button" class="auth-inline-link" onclick="switchAuthEntryTab('login')">Back to Sign In</button>
            </div>
          </div>

        </div>
      </section>

    </div>

    <!-- Bottom-Right 18+ Age Restriction Badge -->
    <a href="/responsible-gambling" class="auth-18plus-badge" title="18+ Strictly for Adults — Play Responsibly" target="_blank" rel="noopener">
      <span>18+</span>
    </a>
  </main>
`;

function patchHtml(filePath) {
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');

  // 1. Add authEntry.css to head if not present
  if (!html.includes('authEntry.css')) {
    html = html.replace(
      '<link rel="stylesheet" href="/css/main.css?v=20260925_mobile_footer_v1">',
      '<link rel="stylesheet" href="/css/main.css?v=20260925_mobile_footer_v1">\n  <link rel="stylesheet" href="/css/authEntry.css?v=20261103_auth_v1">'
    );
    console.log(`[${filePath}] Added authEntry.css link.`);
  }

  // 2. Add authEntry.js script before router.js if not present
  if (!html.includes('authEntry.js')) {
    html = html.replace(
      '<script defer src="/js/router.js?v=20260924_multipage_v3"></script>',
      '<script defer src="/js/authEntry.js?v=20261103_auth_v1"></script>\n  <script defer src="/js/router.js?v=20260924_multipage_v3"></script>'
    );
    console.log(`[${filePath}] Added authEntry.js script tag.`);
  }

  // 3. Insert view-auth-entry before view-command-center if not present
  if (!html.includes('id="view-auth-entry"')) {
    // Also remove 'active' from view-command-center so router decides
    html = html.replace(
      '<main id="view-command-center" class="page-view active">',
      `${AUTH_VIEW_HTML}\n\n  <main id="view-command-center" class="page-view" style="display: none;">`
    );
    console.log(`[${filePath}] Inserted #view-auth-entry markup.`);
  }

  fs.writeFileSync(filePath, html, 'utf8');
}

function patchRouter(filePath) {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');

  // 1. Add /login, /auth, /signin, /signup to ROUTE_CONFIGS if not present
  if (!code.includes("'/login':")) {
    code = code.replace(
      "'/': {",
      `'/login': {\n      viewId: 'view-auth-entry',\n      title: 'DeepPredictBet — AI-Powered Football Predictions',\n      navKey: 'auth'\n    },\n    '/auth': {\n      redirect: '/login'\n    },\n    '/signin': {\n      redirect: '/login'\n    },\n    '/signup': {\n      redirect: '/login'\n    },\n    '/': {`
    );
    console.log(`[${filePath}] Added /login routes to ROUTE_CONFIGS.`);
  }

  // 2. Insert Entry Point & Route Protection in handleRouteNavigation
  if (!code.includes('AUTH_PROTECTED_GATE_ACTIVE')) {
    const targetAnchor = 'const { path, config } = resolveRoute(currentPath);';
    const replacement = `const { path, config } = resolveRoute(currentPath);

    // --- AUTH_PROTECTED_GATE_ACTIVE: AUTHORITATIVE ENTRY POINT & PROTECTED ROUTE GATEWAY ---
    const isLoggedIn = typeof localStorage !== 'undefined' && localStorage.getItem('userLoggedIn') === 'true';

    // 1. PUBLIC ROUTES ALLOWLIST
    const PUBLIC_ROUTES = [
      '/terms', '/terms-of-service',
      '/privacy', '/privacy-policy',
      '/disclaimer',
      '/data-deletion',
      '/responsible-gambling',
      '/login', '/auth', '/signin', '/signup'
    ];

    // 2. UNAUTHENTICATED VISITORS:
    // https://deeppredictbet.com/ ALWAYS opens the DeepPredictBet authentication page first.
    if (!isLoggedIn) {
      if (path === '/' || path === '/login') {
        if (typeof document !== 'undefined') {
          document.body.classList.add('auth-view-active');
        }

        // Hide all page-view containers
        const pageViews = document.querySelectorAll('.page-view');
        pageViews.forEach(view => {
          view.style.display = 'none';
          view.classList.remove('active');
        });

        const authView = document.getElementById('view-auth-entry');
        if (authView) {
          authView.style.display = 'flex';
          authView.classList.add('active');
        }

        document.title = 'DeepPredictBet — AI-Powered Football Predictions';

        // Check for pending redirect notice
        const noticeEl = document.getElementById('auth-entry-notice');
        const pendingTarget = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('auth_redirect_target') : null;
        if (noticeEl) {
          if (pendingTarget && pendingTarget !== '/' && pendingTarget !== '/login') {
            const cleanName = pendingTarget.replace(/^\\//, '').replace(/-/g, ' ').toUpperCase();
            noticeEl.textContent = \`🔒 Please sign in to access \${cleanName}\`;
            noticeEl.style.display = 'block';
          } else {
            noticeEl.style.display = 'none';
          }
        }

        // Hide universal date bar & tool breadcrumb
        const dateBar = document.getElementById('universal-date-bar-wrapper');
        if (dateBar) dateBar.style.display = 'none';
        const breadcrumbEl = document.getElementById('global-tool-breadcrumb');
        if (breadcrumbEl) breadcrumbEl.style.display = 'none';

        return;
      } else if (!PUBLIC_ROUTES.includes(path)) {
        // Protected Route Interception: Safely preserve original destination
        try {
          const fullDest = window.location.pathname + window.location.search + window.location.hash;
          sessionStorage.setItem('auth_redirect_target', fullDest);
        } catch (e) {}

        window.history.replaceState(null, '', '/login');
        return handleRouteNavigation({ interceptedFrom: path });
      }
    } else {
      // 3. AUTHENTICATED VISITORS:
      if (typeof document !== 'undefined') {
        document.body.classList.remove('auth-view-active');
      }

      // If authenticated user visits '/login', restore preserved target or redirect to designated dashboard
      if (path === '/login') {
        const preservedTarget = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('auth_redirect_target') : null;
        if (preservedTarget && preservedTarget !== '/' && preservedTarget !== '/login' && preservedTarget !== '/command-center') {
          sessionStorage.removeItem('auth_redirect_target');
          window.history.replaceState(null, '', preservedTarget);
          return handleRouteNavigation();
        }

        const isUserAdmin = typeof window.isAdmin === 'function' ? window.isAdmin() : false;
        const targetDashboard = isUserAdmin ? '/admin' : '/dashboard';
        window.history.replaceState(null, '', targetDashboard);
        return handleRouteNavigation();
      }

      // RBAC check: non-admins cannot access /admin
      if (path === '/admin' || path === '/admin/analytics' || path === '/founder-analytics') {
        const isUserAdmin = typeof window.isAdmin === 'function' ? window.isAdmin() : false;
        const isFounderAuth = typeof localStorage !== 'undefined' && (localStorage.getItem('dp_founder_authenticated') === 'true' || sessionStorage.getItem('dp_founder_authenticated') === 'true');
        if (!isUserAdmin && !isFounderAuth) {
          window.history.replaceState(null, '', '/dashboard');
          return handleRouteNavigation();
        }
      }
    }`;

    code = code.replace(targetAnchor, replacement);
    console.log(`[${filePath}] Added AUTH_PROTECTED_GATE_ACTIVE to handleRouteNavigation.`);
  }

  fs.writeFileSync(filePath, code, 'utf8');
}

function patchApp(filePath) {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');

  // In logoutUser, ensure navigation to '/' is triggered
  if (!code.includes('LOGOUT_AUTH_ENTRY_REDIRECT')) {
    code = code.replace(
      'localStorage.removeItem("dp_session_id");',
      `localStorage.removeItem("dp_session_id");\n    try { sessionStorage.removeItem("auth_redirect_target"); } catch(e) {} // LOGOUT_AUTH_ENTRY_REDIRECT`
    );

    code = code.replace(
      'const msg = "🚪 You have been logged out successfully.";',
      `// Immediately transition to '/' authentication page\n    if (typeof window.navigateTo === 'function') {\n      window.navigateTo('/');\n    } else if (typeof window.handleRouteNavigation === 'function') {\n      window.history.pushState(null, '', '/');\n      window.handleRouteNavigation();\n    }\n\n    const msg = "🚪 You have been logged out successfully.";`
    );
    console.log(`[${filePath}] Added logout redirect to / in logoutUser.`);
  }

  fs.writeFileSync(filePath, code, 'utf8');
}

// Execute patches
patchHtml('index.html');
patchHtml('public/index.html');

patchRouter('js/router.js');
patchRouter('public/js/router.js');

patchApp('js/app.js');
patchApp('public/js/app.js');

console.log('✅ All files patched successfully!');
