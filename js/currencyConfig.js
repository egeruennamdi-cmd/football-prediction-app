/**
 * DEEPPREDICTBET — CENTRALIZED MULTI-CURRENCY CONFIGURATION & ENGINE
 * Architecture supporting NGN (Nigerian Naira) and USD (US Dollar)
 * Future-ready for EUR, GBP, CAD, ZAR, KES, GHS without refactoring.
 */

(function (window) {
  'use strict';

  // 1. Supported Currencies Registry
  const SUPPORTED_CURRENCIES = {
    NGN: {
      code: 'NGN',
      symbol: '₦',
      name: 'Nigerian Naira',
      flag: '🇳🇬',
      locale: 'en-NG',
      label: 'Nigerian Naira (NGN)',
      isDomestic: true,
      format: function (amount) {
        const num = Number(amount) || 0;
        return `₦${num.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      },
      formatCompact: function (amount) {
        const num = Number(amount) || 0;
        return `₦${num.toLocaleString('en-NG')}`;
      }
    },
    USD: {
      code: 'USD',
      symbol: '$',
      name: 'US Dollar',
      flag: '🇺🇸',
      locale: 'en-US',
      label: 'US Dollar (USD)',
      isDomestic: false,
      format: function (amount) {
        const num = Number(amount) || 0;
        return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      },
      formatCompact: function (amount) {
        const num = Number(amount) || 0;
        return `$${num.toLocaleString('en-US')}`;
      }
    }
  };

  // 2. Authoritative Subscription Plan Pricing Catalog
  // Fixed currency-specific prices per plan. Never dynamic FX conversions on subscriptions.
  const SUBSCRIPTION_PLANS = {
    weekly: {
      id: 'weekly',
      name: 'Weekly VIP Pass',
      billingLabel: 'Weekly VIP',
      durationDays: 7,
      saveText: '',
      pricing: {
        NGN: {
          currency: 'NGN',
          amount: 10000,
          formatted: '₦10,000.00',
          formattedCompact: '₦10,000',
          dailyText: '₦1,429 / day',
          dailyAmount: 1428.57,
          billingSummary: 'Billed ₦10,000.00 every 7 days'
        },
        USD: {
          currency: 'USD',
          amount: 10.00,
          formatted: '$10.00',
          formattedCompact: '$10',
          dailyText: '$1.43 / day',
          dailyAmount: 1.43,
          billingSummary: 'Billed $10.00 every 7 days'
        }
      }
    },
    monthly: {
      id: 'monthly',
      name: 'Monthly VIP Pass',
      billingLabel: 'Monthly VIP',
      durationDays: 30,
      saveText: 'Save 32%',
      pricing: {
        NGN: {
          currency: 'NGN',
          amount: 27000,
          formatted: '₦27,000.00',
          formattedCompact: '₦27,000',
          dailyText: '₦900 / day',
          dailyAmount: 900.00,
          billingSummary: 'Billed ₦27,000.00 every 30 days'
        },
        USD: {
          currency: 'USD',
          amount: 25.00,
          formatted: '$25.00',
          formattedCompact: '$25',
          dailyText: '$0.83 / day',
          dailyAmount: 0.83,
          billingSummary: 'Billed $25.00 every 30 days'
        }
      }
    },
    annual: {
      id: 'annual',
      name: 'Annual VIP Pass',
      billingLabel: 'Yearly VIP',
      durationDays: 365,
      saveText: 'Save 71%',
      pricing: {
        NGN: {
          currency: 'NGN',
          amount: 149500,
          formatted: '₦149,500.00',
          formattedCompact: '₦149,500',
          dailyText: '₦410 / day',
          dailyAmount: 409.59,
          billingSummary: 'Billed ₦149,500.00 every 365 days'
        },
        USD: {
          currency: 'USD',
          amount: 99.00,
          formatted: '$99.00',
          formattedCompact: '$99',
          dailyText: '$0.27 / day',
          dailyAmount: 0.27,
          billingSummary: 'Billed $99.00 every 365 days'
        }
      }
    }
  };

  /**
   * Detects the suggested default currency without forcing.
   */
  function detectInitialCurrency() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem('dp_preferred_currency');
        if (saved && SUPPORTED_CURRENCIES[saved.toUpperCase()]) {
          return saved.toUpperCase();
        }
      }
    } catch (e) {}

    // Check timezone/locale heuristic for suggestion
    try {
      if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
        const lang = (typeof navigator !== 'undefined' && (navigator.language || navigator.userLanguage)) || '';
        if (tz.includes('Lagos') || tz.includes('Nigeria') || lang.toLowerCase() === 'en-ng') {
          return 'NGN';
        }
      }
    } catch (e) {}

    return 'NGN'; // Default to NGN as primary market
  }

  // Active runtime state
  let currentAppCurrency = detectInitialCurrency();

  /**
   * Retrieves currently selected currency code (e.g. 'NGN' | 'USD').
   */
  function getAppCurrency() {
    return currentAppCurrency;
  }

  /**
   * Retrieves currency descriptor object.
   */
  function getCurrencyDetails(currencyCode) {
    const code = (currencyCode || currentAppCurrency || 'NGN').toUpperCase();
    return SUPPORTED_CURRENCIES[code] || SUPPORTED_CURRENCIES.NGN;
  }

  /**
   * Authoritative lookup of plan pricing for a specific currency.
   */
  function getPlanPricing(tierKey, currencyCode) {
    const tier = (tierKey || 'annual').toLowerCase();
    const curr = (currencyCode || currentAppCurrency || 'NGN').toUpperCase();
    const plan = SUBSCRIPTION_PLANS[tier] || SUBSCRIPTION_PLANS.annual;
    const pricing = (plan.pricing && plan.pricing[curr]) || (plan.pricing && plan.pricing.NGN);

    return {
      tierId: plan.id,
      name: plan.name,
      billingLabel: plan.billingLabel,
      durationDays: plan.durationDays,
      saveText: plan.saveText,
      currency: curr,
      amount: pricing.amount,
      formatted: pricing.formatted,
      formattedCompact: pricing.formattedCompact,
      dailyText: pricing.dailyText,
      dailyAmount: pricing.dailyAmount,
      billingSummary: pricing.billingSummary
    };
  }

  /**
   * Returns complete VIP packages map formatted for a given currency.
   * Maintains backward-compatibility with window.VIP_PACKAGES consumers.
   */
  function getVipPackagesForCurrency(currencyCode) {
    const curr = (currencyCode || currentAppCurrency || 'NGN').toUpperCase();
    const result = {};

    Object.keys(SUBSCRIPTION_PLANS).forEach(key => {
      const p = getPlanPricing(key, curr);
      result[key] = {
        id: p.tierId,
        name: p.name,
        billingLabel: p.billingLabel,
        durationDays: p.durationDays,
        currency: p.currency,
        price: p.formatted,
        priceNum: p.amount,
        dailyText: p.dailyText,
        saveText: p.saveText,
        billingSummary: p.billingSummary
      };
    });

    return result;
  }

  /**
   * Checks if user has an active subscription in a different currency.
   * Prevents silent conversion of existing active subscriptions.
   */
  function checkActiveSubscriptionCurrencyMismatch(newCurrency) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = window.localStorage.getItem('deeppredictbet_vip');
        if (raw) {
          const sub = JSON.parse(raw);
          if (sub && sub.active && sub.currency && sub.currency.toUpperCase() !== newCurrency.toUpperCase()) {
            return {
              hasMismatch: true,
              activeCurrency: sub.currency.toUpperCase(),
              tier: sub.tier,
              name: sub.name
            };
          }
        }
      }
    } catch (e) {}
    return { hasMismatch: false };
  }

  /**
   * Switches the active application currency.
   * Updates state, localStorage, window.VIP_PACKAGES, and triggers DOM updates.
   *
   * @param {string} currencyCode - 'NGN' | 'USD'
   * @param {Object} [options] - Options e.g. { force: false, silent: false }
   */
  function setAppCurrency(currencyCode, options = {}) {
    if (!currencyCode) return currentAppCurrency;
    const target = currencyCode.toUpperCase();
    if (!SUPPORTED_CURRENCIES[target]) {
      console.warn(`[Currency] Unsupported currency: ${currencyCode}. Reverting to NGN.`);
      return currentAppCurrency;
    }

    // Check for active subscriber currency mismatch
    if (!options.force) {
      const mismatch = checkActiveSubscriptionCurrencyMismatch(target);
      if (mismatch.hasMismatch) {
        if (typeof window.showAppNotification === 'function') {
          window.showAppNotification(
            `ℹ️ Your active membership is billed in ${mismatch.activeCurrency}. To switch your billing currency, manage your subscription in My DeepPredict.`
          );
        }
      }
    }

    currentAppCurrency = target;

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('dp_preferred_currency', target);
      }
    } catch (e) {}

    // Synchronize window.VIP_PACKAGES for 100% legacy backward-compatibility
    const updatedPackages = getVipPackagesForCurrency(target);
    window.VIP_PACKAGES = updatedPackages;

    // Refresh UI pricing views
    updateDomCurrencyElements(target);

    // Track analytics event
    if (!options.silent && typeof window.trackEvent === 'function') {
      window.trackEvent('currency_selected', {
        currency: target,
        symbol: SUPPORTED_CURRENCIES[target].symbol,
        source: options.source || 'user_selector'
      });
    }

    // Dispatch global custom event for reactive listeners
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      try {
        const ev = new CustomEvent('currency_changed', {
          detail: {
            currency: target,
            details: SUPPORTED_CURRENCIES[target],
            packages: updatedPackages
          }
        });
        window.dispatchEvent(ev);
      } catch (e) {}
    }

    return currentAppCurrency;
  }

  /**
   * Synchronizes all currency selectors, plan price labels, and CTAs across the DOM.
   */
  function updateDomCurrencyElements(currencyCode) {
    const curr = (currencyCode || currentAppCurrency || 'NGN').toUpperCase();
    const plans = getVipPackagesForCurrency(curr);
    const currMeta = SUPPORTED_CURRENCIES[curr] || SUPPORTED_CURRENCIES.NGN;

    // 1. Update Currency Toggle Button Active States (Paywall + On-Page)
    const toggleBtns = document.querySelectorAll('[data-currency-toggle], .currency-toggle-btn, .paywall-curr-btn');
    toggleBtns.forEach(btn => {
      const btnCurr = (btn.getAttribute('data-currency') || btn.getAttribute('data-curr') || '').toUpperCase();
      const isActive = btnCurr === curr;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-checked', isActive ? 'true' : 'false');
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    // 2. Update Paywall Modal Plan Cards
    const weeklyPriceEl = document.getElementById('vip-price-weekly');
    const monthlyPriceEl = document.getElementById('vip-price-monthly');
    const annualPriceEl = document.getElementById('vip-price-annual');

    if (weeklyPriceEl) weeklyPriceEl.textContent = plans.weekly.price;
    if (monthlyPriceEl) monthlyPriceEl.textContent = plans.monthly.price;
    if (annualPriceEl) annualPriceEl.textContent = plans.annual.price;

    const cardWeeklyDaily = document.querySelector('#vip-card-weekly .vip-plan-daily');
    const cardMonthlyDaily = document.querySelector('#vip-card-monthly .vip-plan-daily');
    const cardAnnualDaily = document.querySelector('#vip-card-annual .vip-plan-daily');

    if (cardWeeklyDaily) cardWeeklyDaily.textContent = plans.weekly.dailyText;
    if (cardMonthlyDaily) cardMonthlyDaily.textContent = plans.monthly.dailyText;
    if (cardAnnualDaily) cardAnnualDaily.textContent = plans.annual.dailyText;

    // 3. Update In-Page Pricing Section Cards
    const pageWeeklyPriceEl = document.getElementById('page-vip-price-weekly');
    const pageMonthlyPriceEl = document.getElementById('page-vip-price-monthly');
    const pageAnnualPriceEl = document.getElementById('page-vip-price-annual');

    if (pageWeeklyPriceEl) pageWeeklyPriceEl.textContent = plans.weekly.price;
    if (pageMonthlyPriceEl) pageMonthlyPriceEl.textContent = plans.monthly.price;
    if (pageAnnualPriceEl) pageAnnualPriceEl.textContent = plans.annual.price;

    const pageCardWeeklyDaily = document.querySelector('#page-vip-card-weekly .vip-plan-daily');
    const pageCardMonthlyDaily = document.querySelector('#page-vip-card-monthly .vip-plan-daily');
    const pageCardAnnualDaily = document.querySelector('#page-vip-card-annual .vip-plan-daily');

    if (pageCardWeeklyDaily) pageCardWeeklyDaily.textContent = plans.weekly.dailyText;
    if (pageCardMonthlyDaily) pageCardMonthlyDaily.textContent = plans.monthly.dailyText;
    if (pageCardAnnualDaily) pageCardAnnualDaily.textContent = plans.annual.dailyText;

    // 4. Update Dynamic CTA buttons
    const selectedTier = (typeof window.currentSelectedVipTier !== 'undefined' && window.currentSelectedVipTier) || 'annual';
    if (typeof window.updateDynamicCtaText === 'function') {
      window.updateDynamicCtaText(selectedTier);
    } else {
      const continueBtn = document.getElementById('vip-continue-btn');
      if (continueBtn && plans[selectedTier]) {
        const tierPriceSpan = continueBtn.querySelector('.btn-tier-price');
        if (tierPriceSpan) tierPriceSpan.textContent = `• ${plans[selectedTier].price}`;
      }
    }

    // 5. Update Checkout Pane Elements if open
    const checkoutPriceEl = document.getElementById('vip-checkout-plan-price');
    const checkoutDailyEl = document.getElementById('vip-checkout-plan-daily');
    const btnAmountTextEl = document.getElementById('vip-btn-amount-text');
    const checkoutCurrBadgeEl = document.getElementById('vip-checkout-currency-tag');

    if (plans[selectedTier]) {
      if (checkoutPriceEl) checkoutPriceEl.textContent = plans[selectedTier].price;
      if (checkoutDailyEl) checkoutDailyEl.textContent = `Billed at ${plans[selectedTier].dailyText}`;
      if (btnAmountTextEl) btnAmountTextEl.textContent = plans[selectedTier].price;
    }

    if (checkoutCurrBadgeEl) {
      checkoutCurrBadgeEl.textContent = curr === 'USD' ? '🇺🇸 USD International Billing' : '🇳🇬 NGN Nigerian Billing';
    }

    // 6. Update payment method visibility nuances for USD
    const transferNoticeEl = document.getElementById('vip-transfer-currency-notice');
    if (transferNoticeEl) {
      if (curr === 'USD') {
        transferNoticeEl.innerHTML = `
          <div style="background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.3); border-radius: 8px; padding: 10px; font-size: 0.75rem; color: #93c5fd; margin-bottom: 12px;">
            🌐 <b>USD International Payment:</b> For instant card activation, use <b>Debit / Credit Card</b> (Visa/Mastercard/Amex). For Web3 borderless payment, use <b>USDT (TRC-20)</b>. For local NGN bank transfer, switch currency to <b>🇳🇬 NGN</b>.
          </div>
        `;
      } else {
        transferNoticeEl.innerHTML = '';
      }
    }
  }

  /**
   * Calculates subscription renewal preserving the original subscription currency.
   * Strictly avoids cross-currency conversion during renewals.
   *
   * @param {Object} subscription - Stored subscription object
   * @returns {Object} Renewal specification
   */
  function calculateSubscriptionRenewal(subscription) {
    if (!subscription || !subscription.tier) {
      throw new Error('Invalid subscription record for renewal');
    }

    // Respect original subscribed currency
    const originalCurrency = (subscription.currency || subscription.renewalCurrency || 'NGN').toUpperCase();
    const tier = subscription.tier.toLowerCase();
    const pricing = getPlanPricing(tier, originalCurrency);

    const renewalDate = new Date();
    renewalDate.setDate(renewalDate.getDate() + pricing.durationDays);

    return {
      tier: pricing.tierId,
      name: pricing.name,
      currency: originalCurrency,
      amount: pricing.amount,
      formattedAmount: pricing.formatted,
      billingIntervalDays: pricing.durationDays,
      renewalDate: renewalDate.toISOString(),
      previousTxId: subscription.txId || null,
      renewalTxId: `DP-VIP-${originalCurrency}-REN-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'active'
    };
  }

  // Initialize window.VIP_PACKAGES with default detected currency
  window.SUPPORTED_CURRENCIES = SUPPORTED_CURRENCIES;
  window.SUBSCRIPTION_PLANS = SUBSCRIPTION_PLANS;
  window.getAppCurrency = getAppCurrency;
  window.setAppCurrency = setAppCurrency;
  window.getCurrencyDetails = getCurrencyDetails;
  window.getPlanPricing = getPlanPricing;
  window.getVipPackagesForCurrency = getVipPackagesForCurrency;
  window.updateDomCurrencyElements = updateDomCurrencyElements;
  window.calculateSubscriptionRenewal = calculateSubscriptionRenewal;

  // Set initial package state
  window.VIP_PACKAGES = getVipPackagesForCurrency(currentAppCurrency);

  // Auto-init DOM bindings on ready
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => updateDomCurrencyElements(currentAppCurrency));
    } else {
      updateDomCurrencyElements(currentAppCurrency);
    }
  }

})(typeof window !== 'undefined' ? window : globalThis);
