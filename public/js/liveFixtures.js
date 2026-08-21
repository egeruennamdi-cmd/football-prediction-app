/**
 * DeepPredictBet — Live Fixtures Controller
 * Fetches real match data from API-Football via backend.
 * Updates #fixtures-grid in-place with smooth scrolling (never hides page views).
 * Displays high-visibility empty state with action buttons when a league has 0 active fixtures.
 */

(function () {

  const LEAGUE_ID_MAP = {
    'Premier League':       39,
    'La Liga':              140,
    'Bundesliga':           78,
    'Serie A':              135,
    'Ligue 1':              61,
    'Primeira Liga':        94,
    'Eredivisie':           88,
    'MLS':                  253,
    'Champions League':     2,
    'Europa League':        3,
    'Conference League':    848,
    'NPFL':                 302,
    'CAF Champions League': 12
  };

  const BACKEND_BASE = window.BACKEND_API_URL || 'https://deeppredictbet-backend.onrender.com';

  function getGrid() {
    return document.getElementById('fixtures-grid');
  }

  function ensureVisible() {
    const grid = getGrid();
    if (!grid) return;
    grid.style.display = 'grid';
    grid.style.visibility = 'visible';
    grid.style.opacity = '1';
    // Walk up and un-hide any hidden parent containers
    let parent = grid.parentElement;
    while (parent && parent !== document.body) {
      if (parent.style.display === 'none') {
        parent.style.display = 'block';
      }
      parent = parent.parentElement;
    }
  }

  function showSkeletonCards() {
    const grid = getGrid();
    if (!grid) return;
    ensureVisible();
    grid.innerHTML = Array.from({ length: 4 }).map(() => `
      <div class="match-card" style="pointer-events:none;background:rgba(30,41,59,0.5);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:20px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:16px;">
          <div style="width:120px;height:14px;background:rgba(255,255,255,0.08);border-radius:6px;"></div>
          <div style="width:50px;height:14px;background:rgba(255,255,255,0.08);border-radius:6px;"></div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;">
          <div style="width:40px;height:40px;background:rgba(255,255,255,0.08);border-radius:50%;"></div>
          <div style="width:40px;height:20px;background:rgba(255,255,255,0.08);border-radius:4px;"></div>
          <div style="width:40px;height:40px;background:rgba(255,255,255,0.08);border-radius:50%;"></div>
        </div>
        <div style="margin-top:16px;height:8px;background:rgba(255,255,255,0.08);border-radius:4px;"></div>
      </div>
    `).join('');
  }

  function setTitle(leagueName, source, count) {
    const el = document.getElementById('matches-section-title');
    if (!el) return;
    const badge = source === 'live'
      ? `<span style="font-size:0.68rem;background:rgba(16,185,129,0.18);color:#10b981;border:1px solid rgba(16,185,129,0.35);border-radius:20px;padding:2px 10px;margin-left:8px;vertical-align:middle;font-weight:600;">🟢 Live API</span>`
      : `<span style="font-size:0.68rem;background:rgba(148,163,184,0.12);color:#94a3b8;border:1px solid rgba(148,163,184,0.25);border-radius:20px;padding:2px 10px;margin-left:8px;vertical-align:middle;font-weight:600;">📦 Cached</span>`;
    const countLabel = count > 0
      ? `<span style="font-size:0.75rem;color:var(--text-muted,#64748b);margin-left:6px;font-weight:normal;">(${count} fixture${count !== 1 ? 's' : ''})</span>`
      : '';
    el.innerHTML = `${leagueName} Predictions${badge}${countLabel}`;
  }

  function showNoFixturesMessage(leagueName) {
    const grid = getGrid();
    if (!grid) return;
    ensureVisible();
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:44px 20px;background:linear-gradient(180deg,rgba(30,41,59,0.7) 0%,rgba(15,23,42,0.85) 100%);border:1px solid rgba(255,255,255,0.1);border-radius:18px;margin:8px 0;box-shadow:0 12px 32px rgba(0,0,0,0.35);">
        <div style="font-size:2.8rem;margin-bottom:12px;line-height:1;">📅</div>
        <h3 style="font-size:1.25rem;font-weight:700;color:#f8fafc;margin-bottom:8px;letter-spacing:-0.01em;">
          No ${leagueName} fixtures today
        </h3>
        <p style="font-size:0.92rem;color:#94a3b8;line-height:1.6;max-width:480px;margin:0 auto 24px auto;">
          The Premier League and top European leagues predominantly play on <strong style="color:#cbd5e1;">weekends</strong>.<br>
          Check back on <strong style="color:#cbd5e1;">Saturday &amp; Sunday</strong> for active matchday predictions.
        </p>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-bottom:20px;">
          <button onclick="window.selectSidebarLeague('Champions League', this)"
            style="padding:9px 18px;background:rgba(59,130,246,0.2);border:1px solid rgba(59,130,246,0.45);color:#93c5fd;border-radius:10px;cursor:pointer;font-size:0.84rem;font-weight:600;">
            🏆 Champions League
          </button>
          <button onclick="window.selectSidebarLeague('Europa League', this)"
            style="padding:9px 18px;background:rgba(234,179,8,0.15);border:1px solid rgba(234,179,8,0.35);color:#fcd34d;border-radius:10px;cursor:pointer;font-size:0.84rem;font-weight:600;">
            🥈 Europa League
          </button>
          <button onclick="window.selectSidebarLeague('MLS', this)"
            style="padding:9px 18px;background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.35);color:#6ee7b7;border-radius:10px;cursor:pointer;font-size:0.84rem;font-weight:600;">
            🇺🇸 MLS
          </button>
        </div>
        <div>
          <button onclick="window.renderAllAvailableMatches()"
            style="padding:8px 18px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.14);color:#cbd5e1;border-radius:8px;cursor:pointer;font-size:0.8rem;font-weight:500;">
            ← Show All Available Matches
          </button>
        </div>
      </div>`;
  }

  async function loadLiveFixturesForLeague(leagueName) {
    const leagueId = LEAGUE_ID_MAP[leagueName] || null;

    // 1. Ensure grid is visible FIRST — no router page switching
    ensureVisible();

    // 2. Scroll smoothly to the predictions area
    const grid = getGrid();
    const targetSection = document.getElementById('matches-section') ||
                          document.getElementById('fixtures-section') ||
                          document.querySelector('.predictions-section') ||
                          grid;
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // 3. Show skeleton loading cards immediately
    showSkeletonCards();

    // 4. Update section title
    const title = document.getElementById('matches-section-title');
    if (title) title.textContent = `${leagueName} Predictions`;

    // 5. Determine date
    const dateState = window.appState?.activePredictionDate || 'today';
    const today     = new Date().toISOString().split('T')[0];
    const tomorrow  = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const dateStr   = dateState === 'tomorrow' ? tomorrow : today;

    // 6. Try live API
    if (leagueId) {
      try {
        const url = `${BACKEND_BASE}/api/v1/live/fixtures-by-league?league=${leagueId}&date=${dateStr}`;
        const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
        if (res.ok) {
          const json = await res.json();
          const liveMatches = Array.isArray(json.matches) ? json.matches : [];
          if (liveMatches.length > 0) {
            window.MATCH_DATA = liveMatches;
            if (typeof window.renderMatchCards === 'function') window.renderMatchCards(liveMatches);
            setTitle(leagueName, 'live', liveMatches.length);
            return;
          }
          // 0 fixtures from API — show empty state card
          showNoFixturesMessage(leagueName);
          setTitle(leagueName, 'live', 0);
          return;
        }
      } catch (err) {
        console.debug('[LiveFixtures] API bypassed, using fallback:', err.message);
      }
    }

    // 7. Fallback: filter local MATCH_DATA by league
    const staticAll = (typeof MATCH_DATA !== 'undefined' && Array.isArray(MATCH_DATA))
      ? MATCH_DATA : (window.MATCH_DATA || []);
    const filtered = staticAll.filter(m => m.league === leagueName);

    if (filtered.length > 0) {
      window.MATCH_DATA = filtered;
      if (typeof window.renderMatchCards === 'function') window.renderMatchCards(filtered);
      setTitle(leagueName, 'cached', filtered.length);
    } else {
      // No local data either — show empty state card
      showNoFixturesMessage(leagueName);
      setTitle(leagueName, 'cached', 0);
    }
  }

  function renderAllAvailableMatches() {
    const staticAll = (typeof MATCH_DATA !== 'undefined' && Array.isArray(MATCH_DATA))
      ? MATCH_DATA : (window.MATCH_DATA || []);
    window.MATCH_DATA = staticAll;
    ensureVisible();
    if (typeof window.renderMatchCards === 'function') window.renderMatchCards(staticAll);
    const title = document.getElementById('matches-section-title');
    if (title) title.innerHTML = `All Match Predictions <span style="font-size:0.75rem;color:var(--text-muted);margin-left:6px;">(${staticAll.length} fixtures)</span>`;
    document.querySelectorAll('.sidebar-league-btn').forEach(b => b.classList.remove('active'));
  }

  function selectSidebarLeague(leagueName, btn) {
    if (btn) {
      document.querySelectorAll('.sidebar-league-btn').forEach(b => b.classList.remove('active'));
      if (btn.classList) btn.classList.add('active');
    }
    loadLiveFixturesForLeague(leagueName);
  }

  // Expose globally
  window.loadLiveFixturesForLeague = loadLiveFixturesForLeague;
  window.renderAllAvailableMatches = renderAllAvailableMatches;

  // Use defineProperty so app.js/ui.js cannot overwrite selectSidebarLeague after this runs
  if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'selectSidebarLeague', {
      get: () => selectSidebarLeague,
      set: () => {},
      configurable: true
    });
  }

})();
