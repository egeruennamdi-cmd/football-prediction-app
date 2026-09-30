/**
 * DeepPredictBet Centralized Entitlements & Monetization Engine
 * Single Source of Truth for Feature Access, Daily Usage Quotas, and Tier Progression.
 *
 * Tier Hierarchy:
 * 1. PUBLIC (Visitor / Guest)
 * 2. FREE (Registered Account, role: USER)
 * 3. PRO (Weekly / Monthly Subscriber, role: PRO)
 * 4. VIP (Annual Subscriber / Punters VIP Club, role: VIP)
 * 5. ADMIN (Authoritative Administrator, role: ADMIN)
 */

(function () {
  'use strict';

  // 1. Tier Rank Mapping
  const TIER_RANKS = {
    PUBLIC: 0,
    FREE: 1,
    PRO: 2,
    VIP: 3,
    ADMIN: 4
  };

  // Helper to read converter quotas from centralized CODE_CONVERTER_CONFIG
  function resolveConverterQuota(tierKey) {
    if (typeof CODE_CONVERTER_CONFIG !== 'undefined' && CODE_CONVERTER_CONFIG.TIERS && CODE_CONVERTER_CONFIG.TIERS[tierKey]) {
      return CODE_CONVERTER_CONFIG.TIERS[tierKey].dailyQuota;
    }
    if (typeof window !== 'undefined' && window.CODE_CONVERTER_CONFIG && window.CODE_CONVERTER_CONFIG.TIERS && window.CODE_CONVERTER_CONFIG.TIERS[tierKey]) {
      return window.CODE_CONVERTER_CONFIG.TIERS[tierKey].dailyQuota;
    }
    const defaults = { PUBLIC: 1, FREE: 3, PRO: 30, VIP: Infinity, ADMIN: Infinity };
    return defaults[tierKey] !== undefined ? defaults[tierKey] : 0;
  }

  // 2. Authoritative Tool Quota Registry
  const TIER_QUOTAS = {
    converter: {
      get PUBLIC() { return resolveConverterQuota('PUBLIC'); },
      get FREE() { return resolveConverterQuota('FREE'); },
      get PRO() { return resolveConverterQuota('PRO'); },
      get VIP() { return resolveConverterQuota('VIP'); },
      get ADMIN() { return resolveConverterQuota('ADMIN'); }
    },
    doctor: {
      PUBLIC: 0,       // Explanatory preview only
      FREE: 1,         // 1 full diagnostic scan / day
      PRO: 15,        // 15 diagnostic scans / day
      VIP: Infinity,   // Unlimited scans
      ADMIN: Infinity
    },
    generator: {
      PUBLIC: 0,       // Default 4-match sample preview
      FREE: 1,         // 1 custom algorithmic generation / day
      PRO: 10,        // 10 custom generations / day
      VIP: Infinity,   // Unlimited runs
      ADMIN: Infinity
    },
    scout: {
      PUBLIC: 0,       // Prompt preview only
      FREE: 1,         // 1 conversational inquiry / day
      PRO: 10,        // 10 inquiries / day
      VIP: Infinity,   // Unlimited inquiries
      ADMIN: Infinity
    },
    saved_tickets: {
      PUBLIC: 1,
      FREE: 3,
      PRO: 25,
      VIP: Infinity,
      ADMIN: Infinity
    },
    watchlist: {
      PUBLIC: 3,
      FREE: 5,
      PRO: 30,
      VIP: Infinity,
      ADMIN: Infinity
    }
  };

  // 3. Binary Feature Gating Registry (Minimum Tier Requirement)
  const FEATURE_MIN_TIERS = {
    // Pro features
    valuebot: 'PRO',
    poisson_distributions: 'PRO',
    xg_models: 'PRO',
    market_discrepancies: 'PRO',
    smart_filters_advanced: 'PRO',
    predictions: 'PRO',
    premium_matches: 'PRO',
    match_intelligence: 'PRO',

    // VIP features
    arbitrage: 'VIP',
    backtester: 'VIP',
    viptips: 'VIP',
    priority_alerts: 'VIP',
    export_csv: 'VIP',
    unlimited_tickets: 'VIP'
  };

  const STORAGE_KEY_DAILY_USAGE = 'dp_user_daily_usage';

  /**
   * Returns current UTC date string: YYYY-MM-DD
   */
  function getTodayUTCString() {
    const now = new Date();
    const y = now.getUTCFullYear();
    const m = String(now.getUTCMonth() + 1).padStart(2, '0');
    const d = String(now.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  /**
   * Returns next UTC midnight as ISO string
   */
  function getNextUTCMidnightISO() {
    const now = new Date();
    const nextMidnight = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0, 0));
    return nextMidnight.toISOString();
  }

  /**
   * Resolves the authoritative tier of the active user.
   * Hierarchy: ADMIN > VIP > PRO > FREE > PUBLIC
   */
  function getUserTier(userCandidate) {
    let candidate = userCandidate;

    // Check if candidate passed explicitly
    if (!candidate && typeof window !== 'undefined') {
      // 1. Authoritative Admin check
      if (typeof window.isAdmin === 'function' && window.isAdmin()) {
        return 'ADMIN';
      }

      // 2. Read stored session / user
      try {
        if (typeof localStorage !== 'undefined') {
          // Check stored VIP subscription FIRST (paying user is never downgraded)
          let sub = null;
          if (typeof window.getStoredVipSubscription === 'function') {
            sub = window.getStoredVipSubscription();
          } else {
            const rawSub = localStorage.getItem('deeppredictbet_vip') || localStorage.getItem('dp_vip_subscription');
            if (rawSub) {
              try { sub = JSON.parse(rawSub); } catch (e) {}
            }
          }

          if (sub && (sub.active || sub.status === 'active')) {
            const now = new Date();
            const isExpired = sub.expiresAt && new Date(sub.expiresAt) < now;
            if (!isExpired) {
              const tier = (sub.tier || sub.package || sub.plan || 'vip').toLowerCase();
              if (tier.includes('week') || tier.includes('month') || tier === 'pro') return 'PRO';
              return 'VIP';
            }
          }

          // Check user_role
          const role = (localStorage.getItem('user_role') || '').trim().toUpperCase();
          if (role === 'ADMIN' && (typeof window.isAdmin !== 'function' || window.isAdmin())) return 'ADMIN';
          if (role === 'VIP') return 'VIP';
          if (role === 'PRO') return 'PRO';
          if (role === 'USER') return 'FREE';

          const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
          if (isLoggedIn) return 'FREE';

          return 'PUBLIC';
        }
      } catch (e) {
        return 'PUBLIC';
      }
    }

    if (candidate && typeof candidate === 'object') {
      const role = (candidate.role || '').toUpperCase();
      if (role === 'ADMIN') return 'ADMIN';
      if (candidate.subscription && (candidate.subscription.active || candidate.subscription.status === 'active')) {
        const tier = (candidate.subscription.tier || candidate.subscription.package || candidate.subscription.plan || 'vip').toLowerCase();
        if (tier.includes('week') || tier.includes('month') || tier === 'pro') return 'PRO';
        return 'VIP';
      }
      if (role === 'VIP') return 'VIP';
      if (role === 'PRO') return 'PRO';
      if (candidate.isLoggedIn || candidate.email) return 'FREE';
    }

    return 'PUBLIC';
  }

  /**
   * Reads the active user's daily usage ledger from storage,
   * automatically rolling over when the UTC date changes.
   */
  function getDailyUsage() {
    const today = getTodayUTCString();
    let usage = {
      date: today,
      converter: 0,
      doctor: 0,
      generator: 0,
      scout: 0
    };

    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(STORAGE_KEY_DAILY_USAGE);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.date === today) {
            usage = Object.assign(usage, parsed);
          } else {
            // New UTC day: reset usage
            localStorage.setItem(STORAGE_KEY_DAILY_USAGE, JSON.stringify(usage));
          }
        } else {
          localStorage.setItem(STORAGE_KEY_DAILY_USAGE, JSON.stringify(usage));
        }
      }
    } catch (e) {
      console.warn('[Entitlements] Error reading daily usage:', e);
    }

    return usage;
  }

  /**
   * Persists updated daily usage ledger.
   */
  function saveDailyUsage(usage) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_DAILY_USAGE, JSON.stringify(usage));
      }
    } catch (e) {
      console.warn('[Entitlements] Error saving daily usage:', e);
    }
  }

  /**
   * Normalizes a feature/tool key.
   */
  function normalizeFeatureKey(featureKey) {
    if (!featureKey) return '';
    const key = String(featureKey).trim().toLowerCase();
    if (key.includes('convert') || key === 'converter') return 'converter';
    if (key.includes('doctor')) return 'doctor';
    if (key.includes('machine') || key.includes('generator')) return 'generator';
    if (key.includes('scout')) return 'scout';
    if (key.includes('ticket') || key === 'saved_tickets') return 'saved_tickets';
    if (key.includes('watch') || key === 'watchlist') return 'watchlist';
    if (key.includes('value') || key === 'valuebot') return 'valuebot';
    if (key.includes('arbitrage') || key.includes('surebet')) return 'arbitrage';
    if (key.includes('backtest') || key === 'backtester') return 'backtester';
    if (key.includes('tip') || key === 'viptips') return 'viptips';
    if (key.includes('match') || key.includes('prediction')) return 'predictions';
    if (key.includes('csv') || key.includes('export')) return 'export_csv';
    return key;
  }

  /**
   * Computes authoritative feature entitlement for a user.
   */
  function getFeatureEntitlement(featureKeyInput, userCandidate) {
    const feature = normalizeFeatureKey(featureKeyInput);
    const tier = getUserTier(userCandidate);
    const tierRank = TIER_RANKS[tier] ?? 0;
    const today = getTodayUTCString();
    const resetAt = getNextUTCMidnightISO();

    // 1. Admin always has full unrestricted access
    if (tier === 'ADMIN') {
      return {
        feature,
        tier,
        allowed: true,
        dailyLimit: Infinity,
        usedToday: 0,
        remaining: Infinity,
        isQuotaExhausted: false,
        resetAt,
        requiresUpgrade: false,
        upgradeTarget: null
      };
    }

    // 2. Binary Gated Feature Check
    let reqTier = FEATURE_MIN_TIERS[feature];
    if (!reqTier) {
      if (typeof isFeatureVip === 'function' && isFeatureVip(feature)) {
        reqTier = 'VIP';
      } else if (typeof window !== 'undefined' && typeof window.isFeatureVip === 'function' && window.isFeatureVip(feature)) {
        reqTier = 'VIP';
      }
    }
    if (reqTier) {
      const reqRank = TIER_RANKS[reqTier] ?? 2;
      const allowed = tierRank >= reqRank;
      return {
        feature,
        tier,
        allowed,
        dailyLimit: allowed ? Infinity : 0,
        usedToday: 0,
        remaining: allowed ? Infinity : 0,
        isQuotaExhausted: !allowed,
        resetAt,
        requiresUpgrade: !allowed,
        upgradeTarget: reqTier
      };
    }

    // 3. Metered Tool Quota Check
    const quotaConfig = TIER_QUOTAS[feature];
    if (quotaConfig) {
      const dailyLimit = quotaConfig[tier] ?? 0;
      const usage = getDailyUsage();
      const usedToday = usage[feature] ?? 0;
      const isUnlimited = dailyLimit === Infinity;
      const remaining = isUnlimited ? Infinity : Math.max(0, dailyLimit - usedToday);
      const isQuotaExhausted = !isUnlimited && remaining <= 0;
      const allowed = isUnlimited || remaining > 0;

      let upgradeTarget = null;
      if (isQuotaExhausted) {
        if (tier === 'PUBLIC') upgradeTarget = 'FREE';
        else if (tier === 'FREE') upgradeTarget = 'PRO';
        else if (tier === 'PRO') upgradeTarget = 'VIP';
      }

      return {
        feature,
        tier,
        allowed,
        dailyLimit,
        usedToday,
        remaining,
        isQuotaExhausted,
        resetAt,
        requiresUpgrade: isQuotaExhausted,
        upgradeTarget
      };
    }

    // 4. Default: Allowed
    return {
      feature,
      tier,
      allowed: true,
      dailyLimit: Infinity,
      usedToday: 0,
      remaining: Infinity,
      isQuotaExhausted: false,
      resetAt,
      requiresUpgrade: false,
      upgradeTarget: null
    };
  }

  /**
   * Returns whether the user is allowed to access/execute the feature.
   */
  function canAccessFeature(featureKey, userCandidate) {
    const ent = getFeatureEntitlement(featureKey, userCandidate);
    return ent.allowed;
  }

  /**
   * Records usage of a metered tool for today.
   * Only decrements if the operation was successful.
   *
   * @param {string} featureKey - The tool key (e.g. 'converter', 'doctor', 'generator', 'scout')
   * @param {number} [count=1] - Number of uses to record
   * @returns {Object} Updated entitlement status
   */
  function recordFeatureUsage(featureKeyInput, count = 1) {
    const feature = normalizeFeatureKey(featureKeyInput);
    const tier = getUserTier();

    // Do not record usage for Admin or VIP (they have unlimited quota)
    if (tier === 'ADMIN' || tier === 'VIP') {
      return getFeatureEntitlement(feature);
    }

    const usage = getDailyUsage();
    if (usage[feature] !== undefined) {
      usage[feature] = (usage[feature] || 0) + count;
      saveDailyUsage(usage);
    }

    if (feature === 'converter') {
      try { renderConverterQuotaState(); } catch (e) {}
    }

    // Edge telemetry tracking
    if (typeof window !== 'undefined' && typeof window.trackEvent === 'function') {
      window.trackEvent('FEATURE_USAGE_RECORDED', {
        feature,
        tier,
        count,
        used_today: usage[feature]
      });
    }

    return getFeatureEntitlement(feature);
  }

  /**
   * Synchronizes daily usage from edge server response.
   */
  function syncDailyUsageFromServer(serverUsage) {
    if (!serverUsage || typeof serverUsage !== 'object') return;
    const today = getTodayUTCString();
    if (serverUsage.date && serverUsage.date !== today) return;

    const current = getDailyUsage();
    // Preserve whichever count is higher to prevent race conditions
    current.converter = Math.max(current.converter || 0, serverUsage.conversions || serverUsage.converter || 0);
    current.doctor = Math.max(current.doctor || 0, serverUsage.doctorAudits || serverUsage.doctor || 0);
    current.generator = Math.max(current.generator || 0, serverUsage.generatorRuns || serverUsage.generator || 0);
    current.scout = Math.max(current.scout || 0, serverUsage.scoutQueries || serverUsage.scout || 0);
    saveDailyUsage(current);

    try { renderConverterQuotaState(); } catch (e) {}
  }

  /**
   * Renders a clean, accessible UI usage badge.
   *
   * @param {string} featureKey
   * @param {HTMLElement|string} targetElementOrId
   */
  function renderUsageBadge(featureKeyInput, targetElementOrId) {
    if (typeof document === 'undefined' || typeof document.getElementById !== 'function') return;
    const target = typeof targetElementOrId === 'string'
      ? document.getElementById(targetElementOrId)
      : targetElementOrId;

    if (!target) return;

    const ent = getFeatureEntitlement(featureKeyInput);
    const tier = ent.tier;

    if (tier === 'ADMIN') {
      target.innerHTML = `
        <span class="entitlement-pill admin-pill" style="display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:20px;font-size:0.75rem;font-weight:800;background:rgba(234,179,8,0.15);color:#facc15;border:1px solid rgba(234,179,8,0.3);">
          ⚡ ADMIN (Unlimited Quota)
        </span>
      `;
      return;
    }

    if (tier === 'VIP') {
      target.innerHTML = `
        <span class="entitlement-pill vip-pill" style="display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:20px;font-size:0.75rem;font-weight:800;background:rgba(234,179,8,0.15);color:#facc15;border:1px solid rgba(234,179,8,0.3);">
          👑 VIP (Unlimited Access)
        </span>
      `;
      return;
    }

    if (ent.dailyLimit === Infinity) {
      target.innerHTML = `
        <span class="entitlement-pill pro-pill" style="display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:20px;font-size:0.75rem;font-weight:800;background:rgba(59,130,246,0.15);color:#60a5fa;border:1px solid rgba(59,130,246,0.3);">
          ⚡ PRO (Unlimited)
        </span>
      `;
      return;
    }

    const remaining = ent.remaining;
    const limit = ent.dailyLimit;
    const isExhausted = ent.isQuotaExhausted;

    let pillBg = 'rgba(59,130,246,0.12)';
    let pillBorder = 'rgba(59,130,246,0.25)';
    let pillColor = '#93c5fd';

    if (isExhausted) {
      pillBg = 'rgba(239,68,68,0.15)';
      pillBorder = 'rgba(239,68,68,0.35)';
      pillColor = '#fca5a5';
    } else if (remaining === 1) {
      pillBg = 'rgba(245,158,11,0.15)';
      pillBorder = 'rgba(245,158,11,0.35)';
      pillColor = '#fcd34d';
    }

    const tierLabel = tier === 'PRO' ? 'PRO Analyst' : (tier === 'FREE' ? 'Free Account' : 'Public Visitor');
    const badgeText = isExhausted
      ? `0 of ${limit} left today (${tierLabel})`
      : `${remaining} of ${limit} left today (${tierLabel})`;

    target.innerHTML = `
      <div style="display:inline-flex;align-items:center;gap:8px;flex-wrap:wrap;">
        <span class="entitlement-pill" style="display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:20px;font-size:0.74rem;font-weight:700;background:${pillBg};color:${pillColor};border:1px solid ${pillBorder};">
          <span>${isExhausted ? '⚠️' : '📊'}</span>
          <span>${badgeText}</span>
        </span>
        ${isExhausted ? `
          <button type="button" onclick="window.Entitlements.showUpgradePrompt('${ent.feature}')" style="background:linear-gradient(135deg,#3b82f6,#2563eb);color:#ffffff;border:none;padding:4px 10px;border-radius:14px;font-size:0.72rem;font-weight:800;cursor:pointer;display:inline-flex;align-items:center;gap:4px;box-shadow:0 2px 8px rgba(37,99,235,0.3);">
            <span>⚡ Upgrade</span>
          </button>
        ` : ''}
      </div>
    `;
  }

  /**
   * Renders the dedicated top quota banner and handles convert button state
   * for the DeepPredictBet Booking Code Converter.
   * Ensures non-destructive UI presentation while strictly enforcing quota.
   */
  function renderConverterQuotaState() {
    if (typeof document === 'undefined' || typeof document.getElementById !== 'function') return;

    const bannerEl = document.getElementById('converter-quota-banner');
    const convertBtn = document.getElementById('betcode-convert-btn');
    const heroBtn = document.getElementById('hero-betcode-convert-btn');

    const ent = getFeatureEntitlement('converter');
    const tier = ent.tier;
    const remaining = ent.remaining;
    const limit = ent.dailyLimit;
    const isExhausted = ent.isQuotaExhausted;

    // 1. Render Top Banner
    if (bannerEl) {
      if (typeof window !== 'undefined' && window.DeepPredictUpgrade && window.DeepPredictUpgrade.UsageLimitBanner && typeof window.DeepPredictUpgrade.UsageLimitBanner.render === 'function') {
        window.DeepPredictUpgrade.UsageLimitBanner.render(bannerEl, { featureKey: 'converter' });
      } else if (tier === 'ADMIN') {
        bannerEl.innerHTML = `
          <div class="converter-quota-card admin-quota" style="background: rgba(234, 179, 8, 0.08); border: 1px solid rgba(234, 179, 8, 0.28); border-radius: 12px; padding: 12px 18px; display: flex; align-items: center; justify-content: space-between; font-size: 0.85rem; color: #fde047;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span>⚡</span>
              <span><strong>ADMIN Access:</strong> Unlimited booking code conversions enabled.</span>
            </div>
            <span style="font-size: 0.75rem; background: rgba(234, 179, 8, 0.2); color: #fef08a; padding: 3px 10px; border-radius: 12px; font-weight: 800;">Unlimited</span>
          </div>
        `;
      } else if (tier === 'VIP') {
        bannerEl.innerHTML = `
          <div class="converter-quota-card vip-quota" style="background: rgba(234, 179, 8, 0.08); border: 1px solid rgba(234, 179, 8, 0.28); border-radius: 12px; padding: 12px 18px; display: flex; align-items: center; justify-content: space-between; font-size: 0.85rem; color: #fde047;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span>👑</span>
              <span><strong>VIP Member:</strong> Unlimited booking code conversions active.</span>
            </div>
            <span style="font-size: 0.75rem; background: rgba(234, 179, 8, 0.2); color: #fef08a; padding: 3px 10px; border-radius: 12px; font-weight: 800;">VIP Active</span>
          </div>
        `;
      } else if (tier === 'PRO') {
        if (isExhausted) {
          bannerEl.innerHTML = `
            <div class="converter-quota-card pro-exhausted" style="background: rgba(239, 68, 68, 0.12); border: 1.5px solid rgba(239, 68, 68, 0.4); border-radius: 12px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; gap: 14px; flex-wrap: wrap;">
              <div>
                <div style="font-weight: 800; font-size: 0.92rem; color: #fca5a5; display: flex; align-items: center; gap: 6px;">
                  <span>⚠️</span> Today's PRO conversion allowance has been reached (${limit}/${limit} used).
                </div>
                <div style="font-size: 0.82rem; color: #cbd5e1; margin-top: 3px;">
                  Pro conversions remaining today: 0. Upgrade to VIP for unlimited conversions.
                </div>
              </div>
              <button type="button" onclick="window.Entitlements.showUpgradePrompt('converter', 'annual')" style="background: linear-gradient(135deg, #eab308, #ca8a04); color: #000000; border: none; padding: 8px 16px; border-radius: 10px; font-size: 0.82rem; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 14px rgba(234,179,8,0.35);">
                <span>👑 Upgrade to VIP</span>
              </button>
            </div>
          `;
        } else {
          bannerEl.innerHTML = `
            <div class="converter-quota-card pro-quota" style="background: rgba(59, 130, 246, 0.08); border: 1px solid rgba(59, 130, 246, 0.25); border-radius: 12px; padding: 10px 16px; display: flex; align-items: center; justify-content: space-between; font-size: 0.85rem; color: #93c5fd;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span>⚡</span>
                <span>Pro conversions remaining today: <strong style="color: #60a5fa; font-size: 0.95rem;">${remaining}</strong> <span style="font-size: 0.78rem; color: #94a3b8;">(of ${limit})</span></span>
              </div>
              <span style="font-size: 0.75rem; background: rgba(59, 130, 246, 0.15); color: #93c5fd; padding: 3px 10px; border-radius: 12px; font-weight: 700;">PRO Tier</span>
            </div>
          `;
        }
      } else {
        // FREE or PUBLIC Tier
        if (isExhausted) {
          bannerEl.innerHTML = `
            <div class="converter-quota-card exhausted" style="background: rgba(239, 68, 68, 0.12); border: 1.5px solid rgba(239, 68, 68, 0.4); border-radius: 12px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; gap: 14px; flex-wrap: wrap;">
              <div>
                <div style="font-weight: 800; font-size: 0.92rem; color: #fca5a5; display: flex; align-items: center; gap: 6px;">
                  <span>⚠️</span> Today's free conversion allowance has been reached.
                </div>
                <div style="font-size: 0.82rem; color: #cbd5e1; margin-top: 3px;">
                  Free conversions remaining today: 0. Upgrade to Pro for 30 daily conversions or VIP for unlimited conversions.
                </div>
              </div>
              <button type="button" onclick="window.Entitlements.showUpgradePrompt('converter')" style="background: linear-gradient(135deg, #3b82f6, #2563eb); color: #ffffff; border: none; padding: 8px 16px; border-radius: 10px; font-size: 0.82rem; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 14px rgba(37,99,235,0.35); transition: transform 0.15s ease;">
                <span>⚡ Upgrade to Pro</span>
              </button>
            </div>
          `;
        } else {
          bannerEl.innerHTML = `
            <div class="converter-quota-card active" style="background: rgba(59, 130, 246, 0.08); border: 1px solid rgba(59, 130, 246, 0.25); border-radius: 12px; padding: 10px 16px; display: flex; align-items: center; justify-content: space-between; font-size: 0.85rem; color: #93c5fd;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span>🔄</span>
                <span>Free conversions remaining today: <strong style="color: #60a5fa; font-size: 0.95rem;">${remaining}</strong></span>
              </div>
              <a href="javascript:void(0)" onclick="window.Entitlements.showUpgradePrompt('converter')" style="font-size: 0.76rem; color: #60a5fa; text-decoration: underline; font-weight: 600;">Upgrade for more</a>
            </div>
          `;
        }
      }
    }

    // 2. Control Convert Button Behavior
    const buttons = [convertBtn, heroBtn].filter(Boolean);
    buttons.forEach(btn => {
      if (isExhausted) {
        btn.disabled = true;
        btn.setAttribute('data-quota-disabled', 'true');
        btn.innerText = tier === 'PRO'
          ? "Daily Pro Quota Reached — Upgrade to VIP"
          : "Daily Free Quota Reached — Upgrade to Pro";
        btn.style.opacity = "0.65";
        btn.style.cursor = "not-allowed";
        btn.title = "Today's daily conversion allowance has been reached. Upgrade to continue.";
        btn.onclick = (e) => {
          if (e && e.preventDefault) e.preventDefault();
          showUpgradePrompt('converter');
        };
      } else {
        // Only re-enable if not currently in flight
        if (btn.getAttribute('data-in-flight') !== 'true') {
          btn.disabled = false;
          btn.removeAttribute('data-quota-disabled');
          btn.innerText = "Convert";
          btn.style.opacity = "";
          btn.style.cursor = "";
          btn.title = "";
          btn.onclick = () => {
            if (btn.id === 'hero-betcode-convert-btn' && typeof window.executeHeroBetCodeConversion === 'function') {
              window.executeHeroBetCodeConversion();
            } else if (typeof window.convertBetSlipCode === 'function') {
              window.convertBetSlipCode();
            }
          };
        }
      }
    });
  }

  /**
   * Opens the contextual Paywall 2.0 modal.
   */
  function showUpgradePrompt(featureKeyInput, preferredTier = 'annual') {
    const feature = normalizeFeatureKey(featureKeyInput);

    if (typeof window !== 'undefined') {
      if (window.DeepPredictUpgrade && window.DeepPredictUpgrade.UpgradeModal && typeof window.DeepPredictUpgrade.UpgradeModal.open === 'function') {
        window.DeepPredictUpgrade.UpgradeModal.open(feature, preferredTier);
        return;
      }
      if (typeof window.openPremiumPaywall === 'function') {
        window.openPremiumPaywall(preferredTier, feature);
        return;
      }
      if (typeof window.openVipSubscriptionModal === 'function') {
        window.openVipSubscriptionModal(preferredTier, feature);
        return;
      }
      // Fallback
      if (typeof window.navigateTo === 'function') {
        window.navigateTo('/pricing');
      } else {
        window.location.href = '/pricing';
      }
    }
  }

  /**
   * Initializes or updates all feature usage badges across the DOM.
   */
  function initAllUsageBadges() {
    if (typeof document === 'undefined' || typeof document.getElementById !== 'function') return;
    renderConverterQuotaState();
    renderUsageBadge('converter', 'converter-usage-badge');
    renderUsageBadge('doctor', 'doctor-usage-badge');
    renderUsageBadge('generator', 'machine-usage-badge');
    renderUsageBadge('scout', 'scout-usage-badge');
  }

  // Automatic DOM initialization
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initAllUsageBadges, 120);
      });
    } else {
      setTimeout(initAllUsageBadges, 120);
    }
  }

  // Export engine to window
  const Entitlements = {
    TIER_RANKS,
    TIER_QUOTAS,
    FEATURE_MIN_TIERS,
    getTodayUTCString,
    getNextUTCMidnightISO,
    getUserTier,
    getDailyUsage,
    saveDailyUsage,
    getFeatureEntitlement,
    canAccessFeature,
    canAccess: canAccessFeature,
    recordFeatureUsage,
    syncDailyUsageFromServer,
    renderUsageBadge,
    renderConverterQuotaState,
    initAllUsageBadges,
    refreshBadges: initAllUsageBadges,
    showUpgradePrompt,
    normalizeFeatureKey,
    getFeatureEntitlement,
    getEntitlement: getFeatureEntitlement,
    // Unified Upgrade Experience Component Getters
    get FeatureUpgradePrompt() {
      return (typeof window !== 'undefined' && window.DeepPredictUpgrade) ? window.DeepPredictUpgrade.FeatureUpgradePrompt : null;
    },
    get UsageLimitBanner() {
      return (typeof window !== 'undefined' && window.DeepPredictUpgrade) ? window.DeepPredictUpgrade.UsageLimitBanner : null;
    },
    get UpgradeModal() {
      return (typeof window !== 'undefined' && window.DeepPredictUpgrade) ? window.DeepPredictUpgrade.UpgradeModal : null;
    },
    get LockedCapability() {
      return (typeof window !== 'undefined' && window.DeepPredictUpgrade) ? window.DeepPredictUpgrade.LockedCapability : null;
    },
    get PlanComparison() {
      return (typeof window !== 'undefined' && window.DeepPredictUpgrade) ? window.DeepPredictUpgrade.PlanComparison : null;
    },
    get UsageMeter() {
      return (typeof window !== 'undefined' && window.DeepPredictUpgrade) ? window.DeepPredictUpgrade.UsageMeter : null;
    },
    continueExploring(context) {
      if (typeof window !== 'undefined' && window.DeepPredictUpgrade && typeof window.DeepPredictUpgrade.continueExploring === 'function') {
        return window.DeepPredictUpgrade.continueExploring(context);
      }
    }
  };

  if (typeof window !== 'undefined') {
    window.Entitlements = Entitlements;
    window.canAccess = function (feature, capability) {
      return Entitlements.canAccess(feature, capability);
    };
    window.getEntitlement = function (feature, capability) {
      return Entitlements.getEntitlement(feature, capability);
    };

    // Multi-tab storage event synchronization
    if (typeof window.addEventListener === 'function') {
      window.addEventListener('storage', (e) => {
        if (!e || !e.key) return;
        if (['deeppredictbet_vip', 'dp_vip_subscription', 'user_role', 'userLoggedIn', STORAGE_KEY_DAILY_USAGE].includes(e.key)) {
          try {
            initAllUsageBadges();
            if (typeof window.syncVipSubscriptionUI === 'function') {
              window.syncVipSubscriptionUI();
            }
            if (typeof window.refreshVipFeatureBadges === 'function') {
              window.refreshVipFeatureBadges();
            }
          } catch (err) {}
        }
      });
    }
  }

  if (typeof globalThis !== 'undefined') {
    globalThis.Entitlements = Entitlements;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Entitlements;
  }
})();

