/**
 * DeepPredictBet Feature Registry & Health Monitor (DPFeatureHealth)
 *
 * Responsibilities:
 * 1. Independent lifecycle tracking for core platform features.
 * 2. Strict error boundaries around feature initializations.
 * 3. Prevention of cross-feature initialization cascade failures.
 * 4. Structured diagnostic logging (NO secrets, passwords, tokens, API keys, or PII).
 * 5. Diagnostic reporting for authorised administrators via DPFeatureHealth.getStatus().
 */

(function (global) {
  'use strict';

  // Strict redact list for security compliance
  const SENSITIVE_KEYS = [
    'password', 'token', 'secret', 'key', 'apikey', 'api_key',
    'auth', 'authorization', 'bearer', 'cookie', 'session', 'hash', 'credential'
  ];

  function sanitizePayload(data, depth = 0) {
    if (depth > 3 || data === null || data === undefined) return data;
    if (typeof data !== 'object') return data;

    if (Array.isArray(data)) {
      return data.slice(0, 10).map(item => sanitizePayload(item, depth + 1));
    }

    const clean = {};
    for (const [k, v] of Object.entries(data)) {
      const lower = k.toLowerCase();
      const isSensitive = SENSITIVE_KEYS.some(s => lower.includes(s));
      if (isSensitive) {
        clean[k] = '[REDACTED]';
      } else if (typeof v === 'object' && v !== null) {
        clean[k] = sanitizePayload(v, depth + 1);
      } else {
        clean[k] = v;
      }
    }
    return clean;
  }

  const DPFeatureHealth = {
    version: '1.0.0',
    features: {
      welcome_panel: { status: 'STANDBY', lastUpdated: null, dependencies: ['dom_mount'], error: null },
      ask_ai_scout: { status: 'STANDBY', lastUpdated: null, dependencies: [], error: null },
      ai_bet_doctor: { status: 'STANDBY', lastUpdated: null, dependencies: [], error: null },
      bet_generator: { status: 'STANDBY', lastUpdated: null, dependencies: [], error: null },
      active_betslip_builder: { status: 'STANDBY', lastUpdated: null, dependencies: [], error: null },
      saved_slips: { status: 'STANDBY', lastUpdated: null, dependencies: [], error: null },
      watchlist: { status: 'STANDBY', lastUpdated: null, dependencies: [], error: null },
      value_intelligence_engine: { status: 'STANDBY', lastUpdated: null, dependencies: [], error: null },
      strategy_backtesting_engine: { status: 'STANDBY', lastUpdated: null, dependencies: [], error: null },
      top_tips_tracker: { status: 'STANDBY', lastUpdated: null, dependencies: [], error: null },
      fan_arena: { status: 'STANDBY', lastUpdated: null, dependencies: [], error: null }
    },
    eventLog: [],
    maxLogSize: 100,

    recordEvent: function (eventCode, details) {
      try {
        const sanitized = sanitizePayload(details || {});
        const entry = {
          timestamp: new Date().toISOString(),
          event: String(eventCode || 'UNKNOWN_EVENT'),
          details: sanitized
        };

        this.eventLog.push(entry);
        if (this.eventLog.length > this.maxLogSize) {
          this.eventLog.shift();
        }

        if (typeof global.dispatchEvent === 'function' && typeof global.CustomEvent === 'function') {
          global.dispatchEvent(new CustomEvent('dp:feature-event', { detail: entry }));
        }

        return entry;
      } catch (e) {
        // Logging must never crash the caller
        return null;
      }
    },

    registerFeature: function (name, meta) {
      if (!name) return;
      if (!this.features[name]) {
        this.features[name] = {
          status: 'STANDBY',
          lastUpdated: new Date().toISOString(),
          dependencies: (meta && Array.isArray(meta.dependencies)) ? meta.dependencies : [],
          error: null
        };
      } else if (meta) {
        if (Array.isArray(meta.dependencies)) this.features[name].dependencies = meta.dependencies;
      }
    },

    setFeatureStatus: function (name, status, details) {
      this.registerFeature(name);
      this.features[name].status = status;
      this.features[name].lastUpdated = new Date().toISOString();
      if (details && details.error) {
        this.features[name].error = String(details.error);
      } else if (status === 'INITIALIZED') {
        this.features[name].error = null;
      }
    },

    safeInit: function (featureName, initFn, options) {
      this.registerFeature(featureName, options);
      const opts = options || {};

      // Check explicit dependencies if specified
      if (opts.dependencies && Array.isArray(opts.dependencies)) {
        for (const dep of opts.dependencies) {
          if (dep === 'dom_mount' && opts.mountId) {
            const el = typeof document !== 'undefined' ? document.getElementById(opts.mountId) : null;
            if (!el) {
              this.setFeatureStatus(featureName, 'UNAVAILABLE', { reason: `Mount #${opts.mountId} not found` });
              this.recordEvent('FEATURE_DEPENDENCY_UNAVAILABLE', {
                feature: featureName,
                dependency: `dom_mount:#${opts.mountId}`,
                reason: 'DOM mount element absent from active document'
              });
              return { success: false, reason: 'dependency_unavailable' };
            }
          }
        }
      }

      try {
        let result = null;
        if (typeof initFn === 'function') {
          result = initFn();
        }
        this.setFeatureStatus(featureName, 'INITIALIZED');
        const eventName = `${featureName.toUpperCase()}_INITIALIZED`;
        this.recordEvent(eventName, { feature: featureName });
        return { success: true, result };
      } catch (err) {
        const errMsg = err && err.message ? err.message : String(err);
        this.setFeatureStatus(featureName, 'FAILED', { error: errMsg });
        const failEventName = `${featureName.toUpperCase()}_INITIALIZATION_FAILED`;
        this.recordEvent(failEventName, {
          feature: featureName,
          error: errMsg
        });
        // Never throw to caller; isolate the failure completely
        return { success: false, error: errMsg };
      }
    },

    isOperational: function (featureName) {
      const feat = this.features[featureName];
      if (!feat) return false;
      return feat.status === 'INITIALIZED' || feat.status === 'STANDBY';
    },

    getStatus: function () {
      const totalFeatures = Object.keys(this.features).length;
      let initializedCount = 0;
      let failedCount = 0;

      for (const f of Object.values(this.features)) {
        if (f.status === 'INITIALIZED') initializedCount++;
        else if (f.status === 'FAILED') failedCount++;
      }

      return {
        timestamp: new Date().toISOString(),
        allOperational: failedCount === 0,
        totalFeatures,
        initializedCount,
        failedCount,
        features: JSON.parse(JSON.stringify(this.features)),
        recentEvents: this.eventLog.slice(-20)
      };
    },

    reset: function () {
      for (const k of Object.keys(this.features)) {
        this.features[k].status = 'STANDBY';
        this.features[k].lastUpdated = null;
        this.features[k].error = null;
      }
      this.eventLog = [];
    }
  };

  // Expose on global/window
  global.DPFeatureHealth = DPFeatureHealth;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = DPFeatureHealth;
  }
})(typeof window !== 'undefined' ? window : globalThis);
