/**
 * DeepPredictBet Booking Code Converter Centralized Configuration
 * Server-Authoritative Configuration for Quotas, Rate Limits, and Lifecycles.
 *
 * DO NOT hardcode daily quota numbers elsewhere. Reference this configuration.
 */

export const CODE_CONVERTER_CONFIG = {
  // Tier Quota & Rate Limit Matrix
  TIERS: {
    PUBLIC: {
      tier: 'PUBLIC',
      name: 'Public Visitor',
      dailyQuota: 1,            // 1 sample preview conversion per calendar day
      rateLimitPerMinute: 2,    // Maximum converter requests allowed per minute
      maxBurst: 2,
      priority: 0
    },
    FREE: {
      tier: 'FREE',
      name: 'Free Account',
      dailyQuota: 3,            // Configurable: 3 qualifying conversions per calendar day
      rateLimitPerMinute: 5,    // Maximum converter requests allowed per minute
      maxBurst: 3,
      priority: 1
    },
    PRO: {
      tier: 'PRO',
      name: 'Pro Analyst',
      dailyQuota: 30,           // 30 conversions per calendar day (10x Free allowance)
      rateLimitPerMinute: 15,   // Maximum converter requests allowed per minute
      maxBurst: 5,
      priority: 2
    },
    VIP: {
      tier: 'VIP',
      name: 'VIP Club',
      dailyQuota: Infinity,     // Unlimited conversions for VIP members
      rateLimitPerMinute: 30,   // Maximum converter requests allowed per minute
      maxBurst: 10,
      priority: 3
    },
    ADMIN: {
      tier: 'ADMIN',
      name: 'Administrator',
      dailyQuota: Infinity,     // Unrestricted access, quota bypassed
      rateLimitPerMinute: 120,  // High rate limit for administrative testing
      maxBurst: 30,
      priority: 99
    }
  },

  // Operational Rules & Lifecycle Controls
  RULES: {
    // Zero-Deduction Guarantee:
    // If false (default): ONLY verified HTTP 200 conversions consume daily quota.
    // Invalid codes, expired tickets, platform errors, and provider outages consume ZERO quota.
    // If true: Provider attempts incurring third-party API costs consume quota.
    DEDUCT_ON_PROVIDER_ATTEMPT: false,

    // Duplicate submission suppression window (seconds)
    IDEMPOTENCY_WINDOW_SECONDS: 300, // 5 minutes

    // Atomic in-flight lock window to prevent parallel double-spending race conditions
    LOCK_TTL_SECONDS: 20,

    // Rate limiter sliding window size (seconds)
    RATE_LIMIT_WINDOW_SECONDS: 60,

    // Max recent conversion history entries retained per user
    MAX_HISTORY_ENTRIES_PER_USER: 25
  },

  // Lifecycle States
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
  }
};

/**
 * Resolves the configuration for a given user tier.
 */
export function getTierConfig(tier) {
  const normalized = String(tier || 'PUBLIC').trim().toUpperCase();
  return CODE_CONVERTER_CONFIG.TIERS[normalized] || CODE_CONVERTER_CONFIG.TIERS.PUBLIC;
}

/**
 * Checks whether a tier is allowed to bypass quotas (ADMIN).
 */
export function isQuotaBypassed(tier) {
  const cfg = getTierConfig(tier);
  return cfg.dailyQuota === Infinity;
}
