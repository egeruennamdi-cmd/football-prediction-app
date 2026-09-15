/**
 * DeepPredictBet HTML5 History API Router
 * Clean client-side SPA routing for /generator, /bet-doctor, /bet-code-converter, /arbitrage, /live-scanner, /pre-match-scanner, etc.
 * Features:
 * - HTML5 pushState & popstate navigation
 * - Legacy hash-to-clean-path automatic upgrade/redirect
 * - In-page subsection anchor preservation (#telegram-vip-section, #league-stats-section, etc.)
 * - Dynamic view activation & tool tab syncing
 * - Navigation link active state syncing
 * - Zero 404 SPA fallback handling
 */

(function () {
  // 1. Clean Route Configurations
  const ROUTE_CONFIGS = {
    '/': {
      viewId: 'view-predictions',
      title: 'DeepPredictBet — AI Football Predictions & Analytics',
      navKey: 'predictions'
    },
    '/predictions': {
      viewId: 'view-predictions',
      title: 'DeepPredictBet — Live Predictions & AI Analysis',
      navKey: 'predictions'
    },
    '/generator': {
      viewId: 'view-generator',
      tool: 'machine',
      title: 'Bet Generator — DeepPredict Machine',
      navKey: 'generator'
    },
    '/bet-doctor': {
      viewId: 'view-generator',
      tool: 'doctor',
      title: 'AI Bet Doctor — DeepPredict Diagnostic Hub',
      navKey: 'bet-doctor'
    },
    '/doctor': {
      redirect: '/bet-doctor'
    },
    '/bet-code-converter': {
      viewId: 'view-converter',
      title: 'Bet Code Converter — DeepPredict Multi-Bookmaker Engine',
      navKey: 'bet-code-converter'
    },
    '/converter': {
      redirect: '/bet-code-converter'
    },
    '/arbitrage': {
      viewId: 'view-generator',
      tool: 'arbitrage',
      title: 'Arbitrage Finder — DeepPredict SureBet Engine',
      navKey: 'arbitrage'
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
    '/backtester': {
      viewId: 'view-generator',
      tool: 'backtester',
      title: 'Strategy Backtester — DeepPredict Historical Engine',
      navKey: 'backtester'
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
    '/valuebot': {
      viewId: 'view-generator',
      tool: 'valuebot',
      title: 'Value Bet Bot — DeepPredict Value Engine',
      navKey: 'valuebot'
    },
    '/smart-filters': {
      viewId: 'view-generator',
      tool: 'filters',
      title: 'Advance Filters — DeepPredict Search Engine',
      navKey: 'smart-filters'
    },
    '/filters': {
      redirect: '/smart-filters'
    },
    '/analytics': {
      viewId: 'view-analytics',
      title: 'League Stats & Analytics — DeepPredict Data Hub',
      navKey: 'analytics'
    }
  };

  // 2. Legacy Hash Upgrade Map
  const HASH_REDIRECTS = {
    '#generator': '/generator',
    '#machine': '/generator',
    '#bet-doctor': '/bet-doctor',
    '#doctor': '/bet-doctor',
    '#converter': '/bet-code-converter',
    '#bet-code-converter': '/bet-code-converter',
    '#arbitrage': '/arbitrage',
    '#live-scanner': '/live-scanner',
    '#scanner-live': '/live-scanner',
    '#pre-match-scanner': '/pre-match-scanner',
    '#scanner-prematch': '/pre-match-scanner',
    '#scanner': '/live-scanner',
    '#backtester': '/backtester',
    '#toptips': '/top-tips',
    '#top-tips': '/top-tips',
    '#valuebot': '/valuebot',
    '#filters': '/smart-filters',
    '#smart-filters': '/smart-filters',
    '#analytics': '/analytics',
    '#predictions': '/',
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

  // 4. Resolve Route Configuration
  function resolveRoute(path) {
    const norm = normalizePath(path);
    const config = ROUTE_CONFIGS[norm];
    if (config && config.redirect) {
      return { path: config.redirect, config: ROUTE_CONFIGS[config.redirect] };
    }
    if (config) {
      return { path: norm, config };
    }
    // Fallback to home
    return { path: '/', config: ROUTE_CONFIGS['/'] };
  }

  // 5. Main Route Navigation Renderer
  function handleRouteNavigation(options = {}) {
    // Check if there is an old hash that needs to be upgraded to a clean route
    const currentHash = window.location.hash.toLowerCase();
    if (currentHash && HASH_REDIRECTS[currentHash]) {
      const targetCleanPath = HASH_REDIRECTS[currentHash];
      window.history.replaceState(null, '', targetCleanPath);
    }

    const currentPath = window.location.pathname;
    const { path, config } = resolveRoute(currentPath);

    // If normalized path differs from current (e.g. alias redirect)
    if (normalizePath(currentPath) !== path && !window.location.pathname.startsWith(path)) {
      window.history.replaceState(null, '', path + (window.location.hash || ''));
    }

    const targetViewId = config.viewId || 'view-predictions';

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
    }

    // Update document title if specified
    if (config.title) {
      document.title = config.title;
    }

    // Update navigation active states across navbar, mobile drawer, and bottom nav
    updateNavActiveStates(path, config.navKey);

    // Check VIP feature protection
    if (config.tool && ['arbitrage', 'valuebot', 'backtester', 'doctor'].includes(config.tool)) {
      if (typeof checkFeatureVipAccess === 'function') {
        // VIP check prompts modal without breaking view
      checkFeatureVipAccess(config.tool);
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
                      (currentPath === '/' && (href === '/' || href === '#predictions' || href === '/predictions')) ||
                      (navKey && (href.includes(navKey) || (href.startsWith('#') && HASH_REDIRECTS[href.toLowerCase()] === currentPath)));

      if (isMatch) {
        link.classList.add('active');
      } else if (!href.startsWith('#telegram') && !href.startsWith('#league') && !href.startsWith('#daily')) {
        link.classList.remove('active');
      }
    });
  }

  // 7. Programmatic Navigation function
  function navigateTo(targetPath, replace = false, options = {}) {
    if (!targetPath) return;

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
      // If we are currently on a sub-route (not home), navigate to home first, then scroll
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

  // 9. Popstate listener for Browser Back & Forward buttons
  window.addEventListener('popstate', function () {
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
      'predictions': '/',
      'generator': '/generator',
      'machine': '/generator',
      'doctor': '/bet-doctor',
      'arbitrage': '/arbitrage',
      'converter': '/bet-code-converter',
      'scanner': '/live-scanner',
      'scanner-live': '/live-scanner',
      'scanner-prematch': '/pre-match-scanner',
      'backtester': '/backtester',
      'toptips': '/top-tips',
      'valuebot': '/valuebot',
      'filters': '/smart-filters',
      'analytics': '/analytics'
    };
    navigateTo(map[routeId] || '/' + routeId);
  };
  window.handleRouteNavigation = handleRouteNavigation;
})();
