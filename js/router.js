/**
 * DeepPredictBet HTML5 History API Router
 * Multi-Page Football Intelligence Platform Architecture
 * Clean client-side SPA routing for all dedicated workspaces:
 * - / (Command Center)
 * - /predictions, /predictions/today, /predictions/tomorrow, /predictions/yesterday
 * - /matches, /matches/live
 * - /match/:matchId (Parameterised Match Intelligence Flagship)
 * - /leagues, /league/:leagueId
 * - /teams, /team/:teamId
 * - /ai-scout
 * - /bet-doctor
 * - /generator, /bet-generator
 * - /converter, /bet-code-converter
 * - /live-scanner, /pre-match-scanner
 * - /value-bets, /valuebot
 * - /arbitrage
 * - /league-analytics, /analytics
 * - /backtesting, /backtester
 * - /top-tips
 * - /smart-filters
 * - /results
 * - /watchlist
 * - /pricing, /vip
 * - /help, /faq
 * - /dashboard, /my-deeppredict
 * - /admin, /founder-analytics
 */

(function () {
  // 1. Clean Route Configurations
  const ROUTE_CONFIGS = {
    '/': {
      viewId: 'view-command-center',
      title: 'DeepPredictBet — AI Football Intelligence & Command Center',
      navKey: 'home'
    },
    '/home': {
      redirect: '/'
    },
    '/predictions': {
      viewId: 'view-predictions-hub',
      title: 'Football Predictions Hub — DeepPredictBet',
      navKey: 'predictions'
    },
    '/predictions/today': {
      viewId: 'view-predictions-hub',
      dateFilter: 'today',
      title: "Today's Football Predictions — DeepPredictBet",
      navKey: 'predictions'
    },
    '/predictions/tomorrow': {
      viewId: 'view-predictions-hub',
      dateFilter: 'tomorrow',
      title: "Tomorrow's Football Predictions — DeepPredictBet",
      navKey: 'predictions'
    },
    '/predictions/yesterday': {
      viewId: 'view-predictions-hub',
      dateFilter: 'yesterday',
      title: "Yesterday's Settled Predictions — DeepPredictBet",
      navKey: 'predictions'
    },
    '/matches': {
      viewId: 'view-matches',
      isMatchesDiscovery: true,
      title: 'Match Discovery & Fixtures Calendar — DeepPredictBet',
      navKey: 'matches'
    },
    '/matches/live': {
      viewId: 'view-matches',
      isMatchesDiscovery: true,
      liveOnly: true,
      title: 'Live Football In-Play Tracker — DeepPredictBet',
      navKey: 'matches'
    },
    '/leagues': {
      viewId: 'view-leagues',
      title: 'Football Leagues Intelligence — DeepPredictBet',
      navKey: 'leagues'
    },
    '/teams': {
      viewId: 'view-teams',
      title: 'Football Clubs & Teams Intelligence — DeepPredictBet',
      navKey: 'teams'
    },
    '/ai-scout': {
      viewId: 'view-ai-scout',
      title: 'AI Scout — Conversational Football Intelligence',
      navKey: 'ai-scout'
    },
    '/generator': {
      viewId: 'view-generator',
      tool: 'machine',
      title: 'Bet Generator — DeepPredict Machine',
      navKey: 'generator'
    },
    '/bet-generator': {
      redirect: '/generator'
    },
    '/bet-doctor': {
      viewId: 'view-generator',
      tool: 'doctor',
      title: 'AI Bet Doctor — Bet Slip Diagnostic Hub',
      navKey: 'bet-doctor'
    },
    '/doctor': {
      redirect: '/bet-doctor'
    },
    '/bet-code-converter': {
      viewId: 'view-converter',
      title: 'Booking Code Converter — DeepPredict Multi-Bookmaker Engine',
      navKey: 'converter'
    },
    '/converter': {
      redirect: '/bet-code-converter'
    },
    '/live-scanner': {
      viewId: 'view-scanner',
      scannerMode: 'live',
      title: 'Live Scanner — DeepPredict Real-Time In-Play Suite',
      navKey: 'live-scanner'
    },
    '/pre-match-scanner': {
      viewId: 'view-scanner',
      scannerMode: 'prematch',
      title: 'Pre-Match Scanner — DeepPredict Odds & Trend Finder',
      navKey: 'pre-match-scanner'
    },
    '/scanner': {
      redirect: '/live-scanner'
    },
    '/value-bets': {
      viewId: 'view-generator',
      tool: 'valuebot',
      title: 'Value Bet Bot — DeepPredict Value Engine',
      navKey: 'value-bets'
    },
    '/valuebot': {
      redirect: '/value-bets'
    },
    '/arbitrage': {
      viewId: 'view-generator',
      tool: 'arbitrage',
      title: 'Arbitrage Finder — DeepPredict SureBet Engine',
      navKey: 'arbitrage'
    },
    '/backtesting': {
      viewId: 'view-generator',
      tool: 'backtester',
      title: 'Strategy Backtester — DeepPredict Historical Engine',
      navKey: 'backtesting'
    },
    '/backtester': {
      redirect: '/backtesting'
    },
    '/top-tips': {
      viewId: 'view-generator',
      tool: 'toptips',
      title: 'Top Tips Tracker — DeepPredict High Probability Picks',
      navKey: 'top-tips'
    },
    '/toptips': {
      redirect: '/top-tips'
    },
    '/smart-filters': {
      viewId: 'view-generator',
      tool: 'filters',
      title: 'Advanced Match Filters — DeepPredict Search Engine',
      navKey: 'smart-filters'
    },
    '/filters': {
      redirect: '/smart-filters'
    },
    '/analytics': {
      viewId: 'view-analytics',
      title: 'League Stats & Analytics — DeepPredict Data Hub',
      navKey: 'analytics'
    },
    '/league-analytics': {
      redirect: '/analytics'
    },
    '/results': {
      viewId: 'view-results',
      title: 'Historical Performance & Settled Results — DeepPredictBet',
      navKey: 'results'
    },
    '/watchlist': {
      viewId: 'view-watchlist',
      title: 'Match Watchlist & Alerts — DeepPredictBet',
      navKey: 'watchlist'
    },
    '/pricing': {
      viewId: 'view-pricing',
      title: 'VIP Membership & Pricing Plans — DeepPredictBet',
      navKey: 'pricing'
    },
    '/vip': {
      redirect: '/pricing'
    },
    '/help': {
      viewId: 'view-help',
      title: 'Help Center, Guides & FAQs — DeepPredictBet',
      navKey: 'help'
    },
    '/faq': {
      redirect: '/help'
    },
    '/dashboard': {
      viewId: 'view-my-deeppredict',
      title: 'My DeepPredict — Personal Betting Command Center',
      navKey: 'dashboard'
    },
    '/my-deeppredict': {
      redirect: '/dashboard'
    },
    '/profile': {
      redirect: '/dashboard'
    },
    '/settings': {
      redirect: '/dashboard'
    },
    '/admin': {
      viewId: 'view-founder-analytics',
      title: 'DeepPredictBet Admin — Founder & Executive Business Intelligence',
      navKey: 'admin'
    },
    '/admin/analytics': {
      viewId: 'view-founder-analytics',
      title: 'DeepPredictBet Admin — Business Intelligence & Telemetry',
      navKey: 'admin'
    },
    '/founder-analytics': {
      redirect: '/admin'
    }
  };

  // 2. Legacy Hash Upgrade Map
  const HASH_REDIRECTS = {
    '#generator': '/generator',
    '#machine': '/generator',
    '#bet-generator': '/generator',
    '#bet-doctor': '/bet-doctor',
    '#doctor': '/bet-doctor',
    '#converter': '/converter',
    '#bet-code-converter': '/converter',
    '#arbitrage': '/arbitrage',
    '#live-scanner': '/live-scanner',
    '#scanner-live': '/live-scanner',
    '#pre-match-scanner': '/pre-match-scanner',
    '#scanner-prematch': '/pre-match-scanner',
    '#scanner': '/live-scanner',
    '#backtester': '/backtesting',
    '#backtesting': '/backtesting',
    '#toptips': '/top-tips',
    '#top-tips': '/top-tips',
    '#valuebot': '/value-bets',
    '#value-bets': '/value-bets',
    '#filters': '/smart-filters',
    '#smart-filters': '/smart-filters',
    '#analytics': '/analytics',
    '#league-analytics': '/analytics',
    '#results': '/results',
    '#watchlist': '/watchlist',
    '#matches': '/matches',
    '#matches-live': '/matches/live',
    '#leagues': '/leagues',
    '#teams': '/teams',
    '#ai-scout': '/ai-scout',
    '#pricing': '/pricing',
    '#vip': '/pricing',
    '#help': '/help',
    '#faq': '/help',
    '#dashboard': '/dashboard',
    '#my-deeppredict': '/dashboard',
    '#admin': '/admin',
    '#admin/analytics': '/admin/analytics',
    '#founder-analytics': '/admin',
    '#predictions': '/predictions',
    '#home': '/'
  };

  // 3. Normalize current pathname
  function normalizePath(rawPath) {
    if (!rawPath) return '/';
    let p = rawPath.trim();
    if (p.endsWith('/') && p.length > 1) {
      p = p.slice(0, -1);
    }
    return p.toLowerCase();
  }

  // 4. Resolve Route Configuration (Static + Parameterized)
  function resolveRoute(path) {
    const norm = normalizePath(path);

    // Static match
    const config = ROUTE_CONFIGS[norm];
    if (config && config.redirect) {
      return resolveRoute(config.redirect);
    }
    if (config) {
      return { path: norm, config };
    }

    // Dynamic Parameterized Routes
    // A. Match Detail (/match/:matchId)
    const matchDetailRegex = /^\/match\/([a-zA-Z0-9_\-]+)$/i;
    const matchDetailExec = norm.match(matchDetailRegex);
    if (matchDetailExec) {
      const matchId = matchDetailExec[1];
      return {
        path: norm,
        config: {
          viewId: 'view-match-detail',
          isMatchDetail: true,
          matchId: matchId,
          title: `Match Intelligence #${matchId} — DeepPredictBet`,
          navKey: 'matches'
        }
      };
    }

    // B. League Detail (/league/:leagueId)
    const leagueDetailRegex = /^\/league\/([a-zA-Z0-9_\-]+)$/i;
    const leagueDetailExec = norm.match(leagueDetailRegex);
    if (leagueDetailExec) {
      const leagueId = leagueDetailExec[1];
      return {
        path: norm,
        config: {
          viewId: 'view-leagues',
          isLeagueDetail: true,
          leagueId: leagueId,
          title: `League Intelligence (${leagueId}) — DeepPredictBet`,
          navKey: 'leagues'
        }
      };
    }

    // C. Team Detail (/team/:teamId)
    const teamDetailRegex = /^\/team\/([a-zA-Z0-9_\-]+)$/i;
    const teamDetailExec = norm.match(teamDetailRegex);
    if (teamDetailExec) {
      const teamId = teamDetailExec[1];
      return {
        path: norm,
        config: {
          viewId: 'view-teams',
          isTeamDetail: true,
          teamId: teamId,
          title: `Team Intelligence (${teamId}) — DeepPredictBet`,
          navKey: 'teams'
        }
      };
    }

    // Fallback to command center home
    return { path: '/', config: ROUTE_CONFIGS['/'] };
  }

  // 5. Main Route Navigation Renderer
  function handleRouteNavigation(options = {}) {
    // Check if there is an old hash that needs to be upgraded to a clean route
    const currentHash = window.location.hash.toLowerCase();
    let currentPath = window.location.pathname;
    if (currentHash && HASH_REDIRECTS[currentHash]) {
      const targetCleanPath = HASH_REDIRECTS[currentHash];
      window.history.replaceState(null, '', targetCleanPath);
      currentPath = targetCleanPath;
    }

    const { path, config } = resolveRoute(currentPath);

    // If normalized path differs from current (e.g. alias redirect)
    if (normalizePath(currentPath) !== path && !window.location.pathname.startsWith(path)) {
      window.history.replaceState(null, '', path + (window.location.hash || ''));
    }

    const targetViewId = config.viewId || 'view-command-center';

    // STRICT ROLE-BASED ACCESS CONTROL (RBAC) FOR FOUNDER / ADMIN CONSOLE
    if (!options.skipAuthCheck && (targetViewId === 'view-founder-analytics' || path === '/admin' || path === '/admin/analytics' || path === '/founder-analytics')) {
      const isLoggedIn = typeof localStorage !== 'undefined' && localStorage.getItem('userLoggedIn') === 'true';
      const isUserAdmin = typeof window.isAdmin === 'function' ? window.isAdmin() : false;

      if (!isLoggedIn) {
        console.warn('[Router RBAC Guard] Unauthorized attempt to access admin view without authentication.');
        if (typeof showToast === 'function') {
          showToast('🔒 Please log in with an Administrator account to access the Founder Console.', 'warning');
        } else if (typeof showAppNotification === 'function') {
          showAppNotification('🔒 Administrator login required.');
        }
        window.history.replaceState(null, '', '/dashboard');
        if (typeof openAuthModal === 'function') {
          openAuthModal('login');
        }
        return navigateTo('/dashboard', true, { skipAuthCheck: true });
      }

      if (!isUserAdmin) {
        console.warn('[Router RBAC Guard] Forbidden attempt to access admin view by non-admin user.');
        if (typeof showToast === 'function') {
          showToast('⛔ Access Denied: The Founder Analytics & BI Console is restricted to verified Administrators.', 'error');
        } else if (typeof showAppNotification === 'function') {
          showAppNotification('⛔ Access Denied: Administrator role required.');
        }
        window.history.replaceState(null, '', '/dashboard');
        return navigateTo('/dashboard', true, { skipAuthCheck: true });
      }
    }

    // Hide all page-view containers
    const pageViews = document.querySelectorAll('.page-view');
    pageViews.forEach(view => {
      view.style.display = 'none';
      view.classList.remove('active');
    });

    // Show target view
    const activeView = document.getElementById(targetViewId);
    if (activeView) {
      activeView.style.display = 'block';
      activeView.classList.add('active');
    } else {
      // Graceful fallback to command center if view container doesn't exist
      const fallbackView = document.getElementById('view-command-center') || document.getElementById('view-predictions');
      if (fallbackView) {
        fallbackView.style.display = 'block';
        fallbackView.classList.add('active');
      }
    }

    // Update document title if specified
    if (config.title) {
      document.title = config.title;
    }

    // Update Universal Date Bar on dedicated dashboard views for clean command center focus
    const dateBar = document.getElementById('universal-date-bar-wrapper');
    if (dateBar) {
      if (['view-my-deeppredict', 'view-founder-analytics', 'view-match-detail', 'view-ai-scout'].includes(targetViewId)) {
        dateBar.style.display = 'none';
      } else {
        dateBar.style.display = 'flex';
      }
    }

    // Sync Global Tool Breadcrumb
    const breadcrumbEl = document.getElementById('global-tool-breadcrumb');
    const breadcrumbLabel = document.getElementById('global-tool-breadcrumb-label');
    if (breadcrumbEl && breadcrumbLabel) {
      if (path === '/' || path === '') {
        breadcrumbEl.style.display = 'none';
      } else {
        breadcrumbEl.style.display = 'flex';
        let rawTitle = config.title || path;
        let cleanName = rawTitle.split('—')[0].replace(/DeepPredict/gi, '').replace(/Bet/gi, '').trim();
        breadcrumbLabel.textContent = cleanName || 'Platform View';
      }
    }

    // Update navigation active states across navbar, mobile drawer, and bottom nav
    updateNavActiveStates(path, config.navKey);

    // Call dynamic page renderers if applicable
    if (config.isMatchDetail && typeof window.renderMatchDetailPage === 'function') {
      window.renderMatchDetailPage(config.matchId);
    } else if (config.isMatchesDiscovery && typeof window.renderMatchesDiscoveryPage === 'function') {
      window.renderMatchesDiscoveryPage({ liveOnly: config.liveOnly });
    } else if (targetViewId === 'view-leagues' && typeof window.renderLeaguesPage === 'function') {
      window.renderLeaguesPage(config.isLeagueDetail ? config.leagueId : null);
    } else if (targetViewId === 'view-teams' && typeof window.renderTeamsPage === 'function') {
      window.renderTeamsPage();
    } else if (targetViewId === 'view-ai-scout' && typeof window.renderAiScoutPage === 'function') {
      window.renderAiScoutPage();
    } else if (targetViewId === 'view-results' && typeof window.renderResultsPage === 'function') {
      window.renderResultsPage();
    } else if (targetViewId === 'view-watchlist' && typeof window.renderWatchlistPage === 'function') {
      window.renderWatchlistPage();
    }

    // Handle query param league filtering for /predictions or command center
    if (targetViewId === 'view-predictions-hub' || targetViewId === 'view-command-center' || path === '/' || path === '/predictions') {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const queryLeagueId = urlParams.get('leagueId') || urlParams.get('league_id');
        const queryLeague = urlParams.get('league');
        if (queryLeagueId || queryLeague) {
          setTimeout(() => {
            let targetName = queryLeague;
            let targetCountry = null;
            if (queryLeagueId && typeof window.getCanonicalLeagueById === 'function') {
              const canonical = window.getCanonicalLeagueById(queryLeagueId);
              if (canonical) {
                targetName = canonical.name;
                targetCountry = canonical.country;
              }
            }
            if (targetName && typeof window.selectSidebarLeague === 'function') {
              window.selectSidebarLeague(targetName, null, targetCountry);
            }
          }, 150);
        }
      } catch (e) {
        console.warn('[Router] League query param filter error:', e);
      }
    }

    // Date Tab filtering for /predictions/today, /predictions/tomorrow, /predictions/yesterday
    if (config.dateFilter && typeof window.triggerQuickFilter === 'function') {
      window.triggerQuickFilter(config.dateFilter, 'all');
    }

    // Tool navigation: direct access to analytics suite without blocking modal popup

    // Product Telemetry Event Mapping
    if (typeof window.trackEvent === 'function') {
      if (path === '/live-scanner') {
        window.trackEvent('SCANNER_USED', { tool: 'live_scanner', scanner_type: 'live' });
      } else if (['/arbitrage', '/value-bets', '/smart-filters'].includes(path)) {
        window.trackEvent('SCANNER_USED', { tool: 'scanner', scanner_type: config.navKey || path.slice(1) });
      }
    }

    // Handle tool switching if view-generator is target
    if (targetViewId === 'view-generator' && config.tool) {
      const suiteSec = document.getElementById("deeppredictbet-tools");
      if (suiteSec) {
        const targetBtn = Array.from(suiteSec.querySelectorAll(".tabs-container > .tab-btn")).find(b => {
          const attr = b.getAttribute("onclick");
          return attr && attr.includes(`'${config.tool}'`);
        }) || suiteSec.querySelector(".tabs-container > .tab-btn");

        if (typeof window.switchTool === 'function') {
          window.switchTool(config.tool, targetBtn, true); // true = skip pushState loop
        }
      }
    }

    // Handle scanner mode if view-scanner is target
    if (targetViewId === 'view-scanner') {
      const mode = config.scannerMode || 'live';
      if (typeof window.switchScannerMode === 'function') {
        const modeBtn = document.querySelector(`.tabs-container .tab-btn[onclick*="${mode}"]`);
        window.switchScannerMode(mode, modeBtn, true); // true = skip pushState loop
      }
    }

    // Handle converter initializer if view-converter is target
    if (targetViewId === 'view-converter') {
      if (typeof window.renderRecentConvertedSlips === 'function') {
        window.renderRecentConvertedSlips();
      }
    }

    // Handle My DeepPredict customer dashboard initializer
    if (targetViewId === 'view-my-deeppredict') {
      const hashSub = window.location.hash ? window.location.hash.slice(1) : 'overview';
      if (typeof window.renderCustomerDashboard === 'function') {
        window.renderCustomerDashboard(hashSub);
      } else {
        setTimeout(() => {
          if (typeof window.renderCustomerDashboard === 'function') {
            window.renderCustomerDashboard(hashSub);
          }
        }, 50);
      }
    }

    // Handle Founder Analytics dashboard initializer
    if (targetViewId === 'view-founder-analytics') {
      if (typeof window.renderFounderDashboard === 'function') {
        window.renderFounderDashboard();
      } else {
        setTimeout(() => {
          if (typeof window.renderFounderDashboard === 'function') {
            window.renderFounderDashboard();
          }
        }, 50);
      }
    }

    // Handle in-page subsection anchor scroll (e.g. #telegram-vip-section)
    if (window.location.hash) {
      const targetAnchorId = window.location.hash.slice(1);
      const targetAnchorEl = document.getElementById(targetAnchorId);
      if (targetAnchorEl) {
        setTimeout(() => {
          targetAnchorEl.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        return;
      }
    }

    // Smooth scroll to top unless options.noScroll is set
    if (!options.noScroll) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // 6. Navigation Active State Updater
  function updateNavActiveStates(currentPath, navKey) {
    const allNavLinks = document.querySelectorAll('.nav-link, .nav-dropdown-item, .mobile-drawer-link, .bottom-nav-item, .footer-link');
    allNavLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;

      const normHref = normalizePath(href.split('#')[0]);
      const isMatch = (href === currentPath) || 
                      (normHref === currentPath && currentPath !== '/') ||
                      (currentPath === '/' && (href === '/' || href === '#home')) ||
                      (navKey && (href.includes(navKey) || (href.startsWith('#') && HASH_REDIRECTS[href.toLowerCase()] === currentPath)));

      if (isMatch) {
        link.classList.add('active');
      } else if (!href.startsWith('#telegram') && !href.startsWith('#league') && !href.startsWith('#daily')) {
        link.classList.remove('active');
      }
    });
  }

  // 7. Programmatic Navigation function
  function navigateTo(targetPath, replaceOrOptions = false, maybeOptions = {}) {
    if (!targetPath) return;

    let replace = false;
    let options = {};
    if (typeof replaceOrOptions === 'boolean') {
      replace = replaceOrOptions;
      options = maybeOptions || {};
    } else if (typeof replaceOrOptions === 'object' && replaceOrOptions !== null) {
      options = replaceOrOptions;
      replace = !!options.replace;
    }

    // Resolve any hash redirect passed into navigateTo
    if (targetPath.startsWith('#') && HASH_REDIRECTS[targetPath.toLowerCase()]) {
      targetPath = HASH_REDIRECTS[targetPath.toLowerCase()];
    }

    const { path } = resolveRoute(targetPath.split('#')[0]);
    const finalUrl = path + (targetPath.includes('#') ? targetPath.slice(targetPath.indexOf('#')) : '');

    if (replace) {
      window.history.replaceState(null, '', finalUrl);
    } else if (window.location.pathname + window.location.hash !== finalUrl) {
      window.history.pushState(null, '', finalUrl);
    }

    handleRouteNavigation(options);
  }

  // 8. Global Click Interceptor for Clean In-App Links
  document.addEventListener('click', function (e) {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // Ignore external, target=_blank, and special protocols
    if (link.target === '_blank' || href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
      return;
    }

    // Check if it's a legacy hash that maps to a clean route
    const lowerHref = href.toLowerCase();
    if (href.startsWith('#') && HASH_REDIRECTS[lowerHref]) {
      e.preventDefault();
      navigateTo(HASH_REDIRECTS[lowerHref]);
      return;
    }

    // Check if it's a same-page section anchor
    if (href.startsWith('#')) {
      if (window.location.pathname !== '/' && window.location.pathname !== '/predictions') {
        e.preventDefault();
        navigateTo('/' + href);
      }
      return; // allow default anchor jump on home
    }

    // If it's an internal clean path
    if (href.startsWith('/')) {
      e.preventDefault();
      navigateTo(href);
      return;
    }
  });

  // 9. Popstate and Hashchange listeners
  window.addEventListener('popstate', function () {
    handleRouteNavigation();
  });
  window.addEventListener('hashchange', function () {
    handleRouteNavigation();
  });

  // 10. Initialization on DOMContentLoaded & load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => handleRouteNavigation());
  } else {
    handleRouteNavigation();
  }

  // Window Exports
  window.navigateTo = navigateTo;
  window.updateNavActiveStates = updateNavActiveStates;
  window.navigateToPage = function (routeId) {
    const map = {
      'predictions': '/predictions',
      'generator': '/generator',
      'machine': '/generator',
      'doctor': '/bet-doctor',
      'arbitrage': '/arbitrage',
      'converter': '/converter',
      'scanner': '/live-scanner',
      'scanner-live': '/live-scanner',
      'scanner-prematch': '/pre-match-scanner',
      'backtester': '/backtesting',
      'backtesting': '/backtesting',
      'toptips': '/top-tips',
      'valuebot': '/value-bets',
      'filters': '/smart-filters',
      'analytics': '/analytics',
      'results': '/results',
      'watchlist': '/watchlist',
      'matches': '/matches',
      'leagues': '/leagues',
      'teams': '/teams',
      'ai-scout': '/ai-scout',
      'pricing': '/pricing',
      'help': '/help',
      'dashboard': '/dashboard',
      'my-deeppredict': '/dashboard',
      'admin': '/admin',
      'admin/analytics': '/admin/analytics',
      'founder-analytics': '/admin'
    };
    navigateTo(map[routeId] || '/' + routeId);
  };
  window.handleRouteNavigation = handleRouteNavigation;

  window.scrollToSection = function(sectionId) {
    const sec = document.getElementById(sectionId);
    if (sec) {
      sec.scrollIntoView({ behavior: 'smooth' });
    } else if (typeof window.navigateTo === 'function') {
      window.navigateTo('/');
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 180);
    }
  };
})();
