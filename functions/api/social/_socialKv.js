/**
 * DeepPredictBet — Shared Social Content Model & KV Persistence Service
 * 
 * Centralized content-management service supporting:
 * - Content ID and 6 authoritative content categories
 * - Source Match ID, source lineage, data timestamp, and factual validation status
 * - Platform-specific copy, media references, and link configurations (Telegram, X, Instagram, Facebook, TikTok, YouTube)
 * - 8 lifecycle states: DRAFT, AWAITING_APPROVAL, APPROVED, SCHEDULED, PUBLISHING, PUBLISHED, FAILED, UNCERTAIN
 * - Creator, approver, scheduledAt, and audit timestamps
 * - Verified publication results, platform external post IDs, and reconciliation status
 * - SHA-256 duplicate fingerprinting, idempotency keys, and reconciliation routines
 */

const CF_ACCOUNT_ID = '2e500cb9c6dde4a2a8f47853fe5efe7c';
const CF_KV_NAMESPACE_ID = 'c24f3ae03abd42788257bec2f7d3c065';
const FALLBACK_CF_API_TOKEN = 'cfoat_M5XWA9h4W490gp-jkOQPlyJj-Yhxbvf9FhHVlGFpWvE.Eq4GTdNoGZ6XPS-XwBawDnD5ThF_olt2iwFbRgdtDRo';

// AUTHORITATIVE CONTENT CATEGORIES
export const SOCIAL_CONTENT_CATEGORIES = {
  FOOTBALL_INTELLIGENCE_BRIEF: 'FOOTBALL_INTELLIGENCE_BRIEF',
  AI_SCOUT_DEMO: 'AI_SCOUT_DEMO',
  MATCH_CENTRE_ANALYSIS: 'MATCH_CENTRE_ANALYSIS',
  BETTING_EDUCATION: 'BETTING_EDUCATION',
  PRODUCT_WALKTHROUGH: 'PRODUCT_WALKTHROUGH',
  VERIFIED_POST_MATCH_REVIEW: 'VERIFIED_POST_MATCH_REVIEW'
};

// AUTHORITATIVE LIFECYCLE STATES
export const SOCIAL_LIFECYCLE_STATES = {
  DRAFT: 'DRAFT',
  AWAITING_APPROVAL: 'AWAITING_APPROVAL',
  APPROVED: 'APPROVED',
  SCHEDULED: 'SCHEDULED',
  PUBLISHING: 'PUBLISHING',
  PUBLISHED: 'PUBLISHED',
  FAILED: 'FAILED',
  UNCERTAIN: 'UNCERTAIN'
};

// AUTHORITATIVE PLATFORM CHANNELS
export const SOCIAL_PLATFORMS = {
  TELEGRAM: 'telegram',
  X: 'x',
  INSTAGRAM: 'instagram',
  FACEBOOK: 'facebook',
  TIKTOK: 'tiktok',
  YOUTUBE: 'youtube'
};

// CHARACTER & MEDIA LIMITS PER PLATFORM
export const PLATFORM_LIMITS = {
  telegram: { maxChars: 4096, maxMediaCaption: 1024, allowsMarkdown: true, maxMediaFiles: 10 },
  x: { maxChars: 280, maxMediaCaption: 280, allowsMarkdown: false, maxMediaFiles: 4 },
  instagram: { maxChars: 2200, maxMediaCaption: 2200, allowsMarkdown: false, maxMediaFiles: 10, maxHashtags: 30 },
  facebook: { maxChars: 63206, maxMediaCaption: 63206, allowsMarkdown: false, maxMediaFiles: 10 },
  tiktok: { maxChars: 2200, maxMediaCaption: 2200, allowsMarkdown: false, maxMediaFiles: 1 },
  youtube: { maxChars: 5000, maxTitleChars: 100, allowsMarkdown: false, maxMediaFiles: 1 }
};

/**
 * Universal JSON read from Cloudflare Pages KV with REST fallback
 */
export async function readKVJson(env, key, fallback = []) {
  if (env && env.USERS_KV) {
    try {
      const stored = await env.USERS_KV.get(key);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn(`[SocialKV] Native KV read failed for key ${key}:`, e.message);
    }
  } else {
    const apiToken = (env && env.CF_API_TOKEN) || FALLBACK_CF_API_TOKEN;
    const accountId = (env && env.CF_ACCOUNT_ID) || CF_ACCOUNT_ID;
    const nsId = (env && env.CF_KV_NAMESPACE_ID) || CF_KV_NAMESPACE_ID;
    try {
      const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${nsId}/values/${key}`, {
        headers: { 'Authorization': `Bearer ${apiToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data) return data;
      }
    } catch (e) {
      console.warn(`[SocialKV] REST KV read failed for key ${key}:`, e.message);
    }
  }
  return fallback;
}

/**
 * Universal JSON write to Cloudflare Pages KV with REST fallback
 */
export async function writeKVJson(env, key, value) {
  if (env && env.USERS_KV) {
    try {
      await env.USERS_KV.put(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn(`[SocialKV] Native KV write failed for key ${key}:`, e.message);
    }
  } else {
    const apiToken = (env && env.CF_API_TOKEN) || FALLBACK_CF_API_TOKEN;
    const accountId = (env && env.CF_ACCOUNT_ID) || CF_ACCOUNT_ID;
    const nsId = (env && env.CF_KV_NAMESPACE_ID) || CF_KV_NAMESPACE_ID;
    try {
      const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${nsId}/values/${key}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(value)
      });
      return res.ok;
    } catch (e) {
      console.warn(`[SocialKV] REST KV write failed for key ${key}:`, e.message);
    }
  }
  return false;
}

/**
 * Computes deterministic SHA-256 fingerprint for content deduplication across platforms
 */
export async function computeContentFingerprint(category, matchId, copy, mediaUrl = '') {
  const normalized = `${(category || '').toLowerCase().trim()}|${(matchId || 'general').trim()}|${(copy || '').trim().replace(/\s+/g, ' ')}|${(mediaUrl || '').trim()}`;
  try {
    if (typeof crypto !== 'undefined' && crypto.subtle && typeof crypto.subtle.digest === 'function') {
      const encoder = new TextEncoder();
      const data = encoder.encode(normalized);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (e) {}

  // Deterministic fallback string hash
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = ((hash << 5) - hash) + normalized.charCodeAt(i);
    hash |= 0;
  }
  return 'fp_' + Math.abs(hash).toString(16) + '_' + normalized.length;
}

/**
 * Validates the core factual integrity of a social content item
 * Rejects completed fixtures in upcoming content, ensures required lineage data exists,
 * and blocks deceptive gambling claims.
 */
export function validateSocialContentFacts(item, nowEpoch = Date.now()) {
  const errors = [];
  const warnings = [];

  if (!item) {
    return { valid: false, errors: ['Content item is empty or undefined.'], warnings };
  }

  // 1. Category validation
  if (!item.category || !SOCIAL_CONTENT_CATEGORIES[item.category]) {
    errors.push(`Invalid category "${item.category}". Must be one of: ${Object.keys(SOCIAL_CONTENT_CATEGORIES).join(', ')}.`);
  }

  // 2. Deceptive / Unfair Betting Claims Check
  const allCopy = Object.values(item.platforms || {})
    .map(p => (p && p.copy ? String(p.copy).toLowerCase() : ''))
    .join(' ');

  const prohibitedPhrases = [
    '100% guaranteed',
    'guaranteed win',
    'fixed match',
    'sure banker',
    'risk-free betting',
    'risk free betting',
    'cannot lose',
    'can\'t lose'
  ];

  for (const phrase of prohibitedPhrases) {
    if (allCopy.includes(phrase)) {
      errors.push(`Prohibited Deceptive Claim: Post contains "${phrase}". All predictions must reflect statistical probabilities, not guaranteed wins.`);
    }
  }

  // 3. Match-specific factual validation
  const upcomingCategories = [
    SOCIAL_CONTENT_CATEGORIES.FOOTBALL_INTELLIGENCE_BRIEF,
    SOCIAL_CONTENT_CATEGORIES.AI_SCOUT_DEMO,
    SOCIAL_CONTENT_CATEGORIES.MATCH_CENTRE_ANALYSIS
  ];

  if (upcomingCategories.includes(item.category) && item.matchId) {
    const lineage = item.sourceLineage || {};

    if (!lineage.homeTeam || !lineage.awayTeam) {
      errors.push('Factual Error: Match intelligence requires identified homeTeam and awayTeam.');
    }

    if (!lineage.competition) {
      warnings.push('Factual Warning: Competition name is not specified.');
    }

    // Status check
    const status = (lineage.status || '').toUpperCase();
    if (status === 'FT' || status === 'AET' || status === 'FINISHED' || status === 'PEN') {
      errors.push(`STALE_FIXTURE_REJECTION: Cannot generate upcoming intelligence for completed match (${lineage.homeTeam} vs ${lineage.awayTeam}, status: ${status}).`);
    }

    // Kickoff timestamp check
    if (lineage.kickoffTime) {
      const koMs = new Date(lineage.kickoffTime).getTime();
      // Allow max 15 minutes grace period
      if (!isNaN(koMs) && (nowEpoch - koMs) > 15 * 60 * 1000) {
        errors.push(`STALE_KICKOFF_REJECTION: Fixture kickoff has already passed (${new Date(koMs).toISOString()}).`);
      }
    }

    // Validate probabilities
    if (lineage.probabilities) {
      const { home, draw, away } = lineage.probabilities;
      if (typeof home === 'number' && typeof draw === 'number' && typeof away === 'number') {
        const sum = Math.round(home + draw + away);
        if (sum < 95 || sum > 105) {
          warnings.push(`Probability Imbalance: Home (${home}%) + Draw (${draw}%) + Away (${away}%) sums to ${sum}%, expected ~100%.`);
        }
      }
    }
  }

  // 4. Post-match review validation
  if (item.category === SOCIAL_CONTENT_CATEGORIES.VERIFIED_POST_MATCH_REVIEW && item.matchId) {
    const lineage = item.sourceLineage || {};
    const status = (lineage.status || '').toUpperCase();
    if (status !== 'FT' && status !== 'AET' && status !== 'FINISHED') {
      errors.push(`INCOMPLETE_MATCH_REJECTION: Post-match review requires a completed match (current status: ${status || 'UNKNOWN'}).`);
    }
    if (lineage.actualScore == null && !lineage.resultSummary) {
      errors.push('Factual Error: Post-match review requires verified scoreline or result summary.');
    }
  }

  // 5. Platform-specific payload validation
  const platforms = item.platforms || {};
  let hasEnabledPlatform = false;

  for (const [platformKey, config] of Object.entries(platforms)) {
    if (!config || !config.enabled) continue;
    hasEnabledPlatform = true;

    const copy = config.copy || '';
    const limits = PLATFORM_LIMITS[platformKey];

    // For non-telegram platforms (like X), measure plain text length with HTML tags stripped
    const effectiveLength = platformKey === 'telegram'
      ? copy.length
      : copy.replace(/<[^>]+>/g, '').replace(/&[a-z0-9#]+;/gi, 'X').trim().length;

    if (limits && effectiveLength > limits.maxChars) {
      errors.push(`Character Limit Exceeded: ${platformKey} copy is ${effectiveLength} characters (max allowed: ${limits.maxChars}).`);
    }

    if (platformKey === 'x' && effectiveLength > 280) {
      errors.push(`X (Twitter) Payload Error: Exceeds 280 characters without thread configuration.`);
    }

    if (platformKey === 'youtube' && config.title && config.title.length > 100) {
      errors.push(`YouTube Title Error: Title is ${config.title.length} characters (max: 100).`);
    }
  }

  if (!hasEnabledPlatform && item.state !== SOCIAL_LIFECYCLE_STATES.DRAFT) {
    errors.push('Publication Error: At least one social media platform must be enabled for distribution.');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    status: errors.length === 0 ? 'VALID' : 'INVALID'
  };
}

/**
 * Builds standard UTM-tagged link for campaign attribution
 */
export function buildCampaignUrl(baseUrl, platform, category, contentId) {
  const url = new URL(baseUrl || 'https://deeppredictbet.com');
  url.searchParams.set('utm_source', String(platform || 'social').toLowerCase());
  url.searchParams.set('utm_medium', 'social');
  url.searchParams.set('utm_campaign', String(category || 'general').toLowerCase());
  if (contentId) {
    url.searchParams.set('utm_content', String(contentId));
  }
  return url.toString();
}

// ============================================================================
// CONTENT MANAGEMENT & KV PERSISTENCE
// ============================================================================

const KV_KEY_SOCIAL_CONTENT = 'social_content_library';
const KV_KEY_SOCIAL_AUDIT = 'social_audit_history';

/**
 * Retrieves social content items from KV with optional filtering
 */
export async function getSocialContentList(env, filter = {}) {
  const items = await readKVJson(env, KV_KEY_SOCIAL_CONTENT, []);
  if (!Array.isArray(items)) return [];

  return items.filter(item => {
    if (!item) return false;
    if (filter.category && item.category !== filter.category) return false;
    if (filter.state && item.state !== filter.state) return false;
    if (filter.matchId && item.matchId !== filter.matchId) return false;
    if (filter.platform) {
      const p = item.platforms && item.platforms[filter.platform];
      if (!p || !p.enabled) return false;
    }
    return true;
  });
}

/**
 * Retrieves a single social content item by ID
 */
export async function getSocialContentById(env, contentId) {
  if (!contentId) return null;
  const items = await getSocialContentList(env);
  return items.find(i => i.id === contentId) || null;
}

/**
 * Creates or updates a social content item in KV
 */
export async function saveSocialContent(env, contentData, userEmail = 'admin@deeppredictbet.com') {
  let items = await readKVJson(env, KV_KEY_SOCIAL_CONTENT, []);
  if (!Array.isArray(items)) items = [];

  const now = new Date().toISOString();
  const id = contentData.id || `soc_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
  const idx = items.findIndex(i => i.id === id);

  const existing = idx >= 0 ? items[idx] : null;

  // Run factual validation
  const validation = validateSocialContentFacts(contentData);

  // Compute SHA-256 fingerprint
  const primaryPlatform = Object.keys(contentData.platforms || {})[0] || 'telegram';
  const primaryCopy = (contentData.platforms && contentData.platforms[primaryPlatform] && contentData.platforms[primaryPlatform].copy) || '';
  const mediaUrl = (contentData.platforms && contentData.platforms[primaryPlatform] && contentData.platforms[primaryPlatform].mediaUrl) || contentData.mediaUrl || '';
  const fingerprint = await computeContentFingerprint(contentData.category, contentData.matchId, primaryCopy, mediaUrl);

  const entry = {
    ...contentData,
    id,
    contentFingerprint: fingerprint,
    validationStatus: validation.status,
    validationErrors: validation.errors,
    validationWarnings: validation.warnings,
    state: contentData.state || (existing && existing.state) || SOCIAL_LIFECYCLE_STATES.DRAFT,
    creator: (existing && existing.creator) || userEmail,
    approver: contentData.approver || (existing && existing.approver) || null,
    createdAt: (existing && existing.createdAt) || now,
    updatedAt: now,
    platformResults: contentData.platformResults || (existing && existing.platformResults) || {}
  };

  if (idx >= 0) {
    items[idx] = entry;
  } else {
    items.unshift(entry);
  }

  // Cap library at 200 items to prevent KV payload bloat
  if (items.length > 200) items = items.slice(0, 200);

  await writeKVJson(env, KV_KEY_SOCIAL_CONTENT, items);

  // Record audit event
  await recordSocialAuditEvent(env, {
    contentId: id,
    action: idx >= 0 ? 'CONTENT_UPDATED' : 'CONTENT_CREATED',
    category: entry.category,
    state: entry.state,
    user: userEmail,
    timestamp: now,
    details: { validationStatus: validation.status }
  });

  return entry;
}

/**
 * Deletes a social content item from KV
 */
export async function deleteSocialContent(env, contentId, userEmail = 'admin@deeppredictbet.com') {
  let items = await readKVJson(env, KV_KEY_SOCIAL_CONTENT, []);
  if (!Array.isArray(items)) return false;

  const found = items.find(i => i.id === contentId);
  if (!found) return false;

  items = items.filter(i => i.id !== contentId);
  await writeKVJson(env, KV_KEY_SOCIAL_CONTENT, items);

  await recordSocialAuditEvent(env, {
    contentId,
    action: 'CONTENT_DELETED',
    category: found.category,
    user: userEmail,
    timestamp: new Date().toISOString()
  });

  return true;
}

/**
 * Checks for duplicate publication within a sliding window (default 24 hours)
 */
export async function checkDuplicateSocialContent(env, fingerprint, windowMs = 24 * 60 * 60 * 1000) {
  if (!fingerprint) return null;
  const items = await getSocialContentList(env);
  const now = Date.now();

  for (const item of items) {
    if (item.contentFingerprint === fingerprint && item.state === SOCIAL_LIFECYCLE_STATES.PUBLISHED) {
      const pubTime = new Date(item.publishedAt || item.updatedAt).getTime();
      if (!isNaN(pubTime) && (now - pubTime) < windowMs) {
        return item;
      }
    }
  }
  return null;
}

/**
 * Records an immutable audit log entry in KV
 */
export async function recordSocialAuditEvent(env, auditEntry) {
  let history = await readKVJson(env, KV_KEY_SOCIAL_AUDIT, []);
  if (!Array.isArray(history)) history = [];

  const entry = {
    ...auditEntry,
    id: `aud_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: auditEntry.timestamp || new Date().toISOString()
  };

  history.unshift(entry);
  if (history.length > 300) history = history.slice(0, 300);

  await writeKVJson(env, KV_KEY_SOCIAL_AUDIT, history);
  return entry;
}

/**
 * Retrieves audit history log from KV
 */
export async function getSocialAuditHistory(env, limit = 50) {
  const history = await readKVJson(env, KV_KEY_SOCIAL_AUDIT, []);
  if (!Array.isArray(history)) return [];
  return history.slice(0, Math.min(limit, 200));
}

/**
 * Transitions content through lifecycle states with strict authorization
 */
export async function transitionContentState(env, contentId, nextState, userEmail, comment = '') {
  const item = await getSocialContentById(env, contentId);
  if (!item) {
    throw new Error(`Content item "${contentId}" not found.`);
  }

  const validTransitions = {
    [SOCIAL_LIFECYCLE_STATES.DRAFT]: [SOCIAL_LIFECYCLE_STATES.AWAITING_APPROVAL, SOCIAL_LIFECYCLE_STATES.FAILED],
    [SOCIAL_LIFECYCLE_STATES.AWAITING_APPROVAL]: [SOCIAL_LIFECYCLE_STATES.APPROVED, SOCIAL_LIFECYCLE_STATES.DRAFT, SOCIAL_LIFECYCLE_STATES.FAILED],
    [SOCIAL_LIFECYCLE_STATES.APPROVED]: [SOCIAL_LIFECYCLE_STATES.SCHEDULED, SOCIAL_LIFECYCLE_STATES.PUBLISHING, SOCIAL_LIFECYCLE_STATES.DRAFT],
    [SOCIAL_LIFECYCLE_STATES.SCHEDULED]: [SOCIAL_LIFECYCLE_STATES.PUBLISHING, SOCIAL_LIFECYCLE_STATES.APPROVED, SOCIAL_LIFECYCLE_STATES.DRAFT],
    [SOCIAL_LIFECYCLE_STATES.PUBLISHING]: [SOCIAL_LIFECYCLE_STATES.PUBLISHED, SOCIAL_LIFECYCLE_STATES.FAILED, SOCIAL_LIFECYCLE_STATES.UNCERTAIN],
    [SOCIAL_LIFECYCLE_STATES.UNCERTAIN]: [SOCIAL_LIFECYCLE_STATES.PUBLISHED, SOCIAL_LIFECYCLE_STATES.FAILED, SOCIAL_LIFECYCLE_STATES.PUBLISHING],
    [SOCIAL_LIFECYCLE_STATES.FAILED]: [SOCIAL_LIFECYCLE_STATES.DRAFT, SOCIAL_LIFECYCLE_STATES.PUBLISHING],
    [SOCIAL_LIFECYCLE_STATES.PUBLISHED]: []
  };

  const allowed = validTransitions[item.state] || [];
  if (!allowed.includes(nextState)) {
    throw new Error(`Invalid lifecycle transition from ${item.state} to ${nextState}. Allowed: [${allowed.join(', ')}].`);
  }

  // Pre-approval factual re-validation
  if (nextState === SOCIAL_LIFECYCLE_STATES.APPROVED) {
    const val = validateSocialContentFacts(item);
    if (!val.valid) {
      throw new Error(`Cannot approve content with factual errors: ${val.errors.join('; ')}`);
    }
    item.approver = userEmail;
    item.approvedAt = new Date().toISOString();
  }

  item.state = nextState;
  item.updatedAt = new Date().toISOString();

  await saveSocialContent(env, item, userEmail);

  await recordSocialAuditEvent(env, {
    contentId,
    action: `STATE_TRANSITION_${nextState}`,
    previousState: item.state,
    newState: nextState,
    user: userEmail,
    details: { comment }
  });

  return item;
}
