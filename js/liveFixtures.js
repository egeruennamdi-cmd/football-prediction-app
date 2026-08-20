/**
 * DeepPredictBet — Live Fixtures Controller
 * Fetches real match data from API-Football via the backend.
 * Replaces static MATCH_DATA when a league is selected in the sidebar.
 * Falls back silently to MATCH_DATA if backend is offline or returns no fixtures.
 */

(function () {

  // League name → API-Football league ID
  const LEAGUE_ID_MAP = {
    'Premier League':     39,
    'La Liga':            140,
    'Bundesliga':         78,
    'Serie A':            135,
    'Ligue 1':            61,
    'Primeira Liga':      94,
    'Eredivisie':         88,
    'MLS':                253,
    'Champions League':   2,
    'Europa League':      3,
    'Conference League':  848,
    'NPFL':               302,
    'CAF Champions League': 12
  };

  const BACKEND_BASE = window.BACKEND_API_URL || 'https://deeppredictbet-backend.onrender.com';

  // ── Helpers ─────────────────────────────────────────────────────────────

  function getGrid() {
    return document.getElementById('fixtures-grid');
  }

  function showSkeletonCards() {
    const grid = getGrid();
    if (!grid) return;
    grid.innerHTML = Array.from({ length: 6 }).map(() => `
      <div class="match-card" style="pointer-events:none;">
        <div class="match-header" style="display:flex;justify-content:space-between;align-items:center;">
          <div style="width:130px;height:13px;background:rgba(255,255,255,0.08);border-radius:6px;"></div>
          <div style="width:55px;height:13px;background:rgba(255,255,255,0.08);border-radius:6px;"></div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:20px;padding:0 8px;">
          <div style="display:flex;flex-direction:column;align-items:center;gap:10px;">
            <div style="width:44px;height:44px;background:rgba(255,255,255,0.08);border-radius:50%;"></div>
            <div style="width:72px;height:11px;background:rgba(255,255,255,0.08);border-radius:4px;"></div>
          </div>
          <div style="width:36px;height:20px;background:rgba(255,255,255,0.08);border-radius:4px;"></div>
          <div style="display:flex;flex-direction:column;align-items:center;gap:10px;">
            <div style="width:44px;height:44px;background:rgba(255,255,255,0.08);border-radius:50%;"></div>
            <div style="width:72px;height:11px;background:rgba(255,255,255,0.08);border-radius:4px;"></div>
          </div>
        </div>
        <div style="margin-top:18px;height:7px;background:rgba(255,255,255,0.08);border-radius:4px;"></div>
        <div style="margin-top:8px;height:7px;background:rgba(255,255,255,0.05);border-radius:4px;width:70%;"></div>
      </div>
    `).join('');
  }

  function setTitle(leagueName, source, count) {
    const el = document.getElementById('matches-section-title');
    if (!el) return;
    const badge = source === 'live'
      ? `<span style="font-size:0.67rem;background:rgba(16,185,129,0.15);color:#10b981;border:1px solid rgba(16,185,129,0.3);border-radius:20px;padding:2px 9px;margin-left:6px;vertical-align:middle;">🟢 Live</span>`
      : `<span style="font-size:0.67rem;background:rgba(148,163,184,0.1);color:#94a3b8;border:1px solid rgba(148,163,184,0.2);border-radius:20px;padding:2px 9px;margin-left:6px;vertical-align:middle;">📦 Cached</span>`;
    const countLabel = count > 0
      ? `<span style="font-size:0.7rem;color:var(--text-muted,#64748b);margin-left:6px;">(${count} fixture${count !== 1 ? 's' : ''})</span>`
      : '';
    el.innerHTML = `${leagueName} Predictions${badge}${countLabel}`;
  }

  function showNoFixturesMessage(leagueName) {
    const grid = getGrid();
    if (!grid) return;
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:48px 24px;color:var(--text-muted,#64748b);">
        <div style="font-size:2.5rem;margin-bottom:12px;">📅</div>
        <h3 style="font-size:1rem;font-weight:600;color:var(--text-secondary,#94a3b8);margin-bottom:8px;">
          No ${leagueName} fixtures today
        </h3>
        <p style="font-size:0.85rem;line-height:1.6;">
          The Premier League & major leagues typically play on <strong>weekends</strong>.<br>
          Check back on <strong>Saturday / Sunday</strong> for live predictions.
        </p>
        <div style="margin-top:20px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
          <button onclick="loadLiveFixturesForLeague('Champions League', null)" 
            style="padding:8px 16px;background:rgba(59,130,246,0.15);border:1px solid rgba(59,130,246,0.3);color:#60a5fa;border-radius:8px;cursor:pointer;font-size:0.82rem;">
            🏆 Champions League
          </button>
          <button onclick="loadLiveFixturesForLeague('Europa League', null)"
            style="padding:8px 16px;background:rgba(234,179,8,0.1);border:1px solid rgba(234,179,8,0.25);color:#f59e0b;border-radius:8px;cursor:pointer;font-size:0.82rem;">
            🥈 Europa League
          </button>
          <button onclick="loadLiveFixturesForLeague('MLS', null)"
            style="padding:8px 16px;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.25);color:#10b981;border-radius:8px;cursor:pointer;font-size:0.82rem;">
            🇺🇸 MLS
          </button>
        </div>
      </div>`;
  }

  // ── Main fetch function ─────────────────────────────────────────────────

  /**
   * Navigates to predictions view and loads live fixtures for a league.
   * @param {string} leagueName - e.g. "Premier League"
   */
  async function loadLiveFixturesForLeague(leagueName) {
    const leagueId = LEAGUE_ID_MAP[leagueName] || null;

    // 1. Navigate to predictions view
    if (typeof window.navigateToPage === 'function') {
      window.navigateToPage('predictions');
    }

    // 2. Tiny delay so the view DOM transition completes before we touch the grid
    await new Promise(resolve => setTimeout(resolve, 80));

    // 3. Show skeleton loading
    showSkeletonCards();

    // 4. Determine date
    const dateState = window.appState?.activePredictionDate || 'today';
    const today     = new Date().toISOString().split('T')[0];
    const tomorrow  = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const dateStr   = dateState === 'tomorrow' ? tomorrow : today;

    // 5. Try live API fetch
    if (leagueId) {
      try {
        const url = `${BACKEND_BASE}/api/v1/live/fixtures-by-league?league=${leagueId}&date=${dateStr}`;
        const res = await fetch(url, { signal: AbortSignal.timeout(9000) });

        if (res.ok) {
          const json = await res.json();
          const liveMatches = Array.isArray(json.matches) ? json.matches : [];

          if (liveMatches.length > 0) {
            // Inject into global state so filters/betslip still work
            window.MATCH_DATA = liveMatches;
            if (typeof MATCH_DATA !== 'undefined') {
              try { MATCH_DATA.length = 0; liveMatches.forEach(m => MATCH_DATA.push(m)); } catch(e) {}
            }
            await new Promise(r => setTimeout(r, 30)); // ensure view is painted
            if (typeof window.renderMatchCards === 'function') window.renderMatchCards(liveMatches);
            setTitle(leagueName, 'live', liveMatches.length);
            if (typeof window.showAppNotification === 'function') {
              window.showAppNotification(`🟢 ${liveMatches.length} live fixture(s) loaded for ${leagueName}`);
            }
            return;
          }

          // API responded OK but 0 fixtures — no games today for this league
          showNoFixturesMessage(leagueName);
          setTitle(leagueName, 'live', 0);
          return;
        }
      } catch (err) {
        console.debug('[LiveFixtures] Fetch failed, falling back:', err.message);
      }
    }

    // 6. Silent fallback — use static MATCH_DATA (filtered by league if possible)
    const staticAll  = (typeof MATCH_DATA !== 'undefined' && Array.isArray(MATCH_DATA)) ? MATCH_DATA : (window.MATCH_DATA || []);
    const filtered   = staticAll.filter(m => m.league === leagueName);
    const fallback   = filtered.length > 0 ? filtered : staticAll;

    if (fallback.length > 0) {
      window.MATCH_DATA = fallback;
      await new Promise(r => setTimeout(r, 30));
      if (typeof window.renderMatchCards === 'function') window.renderMatchCards(fallback);
      setTitle(leagueName, 'cached', fallback.length);
    } else {
      showNoFixturesMessage(leagueName);
      setTitle(leagueName, 'cached', 0);
    }
  }

  // ── selectSidebarLeague override ────────────────────────────────────────

  /**
   * Called by "⚽ Match Predictions" sidebar buttons.
   * Overrides any prior definition from app.js / ui.js.
   */
  function selectSidebarLeague(leagueName, btn) {
    if (btn) {
      document.querySelectorAll('.sidebar-league-btn').forEach(b => b.classList.remove('active'));
      if (btn.classList) btn.classList.add('active');
    }
    loadLiveFixturesForLeague(leagueName);
  }

  // Expose globally — must run AFTER app.js so this wins
  window.loadLiveFixturesForLeague = loadLiveFixturesForLeague;
  window.selectSidebarLeague       = selectSidebarLeague;

  // Also patch any existing window binding from ui.js
  if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'selectSidebarLeague', {
      get: () => selectSidebarLeague,
      set: () => {},          // block app.js / ui.js from overwriting it
      configurable: true
    });
  }

})();
