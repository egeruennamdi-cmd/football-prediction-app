/**
 * DeepPredictBet Multi-Page Application Router
 * Enables clean, instant client-side page view routing across dedicated tool pages.
 */

(function () {
  const routesMap = {
    'home': 'view-predictions',
    'predictions': 'view-predictions',
    'generator': 'view-generator',
    'machine': 'view-generator',
    'doctor': 'view-generator',
    'arbitrage': 'view-generator',
    'converter': 'view-converter',
    'backtester': 'view-generator',
    'valuebot': 'view-generator',
    'toptips': 'view-generator',
    'filters': 'view-generator',
    'scanner': 'view-predictions',
    'analytics': 'view-predictions',
    'community': 'view-predictions'
  };

  function getRouteFromHash() {
    const hash = window.location.hash.replace(/^#\/?/, '').trim().toLowerCase();
    if (!hash) return 'predictions';
    return routesMap[hash] ? hash : 'predictions';
  }

  function handleRouteNavigation() {
    const route = getRouteFromHash();
    const targetViewId = routesMap[route] || 'view-predictions';
    
    // Hide all page views
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

    // Update main nav active state
    const navLinks = document.querySelectorAll('.navbar .nav-link, .navbar-mobile .nav-link');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.includes('#' + route)) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Check VIP feature protection
    if (['arbitrage', 'valuebot', 'backtester', 'doctor', 'viptips'].includes(route)) {
      if (typeof checkFeatureVipAccess === 'function' && !checkFeatureVipAccess(route)) {
        // Intercepted by VIP Paywall
        const predView = document.getElementById('view-predictions');
        if (predView) {
          views.forEach(v => v.classList.remove('active'));
          predView.classList.add('active');
        }
        return;
      }
    }

    // Trigger tool-specific initializers if opening generator tools
    if (targetViewId === 'view-generator') {
      const toolSubRoute = ['machine', 'doctor', 'arbitrage', 'backtester', 'toptips', 'filters', 'valuebot'].includes(route) ? route : 'machine';
      const suiteSec = document.getElementById("deeppredictbet-tools");
      if (suiteSec) {
        const btn = Array.from(suiteSec.querySelectorAll(".tabs-container > .tab-btn")).find(b => {
          const attr = b.getAttribute("onclick");
          return attr && attr.includes(toolSubRoute);
        }) || suiteSec.querySelector(".tabs-container > .tab-btn");

        if (btn && typeof window.switchTool === 'function') {
          window.switchTool(toolSubRoute, btn);
        }
      }
    } else if (targetViewId === 'view-converter') {
      if (typeof window.renderRecentConvertedSlips === 'function') {
        window.renderRecentConvertedSlips();
      }
    }

    // Smooth scroll to top of content
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function navigateToPage(routeId) {
    if (!routeId) return;
    window.location.hash = '#' + routeId;
  }

  window.navigateToPage = navigateToPage;
  window.handleRouteNavigation = handleRouteNavigation;

  window.addEventListener('hashchange', handleRouteNavigation);
  document.addEventListener('DOMContentLoaded', handleRouteNavigation);
})();

// Auto-Export Window Bindings for router.js
try { if (typeof getRouteFromHash === 'function') window.getRouteFromHash = getRouteFromHash; } catch (e) {}
try { if (typeof handleRouteNavigation === 'function') window.handleRouteNavigation = handleRouteNavigation; } catch (e) {}
try { if (typeof navigateToPage === 'function') window.navigateToPage = navigateToPage; } catch (e) {}
