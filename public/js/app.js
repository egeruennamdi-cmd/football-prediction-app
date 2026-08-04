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
  if (typeof renderBetMinesDateBar === 'function') renderBetMinesDateBar();

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

  renderBetMinesDateBar();
  updateFixturesDisplay();
}

// Initialize Application on DOM Load
runOnReady(() => {
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
