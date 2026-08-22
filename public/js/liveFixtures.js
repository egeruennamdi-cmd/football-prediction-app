/**
 * DeepPredictBet — Live Fixtures Controller
 * Fetches real match data from API-Football via backend.
 * Updates #fixtures-grid in-place — uses getComputedStyle to un-hide
 * parent containers regardless of whether display:none is set inline or via CSS class.
 */

(function () {

  const LEAGUE_ID_MAP = {
    // ── Top 5 European Leagues ──────────────────
    'Premier League':          39,
    'La Liga':                 140,
    'Serie A':                 135,
    'Bundesliga':              78,
    'Ligue 1':                 61,
    // ── UEFA Competitions ───────────────────────
    'Champions League':        2,
    'Europa League':           3,
    'Conference League':       848,
    // ── Other European Leagues ──────────────────
    'Eredivisie':              88,
    'Primeira Liga':           94,
    'Süper Lig':               203,
    'Scottish Premiership':    179,
    'Jupiler Pro League':      144,
    'Ekstraklasa':             106,
    'Eliteserien':             103,
    'Allsvenskan':             113,
    'Superliga':               119,
    'Swiss Super League':      207,
    'Austrian Bundesliga':     218,
    'Greek Super League':      197,
    'Russian Premier League':  235,
    'Ukrainian Premier League':333,
    // ── English Football & Cups ─────────────────
    'Championship':            40,
    'League One':              41,
    'FA Cup':                  45,
    'EFL Cup':                 48,
    // ── Domestic Cups ───────────────────────────
    'Copa del Rey':            143,
    'DFB Pokal':               81,
    'Coppa Italia':            137,
    'Coupe de France':         66,
    // ── Second Divisions ────────────────────────
    'La Liga 2':               141,
    'Serie B':                 136,
    '2. Bundesliga':           79,
    // ── Americas ────────────────────────────────
    'MLS':                     253,
    'Liga MX':                 262,
    'Brasileirão':             71,
    'Liga Profesional':        128,
    'Copa Libertadores':       13,
    'Copa Sudamericana':       11,
    'Colombia Primera A':      239,
    // ── Middle East ─────────────────────────────
    'Saudi Pro League':        307,
    'UAE Pro League':          301,
    'Qatar Stars League':      305,
    // ── Africa ──────────────────────────────────
    'CAF Champions League':    12,
    'NPFL':                    302,
    'NPFL Nigeria':            302,
    'Ghana Premier League':    312,
    'South African PSL':       288,
    'Egyptian Premier League': 233,
    'Moroccan Botola':         200,
    'Kenyan Premier League':   318,
    'Tunisian Ligue 1':        202,
    // ── Asia & Oceania ──────────────────────────
    'J-League':                98,
    'K-League':                292,
    'Chinese Super League':    169,
    'Indian Super League':     323,
    'A-League':                188
  };

  const BACKEND_BASE = window.BACKEND_API_URL || 'https://deeppredictbet-backend.onrender.com';

  function getGrid() {
    return document.getElementById('fixtures-grid');
  }

  /**
   * Walk the DOM tree upward and force-show any hidden parent.
   * Uses getComputedStyle — catches display:none from CSS classes, not just inline styles.
   */
  function ensureVisible() {
    const grid = getGrid();
    if (!grid) return;

    let el = grid.parentElement;
    while (el && el !== document.body) {
      const computed = window.getComputedStyle(el);
      if (computed.display === 'none') {
        el.style.display = 'block';
      }
      if (computed.visibility === 'hidden') {
        el.style.visibility = 'visible';
      }
      el = el.parentElement;
    }

    // Finally ensure the grid itself is visible
    grid.style.display    = 'grid';
    grid.style.visibility = 'visible';
    grid.style.opacity    = '1';
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

    // 1. Force-show the grid and all hidden parent containers (computed style aware)
    ensureVisible();

    // 2. Scroll to the predictions area
    const grid = getGrid();
    const targetSection = document.getElementById('matches-section') ||
                          document.getElementById('fixtures-section') ||
                          document.querySelector('.predictions-section') ||
                          grid;
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // 3. Show skeleton immediately
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
            ensureVisible();
            if (typeof window.renderMatchCards === 'function') window.renderMatchCards(liveMatches);
            setTitle(leagueName, 'live', liveMatches.length);
            return;
          }
          // API responded but 0 fixtures today
          showNoFixturesMessage(leagueName);
          setTitle(leagueName, 'live', 0);
          return;
        }
      } catch (err) {
        console.debug('[LiveFixtures] API bypassed, using fallback:', err.message);
      }
    }

    // 7. Fallback — always show the "no fixtures" message on off-days
    // (do NOT fall back to stale static MATCH_DATA as it misrepresents today's reality)
    showNoFixturesMessage(leagueName);
    setTitle(leagueName, 'cached', 0);
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

  // Use defineProperty to prevent app.js/ui.js from overwriting selectSidebarLeague
  if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'selectSidebarLeague', {
      get: () => selectSidebarLeague,
      set: () => {},
      configurable: true
    });
  }

})();
