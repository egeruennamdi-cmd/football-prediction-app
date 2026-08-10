// UI Controller for KickAI

// Helper to calculate DeepPredictBet-style tips dynamically based on selected market
function getMatchTip(match) {
  const market = window.appState.activeMarketSubmenu || 'all';
  const topTip = window.appState.activeTopTip || 'all';

  if (market === '1x2') {
    if (match.predictions.home > 45) return 'Home Win (1)';
    if (match.predictions.away > 45) return 'Away Win (2)';
    return 'Draw (X)';
  }

// Expose ui.js functions globally
window.closeLeaderboardModal = closeLeaderboardModal;
window.closeProfileModal = closeProfileModal;
window.closeScoutModal = closeScoutModal;
window.closeStoreModal = closeStoreModal;
window.closeSupportModal = closeSupportModal;
window.openGeneralScout = openGeneralScout;
window.openLeaderboardModal = openLeaderboardModal;
window.openProfileModal = openProfileModal;
window.openScoutModal = openScoutModal;
window.openStoreModal = openStoreModal;
window.openSupportModal = openSupportModal;
window.switchInlineLeadTab = switchInlineLeadTab;
window.switchInlineStoreTab = switchInlineStoreTab;
window.switchInlineUserTab = switchInlineUserTab;
window.switchLeadTab = switchLeadTab;
window.switchModalTab = switchModalTab;
window.switchProfileTab = switchProfileTab;
window.switchScannerMode = switchScannerMode;
window.switchStoreTab = switchStoreTab;
window.switchSupportTab = switchSupportTab;
window.switchTool = switchTool;
window.switchTopTipsToolMarket = switchTopTipsToolMarket;
window.toggleCheckboxCard = toggleCheckboxCard;
window.toggleFAQCollapse = toggleFAQCollapse;
window.triggerCloseScoutModal = triggerCloseScoutModal;
window.buyCoinsInline = buyCoinsInline;
window.claimDailyRewardInline = claimDailyRewardInline;
window.claimDailyRewardNav = claimDailyRewardNav;
window.purchaseCoins = purchaseCoins;
window.redeemVoucherInline = redeemVoucherInline;
window.redeemVoucherCode = redeemVoucherCode;
window.submitSupportTicket = submitSupportTicket;
window.submitSupportTicketInline = submitSupportTicketInline;
window.renderLiveScanner = renderLiveScanner;
window.renderPrematchScanner = renderPrematchScanner;
window.openLiveScannerHub = openLiveScannerHub;

  if (market === 'overunder') {
    return match.predictions.home > 40 ? 'Over 2.5 Goals' : 'Under 2.5 Goals';
  }
  if (market === 'btts') {
    return match.predictions.home > 45 ? 'BTTS - Yes' : 'BTTS - No';
  }
  if (market === 'corners') {
    return 'Corners Over 8.5';
  }
  if (market === 'doublechance') {
    if (match.predictions.home > 40) return '1X (Home/Draw)';
    return 'X2 (Draw/Away)';
  }
  if (market === 'toptips') {
    const tipMap = {
      'uo15': 'Over 1.5 Goals',
      'uo35': 'Under 3.5 Goals',
      'uoht05': 'Over 0.5 Goals HT',
      'uoht15': 'Under 1.5 Goals HT',
      'uo2h05': 'Over 0.5 Goals 2nd Half',
      'uo2h15': 'Under 1.5 Goals 2nd Half',
      'bttsht': 'BTTS HT - No',
      'btts2h': 'BTTS 2nd H - Yes',
      'c75': 'Corners > 7.5',
      'c85': 'Corners > 8.5',
      'c95': 'Corners > 9.5',
      'c105': 'Corners > 10.5'
    };
    if (topTip !== 'all' && tipMap[topTip]) {
      return tipMap[topTip];
    }
    // If 'all', show the first matching top tip
    if (match.topTips && match.topTips.length > 0) {
      return tipMap[match.topTips[0]] || 'Over 1.5 Goals';
    }
    return 'Over 1.5 Goals';
  }

  // Fallback default tip mapping
  if (match.id === 'match-1') return '1X';
  if (match.id === 'match-2') return '1';
  if (match.id === 'match-3') return 'Over 2.5';
  if (match.id === 'match-4') return '1 & Over 2.5';
  if (match.id === 'match-5') return '1';
  if (match.id === 'match-6') return 'Under 2.5';
  return '1X';
}

// Render match cards dynamically
function renderMatchCards(fixtures) {
  const grid = document.getElementById("fixtures-grid");
  if (!grid) return;
  grid.innerHTML = "";

  if (fixtures.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 12px; color: var(--text-muted); display: inline-block;">
          <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>
        </svg>
        <p>No matches matching this filter are active today.</p>
      </div>
    `;
    return;
  }

  fixtures.forEach(match => {
    const isLocked = match.isPremium && !window.appState.premiumUnlocked;
    const card = document.createElement("div");
    card.className = `match-card ${isLocked ? 'premium-locked' : ''}`;
    card.id = `card-${match.id}`;
    if (!isLocked) {
      card.setAttribute("onclick", `openScoutModal('${match.id}')`);
    }

    const isWatched = window.appState.watchlist.includes(match.id);
    const starSymbol = isWatched ? "★" : "☆";

    if (isLocked) {
      card.innerHTML = `
        <div style="position: absolute; left: 16px; top: 16px; z-index: 10;">
          <button class="watchlist-star ${isWatched ? 'watched' : ''}" onclick="toggleWatchlist('${match.id}', event)" style="background: none; border: none; color: ${isWatched ? '#f59e0b' : 'var(--text-muted)'}; font-size: 1.15rem; cursor: pointer; padding: 0; outline: none; transition: var(--transition-fast);">
            ${starSymbol}
          </button>
        </div>
        <div class="premium-lock-box">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div class="premium-lock-icon">👑</div>
            <div>
              <h4 class="premium-lock-title">Premium Prediction</h4>
              <p class="premium-lock-desc">Unlock DeepPredict Pro algorithmic outcomes.</p>
            </div>
          </div>
          <a href="#premium" class="btn btn-premium btn-premium-card" onclick="smoothScrollToPremium()">Unlock Pro Pick</a>
        </div>
      `;
      grid.appendChild(card);
      return;
    }

    // Build Form Badges Home
    const homeFormHtml = match.homeTeam.form.map(f => `<span class="form-badge ${f}">${f}</span>`).join("");
    // Build Form Badges Away
    const awayFormHtml = match.awayTeam.form.map(f => `<span class="form-badge ${f}">${f}</span>`).join("");

    // Confidence Dot Theme
    const confidenceClass = match.confidence === 'high' ? 'high' : 'medium';

    // Calculate stats parameters
    const hashStr = (match.homeTeam.name + match.awayTeam.name);
    let hash = 0;
    for (let i = 0; i < hashStr.length; i++) {
      hash = hashStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    const seed = Math.abs(hash);

    const avgScored = parseFloat((1.0 + (seed % 19) * 0.1).toFixed(1));
    const avgConceded = parseFloat((0.6 + (Math.floor(seed / 4) % 17) * 0.1).toFixed(1));
    const avgXG = parseFloat((0.8 + (Math.floor(seed / 16) % 18) * 0.1).toFixed(1));
    const corners = parseFloat((7.5 + (Math.floor(seed / 64) % 9) * 0.5).toFixed(1));

    const homeFormVal = match.homeTeam.form ? match.homeTeam.form.reduce((sum, val) => sum + (val === 'W' ? 20 : val === 'D' ? 10 : 0), 0) : 60;
    const awayFormVal = match.awayTeam.form ? match.awayTeam.form.reduce((sum, val) => sum + (val === 'W' ? 20 : val === 'D' ? 10 : 0), 0) : 50;
    const avgForm = Math.round((homeFormVal + awayFormVal) / 2);

    card.innerHTML = `
      <div class="match-header">
        <div style="display: flex; align-items: center; gap: 8px;">
          <button class="watchlist-star ${isWatched ? 'watched' : ''}" 
                  onclick="toggleWatchlist('${match.id}', event)" 
                  onmouseover="this.style.color='#f59e0b'" 
                  onmouseout="if(!this.classList.contains('watched')) this.style.color='var(--text-muted)'" 
                  style="background: none; border: none; color: ${isWatched ? '#f59e0b' : 'var(--text-muted)'}; font-size: 1.15rem; cursor: pointer; padding: 0; outline: none; transition: var(--transition-fast);" 
                  title="Monitor this Match">
            ${starSymbol}
          </button>
          <span class="league-badge">
            <span>${match.leagueEmoji}</span> ${match.league}
          </span>
        </div>
        <span class="match-time ${match.isLive ? 'live' : ''}">
          ${match.isLive ? '<span class="live-dot" style="width: 5px; height: 5px; border-radius: 50%; background: var(--danger); display: inline-block; margin-right: 4px; animation: pulse 1.5s infinite;"></span>' : ''}
          ${match.time}
        </span>
      </div>

      <div class="teams-wrapper">
        <div class="team">
          <div class="team-logo">${match.homeTeam.logo}</div>
          <span class="team-name" title="${match.homeTeam.name}">${match.homeTeam.name}</span>
          <div style="display: flex; gap: 3px; margin-top: 4px;" class="form-badges-container">${homeFormHtml}</div>
        </div>

        <div class="vs-divider">
          <span style="font-size: 0.75rem; color: var(--text-muted);">vs</span>
          <span class="vs-scores">${(match.isLive || match.time === 'FT') ? `${match.scores.home} - ${match.scores.away}` : '? - ?'}</span>
        </div>

        <div class="team">
          <div class="team-logo">${match.awayTeam.logo}</div>
          <span class="team-name" title="${match.awayTeam.name}">${match.awayTeam.name}</span>
          <div style="display: flex; gap: 3px; margin-top: 4px;" class="form-badges-container">${awayFormHtml}</div>
        </div>
      </div>

      <div class="prediction-bar-container">
        <div class="prediction-bar">
          <div class="bar-segment home" style="width: ${match.predictions.home}%"></div>
          <div class="bar-segment draw" style="width: ${match.predictions.draw}%"></div>
          <div class="bar-segment away" style="width: ${match.predictions.away}%"></div>
        </div>
        <div class="bar-percentages">
          <div class="pct-item">
            <span class="pct-lbl">1</span>
            <span class="pct-val home">${match.predictions.home}%</span>
          </div>
          <div class="pct-item">
            <span class="pct-lbl">X</span>
            <span class="pct-val draw">${match.predictions.draw}%</span>
          </div>
          <div class="pct-item">
            <span class="pct-lbl">2</span>
            <span class="pct-val away">${match.predictions.away}%</span>
          </div>
        </div>
      </div>

      <div class="insight-row ${match.isPremium ? 'premium' : ''}">
        <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 500; margin-right: 4px;" class="mobile-only-label">Tip:</span>
        <span>${getMatchTip(match)}</span>
      </div>

      <!-- Statistical Parameters Badges -->
      <div style="display: flex; flex-wrap: wrap; gap: 6px; margin: 10px 0 6px; border-top: 1px dashed var(--border-color); padding-top: 8px;">
        <span style="font-size: 0.68rem; padding: 2px 6px; background: rgba(26,104,219,0.06); border: 1px solid rgba(26,104,219,0.12); border-radius: var(--radius-sm); color: var(--primary); font-weight: 600;">
          📈 Form: ${avgForm}%
        </span>
        <span style="font-size: 0.68rem; padding: 2px 6px; background: rgba(16,185,129,0.06); border: 1px solid rgba(16,185,129,0.12); border-radius: var(--radius-sm); color: var(--secondary); font-weight: 600;">
          ⚽ Goals: ${avgScored.toFixed(1)} / ${avgConceded.toFixed(1)}
        </span>
        <span style="font-size: 0.68rem; padding: 2px 6px; background: rgba(245,158,11,0.06); border: 1px solid rgba(245,158,11,0.12); border-radius: var(--radius-sm); color: var(--accent-gold); font-weight: 600;">
          🧠 xG: ${avgXG.toFixed(1)}
        </span>
        <span style="font-size: 0.68rem; padding: 2px 6px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: var(--radius-sm); color: var(--text-secondary); font-weight: 600;">
          📐 Corners: ${corners}
        </span>
      </div>

      <div class="match-footer">
        <div class="confidence-meter">
          <span class="confidence-dot ${confidenceClass}"></span>
          <span style="color: var(--text-secondary); font-size: 0.75rem;">Conf: <b>${match.confidenceVal}%</b></span>
        </div>
        <div style="display: flex; align-items: center; gap: 12px; justify-content: flex-end; width: 100%;">
          <span style="font-family: var(--font-display); font-weight: 700; font-size: 0.95rem; color: var(--text-primary);" class="desktop-only-odds">@1.82</span>
          <button class="btn btn-secondary scout-btn" onclick="openScoutModal('${match.id}')" style="padding: 6px 12px; font-size: 0.8rem; height: 32px;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right: 4px; display: inline-block; vertical-align: middle;"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Scout
          </button>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

// Custom CSS dynamic bar chart rendering
function renderAccuracyChart() {
  const chartWrapper = document.getElementById("chart-wrapper");
  if (!chartWrapper) return;
  chartWrapper.innerHTML = "";

  const data = HISTORICAL_PERFORMANCE.accuracy;
  const labels = HISTORICAL_PERFORMANCE.labels;

  data.forEach((val, index) => {
    const col = document.createElement("div");
    col.className = "bar-chart-col";

    const fill = document.createElement("div");
    fill.className = "bar-chart-fill";
    // Animate height on creation
    fill.style.height = "0%";
    
    fill.innerHTML = `
      <div class="chart-tooltip">${val}% Match</div>
    `;

    const lbl = document.createElement("span");
    lbl.className = "chart-x-lbl";
    lbl.innerText = labels[index];

    col.appendChild(fill);
    col.appendChild(lbl);
    chartWrapper.appendChild(col);

    // Trigger visual growth animation
    setTimeout(() => {
      fill.style.height = `${val}%`;
    }, 100 + (index * 50));
  });
}

// Open AI Scout Modal for a specific match
function openScoutModal(matchId) {
  const modal = document.getElementById("scout-modal");
  if (!modal) return;

  const match = MATCH_DATA.find(m => m.id === matchId);
  if (!match) return;

  // Set active context in global state
  window.appState.activeScoutMatchId = matchId;

  // Sync modal user coins display
  const coinsDisplay = document.getElementById("modal-user-coins-display");
  if (coinsDisplay) {
    coinsDisplay.innerText = window.appState.userCoins || 500;
  }

  // Reset modal tabs to Chat tab
  const chatTabBtn = document.getElementById("modal-tab-btn-chat");
  const statsTabBtn = document.getElementById("modal-tab-btn-stats");
  const h2hTabBtn = document.getElementById("modal-tab-btn-h2h");
  const oddsTabBtn = document.getElementById("modal-tab-btn-odds");
  if (chatTabBtn && statsTabBtn && h2hTabBtn && oddsTabBtn) {
    chatTabBtn.classList.add("active");
    statsTabBtn.classList.remove("active");
    h2hTabBtn.classList.remove("active");
    oddsTabBtn.classList.remove("active");
  }

  const chatPane = document.getElementById("modal-pane-chat");
  const statsPane = document.getElementById("modal-pane-stats");
  const h2hPane = document.getElementById("modal-pane-h2h");
  const oddsPane = document.getElementById("modal-pane-odds");
  if (chatPane && statsPane && h2hPane && oddsPane) {
    chatPane.style.display = "block";
    statsPane.style.display = "none";
    h2hPane.style.display = "none";
    oddsPane.style.display = "none";
  }

  // Update modal titles
  const modalTitle = document.getElementById("scout-modal-title");
  if (modalTitle) {
    modalTitle.innerText = `Scouting: ${match.homeTeam.name} vs ${match.awayTeam.name}`;
  }

  // Populates Scout Modal parameters banner
  const paramBanner = document.getElementById("scout-modal-parameters-banner");
  if (paramBanner) {
    const hashStr = (match.homeTeam.name + match.awayTeam.name);
    let hash = 0;
    for (let i = 0; i < hashStr.length; i++) {
      hash = hashStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    const seed = Math.abs(hash);

    const avgScored = parseFloat((1.0 + (seed % 19) * 0.1).toFixed(1));
    const avgConceded = parseFloat((0.6 + (Math.floor(seed / 4) % 17) * 0.1).toFixed(1));
    const avgXG = parseFloat((0.8 + (Math.floor(seed / 16) % 18) * 0.1).toFixed(1));
    const corners = parseFloat((7.5 + (Math.floor(seed / 64) % 9) * 0.5).toFixed(1));

    const homeFormVal = match.homeTeam.form ? match.homeTeam.form.reduce((sum, val) => sum + (val === 'W' ? 20 : val === 'D' ? 10 : 0), 0) : 60;
    const awayFormVal = match.awayTeam.form ? match.awayTeam.form.reduce((sum, val) => sum + (val === 'W' ? 20 : val === 'D' ? 10 : 0), 0) : 50;
    const avgForm = Math.round((homeFormVal + awayFormVal) / 2);

    paramBanner.style.display = "block";
    paramBanner.innerHTML = `
      <div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: space-between; align-items: center;">
        <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Model Parameters</span>
        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
          <span style="font-size: 0.68rem; padding: 2px 6px; background: rgba(26,104,219,0.06); border: 1px solid rgba(26,104,219,0.12); border-radius: var(--radius-sm); color: var(--primary); font-weight: 600;">
            📈 Form: ${avgForm}%
          </span>
          <span style="font-size: 0.68rem; padding: 2px 6px; background: rgba(16,185,129,0.06); border: 1px solid rgba(16,185,129,0.12); border-radius: var(--radius-sm); color: var(--secondary); font-weight: 600;">
            ⚽ Goals: ${avgScored.toFixed(1)} / ${avgConceded.toFixed(1)}
          </span>
          <span style="font-size: 0.68rem; padding: 2px 6px; background: rgba(245,158,11,0.06); border: 1px solid rgba(245,158,11,0.12); border-radius: var(--radius-sm); color: var(--accent-gold); font-weight: 600;">
            🧠 xG: ${avgXG.toFixed(1)}
          </span>
          <span style="font-size: 0.68rem; padding: 2px 6px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: var(--radius-sm); color: var(--text-secondary); font-weight: 600;">
            📐 Corners: ${corners}
          </span>
        </div>
      </div>
    `;
  }

  // Clear chat log and render initial system greeting
  const chatBody = document.getElementById("scout-chat-body");
  if (chatBody) {
    chatBody.innerHTML = `
      <div class="chat-bubble scout">
        Hello! I am your <b>DeepPredict Scout</b>. Here is my strategic briefing for the upcoming fixture between <b>${match.homeTeam.name}</b> and <b>${match.awayTeam.name}</b>:
        
        <div class="scout-match-summary">
          <div class="scout-sum-row">
            <span>League</span>
            <span>${match.leagueEmoji} ${match.league}</span>
          </div>
          <div class="scout-sum-row">
            <span>Confidence Rating</span>
            <span>${match.confidenceVal}%</span>
          </div>
          <div class="scout-sum-row">
            <span>Distribution (1 / X / 2)</span>
            <span>${match.predictions.home}% / ${match.predictions.draw}% / ${match.predictions.away}%</span>
          </div>
          <div class="scout-sum-prediction">
            <span>Recommended Angle</span>
            <span>${match.predictions.home > match.predictions.away ? `${match.homeTeam.name} Win` : `${match.awayTeam.name} Win`}</span>
          </div>
        </div>
        
        <p style="margin-top: 10px;">${match.insight}</p>
        <p style="margin-top: 10px; font-style: italic; font-size: 0.85rem; color: var(--text-muted);">Ask me questions like: "What is their direct tactical setup?" or "What are the in-play odds angles?"</p>
      </div>
    `;
  }

  modal.classList.add("active");
  document.body.style.overflow = "hidden"; // Prevent background scroll
}

// Open AI Scout Modal in General/General mode (no specific match)
function openGeneralScout() {
  const modal = document.getElementById("scout-modal");
  if (!modal) return;

  window.appState.activeScoutMatchId = null;

  const paramBanner = document.getElementById("scout-modal-parameters-banner");
  if (paramBanner) {
    paramBanner.style.display = "none";
  }

  const modalTitle = document.getElementById("scout-modal-title");
  if (modalTitle) {
    modalTitle.innerText = "DeepPredict Master Scout";
  }

  const chatBody = document.getElementById("scout-chat-body");
  if (chatBody) {
    chatBody.innerHTML = `
      <div class="chat-bubble scout">
        Welcome to the <b>DeepPredict Master Briefing Center</b>. I analyze overall league trends, team forms, and algorithmic accuracy.
        <br><br>
        Currently, my algorithms are monitoring <b>${MATCH_DATA.length} major fixtures</b> today. Our general weekly win-rate is resting at a solid <b>${HISTORICAL_PERFORMANCE.winRate}</b>.
        <br><br>
        Ask me about league dynamics, match specific setups, or historical ledger stats!
      </div>
    `;
  }

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

// Toggle active checkboxes in DeepPredict Machine cards
function toggleCheckboxCard(card, event) {
  const checkbox = card.querySelector('input[type="checkbox"]');
  if (!checkbox) return;
  
  const ev = event || (typeof window !== 'undefined' ? window.event : null);

  if (ev && (ev.target === checkbox || ev.target.tagName === 'INPUT')) {
    if (checkbox.checked) {
      card.classList.add("selected");
    } else {
      card.classList.remove("selected");
    }
  } else {
    checkbox.checked = !checkbox.checked;
    if (checkbox.checked) {
      card.classList.add("selected");
    } else {
      card.classList.remove("selected");
    }
  }
}

// Switch between tools in DeepPredict Betting Suite
window.switchTool = function switchTool(toolId, btn) {
  // If user is on another view, ensure view-generator is active
  const genView = document.getElementById("view-generator");
  if (genView && !genView.classList.contains("active")) {
    const allViews = document.querySelectorAll(".page-view");
    allViews.forEach(v => v.classList.remove("active"));
    genView.classList.add("active");
  }

  const suiteSec = document.getElementById("deeppredictbet-tools");
  if (!suiteSec) return;
  
  const buttons = suiteSec.querySelectorAll(".tabs-container > .tab-btn");
  buttons.forEach(b => b.classList.remove("active"));
  
  if (!btn) {
    btn = Array.from(buttons).find(b => {
      const attr = b.getAttribute("onclick");
      return attr && attr.includes(`'${toolId}'`);
    }) || buttons[0];
  }

  if (btn && btn.classList) {
    btn.classList.add("active");
  }

  // Hide all panes
  const panes = suiteSec.querySelectorAll(".tool-content-pane");
  panes.forEach(p => {
    p.classList.remove("active");
    p.style.display = "none";
  });

  // Show active pane
  const activePane = suiteSec.querySelector(`#tool-${toolId}`) || document.getElementById(`tool-${toolId}`);
  if (activePane) {
    activePane.classList.add("active");
    activePane.style.display = "flex";
    activePane.style.flexDirection = "column";
    if (toolId === 'valuebot') {
      if (typeof renderValueBetBot === 'function') renderValueBetBot();
    } else if (toolId === 'toptips') {
      if (typeof renderTopTipsTool === 'function') renderTopTipsTool();
    } else if (toolId === 'backtester') {
      if (typeof syncBacktesterPremiumState === 'function') syncBacktesterPremiumState();
    } else if (toolId === 'machine' || toolId === 'generator') {
      if (typeof generateMachineTicket === 'function') generateMachineTicket();
    }
  }
}

// Switch between Live In-Play and Pre-Match Odds scanner modes
function switchScannerMode(mode, btn) {
  if (!btn) return;
  // Update button active state
  const parent = btn.parentElement;
  if (parent) {
    const buttons = parent.querySelectorAll(".tab-btn");
    buttons.forEach(b => b.classList.remove("active"));
  }
  if (btn.classList) btn.classList.add("active");

  // Get table header and container
  const header = document.getElementById("scanner-table-header");
  const container = document.getElementById("scanner-rows-container");
  if (!header || !container) return;

  if (mode === 'live') {
    // Set headers for live
    header.innerHTML = `
      <span>Match & Clock</span>
      <span>Live Stats Summary</span>
      <span>In-Play Odds</span>
      <span class="desktop-only">Alerts</span>
    `;
    renderLiveScanner();
  } else {
    // Set headers for pre-match
    header.innerHTML = `
      <span>Match & Kick-Off</span>
      <span>Pre-Match Criteria</span>
      <span>Odds Dropping (Initial → Now)</span>
      <span class="desktop-only">Alerts</span>
    `;
    renderPrematchScanner();
  }
}

// Render Pre-match Dropping Odds Scanner
function renderPrematchScanner() {
  const container = document.getElementById("scanner-rows-container");
  if (!container) return;
  container.innerHTML = "";

  const upcoming = MATCH_DATA.filter(m => !m.isLive);
  if (upcoming.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 24px; color: var(--text-muted); font-size: 0.85rem;">
        No upcoming pre-match fixtures right now.
      </div>
    `;
    return;
  }

  upcoming.forEach(match => {
    const row = document.createElement("div");
    row.className = "scanner-match-row";
    row.style.cursor = "pointer";
    row.onclick = () => openScoutModal(match.id);

    // Calculate unique seed-based dropping odds
    const hashStr = (match.homeTeam.name + match.awayTeam.name);
    let hash = 0;
    for (let i = 0; i < hashStr.length; i++) {
      hash = hashStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    const seed = Math.abs(hash);

    const avgScored = parseFloat((1.0 + (seed % 19) * 0.1).toFixed(1));
    const avgConceded = parseFloat((0.6 + ((seed >> 2) % 17) * 0.1).toFixed(1));
    const avgXG = parseFloat((0.8 + ((seed >> 4) % 18) * 0.1).toFixed(1));
    const corners = parseFloat((7.5 + ((seed >> 6) % 9) * 0.5).toFixed(1));

    const homeFormVal = match.homeTeam.form ? match.homeTeam.form.reduce((sum, val) => sum + (val === 'W' ? 20 : val === 'D' ? 10 : 0), 0) : 60;
    const awayFormVal = match.awayTeam.form ? match.awayTeam.form.reduce((sum, val) => sum + (val === 'W' ? 20 : val === 'D' ? 10 : 0), 0) : 50;
    const avgForm = Math.round((homeFormVal + awayFormVal) / 2);

    const oddsDropInit = parseFloat((2.0 + (seed % 15) * 0.1).toFixed(2));
    const dropPercent = 10 + (seed % 16); // 10% to 25% drop
    const oddsDropCurrent = parseFloat((oddsDropInit * (1 - dropPercent / 100)).toFixed(2));

    row.innerHTML = `
      <!-- Column 1: Match & Kick-Off -->
      <div>
        <div style="font-weight: 700; color: var(--text-primary); font-size: 0.85rem;">
          ${match.homeTeam.name} vs ${match.awayTeam.name}
        </div>
        <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">
          ${match.leagueEmoji} ${match.league} • Kick-Off Today
        </div>
        <!-- Pre-Match Scanner stats parameters row -->
        <div style="display: flex; gap: 4px; margin-top: 6px; flex-wrap: wrap;">
          <span style="font-size: 0.6rem; padding: 1px 4px; background: rgba(26,104,219,0.06); border: 1px solid rgba(26,104,219,0.12); border-radius: var(--radius-sm); color: var(--primary); font-weight: 600;">Form: ${avgForm}%</span>
          <span style="font-size: 0.6rem; padding: 1px 4px; background: rgba(16,185,129,0.06); border: 1px solid rgba(16,185,129,0.12); border-radius: var(--radius-sm); color: var(--secondary); font-weight: 600;">Gls: ${avgScored.toFixed(1)}/${avgConceded.toFixed(1)}</span>
          <span style="font-size: 0.6rem; padding: 1px 4px; background: rgba(245,158,11,0.06); border: 1px solid rgba(245,158,11,0.12); border-radius: var(--radius-sm); color: var(--accent-gold); font-weight: 600;">xG: ${avgXG.toFixed(1)}</span>
          <span style="font-size: 0.6rem; padding: 1px 4px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: var(--radius-sm); color: var(--text-secondary); font-weight: 600;">Crn: ${corners}</span>
        </div>
      </div>

      <!-- Column 2: Pre-Match Criteria -->
      <div>
        <div style="font-size: 0.75rem; color: var(--secondary); font-weight: 700; display: flex; align-items: center; gap: 4px;">
          <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--secondary);"></span>
          Odds Drop Trend Detected
        </div>
        <div style="font-size: 0.7rem; color: var(--text-secondary); margin-top: 2px;">
          Model projection win probability surged by +${(dropPercent * 0.7).toFixed(1)}% in past 24h.
        </div>
      </div>

      <!-- Column 3: Odds Dropping -->
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 0.85rem; color: var(--text-muted); text-decoration: line-through;">@${oddsDropInit.toFixed(2)}</span>
        <span style="font-size: 0.95rem; color: var(--secondary); font-weight: 800; font-family: var(--font-display);">@${oddsDropCurrent.toFixed(2)}</span>
        <span style="background: rgba(16,185,129,0.1); color: var(--secondary); font-size: 0.7rem; font-weight: 700; padding: 2px 6px; border-radius: var(--radius-sm);">${dropPercent}% Drop</span>
      </div>

      <!-- Column 4: Telegram Alert Toggle -->
      <div class="desktop-only" style="text-align: right; align-self: center;">
        <button class="btn btn-primary" style="padding: 4px 10px; font-size: 0.75rem; background: var(--primary);" onclick="toggleTelegramAlerts(this); event.stopPropagation();">
          🔔 Set Alert
        </button>
      </div>
    `;

    container.appendChild(row);
  });
}

// Render Live Match Scanner
function renderLiveScanner() {
  const container = document.getElementById("scanner-rows-container");
  if (!container) return;
  container.innerHTML = "";

  // Filter live matches or generate mock live data
  const liveMatches = MATCH_DATA.filter(m => m.isLive);
  
  // If no live matches, show a placeholder row
  if (liveMatches.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 24px; color: var(--text-muted); font-size: 0.85rem;">
        No active live matches in play right now.
      </div>
    `;
    return;
  }

  liveMatches.forEach(match => {
    const row = document.createElement("div");
    row.className = "scanner-match-row";
    row.style.cursor = "pointer";
    row.onclick = () => openLiveScannerHub(match.id);
    
    // Calculate stats parameters
    const hashStr = (match.homeTeam.name + match.awayTeam.name);
    let hash = 0;
    for (let i = 0; i < hashStr.length; i++) {
      hash = hashStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    const seed = Math.abs(hash);

    const avgScored = parseFloat((1.0 + (seed % 19) * 0.1).toFixed(1));
    const avgConceded = parseFloat((0.6 + ((seed >> 2) % 17) * 0.1).toFixed(1));
    const avgXG = parseFloat((0.8 + ((seed >> 4) % 18) * 0.1).toFixed(1));
    const corners = parseFloat((7.5 + ((seed >> 6) % 9) * 0.5).toFixed(1));

    const homeFormVal = match.homeTeam.form ? match.homeTeam.form.reduce((sum, val) => sum + (val === 'W' ? 20 : val === 'D' ? 10 : 0), 0) : 60;
    const awayFormVal = match.awayTeam.form ? match.awayTeam.form.reduce((sum, val) => sum + (val === 'W' ? 20 : val === 'D' ? 10 : 0), 0) : 50;
    const avgForm = Math.round((homeFormVal + awayFormVal) / 2);

    // Calculate unique dynamic live stats using the match seed
    const possessionH = 40 + (seed % 21); // between 40% and 60%
    const possessionA = 100 - possessionH;

    const liveCornersH = seed % 7; // between 0 and 6
    const liveCornersA = (seed >> 1) % 6; // between 0 and 5

    const elapsedMinutes = parseInt(match.time.replace(/[^0-9]/g, "")) || 45;
    const attH = Math.round(elapsedMinutes * (0.8 + (seed % 10) * 0.1));
    const attA = Math.round(elapsedMinutes * (0.7 + ((seed >> 2) % 10) * 0.1));

    const dangerousAttH = Math.round(attH * (0.35 + (seed % 21) * 0.01));
    const dangerousAttA = Math.round(attA * (0.35 + ((seed >> 3) % 21) * 0.01));

    const daMinH = (dangerousAttH / elapsedMinutes).toFixed(2);
    const daMinA = (dangerousAttA / elapsedMinutes).toFixed(2);

    const shotsOnH = seed % 6; // 0 to 5
    const shotsOffH = (seed >> 1) % 7; // 0 to 6
    const shotsOnA = (seed >> 2) % 5; // 0 to 4
    const shotsOffA = (seed >> 3) % 6; // 0 to 5

    const momentumH = Math.round((dangerousAttH * 1.5 + shotsOnH * 3) / (elapsedMinutes || 1) * 10);
    const momentumA = Math.round((dangerousAttA * 1.5 + shotsOnA * 3) / (elapsedMinutes || 1) * 10);

    row.innerHTML = `
      <!-- Match & Clock -->
      <div>
        <div style="font-weight: 700; color: var(--text-primary); font-size: 0.85rem; display: flex; align-items: center; gap: 6px;">
          <span style="width: 6px; height: 6px; border-radius: 50%; background: var(--danger); animation: pulse 1.5s infinite; display: inline-block;"></span>
          ${match.homeTeam.name} vs ${match.awayTeam.name}
        </div>
        <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">
          ${match.leagueEmoji} ${match.league} • <span style="color: var(--danger); font-weight: 700;">${match.time}</span>
        </div>
        <!-- Live Scanner stats parameters row -->
        <div style="display: flex; gap: 4px; margin-top: 6px; flex-wrap: wrap;">
          <span style="font-size: 0.6rem; padding: 1px 4px; background: rgba(26,104,219,0.06); border: 1px solid rgba(26,104,219,0.12); border-radius: var(--radius-sm); color: var(--primary); font-weight: 600;">Form: ${avgForm}%</span>
          <span style="font-size: 0.6rem; padding: 1px 4px; background: rgba(16,185,129,0.06); border: 1px solid rgba(16,185,129,0.12); border-radius: var(--radius-sm); color: var(--secondary); font-weight: 600;">Gls: ${avgScored.toFixed(1)}/${avgConceded.toFixed(1)}</span>
          <span style="font-size: 0.6rem; padding: 1px 4px; background: rgba(245,158,11,0.06); border: 1px solid rgba(245,158,11,0.12); border-radius: var(--radius-sm); color: var(--accent-gold); font-weight: 600;">xG: ${avgXG.toFixed(1)}</span>
          <span style="font-size: 0.6rem; padding: 1px 4px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: var(--radius-sm); color: var(--text-secondary); font-weight: 600;">Crn: ${corners}</span>
        </div>
      </div>

      <!-- Live Stats Summary -->
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <div style="display: flex; justify-content: space-between; font-size: 0.7rem; color: var(--text-secondary);">
          <span>Possession</span>
          <span style="font-weight: 700; color: var(--text-primary);">${possessionH}% - ${possessionA}%</span>
        </div>
        <div class="scanner-stat-bar-bg" style="margin-bottom: 4px;">
          <div style="width: ${possessionH}%; height: 100%; background: var(--primary);"></div>
          <div style="width: ${possessionA}%; height: 100%; background: var(--secondary);"></div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; font-size: 0.68rem; color: var(--text-secondary);">
          <div style="display: flex; justify-content: space-between;">
            <span>Attacks (DA):</span>
            <span style="font-weight: 600; color: var(--text-primary);">${attH}(${dangerousAttH})-${attA}(${dangerousAttA})</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>DA/Min:</span>
            <span style="font-weight: 600; color: var(--text-primary);">${daMinH}-${daMinA}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>Shots On(Off):</span>
            <span style="font-weight: 600; color: var(--text-primary);">${shotsOnH}(${shotsOffH})-${shotsOnA}(${shotsOffA})</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>Corners:</span>
            <span style="font-weight: 600; color: var(--text-primary);">${liveCornersH}-${liveCornersA}</span>
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.68rem; margin-top: 2px; padding-top: 2px; border-top: 1px solid rgba(255,255,255,0.05);">
          <span>Momentum Index:</span>
          <span style="font-weight: 700; color: var(--accent-gold);">${momentumH} - ${momentumA}</span>
        </div>
      </div>

      <!-- In-Play Odds -->
      <div style="display: flex; gap: 8px; align-items: center;">
        <span style="background: rgba(26,104,219,0.06); border: 1px solid var(--border-color); padding: 4px 8px; border-radius: var(--radius-sm); font-weight: 700; color: var(--primary); font-size: 0.8rem; font-family: var(--font-display);">1 @1.42</span>
        <span style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); padding: 4px 8px; border-radius: var(--radius-sm); font-weight: 700; color: var(--text-secondary); font-size: 0.8rem; font-family: var(--font-display);">X @3.85</span>
        <span style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); padding: 4px 8px; border-radius: var(--radius-sm); font-weight: 700; color: var(--text-secondary); font-size: 0.8rem; font-family: var(--font-display);">2 @6.10</span>
      </div>

      <!-- Telegram Alert Toggle -->
      <div class="desktop-only" style="text-align: right; align-self: center;">
        <button class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.75rem;" onclick="toggleTelegramAlerts(this); event.stopPropagation();">
          🔔 Notify Me
        </button>
      </div>
    `;

    container.appendChild(row);
  });
}

// Render Daily Algorithmic Tips
function renderDailyBets() {
  const container = document.getElementById("daily-bets-container");
  if (!container) return;
  container.innerHTML = "";

  const tips = (typeof DAILY_TIPS !== 'undefined' ? DAILY_TIPS : window.DAILY_TIPS) || [
    { type: "Double of the Day", matches: ["Bayern Munich vs Dortmund", "Liverpool vs Chelsea"], odd: "2.68", text: "Combined win odds on Bayern (1.45) & Liverpool Win (1.85) representing high value counter-press metrics." },
    { type: "Risk of the Day", matches: ["Arsenal vs Man City"], odd: "3.40", text: "Arsenal Win + Both Teams To Score (BTTS). Arsenal's central block favors them, but City is likely to score late." },
    { type: "Value of the Day", matches: ["Juventus vs PSG"], odd: "3.20", text: "Draw (X) pick. Juventus deep block is highly resilient, PSG transition lacks wide crossing options." }
  ];

  tips.forEach(tip => {
    const card = document.createElement("div");
    card.className = "glass-card";
    card.style.cssText = "padding: 20px; display: flex; flex-direction: column; gap: 12px; border: 1px solid rgba(255, 255, 255, 0.08); background: rgba(15, 23, 42, 0.6); border-radius: var(--radius-lg); backdrop-filter: blur(10px); transition: transform 0.2s ease, box-shadow 0.2s ease;";

    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="background: rgba(37,99,235,0.15); color: #60a5fa; border: 1px solid rgba(37,99,235,0.3); padding: 4px 10px; border-radius: var(--radius-sm); font-size: 0.75rem; font-weight: 700; text-transform: uppercase;">
          ${tip.type}
        </span>
        <span style="font-family: var(--font-display); font-weight: 800; color: #10b981; font-size: 1.15rem;">
          @${tip.odd}
        </span>
      </div>
      <div>
        <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 4px; font-weight: 600;">Picks Selection</div>
        <div style="font-weight: 700; font-size: 0.95rem; color: #ffffff;">
          ${tip.matches.join(" & ")}
        </div>
      </div>
      <p style="font-size: 0.82rem; color: rgba(255,255,255,0.75); line-height: 1.45; flex-grow: 1; margin: 0;">
        ${tip.text}
      </p>
      <button class="btn btn-secondary" style="font-size: 0.8rem; padding: 8px 14px; width: 100%; border-radius: var(--radius-md); font-weight: 700; background: rgba(255,255,255,0.06); color: #ffffff; border: 1px solid rgba(255,255,255,0.12); cursor: pointer;" onclick="copyDailyTipOdds('${tip.odd}')">
        📋 Copy Selection Odds (@${tip.odd})
      </button>
    `;
    container.appendChild(card);
  });
}

function copyDailyTipOdds(odd) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(odd);
  }
  if (typeof showAppNotification === 'function') {
    showAppNotification(`📋 Selection Odds (@${odd}) copied to clipboard!`);
  }
}
window.copyDailyTipOdds = copyDailyTipOdds;
window.renderDailyBets = renderDailyBets;

// Render Hot Trends Ticker
function renderTrends() {
  const container = document.getElementById("trends-ticker-container");
  if (!container) return;
  container.innerHTML = "";

  const combinedTrends = [...HOT_TRENDS, ...HOT_TRENDS, ...HOT_TRENDS];
  
  combinedTrends.forEach(trend => {
    const item = document.createElement("span");
    item.style.fontSize = "0.8rem";
    item.style.fontWeight = "600";
    item.style.color = "var(--text-secondary)";
    item.style.display = "flex";
    item.style.alignItems = "center";
    item.style.gap = "6px";
    
    item.innerHTML = `
      <span>${trend.icon}</span>
      <b style="color: var(--text-primary);">${trend.team}:</b> ${trend.trend}
    `;
    container.appendChild(item);
  });
}

// Render League Statistics Ledger
function renderLeagueStatsLedger() {
  const tbody = document.getElementById("league-stats-tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  LEAGUE_STATS.forEach(stat => {
    const tr = document.createElement("tr");
    tr.style.borderBottom = "1px solid var(--border-color)";
    tr.style.fontSize = "0.85rem";

    tr.innerHTML = `
      <td style="padding: 12px 8px; font-weight: 700; color: var(--text-primary);">
        <span style="margin-right: 6px;">${stat.flag}</span> ${stat.league}
      </td>
      <td style="padding: 12px 8px; color: var(--text-secondary); font-family: var(--font-display);">${stat.avgGoals}</td>
      <td style="padding: 12px 8px; color: var(--text-secondary);">${stat.bttsPct}</td>
      <td style="padding: 12px 8px; color: var(--text-secondary);">${stat.homeWinPct}</td>
      <td style="padding: 12px 8px; color: var(--text-secondary);">${stat.drawPct}</td>
      <td style="padding: 12px 8px; color: var(--secondary); font-weight: 600;">${stat.over25Pct}</td>
      <td style="padding: 12px 8px; color: var(--text-secondary);">${stat.avgCards}</td>
      <td style="padding: 12px 8px; color: var(--text-secondary);">${stat.avgCorners}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Render Value Bet Bot listings
function renderValueBetBot() {
  const container = document.getElementById("value-bet-bot-rows");
  if (!container) return;
  container.innerHTML = "";

  VALUE_BETS.forEach(bet => {
    const row = document.createElement("div");
    row.style.display = "grid";
    row.style.gridTemplateColumns = "1.5fr 1fr 1fr 1fr 1.2fr";
    row.style.minWidth = "600px";
    row.style.alignItems = "center";
    row.style.padding = "14px 16px";
    row.style.borderBottom = "1px solid var(--border-color)";
    row.style.fontSize = "0.85rem";

    row.innerHTML = `
      <div style="font-weight: 700; color: var(--text-primary);">${bet.match}</div>
      <div style="color: var(--primary); font-weight: 600;">${bet.market}</div>
      <div style="font-family: var(--font-display); color: var(--text-secondary);">@${bet.bookmakerOdds}</div>
      <div style="font-family: var(--font-display); color: var(--text-muted); text-decoration: line-through;">@${bet.modelOdds}</div>
      <div style="text-align: right; color: var(--secondary); font-weight: 800; font-family: var(--font-display);">${bet.ev}</div>
    `;
    container.appendChild(row);
  });
}

// Global modal tab switcher
function switchModalTab(tabName) {
  const panes = document.querySelectorAll(".modal-tab-pane");
  panes.forEach(pane => pane.style.display = "none");

  const buttons = document.querySelectorAll("#scout-modal .tab-btn");
  buttons.forEach(btn => btn.classList.remove("active"));

  const activePane = document.getElementById(`modal-pane-${tabName}`);
  const activeBtn = document.getElementById(`modal-tab-btn-${tabName}`);
  
  if (activePane) activePane.style.display = "block";
  if (activeBtn) activeBtn.classList.add("active");

  if (tabName === 'stats') {
    renderAdvancedTeamStats();
  } else if (tabName === 'h2h') {
    renderH2HHistory();
  } else if (tabName === 'odds') {
    renderOddsComparison();
  }
}

// Render Odds Comparison inside modal
function renderOddsComparison() {
  const container = document.getElementById("modal-odds-content");
  if (!container) return;

  const matchId = window.appState.activeScoutMatchId;
  const match = MATCH_DATA.find(m => m.id === matchId);
  if (!match) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: var(--text-muted); font-size: 0.85rem;">
        No odds comparison available for general scout mode. Select a fixture.
      </div>
    `;
    return;
  }

  // Generate deterministic odds based on confidenceVal
  const homeOdds = parseFloat((1.4 + (match.predictions.away / 100) * 2.0).toFixed(2));
  const drawOdds = parseFloat((3.0 + (match.predictions.draw / 100) * 1.5).toFixed(2));
  const awayOdds = parseFloat((1.4 + (match.predictions.home / 100) * 2.0).toFixed(2));

  // Compare across 3 bookies with slight fluctuations
  const bookies = [
    { name: "Bet365", logo: "🟢", h: homeOdds, d: drawOdds, a: awayOdds },
    { name: "Unibet", logo: "🟢⚪", h: parseFloat((homeOdds * 0.98).toFixed(2)), d: parseFloat((drawOdds * 1.01).toFixed(2)), a: parseFloat((awayOdds * 0.99).toFixed(2)) },
    { name: "1xBet", logo: "🔵⚪", h: parseFloat((homeOdds * 1.02).toFixed(2)), d: parseFloat((drawOdds * 0.99).toFixed(2)), a: parseFloat((awayOdds * 1.01).toFixed(2)) }
  ];

  container.innerHTML = `
    <h4 style="font-family: var(--font-display); font-size: 1rem; margin-bottom: 16px; border-bottom: 1px dashed var(--border-color); padding-bottom: 8px; color: var(--text-primary);">
      Real-Time Bookmaker Odds Comparison
    </h4>
    
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <div style="display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr; align-items: center; font-weight: 700; color: var(--text-secondary); font-size: 0.75rem; border-bottom: 1px dashed var(--border-color); padding-bottom: 6px;">
        <span>Bookmaker</span>
        <span style="text-align: center;">Home (1)</span>
        <span style="text-align: center;">Draw (X)</span>
        <span style="text-align: center;">Away (2)</span>
      </div>
      
      ${bookies.map(b => `
        <div style="display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr; align-items: center; font-size: 0.82rem; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.03);">
          <span style="font-weight: 600; display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 1rem;">${b.logo}</span>
            <span>${b.name}</span>
          </span>
          <span style="text-align: center; color: var(--primary); font-family: var(--font-display); font-weight: 700; cursor: pointer; background: rgba(26,104,219,0.05); border: 1px solid rgba(26,104,219,0.1); border-radius: var(--radius-sm); padding: 4px; margin: 0 4px;" onclick="showAppNotification('Routing to ${b.name} Slip Preview for ${match.homeTeam.name} Home win @${b.h.toFixed(2)}...')">@${b.h.toFixed(2)}</span>
          <span style="text-align: center; color: var(--text-primary); font-family: var(--font-display); font-weight: 700; cursor: pointer; background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 4px; margin: 0 4px;" onclick="showAppNotification('Routing to ${b.name} Slip Preview for Draw @${b.d.toFixed(2)}...')">@${b.d.toFixed(2)}</span>
          <span style="text-align: center; color: var(--secondary); font-family: var(--font-display); font-weight: 700; cursor: pointer; background: rgba(16,185,129,0.05); border: 1px solid rgba(16,185,129,0.1); border-radius: var(--radius-sm); padding: 4px; margin: 0 4px;" onclick="showAppNotification('Routing to ${b.name} Slip Preview for ${match.awayTeam.name} Away win @${b.a.toFixed(2)}...')">@${b.a.toFixed(2)}</span>
        </div>
      `).join("")}
    </div>
    <p style="font-size: 0.72rem; color: var(--text-muted); margin-top: 16px; line-height: 1.4;">
      ⚠️ Odds shown are real-time simulation indexes. Clicking any odds field routes you directly to the matched bookmaker slip preview.
    </p>
  `;
}

// Render Advanced Team Stats inside modal
function renderAdvancedTeamStats() {
  const container = document.getElementById("modal-team-stats-content");
  if (!container) return;

  const matchId = window.appState.activeScoutMatchId;
  const match = MATCH_DATA.find(m => m.id === matchId);
  if (!match) return;

  const homeClub = GLOBAL_CLUBS.find(c => c.name === match.homeTeam.name) || { wins: 18, draws: 6, losses: 6, matchesPlayed: 30 };
  const awayClub = GLOBAL_CLUBS.find(c => c.name === match.awayTeam.name) || { wins: 15, draws: 8, losses: 7, matchesPlayed: 30 };

  const homeWinRate = ((homeClub.wins / homeClub.matchesPlayed) * 100).toFixed(0);
  const awayWinRate = ((awayClub.wins / awayClub.matchesPlayed) * 100).toFixed(0);

  // Generate deterministic stats parameters
  const hashStr = (match.homeTeam.name + match.awayTeam.name);
  let hash = 0;
  for (let i = 0; i < hashStr.length; i++) {
    hash = hashStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  const seed = Math.abs(hash);

  const avgScored = parseFloat((1.0 + (seed % 19) * 0.1).toFixed(1));
  const avgConceded = parseFloat((0.6 + (Math.floor(seed / 4) % 17) * 0.1).toFixed(1));
  const avgXG = parseFloat((0.8 + (Math.floor(seed / 16) % 18) * 0.1).toFixed(1));
  const corners = parseFloat((7.5 + (Math.floor(seed / 64) % 9) * 0.5).toFixed(1));

  // Additional stats for our comparison layout
  const homeGoalsScored = avgScored;
  const awayGoalsScored = parseFloat((avgScored * 0.85).toFixed(1));
  const homeCorners = corners;
  const awayCorners = parseFloat((corners * 0.82).toFixed(1));
  const homeCleanSheets = 25 + (seed % 26); // 25% to 50%
  const awayCleanSheets = 20 + ((seed * 3) % 26); // 20% to 45%

  // Probabilities
  const pHome = match.predictions.home;
  const pDraw = match.predictions.draw;
  const pAway = match.predictions.away;
  const over25Prob = 35 + (seed % 51); // 35% to 85%
  const under25Prob = 100 - over25Prob;
  const bttsYesProb = 30 + ((seed * 7) % 56); // 30% to 85%
  const bttsNoProb = 100 - bttsYesProb;

  container.innerHTML = `
    <h4 style="font-family: var(--font-display); font-size: 1.1rem; margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px; color: var(--text-primary); display: flex; align-items: center; gap: 6px;">
      <span>📊</span> Match Intelligence & AI Probabilities
    </h4>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: start;">
      
      <!-- Left Column: AI Probabilities -->
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <h5 style="font-size: 0.8rem; font-weight: 700; color: var(--accent-gold); text-transform: uppercase; margin-bottom: 4px; letter-spacing: 0.5px;">AI Prediction Model</h5>
        
        <!-- 1X2 Probabilities -->
        <div>
          <div style="display: flex; justify-content: space-between; font-size: 0.78rem; color: var(--text-secondary); margin-bottom: 4px;">
            <span>Home Win (1): <b>${pHome}%</b></span>
            <span>Draw (X): <b>${pDraw}%</b></span>
            <span>Away Win (2): <b>${pAway}%</b></span>
          </div>
          <div style="height: 8px; background: rgba(255,255,255,0.05); border-radius: var(--radius-full); overflow: hidden; display: flex;">
            <div style="width: ${pHome}%; height: 100%; background: var(--primary);"></div>
            <div style="width: ${pDraw}%; height: 100%; background: #6b7280;"></div>
            <div style="width: ${pAway}%; height: 100%; background: var(--secondary);"></div>
          </div>
        </div>

        <!-- Over/Under 2.5 Goals -->
        <div>
          <div style="display: flex; justify-content: space-between; font-size: 0.78rem; color: var(--text-secondary); margin-bottom: 4px;">
            <span>Over 2.5 Goals: <b>${over25Prob}%</b></span>
            <span>Under 2.5 Goals: <b>${under25Prob}%</b></span>
          </div>
          <div class="probability-progress-bar">
            <div class="probability-progress-fill goals-bar" style="width: ${over25Prob}%;"></div>
          </div>
        </div>

        <!-- BTTS -->
        <div>
          <div style="display: flex; justify-content: space-between; font-size: 0.78rem; color: var(--text-secondary); margin-bottom: 4px;">
            <span>BTTS Yes: <b>${bttsYesProb}%</b></span>
            <span>BTTS No: <b>${bttsNoProb}%</b></span>
          </div>
          <div class="probability-progress-bar">
            <div class="probability-progress-fill btts-bar" style="width: ${bttsYesProb}%;"></div>
          </div>
        </div>
        
        <div style="padding: 10px; background: rgba(245, 158, 11, 0.04); border: 1px dashed rgba(245, 158, 11, 0.15); border-radius: var(--radius-sm); font-size: 0.72rem; color: var(--text-secondary); line-height: 1.4;">
          💡 <b>AI Reasoning:</b> Based on xG score trend (${avgXG.toFixed(1)}) and average team goals of ${avgScored.toFixed(1)}, the model predicts a high likelihood of <b>${getMatchTip(match)}</b>.
        </div>
      </div>
      
      <!-- Right Column: Comparative Team Performance Stats -->
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <h5 style="font-size: 0.8rem; font-weight: 700; color: var(--primary); text-transform: uppercase; margin-bottom: 4px; letter-spacing: 0.5px;">Team Head-to-Head Comparative Metrics</h5>
        
        <!-- Win Rate -->
        <div>
          <div style="display: flex; justify-content: space-between; font-size: 0.78rem; color: var(--text-secondary); margin-bottom: 4px;">
            <span>${match.homeTeam.name} (${homeWinRate}%)</span>
            <span style="font-weight: 600; color: var(--text-primary);">Season Win Rate</span>
            <span>${match.awayTeam.name} (${awayWinRate}%)</span>
          </div>
          <div style="height: 6px; background: rgba(255,255,255,0.05); border-radius: var(--radius-full); overflow: hidden; display: flex;">
            <div style="width: ${homeWinRate}%; height: 100%; background: var(--primary);"></div>
            <div style="width: ${awayWinRate}%; height: 100%; background: var(--secondary);"></div>
          </div>
        </div>

        <!-- Goals Scored -->
        <div>
          <div style="display: flex; justify-content: space-between; font-size: 0.78rem; color: var(--text-secondary); margin-bottom: 4px;">
            <span>${homeGoalsScored.toFixed(1)} goals</span>
            <span style="font-weight: 600; color: var(--text-primary);">Avg Goals Scored</span>
            <span>${awayGoalsScored.toFixed(1)} goals</span>
          </div>
          <div style="height: 6px; background: rgba(255,255,255,0.05); border-radius: var(--radius-full); overflow: hidden; display: flex;">
            <div style="width: ${Math.round((homeGoalsScored / (homeGoalsScored + awayGoalsScored)) * 100)}%; height: 100%; background: var(--primary);"></div>
            <div style="width: ${Math.round((awayGoalsScored / (homeGoalsScored + awayGoalsScored)) * 100)}%; height: 100%; background: var(--secondary);"></div>
          </div>
        </div>

        <!-- Corners -->
        <div>
          <div style="display: flex; justify-content: space-between; font-size: 0.78rem; color: var(--text-secondary); margin-bottom: 4px;">
            <span>${homeCorners.toFixed(1)} corners</span>
            <span style="font-weight: 600; color: var(--text-primary);">Corners Frequency</span>
            <span>${awayCorners.toFixed(1)} corners</span>
          </div>
          <div style="height: 6px; background: rgba(255,255,255,0.05); border-radius: var(--radius-full); overflow: hidden; display: flex;">
            <div style="width: ${Math.round((homeCorners / (homeCorners + awayCorners)) * 100)}%; height: 100%; background: var(--primary);"></div>
            <div style="width: ${Math.round((awayCorners / (homeCorners + awayCorners)) * 100)}%; height: 100%; background: var(--secondary);"></div>
          </div>
        </div>

        <!-- Clean Sheets -->
        <div>
          <div style="display: flex; justify-content: space-between; font-size: 0.78rem; color: var(--text-secondary); margin-bottom: 4px;">
            <span>${homeCleanSheets}%</span>
            <span style="font-weight: 600; color: var(--text-primary);">Clean Sheet Rate</span>
            <span>${awayCleanSheets}%</span>
          </div>
          <div style="height: 6px; background: rgba(255,255,255,0.05); border-radius: var(--radius-full); overflow: hidden; display: flex;">
            <div style="width: ${homeCleanSheets}%; height: 100%; background: var(--primary);"></div>
            <div style="width: ${awayCleanSheets}%; height: 100%; background: var(--secondary);"></div>
          </div>
        </div>

      </div>
    </div>
  `;
}

// Render H2H history records inside modal
function renderH2HHistory() {
  const container = document.getElementById("modal-h2h-content");
  if (!container) return;

  const matchId = window.appState.activeScoutMatchId;
  const match = MATCH_DATA.find(m => m.id === matchId);
  if (!match) return;

  // Generate deterministic results based on team names seed
  const hashStr = (match.homeTeam.name + match.awayTeam.name);
  let hash = 0;
  for (let i = 0; i < hashStr.length; i++) {
    hash = hashStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  const seed = Math.abs(hash);

  // Form circular badges
  const renderFormRings = (formArray) => {
    if (!formArray || formArray.length === 0) return `<span style="font-size:0.75rem; color:var(--text-muted)">N/A</span>`;
    return formArray.map(f => `<div class="form-badge-ring ${f}" title="${f === 'W' ? 'Won' : f === 'D' ? 'Drew' : 'Lost'}">${f}</div>`).join("");
  };

  // Generate H2H matches list
  const scorePairs = [[2,1], [1,1], [0,2], [3,1], [2,2], [1,0], [0,1], [2,0], [3,2], [1,2]];
  const years = [2025, 2025, 2024, 2024, 2023];
  const months = ["Oct", "Dec", "Feb", "Apr", "Nov"];
  
  let homeWins = 0;
  let draws = 0;
  let awayWins = 0;
  const h2hGames = [];

  for (let i = 0; i < 5; i++) {
    const pairIdx = (seed + i * 19) % scorePairs.length;
    const scores = scorePairs[pairIdx];
    
    // Alternating who is home team in past match
    const isHome = i % 2 === 0;
    const hTeam = isHome ? match.homeTeam.name : match.awayTeam.name;
    const aTeam = isHome ? match.awayTeam.name : match.homeTeam.name;
    const hScore = scores[0];
    const aScore = scores[1];
    
    let outcomeText = "";
    let outcomeColor = "";
    
    if (hScore === aScore) {
      draws++;
      outcomeText = "Draw";
      outcomeColor = "var(--text-muted)";
    } else if (hScore > aScore) {
      if (hTeam === match.homeTeam.name) {
        homeWins++;
        outcomeText = `${match.homeTeam.name} Win`;
        outcomeColor = "var(--secondary)";
      } else {
        awayWins++;
        outcomeText = `${match.awayTeam.name} Win`;
        outcomeColor = "var(--danger)";
      }
    } else {
      if (aTeam === match.homeTeam.name) {
        homeWins++;
        outcomeText = `${match.homeTeam.name} Win`;
        outcomeColor = "var(--secondary)";
      } else {
        awayWins++;
        outcomeText = `${match.awayTeam.name} Win`;
        outcomeColor = "var(--danger)";
      }
    }

    h2hGames.push({
      date: `${months[i]} ${years[i]}`,
      home: hTeam,
      away: aTeam,
      homeScore: hScore,
      awayScore: aScore,
      outcomeText,
      outcomeColor
    });
  }

  container.innerHTML = `
    <h4 style="font-family: var(--font-display); font-size: 1.1rem; margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px; color: var(--text-primary); display: flex; align-items: center; gap: 6px;">
      <span>🤝</span> Head-to-Head & Team Form History
    </h4>
    
    <!-- Team Forms Comparison -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; background: rgba(255,255,255,0.02); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
      <div>
        <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; display: block; margin-bottom: 6px;">${match.homeTeam.name} Form</span>
        <div style="display: flex; gap: 6px;">${renderFormRings(match.homeTeam.form)}</div>
      </div>
      <div>
        <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; display: block; margin-bottom: 6px;">${match.awayTeam.name} Form</span>
        <div style="display: flex; gap: 6px;">${renderFormRings(match.awayTeam.form)}</div>
      </div>
    </div>

    <!-- H2H Summary Stats -->
    <div style="display: flex; justify-content: space-around; background: rgba(26,104,219,0.05); padding: 10px; border-radius: var(--radius-sm); border: 1px solid rgba(26,104,219,0.12); margin-bottom: 16px; text-align: center;">
      <div>
        <div style="font-size: 1.25rem; font-weight: 700; color: var(--secondary);">${homeWins}</div>
        <div style="font-size: 0.65rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 600;">${match.homeTeam.name} Wins</div>
      </div>
      <div style="border-left: 1px solid var(--border-color); height: 30px;"></div>
      <div>
        <div style="font-size: 1.25rem; font-weight: 700; color: var(--text-primary);">${draws}</div>
        <div style="font-size: 0.65rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 600;">Draws</div>
      </div>
      <div style="border-left: 1px solid var(--border-color); height: 30px;"></div>
      <div>
        <div style="font-size: 1.25rem; font-weight: 700; color: var(--danger);">${awayWins}</div>
        <div style="font-size: 0.65rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 600;">${match.awayTeam.name} Wins</div>
      </div>
    </div>

    <!-- Past Matches List -->
    <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; display: block; margin-bottom: 8px;">Last 5 Direct Encounters</span>
    <div style="display: flex; flex-direction: column; gap: 8px;">
      ${h2hGames.map(game => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: rgba(255,255,255,0.01); border-radius: var(--radius-sm); border: 1px solid var(--border-color); font-size: 0.8rem; color: var(--text-primary);">
          <span style="font-size: 0.7rem; color: var(--text-muted); min-width: 60px;">${game.date}</span>
          <div style="display: flex; align-items: center; justify-content: center; gap: 8px; flex: 1;">
            <span style="font-weight: 600; text-align: right; width: 110px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${game.home}</span>
            <span style="background: rgba(255,255,255,0.05); padding: 2px 8px; border-radius: var(--radius-sm); font-weight: 700; font-family: monospace; font-size: 0.82rem;">${game.homeScore} - ${game.awayScore}</span>
            <span style="font-weight: 600; text-align: left; width: 110px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${game.away}</span>
          </div>
          <span style="color: ${game.outcomeColor}; font-weight: 700; font-size: 0.75rem; text-align: right; min-width: 80px;">${game.outcomeText}</span>
        </div>
      `).join("")}
    </div>
  `;
}



// Render Top Tips tracker inside the Betting Suite
function renderTopTipsTool() {
  const container = document.getElementById("toptips-tool-rows");
  if (!container) return;
  container.innerHTML = "";

  const activeMarket = window.appState.activeTopTipsToolMarket || 'uo15';
  let matching = MATCH_DATA.filter(m => m.topTips && m.topTips.includes(activeMarket));
  
  if (matching.length === 0) {
    // Dynamic fallback matching for extended Bet9ja markets
    matching = MATCH_DATA.filter(m => {
      const tip = typeof getMatchTip === 'function' ? getMatchTip(m).toLowerCase() : '';
      if (activeMarket === 'dnb') return tip.includes("dnb") || tip.includes("draw no bet");
      if (activeMarket.startsWith('mg')) return tip.includes("goals") || tip.includes("multi");
      if (activeMarket.startsWith('eg')) return tip.includes("goal");
      if (activeMarket.startsWith('combo')) return tip.includes("+") || tip.includes("combo") || tip.includes("&");
      if (activeMarket.startsWith('htft')) return tip.includes("/") || tip.includes("ht/ft");
      if (activeMarket.startsWith('cards') || activeMarket === 'redcard') return tip.includes("card") || tip.includes("yellow") || tip.includes("red");
      if (activeMarket === 'penalty') return tip.includes("penalty");
      if (activeMarket.startsWith('ah')) return tip.includes("handicap") || tip.includes("-") || tip.includes("+");
      return true;
    });
  }

  if (matching.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 24px; color: var(--text-muted); font-size: 0.85rem; grid-column: 1 / -1;">
        No active matches currently meet this top tip criteria.
      </div>
    `;
    return;
  }

  // Market label mapping (Complete Exhaustive Bet9ja Suite)
  const labels = {
    win1: "1X2: Home Win (1)",
    draw: "1X2: Draw (X)",
    win2: "1X2: Away Win (2)",
    dc1x: "Double Chance: 1X",
    dc12: "Double Chance: 12",
    dcx2: "Double Chance: X2",
    dnb: "Draw No Bet (DNB)",
    uo05: "Under/Over 0.5",
    uo15: "Under/Over 1.5",
    uo25: "Under/Over 2.5",
    uo35: "Under/Over 3.5",
    uo45: "Under/Over 4.5",
    uo55: "Under/Over 5.5",
    uoht05: "Under/Over HT 0.5",
    uoht15: "Under/Over HT 1.5",
    uoht25: "Under/Over HT 2.5",
    uo2h05: "Under/Over 2nd H. 0.5",
    uo2h15: "Under/Over 2nd H. 1.5",
    uo2h25: "Under/Over 2nd H. 2.5",
    mg12: "Multi-Goals 1-2 Goals",
    mg13: "Multi-Goals 1-3 Goals",
    mg23: "Multi-Goals 2-3 Goals",
    mg24: "Multi-Goals 2-4 Goals",
    mg25: "Multi-Goals 2-5 Goals",
    mg35: "Multi-Goals 3-5 Goals",
    mg46: "Multi-Goals 4-6 Goals",
    eg0: "Exact Goals 0 Goals",
    eg1: "Exact Goals 1 Goal",
    eg2: "Exact Goals 2 Goals",
    eg3: "Exact Goals 3 Goals",
    eg4: "Exact Goals 4+ Goals",
    btts: "BTTS / GG (Both Score)",
    btts_no: "BTTS No / NG",
    bttsht: "BTTS - Half Time",
    btts2h: "BTTS - 2nd Half",
    btts_both: "BTTS Both Halves",
    combo_1x2_uo: "1X2 + Over 2.5 Combo",
    combo_1x2_under: "1X2 + Under 2.5 Combo",
    combo_1x2_gg: "1X2 + GG Combo",
    combo_dc_uo: "Double Chance + Over 2.5",
    combo_dc_gg: "Double Chance + GG",
    htft_11: "HT/FT: 1/1 (Home/Home)",
    htft_x1: "HT/FT: X/1 (Draw/Home)",
    htft_21: "HT/FT: 2/1 (Away/Home)",
    htft_1x: "HT/FT: 1/X (Home/Draw)",
    htft_xx: "HT/FT: X/X (Draw/Draw)",
    htft_2x: "HT/FT: 2/X (Away/Draw)",
    htft_12: "HT/FT: 1/2 (Home/Away)",
    htft_x2: "HT/FT: X/2 (Draw/Away)",
    htft_22: "HT/FT: 2/2 (Away/Away)",
    wineither: "Win Either Half",
    winboth: "Win Both Halves",
    huo05: "Home Over 0.5 Goals",
    huo15: "Home Over 1.5 Goals",
    auo05: "Away Over 0.5 Goals",
    auo15: "Away Over 1.5 Goals",
    hcs: "Home Clean Sheet",
    acs: "Away Clean Sheet",
    hw2n: "Home Win to Nil",
    aw2n: "Away Win to Nil",
    first_goal: "First Team to Score",
    c65: "Total Corners: 6.5",
    c75: "Total Corners: 7.5",
    c85: "Total Corners: 8.5",
    c95: "Total Corners: 9.5",
    c105: "Total Corners: 10.5",
    c115: "Total Corners: 11.5",
    c125: "Total Corners: 12.5",
    c45ht: "1st Half Corners: 4.5",
    c1x2: "Most Corners 1X2",
    cards35: "Total Cards: Over 3.5",
    cards45: "Total Cards: Over 4.5",
    cards55: "Total Cards: Over 5.5",
    redcard: "Red Card (Yes/No)",
    penalty: "Penalty Awarded",
    eh1: "European Handicap (-1)",
    ah05: "Asian Handicap (-0.5)",
    ah15: "Asian Handicap (-1.5)"
  };

  matching.forEach(match => {
    const row = document.createElement("div");
    row.style.display = "grid";
    row.style.gridTemplateColumns = "1.5fr 1fr 1fr 1fr 1.2fr";
    row.style.alignItems = "center";
    row.style.padding = "14px 16px";
    row.style.borderBottom = "1px solid var(--border-color)";
    row.style.fontSize = "0.85rem";
    row.style.minWidth = "600px";

    const isWatched = window.appState.watchlist.includes(match.id);
    const prob = (match.confidenceVal + (match.id === 'match-1' ? 4 : -2));

    row.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 1rem;">${match.homeTeam.logo}</span>
        <span style="font-weight: 700; color: var(--text-primary);">${match.homeTeam.name} vs ${match.awayTeam.name}</span>
        <span style="font-size: 0.75rem; color: var(--text-muted); margin-left: 4px;">(${match.leagueEmoji} ${match.league})</span>
      </div>
      <div style="color: var(--accent-gold); font-weight: 700;">${labels[activeMarket]}</div>
      <div style="font-weight: 700; color: var(--secondary);">${prob}%</div>
      <div style="font-family: var(--font-display); color: var(--text-secondary);">@${(1.2 + (100 - prob)/80).toFixed(2)}</div>
      <div style="display: flex; gap: 8px; justify-content: flex-end;">
        <button class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.75rem;" onclick="openScoutModal('${match.id}')">Scout</button>
        <button class="btn btn-primary" style="padding: 4px 10px; font-size: 0.75rem; background: ${isWatched ? 'var(--accent-gold)' : 'var(--primary)'};" onclick="toggleWatchlist('${match.id}', event)">
          ${isWatched ? '★ Watched' : '☆ Watch'}
        </button>
      </div>
    `;
    container.appendChild(row);
  });
}

// Switch selected market inside Top Tips Betting Suite tool
function switchTopTipsToolMarket(marketVal, btn) {
  window.appState.activeTopTipsToolMarket = marketVal;

  const parent = btn.parentElement;
  const cards = parent.querySelectorAll(".checkbox-card");
  cards.forEach(c => c.classList.remove("selected"));
  btn.classList.add("selected");

  renderTopTipsTool();
}

// Render Sidebar Top Leagues Accordion List
function renderSidebarTopLeagues() {
  const container = document.getElementById("sidebar-topleagues-accordion-list");
  if (!container) return;
  container.innerHTML = "";

  const query = (document.getElementById("sidebar-topleagues-search-input")?.value || "").toLowerCase().trim();

  const leaguesData = (typeof TOP_LEAGUES_DATA !== 'undefined' ? TOP_LEAGUES_DATA : window.TOP_LEAGUES_DATA) || [
    { name: "Premier League", emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", country: "England" },
    { name: "La Liga", emoji: "🇪🇸", country: "Spain" },
    { name: "Bundesliga", emoji: "🇩🇪", country: "Germany" },
    { name: "Serie A", emoji: "🇮🇹", country: "Italy" },
    { name: "Ligue 1", emoji: "🇫🇷", country: "France" },
    { name: "Eredivisie", emoji: "🇳🇱", country: "Netherlands" },
    { name: "Primeira Liga", emoji: "🇵🇹", country: "Portugal" },
    { name: "Süper Lig", emoji: "🇹🇷", country: "Turkey" },
    { name: "Champions League", emoji: "🇪🇺", country: "Europe" },
    { name: "Europa League", emoji: "🇪🇺", country: "Europe" }
  ];

  leaguesData.forEach((league, index) => {
    // Filter by search query if present
    const matchesLeague = league.name.toLowerCase().includes(query) || league.country.toLowerCase().includes(query);

    if (query && !matchesLeague) {
      return; // Skip if no match
    }

    const accordion = document.createElement("div");
    accordion.className = "country-accordion-item";

    const isExpanded = query ? true : false; // Auto expand if searching

    accordion.innerHTML = `
      <button class="country-accordion-header" onclick="toggleSidebarTopLeaguesAccordion(${index}, this)">
        <span style="display: flex; align-items: center; gap: 8px;">
          <span>${league.emoji}</span>
          <span>${league.name}</span>
        </span>
        <span class="caret" style="transition: transform 0.2s; font-size: 0.6rem; transform: ${isExpanded ? 'rotate(180deg)' : 'rotate(0)'};">▼</span>
      </button>
      <div class="country-accordion-content" style="max-height: ${isExpanded ? '500px' : '0'};">
        <button class="sidebar-league-btn" onclick="selectSidebarLeague('${league.name.replace(/'/g, "\\'")}', this)">
          ⚽ Match Predictions
        </button>
        <button class="sidebar-league-btn" onclick="scoutLeagueClubs('${league.name.replace(/'/g, "\\'")}', this)">
          🏟️ Scouting Clubs
        </button>
        <button class="sidebar-league-btn" onclick="viewLeagueStatisticsLedger('${league.name.replace(/'/g, "\\'")}', this)">
          📊 League Averages
        </button>
        <button class="sidebar-league-btn" onclick="showMockTableStandings('${league.name.replace(/'/g, "\\'")}', this)">
          🏆 Table Standings
        </button>
      </div>
    `;

    container.appendChild(accordion);
  });
}

// Toggle Top Leagues accordion inside the left sidebar
function toggleSidebarTopLeaguesAccordion(index, header) {
  const content = header.nextElementSibling;
  const caret = header.querySelector(".caret");
  
  const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';

  // Close all others inside this specific sidebar card
  const allContents = document.querySelectorAll("#sidebar-topleagues-accordion-list .country-accordion-content");
  const allCarets = document.querySelectorAll("#sidebar-topleagues-accordion-list .caret");
  const allHeaders = document.querySelectorAll("#sidebar-topleagues-accordion-list .country-accordion-header");

  allContents.forEach(c => c.style.maxHeight = '0px');
  allCarets.forEach(cr => cr.style.transform = 'rotate(0)');
  allHeaders.forEach(h => h.classList.remove("active"));

  if (!isOpen) {
    header.classList.add("active");
    content.style.maxHeight = "500px";
    if (caret) caret.style.transform = "rotate(180deg)";
  }
}

// Scouting clubs for this top league
function scoutLeagueClubs(leagueName, btn) {
  if (btn) {
    const allLeagueBtns = document.querySelectorAll(".sidebar-league-btn");
    allLeagueBtns.forEach(b => b.classList.remove("active"));
    if (btn.classList) btn.classList.add("active");
  }

  alert(`🔍 Gathering scout statistics for ${leagueName}... Select a match on the dashboard to chat with the AI Scout chatbot!`);
}

// Navigate and highlight league in stats table ledger
function viewLeagueStatisticsLedger(leagueName, btn) {
  if (btn) {
    const allLeagueBtns = document.querySelectorAll(".sidebar-league-btn");
    allLeagueBtns.forEach(b => b.classList.remove("active"));
    if (btn.classList) btn.classList.add("active");
  }

  const ledgerSec = document.getElementById("analytics");
  if (ledgerSec) {
    ledgerSec.scrollIntoView({ behavior: 'smooth' });
    
    // Highlight table rows matching this league
    const allRows = document.querySelectorAll("#league-stats-tbody tr");
    allRows.forEach(row => {
      if (row.innerText.includes(leagueName)) {
        row.style.background = "rgba(26, 104, 219, 0.15)";
        row.style.borderLeft = "4px solid var(--primary)";
        setTimeout(() => {
          row.style.background = "";
          row.style.borderLeft = "";
        }, 3000);
      }
    });
  }
}

// Open mock modal with standings table list for this league
function showMockTableStandings(leagueName, btn) {
  if (btn) {
    const allLeagueBtns = document.querySelectorAll(".sidebar-league-btn");
    allLeagueBtns.forEach(b => b.classList.remove("active"));
    if (btn.classList) btn.classList.add("active");
  }

  // Create overlay/modal for standings table dynamically
  const modal = document.createElement("div");
  modal.style.position = "fixed";
  modal.style.left = "0";
  modal.style.top = "0";
  modal.style.width = "100vw";
  modal.style.height = "100vh";
  modal.style.background = "rgba(0, 0, 0, 0.85)";
  modal.style.display = "flex";
  modal.style.alignItems = "center";
  modal.style.justifyContent = "center";
  modal.style.zIndex = "2000";

  const content = document.createElement("div");
  content.className = "glass-card";
  content.style.width = "90%";
  content.style.maxWidth = "520px";
  content.style.padding = "24px";
  content.style.border = "1px solid var(--border-color)";

  // Filter clubs matching this league
  const matchingClubs = GLOBAL_CLUBS.filter(c => c.league === leagueName);
  // Sort by wins
  matchingClubs.sort((a, b) => b.wins - a.wins);

  let standingsHtml = matchingClubs.map((club, idx) => {
    return `
      <div style="display: grid; grid-template-columns: 30px 1.5fr 40px 40px 40px 40px; font-size: 0.85rem; padding: 8px; border-bottom: 1px solid rgba(255, 255, 255, 0.03); align-items: center;">
        <span style="font-weight: 700; color: ${idx < 3 ? 'var(--secondary)' : 'var(--text-muted)'};">${idx + 1}</span>
        <span style="font-weight: 700; color: var(--text-primary); display: flex; align-items: center; gap: 6px;">
          <span>${club.logo}</span> ${club.name}
        </span>
        <span style="text-align: center;">${club.matchesPlayed}</span>
        <span style="text-align: center; color: var(--success); font-weight: 700;">${club.wins}</span>
        <span style="text-align: center; color: var(--text-secondary);">${club.draws}</span>
        <span style="text-align: center; color: var(--danger);">${club.losses}</span>
      </div>
    `;
  }).join("");

  if (matchingClubs.length === 0) {
    standingsHtml = `
      <div style="text-align: center; padding: 24px; color: var(--text-muted);">
        No standings table data compiled for this division.
      </div>
    `;
  }

  content.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 12px; margin-bottom: 12px;">
      <h3 style="font-family: var(--font-display); font-size: 1.15rem; color: var(--text-primary);">🏆 ${leagueName} Standings</h3>
      <button class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.75rem;" id="close-standings-btn">Close</button>
    </div>
    
    <div style="display: grid; grid-template-columns: 30px 1.5fr 40px 40px 40px 40px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-secondary); padding: 8px; border-bottom: 1px solid var(--border-color);">
      <span>Pos</span>
      <span>Club</span>
      <span style="text-align: center;">P</span>
      <span style="text-align: center;">W</span>
      <span style="text-align: center;">D</span>
      <span style="text-align: center;">L</span>
    </div>
    
    <div style="max-height: 350px; overflow-y: auto; margin-bottom: 16px;">
      ${standingsHtml}
    </div>
    
    <div style="text-align: right;">
      <button class="btn btn-primary" style="padding: 6px 12px; font-size: 0.8rem;" id="close-standings-btn-bottom">OK</button>
    </div>
  `;

  modal.appendChild(content);
  document.body.appendChild(modal);

  const closeBtn = modal.querySelector("#close-standings-btn");
  const closeBtnBottom = modal.querySelector("#close-standings-btn-bottom");

  const closeFn = () => document.body.removeChild(modal);
  closeBtn.addEventListener("click", closeFn);
  closeBtnBottom.addEventListener("click", closeFn);
}

// Search filter for Top Leagues sidebar
function filterSidebarTopLeagues() {
  renderSidebarTopLeagues();
}

// Punters Challenge Leaderboard Data & Controllers
const LEADERBOARD_DATA = {
  monthly: [
    { rank: 1, name: "BettingPro_X", roi: "+24.5%", yield: "+245u", followed: false },
    { rank: 2, name: "SniperTips", roi: "+18.2%", yield: "+182u", followed: false },
    { rank: 3, name: "CornerKing", roi: "+14.8%", yield: "+148u", followed: false },
    { rank: 4, name: "AlgoScout", roi: "+12.1%", yield: "+121u", followed: false },
    { rank: 5, name: "OverHunter", roi: "+9.5%", yield: "+95u", followed: false }
  ],
  weekly: [
    { rank: 1, name: "GoalWizard", roi: "+42.1%", yield: "+84u", followed: false },
    { rank: 2, name: "DrawTracker", roi: "+31.5%", yield: "+63u", followed: false },
    { rank: 3, name: "BettingPro_X", roi: "+22.4%", yield: "+44u", followed: false },
    { rank: 4, name: "VIP_Picks", roi: "+19.0%", yield: "+38u", followed: false },
    { rank: 5, name: "UnderDogPunter", roi: "+15.6%", yield: "+31u", followed: false }
  ],
  alltime: [
    { rank: 1, name: "BettingPro_X", roi: "+20.1%", yield: "+1,420u", followed: false },
    { rank: 2, name: "CornerKing", roi: "+15.4%", yield: "+980u", followed: false },
    { rank: 3, name: "ScoutMaster", roi: "+14.1%", yield: "+760u", followed: false },
    { rank: 4, name: "HalftimeBanker", roi: "+12.8%", yield: "+620u", followed: false },
    { rank: 5, name: "SniperTips", roi: "+11.9%", yield: "+580u", followed: false }
  ]
};

// Open Leaderboard Modal
function openLeaderboardModal(activeTab) {
  const modal = document.getElementById("leaderboard-modal");
  if (!modal) return;
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
  
  if (activeTab === 'rules') {
    switchLeadTab('rules');
  } else {
    switchLeadTab(activeTab || 'monthly');
  }
}

function closeLeaderboardModal(event, force) {
  if (force || event.target.id === "leaderboard-modal") {
    const modal = document.getElementById("leaderboard-modal");
    if (modal) modal.classList.remove("active");
    document.body.style.overflow = "";
  }
}

function switchLeadTab(tab) {
  // Update buttons
  const tabs = ["monthly", "weekly", "alltime", "rules"];
  tabs.forEach(t => {
    const btn = document.getElementById(`lead-tab-${t}`);
    if (btn) {
      if (t === tab) btn.classList.add("active");
      else btn.classList.remove("active");
    }
  });

  // Toggle panes
  const listPane = document.getElementById("lead-pane-list");
  const rulesPane = document.getElementById("lead-pane-rules");

  if (tab === 'rules') {
    if (listPane) listPane.style.display = "none";
    if (rulesPane) rulesPane.style.display = "block";
  } else {
    if (listPane) listPane.style.display = "block";
    if (rulesPane) rulesPane.style.display = "none";
    renderLeaderboardList(tab);
  }
}

function renderLeaderboardList(tab) {
  const tbody = document.getElementById("lead-tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const punters = LEADERBOARD_DATA[tab] || [];
  punters.forEach(p => {
    const tr = document.createElement("tr");
    tr.style.borderBottom = "1px solid rgba(255,255,255,0.03)";
    tr.innerHTML = `
      <td style="padding: 10px 4px; font-weight: 700; color: ${p.rank <= 3 ? 'var(--secondary)' : 'var(--text-muted)'};">${p.rank}</td>
      <td style="padding: 10px 4px; font-weight: 600; color: var(--text-primary);">${p.name}</td>
      <td style="padding: 10px 4px; color: var(--secondary); font-weight: 700;">${p.roi}</td>
      <td style="padding: 10px 4px; color: var(--text-secondary);">${p.yield}</td>
      <td style="padding: 10px 4px; text-align: right;">
        <button class="btn ${p.followed ? 'btn-secondary' : 'btn-primary'}" style="font-size: 0.7rem; padding: 4px 10px;" onclick="toggleFollowPunter('${tab}', ${p.rank})">
          ${p.followed ? '✓ Following' : 'Follow Picks'}
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function toggleFollowPunter(tab, rank) {
  const list = LEADERBOARD_DATA[tab];
  if (!list) return;
  const punter = list.find(p => p.rank === rank);
  if (punter) {
    punter.followed = !punter.followed;
    renderLeaderboardList(tab);
  }
}

// Mines Store Modal Controllers
function openStoreModal(activeTab) {
  const modal = document.getElementById("store-modal");
  if (!modal) return;
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
  switchStoreTab(activeTab || 'shop');
  updateStoreBalanceDisplay();
}

function closeStoreModal(event, force) {
  if (force || event.target.id === "store-modal") {
    const modal = document.getElementById("store-modal");
    if (modal) modal.classList.remove("active");
    document.body.style.overflow = "";
  }
}

function switchStoreTab(tab) {
  const tabs = ["shop", "voucher"];
  tabs.forEach(t => {
    const btn = document.getElementById(`store-tab-${t}`);
    if (btn) {
      if (t === tab) btn.classList.add("active");
      else btn.classList.remove("active");
    }
  });

  const shopPane = document.getElementById("store-pane-shop");
  const voucherPane = document.getElementById("store-pane-voucher");

  if (tab === 'shop') {
    if (shopPane) shopPane.style.display = "block";
    if (voucherPane) voucherPane.style.display = "none";
  } else {
    if (shopPane) shopPane.style.display = "none";
    if (voucherPane) voucherPane.style.display = "block";
    const msg = document.getElementById("voucher-message");
    if (msg) msg.innerText = "";
    const inp = document.getElementById("voucher-input");
    if (inp) inp.value = "";
  }
}

function updateStoreBalanceDisplay() {
  const bal = window.appState.coinsBalance || 500;
  const storeBal = document.getElementById("store-coins-balance");
  const navBal = document.getElementById("nav-coins-balance");
  const headerCount = document.getElementById("header-coins-count");
  const inlineStoreBal = document.getElementById("inline-store-coins-balance");
  const modalBal = document.getElementById("modal-user-coins-display");

  if (storeBal) storeBal.innerText = `${bal} Coins`;
  if (navBal) navBal.innerText = `${bal} Coins`;
  if (headerCount) headerCount.innerText = bal;
  const mobCount = document.getElementById("mobile-coins-count");
  if (mobCount) mobCount.innerText = bal;
  if (inlineStoreBal) inlineStoreBal.innerText = `${bal} Coins`;
  if (modalBal) modalBal.innerText = bal;

  // Update claim buttons in UI if already claimed
  if (window.appState.claimedDaily) {
    const sideBtn = document.getElementById("sidebar-claim-btn");
    if (sideBtn) {
      sideBtn.innerText = "Claimed Today ✓";
      sideBtn.style.background = "rgba(255,255,255,0.05)";
      sideBtn.style.border = "1px solid var(--border-color)";
    }
    const inlineClaimBtn = document.getElementById("inline-store-claim-btn");
    if (inlineClaimBtn) {
      inlineClaimBtn.innerText = "Claimed Today ✓";
      inlineClaimBtn.style.background = "rgba(255,255,255,0.05)";
      inlineClaimBtn.style.border = "1px solid var(--border-color)";
    }
  }
}

function purchaseCoins(amount) {
  window.appState.coinsBalance = (window.appState.coinsBalance || 500) + amount;
  updateStoreBalanceDisplay();
  alert(`🪙 Success! Purchased ${amount} Mines Coins. Your new balance is ${window.appState.coinsBalance} Coins.`);
}

function redeemVoucherCode() {
  const valElement = document.getElementById("voucher-input");
  if (!valElement) return;
  const val = valElement.value.trim().toUpperCase();
  const msg = document.getElementById("voucher-message");
  if (!msg) return;

  if (val === "MINES50") {
    window.appState.coinsBalance = (window.appState.coinsBalance || 500) + 50;
    updateStoreBalanceDisplay();
    msg.style.color = "var(--secondary)";
    msg.innerText = "✓ Promo code 'MINES50' successfully redeemed! +50 Coins added.";
  } else if (val === "PROSCOUT") {
    unlockPremiumPlan();
    msg.style.color = "var(--secondary)";
    msg.innerText = "✓ Promo code 'PROSCOUT' successfully redeemed! DeepPredict Pro Pass unlocked.";
  } else {
    msg.style.color = "var(--danger)";
    msg.innerText = "✗ Invalid or expired promo voucher code.";
  }
}

function claimDailyRewardNav() {
  if (window.appState.claimedDaily) {
    alert("🎁 You have already claimed your daily reward! Please check back in 24 hours.");
    return;
  }

  window.appState.coinsBalance = (window.appState.coinsBalance || 500) + 50;
  window.appState.claimedDaily = true;
  updateStoreBalanceDisplay();

  // Update claim buttons in UI
  const sideBtn = document.getElementById("sidebar-claim-btn");
  if (sideBtn) {
    sideBtn.innerText = "Claimed Today ✓";
    sideBtn.style.background = "rgba(255,255,255,0.05)";
    sideBtn.style.border = "1px solid var(--border-color)";
    sideBtn.style.color = "var(--text-muted)";
    sideBtn.style.cursor = "default";
  }

  alert("🎁 Daily Reward Claimed! +50 Mines Coins added to your account. Enjoy your analytical tools!");
}

// User Profile Modal Controllers
function openProfileModal(activeTab) {
  const modal = document.getElementById("profile-modal");
  if (!modal) return;
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
  switchProfileTab(activeTab || 'info');
}

function closeProfileModal(event, force) {
  if (force || event.target.id === "profile-modal") {
    const modal = document.getElementById("profile-modal");
    if (modal) modal.classList.remove("active");
    document.body.style.overflow = "";
  }
}

function switchProfileTab(tab) {
  const tabs = ["info", "alerts", "history"];
  tabs.forEach(t => {
    const btn = document.getElementById(`prof-tab-${t}`);
    if (btn) {
      if (t === tab) btn.classList.add("active");
      else btn.classList.remove("active");
    }
  });

  const infoPane = document.getElementById("prof-pane-info");
  const alertsPane = document.getElementById("prof-pane-alerts");
  const historyPane = document.getElementById("prof-pane-history");

  if (infoPane) infoPane.style.display = tab === 'info' ? "block" : "none";
  if (alertsPane) alertsPane.style.display = tab === 'alerts' ? "block" : "none";
  if (historyPane) historyPane.style.display = tab === 'history' ? "block" : "none";

  if (tab === 'history') {
    renderProfileSavedTickets();
  }
}

function renderProfileSavedTickets() {
  const container = document.getElementById("saved-tickets-container");
  if (!container) return;

  const mockTickets = window.appState.savedTickets || [];
  if (mockTickets.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; font-size: 0.8rem; color: var(--text-muted); padding: 20px;">
        No saved tickets in history yet. Open the DeepPredict Machine to build and save.
      </div>
    `;
  } else {
    container.innerHTML = mockTickets.map((t, idx) => `
      <div class="glass-card" style="padding: 12px; border: 1px solid var(--border-color); margin-bottom: 8px;">
        <div style="display: flex; justify-content: space-between; font-size: 0.75rem; margin-bottom: 6px;">
          <span style="font-weight: 700; color: var(--primary);">Ticket #${idx + 1}</span>
          <span style="color: var(--secondary); font-weight: 700;">@${t.totalOdds}</span>
        </div>
        <p style="font-size: 0.8rem; color: var(--text-secondary); margin: 0;">${t.matches.length} matches accumulated. Payout est. ${t.payout} on $10 stake.</p>
      </div>
    `).join("");
  }
}

// Support Modal Controllers
function openSupportModal(activeTab) {
  const modal = document.getElementById("support-modal");
  if (!modal) return;
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
  switchSupportTab(activeTab || 'faq');
}

function closeSupportModal(event, force) {
  if (force || event.target.id === "support-modal") {
    const modal = document.getElementById("support-modal");
    if (modal) modal.classList.remove("active");
    document.body.style.overflow = "";
  }
}

function switchSupportTab(tab) {
  const tabs = ["faq", "ticket", "terms", "privacy"];
  tabs.forEach(t => {
    const btn = document.getElementById(`supp-tab-${t}`);
    if (btn) {
      if (t === tab) btn.classList.add("active");
      else btn.classList.remove("active");
    }
    const pane = document.getElementById(`supp-pane-${t}`);
    if (pane) {
      pane.style.display = t === tab ? "block" : "none";
    }
  });

  if (tab === 'ticket') {
    const msg = document.getElementById("support-message");
    if (msg) msg.innerText = "";
    const sub = document.getElementById("support-subject");
    if (sub) sub.value = "";
    const desc = document.getElementById("support-desc");
    if (desc) desc.value = "";
  }
}

function toggleFAQCollapse(header) {
  const content = header.nextElementSibling;
  if (!content) return;
  const isOpen = content.style.display === "block";
  content.style.display = isOpen ? "none" : "block";
}

function submitSupportTicket() {
  const subjectEl = document.getElementById("support-subject");
  const descEl = document.getElementById("support-desc");
  const subject = subjectEl ? subjectEl.value.trim() : "";
  const desc = descEl ? descEl.value.trim() : "";
  const msg = document.getElementById("support-message");
  if (!msg) return;

  if (!subject || !desc) {
    msg.style.color = "var(--danger)";
    msg.innerText = "✗ Please fill out all support inquiry fields.";
    return;
  }

  msg.style.color = "var(--secondary)";
  msg.innerText = "✓ Support ticket submitted successfully! A representative will email you shortly.";
  if (subjectEl) subjectEl.value = "";
  if (descEl) descEl.value = "";
}

// Inline Leaderboard functions
function switchInlineLeadTab(tab) {
  const tabs = ["monthly", "weekly", "alltime", "rules"];
  tabs.forEach(t => {
    const btn = document.getElementById(`inline-lead-tab-${t}`);
    if (btn) {
      if (t === tab) btn.classList.add("active");
      else btn.classList.remove("active");
    }
  });

  const listPane = document.getElementById("inline-lead-pane-list");
  const rulesPane = document.getElementById("inline-lead-pane-rules");

  if (tab === 'rules') {
    if (listPane) listPane.style.display = "none";
    if (rulesPane) rulesPane.style.display = "block";
  } else {
    if (listPane) listPane.style.display = "block";
    if (rulesPane) rulesPane.style.display = "none";
    renderInlineLeaderboardList(tab);
  }
}

function renderInlineLeaderboardList(tab) {
  const tbody = document.getElementById("inline-lead-tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const punters = LEADERBOARD_DATA[tab] || [];
  punters.forEach(p => {
    const tr = document.createElement("tr");
    tr.style.borderBottom = "1px solid rgba(255,255,255,0.03)";
    tr.innerHTML = `
      <td style="padding: 8px 4px; font-weight: 700; color: ${p.rank <= 3 ? 'var(--secondary)' : 'var(--text-muted)'};">${p.rank}</td>
      <td style="padding: 8px 4px; font-weight: 600; color: var(--text-primary);">${p.name}</td>
      <td style="padding: 8px 4px; color: var(--secondary); font-weight: 700;">${p.roi}</td>
      <td style="padding: 8px 4px; text-align: right;">
        <button class="btn ${p.followed ? 'btn-secondary' : 'btn-primary'}" style="font-size: 0.65rem; padding: 2px 6px;" onclick="toggleFollowPunterInline('${tab}', ${p.rank})">
          ${p.followed ? '✓' : '+ Follow'}
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function toggleFollowPunterInline(tab, rank) {
  const punter = LEADERBOARD_DATA[tab].find(p => p.rank === rank);
  if (punter) {
    punter.followed = !punter.followed;
    renderInlineLeaderboardList(tab);
    // Also sync the modal one if it's open
    if (typeof renderLeaderboardList === 'function') {
      renderLeaderboardList(tab);
    }
  }
}

// Inline Mines Store Functions
function switchInlineStoreTab(tab) {
  const shopPane = document.getElementById("inline-store-pane-shop");
  const voucherPane = document.getElementById("inline-store-pane-voucher");

  const shopBtn = document.getElementById("inline-store-tab-shop");
  const voucherBtn = document.getElementById("inline-store-tab-voucher");

  if (tab === 'shop') {
    if (shopPane) shopPane.style.display = "flex";
    if (voucherPane) voucherPane.style.display = "none";
    if (shopBtn) shopBtn.classList.add("active");
    if (voucherBtn) voucherBtn.classList.remove("active");
  } else {
    if (shopPane) shopPane.style.display = "none";
    if (voucherPane) voucherPane.style.display = "flex";
    if (shopBtn) shopBtn.classList.remove("active");
    if (voucherBtn) voucherBtn.classList.add("active");
  }
}

function buyCoinsInline(amount, price) {
  window.appState.coinsBalance = (window.appState.coinsBalance || 500) + amount;
  updateStoreBalanceDisplay();
  alert(`🪙 Success! Purchased ${amount} Mines Coins for ${price}. New balance is ${window.appState.coinsBalance} Coins.`);
}

function redeemVoucherInline() {
  const inp = document.getElementById("inline-voucher-input");
  if (!inp) return;
  const val = inp.value.trim().toUpperCase();
  const msg = document.getElementById("inline-voucher-msg");
  if (!msg) return;

  if (val === "MINES50") {
    window.appState.coinsBalance = (window.appState.coinsBalance || 500) + 50;
    updateStoreBalanceDisplay();
    msg.style.color = "var(--secondary)";
    msg.innerText = "✓ Voucher redeemed! +50 Coins added.";
    inp.value = "";
  } else if (val === "PROSCOUT") {
    unlockPremiumPlan();
    msg.style.color = "var(--secondary)";
    msg.innerText = "✓ Pro Pass unlocked!";
    inp.value = "";
  } else {
    msg.style.color = "var(--danger)";
    msg.innerText = "✗ Invalid or expired coupon code.";
  }
}

function claimDailyRewardInline() {
  if (window.appState.claimedDaily) {
    alert("🎁 Daily reward already claimed! Please check back in 24 hours.");
    return;
  }

  window.appState.coinsBalance = (window.appState.coinsBalance || 500) + 50;
  window.appState.claimedDaily = true;
  updateStoreBalanceDisplay();
  alert("🎁 Daily reward claimed! +50 Coins added.");
}

// Inline User Hub Functions
function switchInlineUserTab(tab) {
  const panes = ["profile", "alerts", "history", "support"];
  panes.forEach(p => {
    const pane = document.getElementById(`inline-user-pane-${p}`);
    const btn = document.getElementById(`inline-user-tab-${p}`);
    if (pane) {
      if (p === tab) {
        pane.style.display = p === 'support' || p === 'history' ? "block" : "flex";
      } else {
        pane.style.display = "none";
      }
    }
    if (btn) {
      if (p === tab) btn.classList.add("active");
      else btn.classList.remove("active");
    }
  });

  if (tab === 'history') {
    renderInlineSavedTickets();
  }
}

function renderInlineSavedTickets() {
  const container = document.getElementById("inline-saved-tickets-container");
  if (!container) return;
  container.innerHTML = "";

  const tickets = window.appState.savedTickets || [];
  if (tickets.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; color: var(--text-muted); padding: 20px 10px;">
        No saved tickets found in history.
      </div>
    `;
    return;
  }

  tickets.forEach((t, index) => {
    const card = document.createElement("div");
    card.style.background = "rgba(255,255,255,0.01)";
    card.style.border = "1px solid var(--border-color)";
    card.style.borderRadius = "var(--radius-sm)";
    card.style.padding = "10px";
    card.style.marginBottom = "8px";

    const matchesHtml = t.matches.map(m => `<div style="font-size: 0.7rem; color: var(--text-secondary); margin-bottom: 2px;">• ${m}</div>`).join("");

    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; font-weight: 700; color: var(--text-primary); font-size: 0.75rem; margin-bottom: 6px; border-bottom: 1px solid rgba(255,255,255,0.03); padding-bottom: 4px;">
        <span>Ticket #${index + 1}</span>
        <span style="color: var(--secondary); font-family: var(--font-display);">${t.totalOdds}</span>
      </div>
      <div>${matchesHtml}</div>
      <div style="font-size: 0.7rem; text-align: right; color: var(--text-muted); margin-top: 4px;">
        Payout: <b style="color: var(--text-primary); font-family: var(--font-display);">${t.payout}</b>
      </div>
    `;
    container.appendChild(card);
  });
}

function submitSupportTicketInline() {
  const subjectEl = document.getElementById("inline-support-subject");
  const descEl = document.getElementById("inline-support-desc");
  const subject = subjectEl ? subjectEl.value.trim() : "";
  const desc = descEl ? descEl.value.trim() : "";
  const msg = document.getElementById("inline-support-msg");
  if (!msg) return;

  if (!subject || !desc) {
    msg.style.color = "var(--danger)";
    msg.innerText = "✗ Fill out all fields.";
    return;
  }

  msg.style.color = "var(--secondary)";
  msg.innerText = "✓ Support ticket submitted successfully!";
  if (subjectEl) subjectEl.value = "";
  if (descEl) descEl.value = "";
}

// Dropdown change handler for advanced filters markets
function onFilterMarketChange() {
  const mktEl = document.getElementById("filt-market-select");
  if (!mktEl) return;
  const mkt = mktEl.value;
  const subSel = document.getElementById("filt-submarket-select");
  if (!subSel) return;
  subSel.innerHTML = "";

  const optionsMap = {
    "all": [
      { value: "any", text: "Any Outcome" }
    ],
    "1x2": [
      { value: "home", text: "Home Win (1)" },
      { value: "draw", text: "Draw (X)" },
      { value: "away", text: "Away Win (2)" }
    ],
    "goals": [
      { value: "over15", text: "Over 1.5 Goals" },
      { value: "over25", text: "Over 2.5 Goals" },
      { value: "over35", text: "Over 3.5 Goals" },
      { value: "under25", text: "Under 2.5 Goals" },
      { value: "under15", text: "Under 1.5 Goals" }
    ],
    "btts": [
      { value: "yes", text: "Both Teams to Score - Yes" },
      { value: "no", text: "Both Teams to Score - No" }
    ],
    "double_chance": [
      { value: "1x", text: "Home/Draw (1X)" },
      { value: "x2", text: "Away/Draw (X2)" },
      { value: "12", text: "Home/Away (12)" }
    ],
    "corners": [
      { value: "over85", text: "Over 8.5 Corners" },
      { value: "over95", text: "Over 9.5 Corners" },
      { value: "over105", text: "Over 10.5 Corners" }
    ]
  };

  const list = optionsMap[mkt] || optionsMap["all"];
  list.forEach(opt => {
    const el = document.createElement("option");
    el.value = opt.value;
    el.innerText = opt.text;
    subSel.appendChild(el);
  });
}

// Open dynamic league central hub modal with predictions, odds, and results tabs
function openLeaguePreviewHub(leagueName, defaultTab = 'predictions') {
  // Create overlay/modal
  const modal = document.createElement("div");
  modal.id = "league-preview-hub-modal";
  modal.style.position = "fixed";
  modal.style.left = "0";
  modal.style.top = "0";
  modal.style.width = "100vw";
  modal.style.height = "100vh";
  modal.style.background = "rgba(0, 0, 0, 0.85)";
  modal.style.display = "flex";
  modal.style.alignItems = "center";
  modal.style.justifyContent = "center";
  modal.style.zIndex = "2500";
  
  // Outer content card
  const content = document.createElement("div");
  content.className = "glass-card";
  content.style.width = "90%";
  content.style.maxWidth = "780px";
  content.style.maxHeight = "90vh";
  content.style.overflowY = "auto";
  content.style.padding = "28px";
  content.style.border = "1px solid var(--border-color)";
  content.style.display = "flex";
  content.style.flexDirection = "column";
  content.style.gap = "18px";
  
  // Filter matches for this league
  // Support case-insensitive search
  const leagueMatches = MATCH_DATA.filter(m => m.league.toLowerCase() === leagueName.toLowerCase());
  
  // Find flag emoji
  const leagueData = TOP_LEAGUES_DATA.find(l => l.name.toLowerCase() === leagueName.toLowerCase());
  const flagEmoji = leagueData ? leagueData.emoji : "🏆";

  // Build header HTML
  const headerHtml = `
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 14px;">
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 1.8rem;">${flagEmoji}</span>
        <div>
          <h3 style="font-family: var(--font-display); font-size: 1.25rem; color: var(--text-primary); margin: 0;">${leagueName} Hub</h3>
          <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">DeepPredict League Central Preview</span>
        </div>
      </div>
      <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.75rem;" id="close-preview-hub-btn">✕ Close</button>
    </div>
  `;

  // Build Tab Switcher
  const tabSwitcherHtml = `
    <div style="display: flex; gap: 8px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px;">
      <button class="tab-btn ${defaultTab === 'predictions' ? 'active' : ''}" id="pl-tab-btn-predictions" style="font-size: 0.8rem; padding: 8px 16px;">🔮 Predictions</button>
      <button class="tab-btn ${defaultTab === 'odds' ? 'active' : ''}" id="pl-tab-btn-odds" style="font-size: 0.8rem; padding: 8px 16px;">🎲 Match Odds</button>
      <button class="tab-btn ${defaultTab === 'results' ? 'active' : ''}" id="pl-tab-btn-results" style="font-size: 0.8rem; padding: 8px 16px;">✅ Results</button>
    </div>
  `;

  // Dynamic pane contents
  const paneContainer = document.createElement("div");
  paneContainer.id = "preview-hub-pane-container";
  paneContainer.style.flex = "1";
  
  // Render function for Predictions
  function renderPredictionsTab() {
    if (leagueMatches.length === 0) {
      return `<div style="text-align: center; padding: 40px; color: var(--text-muted);">No upcoming matches found for this league.</div>`;
    }
    
    // Sort upcoming first (exclude FT matches)
    const sorted = [...leagueMatches].sort((a,b) => {
      if (a.isLive) return -1;
      if (b.isLive) return 1;
      if (a.time.includes("FT") || a.scores.home !== null) return 1;
      if (b.time.includes("FT") || b.scores.home !== null) return -1;
      return 0;
    });

    const rows = sorted.map(m => {
      // Determine prediction tip
      let tipLabel = "Home Win (1)";
      if (m.predictions.draw > m.predictions.home && m.predictions.draw > m.predictions.away) {
        tipLabel = "Draw (X)";
      } else if (m.predictions.away > m.predictions.home && m.predictions.away > m.predictions.draw) {
        tipLabel = "Away Win (2)";
      }
      
      const probHome = m.predictions.home;
      const probDraw = m.predictions.draw;
      const probAway = m.predictions.away;
      
      // Status tag
      let statusTag = `<span style="font-size: 0.7rem; font-weight: 700; color: var(--text-secondary); background: rgba(255,255,255,0.05); padding: 2px 6px; border-radius: var(--radius-sm);">${m.time}</span>`;
      if (m.isLive) {
        statusTag = `<span style="font-size: 0.7rem; font-weight: 700; color: var(--danger); background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.25); padding: 2px 6px; border-radius: var(--radius-sm); animation: pulse 1.5s infinite;">● LIVE</span>`;
      } else if (m.time.includes("FT") || m.scores.home !== null) {
        statusTag = `<span style="font-size: 0.7rem; font-weight: 700; color: var(--success); background: rgba(16,185,129,0.15); padding: 2px 6px; border-radius: var(--radius-sm);">FT</span>`;
      }

      return `
        <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 16px; display: flex; flex-direction: column; gap: 12px; margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            ${statusTag}
            <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 700;">Confidence: <b style="color: ${m.confidence === 'high' ? 'var(--success)' : 'var(--accent-gold)'}; text-transform: uppercase;">${m.confidence} (${m.confidenceVal}%)</b></span>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; text-align: center; gap: 8px;">
            <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 6px;">
              <span style="font-size: 1.4rem;">${m.homeTeam.logo || '⚽'}</span>
              <span style="font-weight: 700; color: var(--text-primary); font-size: 0.9rem;">${m.homeTeam.name}</span>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 4px; padding: 0 12px;">
              <span style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">VS</span>
              <span style="font-size: 1.15rem; font-family: var(--font-display); font-weight: 800; color: var(--text-primary); background: rgba(255,255,255,0.03); padding: 4px 10px; border-radius: var(--radius-sm);">
                ${m.scores.home !== null ? `${m.scores.home} - ${m.scores.away}` : '? - ?'}
              </span>
            </div>
            
            <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 6px;">
              <span style="font-size: 1.4rem;">${m.awayTeam.logo || '⚽'}</span>
              <span style="font-weight: 700; color: var(--text-primary); font-size: 0.9rem;">${m.awayTeam.name}</span>
            </div>
          </div>

          <div style="border-top: 1px dashed var(--border-color); padding-top: 10px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
            <div style="display: flex; flex-direction: column; gap: 4px; flex: 1; min-width: 200px;">
              <span style="font-size: 0.7rem; color: var(--text-secondary); font-weight: 700;">Model Win Probabilities:</span>
              <div style="display: flex; height: 16px; border-radius: 8px; overflow: hidden; font-size: 0.65rem; color: #fff; font-weight: 700; text-align: center;">
                <div style="width: ${probHome}%; background: var(--primary); line-height: 16px;">1: ${probHome}%</div>
                <div style="width: ${probDraw}%; background: #6b7280; line-height: 16px;">X: ${probDraw}%</div>
                <div style="width: ${probAway}%; background: var(--secondary); line-height: 16px;">2: ${probAway}%</div>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="text-align: right;">
                <div style="font-size: 0.65rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Mines AI Tip</div>
                <div style="font-size: 0.85rem; font-weight: 800; color: var(--success); font-family: var(--font-display);">${tipLabel}</div>
              </div>
              <button class="btn btn-secondary" onclick="document.body.removeChild(document.getElementById('league-preview-hub-modal')); openScoutModal('${m.id}')" style="padding: 6px 10px; font-size: 0.72rem; display: flex; align-items: center; gap: 4px;">
                <span>🧠</span> Scout
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");
    
    return `<div style="max-height: 550px; overflow-y: auto; padding-right: 4px;">${rows}</div>`;
  }

  // Render function for Odds Tab
  function renderOddsTab() {
    // Only show odds for matches that aren't finished
    const upcoming = leagueMatches.filter(m => !m.time.includes("FT") && m.scores.home === null);
    if (upcoming.length === 0) {
      return `<div style="text-align: center; padding: 40px; color: var(--text-muted);">No upcoming matches with open betting markets.</div>`;
    }

    const rows = upcoming.map(m => {
      const homeOdds = parseFloat((1.4 + (m.predictions.away / 100) * 2.0).toFixed(2));
      const drawOdds = parseFloat((3.0 + (m.predictions.draw / 100) * 1.5).toFixed(2));
      const awayOdds = parseFloat((1.4 + (m.predictions.home / 100) * 2.0).toFixed(2));
      
      const u25Odds = parseFloat((1.5 + (m.predictions.draw / 100) * 1.0).toFixed(2));
      const o25Odds = parseFloat((1.4 + (m.predictions.home / 100) * 1.2).toFixed(2));
      
      const bttsYes = parseFloat((1.5 + (Math.abs(m.predictions.home - m.predictions.away) / 100) * 0.8).toFixed(2));
      const bttsNo = parseFloat((1.6 + (m.predictions.draw / 100) * 1.0).toFixed(2));

      return `
        <div style="background: rgba(255, 255, 255, 0.01); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 16px; margin-bottom: 12px;">
          <div style="font-weight: 700; color: var(--text-primary); font-size: 0.85rem; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
            <span>⚽</span> ${m.homeTeam.name} vs ${m.awayTeam.name}
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
            <!-- 1X2 Market -->
            <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 8px; text-align: center;">
              <div style="font-size: 0.65rem; color: var(--text-muted); font-weight: 700; margin-bottom: 6px; text-transform: uppercase;">1X2 Match Odds</div>
              <div style="display: flex; justify-content: space-around; font-size: 0.78rem;">
                <div><b style="color: var(--text-secondary);">1</b> <span style="color: var(--primary); font-family: var(--font-display); font-weight: 700;">@${homeOdds.toFixed(2)}</span></div>
                <div><b style="color: var(--text-secondary);">X</b> <span style="color: var(--primary); font-family: var(--font-display); font-weight: 700;">@${drawOdds.toFixed(2)}</span></div>
                <div><b style="color: var(--text-secondary);">2</b> <span style="color: var(--primary); font-family: var(--font-display); font-weight: 700;">@${awayOdds.toFixed(2)}</span></div>
              </div>
            </div>

            <!-- Over/Under 2.5 Market -->
            <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 8px; text-align: center;">
              <div style="font-size: 0.65rem; color: var(--text-muted); font-weight: 700; margin-bottom: 6px; text-transform: uppercase;">U/O 2.5 Goals</div>
              <div style="display: flex; justify-content: space-around; font-size: 0.78rem;">
                <div><b style="color: var(--text-secondary);">Under</b> <span style="color: var(--secondary); font-family: var(--font-display); font-weight: 700;">@${u25Odds.toFixed(2)}</span></div>
                <div><b style="color: var(--text-secondary);">Over</b> <span style="color: var(--secondary); font-family: var(--font-display); font-weight: 700;">@${o25Odds.toFixed(2)}</span></div>
              </div>
            </div>

            <!-- Both Teams to Score -->
            <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 8px; text-align: center;">
              <div style="font-size: 0.65rem; color: var(--text-muted); font-weight: 700; margin-bottom: 6px; text-transform: uppercase;">BTTS (GG/NG)</div>
              <div style="display: flex; justify-content: space-around; font-size: 0.78rem;">
                <div><b style="color: var(--text-secondary);">Yes</b> <span style="color: var(--accent-gold); font-family: var(--font-display); font-weight: 700;">@${bttsYes.toFixed(2)}</span></div>
                <div><b style="color: var(--text-secondary);">No</b> <span style="color: var(--accent-gold); font-family: var(--font-display); font-weight: 700;">@${bttsNo.toFixed(2)}</span></div>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join("");

    return `<div style="max-height: 550px; overflow-y: auto; padding-right: 4px;">${rows}</div>`;
  }

  // Render function for Results Tab
  function renderResultsTab() {
    const completed = leagueMatches.filter(m => m.time.includes("FT") || m.scores.home !== null);
    if (completed.length === 0) {
      return `<div style="text-align: center; padding: 40px; color: var(--text-muted);">No match results recorded for this division yet.</div>`;
    }

    const rows = completed.map(m => {
      // Check if prediction succeeded
      let tipResultLabel = "Home Win (1)";
      let didWin = false;
      if (m.predictions.draw > m.predictions.home && m.predictions.draw > m.predictions.away) {
        tipResultLabel = "Draw (X)";
        didWin = m.scores.home === m.scores.away;
      } else if (m.predictions.away > m.predictions.home && m.predictions.away > m.predictions.draw) {
        tipResultLabel = "Away Win (2)";
        didWin = m.scores.away > m.scores.home;
      } else {
        didWin = m.scores.home > m.scores.away;
      }

      return `
        <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 14px; margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
            <span style="font-size: 0.7rem; font-weight: 700; color: var(--text-secondary); background: rgba(255,255,255,0.05); padding: 2px 6px; border-radius: var(--radius-sm);">${m.time}</span>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-weight: 700; color: var(--text-primary); font-size: 0.85rem;">${m.homeTeam.name}</span>
              <span style="background: rgba(255,255,255,0.04); font-family: var(--font-display); font-weight: 800; padding: 2px 8px; border-radius: var(--radius-sm); color: var(--text-primary); font-size: 0.85rem;">
                ${m.scores.home} - ${m.scores.away}
              </span>
              <span style="font-weight: 700; color: var(--text-primary); font-size: 0.85rem;">${m.awayTeam.name}</span>
            </div>
          </div>
          
          <div style="display: flex; align-items: center; gap: 10px; text-align: right;">
            <div>
              <div style="font-size: 0.6rem; color: var(--text-muted); text-transform: uppercase;">Tip: ${tipResultLabel}</div>
              <span style="font-size: 0.75rem; font-weight: 700; color: ${didWin ? 'var(--success)' : 'var(--accent-gold)'};">
                ${didWin ? '✅ Successful' : '⏳ Pending/Void'}
              </span>
            </div>
          </div>
        </div>
      `;
    }).join("");

    return `<div style="max-height: 550px; overflow-y: auto; padding-right: 4px;">${rows}</div>`;
  }

  // Setup initial render
  function updatePane(tabName) {
    if (tabName === 'predictions') {
      paneContainer.innerHTML = renderPredictionsTab();
    } else if (tabName === 'odds') {
      paneContainer.innerHTML = renderOddsTab();
    } else if (tabName === 'results') {
      paneContainer.innerHTML = renderResultsTab();
    }
  }

  // Assemble base structure
  content.innerHTML = headerHtml + tabSwitcherHtml;
  content.appendChild(paneContainer);
  modal.appendChild(content);
  document.body.appendChild(modal);

  // Initial content render
  updatePane(defaultTab);

  // Register interactive events for tab switching
  const btnPreds = modal.querySelector("#pl-tab-btn-predictions");
  const btnOdds = modal.querySelector("#pl-tab-btn-odds");
  const btnResults = modal.querySelector("#pl-tab-btn-results");
  const btnClose = modal.querySelector("#close-preview-hub-btn");

  const switchActiveBtn = (activeBtn) => {
    [btnPreds, btnOdds, btnResults].forEach(btn => btn.classList.remove("active"));
    activeBtn.classList.add("active");
  };

  btnPreds.onclick = () => {
    switchActiveBtn(btnPreds);
    updatePane('predictions');
  };
  btnOdds.onclick = () => {
    switchActiveBtn(btnOdds);
    updatePane('odds');
  };
  btnResults.onclick = () => {
    switchActiveBtn(btnResults);
    updatePane('results');
  };

  const closeFn = () => {
    document.body.removeChild(modal);
  };
  btnClose.onclick = closeFn;

  // Clicking outside close handler
  modal.onclick = (e) => {
    if (e.target === modal) closeFn();
  };
}



// Open dynamic Live Match Scanner Hub modal showing scanner live stats and scanner active rules results
function openLiveScannerHub(matchId, defaultTab = 'stats') {
  const match = MATCH_DATA.find(m => m.id === matchId);
  if (!match) return;

  // Create overlay/modal
  const modal = document.createElement("div");
  modal.id = "live-scanner-hub-modal";
  modal.style.position = "fixed";
  modal.style.left = "0";
  modal.style.top = "0";
  modal.style.width = "100vw";
  modal.style.height = "100vh";
  modal.style.background = "rgba(0, 0, 0, 0.85)";
  modal.style.display = "flex";
  modal.style.alignItems = "center";
  modal.style.justifyContent = "center";
  modal.style.zIndex = "2500";
  
  // Outer content card
  const content = document.createElement("div");
  content.className = "glass-card";
  content.style.width = "90%";
  content.style.maxWidth = "720px";
  content.style.maxHeight = "90vh";
  content.style.overflowY = "auto";
  content.style.padding = "28px";
  content.style.border = "1px solid var(--border-color)";
  content.style.display = "flex";
  content.style.flexDirection = "column";
  content.style.gap = "18px";

  // Calculate live stats (identical seed-based logic to renderLiveScanner)
  const hashStr = (match.homeTeam.name + match.awayTeam.name);
  let hash = 0;
  for (let i = 0; i < hashStr.length; i++) {
    hash = hashStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  const seed = Math.abs(hash);

  const avgScored = parseFloat((1.0 + (seed % 19) * 0.1).toFixed(1));
  const avgConceded = parseFloat((0.6 + ((seed >> 2) % 17) * 0.1).toFixed(1));
  const avgXG = parseFloat((0.8 + ((seed >> 4) % 18) * 0.1).toFixed(1));
  const corners = parseFloat((7.5 + ((seed >> 6) % 9) * 0.5).toFixed(1));
  
  const homeFormVal = match.homeTeam.form ? match.homeTeam.form.reduce((sum, val) => sum + (val === 'W' ? 20 : val === 'D' ? 10 : 0), 0) : 60;
  const awayFormVal = match.awayTeam.form ? match.awayTeam.form.reduce((sum, val) => sum + (val === 'W' ? 20 : val === 'D' ? 10 : 0), 0) : 50;
  const avgForm = Math.round((homeFormVal + awayFormVal) / 2);

  const possessionH = 40 + (seed % 21);
  const possessionA = 100 - possessionH;

  const liveCornersH = seed % 7;
  const liveCornersA = (seed >> 1) % 6;

  const elapsedMinutes = parseInt(match.time.replace(/[^0-9]/g, "")) || 45;
  const attH = Math.round(elapsedMinutes * (0.8 + (seed % 10) * 0.1));
  const attA = Math.round(elapsedMinutes * (0.7 + ((seed >> 2) % 10) * 0.1));

  const dangerousAttH = Math.round(attH * (0.35 + (seed % 21) * 0.01));
  const dangerousAttA = Math.round(attA * (0.35 + ((seed >> 3) % 21) * 0.01));

  const daMinH = (dangerousAttH / elapsedMinutes).toFixed(2);
  const daMinA = (dangerousAttA / elapsedMinutes).toFixed(2);

  const shotsOnH = seed % 6;
  const shotsOffH = (seed >> 1) % 7;
  const shotsOnA = (seed >> 2) % 5;
  const shotsOffA = (seed >> 3) % 6;

  const momentumH = Math.round((dangerousAttH * 1.5 + shotsOnH * 3) / (elapsedMinutes || 1) * 10);
  const momentumA = Math.round((dangerousAttA * 1.5 + shotsOnA * 3) / (elapsedMinutes || 1) * 10);

  // Match live score
  const homeScore = match.scores.home !== null ? match.scores.home : 0;
  const awayScore = match.scores.away !== null ? match.scores.away : 0;
  const totalLiveGoals = homeScore + awayScore;

  // Evaluate active scanner rules
  const rules = window.appState.liveRules || [];
  const ruleResults = rules.map(rule => {
    let matchVal = 0;
    let label = "";
    if (rule.param === 'possession') {
      matchVal = possessionH;
      label = `Possession H (${possessionH}%)`;
    } else if (rule.param === 'attacks') {
      matchVal = parseFloat(Math.max(daMinH, daMinA));
      label = `Max DA/Min (${Math.max(daMinH, daMinA)})`;
    } else if (rule.param === 'time') {
      matchVal = elapsedMinutes;
      label = `Elapsed Time (${elapsedMinutes}')`;
    } else if (rule.param === 'goals') {
      matchVal = totalLiveGoals;
      label = `Total Live Goals (${totalLiveGoals})`;
    }

    let satisfied = false;
    if (rule.cond === 'gt') satisfied = matchVal > rule.val;
    else if (rule.cond === 'lt') satisfied = matchVal < rule.val;
    else if (rule.cond === 'eq') satisfied = matchVal === rule.val;

    return {
      ruleLabel: rule.label,
      actualLabel: label,
      satisfied: satisfied
    };
  });

  // Build Header
  const headerHtml = `
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 14px;">
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 1.6rem; animation: pulse 1.5s infinite; color: var(--danger);">●</span>
        <div>
          <h3 style="font-family: var(--font-display); font-size: 1.25rem; color: var(--text-primary); margin: 0;">${match.homeTeam.name} vs ${match.awayTeam.name}</h3>
          <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">
            ${match.leagueEmoji} ${match.league} • Live Scanner Central
          </span>
        </div>
      </div>
      <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.75rem;" id="close-scanner-hub-btn">✕ Close</button>
    </div>
  `;

  // Build Tab Switcher
  const tabSwitcherHtml = `
    <div style="display: flex; gap: 8px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px;">
      <button class="tab-btn ${defaultTab === 'stats' ? 'active' : ''}" id="sc-tab-btn-stats" style="font-size: 0.8rem; padding: 8px 16px;">📊 Live Stats</button>
      <button class="tab-btn ${defaultTab === 'rules' ? 'active' : ''}" id="sc-tab-btn-rules" style="font-size: 0.8rem; padding: 8px 16px;">🎯 Scan Results (${ruleResults.filter(r => r.satisfied).length})</button>
      <button class="tab-btn ${defaultTab === 'brief' ? 'active' : ''}" id="sc-tab-btn-brief" style="font-size: 0.8rem; padding: 8px 16px;">🧠 Scout Brief</button>
    </div>
  `;

  // Pane container
  const paneContainer = document.createElement("div");
  paneContainer.id = "scanner-hub-pane-container";
  paneContainer.style.flex = "1";

  // Pane contents functions
  function renderStatsTab() {
    return `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <!-- Scoreboard Header -->
        <div style="display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; background: rgba(255,255,255,0.02); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--border-color); text-align: center;">
          <div style="display: flex; flex-direction: column; align-items: flex-end;">
            <span style="font-size: 1.6rem; margin-bottom: 4px;">${match.homeTeam.logo || '⚽'}</span>
            <span style="font-weight: 800; color: var(--text-primary); font-size: 1rem;">${match.homeTeam.name}</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 4px; padding: 0 20px;">
            <span style="font-size: 0.65rem; color: var(--danger); font-weight: 800; text-transform: uppercase; background: rgba(239,68,68,0.1); padding: 2px 6px; border-radius: 4px; display: inline-block; margin: 0 auto 4px;">${match.time}</span>
            <span style="font-size: 2.2rem; font-family: var(--font-display); font-weight: 900; color: var(--text-primary); letter-spacing: 2px;">
              ${homeScore} - ${awayScore}
            </span>
          </div>
          <div style="display: flex; flex-direction: column; align-items: flex-start;">
            <span style="font-size: 1.6rem; margin-bottom: 4px;">${match.awayTeam.logo || '⚽'}</span>
            <span style="font-weight: 800; color: var(--text-primary); font-size: 1rem;">${match.awayTeam.name}</span>
          </div>
        </div>

        <!-- Stats bars details -->
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <!-- Possession -->
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 6px; font-weight: 700;">
              <span>Possession Split</span>
              <span style="color: var(--text-primary);">${possessionH}% - ${possessionA}%</span>
            </div>
            <div class="scanner-stat-bar-bg" style="height: 12px; border-radius: 6px;">
              <div style="width: ${possessionH}%; height: 100%; background: var(--primary);"></div>
              <div style="width: ${possessionA}%; height: 100%; background: var(--secondary);"></div>
            </div>
          </div>

          <!-- Grid parameter fields -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 6px;">
            <div style="background: rgba(255,255,255,0.02); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">Attacks (Dangerous):</span>
              <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-primary);">${attH}(${dangerousAttH}) - ${attA}(${dangerousAttA})</span>
            </div>
            <div style="background: rgba(255,255,255,0.02); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">DA / Minute:</span>
              <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-primary);">${daMinH} - ${daMinA}</span>
            </div>
            <div style="background: rgba(255,255,255,0.02); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">Shots On (Off) Target:</span>
              <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-primary);">${shotsOnH}(${shotsOffH}) - ${shotsOnA}(${shotsOffA})</span>
            </div>
            <div style="background: rgba(255,255,255,0.02); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">Live Corner Kicks:</span>
              <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-primary);">${liveCornersH} - ${liveCornersA}</span>
            </div>
          </div>

          <!-- Pressure Index / Momentum -->
          <div style="background: rgba(245, 158, 11, 0.03); border: 1px solid rgba(245, 158, 11, 0.15); padding: 14px; border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 1.2rem;">🔥</span>
              <div>
                <div style="font-size: 0.75rem; font-weight: 700; color: var(--accent-gold);">Attack Pressure Momentum Index</div>
                <div style="font-size: 0.65rem; color: var(--text-muted);">Real-time algorithmic danger projection index</div>
              </div>
            </div>
            <span style="font-size: 1.15rem; font-weight: 900; font-family: var(--font-display); color: var(--accent-gold);">${momentumH} - ${momentumA}</span>
          </div>
        </div>
      </div>
    `;
  }

  function renderRulesTab() {
    if (rules.length === 0) {
      return `
        <div style="text-align: center; padding: 40px 20px; color: var(--text-muted); display: flex; flex-direction: column; align-items: center; gap: 10px;">
          <span style="font-size: 1.8rem;">🛡️</span>
          <span style="font-size: 0.85rem; font-weight: 600;">No active custom Scanner Rules defined.</span>
          <span style="font-size: 0.72rem;">Add in-play rule triggers in the panel below the Live Scanner list to monitor this game.</span>
        </div>
      `;
    }

    const items = ruleResults.map(res => {
      const color = res.satisfied ? 'var(--success)' : 'var(--text-muted)';
      const badgeColor = res.satisfied ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.03)';
      const border = res.satisfied ? '1px solid rgba(16,185,129,0.25)' : '1px solid var(--border-color)';
      
      return `
        <div style="background: ${badgeColor}; border: ${border}; border-radius: var(--radius-md); padding: 14px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <div>
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-primary);">${res.ruleLabel}</div>
            <div style="font-size: 0.7rem; color: var(--text-secondary); margin-top: 4px;">Live Value check: <b style="color: var(--text-primary);">${res.actualLabel}</b></div>
          </div>
          <span style="font-size: 0.75rem; font-weight: 800; color: ${color}; text-transform: uppercase; display: flex; align-items: center; gap: 4px;">
            ${res.satisfied ? '<span>✅ Matched</span>' : '<span>❌ Unmet</span>'}
          </span>
        </div>
      `;
    }).join("");

    return `
      <div>
        <h4 style="font-family: var(--font-display); font-size: 0.95rem; margin-bottom: 12px; color: var(--text-primary); font-weight: 700;">Live Scan Rule Trigger Statuses:</h4>
        ${items}
      </div>
    `;
  }

  function renderBriefTab() {
    return `
      <div style="display: flex; flex-direction: column; gap: 14px;">
        <h4 style="font-family: var(--font-display); font-size: 0.95rem; color: var(--text-primary); font-weight: 700; border-bottom: 1px dashed var(--border-color); padding-bottom: 6px; margin: 0;">
          🧠 Master AI Scout In-Play Briefing
        </h4>
        <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin: 0; background: rgba(255,255,255,0.01); border: 1px solid var(--border-color); padding: 14px; border-radius: var(--radius-md);">
          ${match.aiAnalysis || "No custom tactical scouting briefing available for this live match right now."}
        </p>
        <div style="background: rgba(26,104,219,0.03); border: 1px solid rgba(26,104,219,0.15); padding: 12px; border-radius: var(--radius-sm); font-size: 0.72rem; color: var(--text-muted); line-height: 1.4;">
          💡 <b>Scout Insight:</b> ${match.insight || "Keep close eye on attack momentum trends."}
        </div>
      </div>
    `;
  }

  // Setup tab switcher render
  function updatePane(tabName) {
    if (tabName === 'stats') {
      paneContainer.innerHTML = renderStatsTab();
    } else if (tabName === 'rules') {
      paneContainer.innerHTML = renderRulesTab();
    } else if (tabName === 'brief') {
      paneContainer.innerHTML = renderBriefTab();
    }
  }

  // Assemble base structure
  content.innerHTML = headerHtml + tabSwitcherHtml;
  content.appendChild(paneContainer);
  modal.appendChild(content);
  document.body.appendChild(modal);

  // Initial content render
  updatePane(defaultTab);

  // Register interactive events for tab switching
  const btnStats = modal.querySelector("#sc-tab-btn-stats");
  const btnRules = modal.querySelector("#sc-tab-btn-rules");
  const btnBrief = modal.querySelector("#sc-tab-btn-brief");
  const btnClose = modal.querySelector("#close-scanner-hub-btn");

  const switchActiveBtn = (activeBtn) => {
    [btnStats, btnRules, btnBrief].forEach(btn => btn.classList.remove("active"));
    activeBtn.classList.add("active");
  };

  btnStats.onclick = () => {
    switchActiveBtn(btnStats);
    updatePane('stats');
  };
  btnRules.onclick = () => {
    switchActiveBtn(btnRules);
    updatePane('rules');
  };
  btnBrief.onclick = () => {
    switchActiveBtn(btnBrief);
    updatePane('brief');
  };

  const closeFn = () => {
    document.body.removeChild(modal);
  };
  btnClose.onclick = closeFn;

  // Clicking outside close handler
  modal.onclick = (e) => {
    if (e.target === modal) closeFn();
  };
}
// Close scout modal handler
function closeScoutModal(event) {
  // Only close if clicking the actual overlay, not the content
  if (event.target === document.getElementById("scout-modal")) {
    triggerCloseScoutModal();
  }
}

function triggerCloseScoutModal() {
  const modal = document.getElementById("scout-modal");
  if (modal) {
    modal.classList.remove("active");
  }
  document.body.style.overflow = ""; // Re-enable background scroll
}

// Helper to smooth scroll to premium section and glow it
function smoothScrollToPremium() {
  const premiumSec = document.getElementById("premium");
  if (premiumSec) {
    premiumSec.scrollIntoView({ behavior: 'smooth' });
  }
}

// Render Sidebar Country Accordion List
function renderSidebarDirectory() {
  const container = document.getElementById("sidebar-accordion-list");
  if (!container) return;
  container.innerHTML = "";

  const query = (document.getElementById("sidebar-search-input")?.value || "").toLowerCase().trim();

  const countryData = (typeof COUNTRY_LEAGUES_DATA !== 'undefined' ? COUNTRY_LEAGUES_DATA : window.COUNTRY_LEAGUES_DATA) || [
    { country: "England", emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", leagues: ["Premier League", "Championship", "League One", "League Two", "FA Cup", "EFL Cup"] },
    { country: "Spain", emoji: "🇪🇸", leagues: ["La Liga", "La Liga 2", "Copa del Rey"] },
    { country: "Germany", emoji: "🇩🇪", leagues: ["Bundesliga", "2. Bundesliga", "DFB-Pokal"] },
    { country: "Italy", emoji: "🇮🇹", leagues: ["Serie A", "Serie B", "Coppa Italia"] },
    { country: "France", emoji: "🇫🇷", leagues: ["Ligue 1", "Ligue 2", "Coupe de France"] },
    { country: "Netherlands", emoji: "🇳🇱", leagues: ["Eredivisie", "KNVB Cup"] },
    { country: "Portugal", emoji: "🇵🇹", leagues: ["Primeira Liga", "Taça de Portugal"] },
    { country: "Turkey", emoji: "🇹🇷", leagues: ["Süper Lig", "Turkish Cup"] },
    { country: "Nigeria", emoji: "🇳🇬", leagues: ["NPFL", "Federation Cup"] },
    { country: "USA", emoji: "🇺🇸", leagues: ["MLS", "US Open Cup"] },
    { country: "World", emoji: "🌎", leagues: ["World Cup", "Champions League", "Europa League", "AFCON"] }
  ];

  // Iterate over countryData
  countryData.forEach((item, index) => {
    // Filter by search query if present
    const matchesCountry = item.country.toLowerCase().includes(query);
    const matchingLeagues = item.leagues.filter(l => l.toLowerCase().includes(query));

    if (query && !matchesCountry && matchingLeagues.length === 0) {
      return; // Skip if no match
    }

    const accordion = document.createElement("div");
    accordion.className = "country-accordion-item";

    const isExpanded = query ? true : false; // Auto expand if searching

    accordion.innerHTML = `
      <button class="country-accordion-header" onclick="toggleSidebarAccordion(${index}, this)">
        <span style="display: flex; align-items: center; gap: 8px;">
          <span>${item.emoji}</span>
          <span>${item.country}</span>
        </span>
        <span class="caret" style="transition: transform 0.2s; font-size: 0.6rem; transform: ${isExpanded ? 'rotate(180deg)' : 'rotate(0)'};">▼</span>
      </button>
      <div class="country-accordion-content" style="max-height: ${isExpanded ? '500px' : '0'};">
        ${item.leagues.map(league => {
          return `
            <button class="sidebar-league-btn" onclick="selectSidebarLeague('${league.replace(/'/g, "\\'")}', this)">
              ⚽ ${league}
            </button>
          `;
        }).join("")}
      </div>
    `;

    container.appendChild(accordion);
  });
}

// Toggle country accordion in right sidebar
function toggleSidebarAccordion(index, header) {
  const content = header.nextElementSibling;
  const caret = header.querySelector(".caret");
  
  const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';

  // Close all others first for clean accordion behavior
  const allContents = document.querySelectorAll("#sidebar-accordion-list .country-accordion-content");
  const allCarets = document.querySelectorAll("#sidebar-accordion-list .caret");
  const allHeaders = document.querySelectorAll("#sidebar-accordion-list .country-accordion-header");

  allContents.forEach(c => c.style.maxHeight = '0px');
  allCarets.forEach(cr => cr.style.transform = 'rotate(0)');
  allHeaders.forEach(h => h.classList.remove("active"));

  if (!isOpen) {
    header.classList.add("active");
    content.style.maxHeight = "500px";
    if (caret) caret.style.transform = "rotate(180deg)";
  }
}

// Filter matches by selected league from sidebar
function selectSidebarLeague(leagueName, btn) {
  // Update active state of sidebar buttons
  const allLeagueBtns = document.querySelectorAll("#sidebar-accordion-list .sidebar-league-btn");
  allLeagueBtns.forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  // Load matches matching this league in Matches Dashboard
  const title = document.getElementById("matches-section-title");
  if (title) {
    title.innerText = `${leagueName} Predictions`;
  }

  // Filter fixtures-grid match cards
  const allCards = document.querySelectorAll("#fixtures-grid .match-card");
  let found = 0;

  allCards.forEach(card => {
    const badge = card.querySelector(".league-badge");
    if (badge && badge.innerText.includes(leagueName)) {
      card.style.display = "block";
      found++;
    } else {
      card.style.display = "none";
    }
  });

  // If no match cards correspond to this league, display matches or locked state
  if (found === 0) {
    const grid = document.getElementById("fixtures-grid");
    if (grid) {
      if (window.appState.premiumUnlocked) {
        // Render mock matches for this unlocked league!
        grid.innerHTML = "";
        
        // Generate mock matches for this league
        const mockMatches = [
          {
            id: `mock-${leagueName.toLowerCase().replace(/\s+/g, '-')}-1`,
            league: leagueName,
            leagueEmoji: "🇫🇷",
            time: "Today, 19:00",
            isLive: false,
            homeTeam: { name: "Metz", logo: "🟤", form: ["W", "D", "W", "L", "W"] },
            awayTeam: { name: "Lorient", logo: "🟠", form: ["L", "W", "D", "W", "D"] },
            predictions: { home: 45, draw: 30, away: 25 },
            confidenceVal: 78,
            topTips: ["uo15", "uo25", "c75"]
          },
          {
            id: `mock-${leagueName.toLowerCase().replace(/\s+/g, '-')}-2`,
            league: leagueName,
            leagueEmoji: "🇫🇷",
            time: "Today, 20:45",
            isLive: false,
            homeTeam: { name: "Auxerre", logo: "🔵", form: ["W", "W", "W", "D", "L"] },
            awayTeam: { name: "Angers", logo: "⚫⚪", form: ["D", "W", "L", "W", "W"] },
            predictions: { home: 50, draw: 28, away: 22 },
            confidenceVal: 82,
            topTips: ["uo15", "uo25", "c85"]
          }
        ];
        
        mockMatches.forEach(match => {
          const item = document.createElement("div");
          item.className = "match-card";
          item.id = match.id;
          
          // Calculate stats parameters
          const hashStr = (match.homeTeam.name + match.awayTeam.name);
          let hash = 0;
          for (let i = 0; i < hashStr.length; i++) {
            hash = hashStr.charCodeAt(i) + ((hash << 5) - hash);
          }
          const seed = Math.abs(hash);

          const avgScored = parseFloat((1.0 + (seed % 19) * 0.1).toFixed(1));
          const avgConceded = parseFloat((0.6 + ((seed >> 2) % 17) * 0.1).toFixed(1));
          const avgXG = parseFloat((0.8 + ((seed >> 4) % 18) * 0.1).toFixed(1));
          const corners = parseFloat((7.5 + ((seed >> 6) % 9) * 0.5).toFixed(1));

          const homeFormVal = match.homeTeam.form ? match.homeTeam.form.reduce((sum, val) => sum + (val === 'W' ? 20 : val === 'D' ? 10 : 0), 0) : 60;
          const awayFormVal = match.awayTeam.form ? match.awayTeam.form.reduce((sum, val) => sum + (val === 'W' ? 20 : val === 'D' ? 10 : 0), 0) : 50;
          const avgForm = Math.round((homeFormVal + awayFormVal) / 2);

          item.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span class="league-badge" style="background: rgba(26,104,219,0.06); border: 1px solid rgba(26,104,219,0.12); border-radius: var(--radius-sm); color: var(--primary); font-size: 0.75rem; padding: 2px 6px; font-weight: 700;">
                ${match.leagueEmoji} ${match.league}
              </span>
              <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">${match.time}</span>
            </div>
            
            <div style="display: flex; align-items: center; justify-content: space-between; margin: 12px 0;">
              <div style="display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 0.95rem;">
                <span>${match.homeTeam.logo}</span>
                <span>${match.homeTeam.name}</span>
              </div>
              <span style="font-weight: 800; color: var(--primary); font-size: 1.15rem;">vs</span>
              <div style="display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 0.95rem; flex-direction: row-reverse;">
                <span>${match.awayTeam.logo}</span>
                <span>${match.awayTeam.name}</span>
              </div>
            </div>

            <!-- Statistical Parameters Badges -->
            <div style="display: flex; flex-wrap: wrap; gap: 6px; margin: 10px 0; border-top: 1px dashed var(--border-color); padding-top: 8px;">
              <span style="font-size: 0.68rem; padding: 2px 6px; background: rgba(26,104,219,0.06); border: 1px solid rgba(26,104,219,0.12); border-radius: var(--radius-sm); color: var(--primary); font-weight: 600;">
                📈 Form: ${avgForm}%
              </span>
              <span style="font-size: 0.68rem; padding: 2px 6px; background: rgba(16,185,129,0.06); border: 1px solid rgba(16,185,129,0.12); border-radius: var(--radius-sm); color: var(--secondary); font-weight: 600;">
                ⚽ Goals: ${avgScored.toFixed(1)} / ${avgConceded.toFixed(1)}
              </span>
              <span style="font-size: 0.68rem; padding: 2px 6px; background: rgba(245,158,11,0.06); border: 1px solid rgba(245,158,11,0.12); border-radius: var(--radius-sm); color: var(--accent-gold); font-weight: 600;">
                🧠 xG: ${avgXG.toFixed(1)}
              </span>
              <span style="font-size: 0.68rem; padding: 2px 6px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: var(--radius-sm); color: var(--text-secondary); font-weight: 600;">
                📐 Corners: ${corners}
              </span>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; border-top: 1px solid var(--border-color); padding-top: 10px; margin-top: 10px;">
              <span>Tip: <b>${getMatchTip(match)}</b></span>
              <span style="font-weight: 700; color: var(--secondary);">Confidence: ${match.confidenceVal}%</span>
            </div>
          `;
          grid.appendChild(item);
        });
      } else {
        grid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted); background: rgba(0, 0, 0, 0.15); border: 1px solid var(--border-color); border-radius: var(--radius-md);">
            <div style="font-size: 2rem; margin-bottom: 12px;">👑</div>
            <h4 style="font-family: var(--font-display); font-size: 1rem; color: var(--text-primary); margin-bottom: 6px;">Pro League Analysis Locked</h4>
            <p style="font-size: 0.8rem; margin-bottom: 16px; max-width: 320px; margin-left: auto; margin-right: auto;">Mathematical simulations for <b>${leagueName}</b> are completed. Unlock Pro Pass to show today's picks.</p>
            <a href="#premium" class="btn btn-premium" style="display: inline-block; font-size: 0.8rem; padding: 8px 16px;" onclick="unlockPremiumPlanLigue2('${leagueName}', this)">Unlock ${leagueName} Predictions</a>
          </div>
        `;
      }
    }
  }
}

// Search filter for sidebar countries & leagues
function filterSidebarCountries() {
  renderSidebarDirectory();
}

// Open AI Scout Modal for a specific club
function openClubScoutModal(clubName) {
  const modal = document.getElementById("scout-modal");
  if (!modal) return;

  const club = GLOBAL_CLUBS.find(c => c.name === clubName);
  if (!club) return;

  // Set active context in global state
  window.appState.activeScoutMatchId = null;
  window.appState.activeScoutClubName = clubName;

  // Update modal titles
  const modalTitle = document.getElementById("scout-modal-title");
  if (modalTitle) {
    modalTitle.innerText = `Scouting: ${club.name} (${club.country})`;
  }

  const winRate = ((club.wins / club.matchesPlayed) * 100).toFixed(0);

  // Clear chat log and render initial system greeting
  const chatBody = document.getElementById("scout-chat-body");
  if (chatBody) {
    chatBody.innerHTML = `
      <div class="chat-bubble scout">
        Hello! I am your <b>DeepPredict Scout</b>. Here is my strategic overview for <b>${club.name}</b> competing in the <b>${club.league}</b>:
        
        <div class="scout-match-summary">
          <div class="scout-sum-row">
            <span>Country</span>
            <span>${club.flag} ${club.country}</span>
          </div>
          <div class="scout-sum-row">
            <span>Season Record (W-D-L)</span>
            <span>${club.wins}W - ${club.draws}D - ${club.losses}L</span>
          </div>
          <div class="scout-sum-row">
            <span>Overall Win Rate</span>
            <span>${winRate}%</span>
          </div>
          <div class="scout-sum-prediction" style="color: var(--secondary);">
            <span>Tactical Assessment</span>
            <span>${winRate >= 65 ? 'Elite Attacking Form' : (winRate >= 50 ? 'Strong Contender' : 'Mid-table Spacing')}</span>
          </div>
        </div>
        
        <p style="margin-top: 10px;"><b>Model Insight:</b> ${club.name} exhibits a high transition score. Their home match win-probability is currently simulated at <b>${(parseFloat(winRate) * 1.1).toFixed(0)}%</b> in matches against bottom-half opponents.</p>
        <p style="margin-top: 10px; font-style: italic; font-size: 0.85rem; color: var(--text-muted);">Ask me questions like: "What is their tactical setup?" or "What are their odds averages?"</p>
      </div>
    `;
  }

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

// Expose ui.js functions globally
window.closeLeaderboardModal = closeLeaderboardModal;
window.closeProfileModal = closeProfileModal;
window.closeScoutModal = closeScoutModal;
window.closeStoreModal = closeStoreModal;
window.closeSupportModal = closeSupportModal;
window.openGeneralScout = openGeneralScout;
window.openLeaderboardModal = openLeaderboardModal;
window.openProfileModal = openProfileModal;
window.openScoutModal = openScoutModal;
window.openStoreModal = openStoreModal;
window.openSupportModal = openSupportModal;
window.switchInlineLeadTab = switchInlineLeadTab;
window.switchInlineStoreTab = switchInlineStoreTab;
window.switchInlineUserTab = switchInlineUserTab;
window.switchLeadTab = switchLeadTab;
window.switchModalTab = switchModalTab;
window.switchProfileTab = switchProfileTab;
window.switchScannerMode = switchScannerMode;
window.switchStoreTab = switchStoreTab;
window.switchSupportTab = switchSupportTab;
window.switchTool = switchTool;

function triggerHeroScoutPrompt() {
  const heroInput = document.getElementById("hero-scout-input");
  if (!heroInput || !heroInput.value.trim()) return;

  const text = heroInput.value.trim();
  heroInput.value = "";

  if (typeof openGeneralScout === 'function') openGeneralScout();

  setTimeout(() => {
    const scoutInput = document.getElementById("scout-chat-input");
    if (scoutInput) {
      scoutInput.value = text;
      if (typeof sendScoutMessage === 'function') sendScoutMessage();
    }
  }, 350);
}

function quickPromptScout(promptText) {
  if (typeof openGeneralScout === 'function') openGeneralScout();

  setTimeout(() => {
    const scoutInput = document.getElementById("scout-chat-input");
    if (scoutInput) {
      scoutInput.value = promptText;
      if (typeof sendScoutMessage === 'function') sendScoutMessage();
    }
  }, 350);
}

window.triggerHeroScoutPrompt = triggerHeroScoutPrompt;
window.quickPromptScout = quickPromptScout;
window.smoothScrollToPremium = smoothScrollToPremium;

function showAppNotification(msg, type = 'info') {
  if (window.showAppNotificationImpl && typeof window.showAppNotificationImpl === 'function') {
    return window.showAppNotificationImpl(msg, type);
  }
  let toast = document.getElementById('global-app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-app-toast';
    toast.style.cssText = 'position:fixed;bottom:24px;right:24px;background:rgba(15,23,42,0.95);color:#fff;border:1px solid #3b82f6;padding:12px 20px;border-radius:10px;font-family:sans-serif;font-size:0.9rem;font-weight:600;box-shadow:0 10px 25px rgba(0,0,0,0.5);z-index:99999;transition:all 0.3s ease;transform:translateY(100px);opacity:0;';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.transform = 'translateY(0)';
  toast.style.opacity = '1';
  setTimeout(() => {
    toast.style.transform = 'translateY(100px)';
    toast.style.opacity = '0';
  }, 3500);
}

function showToast(msg, type = 'info') {
  showAppNotification(msg, type);
}



// Render match cards dynamically

// Auto-Export Window Bindings for ui.js
try { if (typeof buyCoinsInline === 'function') window.buyCoinsInline = buyCoinsInline; } catch (e) {}
try { if (typeof claimDailyRewardInline === 'function') window.claimDailyRewardInline = claimDailyRewardInline; } catch (e) {}
try { if (typeof claimDailyRewardNav === 'function') window.claimDailyRewardNav = claimDailyRewardNav; } catch (e) {}
try { if (typeof closeLeaderboardModal === 'function') window.closeLeaderboardModal = closeLeaderboardModal; } catch (e) {}
try { if (typeof closeProfileModal === 'function') window.closeProfileModal = closeProfileModal; } catch (e) {}
try { if (typeof closeScoutModal === 'function') window.closeScoutModal = closeScoutModal; } catch (e) {}
try { if (typeof closeStoreModal === 'function') window.closeStoreModal = closeStoreModal; } catch (e) {}
try { if (typeof closeSupportModal === 'function') window.closeSupportModal = closeSupportModal; } catch (e) {}
try { if (typeof copyDailyTipOdds === 'function') window.copyDailyTipOdds = copyDailyTipOdds; } catch (e) {}
try { if (typeof filterSidebarCountries === 'function') window.filterSidebarCountries = filterSidebarCountries; } catch (e) {}
try { if (typeof filterSidebarTopLeagues === 'function') window.filterSidebarTopLeagues = filterSidebarTopLeagues; } catch (e) {}
try { if (typeof getMatchTip === 'function') window.getMatchTip = getMatchTip; } catch (e) {}
try { if (typeof onFilterMarketChange === 'function') window.onFilterMarketChange = onFilterMarketChange; } catch (e) {}
try { if (typeof openClubScoutModal === 'function') window.openClubScoutModal = openClubScoutModal; } catch (e) {}
try { if (typeof openGeneralScout === 'function') window.openGeneralScout = openGeneralScout; } catch (e) {}
try { if (typeof openLeaderboardModal === 'function') window.openLeaderboardModal = openLeaderboardModal; } catch (e) {}
try { if (typeof openLeaguePreviewHub === 'function') window.openLeaguePreviewHub = openLeaguePreviewHub; } catch (e) {}
try { if (typeof openLiveScannerHub === 'function') window.openLiveScannerHub = openLiveScannerHub; } catch (e) {}
try { if (typeof openProfileModal === 'function') window.openProfileModal = openProfileModal; } catch (e) {}
try { if (typeof openScoutModal === 'function') window.openScoutModal = openScoutModal; } catch (e) {}
try { if (typeof openStoreModal === 'function') window.openStoreModal = openStoreModal; } catch (e) {}
try { if (typeof openSupportModal === 'function') window.openSupportModal = openSupportModal; } catch (e) {}
try { if (typeof purchaseCoins === 'function') window.purchaseCoins = purchaseCoins; } catch (e) {}
try { if (typeof quickPromptScout === 'function') window.quickPromptScout = quickPromptScout; } catch (e) {}
try { if (typeof redeemVoucherCode === 'function') window.redeemVoucherCode = redeemVoucherCode; } catch (e) {}
try { if (typeof redeemVoucherInline === 'function') window.redeemVoucherInline = redeemVoucherInline; } catch (e) {}
try { if (typeof renderAccuracyChart === 'function') window.renderAccuracyChart = renderAccuracyChart; } catch (e) {}
try { if (typeof renderAdvancedTeamStats === 'function') window.renderAdvancedTeamStats = renderAdvancedTeamStats; } catch (e) {}
try { if (typeof renderBriefTab === 'function') window.renderBriefTab = renderBriefTab; } catch (e) {}
try { if (typeof renderDailyBets === 'function') window.renderDailyBets = renderDailyBets; } catch (e) {}
try { if (typeof renderH2HHistory === 'function') window.renderH2HHistory = renderH2HHistory; } catch (e) {}
try { if (typeof renderInlineLeaderboardList === 'function') window.renderInlineLeaderboardList = renderInlineLeaderboardList; } catch (e) {}
try { if (typeof renderInlineSavedTickets === 'function') window.renderInlineSavedTickets = renderInlineSavedTickets; } catch (e) {}
try { if (typeof renderLeaderboardList === 'function') window.renderLeaderboardList = renderLeaderboardList; } catch (e) {}
try { if (typeof renderLeagueStatsLedger === 'function') window.renderLeagueStatsLedger = renderLeagueStatsLedger; } catch (e) {}
try { if (typeof renderLiveScanner === 'function') window.renderLiveScanner = renderLiveScanner; } catch (e) {}
try { if (typeof renderMatchCards === 'function') window.renderMatchCards = renderMatchCards; } catch (e) {}
try { if (typeof renderOddsComparison === 'function') window.renderOddsComparison = renderOddsComparison; } catch (e) {}
try { if (typeof renderOddsTab === 'function') window.renderOddsTab = renderOddsTab; } catch (e) {}
try { if (typeof renderPredictionsTab === 'function') window.renderPredictionsTab = renderPredictionsTab; } catch (e) {}
try { if (typeof renderPrematchScanner === 'function') window.renderPrematchScanner = renderPrematchScanner; } catch (e) {}
try { if (typeof renderProfileSavedTickets === 'function') window.renderProfileSavedTickets = renderProfileSavedTickets; } catch (e) {}
try { if (typeof renderResultsTab === 'function') window.renderResultsTab = renderResultsTab; } catch (e) {}
try { if (typeof renderRulesTab === 'function') window.renderRulesTab = renderRulesTab; } catch (e) {}
try { if (typeof renderSidebarDirectory === 'function') window.renderSidebarDirectory = renderSidebarDirectory; } catch (e) {}
try { if (typeof renderSidebarTopLeagues === 'function') window.renderSidebarTopLeagues = renderSidebarTopLeagues; } catch (e) {}
try { if (typeof renderStatsTab === 'function') window.renderStatsTab = renderStatsTab; } catch (e) {}
try { if (typeof renderTopTipsTool === 'function') window.renderTopTipsTool = renderTopTipsTool; } catch (e) {}
try { if (typeof renderTrends === 'function') window.renderTrends = renderTrends; } catch (e) {}
try { if (typeof renderValueBetBot === 'function') window.renderValueBetBot = renderValueBetBot; } catch (e) {}
try { if (typeof scoutLeagueClubs === 'function') window.scoutLeagueClubs = scoutLeagueClubs; } catch (e) {}
try { if (typeof selectSidebarLeague === 'function') window.selectSidebarLeague = selectSidebarLeague; } catch (e) {}
try { if (typeof showAppNotification === 'function') window.showAppNotification = showAppNotification; } catch (e) {}
try { if (typeof showMockTableStandings === 'function') window.showMockTableStandings = showMockTableStandings; } catch (e) {}
try { if (typeof showToast === 'function') window.showToast = showToast; } catch (e) {}
try { if (typeof smoothScrollToPremium === 'function') window.smoothScrollToPremium = smoothScrollToPremium; } catch (e) {}
try { if (typeof submitSupportTicket === 'function') window.submitSupportTicket = submitSupportTicket; } catch (e) {}
try { if (typeof submitSupportTicketInline === 'function') window.submitSupportTicketInline = submitSupportTicketInline; } catch (e) {}
try { if (typeof switchInlineLeadTab === 'function') window.switchInlineLeadTab = switchInlineLeadTab; } catch (e) {}
try { if (typeof switchInlineStoreTab === 'function') window.switchInlineStoreTab = switchInlineStoreTab; } catch (e) {}
try { if (typeof switchInlineUserTab === 'function') window.switchInlineUserTab = switchInlineUserTab; } catch (e) {}
try { if (typeof switchLeadTab === 'function') window.switchLeadTab = switchLeadTab; } catch (e) {}
try { if (typeof switchModalTab === 'function') window.switchModalTab = switchModalTab; } catch (e) {}
try { if (typeof switchProfileTab === 'function') window.switchProfileTab = switchProfileTab; } catch (e) {}
try { if (typeof switchScannerMode === 'function') window.switchScannerMode = switchScannerMode; } catch (e) {}
try { if (typeof switchStoreTab === 'function') window.switchStoreTab = switchStoreTab; } catch (e) {}
try { if (typeof switchSupportTab === 'function') window.switchSupportTab = switchSupportTab; } catch (e) {}
try { if (typeof switchTool === 'function') window.switchTool = switchTool; } catch (e) {}
try { if (typeof switchTopTipsToolMarket === 'function') window.switchTopTipsToolMarket = switchTopTipsToolMarket; } catch (e) {}
try { if (typeof toggleCheckboxCard === 'function') window.toggleCheckboxCard = toggleCheckboxCard; } catch (e) {}
try { if (typeof toggleFAQCollapse === 'function') window.toggleFAQCollapse = toggleFAQCollapse; } catch (e) {}
try { if (typeof toggleFollowPunter === 'function') window.toggleFollowPunter = toggleFollowPunter; } catch (e) {}
try { if (typeof toggleFollowPunterInline === 'function') window.toggleFollowPunterInline = toggleFollowPunterInline; } catch (e) {}
try { if (typeof toggleSidebarAccordion === 'function') window.toggleSidebarAccordion = toggleSidebarAccordion; } catch (e) {}
try { if (typeof toggleSidebarTopLeaguesAccordion === 'function') window.toggleSidebarTopLeaguesAccordion = toggleSidebarTopLeaguesAccordion; } catch (e) {}
try { if (typeof triggerCloseScoutModal === 'function') window.triggerCloseScoutModal = triggerCloseScoutModal; } catch (e) {}
try { if (typeof triggerHeroScoutPrompt === 'function') window.triggerHeroScoutPrompt = triggerHeroScoutPrompt; } catch (e) {}
try { if (typeof updatePane === 'function') window.updatePane = updatePane; } catch (e) {}
try { if (typeof updateStoreBalanceDisplay === 'function') window.updateStoreBalanceDisplay = updateStoreBalanceDisplay; } catch (e) {}
try { if (typeof viewLeagueStatisticsLedger === 'function') window.viewLeagueStatisticsLedger = viewLeagueStatisticsLedger; } catch (e) {}




// --- FAIL-SAFE MOBILE NAVIGATION DRAWER CONTROLLER ---
function toggleMobileDrawer() {
  var drawer = document.getElementById("mobile-nav-drawer");
  var overlay = document.getElementById("mobile-drawer-overlay");
  if (!drawer || !overlay) {
    console.error("Drawer or Overlay element not found");
    return;
  }

  var isOpen = drawer.classList.contains("open") || drawer.style.left === "0px";
  if (isOpen) {
    drawer.classList.remove("open");
    drawer.style.left = "-340px";
    overlay.style.opacity = "0";
    setTimeout(function() { overlay.style.display = "none"; }, 300);
    document.body.style.overflow = "";
  } else {
    overlay.style.display = "block";
    drawer.classList.add("open");
    setTimeout(function() { overlay.style.opacity = "1"; }, 10);
    drawer.style.left = "0px";
    document.body.style.overflow = "hidden";
  }
}
window.toggleMobileDrawer = toggleMobileDrawer;

function toggleMobileAccordion(accId) {
  var target = document.getElementById(accId);
  var icon = document.getElementById(accId + "-icon");
  if (!target) return;

  var isHidden = target.style.display === "none" || target.style.display === "";
  if (isHidden) {
    target.style.display = "flex";
    if (icon) icon.style.transform = "rotate(180deg)";
  } else {
    target.style.display = "none";
    if (icon) icon.style.transform = "rotate(0deg)";
  }
}
window.toggleMobileAccordion = toggleMobileAccordion;


/* --- DEEPPREDICT MACHINE TICKET GENERATOR & SLIDER HELPERS --- */
function updateOddsSliderVal(val) {
  const display = document.getElementById("odds-range-val");
  if (display) {
    display.innerText = `1.20 - ${parseFloat(val).toFixed(2)}`;
  }
}

function updateProbSliderVal(val) {
  const display = document.getElementById("prob-range-val");
  if (display) {
    display.innerText = `[${val}% - 100%]`;
  }
}

function openBetslipDrawerMobile() {
  const drawer = document.getElementById("floating-betslip-drawer");
  if (drawer) drawer.classList.add("open");
}
window.openBetslipDrawerMobile = openBetslipDrawerMobile;



function generateMachineTicket() {
  try {
    console.log("generateMachineTicket triggered!");
    
    // 1. Resolve dataset robustly
    let matchesSource = [];
    if (typeof MATCH_DATA !== 'undefined' && Array.isArray(MATCH_DATA) && MATCH_DATA.length > 0) {
      matchesSource = MATCH_DATA;
    } else if (window.MATCH_DATA && Array.isArray(window.MATCH_DATA) && window.MATCH_DATA.length > 0) {
      matchesSource = window.MATCH_DATA;
    } else if (window.MATCHES_DATA && Array.isArray(window.MATCHES_DATA) && window.MATCHES_DATA.length > 0) {
      matchesSource = window.MATCHES_DATA;
    } else {
      matchesSource = [
        { id: "m1", homeTeam: { name: "Arsenal" }, awayTeam: { name: "Man City" }, league: "Premier League", leagueEmoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
        { id: "m2", homeTeam: { name: "Real Madrid" }, awayTeam: { name: "Barcelona" }, league: "La Liga", leagueEmoji: "🇪🇸" },
        { id: "m3", homeTeam: { name: "Bayern Munich" }, awayTeam: { name: "Dortmund" }, league: "Bundesliga", leagueEmoji: "🇩🇪" },
        { id: "m4", homeTeam: { name: "Inter Milan" }, awayTeam: { name: "AC Milan" }, league: "Serie A", leagueEmoji: "🇮🇹" },
        { id: "m5", homeTeam: { name: "PSG" }, awayTeam: { name: "Marseille" }, league: "Ligue 1", leagueEmoji: "🇫🇷" },
        { id: "m6", homeTeam: { name: "Liverpool" }, awayTeam: { name: "Man Utd" }, league: "Premier League", leagueEmoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" }
      ];
    }

    // 2. Resolve match count
    const countEl = document.getElementById("machine-match-count");
    const rawVal = countEl ? countEl.value : "4";
    const count = parseInt(rawVal) || 4;
    const matchCount = Math.min(Math.max(count, 1), 40);

    // 3. Resolve max odds slider
    const maxOddsEl = document.getElementById("odds-max-slider");
    const maxOddsCap = maxOddsEl ? parseFloat(maxOddsEl.value) || 2.40 : 2.40;

    // 4. Market options pool
    const marketOptions = [
      "Home Win (1)", "Over 1.5 Goals", "Both Teams To Score (BTTS)",
      "Double Chance (1X)", "Away Win (2)", "Under 3.5 Goals", "Over 2.5 Goals", "Draw No Bet (1)"
    ];

    const ticketItems = [];
    let totalOdds = 1.0;

    if (!window.appState) window.appState = {};
    window.appState.betslip = [];

    // Helper to safely extract team names whether object or string
    function parseTeamName(t, defaultName) {
      if (!t) return defaultName;
      if (typeof t === 'string') return t;
      if (typeof t === 'object' && t.name) return t.name;
      return defaultName;
    }

    for (let i = 0; i < matchCount; i++) {
      const match = matchesSource[i % matchesSource.length] || {};
      const homeName = parseTeamName(match.homeTeam, "Home Team");
      const awayName = parseTeamName(match.awayTeam, "Away Team");
      const tip = marketOptions[i % marketOptions.length];
      
      const seed = (homeName.length + awayName.length + i * 7);
      const oddsRaw = 1.25 + (seed % 15) * 0.08;
      const odds = parseFloat(Math.min(oddsRaw, maxOddsCap).toFixed(2));
      
      totalOdds *= odds;

      const cycle = Math.floor(i / matchesSource.length);
      const homeSuffix = cycle > 0 ? ` [R${cycle + 1}]` : '';
      const awaySuffix = cycle > 0 ? ` [R${cycle + 1}]` : '';

      const item = {
        matchId: `mach-${i}-${match.id || i}`,
        homeTeam: homeName + homeSuffix,
        awayTeam: awayName + awaySuffix,
        league: match.league || "Global League",
        leagueEmoji: match.leagueEmoji || "⚽",
        tip: tip,
        odds: odds
      };

      ticketItems.push(item);

      window.appState.betslip.push({
        matchId: item.matchId,
        match: {
          ...match,
          homeTeam: { name: item.homeTeam },
          awayTeam: { name: item.awayTeam }
        },
        tip: tip,
        odds: odds
      });
    }

    // 5. Generate Booking Code
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let randomCode = "";
    for (let c = 0; c < 5; c++) {
      randomCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const bookingCode = `DP-${randomCode}`;

    // 6. RENDER TICKET BODY INTO DEEPPREDICT MACHINE TICKET CARD
    const bodyContainers = document.querySelectorAll("#ticket-body-container");
    let html = "";
    ticketItems.forEach((item) => {
      html += `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: rgba(255,255,255,0.04); border: 1px solid var(--border-color); border-radius: var(--radius-sm); margin-bottom: 8px; text-align: left;">
          <div>
            <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;">${item.leagueEmoji} ${item.league}</div>
            <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-primary); margin: 2px 0;">${item.homeTeam} vs ${item.awayTeam}</div>
            <div style="font-size: 0.75rem; color: #60a5fa; font-weight: 600;">Prediction: ${item.tip}</div>
          </div>
          <div style="font-size: 1.05rem; font-weight: 800; color: var(--secondary); font-family: var(--font-display);">@${item.odds.toFixed(2)}</div>
        </div>
      `;
    });

    bodyContainers.forEach(container => {
      container.innerHTML = html;
    });

    // 7. SHOW FOOTER & UPDATE CODES & ODDS
    const footerContainers = document.querySelectorAll("#ticket-footer-container");
    footerContainers.forEach(footer => {
      footer.style.display = "flex";
    });

    const codeDisplays = document.querySelectorAll("#ticket-booking-code");
    codeDisplays.forEach(el => el.innerText = bookingCode);

    const sourceCodeDisplays = document.querySelectorAll("#engine-source-code");
    sourceCodeDisplays.forEach(el => el.innerText = bookingCode);

    const engineCards = document.querySelectorAll("#engine-card-container");
    engineCards.forEach(el => el.style.display = "flex");

    const finalOdds = parseFloat(totalOdds.toFixed(2));
    const oddsDisplays = document.querySelectorAll("#ticket-total-odds");
    oddsDisplays.forEach(el => el.innerText = `@${finalOdds}`);

    const returnDisplays = document.querySelectorAll("#ticket-total-return");
    returnDisplays.forEach(el => el.innerText = `${(finalOdds * 10).toFixed(2)}`);

    // 8. POPULATE MOBILE QUICK CARD (DIRECTLY UNDER BUTTON)
    const mobileQuickCard = document.getElementById("mobile-ticket-quick-card");
    if (mobileQuickCard) {
      mobileQuickCard.style.display = "block";
      const mCode = document.getElementById("mobile-quick-code");
      if (mCode) mCode.innerText = bookingCode;
      const mOdds = document.getElementById("mobile-quick-odds");
      if (mOdds) mOdds.innerText = `@${finalOdds}`;
    }

    // 9. RENDER BETSLIP DRAWER & OPEN IT
    if (typeof renderBetslip === 'function') renderBetslip();

    const drawer = document.getElementById("floating-betslip-drawer");
    if (drawer) {
      drawer.classList.add("open");
    }

    // 10. SMOOTH SCROLL DIRECTLY TO DEEPPREDICT MACHINE TICKET CARD
    const ticketPreview = document.querySelector(".machine-ticket-preview");
    if (ticketPreview && window.innerWidth <= 1024) {
      ticketPreview.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    if (typeof showAppNotification === 'function') {
      showAppNotification(`⚡ DeepPredict Machine generated a ${matchCount}-Match Ticket (${bookingCode})!`);
    }
  } catch (err) {
    console.error("Error in generateMachineTicket:", err);
  }
}

// Global window assignments
window.generateMachineTicket = generateMachineTicket;

// Touch & Click event binding for Mobile Browsers
if (typeof window !== 'undefined') {
  const bindMobileEvents = () => {
    const btn = document.getElementById("btn-generate-machine-ticket");
    if (btn) {
      btn.onclick = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        generateMachineTicket();
      };
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindMobileEvents);
  } else {
    bindMobileEvents();
  }
}

function copyGeneratedTicketCode() {
  const codeEl = document.getElementById("ticket-booking-code");
  if (!codeEl) return;
  const code = codeEl.innerText.trim();
  navigator.clipboard.writeText(code).then(() => {
    if (typeof showAppNotification === 'function') {
      showAppNotification(`✓ Booking code '${code}' copied to clipboard!`);
    }
  }).catch(() => {
    if (typeof showAppNotification === 'function') {
      showAppNotification(`Booking code: ${code}`);
    }
  });
}

function saveGeneratedTicket() {
  const codeEl = document.getElementById("ticket-booking-code");
  const code = codeEl ? codeEl.innerText.trim() : "DP-TICKET";
  if (typeof showAppNotification === 'function') {
    showAppNotification(`💾 Ticket '${code}' saved to profile history!`);
  }
}

window.updateOddsSliderVal = updateOddsSliderVal;
window.updateProbSliderVal = updateProbSliderVal;
window.generateMachineTicket = generateMachineTicket;
window.copyGeneratedTicketCode = copyGeneratedTicketCode;
window.saveGeneratedTicket = saveGeneratedTicket;


/* --- DEEPPREDICTBET OPTION C CONVERTER ENGINE HELPERS --- */
function swapConverterBookmakers() {
  const srcSelect = document.getElementById("betcode-src-select");
  const tgtSelect = document.getElementById("betcode-tgt-select");
  if (!srcSelect || !tgtSelect) return;

  const temp = srcSelect.value;
  srcSelect.value = tgtSelect.value;
  tgtSelect.value = temp;

  if (typeof showAppNotification === 'function') {
    showAppNotification("↔️ Bookmakers swapped successfully!");
  }
}
window.swapConverterBookmakers = swapConverterBookmakers;


/* --- DEEPPREDICTBET AUTH / LOGIN MODAL CONTROLLERS --- */
function openAuthModal(mode) {
  const modal = document.getElementById("auth-modal");
  if (!modal) return;

  const isLoggedIn = localStorage.getItem("userLoggedIn") === "true";
  if (isLoggedIn && typeof openProfileModal === 'function') {
    openProfileModal('info');
    return;
  }

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
  if (typeof switchAuthTab === 'function') {
    switchAuthTab(mode || 'login');
  }
}

function closeAuthModal(event, force) {
  if (force || (event && event.target && event.target.id === "auth-modal")) {
    const modal = document.getElementById("auth-modal");
    if (modal) modal.classList.remove("active");
    document.body.style.overflow = "";
  }
}

function switchAuthTab(tab) {
  const loginBtn = document.getElementById("auth-tab-login");
  const signupBtn = document.getElementById("auth-tab-signup");
  const loginPane = document.getElementById("auth-pane-login");
  const signupPane = document.getElementById("auth-pane-signup");

  if (tab === 'login') {
    if (loginBtn) {
      loginBtn.style.borderBottom = "3px solid #3b82f6";
      loginBtn.style.color = "#ffffff";
    }
    if (signupBtn) {
      signupBtn.style.borderBottom = "3px solid transparent";
      signupBtn.style.color = "#94a3b8";
    }
    if (loginPane) loginPane.style.display = "block";
    if (signupPane) signupPane.style.display = "none";
  } else {
    if (signupBtn) {
      signupBtn.style.borderBottom = "3px solid #10b981";
      signupBtn.style.color = "#ffffff";
    }
    if (loginBtn) {
      loginBtn.style.borderBottom = "3px solid transparent";
      loginBtn.style.color = "#94a3b8";
    }
    if (signupPane) signupPane.style.display = "block";
    if (loginPane) loginPane.style.display = "none";
  }
}

function handleAuthLogin(e) {
  if (e) e.preventDefault();
  const input = document.getElementById("login-identifier");
  const username = (input && input.value.trim()) ? input.value.trim().split('@')[0] : "Egeruennamdi78";

  localStorage.setItem("userLoggedIn", "true");
  localStorage.setItem("currentUsername", username);

  if (typeof updateAuthUIState === 'function') updateAuthUIState();
  closeAuthModal(null, true);

  if (typeof showAppNotification === 'function') {
    showAppNotification(`🔓 Welcome back, ${username}! Login successful.`);
  } else if (typeof showToast === 'function') {
    showToast(`🔓 Welcome back, ${username}!`);
  }
}

function handleAuthSignup(e) {
  if (e) e.preventDefault();
  const input = document.getElementById("signup-username");
  const username = (input && input.value.trim()) ? input.value.trim() : "Egeruennamdi78";

  localStorage.setItem("userLoggedIn", "true");
  localStorage.setItem("currentUsername", username);

  if (typeof updateAuthUIState === 'function') updateAuthUIState();
  closeAuthModal(null, true);

  if (typeof showAppNotification === 'function') {
    showAppNotification(`🎉 Welcome to DeepPredictBet, ${username}! +500 Coins added.`);
  } else if (typeof showToast === 'function') {
    showToast(`🎉 Welcome to DeepPredictBet, ${username}!`);
  }
}



// Auto-run state sync on load
document.addEventListener("DOMContentLoaded", function() {
  updateAuthUIState();
});






/* --- FOOLPROOF DEEPPREDICTBET LOGOUT CONTROLLER --- */
function logoutUser(e) {
  if (e && e.preventDefault) e.preventDefault();

  try {
    localStorage.removeItem("userLoggedIn");
    localStorage.removeItem("currentUsername");
    localStorage.clear();
  } catch (err) {}

  // 1. Reset UI Labels across devices
  const navLabel = document.getElementById("nav-user-label");
  const drawerUsername = document.getElementById("mobile-drawer-username");
  const profileUsernameDisplay = document.getElementById("profile-username-display");
  const profileAvatarInitial = document.getElementById("profile-avatar-initial");

  if (navLabel) navLabel.innerText = "Login";
  if (drawerUsername) drawerUsername.innerText = "Guest User";
  if (profileUsernameDisplay) profileUsernameDisplay.innerText = "Guest User";
  if (profileAvatarInitial) profileAvatarInitial.innerText = "👤";

  // 2. Hide User Profile Modal
  const profModal = document.getElementById("profile-modal");
  if (profModal) profModal.classList.remove("active");

  // 3. Hide Auth Modal
  const authModal = document.getElementById("auth-modal");
  if (authModal) authModal.classList.remove("active");

  // 4. Close Mobile Drawer
  const drawer = document.getElementById("mobile-nav-drawer");
  const overlay = document.getElementById("mobile-drawer-overlay");
  if (drawer) {
    drawer.classList.remove("open");
    drawer.classList.remove("active");
    drawer.style.left = "-340px";
  }
  if (overlay) {
    overlay.style.opacity = "0";
    overlay.style.display = "none";
  }

  document.body.style.overflow = "";

  // 5. Trigger Toast Notification
  if (typeof showAppNotification === 'function') {
    showAppNotification("🚪 You have been logged out successfully.");
  } else if (typeof showToast === 'function') {
    showToast("🚪 You have been logged out successfully.");
  } else {
    alert("🚪 You have been logged out successfully.");
  }
}

function updateAuthUIState() {
  const isLoggedIn = localStorage.getItem("userLoggedIn") === "true";
  const username = localStorage.getItem("currentUsername") || "Guest User";

  const navLabel = document.getElementById("nav-user-label");
  const drawerUsername = document.getElementById("mobile-drawer-username");
  const profileUsernameDisplay = document.getElementById("profile-username-display");
  const profileAvatarInitial = document.getElementById("profile-avatar-initial");

  if (navLabel) {
    navLabel.innerText = isLoggedIn ? username : "Login";
  }
  if (drawerUsername) {
    drawerUsername.innerText = isLoggedIn ? username : "Guest User";
  }
  if (profileUsernameDisplay) {
    profileUsernameDisplay.innerText = isLoggedIn ? username : "Guest User";
  }
  if (profileAvatarInitial) {
    profileAvatarInitial.innerText = isLoggedIn ? username.charAt(0).toUpperCase() : "👤";
  }
}



window.logoutUser = logoutUser;
window.updateAuthUIState = updateAuthUIState;
window.openAuthModal = openAuthModal;
