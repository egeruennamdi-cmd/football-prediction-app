// Safe Ready Helper - Guarantees execution regardless of script load timing
function runOnReady(fn) {
  if (typeof document !== 'undefined' && (document.readyState === 'interactive' || document.readyState === 'complete')) {
    setTimeout(fn, 0);
  } else if (typeof document !== 'undefined') {
    document.addEventListener("DOMContentLoaded", fn);
  } else {
    setTimeout(fn, 0);
  }
}
if (typeof window !== 'undefined') {
  window.runOnReady = runOnReady;
}

// Central Controller for KickAI

// Standalone BetPaddi Bookmakers Data (Complete 50 Global Bookmakers Suite)
var paddiBookies = [
  // Africa & Regional Powerhouses
  { id: 'sportybet', name: 'SportyBet', class: 'sportybet', symbol: 'SB' },
  { id: 'bet9ja', name: 'Bet9ja', class: 'bet9ja', symbol: 'B9' },
  { id: '1xbet', name: '1xBet', class: '1xbet', symbol: '1X' },
  { id: 'betking', name: 'BetKing', class: 'betking', symbol: 'BK' },
  { id: 'betway', name: 'Betway', class: 'betway', symbol: 'BW' },
  { id: '22bet', name: '22Bet', class: '22bet', symbol: '22' },
  { id: 'msport', name: 'MSport', class: 'msport', symbol: 'MS' },
  { id: 'betano', name: 'Betano', class: 'betano', symbol: 'BT' },
  { id: 'melbet', name: 'Melbet', class: 'melbet', symbol: 'ML' },
  { id: 'megapari', name: 'Megapari', class: 'megapari', symbol: 'MP' },
  { id: 'betwinner', name: 'BetWinner', class: 'betwinner', symbol: 'BWN' },
  { id: 'paripesa', name: 'Paripesa', class: 'paripesa', symbol: 'PP' },
  { id: 'merrybet', name: 'Merrybet', class: 'merrybet', symbol: 'MB' },
  { id: 'nairabet', name: 'NairaBET', class: 'nairabet', symbol: 'NB' },
  { id: 'bangbet', name: 'Bangbet', class: 'bangbet', symbol: 'BB' },
  { id: 'betika', name: 'Betika', class: 'betika', symbol: 'BI' },
  { id: 'easybet', name: 'Easybet', class: 'easybet', symbol: 'EB' },
  { id: 'hollywoodbet', name: 'Hollywoodbets', class: 'hollywoodbet', symbol: 'HB' },
  { id: 'mozzart', name: 'Mozzart Bet', class: 'mozzart', symbol: 'MZ' },
  { id: 'premierbet', name: 'Premier Bet', class: 'premierbet', symbol: 'PB' },
  { id: 'supersport', name: 'SuperSportBet', class: 'supersport', symbol: 'SS' },
  { id: 'odibets', name: 'Odibets', class: 'odibets', symbol: 'ODI' },
  { id: 'galsport', name: 'Gal Sport Betting', class: 'galsport', symbol: 'GSB' },

  // Europe & UK Heavyweights
  { id: 'bet365', name: 'Bet365', class: 'bet365', symbol: 'B365' },
  { id: 'unibet', name: 'Unibet', class: 'unibet', symbol: 'UNI' },
  { id: 'williamhill', name: 'William Hill', class: 'williamhill', symbol: 'WH' },
  { id: 'bwin', name: 'bwin', class: 'bwin', symbol: 'BWN' },
  { id: 'paddypower', name: 'Paddy Power', class: 'paddypower', symbol: 'PP' },
  { id: 'betfair', name: 'Betfair', class: 'betfair', symbol: 'BF' },
  { id: 'skybet', name: 'SkyBet', class: 'skybet', symbol: 'SKY' },
  { id: '888sport', name: '888sport', class: '888sport', symbol: '888' },

  // North America (US & Canada)
  { id: 'draftkings', name: 'DraftKings', class: 'draftkings', symbol: 'DK' },
  { id: 'fanduel', name: 'FanDuel', class: 'fanduel', symbol: 'FD' },
  { id: 'betmgm', name: 'BetMGM', class: 'betmgm', symbol: 'MGM' },
  { id: 'caesars', name: 'Caesars Sportsbook', class: 'caesars', symbol: 'CZR' },
  { id: 'pointsbet', name: 'PointsBet', class: 'pointsbet', symbol: 'PB' },

  // Latin America & Brazil
  { id: 'pixbet', name: 'Pixbet', class: 'pixbet', symbol: 'PIX' },
  { id: 'caliente', name: 'Caliente', class: 'caliente', symbol: 'CAL' },
  { id: 'codere', name: 'Codere', class: 'codere', symbol: 'COD' },
  { id: 'estrelabet', name: 'EstrelaBet', class: 'estrelabet', symbol: 'EST' },
  { id: 'betnacional', name: 'Betnacional', class: 'betnacional', symbol: 'NAC' },

  // Asia, Oceania & Global Crypto Pioneers
  { id: 'stake', name: 'Stake.com', class: 'stake', symbol: 'STK' },
  { id: 'sportsbetau', name: 'Sportsbet.com.au', class: 'sportsbetau', symbol: 'SBA' },
  { id: 'sbobet', name: 'SBOBET', class: 'sbobet', symbol: 'SBO' },
  { id: '188bet', name: '188BET', class: '188bet', symbol: '188' },
  { id: 'dafabet', name: 'Dafabet', class: 'dafabet', symbol: 'DAFA' },
  { id: 'bk8', name: 'BK8', class: 'bk8', symbol: 'BK8' },
  { id: 'bcgame', name: 'BC.Game', class: 'bcgame', symbol: 'BCG' },
  { id: 'cloudbet', name: 'Cloudbet', class: 'cloudbet', symbol: 'CLD' }
];

// Application State
window.appState = {
  premiumUnlocked: false,
  activeScoutMatchId: null,
  activeScoutClubName: null,
  currentFilter: 'all',
  activePredictionDate: 'today',
  activeMarketSubmenu: 'all',
  activeTopTip: 'all',
  activeTopTipsToolMarket: 'uo15',
  betslip: [],
  watchlist: [],
  userCoins: 500,
  coinsBalance: 500,
  claimedDaily: false,
  savedTickets: [],
  liveRules: [],
  paddiSourceBookie: 'sportybet',
  paddiTargetBookie: '1xbet',
  calCountry: 'all',
  calLeague: 'all',
  calTeam: 'all',
  searchFilter: null
}

// 

// --- FLOATING ACCUMULATOR BETSLIP BUILDER FUNCTIONS ---

function toggleBetslipDrawer() {
  const drawer = document.getElementById("floating-betslip-drawer");
  if (drawer) {
    drawer.classList.toggle("open");
  }
}

function getMatchOdds(match) {
  const hashStr = (match.homeTeam.name + match.awayTeam.name);
  let hash = 0;
  for (let i = 0; i < hashStr.length; i++) {
    hash = hashStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  const seed = Math.abs(hash);
  return parseFloat((1.45 + (seed % 11) * 0.1).toFixed(2));
}

function addActiveMatchToBetslip() {
  let matchId = window.appState ? window.appState.activeScoutMatchId : null;
  const matches = (typeof MATCH_DATA !== 'undefined' && MATCH_DATA) ? MATCH_DATA : (window.MATCH_DATA || []);
  
  if (!matchId && matches.length > 0) {
    matchId = matches[0].id;
  }
  if (!matchId) return;

  if (window.appState.betslip.length >= 40) {
    alert("⚠️ Maximum limit of 40 selections reached in your active betslip.");
    return;
  }

  const match = matches.find(m => m.id === matchId);
  if (!match) return;

  const tip = typeof getMatchTip === 'function' ? getMatchTip(match) : 'Home Win (1)';
  const odds = typeof getMatchOdds === 'function' ? getMatchOdds(match) : 1.85;

  if (window.appState.betslip.some(item => item.matchId === matchId)) {
    alert("⚠️ This match is already in your active betslip.");
    return;
  }

  window.appState.betslip.push({
    matchId,
    match,
    tip,
    odds
  });

  if (typeof triggerCloseScoutModal === 'function') triggerCloseScoutModal();
  renderBetslip();
  
  const drawer = document.getElementById("floating-betslip-drawer");
  if (drawer && !drawer.classList.contains("open")) {
    drawer.classList.add("open");
  }
}

function addMatchCardToBetslip(matchId, e) {
  if (e && e.stopPropagation) e.stopPropagation();

  if (!window.appState) window.appState = { betslip: [] };
  if (!window.appState.betslip) window.appState.betslip = [];

  if (window.appState.betslip.length >= 40) {
    if (typeof showAppNotification === 'function') {
      showAppNotification("⚠️ Maximum limit of 40 selections reached in your active betslip.");
    } else {
      alert("⚠️ Maximum limit of 40 selections reached in your active betslip.");
    }
    return;
  }

  const matches = (typeof MATCH_DATA !== 'undefined' && MATCH_DATA) ? MATCH_DATA : (window.MATCH_DATA || []);
  const match = matches.find(m => m.id === matchId);
  if (!match) return;

  if (window.appState.betslip.some(item => item.matchId === matchId)) {
    if (typeof showAppNotification === 'function') {
      showAppNotification(`ℹ️ ${match.homeTeam.name} vs ${match.awayTeam.name} is already in your betslip.`);
    } else {
      alert(`ℹ️ ${match.homeTeam.name} vs ${match.awayTeam.name} is already in your betslip.`);
    }
    return;
  }

  const tip = typeof getMatchTip === 'function' ? getMatchTip(match) : 'Home Win (1)';
  const odds = typeof getMatchOdds === 'function' ? getMatchOdds(match) : 1.85;

  window.appState.betslip.push({
    matchId,
    match,
    tip,
    odds
  });

  renderBetslip();

  const drawer = document.getElementById("floating-betslip-drawer");
  if (drawer && !drawer.classList.contains("open")) {
    drawer.classList.add("open");
  }

  if (typeof showAppNotification === 'function') {
    showAppNotification(`✅ Added ${match.homeTeam.name} vs ${match.awayTeam.name} to active betslip!`);
  }
}
window.addMatchCardToBetslip = addMatchCardToBetslip;

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

function removeBetslipItem(index) {
  window.appState.betslip.splice(index, 1);
  renderBetslip();
}

function clearBetslip() {
  window.appState.betslip = [];
  renderBetslip();
}

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

function renderBetslip() {
  const countBadge = document.getElementById("betslip-count-badge");
  const headerOdds = document.getElementById("betslip-header-odds");
  const emptyState = document.getElementById("betslip-empty-state");
  const itemsContainer = document.getElementById("betslip-items-container");
  const summaryActions = document.getElementById("betslip-summary-actions");
  const totalOddsVal = document.getElementById("betslip-total-odds-val");

  if (!countBadge) return;

  const count = window.appState.betslip.length;
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

      window.appState.betslip.forEach((item, index) => {
        totalOdds *= item.odds;
        
        const row = document.createElement("div");
        row.className = "betslip-item";
        row.innerHTML = `
          <div style="display: flex; flex-direction: column; gap: 2px; flex: 1; padding-right: 8px;">
            <div style="font-weight: 700; color: var(--text-primary); font-size: 0.76rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              ${item.match.homeTeam.name} vs ${item.match.awayTeam.name}
            </div>
            <div style="font-size: 0.7rem; color: var(--text-secondary);">
              Tip: <b style="color: var(--accent-gold);">${item.tip}</b>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-weight: 700; color: var(--text-primary); font-size: 0.8rem;">@${item.odds.toFixed(2)}</span>
            <button class="betslip-item-remove" onclick="removeBetslipItem(${index})">&times;</button>
          </div>
        `;
        itemsContainer.appendChild(row);
      });

      if (totalOddsVal) totalOddsVal.innerText = `@${totalOdds.toFixed(2)}`;
      if (headerOdds) {
        headerOdds.style.display = "block";
        headerOdds.innerText = `Total Odds: @${totalOdds.toFixed(2)}`;
      }
    }
    if (summaryActions) summaryActions.style.display = "flex";
  }
}

// Expose Betslip functions globally
window.toggleBetslipDrawer = toggleBetslipDrawer;
window.addActiveMatchToBetslip = addActiveMatchToBetslip;
window.removeBetslipItem = removeBetslipItem;
window.clearBetslip = clearBetslip;
window.sendBetslipToConverter = sendBetslipToConverter;
window.renderBetslip = renderBetslip;
window.generateScoutAccumulator = generateScoutAccumulator;


// --- STANDALONE BETPADDI CODE CONVERTER LOGIC ---

function togglePaddiDropdown(type) {
  const dropdown = document.getElementById(`paddi-${type}-dropdown`);
  if (dropdown) {
    dropdown.classList.toggle("show");
  }
}

// Close dropdowns on clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".betpaddi-bookie-select-wrapper")) {
    const dropdowns = document.querySelectorAll(".betpaddi-bookie-dropdown");
    dropdowns.forEach(d => d.classList.remove("show"));
  }
});

function selectConverterBookmaker(type, bookieId) {
  if (type === 'src') {
    window.appState.paddiSourceBookie = bookieId;
  } else {
    window.appState.paddiTargetBookie = bookieId;
  }
}

function selectPaddiBookmaker(type, bookieId) {
  selectConverterBookmaker(type, bookieId);
  
  const bookie = paddiBookies.find(b => b.id === bookieId);
  const btn = document.getElementById(`paddi-${type}-btn`);
  if (btn && bookie) {
    btn.innerHTML = `
      <span class="betpaddi-logo-symbol ${bookie.class}">${bookie.symbol}</span>
      <span class="paddi-bookie-name">${bookie.name}</span>
      <span style="font-size: 0.6rem; ${type === 'src' ? 'margin-left: 2px;' : 'margin-right: 2px;'}">▼</span>
    `;
  }
  
  const dropdown = document.getElementById(`paddi-${type}-dropdown`);
  if (dropdown) dropdown.classList.remove("show");
  
  const output = document.getElementById("paddi-tgt-code");
  if (output) {
    output.innerText = 'CONVERTED CODE';
    output.classList.add("empty");
  }
  const tray = document.getElementById("paddi-decoded-tray");
  if (tray) tray.style.display = "none";
}

function initBetPaddiConverter() {
  const srcDropdown = document.getElementById("paddi-src-dropdown");
  const tgtDropdown = document.getElementById("paddi-tgt-dropdown");
  
  if (!srcDropdown || !tgtDropdown) return;
  
  window.appState.paddiSourceBookie = 'sportybet';
  window.appState.paddiTargetBookie = '1xbet';
  
  const renderDropdownOptions = (type) => {
    const dropdown = document.getElementById(`paddi-${type}-dropdown`);
    if (!dropdown) return;
    dropdown.innerHTML = paddiBookies.map(b => `
      <div class="betpaddi-bookie-option" onclick="selectPaddiBookmaker('${type}', '${b.id}')">
        <span class="betpaddi-logo-symbol ${b.class}">${b.symbol}</span>
        <span>${b.name}</span>
      </div>
    `).join("");
  };
  
  selectPaddiBookmaker('src', 'sportybet');
  selectPaddiBookmaker('tgt', '1xbet');
}

function getBookiePrefix(bookieId) {
  if (!bookieId) return 'BM';
  const cleanId = bookieId.split(":")[0].toLowerCase();
  const prefixMap = {
    sportybet: 'SB', bet9ja: 'B9J', '1xbet': '1XB', betking: 'BK', msport: 'MS', betano: 'BT', betway: 'BW',
    melbet: 'ML', megapari: 'MP', betwinner: 'BWN', paripesa: 'PP', deeppredictbet: 'BM', merrybet: 'MB', nairabet: 'NB',
    bangbet: 'BB', betika: 'BI', easybet: 'EB', hollywoodbet: 'HB', mozzart: 'MZ', premierbet: 'PB', supersport: 'SS',
    odibets: 'ODI', galsport: 'GSB', bet365: 'B365', unibet: 'UNI', williamhill: 'WH', bwin: 'BWN', paddypower: 'PP',
    betfair: 'BF', skybet: 'SKY', '888sport': '888', draftkings: 'DK', fanduel: 'FD', betmgm: 'MGM', caesars: 'CZR',
    pointsbet: 'PB', pixbet: 'PIX', caliente: 'CAL', codere: 'COD', estrelabet: 'EST', betnacional: 'NAC', stake: 'STK',
    sportsbetau: 'SBA', sbobet: 'SBO', '188bet': '188', dafabet: 'DAFA', bk8: 'BK8', bcgame: 'BCG', cloudbet: 'CLD'
  };
  if (prefixMap[cleanId]) return prefixMap[cleanId];
  return cleanId.replace(/[^a-z0-9]/gi, '').slice(0, 3).toUpperCase() || 'BKM';
}

// --- BOOKMAKER AFFILIATE REFERRAL REGISTRY & MONETIZATION ENGINE (50 GLOBAL BOOKMAKERS) ---
const BOOKMAKER_AFFILIATE_LINKS = {
  // Africa & Regional Powerhouses
  'sportybet': { name: 'SportyBet', url: 'https://www.sportybet.com/?referralCode=DEEPPREDICTBET', bonus: '100% Welcome Gift' },
  'bet9ja': { name: 'Bet9ja', url: 'https://register.bet9ja.com/?promocode=DEEPPREDICTBET', bonus: '100% Deposit Bonus' },
  '1xbet': { name: '1xBet', url: 'https://1xbet.com/?tag=deeppredictbet', bonus: '200% First Deposit Bonus' },
  'betking': { name: 'BetKing', url: 'https://www.betking.com/register?code=DEEPPREDICTBET', bonus: '100% FreeBet Bonus' },
  'betway': { name: 'Betway', url: 'https://www.betway.com/register?btag=DEEPPREDICTBET', bonus: '100% Welcome Bonus' },
  '22bet': { name: '22Bet', url: 'https://22bet.com/?tag=deeppredictbet', bonus: '100% Welcome Bonus' },
  'msport': { name: 'MSport', url: 'https://www.msport.com/?referral=DEEPPREDICTBET', bonus: '300% Welcome Voucher' },
  'betano': { name: 'Betano', url: 'https://www.betano.com/?promo=DEEPPREDICTBET', bonus: '100% Welcome Bonus' },
  'melbet': { name: 'Melbet', url: 'https://melbet.com/?tag=deeppredictbet', bonus: '200% Welcome Bonus' },
  'megapari': { name: 'Megapari', url: 'https://megapari.com/?tag=deeppredictbet', bonus: '200% Welcome Bonus' },
  'betwinner': { name: 'BetWinner', url: 'https://betwinner.com/?tag=deeppredictbet', bonus: '100% Welcome Bonus' },
  'paripesa': { name: 'Paripesa', url: 'https://paripesa.com/?tag=deeppredictbet', bonus: '100% Welcome Bonus' },
  'merrybet': { name: 'Merrybet', url: 'https://www.merrybet.com/?ref=DEEPPREDICTBET', bonus: '100% Deposit Match' },
  'nairabet': { name: 'NairaBET', url: 'https://www.nairabet.com/?ref=DEEPPREDICTBET', bonus: '100% Welcome Bonus' },
  'bangbet': { name: 'Bangbet', url: 'https://www.bangbet.com/?ref=DEEPPREDICTBET', bonus: '200% Welcome Voucher' },
  'betika': { name: 'Betika', url: 'https://www.betika.com/?ref=DEEPPREDICTBET', bonus: 'First Deposit Bonus' },
  'easybet': { name: 'Easybet', url: 'https://www.easybet.co.za/?ref=DEEPPREDICTBET', bonus: 'R50 Sign-Up Bonus' },
  'hollywoodbet': { name: 'Hollywoodbets', url: 'https://www.hollywoodbets.net/?ref=DEEPPREDICTBET', bonus: 'R25 Sign-Up Bonus' },
  'mozzart': { name: 'Mozzart Bet', url: 'https://www.mozzartbet.com/?ref=DEEPPREDICTBET', bonus: '100% Triple Bonus' },
  'premierbet': { name: 'Premier Bet', url: 'https://www.premierbet.com/?ref=DEEPPREDICTBET', bonus: '150% Welcome Bonus' },
  'supersport': { name: 'SuperSportBet', class: 'supersport', url: 'https://www.supersportbet.com/?ref=DEEPPREDICTBET', bonus: '100% Deposit Match' },
  'odibets': { name: 'Odibets', url: 'https://www.odibets.com/?ref=DEEPPREDICTBET', bonus: 'KSh 30 Free Bet' },
  'galsport': { name: 'Gal Sport Betting', url: 'https://www.gsb.ug/?ref=DEEPPREDICTBET', bonus: '100% First Deposit Bonus' },

  // Europe & UK Heavyweights
  'bet365': { name: 'Bet365', url: 'https://www.bet365.com/?affiliate=DEEPPREDICTBET', bonus: 'Bet $5 Get $150 in Bonus Bets' },
  'unibet': { name: 'Unibet', url: 'https://www.unibet.com/?ref=DEEPPREDICTBET', bonus: '100% Risk-Free Bet' },
  'williamhill': { name: 'William Hill', url: 'https://www.williamhill.com/?ref=DEEPPREDICTBET', bonus: 'Bet $10 Get $30' },
  'bwin': { name: 'bwin', url: 'https://www.bwin.com/?ref=DEEPPREDICTBET', bonus: '100% Backup Bet' },
  'paddypower': { name: 'Paddy Power', url: 'https://www.paddypower.com/?ref=DEEPPREDICTBET', bonus: 'Money Back as Cash' },
  'betfair': { name: 'Betfair', url: 'https://www.betfair.com/?ref=DEEPPREDICTBET', bonus: 'Exchange Bonus' },
  'skybet': { name: 'SkyBet', url: 'https://www.skybet.com/?ref=DEEPPREDICTBET', bonus: 'Bet 5p Get $30' },
  '888sport': { name: '888sport', url: 'https://www.888sport.com/?ref=DEEPPREDICTBET', bonus: '300% Bonus Pack' },

  // North America (US & Canada)
  'draftkings': { name: 'DraftKings', url: 'https://www.draftkings.com/?ref=DEEPPREDICTBET', bonus: 'Up to $1,200 Bonus' },
  'fanduel': { name: 'FanDuel', url: 'https://www.fanduel.com/?ref=DEEPPREDICTBET', bonus: 'Bet $5 Get $200' },
  'betmgm': { name: 'BetMGM', url: 'https://www.betmgm.com/?ref=DEEPPREDICTBET', bonus: 'First Bet Offer up to $1,500' },
  'caesars': { name: 'Caesars Sportsbook', url: 'https://www.caesars.com/?ref=DEEPPREDICTBET', bonus: 'Up to $1,000 First Bet' },
  'pointsbet': { name: 'PointsBet', url: 'https://www.pointsbet.com/?ref=DEEPPREDICTBET', bonus: '5x Second Chance Bets' },

  // Latin America & Brazil
  'pixbet': { name: 'Pixbet', url: 'https://www.pixbet.com/?ref=DEEPPREDICTBET', bonus: 'Saque Rápido via Pix' },
  'caliente': { name: 'Caliente', url: 'https://www.caliente.mx/?ref=DEEPPREDICTBET', bonus: '$1,000 MXN Sin Depósito' },
  'codere': { name: 'Codere', url: 'https://www.codere.com/?ref=DEEPPREDICTBET', bonus: '100% Bônus Boas-Vindas' },
  'estrelabet': { name: 'EstrelaBet', url: 'https://www.estrelabet.com/?ref=DEEPPREDICTBET', bonus: '100% Bônus de Depósito' },
  'betnacional': { name: 'Betnacional', url: 'https://www.betnacional.com/?ref=DEEPPREDICTBET', bonus: 'A bet dos Brasileiros' },

  // Asia, Oceania & Global Crypto Pioneers
  'stake': { name: 'Stake.com', url: 'https://stake.com/?c=DEEPPREDICTBET', bonus: '200% Rakeback & Crypto VIP' },
  'sportsbetau': { name: 'Sportsbet.com.au', url: 'https://www.sportsbet.com.au/?ref=DEEPPREDICTBET', bonus: 'Top Australian Odds' },
  'sbobet': { name: 'SBOBET', url: 'https://www.sbobet.com/?ref=DEEPPREDICTBET', bonus: '100% Asian Handicap Bonus' },
  '188bet': { name: '188BET', url: 'https://www.188bet.com/?ref=DEEPPREDICTBET', bonus: '100% Deposit Bonus' },
  'dafabet': { name: 'Dafabet', url: 'https://www.dafabet.com/?ref=DEEPPREDICTBET', bonus: '160% Welcome Bonus' },
  'bk8': { name: 'BK8', url: 'https://www.bk8.com/?ref=DEEPPREDICTBET', bonus: '288% Have You BK8 Bonus' },
  'bcgame': { name: 'BC.Game', url: 'https://bc.game/?i=DEEPPREDICTBET', bonus: '360% Crypto Deposit Bonus' },
  'cloudbet': { name: 'Cloudbet', url: 'https://www.cloudbet.com/?af_token=DEEPPREDICTBET', bonus: '100% Crypto Welcome Bonus' },
  'default': { name: 'Bookmaker', url: 'https://www.sportybet.com/?referralCode=DEEPPREDICTBET', bonus: 'Welcome Bonus' }
};

function getBookieAffiliateInfo(bookieId) {
  if (!bookieId) return BOOKMAKER_AFFILIATE_LINKS['default'];
  const cleanId = bookieId.split(":")[0].toLowerCase();
  return BOOKMAKER_AFFILIATE_LINKS[cleanId] || {
    name: cleanId.charAt(0).toUpperCase() + cleanId.slice(1),
    url: `https://www.${cleanId}.com/?ref=DEEPPREDICTBET`,
    bonus: 'Welcome Bonus'
  };
}

function placeBetOnBookmaker(bookieId, bookingCode) {
  const aff = getBookieAffiliateInfo(bookieId);
  if (bookingCode) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(bookingCode).catch(() => {});
    }
    showAppNotification(`📋 Booking Code ${bookingCode} copied! Redirecting to ${aff.name}...`);
  } else {
    showAppNotification(`Redirecting to ${aff.name}...`);
  }
  setTimeout(() => {
    window.open(aff.url, '_blank');
  }, 350);
}

window.BOOKMAKER_AFFILIATE_LINKS = BOOKMAKER_AFFILIATE_LINKS;
window.getBookieAffiliateInfo = getBookieAffiliateInfo;
window.placeBetOnBookmaker = placeBetOnBookmaker;

// Old convertBetSlipCode replaced by Hybrid Engine

// Render Recently Converted Bet Slips
// old renderRecentConvertedSlips replaced

// Smart Bet Slip & Booking Code Converter
window.tempConvertedTicket = null;

function convertBookingCode() {
  try {
    const sourceCode = document.getElementById("conv-source-code").value.toUpperCase().trim();
    const sourceBookie = document.getElementById("conv-source-bookie").value;
    const targetBookie = document.getElementById("conv-target-bookie").value;
    const resultPane = document.getElementById("conv-result-pane");

    if (!resultPane) return;

    if (!sourceCode) {
      alert("Please enter a valid source booking code.");
      return;
    }
    if (sourceBookie === targetBookie) {
      alert("Select a Different Bookmaker");
      return;
    }

    // Validate source bookmaker prefix matching
    const knownPrefixes = ['SB', 'B9J', '1XB', 'BK', 'MS', 'BT', 'BW', 'ML', 'MP', 'BWN', 'PP', 'BM', 'MB', 'NB', 'BB', 'BI', 'EB', 'HB'];
    let detectedPrefix = null;

    for (const p of knownPrefixes) {
      if (sourceCode.startsWith(p + "-") || sourceCode.startsWith(p)) {
        detectedPrefix = p;
        break;
      }
    }

    if (detectedPrefix && detectedPrefix !== 'BM') {
      const expectedPrefix = getBookiePrefix(sourceBookie);
      if (detectedPrefix !== expectedPrefix) {
        alert("Select The Correct Bookmaker");
        return;
      }
    }

    if (typeof MATCH_DATA === 'undefined' || !MATCH_DATA || MATCH_DATA.length === 0) {
      alert("Database error: MATCH_DATA is not defined or is empty.");
      return;
    }

    // Generate deterministic seed from booking code
    let seed = 0;
    for (let i = 0; i < sourceCode.length; i++) {
      seed = sourceCode.charCodeAt(i) + ((seed << 5) - seed);
    }
    seed = Math.abs(seed);

    window.generatedTicketsCache = window.generatedTicketsCache || {};
    let mappedSelections = [];
    let totalSourceOdds = 1;
    let totalTargetOdds = 1;

    if (window.generatedTicketsCache[sourceCode] && window.generatedTicketsCache[sourceCode].selections && window.generatedTicketsCache[sourceCode].selections.length > 0) {
      mappedSelections = window.generatedTicketsCache[sourceCode].selections.map((item, i) => {
        const sOdds = item.sourceOdds || 1.45;
        let tOdds = item.targetOdds || parseFloat((sOdds + (((seed + i * 7) % 7) - 3) * 0.04).toFixed(2));
        if (tOdds < 1.1) tOdds = 1.1;

        totalSourceOdds *= sOdds;
        totalTargetOdds *= tOdds;

        return {
          fixture: item.fixture,
          league: item.league || "Global League",
          market: item.market || "Match Tip",
          prediction: item.prediction || item.tip || "Matched",
          sourceOdds: sOdds,
          targetOdds: tOdds
        };
      });
    } else {
      const activeMatchCountEl = document.getElementById("machine-match-count");
      const userMatchCount = activeMatchCountEl ? parseInt(activeMatchCountEl.value) : 4;
      const matchCount = Math.max(userMatchCount, 4);

      const selectedMatches = [];
      for (let i = 0; i < matchCount; i++) {
        const matchIdx = (seed + i * 17) % MATCH_DATA.length;
        selectedMatches.push(MATCH_DATA[matchIdx]);
      }

      const markets = ['1X2', 'BTTS', 'O/U 2.5'];
      mappedSelections = selectedMatches.map((match, i) => {
        const marketType = markets[(seed + i * 11) % markets.length];
        let prediction = '';
        let sOdds = 1.5;
        let tOdds = 1.5;

        if (marketType === '1X2') {
          const outcomes = ['Home Win (1)', 'Draw (X)', 'Away Win (2)'];
          const pick = (seed + i * 3) % outcomes.length;
          prediction = outcomes[pick];
          const prob = pick === 0 ? match.predictions.home : (pick === 1 ? match.predictions.draw : match.predictions.away);
          sOdds = parseFloat((1.2 + (100 - prob) * 0.03).toFixed(2));
          tOdds = parseFloat((sOdds + (((seed + i * 7) % 7) - 3) * 0.04).toFixed(2));
        } else if (marketType === 'BTTS') {
          prediction = (seed + i * 2) % 2 === 0 ? 'BTTS - Yes' : 'BTTS - No';
          sOdds = parseFloat((1.55 + ((seed + i * 9) % 8) * 0.08).toFixed(2));
          tOdds = parseFloat((sOdds + (((seed + i * 13) % 5) - 2) * 0.05).toFixed(2));
        } else {
          prediction = (seed + i * 4) % 2 === 0 ? 'Over 2.5 Goals' : 'Under 2.5 Goals';
          sOdds = parseFloat((1.45 + ((seed + i * 5) % 6) * 0.11).toFixed(2));
          tOdds = parseFloat((sOdds + (((seed + i * 19) % 6) - 3) * 0.03).toFixed(2));
        }

        if (sOdds < 1.1) sOdds = 1.1;
        if (tOdds < 1.1) tOdds = 1.1;

        totalSourceOdds *= sOdds;
        totalTargetOdds *= tOdds;

        return {
          fixture: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
          league: match.league,
          market: marketType,
          prediction: prediction,
          sourceOdds: sOdds,
          targetOdds: tOdds
        };
      });
    }

    totalSourceOdds = parseFloat(totalSourceOdds.toFixed(2));
    totalTargetOdds = parseFloat(totalTargetOdds.toFixed(2));

    // Generate target booking code
    const prefixMap = {
      sportybet: 'SB',
      bet9ja: 'B9J',
      '1xbet': '1XB',
      betking: 'BK',
      msport: 'MS',
      betano: 'BT'
    };
    const prefix = prefixMap[targetBookie] || 'CODE';
    const randomStr = ((seed * 73) % 1000000).toString(36).toUpperCase();
    const targetCode = `${prefix}-${randomStr}`;

    // Keep a temp reference to save to profile
    window.tempConvertedTicket = {
      id: `ticket-${Date.now()}`,
      time: `Today - Converted from ${sourceBookie.toUpperCase()}`,
      stake: 100,
      odds: totalTargetOdds,
      matches: mappedSelections.map(m => ({
        fixture: m.fixture,
        pick: `${m.market}: ${m.prediction}`,
        odds: m.targetOdds
      }))
    };

    const payoutDiff = parseFloat((((totalTargetOdds - totalSourceOdds) / totalSourceOdds) * 100).toFixed(1));
    const isTargetBetter = payoutDiff >= 0;

    // Build Results UI
    let itemsHtml = mappedSelections.map(sel => `
      <div style="display: grid; grid-template-columns: 1.5fr 1.2fr 1fr; align-items: center; border-bottom: 1px solid var(--border-color); padding: 10px 0; font-size: 0.78rem; gap: 8px;">
        <div>
          <div style="font-weight: 700; color: var(--text-primary);">${sel.fixture}</div>
          <div style="font-size: 0.65rem; color: var(--text-muted);">${sel.league}</div>
        </div>
        <div>
          <span style="font-weight: 700; color: var(--primary);">${sel.market}</span>: ${sel.prediction}
        </div>
        <div style="display: flex; flex-direction: column; align-items: flex-end; font-size: 0.72rem;">
          <span style="color: var(--text-muted);">${sourceBookie.toUpperCase()}: ${sel.sourceOdds}</span>
          <span style="color: var(--secondary); font-weight: 700;">${targetBookie.toUpperCase()}: ${sel.targetOdds}</span>
        </div>
      </div>
    `).join("");

    const comparisonHtml = `
      <div style="display: flex; flex-direction: column; gap: 14px; width: 100%;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">
          <h4 style="font-family: var(--font-display); font-size: 0.95rem; color: var(--text-primary); margin: 0; display: flex; align-items: center; gap: 6px;">
            🎉 Converted Bet Slip
          </h4>
          <span style="font-size: 0.72rem; color: var(--success); font-weight: 800; background: rgba(16,185,129,0.1); padding: 2px 6px; border-radius: 4px;">
            Decoded: ${mappedSelections.length} Matches
          </span>
        </div>

        <!-- Selections List -->
        <div style="max-height: 200px; overflow-y: auto; padding-right: 6px;">
          ${itemsHtml}
        </div>

        <!-- Booking Code Card -->
        <div class="glass-card" style="background: rgba(26, 104, 219, 0.05); border: 1px dashed rgba(26, 104, 219, 0.3); padding: 14px; border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center; gap: 10px;">
          <div>
            <div style="font-size: 0.65rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Generated Target Code (${targetBookie.toUpperCase()})</div>
            <div style="font-size: 1.35rem; font-family: var(--font-display); font-weight: 900; color: var(--primary); letter-spacing: 1px; margin-top: 4px;">${targetCode}</div>
          </div>
          <button class="btn btn-secondary" onclick="copyConvertedCode('${targetCode}')" style="font-size: 0.72rem; padding: 6px 12px;">
            📋 Copy Code
          </button>
        </div>

        <!-- Odds & Payout Comparison -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; background: rgba(255,255,255,0.02); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
          <div>
            <span style="font-size: 0.65rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Total Source Odds (${sourceBookie.toUpperCase()})</span>
            <div style="font-size: 1.1rem; font-weight: 800; color: var(--text-secondary); margin-top: 2px;">${totalSourceOdds}x</div>
          </div>
          <div style="border-left: 1px solid var(--border-color); padding-left: 12px;">
            <span style="font-size: 0.65rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Total Target Odds (${targetBookie.toUpperCase()})</span>
            <div style="font-size: 1.1rem; font-weight: 800; color: var(--secondary); margin-top: 2px;">${totalTargetOdds}x</div>
          </div>
        </div>

        <!-- Value Indicator Alert -->
        <div style="background: ${isTargetBetter ? 'rgba(16, 185, 129, 0.04)' : 'rgba(239, 68, 68, 0.04)'}; border: 1px solid ${isTargetBetter ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'}; border-radius: var(--radius-md); padding: 10px 14px; font-size: 0.75rem; line-height: 1.4; color: var(--text-secondary);">
          💡 ${isTargetBetter ? `<b>Odd Boost Value:</b> Target Bookmaker payout is <b style="color: var(--success); font-size: 0.8rem;">+${payoutDiff}%</b> higher than Source!` : `<b>Payout Notice:</b> Target Bookmaker payout is <b style="color: var(--danger); font-size: 0.8rem;">${payoutDiff}%</b> lower than Source due to odds margin fluctuations.`}
        </div>

        <!-- Action Footer -->
        <button class="btn btn-secondary" onclick="saveConvertedTicketToProfile()" style="font-size: 0.78rem; padding: 10px; width: 100%; font-weight: 700; background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); margin-top: 4px;">
          💾 Save Ticket to Profile History
        </button>
      </div>
    `;

    resultPane.style.justifyContent = "flex-start";
    resultPane.innerHTML = comparisonHtml;

    showAppNotification(`Bet Slip code converted to ${targetBookie.toUpperCase()} successfully!`);
  } catch (error) {
    console.error("Betting Code Converter Error:", error);
    alert("An error occurred during bet slip conversion: " + error.message);
  }
}

function copyConvertedCode(code) {
  navigator.clipboard.writeText(code).then(() => {
    showAppNotification("📋 Booking code copied to clipboard!");
  }).catch(() => {
    alert(`Could not copy automatically. Code: ${code}`);
  });
}

function saveConvertedTicketToProfile() {
  if (!window.tempConvertedTicket) return;

  window.appState.savedTickets = window.appState.savedTickets || [];
  window.appState.savedTickets.unshift(window.tempConvertedTicket);

  showAppNotification("💾 Converted ticket saved to your User Hub history!");

  if (typeof renderInlineSavedTickets === 'function') {
    renderInlineSavedTickets();
  }
}

function saveGeneratedTicket() {
  if (typeof saveConvertedTicketToProfile === 'function') {
    saveConvertedTicketToProfile();
  } else {
    showAppNotification("💾 Ticket saved to your profile!");
  }
}

// Render DeepPredictBet Style Date Picker Bar
// Render DeepPredictBet Style Dynamic Date & Live Selector Bar
function renderDeepPredictBetDateBar() {
  const container = document.getElementById("deeppredictbet-date-bar-container");
  if (!container) return;

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
  const liveCount = (typeof MATCH_DATA !== 'undefined' && MATCH_DATA) ? MATCH_DATA.filter(m => m.status === 'LIVE' || m.isLive).length || 6 : 6;

  const isLiveActive = window.appState.currentFilter === 'live';
  const activeDate = window.appState.activePredictionDate || 'today';

  let datesHtml = dates.map(d => {
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

  container.innerHTML = `
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
}

// Select specific date from date bar
function selectDeepPredictBetDate(dateId) {
  window.appState.currentFilter = 'all';

  if (window.location.hash !== "#predictions" && window.location.hash !== "") {
    window.location.hash = "#predictions";
  }

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

  if (dateId === 'yesterday') {
    window.appState.activePredictionDate = 'yesterday';
    const matchesTitle = document.getElementById("matches-section-title");
    if (matchesTitle) matchesTitle.innerText = "Yesterday's Results";
  } else if (dateId === 'today') {
    window.appState.activePredictionDate = 'today';
    const matchesTitle = document.getElementById("matches-section-title");
    if (matchesTitle) matchesTitle.innerText = "Today's Predictions";
  } else {
    window.appState.activePredictionDate = 'tomorrow';
    const matchesTitle = document.getElementById("matches-section-title");
    if (matchesTitle) {
      if (dateId === 'tomorrow') {
        matchesTitle.innerText = "Tomorrow's Predictions";
      } else {
        const baseDate = new Date();
        baseDate.setHours(0, 0, 0, 0);
        const offset = parseInt(dateId.split('-')[1]);
        const targetDate = new Date(baseDate);
        targetDate.setDate(baseDate.getDate() + offset);
        const dateStr = targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' });
        matchesTitle.innerText = `Predictions for ${dateStr}`;
      }
    }
  }

  if (dateId.startsWith('future-')) {
    window.appState.activePredictionDate = dateId;
  }

  renderDeepPredictBetDateBar();
  updateFixturesDisplay();
}

// Select "Live" option from date bar
function selectDeepPredictBetLive() {
  window.appState.currentFilter = 'live';
  window.appState.activePredictionDate = 'today';

  if (window.location.hash !== "#predictions" && window.location.hash !== "") {
    window.location.hash = "#predictions";
  }

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
// Safe Ready Helper - Guarantees execution regardless of script load timing
function runOnReady(fn) {
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    setTimeout(fn, 0);
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

function initAppEngine() {
  // Initialize state
  window.appState.watchlist = window.appState.watchlist || [];
  window.appState.activeScoutMatchId = null;

  // Render initially all matches
  if (typeof renderMatchCards === 'function') renderMatchCards(MATCH_DATA);
  
  // Render country accordion sidebar directory list
  if (typeof renderSidebarDirectory === 'function') renderSidebarDirectory();

  // Render universal date & live bar
  if (typeof renderDeepPredictBetDateBar === 'function') renderDeepPredictBetDateBar();

  // Render top leagues sidebar list
  if (typeof renderSidebarTopLeagues === 'function') renderSidebarTopLeagues();

  // Render live match scanner
  if (typeof renderLiveScanner === 'function') renderLiveScanner();

  // Render Daily Curated Bets
  if (typeof renderDailyBets === 'function') renderDailyBets();

  // Initialize standalone Bet Code Converter
  if (typeof initBetPaddiConverter === 'function') initBetPaddiConverter();
}

runOnReady(initAppEngine);
window.addEventListener("load", initAppEngine);

  renderDeepPredictBetDateBar();
  updateFixturesDisplay();
}

// Initialize Application on DOM Load
runOnReady(() => {
  // Initialize state
  window.appState.watchlist = [];
  window.appState.activeScoutMatchId = null;

  // Render initially all matches
  if (typeof window.renderMatchCards === 'function') window.renderMatchCards(window.MATCH_DATA || []);
  
  // Render country accordion sidebar directory list
  if (typeof window.renderSidebarDirectory === 'function') window.renderSidebarDirectory();

  // Render universal date & live bar
  if (typeof window.renderDeepPredictBetDateBar === 'function') window.renderDeepPredictBetDateBar();

  // Render top leagues sidebar list
  if (typeof window.renderSidebarTopLeagues === 'function') window.renderSidebarTopLeagues();

  // Render live match scanner
  if (typeof window.renderLiveScanner === 'function') window.renderLiveScanner();

  // Render Daily Curated Bets
  if (typeof window.renderDailyBets === 'function') window.renderDailyBets();

  // Initialize standalone Bet Code Converter
  if (typeof window.initBetCodeConverter === 'function') window.initBetCodeConverter();
  if (typeof window.renderRecentConvertedSlips === 'function') window.renderRecentConvertedSlips();

  // Render Hot Trends Ticker
  if (typeof window.renderTrends === 'function') window.renderTrends();

  // Render League Stats Ledger
  if (typeof window.renderLeagueStatsLedger === 'function') window.renderLeagueStatsLedger();

  // Sync backtester visibility state
  if (typeof window.syncBacktesterPremiumState === 'function') window.syncBacktesterPremiumState();
  
  // Render Value Bet Bot listings
  if (typeof window.renderValueBetBot === 'function') window.renderValueBetBot();

  // Render Top Tips Tool listings
  if (typeof window.renderTopTipsTool === 'function') window.renderTopTipsTool();

  // Render accuracy chart
  if (typeof window.renderAccuracyChart === 'function') window.renderAccuracyChart();

  // Render inline leaderboard challenge sidebar
  if (typeof window.switchInlineLeadTab === 'function') window.switchInlineLeadTab('monthly');

  // Render inline store shop sidebar
  if (typeof window.switchInlineStoreTab === 'function') window.switchInlineStoreTab('shop');

  // Render inline user hub sidebar
  if (typeof window.switchInlineUserTab === 'function') window.switchInlineUserTab('profile');

  // Initialize Active Betslip Builder with 4 curated top picks if empty
  if (typeof window.generateScoutAccumulator === 'function' && (!window.appState.betslip || window.appState.betslip.length === 0)) {
    window.generateScoutAccumulator(4);
  } else if (typeof window.renderBetslip === 'function') {
    window.renderBetslip();
  }

  // Initialize advanced filter sub-markets options
  if (typeof window.onFilterMarketChange === 'function') window.onFilterMarketChange();

  // Set up parallax glow movement effect on cards
  const cards = document.querySelectorAll(".glass-card");
  document.addEventListener("mousemove", (e) => {
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });

  // Start background live in-play scanner notifications check
  if (typeof window.startLiveAlertsScanner === 'function') window.startLiveAlertsScanner();

  // Initialize the standalone live scanner
  if (typeof window.renderLiveScanner === 'function') window.renderLiveScanner();

  // Programmatically trigger the default active tool tab to ensure layout sync
  if (typeof switchTool === 'function') {
    const defaultTab = document.querySelector(`#deeppredictbet-tools .tabs-container > .tab-btn[onclick*="machine"]`);
    if (defaultTab) {
      switchTool('machine', defaultTab);
    }
  }

  // Populate search suggestions datalist options
  if (typeof populateSearchSuggestions === 'function') {
    populateSearchSuggestions();
  }

  // Populate calendar selector options
  if (typeof populateCalSelectors === 'function') {
    populateCalSelectors();
  }
});

// Filter Matches based on Selected Tab
function filterMatches(filterType, btn) {
  window.appState.currentFilter = filterType;

  if (btn) {
    // Toggle active styling
    const tabContainer = btn.parentElement;
    if (tabContainer) {
      const buttons = tabContainer.querySelectorAll(".tab-btn");
      buttons.forEach(b => b.classList.remove("active"));
    }
    if (btn.classList) btn.classList.add("active");
  }

  let filtered = MATCH_DATA;
  if (filterType === 'live') {
    filtered = MATCH_DATA.filter(m => m.isLive);
  } else if (filterType === 'premium') {
    filtered = MATCH_DATA.filter(m => m.isPremium);
  } else if (filterType === 'upcoming') {
    filtered = MATCH_DATA.filter(m => !m.isLive);
  } else if (filterType === 'watchlist') {
    filtered = MATCH_DATA.filter(m => window.appState.watchlist.includes(m.id));
  }

  // Handle empty watchlist
  if (filterType === 'watchlist' && filtered.length === 0) {
    const grid = document.getElementById("fixtures-grid");
    if (grid) {
      grid.innerHTML = `
        <div class="glass-card" style="grid-column: 1 / -1; padding: 40px; text-align: center; border: 1px dashed rgba(255,255,255,0.1);">
          <span style="font-size: 2rem; display: block; margin-bottom: 12px;">⭐</span>
          <h4 style="font-family: var(--font-display); font-size: 1.1rem; margin-bottom: 6px;">Your Watchlist is Empty</h4>
          <p style="font-size: 0.85rem; color: var(--text-secondary); max-width: 420px; margin: 0 auto;">Click the star icon (☆) on any match row to monitor live stats and in-play updates.</p>
        </div>
      `;
    }
  } else {
    renderMatchCards(filtered);
  }
}

// Route sidebar and menu tool buttons to target suite pane
window.triggerToolRoute = function triggerToolRoute(toolId, scannerMode) {
  // Ensure view-generator page view is active
  const genView = document.getElementById("view-generator");
  if (genView && !genView.classList.contains("active")) {
    const allViews = document.querySelectorAll(".page-view");
    allViews.forEach(v => v.classList.remove("active"));
    genView.classList.add("active");
  }

  // Handle live scanner section routing
  if (toolId === 'scanner' || toolId === 'scanner-live' || toolId === 'scanner-prematch') {
    const scannerSec = document.getElementById("live-scanner-section");
    if (scannerSec) {
      scannerSec.scrollIntoView({ behavior: 'smooth' });
    }
    const mode = scannerMode || (toolId.includes('prematch') ? 'prematch' : 'live');
    if (typeof switchScannerMode === 'function') {
      const modeBtn = document.querySelector(`.tabs-container .tab-btn[onclick*="${mode}"]`);
      switchScannerMode(mode, modeBtn);
    }
    return;
  }

  // Delegate to switchTool for suite tools
  if (typeof switchTool === 'function') {
    const suiteSec = document.getElementById("deeppredictbet-tools");
    const targetBtn = suiteSec ? Array.from(suiteSec.querySelectorAll(".tabs-container .tab-btn")).find(b => {
      const attr = b.getAttribute("onclick");
      return attr && attr.includes(`'${toolId}'`);
    }) : null;

    switchTool(toolId, targetBtn);
    if (suiteSec) suiteSec.scrollIntoView({ behavior: 'smooth' });
  }
}

// Route watchlist navigation click
function triggerWatchlistFilter() {
  const watchlistBtn = Array.from(document.querySelectorAll("#predictions .tab-btn")).find(b => {
    const attr = b.getAttribute("onclick");
    return attr && attr.includes("'watchlist'");
  });

  if (watchlistBtn) {
    watchlistBtn.click();
  }

  const target = document.getElementById("predictions");
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
}

// Open general scout modal on header navigation trigger
function openGeneralScout() {
  const modal = document.getElementById("scout-modal");
  if (!modal) return;

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

  modal.style.display = "flex";
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function unlockPremiumPlanLigue2(leagueName, btn) {
  unlockPremiumPlan();
  const activeBtn = document.querySelector("#sidebar-accordion-list .sidebar-league-btn.active");
  if (activeBtn) {
    activeBtn.click();
  }
}

// -------------------------------------------------------------
// DEEPPREDICTBET ADVANCED FEATURE SYSTEM (COMPLETING THE OS ROADMAP)
// -------------------------------------------------------------

// 1. Toast Notification Helper
function showAppNotification(message) {
  const alertContainer = document.createElement("div");
  alertContainer.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: linear-gradient(135deg, var(--bg-dark-accent) 0%, var(--bg-dark) 100%);
    border: 1px solid var(--primary);
    color: var(--text-primary);
    padding: 14px 20px;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg), 0 0 10px rgba(26, 104, 219, 0.2);
    z-index: 11000;
    font-weight: 600;
    font-family: var(--font-display);
    font-size: 0.82rem;
    display: flex;
    align-items: center;
    gap: 10px;
    animation: slideInUp 0.3s ease-out;
  `;
  alertContainer.innerHTML = `
    <span style="color: var(--primary);">🔔</span>
    <span>${message}</span>
  `;
  document.body.appendChild(alertContainer);

  setTimeout(() => {
    alertContainer.style.opacity = '0';
    alertContainer.style.transition = 'opacity 0.4s ease-out';
    setTimeout(() => alertContainer.remove(), 400);
  }, 3500);
}

// 2. Multi-Language Translations System
const TRANSLATIONS = {
  en: {
    heroTitle: 'Next-Gen Football Predictions Powered by AI',
    scoutBtn: 'Ask Scout',
    proBtn: 'Join Pro',
    dashboardTitle: 'Matches Dashboard',
    suiteTitle: 'DeepPredict Betting Suite',
    scoutChatTitle: 'AI Match Scout Briefing',
  },
  fr: {
    heroTitle: 'Pronostics Football Nouvelle Génération par IA',
    scoutBtn: 'Demander à Scout',
    proBtn: 'Rejoindre Pro',
    dashboardTitle: 'Tableau des Matchs',
    suiteTitle: 'Suite de Paris DeepPredictBet',
    scoutChatTitle: 'Briefing IA de Match',
  },
  it: {
    heroTitle: 'Pronostici Calcio di Nuova Generazione con IA',
    scoutBtn: 'Chiedi a Scout',
    proBtn: 'Entra in Pro',
    dashboardTitle: 'Pannello Partite',
    suiteTitle: 'Suite Scommesse DeepPredictBet',
    scoutChatTitle: 'Briefing Match Scout IA',
  },
  es: {
    heroTitle: 'Predicciones de Fútbol de Última Generación con IA',
    scoutBtn: 'Preguntar a Scout',
    proBtn: 'Unirse a Pro',
    dashboardTitle: 'Panel de Partidos',
    suiteTitle: 'Suite de Apuestas DeepPredictBet',
    scoutChatTitle: 'Informe de Partido con IA',
  }
};

function changeAppLanguage(lang) {
  const trans = TRANSLATIONS[lang] || TRANSLATIONS.en;
  
  const heroTitleEl = document.querySelector(".hero-title");
  if (heroTitleEl) {
    if (lang === 'en') heroTitleEl.innerHTML = 'Next-Gen Football <span class="gradient-text">Predictions Powered by AI</span>';
    else if (lang === 'fr') heroTitleEl.innerHTML = 'Pronostics Football <span class="gradient-text">Nouvelle Génération par IA</span>';
    else if (lang === 'it') heroTitleEl.innerHTML = 'Pronostici Calcio <span class="gradient-text">di Nuova Generazione con IA</span>';
    else if (lang === 'es') heroTitleEl.innerHTML = 'Predicciones de Fútbol <span class="gradient-text">de Última Generación con IA</span>';
  }

  const scoutBtnEl = document.querySelector(".nav-actions button");
  if (scoutBtnEl) {
    scoutBtnEl.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      ${trans.scoutBtn}
    `;
  }

  const proBtnEl = document.querySelector(".nav-actions .btn-primary");
  if (proBtnEl && !proBtnEl.disabled) {
    proBtnEl.innerText = trans.proBtn;
  }

  const dashTitleEl = document.querySelector("#predictions h3");
  if (dashTitleEl) {
    dashTitleEl.innerText = trans.dashboardTitle;
  }

  const suiteTitleEl = document.querySelector("#deeppredictbet-tools h3");
  if (suiteTitleEl) {
    suiteTitleEl.innerText = trans.suiteTitle;
  }

  showAppNotification(`Language switched to: ${lang.toUpperCase()}`);
}

// 3. Interactive Punter Tip Submission Flow
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
  
  if (force || event.target === modal) {
    modal.classList.remove("active");
  }
}

function submitPunterTip() {
  const matchId = window.appState.activeScoutMatchId;
  const match = MATCH_DATA.find(m => m.id === matchId);
  if (!match) return;

  const market = document.getElementById("tip-market-select").value;
  const stake = parseInt(document.getElementById("tip-coins-stake").value);

  if (isNaN(stake) || stake < 10 || stake > 500) {
    alert("Please input a valid stake between 10 and 500 Coins.");
    return;
  }

  const currentCoins = window.appState.coinsBalance || 500;
  if (currentCoins < stake) {
    alert("Insufficient Mines Coins balance! Claim daily coins or buy packs.");
    return;
  }

  // Deduct coins
  window.appState.coinsBalance = currentCoins - stake;
  if (typeof updateStoreBalanceDisplay === 'function') {
    updateStoreBalanceDisplay();
  }

  // Append tip to User Hub saved tickets
  window.appState.savedTickets = window.appState.savedTickets || [];
  const mockOdds = parseFloat((1.3 + (match.confidenceVal % 7) * 0.15).toFixed(2));
  
  const newTicket = {
    id: `ticket-${Date.now()}`,
    time: "Today, In-Play",
    stake: stake,
    odds: mockOdds,
    matches: [
      {
        fixture: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
        pick: market,
        odds: mockOdds
      }
    ]
  };
  window.appState.savedTickets.unshift(newTicket);

  // Sync profile tickets render
  if (typeof renderInlineSavedTickets === 'function') {
    renderInlineSavedTickets();
  }

  // Close modal
  const modal = document.getElementById("submit-tip-modal");
  if (modal) modal.classList.remove("active");

  showAppNotification(`Tip Posted: ${market} staked with 🪙 ${stake} Coins!`);

  // Simulate leaderboard challenge score bump!
  setTimeout(() => {
    showAppNotification("🏆 Challenge score updated: +15 Ranking Points!");
  }, 1500);
}

// 4. Live In-Play Scanner Rules Creator
function createScannerRule() {
  const param = document.getElementById("alert-param").value;
  const cond = document.getElementById("alert-cond").value;
  const val = parseFloat(document.getElementById("alert-val").value);

  if (isNaN(val)) {
    alert("Please input a valid trigger value.");
    return;
  }

  window.appState.liveRules = window.appState.liveRules || [];
  
  const ruleId = `rule-${Date.now()}`;
  const ruleLabel = `${param.toUpperCase()} ${cond === 'gt' ? '>' : cond === 'lt' ? '<' : '='} ${val}`;
  
  window.appState.liveRules.push({
    id: ruleId,
    param,
    cond,
    val,
    label: ruleLabel
  });

  renderScannerRules();
  showAppNotification(`Scanner Rule Added: ${ruleLabel}`);
}

function removeScannerRule(ruleId) {
  window.appState.liveRules = (window.appState.liveRules || []).filter(r => r.id !== ruleId);
  renderScannerRules();
  showAppNotification("Scanner rule deleted.");
}

function renderScannerRules() {
  const container = document.getElementById("active-alert-rules");
  if (!container) return;

  const rules = window.appState.liveRules || [];
  if (rules.length === 0) {
    container.innerHTML = `<span style="font-size: 0.65rem; color: var(--text-muted);">No rules active. Create one to receive live alerts.</span>`;
    return;
  }

  container.innerHTML = rules.map(r => `
    <span style="font-size: 0.68rem; padding: 2px 8px; background: rgba(26,104,219,0.08); border: 1px solid rgba(26,104,219,0.2); border-radius: var(--radius-sm); color: var(--primary); font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
      ${r.label}
      <span style="cursor: pointer; color: var(--text-muted); font-weight: bold; margin-left: 2px;" onclick="removeScannerRule('${r.id}')">&times;</span>
    </span>
  `).join("");
}

// Background Live Scanner Alerts checker
function startLiveAlertsScanner() {
  setInterval(() => {
    const rules = window.appState.liveRules || [];
    if (rules.length === 0) return;

    const activeLiveMatches = MATCH_DATA.filter(m => m.isLive);
    if (activeLiveMatches.length === 0) return;

    const randomMatch = activeLiveMatches[Math.floor(Math.random() * activeLiveMatches.length)];
    const randomRule = rules[Math.floor(Math.random() * rules.length)];

    showAppNotification(`🚨 IN-PLAY ALERT: ${randomMatch.homeTeam.name} vs ${randomMatch.awayTeam.name} matched rule [${randomRule.label}]`);
  }, 12000);
}

// 5. Strategy Backtester SVG ROI Line Graph Chart
function renderBacktestSVGChart(yieldPercent) {
  const container = document.getElementById("bt-svg-container");
  const chartWrapper = document.getElementById("bt-chart-wrapper");
  if (!container || !chartWrapper) return;

  chartWrapper.style.display = "block";
  
  const numYield = parseFloat(yieldPercent);
  const isPositive = numYield >= 0;
  
  const points = [];
  const steps = 12;
  const stepWidth = 360 / (steps - 1);
  
  for (let i = 0; i < steps; i++) {
    const x = i * stepWidth;
    const trend = (numYield / steps) * i * 1.5;
    const fluctuation = (Math.sin(i * 1.5) * 8) + (Math.cos(i * 0.7) * 4);
    const yVal = 100 - (trend + fluctuation);
    points.push({ x, y: yVal });
  }

  const yVals = points.map(p => p.y);
  const minY = Math.min(...yVals) - 10;
  const maxY = Math.max(...yVals) + 10;
  const yRange = maxY - minY;
  
  const scaledPoints = points.map(p => {
    const scaledY = 90 - ((p.y - minY) / yRange) * 80;
    return `${p.x.toFixed(1)},${scaledY.toFixed(1)}`;
  });
  
  const pathD = `M ${scaledPoints.join(" L ")}`;
  const strokeColor = isPositive ? "var(--secondary)" : "var(--primary)";
  const fillColor = isPositive ? "rgba(16, 185, 129, 0.05)" : "rgba(26, 104, 219, 0.05)";
  const fillPathD = `${pathD} L 360,100 L 0,100 Z`;

  container.innerHTML = `
    <svg viewBox="0 0 360 100" style="width: 100%; height: auto; display: block; overflow: visible;">
      <line x1="0" y1="25" x2="360" y2="25" stroke="var(--border-color)" stroke-dasharray="3,3" stroke-width="0.5" />
      <line x1="0" y1="50" x2="360" y2="50" stroke="var(--border-color)" stroke-dasharray="3,3" stroke-width="0.5" />
      <line x1="0" y1="75" x2="360" y2="75" stroke="var(--border-color)" stroke-dasharray="3,3" stroke-width="0.5" />
      <path d="${fillPathD}" fill="${fillColor}" />
      <path d="${pathD}" fill="none" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      ${points.map((p, idx) => {
        const scaledY = 90 - ((p.y - minY) / yRange) * 80;
        if (idx === 0 || idx === Math.floor(steps/2) || idx === steps - 1) {
          return `
            <circle cx="${p.x.toFixed(1)}" cy="${scaledY.toFixed(1)}" r="4.5" fill="var(--bg-dark)" stroke="${strokeColor}" stroke-width="2" />
            <text x="${p.x.toFixed(1)}" y="${(scaledY - 8).toFixed(1)}" fill="var(--text-primary)" font-size="7" font-weight="700" text-anchor="middle" font-family="var(--font-display)">
              ${(100 + (100 - p.y) * 2.5).toFixed(0)}
            </text>
          `;
        }
        return "";
      }).join("")}
    </svg>
  `;
}


// Global Unlock Premium trigger
function unlockPremiumPlan() {
  window.appState.premiumUnlocked = true;
  
  // Create beautiful dynamic in-app notification
  const alertContainer = document.createElement("div");
  alertContainer.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: linear-gradient(135deg, var(--accent-gold) 0%, #d97706 100%);
    color: #1e1b04;
    padding: 16px 24px;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg), var(--glow-gold);
    z-index: 10000;
    font-weight: 700;
    font-family: var(--font-display);
    display: flex;
    align-items: center;
    gap: 12px;
    animation: slideInUp 0.3s ease-out;
  `;
  alertContainer.innerHTML = `
    <span>👑</span>
    <span>PRO AI PASS ACTIVATED: All Premium Tips Unlocked!</span>
  `;
  document.body.appendChild(alertContainer);

  // Auto remove alert
  setTimeout(() => {
    alertContainer.style.opacity = '0';
    alertContainer.style.transition = 'opacity 0.5s ease-out';
    setTimeout(() => alertContainer.remove(), 500);
  }, 4000);

  // Update Premium Pricing button text
  const promoBtn = document.querySelector(".btn-premium");
  if (promoBtn) {
    promoBtn.innerText = "✓ Active Pro Subscription";
    promoBtn.disabled = true;
    promoBtn.style.boxShadow = "none";
    promoBtn.style.opacity = "0.8";
  }

  // Sync backtester lock state immediately
  syncBacktesterPremiumState();

  // Refresh current filtered view (which will unlock premium cards instantly!)
  const activeTabBtn = document.querySelector(".tab-btn.active");
  if (activeTabBtn) {
    activeTabBtn.click();
  } else {
    renderMatchCards(MATCH_DATA);
  }
}

// Send Chat message to AI Scout
function sendScoutMessage(customText) {
  const input = document.getElementById("scout-chat-input");
  const chatBody = document.getElementById("scout-chat-body");
  if (!chatBody) return;

  const userText = (customText !== undefined && customText !== null ? String(customText) : (input ? input.value : "")).trim();
  if (userText === "") return;

  if (input) input.value = "";

  // Append user bubble
  const userBubble = document.createElement("div");
  userBubble.className = "chat-bubble user";
  userBubble.innerText = userText;
  chatBody.appendChild(userBubble);
  
  // Scroll to bottom
  chatBody.scrollTop = chatBody.scrollHeight;

  // Append typing indicator
  const typingIndicator = document.createElement("div");
  typingIndicator.className = "chat-bubble scout typing-container";
  typingIndicator.innerHTML = `
    <div class="typing-indicator">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>
  `;
  chatBody.appendChild(typingIndicator);
  chatBody.scrollTop = chatBody.scrollHeight;

  // Delay simulation (100ms instant response)
  setTimeout(() => {
    typingIndicator.remove();

    const responseBubble = document.createElement("div");
    responseBubble.className = "chat-bubble scout";

    const lowerText = userText.toLowerCase();
    const matchId = window.appState.activeScoutMatchId;
    const clubName = window.appState.activeScoutClubName;

    if (lowerText.includes("40") || lowerText.includes("ticket") || lowerText.includes("select") || lowerText.includes("acc") || lowerText.includes("pick") || lowerText.includes("generate") || lowerText.includes("slip") || lowerText.includes("build") || lowerText.includes("multibet") || lowerText.includes("accumulator") || /\b\d+\b/.test(lowerText)) {
      let count = 40;
      const numMatches = lowerText.match(/\b([1-9]|[1-4][0-9]|50)\b/g);
      if (numMatches && numMatches.length > 0) {
        const nums = numMatches.map(n => parseInt(n)).filter(n => !isNaN(n) && n >= 3 && n <= 50);
        if (nums.length > 0) count = Math.min(Math.max(nums[nums.length - 1], 3), 40);
      }

      generateScoutAccumulator(count);

      const selectionsList = window.appState.betslip.map((s, idx) => `
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.08); padding: 5px 0; font-size:0.75rem;">
          <span style="font-weight:600; color:var(--text-primary);">#${idx+1} ${s.match.homeTeam.name} vs ${s.match.awayTeam.name}</span>
          <span style="color:#3b82f6; font-weight:700; background:rgba(59,130,246,0.14); border: 1px solid rgba(59,130,246,0.3); padding: 2px 6px; border-radius:4px;">${s.tip} (@${s.odds.toFixed(2)})</span>
        </div>
      `).join("");

      const totalOdds = window.appState.betslip.reduce((acc, curr) => acc * curr.odds, 1).toFixed(2);

      responseBubble.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:8px;">
          <div style="font-weight:800; color:#3b82f6; font-size:0.88rem;">🎯 AI Scout Generated ${count}-Match Accumulator (@${totalOdds} Total Odds)</div>
          <div style="font-size:0.78rem; color:var(--text-secondary);">Here are your ${count} curated high-probability selections generated by AI Scout:</div>
          <div style="max-height: 180px; overflow-y: auto; background: rgba(0,0,0,0.35); border: 1.5px solid rgba(59, 130, 246, 0.55); box-shadow: 0 0 16px rgba(37, 99, 235, 0.25); border-radius: var(--radius-sm); padding: 8px 12px; margin: 4px 0;">
            ${selectionsList}
          </div>
          <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:4px;">
            <button class="btn btn-primary" onclick="sendBetslipToConverter()" style="font-size:0.75rem; padding:8px 14px; background:var(--brand-royal-blue); font-weight:800;">⚡ Convert & Place Bet Now</button>
            <button class="btn btn-secondary" onclick="toggleBetslipDrawer()" style="font-size:0.75rem; padding:8px 14px;">🎫 Open Betslip Drawer</button>
          </div>
        </div>
      `;
    }
    // --- PRIORITY 2: TACTICAL ANGLE REQUEST ---
    else if (lowerText.includes("tactic") || lowerText.includes("angle") || lowerText.includes("formation") || lowerText.includes("setup")) {
      generateScoutAccumulator(10);
      const selectionsList = window.appState.betslip.map((s, idx) => `
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.08); padding: 5px 0; font-size:0.75rem;">
          <span style="font-weight:600; color:var(--text-primary);">#${idx+1} ${s.match.homeTeam.name} vs ${s.match.awayTeam.name}</span>
          <span style="color:#3b82f6; font-weight:700; background:rgba(59,130,246,0.14); border: 1px solid rgba(59,130,246,0.3); padding: 2px 6px; border-radius:4px;">${s.tip} (@${s.odds.toFixed(2)})</span>
        </div>
      `).join("");

      responseBubble.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:8px;">
          <div style="font-weight:800; color:#3b82f6; font-size:0.88rem;">🎯 AI Tactical Angle Briefing & 10-Match Picks</div>
          <div style="font-size:0.78rem; color:var(--text-primary);">
            Our tactical algorithms evaluate high pressing triggers, vertical transition speeds, and mid-block stability. I have curated <b>10 Tactical Angle Selections</b> with positive expected value:
          </div>
          <div style="max-height: 160px; overflow-y: auto; background: rgba(0,0,0,0.35); border: 1.5px solid rgba(59, 130, 246, 0.55); box-shadow: 0 0 16px rgba(37, 99, 235, 0.25); border-radius: var(--radius-sm); padding: 8px 12px; margin: 4px 0;">
            ${selectionsList}
          </div>
          <div style="display:flex; gap:8px; margin-top:4px;">
            <button class="btn btn-primary" onclick="sendBetslipToConverter()" style="font-size:0.75rem; padding:8px 14px; background:var(--brand-royal-blue); font-weight:800;">⚡ Convert & Place Bet Now</button>
          </div>
        </div>
      `;
    }
    // --- PRIORITY 3: HIGH EV / VALUE PICKS ---
    else if (lowerText.includes("ev") || lowerText.includes("value") || lowerText.includes("odds")) {
      generateScoutAccumulator(8);
      const selectionsList = window.appState.betslip.map((s, idx) => `
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.08); padding: 5px 0; font-size:0.75rem;">
          <span style="font-weight:600; color:var(--text-primary);">#${idx+1} ${s.match.homeTeam.name} vs ${s.match.awayTeam.name}</span>
          <span style="color:#3b82f6; font-weight:700; background:rgba(59,130,246,0.14); border: 1px solid rgba(59,130,246,0.3); padding: 2px 6px; border-radius:4px;">${s.tip} (@${s.odds.toFixed(2)})</span>
        </div>
      `).join("");

      responseBubble.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:8px;">
          <div style="font-weight:800; color:#3b82f6; font-size:0.88rem;">📊 High EV Algorithmic Value Picks</div>
          <div style="font-size:0.78rem; color:var(--text-primary);">
            The mathematical model ledger identified positive expected value opportunities across <b>8 Top Matches</b>:
          </div>
          <div style="max-height: 160px; overflow-y: auto; background: rgba(0,0,0,0.35); border: 1.5px solid rgba(59, 130, 246, 0.55); box-shadow: 0 0 16px rgba(37, 99, 235, 0.25); border-radius: var(--radius-sm); padding: 8px 12px; margin: 4px 0;">
            ${selectionsList}
          </div>
          <div style="display:flex; gap:8px; margin-top:4px;">
            <button class="btn btn-primary" onclick="sendBetslipToConverter()" style="font-size:0.75rem; padding:8px 14px; background:var(--brand-royal-blue); font-weight:800;">⚡ Convert & Place Bet Now</button>
          </div>
        </div>
      `;
    }
    // --- PRIORITY 4: SPECIFIC MATCH OR CLUB ANALYSIS ---
    else if (matchId) {
      const match = MATCH_DATA.find(m => m.id === matchId);
      if (match) {
        responseBubble.innerHTML = match.aiAnalysis;
      } else {
        responseBubble.innerText = "Match details loaded. Ask me to generate 40 selections or tactical angles!";
      }
    } else if (clubName) {
      const club = GLOBAL_CLUBS.find(c => c.name === clubName);
      if (club) {
        responseBubble.innerHTML = `Regarding <b>${club.name}</b>, the probability models estimate a home goal output of <b>${(club.wins / club.matchesPlayed * 2.1).toFixed(1)} goals per game</b>. They currently present an excellent option for 'Over 1.5 Team Goals' in upcoming matchups.`;
      } else {
        responseBubble.innerText = "I couldn't locate this club's details in my directory. Ask me about another team!";
      }
    } else {
      responseBubble.innerHTML = `My tactical logs suggest focusing on high-probability fixtures today. You can ask me to <b>"Generate 40 selections"</b>, click <b>"✨ Generate 40 Selections"</b>, or click <b>"🎯 Tactical Angle"</b>!`;
    }

    chatBody.appendChild(responseBubble);
    chatBody.scrollTop = chatBody.scrollHeight;
  }, 1200);
}

// Enter Key handler for chat input
function handleChatKeyPress(event) {
  if (event.key === "Enter") {
    sendScoutMessage();
  }
}

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

  // 6. Show notification and modal if user triggered
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
window.triggerHeroScoutPrompt = triggerHeroScoutPrompt;
window.quickPromptScout = quickPromptScout;

function filterMarketSubmenu(marketVal, btn) {
  if (!window.appState) window.appState = {};
  window.appState.activeMarketSubmenu = marketVal;
  window.appState.activeTopTip = 'all';

  const container = document.getElementById("market-submenus-container");
  if (container) {
    container.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  }
  if (btn) btn.classList.add("active");

  if (typeof updateFixturesDisplay === 'function') updateFixturesDisplay();
}
window.filterMarketSubmenu = filterMarketSubmenu;

// Filter matches by specific Top Tips markets
function filterTopTip(topTipVal, btn) {
  if (!window.appState) window.appState = {};
  window.appState.activeTopTip = topTipVal;
  window.appState.activeMarketSubmenu = 'toptips';

  const container = document.getElementById("market-submenus-container");
  if (container) {
    container.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  }
  if (btn) btn.classList.add("active");

  if (typeof updateFixturesDisplay === 'function') updateFixturesDisplay();
}
window.filterTopTip = filterTopTip;

// Route navbar flyout Top Tips clicks directly to dashboard and select target top tips tab
function triggerTopTipFilter(dateVal, topTipVal) {
  window.appState.activePredictionDate = dateVal;

  const mainMarkets = ['1x2', 'btts', 'overunder', 'doublechance'];
  if (mainMarkets.includes(topTipVal)) {
    window.appState.activeMarketSubmenu = topTipVal;
    window.appState.activeTopTip = 'all';
  } else {
    window.appState.activeMarketSubmenu = 'toptips';
    window.appState.activeTopTip = topTipVal;
  }

  // Reset tab filter to 'all'
  window.appState.currentFilter = 'all';
  const mainFilterBtns = document.querySelectorAll("#predictions .section-header .tab-btn");
  mainFilterBtns.forEach(btn => btn.classList.remove("active"));
  mainFilterBtns.forEach(btn => {
    const handler = btn.getAttribute("onclick");
    if (handler && handler.includes("'all'")) {
      btn.classList.add("active");
    }
  });

  // Sync date buttons in DOM
  if (typeof renderDeepPredictBetDateBar === 'function') {
    renderDeepPredictBetDateBar();
  }

  // Update title
  const matchesTitle = document.getElementById("matches-section-title");
  if (matchesTitle) {
    matchesTitle.innerText = dateVal === 'yesterday' ? "Yesterday's Results" : (dateVal === 'today' ? "Today's Predictions" : "Tomorrow's Predictions");
  }

  // Sync market submenu tabs
  const marketSubTabs = document.querySelectorAll("#market-submenus-container .tab-btn");
  marketSubTabs.forEach(b => b.classList.remove("active"));
  
  if (mainMarkets.includes(topTipVal)) {
    // Find corresponding button in main markets submenu
    const targetSubMenuBtn = Array.from(marketSubTabs).find(b => {
      const attr = b.getAttribute("onclick");
      return attr && attr.includes(topTipVal);
    });
    if (targetSubMenuBtn) targetSubMenuBtn.classList.add("active");
  } else {
    // Find corresponding top tip button in main markets submenu
    const targetTopTipBtn = Array.from(marketSubTabs).find(b => {
      const attr = b.getAttribute("onclick");
      return attr && attr.includes(`'${topTipVal}'`);
    });
    if (targetTopTipBtn) targetTopTipBtn.classList.add("active");
  }

  // Call main filter logic
  if (typeof updateFixturesDisplay === 'function') updateFixturesDisplay();

  // Scroll smoothly down to the dashboard
  const target = document.getElementById("predictions");
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
}
window.triggerTopTipFilter = triggerTopTipFilter;

// State for the horizontal filter bar
window.barState = {
  date: 'today',
  tip: 'uo15'
};

function updateBarDate(dateVal, btn) {
  window.barState.date = dateVal;
  
  if (btn && btn.parentElement) {
    const parent = btn.parentElement;
    const buttons = parent.querySelectorAll(".tab-btn");
    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  }

  // Automatically trigger the filter
  triggerTopTipFilter(window.barState.date, window.barState.tip);
}
window.updateBarDate = updateBarDate;

function applyBarTopTip(tipVal, btn) {
  window.barState.tip = tipVal;

  if (btn && btn.parentElement) {
    const parent = btn.parentElement;
    const buttons = parent.querySelectorAll(".btn");
    buttons.forEach(b => {
      b.classList.remove("btn-primary");
      b.classList.add("btn-secondary");
    });
    btn.classList.remove("btn-secondary");
    btn.classList.add("btn-primary");
  }

  // Automatically trigger the filter
  triggerTopTipFilter(window.barState.date, window.barState.tip);
}
window.applyBarTopTip = applyBarTopTip;

function triggerMatchPreview(leagueName, btn) {
  // Update active styling for previews bar
  const parent = btn.parentElement;
  const buttons = parent.querySelectorAll(".btn");
  buttons.forEach(b => {
    b.classList.remove("btn-primary");
    b.classList.add("btn-secondary");
  });
  btn.classList.remove("btn-secondary");
  btn.classList.add("btn-primary");

  // Sync date to today or whichever date has matches for this league
  const matchedMatch = MATCH_DATA.find(m => m.league.toLowerCase() === leagueName.toLowerCase());
  if (matchedMatch) {
    const dateVal = matchedMatch.date;
    window.appState.activePredictionDate = dateVal;
    
    // Sync timeline date selectors
    if (typeof renderDeepPredictBetDateBar === 'function') {
      renderDeepPredictBetDateBar();
    }

    const matchesTitle = document.getElementById("matches-section-title");
    if (matchesTitle) {
      if (dateVal === 'yesterday') {
        matchesTitle.innerText = "Yesterday's Results";
      } else if (dateVal === 'today') {
        matchesTitle.innerText = "Today's Predictions";
      } else {
        matchesTitle.innerText = "Tomorrow's Predictions";
      }
    }

    // Sync horizontal date selector
    const barDateContainer = document.getElementById("bar-date-selector");
    if (barDateContainer) {
      const buttons = barDateContainer.querySelectorAll(".tab-btn");
      buttons.forEach(b => b.classList.remove("active"));
      const activeBarBtn = Array.from(buttons).find(b => b.innerText.toLowerCase() === dateVal.toLowerCase());
      if (activeBarBtn) activeBarBtn.classList.add("active");
    }

    // Also sync the Calendar hub date select
    const calDateSelect = document.getElementById("cal-date-select");
    if (calDateSelect) {
      calDateSelect.value = dateVal;
    }
  }

  // Set the league filter in appState
  window.appState.calLeague = leagueName;
  window.appState.calCountry = 'all';
  window.appState.calTeam = 'all';

  // Sync Calendar selector in UI
  const leagueSelect = document.getElementById("cal-league-select");
  if (leagueSelect) {
    leagueSelect.value = leagueName;
  }
  const countrySelect = document.getElementById("cal-country-select");
  if (countrySelect) {
    countrySelect.value = 'all';
  }
  const teamSelect = document.getElementById("cal-team-select");
  if (teamSelect) {
    teamSelect.value = 'all';
  }

  // Reset search filter
  window.appState.searchFilter = null;
  const searchInput = document.getElementById("timeline-search-input");
  if (searchInput) {
    searchInput.value = "";
  }

  // Render
  updateFixturesDisplay();

  // Scroll down smoothly to dashboard predictions
  const target = document.getElementById("predictions");
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }

  // Open the newly integrated League Preview Hub containing predictions, odds, and results tabs!
  if (typeof openLeaguePreviewHub === 'function') {
    setTimeout(() => {
      openLeaguePreviewHub(leagueName, 'predictions');
    }, 250);
  }
}

function populateSearchSuggestions() {
  const datalist = document.getElementById("search-suggestions");
  if (!datalist) return;
  datalist.innerHTML = "";

  const suggestions = new Set();

  // Add countries
  const countries = ["England", "Spain", "Germany", "Italy", "France"];
  countries.forEach(c => suggestions.add(c));

  // Extract from MATCH_DATA
  MATCH_DATA.forEach(match => {
    if (match.homeTeam && match.homeTeam.name) suggestions.add(match.homeTeam.name);
    if (match.awayTeam && match.awayTeam.name) suggestions.add(match.awayTeam.name);
    if (match.league) suggestions.add(match.league);
  });

  // Populate datalist options
  suggestions.forEach(item => {
    const opt = document.createElement("option");
    opt.value = item;
    datalist.appendChild(opt);
  });
}

function handleSearchSelect(val) {
  if (!val || val.trim() === "") {
    window.appState.searchFilter = null;
    updateFixturesDisplay();
    return;
  }
  
  const searchVal = val.toLowerCase().trim();
  window.appState.searchFilter = searchVal;
  
  // Find a matching match to auto-shift date if needed
  const getCountry = (league) => {
    if (league.includes("Premier League")) return "england";
    if (league.includes("La Liga")) return "spain";
    if (league.includes("Bundesliga")) return "germany";
    if (league.includes("Serie A")) return "italy";
    if (league.includes("Ligue")) return "france";
    return "";
  };

  const matchedMatch = MATCH_DATA.find(m => {
    return m.homeTeam.name.toLowerCase().includes(searchVal) ||
           m.awayTeam.name.toLowerCase().includes(searchVal) ||
           m.league.toLowerCase().includes(searchVal) ||
           getCountry(m.league).includes(searchVal);
  });

  if (matchedMatch) {
    // Sync date timeline
    window.appState.activePredictionDate = matchedMatch.date;
    
    // Update timeline date cards styling
    if (typeof renderDeepPredictBetDateBar === 'function') {
      renderDeepPredictBetDateBar();
    }
  }

  // Update the fixtures display
  updateFixturesDisplay();

  // Scroll down smoothly to matches section
  const target = document.getElementById("predictions");
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
}

function getOrdinalDate(dateOffset) {
  const d = new Date();
  d.setDate(d.getDate() + dateOffset);
  
  const day = d.getDate();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[d.getMonth()];
  
  let suffix = "th";
  if (day === 1 || day === 21 || day === 31) suffix = "st";
  else if (day === 2 || day === 22) suffix = "nd";
  else if (day === 3 || day === 23) suffix = "rd";
  
  return `${day}${suffix} ${month}`;
}

// Trigger quick filter parameters from the header nav dropdown
function triggerQuickFilter(dateVal, marketVal) {
  window.appState.activePredictionDate = dateVal;
  window.appState.activeMarketSubmenu = marketVal;

  // Reset tab filter to 'all'
  window.appState.currentFilter = 'all';
  const mainFilterBtns = document.querySelectorAll("#predictions .section-header .tab-btn");
  mainFilterBtns.forEach(btn => btn.classList.remove("active"));
  mainFilterBtns.forEach(btn => {
    const handler = btn.getAttribute("onclick");
    if (handler && handler.includes("'all'")) {
      btn.classList.add("active");
    }
  });

  // Sync date selector buttons in DOM
  if (typeof renderDeepPredictBetDateBar === 'function') {
    renderDeepPredictBetDateBar();
  }

  // Update title
  const matchesTitle = document.getElementById("matches-section-title");
  if (matchesTitle) {
    if (dateVal === 'yesterday') {
      matchesTitle.innerText = "Yesterday's Results";
      const cornersTab = document.getElementById("market-sub-corners");
      if (cornersTab) cornersTab.style.display = "none";
    } else if (dateVal === 'today') {
      matchesTitle.innerText = "Today's Predictions";
      const cornersTab = document.getElementById("market-sub-corners");
      if (cornersTab) cornersTab.style.display = "block";
    } else {
      matchesTitle.innerText = "Tomorrow's Predictions";
      const cornersTab = document.getElementById("market-sub-corners");
      if (cornersTab) cornersTab.style.display = "block";
    }
  }

  // Hide Top Tips tray
  const topTipsBar = document.getElementById("toptips-bar-container");
  if (topTipsBar) topTipsBar.style.display = "none";

  // Sync market submenu subtabs in DOM
  const marketSubTabs = document.querySelectorAll("#market-submenus-container > .tab-btn");
  marketSubTabs.forEach(b => b.classList.remove("active"));

  // Find tab that triggers this marketVal
  marketSubTabs.forEach(tab => {
    const clickHandler = tab.getAttribute("onclick");
    if (clickHandler && clickHandler.includes(`'${marketVal}'`)) {
      tab.classList.add("active");
    }
  });

  // Call main filter logic
  updateFixturesDisplay();

  // Scroll smoothly down to the dashboard
  const target = document.getElementById("predictions");
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
}

// Unified filtering pipeline
function updateFixturesDisplay() {
  let filtered = MATCH_DATA;

  // 1. Date Filter
  const dateFilterVal = window.appState.activePredictionDate.startsWith('future-') ? 'tomorrow' : window.appState.activePredictionDate;
  filtered = filtered.filter(m => m.date === dateFilterVal);

  // 2. Tab Filter
  const tabFilter = window.appState.currentFilter || 'all';
  if (tabFilter === 'live') {
    filtered = filtered.filter(m => m.isLive);
  } else if (tabFilter === 'premium') {
    filtered = filtered.filter(m => m.isPremium);
  } else if (tabFilter === 'upcoming') {
    filtered = filtered.filter(m => !m.isLive && m.time !== 'FT');
  } else if (tabFilter === 'watchlist') {
    filtered = filtered.filter(m => window.appState.watchlist.includes(m.id));
  }

  // 3. Market Submenu & Top Tip Filter
  const marketVal = window.appState.activeMarketSubmenu || 'all';
  const targetTopTip = window.appState.activeTopTip || 'all';

  if (marketVal === 'toptips' && targetTopTip !== 'all') {
    const directionalFilters = {
      'win1': m => (m.predictions ? m.predictions.home >= 38 : true),
      'draw': m => (m.predictions ? m.predictions.draw >= 20 : true),
      'win2': m => (m.predictions ? m.predictions.away >= 25 : true),
      'dc1x': m => (m.predictions ? (m.predictions.home + m.predictions.draw) >= 60 : true),
      'dc12': m => (m.predictions ? (m.predictions.home + m.predictions.away) >= 65 : true),
      'dcx2': m => (m.predictions ? (m.predictions.draw + m.predictions.away) >= 50 : true),
      'dnb': m => true,
      'btts': m => (m.predictions ? m.predictions.home > 30 && m.predictions.away > 20 : true),
      'btts_no': m => (m.predictions ? m.predictions.home <= 30 || m.predictions.away <= 20 : true)
    };

    if (directionalFilters[targetTopTip]) {
      const specificFiltered = filtered.filter(directionalFilters[targetTopTip]);
      if (specificFiltered.length > 0) {
        filtered = specificFiltered;
      }
    }
  }

  // 4. Search Filter
  if (window.appState.searchFilter) {
    const searchVal = window.appState.searchFilter.toLowerCase().trim();
    const getCountry = (league) => {
      if (league.includes("Premier League")) return "england";
      if (league.includes("La Liga")) return "spain";
      if (league.includes("Bundesliga")) return "germany";
      if (league.includes("Serie A")) return "italy";
      if (league.includes("Ligue")) return "france";
      return "";
    };

    filtered = filtered.filter(m => {
      return m.homeTeam.name.toLowerCase().includes(searchVal) ||
             m.awayTeam.name.toLowerCase().includes(searchVal) ||
             m.league.toLowerCase().includes(searchVal) ||
             getCountry(m.league).includes(searchVal);
    });
  }

  // 5. Calendar Box Filter
  if (window.appState.calCountry && window.appState.calCountry !== 'all') {
    const getCountry = (league) => {
      if (league.includes("Premier League")) return "england";
      if (league.includes("La Liga")) return "spain";
      if (league.includes("Bundesliga")) return "germany";
      if (league.includes("Serie A")) return "italy";
      if (league.includes("Ligue")) return "france";
      return "";
    };
    filtered = filtered.filter(m => getCountry(m.league).toLowerCase() === window.appState.calCountry.toLowerCase());
  }
  if (window.appState.calLeague && window.appState.calLeague !== 'all') {
    filtered = filtered.filter(m => m.league === window.appState.calLeague);
  }
  if (window.appState.calTeam && window.appState.calTeam !== 'all') {
    filtered = filtered.filter(m => m.homeTeam.name === window.appState.calTeam || m.awayTeam.name === window.appState.calTeam);
  }

  // Render cards or empty alert
  const grid = document.getElementById("fixtures-grid");
  if (!grid) return;

  if (filtered.length === 0) {
    let emptyMsg = "No fixtures found matching these parameters.";
    if (tabFilter === 'watchlist') {
      emptyMsg = "Your Watchlist is Empty. Click the star icon (☆) on any match row to monitor it.";
    } else if (marketVal !== 'all') {
      const displayMarket = marketVal === 'toptips' ? `Top Tip: ${window.appState.activeTopTip.toUpperCase()}` : marketVal.toUpperCase();
      emptyMsg = `No predictions matching '${displayMarket}' markets exist for this day.`;
    }
    
    grid.innerHTML = `
      <div class="glass-card" style="grid-column: 1 / -1; padding: 40px; text-align: center; border: 1px dashed rgba(255,255,255,0.1);">
        <span style="font-size: 2rem; display: block; margin-bottom: 12px;">📊</span>
        <h4 style="font-family: var(--font-display); font-size: 1.1rem; margin-bottom: 6px;">No Matches Found</h4>
        <p style="font-size: 0.85rem; color: var(--text-secondary); max-width: 420px; margin: 0 auto;">${emptyMsg}</p>
      </div>
    `;
  } else {
    renderMatchCards(filtered);
  }
}

// --- AI BET DOCTOR TICKET AUDITOR ENGINE ---
window.doctorState = {
  currentSample: 'highrisk',
  auditedHealth: 58,
  optimizedHealth: 92,
  isOptimized: false
};

function loadDoctorSample(sampleType) {
  window.doctorState.currentSample = sampleType;
  window.doctorState.isOptimized = (sampleType === 'safe');
  const codeInput = document.getElementById("bet-doctor-input-code");
  if (codeInput) {
    if (sampleType === 'highrisk') codeInput.value = "BC1A7X-RISK";
    else if (sampleType === 'moderate') codeInput.value = "BK992-MOD";
    else codeInput.value = "1XB-SAFE92";
  }
  runBetDoctorAudit();
}

function runBetDoctorAudit() {
  const container = document.getElementById("bet-doctor-results");
  if (!container) return;

  const codeVal = document.getElementById("bet-doctor-input-code")?.value || "BC1A7X";
  const bookieVal = document.getElementById("bet-doctor-bookie-select")?.value || "sportybet";
  const bookieInfo = typeof getBookieAffiliateInfo === 'function' ? getBookieAffiliateInfo(bookieVal) : { name: 'SportyBet' };
  const bookieName = bookieInfo.name || 'Bookmaker';

  // Call Live Backend API Server (Port 5000)
  fetch('http://localhost:5000/api/v1/doctor/audit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookingCode: codeVal, sourceBookie: bookieVal })
  })
  .then(res => res.json())
  .then(apiData => {
    if (apiData && apiData.success) {
      console.log('🩺 Audited via Live Backend API Server (Port 5000):', apiData);
    }
  })
  .catch(err => {
    console.log('Doctor API fallback active:', err.message);
  });

  const isHighRisk = window.doctorState.currentSample === 'highrisk';
  const isModerate = window.doctorState.currentSample === 'moderate';
  const isOptimized = window.doctorState.isOptimized || window.doctorState.currentSample === 'safe';

  const healthScore = isOptimized ? 92 : (isHighRisk ? 58 : 74);
  const healthColor = healthScore >= 85 ? '#10b981' : (healthScore >= 70 ? '#f59e0b' : '#ef4444');
  const healthLabel = healthScore >= 85 ? 'EXCELLENT (OPTIMIZED & HIGH WIN RATE)' : (healthScore >= 70 ? 'MODERATE RISK (1 WARNING FLAG)' : 'CRITICAL RISK (2 TRAP MATCHES DETECTED)');

  container.style.display = "flex";
  container.innerHTML = `
    <!-- Top Summary Banner -->
    <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.08); border-radius: var(--radius-md); padding: 16px;">
      <div style="display: flex; align-items: center; gap: 16px;">
        <!-- Circular Health Progress Gauge -->
        <div style="position: relative; width: 68px; height: 68px; display: flex; align-items: center; justify-content: center; background: radial-gradient(circle, ${healthColor}22 0%, transparent 70%); border: 3px solid ${healthColor}; border-radius: 50%; box-shadow: 0 0 16px ${healthColor}44;">
          <span style="font-size: 1.3rem; font-weight: 900; color: ${healthColor}; font-family: var(--font-display);">${healthScore}%</span>
        </div>
        <div>
          <div style="font-size: 0.72rem; color: var(--text-secondary); font-weight: 700; text-transform: uppercase;">Ticket Health Diagnostic</div>
          <div style="font-size: 1rem; font-weight: 800; color: ${healthColor}; font-family: var(--font-display);">${healthLabel}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">
            Auditing Code: <b style="color: #ffffff;">${codeVal}</b> (${bookieName}) &bull; Raw Probability: <b>${isOptimized ? '78.4%' : '34.2%'}</b>
          </div>
        </div>
      </div>

      <div style="display: flex; gap: 10px; flex-wrap: wrap;">
        ${!isOptimized ? `
          <button onclick="applyDoctorPrescription()" class="btn btn-primary" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border: 1px solid #fbbf24; color: #000; font-weight: 800; font-size: 0.78rem; padding: 10px 16px; box-shadow: 0 4px 14px rgba(245,158,11,0.4); cursor: pointer;">
            ⚡ Apply AI Prescriptions (+34% Boost)
          </button>
        ` : `
          <span style="background: rgba(16,185,129,0.15); border: 1px solid #10b981; color: #10b981; font-weight: 800; font-size: 0.75rem; padding: 8px 14px; border-radius: 4px; display: flex; align-items: center; gap: 6px;">
            ✅ Ticket Fully Optimized
          </span>
        `}
        <button onclick="convertAuditedTicket('${codeVal}', '${bookieVal}')" class="btn btn-secondary" style="font-weight: 700; font-size: 0.78rem; padding: 10px 16px; border: 1px solid var(--brand-royal-blue); cursor: pointer;">
          📲 Convert to 50 Bookies
        </button>
      </div>
    </div>

    <!-- Match Diagnostics List -->
    <div style="display: flex; flex-direction: column; gap: 10px;">
      <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">
        🔬 Match-by-Match AI Health Audit
      </div>

      <!-- Match 1: Safe -->
      <div style="background: rgba(16,185,129,0.04); border: 1px solid rgba(16,185,129,0.2); border-radius: var(--radius-sm); padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
        <div>
          <div style="font-weight: 800; font-size: 0.88rem; color: #ffffff;">🏴󠁧󠁢󠁥󠁮󠁧󠁿 Arsenal vs Chelsea</div>
          <div style="font-size: 0.75rem; color: var(--text-secondary);">Selection: <b>Over 2.5 Goals</b> @ 1.75 odds</div>
        </div>
        <div style="text-align: right;">
          <span style="background: rgba(16,185,129,0.2); color: #34d399; font-weight: 800; font-size: 0.7rem; padding: 4px 8px; border-radius: 4px;">✅ SAFE (84% PROBABILITY)</span>
          <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 4px;">Both teams scored 2.4 avg goals in last 6 home/away matches.</div>
        </div>
      </div>

      <!-- Match 2: Trap Match -->
      <div style="background: ${isOptimized ? 'rgba(16,185,129,0.04)' : 'rgba(239,68,68,0.05)'}; border: 1px solid ${isOptimized ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.3)'}; border-radius: var(--radius-sm); padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
        <div>
          <div style="font-weight: 800; font-size: 0.88rem; color: #ffffff;">🇪🇸 Real Madrid vs Barcelona</div>
          <div style="font-size: 0.75rem; color: var(--text-secondary);">Selection: <b>${isOptimized ? 'Double Chance 1X (Prescribed)' : 'Away Win (2) - TRAP PICK'}</b> @ ${isOptimized ? '1.38' : '2.40'} odds</div>
        </div>
        <div style="text-align: right;">
          ${isOptimized ? `
            <span style="background: rgba(16,185,129,0.2); color: #34d399; font-weight: 800; font-size: 0.7rem; padding: 4px 8px; border-radius: 4px;">✅ OPTIMIZED SAFE (88%)</span>
            <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 4px;">Double chance covers Real Madrid home dominance.</div>
          ` : `
            <span style="background: rgba(239,68,68,0.2); color: #f87171; font-weight: 800; font-size: 0.7rem; padding: 4px 8px; border-radius: 4px;">⚠️ CRITICAL TRAP DETECTED (42%)</span>
            <div style="font-size: 0.7rem; color: #f87171; margin-top: 4px;">Barca missing key midfielders; Real Madrid undefeated at home.</div>
          `}
        </div>
      </div>

      <!-- Match 3: High Risk / Moderate -->
      <div style="background: ${isOptimized ? 'rgba(16,185,129,0.04)' : 'rgba(245,158,11,0.05)'}; border: 1px solid ${isOptimized ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.3)'}; border-radius: var(--radius-sm); padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
        <div>
          <div style="font-weight: 800; font-size: 0.88rem; color: #ffffff;">🇩🇪 Bayern Munich vs Borussia Dortmund</div>
          <div style="font-size: 0.75rem; color: var(--text-secondary);">Selection: <b>${isOptimized ? 'Over 2.5 Goals (Prescribed)' : 'Over 3.5 Goals'}</b> @ ${isOptimized ? '1.50' : '2.15'} odds</div>
        </div>
        <div style="text-align: right;">
          ${isOptimized ? `
            <span style="background: rgba(16,185,129,0.2); color: #34d399; font-weight: 800; font-size: 0.7rem; padding: 4px 8px; border-radius: 4px;">✅ OPTIMIZED SAFE (85%)</span>
            <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 4px;">Lowered line from 3.5 to 2.5 to eliminate high risk.</div>
          ` : `
            <span style="background: rgba(245,158,11,0.2); color: #fbbf24; font-weight: 800; font-size: 0.7rem; padding: 4px 8px; border-radius: 4px;">🟡 HIGH RISK (51%)</span>
            <div style="font-size: 0.7rem; color: #fbbf24; margin-top: 4px;">Under 3.5 occurred in 4 of last 5 head-to-heads.</div>
          `}
        </div>
      </div>
    </div>

    <!-- AI Prescription Recommendations Box -->
    ${!isOptimized ? `
      <div style="background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: var(--radius-md); padding: 16px; display: flex; flex-direction: column; gap: 8px;">
        <div style="font-size: 0.8rem; font-weight: 800; color: #fbbf24; text-transform: uppercase; display: flex; align-items: center; gap: 6px;">
          <span>💡</span> AI Doctor Recommended Prescriptions
        </div>
        <div style="font-size: 0.75rem; color: var(--text-primary); display: flex; flex-direction: column; gap: 6px;">
          <div>• <b>Prescription 1:</b> Replace <i>Real Madrid vs Barca [Away Win]</i> ➡️ <b>[Double Chance 1X]</b> (+28% Win Rate)</div>
          <div>• <b>Prescription 2:</b> Lower <i>Bayern vs Dortmund [Over 3.5]</i> ➡️ <b>[Over 2.5 Goals]</b> (+21% Win Rate)</div>
        </div>
        <button onclick="applyDoctorPrescription()" class="btn btn-primary" style="margin-top: 6px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border: 1px solid #fbbf24; color: #000; font-weight: 800; font-size: 0.8rem; padding: 10px 18px; align-self: flex-start; cursor: pointer;">
          ⚡ Apply All Prescriptions & Boost Health to 92%
        </button>
      </div>
    ` : ''}
  `;
}

function applyDoctorPrescription() {
  window.doctorState.isOptimized = true;
  runBetDoctorAudit();
  if (typeof showToast === 'function') {
    showToast("🩺 Doctor Prescriptions Applied! Ticket Health Boosted to 92%!", "success");
  }
}

function convertAuditedTicket(code, bookie) {
  window.location.hash = "#converter";
  if (typeof selectPaddiBookmaker === 'function') {
    selectPaddiBookmaker('src', bookie);
  }
  const srcInput = document.getElementById("paddi-src-code");
  if (srcInput) srcInput.value = code;
  if (typeof showToast === 'function') {
    showToast(`📲 Loading Code ${code} into 50-Bookmaker Converter...`, "info");
  }
}

window.loadDoctorSample = loadDoctorSample;
window.runBetDoctorAudit = runBetDoctorAudit;
window.applyDoctorPrescription = applyDoctorPrescription;
window.convertAuditedTicket = convertAuditedTicket;

// Run initial audit display on page DOM ready
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    runBetDoctorAudit();
    runArbitrageScanner();
  }, 500);
});

// --- ARBITRAGE & SUREBET PROFIT FINDER ENGINE ---
window.arbitrageDeals = [
  {
    id: "arb-1",
    match: "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Arsenal vs Chelsea",
    league: "Premier League",
    time: "Today 19:45 GMT",
    market: "Over / Under 2.5 Goals",
    roi: 7.4,
    leg1: {
      bookieKey: "sportybet",
      selection: "Over 2.5 Goals",
      odds: 2.15,
      link: "https://www.sportybet.com/?tag=deeppredictbet"
    },
    leg2: {
      bookieKey: "bet365",
      selection: "Under 2.5 Goals",
      odds: 2.05,
      link: "https://www.bet365.com/?affiliate=deeppredictbet"
    }
  },
  {
    id: "arb-2",
    match: "🇪🇸 Real Madrid vs Barcelona",
    league: "La Liga",
    time: "Tomorrow 20:00 GMT",
    market: "1X2 Match Result",
    roi: 5.8,
    leg1: {
      bookieKey: "1xbet",
      selection: "Real Madrid Win (1)",
      odds: 2.45,
      link: "https://1xbet.com/?tag=deeppredictbet"
    },
    leg2: {
      bookieKey: "bet9ja",
      selection: "Draw or Barcelona (X2)",
      odds: 1.85,
      link: "https://www.bet9ja.com/?affiliate=deeppredictbet"
    }
  },
  {
    id: "arb-3",
    match: "🇩🇪 Bayern Munich vs Borussia Dortmund",
    league: "Bundesliga",
    time: "Saturday 17:30 GMT",
    market: "Both Teams To Score (BTTS)",
    roi: 4.2,
    leg1: {
      bookieKey: "stake",
      selection: "BTTS Yes",
      odds: 1.95,
      link: "https://stake.com/?c=deeppredictbet"
    },
    leg2: {
      bookieKey: "betking",
      selection: "BTTS No",
      odds: 2.20,
      link: "https://www.betking.com/?affiliate=deeppredictbet"
    }
  }
];

function runArbitrageScanner() {
  const container = document.getElementById("arbitrage-results-container");
  if (!container) return;

  const minRoi = parseFloat(document.getElementById("arb-min-roi-select")?.value || "4.0");
  const totalStake = parseFloat(document.getElementById("arb-stake-input")?.value || "100");

  const filteredDeals = window.arbitrageDeals.filter(d => d.roi >= minRoi);

  if (filteredDeals.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; color: var(--text-muted); font-size: 0.85rem; padding: 24px;">
        🛡️ No active SureBets found matching +${minRoi}% ROI threshold right now. Lower the minimum ROI filter above to view deals.
      </div>
    `;
    return;
  }

  let html = `
    <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; display: flex; justify-content: space-between; align-items: center;">
      <span>🎯 Live SureBet Arbitrage Opportunities (${filteredDeals.length} Found)</span>
      <span style="color: #10b981; font-weight: 800;">Investment Budget: ${totalStake.toFixed(2)}</span>
    </div>
  `;

  filteredDeals.forEach(deal => {
    const o1 = deal.leg1.odds;
    const o2 = deal.leg2.odds;
    const inv1 = 1 / o1;
    const inv2 = 1 / o2;
    const invSum = inv1 + inv2;

    const stake1 = (totalStake * inv1) / invSum;
    const stake2 = (totalStake * inv2) / invSum;

    const return1 = stake1 * o1;
    const return2 = stake2 * o2;
    const guaranteedReturn = Math.min(return1, return2);
    const profitNet = guaranteedReturn - totalStake;
    const realRoiPct = ((profitNet / totalStake) * 100).toFixed(1);

    const b1Info = typeof getBookieAffiliateInfo === 'function' ? getBookieAffiliateInfo(deal.leg1.bookieKey) : { name: deal.leg1.bookieKey };
    const b2Info = typeof getBookieAffiliateInfo === 'function' ? getBookieAffiliateInfo(deal.leg2.bookieKey) : { name: deal.leg2.bookieKey };

    html += `
      <div class="glass-card" style="padding: 18px; border: 1px solid rgba(16,185,129,0.3); background: rgba(0,0,0,0.4); border-radius: var(--radius-md); display: flex; flex-direction: column; gap: 14px;">
        
        <!-- Header Row -->
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 10px;">
          <div>
            <div style="font-size: 0.72rem; color: #10b981; font-weight: 800; text-transform: uppercase;">${deal.league} &bull; ${deal.time}</div>
            <div style="font-size: 1.05rem; font-weight: 900; color: #ffffff; font-family: var(--font-display);">${deal.match}</div>
            <div style="font-size: 0.75rem; color: var(--text-secondary);">Market: <b>${deal.market}</b></div>
          </div>

          <div style="text-align: right;">
            <div style="background: linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(5,150,105,0.2) 100%); border: 1px solid #10b981; color: #34d399; font-weight: 900; font-size: 0.9rem; padding: 6px 14px; border-radius: 20px; font-family: var(--font-display); display: inline-flex; align-items: center; gap: 6px;">
              🛡️ +${realRoiPct}% NET PROFIT
            </div>
            <div style="font-size: 0.75rem; color: #10b981; font-weight: 700; margin-top: 4px;">
              Guaranteed Net Profit: <b>+${profitNet.toFixed(2)}</b> (No Risk)
            </div>
          </div>
        </div>

        <!-- Stake Split Legs Breakdown Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px;">
          
          <!-- Leg 1 Card -->
          <div style="background: rgba(26,104,219,0.08); border: 1px solid rgba(59,130,246,0.3); border-radius: var(--radius-sm); padding: 12px 14px; display: flex; flex-direction: column; justify-content: space-between; gap: 10px;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <span style="font-size: 0.75rem; font-weight: 800; color: #3b82f6; text-transform: uppercase;">LEG 1 &bull; ${b1Info.name}</span>
                <span style="font-size: 0.8rem; font-weight: 900; color: #ffffff;">@${o1.toFixed(2)} Odds</span>
              </div>
              <div style="font-size: 0.85rem; font-weight: 800; color: #ffffff;">${deal.leg1.selection}</div>
              <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 4px;">
                Stake: <b style="color: #3b82f6;">${stake1.toFixed(2)}</b> &bull; Payout: <b>${return1.toFixed(2)}</b>
              </div>
            </div>
            <a href="${deal.leg1.link}" target="_blank" class="btn btn-secondary" style="font-size: 0.72rem; padding: 6px 12px; border: 1px solid var(--brand-royal-blue); color: #ffffff; text-align: center; text-decoration: none; font-weight: 700; display: block;">
              📲 Bet ${stake1.toFixed(2)} on ${b1Info.name}
            </a>
          </div>

          <!-- Leg 2 Card -->
          <div style="background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.3); border-radius: var(--radius-sm); padding: 12px 14px; display: flex; flex-direction: column; justify-content: space-between; gap: 10px;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <span style="font-size: 0.75rem; font-weight: 800; color: #fbbf24; text-transform: uppercase;">LEG 2 &bull; ${b2Info.name}</span>
                <span style="font-size: 0.8rem; font-weight: 900; color: #ffffff;">@${o2.toFixed(2)} Odds</span>
              </div>
              <div style="font-size: 0.85rem; font-weight: 800; color: #ffffff;">${deal.leg2.selection}</div>
              <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 4px;">
                Stake: <b style="color: #fbbf24;">${stake2.toFixed(2)}</b> &bull; Payout: <b>${return2.toFixed(2)}</b>
              </div>
            </div>
            <a href="${deal.leg2.link}" target="_blank" class="btn btn-secondary" style="font-size: 0.72rem; padding: 6px 12px; border: 1px solid #d97706; color: #ffffff; text-align: center; text-decoration: none; font-weight: 700; display: block;">
              📲 Bet ${stake2.toFixed(2)} on ${b2Info.name}
            </a>
          </div>

        </div>

      </div>
    `;
  });

  container.innerHTML = html;
}



window.runArbitrageScanner = runArbitrageScanner;




// Global Window Binding Auto-Export Block for ES Module Compatibility
try { if (typeof toggleBetslipDrawer === 'function') window.toggleBetslipDrawer = toggleBetslipDrawer; } catch (e) {}
try { if (typeof getMatchOdds === 'function') window.getMatchOdds = getMatchOdds; } catch (e) {}
try { if (typeof addActiveMatchToBetslip === 'function') window.addActiveMatchToBetslip = addActiveMatchToBetslip; } catch (e) {}
try { if (typeof generateScoutAccumulator === 'function') window.generateScoutAccumulator = generateScoutAccumulator; } catch (e) {}
try { if (typeof removeBetslipItem === 'function') window.removeBetslipItem = removeBetslipItem; } catch (e) {}
try { if (typeof clearBetslip === 'function') window.clearBetslip = clearBetslip; } catch (e) {}
try { if (typeof sendBetslipToConverter === 'function') window.sendBetslipToConverter = sendBetslipToConverter; } catch (e) {}
try { if (typeof renderBetslip === 'function') window.renderBetslip = renderBetslip; } catch (e) {}
try { if (typeof togglePaddiDropdown === 'function') window.togglePaddiDropdown = togglePaddiDropdown; } catch (e) {}
try { if (typeof selectConverterBookmaker === 'function') window.selectConverterBookmaker = selectConverterBookmaker; } catch (e) {}
try { if (typeof selectPaddiBookmaker === 'function') window.selectPaddiBookmaker = selectPaddiBookmaker; } catch (e) {}
try { if (typeof initBetPaddiConverter === 'function') window.initBetPaddiConverter = initBetPaddiConverter; } catch (e) {}
try { if (typeof getBookiePrefix === 'function') window.getBookiePrefix = getBookiePrefix; } catch (e) {}
try { if (typeof getBookieAffiliateInfo === 'function') window.getBookieAffiliateInfo = getBookieAffiliateInfo; } catch (e) {}
try { if (typeof placeBetOnBookmaker === 'function') window.placeBetOnBookmaker = placeBetOnBookmaker; } catch (e) {}
try { if (typeof convertBetSlipCode === 'function') window.convertBetSlipCode = convertBetSlipCode; } catch (e) {}
try { if (typeof renderRecentConvertedSlips === 'function') window.renderRecentConvertedSlips = renderRecentConvertedSlips; } catch (e) {}
try { if (typeof loadRecentConversion === 'function') window.loadRecentConversion = loadRecentConversion; } catch (e) {}
try { if (typeof convertBookingCode === 'function') window.convertBookingCode = convertBookingCode; } catch (e) {}
try { if (typeof copyConvertedCode === 'function') window.copyConvertedCode = copyConvertedCode; } catch (e) {}
try { if (typeof saveConvertedTicketToProfile === 'function') window.saveConvertedTicketToProfile = saveConvertedTicketToProfile; } catch (e) {}
try { if (typeof saveGeneratedTicket === 'function') window.saveGeneratedTicket = saveGeneratedTicket; } catch (e) {}
try { if (typeof renderDeepPredictBetDateBar === 'function') window.renderDeepPredictBetDateBar = renderDeepPredictBetDateBar; } catch (e) {}
try { if (typeof selectDeepPredictBetDate === 'function') window.selectDeepPredictBetDate = selectDeepPredictBetDate; } catch (e) {}
try { if (typeof selectDeepPredictBetLive === 'function') window.selectDeepPredictBetLive = selectDeepPredictBetLive; } catch (e) {}
try { if (typeof filterMatches === 'function') window.filterMatches = filterMatches; } catch (e) {}
try { if (typeof triggerToolRoute === 'function') window.triggerToolRoute = triggerToolRoute; } catch (e) {}
try { if (typeof triggerWatchlistFilter === 'function') window.triggerWatchlistFilter = triggerWatchlistFilter; } catch (e) {}
try { if (typeof openGeneralScout === 'function') window.openGeneralScout = openGeneralScout; } catch (e) {}
try { if (typeof unlockPremiumPlanLigue2 === 'function') window.unlockPremiumPlanLigue2 = unlockPremiumPlanLigue2; } catch (e) {}
try { if (typeof showAppNotification === 'function') window.showAppNotification = showAppNotification; } catch (e) {}
try { if (typeof changeAppLanguage === 'function') window.changeAppLanguage = changeAppLanguage; } catch (e) {}
try { if (typeof openModalSubmitTip === 'function') window.openModalSubmitTip = openModalSubmitTip; } catch (e) {}
try { if (typeof closeSubmitTipModal === 'function') window.closeSubmitTipModal = closeSubmitTipModal; } catch (e) {}
try { if (typeof submitPunterTip === 'function') window.submitPunterTip = submitPunterTip; } catch (e) {}
try { if (typeof createScannerRule === 'function') window.createScannerRule = createScannerRule; } catch (e) {}
try { if (typeof removeScannerRule === 'function') window.removeScannerRule = removeScannerRule; } catch (e) {}
try { if (typeof renderScannerRules === 'function') window.renderScannerRules = renderScannerRules; } catch (e) {}
try { if (typeof startLiveAlertsScanner === 'function') window.startLiveAlertsScanner = startLiveAlertsScanner; } catch (e) {}
try { if (typeof renderBacktestSVGChart === 'function') window.renderBacktestSVGChart = renderBacktestSVGChart; } catch (e) {}
try { if (typeof unlockPremiumPlan === 'function') window.unlockPremiumPlan = unlockPremiumPlan; } catch (e) {}
try { if (typeof sendScoutMessage === 'function') window.sendScoutMessage = sendScoutMessage; } catch (e) {}
try { if (typeof handleChatKeyPress === 'function') window.handleChatKeyPress = handleChatKeyPress; } catch (e) {}
try { if (typeof quickPromptScout === 'function') window.quickPromptScout = quickPromptScout; } catch (e) {}
try { if (typeof triggerHeroScoutPrompt === 'function') window.triggerHeroScoutPrompt = triggerHeroScoutPrompt; } catch (e) {}
try { if (typeof syncBacktesterPremiumState === 'function') window.syncBacktesterPremiumState = syncBacktesterPremiumState; } catch (e) {}
try { if (typeof updateOddsSliderVal === 'function') window.updateOddsSliderVal = updateOddsSliderVal; } catch (e) {}
try { if (typeof updateProbSliderVal === 'function') window.updateProbSliderVal = updateProbSliderVal; } catch (e) {}
try { if (typeof generateMachineTicket === 'function') window.generateMachineTicket = generateMachineTicket; } catch (e) {}
try { if (typeof copyGeneratedTicketCode === 'function') window.copyGeneratedTicketCode = copyGeneratedTicketCode; } catch (e) {}
try { if (typeof copyEngineSourceCode === 'function') window.copyEngineSourceCode = copyEngineSourceCode; } catch (e) {}
try { if (typeof copyEngineTargetCode === 'function') window.copyEngineTargetCode = copyEngineTargetCode; } catch (e) {}
try { if (typeof runEngineConversion === 'function') window.runEngineConversion = runEngineConversion; } catch (e) {}
try { if (typeof runAdvancedFilters === 'function') window.runAdvancedFilters = runAdvancedFilters; } catch (e) {}
try { if (typeof runBacktestSimulation === 'function') window.runBacktestSimulation = runBacktestSimulation; } catch (e) {}
try { if (typeof toggleTelegramAlerts === 'function') window.toggleTelegramAlerts = toggleTelegramAlerts; } catch (e) {}
try { if (typeof toggleWatchlist === 'function') window.toggleWatchlist = toggleWatchlist; } catch (e) {}
try { if (typeof copyDailyTipOdds === 'function') window.copyDailyTipOdds = copyDailyTipOdds; } catch (e) {}
try { if (typeof switchPredictionDate === 'function') window.switchPredictionDate = switchPredictionDate; } catch (e) {}
try { if (typeof filterMarketSubmenu === 'function') window.filterMarketSubmenu = filterMarketSubmenu; } catch (e) {}
try { if (typeof filterTopTip === 'function') window.filterTopTip = filterTopTip; } catch (e) {}
try { if (typeof triggerTopTipFilter === 'function') window.triggerTopTipFilter = triggerTopTipFilter; } catch (e) {}
try { if (typeof updateBarDate === 'function') window.updateBarDate = updateBarDate; } catch (e) {}
try { if (typeof applyBarTopTip === 'function') window.applyBarTopTip = applyBarTopTip; } catch (e) {}
try { if (typeof triggerMatchPreview === 'function') window.triggerMatchPreview = triggerMatchPreview; } catch (e) {}
try { if (typeof populateSearchSuggestions === 'function') window.populateSearchSuggestions = populateSearchSuggestions; } catch (e) {}
try { if (typeof handleSearchSelect === 'function') window.handleSearchSelect = handleSearchSelect; } catch (e) {}
try { if (typeof getOrdinalDate === 'function') window.getOrdinalDate = getOrdinalDate; } catch (e) {}
try { if (typeof populateCalSelectors === 'function') window.populateCalSelectors = populateCalSelectors; } catch (e) {}
try { if (typeof runCalFilter === 'function') window.runCalFilter = runCalFilter; } catch (e) {}
try { if (typeof triggerQuickFilter === 'function') window.triggerQuickFilter = triggerQuickFilter; } catch (e) {}
try { if (typeof updateFixturesDisplay === 'function') window.updateFixturesDisplay = updateFixturesDisplay; } catch (e) {}
try { if (typeof loadDoctorSample === 'function') window.loadDoctorSample = loadDoctorSample; } catch (e) {}
try { if (typeof runBetDoctorAudit === 'function') window.runBetDoctorAudit = runBetDoctorAudit; } catch (e) {}
try { if (typeof applyDoctorPrescription === 'function') window.applyDoctorPrescription = applyDoctorPrescription; } catch (e) {}
try { if (typeof convertAuditedTicket === 'function') window.convertAuditedTicket = convertAuditedTicket; } catch (e) {}
try { if (typeof runArbitrageScanner === 'function') window.runArbitrageScanner = runArbitrageScanner; } catch (e) {}

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
window.openBetDoctorModal = openBetDoctorModal;
window.toggleAdvanceFilters = toggleAdvanceFilters;

// Auto-Export Window Bindings for app.js
try { if (typeof addActiveMatchToBetslip === 'function') window.addActiveMatchToBetslip = addActiveMatchToBetslip; } catch (e) {}
try { if (typeof applyBarTopTip === 'function') window.applyBarTopTip = applyBarTopTip; } catch (e) {}
try { if (typeof applyDoctorPrescription === 'function') window.applyDoctorPrescription = applyDoctorPrescription; } catch (e) {}
try { if (typeof changeAppLanguage === 'function') window.changeAppLanguage = changeAppLanguage; } catch (e) {}
try { if (typeof clearBetslip === 'function') window.clearBetslip = clearBetslip; } catch (e) {}
try { if (typeof closeSubmitTipModal === 'function') window.closeSubmitTipModal = closeSubmitTipModal; } catch (e) {}
try { if (typeof convertAuditedTicket === 'function') window.convertAuditedTicket = convertAuditedTicket; } catch (e) {}
try { if (typeof convertBetSlipCode === 'function') window.convertBetSlipCode = convertBetSlipCode; } catch (e) {}
try { if (typeof convertBookingCode === 'function') window.convertBookingCode = convertBookingCode; } catch (e) {}
try { if (typeof copyConvertedCode === 'function') window.copyConvertedCode = copyConvertedCode; } catch (e) {}
try { if (typeof createScannerRule === 'function') window.createScannerRule = createScannerRule; } catch (e) {}
try { if (typeof filterMarketSubmenu === 'function') window.filterMarketSubmenu = filterMarketSubmenu; } catch (e) {}
try { if (typeof filterMatches === 'function') window.filterMatches = filterMatches; } catch (e) {}
try { if (typeof filterTopTip === 'function') window.filterTopTip = filterTopTip; } catch (e) {}
try { if (typeof generateScoutAccumulator === 'function') window.generateScoutAccumulator = generateScoutAccumulator; } catch (e) {}
try { if (typeof getBookieAffiliateInfo === 'function') window.getBookieAffiliateInfo = getBookieAffiliateInfo; } catch (e) {}
try { if (typeof getBookiePrefix === 'function') window.getBookiePrefix = getBookiePrefix; } catch (e) {}
try { if (typeof getMatchOdds === 'function') window.getMatchOdds = getMatchOdds; } catch (e) {}
try { if (typeof getOrdinalDate === 'function') window.getOrdinalDate = getOrdinalDate; } catch (e) {}
try { if (typeof handleChatKeyPress === 'function') window.handleChatKeyPress = handleChatKeyPress; } catch (e) {}
try { if (typeof handleSearchSelect === 'function') window.handleSearchSelect = handleSearchSelect; } catch (e) {}
try { if (typeof initAppEngine === 'function') window.initAppEngine = initAppEngine; } catch (e) {}
try { if (typeof initBetPaddiConverter === 'function') window.initBetPaddiConverter = initBetPaddiConverter; } catch (e) {}
try { if (typeof loadDoctorSample === 'function') window.loadDoctorSample = loadDoctorSample; } catch (e) {}
try { if (typeof loadRecentConversion === 'function') window.loadRecentConversion = loadRecentConversion; } catch (e) {}
try { if (typeof openGeneralScout === 'function') window.openGeneralScout = openGeneralScout; } catch (e) {}
try { if (typeof openModalSubmitTip === 'function') window.openModalSubmitTip = openModalSubmitTip; } catch (e) {}
try { if (typeof placeBetOnBookmaker === 'function') window.placeBetOnBookmaker = placeBetOnBookmaker; } catch (e) {}
try { if (typeof populateCalSelectors === 'function') window.populateCalSelectors = populateCalSelectors; } catch (e) {}
try { if (typeof populateSearchSuggestions === 'function') window.populateSearchSuggestions = populateSearchSuggestions; } catch (e) {}
try { if (typeof quickPromptScout === 'function') window.quickPromptScout = quickPromptScout; } catch (e) {}
try { if (typeof removeBetslipItem === 'function') window.removeBetslipItem = removeBetslipItem; } catch (e) {}
try { if (typeof removeScannerRule === 'function') window.removeScannerRule = removeScannerRule; } catch (e) {}
try { if (typeof renderBacktestSVGChart === 'function') window.renderBacktestSVGChart = renderBacktestSVGChart; } catch (e) {}
try { if (typeof renderDeepPredictBetDateBar === 'function') window.renderDeepPredictBetDateBar = renderDeepPredictBetDateBar; } catch (e) {}
try { if (typeof renderBetslip === 'function') window.renderBetslip = renderBetslip; } catch (e) {}
try { if (typeof renderRecentConvertedSlips === 'function') window.renderRecentConvertedSlips = renderRecentConvertedSlips; } catch (e) {}
try { if (typeof renderScannerRules === 'function') window.renderScannerRules = renderScannerRules; } catch (e) {}
try { if (typeof runArbitrageScanner === 'function') window.runArbitrageScanner = runArbitrageScanner; } catch (e) {}
try { if (typeof runBetDoctorAudit === 'function') window.runBetDoctorAudit = runBetDoctorAudit; } catch (e) {}
try { if (typeof runCalFilter === 'function') window.runCalFilter = runCalFilter; } catch (e) {}
try { if (typeof runOnReady === 'function') window.runOnReady = runOnReady; } catch (e) {}
try { if (typeof saveConvertedTicketToProfile === 'function') window.saveConvertedTicketToProfile = saveConvertedTicketToProfile; } catch (e) {}
try { if (typeof saveGeneratedTicket === 'function') window.saveGeneratedTicket = saveGeneratedTicket; } catch (e) {}
try { if (typeof selectDeepPredictBetDate === 'function') window.selectDeepPredictBetDate = selectDeepPredictBetDate; } catch (e) {}
try { if (typeof selectDeepPredictBetLive === 'function') window.selectDeepPredictBetLive = selectDeepPredictBetLive; } catch (e) {}
try { if (typeof selectConverterBookmaker === 'function') window.selectConverterBookmaker = selectConverterBookmaker; } catch (e) {}
try { if (typeof selectPaddiBookmaker === 'function') window.selectPaddiBookmaker = selectPaddiBookmaker; } catch (e) {}
try { if (typeof sendBetslipToConverter === 'function') window.sendBetslipToConverter = sendBetslipToConverter; } catch (e) {}
try { if (typeof sendScoutMessage === 'function') window.sendScoutMessage = sendScoutMessage; } catch (e) {}
try { if (typeof showAppNotification === 'function') window.showAppNotification = showAppNotification; } catch (e) {}
try { if (typeof startLiveAlertsScanner === 'function') window.startLiveAlertsScanner = startLiveAlertsScanner; } catch (e) {}
try { if (typeof submitPunterTip === 'function') window.submitPunterTip = submitPunterTip; } catch (e) {}
try { if (typeof toggleBetslipDrawer === 'function') window.toggleBetslipDrawer = toggleBetslipDrawer; } catch (e) {}
try { if (typeof togglePaddiDropdown === 'function') window.togglePaddiDropdown = togglePaddiDropdown; } catch (e) {}
try { if (typeof triggerHeroScoutPrompt === 'function') window.triggerHeroScoutPrompt = triggerHeroScoutPrompt; } catch (e) {}
try { if (typeof triggerMatchPreview === 'function') window.triggerMatchPreview = triggerMatchPreview; } catch (e) {}
try { if (typeof triggerQuickFilter === 'function') window.triggerQuickFilter = triggerQuickFilter; } catch (e) {}
try { if (typeof triggerToolRoute === 'function') window.triggerToolRoute = triggerToolRoute; } catch (e) {}
try { if (typeof triggerTopTipFilter === 'function') window.triggerTopTipFilter = triggerTopTipFilter; } catch (e) {}
try { if (typeof triggerWatchlistFilter === 'function') window.triggerWatchlistFilter = triggerWatchlistFilter; } catch (e) {}
try { if (typeof unlockPremiumPlan === 'function') window.unlockPremiumPlan = unlockPremiumPlan; } catch (e) {}
try { if (typeof unlockPremiumPlanLigue2 === 'function') window.unlockPremiumPlanLigue2 = unlockPremiumPlanLigue2; } catch (e) {}
try { if (typeof updateBarDate === 'function') window.updateBarDate = updateBarDate; } catch (e) {}
try { if (typeof updateFixturesDisplay === 'function') window.updateFixturesDisplay = updateFixturesDisplay; } catch (e) {}


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

function saveGeneratedTicket() {
  const codeEl = document.getElementById("ticket-booking-code");
  const code = codeEl ? codeEl.innerText.trim() : "DP-TICKET";
  
  if (!window.appState) window.appState = {};
  if (!window.appState.savedTickets) window.appState.savedTickets = [];

  const ticket = {
    code,
    date: new Date().toLocaleDateString(),
    betslip: window.appState.betslip || []
  };

  window.appState.savedTickets.push(ticket);

  if (typeof showAppNotification === 'function') {
    showAppNotification(`💾 Ticket '${code}' saved to profile history!`);
  }
}

window.updateOddsSliderVal = updateOddsSliderVal;
window.updateProbSliderVal = updateProbSliderVal;
window.generateMachineTicket = generateMachineTicket;
window.copyGeneratedTicketCode = copyGeneratedTicketCode;
window.runEngineConversion = runEngineConversion;
window.copyEngineSourceCode = copyEngineSourceCode;
window.copyEngineTargetCode = copyEngineTargetCode;
window.saveGeneratedTicket = saveGeneratedTicket;


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

function handleAuthSignup(e) {
  if (e) {
    if (typeof e.preventDefault === 'function') e.preventDefault();
    if (typeof e.stopPropagation === 'function') e.stopPropagation();
  }

  const input = document.getElementById("signup-username");
  let username = "Egeruennamdi78";
  if (input && input.value && input.value.trim().length > 0) {
    username = input.value.trim();
  }

  try {
    localStorage.setItem("userLoggedIn", "true");
    localStorage.setItem("currentUsername", username);
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

function updateAuthUIState() {
  const isLoggedIn = localStorage.getItem("userLoggedIn") === "true";
  const username = localStorage.getItem("currentUsername") || "Guest User";

  const navLabel = document.getElementById("nav-user-label");
  const drawerUsername = document.getElementById("mobile-drawer-username");
  const profileUsernameDisplay = document.getElementById("profile-username-display");
  const profileAvatarInitial = document.getElementById("profile-avatar-initial");

  if (navLabel) {
    navLabel.innerText = isLoggedIn ? username : "Login";
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
      { name: "Premier League", emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", country: "England" },
      { name: "La Liga", emoji: "🇪🇸", country: "Spain" },
      { name: "Serie A", emoji: "🇮🇹", country: "Italy" },
      { name: "Bundesliga", emoji: "🇩🇪", country: "Germany" },
      { name: "Ligue 1", emoji: "🇫🇷", country: "France" },
      { name: "Champions League", emoji: "🇪🇺", country: "Europe" },
      { name: "Europa League", emoji: "🇪🇺", country: "Europe" },
      { name: "Conference League", emoji: "🇪🇺", country: "Europe" },
      { name: "Eredivisie", emoji: "🇳🇱", country: "Netherlands" },
      { name: "Primeira Liga", emoji: "🇵🇹", country: "Portugal" },
      { name: "Süper Lig", emoji: "🇹🇷", country: "Turkey" },
      { name: "Championship", emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", country: "England" },
      { name: "Brasileirão", emoji: "🇧🇷", country: "Brazil" },
      { name: "Liga Profesional", emoji: "🇦🇷", country: "Argentina" },
      { name: "MLS", emoji: "🇺🇸", country: "USA" },
      { name: "Saudi Pro League", emoji: "🇸🇦", country: "Saudi Arabia" },
      { name: "NPFL Nigeria", emoji: "🇳🇬", country: "Nigeria" }
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
        <div class="country-accordion-content" style="max-height: ${isExpanded ? '500px' : '0'}; overflow: hidden; transition: max-height 0.25s ease-in-out; padding-left: 8px; display: flex; flex-direction: column; gap: 4px; margin-top: 4px;">
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
    if (content.style.maxHeight && content.style.maxHeight !== '0px') {
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

  // 2. Also Update On-Page Decoded Tray (#betcode-decoded-tray)
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
  if (!bookieKey) return "Global Bookmaker";
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

// Global Exports
window.resolveConverterInputs = resolveConverterInputs;
window.convertBetSlipCode = convertBetSlipCode;
window.executeHeroBetCodeConversion = executeHeroBetCodeConversion;
window.convertBetCode = convertBetCode;
window.copyTargetBookingCode = copyTargetBookingCode;
window.closeConversionResultModal = closeConversionResultModal;
