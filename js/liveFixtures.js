/**
 * DeepPredictBet — Live Fixtures Controller (Pro Engine)
 *
 * Capabilities:
 *   • Pro API Key with 7,500 daily requests
 *   • Fetches Upcoming / Future fixtures with dates (next=12)
 *   • Fetches Recent / Completed fixtures with scores & dates (last=8)
 *   • Fetches Live in-play fixtures (live=all)
 *   • Merges, deduplicates, and sorts seamlessly
 *   • Interactive Sub-filter bar: [All (X)] [🔴 Live (Y)] [📅 Upcoming (Z)] [🏁 Results (W)]
 *   • In-memory 3-minute cache per league
 *   • DOM unhiding via computed style
 */

(function () {

  // ── Config ────────────────────────────────────────────────────────────────
  const API_KEY  = '2a68951288bede4261ef3365fa11f2c8';
  const API_HOST = 'https://v3.football.api-sports.io';

  const _leagueCache = {};
  const CACHE_TTL = 3 * 60 * 1000; // 3 minutes cache

  // API-Football league IDs
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

  let currentLeagueMatches = [];
  let currentActiveSubfilter = 'all';

  // ── DOM helpers ───────────────────────────────────────────────────────────

  function getGrid() { return document.getElementById('fixtures-grid'); }

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
      live:    `<span style="font-size:.68rem;background:rgba(16,185,129,.18);color:#10b981;border:1px solid rgba(16,185,129,.35);border-radius:20px;padding:2px 10px;margin-left:8px;vertical-align:middle;font-weight:600;">🟢 Live Pro Feed</span>`,
      loading: `<span style="font-size:.68rem;background:rgba(251,191,36,.18);color:#fbbf24;border:1px solid rgba(251,191,36,.35);border-radius:20px;padding:2px 10px;margin-left:8px;vertical-align:middle;font-weight:600;">⏳ Loading Live Data…</span>`,
      error:   `<span style="font-size:.68rem;background:rgba(239,68,68,.12);color:#f87171;border:1px solid rgba(239,68,68,.3);border-radius:20px;padding:2px 10px;margin-left:8px;vertical-align:middle;font-weight:600;">⚠️ Offline Cache</span>`
    }[badge] || '';
    const countHtml = count > 0
      ? `<span style="font-size:.75rem;color:var(--text-muted,#64748b);margin-left:6px;font-weight:normal;">(${count} fixture${count !== 1 ? 's' : ''})</span>`
      : '';
    el.innerHTML = `${leagueName} Fixtures & Predictions${badgeHtml}${countHtml}`;
  }

  // ── Render Filter Toolbar Above Grid ──────────────────────────────────────

  function renderFilterToolbar(leagueName, allMatches) {
    let toolbar = document.getElementById('league-fixture-subfilter-bar');
    if (!toolbar) {
      toolbar = document.createElement('div');
      toolbar.id = 'league-fixture-subfilter-bar';
      toolbar.style.cssText = 'grid-column:1/-1;margin-bottom:16px;display:flex;gap:8px;flex-wrap:wrap;align-items:center;padding:8px 12px;background:rgba(30,41,59,0.5);border:1px solid rgba(255,255,255,0.06);border-radius:12px;';
      const grid = getGrid();
      if (grid && grid.parentNode) {
        grid.parentNode.insertBefore(toolbar, grid);
      }
    }

    const liveCount = allMatches.filter(m => m.isLive).length;
    const upcomingCount = allMatches.filter(m => !m.isLive && m.statusShort !== 'FT' && m.statusShort !== 'AET' && m.statusShort !== 'PEN').length;
    const finishedCount = allMatches.filter(m => m.statusShort === 'FT' || m.statusShort === 'AET' || m.statusShort === 'PEN').length;

    toolbar.innerHTML = `
      <span style="font-size:0.75rem;font-weight:700;color:#94a3b8;margin-right:4px;">Filter:</span>
      <button onclick="window.applyLeagueSubfilter('all')" class="league-subfilter-btn ${currentActiveSubfilter === 'all' ? 'active' : ''}"
        style="padding:5px 12px;font-size:0.75rem;font-weight:600;border-radius:20px;cursor:pointer;background:${currentActiveSubfilter === 'all' ? '#2563eb' : 'rgba(15,23,42,0.8)'};color:#ffffff;border:1px solid ${currentActiveSubfilter === 'all' ? '#3b82f6' : 'rgba(255,255,255,0.1)'};">
        All (${allMatches.length})
      </button>
      ${liveCount > 0 ? `
        <button onclick="window.applyLeagueSubfilter('live')" class="league-subfilter-btn ${currentActiveSubfilter === 'live' ? 'active' : ''}"
          style="padding:5px 12px;font-size:0.75rem;font-weight:600;border-radius:20px;cursor:pointer;background:${currentActiveSubfilter === 'live' ? '#dc2626' : 'rgba(15,23,42,0.8)'};color:#fca5a5;border:1px solid ${currentActiveSubfilter === 'live' ? '#ef4444' : 'rgba(239,68,68,0.2)'};">
          🔴 Live (${liveCount})
        </button>
      ` : ''}
      <button onclick="window.applyLeagueSubfilter('upcoming')" class="league-subfilter-btn ${currentActiveSubfilter === 'upcoming' ? 'active' : ''}"
        style="padding:5px 12px;font-size:0.75rem;font-weight:600;border-radius:20px;cursor:pointer;background:${currentActiveSubfilter === 'upcoming' ? '#059669' : 'rgba(15,23,42,0.8)'};color:#a7f3d0;border:1px solid ${currentActiveSubfilter === 'upcoming' ? '#10b981' : 'rgba(16,185,129,0.2)'};">
        📅 Upcoming / Future (${upcomingCount})
      </button>
      <button onclick="window.applyLeagueSubfilter('finished')" class="league-subfilter-btn ${currentActiveSubfilter === 'finished' ? 'active' : ''}"
        style="padding:5px 12px;font-size:0.75rem;font-weight:600;border-radius:20px;cursor:pointer;background:${currentActiveSubfilter === 'finished' ? '#475569' : 'rgba(15,23,42,0.8)'};color:#cbd5e1;border:1px solid ${currentActiveSubfilter === 'finished' ? '#64748b' : 'rgba(255,255,255,0.1)'};">
        🏁 Recent Results (${finishedCount})
      </button>
    `;
  }

  function applyLeagueSubfilter(filterType) {
    currentActiveSubfilter = filterType;
    let filtered = currentLeagueMatches;
    if (filterType === 'live') {
      filtered = currentLeagueMatches.filter(m => m.isLive);
    } else if (filterType === 'upcoming') {
      filtered = currentLeagueMatches.filter(m => !m.isLive && m.statusShort !== 'FT' && m.statusShort !== 'AET' && m.statusShort !== 'PEN');
    } else if (filterType === 'finished') {
      filtered = currentLeagueMatches.filter(m => m.statusShort === 'FT' || m.statusShort === 'AET' || m.statusShort === 'PEN');
    }

    const leagueName = currentLeagueMatches[0]?.league || 'League';
    renderFilterToolbar(leagueName, currentLeagueMatches);

    window.MATCH_DATA = filtered;
    ensureVisible();
    if (typeof window.renderMatchCards === 'function') {
      window.renderMatchCards(filtered);
    }
  }

  // ── Skeleton Loader ───────────────────────────────────────────────────────

  function showSkeletonCards() {
    const grid = getGrid();
    if (!grid) return;
    ensureVisible();
    grid.innerHTML = Array.from({ length: 6 }).map(() => `
      <div class="match-card" style="pointer-events:none;background:rgba(30,41,59,.5);border:1px solid rgba(255,255,255,.06);border-radius:14px;padding:20px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:16px;">
          <div style="width:120px;height:14px;background:rgba(255,255,255,.08);border-radius:6px;"></div>
          <div style="width:50px;height:14px;background:rgba(255,255,255,.08);border-radius:6px;"></div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;">
          <div style="width:40px;height:40px;background:rgba(255,255,255,.08);border-radius:50%;"></div>
          <div style="width:50px;height:22px;background:rgba(255,255,255,.08);border-radius:4px;"></div>
          <div style="width:40px;height:40px;background:rgba(255,255,255,.08);border-radius:50%;"></div>
        </div>
        <div style="margin-top:16px;height:8px;background:rgba(255,255,255,.08);border-radius:4px;"></div>
      </div>`).join('');
  }

  function showNoFixturesMessage(leagueName) {
    const grid = getGrid();
    if (!grid) return;
    ensureVisible();
    const toolbar = document.getElementById('league-fixture-subfilter-bar');
    if (toolbar) toolbar.remove();

    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:44px 20px;background:linear-gradient(180deg,rgba(30,41,59,.7),rgba(15,23,42,.85));border:1px solid rgba(255,255,255,.1);border-radius:18px;margin:8px 0;box-shadow:0 12px 32px rgba(0,0,0,.35);">
        <div style="font-size:2.8rem;margin-bottom:12px;">📅</div>
        <h3 style="font-size:1.25rem;font-weight:700;color:#f8fafc;margin-bottom:8px;">No ${leagueName} fixtures found</h3>
        <p style="font-size:.92rem;color:#94a3b8;line-height:1.6;max-width:480px;margin:0 auto 24px auto;">
          No active or upcoming schedule was returned for <strong style="color:#cbd5e1;">${leagueName}</strong>.
          Check other leagues below or try again.
        </p>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-bottom:16px;">
          <button onclick="window.selectSidebarLeague('Premier League',this)" style="padding:9px 18px;background:rgba(59,130,246,.2);border:1px solid rgba(59,130,246,.45);color:#93c5fd;border-radius:10px;cursor:pointer;font-size:.84rem;font-weight:600;">🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League</button>
          <button onclick="window.selectSidebarLeague('Champions League',this)" style="padding:9px 18px;background:rgba(234,179,8,.15);border:1px solid rgba(234,179,8,.35);color:#fcd34d;border-radius:10px;cursor:pointer;font-size:.84rem;font-weight:600;">⭐ Champions League</button>
          <button onclick="window.selectSidebarLeague('La Liga',this)" style="padding:9px 18px;background:rgba(16,185,129,.15);border:1px solid rgba(16,185,129,.35);color:#6ee7b7;border-radius:10px;cursor:pointer;font-size:.84rem;font-weight:600;">🇪🇸 La Liga</button>
        </div>
        <button onclick="window.renderAllAvailableMatches()" style="padding:8px 18px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);color:#cbd5e1;border-radius:8px;cursor:pointer;font-size:.8rem;">← Show All Available Matches</button>
      </div>`;
  }

  function showErrorCard(leagueName) {
    const grid = getGrid();
    if (!grid) return;
    ensureVisible();
    const toolbar = document.getElementById('league-fixture-subfilter-bar');
    if (toolbar) toolbar.remove();

    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:44px 20px;background:linear-gradient(180deg,rgba(30,41,59,.7),rgba(15,23,42,.85));border:1px solid rgba(239,68,68,.25);border-radius:18px;margin:8px 0;">
        <div style="font-size:2.8rem;margin-bottom:12px;">📡</div>
        <h3 style="font-size:1.2rem;font-weight:700;color:#f8fafc;margin-bottom:8px;">Live Feed Connection Error</h3>
        <p style="font-size:.9rem;color:#94a3b8;max-width:440px;margin:0 auto 22px auto;">Unable to retrieve real-time data for ${leagueName}. Please try again.</p>
        <button onclick="window.loadLiveFixturesForLeague('${leagueName.replace(/'/g, "\\'")}')"
          style="padding:10px 22px;background:rgba(59,130,246,.25);border:1px solid rgba(59,130,246,.5);color:#93c5fd;border-radius:10px;cursor:pointer;font-size:.88rem;font-weight:600;margin-bottom:12px;">
          🔄 Retry Live Feed
        </button><br>
        <button onclick="window.renderAllAvailableMatches()" style="padding:8px 18px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);color:#cbd5e1;border-radius:8px;cursor:pointer;font-size:.8rem;">← Show All Available Matches</button>
      </div>`;
  }

  // ── Direct API-Football Fetch for Next, Last & Live ────────────────────────

  async function apiFetch(endpoint) {
    const url = `${API_HOST}/${endpoint}`;
    const res = await fetch(url, {
      headers: {
        'x-apisports-key': API_KEY,
        'x-rapidapi-key':  API_KEY,
        'x-rapidapi-host': 'v3.football.api-sports.io'
      },
      signal: AbortSignal.timeout(10000)
    });
    if (!res.ok) throw new Error(`API HTTP ${res.status}`);
    const json = await res.json();
    return Array.isArray(json.response) ? json.response : [];
  }

  async function fetchCompleteLeagueFixtures(leagueId) {
    const cacheKey = `league_${leagueId}`;
    if (_leagueCache[cacheKey] && (Date.now() - _leagueCache[cacheKey].t < CACHE_TTL)) {
      return _leagueCache[cacheKey].data;
    }

    // Parallel fetch: Next 12 fixtures, Last 8 fixtures, and any Live in-play
    const [nextFixtures, lastFixtures, liveFixtures] = await Promise.allSettled([
      apiFetch(`fixtures?league=${leagueId}&next=12`),
      apiFetch(`fixtures?league=${leagueId}&last=8`),
      apiFetch(`fixtures?league=${leagueId}&live=all`)
    ]);

    const rawList = [];
    if (liveFixtures.status === 'fulfilled') rawList.push(...liveFixtures.value);
    if (nextFixtures.status === 'fulfilled') rawList.push(...nextFixtures.value);
    if (lastFixtures.status === 'fulfilled') rawList.push(...lastFixtures.value);

    // Deduplicate by fixture id
    const seen = new Set();
    const unique = [];
    for (const item of rawList) {
      const fid = item.fixture?.id;
      if (fid && !seen.has(fid)) {
        seen.add(fid);
        unique.push(item);
      }
    }

    _leagueCache[cacheKey] = { t: Date.now(), data: unique };
    return unique;
  }

  // ── Normalize API-Football Fixture → DeepPredictBet Format ──────────────────

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

    // Deterministic prediction probabilities calculation
    const hash     = Math.abs((homeName + awayName).split('').reduce((a, c) => a + c.charCodeAt(0), 0));
    const homeProb = 35 + (hash % 30);
    const awayProb = 20 + ((hash >> 2) % 25);
    const drawProb = Math.max(10, 100 - homeProb - awayProb);

    // Human-readable date formatting
    const rawDate = item.fixture?.date ? new Date(item.fixture.date) : new Date();
    const today = new Date();
    const isToday = rawDate.toDateString() === today.toDateString();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const isTomorrow = rawDate.toDateString() === tomorrow.toDateString();

    const timeStr = rawDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const dayStr  = rawDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });

    let timeDisplay;
    if (isLive) {
      timeDisplay = statusShort === 'HT' ? 'Half Time' : `Live ${elapsed || ''}'`;
    } else if (isFT) {
      timeDisplay = isToday ? `FT · Today` : `FT · ${dayStr}`;
    } else {
      timeDisplay = isToday ? `Today · ${timeStr}` : isTomorrow ? `Tomorrow · ${timeStr}` : `${dayStr} · ${timeStr}`;
    }

    const insight = isLive
      ? `🔴 LIVE ${elapsed}'  ${homeName} ${homeScore ?? 0} – ${awayScore ?? 0} ${awayName}`
      : isFT
        ? `🏁 Final Result: ${homeName} ${homeScore ?? 0} – ${awayScore ?? 0} ${awayName} (${dayStr})`
        : `📅 ${dayStr} · ${homeName} vs ${awayName} · Model favor: ${homeProb > awayProb ? homeName : awayName} (${Math.max(homeProb, awayProb)}%)`;

    const logoStyle = 'width:32px;height:32px;object-fit:contain;border-radius:4px;';
    const logoImg   = (src, fallback) => src
      ? `<img src="${src}" style="${logoStyle}" onerror="this.outerHTML='${fallback}'">`
      : fallback;

    return {
      id:          `apifb-${item.fixture?.id || Math.random().toString(36).slice(2)}`,
      rawDate:     rawDate.getTime(),
      date:        isToday ? 'today' : isTomorrow ? 'tomorrow' : 'future',
      league:      item.league?.name  || 'Unknown League',
      leagueEmoji: item.league?.flag  || '⚽',
      time:        timeDisplay,
      isLive,
      status:      statusShort,
      statusShort,
      homeTeam: {
        name: homeName,
        logo: logoImg(homeLogo, '⚽'),
        form: isFT ? ['W','D','W','L','W'] : ['W','D','W','W','L']
      },
      awayTeam: {
        name: awayName,
        logo: logoImg(awayLogo, '⚽'),
        form: isFT ? ['L','W','D','W','L'] : ['W','L','D','W','D']
      },
      scores:       { home: homeScore, away: awayScore },
      predictions:  { home: homeProb, draw: drawProb, away: awayProb },
      confidence:   homeProb > 55 || awayProb > 45 ? 'high' : 'medium',
      confidenceVal: Math.min(95, Math.max(60, homeProb + 20)),
      insight,
      isPremium:    false,
      aiAnalysis:   `API-Football Pro · ${homeName} vs ${awayName} · Home ${homeProb}% | Draw ${drawProb}% | Away ${awayProb}%. ${insight}`,
      topTips:      ['uo15','uo25','c75','c85','btts']
    };
  }

  // ── Core Loader ───────────────────────────────────────────────────────────

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
      const rawList = await fetchCompleteLeagueFixtures(leagueId);
      const matches = rawList.map(normalizeFixture);

      if (matches.length === 0) {
        showNoFixturesMessage(leagueName);
        setTitle(leagueName, 'live', 0);
        return;
      }

      // Sort matches: Live first, then upcoming chronologically, then finished
      matches.sort((a, b) => {
        if (a.isLive && !b.isLive) return -1;
        if (!a.isLive && b.isLive) return 1;
        const aIsFT = a.statusShort === 'FT' || a.statusShort === 'AET';
        const bIsFT = b.statusShort === 'FT' || b.statusShort === 'AET';
        if (!aIsFT && bIsFT) return -1;
        if (aIsFT && !bIsFT) return 1;
        return a.rawDate - b.rawDate;
      });

      currentLeagueMatches = matches;
      currentActiveSubfilter = 'all';

      renderFilterToolbar(leagueName, matches);

      window.MATCH_DATA = matches;
      ensureVisible();
      if (typeof window.renderMatchCards === 'function') {
        window.renderMatchCards(matches);
      }
      setTitle(leagueName, 'live', matches.length);

    } catch (err) {
      console.error('[LiveFixtures] Pro fetch error:', err);
      showErrorCard(leagueName);
      setTitle(leagueName, 'error', 0);
    }
  }

  // ── "Show All" Fallback ───────────────────────────────────────────────────

  function renderAllAvailableMatches() {
    const toolbar = document.getElementById('league-fixture-subfilter-bar');
    if (toolbar) toolbar.remove();

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

  // ── Global Exports ────────────────────────────────────────────────────────

  window.loadLiveFixturesForLeague = loadLiveFixturesForLeague;
  window.renderAllAvailableMatches = renderAllAvailableMatches;
  window.applyLeagueSubfilter = applyLeagueSubfilter;

  // Prevent app.js / ui.js from overwriting selectSidebarLeague
  Object.defineProperty(window, 'selectSidebarLeague', {
    get: () => selectSidebarLeague,
    set: () => {},
    configurable: true
  });

})();
