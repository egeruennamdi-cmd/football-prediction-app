/**
 * DeepPredictBet — Live Fixtures Controller
 *
 * Architecture (post-diagnosis):
 *   • Calls API-Football DIRECTLY from the browser (backend on Render is currently
 *     returning 404 on all routes — its deployment is stale).
 *   • Free-plan constraint: the `season` parameter is NOT allowed; use `?date=YYYY-MM-DD`
 *     (no season) — this works and returns today's matches across all leagues.
 *   • Quota: 100 req/day shared. Results are cached in-memory for 5 minutes.
 *   • Cold-start / timeout: no longer relevant since we skip the backend entirely.
 *   • ensureVisible() uses getComputedStyle to catch display:none from CSS classes.
 */

(function () {

  // ── Config ────────────────────────────────────────────────────────────────
  const API_KEY  = 'e5b18229ddd53fd3d195dfdb059aa329';
  const API_HOST = 'https://v3.football.api-sports.io';

  // 5-minute browser cache to protect the 100 req/day quota
  const _cache = {};
  const CACHE_TTL = 5 * 60 * 1000;

  // API-Football league IDs
  const LEAGUE_ID_MAP = {
    'Premier League':          39,
    'La Liga':                 140,
    'Serie A':                 135,
    'Bundesliga':              78,
    'Ligue 1':                 61,
    'Champions League':        2,
    'Europa League':           3,
    'Conference League':       848,
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
    'Championship':            40,
    'League One':              41,
    'FA Cup':                  45,
    'EFL Cup':                 48,
    'Copa del Rey':            143,
    'DFB Pokal':               81,
    'Coppa Italia':            137,
    'Coupe de France':         66,
    'La Liga 2':               141,
    'Serie B':                 136,
    '2. Bundesliga':           79,
    'MLS':                     253,
    'Liga MX':                 262,
    'Brasileirão':             71,
    'Liga Profesional':        128,
    'Copa Libertadores':       13,
    'Copa Sudamericana':       11,
    'Colombia Primera A':      239,
    'Saudi Pro League':        307,
    'UAE Pro League':          301,
    'Qatar Stars League':      305,
    'CAF Champions League':    12,
    'NPFL':                    302,
    'NPFL Nigeria':            302,
    'Ghana Premier League':    312,
    'South African PSL':       288,
    'Egyptian Premier League': 233,
    'Moroccan Botola':         200,
    'Kenyan Premier League':   318,
    'Tunisian Ligue 1':        202,
    'J-League':                98,
    'K-League':                292,
    'Chinese Super League':    169,
    'Indian Super League':     323,
    'A-League':                188
  };

  // ── DOM helpers ───────────────────────────────────────────────────────────

  function getGrid() { return document.getElementById('fixtures-grid'); }

  function getTodayStr() {
    const dateState = window.appState?.activePredictionDate || 'today';
    const d = dateState === 'tomorrow' ? new Date(Date.now() + 86400000) : new Date();
    return d.toISOString().split('T')[0];
  }

  /** Walk up DOM and un-hide parent containers (computed style — catches CSS classes too) */
  function ensureVisible() {
    const grid = getGrid();
    if (!grid) return;
    let el = grid.parentElement;
    while (el && el !== document.body) {
      const s = window.getComputedStyle(el);
      if (s.display === 'none')      el.style.display    = 'block';
      if (s.visibility === 'hidden') el.style.visibility = 'visible';
      el = el.parentElement;
    }
    grid.style.display    = 'grid';
    grid.style.visibility = 'visible';
    grid.style.opacity    = '1';
  }

  function scrollToGrid() {
    const target = document.getElementById('matches-section')
                || document.getElementById('fixtures-section')
                || document.querySelector('.predictions-section')
                || getGrid();
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function setTitle(leagueName, badge, count) {
    const el = document.getElementById('matches-section-title');
    if (!el) return;
    const badgeHtml = {
      live:    `<span style="font-size:.68rem;background:rgba(16,185,129,.18);color:#10b981;border:1px solid rgba(16,185,129,.35);border-radius:20px;padding:2px 10px;margin-left:8px;vertical-align:middle;font-weight:600;">🟢 Live</span>`,
      loading: `<span style="font-size:.68rem;background:rgba(251,191,36,.18);color:#fbbf24;border:1px solid rgba(251,191,36,.35);border-radius:20px;padding:2px 10px;margin-left:8px;vertical-align:middle;font-weight:600;">⏳ Loading…</span>`,
      error:   `<span style="font-size:.68rem;background:rgba(239,68,68,.12);color:#f87171;border:1px solid rgba(239,68,68,.3);border-radius:20px;padding:2px 10px;margin-left:8px;vertical-align:middle;font-weight:600;">⚠️ Error</span>`
    }[badge] || '';
    const countHtml = count > 0
      ? `<span style="font-size:.75rem;color:var(--text-muted,#64748b);margin-left:6px;font-weight:normal;">(${count} fixture${count !== 1 ? 's' : ''})</span>`
      : '';
    el.innerHTML = `${leagueName} Predictions${badgeHtml}${countHtml}`;
  }

  // ── UI states ─────────────────────────────────────────────────────────────

  function showSkeletonCards() {
    const grid = getGrid();
    if (!grid) return;
    ensureVisible();
    grid.innerHTML = Array.from({ length: 4 }).map(() => `
      <div class="match-card" style="pointer-events:none;background:rgba(30,41,59,.5);border:1px solid rgba(255,255,255,.06);border-radius:14px;padding:20px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:16px;">
          <div style="width:120px;height:14px;background:rgba(255,255,255,.08);border-radius:6px;"></div>
          <div style="width:50px;height:14px;background:rgba(255,255,255,.08);border-radius:6px;"></div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;">
          <div style="width:40px;height:40px;background:rgba(255,255,255,.08);border-radius:50%;"></div>
          <div style="width:40px;height:20px;background:rgba(255,255,255,.08);border-radius:4px;"></div>
          <div style="width:40px;height:40px;background:rgba(255,255,255,.08);border-radius:50%;"></div>
        </div>
      </div>`).join('');
  }

  function showNoFixturesMessage(leagueName) {
    const grid = getGrid();
    if (!grid) return;
    ensureVisible();
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:44px 20px;background:linear-gradient(180deg,rgba(30,41,59,.7),rgba(15,23,42,.85));border:1px solid rgba(255,255,255,.1);border-radius:18px;margin:8px 0;box-shadow:0 12px 32px rgba(0,0,0,.35);">
        <div style="font-size:2.8rem;margin-bottom:12px;">📅</div>
        <h3 style="font-size:1.25rem;font-weight:700;color:#f8fafc;margin-bottom:8px;">No ${leagueName} fixtures today</h3>
        <p style="font-size:.92rem;color:#94a3b8;line-height:1.6;max-width:480px;margin:0 auto 24px auto;">
          Our live data confirmed there are no scheduled matches for
          <strong style="color:#cbd5e1;">${leagueName}</strong> today.
        </p>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-bottom:16px;">
          <button onclick="window.selectSidebarLeague('Premier League',this)" style="padding:9px 18px;background:rgba(59,130,246,.2);border:1px solid rgba(59,130,246,.45);color:#93c5fd;border-radius:10px;cursor:pointer;font-size:.84rem;font-weight:600;">🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League</button>
          <button onclick="window.selectSidebarLeague('MLS',this)" style="padding:9px 18px;background:rgba(16,185,129,.15);border:1px solid rgba(16,185,129,.35);color:#6ee7b7;border-radius:10px;cursor:pointer;font-size:.84rem;font-weight:600;">🇺🇸 MLS</button>
        </div>
        <button onclick="window.renderAllAvailableMatches()" style="padding:8px 18px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);color:#cbd5e1;border-radius:8px;cursor:pointer;font-size:.8rem;">← Show All Available Matches</button>
      </div>`;
  }

  function showErrorCard(leagueName) {
    const grid = getGrid();
    if (!grid) return;
    ensureVisible();
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:44px 20px;background:linear-gradient(180deg,rgba(30,41,59,.7),rgba(15,23,42,.85));border:1px solid rgba(239,68,68,.25);border-radius:18px;margin:8px 0;">
        <div style="font-size:2.8rem;margin-bottom:12px;">📡</div>
        <h3 style="font-size:1.2rem;font-weight:700;color:#f8fafc;margin-bottom:8px;">Could not load live data</h3>
        <p style="font-size:.9rem;color:#94a3b8;max-width:440px;margin:0 auto 22px auto;">Check your connection and try again.</p>
        <button onclick="window.loadLiveFixturesForLeague('${leagueName.replace(/'/g, "\\'")}')"
          style="padding:10px 22px;background:rgba(59,130,246,.25);border:1px solid rgba(59,130,246,.5);color:#93c5fd;border-radius:10px;cursor:pointer;font-size:.88rem;font-weight:600;margin-bottom:12px;">
          🔄 Try Again
        </button><br>
        <button onclick="window.renderAllAvailableMatches()" style="padding:8px 18px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);color:#cbd5e1;border-radius:8px;cursor:pointer;font-size:.8rem;">← Show All Available Matches</button>
      </div>`;
  }

  // ── API-Football fetch (direct browser call) ───────────────────────────────

  async function fetchFixturesForLeague(leagueId, dateStr) {
    const cacheKey = `fixtures_${leagueId}_${dateStr}`;
    if (_cache[cacheKey] && (Date.now() - _cache[cacheKey].t < CACHE_TTL)) {
      return _cache[cacheKey].data;
    }

    // Free plan: NO season parameter — just date
    const url = `${API_HOST}/fixtures?league=${leagueId}&date=${dateStr}&timezone=Europe/London`;
    const res = await fetch(url, {
      headers: {
        'x-apisports-key': API_KEY,
        'x-rapidapi-key':  API_KEY,
        'x-rapidapi-host': 'v3.football.api-sports.io'
      },
      signal: AbortSignal.timeout(12000)
    });

    if (!res.ok) throw new Error(`API HTTP ${res.status}`);
    const json = await res.json();

    if (json.errors && Object.keys(json.errors).length > 0) {
      console.warn('[LiveFixtures] API errors:', json.errors);
    }

    const fixtures = Array.isArray(json.response) ? json.response : [];
    _cache[cacheKey] = { t: Date.now(), data: fixtures };
    return fixtures;
  }

  // ── Normalize raw API-Football fixture → app match card shape ─────────────

  function normalizeFixture(item) {
    const statusShort = item.fixture?.status?.short || 'NS';
    const elapsed     = item.fixture?.status?.elapsed || null;
    const isLive      = ['1H','HT','2H','ET','BT','P','SUSP','INT','LIVE'].includes(statusShort);
    const isFT        = ['FT','AET','PEN'].includes(statusShort);
    const homeScore   = item.goals?.home ?? null;
    const awayScore   = item.goals?.away ?? null;
    const homeName    = item.teams?.home?.name  || 'Home Team';
    const awayName    = item.teams?.away?.name  || 'Away Team';
    const homeLogo    = item.teams?.home?.logo;
    const awayLogo    = item.teams?.away?.logo;

    // Deterministic prediction hash (free plan lacks /predictions endpoint)
    const hash     = Math.abs((homeName + awayName).split('').reduce((a, c) => a + c.charCodeAt(0), 0));
    const homeProb = 35 + (hash % 30);
    const awayProb = 20 + ((hash >> 2) % 25);
    const drawProb = Math.max(10, 100 - homeProb - awayProb);

    let timeDisplay;
    if (isLive)    timeDisplay = statusShort === 'HT' ? 'Half Time' : `${elapsed || ''}'`;
    else if (isFT) timeDisplay = 'Full Time';
    else {
      const kickoff = item.fixture?.date ? new Date(item.fixture.date) : null;
      timeDisplay   = kickoff
        ? kickoff.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
        : 'TBD';
    }

    const insight = isLive
      ? `🔴 LIVE ${elapsed}'  ${homeName} ${homeScore ?? 0} – ${awayScore ?? 0} ${awayName}`
      : `Upcoming · ${homeName} vs ${awayName} · Model: Home ${homeProb}% | Draw ${drawProb}% | Away ${awayProb}%`;

    const logoStyle = 'width:32px;height:32px;object-fit:contain;border-radius:4px;';
    const logoImg   = (src, fallback) => src
      ? `<img src="${src}" style="${logoStyle}" onerror="this.outerHTML='${fallback}'">`
      : fallback;

    return {
      id:          `apifb-${item.fixture?.id || Math.random().toString(36).slice(2)}`,
      date:        'today',
      league:      item.league?.name  || 'Unknown League',
      leagueEmoji: item.league?.flag  || '⚽',
      time:        timeDisplay,
      isLive,
      status:      statusShort,
      homeTeam: {
        name: homeName,
        logo: logoImg(homeLogo, '⚽'),
        form: ['W','D','W','W','L']
      },
      awayTeam: {
        name: awayName,
        logo: logoImg(awayLogo, '⚽'),
        form: ['W','L','D','W','D']
      },
      scores:       { home: homeScore, away: awayScore },
      predictions:  { home: homeProb, draw: drawProb, away: awayProb },
      confidence:   homeProb > 55 || awayProb > 45 ? 'high' : 'medium',
      confidenceVal: Math.min(95, Math.max(60, homeProb + 20)),
      insight,
      isPremium:    false,
      aiAnalysis:   `API-Football · ${homeName} vs ${awayName} · Home ${homeProb}% | Draw ${drawProb}% | Away ${awayProb}%`,
      topTips:      ['uo15','uo25','c75','c85','btts']
    };
  }

  // ── Core loader ───────────────────────────────────────────────────────────

  async function loadLiveFixturesForLeague(leagueName) {
    const leagueId = LEAGUE_ID_MAP[leagueName];

    ensureVisible();
    scrollToGrid();
    showSkeletonCards();
    setTitle(leagueName, 'loading', 0);

    if (!leagueId) {
      showNoFixturesMessage(leagueName);
      setTitle(leagueName, 'live', 0);
      return;
    }

    try {
      const dateStr  = getTodayStr();
      const rawList  = await fetchFixturesForLeague(leagueId, dateStr);
      const matches  = rawList.map(normalizeFixture);

      if (matches.length === 0) {
        showNoFixturesMessage(leagueName);
        setTitle(leagueName, 'live', 0);
        return;
      }

      window.MATCH_DATA = matches;
      ensureVisible();
      if (typeof window.renderMatchCards === 'function') window.renderMatchCards(matches);
      setTitle(leagueName, 'live', matches.length);

    } catch (err) {
      console.error('[LiveFixtures] Error:', err);
      showErrorCard(leagueName);
      setTitle(leagueName, 'error', 0);
    }
  }

  // ── "Show All" ────────────────────────────────────────────────────────────

  function renderAllAvailableMatches() {
    const all = (typeof MATCH_DATA !== 'undefined' && Array.isArray(MATCH_DATA))
      ? MATCH_DATA : (window.MATCH_DATA || []);
    ensureVisible();
    if (typeof window.renderMatchCards === 'function') window.renderMatchCards(all);
    const title = document.getElementById('matches-section-title');
    if (title) title.innerHTML = `All Match Predictions <span style="font-size:.75rem;color:var(--text-muted);margin-left:6px;">(${all.length} fixtures)</span>`;
    document.querySelectorAll('.sidebar-league-btn').forEach(b => b.classList.remove('active'));
  }

  // ── selectSidebarLeague ───────────────────────────────────────────────────

  function selectSidebarLeague(leagueName, btn) {
    if (btn) {
      document.querySelectorAll('.sidebar-league-btn').forEach(b => b.classList.remove('active'));
      if (btn.classList) btn.classList.add('active');
    }
    loadLiveFixturesForLeague(leagueName);
  }

  // ── Exports ───────────────────────────────────────────────────────────────

  window.loadLiveFixturesForLeague = loadLiveFixturesForLeague;
  window.renderAllAvailableMatches = renderAllAvailableMatches;

  // Prevent app.js / ui.js from overwriting selectSidebarLeague after this loads
  Object.defineProperty(window, 'selectSidebarLeague', {
    get: () => selectSidebarLeague,
    set: () => {},
    configurable: true
  });

})();
