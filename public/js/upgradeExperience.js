/**
 * DeepPredictBet — Unified Upgrade Experience Engine
 * Single Source of Truth for Non-Blocking SaaS Upgrade Components.
 *
 * Core Design Principle:
 * Never make the user feel: "You are blocked."
 * Instead: "You have discovered a capability. Here's what you can unlock by upgrading."
 *
 * Reusable Components:
 * 1. FeatureUpgradePrompt — Inline discovery card for gated capabilities
 * 2. UsageLimitBanner — Standardized quota status & allowance reached banner
 * 3. UpgradeModal — Unified multi-tier, multi-currency upgrade modal controller
 * 4. LockedCapability — Discovery teaser overlay for advanced analytical tables
 * 5. PlanComparison — Clean Free vs Pro vs VIP comparison grid
 * 6. UsageMeter — Visual progress gauge with live daily quota tracking
 */

(function (root, factory) {
  'use strict';
  const engine = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = engine;
  }
  if (typeof root !== 'undefined') {
    root.DeepPredictUpgrade = engine;
    if (root.window) root.window.DeepPredictUpgrade = engine;
  }
  if (typeof window !== 'undefined') {
    window.DeepPredictUpgrade = engine;
  }
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this), function () {
  'use strict';

  // --- 1. FEATURE METADATA & DISCOVERY DICTIONARY ---
  const FEATURE_METADATA = {
    converter: {
      name: 'Booking Code Converter',
      noun: 'conversion',
      nounPlural: 'conversions',
      defaultTier: 'PRO',
      discoveryTitle: 'Discover High-Volume Booking Code Conversion',
      discoverySubtitle: 'You have discovered cross-platform booking code conversion. While free daily conversions are available every calendar day, upgrading unlocks expanded allowances and fast-sync execution.',
      benefits: [
        'Expanded daily conversions (PRO: 30/day, VIP: Unlimited)',
        'Multi-bookmaker fast-sync relay fallback if primary gateway is busy',
        'Decoded match selection breakdowns with full market mapping',
        'Historical conversion ledgers with 1-click re-generation'
      ],
      previewMetrics: [
        { name: 'Supported Bookmakers', value: '20+ Global Bookies' },
        { name: 'Gateway Latency', value: '<450ms Fast-Sync' },
        { name: 'Market Mapping Fidelity', value: '99.4% Algorithmic Accuracy' },
        { name: 'Relay Fallback', value: 'Automated 4-Gateway Routing' }
      ],
      unlocks: [
        '30 daily conversions on PRO tier (10x Free allowance)',
        'Unlimited conversions on VIP Club tier with priority routing',
        'Permanent conversion history tracking in personal portfolio'
      ]
    },
    doctor: {
      name: 'AI Bet Doctor',
      noun: 'diagnostic audit',
      nounPlural: 'diagnostic audits',
      defaultTier: 'PRO',
      discoveryTitle: 'Discover Accumulator Risk & Correlation Diagnostics',
      discoverySubtitle: 'You have discovered the AI Bet Doctor. Standard prediction views are always available, while upgrading to PRO unlocks deep multi-leg covariance audits and algorithmic replacement picks.',
      benefits: [
        'Correlation & negative covariance risk detection across accumulator legs',
        'Algorithmic leg replacement recommendations with higher expected value (+EV)',
        'Empirical probability health score (0-100) calibrated against historical variance',
        'Expanded daily audit allowances (PRO: 15/day, VIP: Unlimited)'
      ],
      previewMetrics: [
        { name: 'Slip Health Score', value: '74 / 100 (Optimal)' },
        { name: 'Negative Covariance', value: '0 Conflicting Markets' },
        { name: 'Algorithmic Optimization', value: '+14.2% True Yield' },
        { name: 'Replacement Leg Pick', value: 'Home Over 1.5 Goals (@1.68)' }
      ],
      unlocks: [
        '15 daily accumulator diagnostic audits on PRO tier',
        'Unlimited daily audits on VIP Club tier',
        'Instant 1-click replacement synchronization with active betslip'
      ]
    },
    valuebot: {
      name: 'Value Bet Bot (+EV Scanner)',
      noun: 'value scan',
      nounPlural: 'value scans',
      defaultTier: 'PRO',
      discoveryTitle: 'Discover Mathematical Positive Expected Value (+EV)',
      discoverySubtitle: 'You have discovered our live positive expected value (+EV) scanner. While standard match predictions are always accessible, PRO unlocks real-time discrepancies between Poisson fair odds and 50+ bookmakers.',
      benefits: [
        'Real-time market discrepancy detection across 50 global sportsbooks',
        'Poisson-based fair odds calculation vs live bookmaker prices',
        'Expected value (+EV) percentage & edge over closing line',
        'Quarter-Kelly staking sizing recommendations for disciplined bankroll growth'
      ],
      previewMetrics: [
        { name: 'Identified EV Edge', value: '+8.4% Net Edge' },
        { name: 'Fair Poisson Odds', value: '1.82 (Implied 54.9%)' },
        { name: 'Best Market Line', value: '2.05 (SportyBet)' },
        { name: 'Kelly Sizing', value: '1.8% Bankroll Allocation' }
      ],
      unlocks: [
        'Full real-time +EV opportunity feeds across all European & World leagues',
        'Customizable EV threshold filters (+3%, +5%, +10%)',
        'Instant mobile & Telegram mispricing alerts on VIP tier'
      ]
    },
    arbitrage: {
      name: 'Arbitrage SureBet Finder',
      noun: 'surebet scan',
      nounPlural: 'surebet scans',
      defaultTier: 'VIP',
      discoveryTitle: 'Discover Mathematical Cross-Market Arbitrage',
      discoverySubtitle: 'You have discovered our zero-risk cross-bookmaker arbitrage scanner. While standard betting tools remain free, VIP Club unlocks live mathematical price divergences with guaranteed execution splits.',
      benefits: [
        'Continuous scanning across 50 sportsbooks for mathematical divergence',
        'Guaranteed net return calculations on two-way and three-way markets',
        'Dynamic stake calculator with automated currency rounding',
        'Rapid execution window timers and direct bookmaker deep-links'
      ],
      previewMetrics: [
        { name: 'Net SureBet ROI', value: '+3.15% Guaranteed' },
        { name: 'Leg 1 Execution', value: 'Bookmaker A Over 2.5 (@2.15)' },
        { name: 'Leg 2 Execution', value: 'Bookmaker B Under 2.5 (@2.02)' },
        { name: 'Optimal Stake Split', value: '₦51,400 / ₦48,600' }
      ],
      unlocks: [
        'Full access to all real-time arbitrage splits (2-way and 3-way)',
        'Automated live window countdown alerts',
        'VIP priority Telegram push alarms for rapid execution'
      ]
    },
    backtester: {
      name: 'Strategy Backtesting Engine',
      noun: 'backtest simulation',
      nounPlural: 'backtest simulations',
      defaultTier: 'VIP',
      discoveryTitle: 'Discover Multi-Season Strategy Backtesting',
      discoverySubtitle: 'You have discovered the Strategy Backtesting Engine. Standard form and fixture tools remain free, while VIP Club unlocks historical model simulations over 10,000+ matches with drawdown stress-testing.',
      benefits: [
        'Simulate betting rules over 10,000+ historical league outcomes',
        'Custom bankroll models: Flat, Proportional, and Fractional Kelly staking',
        'Monte Carlo variance simulation (P10, Median P50, P90 return curves)',
        'Detailed maximum peak-to-trough drawdown and Sharpe ratio analytics'
      ],
      previewMetrics: [
        { name: 'Sample Size Tested', value: '1,420 European Matches' },
        { name: 'Historical Win Rate', value: '81.7% Strike Rate' },
        { name: 'Cumulative ROI', value: '+14.6% Net Yield' },
        { name: 'Max Drawdown', value: '3.17% (Low Volatility)' }
      ],
      unlocks: [
        'Unlimited historical strategy simulations and parameter configurations',
        'In-sample vs out-of-sample statistical split validation',
        'Export verified historical test logs to CSV for external modeling'
      ]
    },
    scout: {
      name: 'AI Tactical Scout',
      noun: 'tactical inquiry',
      nounPlural: 'tactical inquiries',
      defaultTier: 'PRO',
      discoveryTitle: 'Discover Conversational Tactical Intelligence',
      discoverySubtitle: 'You have discovered AI Scout. While daily starter inquiries are provided free, upgrading unlocks high-frequency tactical queries, expected threat (xT) analysis, and live accumulator risk evaluation.',
      benefits: [
        'Natural language tactical queries and squad depth evaluation',
        'Expected Threat (xT) and field control zone breakdown',
        'Real-time accumulator evaluation and leg compatibility checks',
        'Expanded daily inquiries (PRO: 10/day, VIP: Unlimited)'
      ],
      previewMetrics: [
        { name: 'Tactical Matchup', value: 'High Press 4-3-3 vs Low Block' },
        { name: 'Attacking Threat Zone', value: '62% Left Flank Overload' },
        { name: 'Key Player Impact', value: 'Starting Striker Out (-18% xG)' },
        { name: 'Model Conviction', value: 'Very High (84% Model Certainty)' }
      ],
      unlocks: [
        '10 conversational inquiries daily on PRO tier',
        'Unlimited conversational inquiries on VIP Club tier',
        'Direct deep-links from AI answers into betslip and converter tools'
      ]
    },
    generator: {
      name: 'Accumulator Machine',
      noun: 'accumulator run',
      nounPlural: 'accumulator runs',
      defaultTier: 'PRO',
      discoveryTitle: 'Discover Algorithmic Ticket Generation',
      discoverySubtitle: 'You have discovered the Accumulator Machine. Free daily generations are available, while upgrading to PRO unlocks high-frequency ticket generation with advanced statistical risk filters.',
      benefits: [
        'Algorithmic ticket compilation matching target odds and risk profiles',
        'Statistical filters for maximum variance reduction and strike rate',
        'Direct 1-click addition to active betslip or booking code converter',
        'Expanded daily generations (PRO: 10/day, VIP: Unlimited)'
      ],
      previewMetrics: [
        { name: 'Target Odds Range', value: '5.00 - 15.00 Total Odds' },
        { name: 'Optimal Leg Count', value: '4 High-Conviction Matches' },
        { name: 'Risk Profile', value: 'Conservative (High Strike Rate)' },
        { name: 'Composite Model Win%', value: '68.4% Empirical Expectation' }
      ],
      unlocks: [
        '10 algorithmic accumulator runs daily on PRO tier',
        'Unlimited accumulator runs on VIP Club tier',
        'Advanced correlation filtering to avoid conflicting legs'
      ]
    },
    viptips: {
      name: 'VIP Banker Selections',
      noun: 'banker view',
      nounPlural: 'banker views',
      defaultTier: 'VIP',
      discoveryTitle: 'Discover High-Conviction VIP Banker Tips',
      discoverySubtitle: 'You have discovered VIP Banker Selections. Standard daily match predictions remain free, while VIP Club unlocks daily high-conviction banker tickets curated by our algorithmic models.',
      benefits: [
        'Curated high-conviction daily banker tickets with quantitative reasoning',
        'Pre-converted booking codes ready for 1-click loading on major bookmakers',
        '100% transparent audit ledger tracking win/loss outcomes and ROI',
        'Instant Telegram push alerts the moment banker tickets are published'
      ],
      previewMetrics: [
        { name: 'Model Conviction', value: '88%+ Algorithmic Confidence' },
        { name: 'Target Daily Odds', value: '@2.10 - @3.50 High-Yield' },
        { name: 'Audited Track Record', value: 'Verified Historical Ledger' },
        { name: 'Booking Codes', value: 'SportyBet · Bet9ja · 1xBet' }
      ],
      unlocks: [
        'Full daily access to all published VIP Banker slips',
        'Real-time Telegram notifications when bankers drop',
        'Access to full historical banker performance ledgers'
      ]
    },
    default: {
      name: 'DeepPredictBet Intelligence',
      noun: 'analytical tool',
      nounPlural: 'analytical tools',
      defaultTier: 'PRO',
      discoveryTitle: 'Discover Advanced Football Intelligence',
      discoverySubtitle: 'You have discovered advanced sports intelligence capabilities. While standard match models and daily predictions remain 100% free, upgrading unlocks our full suite of professional betting tools.',
      benefits: [
        'Expanded allowances across booking code converter, doctor, and generator',
        'Live Value Bet Bot (+EV) and Arbitrage SureBet market scanners',
        'Historical strategy backtesting and variance stress-testing',
        'Priority execution with 1-click cancellation anytime'
      ],
      previewMetrics: [
        { name: 'Algorithms Active', value: 'Poisson · xG · Covariance' },
        { name: 'League Coverage', value: '50+ Global Competitions' },
        { name: 'Live Discrepancies', value: 'Real-Time Market Scanner' },
        { name: 'Cancellation Policy', value: '1-Click Instant Cancellation' }
      ],
      unlocks: [
        'Full suite access with expanded daily tool allowances',
        'Ad-free high-speed analytical dashboard experience',
        'Priority customer and community Telegram access'
      ]
    }
  };

  // --- HELPER FORMATTERS ---
  function getMetadata(featureKey) {
    const key = String(featureKey || 'default').toLowerCase().trim();
    if (key.includes('convert') || key === 'converter') return FEATURE_METADATA.converter;
    if (key.includes('doctor')) return FEATURE_METADATA.doctor;
    if (key.includes('value') || key === 'valuebot') return FEATURE_METADATA.valuebot;
    if (key.includes('arbitrage') || key.includes('surebet')) return FEATURE_METADATA.arbitrage;
    if (key.includes('backtest') || key === 'backtester') return FEATURE_METADATA.backtester;
    if (key.includes('scout')) return FEATURE_METADATA.scout;
    if (key.includes('generator') || key.includes('machine')) return FEATURE_METADATA.generator;
    if (key.includes('tip') || key === 'viptips') return FEATURE_METADATA.viptips;
    return FEATURE_METADATA[key] || FEATURE_METADATA.default;
  }

  function formatFeatureName(featureKey) {
    return getMetadata(featureKey).name;
  }

  function formatToolNoun(featureKey) {
    return getMetadata(featureKey).noun;
  }

  function formatToolNounPlural(featureKey) {
    return getMetadata(featureKey).nounPlural;
  }

  function getDoc() {
    if (typeof document !== 'undefined') return document;
    if (typeof window !== 'undefined' && window.document) return window.document;
    return null;
  }

  // --- 2. GLOBAL DISMISS & CONTINUE EXPLORING ENGINE ---
  /**
   * Universal escape hatch that smoothly dismisses modals or inline prompts
   * while keeping 100% of all application functionality intact.
   *
   * @param {string} [context='general'] - The context where user opted to continue
   */
  function continueExploring(context = 'general') {
    // 1. Close upgrade / paywall modal if active
    if (typeof window !== 'undefined') {
      if (typeof window.closeVipSubscriptionModal === 'function') {
        window.closeVipSubscriptionModal(null, true);
      }
    }

    // 2. Broadcast friendly reassurance toast
    if (typeof window !== 'undefined' && typeof window.showAppNotification === 'function') {
      window.showAppNotification('Enjoy exploring DeepPredictBet! All standard predictions and tools remain fully active.', 'info');
    }

    // 3. Analytics telemetry
    if (typeof window !== 'undefined' && typeof window.trackEvent === 'function') {
      window.trackEvent('UPGRADE_CONTINUE_EXPLORING', {
        context: String(context),
        timestamp: new Date().toISOString()
      });
    }
  }

  // --- 3. COMPONENT 1: FeatureUpgradePrompt ---
  const FeatureUpgradePrompt = {
    createHtml(options = {}) {
      const featureKey = options.featureKey || 'default';
      const meta = getMetadata(featureKey);
      const targetTier = (options.targetTier || meta.defaultTier || 'PRO').toUpperCase();
      const title = options.title || meta.discoveryTitle;
      const subtitle = options.subtitle || meta.discoverySubtitle;
      const benefits = options.benefits || meta.benefits;
      const contextId = options.contextId || featureKey;

      return `
        <div class="feature-upgrade-prompt-card ${targetTier === 'VIP' ? 'tier-vip' : 'tier-pro'}" id="prompt-${contextId}">
          <div class="fup-top-bar">
            <div class="fup-discovery-badge">
              <span class="fup-badge-sparkle">${targetTier === 'VIP' ? '👑' : '✨'}</span>
              <span>DISCOVERED ${targetTier} CAPABILITY</span>
            </div>
            <span class="fup-context-tag">${meta.name}</span>
          </div>

          <h3 class="fup-title">${title}</h3>
          <p class="fup-subtitle">${subtitle}</p>

          <div class="fup-benefits-grid">
            ${benefits.map(b => `
              <div class="fup-benefit-item">
                <span class="fup-check">✓</span>
                <span>${b}</span>
              </div>
            `).join('')}
          </div>

          <div class="fup-actions-row">
            <button type="button" class="fup-btn-primary" onclick="window.DeepPredictUpgrade.UpgradeModal.open('${featureKey}', '${targetTier.toLowerCase()}')">
              <span>⚡ Upgrade to ${targetTier} — Unlock Capability</span>
              <span class="btn-arrow">&rarr;</span>
            </button>
            <button type="button" class="fup-btn-secondary" onclick="window.DeepPredictUpgrade.continueExploring('${featureKey}')">
              <span>Continue exploring DeepPredictBet</span>
            </button>
          </div>

          <div class="fup-reassurance-note">
            <span>🛡️ All standard predictions, betslip builder, and tools remain 100% active and accessible.</span>
          </div>
        </div>
      `;
    },

    render(containerOrId, options = {}) {
      const doc = getDoc();
      const el = (typeof containerOrId === 'string' && doc) ? doc.getElementById(containerOrId) : containerOrId;
      if (!el) return;
      el.innerHTML = this.createHtml(options);
    }
  };

  // --- 4. COMPONENT 2: UsageLimitBanner ---
  const UsageLimitBanner = {
    createHtml(options = {}) {
      const featureKey = options.featureKey || 'converter';
      const meta = getMetadata(featureKey);

      let ent = { tier: 'FREE', dailyLimit: 3, usedToday: 0, remaining: 3, isQuotaExhausted: false };
      if (typeof window !== 'undefined' && window.Entitlements && typeof window.Entitlements.getFeatureEntitlement === 'function') {
        ent = window.Entitlements.getFeatureEntitlement(featureKey);
      }

      const tier = ent.tier;
      const remaining = ent.remaining;
      const limit = ent.dailyLimit;
      const isExhausted = ent.isQuotaExhausted || remaining <= 0;
      const isUnlimited = limit === Infinity || tier === 'VIP' || tier === 'ADMIN';

      // State A: Unlimited Access (VIP / Admin)
      if (isUnlimited) {
        return `
          <div class="usage-limit-banner banner-unlimited">
            <div class="ulb-content">
              <span class="ulb-icon">${tier === 'ADMIN' ? '⚡' : '👑'}</span>
              <div class="ulb-text-group">
                <div class="ulb-headline"><b>${tier} Access Active</b> — Unlimited ${meta.nounPlural} enabled</div>
                <div class="ulb-subtext">You have unrestricted daily access with high-priority execution.</div>
              </div>
            </div>
            <span class="ulb-status-pill pill-unlimited">Unlimited Active</span>
          </div>
        `;
      }

      // State B: Quota Exhausted (0 remaining) — Strictly adheres to the example prompt specification!
      if (isExhausted) {
        const isFree = tier === 'FREE' || tier === 'PUBLIC';
        const targetTier = isFree ? 'Pro' : 'VIP';
        const upgradeArg = isFree ? 'pro' : 'annual';

        let headline = `Today's free ${meta.noun} allowance has been reached.`;
        let bodyUsed = `Free ${meta.nounPlural} remaining today: 0. You've used your ${limit} free ${meta.nounPlural} for today.`;
        let bodyPro = (featureKey.includes('convert') || featureKey === 'converter')
          ? `${targetTier.toUpperCase()} gives you expanded booking-code conversion access.`
          : `${targetTier.toUpperCase()} gives you expanded ${meta.noun} access.`;

        if (tier === 'PRO') {
          headline = `Today's PRO ${meta.noun} allowance has been reached (${limit}/${limit} used).`;
          bodyUsed = `You have utilized your full Pro allowance of ${limit} ${meta.nounPlural} today.`;
          bodyPro = `VIP gives you unlimited ${meta.noun} access with priority gateway routing.`;
        }

        return `
          <div class="usage-limit-banner banner-exhausted" id="banner-${featureKey}-exhausted">
            <div class="ulb-main-body">
              <div class="ulb-header-line">
                <span class="ulb-warning-icon">⚠️</span>
                <div class="ulb-headline">${headline}</div>
              </div>
              <div class="ulb-copy-text">
                <p class="ulb-p-used" style="margin: 0 0 4px 0; color: #cbd5e1; font-size: 0.86rem;">${bodyUsed}</p>
                <p class="ulb-p-pro" style="margin: 0 0 12px 0; color: #93c5fd; font-weight: 600; font-size: 0.86rem;">${bodyPro}</p>
              </div>
              <div class="ulb-action-row">
                <button type="button" class="ulb-upgrade-btn" onclick="window.DeepPredictUpgrade.UpgradeModal.open('${featureKey}', '${upgradeArg}')">
                  <span>⚡ Upgrade to ${targetTier}</span>
                  <span class="btn-arrow">&rarr;</span>
                </button>
                <button type="button" class="ulb-continue-btn" onclick="window.DeepPredictUpgrade.continueExploring('${featureKey}')">
                  <span>Continue exploring DeepPredictBet</span>
                </button>
              </div>
            </div>
            <div class="ulb-intact-note">
              <span>🛡️ All other app functionality, predictions, and tools remain 100% intact.</span>
            </div>
          </div>
        `;
      }

      // State C: Active (Quota Remaining > 0)
      const tierLabel = tier === 'PRO' ? 'Pro' : 'Free';
      const isCaution = remaining === 1;

      return `
        <div class="usage-limit-banner banner-active ${isCaution ? 'banner-caution' : ''}">
          <div class="ulb-content">
            <span class="ulb-icon">${isCaution ? '⏳' : '🔄'}</span>
            <div class="ulb-text-group">
              <div class="ulb-headline">
                ${tierLabel} ${meta.nounPlural} remaining today: <strong class="ulb-count-num" style="color: #60a5fa; font-size: 0.95rem;">${remaining}</strong> <span class="ulb-limit-denom">(of ${limit})</span>
              </div>
              <div class="ulb-subtext">Resets at 00:00 UTC · Standard access active</div>
            </div>
          </div>
          <div class="ulb-right-actions">
            <a href="javascript:void(0)" class="ulb-explore-link" onclick="window.DeepPredictUpgrade.UpgradeModal.open('${featureKey}', '${tier === 'PRO' ? 'annual' : 'pro'}')">
              <span>Explore ${tier === 'PRO' ? 'VIP' : 'PRO'} benefits &rarr;</span>
            </a>
          </div>
        </div>
      `;
    },

    render(containerOrId, options = {}) {
      const doc = getDoc();
      const el = (typeof containerOrId === 'string' && doc) ? doc.getElementById(containerOrId) : containerOrId;
      if (!el) return;
      el.innerHTML = this.createHtml(options);
    }
  };

  // --- 5. COMPONENT 3: UpgradeModal Controller ---
  const UpgradeModal = {
    open(featureKey = 'default', preferredTier = 'annual') {
      if (typeof window !== 'undefined') {
        if (typeof window.openPremiumPaywall === 'function') {
          window.openPremiumPaywall(preferredTier, featureKey);
          return;
        }
        if (typeof window.openVipSubscriptionModal === 'function') {
          window.openVipSubscriptionModal(preferredTier, featureKey);
          return;
        }
        if (typeof window.navigateTo === 'function') {
          window.navigateTo('/pricing');
        } else {
          window.location.href = '/pricing';
        }
      }
    },

    close() {
      if (typeof window !== 'undefined' && typeof window.closeVipSubscriptionModal === 'function') {
        window.closeVipSubscriptionModal(null, true);
      }
    }
  };

  // --- 6. COMPONENT 4: LockedCapability ---
  const LockedCapability = {
    createHtml(options = {}) {
      const featureKey = options.featureKey || 'valuebot';
      const meta = getMetadata(featureKey);
      const targetTier = (options.targetTier || meta.defaultTier || 'PRO').toUpperCase();
      const capabilityTitle = options.title || meta.name;
      const capabilityDesc = options.description || meta.discoverySubtitle;
      const previewData = options.previewMetrics || meta.previewMetrics;
      const unlocks = options.unlocks || meta.unlocks;

      return `
        <div class="locked-capability-card ${targetTier === 'VIP' ? 'tier-vip' : 'tier-pro'}">
          <!-- Illustrative Mocked / Faded Surface -->
          <div class="lc-surface-preview" aria-hidden="true">
            <div class="lc-preview-topbar">
              <span class="lc-pulse-dot"></span>
              <span class="lc-preview-label">${capabilityTitle.toUpperCase()} — LIVE ENGINE PREVIEW</span>
              <span class="lc-watermark">Illustrative Data</span>
            </div>
            <div class="lc-preview-grid">
              ${previewData.map(p => `
                <div class="lc-preview-metric">
                  <span class="lc-metric-name">${p.name}</span>
                  <span class="lc-metric-val">${p.value}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Discovery & Unlock Overlay (Never says "Blocked") -->
          <div class="lc-discovery-overlay">
            <div class="lc-overlay-content">
              <div class="lc-badge">
                <span>${targetTier === 'VIP' ? '👑' : '✨'}</span>
                <span>YOU HAVE DISCOVERED A CAPABILITY</span>
              </div>
              <h3 class="lc-title">${capabilityTitle}</h3>
              <p class="lc-desc">${capabilityDesc}</p>

              <div class="lc-unlock-list">
                <div class="lc-unlock-header">Here's what you can unlock by upgrading:</div>
                ${unlocks.map(u => `
                  <div class="lc-unlock-item">
                    <span class="lc-unlock-bullet">✓</span>
                    <span>${u}</span>
                  </div>
                `).join('')}
              </div>

              <div class="lc-action-row">
                <button type="button" class="lc-btn-unlock" onclick="window.DeepPredictUpgrade.UpgradeModal.open('${featureKey}', '${targetTier.toLowerCase()}')">
                  <span>⚡ Unlock ${targetTier} Capability</span>
                  <span class="btn-arrow">&rarr;</span>
                </button>
                <button type="button" class="lc-btn-continue" onclick="window.DeepPredictUpgrade.continueExploring('${featureKey}')">
                  <span>Continue exploring DeepPredictBet</span>
                </button>
              </div>

              <div class="lc-intact-reassurance">
                <span>All standard prediction tables and interactive tools remain 100% active.</span>
              </div>
            </div>
          </div>
        </div>
      `;
    },

    render(containerOrId, options = {}) {
      const doc = getDoc();
      const el = (typeof containerOrId === 'string' && doc) ? doc.getElementById(containerOrId) : containerOrId;
      if (!el) return;
      el.innerHTML = this.createHtml(options);
    },

    wrap(targetElementOrId, options = {}) {
      const doc = getDoc();
      const el = (typeof targetElementOrId === 'string' && doc) ? doc.getElementById(targetElementOrId) : targetElementOrId;
      if (!el) return;
      if (el.classList && typeof el.classList.add === 'function') {
        el.classList.add('capability-wrapped');
      }
      if (!doc || typeof doc.createElement !== 'function') return;
      const wrapper = doc.createElement('div');
      wrapper.className = 'locked-capability-wrapper';
      wrapper.innerHTML = this.createHtml(options);
      if (el.parentNode && typeof el.parentNode.insertBefore === 'function') {
        el.parentNode.insertBefore(wrapper, el);
      }
      if (typeof wrapper.appendChild === 'function') {
        wrapper.appendChild(el);
      }
    }
  };

  // --- 7. COMPONENT 5: PlanComparison ---
  const PlanComparison = {
    createHtml(options = {}) {
      const highlightedTier = options.highlightedTier || 'PRO';

      return `
        <div class="plan-comparison-container" id="unified-plan-comparison">
          <div class="pcc-header">
            <h3 class="pcc-title">Transparent Tier Comparison</h3>
            <p class="pcc-subtitle">Choose the level of analytical intelligence that fits your wagering strategy. Cancel anytime with 1 click.</p>
          </div>

          <div class="pcc-grid">
            <!-- FREE PLAN -->
            <div class="pcc-card ${highlightedTier === 'FREE' ? 'is-highlighted' : ''}">
              <div class="pcc-card-top">
                <span class="pcc-tier-tag tier-tag-free">FREE ACCOUNT</span>
                <h4 class="pcc-tier-name">Public Punter</h4>
                <div class="pcc-price-row">
                  <span class="pcc-amount">₦0</span>
                  <span class="pcc-period">/ forever</span>
                </div>
                <p class="pcc-tier-desc">Essential quantitative prediction models and daily starter allowances.</p>
              </div>
              <ul class="pcc-features-list">
                <li><span class="pcc-check">✓</span> 3 booking code conversions / day</li>
                <li><span class="pcc-check">✓</span> 1 AI Bet Doctor ticket audit / day</li>
                <li><span class="pcc-check">✓</span> 1 Accumulator Generator run / day</li>
                <li><span class="pcc-check">✓</span> 1 AI Scout match inquiry / day</li>
                <li><span class="pcc-check">✓</span> 3 saved tickets in portfolio</li>
                <li><span class="pcc-dash">—</span> Value Bet Bot (+EV Scanner)</li>
                <li><span class="pcc-dash">—</span> Arbitrage SureBet Finder</li>
                <li><span class="pcc-dash">—</span> Strategy Backtesting Engine</li>
                <li><span class="pcc-dash">—</span> VIP Banker Selections</li>
              </ul>
              <div class="pcc-card-footer">
                <button type="button" class="pcc-btn-secondary" onclick="window.DeepPredictUpgrade.continueExploring('free_tier')">
                  Active Free Account
                </button>
              </div>
            </div>

            <!-- PRO PLAN -->
            <div class="pcc-card pcc-card-featured ${highlightedTier === 'PRO' ? 'is-highlighted' : ''}">
              <div class="pcc-featured-badge">MOST POPULAR</div>
              <div class="pcc-card-top">
                <span class="pcc-tier-tag tier-tag-pro">PRO ANALYST</span>
                <h4 class="pcc-tier-name">Pro Bettor</h4>
                <div class="pcc-price-row">
                  <span class="pcc-amount" data-currency-sync="monthly-pro">₦45,000</span>
                  <span class="pcc-period">/ month</span>
                </div>
                <p class="pcc-tier-desc">High-volume conversions, ticket diagnostics, and live +EV discrepancy scanners.</p>
              </div>
              <ul class="pcc-features-list">
                <li><span class="pcc-check">✓</span> <strong>30 conversions / day</strong> (10x Free)</li>
                <li><span class="pcc-check">✓</span> <strong>15 AI Bet Doctor audits / day</strong></li>
                <li><span class="pcc-check">✓</span> <strong>10 Accumulator Generator runs / day</strong></li>
                <li><span class="pcc-check">✓</span> <strong>10 AI Scout inquiries / day</strong></li>
                <li><span class="pcc-check">✓</span> <strong>25 saved tickets</strong> in portfolio</li>
                <li><span class="pcc-check">✓</span> <strong>Value Bet Bot (+EV Scanner) Unlocked</strong></li>
                <li><span class="pcc-check">✓</span> Fast-sync booking code converter</li>
                <li><span class="pcc-dash">—</span> Arbitrage SureBet Finder (VIP Only)</li>
                <li><span class="pcc-dash">—</span> Strategy Backtesting (VIP Only)</li>
              </ul>
              <div class="pcc-card-footer">
                <button type="button" class="pcc-btn-primary" onclick="window.DeepPredictUpgrade.UpgradeModal.open('plan_comparison', 'monthly')">
                  <span>⚡ Upgrade to Pro</span>
                </button>
              </div>
            </div>

            <!-- VIP PLAN -->
            <div class="pcc-card pcc-card-vip ${highlightedTier === 'VIP' ? 'is-highlighted' : ''}">
              <div class="pcc-vip-badge">BEST VALUE · UNLIMITED</div>
              <div class="pcc-card-top">
                <span class="pcc-tier-tag tier-tag-vip">VIP CLUB</span>
                <h4 class="pcc-tier-name">Syndicate Pass</h4>
                <div class="pcc-price-row">
                  <span class="pcc-amount" data-currency-sync="annual-vip">₦149,500</span>
                  <span class="pcc-period">/ year</span>
                </div>
                <p class="pcc-tier-desc">Unrestricted analytical power, cross-market arbitrage, backtesting, and daily bankers.</p>
              </div>
              <ul class="pcc-features-list">
                <li><span class="pcc-check">✓</span> <strong>UNLIMITED booking code conversions</strong></li>
                <li><span class="pcc-check">✓</span> <strong>UNLIMITED AI Bet Doctor audits</strong></li>
                <li><span class="pcc-check">✓</span> <strong>UNLIMITED Accumulator Generator runs</strong></li>
                <li><span class="pcc-check">✓</span> <strong>UNLIMITED AI Scout inquiries</strong></li>
                <li><span class="pcc-check">✓</span> <strong>UNLIMITED saved tickets</strong></li>
                <li><span class="pcc-check">✓</span> <strong>Arbitrage SureBet Finder Unlocked</strong></li>
                <li><span class="pcc-check">✓</span> <strong>Strategy Backtester Unlocked</strong></li>
                <li><span class="pcc-check">✓</span> <strong>VIP Daily Banker Selections</strong></li>
                <li><span class="pcc-check">✓</span> Priority gateway execution & Telegram alerts</li>
              </ul>
              <div class="pcc-card-footer">
                <button type="button" class="pcc-btn-vip" onclick="window.DeepPredictUpgrade.UpgradeModal.open('plan_comparison', 'annual')">
                  <span>👑 Join VIP Club</span>
                </button>
              </div>
            </div>
          </div>

          <div class="pcc-footer-reassurance">
            <span>🔒 256-Bit Bank Encryption · ⚡ Instant Automated Activation · 🛡️ 1-Click Cancellation Anytime</span>
          </div>
        </div>
      `;
    },

    render(containerOrId, options = {}) {
      const doc = getDoc();
      const el = (typeof containerOrId === 'string' && doc) ? doc.getElementById(containerOrId) : containerOrId;
      if (!el) return;
      el.innerHTML = this.createHtml(options);
    }
  };

  // --- 8. COMPONENT 6: UsageMeter ---
  const UsageMeter = {
    createHtml(featureKeyOrOptions = 'converter', customTier = null) {
      let featureKey = 'converter';
      let tierOverride = customTier;
      if (featureKeyOrOptions && typeof featureKeyOrOptions === 'object') {
        featureKey = featureKeyOrOptions.featureKey || 'converter';
        tierOverride = featureKeyOrOptions.tier || customTier;
      } else if (typeof featureKeyOrOptions === 'string') {
        featureKey = featureKeyOrOptions;
      }
      const meta = getMetadata(featureKey);

      let ent = { tier: tierOverride || 'FREE', dailyLimit: 3, usedToday: 0, remaining: 3, isQuotaExhausted: false };
      if (typeof window !== 'undefined' && window.Entitlements && typeof window.Entitlements.getFeatureEntitlement === 'function') {
        ent = window.Entitlements.getFeatureEntitlement(featureKey);
      }

      const tier = tierOverride || ent.tier;
      const limit = ent.dailyLimit;
      const used = ent.usedToday;
      const remaining = ent.remaining;
      const isUnlimited = limit === Infinity || tier === 'VIP' || tier === 'ADMIN';

      if (isUnlimited) {
        return `
          <div class="usage-meter-widget meter-unlimited">
            <div class="umw-top-row">
              <span class="umw-label">${meta.noun} Allowance</span>
              <span class="umw-tag-unlimited">${tier === 'ADMIN' ? '⚡ ADMIN' : '👑 VIP'} Unlimited</span>
            </div>
            <div class="umw-track-bar">
              <div class="umw-fill-bar bar-unlimited" style="width: 100%;"></div>
            </div>
            <div class="umw-bottom-row">
              <span class="umw-reset-note">Unrestricted daily usage active</span>
            </div>
          </div>
        `;
      }

      const pct = Math.min(100, Math.round((used / limit) * 100));
      const isExhausted = ent.isQuotaExhausted || remaining <= 0;
      const isCaution = remaining === 1;

      let barClass = 'bar-normal';
      if (isExhausted) barClass = 'bar-exhausted';
      else if (isCaution) barClass = 'bar-caution';

      return `
        <div class="usage-meter-widget ${isExhausted ? 'meter-exhausted' : (isCaution ? 'meter-caution' : 'meter-normal')}">
          <div class="umw-top-row">
            <span class="umw-label">${meta.noun} Usage Today</span>
            <span class="umw-fraction">${used} / ${limit}</span>
          </div>
          <div class="umw-track-bar">
            <div class="umw-fill-bar ${barClass}" style="width: ${pct}%;"></div>
          </div>
          <div class="umw-bottom-row">
            <span class="umw-reset-note">
              ${isExhausted ? '⚠️ Allowance reached · Resets at 00:00 UTC' : `⚡ ${remaining} left today · Resets at 00:00 UTC`}
            </span>
            <button type="button" class="umw-micro-upgrade" onclick="window.DeepPredictUpgrade.UpgradeModal.open('${featureKey}', '${tier === 'PRO' ? 'annual' : 'pro'}')">
              <span>${isExhausted ? '⚡ Upgrade for more' : 'Expand'}</span>
            </button>
          </div>
        </div>
      `;
    },

    render(containerOrId, featureKeyOrOptions = 'converter') {
      const doc = getDoc();
      const el = (typeof containerOrId === 'string' && doc) ? doc.getElementById(containerOrId) : containerOrId;
      if (!el) return;
      el.innerHTML = this.createHtml(featureKeyOrOptions);
    }
  };

  // --- 9. EXPORT ENGINE ---
  return {
    FeatureUpgradePrompt,
    UsageLimitBanner,
    UpgradeModal,
    LockedCapability,
    PlanComparison,
    UsageMeter,
    continueExploring,
    getMetadata,
    formatFeatureName,
    formatToolNoun,
    formatToolNounPlural
  };
});
