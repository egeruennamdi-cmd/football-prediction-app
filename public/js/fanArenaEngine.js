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
    root.generateFanArenaSocialCaption = api.generateFanArenaSocialCaption;
    root.getFanArenaCaption = api.getFanArenaCaption;
    root.updateFanArenaCaption = api.updateFanArenaCaption;
    root.regenerateFanArenaCaption = api.regenerateFanArenaCaption;
    root.restoreFanArenaCaption = api.restoreFanArenaCaption;
    root.copyFanArenaCaption = api.copyFanArenaCaption;
    root.formatFanArenaStatusLine = api.formatFanArenaStatusLine;
    root.parseMatchDateTime = api.parseMatchDateTime;
    root.getFanArenaPollConfig = api.getFanArenaPollConfig;
    root.drawResponsiveTeamName = api.drawResponsiveTeamName;
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
    globalThis.generateFanArenaSocialCaption = api.generateFanArenaSocialCaption;
    globalThis.getFanArenaCaption = api.getFanArenaCaption;
    globalThis.updateFanArenaCaption = api.updateFanArenaCaption;
    globalThis.regenerateFanArenaCaption = api.regenerateFanArenaCaption;
    globalThis.restoreFanArenaCaption = api.restoreFanArenaCaption;
    globalThis.copyFanArenaCaption = api.copyFanArenaCaption;
    globalThis.formatFanArenaStatusLine = api.formatFanArenaStatusLine;
    globalThis.parseMatchDateTime = api.parseMatchDateTime;
    globalThis.getFanArenaPollConfig = api.getFanArenaPollConfig;
    globalThis.drawResponsiveTeamName = api.drawResponsiveTeamName;
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
    window.generateFanArenaSocialCaption = api.generateFanArenaSocialCaption;
    window.getFanArenaCaption = api.getFanArenaCaption;
    window.updateFanArenaCaption = api.updateFanArenaCaption;
    window.regenerateFanArenaCaption = api.regenerateFanArenaCaption;
    window.restoreFanArenaCaption = api.restoreFanArenaCaption;
    window.copyFanArenaCaption = api.copyFanArenaCaption;
    window.formatFanArenaStatusLine = api.formatFanArenaStatusLine;
    window.parseMatchDateTime = api.parseMatchDateTime;
    window.getFanArenaPollConfig = api.getFanArenaPollConfig;
    window.drawResponsiveTeamName = api.drawResponsiveTeamName;
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

  const MONTHS_SHORT = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  /**
   * Parse match date and time authoritatively from fixture object.
   * Handles dateSlot ("YYYY-MM-DD-HHmm"), rawDate, match.date, match.time.
   * Cleans relative labels like "Today", "Tomorrow", "Yesterday", "future".
   */
  function parseMatchDateTime(match) {
    if (!match) {
      return { day: '12', month: 'NOV', year: '2026', dateFormatted: '12 NOV 2026', time: '16:30' };
    }

    let explicitTime = null;
    const timeCandidate = match.time || match.kickoffTime;
    if (typeof timeCandidate === 'string') {
      const timeMatch = timeCandidate.match(/(\d{1,2}):(\d{2})/);
      if (timeMatch) {
        explicitTime = `${timeMatch[1].padStart(2, '0')}:${timeMatch[2]}`;
      }
    }

    // 1. Authoritative dateSlot (e.g. "2026-11-12-1630")
    if (typeof match.dateSlot === 'string' && /^\d{4}-\d{2}-\d{2}-\d{4}$/.test(match.dateSlot)) {
      const parts = match.dateSlot.split('-');
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const d = parseInt(parts[2], 10);
      const hh = parts[3].slice(0, 2);
      const mm = parts[3].slice(2, 4);
      return {
        day: String(d).padStart(2, '0'),
        month: MONTHS_SHORT[m] || 'NOV',
        year: String(y),
        dateFormatted: `${String(d).padStart(2, '0')} ${MONTHS_SHORT[m] || 'NOV'} ${y}`,
        time: explicitTime || `${hh}:${mm}`
      };
    }

    // 2. Parse date string (e.g. "Today · 12 Nov 2026", "02 Nov 2026", "2026-11-02")
    if (typeof match.date === 'string') {
      const cleanDate = match.date
        .replace(/\b(today|tomorrow|yesterday|future)\b/gi, '')
        .replace(/^[^\w\d]+|[^\w\d]+$/g, '')
        .trim();
      if (cleanDate) {
        // e.g. "12 Nov 2026", "02 Nov 2026"
        const dmyMatch = cleanDate.match(/^(\d{1,2})[\s\-\/\.]*([a-zA-Z]+)[\s\-\/\.]*(\d{4})/);
        if (dmyMatch) {
          const dVal = parseInt(dmyMatch[1], 10);
          const mStr = dmyMatch[2].slice(0, 3).toUpperCase();
          const yVal = parseInt(dmyMatch[3], 10);
          if (MONTHS_SHORT.includes(mStr)) {
            return {
              day: String(dVal).padStart(2, '0'),
              month: mStr,
              year: String(yVal),
              dateFormatted: `${String(dVal).padStart(2, '0')} ${mStr} ${yVal}`,
              time: explicitTime || '16:30'
            };
          }
        }
        // e.g. "2026-11-02"
        const ymdMatch = cleanDate.match(/^(\d{4})[\s\-\/\.]+(\d{1,2})[\s\-\/\.]+(\d{1,2})/);
        if (ymdMatch) {
          const yVal = parseInt(ymdMatch[1], 10);
          const mVal = parseInt(ymdMatch[2], 10) - 1;
          const dVal = parseInt(ymdMatch[3], 10);
          return {
            day: String(dVal).padStart(2, '0'),
            month: MONTHS_SHORT[mVal] || 'NOV',
            year: String(yVal),
            dateFormatted: `${String(dVal).padStart(2, '0')} ${MONTHS_SHORT[mVal] || 'NOV'} ${yVal}`,
            time: explicitTime || '16:30'
          };
        }
      }
    }

    // 3. Authoritative rawDate (ISO string or unix ms timestamp)
    if (match.rawDate) {
      const parsed = new Date(match.rawDate);
      if (!isNaN(parsed.getTime())) {
        if (!explicitTime) {
          const hh = String(parsed.getUTCHours()).padStart(2, '0');
          const mm = String(parsed.getUTCMinutes()).padStart(2, '0');
          explicitTime = `${hh}:${mm}`;
        }
        const dVal = parsed.getUTCDate();
        const mStr = MONTHS_SHORT[parsed.getUTCMonth()] || 'NOV';
        const yVal = parsed.getUTCFullYear();
        return {
          day: String(dVal).padStart(2, '0'),
          month: mStr,
          year: String(yVal),
          dateFormatted: `${String(dVal).padStart(2, '0')} ${mStr} ${yVal}`,
          time: explicitTime || '16:30'
        };
      }
    }

    return {
      day: '12',
      month: 'NOV',
      year: '2026',
      dateFormatted: '12 NOV 2026',
      time: explicitTime || '16:30'
    };
  }

  /**
   * Central Authoritative Match Status Line Formatter
   * Rules:
   * - Upcoming: "KICKOFF · 12 NOV 2026 · 16:30" (DD MMM YYYY, 24h time, zero relative labels, zero duplicates)
   * - Completed: "FT · 02 NOV 2026" (DD MMM YYYY, FT status, NO kickoff time, zero duplicates)
   * - Live: "LIVE · 65'"
   * - Half-Time: "LIVE · HT"
   * - Postponed: "POSTPONED"
   * - Cancelled: "CANCELLED"
   * - Abandoned: "ABANDONED"
   */
  function formatFanArenaStatusLine(match) {
    if (!match) return 'KICKOFF · 12 NOV 2026 · 16:30';

    const statusUpper = (match.status || '').toUpperCase();
    const statusShortUpper = (match.statusShort || '').toUpperCase();
    const timeUpper = (typeof match.time === 'string' ? match.time : '').toUpperCase();

    // 1. Postponed
    if (statusUpper === 'POSTPONED' || statusShortUpper === 'PST' || timeUpper.includes('POSTP')) {
      return 'POSTPONED';
    }
    // 2. Cancelled
    if (statusUpper === 'CANCELLED' || statusUpper === 'CANCELED' || statusShortUpper === 'CANC' || timeUpper.includes('CANC')) {
      return 'CANCELLED';
    }
    // 3. Abandoned
    if (statusUpper === 'ABANDONED' || statusShortUpper === 'ABD' || timeUpper.includes('ABAND')) {
      return 'ABANDONED';
    }

    // 4. Live / In-Play
    if (match.isLive || statusUpper === 'LIVE' || statusShortUpper === 'LIVE' || statusShortUpper === '1H' || statusShortUpper === '2H' || statusShortUpper === 'ET') {
      const min = match.elapsed ? `${match.elapsed}'` : 'LIVE';
      return `LIVE · ${min}`;
    }

    // 5. Half-Time
    if (match.isHT || statusShortUpper === 'HT' || statusUpper === 'HALF-TIME' || timeUpper.includes('HT')) {
      return 'LIVE · HT';
    }

    // 6. Completed (FT)
    const isFT = Boolean(
      match.isFT ||
      statusUpper === 'FT' ||
      statusShortUpper === 'FT' ||
      statusUpper === 'AET' ||
      statusShortUpper === 'AET' ||
      statusUpper === 'PEN' ||
      statusShortUpper === 'PEN' ||
      timeUpper.includes('FT')
    );

    const dt = parseMatchDateTime(match);

    if (isFT) {
      return `FT · ${dt.dateFormatted}`;
    }

    // 7. Upcoming
    return `KICKOFF · ${dt.dateFormatted} · ${dt.time}`;
  }

  /**
   * Central Fan Arena Poll Configuration
   * Determines status-based headings, supporting messages, options and comment prompts.
   */
  function getFanArenaPollConfig(match) {
    const statusUpper = (match?.status || '').toUpperCase();
    const statusShortUpper = (match?.statusShort || '').toUpperCase();
    const timeUpper = (typeof match?.time === 'string' ? match.time : '').toUpperCase();

    const isFT = Boolean(
      match?.isFT ||
      statusUpper === 'FT' ||
      statusShortUpper === 'FT' ||
      statusUpper === 'AET' ||
      statusShortUpper === 'AET' ||
      statusUpper === 'PEN' ||
      statusShortUpper === 'PEN' ||
      timeUpper.includes('FT')
    );

    const isLive = Boolean(
      match?.isLive ||
      match?.isHT ||
      statusUpper === 'LIVE' ||
      statusShortUpper === 'LIVE' ||
      statusShortUpper === '1H' ||
      statusShortUpper === '2H' ||
      statusShortUpper === 'HT' ||
      statusShortUpper === 'ET'
    );

    const h = match?.homeTeam?.name || (typeof match?.homeTeam === 'string' ? match.homeTeam : 'Home Team');
    const a = match?.awayTeam?.name || (typeof match?.awayTeam === 'string' ? match.awayTeam : 'Away Team');

    if (isFT) {
      return {
        type: 'completed',
        mainHeading: '🏁 POST-MATCH FAN DEBATE',
        portraitHeading1: '🏁 POST-MATCH',
        portraitHeading2: 'FAN DEBATE',
        supportingMessage: "THE FINAL WHISTLE HAS SOUNDED. WHAT'S YOUR VERDICT?",
        commentsCta: '💬 SHARE YOUR VERDICT IN THE COMMENTS!',
        options: [
          { key: 'home', label: `1 · ${h} had the better performance`, color: '#38bdf8' },
          { key: 'draw', label: 'X · Both teams were evenly matched', color: '#94a3b8' },
          { key: 'away', label: `2 · ${a} had the better performance`, color: '#c084fc' }
        ],
        modalOptions: {
          home: `${h} had the better performance`,
          draw: 'Both teams were evenly matched',
          away: `${a} had the better performance`
        }
      };
    }

    if (isLive) {
      return {
        type: 'live',
        mainHeading: '🔴 LIVE MATCH FAN DEBATE',
        portraitHeading1: '🔴 LIVE MATCH',
        portraitHeading2: 'FAN DEBATE',
        supportingMessage: "THE ACTION IS UNDERWAY. WHAT'S YOUR TAKE?",
        commentsCta: '💬 CAST YOUR VOTE IN THE COMMENTS!',
        options: [
          { key: 'home', label: `1 · ${h} Win`, color: '#38bdf8' },
          { key: 'draw', label: 'X · Match Draw', color: '#94a3b8' },
          { key: 'away', label: `2 · ${a} Win`, color: '#c084fc' }
        ],
        modalOptions: {
          home: `${h} Win`,
          draw: 'Match Draw',
          away: `${a} Win`
        }
      };
    }

    // Default: Upcoming
    return {
      type: 'upcoming',
      mainHeading: 'WHO WILL WIN? — FAN ARENA POLL',
      portraitHeading1: 'WHO WILL WIN?',
      portraitHeading2: 'FAN ARENA POLL',
      supportingMessage: '💬 CAST YOUR VOTE IN THE COMMENTS!',
      commentsCta: '💬 CAST YOUR VOTE IN THE COMMENTS!',
      options: [
        { key: 'home', label: `1 · ${h} Win`, color: '#38bdf8' },
        { key: 'draw', label: 'X · Match Draw', color: '#94a3b8' },
        { key: 'away', label: `2 · ${a} Win`, color: '#c084fc' }
      ],
      modalOptions: {
        home: `${h} to Win`,
        draw: 'Match Draw',
        away: `${a} to Win`
      }
    };
  }

  /**
   * Responsive Team Name Drawing on Canvas
   * Dynamically measures and reduces font size to fit full team name without slicing.
   */
  function drawResponsiveTeamName(ctx, text, x, y, maxW, defaultSize = 28) {
    let size = defaultSize;
    ctx.font = `800 ${size}px system-ui, -apple-system, sans-serif`;
    while (size > 14 && ctx.measureText(text).width > maxW) {
      size -= 1;
      ctx.font = `800 ${size}px system-ui, -apple-system, sans-serif`;
    }
    let rendered = text;
    if (ctx.measureText(rendered).width > maxW) {
      while (rendered.length > 4 && ctx.measureText(rendered + '…').width > maxW) {
        rendered = rendered.slice(0, -1);
      }
      rendered += '…';
    }
    ctx.fillText(rendered, x, y);
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
    const statusLine = formatFanArenaStatusLine(match);
    const pollConfig = getFanArenaPollConfig(match);

    let statusLabel = statusLine;
    let statusColor = '#38bdf8';
    let statusBg = 'rgba(56, 189, 248, 0.2)';
    let scoreDisplay = 'VS';

    const hasRealScores = match.scores && match.scores.home !== null && match.scores.home !== undefined;
    const hs = hasRealScores ? match.scores.home : (match.homeScore != null ? match.homeScore : null);
    const as = hasRealScores ? match.scores.away : (match.awayScore != null ? match.awayScore : null);

    if (pollConfig.type === 'completed') {
      statusColor = '#94a3b8';
      statusBg = 'rgba(148, 163, 184, 0.2)';
      scoreDisplay = `${hs ?? 0} - ${as ?? 0}`;
    } else if (pollConfig.type === 'live') {
      statusColor = '#ef4444';
      statusBg = 'rgba(239, 68, 68, 0.25)';
      scoreDisplay = `${hs ?? 0} - ${as ?? 0}`;
    } else if (statusLine === 'POSTPONED' || statusLine === 'CANCELLED' || statusLine === 'ABANDONED') {
      statusColor = statusLine === 'POSTPONED' ? '#f59e0b' : '#ef4444';
      statusBg = statusLine === 'POSTPONED' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(239, 68, 68, 0.25)';
      scoreDisplay = (hs !== null && as !== null) ? `${hs} - ${as}` : 'VS';
    } else {
      // Upcoming
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
      ctx.textAlign = 'center';
      drawResponsiveTeamName(ctx, h, 230, 345, 300, 28);

      drawCrestLocal(850, 240, 140, 140, aLogoUrl, a, false);
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      drawResponsiveTeamName(ctx, a, 850, 345, 300, 28);

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

      // Single authoritative status line badge
      ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
      const statusTextWidthSq = ctx.measureText(statusLabel).width;
      const pillWSq = Math.max(statusTextWidthSq + 24, 180);
      const pillXSq = 540 - (pillWSq / 2);
      ctx.fillStyle = statusBg;
      ctx.fillRect(pillXSq, 268, pillWSq, 28);
      ctx.fillStyle = statusColor;
      ctx.fillText(statusLabel, 540, 287);

      // Voting Panel ("WHO WILL WIN?" or "POST-MATCH FAN DEBATE")
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.fillRect(50, 400, 980, 580);
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.35)';
      ctx.lineWidth = 2;
      ctx.strokeRect(50, 400, 980, 580);

      // Header inside box
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 28px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(pollConfig.mainHeading, 540, 450);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '800 18px system-ui, -apple-system, sans-serif';
      ctx.fillText(pollConfig.supportingMessage, 540, 482);

      // 3 Voting Bars (Zero-Percent Social Poll for Social Comment Voting)
      const options = [
        { label: pollConfig.options[0].label, color: pollConfig.options[0].color, y: 520 },
        { label: pollConfig.options[1].label, color: pollConfig.options[1].color, y: 660 },
        { label: pollConfig.options[2].label, color: pollConfig.options[2].color, y: 800 }
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

        // Zero-Percent Social Poll Display (0% fill for social media comment voting)
        ctx.fillStyle = opt.color;
        ctx.font = '900 32px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('0%', 970, opt.y + 45);

        // Progress Bar (Empty track only, 0% fill width)
        const barW = 860;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.fillRect(110, opt.y + 68, barW, 16);
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
      ctx.textAlign = 'center';
      drawResponsiveTeamName(ctx, h, 240, 460, 320, 32);

      drawCrestLocal(840, 330, 170, 170, aLogoUrl, a, false);
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      drawResponsiveTeamName(ctx, a, 840, 460, 320, 32);

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

      // Single authoritative status line badge
      ctx.font = 'bold 16px system-ui, -apple-system, sans-serif';
      const statusTextWidthP = ctx.measureText(statusLabel).width;
      const pillWP = Math.max(statusTextWidthP + 28, 200);
      const pillXP = 540 - (pillWP / 2);
      ctx.fillStyle = statusBg;
      ctx.fillRect(pillXP, 368, pillWP, 32);
      ctx.fillStyle = statusColor;
      ctx.fillText(statusLabel, 540, 390);

      // Voting Panel ("WHO WILL WIN?" or "POST-MATCH FAN DEBATE")
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.fillRect(50, 600, 980, 1160);
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.35)';
      ctx.lineWidth = 2;
      ctx.strokeRect(50, 600, 980, 1160);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 36px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(pollConfig.portraitHeading1, 540, 675);

      ctx.fillStyle = '#c084fc';
      ctx.font = '800 24px system-ui, -apple-system, sans-serif';
      ctx.fillText(pollConfig.portraitHeading2, 540, 715);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '800 20px system-ui, -apple-system, sans-serif';
      ctx.fillText(pollConfig.supportingMessage, 540, 755);

      // 3 Large Voting Outcome Cards (Zero-Percent Social Poll)
      const optionsP = [
        { title: pollConfig.options[0].label, color: pollConfig.options[0].color, y: 810 },
        { title: pollConfig.options[1].label, color: pollConfig.options[1].color, y: 1110 },
        { title: pollConfig.options[2].label, color: pollConfig.options[2].color, y: 1410 }
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

        // Zero-Percent Social Poll Display
        ctx.fillStyle = opt.color;
        ctx.font = '900 56px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('0%', 960, opt.y + 75);

        // Large Empty Progress Bar (0% fill width)
        const barW = 840;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.fillRect(120, opt.y + 160, barW, 26);
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
      ctx.textAlign = 'center';
      drawResponsiveTeamName(ctx, h, 160, 335, 230, 24);

      drawCrestLocal(460, 230, 130, 130, aLogoUrl, a, false);
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      drawResponsiveTeamName(ctx, a, 460, 335, 230, 24);

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

      // Single authoritative status line badge
      ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
      const statusTextWidthL = ctx.measureText(statusLabel).width;
      const pillWL = Math.min(Math.max(statusTextWidthL + 18, 120), 220);
      const pillXL = 310 - (pillWL / 2);
      ctx.fillStyle = statusBg;
      ctx.fillRect(pillXL, 248, pillWL, 24);
      ctx.fillStyle = statusColor;
      ctx.fillText(statusLabel, 310, 265);

      // Right Column: Voting Panel Box (X: 610, Y: 105, W: 555, H: 485)
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.fillRect(610, 105, 555, 485);
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.35)';
      ctx.lineWidth = 2;
      ctx.strokeRect(610, 105, 555, 485);

      ctx.fillStyle = '#ffffff';
      let headSizeL = 20;
      ctx.font = `900 ${headSizeL}px system-ui, -apple-system, sans-serif`;
      while (headSizeL > 15 && ctx.measureText(pollConfig.mainHeading).width > 520) {
        headSizeL -= 1;
        ctx.font = `900 ${headSizeL}px system-ui, -apple-system, sans-serif`;
      }
      ctx.textAlign = 'center';
      ctx.fillText(pollConfig.mainHeading, 887, 145);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '800 14px system-ui, -apple-system, sans-serif';
      ctx.fillText(pollConfig.supportingMessage, 887, 175);

      // 3 Voting Rows in Right Column (Zero-Percent Social Poll)
      const optionsL = [
        { label: pollConfig.options[0].label, color: pollConfig.options[0].color, y: 205 },
        { label: pollConfig.options[1].label, color: pollConfig.options[1].color, y: 325 },
        { label: pollConfig.options[2].label, color: pollConfig.options[2].color, y: 445 }
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

        // Zero-Percent Social Poll Display
        ctx.fillStyle = opt.color;
        ctx.font = '900 26px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('0%', 1125, opt.y + 36);

        // Empty Progress Bar (0% fill)
        const barW = 475;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.fillRect(650, opt.y + 55, barW, 14);
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

  // =========================================================================
  // DEDICATED FACTUAL SOCIAL CAPTION SYSTEM (EDITABLE & DYNAMIC)
  // =========================================================================

  const captionVariants = new Map(); // matchId -> variantIndex (0..3)
  const activeCaptions = new Map();   // matchId -> edited or generated text

  function toHashtag(str) {
    if (!str) return '';
    return str.replace(/[^a-zA-Z0-9]/g, '');
  }

  /**
   * Factual Social Caption Generator for Social Media Match Polls
   * Tailored for manual publishing on Facebook, Instagram, WhatsApp Status, and X.
   */
  function generateFanArenaSocialCaption(match, variantIndex = 0) {
    if (!match) return '';

    const h = match.homeTeam?.name || (typeof match.homeTeam === 'string' ? match.homeTeam : 'Home Team');
    const a = match.awayTeam?.name || (typeof match.awayTeam === 'string' ? match.awayTeam : 'Away Team');
    const comp = match.competition || match.league || 'Football';
    const statusLine = formatFanArenaStatusLine(match);

    const hTag = toHashtag(h);
    const aTag = toHashtag(a);
    const compTag = toHashtag(comp);
    const siteUrl = 'https://deeppredictbet.com';

    const varIdx = Math.abs(Number(variantIndex) || 0) % 4;

    const pollConfig = getFanArenaPollConfig(match);

    if (pollConfig.type === 'completed') {
      const score = (match.homeScore !== undefined && match.awayScore !== undefined) ? `${match.homeScore} - ${match.awayScore}` : (match.score || '');
      const scoreLine = score ? `\n📊 Final Score: ${h} ${score} ${a}` : '';
      return `🏁 POST-MATCH FAN DEBATE: ${h} vs ${a}
${scoreLine}
🏆 ${comp} · ${statusLine}

The final whistle has sounded. Did this match outcome match your pre-match prediction?
1️⃣ ${h} had the better performance
🤝 Both teams were evenly matched
2️⃣ ${a} had the better performance

💬 SHARE YOUR VERDICT IN THE COMMENTS!
Did you see this result coming? Share your tactical review and verdict below 👇

🌐 Full match stats & verified AI predictive ratings:
${siteUrl}

#DeepPredictBet #FanArena #${compTag} #FootballDebate #MatchPrediction #${hTag} #${aTag}`;
    }

    if (pollConfig.type === 'live') {
      const score = (match.homeScore !== undefined && match.awayScore !== undefined) ? `${match.homeScore} - ${match.awayScore}` : (match.score || '');
      const scoreText = score ? ` (${score})` : '';
      return `🔴 LIVE MATCH FAN DEBATE: ${h} vs ${a}${scoreText}
🏆 ${comp} · ${statusLine}

THE ACTION IS UNDERWAY. WHAT'S YOUR TAKE?
1️⃣ ${h} Win
🤝 Match Draw
2️⃣ ${a} Win

💬 CAST YOUR VOTE IN THE COMMENTS!
Drop your live in-play prediction below 👇

🌐 Follow live probability updates:
${siteUrl}

#DeepPredictBet #FanArena #${compTag} #LiveFootball #${hTag} #${aTag}`;
    }

    // Upcoming variants
    if (varIdx === 0) {
      return `⚽ THE FAN ARENA POLL IS OPEN! — WHO WILL WIN? — FAN ARENA POLL

🔥 ${h} vs ${a}
🏆 ${comp} · ${statusLine}

Cast your verdict on this clash:
1️⃣ ${h} Win
🤝 Match Draw
2️⃣ ${a} Win

💬 CAST YOUR VOTE IN THE COMMENTS!
Drop your predicted scoreline and match reasoning below 👇

🌐 Verified AI football predictions & analytics:
${siteUrl}

#DeepPredictBet #FanArena #${compTag} #FootballDebate #MatchPrediction #${hTag} #${aTag}`;
    } else if (varIdx === 1) {
      return `🔥 FOOTBALL FANS, WE WANT YOUR VERDICT!

⚔️ ${h} vs ${a}
🏆 ${comp} · ${statusLine}

Who takes all three points?
1️⃣ ${h} to Win
🤝 Match Draw
2️⃣ ${a} to Win

💬 CAST YOUR VOTE IN THE COMMENTS!
Who gets your backing? Drop your scoreline and explain why 👇

🌐 Free AI tactical match previews & odds value:
${siteUrl}

#DeepPredictBet #FanArena #${compTag} #MatchPrediction #FootballCommunity #${hTag} #${aTag}`;
    } else if (varIdx === 2) {
      return `💬 WHO GETS YOUR VOTE IN THIS SHOWDOWN?

🏟️ ${h} vs ${a}
🏆 ${comp} · ${statusLine}

Match Outcome Voting:
1️⃣ ${h} Win
🤝 Match Draw
2️⃣ ${a} Win

💬 CAST YOUR VOTE IN THE COMMENTS!
Let's hear your score predictions and tactical takes below! 👇

🌐 Official DeepPredictBet Fan Arena:
${siteUrl}

#DeepPredictBet #FanArena #${compTag} #FootballDebate #${hTag} #${aTag}`;
    } else {
      return `⚡ MATCH PREDICTION POLL — WHO TAKES THE POINTS?

🔥 ${h} vs ${a}
🏆 ${comp} · ${statusLine}

Select your choice:
1️⃣ ${h} Win
🤝 Match Draw
2️⃣ ${a} Win

💬 CAST YOUR VOTE IN THE COMMENTS!
Tell us who wins and why! ⚽👇

🌐 In-depth Poisson algorithms & betting intelligence:
${siteUrl}

#DeepPredictBet #FanArena #${compTag} #FootballPrediction #${hTag} #${aTag}`;
    }
  }

  function getFanArenaCaption(matchIdInput, matchObj) {
    const match = matchObj || resolveMatch(matchIdInput) || state.activeMatch;
    const mId = String(matchIdInput || (match ? match.id : state.activeMatchId || 'default'));
    if (activeCaptions.has(mId)) {
      return activeCaptions.get(mId);
    }
    const vIdx = captionVariants.get(mId) || 0;
    const generated = generateFanArenaSocialCaption(match, vIdx);
    activeCaptions.set(mId, generated);
    return generated;
  }

  function updateFanArenaCaption(matchIdInput, newText) {
    const mId = String(matchIdInput || state.activeMatchId || 'default');
    activeCaptions.set(mId, newText);
  }

  function regenerateFanArenaCaption(matchIdInput, matchObj, textareaId) {
    const match = matchObj || resolveMatch(matchIdInput) || state.activeMatch;
    const mId = String(matchIdInput || (match ? match.id : state.activeMatchId || 'default'));
    const currentIdx = captionVariants.get(mId) || 0;
    const nextIdx = (currentIdx + 1) % 4;
    captionVariants.set(mId, nextIdx);

    const freshText = generateFanArenaSocialCaption(match, nextIdx);
    activeCaptions.set(mId, freshText);

    if (typeof document !== 'undefined') {
      if (textareaId) {
        const el = document.getElementById(textareaId);
        if (el) el.value = freshText;
      }
      const modalTextarea = document.getElementById('fan-arena-modal-social-caption-textarea');
      if (modalTextarea && String(state.activeMatchId) === mId) {
        modalTextarea.value = freshText;
      }
      const tgTextarea = document.getElementById('tg-fa-social-caption-textarea');
      if (tgTextarea) {
        tgTextarea.value = freshText;
      }
    }
    return freshText;
  }

  function restoreFanArenaCaption(matchIdInput, matchObj, textareaId) {
    const match = matchObj || resolveMatch(matchIdInput) || state.activeMatch;
    const mId = String(matchIdInput || (match ? match.id : state.activeMatchId || 'default'));
    captionVariants.set(mId, 0);

    const originalText = generateFanArenaSocialCaption(match, 0);
    activeCaptions.set(mId, originalText);

    if (typeof document !== 'undefined') {
      if (textareaId) {
        const el = document.getElementById(textareaId);
        if (el) el.value = originalText;
      }
      const modalTextarea = document.getElementById('fan-arena-modal-social-caption-textarea');
      if (modalTextarea && String(state.activeMatchId) === mId) {
        modalTextarea.value = originalText;
      }
      const tgTextarea = document.getElementById('tg-fa-social-caption-textarea');
      if (tgTextarea) {
        tgTextarea.value = originalText;
      }
    }
    return originalText;
  }

  function copyFanArenaCaption(matchIdInput, buttonEl, textareaId) {
    let text = '';
    const mId = String(matchIdInput || state.activeMatchId || 'default');
    if (textareaId && typeof document !== 'undefined') {
      const el = document.getElementById(textareaId);
      if (el) text = el.value;
    }
    if (!text && activeCaptions.has(mId)) {
      text = activeCaptions.get(mId);
    }
    if (!text) {
      text = getFanArenaCaption(mId);
    }

    const setFeedback = () => {
      if (buttonEl) {
        const origHtml = buttonEl.innerHTML;
        buttonEl.innerHTML = '<span>✅</span> <span>Copied!</span>';
        buttonEl.style.filter = 'brightness(1.2)';
        setTimeout(() => {
          buttonEl.innerHTML = origHtml;
          buttonEl.style.filter = 'none';
        }, 2000);
      }
      if (typeof window !== 'undefined' && typeof window.showToast === 'function') {
        window.showToast('📋 Social caption copied to clipboard!');
      }
    };

    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(setFeedback).catch(() => {
        fallbackCopy(text);
        setFeedback();
      });
    } else {
      fallbackCopy(text);
      setFeedback();
    }
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
    const statusLine = formatFanArenaStatusLine(match);
    const pollConfig = getFanArenaPollConfig(match);

    // 1. Update Match Header Title & Subtitle
    const titleEl = document.getElementById('fan-arena-modal-match-title');
    if (titleEl) titleEl.textContent = `${h} vs ${a}`;

    const subEl = document.getElementById('fan-arena-modal-match-sub');
    if (subEl) subEl.textContent = `${match.leagueEmoji || '🏆'} ${match.league || match.competition || 'Top League'} · ${statusLine}`;

    // 1b. Update Modal Voting Heading & Subtitle
    const headingEl = document.getElementById('fan-arena-modal-voting-heading');
    if (headingEl) headingEl.textContent = pollConfig.mainHeading;

    const subVotingEl = document.getElementById('fan-arena-modal-voting-sub');
    if (subVotingEl) subVotingEl.textContent = pollConfig.supportingMessage;

    // 2. Update Interactive Voting Options
    const optHome = document.getElementById('fan-vote-btn-home');
    const optDraw = document.getElementById('fan-vote-btn-draw');
    const optAway = document.getElementById('fan-vote-btn-away');

    if (optHome && optDraw && optAway) {
      optHome.className = `fan-vote-card ${voteData.userVote === 'home' ? 'voted' : ''}`;
      optDraw.className = `fan-vote-card ${voteData.userVote === 'draw' ? 'voted' : ''}`;
      optAway.className = `fan-vote-card ${voteData.userVote === 'away' ? 'voted' : ''}`;

      const homeNameLabel = optHome.querySelector('.fan-vote-name');
      if (homeNameLabel) homeNameLabel.textContent = pollConfig.modalOptions.home;

      const drawNameLabel = optDraw.querySelector('.fan-vote-name');
      if (drawNameLabel) drawNameLabel.textContent = pollConfig.modalOptions.draw;

      const awayNameLabel = optAway.querySelector('.fan-vote-name');
      if (awayNameLabel) awayNameLabel.textContent = pollConfig.modalOptions.away;

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

    // 4. Update Factual Social Caption in Modal
    const modalCaptionTextarea = document.getElementById('fan-arena-modal-social-caption-textarea');
    if (modalCaptionTextarea) {
      modalCaptionTextarea.value = getFanArenaCaption(match.id, match);
    }
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
    resolveMatch,
    generateFanArenaSocialCaption,
    getFanArenaCaption,
    updateFanArenaCaption,
    regenerateFanArenaCaption,
    restoreFanArenaCaption,
    copyFanArenaCaption,
    formatFanArenaStatusLine,
    parseMatchDateTime,
    getFanArenaPollConfig,
    drawResponsiveTeamName
  };
});
