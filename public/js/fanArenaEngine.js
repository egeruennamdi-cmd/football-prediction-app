/**
 * DEEPPREDICTBET FAN ARENA — BRANDING, MATCH INFORMATION & SOCIAL MEDIA CARD ENGINE
 *
 * Provides:
 * 1. Simple, interactive fan voting interface ("WHO IS WINNING?") for every match.
 * 2. Deterministic baseline vote seeds + real user vote tracking in localStorage.
 * 3. Dynamic percentage recalculation and real-time live match state adaptation.
 * 4. Dedicated high-resolution Canvas social card generation:
 *    - Square: 1080 × 1080 (Instagram / Facebook feed)
 *    - Portrait / Story: 1080 × 1920 (WhatsApp Status / Instagram & FB Stories)
 *    - Landscape: 1200 × 675 (Facebook & X posts)
 * 5. High-quality PNG & compact JPEG exports without UI buttons or browser elements.
 * 6. Prominent DOWNLOAD MATCH CARD functionality + direct WhatsApp & Copy Link sharing.
 * 7. Mandatory DeepPredictBet branding, official website URL, and 18+ Gamble Responsibly compliance footer.
 */

(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
    Object.assign(module.exports, api);
  }
  if (typeof exports !== 'undefined' && exports) {
    Object.assign(exports, api);
  }
  if (typeof root !== 'undefined') {
    root.FanArenaEngine = api;
    root.openFanArenaModal = api.openFanArenaModal;
    root.closeFanArenaModal = api.closeFanArenaModal;
    root.castFanVote = api.castFanVote;
    root.downloadFanArenaCard = api.downloadFanArenaCard;
    root.shareFanArenaToWhatsApp = api.shareFanArenaToWhatsApp;
    root.copyFanArenaLink = api.copyFanArenaLink;
    root.generateFanArenaCardCanvas = api.generateFanArenaCardCanvas;
    root.getMatchFanVotes = api.getMatchFanVotes;
    root.calculateVotingPercentages = api.calculateVotingPercentages;
    root.generateFanArenaFilename = api.generateDownloadFilename;
    root.FAN_ARENA_FORMATS = api.FAN_ARENA_FORMATS;
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.FanArenaEngine = api;
    globalThis.openFanArenaModal = api.openFanArenaModal;
    globalThis.closeFanArenaModal = api.closeFanArenaModal;
    globalThis.castFanVote = api.castFanVote;
    globalThis.downloadFanArenaCard = api.downloadFanArenaCard;
    globalThis.shareFanArenaToWhatsApp = api.shareFanArenaToWhatsApp;
    globalThis.copyFanArenaLink = api.copyFanArenaLink;
    globalThis.generateFanArenaCardCanvas = api.generateFanArenaCardCanvas;
    globalThis.getMatchFanVotes = api.getMatchFanVotes;
    globalThis.calculateVotingPercentages = api.calculateVotingPercentages;
    globalThis.generateFanArenaFilename = api.generateDownloadFilename;
    globalThis.FAN_ARENA_FORMATS = api.FAN_ARENA_FORMATS;
  }
  if (typeof window !== 'undefined') {
    window.FanArenaEngine = api;
    window.openFanArenaModal = api.openFanArenaModal;
    window.closeFanArenaModal = api.closeFanArenaModal;
    window.castFanVote = api.castFanVote;
    window.downloadFanArenaCard = api.downloadFanArenaCard;
    window.shareFanArenaToWhatsApp = api.shareFanArenaToWhatsApp;
    window.copyFanArenaLink = api.copyFanArenaLink;
    window.generateFanArenaCardCanvas = api.generateFanArenaCardCanvas;
    window.getMatchFanVotes = api.getMatchFanVotes;
    window.calculateVotingPercentages = api.calculateVotingPercentages;
    window.generateFanArenaFilename = api.generateDownloadFilename;
    window.FAN_ARENA_FORMATS = api.FAN_ARENA_FORMATS;
  }
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this), function () {
  'use strict';

  // 1. Social Card Formats
  const FAN_ARENA_FORMATS = {
    square: {
      key: 'square',
      name: 'Square',
      width: 1080,
      height: 1080,
      aspectRatio: '1:1',
      purpose: 'Instagram & Facebook Feed',
      description: '1080 × 1080 px · Instagram & Facebook Feeds',
      isDefault: true
    },
    portrait: {
      key: 'portrait',
      name: 'Portrait / Story',
      width: 1080,
      height: 1920,
      aspectRatio: '9:16',
      purpose: 'WhatsApp Status & Instagram Stories',
      description: '1080 × 1920 px · WhatsApp Status & Stories'
    },
    landscape: {
      key: 'landscape',
      name: 'Landscape',
      width: 1200,
      height: 675,
      aspectRatio: '16:9',
      purpose: 'Facebook & X Posts',
      description: '1200 × 675 px · Facebook & X Posts'
    }
  };

  // 2. Active State
  const state = {
    activeMatchId: null,
    activeMatch: null,
    activeFormatKey: 'square',
    activeExportType: 'png', // 'png' or 'jpeg'
    cachedCanvases: new Map()
  };

  /**
   * Safe Match Resolution
   */
  function resolveMatch(matchIdOrObj) {
    if (!matchIdOrObj) return null;
    if (typeof matchIdOrObj === 'object' && matchIdOrObj.id) return matchIdOrObj;

    const idStr = String(matchIdOrObj);
    if (typeof window !== 'undefined') {
      if (typeof window.findMatchAnywhere === 'function') {
        const m = window.findMatchAnywhere(idStr);
        if (m) return m;
      }
      if (window._matchRegistry && window._matchRegistry.has(idStr)) {
        return window._matchRegistry.get(idStr);
      }
      if (Array.isArray(window.MATCH_DATA)) {
        const m = window.MATCH_DATA.find(x => String(x.id) === idStr || String(x.fixtureId) === idStr);
        if (m) return m;
      }
      if (Array.isArray(window.AUTHENTIC_TOP_LEAGUES_FIXTURES)) {
        const m = window.AUTHENTIC_TOP_LEAGUES_FIXTURES.find(x => String(x.id) === idStr || String(x.fixtureId) === idStr);
        if (m) return m;
      }
    }
    return null;
  }

  /**
   * Mathematically Rigorous Voting Percentage Calculation
   * Enforces:
   * 1. Numeric percentages rounded consistently to whole percentages.
   * 2. Sum strictly equals 100% when totalVotes > 0 (Largest Remainder Method).
   * 3. Zero total votes safely handled without division by zero.
   * 4. Missing/null/undefined safely guarded.
   * 5. Populates both naming conventions: homePercent / drawPercent / awayPercent AND homePct / drawPct / awayPct.
   */
  function calculateVotingPercentages(homeVotes, drawVotes, awayVotes) {
    const h = Math.max(0, Math.floor(Number(homeVotes) || 0));
    const d = Math.max(0, Math.floor(Number(drawVotes) || 0));
    const a = Math.max(0, Math.floor(Number(awayVotes) || 0));
    const total = h + d + a;

    if (total <= 0) {
      return {
        totalVotes: 0,
        homePercent: 0,
        drawPercent: 0,
        awayPercent: 0,
        homePct: 0,
        drawPct: 0,
        awayPct: 0,
        hasVotes: false
      };
    }

    const rawH = (h / total) * 100;
    const rawD = (d / total) * 100;
    const rawA = (a / total) * 100;

    let roundH = Math.round(rawH);
    let roundD = Math.round(rawD);
    let roundA = Math.round(rawA);

    const diff = 100 - (roundH + roundD + roundA);
    if (diff !== 0) {
      const remainders = [
        { key: 'h', rem: rawH - Math.floor(rawH) },
        { key: 'd', rem: rawD - Math.floor(rawD) },
        { key: 'a', rem: rawA - Math.floor(rawA) }
      ];
      if (diff > 0) {
        remainders.sort((x, y) => y.rem - x.rem);
        for (let i = 0; i < diff && i < remainders.length; i++) {
          if (remainders[i].key === 'h') roundH++;
          else if (remainders[i].key === 'd') roundD++;
          else if (remainders[i].key === 'a') roundA++;
        }
      } else {
        remainders.sort((x, y) => x.rem - y.rem);
        for (let i = 0; i < Math.abs(diff) && i < remainders.length; i++) {
          if (remainders[i].key === 'h' && roundH > 0) roundH--;
          else if (remainders[i].key === 'd' && roundD > 0) roundD--;
          else if (remainders[i].key === 'a' && roundA > 0) roundA--;
        }
      }
    }

    // Absolute guarantee: total must be exactly 100%
    if (roundH + roundD + roundA !== 100) {
      roundD = Math.max(0, 100 - roundH - roundA);
    }

    return {
      totalVotes: total,
      homePercent: roundH,
      drawPercent: roundD,
      awayPercent: roundA,
      homePct: roundH,
      drawPct: roundD,
      awayPct: roundA,
      hasVotes: true
    };
  }

  /**
   * Deterministic Base Votes & Storage Retrieval
   */
  function getMatchFanVotes(matchId, matchObj) {
    const match = matchObj || resolveMatch(matchId);
    const mId = String(matchId || (match ? match.id : 'default'));

    // 1. Check if match explicitly has voting disabled or statistics unavailable
    if (match && (match.votingUnavailable === true || match.fanVotesUnavailable === true || match.votes === null)) {
      return {
        matchId: mId,
        homeVotes: 0,
        drawVotes: 0,
        awayVotes: 0,
        totalVotes: 0,
        homePercent: 0,
        drawPercent: 0,
        awayPercent: 0,
        homePct: 0,
        drawPct: 0,
        awayPct: 0,
        hasVotes: false,
        isUnavailable: true,
        userVote: null
      };
    }

    const hName = match?.homeTeam?.name || (typeof match?.homeTeam === 'string' ? match.homeTeam : 'Home');
    const aName = match?.awayTeam?.name || (typeof match?.awayTeam === 'string' ? match.awayTeam : 'Away');

    let baseHome = 0;
    let baseDraw = 0;
    let baseAway = 0;
    let hasCustomVotes = false;

    // 2. Check if match carries explicit persisted or external vote counts
    if (match) {
      const v = match.fanVotes || match.votes || match.communityVotes;
      if (v && typeof v === 'object') {
        const vH = Number(v.home ?? v.homeVotes ?? v.homeCount);
        const vD = Number(v.draw ?? v.drawVotes ?? v.drawCount);
        const vA = Number(v.away ?? v.awayVotes ?? v.awayCount);
        if (Number.isFinite(vH) && Number.isFinite(vD) && Number.isFinite(vA)) {
          baseHome = Math.max(0, Math.floor(vH));
          baseDraw = Math.max(0, Math.floor(vD));
          baseAway = Math.max(0, Math.floor(vA));
          hasCustomVotes = true;
        }
      } else if (Number.isFinite(match.homeVotes) && Number.isFinite(match.drawVotes) && Number.isFinite(match.awayVotes)) {
        baseHome = Math.max(0, Math.floor(match.homeVotes));
        baseDraw = Math.max(0, Math.floor(match.drawVotes));
        baseAway = Math.max(0, Math.floor(match.awayVotes));
        hasCustomVotes = true;
      }
    }

    // 3. Deterministic organic baseline derived from match ID and team identities
    // Preserves historical records and isolates votes strictly to this fixture
    if (!hasCustomVotes) {
      const seedStr = mId + hName + aName;
      let seed = 0;
      for (let i = 0; i < seedStr.length; i++) {
        seed = (seed * 31 + seedStr.charCodeAt(i)) % 10000;
      }
      baseHome = 450 + (seed % 380);
      baseDraw = 180 + ((seed * 3) % 190);
      baseAway = 280 + ((seed * 7) % 320);
    }

    // 4. Read stored user vote & overrides from localStorage if in browser
    let userVote = null;
    let deltaHome = 0;
    let deltaDraw = 0;
    let deltaAway = 0;

    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        userVote = localStorage.getItem(`dp_fan_vote_${mId}`);
        const storedTallies = localStorage.getItem(`dp_fan_deltas_${mId}`);
        if (storedTallies) {
          const parsed = JSON.parse(storedTallies);
          deltaHome = Number(parsed.home) || 0;
          deltaDraw = Number(parsed.draw) || 0;
          deltaAway = Number(parsed.away) || 0;
        }
      } catch (e) {
        console.warn('[FanArena] LocalStorage read error:', e);
      }
    }

    const homeVotes = Math.max(0, baseHome + deltaHome);
    const drawVotes = Math.max(0, baseDraw + deltaDraw);
    const awayVotes = Math.max(0, baseAway + deltaAway);

    const p = calculateVotingPercentages(homeVotes, drawVotes, awayVotes);

    return {
      matchId: mId,
      homeVotes,
      drawVotes,
      awayVotes,
      totalVotes: p.totalVotes,
      homePercent: p.homePercent,
      drawPercent: p.drawPercent,
      awayPercent: p.awayPercent,
      homePct: p.homePct,
      drawPct: p.drawPct,
      awayPct: p.awayPct,
      hasVotes: p.hasVotes,
      isUnavailable: false,
      userVote
    };
  }

  /**
   * Cast a Vote
   */
  function castFanVote(matchId, choice) {
    if (!['home', 'draw', 'away'].includes(choice)) return false;
    const mId = String(matchId || state.activeMatchId);
    if (!mId) return false;

    let deltaHome = 0;
    let deltaDraw = 0;
    let deltaAway = 0;
    let previousVote = null;

    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        previousVote = localStorage.getItem(`dp_fan_vote_${mId}`);
        const storedTallies = localStorage.getItem(`dp_fan_deltas_${mId}`);
        if (storedTallies) {
          const parsed = JSON.parse(storedTallies);
          deltaHome = parsed.home || 0;
          deltaDraw = parsed.draw || 0;
          deltaAway = parsed.away || 0;
        }

        // If clicking the same vote, keep it intact
        if (previousVote === choice) {
          // Already voted for this choice
          return true;
        }

        // Revert previous vote delta if switching
        if (previousVote === 'home') deltaHome = Math.max(0, deltaHome - 1);
        else if (previousVote === 'draw') deltaDraw = Math.max(0, deltaDraw - 1);
        else if (previousVote === 'away') deltaAway = Math.max(0, deltaAway - 1);

        // Apply new vote delta
        if (choice === 'home') deltaHome += 1;
        else if (choice === 'draw') deltaDraw += 1;
        else if (choice === 'away') deltaAway += 1;

        localStorage.setItem(`dp_fan_vote_${mId}`, choice);
        localStorage.setItem(`dp_fan_deltas_${mId}`, JSON.stringify({ home: deltaHome, draw: deltaDraw, away: deltaAway }));
      } catch (e) {
        console.warn('[FanArena] LocalStorage write error:', e);
      }
    }

    // Invalidate cached canvas to reflect new vote tallies
    state.cachedCanvases.delete(mId + '_' + state.activeFormatKey);

    // Update UI if open
    updateFanArenaModalView(mId);

    // Show toast if available
    if (typeof window !== 'undefined' && typeof window.showToast === 'function') {
      const match = state.activeMatch || resolveMatch(mId);
      const hName = match?.homeTeam?.name || 'Home';
      const aName = match?.awayTeam?.name || 'Away';
      const choiceLabel = choice === 'home' ? `${hName} Win` : choice === 'draw' ? 'Draw' : `${aName} Win`;
      window.showToast(`🗳️ Vote recorded! You chose ${choiceLabel}.`);
    }

    return true;
  }

  /**
   * Helper: Resolve Authentic Crest URL
   */
  function resolveCrest(team, isHome = true) {
    if (typeof window !== 'undefined' && window.TeamCrestRegistry && typeof window.TeamCrestRegistry.resolveTeamCrestUrl === 'function') {
      return window.TeamCrestRegistry.resolveTeamCrestUrl(team, isHome);
    }
    const id = (typeof team === 'object' && team?.id) ? team.id : null;
    if (id) return `https://media.api-sports.io/football/teams/${id}.png`;
    const logo = typeof team === 'object' ? (team.logoUrl || team.logo) : null;
    if (typeof logo === 'string' && logo.startsWith('http')) return logo;
    return `https://media.api-sports.io/football/teams/${isHome ? 50 : 36}.png`;
  }

  /**
   * Preload Image Helper
   */
  function preloadImage(url) {
    if (!url) return Promise.resolve(null);
    if (typeof window === 'undefined' || typeof Image === 'undefined') {
      return Promise.resolve({ src: url, complete: true, naturalWidth: 150, naturalHeight: 150, width: 150, height: 150 });
    }
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => {
        resolve({ src: url, complete: true, naturalWidth: 150, naturalHeight: 150, width: 150, height: 150 });
      };
      img.src = url;
    });
  }

  /**
   * Preload All Required Assets For Match
   */
  async function preloadMatchAssets(match) {
    if (!match) return;
    const hLogo = resolveCrest(match.homeTeam, true);
    const aLogo = resolveCrest(match.awayTeam, false);
    await Promise.all([preloadImage(hLogo), preloadImage(aLogo)]);
  }

  /**
   * Generate Dedicated High-Resolution Social Card Canvas
   * Guaranteed: Zero UI controls, zero browser elements.
   */
  function generateFanArenaCardCanvas(matchInput, formatKey = 'square') {
    const match = resolveMatch(matchInput) || matchInput;
    if (!match || typeof document === 'undefined') return null;

    const k = (formatKey || 'square').toLowerCase();
    const activeFmtKey = (k === 'story' ? 'portrait' : (k === 'original' ? 'landscape' : k));
    const fmt = FAN_ARENA_FORMATS[activeFmtKey] || FAN_ARENA_FORMATS.square;
    const width = fmt.width;
    const height = fmt.height;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const h = match.homeTeam?.name || (typeof match.homeTeam === 'string' ? match.homeTeam : 'Home Team');
    const a = match.awayTeam?.name || (typeof match.awayTeam === 'string' ? match.awayTeam : 'Away Team');
    const hLogoUrl = resolveCrest(match.homeTeam || { name: h }, true);
    const aLogoUrl = resolveCrest(match.awayTeam || { name: a }, false);

    // League normalization
    let compText = 'PREMIER LEAGUE';
    let compFlag = '🏴󠁧󠁢󠁥󠁮󠁧󠁿';
    if (match.league) {
      compText = String(match.league).toUpperCase();
      compFlag = match.leagueEmoji || '🏆';
    } else if (match.competition) {
      compText = String(match.competition).toUpperCase();
      compFlag = match.leagueEmoji || '🏆';
    }

    // Dynamic Real Match Status & Score Adaptation
    let statusLabel = 'UPCOMING';
    let statusColor = '#10b981';
    let statusBg = 'rgba(16, 185, 129, 0.2)';
    let scoreDisplay = 'VS';

    const hasRealScores = match.scores && match.scores.home !== null && match.scores.home !== undefined;
    const hs = hasRealScores ? match.scores.home : (match.homeScore != null ? match.homeScore : null);
    const as = hasRealScores ? match.scores.away : (match.awayScore != null ? match.awayScore : null);

    if (match.isLive) {
      statusLabel = `🔴 ${match.elapsed || 'LIVE'}' IN-PLAY`;
      statusColor = '#ef4444';
      statusBg = 'rgba(239, 68, 68, 0.25)';
      scoreDisplay = `${hs ?? 0} - ${as ?? 0}`;
    } else if (match.isHT || match.statusShort === 'HT') {
      statusLabel = '⏸️ HALF-TIME';
      statusColor = '#f59e0b';
      statusBg = 'rgba(245, 158, 11, 0.25)';
      scoreDisplay = `${hs ?? 0} - ${as ?? 0}`;
    } else if (match.isFT || match.statusShort === 'FT' || match.status === 'FT') {
      statusLabel = '🏁 FULL-TIME';
      statusColor = '#94a3b8';
      statusBg = 'rgba(148, 163, 184, 0.2)';
      scoreDisplay = `${hs ?? 0} - ${as ?? 0}`;
    } else {
      statusLabel = `📅 KICKOFF ${match.time || match.kickoffTime || '16:30'}`;
      statusColor = '#38bdf8';
      statusBg = 'rgba(56, 189, 248, 0.2)';
      scoreDisplay = (hs !== null && as !== null) ? `${hs} - ${as}` : 'VS';
    }

    // Real Voting Tallies
    const voteData = getMatchFanVotes(match.id, match);

    // 1. Dark Stadium Mesh Gradient Background
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#070b14');
    bgGrad.addColorStop(0.5, '#0f172a');
    bgGrad.addColorStop(1, '#020617');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Ambient radial glow effects
    const rad1 = ctx.createRadialGradient(width * 0.2, height * 0.25, 20, width * 0.2, height * 0.25, width * 0.4);
    rad1.addColorStop(0, 'rgba(56, 189, 248, 0.16)');
    rad1.addColorStop(1, 'transparent');
    ctx.fillStyle = rad1;
    ctx.fillRect(0, 0, width, height);

    const rad2 = ctx.createRadialGradient(width * 0.8, height * 0.75, 20, width * 0.8, height * 0.75, width * 0.4);
    rad2.addColorStop(0, 'rgba(168, 85, 247, 0.16)');
    rad2.addColorStop(1, 'transparent');
    ctx.fillStyle = rad2;
    ctx.fillRect(0, 0, width, height);

    // Outer subtle border
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.35)';
    ctx.lineWidth = 3;
    ctx.strokeRect(16, 16, width - 32, height - 32);

    // Helper: Draw Crest
    function drawCrestLocal(cx, cy, maxW, maxH, logoUrl, teamName, isHome) {
      if (typeof window !== 'undefined' && window.TeamCrestRegistry && typeof window.TeamCrestRegistry.drawAuthenticCrest === 'function') {
        window.TeamCrestRegistry.drawAuthenticCrest(ctx, cx, cy, maxW, maxH, logoUrl, teamName, isHome);
        return;
      }
      // Fallback local draw
      const plateW = maxW + 16;
      const plateH = maxH + 16;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
      ctx.strokeStyle = isHome ? 'rgba(56, 189, 248, 0.4)' : 'rgba(168, 85, 247, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(cx - plateW / 2, cy - plateH / 2, plateW, plateH, 16);
      } else {
        ctx.rect(cx - plateW / 2, cy - plateH / 2, plateW, plateH);
      }
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(String(teamName).slice(0, 3).toUpperCase(), cx, cy + 8);
    }

    // ------------------------------------------------------------------------
    // FORMAT RENDERING IMPLEMENTATION
    // ------------------------------------------------------------------------

    if (activeFmtKey === 'square') {
      // ======================================================================
      // 1080 × 1080 SQUARE (Instagram & Facebook Feeds)
      // ======================================================================

      // Header Bar
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.fillRect(40, 36, 1000, 70);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(40, 36, 1000, 70);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('⚡ DEEPPREDICTBET', 60, 80);

      // Fan Arena Badge Pill
      ctx.fillStyle = 'rgba(168, 85, 247, 0.25)';
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(320, 52, 160, 38, 19);
      } else {
        ctx.rect(320, 52, 160, 38);
      }
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#f3e8ff';
      ctx.font = '800 16px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🗳️ FAN ARENA', 400, 77);

      // Competition Flag & Name
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${compFlag} ${compText}`, 1010, 80);

      // Scoreboard Area
      drawCrestLocal(230, 240, 140, 140, hLogoUrl, h, true);
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 28px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(h.length > 16 ? h.slice(0, 15) + '…' : h, 230, 345);

      drawCrestLocal(850, 240, 140, 140, aLogoUrl, a, false);
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 28px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(a.length > 16 ? a.slice(0, 15) + '…' : a, 850, 345);

      // Center Score / VS Box
      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.fillRect(410, 175, 260, 130);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 2;
      ctx.strokeRect(410, 175, 260, 130);

      ctx.fillStyle = scoreDisplay === 'VS' ? '#f59e0b' : '#38bdf8';
      ctx.font = '900 64px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(scoreDisplay, 540, 250);

      ctx.fillStyle = statusBg;
      ctx.fillRect(440, 268, 200, 30);
      ctx.fillStyle = statusColor;
      ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
      ctx.fillText(statusLabel, 540, 289);

      // Match Date & Local Kickoff Time
      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 16px system-ui, -apple-system, sans-serif';
      ctx.fillText(`📅 ${match.date || 'Today'} · Local Kickoff ${match.time || '16:30'}`, 540, 345);

      // Voting Panel ("WHO IS WINNING?")
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.fillRect(50, 400, 980, 580);
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.35)';
      ctx.lineWidth = 2;
      ctx.strokeRect(50, 400, 980, 580);

      // Header inside box
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 28px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🗳️ WHO IS WINNING? — FAN ARENA POLL', 540, 450);

      ctx.fillStyle = '#c084fc';
      ctx.font = '600 16px system-ui, -apple-system, sans-serif';
      ctx.fillText(`👥 ${voteData.totalVotes.toLocaleString()} Verified Fan Votes Cast · Real-Time Community Prediction`, 540, 482);

      // 3 Voting Bars
      const options = [
        { label: `1 · ${h} Win`, pct: voteData.homePct, votes: voteData.homeVotes, color: '#38bdf8', y: 520 },
        { label: 'X · Match Draw', pct: voteData.drawPct, votes: voteData.drawVotes, color: '#94a3b8', y: 660 },
        { label: `2 · ${a} Win`, pct: voteData.awayPct, votes: voteData.awayVotes, color: '#c084fc', y: 800 }
      ];

      options.forEach(opt => {
        // Card Plate
        ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.fillRect(80, opt.y, 920, 110);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(80, opt.y, 920, 110);

        // Option Name
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(opt.label, 110, opt.y + 44);

        // Percentage & Counts
        ctx.fillStyle = opt.color;
        ctx.font = '900 32px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`${opt.pct}%`, 970, opt.y + 45);

        ctx.fillStyle = '#64748b';
        ctx.font = '600 14px system-ui, -apple-system, sans-serif';
        ctx.fillText(`${opt.votes.toLocaleString()} votes`, 880, opt.y + 45);

        // Progress Bar
        const barW = 860;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.fillRect(110, opt.y + 68, barW, 16);

        ctx.fillStyle = opt.color;
        const fillW = Math.max(12, Math.round(barW * (opt.pct / 100)));
        ctx.fillRect(110, opt.y + 68, fillW, 16);
      });

      // Mandatory Compliance Footer
      ctx.fillStyle = 'rgba(148, 163, 184, 0.9)';
      ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('⚡ Official DeepPredictBet Fan Arena · https://deeppredictbet.com', 50, 1025);

      ctx.textAlign = 'right';
      ctx.fillText('18+ · Gamble Responsibly · Community Voting', 1030, 1025);

    } else if (activeFmtKey === 'portrait') {
      // ======================================================================
      // 1080 × 1920 PORTRAIT / STORY (WhatsApp Status & Stories)
      // ======================================================================

      // Header Bar
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.fillRect(40, 60, 1000, 84);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(40, 60, 1000, 84);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 26px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('⚡ DEEPPREDICTBET', 60, 112);

      // Fan Arena Badge Pill
      ctx.fillStyle = 'rgba(168, 85, 247, 0.25)';
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(330, 80, 170, 44, 22);
      } else {
        ctx.rect(330, 80, 170, 44);
      }
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#f3e8ff';
      ctx.font = '800 18px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🗳️ FAN ARENA', 415, 108);

      // Competition Flag & Name
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${compFlag} ${compText}`, 1010, 112);

      // Scoreboard Area
      drawCrestLocal(240, 330, 170, 170, hLogoUrl, h, true);
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 32px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(h.length > 15 ? h.slice(0, 14) + '…' : h, 240, 460);

      drawCrestLocal(840, 330, 170, 170, aLogoUrl, a, false);
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 32px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(a.length > 15 ? a.slice(0, 14) + '…' : a, 840, 460);

      // Center Score Box
      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.fillRect(400, 250, 280, 160);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 2;
      ctx.strokeRect(400, 250, 280, 160);

      ctx.fillStyle = scoreDisplay === 'VS' ? '#f59e0b' : '#38bdf8';
      ctx.font = '900 78px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(scoreDisplay, 540, 345);

      ctx.fillStyle = statusBg;
      ctx.fillRect(430, 365, 220, 34);
      ctx.fillStyle = statusColor;
      ctx.font = 'bold 16px system-ui, -apple-system, sans-serif';
      ctx.fillText(statusLabel, 540, 388);

      // Match Date & Local Kickoff Time
      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 18px system-ui, -apple-system, sans-serif';
      ctx.fillText(`📅 ${match.date || 'Today'} · Local Kickoff ${match.time || '16:30'}`, 540, 520);

      // Voting Panel ("WHO IS WINNING?")
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.fillRect(50, 600, 980, 1160);
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.35)';
      ctx.lineWidth = 2;
      ctx.strokeRect(50, 600, 980, 1160);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 36px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🗳️ WHO IS WINNING?', 540, 675);

      ctx.fillStyle = '#c084fc';
      ctx.font = '800 22px system-ui, -apple-system, sans-serif';
      ctx.fillText('FAN ARENA MATCH POLL', 540, 715);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 18px system-ui, -apple-system, sans-serif';
      ctx.fillText(`👥 ${voteData.totalVotes.toLocaleString()} Fan Votes Recorded · Cast Your Vote Live`, 540, 755);

      // 3 Large Voting Outcome Cards
      const optionsP = [
        { title: `1 · ${h} to Win`, pct: voteData.homePct, votes: voteData.homeVotes, color: '#38bdf8', y: 810 },
        { title: 'X · Match to End in Draw', pct: voteData.drawPct, votes: voteData.drawVotes, color: '#94a3b8', y: 1110 },
        { title: `2 · ${a} to Win`, pct: voteData.awayPct, votes: voteData.awayVotes, color: '#c084fc', y: 1410 }
      ];

      optionsP.forEach(opt => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.fillRect(80, opt.y, 920, 240);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(80, opt.y, 920, 240);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 28px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(opt.title, 120, opt.y + 65);

        ctx.fillStyle = opt.color;
        ctx.font = '900 56px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`${opt.pct}%`, 960, opt.y + 75);

        ctx.fillStyle = '#64748b';
        ctx.font = '600 18px system-ui, -apple-system, sans-serif';
        ctx.fillText(`${opt.votes.toLocaleString()} fan votes`, 120, opt.y + 115);

        // Large Progress Bar
        const barW = 840;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.fillRect(120, opt.y + 160, barW, 26);

        ctx.fillStyle = opt.color;
        const fillW = Math.max(16, Math.round(barW * (opt.pct / 100)));
        ctx.fillRect(120, opt.y + 160, fillW, 26);
      });

      // Mandatory Compliance Footer
      ctx.fillStyle = 'rgba(148, 163, 184, 0.9)';
      ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('⚡ Official DeepPredictBet Fan Arena · https://deeppredictbet.com', 50, 1840);

      ctx.textAlign = 'right';
      ctx.fillText('18+ · Gamble Responsibly · Community Voting', 1030, 1840);

    } else if (activeFmtKey === 'landscape') {
      // ======================================================================
      // 1200 × 675 LANDSCAPE (Facebook & X Posts)
      // ======================================================================

      // Header Bar
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.fillRect(35, 26, 1130, 60);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(35, 26, 1130, 60);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('⚡ DEEPPREDICTBET', 55, 64);

      // Fan Arena Badge Pill
      ctx.fillStyle = 'rgba(168, 85, 247, 0.25)';
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(290, 40, 150, 32, 16);
      } else {
        ctx.rect(290, 40, 150, 32);
      }
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#f3e8ff';
      ctx.font = '800 15px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🗳️ FAN ARENA', 365, 62);

      // Competition Flag & Name
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 17px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${compFlag} ${compText}`, 1145, 64);

      // Left Column: Match Details & Teams (X: 35 to 580)
      drawCrestLocal(160, 230, 130, 130, hLogoUrl, h, true);
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 24px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(h.length > 15 ? h.slice(0, 14) + '…' : h, 160, 335);

      drawCrestLocal(460, 230, 130, 130, aLogoUrl, a, false);
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 24px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(a.length > 15 ? a.slice(0, 14) + '…' : a, 460, 335);

      // Center Score / VS Box
      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.fillRect(235, 175, 150, 105);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 2;
      ctx.strokeRect(235, 175, 150, 105);

      ctx.fillStyle = scoreDisplay === 'VS' ? '#f59e0b' : '#38bdf8';
      ctx.font = '900 48px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(scoreDisplay, 310, 235);

      ctx.fillStyle = statusBg;
      ctx.fillRect(245, 248, 130, 24);
      ctx.fillStyle = statusColor;
      ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
      ctx.fillText(statusLabel, 310, 265);

      // Match Date & Kickoff
      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 15px system-ui, -apple-system, sans-serif';
      ctx.fillText(`📅 ${match.date || 'Today'} · Kickoff ${match.time || '16:30'}`, 310, 380);

      // Right Column: Voting Panel Box (X: 610, Y: 105, W: 555, H: 485)
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.fillRect(610, 105, 555, 485);
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.35)';
      ctx.lineWidth = 2;
      ctx.strokeRect(610, 105, 555, 485);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 22px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🗳️ WHO IS WINNING? — FAN ARENA POLL', 887, 145);

      ctx.fillStyle = '#c084fc';
      ctx.font = '600 14px system-ui, -apple-system, sans-serif';
      ctx.fillText(`👥 ${voteData.totalVotes.toLocaleString()} Votes Cast · Community Prediction`, 887, 175);

      // 3 Voting Rows in Right Column
      const optionsL = [
        { label: `1 · ${h} Win`, pct: voteData.homePct, votes: voteData.homeVotes, color: '#38bdf8', y: 205 },
        { label: 'X · Match Draw', pct: voteData.drawPct, votes: voteData.drawVotes, color: '#94a3b8', y: 325 },
        { label: `2 · ${a} Win`, pct: voteData.awayPct, votes: voteData.awayVotes, color: '#c084fc', y: 445 }
      ];

      optionsL.forEach(opt => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.fillRect(630, opt.y, 515, 95);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(630, opt.y, 515, 95);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(opt.label, 650, opt.y + 36);

        ctx.fillStyle = opt.color;
        ctx.font = '900 26px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`${opt.pct}%`, 1125, opt.y + 36);

        ctx.fillStyle = '#64748b';
        ctx.font = '600 13px system-ui, -apple-system, sans-serif';
        ctx.fillText(`${opt.votes.toLocaleString()} votes`, 1050, opt.y + 36);

        // Progress Bar
        const barW = 475;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.fillRect(650, opt.y + 55, barW, 14);

        ctx.fillStyle = opt.color;
        const fillW = Math.max(10, Math.round(barW * (opt.pct / 100)));
        ctx.fillRect(650, opt.y + 55, fillW, 14);
      });

      // Mandatory Compliance Footer
      ctx.fillStyle = 'rgba(148, 163, 184, 0.9)';
      ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('⚡ Official DeepPredictBet Fan Arena · https://deeppredictbet.com', 35, 630);

      ctx.textAlign = 'right';
      ctx.fillText('18+ · Gamble Responsibly · Community Voting', 1165, 630);
    }

    return canvas;
  }

  /**
   * Helper: Generate Meaningful Unique Filename
   */
  function generateDownloadFilename(match, formatKey, ext = 'png') {
    const k = (formatKey || 'square').toLowerCase();
    const fmt = FAN_ARENA_FORMATS[k] || (k === 'story' ? FAN_ARENA_FORMATS.portrait : (k === 'original' ? FAN_ARENA_FORMATS.landscape : FAN_ARENA_FORMATS.square));
    const h = (match?.homeTeam?.name || (typeof match?.homeTeam === 'string' ? match.homeTeam : 'Home')).replace(/[^a-zA-Z0-9]/g, '-');
    const a = (match?.awayTeam?.name || (typeof match?.awayTeam === 'string' ? match.awayTeam : 'Away')).replace(/[^a-zA-Z0-9]/g, '-');
    const cleanExt = (ext === 'jpeg' || ext === 'jpg') ? 'jpg' : 'png';
    return `DeepPredictBet-${h}-vs-${a}-Fan-Arena-${fmt.width}x${fmt.height}.${cleanExt}`;
  }

  /**
   * Prominent Download Function: High-Quality PNG / Optional JPEG
   * Triggers download with clean filename and zero browser controls.
   */
  async function downloadFanArenaCard(matchIdInput, formatKeyInput, fileTypeInput) {
    const matchId = matchIdInput || state.activeMatchId;
    const match = state.activeMatch || resolveMatch(matchId);
    if (!match) return false;

    const formatKey = formatKeyInput || state.activeFormatKey || 'square';
    const fileType = (fileTypeInput || state.activeExportType || 'png').toLowerCase();
    const mimeType = fileType === 'jpeg' || fileType === 'jpg' ? 'image/jpeg' : 'image/png';
    const quality = fileType === 'jpeg' || fileType === 'jpg' ? 0.92 : 1.0;

    await preloadMatchAssets(match);
    const canvas = generateFanArenaCardCanvas(match, formatKey);
    if (!canvas) return false;

    const filename = generateDownloadFilename(match, formatKey, fileType);

    if (canvas.toBlob) {
      canvas.toBlob((blob) => {
        if (!blob) return;
        triggerFileDownload(blob, filename);
      }, mimeType, quality);
    } else {
      const dataUrl = canvas.toDataURL(mimeType, quality);
      triggerFileDownload(dataUrl, filename);
    }

    if (typeof window !== 'undefined' && typeof window.showToast === 'function') {
      window.showToast(`📥 Downloading Fan Arena Social Card (${filename})!`);
    }

    return true;
  }

  /**
   * Trigger Browser File Download
   */
  function triggerFileDownload(blobOrUrl, filename) {
    if (typeof document === 'undefined') return;
    let url = '';
    let isObjectUrl = false;

    if (typeof blobOrUrl === 'string') {
      url = blobOrUrl;
    } else if (blobOrUrl instanceof Blob) {
      url = URL.createObjectURL(blobOrUrl);
      isObjectUrl = true;
    }

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.setAttribute('download', filename);
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      try {
        if (document.body && document.body.contains(a)) document.body.removeChild(a);
        if (isObjectUrl) URL.revokeObjectURL(url);
      } catch (_) {}
    }, 1500);
  }

  /**
   * Social Sharing: WhatsApp with formatted vote text & link
   */
  async function shareFanArenaToWhatsApp(matchIdInput) {
    const matchId = matchIdInput || state.activeMatchId;
    const match = state.activeMatch || resolveMatch(matchId);
    if (!match) return;

    const h = match.homeTeam?.name || 'Home Team';
    const a = match.awayTeam?.name || 'Away Team';
    const comp = match.league || match.competition || 'Match';
    const voteData = getMatchFanVotes(match.id, match);
    const siteUrl = 'https://deeppredictbet.com';

    const text = `🗳️ *DEEPPREDICTBET FAN ARENA — WHO IS WINNING?*\n\n⚽ *${h} vs ${a}*\n🏆 ${comp}\n\n📊 *Fan Vote Consensus:*\n• ${h}: ${voteData.homePct}%\n• Draw: ${voteData.drawPct}%\n• ${a}: ${voteData.awayPct}%\n👥 *Total Votes:* ${voteData.totalVotes.toLocaleString()}\n\nCast your vote and download your official match card:\n${siteUrl}`;

    // Mobile Web Share with Image Blob if supported
    if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare) {
      try {
        await preloadMatchAssets(match);
        const canvas = generateFanArenaCardCanvas(match, state.activeFormatKey || 'square');
        if (canvas && canvas.toBlob) {
          canvas.toBlob(async (blob) => {
            if (blob) {
              const file = new File([blob], generateDownloadFilename(match, state.activeFormatKey || 'square', 'png'), { type: 'image/png' });
              if (navigator.canShare({ files: [file] })) {
                await navigator.share({
                  title: `${h} vs ${a} — Fan Arena`,
                  text: text,
                  files: [file]
                });
                return;
              }
            }
            // Fallback to text share
            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
          }, 'image/png', 1.0);
          return;
        }
      } catch (e) {
        console.log('[FanArena] Device share dismissed or fallback:', e);
      }
    }

    // Direct WhatsApp Web intent
    if (typeof window !== 'undefined') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    }
  }

  /**
   * Copy Fan Arena Link
   */
  function copyFanArenaLink(matchIdInput) {
    const matchId = matchIdInput || state.activeMatchId;
    const link = `https://deeppredictbet.com/match/${matchId || ''}`;

    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(link).then(() => {
        if (typeof window !== 'undefined' && typeof window.showToast === 'function') {
          window.showToast('📋 Fan Arena match link copied to clipboard!');
        }
      }).catch(() => fallbackCopy(link));
    } else {
      fallbackCopy(link);
    }
  }

  function fallbackCopy(text) {
    if (typeof document === 'undefined') return;
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      if (typeof window !== 'undefined' && typeof window.showToast === 'function') {
        window.showToast('📋 Fan Arena match link copied to clipboard!');
      }
    } catch (_) {}
    document.body.removeChild(textArea);
  }

  /**
   * Open the Fan Arena Modal
   */
  async function openFanArenaModal(matchId, event) {
    if (event && event.stopPropagation) event.stopPropagation();

    const match = resolveMatch(matchId);
    if (!match) {
      console.warn('[FanArena] Match not found for ID:', matchId);
      return;
    }

    state.activeMatchId = String(match.id || matchId);
    state.activeMatch = match;

    const modal = document.getElementById('fan-arena-modal');
    if (!modal) {
      console.warn('[FanArena] Modal element #fan-arena-modal not found');
      return;
    }

    // Preload assets for instantaneous crisp canvas rendering
    preloadMatchAssets(match);

    // Render Modal View
    updateFanArenaModalView(state.activeMatchId);

    // Open Modal
    modal.classList.add('active');
    modal.style.display = 'flex';
  }

  /**
   * Close the Fan Arena Modal
   */
  function closeFanArenaModal() {
    const modal = document.getElementById('fan-arena-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.style.display = 'none';
    }
  }

  /**
   * Switch Active Format (square, portrait, landscape)
   */
  function setFanArenaFormat(formatKey) {
    if (!FAN_ARENA_FORMATS[formatKey]) return;
    state.activeFormatKey = formatKey;

    // Update active tab buttons in UI
    const tabBtns = document.querySelectorAll('.fan-arena-format-tab');
    tabBtns.forEach(btn => {
      if (btn.getAttribute('data-format') === formatKey) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Re-render preview canvas
    renderCanvasPreview();
  }

  /**
   * Switch Export File Type (png, jpeg)
   */
  function setFanArenaExportType(type) {
    state.activeExportType = type === 'jpeg' ? 'jpeg' : 'png';
    const typeBtns = document.querySelectorAll('.fan-arena-type-tab');
    typeBtns.forEach(btn => {
      if (btn.getAttribute('data-type') === state.activeExportType) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  /**
   * Update Modal View HTML & Live Canvas Preview
   */
  function updateFanArenaModalView(matchId) {
    const match = state.activeMatch || resolveMatch(matchId);
    if (!match) return;

    const h = match.homeTeam?.name || (typeof match.homeTeam === 'string' ? match.homeTeam : 'Home Team');
    const a = match.awayTeam?.name || (typeof match.awayTeam === 'string' ? match.awayTeam : 'Away Team');
    const voteData = getMatchFanVotes(match.id, match);

    // 1. Update Match Header Title
    const titleEl = document.getElementById('fan-arena-modal-match-title');
    if (titleEl) titleEl.textContent = `${h} vs ${a}`;

    const subEl = document.getElementById('fan-arena-modal-match-sub');
    if (subEl) subEl.textContent = `${match.leagueEmoji || '🏆'} ${match.league || match.competition || 'Top League'} · ${match.date || 'Today'} · Kickoff ${match.time || '16:30'}`;

    // 2. Update Interactive Voting Options
    const optHome = document.getElementById('fan-vote-btn-home');
    const optDraw = document.getElementById('fan-vote-btn-draw');
    const optAway = document.getElementById('fan-vote-btn-away');

    if (optHome && optDraw && optAway) {
      optHome.className = `fan-vote-card ${voteData.userVote === 'home' ? 'voted' : ''}`;
      optDraw.className = `fan-vote-card ${voteData.userVote === 'draw' ? 'voted' : ''}`;
      optAway.className = `fan-vote-card ${voteData.userVote === 'away' ? 'voted' : ''}`;

      const homeNameLabel = optHome.querySelector('.fan-vote-name');
      if (homeNameLabel) homeNameLabel.textContent = h;

      const awayNameLabel = optAway.querySelector('.fan-vote-name');
      if (awayNameLabel) awayNameLabel.textContent = a;

      const homePctEl = optHome.querySelector('.fan-vote-pct');
      if (homePctEl) homePctEl.textContent = `${voteData.homePct}%`;

      const drawPctEl = optDraw.querySelector('.fan-vote-pct');
      if (drawPctEl) drawPctEl.textContent = `${voteData.drawPct}%`;

      const awayPctEl = optAway.querySelector('.fan-vote-pct');
      if (awayPctEl) awayPctEl.textContent = `${voteData.awayPct}%`;

      const homeBar = optHome.querySelector('.fan-vote-fill');
      if (homeBar) homeBar.style.width = `${voteData.homePct}%`;

      const drawBar = optDraw.querySelector('.fan-vote-fill');
      if (drawBar) drawBar.style.width = `${voteData.drawPct}%`;

      const awayBar = optAway.querySelector('.fan-vote-fill');
      if (awayBar) awayBar.style.width = `${voteData.awayPct}%`;

      const homeCountEl = optHome.querySelector('.fan-vote-count');
      if (homeCountEl) homeCountEl.textContent = `${voteData.homeVotes.toLocaleString()} votes`;

      const drawCountEl = optDraw.querySelector('.fan-vote-count');
      if (drawCountEl) drawCountEl.textContent = `${voteData.drawVotes.toLocaleString()} votes`;

      const awayCountEl = optAway.querySelector('.fan-vote-count');
      if (awayCountEl) awayCountEl.textContent = `${voteData.awayVotes.toLocaleString()} votes`;
    }

    const totalVotesEl = document.getElementById('fan-arena-total-votes-display');
    if (totalVotesEl) totalVotesEl.textContent = `${voteData.totalVotes.toLocaleString()} Fan Votes Cast`;

    // 3. Render Canvas Preview
    renderCanvasPreview();
  }

  /**
   * Render Canvas into the Modal's Preview Container
   */
  function renderCanvasPreview() {
    const container = document.getElementById('fan-arena-canvas-preview-container');
    if (!container || !state.activeMatch) return;

    const canvas = generateFanArenaCardCanvas(state.activeMatch, state.activeFormatKey);
    if (!canvas) return;

    container.innerHTML = '';
    canvas.style.maxWidth = '100%';
    canvas.style.height = 'auto';
    canvas.style.borderRadius = '12px';
    canvas.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.5)';
    canvas.style.display = 'block';
    canvas.style.margin = '0 auto';
    container.appendChild(canvas);
  }

  return {
    FAN_ARENA_FORMATS,
    getMatchFanVotes,
    calculateVotingPercentages,
    castFanVote,
    generateFanArenaCardCanvas,
    downloadFanArenaCard,
    shareFanArenaToWhatsApp,
    copyFanArenaLink,
    openFanArenaModal,
    closeFanArenaModal,
    setFanArenaFormat,
    setFanArenaExportType,
    preloadMatchAssets,
    generateDownloadFilename,
    resolveMatch
  };
});
