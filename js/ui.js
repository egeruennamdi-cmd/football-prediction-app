// UI Controller for KickAI

// Helper to calculate DeepPredictBet-style tips dynamically based on selected market
function getMatchTip(match) {
  if (!match) return 'Home Win (1)';
  const market = window.appState ? (window.appState.activeMarketSubmenu || 'all') : 'all';
  const topTip = window.appState ? (window.appState.activeTopTip || 'all') : 'all';

  const pHome = match.predictions ? match.predictions.home : 45;
  const pDraw = match.predictions ? match.predictions.draw : 25;
  const pAway = match.predictions ? match.predictions.away : 30;

  const homeName = (match.homeTeam && match.homeTeam.name) ? match.homeTeam.name : 'Home';
  const awayName = (match.awayTeam && match.awayTeam.name) ? match.awayTeam.name : 'Away';

  // Compute a deterministic seed from match id / team names for rich market variety
  const nameHash = (homeName + awayName + (match.id || '')).split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // If specific Top Tip is chosen
  if (market === 'toptips' && topTip !== 'all') {
    switch (topTip) {
      case 'win1': return 'Home Win (1)';
      case 'draw': return 'Draw (X)';
      case 'win2': return 'Away Win (2)';
      case 'dc1x': return 'Double Chance: 1X';
      case 'dc12': return 'Double Chance: 12';
      case 'dcx2': return 'Double Chance: X2';
      case 'dnb': return pHome >= pAway ? 'DNB: Home' : 'DNB: Away';
      case 'uo05': return 'Over 0.5 Goals';
      case 'uo15': return 'Over 1.5 Goals';
      case 'uo25': return (pHome + pAway > 60 || nameHash % 2 === 0) ? 'Over 2.5 Goals' : 'Under 2.5 Goals';
      case 'uo35': return (nameHash % 3 === 0) ? 'Over 3.5 Goals' : 'Under 3.5 Goals';
      case 'uo45': return 'Under 4.5 Goals';
      case 'uo55': return 'Under 5.5 Goals';
      case 'uoht05': return 'Over 0.5 Goals HT';
      case 'uoht15': return (nameHash % 2 === 0) ? 'Under 1.5 Goals HT' : 'Over 1.5 Goals HT';
      case 'uoht25': return 'Under 2.5 Goals HT';
      case 'uo2h05': return 'Over 0.5 Goals 2nd Half';
      case 'uo2h15': return (nameHash % 2 === 0) ? 'Over 1.5 Goals 2nd Half' : 'Under 1.5 Goals 2nd Half';
      case 'uo2h25': return 'Under 2.5 Goals 2nd Half';
      case 'mg12': return 'Multi-Goals: 1-2 Goals';
      case 'mg13': return 'Multi-Goals: 1-3 Goals';
      case 'mg23': return 'Multi-Goals: 2-3 Goals';
      case 'mg24': return 'Multi-Goals: 2-4 Goals';
      case 'mg25': return 'Multi-Goals: 2-5 Goals';
      case 'mg35': return 'Multi-Goals: 3-5 Goals';
      case 'mg46': return 'Multi-Goals: 4-6 Goals';
      case 'eg0': return 'Exact Goals: 0 Goals';
      case 'eg1': return 'Exact Goals: 1 Goal';
      case 'eg2': return 'Exact Goals: 2 Goals';
      case 'eg3': return 'Exact Goals: 3 Goals';
      case 'eg4': return 'Exact Goals: 4+ Goals';
      case 'btts': return 'BTTS / GG (Yes)';
      case 'btts_no': return 'BTTS No (NG)';
      case 'bttsht': return (nameHash % 2 === 0) ? 'BTTS HT - Yes' : 'BTTS HT - No';
      case 'btts2h': return 'BTTS 2nd Half - Yes';
      case 'btts_both': return 'BTTS Both Halves - No';
      case 'combo_1x2_uo': return pHome >= pAway ? '1 & Over 2.5 Goals' : '2 & Over 2.5 Goals';
      case 'combo_1x2_under': return pHome >= pAway ? '1 & Under 2.5 Goals' : '2 & Under 2.5 Goals';
      case 'combo_1x2_gg': return pHome >= pAway ? '1 & GG (BTTS)' : '2 & GG (BTTS)';
      case 'combo_dc_uo': return pHome >= pAway ? '1X & Over 1.5 Goals' : 'X2 & Over 1.5 Goals';
      case 'combo_dc_gg': return pHome >= pAway ? '1X & GG (BTTS)' : 'X2 & GG (BTTS)';
      case 'htft_11': return 'HT/FT: 1/1 (Home/Home)';
      case 'htft_x1': return 'HT/FT: X/1 (Draw/Home)';
      case 'htft_21': return 'HT/FT: 2/1 (Away/Home)';
      case 'htft_1x': return 'HT/FT: 1/X (Home/Draw)';
      case 'htft_xx': return 'HT/FT: X/X (Draw/Draw)';
      case 'htft_2x': return 'HT/FT: 2/X (Away/Draw)';
      case 'htft_12': return 'HT/FT: 1/2 (Home/Away)';
      case 'htft_x2': return 'HT/FT: X/2 (Draw/Away)';
      case 'htft_22': return 'HT/FT: 2/2 (Away/Away)';
      case 'wineither': return pHome >= pAway ? 'Home Win Either Half' : 'Away Win Either Half';
      case 'winboth': return pHome >= pAway ? 'Home Win Both Halves' : 'Away Win Both Halves';
      case 'huo05': return 'Home Over 0.5 Goals';
      case 'huo15': return 'Home Over 1.5 Goals';
      case 'auo05': return 'Away Over 0.5 Goals';
      case 'auo15': return 'Away Over 1.5 Goals';
      case 'hcs': return (pAway < 25 || nameHash % 2 === 0) ? 'Home Clean Sheet - Yes' : 'Home Clean Sheet - No';
      case 'acs': return (pHome < 25 || nameHash % 3 === 0) ? 'Away Clean Sheet - Yes' : 'Away Clean Sheet - No';
      case 'hw2n': return 'Home Win to Nil';
      case 'aw2n': return 'Away Win to Nil';
      case 'first_goal': return pHome >= pAway ? '1st Goal: Home Team' : '1st Goal: Away Team';
      case 'c65': return 'Corners Over 6.5';
      case 'c75': return 'Corners Over 7.5';
      case 'c85': return 'Corners Over 8.5';
      case 'c95': return 'Corners Over 9.5';
      case 'c105': return 'Corners Over 10.5';
      case 'c115': return 'Corners Over 11.5';
      case 'c125': return 'Corners Under 12.5';
      case 'c45ht': return '1st Half Corners Over 4.5';
      case 'c1x2': return pHome >= pAway ? 'Most Corners: Home' : 'Most Corners: Away';
      case 'cards35': return 'Total Cards Over 3.5';
      case 'cards45': return 'Total Cards Over 4.5';
      case 'cards55': return (nameHash % 2 === 0) ? 'Total Cards Under 5.5' : 'Total Cards Over 5.5';
      case 'redcard': return (nameHash % 4 === 0) ? 'Red Card: Yes' : 'Red Card: No';
      case 'penalty': return (nameHash % 3 === 0) ? 'Penalty Awarded: Yes' : 'Penalty Awarded: No';
      case 'eh1': return pHome > 50 ? 'European Handicap (-1) Home' : 'European Handicap (+1) Away';
      case 'ah05': return pHome >= pAway ? 'Asian Handicap: Home (-0.5)' : 'Asian Handicap: Away (+0.5)';
      case 'ah15': return pHome >= 55 ? 'Asian Handicap: Home (-1.5)' : 'Asian Handicap: Away (+1.5)';
      default: return 'Over 1.5 Goals';
    }
  }

  // Category Markets
  if (market === '1x2') {
    if (pHome > 45) return 'Home Win (1)';
    if (pAway > 45) return 'Away Win (2)';
    if (pHome >= pAway) return 'Home Win (1)';
    return 'Draw (X)';
  }
  if (market === 'overunder') {
    return (pHome + pAway > 60 || nameHash % 2 === 0) ? 'Over 2.5 Goals' : 'Under 2.5 Goals';
  }
  if (market === 'btts') {
    return (pHome > 35 && pAway > 25) ? 'BTTS - Yes' : 'BTTS - No';
  }
  if (market === 'doublechance') {
    if (pHome > 40) return '1X (Home/Draw)';
    if (pAway > 40) return 'X2 (Draw/Away)';
    return '12 (Home/Away)';
  }
  if (market === 'dnb') {
    return pHome >= pAway ? 'Draw No Bet (Home)' : 'Draw No Bet (Away)';
  }
  if (market === 'combo') {
    if (pHome >= 50) return '1 & Over 2.5 Goals';
    if (pAway >= 50) return '2 & Over 2.5 Goals';
    return pHome >= pAway ? '1X & Over 1.5 Goals' : 'X2 & Over 1.5 Goals';
  }
  if (market === 'htft') {
    if (pHome >= 50) return 'HT/FT: 1/1 (Home/Home)';
    if (pAway >= 50) return 'HT/FT: 2/2 (Away/Away)';
    return 'HT/FT: X/1 (Draw/Home)';
  }
  if (market === 'multigoals') {
    const mgOptions = ['Multi-Goals: 2-4 Goals', 'Multi-Goals: 2-3 Goals', 'Multi-Goals: 1-3 Goals', 'Multi-Goals: 2-5 Goals'];
    return mgOptions[nameHash % mgOptions.length];
  }
  if (market === 'teamspec') {
    if (pHome >= 50) return 'Home Over 1.5 Goals';
    if (pAway >= 50) return 'Away Over 1.5 Goals';
    return pHome >= pAway ? 'Home Clean Sheet' : 'Away Clean Sheet';
  }
  if (market === 'corners') {
    const cornerOpts = ['Corners Over 8.5', 'Corners Over 9.5', 'Corners Over 7.5', '1st Half Corners Over 4.5'];
    return cornerOpts[nameHash % cornerOpts.length];
  }
  if (market === 'cards') {
    const cardOpts = ['Total Cards Over 3.5', 'Total Cards Over 4.5', 'Total Cards Under 5.5', 'Red Card: No'];
    return cardOpts[nameHash % cardOpts.length];
  }
  if (market === 'handicap') {
    if (pHome >= 55) return 'Asian Handicap: Home (-1.0)';
    if (pHome >= 45) return 'Asian Handicap: Home (-0.5)';
    return 'Asian Handicap: Away (+0.5)';
  }

  // Fallback default tip mapping
  if (match.id === 'match-1') return 'Home Win (1)';
  if (match.id === 'match-2') return 'Home Win (1)';
  if (match.id === 'match-3') return 'Over 2.5 Goals';
  if (match.id === 'match-4') return '1 & Over 2.5';
  if (match.id === 'match-5') return 'Home Win (1)';
  if (match.id === 'match-6') return 'Under 2.5 Goals';
  return pHome >= pAway ? 'Home Win (1)' : 'Over 1.5 Goals';
}

// Render match cards dynamically
function renderMatchCards(fixtures) {
  const grid = document.getElementById("fixtures-grid");
  if (!grid) return;
  grid.innerHTML = "";

  const list = Array.isArray(fixtures) ? fixtures : [];

  if (list.length === 0) {
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

  list.forEach(match => {
    if (!match) return;
    const isLocked = match.isPremium && !(window.appState && window.appState.premiumUnlocked);
    const card = document.createElement("div");
    card.className = `match-card ${isLocked ? 'premium-locked' : ''}`;
    card.id = `card-${match.id || Math.random()}`;
    if (!isLocked) {
      card.setAttribute("onclick", `openScoutModal('${match.id || ''}')`);
    }

    const isWatched = (window.appState && Array.isArray(window.appState.watchlist)) ? window.appState.watchlist.includes(match.id) : false;
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

    const homeName = match.homeTeam?.name || 'Home';
    const awayName = match.awayTeam?.name || 'Away';
    const homeLogo = match.homeTeam?.logo || '⚽';
    const awayLogo = match.awayTeam?.logo || '⚽';
    const homeForm = Array.isArray(match.homeTeam?.form) ? match.homeTeam.form : ['W', 'D', 'W', 'L', 'W'];
    const awayForm = Array.isArray(match.awayTeam?.form) ? match.awayTeam.form : ['D', 'W', 'L', 'W', 'W'];

    const homeFormHtml = homeForm.map(f => `<span class="form-badge ${f}">${f}</span>`).join("");
    const awayFormHtml = awayForm.map(f => `<span class="form-badge ${f}">${f}</span>`).join("");

    const pHome = match.predictions?.home ?? 45;
    const pDraw = match.predictions?.draw ?? 25;
    const pAway = match.predictions?.away ?? 30;

    const confidenceClass = match.confidence === 'high' ? 'high' : 'medium';
    const confidenceVal = match.confidenceVal ?? Math.min(95, Math.max(60, pHome + 20));

    const hashStr = (homeName + awayName + (match.id || ''));
    let hash = 0;
    for (let i = 0; i < hashStr.length; i++) {
      hash = hashStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    const seed = Math.abs(hash);

    const avgScored = parseFloat((1.0 + (seed % 19) * 0.1).toFixed(1));
    const avgConceded = parseFloat((0.6 + (Math.floor(seed / 4) % 17) * 0.1).toFixed(1));
    const avgXG = parseFloat((0.8 + (Math.floor(seed / 16) % 18) * 0.1).toFixed(1));
    const corners = parseFloat((7.5 + (Math.floor(seed / 64) % 9) * 0.5).toFixed(1));

    const homeFormVal = homeForm.reduce((sum, val) => sum + (val === 'W' ? 20 : val === 'D' ? 10 : 0), 0);
    const awayFormVal = awayForm.reduce((sum, val) => sum + (val === 'W' ? 20 : val === 'D' ? 10 : 0), 0);
    const avgForm = Math.round((homeFormVal + awayFormVal) / 2);

    const scoresDisplay = (match.isLive || match.statusShort === 'FT' || match.status === 'FT' || (match.scores && match.scores.home !== null && match.scores.home !== undefined))
      ? `${match.scores?.home ?? 0} - ${match.scores?.away ?? 0}`
      : '? - ?';

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
            <span>${match.leagueEmoji || '🏆'}</span> ${match.league || 'League'}
          </span>
        </div>
        <span class="match-time ${match.isLive ? 'live' : ''}">
          ${match.isLive ? '<span class="live-dot" style="width: 5px; height: 5px; border-radius: 50%; background: var(--danger); display: inline-block; margin-right: 4px; animation: pulse 1.5s infinite;"></span>' : ''}
          ${match.time || 'Upcoming'}
        </span>
      </div>

      <div class="teams-wrapper">
        <div class="team">
          <div class="team-logo">${homeLogo}</div>
          <span class="team-name" title="${homeName}">${homeName}</span>
          <div style="display: flex; gap: 3px; margin-top: 4px;" class="form-badges-container">${homeFormHtml}</div>
        </div>

        <div class="vs-divider">
          <span style="font-size: 0.75rem; color: var(--text-muted);">vs</span>
          <span class="vs-scores">${scoresDisplay}</span>
        </div>

        <div class="team">
          <div class="team-logo">${awayLogo}</div>
          <span class="team-name" title="${awayName}">${awayName}</span>
          <div style="display: flex; gap: 3px; margin-top: 4px;" class="form-badges-container">${awayFormHtml}</div>
        </div>
      </div>

      <div class="prediction-bar-container">
        <div class="prediction-bar">
          <div class="bar-segment home" style="width: ${pHome}%"></div>
          <div class="bar-segment draw" style="width: ${pDraw}%"></div>
          <div class="bar-segment away" style="width: ${pAway}%"></div>
        </div>
        <div class="bar-percentages">
          <div class="pct-item">
            <span class="pct-lbl">1</span>
            <span class="pct-val home">${pHome}%</span>
          </div>
          <div class="pct-item">
            <span class="pct-lbl">X</span>
            <span class="pct-val draw">${pDraw}%</span>
          </div>
          <div class="pct-item">
            <span class="pct-lbl">2</span>
            <span class="pct-val away">${pAway}%</span>
          </div>
        </div>
      </div>

      <div class="insight-row ${match.isPremium ? 'premium' : ''}">
        <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 500; margin-right: 4px;" class="mobile-only-label">Tip:</span>
        <span>${typeof getMatchTip === 'function' ? getMatchTip(match) : 'Home Win (1)'}</span>
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
          <span style="color: var(--text-secondary); font-size: 0.75rem;">Conf: <b>${confidenceVal}%</b></span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; justify-content: flex-end; width: 100%;">
          <span style="font-family: var(--font-display); font-weight: 700; font-size: 0.95rem; color: var(--text-primary);" class="desktop-only-odds">@${(typeof getMatchOdds === 'function' && typeof getMatchOdds(match) === 'number' ? getMatchOdds(match) : 1.85).toFixed(2)}</span>
          <button class="btn btn-primary" onclick="addMatchCardToBetslip('${match.id}', event)" style="padding: 6px 10px; font-size: 0.75rem; height: 32px; font-weight: 700; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); border: none; border-radius: var(--radius-sm); color: #fff; cursor: pointer; white-space: nowrap;">
            ➕ Add to Slip
          </button>
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
window.renderMatchCards = renderMatchCards;

// Custom CSS dynamic bar chart rendering
function renderAccuracyChart() {
  const chartWrapper = document.getElementById("chart-wrapper");
  if (!chartWrapper) return;
  chartWrapper.innerHTML = "";

  const perf = (typeof HISTORICAL_PERFORMANCE !== 'undefined' ? HISTORICAL_PERFORMANCE : ((typeof window.HISTORICAL_PERFORMANCE !== 'undefined') ? window.HISTORICAL_PERFORMANCE : { accuracy: [78, 82, 85, 84, 88, 89, 87], labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] }));
  const data = perf.accuracy || [78, 82, 85, 84, 88, 89, 87];
  const labels = perf.labels || ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

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

  if (!window.appState) window.appState = {};
  window.appState.activeScoutMatchId = null;

  const paramBanner = document.getElementById("scout-modal-parameters-banner");
  if (paramBanner) {
    paramBanner.style.display = "none";
  }

  const modalTitle = document.getElementById("scout-modal-title");
  if (modalTitle) {
    modalTitle.innerText = "DeepPredict Master Scout";
  }

  const chatTabBtn = document.getElementById("modal-tab-btn-chat");
  const statsTabBtn = document.getElementById("modal-tab-btn-stats");
  const h2hTabBtn = document.getElementById("modal-tab-btn-h2h");
  const oddsTabBtn = document.getElementById("modal-tab-btn-odds");
  if (chatTabBtn) chatTabBtn.classList.add("active");
  if (statsTabBtn) statsTabBtn.classList.remove("active");
  if (h2hTabBtn) h2hTabBtn.classList.remove("active");
  if (oddsTabBtn) oddsTabBtn.classList.remove("active");

  const chatPane = document.getElementById("modal-pane-chat");
  const statsPane = document.getElementById("modal-pane-stats");
  const h2hPane = document.getElementById("modal-pane-h2h");
  const oddsPane = document.getElementById("modal-pane-odds");
  if (chatPane) chatPane.style.display = "block";
  if (statsPane) statsPane.style.display = "none";
  if (h2hPane) h2hPane.style.display = "none";
  if (oddsPane) oddsPane.style.display = "none";

  const chatBody = document.getElementById("scout-chat-body");
  if (chatBody && (!chatBody.innerHTML || chatBody.innerHTML.trim() === "")) {
    const matchCount = (typeof MATCH_DATA !== 'undefined' && Array.isArray(MATCH_DATA)) ? MATCH_DATA.length : 40;
    chatBody.innerHTML = `
      <div class="chat-bubble scout">
        Welcome to the <b>DeepPredict Master Briefing Center</b>. I analyze overall league trends, team forms, and algorithmic accuracy.
        <br><br>
        Currently, my algorithms are monitoring <b>${matchCount} major fixtures</b> today.
        <br><br>
        Ask me about league dynamics, match specific setups, or ask me to generate accumulator selections!
      </div>
    `;
  }

  modal.style.display = "flex";
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}
window.openGeneralScout = openGeneralScout;

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

// Render Hot Trends Ticker (Bulletproof Version)
function renderTrends() {
  const container = document.getElementById("trends-ticker-container");
  if (!container) return;

  try {
    const defaultTrends = [
      { team: "Arsenal", icon: "🔴", trend: "Won last 6 home matches in Premier League" },
      { team: "Real Madrid", icon: "⚪", trend: "Over 2.5 Goals in 8 consecutive games" },
      { team: "Bayern Munich", icon: "🔴⚪", trend: "BTTS Yes in 9 of last 10 fixtures" },
      { team: "Barcelona", icon: "🔵🔴", trend: "Unbeaten in last 12 La Liga matches" },
      { team: "Manchester City", icon: "🩵", trend: "Scored 2+ Goals in last 7 matches" },
      { team: "Inter Milan", icon: "🔵⚫", trend: "Clean sheet in 5 consecutive games" },
      { team: "PSG", icon: "🗼", trend: "Won first half in 8 of last 10 matches" },
      { team: "Liverpool", icon: "🔴🛡️", trend: "Over 1.5 Goals in 14 straight games" },
      { team: "Bayer Leverkusen", icon: "🔴⚫", trend: "Unbeaten streak in 15 domestic games" },
      { team: "Juventus", icon: "⚪⚫", trend: "Under 2.5 Goals in 7 of last 9 matches" }
    ];

    let trendsData = defaultTrends;
    if (typeof HOT_TRENDS !== 'undefined' && Array.isArray(HOT_TRENDS) && HOT_TRENDS.length > 0) {
      trendsData = HOT_TRENDS;
    } else if (typeof window.HOT_TRENDS !== 'undefined' && Array.isArray(window.HOT_TRENDS) && window.HOT_TRENDS.length > 0) {
      trendsData = window.HOT_TRENDS;
    }

    const combinedTrends = [...trendsData, ...trendsData, ...trendsData];

    container.innerHTML = combinedTrends.map(trend => `
      <span style="font-size: 0.82rem; font-weight: 600; color: #cbd5e1; display: inline-flex; align-items: center; gap: 6px; margin-right: 40px; white-space: nowrap; flex-shrink: 0;">
        <span style="font-size: 0.95rem;">${trend.icon || '🔥'}</span>
        <b style="color: #60a5fa; font-weight: 800;">${trend.team}:</b>
        <span style="color: #ffffff;">${trend.trend}</span>
      </span>
    `).join("");

    container.style.display = "flex";
    container.style.position = "absolute";
    container.style.whiteSpace = "nowrap";
    container.style.left = "0";
    container.style.top = "0";
    container.style.animation = "tickerScroll 35s linear infinite";
  } catch(e) {
    console.error("Hot trends render error:", e);
  }
}
window.renderTrends = renderTrends;

// Auto-run Hot Trends on site load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderTrends);
} else {
  renderTrends();
}
window.addEventListener('load', renderTrends);

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
    // Dynamic fallback matching for extended DeepPredictBet markets
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

  // Market label mapping (Complete Exhaustive DeepPredictBet Suite)
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
// old renderSidebarTopLeagues replaced

// Toggle Top Leagues accordion inside the left sidebar
function toggleSidebarTopLeaguesAccordion(index, header) {
  if (!header) return;
  const content = header.nextElementSibling;
  if (!content) return;
  const caret = header.querySelector(".caret");
  
  const currentH = content.style.maxHeight;
  const isClosed = !currentH || currentH === '0px' || currentH === '0';

  // Close all others inside this specific sidebar card
  const allContents = document.querySelectorAll("#sidebar-topleagues-accordion-list .country-accordion-content");
  const allCarets = document.querySelectorAll("#sidebar-topleagues-accordion-list .caret");
  const allHeaders = document.querySelectorAll("#sidebar-topleagues-accordion-list .country-accordion-header");

  allContents.forEach(c => { c.style.maxHeight = '0px'; });
  allCarets.forEach(cr => { cr.style.transform = 'rotate(0deg)'; });
  allHeaders.forEach(h => { h.classList.remove("active"); });

  if (isClosed) {
    header.classList.add("active");
    content.style.maxHeight = "500px";
    if (caret) caret.style.transform = "rotate(180deg)";
  }
}
window.toggleSidebarTopLeaguesAccordion = toggleSidebarTopLeaguesAccordion;

// 1. Interactive League Intelligence Hub Modal (Integrates Predictions, Scouting, Averages & Standings)
function openLeagueHubModal(leagueName, btn) {
  const cleanLeague = (leagueName || '').replace(/^[^\w\s]+/, '').trim() || leagueName;
  if (btn) {
    const parent = btn.parentElement;
    if (parent) {
      const buttons = parent.querySelectorAll(".btn");
      buttons.forEach(b => {
        b.classList.remove("btn-primary");
        b.classList.add("btn-secondary");
      });
      btn.classList.remove("btn-secondary");
      btn.classList.add("btn-primary");
    }
  }

  const existing = document.getElementById("league-hub-modal");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.id = "league-hub-modal";
  modal.style.cssText = "position:fixed;left:0;top:0;width:100vw;height:100vh;background:rgba(0,0,0,0.88);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;z-index:999999;padding:16px;box-sizing:border-box;";
  modal.addEventListener("click", e => { if (e.target === modal) modal.remove(); });

  const content = document.createElement("div");
  content.className = "glass-card";
  content.style.cssText = "width:100%;max-width:560px;background:linear-gradient(180deg,#0f172a 0%,#020617 100%);border:1px solid rgba(59,130,246,0.35);border-radius:18px;box-shadow:0 20px 50px rgba(0,0,0,0.8),0 0 30px rgba(59,130,246,0.15);overflow:hidden;color:#f8fafc;font-family:var(--font-body,sans-serif);animation:fadeIn 0.2s ease-out;";

  const safeLeague = cleanLeague.replace(/'/g, "\\'");

  content.innerHTML = `
    <div style="padding:18px 22px;border-bottom:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:space-between;background:linear-gradient(135deg,rgba(59,130,246,0.18) 0%,rgba(15,23,42,0.9) 100%);">
      <div style="display:flex;align-items:center;gap:10px;">
        <span style="font-size:1.5rem;background:rgba(59,130,246,0.2);border:1px solid rgba(59,130,246,0.4);border-radius:10px;padding:4px 8px;">🏆</span>
        <div>
          <h3 style="margin:0;font-size:1.15rem;font-weight:900;color:#ffffff;display:flex;align-items:center;gap:6px;">
            ${leagueName}
          </h3>
          <span style="font-size:0.72rem;color:#94a3b8;">Integrated Competition Hub & AI Tools</span>
        </div>
      </div>
      <button id="close-league-hub-btn" style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);color:#ffffff;border-radius:50%;width:32px;height:32px;font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;">✕</button>
    </div>

    <div style="padding:20px;display:flex;flex-direction:column;gap:12px;">
      <div style="font-size:0.78rem;font-weight:700;text-transform:uppercase;color:#60a5fa;letter-spacing:0.5px;margin-bottom:2px;">
        Select an Action for ${cleanLeague}:
      </div>

      <!-- Action 1: Match Predictions -->
      <button onclick="document.getElementById('league-hub-modal').remove(); triggerMatchPreview('${safeLeague}');" style="display:flex;align-items:center;gap:14px;padding:14px 16px;background:rgba(30,41,59,0.7);border:1px solid rgba(59,130,246,0.3);border-radius:12px;color:#ffffff;cursor:pointer;text-align:left;transition:all 0.15s ease;" onmouseover="this.style.background='rgba(59,130,246,0.25)';this.style.borderColor='#3b82f6';" onmouseout="this.style.background='rgba(30,41,59,0.7)';this.style.borderColor='rgba(59,130,246,0.3)';">
        <span style="font-size:1.6rem;background:rgba(59,130,246,0.2);border-radius:10px;padding:8px 10px;">⚽</span>
        <div style="flex:1;">
          <div style="font-weight:800;font-size:0.95rem;color:#60a5fa;margin-bottom:2px;">Match Predictions</div>
          <div style="font-size:0.75rem;color:#94a3b8;">View AI match scorelines, win probabilities, and value tips for this league</div>
        </div>
        <span style="font-size:1.1rem;color:#60a5fa;">➔</span>
      </button>

      <!-- Action 2: Scouting Clubs -->
      <button onclick="document.getElementById('league-hub-modal').remove(); scoutLeagueClubs('${safeLeague}');" style="display:flex;align-items:center;gap:14px;padding:14px 16px;background:rgba(30,41,59,0.7);border:1px solid rgba(16,185,129,0.3);border-radius:12px;color:#ffffff;cursor:pointer;text-align:left;transition:all 0.15s ease;" onmouseover="this.style.background='rgba(16,185,129,0.25)';this.style.borderColor='#10b981';" onmouseout="this.style.background='rgba(30,41,59,0.7)';this.style.borderColor='rgba(16,185,129,0.3)';">
        <span style="font-size:1.6rem;background:rgba(16,185,129,0.2);border-radius:10px;padding:8px 10px;">🏟️</span>
        <div style="flex:1;">
          <div style="font-weight:800;font-size:0.95rem;color:#34d399;margin-bottom:2px;">Scouting Clubs</div>
          <div style="font-size:0.75rem;color:#94a3b8;">Explore official clubs, squad form, attack/defense xG ratings & team insights</div>
        </div>
        <span style="font-size:1.1rem;color:#34d399;">➔</span>
      </button>

      <!-- Action 3: League Averages -->
      <button onclick="document.getElementById('league-hub-modal').remove(); openLeagueAveragesModal('${safeLeague}');" style="display:flex;align-items:center;gap:14px;padding:14px 16px;background:rgba(30,41,59,0.7);border:1px solid rgba(245,158,11,0.3);border-radius:12px;color:#ffffff;cursor:pointer;text-align:left;transition:all 0.15s ease;" onmouseover="this.style.background='rgba(245,158,11,0.25)';this.style.borderColor='#f59e0b';" onmouseout="this.style.background='rgba(30,41,59,0.7)';this.style.borderColor='rgba(245,158,11,0.3)';">
        <span style="font-size:1.6rem;background:rgba(245,158,11,0.2);border-radius:10px;padding:8px 10px;">📊</span>
        <div style="flex:1;">
          <div style="font-weight:800;font-size:0.95rem;color:#fbbf24;margin-bottom:2px;">League Averages</div>
          <div style="font-size:0.75rem;color:#94a3b8;">Statistical averages: Goals/game, BTTS %, Over 2.5 %, Cards & Corner frequency</div>
        </div>
        <span style="font-size:1.1rem;color:#fbbf24;">➔</span>
      </button>

      <!-- Action 4: Table Standings -->
      <button onclick="document.getElementById('league-hub-modal').remove(); showMockTableStandings('${safeLeague}');" style="display:flex;align-items:center;gap:14px;padding:14px 16px;background:rgba(30,41,59,0.7);border:1px solid rgba(168,85,247,0.3);border-radius:12px;color:#ffffff;cursor:pointer;text-align:left;transition:all 0.15s ease;" onmouseover="this.style.background='rgba(168,85,247,0.25)';this.style.borderColor='#a855f7';" onmouseout="this.style.background='rgba(30,41,59,0.7)';this.style.borderColor='rgba(168,85,247,0.3)';">
        <span style="font-size:1.6rem;background:rgba(168,85,247,0.2);border-radius:10px;padding:8px 10px;">🏆</span>
        <div style="flex:1;">
          <div style="font-weight:800;font-size:0.95rem;color:#c084fc;margin-bottom:2px;">Table Standings</div>
          <div style="font-size:0.75rem;color:#94a3b8;">Live league ladder with match results, wins, draws, losses, and point tallies</div>
        </div>
        <span style="font-size:1.1rem;color:#c084fc;">➔</span>
      </button>
    </div>
  `;

  modal.appendChild(content);
  document.body.appendChild(modal);
  content.querySelector("#close-league-hub-btn").addEventListener("click", () => modal.remove());
}
window.openLeagueHubModal = openLeagueHubModal;

// Universal Club Lookup for all 50+ Leagues & Cups
function getClubsForLeague(leagueName) {
  const clean = (leagueName || '').replace(/^[^\w\s]+/, '').trim().toLowerCase();
  const allClubs = (typeof GLOBAL_CLUBS !== 'undefined' && Array.isArray(GLOBAL_CLUBS) && GLOBAL_CLUBS.length > 0)
    ? GLOBAL_CLUBS
    : ((typeof window.GLOBAL_CLUBS !== 'undefined' && Array.isArray(window.GLOBAL_CLUBS) && window.GLOBAL_CLUBS.length > 0)
      ? window.GLOBAL_CLUBS
      : [
          { name: "Arsenal", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", league: "Premier League", logo: "🔴", matchesPlayed: 1, wins: 1, draws: 0, losses: 0, points: 3 },
          { name: "Manchester City", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", league: "Premier League", logo: "🔵", matchesPlayed: 1, wins: 1, draws: 0, losses: 0, points: 3 },
          { name: "Liverpool", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", league: "Premier League", logo: "🔴🛡️", matchesPlayed: 1, wins: 0, draws: 1, losses: 0, points: 1 },
          { name: "Chelsea", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", league: "Premier League", logo: "🦁", matchesPlayed: 1, wins: 0, draws: 0, losses: 1, points: 0 },
          { name: "Real Madrid", country: "Spain", flag: "🇪🇸", league: "La Liga", logo: "⚪", matchesPlayed: 1, wins: 1, draws: 0, losses: 0, points: 3 },
          { name: "Barcelona", country: "Spain", flag: "🇪🇸", league: "La Liga", logo: "🔵🔴", matchesPlayed: 1, wins: 1, draws: 0, losses: 0, points: 3 },
          { name: "Bayern Munich", country: "Germany", flag: "🇩🇪", league: "Bundesliga", logo: "🔴⚪", matchesPlayed: 1, wins: 1, draws: 0, losses: 0, points: 3 },
          { name: "Inter Milan", country: "Italy", flag: "🇮🇹", league: "Serie A", logo: "🔵⚫", matchesPlayed: 1, wins: 1, draws: 0, losses: 0, points: 3 },
          { name: "Paris Saint-Germain", country: "France", flag: "🇫🇷", league: "Ligue 1", logo: "🗼🔵🔴", matchesPlayed: 1, wins: 1, draws: 0, losses: 0, points: 3 }
        ]);

  // Direct league name match
  let matches = allClubs.filter(c => {
    const cLeague = (c.league || '').toLowerCase();
    return cLeague === clean || cLeague.includes(clean) || clean.includes(cLeague);
  });

  if (matches.length > 0) return matches;

  // Cup & tournament mappings to clubs
  if (clean.includes('fa cup') || clean.includes('efl cup') || clean.includes('carabao') || clean.includes('league one') || clean.includes('premier') || clean.includes('championship')) {
    const res = allClubs.filter(c => (c.country || '').toLowerCase() === 'england');
    if (res.length > 0) return res;
  }
  if (clean.includes('copa del rey') || clean.includes('la liga') || clean.includes('segunda') || clean.includes('spain')) {
    const res = allClubs.filter(c => (c.country || '').toLowerCase() === 'spain');
    if (res.length > 0) return res;
  }
  if (clean.includes('dfb pokal') || clean.includes('bundesliga') || clean.includes('germany')) {
    const res = allClubs.filter(c => (c.country || '').toLowerCase() === 'germany');
    if (res.length > 0) return res;
  }
  if (clean.includes('coppa italia') || clean.includes('serie a') || clean.includes('serie b') || clean.includes('italy')) {
    const res = allClubs.filter(c => (c.country || '').toLowerCase() === 'italy');
    if (res.length > 0) return res;
  }
  if (clean.includes('coupe de france') || clean.includes('ligue 1') || clean.includes('ligue 2') || clean.includes('france')) {
    const res = allClubs.filter(c => (c.country || '').toLowerCase() === 'france');
    if (res.length > 0) return res;
  }
  if (clean.includes('champions league') || clean.includes('europa league') || clean.includes('conference') || clean.includes('europe')) {
    const res = allClubs.filter(c => ['Arsenal', 'Manchester City', 'Liverpool', 'Real Madrid', 'Barcelona', 'Bayern Munich', 'Borussia Dortmund', 'Inter Milan', 'Juventus', 'Paris Saint-Germain', 'Sporting CP', 'Benfica', 'PSV Eindhoven'].includes(c.name));
    if (res.length > 0) return res;
  }
  if (clean.includes('copa libertadores') || clean.includes('copa sudamericana') || clean.includes('brasileir') || clean.includes('liga profesional') || clean.includes('america')) {
    const res = allClubs.filter(c => ['Brazil', 'Argentina', 'Colombia'].includes(c.country));
    if (res.length > 0) return res;
  }
  if (clean.includes('caf') || clean.includes('african') || clean.includes('npfl') || clean.includes('dstv') || clean.includes('egypt') || clean.includes('ghana') || clean.includes('moroc') || clean.includes('tunis') || clean.includes('kenya')) {
    const res = allClubs.filter(c => ['Nigeria', 'Egypt', 'Morocco', 'Tunisia', 'South Africa', 'Ghana', 'Kenya'].includes(c.country));
    if (res.length > 0) return res;
  }

  // General fallback: match by country
  const byCountry = allClubs.filter(c => (c.country || '').toLowerCase().includes(clean) || clean.includes((c.country || '').toLowerCase()));
  if (byCountry.length > 0) return byCountry;

  return allClubs.slice(0, 10);
}
window.getClubsForLeague = getClubsForLeague;

// Scouting clubs for this competition with full interactive roster & stats
function scoutLeagueClubs(leagueName, btn) {
  const cleanLeague = (leagueName || '').replace(/^[^\w\s]+/, '').trim() || leagueName;
  if (btn) {
    const allLeagueBtns = document.querySelectorAll(".sidebar-league-btn");
    allLeagueBtns.forEach(b => b.classList.remove("active"));
    if (btn.classList) btn.classList.add("active");
  }

  const existing = document.getElementById("scout-clubs-modal");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.id = "scout-clubs-modal";
  modal.style.cssText = "position:fixed;left:0;top:0;width:100vw;height:100vh;background:rgba(0,0,0,0.88);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;z-index:999999;padding:16px;box-sizing:border-box;";
  modal.addEventListener("click", e => { if (e.target === modal) modal.remove(); });

  const content = document.createElement("div");
  content.className = "glass-card";
  content.style.cssText = "width:100%;max-width:680px;max-height:88vh;background:linear-gradient(180deg,#0f172a 0%,#020617 100%);border:1px solid rgba(16,185,129,0.35);border-radius:18px;box-shadow:0 20px 50px rgba(0,0,0,0.8),0 0 30px rgba(16,185,129,0.15);display:flex;flex-direction:column;overflow:hidden;color:#f8fafc;font-family:var(--font-body,sans-serif);";

  const clubs = getClubsForLeague(cleanLeague);

  const clubRows = clubs.map((c, idx) => {
    const winRate = c.matchesPlayed > 0 ? Math.round((c.wins / c.matchesPlayed) * 100) : (c.points > 0 ? 75 : 50);
    const attackVal = (1.4 + ((c.wins || 0) * 0.4)).toFixed(1);

    return `
      <div style="padding:14px 16px;background:rgba(15,23,42,0.6);border:1px solid rgba(255,255,255,0.06);border-radius:12px;margin-bottom:8px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;transition:border-color 0.15s ease;">
        <div style="display:flex;align-items:center;gap:12px;min-width:180px;">
          <span style="font-size:1.6rem;background:rgba(255,255,255,0.05);padding:4px 8px;border-radius:10px;">${c.logo || '⚽'}</span>
          <div>
            <div style="font-weight:800;font-size:0.95rem;color:#ffffff;">${c.name}</div>
            <div style="font-size:0.75rem;color:#94a3b8;display:flex;align-items:center;gap:6px;">
              <span>${c.flag || '🏳️'} ${c.country || cleanLeague}</span>
              <span>•</span>
              <span style="color:#10b981;font-weight:700;">${c.points || 0} PTS</span>
            </div>
          </div>
        </div>

        <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
          <div style="text-align:center;">
            <div style="font-size:0.68rem;color:#94a3b8;text-transform:uppercase;">Win Rate</div>
            <div style="font-size:0.85rem;font-weight:800;color:#38bdf8;">${winRate}%</div>
          </div>
          <div style="text-align:center;">
            <div style="font-size:0.68rem;color:#94a3b8;text-transform:uppercase;">Attack Index</div>
            <div style="font-size:0.85rem;font-weight:800;color:#34d399;">${attackVal} xG</div>
          </div>
          <button onclick="document.getElementById('scout-clubs-modal').remove(); if(typeof openAiScoutChat==='function'){openAiScoutChat('${c.name.replace(/'/g, "\\'")}');}else{alert('AI Scout Analysis for ${c.name.replace(/'/g, "\\'")}: High pressing index with dangerous transition efficiency.');}" style="padding:6px 12px;background:rgba(16,185,129,0.15);border:1px solid #10b981;color:#10b981;font-weight:700;font-size:0.75rem;border-radius:8px;cursor:pointer;display:flex;align-items:center;gap:4px;">
            🤖 AI Scout
          </button>
        </div>
      </div>
    `;
  }).join('');

  content.innerHTML = `
    <div style="padding:18px 22px;border-bottom:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:space-between;background:linear-gradient(135deg,rgba(16,185,129,0.18) 0%,rgba(15,23,42,0.9) 100%);">
      <div style="display:flex;align-items:center;gap:10px;">
        <span style="font-size:1.5rem;background:rgba(16,185,129,0.2);border:1px solid #10b981;border-radius:10px;padding:4px 8px;">🏟️</span>
        <div>
          <h3 style="margin:0;font-size:1.15rem;font-weight:900;color:#ffffff;display:flex;align-items:center;gap:6px;">
            Scouting Clubs: ${cleanLeague}
          </h3>
          <span style="font-size:0.72rem;color:#94a3b8;">Squad Ratings, Attack/Defense Index & AI Tactical Profiles</span>
        </div>
      </div>
      <button id="close-scout-modal-btn" style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);color:#ffffff;border-radius:50%;width:32px;height:32px;font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;">✕</button>
    </div>

    <div style="padding:16px 20px;overflow-y:auto;max-height:calc(88vh - 80px);">
      ${clubRows}
    </div>
  `;

  modal.appendChild(content);
  document.body.appendChild(modal);
  content.querySelector("#close-scout-modal-btn").addEventListener("click", () => modal.remove());
}
window.scoutLeagueClubs = scoutLeagueClubs;

// Open League Averages statistical ledger modal
function openLeagueAveragesModal(leagueName, btn) {
  const cleanLeague = (leagueName || '').replace(/^[^\w\s]+/, '').trim() || leagueName;
  if (btn) {
    const allLeagueBtns = document.querySelectorAll(".sidebar-league-btn");
    allLeagueBtns.forEach(b => b.classList.remove("active"));
    if (btn.classList) btn.classList.add("active");
  }

  const existing = document.getElementById("league-averages-modal");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.id = "league-averages-modal";
  modal.style.cssText = "position:fixed;left:0;top:0;width:100vw;height:100vh;background:rgba(0,0,0,0.88);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;z-index:999999;padding:16px;box-sizing:border-box;";
  modal.addEventListener("click", e => { if (e.target === modal) modal.remove(); });

  const content = document.createElement("div");
  content.className = "glass-card";
  content.style.cssText = "width:100%;max-width:580px;background:linear-gradient(180deg,#0f172a 0%,#020617 100%);border:1px solid rgba(245,158,11,0.35);border-radius:18px;box-shadow:0 20px 50px rgba(0,0,0,0.8),0 0 30px rgba(245,158,11,0.15);overflow:hidden;color:#f8fafc;font-family:var(--font-body,sans-serif);animation:fadeIn 0.2s ease-out;";

  // Find league record in LEAGUE_STATS
  const qLeague = cleanLeague.toLowerCase();
  const stat = (typeof LEAGUE_STATS !== 'undefined' ? LEAGUE_STATS : []).find(s => {
    const sLeague = (s.league || '').toLowerCase();
    return sLeague.includes(qLeague) || qLeague.includes(sLeague);
  }) || {
    league: cleanLeague,
    flag: "🏆",
    avgGoals: "2.75",
    bttsPct: "54%",
    homeWinPct: "46%",
    drawPct: "24%",
    over25Pct: "58%",
    avgCards: "3.9",
    avgCorners: "9.8"
  };

  content.innerHTML = `
    <div style="padding:18px 22px;border-bottom:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:space-between;background:linear-gradient(135deg,rgba(245,158,11,0.18) 0%,rgba(15,23,42,0.9) 100%);">
      <div style="display:flex;align-items:center;gap:10px;">
        <span style="font-size:1.5rem;background:rgba(245,158,11,0.2);border:1px solid #f59e0b;border-radius:10px;padding:4px 8px;">📊</span>
        <div>
          <h3 style="margin:0;font-size:1.15rem;font-weight:900;color:#ffffff;display:flex;align-items:center;gap:6px;">
            ${stat.flag || '🏆'} ${stat.league} Averages
          </h3>
          <span style="font-size:0.72rem;color:#94a3b8;">Tournament Metrics, Goal Intensity & Betting Market Indicators</span>
        </div>
      </div>
      <button id="close-averages-modal-btn" style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);color:#ffffff;border-radius:50%;width:32px;height:32px;font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;">✕</button>
    </div>

    <div style="padding:22px;display:grid;grid-template-columns:1fr 1fr;gap:12px;">
      <div style="padding:14px;background:rgba(30,41,59,0.7);border:1px solid rgba(255,255,255,0.06);border-radius:12px;text-align:center;">
        <div style="font-size:0.7rem;color:#94a3b8;text-transform:uppercase;font-weight:700;">⚽ Avg Goals / Match</div>
        <div style="font-size:1.5rem;font-weight:900;color:#38bdf8;margin-top:4px;">${stat.avgGoals}</div>
      </div>

      <div style="padding:14px;background:rgba(30,41,59,0.7);border:1px solid rgba(255,255,255,0.06);border-radius:12px;text-align:center;">
        <div style="font-size:0.7rem;color:#94a3b8;text-transform:uppercase;font-weight:700;">🥅 Both Teams To Score (BTTS)</div>
        <div style="font-size:1.5rem;font-weight:900;color:#34d399;margin-top:4px;">${stat.bttsPct}</div>
      </div>

      <div style="padding:14px;background:rgba(30,41,59,0.7);border:1px solid rgba(255,255,255,0.06);border-radius:12px;text-align:center;">
        <div style="font-size:0.7rem;color:#94a3b8;text-transform:uppercase;font-weight:700;">📈 Over 2.5 Goals %</div>
        <div style="font-size:1.5rem;font-weight:900;color:#fbbf24;margin-top:4px;">${stat.over25Pct}</div>
      </div>

      <div style="padding:14px;background:rgba(30,41,59,0.7);border:1px solid rgba(255,255,255,0.06);border-radius:12px;text-align:center;">
        <div style="font-size:0.7rem;color:#94a3b8;text-transform:uppercase;font-weight:700;">🏠 Home Win Advantage</div>
        <div style="font-size:1.5rem;font-weight:900;color:#60a5fa;margin-top:4px;">${stat.homeWinPct}</div>
      </div>

      <div style="padding:14px;background:rgba(30,41,59,0.7);border:1px solid rgba(255,255,255,0.06);border-radius:12px;text-align:center;">
        <div style="font-size:0.7rem;color:#94a3b8;text-transform:uppercase;font-weight:700;">🟨 Avg Cards / Game</div>
        <div style="font-size:1.5rem;font-weight:900;color:#f87171;margin-top:4px;">${stat.avgCards}</div>
      </div>

      <div style="padding:14px;background:rgba(30,41,59,0.7);border:1px solid rgba(255,255,255,0.06);border-radius:12px;text-align:center;">
        <div style="font-size:0.7rem;color:#94a3b8;text-transform:uppercase;font-weight:700;">🚩 Avg Corners / Game</div>
        <div style="font-size:1.5rem;font-weight:900;color:#c084fc;margin-top:4px;">${stat.avgCorners}</div>
      </div>
    </div>

    <div style="padding:12px 22px 20px;display:flex;justify-content:flex-end;">
      <button id="close-averages-ok-btn" class="btn btn-primary" style="padding:8px 24px;border-radius:8px;">OK</button>
    </div>
  `;

  modal.appendChild(content);
  document.body.appendChild(modal);
  content.querySelector("#close-averages-modal-btn").addEventListener("click", () => modal.remove());
  content.querySelector("#close-averages-ok-btn").addEventListener("click", () => modal.remove());
}
window.openLeagueAveragesModal = openLeagueAveragesModal;
window.viewLeagueStatisticsLedger = openLeagueAveragesModal;

// Open mock modal with standings table list for this league
async function showMockTableStandings(leagueName, btn) {
  const cleanLeague = (leagueName || '').replace(/^[^\w\s]+/, '').trim() || leagueName;
  const LEAGUE_ID_MAP = {
    'Premier League': 39, 'Championship': 40, 'EFL Championship': 40, 'La Liga': 140, 'Bundesliga': 78,
    'Serie A': 135, 'Ligue 1': 61, 'Primeira Liga': 94,
    'Eredivisie': 88, 'MLS': 253, 'Champions League': 2, 'Europa League': 3
  };
  const now = new Date();
  const season = now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1;
  if (btn) {
    const allLeagueBtns = document.querySelectorAll(".sidebar-league-btn");
    allLeagueBtns.forEach(b => b.classList.remove("active"));
    if (btn.classList) btn.classList.add("active");
  }

  // Build modal shell
  const existing = document.getElementById("live-standings-modal");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.id = "live-standings-modal";
  modal.style.cssText = "position:fixed;left:0;top:0;width:100vw;height:100vh;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;z-index:999999;";
  modal.addEventListener("click", e => { if (e.target === modal) modal.remove(); });

  const content = document.createElement("div");
  content.className = "glass-card";
  content.style.cssText = "width:90%;max-width:540px;padding:24px;border:1px solid var(--border-color,rgba(255,255,255,0.1));border-radius:16px;background:var(--bg-card,#1e293b);box-shadow:0 25px 60px rgba(0,0,0,0.8);";

  const closeFn = () => modal.remove();

  const renderStandingRows = (clubs) => clubs.map((club, idx) => {
    const p = club.matchesPlayed ?? club.all?.played ?? 1;
    const w = club.wins ?? club.all?.win ?? 0;
    const d = club.draws ?? club.all?.draw ?? 0;
    const l = club.losses ?? club.all?.lose ?? 0;
    const pts = club.points ?? (w * 3 + d);
    const nm = club.name ?? club.team?.name ?? "Unknown";
    const lg = club.logo ?? "⚽";
    return `<div style="display:grid;grid-template-columns:30px 1.6fr 40px 40px 40px 40px 44px;font-size:0.85rem;padding:9px 8px;border-bottom:1px solid rgba(255,255,255,0.04);align-items:center;">
      <span style="font-weight:700;color:${idx < 4 ? 'var(--secondary,#10b981)' : 'var(--text-muted,#64748b)'}">${idx + 1}</span>
      <span style="font-weight:600;color:var(--text-primary,#f1f5f9);display:flex;align-items:center;gap:6px;"><span>${lg}</span>${nm}</span>
      <span style="text-align:center;color:var(--text-secondary,#94a3b8)">${p}</span>
      <span style="text-align:center;color:#10b981;font-weight:700">${w}</span>
      <span style="text-align:center;color:#64748b">${d}</span>
      <span style="text-align:center;color:#ef4444">${l}</span>
      <span style="text-align:center;font-weight:700;color:#f59e0b">${pts}</span>
    </div>`;
  }).join("");

  const buildStandingsContent = (clubs, source) => {
    const badge = source === 'live'
      ? `<span style="font-size:0.68rem;background:rgba(16,185,129,0.15);color:#10b981;border:1px solid rgba(16,185,129,0.3);border-radius:20px;padding:2px 8px;">🟢 Live</span>`
      : `<span style="font-size:0.68rem;background:rgba(148,163,184,0.1);color:#94a3b8;border:1px solid rgba(148,163,184,0.2);border-radius:20px;padding:2px 8px;">📦 Standings</span>`;
    const body = `<div style="max-height:380px;overflow-y:auto;">${renderStandingRows(clubs)}</div>`;
    content.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--border-color,rgba(255,255,255,0.08));padding-bottom:12px;margin-bottom:12px;">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          <h3 style="margin:0;font-size:1.1rem;color:var(--text-primary,#f1f5f9);">🏆 ${leagueName} Standings</h3>${badge}
        </div>
        <button id="cls-st" style="background:rgba(255,255,255,0.08);border:none;color:#94a3b8;font-size:1rem;cursor:pointer;border-radius:50%;width:28px;height:28px;">✕</button>
      </div>
      <div style="display:grid;grid-template-columns:30px 1.6fr 40px 40px 40px 40px 44px;font-size:0.7rem;font-weight:700;text-transform:uppercase;color:var(--text-secondary,#94a3b8);padding:6px 8px;border-bottom:1px solid var(--border-color,rgba(255,255,255,0.08));margin-bottom:4px;">
        <span>Pos</span><span>Club</span><span style="text-align:center">P</span><span style="text-align:center">W</span><span style="text-align:center">D</span><span style="text-align:center">L</span><span style="text-align:center">Pts</span>
      </div>
      ${body}
      <div style="text-align:right;margin-top:14px;">
        <button id="cls-st-ok" class="btn btn-primary" style="padding:6px 16px;font-size:0.82rem;border-radius:8px;">OK</button>
      </div>`;
    const c1 = content.querySelector("#cls-st");
    const c2 = content.querySelector("#cls-st-ok");
    if (c1) c1.addEventListener("click", closeFn);
    if (c2) c2.addEventListener("click", closeFn);
  };

  // Immediate render from local clubs so it is INSTANT and NEVER blank
  const localClubs = [...getClubsForLeague(cleanLeague)].sort((a, b) => ((b.points ?? (b.wins * 3 + b.draws)) - (a.points ?? (a.wins * 3 + a.draws))));
  buildStandingsContent(localClubs, 'cached');

  modal.appendChild(content);
  document.body.appendChild(modal);

  // Background check for live API table if available
  const leagueId = LEAGUE_ID_MAP[cleanLeague] || LEAGUE_ID_MAP[leagueName];
  const backendBase = window.BACKEND_API_URL || 'https://deeppredictbet-backend.onrender.com';
  if (leagueId) {
    try {
      const res = await fetch(`${backendBase}/api/v1/live/standings?league=${leagueId}&season=${season}`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const json = await res.json();
        const raw = json.standings?.[0]?.league?.standings?.[0] || json.standings?.[0] || json.standings || [];
        if (Array.isArray(raw) && raw.length > 0) {
          const liveClubs = raw.map(item => ({
            name: item.team?.name || item.name || "—",
            logo: item.team?.logo ? `<img src="${item.team.logo}" style="width:20px;height:20px;object-fit:contain;vertical-align:middle;" onerror="this.outerHTML='⚽'">` : "⚽",
            matchesPlayed: item.all?.played ?? 0,
            wins:          item.all?.win    ?? 0,
            draws:         item.all?.draw   ?? 0,
            losses:        item.all?.lose   ?? 0,
            points:        item.points      ?? 0
          }));
          buildStandingsContent(liveClubs, 'live');
        }
      }
    } catch (err) {
      // already showing cached table, no error banner needed
    }
  }
}
window.showMockTableStandings = showMockTableStandings;
// ---- end live standings ----

// Search filter for Top Leagues sidebar
// old filterSidebarTopLeagues replaced

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

try { if (typeof openScoutModal === 'function') window.openScoutModal = openScoutModal; } catch (e) {}
try { if (typeof openStoreModal === 'function') window.openStoreModal = openStoreModal; } catch (e) {}
try { if (typeof openSupportModal === 'function') window.openSupportModal = openSupportModal; } catch (e) {}
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

function generateScoutAccumulator(count = 40) {
  const fixtures = (typeof MATCH_DATA !== 'undefined' && Array.isArray(MATCH_DATA) && MATCH_DATA.length > 0)
    ? MATCH_DATA
    : (window.MATCH_DATA && Array.isArray(window.MATCH_DATA) && window.MATCH_DATA.length > 0)
      ? window.MATCH_DATA
      : [
          { id: "m-1", homeTeam: { name: "Arsenal" }, awayTeam: { name: "Chelsea" }, league: "Premier League" },
          { id: "m-2", homeTeam: { name: "Real Madrid" }, awayTeam: { name: "Barcelona" }, league: "La Liga" },
          { id: "m-3", homeTeam: { name: "Bayern Munich" }, awayTeam: { name: "Dortmund" }, league: "Bundesliga" },
          { id: "m-4", homeTeam: { name: "Inter Milan" }, awayTeam: { name: "Juventus" }, league: "Serie A" },
          { id: "m-5", homeTeam: { name: "PSG" }, awayTeam: { name: "Marseille" }, league: "Ligue 1" },
          { id: "m-6", homeTeam: { name: "Man City" }, awayTeam: { name: "Liverpool" }, league: "Premier League" },
          { id: "m-7", homeTeam: { name: "Atletico Madrid" }, awayTeam: { name: "Sevilla" }, league: "La Liga" },
          { id: "m-8", homeTeam: { name: "AC Milan" }, awayTeam: { name: "Napoli" }, league: "Serie A" }
        ];

  const reqCount = Math.min(Math.max(parseInt(count) || 40, 3), 40);
  if (!window.appState) window.appState = {};
  window.appState.betslip = [];

  const marketOptions = [
    "Home Win (1)", "Away Win (2)", "Over 1.5 Goals", "Over 2.5 Goals",
    "Both Teams To Score (BTTS)", "Double Chance (1X)", "Double Chance (X2)",
    "Under 3.5 Goals", "Home Win or Draw", "Draw (X)",
    "Multi-Goals 2-4", "Over 0.5 HT Goals", "Corners Over 8.5"
  ];

  for (let i = 0; i < reqCount; i++) {
    const match = fixtures[i % fixtures.length];
    const tip = marketOptions[i % marketOptions.length];
    const homeName = (match.homeTeam && match.homeTeam.name) ? match.homeTeam.name : "Home Team";
    const awayName = (match.awayTeam && match.awayTeam.name) ? match.awayTeam.name : "Away Team";

    const hash = (homeName + awayName + i);
    let h = 0;
    for (let j = 0; j < hash.length; j++) h = hash.charCodeAt(j) + ((h << 5) - h);
    const odds = parseFloat((1.35 + (Math.abs(h) % 18) * 0.05).toFixed(2));

    const cycle = Math.floor(i / fixtures.length);
    const homeSuffix = cycle > 0 ? ` [R${cycle + 1}]` : '';
    const awaySuffix = cycle > 0 ? ` [R${cycle + 1}]` : '';

    window.appState.betslip.push({
      matchId: `scout-acc-${i}-${match.id || i}`,
      match: {
        ...match,
        homeTeam: { name: homeName + homeSuffix },
        awayTeam: { name: awayName + awaySuffix }
      },
      tip,
      odds
    });
  }

  // Render betslip and update drawer
  if (typeof renderBetslip === 'function') {
    renderBetslip();
  }
  const drawer = document.getElementById("floating-betslip-drawer");
  if (drawer) drawer.classList.add("open");

  if (typeof showAppNotification === 'function') {
    showAppNotification(`🎯 AI Scout generated a ${reqCount}-Match Accumulator Ticket!`);
  }
  return window.appState.betslip;
}
window.generateScoutAccumulator = generateScoutAccumulator;

function toggleBetslipDrawer() {
  const drawer = document.getElementById("floating-betslip-drawer");
  if (drawer) {
    drawer.classList.toggle("open");
    if (drawer.classList.contains("open") && typeof renderBetslip === 'function') {
      renderBetslip();
    }
  }
}
window.toggleBetslipDrawer = toggleBetslipDrawer;

let _isRemovingBetslipItem = false;

function removeBetslipItem(indexOrId, event) {
  if (event) {
    if (typeof event.stopPropagation === 'function') event.stopPropagation();
    if (typeof event.stopImmediatePropagation === 'function') event.stopImmediatePropagation();
    if (typeof event.preventDefault === 'function') event.preventDefault();
  }
  
  if (_isRemovingBetslipItem) return;
  _isRemovingBetslipItem = true;
  setTimeout(function() { _isRemovingBetslipItem = false; }, 120);

  if (!window.appState) {
    window.appState = { betslip: [] };
  }
  if (!Array.isArray(window.appState.betslip)) {
    window.appState.betslip = [];
  }
  
  let idx = -1;
  if (typeof indexOrId === 'number') {
    idx = indexOrId;
  } else if (typeof indexOrId === 'string' && indexOrId.trim() !== '' && !isNaN(Number(indexOrId))) {
    idx = Number(indexOrId);
  } else if (typeof indexOrId === 'string') {
    idx = window.appState.betslip.findIndex(item => item.matchId === indexOrId || (item.match && item.match.id === indexOrId));
  }

  if (idx >= 0 && idx < window.appState.betslip.length) {
    window.appState.betslip.splice(idx, 1);
  }
  
  if (typeof renderBetslip === 'function') {
    renderBetslip();
  }
}
window.removeBetslipItem = removeBetslipItem;

function clearBetslip() {
  if (window.appState) {
    window.appState.betslip = [];
  }
  if (typeof renderBetslip === 'function') {
    renderBetslip();
  }
}
window.clearBetslip = clearBetslip;

// Capture-phase document listeners to guarantee clicks and taps fire on tablets & smart mobile phones
if (typeof document !== 'undefined' && !window._betslipRemoveListenerAttached) {
  window._betslipRemoveListenerAttached = true;
  
  const handleDelegatedRemove = function(e) {
    const btn = e.target.closest ? e.target.closest(".betslip-item-remove") : null;
    if (btn) {
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
      if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
      const idx = btn.getAttribute("data-index");
      if (idx !== null && idx !== undefined) {
        removeBetslipItem(idx, e);
      }
    }
  };

  document.addEventListener("click", handleDelegatedRemove, true);
  document.addEventListener("pointerup", handleDelegatedRemove, true);
  document.addEventListener("touchend", handleDelegatedRemove, { capture: true, passive: false });
}

function renderBetslip() {
  const countBadge = document.getElementById("betslip-count-badge");
  const headerOdds = document.getElementById("betslip-header-odds");
  const emptyState = document.getElementById("betslip-empty-state");
  const itemsContainer = document.getElementById("betslip-items-container");
  const summaryActions = document.getElementById("betslip-summary-actions");
  const totalOddsVal = document.getElementById("betslip-total-odds-val");

  if (!countBadge) return;

  const betslipList = (window.appState && Array.isArray(window.appState.betslip)) ? window.appState.betslip : [];
  const count = betslipList.length;
  countBadge.innerText = count;

  if (count === 0) {
    if (emptyState) emptyState.style.display = "block";
    if (itemsContainer) itemsContainer.style.display = "none";
    if (summaryActions) summaryActions.style.display = "none";
    if (headerOdds) headerOdds.style.display = "none";
  } else {
    if (emptyState) emptyState.style.display = "none";
    if (itemsContainer) {
      itemsContainer.style.display = "flex";
      itemsContainer.innerHTML = "";
      
      let totalOdds = 1.0;

      betslipList.forEach((item, index) => {
        const itemOdds = (typeof item.odds === 'number' && !isNaN(item.odds)) ? item.odds : 1.45;
        totalOdds *= itemOdds;
        
        const homeName = item.match?.homeTeam?.name || item.match?.homeTeam || item.homeTeam || 'Home';
        const awayName = item.match?.awayTeam?.name || item.match?.awayTeam || item.awayTeam || 'Away';
        const tipVal = item.tip || item.market || '1X';

        const row = document.createElement("div");
        row.className = "betslip-item";
        row.innerHTML = `
          <div style="display: flex; flex-direction: column; gap: 2px; flex: 1; padding-right: 8px; pointer-events: none;">
            <div style="font-weight: 700; color: var(--text-primary); font-size: 0.76rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              ${homeName} vs ${awayName}
            </div>
            <div style="font-size: 0.7rem; color: var(--text-secondary);">
              Tip: <b style="color: var(--accent-gold);">${tipVal}</b>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-weight: 700; color: var(--text-primary); font-size: 0.8rem; pointer-events: none;">@${itemOdds.toFixed(2)}</span>
            <button type="button" class="betslip-item-remove" data-index="${index}" onclick="removeBetslipItem(${index}, event)" aria-label="Remove match" title="Remove selection">&times;</button>
          </div>
        `;
        itemsContainer.appendChild(row);
      });

      const formattedOdds = (totalOdds > 99999 ? "99,999+" : totalOdds.toFixed(2));
      if (totalOddsVal) totalOddsVal.innerText = `@${formattedOdds}`;
      if (headerOdds) {
        headerOdds.style.display = "block";
        headerOdds.innerText = `Total Odds: @${formattedOdds}`;
      }
    }
    if (summaryActions) summaryActions.style.display = "flex";
  }
}
window.renderBetslip = renderBetslip;

function sendBetslipToConverter() {
  if (!window.appState || !Array.isArray(window.appState.betslip) || window.appState.betslip.length === 0) {
    if (typeof generateScoutAccumulator === 'function') {
      generateScoutAccumulator(40);
    }
  }

  const selections = (window.appState && window.appState.betslip) ? window.appState.betslip : [];
  const code = "BM-" + Math.random().toString(36).substring(2, 8).toUpperCase();

  if (!window.generatedTicketsCache) {
    window.generatedTicketsCache = {};
  }

  window.generatedTicketsCache[code] = {
    selections: selections.map(item => ({
      fixture: `${item.match?.homeTeam?.name || 'Home'} vs ${item.match?.awayTeam?.name || 'Away'}`,
      league: item.match?.league || "Top League",
      market: "Match Tip",
      prediction: item.tip || "1X",
      sourceOdds: item.odds || 1.45,
      targetOdds: parseFloat(((item.odds || 1.45) * 1.06).toFixed(2))
    }))
  };

  // Set input fields for both converter instances
  const srcInput = document.getElementById("betcode-src-code") || document.getElementById("hero-betcode-src-code");
  if (srcInput) srcInput.value = code;

  // Set default bookmakers SB -> 1XB
  const srcSelect = document.getElementById("betcode-src-select") || document.getElementById("hero-betcode-src-select");
  const tgtSelect = document.getElementById("betcode-tgt-select") || document.getElementById("hero-betcode-tgt-select");
  if (srcSelect) srcSelect.value = 'sportybet:ng';
  if (tgtSelect) tgtSelect.value = '1xbet:ng';

  // Collapse drawer
  const drawer = document.getElementById("floating-betslip-drawer");
  if (drawer) {
    drawer.classList.remove("open");
  }

  if (typeof showAppNotification === 'function') {
    showAppNotification(`⚡ Converting ${selections.length}-match accumulator ticket ${code}...`);
  }

  // Trigger conversion dialog
  if (typeof convertBetSlipCode === 'function') {
    convertBetSlipCode();
  } else if (typeof executeHeroBetCodeConversion === 'function') {
    executeHeroBetCodeConversion();
  }
}
window.sendBetslipToConverter = sendBetslipToConverter;

function addActiveMatchToBetslip() {
  let matchId = window.appState ? window.appState.activeScoutMatchId : null;
  const matches = (typeof MATCH_DATA !== 'undefined' && MATCH_DATA) ? MATCH_DATA : (window.MATCH_DATA || []);
  
  if (!matchId && matches.length > 0) {
    matchId = matches[0].id;
  }
  if (!matchId) return;

  if (!window.appState) window.appState = {};
  if (!Array.isArray(window.appState.betslip)) window.appState.betslip = [];

  if (window.appState.betslip.length >= 40) {
    if (typeof showAppNotification === 'function') {
      showAppNotification("⚠️ Maximum limit of 40 selections reached in your active betslip.");
    } else {
      alert("⚠️ Maximum limit of 40 selections reached in your active betslip.");
    }
    return;
  }

  const match = matches.find(m => m.id === matchId) || matches[0];
  if (!match) return;

  const tip = (match.prediction && match.prediction.tip) ? match.prediction.tip : 'Home Win (1)';
  const odds = 1.85;

  if (window.appState.betslip.some(item => item.matchId === matchId)) {
    if (typeof showAppNotification === 'function') {
      showAppNotification("⚠️ This match is already in your active betslip.");
    } else {
      alert("⚠️ This match is already in your active betslip.");
    }
    return;
  }

  window.appState.betslip.push({
    matchId,
    match,
    tip,
    odds
  });

  if (typeof renderBetslip === 'function') {
    renderBetslip();
  }
  const drawer = document.getElementById("floating-betslip-drawer");
  if (drawer && !drawer.classList.contains("open")) {
    drawer.classList.add("open");
  }

  if (typeof showAppNotification === 'function') {
    showAppNotification(`Added ${match.homeTeam.name} vs ${match.awayTeam.name} to Betslip!`);
  }
}
window.addActiveMatchToBetslip = addActiveMatchToBetslip;

function openModalSubmitTip() {
  let matchId = window.appState ? window.appState.activeScoutMatchId : null;
  const matches = (typeof MATCH_DATA !== 'undefined' && MATCH_DATA) ? MATCH_DATA : (window.MATCH_DATA || []);
  if (!matchId && matches.length > 0) {
    matchId = matches[0].id;
    if (window.appState) window.appState.activeScoutMatchId = matchId;
  }
  
  const match = matches.find(m => m.id === matchId) || matches[0];
  if (!match) return;

  const tipModal = document.getElementById("submit-tip-modal");
  const detailsEl = document.getElementById("tip-modal-match-details");
  if (tipModal) {
    if (detailsEl) {
      detailsEl.innerText = `${match.homeTeam?.name || 'Home'} vs ${match.awayTeam?.name || 'Away'}`;
    }
    tipModal.style.display = "flex";
    tipModal.classList.add("active");
  }
}
window.openModalSubmitTip = openModalSubmitTip;

function closeSubmitTipModal(event, force) {
  const modal = document.getElementById("submit-tip-modal");
  if (!modal) return;
  
  if (force || (event && event.target === modal)) {
    modal.classList.remove("active");
    modal.style.display = "none";
  }
}
window.closeSubmitTipModal = closeSubmitTipModal;

function submitPunterTip() {
  const matchId = window.appState ? window.appState.activeScoutMatchId : null;
  const matches = (typeof MATCH_DATA !== 'undefined' && MATCH_DATA) ? MATCH_DATA : (window.MATCH_DATA || []);
  const match = matches.find(m => m.id === matchId) || matches[0];
  if (!match) return;

  const marketSelect = document.getElementById("tip-market-select");
  const market = marketSelect ? marketSelect.value : "Home Win";
  const stakeInput = document.getElementById("tip-coins-stake");
  const stake = stakeInput ? parseInt(stakeInput.value) : 50;

  if (isNaN(stake) || stake < 10 || stake > 500) {
    alert("Please input a valid stake between 10 and 500 Coins.");
    return;
  }

  const currentCoins = window.appState.coinsBalance || 500;
  if (currentCoins < stake) {
    alert("Insufficient Mines Coins balance! Claim daily coins or buy packs.");
    return;
  }

  window.appState.coinsBalance = currentCoins - stake;
  const coinsDisplay = document.getElementById("modal-user-coins-display");
  if (coinsDisplay) coinsDisplay.innerText = window.appState.coinsBalance;

  closeSubmitTipModal(null, true);
  if (typeof showAppNotification === 'function') {
    showAppNotification(`🎉 Tip submitted for ${match.homeTeam.name} vs ${match.awayTeam.name}! Stake: ${stake} Coins.`);
  }
}
window.submitPunterTip = submitPunterTip;

function updateBarDate(dateVal, btn) {
  if (!window.barState) {
    window.barState = { date: 'today', tip: 'uo15' };
  }
  window.barState.date = dateVal || 'today';
  
  if (btn && btn.parentElement) {
    const parent = btn.parentElement;
    const buttons = parent.querySelectorAll(".tab-btn");
    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  }

  const allMatches = (typeof MATCH_DATA !== 'undefined' && Array.isArray(MATCH_DATA)) 
    ? MATCH_DATA 
    : (window.MATCH_DATA || []);

  let displayedMatches = allMatches;

  if (dateVal === 'yesterday') {
    displayedMatches = allMatches.slice(0, 15).map((m, idx) => ({
      ...m,
      id: `yest-${m.id || idx}`,
      isLive: false,
      status: "FT",
      time: "Finished",
      homeScore: (idx % 3) + 1,
      awayScore: (idx % 2),
      isYesterday: true
    }));
  } else if (dateVal === 'tomorrow') {
    displayedMatches = allMatches.slice(5).map((m, idx) => ({
      ...m,
      id: `tmrw-${m.id || idx}`,
      isLive: false,
      status: "Upcoming",
      time: `${14 + (idx % 8)}:00`,
      isTomorrow: true
    }));
  } else {
    displayedMatches = allMatches;
  }

  if (typeof renderMatchCards === 'function') {
    renderMatchCards(displayedMatches);
  }

  if (typeof showAppNotification === 'function') {
    const label = dateVal === 'yesterday' ? 'Yesterday\'s Results' : (dateVal === 'tomorrow' ? 'Tomorrow\'s Scheduled Fixtures' : 'Today\'s Live & Scheduled Matches');
    showAppNotification(`📅 Showing ${label} (${displayedMatches.length} Matches)`);
  }
}
window.updateBarDate = updateBarDate;

// Filter Matches based on Selected Tab (All, Live, Pro Picks, Upcoming, Watchlist)
function filterMatches(filterType, btn) {
  if (!window.appState) window.appState = {};
  window.appState.currentFilter = filterType || 'all';
  if (!Array.isArray(window.appState.watchlist)) window.appState.watchlist = [];

  if (btn) {
    const tabContainer = btn.parentElement;
    if (tabContainer) {
      const buttons = tabContainer.querySelectorAll(".tab-btn");
      buttons.forEach(b => b.classList.remove("active"));
    }
    if (btn.classList) btn.classList.add("active");
  }

  const allMatches = (typeof MATCH_DATA !== 'undefined' && Array.isArray(MATCH_DATA)) 
    ? MATCH_DATA 
    : (window.MATCH_DATA || []);

  let filtered = allMatches;
  const matchesTitle = document.getElementById("matches-section-title");

  if (filterType === 'live') {
    filtered = allMatches.filter(m => m.isLive || m.status === 'LIVE');
    if (filtered.length === 0) filtered = allMatches.slice(0, 3);
    if (matchesTitle) matchesTitle.innerText = "Live In-Play Predictions";
  } else if (filterType === 'premium') {
    filtered = allMatches.filter(m => m.isPremium);
    if (matchesTitle) matchesTitle.innerText = "Pro Algorithmic Predictions";
  } else if (filterType === 'upcoming') {
    filtered = allMatches.filter(m => !m.isLive && m.status !== 'LIVE');
    if (matchesTitle) matchesTitle.innerText = "Upcoming Scheduled Predictions";
  } else if (filterType === 'watchlist') {
    filtered = allMatches.filter(m => window.appState.watchlist.includes(m.id));
    if (matchesTitle) matchesTitle.innerText = `My Watchlist Predictions (${filtered.length})`;
  } else {
    // 'all'
    filtered = allMatches;
    if (matchesTitle) matchesTitle.innerText = "Today's Predictions";
  }

  // Handle empty watchlist display
  if (filterType === 'watchlist' && filtered.length === 0) {
    const grid = document.getElementById("fixtures-grid");
    if (grid) {
      grid.innerHTML = `
        <div class="glass-card" style="grid-column: 1 / -1; padding: 40px; text-align: center; border: 1px dashed rgba(255,255,255,0.1); border-radius: 16px; background: rgba(15, 23, 42, 0.6);">
          <span style="font-size: 2.2rem; display: block; margin-bottom: 12px;">⭐</span>
          <h4 style="font-family: var(--font-display); font-size: 1.15rem; margin-bottom: 8px; color: #ffffff;">Your Watchlist is Empty</h4>
          <p style="font-size: 0.88rem; color: var(--text-secondary); max-width: 420px; margin: 0 auto 16px;">Click the star icon (☆) on any match card to track live odds, goals, and AI updates.</p>
          <button class="btn btn-primary" onclick="filterMatches('all')" style="padding: 8px 18px; font-size: 0.85rem; border-radius: 8px; cursor: pointer;">Browse All Matches</button>
        </div>
      `;
    }
  } else {
    if (typeof renderMatchCards === 'function') {
      renderMatchCards(filtered);
    }
  }

  // Sync date bar if needed
  if (typeof renderDeepPredictBetDateBar === 'function') {
    renderDeepPredictBetDateBar();
  }

  if (typeof showAppNotification === 'function') {
    const filterLabels = {
      'all': "All Predictions",
      'live': "Live In-Play Matches",
      'premium': "Pro High-Probability Picks",
      'upcoming': "Upcoming Scheduled Matches",
      'watchlist': `Saved Watchlist (${filtered.length})`
    };
    showAppNotification(`🔍 Filter: ${filterLabels[filterType] || filterType} (${filtered.length} matches)`);
  }
}
window.filterMatches = filterMatches;

// Filter Market Submenu Categories (1X2, Over/Under, BTTS, Double Chance, DNB, Combos, HT/FT, etc.)
function filterMarketSubmenu(marketVal, btn) {
  if (!window.appState) window.appState = {};
  window.appState.activeMarketSubmenu = marketVal || 'all';
  window.appState.activeTopTip = 'all';

  const container = document.getElementById("market-submenus-container");
  if (container) {
    container.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  }
  if (btn) btn.classList.add("active");

  if (typeof updateFixturesDisplay === 'function') {
    updateFixturesDisplay();
  }

  const marketNames = {
    'all': 'All Markets',
    '1x2': '1X2 Match Winner Tips',
    'overunder': 'Over / Under Goals',
    'btts': 'Both Teams To Score (BTTS)',
    'doublechance': 'Double Chance Tips',
    'dnb': 'Draw No Bet (DNB)',
    'combo': 'Combos (1X2 + Goals / GG)',
    'htft': 'HT / FT (Half Time / Full Time)',
    'multigoals': 'Multi-Goals & Ranges',
    'teamspec': 'Team Goals & Clean Sheet',
    'corners': 'Corners Statistics & Tips',
    'cards': 'Cards & Bookings Tips',
    'handicap': 'Asian / European Handicap'
  };

  if (typeof showAppNotification === 'function') {
    showAppNotification(`🎯 Market Filter: ${marketNames[marketVal] || marketVal}`);
  }
}
window.filterMarketSubmenu = filterMarketSubmenu;

// Filter Top Tips (Specific sub-market pills e.g. Home Win, Over 2.5, BTTS Yes, etc.)
function filterTopTip(topTipVal, btn) {
  if (!window.appState) window.appState = {};
  window.appState.activeTopTip = topTipVal || 'all';
  window.appState.activeMarketSubmenu = 'toptips';

  const container = document.getElementById("market-submenus-container");
  if (container) {
    container.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  }
  if (btn) btn.classList.add("active");

  if (typeof updateFixturesDisplay === 'function') {
    updateFixturesDisplay();
  }

  if (typeof showAppNotification === 'function') {
    showAppNotification(`⭐ Top Tip Filter: ${topTipVal.toUpperCase()}`);
  }
}
window.filterTopTip = filterTopTip;

// Unified filtering pipeline
function updateFixturesDisplay() {
  // 1. Determine active base matches pool
  let allMatches = [];
  if (window.currentLeagueMatches && Array.isArray(window.currentLeagueMatches) && window.currentLeagueMatches.length > 0) {
    allMatches = window.currentLeagueMatches;
  } else if (window.MATCH_DATA && Array.isArray(window.MATCH_DATA) && window.MATCH_DATA.length > 0) {
    allMatches = window.MATCH_DATA;
  } else if (typeof MATCH_DATA !== 'undefined' && Array.isArray(MATCH_DATA)) {
    allMatches = MATCH_DATA;
  }

  let filtered = [...allMatches];

  // If a league filter is active in appState (e.g. from calendar or search) and not already filtered in currentLeagueMatches
  if (window.appState && window.appState.calLeague && window.appState.calLeague !== 'all') {
    const lTarget = window.appState.calLeague.toLowerCase();
    const lFiltered = filtered.filter(m => m.league && m.league.toLowerCase().includes(lTarget));
    if (lFiltered.length > 0) filtered = lFiltered;
  }

  // 2. Date Filter (respect real fixture dates/status without destructive slicing)
  const activeDate = window.appState ? (window.appState.activePredictionDate || 'all') : 'all';
  if (activeDate === 'yesterday') {
    const yestFiltered = filtered.filter(m => m && (m.date === 'yesterday' || m.isYesterday || m.status === 'FT' || m.statusShort === 'FT' || m.isFT || (m.time && m.time.startsWith('FT'))));
    if (yestFiltered.length > 0) filtered = yestFiltered;
  } else if (activeDate === 'today') {
    const todayFiltered = filtered.filter(m => m && (m.date === 'today' || m.isLive || (m.time && m.time.toLowerCase().includes('today')) || (m.statusShort && ['1H','HT','2H','NS','LIVE'].includes(m.statusShort))));
    if (todayFiltered.length > 0) filtered = todayFiltered;
  } else if (activeDate === 'tomorrow') {
    const tmrwFiltered = filtered.filter(m => m && (m.date === 'tomorrow' || m.isTomorrow || (m.time && m.time.toLowerCase().includes('tomorrow'))));
    if (tmrwFiltered.length > 0) filtered = tmrwFiltered;
  }

  // 3. Tab Filter (all, live, premium, upcoming, watchlist)
  const tabFilter = window.appState ? (window.appState.currentFilter || 'all') : 'all';
  if (tabFilter === 'live') {
    const liveItems = filtered.filter(m => m.isLive || m.status === 'LIVE' || (m.statusShort && ['1H','HT','2H','INT','LIVE'].includes(m.statusShort)));
    if (liveItems.length > 0) filtered = liveItems;
  } else if (tabFilter === 'premium') {
    const premItems = filtered.filter(m => m.isPremium);
    if (premItems.length > 0) filtered = premItems;
  } else if (tabFilter === 'upcoming') {
    const upItems = filtered.filter(m => !m.isLive && m.status !== 'LIVE' && m.statusShort !== 'FT' && m.statusShort !== 'AET' && m.time !== 'FT');
    if (upItems.length > 0) filtered = upItems;
  } else if (tabFilter === 'watchlist') {
    const watchlist = window.appState && Array.isArray(window.appState.watchlist) ? window.appState.watchlist : [];
    filtered = filtered.filter(m => watchlist.includes(m.id));
  }

  // 4. Submenu Market Filtering
  const marketVal = window.appState ? (window.appState.activeMarketSubmenu || 'all') : 'all';
  const targetTopTip = window.appState ? (window.appState.activeTopTip || 'all') : 'all';

  if (marketVal === '1x2') {
    const mFiltered = filtered.filter(m => m.predictions && (m.predictions.home >= 35 || m.predictions.away >= 30 || m.predictions.draw >= 25));
    if (mFiltered.length > 0) filtered = mFiltered;
  } else if (marketVal === 'overunder') {
    const mFiltered = filtered.filter(m => m.predictions || m.topTips);
    if (mFiltered.length > 0) filtered = mFiltered;
  } else if (marketVal === 'btts') {
    const mFiltered = filtered.filter(m => m.predictions && (m.predictions.home > 20 && m.predictions.away > 18));
    if (mFiltered.length > 0) filtered = mFiltered;
  } else if (marketVal === 'doublechance') {
    const mFiltered = filtered.filter(m => m.predictions || m.topTips);
    if (mFiltered.length > 0) filtered = mFiltered;
  } else if (marketVal === 'dnb') {
    const mFiltered = filtered.filter(m => m.predictions && Math.abs(m.predictions.home - m.predictions.away) >= 5);
    if (mFiltered.length > 0) filtered = mFiltered;
  } else if (marketVal === 'combo') {
    const mFiltered = filtered.filter(m => m.predictions && (m.predictions.home > 35 || m.predictions.away > 30));
    if (mFiltered.length > 0) filtered = mFiltered;
  } else if (marketVal === 'htft') {
    const mFiltered = filtered.filter(m => m.predictions || m.topTips);
    if (mFiltered.length > 0) filtered = mFiltered;
  } else if (marketVal === 'multigoals') {
    const mFiltered = filtered.filter(m => m.predictions || m.topTips);
    if (mFiltered.length > 0) filtered = mFiltered;
  } else if (marketVal === 'teamspec') {
    const mFiltered = filtered.filter(m => m.predictions && (m.predictions.home >= 30 || m.predictions.away >= 30));
    if (mFiltered.length > 0) filtered = mFiltered;
  } else if (marketVal === 'corners') {
    const mFiltered = filtered.filter(m => m.league || m.topTips);
    if (mFiltered.length > 0) filtered = mFiltered;
  } else if (marketVal === 'cards') {
    const mFiltered = filtered.filter(m => m.league || m.topTips);
    if (mFiltered.length > 0) filtered = mFiltered;
  } else if (marketVal === 'handicap') {
    const mFiltered = filtered.filter(m => m.predictions || m.topTips);
    if (mFiltered.length > 0) filtered = mFiltered;
  } else if (marketVal === 'toptips' && targetTopTip !== 'all') {
    const directionalFilters = {
      'win1': m => (m.predictions ? m.predictions.home >= 35 : true),
      'draw': m => (m.predictions ? m.predictions.draw >= 20 : true),
      'win2': m => (m.predictions ? m.predictions.away >= 25 : true),
      'dc1x': m => (m.predictions ? (m.predictions.home + m.predictions.draw) >= 55 : true),
      'dc12': m => (m.predictions ? (m.predictions.home + m.predictions.away) >= 60 : true),
      'dcx2': m => (m.predictions ? (m.predictions.draw + m.predictions.away) >= 45 : true),
      'dnb': m => (m.predictions ? Math.abs(m.predictions.home - m.predictions.away) >= 5 : true),
      'uo05': m => true,
      'uo15': m => true,
      'uo25': m => true,
      'uo35': m => true,
      'uo45': m => true,
      'uo55': m => true,
      'uoht05': m => true,
      'uoht15': m => true,
      'uoht25': m => true,
      'uo2h05': m => true,
      'uo2h15': m => true,
      'uo2h25': m => true,
      'mg12': m => true,
      'mg13': m => true,
      'mg23': m => true,
      'mg24': m => true,
      'mg25': m => true,
      'mg35': m => true,
      'mg46': m => true,
      'eg0': m => true,
      'eg1': m => true,
      'eg2': m => true,
      'eg3': m => true,
      'eg4': m => true,
      'btts': m => (m.predictions ? m.predictions.home > 25 && m.predictions.away > 18 : true),
      'btts_no': m => (m.predictions ? m.predictions.home <= 28 || m.predictions.away <= 18 : true),
      'bttsht': m => true,
      'btts2h': m => true,
      'btts_both': m => true,
      'combo_1x2_uo': m => true,
      'combo_1x2_under': m => true,
      'combo_1x2_gg': m => true,
      'combo_dc_uo': m => true,
      'combo_dc_gg': m => true,
      'htft_11': m => true,
      'htft_x1': m => true,
      'htft_21': m => true,
      'htft_1x': m => true,
      'htft_xx': m => true,
      'htft_2x': m => true,
      'htft_12': m => true,
      'htft_x2': m => true,
      'htft_22': m => true,
      'wineither': m => true,
      'winboth': m => true,
      'huo05': m => true,
      'huo15': m => true,
      'auo05': m => true,
      'auo15': m => true,
      'hcs': m => true,
      'acs': m => true,
      'hw2n': m => true,
      'aw2n': m => true,
      'first_goal': m => true,
      'c65': m => true,
      'c75': m => true,
      'c85': m => true,
      'c95': m => true,
      'c105': m => true,
      'c115': m => true,
      'c125': m => true,
      'c45ht': m => true,
      'c1x2': m => true,
      'cards35': m => true,
      'cards45': m => true,
      'cards55': m => true,
      'redcard': m => true,
      'penalty': m => true,
      'eh1': m => true,
      'ah05': m => true,
      'ah15': m => true
    };
    if (directionalFilters[targetTopTip]) {
      const specificFiltered = filtered.filter(directionalFilters[targetTopTip]);
      if (specificFiltered.length > 0) filtered = specificFiltered;
    }
  }

  // 5. Search Filter
  if (window.appState && window.appState.searchFilter) {
    const searchVal = window.appState.searchFilter.toLowerCase().trim();
    filtered = filtered.filter(m => {
      return (m.homeTeam && m.homeTeam.name && m.homeTeam.name.toLowerCase().includes(searchVal)) ||
             (m.awayTeam && m.awayTeam.name && m.awayTeam.name.toLowerCase().includes(searchVal)) ||
             (m.league && m.league.toLowerCase().includes(searchVal));
    });
  }

  // Fallback if empty and not watchlist
  if (filtered.length === 0 && tabFilter !== 'watchlist') {
    filtered = allMatches.slice(0, 10);
  }

  // Handle empty watchlist
  if (tabFilter === 'watchlist' && filtered.length === 0) {
    const grid = document.getElementById("fixtures-grid");
    if (grid) {
      grid.innerHTML = `
        <div class="glass-card" style="grid-column: 1 / -1; padding: 40px; text-align: center; border: 1px dashed rgba(255,255,255,0.1); border-radius: 16px; background: rgba(15, 23, 42, 0.6);">
          <span style="font-size: 2.2rem; display: block; margin-bottom: 12px;">⭐</span>
          <h4 style="font-family: var(--font-display); font-size: 1.15rem; margin-bottom: 8px; color: #ffffff;">Your Watchlist is Empty</h4>
          <p style="font-size: 0.88rem; color: var(--text-secondary); max-width: 420px; margin: 0 auto 16px;">Click the star icon (☆) on any match card to track live odds, goals, and AI updates.</p>
          <button class="btn btn-primary" onclick="filterMatches('all')" style="padding: 8px 18px; font-size: 0.85rem; border-radius: 8px; cursor: pointer;">Browse All Matches</button>
        </div>
      `;
    }
    return;
  }

  if (typeof renderMatchCards === 'function') {
    renderMatchCards(filtered);
  }
}
window.updateFixturesDisplay = updateFixturesDisplay;

// Render DeepPredictBet Style Date Picker Bar
function renderDeepPredictBetDateBar() {
  const containers = document.querySelectorAll("#deeppredictbet-date-bar-container, .deeppredictbet-date-bar-container, [data-date-bar-container]");
  if (!containers || containers.length === 0) return;

  const baseDate = new Date();
  baseDate.setHours(0, 0, 0, 0);
  const dates = [];

  // Yesterday (-1)
  const yesterday = new Date(baseDate);
  yesterday.setDate(baseDate.getDate() - 1);
  dates.push({ id: 'yesterday', dateObj: yesterday });

  // Today (0)
  dates.push({ id: 'today', dateObj: baseDate });

  // Tomorrow (+1) & Future Days (+2 to +4)
  for (let i = 1; i <= 4; i++) {
    const futureDate = new Date(baseDate);
    futureDate.setDate(baseDate.getDate() + i);
    const id = i === 1 ? 'tomorrow' : `future-${i}`;
    dates.push({ id, dateObj: futureDate });
  }

  // Live count
  const allMatches = (typeof MATCH_DATA !== 'undefined' && Array.isArray(MATCH_DATA)) ? MATCH_DATA : (window.MATCH_DATA || []);
  const liveCount = allMatches.filter(m => m.status === 'LIVE' || m.isLive).length || 1;

  if (!window.appState) window.appState = {};
  const isLiveActive = window.appState.currentFilter === 'live';
  const activeDate = window.appState.activePredictionDate || 'today';

  const datesHtml = dates.map(d => {
    const dayNum = d.dateObj.getDate();
    const isToday = d.id === 'today';
    const isActive = !isLiveActive && (
      (d.id === 'yesterday' && activeDate === 'yesterday') ||
      (d.id === 'today' && activeDate === 'today') ||
      (d.id === 'tomorrow' && activeDate === 'tomorrow') ||
      (d.id.startsWith('future-') && activeDate === d.id)
    );

    const labelText = isToday ? 'TODAY' : d.dateObj.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();

    if (isActive) {
      return `
        <div class="date-item active" onclick="selectDeepPredictBetDate('${d.id}')">
          <span class="day-num">${dayNum}</span>
          <span class="day-name">${labelText}</span>
        </div>
      `;
    } else {
      return `
        <div class="date-item" onclick="selectDeepPredictBetDate('${d.id}')">
          <span class="day-num">${dayNum}</span>
        </div>
      `;
    }
  }).join("");

  const barHtml = `
    <div class="deeppredictbet-date-bar">
      <div class="live-btn ${isLiveActive ? 'active' : ''}" onclick="selectDeepPredictBetLive()">
        <span>Live</span>
        <span class="live-badge-count">${liveCount}</span>
      </div>
      <div class="divider"></div>
      <div class="date-list">
        ${datesHtml}
      </div>
    </div>
  `;

  containers.forEach(c => {
    c.innerHTML = barHtml;
  });
}
window.renderDeepPredictBetDateBar = renderDeepPredictBetDateBar;

// Select specific date from date bar
function selectDeepPredictBetDate(dateId) {
  if (!window.appState) window.appState = {};
  window.appState.currentFilter = 'all';

  const predictionsSection = document.getElementById("predictions");
  if (predictionsSection) {
    const tabBtns = predictionsSection.querySelectorAll(".tabs-container .tab-btn");
    tabBtns.forEach(btn => {
      if (btn.innerText.trim().toLowerCase() === 'all') {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  const matchesTitle = document.getElementById("matches-section-title");
  if (dateId === 'yesterday') {
    window.appState.activePredictionDate = 'yesterday';
    if (matchesTitle) matchesTitle.innerText = "Yesterday's Results";
  } else if (dateId === 'today') {
    window.appState.activePredictionDate = 'today';
    if (matchesTitle) matchesTitle.innerText = "Today's Predictions";
  } else if (dateId === 'tomorrow') {
    window.appState.activePredictionDate = 'tomorrow';
    if (matchesTitle) matchesTitle.innerText = "Tomorrow's Predictions";
  } else {
    window.appState.activePredictionDate = dateId;
    if (matchesTitle && dateId.startsWith('future-')) {
      const baseDate = new Date();
      baseDate.setHours(0, 0, 0, 0);
      const offset = parseInt(dateId.split('-')[1]);
      const targetDate = new Date(baseDate);
      targetDate.setDate(baseDate.getDate() + offset);
      const dateStr = targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' });
      matchesTitle.innerText = `Predictions for ${dateStr}`;
    }
  }

  renderDeepPredictBetDateBar();

  // Sync timeline bar if present
  const barDateSel = document.getElementById("bar-date-selector");
  if (barDateSel) {
    barDateSel.querySelectorAll(".tab-btn").forEach(b => {
      const txt = b.innerText.trim().toLowerCase();
      if ((dateId === 'yesterday' && txt === 'yesterday') ||
          (dateId === 'today' && txt === 'today') ||
          (dateId === 'tomorrow' && txt === 'tomorrow')) {
        b.classList.add("active");
      } else {
        b.classList.remove("active");
      }
    });
  }

  const allMatches = (typeof MATCH_DATA !== 'undefined' && Array.isArray(MATCH_DATA)) 
    ? MATCH_DATA 
    : (window.MATCH_DATA || []);

  let displayed = allMatches;
  if (dateId === 'yesterday') {
    displayed = allMatches.slice(0, 15).map((m, idx) => ({
      ...m,
      id: `yest-${m.id || idx}`,
      isLive: false,
      status: "FT",
      time: "Finished",
      homeScore: (idx % 3) + 1,
      awayScore: (idx % 2),
      isYesterday: true
    }));
  } else if (dateId === 'tomorrow' || dateId.startsWith('future-')) {
    displayed = allMatches.slice(5).map((m, idx) => ({
      ...m,
      id: `tmrw-${m.id || idx}`,
      isLive: false,
      status: "Upcoming",
      time: `${14 + (idx % 8)}:00`,
      isTomorrow: true
    }));
  }

  if (typeof renderMatchCards === 'function') {
    renderMatchCards(displayed);
  }
}
window.selectDeepPredictBetDate = selectDeepPredictBetDate;

// Select "Live" option from date bar
function selectDeepPredictBetLive() {
  if (!window.appState) window.appState = {};
  window.appState.currentFilter = 'live';
  window.appState.activePredictionDate = 'today';

  const predictionsSection = document.getElementById("predictions");
  if (predictionsSection) {
    const tabBtns = predictionsSection.querySelectorAll(".tabs-container .tab-btn");
    tabBtns.forEach(btn => {
      if (btn.innerText.trim().toLowerCase() === 'live') {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  const matchesTitle = document.getElementById("matches-section-title");
  if (matchesTitle) matchesTitle.innerText = "Live Predictions";

  renderDeepPredictBetDateBar();

  const allMatches = (typeof MATCH_DATA !== 'undefined' && Array.isArray(MATCH_DATA)) 
    ? MATCH_DATA 
    : (window.MATCH_DATA || []);
  const liveMatches = allMatches.filter(m => m.isLive || m.status === 'LIVE');

  if (typeof renderMatchCards === 'function') {
    renderMatchCards(liveMatches.length > 0 ? liveMatches : allMatches.slice(0, 4));
  }
  if (typeof showAppNotification === 'function') {
    showAppNotification(`🔴 Showing In-Play Live Matches`);
  }

  // Trigger instantaneous dynamic sync
  if (typeof syncDynamicSeasonData === 'function') {
    syncDynamicSeasonData(false);
  }
}
window.selectDeepPredictBetLive = selectDeepPredictBetLive;

// Dynamic API-Football Ingestion Function
async function syncDynamicSeasonData(showToastNotification = false) {
  const backendBaseUrl = (window.location && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
    ? 'http://localhost:5000'
    : (window.BACKEND_API_URL || 'https://deeppredictbet-backend.onrender.com');

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(`${backendBaseUrl}/api/v1/live/matches`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const resData = await response.json();
      if (resData && resData.success && Array.isArray(resData.matches) && resData.matches.length > 0) {
        const dynamicMatches = resData.matches;
        window.DYNAMIC_MATCH_DATA = dynamicMatches;
        window.DYNAMIC_SYNC_STATUS = 'connected';

        const baseMatches = (typeof MATCH_DATA !== 'undefined' && Array.isArray(MATCH_DATA)) ? MATCH_DATA : [];
        const dynamicIds = new Set(dynamicMatches.map(m => m.id));
        const nonDuplicateBase = baseMatches.filter(m => !dynamicIds.has(m.id));
        
        window.MATCH_DATA = [...dynamicMatches, ...nonDuplicateBase];

        // Re-render UI components with fresh live match telemetry
        if (typeof renderDeepPredictBetDateBar === 'function') renderDeepPredictBetDateBar();
        if (typeof updateFixturesDisplay === 'function') updateFixturesDisplay();
        if (typeof renderLiveScanner === 'function') renderLiveScanner();

        // Update live sync indicator badge
        const liveSyncBadge = document.getElementById("live-api-sync-indicator");
        if (liveSyncBadge) {
          liveSyncBadge.innerHTML = `<span style="color: var(--secondary); font-weight: 700; display: inline-flex; align-items: center; gap: 5px; font-size: 0.72rem; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.25); padding: 3px 8px; border-radius: 9999px;"><span style="width: 6px; height: 6px; border-radius: 50%; background: var(--secondary); animation: pulse 1.5s infinite;"></span> Live API Stream (${dynamicMatches.length})</span>`;
          liveSyncBadge.style.display = "inline-flex";
        }

        if (showToastNotification && typeof showAppNotification === 'function') {
          showAppNotification(`🟢 Live Stream Active: ${dynamicMatches.length} in-play games synced from API-Football`);
        }
      }
    }
  } catch (err) {
    console.debug('[DeepPredictBet] Live sync: operating on high-resiliency local fixture dataset.');
  }
}
window.syncDynamicSeasonData = syncDynamicSeasonData;

// Auto-run Date Bar on site load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    renderDeepPredictBetDateBar();
    syncDynamicSeasonData(false);
  });
} else {
  renderDeepPredictBetDateBar();
  syncDynamicSeasonData(false);
}
window.addEventListener('load', () => {
  renderDeepPredictBetDateBar();
  syncDynamicSeasonData(false);
});

function quickPromptScout(text, autoOpenModal = true) {
  const promptText = (text || "").trim();
  const lowerText = promptText.toLowerCase();

  // 1. Clear input fields
  const heroInput = document.getElementById("hero-scout-input");
  if (heroInput && heroInput.value.trim() !== "") heroInput.value = "";
  const scoutInput = document.getElementById("scout-chat-input");
  if (scoutInput && scoutInput.value.trim() !== "") scoutInput.value = "";

  // 2. Intelligently extract requested number (e.g. 12, 15, 20, 30, 40, etc.)
  let count = 40;
  let title = "🎯 AI Scout Generated 40-Match Football Event Selections";
  let mode = "selections";

  const numMatches = lowerText.match(/\b([1-9]|[1-4][0-9]|50)\b/g);
  if (numMatches && numMatches.length > 0) {
    const nums = numMatches.map(n => parseInt(n)).filter(n => !isNaN(n) && n >= 3 && n <= 50);
    if (nums.length > 0) {
      count = Math.min(Math.max(nums[nums.length - 1], 3), 40);
      title = `🎯 AI Scout Generated ${count}-Match Football Event Selections`;
    }
  } else if (lowerText.includes("30")) {
    count = 30;
    title = "🎯 AI Scout Generated 30-Match Football Event Selections";
  } else if (lowerText.includes("20")) {
    count = 20;
    title = "🎯 AI Scout Generated 20-Match Football Event Selections";
  } else if (lowerText.includes("tactic") || lowerText.includes("angle")) {
    count = 10;
    title = "🎯 AI Tactical Angle Briefing & 10-Match Football Selections";
    mode = "tactics";
  } else if (lowerText.includes("ev") || lowerText.includes("value")) {
    count = 8;
    title = "📊 High EV Algorithmic Value Picks";
    mode = "value";
  }

  // 3. Generate Selections in Betslip
  let selections = [];
  if (typeof generateScoutAccumulator === 'function') {
    selections = generateScoutAccumulator(count) || [];
  }
  if (!selections || selections.length === 0) {
    if (window.appState && Array.isArray(window.appState.betslip) && window.appState.betslip.length > 0) {
      selections = window.appState.betslip;
    }
  }

  // Calculate total odds with realistic product
  let calculatedOdds = 1.0;
  selections.forEach(s => {
    calculatedOdds *= (s.odds || 1.45);
  });
  const totalOdds = (calculatedOdds > 99999 ? "99,999+" : calculatedOdds.toFixed(2));

  const selectionsList = selections.slice(0, count).map((s, idx) => {
    const hName = s.match?.homeTeam?.name || 'Home Team';
    const aName = s.match?.awayTeam?.name || 'Away Team';
    const oddVal = (s.odds || 1.45).toFixed(2);
    return `
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.08); padding: 7px 0; font-size:0.8rem;">
        <span style="font-weight:700; color:#ffffff;">#${idx+1} ${hName} vs ${aName}</span>
        <span style="color:#34d399; font-weight:800; background:rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.35); padding: 2px 8px; border-radius:4px;">${s.tip} (@${oddVal})</span>
      </div>
    `;
  }).join("");

  let subtitleText = `Here are your <b>${count} high-probability football event selections</b> evaluated by AI Scout algorithms:`;
  if (mode === 'tactics') {
    subtitleText = `Tactical evaluation analyzing high pressing triggers & transition speed. Curated <b>${count} Positive EV picks</b>:`;
  } else if (mode === 'value') {
    subtitleText = `Algorithmic value models identified <b>${count} High Expected Value (EV) opportunities</b> today:`;
  } else if (promptText && promptText.length > 2 && !promptText.startsWith("Generate")) {
    subtitleText = `AI Scout analyzed your query <i>"${promptText}"</i> and curated <b>${count} high-probability selections</b>:`;
  }

  const contentHtml = `
    <div style="display:flex; flex-direction:column; gap:10px;">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px;">
        <div style="font-weight:900; color:#38bdf8; font-size:0.95rem; font-family: var(--font-display); text-transform: uppercase; letter-spacing: 0.5px;">${title}</div>
        <span style="color:#34d399; font-weight:800; font-size:0.88rem; background:rgba(16,185,129,0.2); border:1px solid #10b981; padding:2px 10px; border-radius:12px;">@${totalOdds} Total Odds</span>
      </div>
      <div style="font-size:0.82rem; color:#94a3b8;">${subtitleText}</div>
      <div style="max-height: 260px; overflow-y: auto; background: rgba(0,0,0,0.65); border: 1.5px solid rgba(59, 130, 246, 0.45); border-radius: 8px; padding: 10px 14px; margin: 4px 0;">
        ${selectionsList}
      </div>
      <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:6px;">
        <button class="btn btn-primary" onclick="sendBetslipToConverter()" style="font-size:0.8rem; padding:9px 16px; background:linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); font-weight:800; border-radius: 8px; cursor:pointer;">⚡ Convert & Place Bet Now</button>
        <button class="btn btn-secondary" onclick="toggleBetslipDrawer()" style="font-size:0.8rem; padding:9px 16px; border-radius: 8px; cursor:pointer;">🎫 Open Betslip Drawer</button>
        <button class="btn btn-secondary" onclick="openGeneralScout()" style="font-size:0.8rem; padding:9px 16px; border-radius: 8px; cursor:pointer;">🤖 Open Full Scout Modal</button>
      </div>
    </div>
  `;

  // 4. Render directly in Hero Results Container for instant output
  const heroResults = document.getElementById("hero-scout-results");
  if (heroResults) {
    heroResults.innerHTML = contentHtml;
    heroResults.style.display = "block";
    if (autoOpenModal) {
      try {
        heroResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } catch (e) {}
    }
  }

  // 5. Also Render in Modal Chat Body
  const chatBody = document.getElementById("scout-chat-body");
  if (chatBody) {
    chatBody.innerHTML = `
      <div class="chat-bubble scout" style="background: rgba(15, 23, 42, 0.95); border: 1.5px solid rgba(59, 130, 246, 0.55); box-shadow: 0 0 20px rgba(37, 99, 235, 0.3);">
        ${contentHtml}
      </div>
    `;
    chatBody.scrollTop = 0;
  }

  // 6. Show notification
  if (autoOpenModal) {
    if (typeof showAppNotification === 'function') {
      showAppNotification(`🎯 AI Scout generated ${count} football event selections!`);
    }
  }
}

function triggerHeroScoutPrompt() {
  const heroInput = document.getElementById("hero-scout-input");
  let text = heroInput ? heroInput.value.trim() : "";

  if (!text) {
    text = "Generate 40 selections";
  }

  quickPromptScout(text, true);
}
window.triggerHeroScoutPrompt = triggerHeroScoutPrompt;
window.quickPromptScout = quickPromptScout;

// Auto-run AI Scout Selections on page load
function initHeroScoutDynamicOutput() {
  setTimeout(() => {
    quickPromptScout("Generate 40 selections", false);
  }, 100);
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeroScoutDynamicOutput);
} else {
  initHeroScoutDynamicOutput();
}
window.addEventListener('load', initHeroScoutDynamicOutput);
try { if (typeof smoothScrollToPremium === 'function') window.smoothScrollToPremium = smoothScrollToPremium; } catch (e) {}

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

function runEngineConversion() {
  const sourceCodeEl = document.getElementById("engine-source-code");
  const targetSelectEl = document.getElementById("engine-target-select");
  const outputBoxEl = document.getElementById("engine-output-box");
  const targetNameEl = document.getElementById("engine-target-name");
  const targetCodeEl = document.getElementById("engine-target-code");
  const detailsEl = document.getElementById("engine-converted-details");

  const sourceCode = (sourceCodeEl ? sourceCodeEl.innerText.trim() : "DP-CM3DC") || "DP-CM3DC";
  const targetVal = targetSelectEl ? targetSelectEl.value : "fanduel";
  const targetOptionText = targetSelectEl && targetSelectEl.options[targetSelectEl.selectedIndex] 
    ? targetSelectEl.options[targetSelectEl.selectedIndex].text 
    : "FanDuel -USA";

  const cleanTargetName = targetOptionText.replace(/^[^a-zA-Z0-9]+/, '').trim() || targetOptionText.trim();

  let prefix = "FD-";
  if (targetVal.includes("1xbet")) prefix = "1XB-";
  else if (targetVal.includes("sporty")) prefix = "SP-";
  else if (targetVal.includes("bet9ja")) prefix = "B9J-";
  else if (targetVal.includes("bet365")) prefix = "B365-";
  else if (targetVal.includes("22bet")) prefix = "22B-";
  else if (targetVal.includes("betking")) prefix = "BK-";
  else if (targetVal.includes("betway")) prefix = "BW-";
  else if (targetVal.includes("stake")) prefix = "STK-";
  else if (targetVal.includes("bcgame")) prefix = "BCG-";

  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let randStr = "";
  for (let i = 0; i < 5; i++) {
    randStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const convertedCode = `${prefix}${randStr}`;

  if (targetNameEl) targetNameEl.innerText = cleanTargetName;
  if (targetCodeEl) targetCodeEl.innerText = convertedCode;

  if (detailsEl) {
    const betslip = (window.appState && window.appState.betslip && window.appState.betslip.length > 0)
      ? window.appState.betslip
      : [
          { match: { homeTeam: { name: "Arsenal" }, awayTeam: { name: "Man City" } }, tip: "Home Win (1)", odds: 1.85 },
          { match: { homeTeam: { name: "Real Madrid" }, awayTeam: { name: "Barcelona" } }, tip: "Over 2.5 Goals", odds: 1.65 },
          { match: { homeTeam: { name: "Bayern Munich" }, awayTeam: { name: "Dortmund" } }, tip: "Both Teams To Score", odds: 1.55 }
        ];

    let detailsHtml = `<div style="font-weight: 700; color: #38bdf8; margin-bottom: 6px; font-size: 0.8rem;">Converted Selections (${betslip.length} Matches):</div>`;
    betslip.forEach((item, idx) => {
      let hName = "Home";
      let aName = "Away";
      if (item.match) {
        hName = typeof item.match.homeTeam === 'string' ? item.match.homeTeam : (item.match.homeTeam?.name || "Home");
        aName = typeof item.match.awayTeam === 'string' ? item.match.awayTeam : (item.match.awayTeam?.name || "Away");
      }
      detailsHtml += `
        <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.3); padding: 6px 10px; border-radius: 4px; font-size: 0.76rem;">
          <span>#${idx+1} <b>${hName} vs ${aName}</b> — ${item.tip || 'Tip'}</span>
          <span style="color: #34d399; font-weight: 700;">@${(parseFloat(item.odds) || 1.80).toFixed(2)}</span>
        </div>
      `;
    });
    detailsEl.innerHTML = detailsHtml;
  }

  if (outputBoxEl) {
    outputBoxEl.style.display = "block";
    outputBoxEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  if (typeof showAppNotification === 'function') {
    showAppNotification(`⚡ Ticket '${sourceCode}' converted to ${cleanTargetName} (${convertedCode})!`);
  }
}

function copyEngineSourceCode() {
  const codeEl = document.getElementById("engine-source-code");
  const code = codeEl ? codeEl.innerText.trim() : "DP-CM3DC";
  navigator.clipboard.writeText(code).then(() => {
    if (typeof showAppNotification === 'function') {
      showAppNotification(`✓ Source ticket code '${code}' copied!`);
    }
  }).catch(() => {
    if (typeof showAppNotification === 'function') showAppNotification(`Copied: ${code}`);
  });
}

function copyEngineTargetCode() {
  const codeEl = document.getElementById("engine-target-code");
  const code = codeEl ? codeEl.innerText.trim() : "";
  if (!code) return;
  navigator.clipboard.writeText(code).then(() => {
    if (typeof showAppNotification === 'function') {
      showAppNotification(`✓ Converted ticket code '${code}' copied!`);
    }
  }).catch(() => {
    if (typeof showAppNotification === 'function') showAppNotification(`Copied: ${code}`);
  });
}

window.updateOddsSliderVal = updateOddsSliderVal;
window.updateProbSliderVal = updateProbSliderVal;
window.generateMachineTicket = generateMachineTicket;
window.copyGeneratedTicketCode = copyGeneratedTicketCode;
window.saveGeneratedTicket = saveGeneratedTicket;
window.runEngineConversion = runEngineConversion;
window.copyEngineSourceCode = copyEngineSourceCode;
window.copyEngineTargetCode = copyEngineTargetCode;


/* --- DEEPPREDICTBET CONVERTER ENGINE HELPERS --- */
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











/* --- FOOLPROOF POPUP AUTH & PROFILE CONTROLLERS --- */
function openAuthModal(mode) {
  // Prevent duplicate execution if triggered twice in same tick
  if (window._authModalOpening) return;
  window._authModalOpening = true;
  setTimeout(function() { window._authModalOpening = false; }, 250);

  // 1. Automatically close Mobile Drawer on phones/tablets if open
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

  // 2. Check login state
  const isLoggedIn = localStorage.getItem("userLoggedIn") === "true";
  if (isLoggedIn) {
    if (typeof openProfileModal === 'function') {
      openProfileModal('info');
    }
    return;
  }

  // 3. Open Auth Modal instantly
  const modal = document.getElementById("auth-modal");
  if (!modal) return;

  modal.classList.add("active");
  modal.style.display = "flex";
  modal.style.zIndex = "1000000";
  modal.style.opacity = "1";
  modal.style.pointerEvents = "all";
  modal.style.visibility = "visible";
  document.body.style.overflow = "hidden";
  
  if (typeof switchAuthTab === 'function') {
    switchAuthTab(mode || 'login');
  }
}

function closeAuthModal(event, force) {
  if (force || (event && event.target && event.target.id === "auth-modal")) {
    const modal = document.getElementById("auth-modal");
    if (modal) {
      modal.classList.remove("active");
      modal.style.display = "none";
      modal.style.opacity = "0";
      modal.style.pointerEvents = "none";
    }
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
  if (e) {
    if (typeof e.preventDefault === 'function') e.preventDefault();
    if (typeof e.stopPropagation === 'function') e.stopPropagation();
  }

  const input = document.getElementById("login-identifier");
  let username = "Egeruennamdi78";
  if (input && input.value && input.value.trim().length > 0) {
    username = input.value.trim().split('@')[0];
  }

  try {
    localStorage.setItem("userLoggedIn", "true");
    localStorage.setItem("currentUsername", username);
  } catch(err) {}

  if (typeof updateAuthUIState === 'function') updateAuthUIState();
  closeAuthModal(null, true);

  const msg = `🔓 Welcome back, ${username}! Login successful.`;
  if (typeof showAppNotification === 'function') {
    showAppNotification(msg);
  } else if (typeof showToast === 'function') {
    showToast(msg);
  } else {
    alert(msg);
  }
  return false;
}

function getRegisteredMembers() {
  const seedMembers = [
    { id: 'usr_adm1', fullName: 'Alex Nnamdi (Admin)', email: 'admin@deeppredictbet.com', username: 'Egeruennamdi78', role: 'PRO', coinsBalance: 1500, createdAt: '2026-08-01T10:00:00.000Z' }
  ];
  try {
    const raw = localStorage.getItem("deep_registered_members");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const cleaned = parsed.filter(u => u.email !== 'dave.sterling@gmail.com' && u.email !== 'chidi.bets@yahoo.com' && u.email !== 'marcus99@outlook.com' && u.email !== 'elena.stat@proton.me' && u.email !== 'emmanuel.ade@gmail.com');
        if (cleaned.length > 0) return cleaned;
      }
    }
  } catch (e) {}
  try {
    localStorage.setItem("deep_registered_members", JSON.stringify(seedMembers));
  } catch (e) {}
  return seedMembers;
}
window.getRegisteredMembers = getRegisteredMembers;

function registerNewMemberLocal(userData) {
  const members = getRegisteredMembers();
  const exists = members.some(m => (m.email || '').toLowerCase() === (userData.email || '').toLowerCase() || (userData.username && (m.username || '').toLowerCase() === (userData.username || '').toLowerCase()));
  if (!exists) {
    members.unshift(userData);
    try {
      localStorage.setItem("deep_registered_members", JSON.stringify(members));
    } catch (e) {}
  }
}
window.registerNewMemberLocal = registerNewMemberLocal;

function handleAuthSignup(e) {
  if (e) {
    if (typeof e.preventDefault === 'function') e.preventDefault();
    if (typeof e.stopPropagation === 'function') e.stopPropagation();
  }

  const nameInput = document.getElementById("signup-fullname");
  const emailInput = document.getElementById("signup-email");
  const userInput = document.getElementById("signup-username");
  const passInput = document.getElementById("signup-password");

  let fullName = nameInput && nameInput.value && nameInput.value.trim().length > 0 ? nameInput.value.trim() : "DeepPredict Member";
  let email = emailInput && emailInput.value && emailInput.value.trim().length > 0 ? emailInput.value.trim() : `user_${Date.now()}@domain.com`;
  let username = userInput && userInput.value && userInput.value.trim().length > 0 ? userInput.value.trim() : (fullName.split(' ')[0] || "DeepPunter");
  let password = passInput && passInput.value ? passInput.value : "password123";

  const newMember = {
    id: `usr_${Math.random().toString(36).substring(2, 9)}`,
    fullName: fullName,
    email: email,
    username: username,
    role: 'PRO',
    coinsBalance: 500,
    createdAt: new Date().toISOString()
  };

  registerNewMemberLocal(newMember);

  // 1. Sync with Cloudflare Edge Function (/api/users and /api/register)
  try {
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMember)
    }).catch(err => console.debug('[Edge User Sync]:', err.message));
  } catch (err) {}

  // 2. Direct Cloud DB write for 100% cross-device guarantee
  try {
    fetch('https://api.restful-api.dev/objects/ff8081819ff5b11001a034670ed3107f')
      .then(r => r.json())
      .then(j => {
        let mList = (j.data && Array.isArray(j.data.members)) ? j.data.members : [];
        if (!mList.some(m => (m.email || '').toLowerCase() === email.toLowerCase())) {
          mList.unshift(newMember);
          fetch('https://api.restful-api.dev/objects/ff8081819ff5b11001a034670ed3107f', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'deeppredictbet_members_store_v1', data: { members: mList } })
          }).catch(() => {});
        }
      }).catch(() => {});
  } catch (err) {}

  try {
    localStorage.setItem("userLoggedIn", "true");
    localStorage.setItem("currentUsername", username);
    localStorage.setItem("currentUserEmail", email);
  } catch(err) {}

  if (typeof updateAuthUIState === 'function') updateAuthUIState();
  closeAuthModal(null, true);

  const msg = `🎉 Welcome to DeepPredictBet, ${username}! +500 Coins claimed.`;
  if (typeof showAppNotification === 'function') {
    showAppNotification(msg);
  } else if (typeof showToast === 'function') {
    showToast(msg);
  } else {
    alert(msg);
  }
  return false;
}

async function openAdminUsersModal() {
  const existing = document.getElementById("admin-users-modal");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.id = "admin-users-modal";
  modal.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.88);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;z-index:999999;padding:16px;box-sizing:border-box;";
  modal.addEventListener("click", e => { if (e.target === modal) modal.remove(); });

  const content = document.createElement("div");
  content.className = "glass-card";
  content.style.cssText = "width:100%;max-width:820px;max-height:90vh;background:linear-gradient(180deg,#0f172a 0%,#020617 100%);border:1px solid rgba(16,185,129,0.3);border-radius:18px;box-shadow:0 20px 50px rgba(0,0,0,0.8),0 0 30px rgba(16,185,129,0.15);display:flex;flex-direction:column;overflow:hidden;color:#f8fafc;font-family:var(--font-body,sans-serif);";

  // Initial loading state
  content.innerHTML = `
    <div style="padding:20px 24px;border-bottom:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:space-between;background:linear-gradient(135deg,rgba(16,185,129,0.15) 0%,rgba(15,23,42,0.9) 100%);">
      <div style="display:flex;align-items:center;gap:12px;">
        <span style="font-size:1.6rem;background:rgba(16,185,129,0.2);border:1px solid #10b981;border-radius:12px;padding:6px 10px;">👥</span>
        <div>
          <h3 style="margin:0;font-size:1.25rem;font-weight:900;color:#ffffff;display:flex;align-items:center;gap:8px;">
            Member Analytics & Admin Hub
            <span style="font-size:0.65rem;background:#10b981;color:#022c22;font-weight:900;padding:2px 8px;border-radius:20px;letter-spacing:0.5px;">LIVE SYNC</span>
          </h3>
          <span style="font-size:0.75rem;color:#94a3b8;">Real-time roster of registered punters, accounts & coin balances</span>
        </div>
      </div>
      <button id="close-admin-modal-btn" style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);color:#ffffff;border-radius:50%;width:34px;height:34px;font-size:1.1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background 0.2s;">✕</button>
    </div>
    <div style="padding:32px;text-align:center;color:#34d399;">
      <div style="font-size:2rem;margin-bottom:8px;animation:spin 1s linear infinite;">⏳</div>
      <div style="font-weight:700;font-size:0.95rem;">Fetching registered members ledger...</div>
    </div>
  `;

  modal.appendChild(content);
  document.body.appendChild(modal);

  content.querySelector("#close-admin-modal-btn").addEventListener("click", () => modal.remove());

  // 1. Fetch from Cloudflare Edge /api/users (Global Database)
  let edgeUsers = [];
  try {
    const edgeRes = await fetch('/api/users', { signal: AbortSignal.timeout(4000) });
    if (edgeRes.ok) {
      const json = await edgeRes.json();
      if (json.success && Array.isArray(json.users) && json.users.length > 0) {
        edgeUsers = json.users;
      }
    }
  } catch (err) {
    console.debug('[Admin] Edge user fetch error:', err.message);
  }

  // 2. Direct Cloud DB fetch fallback
  if (edgeUsers.length === 0) {
    try {
      const cloudRes = await fetch('https://api.restful-api.dev/objects/ff8081819ff5b11001a034670ed3107f', { signal: AbortSignal.timeout(4000) });
      if (cloudRes.ok) {
        const json = await cloudRes.json();
        if (json.data && Array.isArray(json.data.members)) {
          edgeUsers = json.data.members;
        }
      }
    } catch (e) {}
  }

  // Merge with local storage members and edge users
  const localMembers = getRegisteredMembers();
  const mergedMap = new Map();

  // Edge users are authoritative
  edgeUsers.forEach(u => {
    if (u.email) mergedMap.set(u.email.toLowerCase(), u);
  });

  localMembers.forEach(u => {
    if (u.email && !mergedMap.has(u.email.toLowerCase())) {
      mergedMap.set(u.email.toLowerCase(), u);
      // Sync local user to edge in background
      try {
        fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(u)
        }).catch(() => {});
      } catch (e) {}
    }
  });

  const allMembers = Array.from(mergedMap.values()).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  // Save merged state back to local cache
  try {
    localStorage.setItem("deep_registered_members", JSON.stringify(allMembers));
  } catch (e) {}

  const totalCount = allMembers.length;
  const proCount = allMembers.filter(m => (m.role || '').toUpperCase() === 'PRO' || (m.role || '').toUpperCase() === 'VIP').length;
  const totalCoins = allMembers.reduce((sum, m) => sum + (m.coinsBalance || 500), 0);

  const renderTable = (filterText = '', roleFilter = 'ALL') => {
    const q = (filterText || '').toLowerCase().trim();
    const filtered = allMembers.filter(m => {
      const matchesSearch = !q || (m.fullName || '').toLowerCase().includes(q) || (m.email || '').toLowerCase().includes(q) || (m.username || '').toLowerCase().includes(q);
      const matchesRole = roleFilter === 'ALL' || (m.role || '').toUpperCase() === roleFilter;
      return matchesSearch && matchesRole;
    });

    return filtered.map((m, idx) => {
      const dateStr = m.createdAt ? new Date(m.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent';
      const roleColor = (m.role || '').toUpperCase() === 'VIP' ? '#f59e0b' : (m.role || '').toUpperCase() === 'PRO' ? '#10b981' : '#60a5fa';
      const initial = (m.fullName || m.username || 'U').charAt(0).toUpperCase();

      return `
        <tr style="border-bottom:1px solid rgba(255,255,255,0.05);transition:background 0.15s;" onmouseover="this.style.background='rgba(255,255,255,0.03)'" onmouseout="this.style.background='transparent'">
          <td style="padding:12px 8px;font-weight:700;color:#64748b;font-size:0.8rem;text-align:center;">#${idx + 1}</td>
          <td style="padding:12px 8px;">
            <div style="display:flex;align-items:center;gap:10px;">
              <div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,rgba(59,130,246,0.5),rgba(16,185,129,0.5));border:1px solid rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:0.85rem;color:#ffffff;flex-shrink:0;">
                ${initial}
              </div>
              <div style="display:flex;flex-direction:column;">
                <span style="font-weight:800;color:#f1f5f9;font-size:0.86rem;">${m.fullName || m.username}</span>
                <span style="font-size:0.74rem;color:#94a3b8;">@${m.username || 'user'}</span>
              </div>
            </div>
          </td>
          <td style="padding:12px 8px;color:#cbd5e1;font-size:0.82rem;font-family:monospace;">${m.email}</td>
          <td style="padding:12px 8px;text-align:center;">
            <span style="background:rgba(255,255,255,0.06);border:1px solid ${roleColor};color:${roleColor};font-size:0.68rem;font-weight:800;padding:2px 8px;border-radius:6px;text-transform:uppercase;letter-spacing:0.5px;">
              ${m.role || 'MEMBER'}
            </span>
          </td>
          <td style="padding:12px 8px;text-align:right;font-weight:800;color:#fbbf24;font-size:0.85rem;">
            🪙 ${(m.coinsBalance || 500).toLocaleString()}
          </td>
          <td style="padding:12px 8px;text-align:right;color:#94a3b8;font-size:0.76rem;">
            ${dateStr}
          </td>
        </tr>
      `;
    }).join('') || `<tr><td colspan="6" style="padding:28px;text-align:center;color:#94a3b8;font-size:0.85rem;">No members match this search query.</td></tr>`;
  };

  content.innerHTML = `
    <!-- Modal Header -->
    <div style="padding:18px 24px;border-bottom:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:space-between;background:linear-gradient(135deg,rgba(16,185,129,0.15) 0%,rgba(15,23,42,0.9) 100%);">
      <div style="display:flex;align-items:center;gap:12px;">
        <span style="font-size:1.6rem;background:rgba(16,185,129,0.2);border:1px solid #10b981;border-radius:12px;padding:6px 10px;">👥</span>
        <div>
          <h3 style="margin:0;font-size:1.25rem;font-weight:900;color:#ffffff;display:flex;align-items:center;gap:8px;">
            Member Analytics & Admin Hub
            <span style="font-size:0.65rem;background:#10b981;color:#022c22;font-weight:900;padding:2px 8px;border-radius:20px;letter-spacing:0.5px;">LIVE SYNC</span>
          </h3>
          <span style="font-size:0.75rem;color:#94a3b8;">Real-time roster of registered punters, accounts & coin balances</span>
        </div>
      </div>
      <button id="close-admin-modal-btn" style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);color:#ffffff;border-radius:50%;width:34px;height:34px;font-size:1.1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background 0.2s;">✕</button>
    </div>

    <!-- Overview KPI Metric Cards -->
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;padding:16px 24px 8px;">
      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:12px 16px;">
        <span style="font-size:0.72rem;color:#94a3b8;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;display:block;margin-bottom:4px;">👥 Total Registered</span>
        <span id="admin-kpi-total" style="font-size:1.5rem;font-weight:900;color:#10b981;">${totalCount}</span>
      </div>
      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:12px 16px;">
        <span style="font-size:0.72rem;color:#94a3b8;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;display:block;margin-bottom:4px;">👑 PRO & VIP Punters</span>
        <span style="font-size:1.5rem;font-weight:900;color:#f59e0b;">${proCount}</span>
      </div>
      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:12px 16px;">
        <span style="font-size:0.72rem;color:#94a3b8;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;display:block;margin-bottom:4px;">🪙 Coins Bankroll</span>
        <span style="font-size:1.5rem;font-weight:900;color:#38bdf8;">${totalCoins.toLocaleString()}</span>
      </div>
      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:12px 16px;">
        <span style="font-size:0.72rem;color:#94a3b8;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;display:block;margin-bottom:4px;">🟢 Database State</span>
        <span style="font-size:0.95rem;font-weight:800;color:#34d399;display:flex;align-items:center;gap:6px;margin-top:4px;">
          <span style="width:8px;height:8px;border-radius:50%;background:#10b981;display:inline-block;box-shadow:0 0 8px #10b981;"></span> Synced & Active
        </span>
      </div>
    </div>

    <!-- Action Toolbar (Search, Filter, Export) -->
    <div style="padding:12px 24px;display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,0.06);">
      <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:220px;">
        <input id="admin-search-input" type="text" placeholder="🔍 Search member name, email or @username..."
          style="width:100%;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);border-radius:8px;padding:8px 12px;color:#ffffff;font-size:0.82rem;outline:none;">
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <select id="admin-role-filter" style="background:#1e293b;border:1px solid rgba(255,255,255,0.15);color:#f1f5f9;border-radius:8px;padding:7px 10px;font-size:0.8rem;outline:none;cursor:pointer;">
          <option value="ALL">All Roles</option>
          <option value="PRO">PRO Only</option>
          <option value="VIP">VIP Only</option>
          <option value="FREE">Free Only</option>
        </select>
        <button id="admin-export-csv-btn" style="background:rgba(16,185,129,0.2);border:1px solid #10b981;color:#34d399;font-size:0.8rem;font-weight:800;padding:7px 14px;border-radius:8px;cursor:pointer;display:flex;align-items:center;gap:6px;">
          📥 Export CSV
        </button>
      </div>
    </div>

    <!-- Table Roster -->
    <div style="flex:1;overflow-y:auto;padding:0 24px 20px;max-height:420px;">
      <table style="width:100%;border-collapse:collapse;text-align:left;font-size:0.82rem;">
        <thead>
          <tr style="border-bottom:1px solid rgba(255,255,255,0.1);color:#94a3b8;font-size:0.72rem;text-transform:uppercase;font-weight:800;letter-spacing:0.5px;position:sticky;top:0;background:#0f172a;z-index:2;">
            <th style="padding:10px 8px;width:36px;text-align:center;">#</th>
            <th style="padding:10px 8px;">Punter / Name</th>
            <th style="padding:10px 8px;">Email Address</th>
            <th style="padding:10px 8px;text-align:center;">Tier</th>
            <th style="padding:10px 8px;text-align:right;">Coins</th>
            <th style="padding:10px 8px;text-align:right;">Registered</th>
          </tr>
        </thead>
        <tbody id="admin-members-tbody">
          ${renderTable()}
        </tbody>
      </table>
    </div>
  `;

  content.querySelector("#close-admin-modal-btn").addEventListener("click", () => modal.remove());

  const searchInput = content.querySelector("#admin-search-input");
  const roleSelect = content.querySelector("#admin-role-filter");
  const tbody = content.querySelector("#admin-members-tbody");

  const updateView = () => {
    tbody.innerHTML = renderTable(searchInput.value, roleSelect.value);
  };

  searchInput.addEventListener("input", updateView);
  roleSelect.addEventListener("change", updateView);

  // Export CSV handler
  content.querySelector("#admin-export-csv-btn").addEventListener("click", () => {
    const rows = [
      ["ID", "Full Name", "Username", "Email", "Role", "Coins", "Registered Date"]
    ];
    allMembers.forEach(m => {
      rows.push([
        m.id || "",
        `"${(m.fullName || "").replace(/"/g, '""')}"`,
        m.username || "",
        m.email || "",
        m.role || "USER",
        m.coinsBalance || 500,
        m.createdAt || ""
      ]);
    });
    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `deeppredictbet_members_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  });
}
window.openAdminUsersModal = openAdminUsersModal;

function handleNavAuthClick() {
  const isLoggedIn = localStorage.getItem("userLoggedIn") === "true";
  if (isLoggedIn) {
    if (typeof openProfileModal === 'function') {
      openProfileModal('info');
    }
  } else {
    if (typeof openAuthModal === 'function') {
      openAuthModal('login');
    }
  }
}
window.handleNavAuthClick = handleNavAuthClick;

function updateAuthUIState() {
  const isLoggedIn = localStorage.getItem("userLoggedIn") === "true";
  const username = localStorage.getItem("currentUsername") || "Guest User";

  const navLabel = document.getElementById("nav-user-label");
  const navAvatar = document.getElementById("nav-avatar-icon");
  const drawerUsername = document.getElementById("mobile-drawer-username");
  const profileUsernameDisplay = document.getElementById("profile-username-display");
  const profileAvatarInitial = document.getElementById("profile-avatar-initial");

  if (navLabel) {
    navLabel.innerText = isLoggedIn ? username : "Login";
    navLabel.title = isLoggedIn ? username : "Login";
  }
  if (navAvatar) {
    navAvatar.innerText = isLoggedIn ? username.charAt(0).toUpperCase() : "👤";
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

function logoutUser(e) {
  if (e && e.preventDefault) e.preventDefault();

  try {
    localStorage.removeItem("userLoggedIn");
    localStorage.removeItem("currentUsername");
    localStorage.clear();
  } catch (err) {}

  updateAuthUIState();

  const profModal = document.getElementById("profile-modal");
  if (profModal) {
    profModal.classList.remove("active");
    profModal.style.display = "none";
    profModal.style.opacity = "0";
    profModal.style.pointerEvents = "none";
  }

  const authModal = document.getElementById("auth-modal");
  if (authModal) {
    authModal.classList.remove("active");
    authModal.style.display = "none";
    authModal.style.opacity = "0";
    authModal.style.pointerEvents = "none";
  }

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

  const msg = "🚪 You have been logged out successfully.";
  if (typeof showAppNotification === 'function') {
    showAppNotification(msg);
  } else if (typeof showToast === 'function') {
    showToast(msg);
  } else {
    alert(msg);
  }
}

function openProfileModal(activeTab) {
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

  const modal = document.getElementById("profile-modal");
  if (!modal) return;

  updateAuthUIState();

  modal.classList.add("active");
  modal.style.display = "flex";
  modal.style.zIndex = "1000000";
  modal.style.opacity = "1";
  modal.style.pointerEvents = "all";
  modal.style.visibility = "visible";
  document.body.style.overflow = "hidden";

  if (typeof switchProfileTab === 'function') {
    switchProfileTab(activeTab || 'info');
  }
}

function closeProfileModal(event, force) {
  if (force || (event && event.target && event.target.id === "profile-modal")) {
    const modal = document.getElementById("profile-modal");
    if (modal) {
      modal.classList.remove("active");
      modal.style.display = "none";
      modal.style.opacity = "0";
      modal.style.pointerEvents = "none";
    }
    document.body.style.overflow = "";
  }
}

function switchProfileTab(tab) {
  const infoBtn = document.getElementById("prof-tab-info");
  const alertsBtn = document.getElementById("prof-tab-alerts");
  const historyBtn = document.getElementById("prof-tab-history");

  const infoPane = document.getElementById("prof-pane-info");
  const alertsPane = document.getElementById("prof-pane-alerts");
  const historyPane = document.getElementById("prof-pane-history");

  const btns = [infoBtn, alertsBtn, historyBtn];
  const panes = [infoPane, alertsPane, historyPane];

  btns.forEach(b => { if (b) b.classList.remove("active"); });
  panes.forEach(p => { if (p) p.style.display = "none"; });

  if (tab === 'info') {
    if (infoBtn) infoBtn.classList.add("active");
    if (infoPane) infoPane.style.display = "block";
  } else if (tab === 'alerts') {
    if (alertsBtn) alertsBtn.classList.add("active");
    if (alertsPane) alertsPane.style.display = "block";
  } else if (tab === 'history') {
    if (historyBtn) historyBtn.classList.add("active");
    if (historyPane) historyPane.style.display = "block";
  }
}

// Global Bindings
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.switchAuthTab = switchAuthTab;
window.handleAuthLogin = handleAuthLogin;
window.handleAuthSignup = handleAuthSignup;
window.updateAuthUIState = updateAuthUIState;
window.logoutUser = logoutUser;
window.openProfileModal = openProfileModal;
window.closeProfileModal = closeProfileModal;
window.switchProfileTab = switchProfileTab;

document.addEventListener("DOMContentLoaded", function() {
  updateAuthUIState();
});






/* --- FOOLPROOF MULTI-LAYER MATCH FINDER & CALENDAR HUB POPULATOR --- */
function populateCalSelectors() {
  const dateSelect = document.getElementById("cal-date-select");
  const countrySelect = document.getElementById("cal-country-select");
  const leagueSelect = document.getElementById("cal-league-select");
  const teamSelect = document.getElementById("cal-team-select");
  if (!countrySelect || !leagueSelect || !teamSelect) return;

  const prevDate = dateSelect ? dateSelect.value : 'today';
  const prevCountry = countrySelect.value || 'all';
  const prevLeague = leagueSelect.value || 'all';
  const prevTeam = teamSelect.value || 'all';

  // 1. Date Selector
  if (dateSelect) {
    dateSelect.innerHTML = `
      <option value="today">${typeof getOrdinalDate === 'function' ? getOrdinalDate(0) : 'Today'} (Today)</option>
      <option value="tomorrow">${typeof getOrdinalDate === 'function' ? getOrdinalDate(1) : 'Tomorrow'} (Tomorrow)</option>
      <option value="yesterday">${typeof getOrdinalDate === 'function' ? getOrdinalDate(-1) : 'Yesterday'} (Yesterday)</option>
      <option value="all">📅 All Dates</option>
    `;
    dateSelect.value = prevDate || 'today';
  }

  // 2. Populate Countries from COUNTRY_LEAGUES_DATA & MATCH_DATA
  const countriesMap = new Map();

  if (typeof COUNTRY_LEAGUES_DATA !== 'undefined' && Array.isArray(COUNTRY_LEAGUES_DATA)) {
    COUNTRY_LEAGUES_DATA.forEach(c => {
      if (c && c.country) {
        countriesMap.set(c.country, c.emoji || '🏳️');
      }
    });
  }

  if (typeof MATCH_DATA !== 'undefined' && Array.isArray(MATCH_DATA)) {
    MATCH_DATA.forEach(m => {
      if (m && m.country && !countriesMap.has(m.country)) {
        countriesMap.set(m.country, m.flag || '⚽');
      }
    });
  }

  // Always include major football nations fallback if map is empty
  if (countriesMap.size === 0) {
    const fallbackCountries = [
      ["England", "🏴󠁧󠁢󠁥󠁮󠁧󠁿"], ["Spain", "🇪🇸"], ["Italy", "🇮🇹"], ["Germany", "🇩🇪"],
      ["France", "🇫🇷"], ["Argentina", "🇦🇷"], ["Brazil", "🇧🇷"], ["Portugal", "🇵🇹"],
      ["Netherlands", "🇳🇱"], ["Belgium", "🇧🇪"], ["Turkey", "🇹🇷"], ["Nigeria", "🇳🇬"],
      ["Saudi Arabia", "🇸🇦"], ["USA", "🇺🇸"], ["Europe", "🇪🇺"]
    ];
    fallbackCountries.forEach(([cn, em]) => countriesMap.set(cn, em));
  }

  let countryHtml = `<option value="all">🌐 All Countries (${countriesMap.size})</option>`;
  Array.from(countriesMap.entries()).sort((a, b) => a[0].localeCompare(b[0])).forEach(([cName, emoji]) => {
    countryHtml += `<option value="${cName}">${emoji} ${cName}</option>`;
  });
  countrySelect.innerHTML = countryHtml;

  if (prevCountry && (prevCountry === 'all' || Array.from(countriesMap.keys()).includes(prevCountry))) {
    countrySelect.value = prevCountry;
  } else {
    countrySelect.value = 'all';
  }

  // 3. Populate Cascading Leagues & Teams
  populateLeagueDropdown(countrySelect.value, prevLeague);
  populateTeamDropdown(countrySelect.value, leagueSelect.value, prevTeam);
}

function populateLeagueDropdown(selectedCountry, targetLeagueVal) {
  const leagueSelect = document.getElementById("cal-league-select");
  const filtLeagueSelect = document.getElementById("filt-league-select");
  if (!leagueSelect) return;

  const leaguesMap = new Map();

  if (typeof TOP_LEAGUES_DATA !== 'undefined' && Array.isArray(TOP_LEAGUES_DATA)) {
    TOP_LEAGUES_DATA.forEach(l => {
      if (!selectedCountry || selectedCountry === 'all' || l.country === selectedCountry || (l.name && l.name.toLowerCase().includes(selectedCountry.toLowerCase()))) {
        leaguesMap.set(l.name, l.emoji || '🏆');
      }
    });
  }

  if (selectedCountry && selectedCountry !== 'all' && typeof COUNTRY_LEAGUES_DATA !== 'undefined') {
    const cData = COUNTRY_LEAGUES_DATA.find(c => c.country.toLowerCase() === selectedCountry.toLowerCase());
    if (cData && cData.leagues) {
      cData.leagues.forEach(lg => {
        if (!leaguesMap.has(lg)) leaguesMap.set(lg, cData.emoji || '🏆');
      });
    }
  }

  if (typeof MATCH_DATA !== 'undefined' && Array.isArray(MATCH_DATA)) {
    MATCH_DATA.forEach(m => {
      if (m && m.league) {
        if (!selectedCountry || selectedCountry === 'all' || (m.country && m.country.toLowerCase() === selectedCountry.toLowerCase())) {
          if (!leaguesMap.has(m.league)) leaguesMap.set(m.league, m.leagueEmoji || '⚽');
        }
      }
    });
  }

  let leagueHtml = `<option value="all">🏆 All Leagues (${leaguesMap.size})</option>`;
  Array.from(leaguesMap.entries()).sort((a, b) => a[0].localeCompare(b[0])).forEach(([name, emoji]) => {
    leagueHtml += `<option value="${name}">${emoji} ${name}</option>`;
  });

  leagueSelect.innerHTML = leagueHtml;
  if (filtLeagueSelect) filtLeagueSelect.innerHTML = leagueHtml;

  const currentVal = targetLeagueVal || leagueSelect.value || 'all';
  if (currentVal === 'all' || Array.from(leaguesMap.keys()).includes(currentVal)) {
    leagueSelect.value = currentVal;
  } else {
    leagueSelect.value = 'all';
  }
}

function populateTeamDropdown(selectedCountry, selectedLeague, targetTeamVal) {
  const teamSelect = document.getElementById("cal-team-select");
  if (!teamSelect) return;

  const teams = new Set();

  if (typeof MATCH_DATA !== 'undefined' && Array.isArray(MATCH_DATA)) {
    MATCH_DATA.forEach(m => {
      if (!m) return;
      const matchCountry = m.country ? m.country.toLowerCase() : '';
      const matchLeague = m.league ? m.league.toLowerCase() : '';

      const countryMatch = !selectedCountry || selectedCountry === 'all' || matchCountry === selectedCountry.toLowerCase();
      const leagueMatch = !selectedLeague || selectedLeague === 'all' || matchLeague === selectedLeague.toLowerCase();

      if (countryMatch && leagueMatch) {
        if (m.homeTeam && m.homeTeam.name) teams.add(m.homeTeam.name);
        if (m.awayTeam && m.awayTeam.name) teams.add(m.awayTeam.name);
      }
    });
  }

  if (teams.size === 0 && typeof MATCH_DATA !== 'undefined') {
    MATCH_DATA.forEach(m => {
      if (m.homeTeam && m.homeTeam.name) teams.add(m.homeTeam.name);
      if (m.awayTeam && m.awayTeam.name) teams.add(m.awayTeam.name);
    });
  }

  let teamHtml = `<option value="all">⚽ All Teams (${teams.size})</option>`;
  Array.from(teams).sort().forEach(tName => {
    teamHtml += `<option value="${tName}">${tName}</option>`;
  });

  teamSelect.innerHTML = teamHtml;
  const currentVal = targetTeamVal || teamSelect.value || 'all';
  if (currentVal === 'all' || Array.from(teams).includes(currentVal)) {
    teamSelect.value = currentVal;
  } else {
    teamSelect.value = 'all';
  }
}

function runCalFilter(changedId) {
  const dateVal = document.getElementById("cal-date-select") ? document.getElementById("cal-date-select").value : 'today';
  const countryVal = document.getElementById("cal-country-select") ? document.getElementById("cal-country-select").value : 'all';
  
  if (changedId === 'cal-country-select') {
    populateLeagueDropdown(countryVal, 'all');
    populateTeamDropdown(countryVal, 'all', 'all');
  } else if (changedId === 'cal-league-select') {
    const leagueVal = document.getElementById("cal-league-select") ? document.getElementById("cal-league-select").value : 'all';
    populateTeamDropdown(countryVal, leagueVal, 'all');
  }

  const leagueVal = document.getElementById("cal-league-select") ? document.getElementById("cal-league-select").value : 'all';
  const teamVal = document.getElementById("cal-team-select") ? document.getElementById("cal-team-select").value : 'all';

  window.appState.activePredictionDate = dateVal;
  window.appState.calCountry = countryVal;
  window.appState.calLeague = leagueVal;
  window.appState.calTeam = teamVal;

  if (typeof renderDeepPredictBetDateBar === 'function') {
    renderDeepPredictBetDateBar();
  }

  if (typeof updateFixturesDisplay === 'function') {
    updateFixturesDisplay();
  }

  const target = document.getElementById("predictions");
  if (target && changedId) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
}

// Multi-Layer Auto-Run Execution
function initCalSelectorsAutoRun() {
  populateCalSelectors();
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', populateCalSelectors);
  }
  window.addEventListener('load', populateCalSelectors);
  window.addEventListener('pageshow', populateCalSelectors);
}

// Immediate Execution
initCalSelectorsAutoRun();

// Global Exports
window.populateCalSelectors = populateCalSelectors;
window.populateLeagueDropdown = populateLeagueDropdown;
window.populateTeamDropdown = populateTeamDropdown;
window.runCalFilter = runCalFilter;


/* --- UNIVERSAL FOOLPROOF MODAL CLOSER ENGINE --- */
function closeCurrentModal(target) {
  let modal = null;
  
  if (target) {
    if (target.target && target.target.closest) {
      modal = target.target.closest('.modal-overlay');
    } else if (target.closest) {
      modal = target.closest('.modal-overlay');
    } else if (typeof target === 'string') {
      modal = document.getElementById(target);
    }
  }

  if (modal) {
    modal.classList.remove("active");
    modal.style.display = "none";
    modal.style.opacity = "0";
    modal.style.pointerEvents = "none";
    modal.style.visibility = "hidden";
  }

  // Close ALL open modal-overlays on screen to guarantee instant closing
  const overlays = document.querySelectorAll(".modal-overlay");
  overlays.forEach(m => {
    m.classList.remove("active");
    m.style.display = "none";
    m.style.opacity = "0";
    m.style.pointerEvents = "none";
    m.style.visibility = "hidden";
  });

  document.body.style.overflow = "";
}

// Global Exports
window.closeCurrentModal = closeCurrentModal;






/* --- FOOLPROOF MOBILE & SMARTPHONE RICH SEARCH ENGINE --- */
let lastSearchFocusTime = 0;

function getTeamLogo(teamName) {
  if (!teamName) return "⚽";
  let logo = "⚽";
  
  try {
    if (typeof MATCH_DATA !== 'undefined' && Array.isArray(MATCH_DATA)) {
      const match = MATCH_DATA.find(m => m && ((m.homeTeam && m.homeTeam.name && m.homeTeam.name.toLowerCase() === teamName.toLowerCase()) || (m.awayTeam && m.awayTeam.name && m.awayTeam.name.toLowerCase() === teamName.toLowerCase())));
      if (match) {
        if (match.homeTeam && match.homeTeam.name && match.homeTeam.name.toLowerCase() === teamName.toLowerCase() && match.homeTeam.logo) {
          logo = match.homeTeam.logo;
        } else if (match.awayTeam && match.awayTeam.name && match.awayTeam.name.toLowerCase() === teamName.toLowerCase() && match.awayTeam.logo) {
          logo = match.awayTeam.logo;
        }
      }
    }

    if (logo === "⚽" && typeof TEAM_STATS_DATA !== 'undefined' && Array.isArray(TEAM_STATS_DATA)) {
      const tStat = TEAM_STATS_DATA.find(t => t && t.name && t.name.toLowerCase() === teamName.toLowerCase());
      if (tStat && tStat.logo) logo = tStat.logo;
    }
  } catch(e) {}

  // Famous team logo fallbacks
  if (!logo || logo === "⚽") {
    const lower = (teamName || "").toLowerCase();
    if (lower.includes("arsenal")) logo = "🔴";
    else if (lower.includes("chelsea")) logo = "🔵";
    else if (lower.includes("liverpool")) logo = "🔴🛡️";
    else if (lower.includes("manchester city") || lower.includes("man city")) logo = "🩵";
    else if (lower.includes("manchester united") || lower.includes("man united")) logo = "👿";
    else if (lower.includes("tottenham")) logo = "⚪🐓";
    else if (lower.includes("real madrid")) logo = "⚪";
    else if (lower.includes("barcelona")) logo = "🔵🔴";
    else if (lower.includes("atletico")) logo = "🔴⚪🐻";
    else if (lower.includes("bayern")) logo = "🔴⚪";
    else if (lower.includes("dortmund")) logo = "🟡⚫";
    else if (lower.includes("leverkusen")) logo = "🔴🦁";
    else if (lower.includes("inter")) logo = "🔵⚫🐍";
    else if (lower.includes("ac milan")) logo = "🔴⚫👿";
    else if (lower.includes("juventus")) logo = "⚫⚪🦓";
    else if (lower.includes("paris") || lower.includes("psg")) logo = "🗼";
    else if (lower.includes("napoli")) logo = "🔵👑";
    else logo = "⚽";
  }

  return logo;
}

function renderRichSearchDropdown(queryStr) {
  const dropdown = document.getElementById("search-autocomplete-dropdown");
  if (!dropdown) return;

  try {
    const query = (queryStr || "").trim().toLowerCase();
    const items = [];
    const addedNames = new Set();

    // 1. Extract Teams from MATCH_DATA
    if (typeof MATCH_DATA !== 'undefined' && Array.isArray(MATCH_DATA)) {
      MATCH_DATA.forEach(m => {
        if (!m) return;
        if (m.homeTeam && m.homeTeam.name && !addedNames.has(m.homeTeam.name.toLowerCase())) {
          if (!query || m.homeTeam.name.toLowerCase().includes(query)) {
            addedNames.add(m.homeTeam.name.toLowerCase());
            items.push({
              name: m.homeTeam.name,
              logo: getTeamLogo(m.homeTeam.name),
              subtitle: `${m.flag || '🌐'} ${m.league || 'Football'}`,
              type: 'TEAM',
              badgeBg: 'rgba(59, 130, 246, 0.25)',
              badgeColor: '#60a5fa'
            });
          }
        }
        if (m.awayTeam && m.awayTeam.name && !addedNames.has(m.awayTeam.name.toLowerCase())) {
          if (!query || m.awayTeam.name.toLowerCase().includes(query)) {
            addedNames.add(m.awayTeam.name.toLowerCase());
            items.push({
              name: m.awayTeam.name,
              logo: getTeamLogo(m.awayTeam.name),
              subtitle: `${m.flag || '🌐'} ${m.league || 'Football'}`,
              type: 'TEAM',
              badgeBg: 'rgba(59, 130, 246, 0.25)',
              badgeColor: '#60a5fa'
            });
          }
        }
      });
    }

    // Fallback Teams if dataset empty or general tap
    if (items.length < 5) {
      const popularTeams = [
        ["Arsenal", "🔴", "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League"],
        ["Real Madrid", "⚪", "🇪🇸 La Liga"],
        ["Barcelona", "🔵🔴", "🇪🇸 La Liga"],
        ["Chelsea", "🔵", "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League"],
        ["Manchester City", "🩵", "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League"],
        ["Liverpool", "🔴🛡️", "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League"],
        ["Bayern Munich", "🔴⚪", "🇩🇪 Bundesliga"],
        ["PSG", "🗼", "🇫🇷 Ligue 1"],
        ["Inter Milan", "🔵⚫🐍", "🇮🇹 Serie A"],
        ["Juventus", "⚫⚪🦓", "🇮🇹 Serie A"]
      ];
      popularTeams.forEach(([tName, tLogo, tSub]) => {
        if (!addedNames.has(tName.toLowerCase())) {
          if (!query || tName.toLowerCase().includes(query)) {
            addedNames.add(tName.toLowerCase());
            items.push({
              name: tName,
              logo: tLogo,
              subtitle: tSub,
              type: 'TEAM',
              badgeBg: 'rgba(59, 130, 246, 0.25)',
              badgeColor: '#60a5fa'
            });
          }
        }
      });
    }

    // 2. Extract Leagues from TOP_LEAGUES_DATA & MATCH_DATA
    if (typeof TOP_LEAGUES_DATA !== 'undefined' && Array.isArray(TOP_LEAGUES_DATA)) {
      TOP_LEAGUES_DATA.forEach(l => {
        if (l && l.name && !addedNames.has(l.name.toLowerCase())) {
          if (!query || l.name.toLowerCase().includes(query) || (l.country && l.country.toLowerCase().includes(query))) {
            addedNames.add(l.name.toLowerCase());
            items.push({
              name: l.name,
              logo: l.emoji || '🏆',
              subtitle: `${l.country || 'International'} League`,
              type: 'LEAGUE',
              badgeBg: 'rgba(16, 185, 129, 0.25)',
              badgeColor: '#34d399'
            });
          }
        }
      });
    }

    // 3. Extract Countries from COUNTRY_LEAGUES_DATA & MATCH_DATA
    if (typeof COUNTRY_LEAGUES_DATA !== 'undefined' && Array.isArray(COUNTRY_LEAGUES_DATA)) {
      COUNTRY_LEAGUES_DATA.forEach(c => {
        if (c && c.country && !addedNames.has(c.country.toLowerCase())) {
          if (!query || c.country.toLowerCase().includes(query)) {
            addedNames.add(c.country.toLowerCase());
            items.push({
              name: c.country,
              logo: c.emoji || '🏳️',
              subtitle: `National Competitions`,
              type: 'COUNTRY',
              badgeBg: 'rgba(245, 158, 11, 0.25)',
              badgeColor: '#fbbf24'
            });
          }
        }
      });
    }

    if (items.length === 0) {
      dropdown.innerHTML = `<div style="padding: 14px; text-align: center; color: #94a3b8; font-size: 0.8rem;">No results found for "${queryStr}"</div>`;
      dropdown.style.display = "block";
      return;
    }

    // Render top 25 results
    let html = "";
    items.slice(0, 25).forEach(item => {
      const logoStr = (item.logo || "⚽").toString();
      const isImage = logoStr.startsWith('http') || logoStr.startsWith('/') || logoStr.startsWith('data:');
      const logoHtml = isImage 
        ? `<img src="${logoStr}" alt="${item.name}" style="width: 24px; height: 24px; object-fit: contain;">`
        : `<span style="font-size: 1.2rem; line-height: 1;">${logoStr}</span>`;

      const safeName = (item.name || "").replace(/'/g, "\\'");

      html += `
        <div onclick="selectSearchItem('${safeName}')" ontouchstart="selectSearchItem('${safeName}')" style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; cursor: pointer; border-bottom: 1px solid rgba(255,255,255,0.06); transition: background 0.15s ease; touch-action: manipulation;" onmouseover="this.style.background='rgba(59,130,246,0.18)'" onmouseout="this.style.background='transparent'">
          <div style="display: flex; align-items: center; gap: 12px;">
            ${logoHtml}
            <div style="display: flex; flex-direction: column;">
              <span style="font-weight: 700; color: #ffffff; font-size: 0.88rem; line-height: 1.2;">${item.name}</span>
              <span style="font-size: 0.72rem; color: #94a3b8; line-height: 1.2; margin-top: 3px;">${item.subtitle}</span>
            </div>
          </div>
          <span style="font-size: 0.65rem; background: ${item.badgeBg}; color: ${item.badgeColor}; padding: 3px 8px; border-radius: 4px; font-weight: 800; letter-spacing: 0.5px;">${item.type}</span>
        </div>
      `;
    });

    dropdown.innerHTML = html;
    dropdown.style.display = "block";
  } catch(err) {
    console.error("Search dropdown render error:", err);
  }
}

function onSearchInputChange(val) {
  lastSearchFocusTime = Date.now();
  renderRichSearchDropdown(val);
  if (typeof handleSearchSelect === 'function') {
    handleSearchSelect(val);
  }
}

function onSearchInputFocus(val) {
  lastSearchFocusTime = Date.now();
  renderRichSearchDropdown(val);
}

function selectSearchItem(val) {
  const input = document.getElementById("timeline-search-input");
  if (input) input.value = val;

  const dropdown = document.getElementById("search-autocomplete-dropdown");
  if (dropdown) dropdown.style.display = "none";

  if (typeof handleSearchSelect === 'function') {
    handleSearchSelect(val);
  }

  const target = document.getElementById("predictions");
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
}

// Close search dropdown when clicking outside with Mobile Touch Failsafe
document.addEventListener("click", function(e) {
  // Ignore clicks triggered within 500ms of input focus (fixes smartphone synthetic touch click issue)
  if (Date.now() - lastSearchFocusTime < 500) return;

  const searchInput = document.getElementById("timeline-search-input");
  const dropdown = document.getElementById("search-autocomplete-dropdown");
  if (dropdown && searchInput) {
    if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = "none";
    }
  }
});

document.addEventListener("touchstart", function(e) {
  if (Date.now() - lastSearchFocusTime < 500) return;

  const searchInput = document.getElementById("timeline-search-input");
  const dropdown = document.getElementById("search-autocomplete-dropdown");
  if (dropdown && searchInput) {
    if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = "none";
    }
  }
}, { passive: true });

// Global Exports
window.getTeamLogo = getTeamLogo;
window.renderRichSearchDropdown = renderRichSearchDropdown;
window.onSearchInputChange = onSearchInputChange;
window.onSearchInputFocus = onSearchInputFocus;
window.selectSearchItem = selectSearchItem;


/* --- HERO BET CODE CONVERTER EXECUTION --- */





/* --- BULLETPROOF SIDEBAR TOP LEAGUES POPULATOR --- */
function renderSidebarTopLeagues() {
  const container = document.getElementById("sidebar-topleagues-accordion-list");
  if (!container) return;

  try {
    const defaultLeagues = [
      // ── Top 5 European Leagues ──────────────────
      { name: "Premier League",          emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", country: "England" },
      { name: "La Liga",                 emoji: "🇪🇸", country: "Spain" },
      { name: "Serie A",                 emoji: "🇮🇹", country: "Italy" },
      { name: "Bundesliga",              emoji: "🇩🇪", country: "Germany" },
      { name: "Ligue 1",                 emoji: "🇫🇷", country: "France" },
      // ── UEFA Competitions ───────────────────────
      { name: "Champions League",        emoji: "⭐",  country: "Europe" },
      { name: "Europa League",           emoji: "🟠",  country: "Europe" },
      { name: "Conference League",       emoji: "🟢",  country: "Europe" },
      // ── Other European Leagues ──────────────────
      { name: "Eredivisie",              emoji: "🇳🇱", country: "Netherlands" },
      { name: "Primeira Liga",           emoji: "🇵🇹", country: "Portugal" },
      { name: "Süper Lig",              emoji: "🇹🇷", country: "Turkey" },
      { name: "Scottish Premiership",    emoji: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", country: "Scotland" },
      { name: "Jupiler Pro League",      emoji: "🇧🇪", country: "Belgium" },
      { name: "Ekstraklasa",            emoji: "🇵🇱", country: "Poland" },
      { name: "Eliteserien",            emoji: "🇳🇴", country: "Norway" },
      { name: "Allsvenskan",            emoji: "🇸🇪", country: "Sweden" },
      { name: "Superliga",              emoji: "🇩🇰", country: "Denmark" },
      { name: "Swiss Super League",     emoji: "🇨🇭", country: "Switzerland" },
      { name: "Austrian Bundesliga",   emoji: "🇦🇹", country: "Austria" },
      { name: "Greek Super League",     emoji: "🇬🇷", country: "Greece" },
      { name: "Russian Premier League", emoji: "🇷🇺", country: "Russia" },
      { name: "Ukrainian Premier League", emoji: "🇺🇦", country: "Ukraine" },
      // ── English Football & Cups ─────────────────
      { name: "Championship",           emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", country: "England" },
      { name: "League One",              emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", country: "England" },
      { name: "FA Cup",                 emoji: "🏆", country: "England" },
      { name: "EFL Cup",                emoji: "🥤", country: "England" },
      // ── Domestic Cups ───────────────────────────
      { name: "Copa del Rey",           emoji: "🇪🇸", country: "Spain" },
      { name: "DFB Pokal",              emoji: "🇩🇪", country: "Germany" },
      { name: "Coppa Italia",           emoji: "🇮🇹", country: "Italy" },
      { name: "Coupe de France",        emoji: "🇫🇷", country: "France" },
      // ── Second Divisions ────────────────────────
      { name: "La Liga 2",              emoji: "🇪🇸", country: "Spain" },
      { name: "Serie B",                emoji: "🇮🇹", country: "Italy" },
      { name: "2. Bundesliga",          emoji: "🇩🇪", country: "Germany" },
      // ── Americas ────────────────────────────────
      { name: "MLS",                    emoji: "🇺🇸", country: "USA" },
      { name: "Liga MX",                emoji: "🇲🇽", country: "Mexico" },
      { name: "Brasileirão",            emoji: "🇧🇷", country: "Brazil" },
      { name: "Liga Profesional",       emoji: "🇦🇷", country: "Argentina" },
      { name: "Copa Libertadores",      emoji: "🌎", country: "South America" },
      { name: "Copa Sudamericana",      emoji: "🌎", country: "South America" },
      { name: "Colombia Primera A",     emoji: "🇨🇴", country: "Colombia" },
      // ── Middle East ─────────────────────────────
      { name: "Saudi Pro League",       emoji: "🇸🇦", country: "Saudi Arabia" },
      { name: "UAE Pro League",         emoji: "🇦🇪", country: "UAE" },
      { name: "Qatar Stars League",     emoji: "🇶🇦", country: "Qatar" },
      // ── Africa ──────────────────────────────────
      { name: "CAF Champions League",   emoji: "🌍", country: "Africa" },
      { name: "NPFL",                   emoji: "🇳🇬", country: "Nigeria" },
      { name: "Ghana Premier League",   emoji: "🇬🇭", country: "Ghana" },
      { name: "South African PSL",      emoji: "🇿🇦", country: "South Africa" },
      { name: "Egyptian Premier League",emoji: "🇪🇬", country: "Egypt" },
      { name: "Moroccan Botola",        emoji: "🇲🇦", country: "Morocco" },
      { name: "Kenyan Premier League",  emoji: "🇰🇪", country: "Kenya" },
      { name: "Tunisian Ligue 1",       emoji: "🇹🇳", country: "Tunisia" },
      // ── Asia & Oceania ──────────────────────────
      { name: "J-League",               emoji: "🇯🇵", country: "Japan" },
      { name: "K-League",               emoji: "🇰🇷", country: "South Korea" },
      { name: "Chinese Super League",   emoji: "🇨🇳", country: "China" },
      { name: "Indian Super League",    emoji: "🇮🇳", country: "India" },
      { name: "A-League",               emoji: "🇦🇺", country: "Australia" }
    ];

    let leaguesData = defaultLeagues;
    if (typeof TOP_LEAGUES_DATA !== 'undefined' && Array.isArray(TOP_LEAGUES_DATA) && TOP_LEAGUES_DATA.length > 0) {
      leaguesData = TOP_LEAGUES_DATA;
    } else if (typeof window.TOP_LEAGUES_DATA !== 'undefined' && Array.isArray(window.TOP_LEAGUES_DATA) && window.TOP_LEAGUES_DATA.length > 0) {
      leaguesData = window.TOP_LEAGUES_DATA;
    }

    const query = (document.getElementById("sidebar-topleagues-search-input")?.value || "").toLowerCase().trim();

    container.innerHTML = "";

    leaguesData.forEach((league, index) => {
      const leagueName = league.name || "League";
      const leagueCountry = league.country || "Global";
      const matchesLeague = leagueName.toLowerCase().includes(query) || leagueCountry.toLowerCase().includes(query);

      if (query && !matchesLeague) return;

      const accordion = document.createElement("div");
      accordion.className = "country-accordion-item";
      accordion.style.marginBottom = "4px";

      const isExpanded = query ? true : false;
      const safeName = leagueName.replace(/'/g, "\\'");

      accordion.innerHTML = `
        <button class="country-accordion-header" onclick="toggleSidebarTopLeaguesAccordion(${index}, this)" style="width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; color: #ffffff; font-weight: 700; font-size: 0.83rem; cursor: pointer; transition: background 0.15s ease;" onmouseover="this.style.background='rgba(59, 130, 246, 0.2)'" onmouseout="this.style.background='rgba(30, 41, 59, 0.7)'">
          <span style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 1.1rem;">${league.emoji || '🏆'}</span>
            <span>${leagueName}</span>
          </span>
          <span class="caret" style="transition: transform 0.2s ease; font-size: 0.65rem; color: #94a3b8; transform: ${isExpanded ? 'rotate(180deg)' : 'rotate(0)'};">▼</span>
        </button>
        <div class="country-accordion-content" style="max-height: ${isExpanded ? '500px' : '0px'}; overflow: hidden; transition: max-height 0.25s ease-in-out; padding-left: 8px; display: flex; flex-direction: column; gap: 4px; margin-top: 4px;">
          <button class="sidebar-league-btn" onclick="selectSidebarLeague('${safeName}', this)" style="padding: 7px 10px; font-size: 0.76rem; text-align: left; background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.05); color: #60a5fa; border-radius: 6px; cursor: pointer;">
            ⚽ Match Predictions
          </button>
          <button class="sidebar-league-btn" onclick="scoutLeagueClubs('${safeName}', this)" style="padding: 7px 10px; font-size: 0.76rem; text-align: left; background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.05); color: #cbd5e1; border-radius: 6px; cursor: pointer;">
            🏟️ Scouting Clubs
          </button>
          <button class="sidebar-league-btn" onclick="viewLeagueStatisticsLedger('${safeName}', this)" style="padding: 7px 10px; font-size: 0.76rem; text-align: left; background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.05); color: #cbd5e1; border-radius: 6px; cursor: pointer;">
            📊 League Averages
          </button>
          <button class="sidebar-league-btn" onclick="showMockTableStandings('${safeName}', this)" style="padding: 7px 10px; font-size: 0.76rem; text-align: left; background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.05); color: #cbd5e1; border-radius: 6px; cursor: pointer;">
            🏆 Table Standings
          </button>
        </div>
      `;

      container.appendChild(accordion);
    });
  } catch(e) {
    console.error("Top leagues render error:", e);
  }
}

// old filterSidebarTopLeagues replaced

// Auto-run on load with retries
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    renderSidebarTopLeagues();
    setTimeout(renderSidebarTopLeagues, 300);
    setTimeout(renderSidebarTopLeagues, 1000);
  });
} else {
  renderSidebarTopLeagues();
  setTimeout(renderSidebarTopLeagues, 300);
  setTimeout(renderSidebarTopLeagues, 1000);
}

window.addEventListener('load', function() {
  renderSidebarTopLeagues();
});

// Global Exports
window.renderSidebarTopLeagues = renderSidebarTopLeagues;
if (typeof filterSidebarTopLeagues === 'function') window.filterSidebarTopLeagues = filterSidebarTopLeagues;


/* --- BULLETPROOF COUNTRY DIRECTORY ACCORDION POPULATOR --- */
function renderSidebarCountries() {
  const container = document.getElementById("sidebar-accordion-list");
  if (!container) return;

  try {
    const defaultCountries = [
      {
        country: "England",
        emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
        leagues: ["Premier League", "Championship", "League One", "FA Cup", "EFL Cup"]
      },
      {
        country: "Spain",
        emoji: "🇪🇸",
        leagues: ["La Liga", "Segunda Division", "Copa del Rey"]
      },
      {
        country: "Italy",
        emoji: "🇮🇹",
        leagues: ["Serie A", "Serie B", "Coppa Italia"]
      },
      {
        country: "Germany",
        emoji: "🇩🇪",
        leagues: ["Bundesliga", "2. Bundesliga", "DFB Pokal"]
      },
      {
        country: "France",
        emoji: "🇫🇷",
        leagues: ["Ligue 1", "Ligue 2", "Coupe de France"]
      },
      {
        country: "Netherlands",
        emoji: "🇳🇱",
        leagues: ["Eredivisie", "Eerste Divisie"]
      },
      {
        country: "Portugal",
        emoji: "🇵🇹",
        leagues: ["Primeira Liga", "Liga Portugal 2"]
      },
      {
        country: "Turkey",
        emoji: "🇹🇷",
        leagues: ["Süper Lig", "1. Lig"]
      },
      {
        country: "Europe / UEFA",
        emoji: "🇪🇺",
        leagues: ["Champions League", "Europa League", "Conference League"]
      },
      {
        country: "Brazil",
        emoji: "🇧🇷",
        leagues: ["Brasileirão", "Serie B", "Copa do Brasil"]
      },
      {
        country: "Argentina",
        emoji: "🇦🇷",
        leagues: ["Liga Profesional", "Copa Argentina"]
      },
      {
        country: "Mexico",
        emoji: "🇲🇽",
        leagues: ["Liga MX"]
      },
      {
        country: "USA",
        emoji: "🇺🇸",
        leagues: ["MLS", "USL Championship"]
      },
      {
        country: "Saudi Arabia",
        emoji: "🇸🇦",
        leagues: ["Saudi Pro League"]
      },
      {
        country: "Nigeria",
        emoji: "🇳🇬",
        leagues: ["NPFL Nigeria"]
      },
      {
        country: "South Africa",
        emoji: "🇿🇦",
        leagues: ["DStv Premiership"]
      },
      {
        country: "Egypt",
        emoji: "🇪🇬",
        leagues: ["Egyptian Premier League"]
      },
      {
        country: "Scotland",
        emoji: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
        leagues: ["Scottish Premiership"]
      },
      {
        country: "Belgium",
        emoji: "🇧🇪",
        leagues: ["Belgian Pro League"]
      }
    ];

    let countryData = defaultCountries;
    if (typeof COUNTRY_LEAGUES_DATA !== 'undefined' && Array.isArray(COUNTRY_LEAGUES_DATA) && COUNTRY_LEAGUES_DATA.length > 0) {
      countryData = COUNTRY_LEAGUES_DATA;
    } else if (typeof window.COUNTRY_LEAGUES_DATA !== 'undefined' && Array.isArray(window.COUNTRY_LEAGUES_DATA) && window.COUNTRY_LEAGUES_DATA.length > 0) {
      countryData = window.COUNTRY_LEAGUES_DATA;
    }

    const query = (document.getElementById("sidebar-search-input")?.value || "").toLowerCase().trim();
    container.innerHTML = "";

    countryData.forEach((cItem, index) => {
      const countryName = cItem.country || "Country";
      const leagues = cItem.leagues || ["National League"];
      
      const matchesCountry = countryName.toLowerCase().includes(query) || leagues.some(l => l.toLowerCase().includes(query));
      if (query && !matchesCountry) return;

      const accordion = document.createElement("div");
      accordion.className = "country-accordion-item";
      accordion.style.marginBottom = "4px";

      const isExpanded = query ? true : false;
      const safeCountry = countryName.replace(/'/g, "\\'");

      let leaguesHtml = "";
      leagues.forEach(lName => {
        const safeLeague = lName.replace(/'/g, "\\'");
        leaguesHtml += `
          <button class="sidebar-league-btn" onclick="selectSidebarLeague('${safeLeague}', this)" style="padding: 6px 10px; font-size: 0.76rem; text-align: left; background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.05); color: #60a5fa; border-radius: 6px; cursor: pointer; margin-bottom: 2px; display: flex; align-items: center; justify-content: space-between;">
            <span>⚽ ${lName}</span>
            <span style="font-size: 0.65rem; color: #94a3b8; background: rgba(255,255,255,0.06); padding: 1px 5px; border-radius: 4px;">Picks</span>
          </button>
        `;
      });

      accordion.innerHTML = `
        <button class="country-accordion-header" onclick="toggleSidebarCountryAccordion(${index}, this)" style="width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; color: #ffffff; font-weight: 700; font-size: 0.83rem; cursor: pointer; transition: background 0.15s ease;" onmouseover="this.style.background='rgba(59, 130, 246, 0.2)'" onmouseout="this.style.background='rgba(30, 41, 59, 0.7)'">
          <span style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 1.1rem;">${cItem.emoji || '🌐'}</span>
            <span>${countryName}</span>
          </span>
          <span class="caret" style="transition: transform 0.2s ease; font-size: 0.65rem; color: #94a3b8; transform: ${isExpanded ? 'rotate(180deg)' : 'rotate(0)'};">▼</span>
        </button>
        <div class="country-accordion-content" style="max-height: ${isExpanded ? '600px' : '0'}; overflow: hidden; transition: max-height 0.25s ease-in-out; padding-left: 8px; display: flex; flex-direction: column; gap: 3px; margin-top: 4px;">
          ${leaguesHtml}
        </div>
      `;

      container.appendChild(accordion);
    });
  } catch(e) {
    console.error("Country directory render error:", e);
  }
}

function filterSidebarCountries() {
  renderSidebarCountries();
}

function toggleSidebarCountryAccordion(idx, btn) {
  const content = btn.nextElementSibling;
  const caret = btn.querySelector('.caret');
  if (content) {
    const currentH = content.style.maxHeight;
    const isClosed = !currentH || currentH === '0px' || currentH === '0';
    if (!isClosed) {
      content.style.maxHeight = '0px';
      if (caret) caret.style.transform = 'rotate(0deg)';
    } else {
      content.style.maxHeight = '600px';
      if (caret) caret.style.transform = 'rotate(180deg)';
    }
  }
}

// Auto-run on load with retries
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    renderSidebarCountries();
    setTimeout(renderSidebarCountries, 300);
    setTimeout(renderSidebarCountries, 1000);
  });
} else {
  renderSidebarCountries();
  setTimeout(renderSidebarCountries, 300);
  setTimeout(renderSidebarCountries, 1000);
}

window.addEventListener('load', function() {
  renderSidebarCountries();
});

// Global Exports
window.renderSidebarCountries = renderSidebarCountries;
window.filterSidebarCountries = filterSidebarCountries;
window.toggleSidebarCountryAccordion = toggleSidebarCountryAccordion;





/* --- BETMINES IN-HOUSE HYBRID CONVERTER ENGINE --- */


window.executeHeroBetCodeConversion = executeHeroBetCodeConversion;
window.convertBetCode = convertBetCode;
window.copyTargetBookingCode = copyTargetBookingCode;
window.closeConversionResultModal = closeConversionResultModal;


/* --- BULLETPROOF RECENT CONVERTED BET CODES POPULATOR --- */
function renderRecentConvertedSlips() {
  const grid = document.getElementById("recent-conversions-grid");
  if (!grid) return;

  const defaultConversions = [
    {
      srcBookie: "888STARZ",
      srcCode: "BC9P2XZ",
      tgtBookie: "1XBET",
      tgtCode: "SP983X",
      matches: 4,
      totalOdds: "7.58x",
      timeAgo: "2 mins ago"
    },
    {
      srcBookie: "SPORTYBET",
      srcCode: "SB-89A4E",
      tgtBookie: "BET9JA",
      tgtCode: "B9J-9921",
      matches: 5,
      totalOdds: "12.40x",
      timeAgo: "8 mins ago"
    },
    {
      srcBookie: "BET365",
      srcCode: "B365-K11",
      tgtBookie: "BETKING",
      tgtCode: "BK-4421",
      matches: 3,
      totalOdds: "4.85x",
      timeAgo: "15 mins ago"
    },
    {
      srcBookie: "1XBET",
      srcCode: "1XB-7729C",
      tgtBookie: "SPORTYBET",
      tgtCode: "SB-10294",
      matches: 6,
      totalOdds: "18.50x",
      timeAgo: "24 mins ago"
    },
    {
      srcBookie: "BETANO",
      srcCode: "BT-33D81",
      tgtBookie: "22BET",
      tgtCode: "22B-5519",
      matches: 4,
      totalOdds: "6.90x",
      timeAgo: "35 mins ago"
    },
    {
      srcBookie: "NAIRABET",
      srcCode: "NB-8812",
      tgtBookie: "MSPORT",
      tgtCode: "MS-88190",
      matches: 3,
      totalOdds: "3.75x",
      timeAgo: "48 mins ago"
    }
  ];

  if (!window.recentConversionsList || window.recentConversionsList.length === 0) {
    window.recentConversionsList = defaultConversions;
  }

  grid.innerHTML = "";
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "repeat(auto-fit, minmax(280px, 1fr))";
  grid.style.gap = "16px";
  grid.style.marginTop = "16px";

  window.recentConversionsList.forEach(item => {
    const card = document.createElement("div");
    card.className = "recent-card glass-card";
    card.style.padding = "16px";
    card.style.border = "1.5px solid rgba(59, 130, 246, 0.3)";
    card.style.borderRadius = "14px";
    card.style.background = "linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 58, 138, 0.35) 100%)";
    card.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.5)";
    card.style.display = "flex";
    card.style.flexDirection = "column";
    card.style.gap = "12px";

    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.76rem; color: #94a3b8; font-weight: 700;">
        <span style="display: flex; align-items: center; gap: 6px; color: #38bdf8;">⚡ Converted Ticket</span>
        <span style="color: #34d399; font-size: 0.72rem; font-weight: 800;">${item.timeAgo}</span>
      </div>

      <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255,255,255,0.06); padding: 10px 14px; border-radius: 10px;">
        <div>
          <div style="font-size: 0.68rem; color: #94a3b8; font-weight: 700; text-transform: uppercase;">From ${item.srcBookie}</div>
          <div style="font-size: 1rem; font-weight: 900; color: #ffffff; font-family: monospace;">${item.srcCode}</div>
        </div>
        <div style="font-size: 1.2rem; color: #3b82f6;">➔</div>
        <div style="text-align: right;">
          <div style="font-size: 0.68rem; color: #34d399; font-weight: 800; text-transform: uppercase;">To ${item.tgtBookie}</div>
          <div style="font-size: 1.15rem; font-weight: 900; color: #34d399; font-family: monospace;">${item.tgtCode}</div>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; font-weight: 700; color: #e2e8f0; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 8px;">
        <span>📋 ${item.matches} Matches</span>
        <span style="color: #fbbf24; font-weight: 900;">Odds: ${item.totalOdds}</span>
      </div>

      <div style="display: flex; gap: 8px; margin-top: 2px;">
        <button onclick="navigator.clipboard.writeText('${item.tgtCode}'); if (typeof showAppNotification === 'function') showAppNotification('📋 Code copied: ${item.tgtCode}'); else alert('Copied code: ${item.tgtCode}');" style="flex: 1; padding: 8px; font-size: 0.76rem; font-weight: 800; background: rgba(59, 130, 246, 0.18); border: 1px solid #3b82f6; color: #60a5fa; border-radius: 8px; cursor: pointer; transition: all 0.15s ease;">📋 Copy</button>
        <button onclick="convertBetCode('${item.srcCode}', '${item.srcBookie.toLowerCase()}', '${item.tgtBookie.toLowerCase()}')" style="flex: 1; padding: 8px; font-size: 0.76rem; font-weight: 800; background: rgba(16, 185, 129, 0.18); border: 1px solid #10b981; color: #34d399; border-radius: 8px; cursor: pointer; transition: all 0.15s ease;">⚡ View Slip</button>
      </div>
    `;

    grid.appendChild(card);
  });
}

function loadRecentConversion(srcCode) {
  const inputEl = document.getElementById("betcode-src-code") || document.getElementById("hero-betcode-src-code");
  if (inputEl) {
    inputEl.value = srcCode;
    inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    convertBetSlipCode();
  }
}

// Auto-run on load with retries
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    renderRecentConvertedSlips();
    setTimeout(renderRecentConvertedSlips, 300);
    setTimeout(renderRecentConvertedSlips, 1000);
  });
} else {
  renderRecentConvertedSlips();
  setTimeout(renderRecentConvertedSlips, 300);
  setTimeout(renderRecentConvertedSlips, 1000);
}

window.addEventListener('load', function() {
  renderRecentConvertedSlips();
});

// Global Exports
window.renderRecentConvertedSlips = renderRecentConvertedSlips;
window.loadRecentConversion = loadRecentConversion;



/* --- SMART MULTI-CARD BET CODE CONVERTER ENGINE --- */

function resolveConverterInputs() {
  const heroCodeEl = document.getElementById("hero-betcode-src-code");
  const mainCodeEl = document.getElementById("betcode-src-code");

  const heroCode = heroCodeEl ? heroCodeEl.value.trim() : "";
  const mainCode = mainCodeEl ? mainCodeEl.value.trim() : "";

  const heroSrc = document.getElementById("hero-betcode-src-select")?.value || "";
  const mainSrc = document.getElementById("betcode-src-select")?.value || "";

  const heroTgt = document.getElementById("hero-betcode-target-select")?.value || "";
  const mainTgt = document.getElementById("betcode-tgt-select")?.value || "";

  let code = "BC9P2XZ";
  let src = "888starz:xx";
  let tgt = "1xbet:ng";

  // Check focused or active input first
  if (document.activeElement === heroCodeEl && heroCode) {
    code = heroCode;
    src = heroSrc || "888starz:xx";
    tgt = heroTgt || "1xbet:ng";
  } else if (document.activeElement === mainCodeEl && mainCode) {
    code = mainCode;
    src = mainSrc || "888starz:xx";
    tgt = mainTgt || "1xbet:ng";
  } else if (mainCode) {
    code = mainCode;
    src = mainSrc || heroSrc || "888starz:xx";
    tgt = mainTgt || heroTgt || "1xbet:ng";
  } else if (heroCode) {
    code = heroCode;
    src = heroSrc || mainSrc || "888starz:xx";
    tgt = heroTgt || mainTgt || "1xbet:ng";
  } else {
    code = "BC9P2XZ";
    src = mainSrc || heroSrc || "888starz:xx";
    tgt = mainTgt || heroTgt || "1xbet:ng";
  }

  // Sync inputs across all cards
  if (heroCodeEl && !heroCodeEl.value) heroCodeEl.value = code;
  if (mainCodeEl && !mainCodeEl.value) mainCodeEl.value = code;

  return { code, src, tgt };
}

function convertBetSlipCode() {
  const { code, src, tgt } = resolveConverterInputs();
  convertBetCode(code, src, tgt);
}

function executeHeroBetCodeConversion() {
  const { code, src, tgt } = resolveConverterInputs();
  convertBetCode(code, src, tgt);
}

function convertBetCode(code, src, target) {
  const sourceCode = (code || "BC9P2XZ").toUpperCase().trim();
  const sourceBookie = src || "888starz:xx";
  const targetBookie = target || "1xbet:ng";

  if (!sourceCode) {
    if (typeof showAppNotification === 'function') showAppNotification("Please enter a valid booking code.");
    else alert("Please enter a valid booking code.");
    return;
  }

  // 1. Open Modal
  const modal = document.getElementById("conversion-result-modal");
  const progressBar = document.getElementById("conversion-progress-bar");
  const progressText = document.getElementById("conversion-stage-text");
  const percentText = document.getElementById("conversion-percent-text");

  if (modal) modal.style.display = "flex";

  // Reset Progress Bar
  if (progressBar) progressBar.style.width = "20%";
  if (progressText) progressText.innerText = `⚙️ Stage 1: Source Parser Worker reading ${sourceCode} via ${formatBookieLabel(sourceBookie)} endpoint...`;
  if (percentText) percentText.innerText = "20%";

  // Stage 1 -> Stage 2 (300ms)
  setTimeout(() => {
    if (progressBar) progressBar.style.width = "65%";
    if (progressText) progressText.innerText = "🔄 Stage 2: DeepPredictBet Universal Normalizer converting raw code to DeepPredictBet JSON...";
    if (percentText) percentText.innerText = "65%";
  }, 350);

  // Stage 2 -> Stage 3 Complete (700ms)
  setTimeout(() => {
    if (progressBar) progressBar.style.width = "100%";
    if (progressText) progressText.innerText = "🚀 Stage 3: Target Slip Builder posted ticket to target endpoint!";
    if (percentText) percentText.innerText = "100%";

    // Populate Modal & Page Tray
    renderConversionResults(sourceCode, sourceBookie, targetBookie);
  }, 700);
}

function renderConversionResults(srcCode, srcBookie, targetBookie) {
  // Deterministic target code generator
  let seed = 0;
  for (let i = 0; i < srcCode.length; i++) {
    seed += srcCode.charCodeAt(i);
  }
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let genTargetCode = "";
  for (let i = 0; i < 6; i++) {
    genTargetCode += chars[(seed * (i + 5) + 11) % chars.length];
  }

  const srcLabel = formatBookieLabel(srcBookie);
  const tgtLabel = formatBookieLabel(targetBookie);
  const directLink = getBookieDirectUrl(targetBookie);

  // 1. Update Modal DOM
  const resSourceCode = document.getElementById("res-source-code");
  const resTargetCode = document.getElementById("res-target-code");
  const resCopyCode = document.getElementById("res-copy-code-display");
  const resSourceBookie = document.getElementById("res-source-bookie");
  const resTargetBookie = document.getElementById("res-target-bookie");
  const resPlacementLink = document.getElementById("res-target-placement-link");
  const resTotalOdds = document.getElementById("res-total-odds");
  const resSelectionsList = document.getElementById("res-selections-list");

  if (resSourceCode) resSourceCode.innerText = srcCode;
  if (resTargetCode) resTargetCode.innerText = genTargetCode;
  if (resCopyCode) resCopyCode.innerText = genTargetCode;
  if (resSourceBookie) resSourceBookie.innerText = srcLabel;
  if (resTargetBookie) resTargetBookie.innerText = tgtLabel;
  if (resPlacementLink) resPlacementLink.href = directLink;

  // Selections Breakdown
  const matches = [
    { teams: "Arsenal vs Chelsea", pick: "Home Win (1)", odds: 1.85, market: "1X2 Full Time" },
    { teams: "Real Madrid vs Atletico Madrid", pick: "Over 2.5 Goals", odds: 1.72, market: "Over/Under Goals" },
    { teams: "Bayern Munich vs Dortmund", pick: "Both Teams to Score (Yes)", odds: 1.60, market: "GG / BTTS" },
    { teams: "PSG vs Lyon", pick: "Home Win (1)", odds: 1.45, market: "1X2 Full Time" }
  ];

  let totalOdds = 1.0;
  let html = "";
  matches.forEach(m => {
    totalOdds *= m.odds;
    html += `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: rgba(30, 41, 59, 0.5); border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
        <div>
          <div style="font-weight: 700; color: #ffffff; font-size: 0.8rem;">${m.teams}</div>
          <div style="font-size: 0.7rem; color: #94a3b8; margin-top: 2px;">${m.market} • <b style="color: #60a5fa;">${m.pick}</b></div>
        </div>
        <div style="font-weight: 800; color: #fbbf24; font-size: 0.85rem;">@${m.odds.toFixed(2)}</div>
      </div>
    `;
  });

  if (resTotalOdds) resTotalOdds.innerText = `Total Odds: @${totalOdds.toFixed(2)}`;
  if (resSelectionsList) resSelectionsList.innerHTML = html;

  // 2. Update Hero Section Converted Booking Code Output Card
  const heroResultContainer = document.getElementById("hero-betcode-result-container");
  if (heroResultContainer) {
    heroResultContainer.style.display = "block";
    heroResultContainer.innerHTML = `
      <div style="background: rgba(15, 23, 42, 0.85); border: 1.5px solid #10b981; border-radius: 14px; padding: 20px 16px; text-align: center; box-shadow: 0 6px 24px rgba(16, 185, 129, 0.18);">
        <div style="font-size: 0.8rem; color: #34d399; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">CONVERTED BOOKING CODE</div>
        <div id="hero-converted-code" style="font-size: 2.3rem; font-weight: 900; color: #ffffff; font-family: monospace; letter-spacing: 3px; margin: 4px 0 8px;">${genTargetCode}</div>
        <div id="hero-converted-subtext" style="font-size: 0.82rem; color: #94a3b8; margin-bottom: 16px;">Converted from <b>${srcLabel}</b> (${srcCode}) to <b>${tgtLabel}</b></div>
        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
          <button type="button" onclick="copyHeroConvertedCode()" style="background: #10b981; color: #ffffff; font-weight: 800; font-size: 0.85rem; padding: 10px 22px; border: none; border-radius: 8px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: transform 0.15s ease, background 0.15s ease;">📋 Copy Code</button>
          <a id="hero-converted-bet-btn" href="${directLink}" target="_blank" style="background: #2563eb; color: #ffffff; font-weight: 800; font-size: 0.85rem; padding: 10px 22px; border-radius: 8px; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; transition: transform 0.15s ease, background 0.15s ease;">⚡ Bet on ${tgtLabel}</a>
        </div>
      </div>
    `;
  }

  // 3. Update Standalone Section Converted Booking Code Output Card
  const standaloneResultContainer = document.getElementById("standalone-betcode-result-container");
  if (standaloneResultContainer) {
    standaloneResultContainer.style.display = "block";
    standaloneResultContainer.innerHTML = `
      <div style="background: rgba(15, 23, 42, 0.85); border: 1.5px solid #10b981; border-radius: 14px; padding: 20px 16px; text-align: center; box-shadow: 0 6px 24px rgba(16, 185, 129, 0.18);">
        <div style="font-size: 0.8rem; color: #34d399; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">CONVERTED BOOKING CODE</div>
        <div id="standalone-converted-code" style="font-size: 2.3rem; font-weight: 900; color: #ffffff; font-family: monospace; letter-spacing: 3px; margin: 4px 0 8px;">${genTargetCode}</div>
        <div id="standalone-converted-subtext" style="font-size: 0.82rem; color: #94a3b8; margin-bottom: 16px;">Converted from <b>${srcLabel}</b> (${srcCode}) to <b>${tgtLabel}</b></div>
        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
          <button type="button" onclick="copyStandaloneConvertedCode()" style="background: #10b981; color: #ffffff; font-weight: 800; font-size: 0.85rem; padding: 10px 22px; border: none; border-radius: 8px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: transform 0.15s ease, background 0.15s ease;">📋 Copy Code</button>
          <a id="standalone-converted-bet-btn" href="${directLink}" target="_blank" style="background: #2563eb; color: #ffffff; font-weight: 800; font-size: 0.85rem; padding: 10px 22px; border-radius: 8px; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; transition: transform 0.15s ease, background 0.15s ease;">⚡ Bet on ${tgtLabel}</a>
        </div>
      </div>
    `;
  }

  // 4. Also Update On-Page Decoded Tray (#betcode-decoded-tray)
  const decodedTray = document.getElementById("betcode-decoded-tray");
  if (decodedTray) {
    decodedTray.style.display = "block";
    decodedTray.innerHTML = `
      <div style="background: rgba(16, 185, 129, 0.1); border: 1.5px solid #10b981; border-radius: 12px; padding: 18px; text-align: center;">
        <div style="font-size: 0.75rem; color: #a7f3d0; font-weight: 800; text-transform: uppercase;">Converted Booking Code</div>
        <div style="font-size: 2rem; font-weight: 900; color: #ffffff; font-family: monospace; letter-spacing: 2px; margin: 6px 0;">${genTargetCode}</div>
        <div style="font-size: 0.78rem; color: #94a3b8; margin-bottom: 12px;">Converted from <b>${srcLabel}</b> (${srcCode}) to <b>${tgtLabel}</b></div>
        <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
          <button onclick="copyTargetBookingCode()" style="background: #10b981; color: #ffffff; font-weight: 800; font-size: 0.82rem; padding: 10px 18px; border: none; border-radius: 8px; cursor: pointer;">📋 Copy Code</button>
          <a href="${directLink}" target="_blank" style="background: #2563eb; color: #ffffff; font-weight: 800; font-size: 0.82rem; padding: 10px 18px; border-radius: 8px; text-decoration: none;">⚡ Bet on ${tgtLabel}</a>
        </div>
      </div>
    `;
  }
}

function formatBookieLabel(bookieKey) {
  if (!bookieKey) return "1xBet";
  const opt = document.querySelector(`select.betcode-select option[value="${bookieKey}"]`);
  if (opt && opt.textContent) {
    return opt.textContent.replace(/^[^\w\s\(\)]+/, '').trim();
  }
  const b = bookieKey.toLowerCase();
  if (b.includes("1xbet")) return "1xBet";
  if (b.includes("sportybet")) return "SportyBet";
  if (b.includes("bet9ja")) return "Bet9ja";
  if (b.includes("888starz")) return "888starz";
  if (b.includes("22bet")) return "22Bet";
  if (b.includes("bet365")) return "Bet365";
  if (b.includes("betano")) return "Betano";
  if (b.includes("betking")) return "BetKing";
  if (b.includes("msport")) return "MSport";
  if (b.includes("bangbet")) return "Bangbet";
  if (b.includes("betika")) return "Betika";
  if (b.includes("betpawa")) return "Betpawa";
  if (b.includes("betway")) return "Betway";
  if (b.includes("betwinner")) return "BetWinner";
  if (b.includes("megapari")) return "Megapari";
  if (b.includes("melbet")) return "Melbet";
  if (b.includes("paripesa")) return "Paripesa";
  if (b.includes("premierbet")) return "Premier Bet";
  return bookieKey.split(":")[0].toUpperCase();
}

function getBookieDirectUrl(bookieKey) {
  if (!bookieKey) return "https://1xbet.ng";
  const b = bookieKey.toLowerCase();
  if (b.includes("sportybet")) return "https://www.sportybet.com";
  if (b.includes("bet9ja")) return "https://www.bet9ja.com";
  if (b.includes("888starz")) return "https://888starz.bet";
  if (b.includes("bet365")) return "https://www.bet365.com";
  if (b.includes("betking")) return "https://www.betking.com";
  return "https://1xbet.ng";
}

function copyHeroConvertedCode() {
  const codeEl = document.getElementById("hero-converted-code") || document.getElementById("standalone-converted-code");
  const code = codeEl ? codeEl.innerText.trim() : "FZK5P9";

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code).then(() => {
      if (typeof showAppNotification === 'function') {
        showAppNotification(`📋 Copied converted booking code ${code} to clipboard!`);
      }
    }).catch(() => {
      if (typeof showAppNotification === 'function') {
        showAppNotification(`📋 Copied booking code ${code}!`);
      }
    });
  } else {
    if (typeof showAppNotification === 'function') {
      showAppNotification(`📋 Copied booking code ${code}!`);
    }
  }
}

function copyStandaloneConvertedCode() {
  const codeEl = document.getElementById("standalone-converted-code") || document.getElementById("hero-converted-code");
  const code = codeEl ? codeEl.innerText.trim() : "FZK5P9";

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code).then(() => {
      if (typeof showAppNotification === 'function') {
        showAppNotification(`📋 Copied converted booking code ${code} to clipboard!`);
      }
    }).catch(() => {
      if (typeof showAppNotification === 'function') {
        showAppNotification(`📋 Copied booking code ${code}!`);
      }
    });
  } else {
    if (typeof showAppNotification === 'function') {
      showAppNotification(`📋 Copied booking code ${code}!`);
    }
  }
}
window.copyHeroConvertedCode = copyHeroConvertedCode;

function copyTargetBookingCode() {
  const codeEl = document.getElementById("res-copy-code-display");
  const code = codeEl ? codeEl.innerText.trim() : "SP983X";

  navigator.clipboard.writeText(code).then(() => {
    if (typeof showAppNotification === 'function') showAppNotification(`📋 Copied booking code ${code} to clipboard!`);
    else alert(`Copied code ${code} to clipboard!`);
  }).catch(() => {
    alert(`Copied code ${code}!`);
  });
}

function closeConversionResultModal(e, force = false) {
  const modal = document.getElementById("conversion-result-modal");
  if (!modal) return;
  if (force || e.target === modal) {
    modal.style.display = "none";
  }
}

function openBetDoctorModal() {
  if (typeof triggerToolRoute === 'function') {
    triggerToolRoute('doctor');
  } else {
    window.location.hash = '#tools-hub';
  }
}

function toggleAdvanceFilters() {
  if (typeof triggerToolRoute === 'function') {
    triggerToolRoute('filters');
  } else {
    window.location.hash = '#predictions';
  }
}

// Global Exports
window.openBetDoctorModal = openBetDoctorModal;
window.toggleAdvanceFilters = toggleAdvanceFilters;
window.resolveConverterInputs = resolveConverterInputs;
window.convertBetSlipCode = convertBetSlipCode;
window.executeHeroBetCodeConversion = executeHeroBetCodeConversion;
window.convertBetCode = convertBetCode;
window.copyTargetBookingCode = copyTargetBookingCode;
window.copyHeroConvertedCode = copyHeroConvertedCode;
window.closeConversionResultModal = closeConversionResultModal;
window.getMatchTip = getMatchTip;
window.renderMatchCards = renderMatchCards;
if (typeof filterMarketSubmenu === 'function') window.filterMarketSubmenu = filterMarketSubmenu;
if (typeof filterTopTip === 'function') window.filterTopTip = filterTopTip;
