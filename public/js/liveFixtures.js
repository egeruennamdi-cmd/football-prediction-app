/**
 * DeepPredictBet — Live Fixtures Controller
 * Fetches real match data from API-Football via backend.
 *
 * Cold-start handling:
 *   - 1st attempt: 6-second timeout (fast path for a warm backend)
 *   - On TimeoutError/AbortError: shows "Warming up backend…" card and retries with 40s timeout
 *   - Only shows "No fixtures today" when the API responds with 0 matches (confirmed empty)
 *   - Shows a "Backend unavailable" card (with retry button) when both attempts fail
 *
 * DOM hiding:
 *   ensureVisible() uses getComputedStyle — catches display:none from CSS classes,
 *   not just inline styles, so every page-view container is correctly un-hidden.
 */

(function () {

  // ── API-Football league IDs ──────────────────────────────────────────────
  const LEAGUE_ID_MAP = {
    // Top 5 European Leagues
    'Premier League':          39,
    'La Liga':                 140,
    'Serie A':                 135,
    'Bundesliga':              78,
    'Ligue 1':                 61,
    // UEFA Competitions
    'Champions League':        2,
    'Europa League':           3,
    'Conference League':       848,
    // Other European Leagues
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
    // English Football & Cups
    'Championship':            40,
    'League One':              41,
    'FA Cup':                  45,
    'EFL Cup':                 48,
    // Domestic Cups
    'Copa del Rey':            143,
    'DFB Pokal':               81,
    'Coppa Italia':            137,
    'Coupe de France':         66,
    // Second Divisions
    'La Liga 2':               141,
    'Serie B':                 136,
    '2. Bundesliga':           79,
    // Americas
    'MLS':                     253,
    'Liga MX':                 262,
    'Brasileirão':             71,
    'Liga Profesional':        128,
    'Copa Libertadores':       13,
    'Copa Sudamericana':       11,
    'Colombia Primera A':      239,
    // Middle East
    'Saudi Pro League':        307,
    'UAE Pro League':          301,
    'Qatar Stars League':      305,
    // Africa
    'CAF Champions League':    12,
    'NPFL':                    302,
    'NPFL Nigeria':            302,
    'Ghana Premier League':    312,
    'South African PSL':       288,
    'Egyptian Premier League': 233,
    'Moroccan Botola':         200,
    'Kenyan Premier League':   318,
    'Tunisian Ligue 1':        202,
    // Asia & Oceania
    'J-League':                98,
    'K-League':                292,
    'Chinese Super League':    169,
    'Indian Super League':     323,
    'A-League':                188
  };

  const BACKEND_BASE = window.BACKEND_API_URL || 'https://deeppredictbet-backend.onrender.com';

  // ── Helpers ───────────────────────────────────────────────────────────────

  function getGrid() {
    return document.getElementById('fixtures-grid');
  }

  function getTodayDate() {
    const dateState = window.appState?.activePredictionDate || 'today';
    const today    = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    return dateState === 'tomorrow' ? tomorrow : today;
  }

  /**
   * Walk the DOM tree upward and force-show any hidden parent.
   * Uses getComputedStyle — catches display:none from CSS classes AND inline styles.
   */
  function ensureVisible() {
    const grid = getGrid();
    if (!grid) return;
    let el = grid.parentElement;
    while (el && el !== document.body) {
      const computed = window.getComputedStyle(el);
      if (computed.display === 'none')     el.style.display    = 'block';
      if (computed.visibility === 'hidden') el.style.visibility = 'visible';
      el = el.parentElement;
    }
    grid.style.display    = 'grid';
    grid.style.visibility = 'visible';
    grid.style.opacity    = '1';
  }

  function setTitle(leagueName, source, count) {
    const el = document.getElementById('matches-section-title');
    if (!el) return;
    const badge = source === 'live'
      ? `<span style="font-size:0.68rem;background:rgba(16,185,129,0.18);color:#10b981;border:1px solid rgba(16,185,129,0.35);border-radius:20px;padding:2px 10px;margin-left:8px;vertical-align:middle;font-weight:600;">🟢 Live</span>`
      : source === 'loading'
        ? `<span style="font-size:0.68rem;background:rgba(251,191,36,0.18);color:#fbbf24;border:1px solid rgba(251,191,36,0.35);border-radius:20px;padding:2px 10px;margin-left:8px;vertical-align:middle;font-weight:600;">⏳ Connecting…</span>`
        : `<span style="font-size:0.68rem;background:rgba(148,163,184,0.12);color:#94a3b8;border:1px solid rgba(148,163,184,0.25);border-radius:20px;padding:2px 10px;margin-left:8px;vertical-align:middle;font-weight:600;">📦 Cached</span>`;
    const countLabel = count > 0
      ? `<span style="font-size:0.75rem;color:var(--text-muted,#64748b);margin-left:6px;font-weight:normal;">(${count} fixture${count !== 1 ? 's' : ''})</span>`
      : '';
    el.innerHTML = `${leagueName} Predictions${badge}${countLabel}`;
  }

  // ── Skeleton loading cards ────────────────────────────────────────────────

  function showSkeletonCards() {
    const grid = getGrid();
    if (!grid) return;
    ensureVisible();
    grid.innerHTML = Array.from({ length: 4 }).map(() => `
      <div class="match-card" style="pointer-events:none;background:rgba(30,41,59,0.5);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:20px;animation:pulse 1.5s ease-in-out infinite;">
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

  // ── "Warming up backend" card (shown during cold-start retry) ─────────────

  function showWarmingUpCard(leagueName) {
    const grid = getGrid();
    if (!grid) return;
    ensureVisible();
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:44px 20px;background:linear-gradient(180deg,rgba(30,41,59,0.7) 0%,rgba(15,23,42,0.85) 100%);border:1px solid rgba(251,191,36,0.25);border-radius:18px;margin:8px 0;box-shadow:0 12px 32px rgba(0,0,0,0.35);">
        <div style="font-size:2.8rem;margin-bottom:14px;line-height:1;animation:spin 2s linear infinite;display:inline-block;">⚙️</div>
        <h3 style="font-size:1.2rem;font-weight:700;color:#f8fafc;margin-bottom:10px;">
          Connecting to live data…
        </h3>
        <p style="font-size:0.9rem;color:#94a3b8;line-height:1.6;max-width:440px;margin:0 auto 20px auto;">
          The live data server is warming up. Fetching today's
          <strong style="color:#fbbf24;">${leagueName}</strong> fixtures — this can take
          up to <strong style="color:#fbbf24;">30 seconds</strong> on first load.
        </p>
        <div style="display:flex;justify-content:center;gap:6px;">
          <span style="width:8px;height:8px;border-radius:50%;background:#fbbf24;animation:bounce 1.2s ease-in-out infinite;"></span>
          <span style="width:8px;height:8px;border-radius:50%;background:#fbbf24;animation:bounce 1.2s ease-in-out 0.2s infinite;"></span>
          <span style="width:8px;height:8px;border-radius:50%;background:#fbbf24;animation:bounce 1.2s ease-in-out 0.4s infinite;"></span>
        </div>
        <style>
          @keyframes bounce{0%,80%,100%{transform:scale(0)}40%{transform:scale(1)}}
          @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        </style>
      </div>`;
  }

  // ── "No fixtures today" card (API confirmed 0 matches) ────────────────────

  function showNoFixturesMessage(leagueName) {
    const grid = getGrid();
    if (!grid) return;
    ensureVisible();
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:44px 20px;background:linear-gradient(180deg,rgba(30,41,59,0.7) 0%,rgba(15,23,42,0.85) 100%);border:1px solid rgba(255,255,255,0.1);border-radius:18px;margin:8px 0;box-shadow:0 12px 32px rgba(0,0,0,0.35);">
        <div style="font-size:2.8rem;margin-bottom:12px;line-height:1;">📅</div>
        <h3 style="font-size:1.25rem;font-weight:700;color:#f8fafc;margin-bottom:8px;">
          No ${leagueName} fixtures today
        </h3>
        <p style="font-size:0.92rem;color:#94a3b8;line-height:1.6;max-width:480px;margin:0 auto 24px auto;">
          Our live data confirmed there are no scheduled matches for
          <strong style="color:#cbd5e1;">${leagueName}</strong> today.
          Check another league below, or come back on the next matchday.
        </p>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-bottom:20px;">
          <button onclick="window.selectSidebarLeague('Champions League', this)"
            style="padding:9px 18px;background:rgba(59,130,246,0.2);border:1px solid rgba(59,130,246,0.45);color:#93c5fd;border-radius:10px;cursor:pointer;font-size:0.84rem;font-weight:600;">
            ⭐ Champions League
          </button>
          <button onclick="window.selectSidebarLeague('Europa League', this)"
            style="padding:9px 18px;background:rgba(234,179,8,0.15);border:1px solid rgba(234,179,8,0.35);color:#fcd34d;border-radius:10px;cursor:pointer;font-size:0.84rem;font-weight:600;">
            🟠 Europa League
          </button>
          <button onclick="window.selectSidebarLeague('MLS', this)"
            style="padding:9px 18px;background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.35);color:#6ee7b7;border-radius:10px;cursor:pointer;font-size:0.84rem;font-weight:600;">
            🇺🇸 MLS
          </button>
        </div>
        <button onclick="window.renderAllAvailableMatches()"
          style="padding:8px 18px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.14);color:#cbd5e1;border-radius:8px;cursor:pointer;font-size:0.8rem;font-weight:500;">
          ← Show All Available Matches
        </button>
      </div>`;
  }

  // ── "Backend unavailable" card (both fetch attempts failed) ───────────────

  function showBackendUnavailableCard(leagueName, leagueId) {
    const grid = getGrid();
    if (!grid) return;
    ensureVisible();
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:44px 20px;background:linear-gradient(180deg,rgba(30,41,59,0.7) 0%,rgba(15,23,42,0.85) 100%);border:1px solid rgba(239,68,68,0.25);border-radius:18px;margin:8px 0;box-shadow:0 12px 32px rgba(0,0,0,0.35);">
        <div style="font-size:2.8rem;margin-bottom:12px;line-height:1;">📡</div>
        <h3 style="font-size:1.2rem;font-weight:700;color:#f8fafc;margin-bottom:8px;">
          Live data temporarily unavailable
        </h3>
        <p style="font-size:0.9rem;color:#94a3b8;line-height:1.6;max-width:460px;margin:0 auto 22px auto;">
          Could not reach the live server for <strong style="color:#cbd5e1;">${leagueName}</strong> right now.
          Please try again in a moment.
        </p>
        <button onclick="window.loadLiveFixturesForLeague('${leagueName.replace(/'/g, "\\'")}')"
          style="padding:10px 22px;background:rgba(59,130,246,0.25);border:1px solid rgba(59,130,246,0.5);color:#93c5fd;border-radius:10px;cursor:pointer;font-size:0.88rem;font-weight:600;margin-bottom:14px;">
          🔄 Try Again
        </button>
        <br>
        <button onclick="window.renderAllAvailableMatches()"
          style="padding:8px 18px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.14);color:#cbd5e1;border-radius:8px;cursor:pointer;font-size:0.8rem;font-weight:500;">
          ← Show All Available Matches
        </button>
      </div>`;
  }

  // ── Render live match cards ───────────────────────────────────────────────

  function renderLiveMatches(leagueName, matches) {
    window.MATCH_DATA = matches;
    ensureVisible();
    if (typeof window.renderMatchCards === 'function') {
      window.renderMatchCards(matches);
    }
    setTitle(leagueName, 'live', matches.length);
    const targetSection = document.getElementById('matches-section') ||
                          document.getElementById('fixtures-section') ||
                          document.querySelector('.predictions-section') ||
                          getGrid();
    if (targetSection) targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ── Core loader — two-attempt cold-start strategy ─────────────────────────

  async function loadLiveFixturesForLeague(leagueName) {
    const leagueId = LEAGUE_ID_MAP[leagueName] || null;

    // Immediately make the section visible
    ensureVisible();

    // Scroll to predictions area
    const targetSection = document.getElementById('matches-section') ||
                          document.getElementById('fixtures-section') ||
                          document.querySelector('.predictions-section') ||
                          getGrid();
    if (targetSection) targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Show skeleton while loading
    showSkeletonCards();
    setTitle(leagueName, 'loading', 0);

    const dateStr = getTodayDate();

    if (!leagueId) {
      // Unknown league — no API mapping
      showNoFixturesMessage(leagueName);
      setTitle(leagueName, 'live', 0);
      return;
    }

    const url = `${BACKEND_BASE}/api/v1/live/fixtures-by-league?league=${leagueId}&date=${dateStr}`;

    // ── ATTEMPT 1: fast (6-second timeout — warm backend) ────────────────
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
      if (res.ok) {
        const json = await res.json();
        const matches = Array.isArray(json.matches) ? json.matches : [];
        if (matches.length > 0) {
          renderLiveMatches(leagueName, matches);
        } else {
          // API confirmed: genuinely no fixtures today
          showNoFixturesMessage(leagueName);
          setTitle(leagueName, 'live', 0);
        }
        return;
      }
    } catch (err) {
      const isColdStart = err.name === 'TimeoutError' || err.name === 'AbortError';
      if (!isColdStart) {
        // Not a timeout — real network error
        showBackendUnavailableCard(leagueName, leagueId);
        setTitle(leagueName, 'cached', 0);
        return;
      }
      // Fall through to attempt 2 (cold-start scenario)
    }

    // ── ATTEMPT 2: slow (40-second timeout — cold-start warmup) ──────────
    showWarmingUpCard(leagueName);
    setTitle(leagueName, 'loading', 0);

    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(40000) });
      if (res.ok) {
        const json = await res.json();
        const matches = Array.isArray(json.matches) ? json.matches : [];
        if (matches.length > 0) {
          renderLiveMatches(leagueName, matches);
        } else {
          showNoFixturesMessage(leagueName);
          setTitle(leagueName, 'live', 0);
        }
        return;
      }
    } catch (err2) {
      console.debug('[LiveFixtures] Backend unavailable after cold-start retry:', err2.message);
    }

    // Both attempts failed
    showBackendUnavailableCard(leagueName, leagueId);
    setTitle(leagueName, 'cached', 0);
  }

  // ── "Show All" fallback ───────────────────────────────────────────────────

  function renderAllAvailableMatches() {
    const all = (typeof MATCH_DATA !== 'undefined' && Array.isArray(MATCH_DATA))
      ? MATCH_DATA : (window.MATCH_DATA || []);
    window.MATCH_DATA = all;
    ensureVisible();
    if (typeof window.renderMatchCards === 'function') window.renderMatchCards(all);
    const title = document.getElementById('matches-section-title');
    if (title) title.innerHTML = `All Match Predictions <span style="font-size:0.75rem;color:var(--text-muted);margin-left:6px;">(${all.length} fixtures)</span>`;
    document.querySelectorAll('.sidebar-league-btn').forEach(b => b.classList.remove('active'));
  }

  // ── selectSidebarLeague — owns active-state and calls loader ─────────────

  function selectSidebarLeague(leagueName, btn) {
    if (btn) {
      document.querySelectorAll('.sidebar-league-btn').forEach(b => b.classList.remove('active'));
      if (btn.classList) btn.classList.add('active');
    }
    loadLiveFixturesForLeague(leagueName);
  }

  // ── Global exports ────────────────────────────────────────────────────────

  window.loadLiveFixturesForLeague = loadLiveFixturesForLeague;
  window.renderAllAvailableMatches = renderAllAvailableMatches;

  // Prevent app.js / ui.js from overwriting selectSidebarLeague
  if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'selectSidebarLeague', {
      get: () => selectSidebarLeague,
      set: () => {},
      configurable: true
    });
  }

})();
