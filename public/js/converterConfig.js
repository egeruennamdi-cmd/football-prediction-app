/**
 * DeepPredictBet Booking Code Converter Centralized Client Configuration
 * Client-Side Configuration for Quotas, Rate Limits, and Lifecycle States.
 *
 * DO NOT hardcode daily quota numbers in frontend scripts. Reference this configuration.
 */

(function (root, factory) {
  const config = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = config;
  }
  if (typeof root !== 'undefined') {
    root.CODE_CONVERTER_CONFIG = config;
    if (root.window) root.window.CODE_CONVERTER_CONFIG = config;
  }
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this), function () {
  'use strict';

  const CODE_CONVERTER_CONFIG = {
    TIERS: {
      PUBLIC: {
        tier: 'PUBLIC',
        name: 'Public Visitor',
        dailyQuota: 1,
        rateLimitPerMinute: 2,
        maxBurst: 2,
        priority: 0
      },
      FREE: {
        tier: 'FREE',
        name: 'Free Account',
        dailyQuota: 3, // Configurable: 3 qualifying conversions per calendar day
        rateLimitPerMinute: 5,
        maxBurst: 3,
        priority: 1
      },
      PRO: {
        tier: 'PRO',
        name: 'Pro Analyst',
        dailyQuota: 30, // 30 conversions per day (10x Free allowance)
        rateLimitPerMinute: 15,
        maxBurst: 5,
        priority: 2
      },
      VIP: {
        tier: 'VIP',
        name: 'VIP Club',
        dailyQuota: Infinity, // Unlimited conversions for VIP members
        rateLimitPerMinute: 30,
        maxBurst: 10,
        priority: 3
      },
      ADMIN: {
        tier: 'ADMIN',
        name: 'Administrator',
        dailyQuota: Infinity,
        rateLimitPerMinute: 120,
        maxBurst: 30,
        priority: 99
      }
    },

    RULES: {
      DEDUCT_ON_PROVIDER_ATTEMPT: false,
      IDEMPOTENCY_WINDOW_SECONDS: 300,
      LOCK_TTL_SECONDS: 20,
      RATE_LIMIT_WINDOW_SECONDS: 60,
      MAX_HISTORY_ENTRIES_PER_USER: 25
    },

    LIFECYCLE_STATES: {
      REQUEST_RECEIVED: 'REQUEST_RECEIVED',
      VALIDATING: 'VALIDATING',
      VALID: 'VALID',
      RATE_LIMIT_CHECK: 'RATE_LIMIT_CHECK',
      DAILY_QUOTA_CHECK: 'DAILY_QUOTA_CHECK',
      IDEMPOTENCY_CHECK: 'IDEMPOTENCY_CHECK',
      CONVERSION_ATTEMPTED: 'CONVERSION_ATTEMPTED',
      CONVERSION_SUCCESS: 'CONVERSION_SUCCESS',
      CONVERSION_FAILED: 'CONVERSION_FAILED',
      QUOTA_CONSUMED: 'QUOTA_CONSUMED',
      RESULT_RETURNED: 'RESULT_RETURNED'
    },

    getTierConfig(tier) {
      const normalized = String(tier || 'PUBLIC').trim().toUpperCase();
      return this.TIERS[normalized] || this.TIERS.PUBLIC;
    },

    isQuotaBypassed(tier) {
      const cfg = this.getTierConfig(tier);
      return cfg.dailyQuota === Infinity;
    }
  };

  return CODE_CONVERTER_CONFIG;
});
