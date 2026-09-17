/**
 * DeepPredictBet Product Analytics & Telemetry Engine (DPAnalytics)
 * 
 * Strict Privacy & Performance Architecture:
 * - Zero collection of passwords, authentication secrets, or payment credentials.
 * - Zero storage of raw betslips, personal picks, or private booking codes.
 * - Asynchronous, non-blocking batch queue using Beacon API with keepalive fetch fallback.
 * - Resilient fail-safe wrapper: failures never disrupt core betting tools.
 * - Client-side de-duplication prevents event spam.
 */

(function (window) {
  'use strict';

  // 1. Approved Core Product Events (23 Events)
  const CORE_EVENTS = new Set([
    'USER_REGISTERED',
    'USER_LOGIN',
    'USER_RETURNED',
    'PREDICTION_VIEWED',
    'PREDICTION_SAVED',
    'BET_DOCTOR_STARTED',
    'BET_DOCTOR_COMPLETED',
    'TICKET_SAVED',
    'TICKET_VIEWED',
    'CONVERTER_STARTED',
    'CONVERTER_COMPLETED',
    'CONVERTER_FAILED',
    'GENERATOR_USED',
    'SCANNER_USED',
    'WATCHLIST_ADDED',
    'WATCHLIST_REMOVED',
    'ALERT_CREATED',
    'ALERT_OPENED',
    'SUBSCRIPTION_VIEWED',
    'CHECKOUT_STARTED',
    'SUBSCRIPTION_STARTED',
    'SUBSCRIPTION_CANCELLED',
    'PAYMENT_SUCCEEDED',
    'PAYMENT_FAILED'
  ]);

  // High-priority events that trigger an immediate flush
  const IMMEDIATE_FLUSH_EVENTS = new Set([
    'USER_REGISTERED',
    'PAYMENT_SUCCEEDED',
    'PAYMENT_FAILED',
    'CHECKOUT_STARTED',
    'SUBSCRIPTION_STARTED',
    'SUBSCRIPTION_CANCELLED'
  ]);

  // Whitelisted Non-Sensitive Metadata Keys
  const SAFE_METADATA_KEYS = new Set([
    'tool',
    'plan',
    'status',
    'success',
    'source_bookmaker',
    'destination_bookmaker',
    'selection_count',
    'tier',
    'amount_ngn',
    'currency',
    'health_score',
    'health_label',
    'trap_matches_detected',
    'risk_profile',
    'scanner_type',
    'alert_type',
    'reason_category',
    'total_odds',
    'source',
    'league',
    'market',
    'timeframe',
    'trigger_source',
    'payment_method'
  ]);

  // Sensitive patterns strictly rejected
  const SENSITIVE_KEY_REGEX = /pass|pwd|token|secret|auth|card|cvv|cvc|expir|booking.*code|raw.*code|ticket.*code|selection.*data|picks/i;

  const STORAGE_ANON_KEY = 'dp_analytics_anon_id';
  const STORAGE_LAST_VISIT_KEY = 'dp_analytics_last_visit';
  const STORAGE_LAST_RETURN_KEY = 'dp_analytics_last_return_track';
  const SESSION_KEY = 'dp_analytics_session_id';

  // State
  let eventBuffer = [];
  let flushTimer = null;
  const FLUSH_INTERVAL_MS = 4000;
  const MAX_BUFFER_SIZE = 12;
  const DEDUPE_WINDOW_MS = 1500;
  const recentEventsCache = new Map();

  /**
   * Generates a collision-resistant pseudorandom UUID v4
   */
  function generateId(prefix = 'dp') {
    try {
      if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return `${prefix}_${crypto.randomUUID()}`;
      }
    } catch (e) {}
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return `${prefix}_${s4()}${s4()}_${Date.now().toString(36)}`;
  }

  /**
   * Anonymous Client Identifier (persistent across sessions in localStorage)
   */
  function getAnonymousId() {
    try {
      let anonId = localStorage.getItem(STORAGE_ANON_KEY);
      if (!anonId) {
        anonId = generateId('anon');
        localStorage.setItem(STORAGE_ANON_KEY, anonId);
      }
      return anonId;
    } catch (e) {
      return 'anon_ephemeral';
    }
  }

  /**
   * Ephemeral Session Identifier (resets when browser tab/window closes)
   */
  function getSessionId() {
    try {
      let sessId = sessionStorage.getItem(SESSION_KEY);
      if (!sessId) {
        sessId = generateId('sess');
        sessionStorage.setItem(SESSION_KEY, sessId);
      }
      return sessId;
    } catch (e) {
      return 'sess_ephemeral';
    }
  }

  /**
   * Resolve current authenticated user profile safely
   */
  function getSafeUserContext() {
    try {
      const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
      const username = localStorage.getItem('currentUsername') || null;
      
      // Determine active tier
      let plan = 'FREE';
      const vipSubRaw = localStorage.getItem('deeppredictbet_vip_subscription');
      if (vipSubRaw) {
        try {
          const sub = JSON.parse(vipSubRaw);
          if (sub && sub.active) {
            plan = (sub.tier || 'VIP').toUpperCase();
          }
        } catch (e) {}
      }

      // Check admin status
      if (username === 'Egeruennamdi78' || localStorage.getItem('isAdmin') === 'true') {
        plan = 'ADMIN';
      }

      return {
        is_authenticated: isLoggedIn,
        user_id: isLoggedIn ? (username ? `usr_${username.toLowerCase()}` : null) : null,
        plan: plan
      };
    } catch (e) {
      return { is_authenticated: false, user_id: null, plan: 'FREE' };
    }
  }

  /**
   * Strict Metadata Sanitizer:
   * Strips out passwords, cards, CVVs, booking codes, and raw selections
   */
  function sanitizeMetadata(rawProps = {}) {
    if (!rawProps || typeof rawProps !== 'object') return {};

    const clean = {};
    for (const [key, val] of Object.entries(rawProps)) {
      // 1. Skip sensitive key names
      if (SENSITIVE_KEY_REGEX.test(key)) continue;

      // 2. Only accept whitelisted safe keys or explicit numeric/boolean telemetry
      if (!SAFE_METADATA_KEYS.has(key) && typeof val !== 'number' && typeof val !== 'boolean') {
        continue;
      }

      // 3. Clean and sanitize value types
      if (typeof val === 'string') {
        // Drop any string that looks like a credit card, token, or long password
        if (val.length > 120) continue;
        if (/^\d{13,19}$/.test(val.replace(/\s+/g, ''))) continue; // Card number pattern
        clean[key] = val.trim();
      } else if (typeof val === 'number') {
        if (!Number.isNaN(val) && Number.isFinite(val)) {
          clean[key] = Math.round(val * 100) / 100;
        }
      } else if (typeof val === 'boolean') {
        clean[key] = val;
      }
    }
    return clean;
  }

  /**
   * De-duplication check:
   * Prevents spamming duplicate events within DEDUPE_WINDOW_MS
   */
  function isDuplicateEvent(eventName, sanitizedProps) {
    const key = `${eventName}_${sanitizedProps.tool || ''}_${sanitizedProps.tier || ''}_${sanitizedProps.status || ''}`;
    const now = Date.now();
    const lastTimestamp = recentEventsCache.get(key) || 0;

    if (now - lastTimestamp < DEDUPE_WINDOW_MS) {
      return true;
    }

    recentEventsCache.set(key, now);

    // Garbage collect cache if it grows large
    if (recentEventsCache.size > 80) {
      for (const [k, ts] of recentEventsCache.entries()) {
        if (now - ts > 10000) recentEventsCache.delete(k);
      }
    }

    return false;
  }

  /**
   * Flushes buffered events asynchronously to Cloudflare Pages edge endpoint
   */
  function flushEvents() {
    if (eventBuffer.length === 0) return;

    const payload = eventBuffer.slice();
    eventBuffer = [];
    if (flushTimer) {
      clearTimeout(flushTimer);
      flushTimer = null;
    }

    const jsonString = JSON.stringify({
      events: payload,
      client_timestamp: new Date().toISOString()
    });

    const endpoint = '/api/analytics/track';

    // Strategy A: navigator.sendBeacon (ideal for background/unload delivery)
    const nav = (typeof window !== 'undefined' && window.navigator) || (typeof navigator !== 'undefined' ? navigator : null);
    if (nav && typeof nav.sendBeacon === 'function') {
      try {
        const blob = typeof Blob !== 'undefined' ? new Blob([jsonString], { type: 'application/json' }) : jsonString;
        const success = nav.sendBeacon(endpoint, blob);
        if (success) return;
      } catch (e) {}
    }

    // Strategy B: Non-blocking asynchronous fetch with keepalive: true
    try {
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonString,
        keepalive: true,
        credentials: 'same-origin'
      }).catch(() => {
        // Silently drop on network error to protect host application
      });
    } catch (e) {}
  }

  /**
   * Public Telemetry Dispatcher: window.trackEvent(eventName, properties)
   */
  function trackEvent(eventName, properties = {}) {
    try {
      if (!eventName || typeof eventName !== 'string') return;

      const cleanEventName = eventName.toUpperCase().trim();
      if (!CORE_EVENTS.has(cleanEventName)) {
        // Unknown event outside standard 23 core events is ignored for purity
        return;
      }

      const sanitizedProps = sanitizeMetadata(properties);

      // De-duplication filter
      if (isDuplicateEvent(cleanEventName, sanitizedProps)) {
        return;
      }

      const userCtx = getSafeUserContext();

      // Form sanitized event record
      const eventRecord = {
        event_name: cleanEventName,
        timestamp: new Date().toISOString(),
        anonymous_id: getAnonymousId(),
        session_id: getSessionId(),
        user_id: userCtx.user_id,
        plan: sanitizedProps.plan || userCtx.plan,
        tool: sanitizedProps.tool || 'platform',
        success: sanitizedProps.success !== undefined ? Boolean(sanitizedProps.success) : true,
        metadata: sanitizedProps
      };

      eventBuffer.push(eventRecord);

      // Flush condition: buffer full OR immediate priority event
      if (eventBuffer.length >= MAX_BUFFER_SIZE || IMMEDIATE_FLUSH_EVENTS.has(cleanEventName)) {
        flushEvents();
      } else if (!flushTimer) {
        flushTimer = setTimeout(flushEvents, FLUSH_INTERVAL_MS);
      }
    } catch (err) {
      // Guaranteed zero disruption to core features
    }
  }

  /**
   * Initializes session, visitor returning detection, and unload listeners
   */
  function initAnalytics() {
    try {
      const now = Date.now();
      const lastVisit = localStorage.getItem(STORAGE_LAST_VISIT_KEY);
      const lastReturnTrack = localStorage.getItem(STORAGE_LAST_RETURN_KEY);

      // Check if user returned (visited on a previous day/session)
      if (lastVisit) {
        const lastReturnTs = lastReturnTrack ? parseInt(lastReturnTrack, 10) : 0;
        // Limit USER_RETURNED to once per 24 hours to prevent duplicate inflation
        if (now - lastReturnTs > 24 * 60 * 60 * 1000) {
          trackEvent('USER_RETURNED', { tool: 'platform' });
          localStorage.setItem(STORAGE_LAST_RETURN_KEY, now.toString());
        }
      }

      localStorage.setItem(STORAGE_LAST_VISIT_KEY, now.toString());

      // Flush queue when user leaves or hides the tab
      if (typeof document !== 'undefined') {
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'hidden') flushEvents();
        });
      }
      if (typeof window !== 'undefined') {
        window.addEventListener('pagehide', flushEvents);
        window.addEventListener('beforeunload', flushEvents);
      }
    } catch (e) {}
  }

  // API Export
  const DPAnalytics = {
    track: trackEvent,
    flush: flushEvents,
    getAnonymousId,
    getSessionId,
    getSafeUserContext,
    isCoreEvent: (name) => CORE_EVENTS.has(String(name).toUpperCase().trim())
  };

  window.DPAnalytics = DPAnalytics;
  window.trackEvent = trackEvent;

  // Initialize once DOM is ready or immediately
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initAnalytics);
    } else {
      initAnalytics();
    }
  }
})(typeof window !== 'undefined' ? window : this);
