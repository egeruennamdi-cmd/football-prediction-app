/**
 * DeepPredictBet — Live Fixtures Controller
 * Fetches real match data from API-Football via the backend.
 * Replaces static MATCH_DATA when a league is selected in the sidebar.
 * Falls back silently to MATCH_DATA if the backend is offline.
 */

(function () {

  // League name → API-Football league ID
  const LEAGUE_ID_MAP = {
    'Premier League':  39,
    'La Liga':         140,
    'Bundesliga':      78,
    'Serie A':         135,
    'Ligue 1':         61,
    'Primeira Liga':   94,
    'Eredivisie':      88,
    'MLS':             253,
    'Champions League': 2,
    'Europa League':   3,
    'Conference League': 848,
    'NPFL':            302,
    'CAF Champions League': 12
  };

  const BACKEND_BASE = window.BACKEND_API_URL || 'https://deeppredictbet-backend.onrender.com';

  // Show skeleton loading cards in the fixtures grid
  function showSkeletonCards(count) {
    const grid = document.getElementById('fixtures-grid');
    if (!grid) return;
    grid.innerHTML = Array.from({ length: count || 6 }).map(() => `
      <div class="match-card" style="pointer-events:none;animation:pulse 1.4s ease-in-out infinite;">
        <div class="match-header" style="display:flex;justify-content:space-between;align-items:center;">
          <div style="width:120px;height:14px;background:rgba(255,255,255,0.07);border-radius:6px;"></div>
          <div style="width:60px;height:14px;background:rgba(255,255,255,0.07);border-radius:6px;"></div>
        </div>
        <div class="teams-wrapper" style="margin-top:16px;display:flex;justify-content:space-between;align-items:center;">
          <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
            <div style="width:40px;height:40px;background:rgba(255,255,255,0.07);border-radius:50%;"></div>
            <div style="width:80px;height:12px;background:rgba(255,255,255,0.07);border-radius:4px;"></div>
          </div>
          <div style="width:40px;height:20px;background:rgba(255,255,255,0.07);border-radius:4px;"></div>
          <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
            <div style="width:40px;height:40px;background:rgba(255,255,255,0.07);border-radius:50%;"></div>
            <div style="width:80px;height:12px;background:rgba(255,255,255,0.07);border-radius:4px;"></div>
          </div>
        </div>
        <div style="margin-top:16px;height:8px;background:rgba(255,255,255,0.07);border-radius:4px;"></div>
      </div>
    `).join('');
  }

  // Show a "Live" or "Cached" source badge above the fixtures grid
  function showSourceBadge(leagueName, source, count) {
    const title = document.getElementById('matches-section-title');
    if (!title) return;
    const badge = source === 'live'
      ? `<span style="font-size:0.68rem;background:rgba(16,185,129,0.15);color:#10b981;border:1px solid rgba(16,185,129,0.3);border-radius:20px;padding:2px 10px;margin-left:8px;vertical-align:middle;">🟢 Live API</span>`
      : `<span style="font-size:0.68rem;background:rgba(148,163,184,0.1);color:#94a3b8;border:1px solid rgba(148,163,184,0.2);border-radius:20px;padding:2px 10px;margin-left:8px;vertical-align:middle;">📦 Cached</span>`;
    title.innerHTML = `${leagueName} Predictions ${badge} <span style="font-size:0.72rem;color:var(--text-muted);margin-left:4px;">(${count} fixtures)</span>`;
  }

  /**
   * Main entry point — called when user clicks "⚽ Match Predictions" for a league.
   * @param {string} leagueName  - e.g. "Premier League"
   */
  async function loadLiveFixturesForLeague(leagueName) {
    const leagueId = LEAGUE_ID_MAP[leagueName];

    // Navigate to predictions view first
    if (typeof window.navigateToPage === 'function') {
      window.navigateToPage('predictions');
    }

    // Update section title immediately
    const title = document.getElementById('matches-section-title');
    if (title) title.textContent = `${leagueName} Predictions`;

    // Show skeleton while loading
    showSkeletonCards(6);

    // Determine date from app state
    const dateState = window.appState?.activePredictionDate || 'today';
    const todayStr  = new Date().toISOString().split('T')[0];
    const tomorrowDate = new Date(); tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrowStr = tomorrowDate.toISOString().split('T')[0];
    const dateStr = dateState === 'tomorrow' ? tomorrowStr : todayStr;

    if (leagueId) {
      try {
        const url = `${BACKEND_BASE}/api/v1/live/fixtures-by-league?league=${leagueId}&date=${dateStr}`;
        const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
        if (res.ok) {
          const json = await res.json();
          const liveMatches = json.matches || [];

          if (liveMatches.length > 0) {
            // Merge into global MATCH_DATA so filters & betslip still work
            window.MATCH_DATA = liveMatches;
            if (typeof window.renderMatchCards === 'function') {
              window.renderMatchCards(liveMatches);
            }
            showSourceBadge(leagueName, 'live', liveMatches.length);
            if (typeof window.showAppNotification === 'function') {
              window.showAppNotification(`🟢 Live fixtures loaded for ${leagueName}`);
            }
            return;
          }
        }
      } catch (err) {
        console.debug('[LiveFixtures] API fetch failed, using cached data:', err.message);
      }
    }

    // Silent fallback — filter static MATCH_DATA by league name
    const staticData = (typeof MATCH_DATA !== 'undefined' ? MATCH_DATA : [])
      .filter(m => !leagueName || m.league === leagueName || leagueName === 'all');
    const fallback = staticData.length > 0 ? staticData : (typeof MATCH_DATA !== 'undefined' ? MATCH_DATA : []);

    window.MATCH_DATA = fallback.length ? fallback : (window.MATCH_DATA || []);
    if (typeof window.renderMatchCards === 'function') {
      window.renderMatchCards(window.MATCH_DATA);
    }
    showSourceBadge(leagueName, 'cached', window.MATCH_DATA.length);
  }

  /**
   * selectSidebarLeague — called by sidebar "⚽ Match Predictions" buttons.
   * Overrides any prior definition so it uses live data.
   * @param {string} leagueName
   * @param {HTMLElement} btn
   */
  function selectSidebarLeague(leagueName, btn) {
    // Highlight button
    if (btn) {
      document.querySelectorAll('.sidebar-league-btn').forEach(b => b.classList.remove('active'));
      if (btn.classList) btn.classList.add('active');
    }
    // Trigger live fetch
    loadLiveFixturesForLeague(leagueName);
  }

  // Expose globally
  window.loadLiveFixturesForLeague = loadLiveFixturesForLeague;
  window.selectSidebarLeague       = selectSidebarLeague;

})();
