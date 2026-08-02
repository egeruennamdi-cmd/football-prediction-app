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

// Expose BetPaddi functions globally
window.togglePaddiDropdown = togglePaddiDropdown;
window.selectPaddiBookmaker = selectPaddiBookmaker;
window.selectConverterBookmaker = selectConverterBookmaker;
window.initBetPaddiConverter = initBetPaddiConverter;
window.convertBetSlipCode = convertBetSlipCode;

// Expose app.js functions globally
window.applyBarTopTip = applyBarTopTip;
window.createScannerRule = createScannerRule;
window.removeScannerRule = removeScannerRule;
window.filterMarketSubmenu = filterMarketSubmenu;
window.filterMatches = filterMatches;
window.filterTopTip = filterTopTip;
window.generateMachineTicket = generateMachineTicket;
window.runAdvancedFilters = runAdvancedFilters;
window.runBacktestSimulation = runBacktestSimulation;
window.saveGeneratedTicket = saveGeneratedTicket;
window.submitPunterTip = submitPunterTip;
window.toggleTelegramAlerts = toggleTelegramAlerts;
window.triggerMatchPreview = triggerMatchPreview;
window.triggerQuickFilter = triggerQuickFilter;
window.triggerToolRoute = triggerToolRoute;
window.triggerTopTipFilter = triggerTopTipFilter;
window.triggerWatchlistFilter = triggerWatchlistFilter;
window.unlockPremiumPlan = unlockPremiumPlan;
window.updateBarDate = updateBarDate;
window.copyGeneratedTicketCode = copyGeneratedTicketCode;
window.copyEngineSourceCode = copyEngineSourceCode;
window.copyEngineTargetCode = copyEngineTargetCode;
window.runEngineConversion = runEngineConversion;
window.closeSubmitTipModal = closeSubmitTipModal;
window.openModalSubmitTip = openModalSubmitTip;
window.sendScoutMessage = sendScoutMessage;

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
  const matchId = window.appState.activeScoutMatchId;
  if (!matchId) return;

  if (window.appState.betslip.length >= 40) {
    alert("⚠️ Maximum limit of 40 selections reached in your active betslip.");
    return;
  }

  const match = MATCH_DATA.find(m => m.id === matchId);
  if (!match) return;

  const tip = getMatchTip(match);
  const odds = getMatchOdds(match);

  // Check duplicate
  if (window.appState.betslip.some(item => item.matchId === matchId)) {
    alert("⚠️ This match is already in your active betslip.");
    return;
  }

  // Add selection
  window.appState.betslip.push({
    matchId,
    match,
    tip,
    odds
  });

  // Close Scout Modal
  triggerCloseScoutModal();

  // Render slip and open drawer
  renderBetslip();
  
  const drawer = document.getElementById("floating-betslip-drawer");
  if (drawer && !drawer.classList.contains("open")) {
    drawer.classList.add("open");
  }
}

function generateScoutAccumulator(count = 40) {
  if (typeof MATCH_DATA === 'undefined' || !MATCH_DATA || MATCH_DATA.length === 0) return;

  const reqCount = Math.min(Math.max(parseInt(count) || 40, 3), 40);
  window.appState.betslip = [];

  const marketOptions = [
    "Home Win (1)", "Away Win (2)", "Over 1.5 Goals", "Over 2.5 Goals",
    "Both Teams To Score (BTTS)", "Double Chance (1X)", "Double Chance (X2)",
    "Under 3.5 Goals", "Home Win or Draw", "Draw (X)"
  ];

  for (let i = 0; i < reqCount; i++) {
    const match = MATCH_DATA[i % MATCH_DATA.length];
    const tip = marketOptions[i % marketOptions.length];
    const hash = (match.homeTeam.name + match.awayTeam.name + i);
    let h = 0;
    for (let j = 0; j < hash.length; j++) h = hash.charCodeAt(j) + ((h << 5) - h);
    const odds = parseFloat((1.35 + (Math.abs(h) % 18) * 0.05).toFixed(2));

    const cycle = Math.floor(i / MATCH_DATA.length);
    const homeSuffix = cycle > 0 ? ` [R${cycle + 1}]` : '';
    const awaySuffix = cycle > 0 ? ` [R${cycle + 1}]` : '';

    window.appState.betslip.push({
      matchId: `scout-acc-${i}-${match.id}`,
      match: {
        ...match,
        homeTeam: { name: match.homeTeam.name + homeSuffix },
        awayTeam: { name: match.awayTeam.name + awaySuffix }
      },
      tip,
      odds
    });
  }

  // Render betslip and update drawer
  renderBetslip();
  const drawer = document.getElementById("floating-betslip-drawer");
  if (drawer) drawer.classList.add("open");

  showAppNotification(`🎯 AI Scout generated a ${reqCount}-Match Accumulator Ticket!`);
}

function removeBetslipItem(index) {
  window.appState.betslip.splice(index, 1);
  renderBetslip();
}

function clearBetslip() {
  window.appState.betslip = [];
  renderBetslip();
}

function sendBetslipToConverter() {
  if (window.appState.betslip.length === 0) return;

  // Generate deterministic booking code
  const code = "BM-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  
  if (!window.generatedTicketsCache) {
    window.generatedTicketsCache = {};
  }

  // Populate conversion cache
  window.generatedTicketsCache[code] = {
    selections: window.appState.betslip.map(item => ({
      fixture: `${item.match.homeTeam.name} vs ${item.match.awayTeam.name}`,
      league: item.match.league,
      market: "Match Tip",
      prediction: item.tip,
      sourceOdds: item.odds,
      targetOdds: parseFloat((item.odds * 1.06).toFixed(2)) // boost!
    }))
  };

  // Set code input field value
  const inputField = document.getElementById("betcode-src-code");
  if (inputField) {
    inputField.value = code;
  }

  // Set default bookmakers SB -> 1XB
  const srcSelect = document.getElementById("betcode-src-select");
  const tgtSelect = document.getElementById("betcode-tgt-select");
  if (srcSelect) srcSelect.value = 'sportybet:ng';
  if (tgtSelect) tgtSelect.value = '1xbet:ng';

  // Collapse drawer
  const drawer = document.getElementById("floating-betslip-drawer");
  if (drawer) {
    drawer.classList.remove("open");
  }

  // Scroll to converter section
  const converterSec = document.getElementById("betcode-converter");
  if (converterSec) {
    converterSec.scrollIntoView({ behavior: 'smooth' });
  }

  // Trigger conversion
  setTimeout(() => {
    convertBetSlipCode();
  }, 600);
}

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
    melbet: 'ML', megapari: 'MP', betwinner: 'BWN', paripesa: 'PP', betmines: 'BM', merrybet: 'MB', nairabet: 'NB',
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
  'sportybet': { name: 'SportyBet', url: 'https://www.sportybet.com/?referralCode=BETMINES', bonus: '100% Welcome Gift' },
  'bet9ja': { name: 'Bet9ja', url: 'https://register.bet9ja.com/?promocode=BETMINES', bonus: '100% Deposit Bonus' },
  '1xbet': { name: '1xBet', url: 'https://1xbet.com/?tag=betmines', bonus: '200% First Deposit Bonus' },
  'betking': { name: 'BetKing', url: 'https://www.betking.com/register?code=BETMINES', bonus: '100% FreeBet Bonus' },
  'betway': { name: 'Betway', url: 'https://www.betway.com/register?btag=BETMINES', bonus: '100% Welcome Bonus' },
  '22bet': { name: '22Bet', url: 'https://22bet.com/?tag=betmines', bonus: '100% Welcome Bonus' },
  'msport': { name: 'MSport', url: 'https://www.msport.com/?referral=BETMINES', bonus: '300% Welcome Voucher' },
  'betano': { name: 'Betano', url: 'https://www.betano.com/?promo=BETMINES', bonus: '100% Welcome Bonus' },
  'melbet': { name: 'Melbet', url: 'https://melbet.com/?tag=betmines', bonus: '200% Welcome Bonus' },
  'megapari': { name: 'Megapari', url: 'https://megapari.com/?tag=betmines', bonus: '200% Welcome Bonus' },
  'betwinner': { name: 'BetWinner', url: 'https://betwinner.com/?tag=betmines', bonus: '100% Welcome Bonus' },
  'paripesa': { name: 'Paripesa', url: 'https://paripesa.com/?tag=betmines', bonus: '100% Welcome Bonus' },
  'merrybet': { name: 'Merrybet', url: 'https://www.merrybet.com/?ref=BETMINES', bonus: '100% Deposit Match' },
  'nairabet': { name: 'NairaBET', url: 'https://www.nairabet.com/?ref=BETMINES', bonus: '100% Welcome Bonus' },
  'bangbet': { name: 'Bangbet', url: 'https://www.bangbet.com/?ref=BETMINES', bonus: '200% Welcome Voucher' },
  'betika': { name: 'Betika', url: 'https://www.betika.com/?ref=BETMINES', bonus: 'First Deposit Bonus' },
  'easybet': { name: 'Easybet', url: 'https://www.easybet.co.za/?ref=BETMINES', bonus: 'R50 Sign-Up Bonus' },
  'hollywoodbet': { name: 'Hollywoodbets', url: 'https://www.hollywoodbets.net/?ref=BETMINES', bonus: 'R25 Sign-Up Bonus' },
  'mozzart': { name: 'Mozzart Bet', url: 'https://www.mozzartbet.com/?ref=BETMINES', bonus: '100% Triple Bonus' },
  'premierbet': { name: 'Premier Bet', url: 'https://www.premierbet.com/?ref=BETMINES', bonus: '150% Welcome Bonus' },
  'supersport': { name: 'SuperSportBet', class: 'supersport', url: 'https://www.supersportbet.com/?ref=BETMINES', bonus: '100% Deposit Match' },
  'odibets': { name: 'Odibets', url: 'https://www.odibets.com/?ref=BETMINES', bonus: 'KSh 30 Free Bet' },
  'galsport': { name: 'Gal Sport Betting', url: 'https://www.gsb.ug/?ref=BETMINES', bonus: '100% First Deposit Bonus' },

  // Europe & UK Heavyweights
  'bet365': { name: 'Bet365', url: 'https://www.bet365.com/?affiliate=BETMINES', bonus: 'Bet $5 Get $150 in Bonus Bets' },
  'unibet': { name: 'Unibet', url: 'https://www.unibet.com/?ref=BETMINES', bonus: '100% Risk-Free Bet' },
  'williamhill': { name: 'William Hill', url: 'https://www.williamhill.com/?ref=BETMINES', bonus: 'Bet $10 Get $30' },
  'bwin': { name: 'bwin', url: 'https://www.bwin.com/?ref=BETMINES', bonus: '100% Backup Bet' },
  'paddypower': { name: 'Paddy Power', url: 'https://www.paddypower.com/?ref=BETMINES', bonus: 'Money Back as Cash' },
  'betfair': { name: 'Betfair', url: 'https://www.betfair.com/?ref=BETMINES', bonus: 'Exchange Bonus' },
  'skybet': { name: 'SkyBet', url: 'https://www.skybet.com/?ref=BETMINES', bonus: 'Bet 5p Get $30' },
  '888sport': { name: '888sport', url: 'https://www.888sport.com/?ref=BETMINES', bonus: '300% Bonus Pack' },

  // North America (US & Canada)
  'draftkings': { name: 'DraftKings', url: 'https://www.draftkings.com/?ref=BETMINES', bonus: 'Up to $1,200 Bonus' },
  'fanduel': { name: 'FanDuel', url: 'https://www.fanduel.com/?ref=BETMINES', bonus: 'Bet $5 Get $200' },
  'betmgm': { name: 'BetMGM', url: 'https://www.betmgm.com/?ref=BETMINES', bonus: 'First Bet Offer up to $1,500' },
  'caesars': { name: 'Caesars Sportsbook', url: 'https://www.caesars.com/?ref=BETMINES', bonus: 'Up to $1,000 First Bet' },
  'pointsbet': { name: 'PointsBet', url: 'https://www.pointsbet.com/?ref=BETMINES', bonus: '5x Second Chance Bets' },

  // Latin America & Brazil
  'pixbet': { name: 'Pixbet', url: 'https://www.pixbet.com/?ref=BETMINES', bonus: 'Saque Rápido via Pix' },
  'caliente': { name: 'Caliente', url: 'https://www.caliente.mx/?ref=BETMINES', bonus: '$1,000 MXN Sin Depósito' },
  'codere': { name: 'Codere', url: 'https://www.codere.com/?ref=BETMINES', bonus: '100% Bônus Boas-Vindas' },
  'estrelabet': { name: 'EstrelaBet', url: 'https://www.estrelabet.com/?ref=BETMINES', bonus: '100% Bônus de Depósito' },
  'betnacional': { name: 'Betnacional', url: 'https://www.betnacional.com/?ref=BETMINES', bonus: 'A bet dos Brasileiros' },

  // Asia, Oceania & Global Crypto Pioneers
  'stake': { name: 'Stake.com', url: 'https://stake.com/?c=BETMINES', bonus: '200% Rakeback & Crypto VIP' },
  'sportsbetau': { name: 'Sportsbet.com.au', url: 'https://www.sportsbet.com.au/?ref=BETMINES', bonus: 'Top Australian Odds' },
  'sbobet': { name: 'SBOBET', url: 'https://www.sbobet.com/?ref=BETMINES', bonus: '100% Asian Handicap Bonus' },
  '188bet': { name: '188BET', url: 'https://www.188bet.com/?ref=BETMINES', bonus: '100% Deposit Bonus' },
  'dafabet': { name: 'Dafabet', url: 'https://www.dafabet.com/?ref=BETMINES', bonus: '160% Welcome Bonus' },
  'bk8': { name: 'BK8', url: 'https://www.bk8.com/?ref=BETMINES', bonus: '288% Have You BK8 Bonus' },
  'bcgame': { name: 'BC.Game', url: 'https://bc.game/?i=BETMINES', bonus: '360% Crypto Deposit Bonus' },
  'cloudbet': { name: 'Cloudbet', url: 'https://www.cloudbet.com/?af_token=BETMINES', bonus: '100% Crypto Welcome Bonus' },
  'default': { name: 'Bookmaker', url: 'https://www.sportybet.com/?referralCode=BETMINES', bonus: 'Welcome Bonus' }
};

function getBookieAffiliateInfo(bookieId) {
  if (!bookieId) return BOOKMAKER_AFFILIATE_LINKS['default'];
  const cleanId = bookieId.split(":")[0].toLowerCase();
  return BOOKMAKER_AFFILIATE_LINKS[cleanId] || {
    name: cleanId.charAt(0).toUpperCase() + cleanId.slice(1),
    url: `https://www.${cleanId}.com/?ref=BETMINES`,
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

function convertBetSlipCode() {
  try {
    const inputEl = document.getElementById("betcode-src-code") || document.getElementById("paddi-src-code");
    const sourceCode = inputEl ? inputEl.value.toUpperCase().trim() : "";

    const srcSelect = document.getElementById("betcode-src-select");
    const tgtSelect = document.getElementById("betcode-tgt-select");

    const sourceBookie = srcSelect ? srcSelect.value : (window.appState.paddiSourceBookie || 'sportybet:ng');
    const targetBookie = tgtSelect ? tgtSelect.value : (window.appState.paddiTargetBookie || '1xbet:ng');
    const outputField = document.getElementById("paddi-tgt-code");

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

    // Check if sourceCode exists in global ticket cache
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
      // Fallback if custom booking code is typed: match active selection count setting
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

    const prefix = getBookiePrefix(targetBookie);
    const randomStr = ((seed * 73) % 1000000).toString(36).toUpperCase();
    const targetCode = `${prefix}-${randomStr}`;

    // Cache the target code in the global cache so it can be converted again consistently!
    window.generatedTicketsCache = window.generatedTicketsCache || {};
    window.generatedTicketsCache[targetCode] = {
      selections: mappedSelections
    };

    // Output target code if element exists
    if (outputField) {
      outputField.innerText = targetCode;
      outputField.classList.remove("empty");
    }

    // Display tray details
    const tray = document.getElementById("betcode-decoded-tray") || document.getElementById("paddi-decoded-tray");
    if (tray) {
      tray.style.display = "block";
      let itemsHtml = mappedSelections.map(sel => `
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); padding: 8px 0; font-size: 0.76rem; gap: 10px;">
          <div>
            <div style="font-weight: 700; color: var(--text-primary);">${sel.fixture}</div>
            <span style="font-size: 0.65rem; color: var(--text-muted);">${sel.league}</span>
          </div>
          <div style="text-align: right;">
            <div style="font-weight: 700; color: var(--primary);">${sel.market}: ${sel.prediction}</div>
            <span style="font-size: 0.65rem; color: var(--text-muted);">${sourceBookie.toUpperCase()} Odds: ${sel.sourceOdds} | ${targetBookie.toUpperCase()} Odds: ${sel.targetOdds}</span>
          </div>
        </div>
      `).join("");
      
      const payoutDiff = parseFloat((((totalTargetOdds - totalSourceOdds) / totalSourceOdds) * 100).toFixed(1));
      const isTargetBetter = payoutDiff >= 0;
      const targetBookieClean = targetBookie.split(":")[0].toUpperCase();

      const targetAff = getBookieAffiliateInfo(targetBookie);

      tray.innerHTML = `
        <div class="glass-card" style="padding: 20px; border: 1px solid rgba(16, 185, 129, 0.3); background: rgba(16, 185, 129, 0.04); border-radius: var(--radius-md); text-align: center;">
          <div style="font-size: 0.75rem; color: #10b981; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
            ⚡ Conversion Success
          </div>
          <div style="font-size: 0.85rem; color: var(--text-primary); margin-bottom: 12px;">
            Your ticket has been converted for <b style="color: var(--secondary);">${targetBookieClean}</b>!
          </div>
          <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 14px; background: rgba(0,0,0,0.25); border: 1px solid rgba(16,185,129,0.2); border-radius: var(--radius-sm); padding: 10px 16px; max-width: 320px; margin: 0 auto 14px;">
            <span style="font-size: 1.4rem; font-weight: 900; color: #10b981; font-family: var(--font-display); letter-spacing: 1px;">${targetCode}</span>
            <button onclick="navigator.clipboard.writeText('${targetCode}'); showAppNotification('📋 Code copied: ${targetCode}');" style="background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.3); border-radius: 4px; padding: 4px 10px; color: #10b981; font-size: 0.75rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 4px;">
              📋 Copy Code
            </button>
          </div>
          <button onclick="placeBetOnBookmaker('${targetBookie}', '${targetCode}')" style="width: 100%; max-width: 340px; margin: 0 auto 16px auto; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; border: none; border-radius: var(--radius-sm); font-weight: 800; font-size: 0.88rem; padding: 12px 20px; box-shadow: 0 4px 14px rgba(16,185,129,0.35); display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; transition: transform 0.2s ease;">
            🚀 Place Bet on ${targetAff.name} (${targetAff.bonus})
          </button>
          <div style="text-align: left; background: rgba(0,0,0,0.15); padding: 12px 16px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
            <div style="font-weight: 700; font-size: 0.82rem; margin-bottom: 8px; color: var(--text-secondary); display: flex; justify-content: space-between;">
              <span>📝 Decoded Slip Details (${mappedSelections.length} Matches)</span>
              <span style="color: var(--secondary);">Total Odds: ${totalTargetOdds}x</span>
            </div>
            <div style="max-height: 180px; overflow-y: auto; margin-bottom: 10px; padding-right: 4px;">
              ${itemsHtml}
            </div>
            <div style="font-size: 0.72rem; color: var(--text-secondary); display: flex; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 8px;">
              <span>Source Payout: ${totalSourceOdds}x</span>
              <span style="color: ${isTargetBetter ? 'var(--success)' : 'var(--danger)'}; font-weight: 700;">
                ${isTargetBetter ? `Boost Payout: +${payoutDiff}%` : `Odds Margin Variance: ${payoutDiff}%`}
              </span>
            </div>
          </div>
        </div>
      `;
    }

    // Prepend to Recent Converted Slips List
    window.recentConversionsList = window.recentConversionsList || [];
    window.recentConversionsList.unshift({
      srcBookie: sourceBookie.split(":")[0].toUpperCase(),
      srcCode: sourceCode,
      tgtBookie: targetBookie.split(":")[0].toUpperCase(),
      tgtCode: targetCode,
      matches: mappedSelections.length,
      totalOdds: `${totalTargetOdds}x`,
      timeAgo: "Just now"
    });
    if (window.recentConversionsList.length > 8) {
      window.recentConversionsList.pop();
    }
    renderRecentConvertedSlips();

    showAppNotification(`Bet Slip code converted to ${targetBookie.toUpperCase()} successfully!`);
  } catch (error) {
    console.error("BetPaddi Code Converter Error:", error);
    alert("An error occurred during bet slip conversion: " + error.message);
  }
}

// Render Recently Converted Bet Slips
function renderRecentConvertedSlips() {
  const grid = document.getElementById("recent-conversions-grid");
  if (!grid) return;

  const defaultConversions = [
    {
      srcBookie: "SPORTYBET",
      srcCode: "SB-89A4E",
      tgtBookie: "1XBET",
      tgtCode: "1XB-92F71",
      matches: 4,
      totalOdds: "6.85x",
      timeAgo: "12 mins ago"
    },
    {
      srcBookie: "BET9JA",
      srcCode: "B9J-F4012",
      tgtBookie: "BETKING",
      tgtCode: "BK-47A1B",
      matches: 3,
      totalOdds: "4.20x",
      timeAgo: "25 mins ago"
    },
    {
      srcBookie: "BETANO",
      srcCode: "BT-33D81",
      tgtBookie: "MSPORT",
      tgtCode: "MS-88190",
      matches: 5,
      totalOdds: "12.40x",
      timeAgo: "41 mins ago"
    },
    {
      srcBookie: "1XBET",
      srcCode: "1XB-7729C",
      tgtBookie: "SPORTYBET",
      tgtCode: "SB-10294",
      matches: 3,
      totalOdds: "3.95x",
      timeAgo: "1 hour ago"
    },
    {
      srcBookie: "MELBET",
      srcCode: "ML-6510A",
      tgtBookie: "PARIPESA",
      tgtCode: "PP-33984",
      matches: 6,
      totalOdds: "18.50x",
      timeAgo: "2 hours ago"
    },
    {
      srcBookie: "BETKING",
      srcCode: "BK-99120",
      tgtBookie: "BET9JA",
      tgtCode: "B9J-22849",
      matches: 4,
      totalOdds: "5.70x",
      timeAgo: "3 hours ago"
    }
  ];

  if (!window.recentConversionsList || window.recentConversionsList.length === 0) {
    window.recentConversionsList = defaultConversions;
  }

  grid.innerHTML = window.recentConversionsList.map(item => `
    <div class="recent-card">
      <div class="recent-card-row">
        <span>⚡ Converted Ticket</span>
        <span style="color: var(--text-muted);">${item.timeAgo}</span>
      </div>
      <div class="recent-card-code-flow">
        <div class="recent-card-code-block">
          <span class="recent-card-bookie">${item.srcBookie}</span>
          <span class="recent-card-code">${item.srcCode}</span>
        </div>
        <div class="recent-card-arrow">➔</div>
        <div class="recent-card-code-block" style="text-align: right;">
          <span class="recent-card-bookie" style="color: var(--secondary); border-color: rgba(16,185,129,0.3);">${item.tgtBookie}</span>
          <span class="recent-card-code" style="color: #10b981;">${item.tgtCode}</span>
        </div>
      </div>
      <div class="recent-card-footer">
        <span>${item.matches} Matches (${item.totalOdds})</span>
        <div style="display: flex; gap: 6px;">
          <button class="recent-card-load-btn" onclick="loadRecentConversion('${item.srcCode}')">Load</button>
          <button class="recent-card-load-btn" style="color: #10b981; font-weight: 700;" onclick="placeBetOnBookmaker('${item.tgtBookie}', '${item.tgtCode}')">🚀 Bet</button>
          <button class="recent-card-load-btn" style="color: var(--text-muted);" onclick="navigator.clipboard.writeText('${item.tgtCode}'); showAppNotification('📋 Code copied: ${item.tgtCode}');">Copy</button>
        </div>
      </div>
    </div>
  `).join("");
}

function loadRecentConversion(srcCode) {
  const inputEl = document.getElementById("betcode-src-code") || document.getElementById("paddi-src-code");
  if (inputEl) {
    inputEl.value = srcCode;
    inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    convertBetSlipCode();
  }
}

window.renderRecentConvertedSlips = renderRecentConvertedSlips;
window.loadRecentConversion = loadRecentConversion;

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

// Render BetMines Style Date Picker Bar
// Render BetMines Style Dynamic Date & Live Selector Bar
function renderBetMinesDateBar() {
  const container = document.getElementById("betmines-date-bar-container");
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
        <div class="date-item active" onclick="selectBetMinesDate('${d.id}')">
          <span class="day-num">${dayNum}</span>
          <span class="day-name">${labelText}</span>
        </div>
      `;
    } else {
      return `
        <div class="date-item" onclick="selectBetMinesDate('${d.id}')">
          <span class="day-num">${dayNum}</span>
        </div>
      `;
    }
  }).join("");

  container.innerHTML = `
    <div class="betmines-date-bar">
      <div class="live-btn ${isLiveActive ? 'active' : ''}" onclick="selectBetMinesLive()">
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
function selectBetMinesDate(dateId) {
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

  renderBetMinesDateBar();
  updateFixturesDisplay();
}

// Select "Live" option from date bar
function selectBetMinesLive() {
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

  renderBetMinesDateBar();
  updateFixturesDisplay();
}

// Initialize Application on DOM Load
document.addEventListener("DOMContentLoaded", () => {
  // Initialize state
  window.appState.watchlist = [];
  window.appState.activeScoutMatchId = null;

  // Render initially all matches
  renderMatchCards(MATCH_DATA);
  
  // Render country accordion sidebar directory list
  renderSidebarDirectory();

  // Render universal date & live bar
  renderBetMinesDateBar();

  // Render top leagues sidebar list
  renderSidebarTopLeagues();

  // Render live match scanner
  renderLiveScanner();

  // Render Daily Curated Bets
  renderDailyBets();

  // Initialize standalone Bet Code Converter
  if (typeof initBetCodeConverter === 'function') {
    initBetCodeConverter();
  }
  renderRecentConvertedSlips();

  // Render Hot Trends Ticker
  renderTrends();

  // Render League Stats Ledger
  renderLeagueStatsLedger();

  // Sync backtester visibility state
  syncBacktesterPremiumState();
  
  // Render Value Bet Bot listings
  if (typeof renderValueBetBot === 'function') {
    renderValueBetBot();
  }

  // Render Top Tips Tool listings
  if (typeof renderTopTipsTool === 'function') {
    renderTopTipsTool();
  }

  // Render accuracy chart
  renderAccuracyChart();

  // Render inline leaderboard challenge sidebar
  if (typeof switchInlineLeadTab === 'function') {
    switchInlineLeadTab('monthly');
  }

  // Render inline store shop sidebar
  if (typeof switchInlineStoreTab === 'function') {
    switchInlineStoreTab('shop');
  }

  // Render inline user hub sidebar
  if (typeof switchInlineUserTab === 'function') {
    switchInlineUserTab('profile');
  }

  // Initialize advanced filter sub-markets options
  if (typeof onFilterMarketChange === 'function') {
    onFilterMarketChange();
  }

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
  startLiveAlertsScanner();

  // Initialize the standalone live scanner
  if (typeof renderLiveScanner === 'function') {
    renderLiveScanner();
  }

  // Programmatically trigger the default active tool tab to ensure layout sync
  if (typeof switchTool === 'function') {
    const defaultTab = document.querySelector(`#betmines-tools .tabs-container > .tab-btn[onclick*="machine"]`);
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
    const suiteSec = document.getElementById("betmines-tools");
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
  // Showcase match-1 (Arsenal vs Man City) inside modal
  openScoutModal("match-1");
}

function unlockPremiumPlanLigue2(leagueName, btn) {
  unlockPremiumPlan();
  const activeBtn = document.querySelector("#sidebar-accordion-list .sidebar-league-btn.active");
  if (activeBtn) {
    activeBtn.click();
  }
}

// -------------------------------------------------------------
// BETMINES ADVANCED FEATURE SYSTEM (COMPLETING THE OS ROADMAP)
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
    suiteTitle: 'BetMines Betting Suite',
    scoutChatTitle: 'AI Match Scout Briefing',
  },
  fr: {
    heroTitle: 'Pronostics Football Nouvelle Génération par IA',
    scoutBtn: 'Demander à Scout',
    proBtn: 'Rejoindre Pro',
    dashboardTitle: 'Tableau des Matchs',
    suiteTitle: 'Suite de Paris BetMines',
    scoutChatTitle: 'Briefing IA de Match',
  },
  it: {
    heroTitle: 'Pronostici Calcio di Nuova Generazione con IA',
    scoutBtn: 'Chiedi a Scout',
    proBtn: 'Entra in Pro',
    dashboardTitle: 'Pannello Partite',
    suiteTitle: 'Suite Scommesse BetMines',
    scoutChatTitle: 'Briefing Match Scout IA',
  },
  es: {
    heroTitle: 'Predicciones de Fútbol de Última Generación con IA',
    scoutBtn: 'Preguntar a Scout',
    proBtn: 'Unirse a Pro',
    dashboardTitle: 'Panel de Partidos',
    suiteTitle: 'Suite de Apuestas BetMines',
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

  const suiteTitleEl = document.querySelector("#betmines-tools h3");
  if (suiteTitleEl) {
    suiteTitleEl.innerText = trans.suiteTitle;
  }

  showAppNotification(`Language switched to: ${lang.toUpperCase()}`);
}

// 3. Interactive Punter Tip Submission Flow
function openModalSubmitTip() {
  const matchId = window.appState.activeScoutMatchId;
  if (!matchId) {
    showAppNotification("Please select a specific fixture card first.");
    return;
  }
  
  const match = MATCH_DATA.find(m => m.id === matchId);
  if (!match) return;

  const tipModal = document.getElementById("submit-tip-modal");
  const detailsEl = document.getElementById("tip-modal-match-details");
  if (tipModal && detailsEl) {
    detailsEl.innerText = `${match.homeTeam.name} vs ${match.awayTeam.name}`;
    tipModal.classList.add("active");
  }
}

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
function sendScoutMessage() {
  const input = document.getElementById("scout-chat-input");
  const chatBody = document.getElementById("scout-chat-body");
  if (!input || !chatBody || input.value.trim() === "") return;

  const userText = input.value.trim();
  input.value = "";

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

  // Delay simulation (1.2s)
  setTimeout(() => {
    typingIndicator.remove();

    const responseBubble = document.createElement("div");
    responseBubble.className = "chat-bubble scout";

    const lowerText = userText.toLowerCase();
    const matchId = window.appState.activeScoutMatchId;
    const clubName = window.appState.activeScoutClubName;

    // --- PRIORITY 1: SELECTION / ACCUMULATOR / TICKET GENERATION ---
    if (lowerText.includes("40") || lowerText.includes("ticket") || lowerText.includes("select") || lowerText.includes("acc") || lowerText.includes("pick") || lowerText.includes("generate") || lowerText.includes("slip") || lowerText.includes("build") || lowerText.includes("multibet") || lowerText.includes("accumulator")) {
      let count = 40;
      const matchNum = lowerText.match(/\b([3-9]|[1-3][0-9]|40)\b/);
      if (matchNum) count = parseInt(matchNum[1]);

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

function quickPromptScout(text) {
  const modal = document.getElementById("scout-modal");
  if (!modal || !modal.classList.contains("active")) {
    openGeneralScout();
  }
  setTimeout(() => {
    const el = document.getElementById("scout-chat-input");
    if (el) {
      el.value = text;
      sendScoutMessage();
    }
  }, 300);
}

function triggerHeroScoutPrompt() {
  const heroInput = document.getElementById("hero-scout-input");
  if (!heroInput || !heroInput.value.trim()) return;

  const text = heroInput.value.trim();
  heroInput.value = "";

  openGeneralScout();

  setTimeout(() => {
    const scoutInput = document.getElementById("scout-chat-input");
    if (scoutInput) {
      scoutInput.value = text;
      sendScoutMessage();
    }
  }, 350);
}

window.quickPromptScout = quickPromptScout;
window.triggerHeroScoutPrompt = triggerHeroScoutPrompt;
window.selectBetMinesDate = selectBetMinesDate;
window.showAppNotificationImpl = showAppNotification;

// Add CSS keyframe animation for the Pro activation notification
const style = document.createElement("style");
style.innerHTML = `
  @keyframes slideInUp {
    from {
      transform: translateY(100%) scale(0.9);
      opacity: 0;
    }
    to {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);



// Sync Strategy Backtester visibility with premium unlocked state
function syncBacktesterPremiumState() {
  const overlay = document.getElementById("backtester-premium-overlay");
  const activeModule = document.getElementById("backtester-active-module");
  if (!activeModule) return;

  if (overlay) {
    overlay.style.display = "none";
  }
  activeModule.style.display = "grid";

  // Auto-run simulation output if metrics are not populated yet
  const yieldEl = document.getElementById("bt-yield-val");
  if (yieldEl && (yieldEl.innerText === "--" || yieldEl.innerText === "")) {
    if (typeof runBacktestSimulation === 'function') {
      runBacktestSimulation();
    }
  }
}

// Update odds range text val on slider input
window.updateOddsSliderVal = function updateOddsSliderVal(val) {
  const label = document.getElementById("odds-range-val");
  if (label) {
    label.innerText = `1.20 - ${parseFloat(val).toFixed(2)}`;
  }
};

// Update probability range text val on slider input
window.updateProbSliderVal = function updateProbSliderVal(val) {
  const label = document.getElementById("prob-range-val");
  if (label) {
    label.innerText = `[${val}% - 100%]`;
  }
};

// BetMines Machine slip generation logic
window.generateMachineTicket = function generateMachineTicket() {
  const body = document.getElementById("ticket-body-container");
  const footer = document.getElementById("ticket-footer-container");
  if (!body || !footer) return;

  // Gather criteria safely
  const oddsEl = document.getElementById("odds-max-slider");
  const maxOdds = oddsEl ? parseFloat(oddsEl.value) || 2.40 : 2.40;

  const countEl = document.getElementById("machine-match-count");
  const count = countEl ? parseInt(countEl.value) || 5 : 5;
  
  // Gather user selected markets
  const selectedMarketEls = document.querySelectorAll(".form-checkbox-group .checkbox-card.selected span");
  const userMarkets = Array.from(selectedMarketEls).map(el => el.innerText.trim());

  let availableMatches = [...(typeof MATCH_DATA !== 'undefined' ? MATCH_DATA : window.MATCH_DATA || [])];
  
  // Fallback match dataset if MATCH_DATA is loading
  if (availableMatches.length === 0) {
    availableMatches = [
      { homeTeam: { name: "Arsenal", logo: "🔴" }, awayTeam: { name: "Man City", logo: "🔵" }, league: "Premier League", leagueEmoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", predictions: { home: 45, away: 35 } },
      { homeTeam: { name: "Real Madrid", logo: "⚪" }, awayTeam: { name: "Barcelona", logo: "🔵🔴" }, league: "La Liga", leagueEmoji: "🇪🇸", predictions: { home: 50, away: 30 } },
      { homeTeam: { name: "Bayern Munich", logo: "🔴" }, awayTeam: { name: "Dortmund", logo: "🟡" }, league: "Bundesliga", leagueEmoji: "🇩🇪", predictions: { home: 55, away: 25 } },
      { homeTeam: { name: "Inter Milan", logo: "🔵" }, awayTeam: { name: "Juventus", logo: "⚪" }, league: "Serie A", leagueEmoji: "🇮🇹", predictions: { home: 42, away: 38 } },
      { homeTeam: { name: "PSG", logo: "🔵" }, awayTeam: { name: "Marseille", logo: "⚪" }, league: "Ligue 1", leagueEmoji: "🇫🇷", predictions: { home: 60, away: 20 } },
      { homeTeam: { name: "Liverpool", logo: "🔴" }, awayTeam: { name: "Chelsea", logo: "🔵" }, league: "Premier League", leagueEmoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", predictions: { home: 48, away: 32 } }
    ];
  }

  // Shuffle available matches
  for (let i = availableMatches.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [availableMatches[i], availableMatches[j]] = [availableMatches[j], availableMatches[i]];
  }

  // Draw target selections matching exact requested count
  let combinedOdds = 1.0;
  body.innerHTML = "";
  const ticketSelections = [];

  for (let i = 0; i < count; i++) {
    const match = availableMatches[i % availableMatches.length];
    const homeName = (match.homeTeam && match.homeTeam.name) || match.home || "Home Team";
    const awayName = (match.awayTeam && match.awayTeam.name) || match.away || "Away Team";
    const leagueName = match.league || "League";
    const leagueEmoji = match.leagueEmoji || "⚽";

    const homeProb = (match.predictions && match.predictions.home) || 45;
    const awayProb = (match.predictions && match.predictions.away) || 30;

    // Choose tip from user selected markets or fall back to defaults
    let tip = "Over 1.5 Goals";
    if (userMarkets.length > 0) {
      tip = userMarkets[i % userMarkets.length];
    } else {
      if (i % 3 === 0) tip = "Over 1.5 Goals";
      else if (i % 3 === 1) tip = homeProb > awayProb ? `${homeName} Win` : `${awayName} Win`;
      else tip = "Both Teams to Score";
    }

    // Generate random odds within bounds [1.25, maxOdds]
    let baseOdds = 1.25 + (Math.random() * (Math.min(maxOdds, 3.50) - 1.25));
    if (baseOdds > maxOdds) baseOdds = maxOdds;
    if (baseOdds < 1.15) baseOdds = 1.15;
    baseOdds = parseFloat(baseOdds.toFixed(2));

    combinedOdds *= baseOdds;

    ticketSelections.push({
      fixture: `${homeName} vs ${awayName}`,
      league: leagueName,
      market: tip,
      prediction: tip,
      sourceOdds: baseOdds,
      targetOdds: parseFloat((baseOdds * (1.02 + Math.random() * 0.04)).toFixed(2))
    });

    const row = document.createElement("div");
    row.className = "ticket-row";
    row.innerHTML = `
      <div>
        <div style="font-weight: 700; color: var(--text-primary);">${homeName} - ${awayName} ${i >= availableMatches.length ? `<span style="font-size:0.65rem; color:var(--text-muted);">(Match #${i + 1})</span>` : ''}</div>
        <div style="font-size: 0.75rem; color: var(--primary); font-weight: 600; margin-top: 2px;">
          ${leagueEmoji} ${leagueName} • Market: <b>${tip}</b>
        </div>
      </div>
      <div style="font-family: var(--font-display); font-weight: 700; color: var(--secondary); font-size: 1rem;">
        @${baseOdds.toFixed(2)}
      </div>
    `;

    body.appendChild(row);
  }

  // Generate fresh unique booking code and sync both displays
  const newBookingCode = "BM-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  
  // Cache selections in global cache so converter keeps exact same count!
  window.generatedTicketsCache = window.generatedTicketsCache || {};
  window.generatedTicketsCache[newBookingCode] = {
    selections: ticketSelections
  };

  const bookingCodeEl = document.getElementById("ticket-booking-code");
  const engineSourceEl = document.getElementById("engine-source-code");

  if (bookingCodeEl) bookingCodeEl.innerText = newBookingCode;
  if (engineSourceEl) engineSourceEl.innerText = newBookingCode;

  // Render combined summary
  const totalOddsEl = document.getElementById("ticket-total-odds");
  const totalReturnEl = document.getElementById("ticket-total-return");

  if (totalOddsEl) {
    totalOddsEl.innerText = `@${combinedOdds.toFixed(2)}`;
  }
  if (totalReturnEl) {
    totalReturnEl.innerText = `$${(10 * combinedOdds).toFixed(2)}`;
  }
  const engineCard = document.getElementById("engine-card-container");
  if (engineCard) {
    engineCard.style.display = "flex";
  }
}

// Copy top card booking code
function copyGeneratedTicketCode() {
  const el = document.getElementById("ticket-booking-code");
  if (!el) return;
  const code = el.innerText.trim();
  if (navigator.clipboard) {
    navigator.clipboard.writeText(code).then(() => {
      showAppNotification(`📋 Booking code copied: ${code}`);
    }).catch(() => {
      showAppNotification(`📋 Booking code: ${code}`);
    });
  } else {
    showAppNotification(`📋 Booking code: ${code}`);
  }
}

// Copy engine source machine ticket code
function copyEngineSourceCode() {
  const el = document.getElementById("engine-source-code");
  if (!el) return;
  const code = el.innerText.trim();
  if (navigator.clipboard) {
    navigator.clipboard.writeText(code).then(() => {
      showAppNotification(`📋 Machine ticket code copied: ${code}`);
    }).catch(() => {
      showAppNotification(`📋 Machine ticket code: ${code}`);
    });
  } else {
    showAppNotification(`📋 Machine ticket code: ${code}`);
  }
}

// Copy engine converted target ticket code
function copyEngineTargetCode() {
  const el = document.getElementById("engine-target-code");
  if (!el) return;
  const code = el.innerText.trim();
  if (navigator.clipboard) {
    navigator.clipboard.writeText(code).then(() => {
      showAppNotification(`📋 Converted ticket code copied: ${code}`);
    }).catch(() => {
      showAppNotification(`📋 Converted ticket code: ${code}`);
    });
  } else {
    showAppNotification(`📋 Converted ticket code: ${code}`);
  }
}

// Run Multi-Bookmaker Engine ticket conversion
function runEngineConversion() {
  const sourceEl = document.getElementById("engine-source-code");
  const targetSelect = document.getElementById("engine-target-select");
  const outputBox = document.getElementById("engine-output-box");
  const targetNameEl = document.getElementById("engine-target-name");
  const targetCodeEl = document.getElementById("engine-target-code");
  const detailsEl = document.getElementById("engine-converted-details");

  if (!sourceEl || !targetSelect || !outputBox) return;

  const sourceCode = sourceEl.innerText.trim();
  const targetVal = targetSelect.value;
  const targetText = targetSelect.options[targetSelect.selectedIndex]?.text || targetVal;

  const bookieCleanId = targetVal.split(":")[0];
  const prefixMap = {
    '1xbet': '1XB', bet9ja: 'B9J', sportybet: 'SB', betking: 'BK',
    msport: 'MS', betano: 'BT', betway: 'BW', melbet: 'ML', megapari: 'MP',
    betwinner: 'BWN', paripesa: 'PP', '1xbit': '1XB', '22bet': '22B', '888starz': '888'
  };
  const prefix = prefixMap[bookieCleanId] || bookieCleanId.slice(0, 3).toUpperCase();
  const convertedCode = `${prefix}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  if (targetNameEl) targetNameEl.innerText = targetText;
  if (targetCodeEl) targetCodeEl.innerText = convertedCode;

  if (detailsEl) {
    detailsEl.innerHTML = `
      <div style="font-weight: 700; color: var(--text-primary); font-size: 0.8rem;">Converted Selection Summary (Source: ${sourceCode}):</div>
      <div style="display: flex; flex-direction: column; gap: 4px; color: var(--text-secondary);">
        <div>• Selection 1: ⚽ Home Win / Over 1.5 Goals — <b>Matched (@1.45)</b></div>
        <div>• Selection 2: ⚽ Both Teams To Score — <b>Matched (@1.65)</b></div>
      </div>
    `;
  }

  outputBox.style.display = "block";
  showAppNotification(`⚡ Ticket ${sourceCode} converted to ${targetText}: ${convertedCode}`);
}

// Run Advanced Database Filter
function runAdvancedFilters() {
  const container = document.getElementById("filter-output-container");
  if (!container) return;

  const selectedLeague = document.getElementById("filt-league-select").value;
  const minWin = parseInt(document.getElementById("filt-win-slider").value);
  const minConf = parseInt(document.getElementById("filt-conf-slider").value);

  const minOdds = parseFloat(document.getElementById("filt-odds-min").value) || 1.0;
  const maxOdds = parseFloat(document.getElementById("filt-odds-max").value) || 99.0;

  const minForm = parseInt(document.getElementById("filt-form-slider").value) || 0;
  const minAvgGoalsScored = parseFloat(document.getElementById("filt-avg-goals-scored").value) || 0.0;
  const maxAvgGoalsConceded = parseFloat(document.getElementById("filt-avg-goals-conceded").value) || 99.0;
  
  const minXG = parseFloat(document.getElementById("filt-xg-min").value) || 0.0;
  const minCorners = parseFloat(document.getElementById("filt-corners-min").value) || 0.0;

  const market = document.getElementById("filt-market-select").value;
  const submarket = document.getElementById("filt-submarket-select").value;

  container.innerHTML = "";

  const filtered = MATCH_DATA.filter(match => {
    // 1. League Filter
    if (selectedLeague !== 'all' && match.league !== selectedLeague) return false;

    // 2. Win probability confidence filter
    const maxProb = Math.max(match.predictions.home, match.predictions.draw, match.predictions.away);
    if (maxProb < minWin) return false;

    // 3. Confidence margin filter
    if (match.confidenceVal < minConf) return false;

    // Deterministic stats seed based on team names
    const hashStr = (match.homeTeam.name + match.awayTeam.name);
    let hash = 0;
    for (let i = 0; i < hashStr.length; i++) {
      hash = hashStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    const seed = Math.abs(hash);

    // Mock unique stats matching database fields
    const avgScored = parseFloat((1.0 + (seed % 19) * 0.1).toFixed(1));
    const avgConceded = parseFloat((0.6 + (Math.floor(seed / 4) % 17) * 0.1).toFixed(1));
    const avgXG = parseFloat((0.8 + (Math.floor(seed / 16) % 18) * 0.1).toFixed(1));
    const corners = parseFloat((7.5 + (Math.floor(seed / 64) % 9) * 0.5).toFixed(1));

    // 4. Odds limits filter
    let mockOdds = 1.80;
    if (market === '1x2') {
      if (submarket === 'home') mockOdds = parseFloat((1.4 + (match.predictions.away / 100) * 2.0).toFixed(2));
      else if (submarket === 'draw') mockOdds = parseFloat((3.0 + (match.predictions.draw / 100) * 1.5).toFixed(2));
      else mockOdds = parseFloat((1.4 + (match.predictions.home / 100) * 2.0).toFixed(2));
    } else if (market === 'goals') {
      if (submarket === 'over15') mockOdds = 1.30;
      else if (submarket === 'over25') mockOdds = 1.85;
      else if (submarket === 'over35') mockOdds = 3.10;
      else if (submarket === 'under25') mockOdds = 1.95;
      else mockOdds = 3.40;
    } else if (market === 'btts') {
      mockOdds = submarket === 'yes' ? 1.75 : 2.10;
    } else if (market === 'double_chance') {
      mockOdds = 1.35;
    } else if (market === 'corners') {
      mockOdds = submarket === 'over85' ? 1.60 : submarket === 'over95' ? 2.10 : 2.80;
    } else {
      mockOdds = parseFloat((1.3 + (match.confidenceVal % 7) * 0.15).toFixed(2));
    }

    if (mockOdds < minOdds || mockOdds > maxOdds) return false;

    // 5. Team Form filter (average of home and away form)
    const homeFormVal = match.homeTeam.form ? match.homeTeam.form.reduce((sum, val) => sum + (val === 'W' ? 20 : val === 'D' ? 10 : 0), 0) : 60;
    const awayFormVal = match.awayTeam.form ? match.awayTeam.form.reduce((sum, val) => sum + (val === 'W' ? 20 : val === 'D' ? 10 : 0), 0) : 50;
    const avgForm = Math.round((homeFormVal + awayFormVal) / 2);
    if (avgForm < minForm) return false;

    // 6. Avg goals scored/conceded filter
    if (avgScored < minAvgGoalsScored) return false;
    if (avgConceded > maxAvgGoalsConceded) return false;

    // 7. Expected goals (xG) filter
    if (avgXG < minXG) return false;

    // 8. Total corners filter
    if (corners < minCorners) return false;

    // 9. Specific Market filter matches
    if (market !== 'all') {
      if (market === '1x2') {
        const maxProb = Math.max(match.predictions.home, match.predictions.draw, match.predictions.away);
        if (submarket === 'home' && (maxProb !== match.predictions.home || match.predictions.home < 40)) return false;
        if (submarket === 'draw' && (maxProb !== match.predictions.draw)) return false;
        if (submarket === 'away' && (maxProb !== match.predictions.away || match.predictions.away < 40)) return false;
      } else if (market === 'goals') {
        if (submarket === 'over15' && !match.topTips?.includes('uo15')) return false;
        if (submarket === 'over25' && match.topTips?.includes('uo35')) return false;
        if (submarket === 'over35' && !match.topTips?.includes('uo35') && !match.topTips?.includes('uo15')) return false; 
        if (submarket === 'under25' && !match.topTips?.includes('uo35')) return false;
        if (submarket === 'under15' && !match.topTips?.includes('uoht15')) return false;
      } else if (market === 'btts') {
        const hasBTTS = match.topTips?.includes('btts2h') || (match.predictions.home > 40 && match.predictions.away > 25);
        if (submarket === 'yes' && !hasBTTS) return false;
        if (submarket === 'no' && hasBTTS) return false;
      } else if (market === 'double_chance') {
        if (submarket === '1x' && match.predictions.home < 35) return false;
        if (submarket === 'x2' && match.predictions.away < 35) return false;
        if (submarket === '12' && match.predictions.draw > 28) return false;
      } else if (market === 'corners') {
        if (submarket === 'over85' && corners < 8.5) return false;
        if (submarket === 'over95' && corners < 9.5) return false;
        if (submarket === 'over105' && corners < 10.5) return false;
      }
    }

    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: var(--text-muted); font-size: 0.85rem; width: 100%; grid-column: 1 / -1;">
        No fixtures found matching these parameters in the ledger.
      </div>
    `;
    return;
  }

  filtered.forEach(match => {
    const isLocked = match.isPremium && !window.appState.premiumUnlocked;
    const item = document.createElement("div");
    item.className = "match-card";
    
    // Deterministic stats seed based on team names
    const hashStr = (match.homeTeam.name + match.awayTeam.name);
    let hash = 0;
    for (let i = 0; i < hashStr.length; i++) {
      hash = hashStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    const seed = Math.abs(hash);

    const avgScored = parseFloat((1.0 + (seed % 19) * 0.1).toFixed(1));
    const avgConceded = parseFloat((0.6 + (Math.floor(seed / 4) % 17) * 0.1).toFixed(1));
    const avgXG = parseFloat((0.8 + (Math.floor(seed / 16) % 18) * 0.1).toFixed(1));
    const corners = parseFloat((7.5 + (Math.floor(seed / 64) % 9) * 0.5).toFixed(1));

    const homeFormVal = match.homeTeam.form ? match.homeTeam.form.reduce((sum, val) => sum + (val === 'W' ? 20 : val === 'D' ? 10 : 0), 0) : 60;
    const awayFormVal = match.awayTeam.form ? match.awayTeam.form.reduce((sum, val) => sum + (val === 'W' ? 20 : val === 'D' ? 10 : 0), 0) : 50;
    const avgForm = Math.round((homeFormVal + awayFormVal) / 2);

    let mockOdds = 1.80;
    let marketTip = "";
    if (market === 'all') {
      const maxProb = Math.max(match.predictions.home, match.predictions.draw, match.predictions.away);
      if (maxProb === match.predictions.home) marketTip = "Home Win (1)";
      else if (maxProb === match.predictions.away) marketTip = "Away Win (2)";
      else marketTip = "Draw (X)";
      mockOdds = parseFloat((1.3 + (match.confidenceVal % 7) * 0.15).toFixed(2));
    } else if (market === '1x2') {
      if (submarket === 'home') { marketTip = "Home Win (1)"; mockOdds = parseFloat((1.4 + (match.predictions.away / 100) * 2.0).toFixed(2)); }
      else if (submarket === 'draw') { marketTip = "Draw (X)"; mockOdds = parseFloat((3.0 + (match.predictions.draw / 100) * 1.5).toFixed(2)); }
      else { marketTip = "Away Win (2)"; mockOdds = parseFloat((1.4 + (match.predictions.home / 100) * 2.0).toFixed(2)); }
    } else if (market === 'goals') {
      if (submarket === 'over15') { marketTip = "Over 1.5 Goals"; mockOdds = 1.30; }
      else if (submarket === 'over25') { marketTip = "Over 2.5 Goals"; mockOdds = 1.85; }
      else if (submarket === 'over35') { marketTip = "Over 3.5 Goals"; mockOdds = 3.10; }
      else if (submarket === 'under25') { marketTip = "Under 2.5 Goals"; mockOdds = 1.95; }
      else { marketTip = "Under 1.5 Goals"; mockOdds = 3.40; }
    } else if (market === 'btts') {
      if (submarket === 'yes') { marketTip = "BTTS - Yes"; mockOdds = 1.75; }
      else { marketTip = "BTTS - No"; mockOdds = 2.10; }
    } else if (market === 'double_chance') {
      if (submarket === '1x') { marketTip = "Home/Draw (1X)"; mockOdds = 1.35; }
      else if (submarket === 'x2') { marketTip = "Away/Draw (X2)"; mockOdds = 1.35; }
      else { marketTip = "Home/Away (12)"; mockOdds = 1.35; }
    } else if (market === 'corners') {
      if (submarket === 'over85') { marketTip = "Corners > 8.5"; mockOdds = 1.60; }
      else if (submarket === 'over95') { marketTip = "Corners > 9.5"; mockOdds = 2.10; }
      else { marketTip = "Corners > 10.5"; mockOdds = 2.80; }
    }

    item.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <div>
          <span style="font-size: 0.75rem; color: var(--primary); font-weight: 700; display: block; margin-bottom: 2px;">
            ${match.leagueEmoji} ${match.league}
          </span>
          <span style="font-weight: 700; font-size: 0.9rem;">
            ${match.homeTeam.name} vs ${match.awayTeam.name}
          </span>
        </div>
        <div style="text-align: right;">
          <span style="font-size: 0.7rem; color: var(--text-muted); display: block;">Confidence</span>
          <span style="color: var(--secondary); font-weight: 700; font-family: var(--font-display);">${match.confidenceVal}%</span>
        </div>
      </div>

      <!-- Statistical Parameters Badges -->
      <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; border-top: 1px dashed var(--border-color); padding-top: 8px;">
        <span style="font-size: 0.68rem; padding: 2px 6px; background: rgba(26,104,219,0.06); border: 1px solid rgba(26,104,219,0.12); border-radius: var(--radius-sm); color: var(--primary); font-weight: 600;">
          📈 Form: ${avgForm}%
        </span>
        <span style="font-size: 0.68rem; padding: 2px 6px; background: rgba(16,185,129,0.06); border: 1px solid rgba(16,185,129,0.12); border-radius: var(--radius-sm); color: var(--secondary); font-weight: 600;">
          ⚽ Goals: ${avgScored.toFixed(1)} / ${avgConceded.toFixed(1)}
        </span>
        <span style="font-size: 0.68rem; padding: 2px 6px; background: rgba(245,158,11,0.06); border: 1px solid rgba(245,158,11,0.12); border-radius: var(--radius-sm); color: var(--accent-gold); font-weight: 600;">
          🧠 xG: ${avgXG.toFixed(1)}
        </span>
        <span style="font-size: 0.68rem; padding: 2px 6px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: var(--radius-sm); color: var(--text-secondary); font-weight: 600;">
          📐 Corners: ${corners}
        </span>
      </div>

      <div style="padding-top: 10px; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; flex-wrap: wrap; gap: 8px;">
        <div>
          <span style="color: var(--text-muted);">Tip:</span> 
          <span style="font-weight: 700; color: var(--text-primary); margin-left: 4px;">${isLocked ? '👑 LOCKED' : marketTip}</span>
        </div>
        <span style="font-weight: 700; color: var(--primary); font-family: var(--font-display);">@${mockOdds.toFixed(2)}</span>
      </div>
    `;
    container.appendChild(item);
  });
}

// Run Monte Carlo strategy backtester simulation
function runBacktestSimulation() {
  const progressWrapper = document.getElementById("bt-progress-wrapper");
  const progressBar = document.getElementById("bt-progress-bar");
  
  if (!progressWrapper || !progressBar) return;

  // Clear current outputs
  document.getElementById("bt-yield-val").innerText = "--";
  document.getElementById("bt-winrate-val").innerText = "--";
  document.getElementById("bt-bets-val").innerText = "--";
  document.getElementById("bt-profit-val").innerText = "--";

  progressWrapper.style.display = "block";
  progressBar.style.width = "0%";

  let progress = 0;
  const interval = setInterval(() => {
    progress += 10;
    progressBar.style.width = `${progress}%`;

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        progressWrapper.style.display = "none";
        
        // Output mock parameters based on selection
        const strategy = document.getElementById("bt-strategy-select").value;
        const period = parseInt(document.getElementById("bt-period-select").value);
        
        let yieldVal = "+14.5%";
        let winrateVal = "76.4%";
        let betsVal = period === 30 ? "112" : (period === 90 ? "340" : "1380");
        let profitVal = period === 30 ? "+$145.00" : (period === 90 ? "+$340.00" : "+$1,380.00");

        if (strategy === 'h2h-wins') {
          yieldVal = "+8.2%";
          winrateVal = "68.5%";
          profitVal = period === 30 ? "+$82.00" : (period === 90 ? "+$246.00" : "+$1,130.00");
        } else if (strategy === 'btts-heavy') {
          yieldVal = "+22.4%";
          winrateVal = "64.2%";
          profitVal = period === 30 ? "+$224.00" : (period === 90 ? "+$672.00" : "+$2,680.00");
        }

        document.getElementById("bt-yield-val").innerText = yieldVal;
        document.getElementById("bt-winrate-val").innerText = winrateVal;
        document.getElementById("bt-bets-val").innerText = betsVal;
        document.getElementById("bt-profit-val").innerText = profitVal;

        // Render dynamic SVG Line Chart
        renderBacktestSVGChart(yieldVal);
      }, 300);
    }
  }, 100);
}

// Telegram connection alert popup
function toggleTelegramAlerts(btn) {
  alert("📢 TELEGRAM SCANNER SYNCED: You will now receive automated in-play alerts for active match signals!");
  btn.innerText = "✓ Synced";
  btn.style.opacity = "0.7";
  btn.style.boxShadow = "none";
  btn.disabled = true;
}

// Watchlist monitoring toggler
function toggleWatchlist(matchId, event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }

  const list = window.appState.watchlist;
  const index = list.indexOf(matchId);

  if (index > -1) {
    list.splice(index, 1);
  } else {
    list.push(matchId);
  }

  // Update watchlist count tab badges
  const countBadge = document.getElementById("watchlist-count");
  if (countBadge) {
    countBadge.innerText = list.length;
  }

  // Re-render matching listings to sync star graphics
  const activeTabBtn = document.querySelector("#predictions .tab-btn.active");
  if (activeTabBtn) {
    activeTabBtn.click();
  } else {
    renderMatchCards(MATCH_DATA);
  }
}

// Copy curated odds clipboard warning
function copyDailyTipOdds(odd) {
  alert(`📋 ODDS COPIED: Selection odds @${odd} have been added to your clipboard!`);
}

// Switch active prediction date: yesterday, today, tomorrow
function switchPredictionDate(dateVal, btn) {
  window.appState.activePredictionDate = dateVal;

  if (btn) {
    // Toggle active date buttons styling
    const parent = btn.parentElement;
    if (parent) {
      const buttons = parent.querySelectorAll(".date-btn");
      buttons.forEach(b => {
        b.classList.remove("btn-primary");
        b.classList.add("btn-secondary");
      });
    }
    if (btn.classList) {
      btn.classList.add("btn-primary");
      btn.classList.remove("btn-secondary");
    }
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

  updateFixturesDisplay();
}

// Filter matches by market submenu tabs
function filterMarketSubmenu(marketVal, btn) {
  window.appState.activeMarketSubmenu = marketVal;
  window.appState.activeTopTip = 'all';

  if (btn) {
    const parent = btn.parentElement;
    if (parent) {
      const buttons = parent.querySelectorAll(".tab-btn");
      buttons.forEach(b => b.classList.remove("active"));
    }
    if (btn.classList) btn.classList.add("active");
  }

  updateFixturesDisplay();
}

// Filter matches by specific Top Tips markets
function filterTopTip(topTipVal, btn) {
  window.appState.activeTopTip = topTipVal;
  window.appState.activeMarketSubmenu = 'toptips';

  if (btn) {
    const parent = btn.parentElement;
    if (parent) {
      const buttons = parent.querySelectorAll(".tab-btn");
      buttons.forEach(b => b.classList.remove("active"));
    }
    if (btn.classList) btn.classList.add("active");
  }

  updateFixturesDisplay();
}

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
  if (typeof renderBetMinesDateBar === 'function') {
    renderBetMinesDateBar();
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
  updateFixturesDisplay();

  // Scroll smoothly down to the dashboard
  const target = document.getElementById("predictions");
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
}

// State for the horizontal filter bar
window.barState = {
  date: 'today',
  tip: 'uo15'
};

function updateBarDate(dateVal, btn) {
  window.barState.date = dateVal;
  
  // Update date button active states
  const parent = btn.parentElement;
  const buttons = parent.querySelectorAll(".tab-btn");
  buttons.forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  // Automatically trigger the filter
  triggerTopTipFilter(window.barState.date, window.barState.tip);
}

function applyBarTopTip(tipVal, btn) {
  window.barState.tip = tipVal;

  // Update tip button active states
  const parent = btn.parentElement;
  const buttons = parent.querySelectorAll(".btn");
  buttons.forEach(b => {
    b.classList.remove("btn-primary");
    b.classList.add("btn-secondary");
  });
  btn.classList.remove("btn-secondary");
  btn.classList.add("btn-primary");

  // Automatically trigger the filter
  triggerTopTipFilter(window.barState.date, window.barState.tip);
}

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
    if (typeof renderBetMinesDateBar === 'function') {
      renderBetMinesDateBar();
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
    if (typeof renderBetMinesDateBar === 'function') {
      renderBetMinesDateBar();
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

function populateCalSelectors() {
  const dateSelect = document.getElementById("cal-date-select");
  const countrySelect = document.getElementById("cal-country-select");
  const leagueSelect = document.getElementById("cal-league-select");
  const teamSelect = document.getElementById("cal-team-select");
  if (!countrySelect || !leagueSelect || !teamSelect) return;

  if (dateSelect) {
    dateSelect.innerHTML = `
      <option value="today">${getOrdinalDate(0)} (Today)</option>
      <option value="tomorrow">${getOrdinalDate(1)} (Tomorrow)</option>
      <option value="yesterday">${getOrdinalDate(-1)} (Yesterday)</option>
    `;
  }

  // Populate the date button labels in `#bar-date-selector` inside the sidebar
  const barDateContainer = document.getElementById("bar-date-selector");
  if (barDateContainer) {
    const buttons = barDateContainer.querySelectorAll(".tab-btn");
    if (buttons.length >= 3) {
      buttons[0].innerText = `${getOrdinalDate(-1)} (Yesterday)`;
      buttons[1].innerText = `${getOrdinalDate(0)} (Today)`;
      buttons[2].innerText = `${getOrdinalDate(1)} (Tomorrow)`;
    }
  }

  const filtLeagueSelect = document.getElementById("filt-league-select");

  countrySelect.innerHTML = `<option value="all">All Countries</option>`;
  leagueSelect.innerHTML = `<option value="all">All Leagues</option>`;
  if (filtLeagueSelect) {
    filtLeagueSelect.innerHTML = `<option value="all">All Leagues</option>`;
  }
  teamSelect.innerHTML = `<option value="all">All Teams</option>`;

  // Populate countries dynamically from COUNTRY_LEAGUES_DATA
  if (typeof COUNTRY_LEAGUES_DATA !== 'undefined') {
    COUNTRY_LEAGUES_DATA.forEach(item => {
      const opt = document.createElement("option");
      opt.value = item.country;
      opt.innerText = `${item.emoji} ${item.country}`;
      countrySelect.appendChild(opt);
    });
  }

  const leagues = new Set();
  const teams = new Set();

  // Add all leagues from TOP_LEAGUES_DATA
  if (typeof TOP_LEAGUES_DATA !== 'undefined') {
    TOP_LEAGUES_DATA.forEach(l => leagues.add(l.name));
  }

  // Add active leagues from MATCH_DATA
  MATCH_DATA.forEach(match => {
    if (match.league) leagues.add(match.league);
    if (match.homeTeam && match.homeTeam.name) teams.add(match.homeTeam.name);
    if (match.awayTeam && match.awayTeam.name) teams.add(match.awayTeam.name);
  });

  leagues.forEach(l => {
    // Find matching emoji parameter from TOP_LEAGUES_DATA
    let emojiStr = "⚽";
    if (typeof TOP_LEAGUES_DATA !== 'undefined') {
      const found = TOP_LEAGUES_DATA.find(tl => tl.name === l);
      if (found && found.emoji) emojiStr = found.emoji;
    }

    const opt = document.createElement("option");
    opt.value = l;
    opt.innerText = `${emojiStr} ${l}`;
    leagueSelect.appendChild(opt);

    if (filtLeagueSelect) {
      const optFilt = document.createElement("option");
      optFilt.value = l;
      optFilt.innerText = `${emojiStr} ${l}`;
      filtLeagueSelect.appendChild(optFilt);
    }
  });

  teams.forEach(t => {
    const opt = document.createElement("option");
    opt.value = t;
    
    // Fetch custom emblem logo from MATCH_DATA
    let logoStr = "";
    const foundMatch = MATCH_DATA.find(m => (m.homeTeam && m.homeTeam.name === t) || (m.awayTeam && m.awayTeam.name === t));
    if (foundMatch) {
      if (foundMatch.homeTeam && foundMatch.homeTeam.name === t) {
        logoStr = foundMatch.homeTeam.logo || "";
      } else if (foundMatch.awayTeam && foundMatch.awayTeam.name === t) {
        logoStr = foundMatch.awayTeam.logo || "";
      }
    }
    
    opt.innerText = logoStr ? `${logoStr} ${t}` : t;
    teamSelect.appendChild(opt);
  });
}

function runCalFilter() {
  const dateVal = document.getElementById("cal-date-select").value;
  const countryVal = document.getElementById("cal-country-select").value;
  const leagueVal = document.getElementById("cal-league-select").value;
  const teamVal = document.getElementById("cal-team-select").value;

  window.appState.activePredictionDate = dateVal;
  window.appState.calCountry = countryVal;
  window.appState.calLeague = leagueVal;
  window.appState.calTeam = teamVal;

  // Sync date buttons in DOM
  if (typeof renderBetMinesDateBar === 'function') {
    renderBetMinesDateBar();
  }

  // Update the fixtures display
  updateFixturesDisplay();

  // Scroll down smoothly to matches section
  const target = document.getElementById("predictions");
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
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
  if (typeof renderBetMinesDateBar === 'function') {
    renderBetMinesDateBar();
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

  // 3. Market Submenu Filter
  const marketVal = window.appState.activeMarketSubmenu || 'all';
  if (marketVal === 'toptips') {
    // Filter by Top Tips Classification
    const targetTopTip = window.appState.activeTopTip || 'all';
    if (targetTopTip !== 'all') {
      filtered = filtered.filter(m => {
        if (m.topTips && m.topTips.includes(targetTopTip)) return true;
        const tip = getMatchTip(m).toLowerCase();
        if (targetTopTip === 'dnb') return tip.includes("dnb") || tip.includes("draw no bet");
        if (targetTopTip === 'bttsht') return tip.includes("btts") && tip.includes("ht");
        if (targetTopTip === 'btts2h') return tip.includes("btts") && tip.includes("2h");
        if (targetTopTip.startsWith('mg')) return tip.includes("goals") || tip.includes("multi");
        if (targetTopTip.startsWith('eg')) return tip.includes("goal");
        if (targetTopTip.startsWith('combo')) return tip.includes("+") || tip.includes("combo") || tip.includes("&");
        if (targetTopTip.startsWith('htft')) return tip.includes("/") || tip.includes("ht/ft");
        if (targetTopTip.startsWith('cards') || targetTopTip === 'redcard') return tip.includes("card") || tip.includes("yellow") || tip.includes("red");
        if (targetTopTip === 'penalty') return tip.includes("penalty");
        if (targetTopTip.startsWith('ah')) return tip.includes("handicap") || tip.includes("-") || tip.includes("+");
        return true;
      });
    }
  } else if (marketVal !== 'all') {
    filtered = filtered.filter(match => {
      const tip = getMatchTip(match).toLowerCase();
      if (marketVal === '1x2') {
        return tip.includes("win") || tip.includes("draw") || tip.includes("(1)") || tip.includes("(x)") || tip.includes("(2)");
      } else if (marketVal === 'overunder') {
        return tip.includes("over") || tip.includes("under") || tip.includes("goals");
      } else if (marketVal === 'btts') {
        return tip.includes("btts") || tip.includes("both") || tip.includes("score") || tip.includes("gg") || tip.includes("ng");
      } else if (marketVal === 'corners') {
        return tip.includes("corners") || tip.includes("corner");
      } else if (marketVal === 'doublechance') {
        return tip.includes("1x") || tip.includes("x2") || tip.includes("12") || tip.includes("double chance");
      } else if (marketVal === 'dnb') {
        return tip.includes("dnb") || tip.includes("draw no bet");
      } else if (marketVal === 'combo') {
        return tip.includes("combo") || tip.includes("&") || tip.includes("+") || (tip.includes("win") && tip.includes("over"));
      } else if (marketVal === 'htft') {
        return tip.includes("ht/ft") || tip.includes("/") || tip.includes("half time") || tip.includes("win either");
      } else if (marketVal === 'multigoals') {
        return tip.includes("goals") || tip.includes("multi") || tip.includes("exact");
      } else if (marketVal === 'teamspec') {
        return tip.includes("home") || tip.includes("away") || tip.includes("clean sheet") || tip.includes("nil");
      } else if (marketVal === 'cards') {
        return tip.includes("card") || tip.includes("yellow") || tip.includes("red") || tip.includes("booking");
      } else if (marketVal === 'handicap') {
        return tip.includes("handicap") || tip.includes("asian") || tip.includes("+") || tip.includes("-");
      }
      return true;
    });
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

  // Call Live Backend API Server
  const apiBase = window.API_BASE_URL || 'http://localhost:5000/api/v1';
  fetch(`${apiBase}/doctor/audit`, {
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
      link: "https://www.sportybet.com/?tag=betmines"
    },
    leg2: {
      bookieKey: "bet365",
      selection: "Under 2.5 Goals",
      odds: 2.05,
      link: "https://www.bet365.com/?affiliate=betmines"
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
      link: "https://1xbet.com/?tag=betmines"
    },
    leg2: {
      bookieKey: "bet9ja",
      selection: "Draw or Barcelona (X2)",
      odds: 1.85,
      link: "https://www.bet9ja.com/?affiliate=betmines"
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
      link: "https://stake.com/?c=betmines"
    },
    leg2: {
      bookieKey: "betking",
      selection: "BTTS No",
      odds: 2.20,
      link: "https://www.betking.com/?affiliate=betmines"
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
      <span style="color: #10b981; font-weight: 800;">Investment Budget: $${totalStake.toFixed(2)}</span>
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
              Guaranteed Net Profit: <b>+$${profitNet.toFixed(2)}</b> (No Risk)
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
                Stake: <b style="color: #3b82f6;">$${stake1.toFixed(2)}</b> &bull; Payout: <b>$${return1.toFixed(2)}</b>
              </div>
            </div>
            <a href="${deal.leg1.link}" target="_blank" class="btn btn-secondary" style="font-size: 0.72rem; padding: 6px 12px; border: 1px solid var(--brand-royal-blue); color: #ffffff; text-align: center; text-decoration: none; font-weight: 700; display: block;">
              📲 Bet $${stake1.toFixed(2)} on ${b1Info.name}
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
                Stake: <b style="color: #fbbf24;">$${stake2.toFixed(2)}</b> &bull; Payout: <b>$${return2.toFixed(2)}</b>
              </div>
            </div>
            <a href="${deal.leg2.link}" target="_blank" class="btn btn-secondary" style="font-size: 0.72rem; padding: 6px 12px; border: 1px solid #d97706; color: #ffffff; text-align: center; text-decoration: none; font-weight: 700; display: block;">
              📲 Bet $${stake2.toFixed(2)} on ${b2Info.name}
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
try { if (typeof renderBetMinesDateBar === 'function') window.renderBetMinesDateBar = renderBetMinesDateBar; } catch (e) {}
try { if (typeof selectBetMinesDate === 'function') window.selectBetMinesDate = selectBetMinesDate; } catch (e) {}
try { if (typeof selectBetMinesLive === 'function') window.selectBetMinesLive = selectBetMinesLive; } catch (e) {}
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
