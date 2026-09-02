/**
 * DeepPredictBet VIP Feature Gating & Management Engine
 * Dynamically protects tools & features behind VIP Packages and VIP Club.
 * Allows owner/admin to add or remove any feature from VIP in real-time.
 */

const DEFAULT_VIP_FEATURES = {
  arbitrage: {
    id: 'arbitrage',
    name: 'Arbitrage Finder (Surebets)',
    category: 'Betting Suite',
    icon: '🛡️',
    isVip: true,
    description: '100% risk-free arbitrage opportunities scanned across 50 global bookmakers.'
  },
  valuebot: {
    id: 'valuebot',
    name: 'Value Bet Bot (+EV Engine)',
    category: 'Betting Suite',
    icon: '💰',
    isVip: true,
    description: 'Positive mathematical expected value (+EV) picks calculated with Poisson distributions.'
  },
  backtester: {
    id: 'backtester',
    name: 'Strategy Backtester',
    category: 'Betting Suite',
    icon: '🧪',
    isVip: true,
    description: 'Simulate high-stakes betting systems over historical leagues with customizable bankrolls.'
  },
  viptips: {
    id: 'viptips',
    name: 'VIP Banker Predictions Hub',
    category: 'Exclusive Picks',
    icon: '🔥',
    isVip: true,
    description: 'Hand-picked 89.4% win-rate daily bankers with 1-click booking codes for SportyBet & Bet9ja.'
  },
  doctor: {
    id: 'doctor',
    name: 'AI Bet Doctor (Ticket Diagnosis)',
    category: 'Betting Suite',
    icon: '🩺',
    isVip: false,
    description: 'Scan accumulators for hidden risks, negative correlations, and receive instant AI replacements.'
  },
  machine: {
    id: 'machine',
    name: 'DeepPredict Accumulator Machine',
    category: 'Betting Suite',
    icon: '🤖',
    isVip: false,
    description: 'Tailored algorithmic multi-leg ticket builder with customizable odds ranges and market weights.'
  },
  converter: {
    id: 'converter',
    name: 'Bet Code Converter',
    category: 'Betting Tools',
    icon: '🎫',
    isVip: false,
    description: 'Seamless cross-platform betslip converter across 50 top sportsbooks worldwide.'
  },
  toptips: {
    id: 'toptips',
    name: 'Top Tips & Hot Trends Tracker',
    category: 'Betting Suite',
    icon: '⭐',
    isVip: false,
    description: 'Real-time statistical streaks and market trends across European and worldwide leagues.'
  }
};

const VIP_FEATURES_STORAGE_KEY = 'deeppredictbet_vip_features';

function getVipFeaturesConfig() {
  try {
    const raw = localStorage.getItem(VIP_FEATURES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return Object.assign({}, DEFAULT_VIP_FEATURES, parsed);
    }
  } catch (e) {
    console.error('Error reading VIP features config:', e);
  }
  return Object.assign({}, DEFAULT_VIP_FEATURES);
}

function saveVipFeaturesConfig(config) {
  try {
    localStorage.setItem(VIP_FEATURES_STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Error saving VIP features config:', e);
  }
  refreshVipFeatureBadges();
}

function isFeatureVip(featureId) {
  const config = getVipFeaturesConfig();
  const feat = config[featureId];
  return Boolean(feat && feat.isVip);
}

function canAccessFeature(featureId) {
  if (!isFeatureVip(featureId)) {
    return true;
  }
  if (typeof getStoredVipSubscription === 'function') {
    const sub = getStoredVipSubscription();
    if (sub && sub.active) return true;
  }
  return false;
}

function setFeatureVipStatus(featureId, isVip) {
  const config = getVipFeaturesConfig();
  if (!config[featureId] && DEFAULT_VIP_FEATURES[featureId]) {
    config[featureId] = Object.assign({}, DEFAULT_VIP_FEATURES[featureId]);
  }
  if (config[featureId]) {
    config[featureId].isVip = Boolean(isVip);
    saveVipFeaturesConfig(config);

    const featName = config[featureId].name;
    const msg = isVip
      ? '👑 "' + featName + '" is now moved to VIP Packages & VIP Club!'
      : '🔓 "' + featName + '" is now removed from VIP (Free for all)!';
    if (typeof showAppNotification === 'function') showAppNotification(msg);
    else if (typeof showToast === 'function') showToast(msg);
    else alert(msg);

    renderVipFeatureManagerList();
    return true;
  }
  return false;
}

function toggleFeatureVipStatus(featureId, isChecked) {
  setFeatureVipStatus(featureId, isChecked);
}

function batchToggleVipFeatures(setAllVip) {
  const config = getVipFeaturesConfig();
  Object.keys(config).forEach(k => {
    config[k].isVip = Boolean(setAllVip);
  });
  saveVipFeaturesConfig(config);
  renderVipFeatureManagerList();

  const msg = setAllVip
    ? '👑 All analytical tools are now moved into VIP!'
    : '🔓 All analytical tools are now Free for all users!';
  if (typeof showAppNotification === 'function') showAppNotification(msg);
  else if (typeof showToast === 'function') showToast(msg);
  else alert(msg);
}

function resetVipFeaturesToDefault() {
  saveVipFeaturesConfig(DEFAULT_VIP_FEATURES);
  renderVipFeatureManagerList();
  const msg = '🔄 VIP feature configuration reset to factory defaults.';
  if (typeof showAppNotification === 'function') showAppNotification(msg);
  else if (typeof showToast === 'function') showToast(msg);
  else alert(msg);
}

function checkFeatureVipAccess(featureId, customTitle) {
  const config = getVipFeaturesConfig();
  const feat = config[featureId];
  if (!feat || !feat.isVip) {
    return true;
  }

  let isSubscribed = false;
  if (typeof getStoredVipSubscription === 'function') {
    const sub = getStoredVipSubscription();
    isSubscribed = Boolean(sub && sub.active);
  }

  if (isSubscribed) {
    return true;
  }

  window.currentVipTriggerFeature = feat;
  const msg = '👑 "' + feat.name + '" is locked! Upgrade to VIP to unlock.';
  if (typeof showAppNotification === 'function') showAppNotification(msg);
  else if (typeof showToast === 'function') showToast(msg);

  if (typeof openVipSubscriptionModal === 'function') {
    openVipSubscriptionModal('annual', feat);
  }
  return false;
}

function handleVipLinkClick(event, featureId) {
  if (isFeatureVip(featureId)) {
    if (!canAccessFeature(featureId)) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      checkFeatureVipAccess(featureId);
      return false;
    }
  }
  return true;
}

function refreshVipFeatureBadges() {
  const config = getVipFeaturesConfig();
  let isSubscribed = false;
  if (typeof getStoredVipSubscription === 'function') {
    const sub = getStoredVipSubscription();
    isSubscribed = Boolean(sub && sub.active);
  }

  const tabMapping = {
    machine: 'tool-tab-machine',
    doctor: 'tool-tab-doctor',
    arbitrage: 'tool-tab-arbitrage',
    backtester: 'tool-tab-backtester',
    toptips: 'tool-tab-toptips',
    filters: 'tool-tab-filters',
    valuebot: 'tool-tab-valuebot'
  };

  Object.keys(tabMapping).forEach(featId => {
    const btnId = tabMapping[featId];
    const btn = document.getElementById(btnId);
    if (!btn) return;

    const existingBadge = btn.querySelector('.vip-feature-badge');
    if (existingBadge) existingBadge.remove();

    const feat = config[featId];
    if (feat && feat.isVip) {
      const badge = document.createElement('span');
      badge.className = 'vip-feature-badge';
      if (isSubscribed) {
        badge.innerHTML = '👑 VIP';
        badge.style.cssText = 'background: rgba(16,185,129,0.25); color: #34d399; border: 1px solid #10b981; font-size: 0.62rem; font-weight: 800; padding: 1px 5px; border-radius: 4px; margin-left: 6px; text-transform: uppercase; vertical-align: middle; display: inline-block;';
      } else {
        badge.innerHTML = '🔒 VIP';
        badge.style.cssText = 'background: rgba(234,179,8,0.2); color: #fbbf24; border: 1px solid #eab308; font-size: 0.62rem; font-weight: 800; padding: 1px 5px; border-radius: 4px; margin-left: 6px; text-transform: uppercase; vertical-align: middle; display: inline-block;';
      }
      btn.appendChild(badge);
    }
  });

  const drawerLinks = document.querySelectorAll('#mobile-nav-drawer a[href]');
  drawerLinks.forEach(link => {
    const href = link.getAttribute('href') || '';
    const cleanId = href.replace(/^#/, '');
    if (config[cleanId]) {
      const existingBadge = link.querySelector('.vip-drawer-badge');
      if (existingBadge) existingBadge.remove();

      if (config[cleanId].isVip) {
        const badge = document.createElement('span');
        badge.className = 'vip-drawer-badge';
        badge.style.cssText = isSubscribed
          ? 'background: rgba(16,185,129,0.2); color: #34d399; font-size: 0.65rem; font-weight: 800; padding: 2px 6px; border-radius: 4px; margin-left: auto; border: 1px solid #10b981;'
          : 'background: rgba(234,179,8,0.15); color: #fbbf24; font-size: 0.65rem; font-weight: 800; padding: 2px 6px; border-radius: 4px; margin-left: auto; border: 1px solid #eab308;';
        badge.innerText = isSubscribed ? '👑 VIP' : '🔒 VIP';
        link.appendChild(badge);
      }
    }
  });
}

function openVipFeatureManager() {
  const modal = document.getElementById('vip-feature-manager-modal');
  if (!modal) return;
  renderVipFeatureManagerList();
  modal.classList.add('active');
  modal.style.display = 'flex';
  modal.style.opacity = '1';
  modal.style.pointerEvents = 'all';
  modal.style.visibility = 'visible';
  modal.style.zIndex = '10000002';
  document.body.style.overflow = 'hidden';
}

function closeVipFeatureManager(e, force = false) {
  const modal = document.getElementById('vip-feature-manager-modal');
  if (!modal) return;
  if (force || (e && (e.target === modal || (e.target && e.target.classList && e.target.classList.contains('modal-close'))))) {
    modal.classList.remove('active');
    modal.style.display = 'none';
    modal.style.opacity = '0';
    modal.style.pointerEvents = 'none';
    modal.style.visibility = 'hidden';
    document.body.style.overflow = '';
  }
}

function renderVipFeatureManagerList() {
  const container = document.getElementById('vip-features-list-container');
  if (!container) return;

  const config = getVipFeaturesConfig();
  container.innerHTML = '';

  Object.keys(config).forEach(key => {
    const feat = config[key];
    const isVip = Boolean(feat.isVip);

    const item = document.createElement('div');
    item.style.cssText = 'display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.04); border: 1px solid ' + (isVip ? 'rgba(16,185,129,0.45)' : 'rgba(255,255,255,0.08)') + '; border-radius: 14px; padding: 12px 14px; transition: all 0.2s ease;';

    item.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px; max-width: 80%;">
        <div style="width: 36px; height: 36px; border-radius: 10px; background: rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: center; font-size: 1.25rem; flex-shrink: 0;">
          ${feat.icon || '⭐'}
        </div>
        <div>
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <span style="font-weight: 800; font-size: 0.88rem; color: #ffffff;">${feat.name}</span>
            <span style="font-size: 0.65rem; font-weight: 900; padding: 2px 7px; border-radius: 6px; text-transform: uppercase; ${isVip ? 'background: rgba(16,185,129,0.2); color: #34d399; border: 1px solid rgba(16,185,129,0.4);' : 'background: rgba(255,255,255,0.08); color: #94a3b8; border: 1px solid rgba(255,255,255,0.1);'}">
              ${isVip ? '👑 VIP ONLY' : 'FREE'}
            </span>
          </div>
          <div style="font-size: 0.72rem; color: #94a3b8; margin-top: 2px; line-height: 1.35;">
            ${feat.description}
          </div>
        </div>
      </div>
      <label class="vip-switch-toggle" style="position: relative; display: inline-block; width: 48px; height: 26px; flex-shrink: 0; cursor: pointer;">
        <input type="checkbox" ${isVip ? 'checked' : ''} onchange="toggleFeatureVipStatus('${feat.id}', this.checked)" style="opacity: 0; width: 0; height: 0;">
        <span class="vip-switch-slider ${isVip ? 'active' : ''}"></span>
      </label>
    `;

    container.appendChild(item);
  });
}

window.DEFAULT_VIP_FEATURES = DEFAULT_VIP_FEATURES;
window.getVipFeaturesConfig = getVipFeaturesConfig;
window.saveVipFeaturesConfig = saveVipFeaturesConfig;
window.isFeatureVip = isFeatureVip;
window.canAccessFeature = canAccessFeature;
window.setFeatureVipStatus = setFeatureVipStatus;
window.toggleFeatureVipStatus = toggleFeatureVipStatus;
window.batchToggleVipFeatures = batchToggleVipFeatures;
window.resetVipFeaturesToDefault = resetVipFeaturesToDefault;
window.checkFeatureVipAccess = checkFeatureVipAccess;
window.handleVipLinkClick = handleVipLinkClick;
window.refreshVipFeatureBadges = refreshVipFeatureBadges;
window.openVipFeatureManager = openVipFeatureManager;
window.closeVipFeatureManager = closeVipFeatureManager;
window.renderVipFeatureManagerList = renderVipFeatureManagerList;

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(refreshVipFeatureBadges, 150);
    });
  } else {
    setTimeout(refreshVipFeatureBadges, 150);
  }
}
