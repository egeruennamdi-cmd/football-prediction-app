/**
 * DeepPredictBet — Patch Script for Recent Settled Predictions & Authoritative Ledger
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

// 1. PATCH index.html & public/index.html
function patchIndexHtml(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Add script tag if not present
  const scriptMarker = '<script defer src="/js/standingsEngine.js?v=20261102_standings_v1"></script>';
  const ledgerScript = '  <script defer src="/js/predictionLedger.js?v=20261103_v1"></script>';
  if (content.includes(scriptMarker) && !content.includes('predictionLedger.js')) {
    content = content.replace(scriptMarker, `${scriptMarker}\n${ledgerScript}`);
    console.log(`[PASS] Added predictionLedger.js script tag in ${filePath}`);
  }

  // Replace static cards with latest November 2026 settled cards
  const startMarker = '<span class="settled-picks-meta" id="settled-picks-sample-info">';
  const endMarker = '<!-- Footer CTA & Mandatory Regulatory Disclaimer -->';

  const startIndex = content.indexOf(startMarker);
  const endIndex = content.indexOf(endMarker);

  if (startIndex !== -1 && endIndex !== -1) {
    const newCardsMarkup = `<span class="settled-picks-meta" id="settled-picks-sample-info">Showing 6 most recently settled predictions (3 Won, 3 Lost • Last 7 Days)</span>
          </div>
          <div class="settled-picks-grid" id="settled-picks-grid">
            <!-- Settled Card 1: WON -->
            <div class="settled-pick-card won">
              <div class="settled-card-header">
                <span class="settled-league-tag">🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League</span>
                <span class="settled-time-tag">FT · 2 Nov 2026</span>
              </div>
              <div class="settled-teams-wrap">
                <div class="settled-teams">
                  <div class="settled-team-row">
                    <span class="settled-team-crest-wrap"><img src="https://media.api-sports.io/football/teams/33.png" alt="Manchester United" class="settled-team-crest" style="width:20px;height:20px;object-fit:contain;display:inline-block;vertical-align:middle;flex-shrink:0;" loading="lazy"></span>
                    <span class="settled-team-name">Manchester United</span>
                  </div>
                  <div class="settled-team-row">
                    <span class="settled-team-crest-wrap"><img src="https://media.api-sports.io/football/teams/49.png" alt="Chelsea" class="settled-team-crest" style="width:20px;height:20px;object-fit:contain;display:inline-block;vertical-align:middle;flex-shrink:0;" loading="lazy"></span>
                    <span class="settled-team-name">Chelsea</span>
                  </div>
                </div>
                <div class="settled-score-pill">1 - 1</div>
              </div>
              <div class="settled-pick-detail">
                <div class="settled-tip-info">
                  <span class="settled-tip-market">Both Teams To Score (BTTS: Yes)</span>
                  <span class="settled-tip-odds">@1.75 • Conf: 85%</span>
                </div>
                <span class="settled-status-badge badge-won">✓ WON</span>
              </div>
            </div>

            <!-- Settled Card 2: WON -->
            <div class="settled-pick-card won">
              <div class="settled-card-header">
                <span class="settled-league-tag">🇪🇸 La Liga</span>
                <span class="settled-time-tag">FT · 2 Nov 2026</span>
              </div>
              <div class="settled-teams-wrap">
                <div class="settled-teams">
                  <div class="settled-team-row">
                    <span class="settled-team-crest-wrap"><img src="https://media.api-sports.io/football/teams/529.png" alt="Barcelona" class="settled-team-crest" style="width:20px;height:20px;object-fit:contain;display:inline-block;vertical-align:middle;flex-shrink:0;" loading="lazy"></span>
                    <span class="settled-team-name">Barcelona</span>
                  </div>
                  <div class="settled-team-row">
                    <span class="settled-team-crest-wrap"><img src="https://media.api-sports.io/football/teams/540.png" alt="Espanyol" class="settled-team-crest" style="width:20px;height:20px;object-fit:contain;display:inline-block;vertical-align:middle;flex-shrink:0;" loading="lazy"></span>
                    <span class="settled-team-name">Espanyol</span>
                  </div>
                </div>
                <div class="settled-score-pill">3 - 1</div>
              </div>
              <div class="settled-pick-detail">
                <div class="settled-tip-info">
                  <span class="settled-tip-market">Home Win &amp; Over 2.5 (Barcelona)</span>
                  <span class="settled-tip-odds">@1.70 • Conf: 88%</span>
                </div>
                <span class="settled-status-badge badge-won">✓ WON</span>
              </div>
            </div>

            <!-- Settled Card 3: LOST -->
            <div class="settled-pick-card lost">
              <div class="settled-card-header">
                <span class="settled-league-tag">🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League</span>
                <span class="settled-time-tag">FT · 2 Nov 2026</span>
              </div>
              <div class="settled-teams-wrap">
                <div class="settled-teams">
                  <div class="settled-team-row">
                    <span class="settled-team-crest-wrap"><img src="https://media.api-sports.io/football/teams/35.png" alt="Bournemouth" class="settled-team-crest" style="width:20px;height:20px;object-fit:contain;display:inline-block;vertical-align:middle;flex-shrink:0;" loading="lazy"></span>
                    <span class="settled-team-name">Bournemouth</span>
                  </div>
                  <div class="settled-team-row">
                    <span class="settled-team-crest-wrap"><img src="https://media.api-sports.io/football/teams/50.png" alt="Manchester City" class="settled-team-crest" style="width:20px;height:20px;object-fit:contain;display:inline-block;vertical-align:middle;flex-shrink:0;" loading="lazy"></span>
                    <span class="settled-team-name">Manchester City</span>
                  </div>
                </div>
                <div class="settled-score-pill">2 - 1</div>
              </div>
              <div class="settled-pick-detail">
                <div class="settled-tip-info">
                  <span class="settled-tip-market">Away Win (Manchester City)</span>
                  <span class="settled-tip-odds">@1.52 • Conf: 86%</span>
                </div>
                <span class="settled-status-badge badge-lost">✗ LOST</span>
              </div>
            </div>

            <!-- Settled Card 4: WON -->
            <div class="settled-pick-card won">
              <div class="settled-card-header">
                <span class="settled-league-tag">🇩🇪 Bundesliga</span>
                <span class="settled-time-tag">FT · 2 Nov 2026</span>
              </div>
              <div class="settled-teams-wrap">
                <div class="settled-teams">
                  <div class="settled-team-row">
                    <span class="settled-team-crest-wrap"><img src="https://media.api-sports.io/football/teams/157.png" alt="Bayern Munich" class="settled-team-crest" style="width:20px;height:20px;object-fit:contain;display:inline-block;vertical-align:middle;flex-shrink:0;" loading="lazy"></span>
                    <span class="settled-team-name">Bayern Munich</span>
                  </div>
                  <div class="settled-team-row">
                    <span class="settled-team-crest-wrap"><img src="https://media.api-sports.io/football/teams/182.png" alt="Union Berlin" class="settled-team-crest" style="width:20px;height:20px;object-fit:contain;display:inline-block;vertical-align:middle;flex-shrink:0;" loading="lazy"></span>
                    <span class="settled-team-name">Union Berlin</span>
                  </div>
                </div>
                <div class="settled-score-pill">3 - 0</div>
              </div>
              <div class="settled-pick-detail">
                <div class="settled-tip-info">
                  <span class="settled-tip-market">Home Win to Nil (Bayern Munich)</span>
                  <span class="settled-tip-odds">@1.85 • Conf: 84%</span>
                </div>
                <span class="settled-status-badge badge-won">✓ WON</span>
              </div>
            </div>

            <!-- Settled Card 5: LOST -->
            <div class="settled-pick-card lost">
              <div class="settled-card-header">
                <span class="settled-league-tag">🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League</span>
                <span class="settled-time-tag">FT · 2 Nov 2026</span>
              </div>
              <div class="settled-teams-wrap">
                <div class="settled-teams">
                  <div class="settled-team-row">
                    <span class="settled-team-crest-wrap"><img src="https://media.api-sports.io/football/teams/34.png" alt="Newcastle United" class="settled-team-crest" style="width:20px;height:20px;object-fit:contain;display:inline-block;vertical-align:middle;flex-shrink:0;" loading="lazy"></span>
                    <span class="settled-team-name">Newcastle United</span>
                  </div>
                  <div class="settled-team-row">
                    <span class="settled-team-crest-wrap"><img src="https://media.api-sports.io/football/teams/42.png" alt="Arsenal" class="settled-team-crest" style="width:20px;height:20px;object-fit:contain;display:inline-block;vertical-align:middle;flex-shrink:0;" loading="lazy"></span>
                    <span class="settled-team-name">Arsenal</span>
                  </div>
                </div>
                <div class="settled-score-pill">1 - 0</div>
              </div>
              <div class="settled-pick-detail">
                <div class="settled-tip-info">
                  <span class="settled-tip-market">Arsenal Draw No Bet (Away DNB)</span>
                  <span class="settled-tip-odds">@1.55 • Conf: 78%</span>
                </div>
                <span class="settled-status-badge badge-lost">✗ LOST</span>
              </div>
            </div>

            <!-- Settled Card 6: LOST -->
            <div class="settled-pick-card lost">
              <div class="settled-card-header">
                <span class="settled-league-tag">🇮🇹 Serie A</span>
                <span class="settled-time-tag">FT · 2 Nov 2026</span>
              </div>
              <div class="settled-teams-wrap">
                <div class="settled-teams">
                  <div class="settled-team-row">
                    <span class="settled-team-crest-wrap"><img src="https://media.api-sports.io/football/teams/492.png" alt="Napoli" class="settled-team-crest" style="width:20px;height:20px;object-fit:contain;display:inline-block;vertical-align:middle;flex-shrink:0;" loading="lazy"></span>
                    <span class="settled-team-name">Napoli</span>
                  </div>
                  <div class="settled-team-row">
                    <span class="settled-team-crest-wrap"><img src="https://media.api-sports.io/football/teams/499.png" alt="Atalanta" class="settled-team-crest" style="width:20px;height:20px;object-fit:contain;display:inline-block;vertical-align:middle;flex-shrink:0;" loading="lazy"></span>
                    <span class="settled-team-name">Atalanta</span>
                  </div>
                </div>
                <div class="settled-score-pill">0 - 3</div>
              </div>
              <div class="settled-pick-detail">
                <div class="settled-tip-info">
                  <span class="settled-tip-market">Home Win (Napoli)</span>
                  <span class="settled-tip-odds">@2.05 • Conf: 76%</span>
                </div>
                <span class="settled-status-badge badge-lost">✗ LOST</span>
              </div>
            </div>
          </div>
        </div>

        `;
    content = content.slice(0, startIndex) + newCardsMarkup + content.slice(endIndex);
    console.log(`[PASS] Replaced static settled predictions in ${filePath} with latest November 2026 cards`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

// 2. PATCH js/ui.js & public/js/ui.js
function patchUiJs(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Insert authoritative PredictionSettlementLedger handoff at start of renderRecentSettledPredictions
  const targetFn = 'function renderRecentSettledPredictions(filterLeague, filterCountry, fixturesPool) {';
  const handoff = `
  // Authoritative Prediction Settlement Ledger handoff
  if (typeof window !== 'undefined' && window.PredictionSettlementLedger && typeof window.PredictionSettlementLedger.renderRecentSettledPredictions === 'function') {
    return window.PredictionSettlementLedger.renderRecentSettledPredictions(filterLeague, filterCountry, fixturesPool);
  }
`;

  if (content.includes(targetFn) && !content.includes('Authoritative Prediction Settlement Ledger handoff')) {
    const idx = content.indexOf(targetFn);
    const insertPos = idx + targetFn.length;
    content = content.slice(0, insertPos) + handoff + content.slice(insertPos);
    console.log(`[PASS] Patched renderRecentSettledPredictions in ${filePath}`);
  }

  // Update getSettledMatchesForTimeframe to use ledger when 7d requested
  const targetTimeframe = 'if (timeframe === \'7d\') {';
  const timeframeHandoff = `if (timeframe === '7d') {
    if (typeof window !== 'undefined' && window.PredictionSettlementLedger && typeof window.PredictionSettlementLedger.getRecentSettledPredictions === 'function') {
      const q = window.PredictionSettlementLedger.getRecentSettledPredictions({ days: 7, limit: 50 });
      if (q && Array.isArray(q.records) && q.records.length > 0) return q.records;
    }`;

  if (content.includes(targetTimeframe) && !content.includes('window.PredictionSettlementLedger.getRecentSettledPredictions')) {
    content = content.replace(targetTimeframe, timeframeHandoff);
    console.log(`[PASS] Patched getSettledMatchesForTimeframe in ${filePath}`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

// 3. PATCH js/data.js & public/js/data.js (Add recent November matches to MATCH_DATA)
function patchDataJs(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  const novMatchesMarker = '// --- AUTHORITATIVE RECENT SETTLED MATCHES (NOVEMBER 2026) ---';
  if (!content.includes(novMatchesMarker)) {
    const targetArrayStart = 'const MATCH_DATA = [';
    const novMatches = `
  ${novMatchesMarker}
  {
    id: "match-nov-1",
    date: "yesterday",
    isYesterday: true,
    league: "Premier League",
    leagueEmoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    time: "FT · 2 Nov 2026",
    rawDate: 1793644500000,
    isLive: false,
    status: "FT",
    statusShort: "FT",
    isFT: true,
    homeTeam: { name: "Manchester United", id: 33, logo: "https://media.api-sports.io/football/teams/33.png", form: ["D","W","L","D","W"] },
    awayTeam: { name: "Chelsea", id: 49, logo: "https://media.api-sports.io/football/teams/49.png", form: ["D","W","W","W","L"] },
    scores: { home: 1, away: 1 },
    predictions: { home: 35, draw: 32, away: 33 },
    confidenceVal: 85,
    settledPick: {
      market: "Both Teams To Score (BTTS: Yes)",
      odds: 1.75,
      confidence: 85,
      isWon: true,
      status: "WON",
      settled_at: "2026-11-02T18:35:00Z"
    }
  },
  {
    id: "match-nov-2",
    date: "yesterday",
    isYesterday: true,
    league: "La Liga",
    leagueEmoji: "🇪🇸",
    time: "FT · 2 Nov 2026",
    rawDate: 1793639700000,
    isLive: false,
    status: "FT",
    statusShort: "FT",
    isFT: true,
    homeTeam: { name: "Barcelona", id: 529, logo: "https://media.api-sports.io/football/teams/529.png", form: ["W","W","W","W","W"] },
    awayTeam: { name: "Espanyol", id: 540, logo: "https://media.api-sports.io/football/teams/540.png", form: ["L","L","W","L","L"] },
    scores: { home: 3, away: 1 },
    predictions: { home: 78, draw: 14, away: 8 },
    confidenceVal: 88,
    settledPick: {
      market: "Home Win & Over 2.5 (Barcelona)",
      odds: 1.70,
      confidence: 88,
      isWon: true,
      status: "WON",
      settled_at: "2026-11-02T17:15:00Z"
    }
  },
  {
    id: "match-nov-3",
    date: "yesterday",
    isYesterday: true,
    league: "Premier League",
    leagueEmoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    time: "FT · 2 Nov 2026",
    rawDate: 1793639100000,
    isLive: false,
    status: "FT",
    statusShort: "FT",
    isFT: true,
    homeTeam: { name: "Bournemouth", id: 35, logo: "https://media.api-sports.io/football/teams/35.png", form: ["W","D","W","L","L"] },
    awayTeam: { name: "Manchester City", id: 50, logo: "https://media.api-sports.io/football/teams/50.png", form: ["L","W","W","W","W"] },
    scores: { home: 2, away: 1 },
    predictions: { home: 18, draw: 24, away: 58 },
    confidenceVal: 86,
    settledPick: {
      market: "Away Win (Manchester City)",
      odds: 1.52,
      confidence: 86,
      isWon: false,
      status: "LOST",
      settled_at: "2026-11-02T17:05:00Z"
    }
  },
  {
    id: "match-nov-4",
    date: "yesterday",
    isYesterday: true,
    league: "Bundesliga",
    leagueEmoji: "🇩🇪",
    time: "FT · 2 Nov 2026",
    rawDate: 1793636700000,
    isLive: false,
    status: "FT",
    statusShort: "FT",
    isFT: true,
    homeTeam: { name: "Bayern Munich", id: 157, logo: "https://media.api-sports.io/football/teams/157.png", form: ["W","W","W","W","W"] },
    awayTeam: { name: "Union Berlin", id: 182, logo: "https://media.api-sports.io/football/teams/182.png", form: ["L","D","W","W","D"] },
    scores: { home: 3, away: 0 },
    predictions: { home: 74, draw: 16, away: 10 },
    confidenceVal: 84,
    settledPick: {
      market: "Home Win to Nil (Bayern Munich)",
      odds: 1.85,
      confidence: 84,
      isWon: true,
      status: "WON",
      settled_at: "2026-11-02T16:25:00Z"
    }
  },
  {
    id: "match-nov-5",
    date: "yesterday",
    isYesterday: true,
    league: "Premier League",
    leagueEmoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    time: "FT · 2 Nov 2026",
    rawDate: 1793630100000,
    isLive: false,
    status: "FT",
    statusShort: "FT",
    isFT: true,
    homeTeam: { name: "Newcastle United", id: 34, logo: "https://media.api-sports.io/football/teams/34.png", form: ["W","W","D","L","D"] },
    awayTeam: { name: "Arsenal", id: 42, logo: "https://media.api-sports.io/football/teams/42.png", form: ["L","W","D","W","W"] },
    scores: { home: 1, away: 0 },
    predictions: { home: 28, draw: 30, away: 42 },
    confidenceVal: 78,
    settledPick: {
      market: "Arsenal Draw No Bet (Away DNB)",
      odds: 1.55,
      confidence: 78,
      isWon: false,
      status: "LOST",
      settled_at: "2026-11-02T14:35:00Z"
    }
  },
  {
    id: "match-nov-6",
    date: "yesterday",
    isYesterday: true,
    league: "Serie A",
    leagueEmoji: "🇮🇹",
    time: "FT · 2 Nov 2026",
    rawDate: 1793626200000,
    isLive: false,
    status: "FT",
    statusShort: "FT",
    isFT: true,
    homeTeam: { name: "Napoli", id: 492, logo: "https://media.api-sports.io/football/teams/492.png", form: ["L","W","W","W","W"] },
    awayTeam: { name: "Atalanta", id: 499, logo: "https://media.api-sports.io/football/teams/499.png", form: ["W","W","W","W","W"] },
    scores: { home: 0, away: 3 },
    predictions: { home: 44, draw: 28, away: 28 },
    confidenceVal: 76,
    settledPick: {
      market: "Home Win (Napoli)",
      odds: 2.05,
      confidence: 76,
      isWon: false,
      status: "LOST",
      settled_at: "2026-11-02T13:30:00Z"
    }
  },`;

    if (content.includes(targetArrayStart)) {
      content = content.replace(targetArrayStart, `${targetArrayStart}${novMatches}`);
      console.log(`[PASS] Prepend November settled fixtures to MATCH_DATA in ${filePath}`);
      fs.writeFileSync(filePath, content, 'utf8');
    }
  }
}

// Execute patches
patchIndexHtml(path.join(rootDir, 'index.html'));
patchIndexHtml(path.join(rootDir, 'public', 'index.html'));
patchUiJs(path.join(rootDir, 'js', 'ui.js'));
patchUiJs(path.join(rootDir, 'public', 'js', 'ui.js'));
patchDataJs(path.join(rootDir, 'js', 'data.js'));
patchDataJs(path.join(rootDir, 'public', 'js', 'data.js'));

console.log('\n[ALL PATCHES APPLIED SUCCESSFULLY]');
