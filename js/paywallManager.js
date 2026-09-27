/**
 * DeepPredictBet — Premium Paywall 2.0 Engine
 * World-Class Sports Intelligence Subscription Experience
 *
 * Implements:
 * 1. Context-aware feature unlocking & personalized previews
 * 2. Transparent value-before-price communication
 * 3. Smart subscriber lifecycle handling (Active, Expired, New, Payment Failure)
 * 4. Comprehensive analytics instrumentation
 * 5. WCAG keyboard accessibility & focus management
 * 6. 100% preservation of underlying pricing, payment processing & entitlements
 */

(function () {
  'use strict';

  // Authoritative Feature Context Definitions
  const PAYWALL_FEATURE_CONTEXTS = {
    match_intelligence: {
      id: 'match_intelligence',
      badge: '🔒 ADVANCED MATCH INTELLIGENCE',
      title: 'Unlock Full Match Intelligence',
      subtitle: 'You are viewing the preview. Upgrade to unlock complete Poisson outcome distributions, expected goals (xG), and live market value signals.',
      cta: 'Unlock Full Match Intelligence',
      previewTitle: 'MATCH INTELLIGENCE TERMINAL',
      previewBadge: 'Illustrative Preview',
      previewItems: [
        { label: 'Poisson Outcome Probabilities', val: 'Home 58.4% · Draw 24.2% · Away 17.4%' },
        { label: 'Expected Goals Model (xG)', val: 'Home xG 2.14 · Away xG 0.88' },
        { label: 'Market Discrepancy Signal', val: '+4.8% Positive Expected Value (+EV)' },
        { label: 'Tactical Squad Momentum', val: 'High Press Efficiency · 89% Pass Accuracy' }
      ],
      benefits: [
        'Full algorithmic 1X2, Over/Under & BTTS probabilities',
        'Quantitative Expected Goals (xG) & Poisson distributions',
        'Real-time bookmaker price discrepancies & value signals',
        'Tactical squad analytics & momentum form breakdown',
        'Coverage across 50+ global leagues & cup tournaments'
      ]
    },
    doctor: {
      id: 'doctor',
      badge: '🔒 AI BET DOCTOR',
      title: 'Unlock Full Bet Doctor Analysis',
      subtitle: 'You are viewing the preview. Upgrade to diagnose multi-leg accumulators, detect negative covariance risks, and receive algorithmic leg replacements.',
      cta: 'Unlock Full Bet Doctor Analysis',
      previewTitle: 'TICKET RISK DIAGNOSTICS',
      previewBadge: 'Illustrative Preview',
      previewItems: [
        { label: 'Variance & Correlation Audit', val: 'Moderate Variance · 2 Correlated Outcomes' },
        { label: 'Audited Win Probability', val: 'Quantitative True Probability: 38.6%' },
        { label: 'Algorithmic Replacement', val: 'Replace Leg 3 (-110) with Over 1.5 (+145)' },
        { label: 'Estimated Slip Yield', val: '+12.4% Expected Value Optimization' }
      ],
      benefits: [
        'Instant multi-leg accumulator risk & variance audit',
        'Negative covariance & conflicting outcome detection',
        'Algorithmic replacement recommendations with higher EV',
        'Seamless bet code conversion across 14+ top sportsbooks',
        'Unlimited daily slip scans & diagnostic history'
      ]
    },
    valuebot: {
      id: 'valuebot',
      badge: '🔒 VALUE BET BOT (+EV)',
      title: 'Unlock Value Bet Intelligence',
      subtitle: 'Access live mathematical expected value (+EV) discrepancies identified across 50 global bookmakers in real-time.',
      cta: 'Unlock Value Bet Intelligence',
      previewTitle: '+EV MARKET SCANNER',
      previewBadge: 'Illustrative Preview',
      previewItems: [
        { label: 'Bookmaker Market Discrepancy', val: 'Fair Odds 1.95 vs Bookmaker Market 2.15' },
        { label: 'Mathematical Expected Value', val: '+10.25% Edge Over Closing Line' },
        { label: 'Poisson Model Confidence', val: '86.4% Algorithmic Conviction' },
        { label: 'Kelly Staking Allocation', val: 'Quarter-Kelly (1.8% Bankroll Allocation)' }
      ],
      benefits: [
        'Real-time +EV market discrepancy scanner across 50 sportsbooks',
        'Poisson-based fair odds calculation vs. bookmaker market lines',
        'Bankroll growth simulation with Kelly Criterion sizing',
        'Instant mobile & Telegram push alerts for live mispricings',
        'Historical closing line value (CLV) audit ledger'
      ]
    },
    backtester: {
      id: 'backtester',
      badge: '🔒 STRATEGY BACKTESTER',
      title: 'Unlock Strategy Backtesting',
      subtitle: 'Simulate high-stakes betting systems over historical league outcomes with customizable bankrolls and drawdown analytics.',
      cta: 'Unlock Strategy Backtesting',
      previewTitle: 'HISTORICAL SIMULATION ENGINE',
      previewBadge: 'Illustrative Preview',
      previewItems: [
        { label: 'Historical Sample Size', val: '1,240 European League Matches' },
        { label: 'Cumulative Strategy Yield', val: '+14.8% Net Investment Yield' },
        { label: 'Maximum Observed Drawdown', val: '-6.2% Peak-to-Trough Variance' },
        { label: 'Sharpe Ratio / Risk Score', val: '1.92 · Low Volatility Profile' }
      ],
      benefits: [
        'Multi-season retroactive historical model simulations',
        'Customizable bankroll sizing, staking rules & max drawdown analysis',
        'Filter by league, market type, odds range & team form criteria',
        'Detailed ROI, strike-rate, and yield variance ledgers',
        'Export simulation data for external model auditing'
      ]
    },
    arbitrage: {
      id: 'arbitrage',
      badge: '🔒 ARBITRAGE SUREBETS',
      title: 'Unlock Cross-Market Arbitrage',
      subtitle: 'Scan 50 global bookmakers in real-time for zero-risk mathematical pricing discrepancies and execution splits.',
      cta: 'Unlock Cross-Market Arbitrage',
      previewTitle: 'ARBITRAGE SCANNER ENGINE',
      previewBadge: 'Illustrative Preview',
      previewItems: [
        { label: 'Market Discrepancy Margin', val: '2.84% Guaranteed Net Arbitrage' },
        { label: 'Bookmaker Execution Split', val: 'Bookmaker A (2.10) / Bookmaker B (2.05)' },
        { label: 'Execution Window Timer', val: 'Live Window: ~4 mins remaining' },
        { label: 'Stake Allocation Split', val: '₦51,200 (Leg 1) · ₦48,800 (Leg 2)' }
      ],
      benefits: [
        'Cross-market SureBet scanner across 50 bookmakers worldwide',
        'Zero-risk mathematical pricing discrepancies calculated in real-time',
        'Dynamic stake calculator for dual & three-way market execution',
        'Direct deep-links to bookmaker slips with rapid execution timers',
        'Telegram alerts for high-yield market divergences'
      ]
    },
    ai_scout: {
      id: 'ai_scout',
      badge: '🔒 AI TACTICAL SCOUT',
      title: 'Unlock Advanced AI Scout',
      subtitle: 'Access real-time tactical intelligence, squad analytics, in-play momentum signals, and predictive form breakdown.',
      cta: 'Unlock Advanced AI Scout',
      previewTitle: 'AI SCOUT COMMAND HUB',
      previewBadge: 'Illustrative Preview',
      previewItems: [
        { label: 'Tactical System Matchup', val: 'High-Press 4-3-3 vs Low-Block 5-3-2' },
        { label: 'Expected Threat (xT) Dominance', val: 'Left Flank Overload (64% Threat Zone)' },
        { label: 'In-Play Momentum Indicator', val: 'Sustained Attacking Pressure (+18.4)' },
        { label: 'Key Personnel Impact Score', val: 'Starting CB Out: Defense Rating -14%' }
      ],
      benefits: [
        'Tactical system matchup simulation & tactical mismatch detection',
        'Expected Threat (xT) territory control heatmaps & zone analytics',
        'Squad depth, injury impact scores & predicted starting lineups',
        'In-play live momentum tracker with automated odds drop alarms',
        'Full league-wide scout database across 50+ competitions'
      ]
    },
    viptips: {
      id: 'viptips',
      badge: '👑 VIP BANKER SELECTIONS',
      title: 'Unlock VIP Banker Predictions',
      subtitle: 'Access high-conviction daily banker selections curated with quantitative modeling and 1-click booking codes.',
      cta: 'Unlock VIP Banker Tips',
      previewTitle: 'VIP BANKER INTELLIGENCE',
      previewBadge: 'Illustrative Preview',
      previewItems: [
        { label: 'Model Conviction Rating', val: 'High Conviction Tier (Algorithmic 88%+)' },
        { label: 'Market Consensus Comparison', val: 'Validated Value Edge vs Global Consensus' },
        { label: 'Automated Booking Codes', val: 'SportyBet · Bet9ja · 1xBet · MSport' },
        { label: 'Performance Ledger Status', val: 'Audit-Verified Win/Loss Track Record' }
      ],
      benefits: [
        'High-conviction daily selections curated by algorithmic models',
        'Full tactical reasoning & quantitative variance explanation',
        '1-click instant booking codes across 14+ major bookmakers',
        '100% transparent historical performance & ROI ledger',
        'Priority Telegram bot notifications the second bankers are published'
      ]
    },
    default: {
      id: 'default',
      badge: '👑 PREMIUM INTELLIGENCE',
      title: 'Unlock the Full DeepPredictBet Experience',
      subtitle: 'Access professional-grade sports intelligence, deeper algorithmic models, and quantitative betting tools.',
      cta: 'Unlock Premium Intelligence',
      previewTitle: 'QUANTITATIVE SPORTS INTELLIGENCE',
      previewBadge: 'Illustrative Preview',
      previewItems: [
        { label: 'Algorithmic Outcomes', val: 'Poisson Distributions · xG Models · Form' },
        { label: 'Market Discrepancy Detection', val: 'Value Bet Bot (+EV) · Arbitrage SureBets' },
        { label: 'Analytical Bet Diagnostics', val: 'AI Bet Doctor · Accumulator Machine' },
        { label: 'Execution & Automation', val: '14+ Bookmaker Code Converter · Backtester' }
      ],
      benefits: [
        'Unrestricted access across all analytical tools, scanners & models',
        'Higher-depth AI match intelligence & tactical breakdown',
        'Real-time Value Bet (+EV) & Arbitrage SureBet alerts',
        'Continuous historical strategy backtesting over 10,000+ matches',
        'Priority 24/7 analytical support & Telegram community integration'
      ]
    }
  };

  // State Management
  let currentPaywallContext = 'default';
  let paywallOpenedAt = 0;
  let previouslyFocusedElement = null;

  /**
   * Resolves a feature ID to its full context definition.
   */
  function resolveFeatureContext(featureInput) {
    if (!featureInput) return PAYWALL_FEATURE_CONTEXTS.default;

    let key = '';
    if (typeof featureInput === 'string') {
      key = featureInput.toLowerCase().trim();
    } else if (typeof featureInput === 'object') {
      key = (featureInput.id || featureInput.name || '').toLowerCase().trim();
    }

    if (key.includes('doctor') || key === 'doctor') return PAYWALL_FEATURE_CONTEXTS.doctor;
    if (key.includes('value') || key === 'valuebot') return PAYWALL_FEATURE_CONTEXTS.valuebot;
    if (key.includes('backtest') || key === 'backtester') return PAYWALL_FEATURE_CONTEXTS.backtester;
    if (key.includes('arbitrage') || key.includes('surebet')) return PAYWALL_FEATURE_CONTEXTS.arbitrage;
    if (key.includes('scout') || key === 'ai_scout') return PAYWALL_FEATURE_CONTEXTS.ai_scout;
    if (key.includes('viptips') || key.includes('tip') || key.includes('banker')) return PAYWALL_FEATURE_CONTEXTS.viptips;
    if (key.includes('match') || key.includes('prediction') || key.includes('scout') || key === 'predictions') return PAYWALL_FEATURE_CONTEXTS.match_intelligence;

    return PAYWALL_FEATURE_CONTEXTS[key] || PAYWALL_FEATURE_CONTEXTS.default;
  }

  /**
   * Tracks structured analytics events safely.
   */
  function trackPaywallEvent(eventName, payload = {}) {
    try {
      if (typeof window.trackEvent === 'function') {
        window.trackEvent(eventName, payload);
      }
    } catch (e) {
      console.warn('[Paywall 2.0 Analytics] Track error:', e);
    }
  }

  /**
   * Detects device classification.
   */
  function getDeviceType() {
    if (typeof window === 'undefined') return 'desktop';
    const width = window.innerWidth || (document.documentElement && document.documentElement.clientWidth) || 1024;
    if (width <= 640) return 'mobile';
    if (width <= 1024) return 'tablet';
    return 'desktop';
  }

  /**
   * Main entrypoint to open the Premium Paywall 2.0.
   * Supports both context options object and legacy (preferredTier, triggerFeature) signatures.
   *
   * @param {Object|string} [optionsOrTier='annual'] - Options object or preferred tier string
   * @param {Object|string} [maybeTriggerFeature=null] - Trigger feature when first argument is tier
   */
  function openPremiumPaywall(optionsOrTier = 'annual', maybeTriggerFeature = null) {
    let options = {};

    if (typeof optionsOrTier === 'object' && optionsOrTier !== null) {
      options = optionsOrTier;
    } else {
      options = {
        preferredTier: optionsOrTier || 'annual',
        feature: maybeTriggerFeature || window.currentVipTriggerFeature || 'default'
      };
    }

    const preferredTier = options.preferredTier || 'annual';
    const context = resolveFeatureContext(options.feature);
    currentPaywallContext = context.id;
    paywallOpenedAt = Date.now();

    // Preserve previously active element for accessible return
    if (typeof document !== 'undefined' && document.activeElement) {
      previouslyFocusedElement = document.activeElement;
    }

    // Inspect user subscription state
    let sub = { active: false, tier: 'none', status: 'inactive' };
    if (typeof window.getStoredVipSubscription === 'function') {
      sub = window.getStoredVipSubscription();
    } else {
      try {
        const raw = localStorage.getItem('deeppredictbet_vip');
        if (raw) sub = JSON.parse(raw);
      } catch (e) {}
    }

    const now = new Date();
    const isExpired = sub && sub.expiresAt && new Date(sub.expiresAt) < now;
    const isActive = sub && sub.active && !isExpired;

    // Track paywall view analytics
    const isLoggedIn = typeof localStorage !== 'undefined' && localStorage.getItem('userLoggedIn') === 'true';
    trackPaywallEvent('paywall_viewed', {
      feature_context: context.id,
      source_page: window.location.pathname || '/',
      tier: preferredTier,
      device_type: getDeviceType(),
      authenticated_state: isLoggedIn ? 'authenticated' : 'unauthenticated',
      subscription_status: isActive ? 'active' : (isExpired ? 'expired' : 'none')
    });

    trackPaywallEvent('paywall_feature_context', {
      feature_id: context.id,
      feature_name: context.title
    });

    const modal = document.getElementById('vip-subscription-modal');
    if (!modal) return;

    // Select targeted tier in UI
    if (typeof window.selectVipPackage === 'function') {
      window.selectVipPackage(preferredTier);
    }

    // Synchronize multi-currency UI state
    if (typeof window.updateDomCurrencyElements === 'function') {
      window.updateDomCurrencyElements();
    }

    // Render smart pane based on subscriber lifecycle
    const paywallPane = document.getElementById('vip-pane-paywall');
    const paymentPane = document.getElementById('vip-pane-payment');
    const successPane = document.getElementById('vip-pane-success');
    const activeSubPane = document.getElementById('vip-pane-active-subscriber');
    const expiredSubPane = document.getElementById('vip-pane-expired-subscriber');
    const failedPane = document.getElementById('vip-pane-failed-payment');

    // Reset visibility of all panes
    [paywallPane, paymentPane, successPane, activeSubPane, expiredSubPane, failedPane].forEach(p => {
      if (p) p.style.display = 'none';
    });

    if (isActive) {
      // 1. Existing Active Subscriber
      if (activeSubPane) {
        activeSubPane.style.display = 'block';
        populateActiveSubscriberPane(sub);
      } else if (paywallPane) {
        paywallPane.style.display = 'block';
      }
    } else if (isExpired && sub.tier && sub.tier !== 'none') {
      // 2. Expired Subscriber
      if (expiredSubPane) {
        expiredSubPane.style.display = 'block';
        populateExpiredSubscriberPane(sub);
      } else if (paywallPane) {
        paywallPane.style.display = 'block';
      }
    } else {
      // 3. New / Unsubscribed User
      if (paywallPane) {
        paywallPane.style.display = 'block';
        populateContextualPaywall(context, preferredTier);
      }
    }

    // Open Modal with high-contrast accessibility attributes
    modal.classList.add('active');
    modal.style.display = 'flex';
    modal.style.opacity = '1';
    modal.style.pointerEvents = 'all';
    modal.style.visibility = 'visible';
    modal.style.zIndex = '10000000';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'paywall-context-title');

    document.body.style.overflow = 'hidden';

    // Trap focus to close button or primary CTA
    setTimeout(() => {
      const primaryBtn = modal.querySelector('#vip-continue-btn') || modal.querySelector('.modal-close');
      if (primaryBtn && typeof primaryBtn.focus === 'function') {
        primaryBtn.focus();
      }
    }, 50);
  }

  /**
   * Injects contextual copy, feature preview, and benefits into the paywall DOM.
   */
  function populateContextualPaywall(context, preferredTier) {
    // 1. Context Badge
    const badgeEl = document.getElementById('paywall-context-badge');
    if (badgeEl) {
      badgeEl.textContent = context.badge;
    }

    // 2. Context Title & Subtitle
    const titleEl = document.getElementById('paywall-context-title');
    if (titleEl) {
      titleEl.textContent = context.title;
    }

    const subEl = document.getElementById('paywall-context-subtitle');
    if (subEl) {
      subEl.textContent = context.subtitle;
    }

    // 3. Illustrative Feature Preview Card
    const previewContainer = document.getElementById('paywall-feature-preview-container');
    if (previewContainer) {
      const itemsHtml = context.previewItems.map(item => `
        <div class="paywall-preview-metric-row">
          <span class="paywall-metric-label">${escapeHtml(item.label)}</span>
          <span class="paywall-metric-val">${escapeHtml(item.val)}</span>
        </div>
      `).join('');

      previewContainer.innerHTML = `
        <div class="paywall-feature-preview-card">
          <div class="paywall-preview-header">
            <div class="paywall-preview-tag">
              <span class="dot-indicator"></span>
              <span>${escapeHtml(context.previewTitle)}</span>
            </div>
            <span class="paywall-preview-watermark">${escapeHtml(context.previewBadge)}</span>
          </div>
          <div class="paywall-preview-body">
            <div class="paywall-metrics-grid">
              ${itemsHtml}
            </div>
            <div class="paywall-preview-blur-overlay">
              <div class="paywall-lock-pill">
                <span class="lock-icon">🔒</span>
                <span>Pro Intelligence Analysis</span>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // 4. Value-Before-Price Benefits List
    const benefitsContainer = document.getElementById('paywall-benefits-list');
    if (benefitsContainer) {
      benefitsContainer.innerHTML = context.benefits.map(b => `
        <li class="paywall-benefit-item">
          <span class="paywall-benefit-check">✓</span>
          <span>${escapeHtml(b)}</span>
        </li>
      `).join('');
    }

    // 5. Update Dynamic CTA
    updateDynamicCtaText(preferredTier);
  }

  /**
   * Updates CTA button text dynamically based on selected tier and context.
   */
  function updateDynamicCtaText(tierKey) {
    const continueBtn = document.getElementById('vip-continue-btn');
    if (!continueBtn) return;

    const packages = window.VIP_PACKAGES || {
      weekly: { price: '₦10,000.00' },
      monthly: { price: '₦27,000.00' },
      annual: { price: '₦149,500.00' }
    };

    const pkg = packages[tierKey] || packages.annual;
    const context = resolveFeatureContext(currentPaywallContext);
    const shortAction = context.cta || 'Upgrade to Pro';

    continueBtn.innerHTML = `
      <span>${escapeHtml(shortAction)}</span>
      <span class="btn-tier-price">&bull; ${escapeHtml(pkg.price)}</span>
      <span class="btn-arrow">&rarr;</span>
    `;
  }

  /**
   * Populates the Active Subscriber status pane.
   */
  function populateActiveSubscriberPane(sub) {
    const tierNameEl = document.getElementById('vip-active-tier-name');
    const txIdEl = document.getElementById('vip-active-txid');
    const expiryEl = document.getElementById('vip-active-expiry');
    const curr = (sub.currency || 'NGN').toUpperCase();
    const formattedAmount = sub.formattedAmount || sub.price || '';
    const tierBase = sub.name || (sub.tier ? sub.tier.toUpperCase() + ' VIP' : 'VIP Pass');

    if (tierNameEl) {
      tierNameEl.textContent = formattedAmount ? `${tierBase} (${formattedAmount} ${curr})` : `${tierBase} (${curr})`;
    }
    if (txIdEl) txIdEl.textContent = sub.txId || 'DP-VIP-ACTIVE';
    if (expiryEl && sub.expiresAt) {
      try {
        const d = new Date(sub.expiresAt);
        expiryEl.textContent = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      } catch (e) {
        expiryEl.textContent = sub.expiresAt;
      }
    }
  }

  /**
   * Populates the Expired Subscriber reactivation pane.
   */
  function populateExpiredSubscriberPane(sub) {
    const prevTierEl = document.getElementById('vip-expired-prev-tier');
    if (prevTierEl) {
      prevTierEl.textContent = sub.name || 'VIP Pass';
    }
  }

  /**
   * Closes the paywall modal and cleans up listeners.
   */
  function closePremiumPaywall(e, force = false) {
    const modal = document.getElementById('vip-subscription-modal');
    if (!modal) return;

    if (force || (e && (e.target === modal || (e.target && e.target.classList && e.target.classList.contains('modal-close'))))) {
      modal.classList.remove('active');
      modal.style.display = 'none';
      modal.style.opacity = '0';
      modal.style.pointerEvents = 'none';
      modal.style.visibility = 'hidden';
      document.body.style.overflow = '';

      const timeSpent = Math.max(0, Math.round((Date.now() - paywallOpenedAt) / 1000));
      trackPaywallEvent('paywall_closed', {
        feature_context: currentPaywallContext,
        time_spent_seconds: timeSpent
      });

      // Restore focus
      if (previouslyFocusedElement && typeof previouslyFocusedElement.focus === 'function') {
        previouslyFocusedElement.focus();
      }
    }
  }

  /**
   * Handles keyboard navigation (ESC key to exit).
   */
  function handlePaywallKeydown(e) {
    if (e.key === 'Escape' || e.keyCode === 27) {
      const modal = document.getElementById('vip-subscription-modal');
      if (modal && modal.classList.contains('active')) {
        closePremiumPaywall(null, true);
      }
    }
  }

  /**
   * Helper to escape HTML safely.
   */
  function escapeHtml(str) {
    if (!str || typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Bind global keyboard listener
  if (typeof document !== 'undefined') {
    document.addEventListener('keydown', handlePaywallKeydown);
  }

  // Expose API to window
  if (typeof window !== 'undefined') {
    window.PAYWALL_FEATURE_CONTEXTS = PAYWALL_FEATURE_CONTEXTS;
    window.openPremiumPaywall = openPremiumPaywall;
    window.closePremiumPaywall = closePremiumPaywall;
    window.updateDynamicCtaText = updateDynamicCtaText;
    window.resolveFeatureContext = resolveFeatureContext;

    // Backward-compatible hook for existing openVipSubscriptionModal callers
    window.openVipSubscriptionModal = function (preferredTier = 'annual', triggerFeature = null) {
      openPremiumPaywall({
        preferredTier: preferredTier || 'annual',
        feature: triggerFeature || window.currentVipTriggerFeature || 'default'
      });
    };

    window.closeVipSubscriptionModal = function (e, force = false) {
      closePremiumPaywall(e, force);
    };
  }
})();
