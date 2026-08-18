const MATCH_DATA = [
  // --- ACTIVE LIVE IN-PLAY MATCHES (8 Global In-Play Games) ---
  {
    id: "match-1",
    date: "today",
    league: "Premier League",
    leagueEmoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    time: "Live 72'",
    isLive: true,
    homeTeam: {
      name: "Arsenal",
      logo: "🔴",
      form: ["W", "W", "D", "W", "L"]
    },
    awayTeam: {
      name: "Man City",
      logo: "🔵",
      form: ["W", "D", "W", "W", "W"]
    },
    scores: { home: 2, away: 1 },
    predictions: { home: 48, draw: 22, away: 30 },
    confidence: "high",
    confidenceVal: 88,
    insight: "Arsenal is dominating possession (58%) with high-pressing triggers.",
    isPremium: false,
    aiAnalysis: "This fixture is playing out exactly as the model projected. Arsenal's high block has disrupted City's buildup phase. Expect Man City to push aggressively in the final 15 minutes, making Over 3.5 total match goals a high-probability in-play angle. Arsenal's home advantage and 2-1 lead put them in a very strong position to secure all 3 points.",
    topTips: ["win1", "uo15", "uo35", "uoht05", "uo2h15", "c75", "c85", "btts"]
  },
  {
    id: "match-2",
    date: "today",
    league: "La Liga",
    leagueEmoji: "🇪🇸",
    time: "Live 61'",
    isLive: true,
    homeTeam: {
      name: "Barcelona",
      logo: "🔵🔴",
      form: ["W", "W", "W", "W", "D"]
    },
    awayTeam: {
      name: "Real Madrid",
      logo: "⚪",
      form: ["W", "W", "W", "L", "W"]
    },
    scores: { home: 1, away: 2 },
    predictions: { home: 38, draw: 28, away: 34 },
    confidence: "high",
    confidenceVal: 85,
    insight: "El Clásico in-play: Real Madrid transition index 9.1 xG producing sharp breakaways.",
    isPremium: true,
    aiAnalysis: "PREMIUM LIVE RADAR: Real Madrid has exploited Barcelona's high defensive line twice via rapid vertical wing transitions. Barcelona is overloading the right flank with 64% territory possession. Recommended in-play market: Over 3.5 Total Goals or Both Teams To Score (BTTS) Banker.",
    topTips: ["uo25", "uo35", "btts", "uo2h05", "c85", "c95", "combo_1x2_gg"]
  },
  {
    id: "match-3",
    date: "today",
    league: "Bundesliga",
    leagueEmoji: "🇩🇪",
    time: "Live 34'",
    isLive: true,
    homeTeam: {
      name: "Bayern Munich",
      logo: "🔴⚪",
      form: ["W", "W", "W", "W", "W"]
    },
    awayTeam: {
      name: "RB Leipzig",
      logo: "🔴🐂",
      form: ["W", "D", "W", "L", "W"]
    },
    scores: { home: 2, away: 0 },
    predictions: { home: 72, draw: 16, away: 12 },
    confidence: "high",
    confidenceVal: 92,
    insight: "Bayern attacking tempo: 14 shots inside 30 mins with 2.45 xG created.",
    isPremium: false,
    aiAnalysis: "Bayern's central attacking overload is operating at maximum efficiency. Leipzig's 4-2-2-2 low block has collapsed against early diagonal crosses. Strong indicator for Home Clean Sheet or Over 2.5 1st Half Goals.",
    topTips: ["win1", "uo25", "uo35", "uoht15", "hcs", "c75", "c95"]
  },
  {
    id: "match-4",
    date: "today",
    league: "Serie A",
    leagueEmoji: "🇮🇹",
    time: "Live 83'",
    isLive: true,
    homeTeam: {
      name: "Inter Milan",
      logo: "🔵⚫🐍",
      form: ["W", "D", "W", "W", "L"]
    },
    awayTeam: {
      name: "Juventus",
      logo: "⚫⚪🦓",
      form: ["W", "W", "D", "D", "W"]
    },
    scores: { home: 1, away: 0 },
    predictions: { home: 56, draw: 28, away: 16 },
    confidence: "medium",
    confidenceVal: 78,
    insight: "Derby d'Italia: Inter 3-5-2 defensive block suffocating central passing lanes.",
    isPremium: false,
    aiAnalysis: "Inter has successfully stifled Juventus' wide counters with a disciplined 5-4-1 mid-block in the second half. Expected full-time scoreline: 1-0 or 2-0. Under 2.5 Total Goals locks in with high statistical certainty.",
    topTips: ["win1", "dc1x", "uo15", "hcs", "c65", "c75"]
  },
  {
    id: "match-5",
    date: "today",
    league: "Champions League",
    leagueEmoji: "🇪🇺",
    time: "Live 55'",
    isLive: true,
    homeTeam: {
      name: "PSG",
      logo: "🗼",
      form: ["W", "W", "W", "W", "D"]
    },
    awayTeam: {
      name: "Atletico Madrid",
      logo: "🔴⚪🐻",
      form: ["W", "D", "W", "L", "W"]
    },
    scores: { home: 2, away: 2 },
    predictions: { home: 42, draw: 30, away: 28 },
    confidence: "high",
    confidenceVal: 84,
    insight: "High-octane European clash: 4 goals from 3.1 combined xG.",
    isPremium: true,
    aiAnalysis: "PREMIUM LIVE SCOUT: Open tactical battlefield at Parc des Princes. Simeone's Atletico has shifted from 4-4-2 to an aggressive 3-4-3 press, forcing PSG into turnover vulnerabilities. Pick: Over 4.5 Goals or Both Teams To Score 2nd Half.",
    topTips: ["uo35", "uo45", "btts", "btts2h", "uo2h15", "c85", "c105"]
  },
  {
    id: "match-6",
    date: "today",
    league: "NPFL",
    leagueEmoji: "🇳🇬",
    time: "Live 78'",
    isLive: true,
    homeTeam: {
      name: "Enyimba FC",
      logo: "🐘🔵",
      form: ["W", "W", "D", "W", "W"]
    },
    awayTeam: {
      name: "Remo Stars",
      logo: "🌟🔵",
      form: ["W", "D", "W", "L", "W"]
    },
    scores: { home: 1, away: 0 },
    predictions: { home: 62, draw: 26, away: 12 },
    confidence: "high",
    confidenceVal: 89,
    insight: "Aba fortress: Enyimba undefeated in their last 18 home NPFL fixtures.",
    isPremium: false,
    aiAnalysis: "Enyimba's tactical command in Aba is dominant. Remo Stars has generated only 1 shot on target across 78 minutes. Backing Home Win (1) and Home Clean Sheet with high algorithmic confidence.",
    topTips: ["win1", "dc1x", "uo15", "hcs", "hw2n"]
  },
  {
    id: "match-7",
    date: "today",
    league: "Ligue 1",
    leagueEmoji: "🇫🇷",
    time: "Live 42'",
    isLive: true,
    homeTeam: {
      name: "Monaco",
      logo: "🔴⚪👑",
      form: ["W", "D", "W", "L", "W"]
    },
    awayTeam: {
      name: "Marseille",
      logo: "🔵🗼",
      form: ["L", "W", "W", "D", "W"]
    },
    scores: { home: 1, away: 2 },
    predictions: { home: 40, draw: 25, away: 35 },
    confidence: "medium",
    confidenceVal: 76,
    insight: "Derby de la Méditerranée: Marseille's counter-press yielding fast transition breaks.",
    isPremium: false,
    aiAnalysis: "Fascinating dynamic in southern France. Monaco's high defensive line was penetrated twice in quick succession. Look for Monaco to make double halftime substitutions to push for an equalizer in the second half.",
    topTips: ["uo25", "uo35", "btts", "uo2h05", "c75", "c85"]
  },
  {
    id: "match-8",
    date: "today",
    league: "Premier League",
    leagueEmoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    time: "Live 19'",
    isLive: true,
    homeTeam: {
      name: "Tottenham",
      logo: "⚪🐓",
      form: ["W", "L", "W", "W", "D"]
    },
    awayTeam: {
      name: "Aston Villa",
      logo: "🦁🟣",
      form: ["W", "W", "D", "L", "W"]
    },
    scores: { home: 0, away: 0 },
    predictions: { home: 46, draw: 26, away: 28 },
    confidence: "medium",
    confidenceVal: 79,
    insight: "High line duel: Postecoglou vs Emery tactical press war in north London.",
    isPremium: false,
    aiAnalysis: "Early minutes show intense vertical pacing. Both teams have combined for 4 corners inside 18 minutes. Model projects high likelihood of Over 2.5 total match goals and Over 9.5 Corners.",
    topTips: ["uo25", "btts", "c85", "c95", "c105", "uoht05"]
  },

  // --- TODAY'S SCHEDULED / UPCOMING MATCHES ---
  {
    id: "match-9",
    date: "today",
    league: "Premier League",
    leagueEmoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    time: "Today, 17:30",
    isLive: false,
    homeTeam: {
      name: "Liverpool",
      logo: "🔴🛡️",
      form: ["W", "D", "W", "L", "W"]
    },
    awayTeam: {
      name: "Chelsea",
      logo: "🦁",
      form: ["D", "W", "L", "W", "D"]
    },
    scores: { home: null, away: null },
    predictions: { home: 55, draw: 25, away: 20 },
    confidence: "high",
    confidenceVal: 82,
    insight: "Liverpool has scored in 100% of their home games this season at Anfield.",
    isPremium: false,
    aiAnalysis: "Liverpool's home form under the Anfield lights is formidable. Tactical analysis indicates Chelsea's midfield double pivot will struggle against Liverpool's counter-pressing intensity. Our algorithmic simulation estimates a 55% chance for a Home win, with Both Teams To Score (BTTS) checking out at 68% probability. Predicted score: 3-1.",
    topTips: ["win1", "uo15", "uo25", "uo35", "uoht05", "c75", "c85", "c95", "c105", "btts"]
  },
  {
    id: "match-10",
    date: "today",
    league: "Bundesliga",
    leagueEmoji: "🇩🇪",
    time: "Today, 18:30",
    isLive: false,
    homeTeam: {
      name: "Borussia Dortmund",
      logo: "🟡⚫",
      form: ["W", "L", "W", "D", "W"]
    },
    awayTeam: {
      name: "Bayer Leverkusen",
      logo: "🔴🦁",
      form: ["W", "W", "W", "W", "D"]
    },
    scores: { home: null, away: null },
    predictions: { home: 35, draw: 28, away: 37 },
    confidence: "high",
    confidenceVal: 86,
    insight: "Blockbuster at Signal Iduna Park: Leverkusen averages 2.8 goals per match.",
    isPremium: true,
    aiAnalysis: "PREMIUM SCOUT REPORT: Leverkusen's fluid 3-4-2-1 structure under Xabi Alonso creates numerical superiority in the half-spaces that Dortmund's flat midfield has traditionally struggled to close down. High value pick: Both Teams to Score + Over 2.5 Goals.",
    topTips: ["uo25", "uo35", "btts", "combo_1x2_gg", "c85", "c95"]
  },
  {
    id: "match-11",
    date: "today",
    league: "Serie A",
    leagueEmoji: "🇮🇹",
    time: "Today, 19:45",
    isLive: false,
    homeTeam: {
      name: "AC Milan",
      logo: "🔴⚫👿",
      form: ["L", "W", "W", "D", "W"]
    },
    awayTeam: {
      name: "AS Roma",
      logo: "🐺🟡🔴",
      form: ["W", "W", "D", "W", "L"]
    },
    scores: { home: null, away: null },
    predictions: { home: 45, draw: 30, away: 25 },
    confidence: "medium",
    confidenceVal: 74,
    insight: "San Siro showdown: AC Milan has won 3 consecutive head-to-head encounters.",
    isPremium: false,
    aiAnalysis: "Milan's wide pace via Leão will test Roma's back-three defensive discipline. Roma's set-piece xG is top-three in Serie A, making corners and set-piece goals high likelihood vectors. Recommended: Home Win (1) or Double Chance 1X.",
    topTips: ["win1", "dc1x", "uo15", "uo25", "c75", "c85"]
  },
  {
    id: "match-12",
    date: "today",
    league: "Primeira Liga",
    leagueEmoji: "🇵🇹",
    time: "Today, 20:30",
    isLive: false,
    homeTeam: {
      name: "Sporting CP",
      logo: "🟢⚪🦁",
      form: ["W", "W", "W", "W", "W"]
    },
    awayTeam: {
      name: "Benfica",
      logo: "🦅🔴",
      form: ["W", "W", "D", "W", "W"]
    },
    scores: { home: null, away: null },
    predictions: { home: 48, draw: 28, away: 24 },
    confidence: "high",
    confidenceVal: 87,
    insight: "Derby de Lisboa: Sporting has scored 2+ goals in 9 of their last 10 home matches.",
    isPremium: true,
    aiAnalysis: "PREMIUM SCOUT REPORT: Sporting's high attacking line has generated a league-best 2.95 xG at Alvalade. Benfica's midfield double-pivot will be pressed fiercely. Banker Pick: Sporting to Win (Draw No Bet) and Over 1.5 Team Goals.",
    topTips: ["win1", "dc1x", "uo15", "uo25", "btts", "huo15", "c85"]
  },
  {
    id: "match-13",
    date: "today",
    league: "Eredivisie",
    leagueEmoji: "🇳🇱",
    time: "Today, 16:45",
    isLive: false,
    homeTeam: {
      name: "PSV Eindhoven",
      logo: "🔴⚪⚡",
      form: ["W", "W", "W", "W", "W"]
    },
    awayTeam: {
      name: "Ajax",
      logo: "🔴⚪🛡️🦁",
      form: ["W", "D", "W", "L", "W"]
    },
    scores: { home: null, away: null },
    predictions: { home: 65, draw: 20, away: 15 },
    confidence: "high",
    confidenceVal: 91,
    insight: "De Topper: PSV is unbeaten at home this season with a +38 goal differential.",
    isPremium: false,
    aiAnalysis: "PSV's transition speed is the highest in the Netherlands. Ajax's ongoing restructuring leaves them exposed in defensive transitions. Take PSV Win and Over 2.5 Goals.",
    topTips: ["win1", "uo25", "uo35", "huo15", "c85", "c95"]
  },
  {
    id: "match-14",
    date: "today",
    league: "Brasileirão",
    leagueEmoji: "🇧🇷",
    time: "Today, 21:00",
    isLive: false,
    homeTeam: {
      name: "Flamengo",
      logo: "🔴⚫🦅",
      form: ["W", "W", "D", "W", "L"]
    },
    awayTeam: {
      name: "Palmeiras",
      logo: "🟢⚪🌴",
      form: ["W", "W", "W", "D", "W"]
    },
    scores: { home: null, away: null },
    predictions: { home: 44, draw: 32, away: 24 },
    confidence: "medium",
    confidenceVal: 77,
    insight: "Maracanã classic: Tactical duel between two Brazilian powerhouses.",
    isPremium: false,
    aiAnalysis: "Expect an intense, cagey atmosphere at the Maracanã. Palmeiras operates with a compact defensive structure under Abel Ferreira, while Flamengo looks to dominate possession. Pick: Under 2.5 Goals or 1X Double Chance.",
    topTips: ["dc1x", "uo15", "uo25", "c85", "c95"]
  },
  {
    id: "match-15",
    date: "today",
    league: "Saudi Pro League",
    leagueEmoji: "🇸🇦",
    time: "Today, 19:00",
    isLive: false,
    homeTeam: {
      name: "Al Hilal",
      logo: "🔵🌙",
      form: ["W", "W", "W", "W", "W"]
    },
    awayTeam: {
      name: "Al Nassr",
      logo: "🟡🔵👑",
      form: ["W", "W", "W", "D", "W"]
    },
    scores: { home: null, away: null },
    predictions: { home: 50, draw: 25, away: 25 },
    confidence: "high",
    confidenceVal: 85,
    insight: "Riyadh Derby: Al Hilal on an unprecedented 28-match winning run.",
    isPremium: true,
    aiAnalysis: "PREMIUM SCOUT REPORT: Al Hilal's tactical balance across all thirds gives them a decisive edge in midfield transition against Al Nassr's star-studded frontline. Best Bet: Over 2.5 Total Match Goals and BTTS.",
    topTips: ["win1", "uo25", "uo35", "btts", "combo_1x2_uo", "c85"]
  },
  {
    id: "match-16",
    date: "today",
    league: "La Liga",
    leagueEmoji: "🇪🇸",
    time: "Today, 20:00",
    isLive: false,
    homeTeam: {
      name: "Real Sociedad",
      logo: "🔵⚪👑",
      form: ["W", "D", "W", "L", "D"]
    },
    awayTeam: {
      name: "Athletic Bilbao",
      logo: "🦁🔴",
      form: ["W", "W", "D", "W", "L"]
    },
    scores: { home: null, away: null },
    predictions: { home: 40, draw: 35, away: 25 },
    confidence: "medium",
    confidenceVal: 73,
    insight: "Basque Derby: 4 of the last 5 meetings finished with under 2.5 goals.",
    isPremium: false,
    aiAnalysis: "Both Basque sides boast structured mid-blocks and fierce pressing in wide zones. A tight tactical affair is anticipated with fewer than 3 goals.",
    topTips: ["dc1x", "uo15", "uo25", "c75", "c85"]
  },

  // --- TOMORROW'S SCHEDULED MATCHES ---
  {
    id: "match-17",
    date: "tomorrow",
    league: "Premier League",
    leagueEmoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    time: "Tomorrow, 20:00",
    isLive: false,
    homeTeam: {
      name: "Manchester United",
      logo: "👿",
      form: ["W", "L", "W", "W", "L"]
    },
    awayTeam: {
      name: "Newcastle United",
      logo: "🦓",
      form: ["L", "W", "D", "L", "W"]
    },
    scores: { home: null, away: null },
    predictions: { home: 48, draw: 26, away: 26 },
    confidence: "medium",
    confidenceVal: 75,
    insight: "Old Trafford night game: Man Utd targeting European qualification spot.",
    isPremium: false,
    aiAnalysis: "Manchester United's direct wing play will challenge Newcastle's injury-depleted fullbacks. Expect an open encounter with both teams scoring.",
    topTips: ["win1", "dc1x", "uo15", "uo25", "btts", "c85", "c95"]
  },
  {
    id: "match-18",
    date: "tomorrow",
    league: "La Liga",
    leagueEmoji: "🇪🇸",
    time: "Tomorrow, 19:30",
    isLive: false,
    homeTeam: {
      name: "Sevilla",
      logo: "⚪🔴🛡️",
      form: ["W", "D", "L", "W", "D"]
    },
    awayTeam: {
      name: "Villarreal",
      logo: "🟡潜",
      form: ["W", "W", "W", "L", "W"]
    },
    scores: { home: null, away: null },
    predictions: { home: 42, draw: 30, away: 28 },
    confidence: "medium",
    confidenceVal: 72,
    insight: "Ramon Sanchez-Pizjuan clash: Villarreal has scored in 8 consecutive away games.",
    isPremium: false,
    aiAnalysis: "Both sides possess explosive attacking outlets. Sevilla's home crowd will push early tempo, creating space for Villarreal's transitions.",
    topTips: ["uo25", "btts", "dc12", "c75", "c85"]
  },
  {
    id: "match-19",
    date: "tomorrow",
    league: "Serie A",
    leagueEmoji: "🇮🇹",
    time: "Tomorrow, 20:45",
    isLive: false,
    homeTeam: {
      name: "Napoli",
      logo: "🔵👑",
      form: ["W", "D", "W", "L", "W"]
    },
    awayTeam: {
      name: "Lazio",
      logo: "🦅🔵⚪",
      form: ["W", "L", "W", "D", "W"]
    },
    scores: { home: null, away: null },
    predictions: { home: 52, draw: 28, away: 20 },
    confidence: "high",
    confidenceVal: 81,
    insight: "Stadio Diego Armando Maradona: Napoli averages 61% possession at home.",
    isPremium: true,
    aiAnalysis: "PREMIUM SCOUT REPORT: Napoli's positional rotations in the final third are projected to break Lazio's 4-3-3 shape. Banker Pick: Napoli Win (Draw No Bet) and Over 1.5 match goals.",
    topTips: ["win1", "dc1x", "uo15", "uo25", "huo15", "c75", "c85"]
  },
  {
    id: "match-20",
    date: "tomorrow",
    league: "MLS",
    leagueEmoji: "🇺🇸",
    time: "Tomorrow, 23:30",
    isLive: false,
    homeTeam: {
      name: "Inter Miami",
      logo: "🦩💗",
      form: ["W", "W", "D", "W", "W"]
    },
    awayTeam: {
      name: "LA Galaxy",
      logo: "⚪🌌",
      form: ["W", "W", "W", "D", "L"]
    },
    scores: { home: null, away: null },
    predictions: { home: 58, draw: 22, away: 20 },
    confidence: "high",
    confidenceVal: 88,
    insight: "Chase Stadium: Inter Miami averaging 3.0 goals per game when starting key playmakers.",
    isPremium: false,
    aiAnalysis: "High-scoring MLS thriller expected. Inter Miami's attacking output is unmatched, but Galaxy's front three guarantees chances. Back Over 3.5 Goals.",
    topTips: ["win1", "uo25", "uo35", "btts", "combo_1x2_gg", "c85"]
  },

  // --- YESTERDAY'S COMPLETED MATCHES (FT) ---
  {
    id: "match-21",
    date: "yesterday",
    league: "Premier League",
    leagueEmoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    time: "FT",
    isLive: false,
    homeTeam: {
      name: "Manchester City",
      logo: "🔵",
      form: ["W", "W", "W", "W", "W"]
    },
    awayTeam: {
      name: "West Ham",
      logo: "⚒️",
      form: ["L", "L", "D", "W", "L"]
    },
    scores: { home: 3, away: 1 },
    predictions: { home: 78, draw: 14, away: 8 },
    confidence: "high",
    confidenceVal: 94,
    insight: "City secured comfortable 3-1 victory with 71% possession.",
    isPremium: false,
    aiAnalysis: "Match finalized. Manchester City executed textbook half-space overloads, generating 3.45 Expected Goals (xG).",
    topTips: ["win1", "uo25", "uo35", "huo15"]
  },
  {
    id: "match-22",
    date: "yesterday",
    league: "La Liga",
    leagueEmoji: "🇪🇸",
    time: "FT",
    isLive: false,
    homeTeam: {
      name: "Girona",
      logo: "🔴⚪🦁",
      form: ["W", "W", "W", "L", "W"]
    },
    awayTeam: {
      name: "Valencia",
      logo: "🦇",
      form: ["L", "D", "W", "L", "D"]
    },
    scores: { home: 2, away: 0 },
    predictions: { home: 60, draw: 24, away: 16 },
    confidence: "high",
    confidenceVal: 86,
    insight: "Girona controlled tempo and kept a clean sheet at Montilivi.",
    isPremium: false,
    aiAnalysis: "Match finalized. Girona's structured wing play yielded 2 first-half goals and a clean defensive record.",
    topTips: ["win1", "uo15", "hcs", "hw2n"]
  },
  {
    id: "match-23",
    date: "yesterday",
    league: "Bundesliga",
    leagueEmoji: "🇩🇪",
    time: "FT",
    isLive: false,
    homeTeam: {
      name: "Bayer Leverkusen",
      logo: "🔴🦁",
      form: ["W", "W", "W", "W", "D"]
    },
    awayTeam: {
      name: "Wolfsburg",
      logo: "🐺🟢",
      form: ["L", "W", "L", "D", "L"]
    },
    scores: { home: 3, away: 1 },
    predictions: { home: 70, draw: 18, away: 12 },
    confidence: "high",
    confidenceVal: 90,
    insight: "Leverkusen continues unbeaten run with high attacking efficiency.",
    isPremium: true,
    aiAnalysis: "Match finalized. Leverkusen dominated with 18 shots and 2.89 xG.",
    topTips: ["win1", "uo25", "uo35", "huo15"]
  },
  {
    id: "match-24",
    date: "yesterday",
    league: "Serie A",
    leagueEmoji: "🇮🇹",
    time: "FT",
    isLive: false,
    homeTeam: {
      name: "Atalanta",
      logo: "🔵⚫👩",
      form: ["W", "W", "L", "D", "W"]
    },
    awayTeam: {
      name: "Fiorentina",
      logo: "🟣⚜️",
      form: ["D", "W", "L", "W", "D"]
    },
    scores: { home: 2, away: 1 },
    predictions: { home: 54, draw: 26, away: 20 },
    confidence: "high",
    confidenceVal: 83,
    insight: "Gasperini's side pressed high and claimed late 2-1 winner.",
    isPremium: false,
    aiAnalysis: "Match finalized. Atalanta created 11 corners and 16 shots to secure 3 points in Bergamo.",
    topTips: ["win1", "uo25", "btts", "c85", "c95"]
  }
];

const HISTORICAL_PERFORMANCE = {
  accuracy: [84, 82, 85, 89, 87, 86, 91],
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  winRate: "87.6%",
  tipsProvided: 142,
  profitUnits: "+48.2"
};

const GLOBAL_CLUBS = [
  // England
  { name: "Manchester City", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", league: "Premier League", logo: "🔵", matchesPlayed: 32, wins: 23, draws: 6, losses: 3 },
  { name: "Arsenal", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", league: "Premier League", logo: "🔴", matchesPlayed: 32, wins: 22, draws: 5, losses: 5 },
  { name: "Liverpool", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", league: "Premier League", logo: "🔴🛡️", matchesPlayed: 32, wins: 21, draws: 7, losses: 4 },
  { name: "Chelsea", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", league: "Premier League", logo: "🦁", matchesPlayed: 32, wins: 15, draws: 9, losses: 8 },
  { name: "Manchester United", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", league: "Premier League", logo: "👿", matchesPlayed: 32, wins: 16, draws: 4, losses: 12 },
  { name: "Tottenham", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", league: "Premier League", logo: "⚪🐓", matchesPlayed: 32, wins: 18, draws: 6, losses: 8 },
  { name: "Aston Villa", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", league: "Premier League", logo: "🦁🟣", matchesPlayed: 32, wins: 18, draws: 6, losses: 8 },
  { name: "Newcastle United", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", league: "Premier League", logo: "🦓", matchesPlayed: 32, wins: 15, draws: 5, losses: 12 },
  
  // Spain
  { name: "Real Madrid", country: "Spain", flag: "🇪🇸", league: "La Liga", logo: "⚪", matchesPlayed: 31, wins: 24, draws: 6, losses: 1 },
  { name: "Barcelona", country: "Spain", flag: "🇪🇸", league: "La Liga", logo: "🔵🔴", matchesPlayed: 31, wins: 21, draws: 7, losses: 3 },
  { name: "Atletico Madrid", country: "Spain", flag: "🇪🇸", league: "La Liga", logo: "🔴⚪🐻", matchesPlayed: 31, wins: 19, draws: 4, losses: 8 },
  { name: "Girona", country: "Spain", flag: "🇪🇸", league: "La Liga", logo: "🔴⚪🦁", matchesPlayed: 31, wins: 20, draws: 5, losses: 6 },
  { name: "Athletic Bilbao", country: "Spain", flag: "🇪🇸", league: "La Liga", logo: "🦁🔴", matchesPlayed: 31, wins: 16, draws: 9, losses: 6 },
  { name: "Real Sociedad", country: "Spain", flag: "🇪🇸", league: "La Liga", logo: "🔵⚪👑", matchesPlayed: 31, wins: 13, draws: 11, losses: 7 },
  
  // Germany
  { name: "Bayern Munich", country: "Germany", flag: "🇩🇪", league: "Bundesliga", logo: "🔴⚪", matchesPlayed: 29, wins: 20, draws: 3, losses: 6 },
  { name: "Bayer Leverkusen", country: "Germany", flag: "🇩🇪", league: "Bundesliga", logo: "🔴🦁", matchesPlayed: 29, wins: 25, draws: 4, losses: 0 },
  { name: "Borussia Dortmund", country: "Germany", flag: "🇩🇪", league: "Bundesliga", logo: "🟡⚫", matchesPlayed: 29, wins: 16, draws: 8, losses: 5 },
  { name: "RB Leipzig", country: "Germany", flag: "🇩🇪", league: "Bundesliga", logo: "🔴🐂", matchesPlayed: 29, wins: 17, draws: 5, losses: 7 },
  { name: "VfB Stuttgart", country: "Germany", flag: "🇩🇪", league: "Bundesliga", logo: "⚪🔴", matchesPlayed: 29, wins: 20, draws: 3, losses: 6 },
  
  // Italy
  { name: "Inter Milan", country: "Italy", flag: "🇮🇹", league: "Serie A", logo: "🔵⚫🐍", matchesPlayed: 32, wins: 26, draws: 5, losses: 1 },
  { name: "AC Milan", country: "Italy", flag: "🇮🇹", league: "Serie A", logo: "🔴⚫👿", matchesPlayed: 32, wins: 21, draws: 6, losses: 5 },
  { name: "Juventus", country: "Italy", flag: "🇮🇹", league: "Serie A", logo: "⚫⚪🦓", matchesPlayed: 32, wins: 18, draws: 9, losses: 5 },
  { name: "Bologna", country: "Italy", flag: "🇮🇹", league: "Serie A", logo: "🔴🔵🛡️", matchesPlayed: 32, wins: 16, draws: 11, losses: 5 },
  { name: "AS Roma", country: "Italy", flag: "🇮🇹", league: "Serie A", logo: "🐺🟡🔴", matchesPlayed: 32, wins: 16, draws: 7, losses: 9 },
  { name: "Atalanta", country: "Italy", flag: "🇮🇹", league: "Serie A", logo: "🔵⚫👩", matchesPlayed: 31, wins: 15, draws: 6, losses: 10 },
  { name: "Lazio", country: "Italy", flag: "🇮🇹", league: "Serie A", logo: "🦅🔵⚪", matchesPlayed: 32, wins: 15, draws: 4, losses: 13 },
  { name: "Napoli", country: "Italy", flag: "🇮🇹", league: "Serie A", logo: "🔵👑", matchesPlayed: 32, wins: 13, draws: 10, losses: 9 },
  
  // France
  { name: "Paris Saint-Germain", country: "France", flag: "🇫🇷", league: "Ligue 1", logo: "🗼", matchesPlayed: 29, wins: 19, draws: 9, losses: 1 },
  { name: "Monaco", country: "France", flag: "🇫🇷", league: "Ligue 1", logo: "🔴⚪👑", matchesPlayed: 29, wins: 15, draws: 7, losses: 7 },
  { name: "Lille", country: "France", flag: "🇫🇷", league: "Ligue 1", logo: "🐕🔴", matchesPlayed: 29, wins: 13, draws: 10, losses: 6 },
  { name: "Marseille", country: "France", flag: "🇫🇷", league: "Ligue 1", logo: "🔵🗼", matchesPlayed: 29, wins: 10, draws: 10, losses: 9 },
  { name: "Lyon", country: "France", flag: "🇫🇷", league: "Ligue 1", logo: "🦁🔵🔴", matchesPlayed: 29, wins: 12, draws: 5, losses: 12 },
  
  // Portugal
  { name: "Sporting CP", country: "Portugal", flag: "🇵🇹", league: "Primeira Liga", logo: "🟢⚪🦁", matchesPlayed: 29, wins: 24, draws: 3, losses: 2 },
  { name: "Benfica", country: "Portugal", flag: "🇵🇹", league: "Primeira Liga", logo: "🦅🔴", matchesPlayed: 29, wins: 22, draws: 4, losses: 3 },
  { name: "FC Porto", country: "Portugal", flag: "🇵🇹", league: "Primeira Liga", logo: "🔵🐉", matchesPlayed: 29, wins: 18, draws: 5, losses: 6 },
  
  // Netherlands
  { name: "PSV Eindhoven", country: "Netherlands", flag: "🇳🇱", league: "Eredivisie", logo: "🔴⚪⚡", matchesPlayed: 30, wins: 26, draws: 3, losses: 1 },
  { name: "Feyenoord", country: "Netherlands", flag: "🇳🇱", league: "Eredivisie", logo: "🔴⚪🛡️", matchesPlayed: 30, wins: 22, draws: 6, losses: 2 },
  { name: "Ajax", country: "Netherlands", flag: "🇳🇱", league: "Eredivisie", logo: "🔴⚪🛡️🦁", matchesPlayed: 30, wins: 13, draws: 9, losses: 8 },
  
  // USA
  { name: "Inter Miami", country: "USA", flag: "🇺🇸", league: "MLS", logo: "🦩💗", matchesPlayed: 9, wins: 4, draws: 3, losses: 2 },
  { name: "LAFC", country: "USA", flag: "🇺🇸", league: "MLS", logo: "⚫🟡🦅", matchesPlayed: 9, wins: 4, draws: 3, losses: 2 },
  { name: "LA Galaxy", country: "USA", flag: "🇺🇸", league: "MLS", logo: "⚪🌌", matchesPlayed: 9, wins: 5, draws: 3, losses: 1 }
];

const LEAGUE_STATS = [
  { league: "Premier League", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", avgGoals: "2.85", bttsPct: "58%", homeWinPct: "46%", drawPct: "22%", over25Pct: "62%", avgCards: "3.4", avgCorners: "10.4" },
  { league: "La Liga", flag: "🇪🇸", avgGoals: "2.64", bttsPct: "52%", homeWinPct: "44%", drawPct: "26%", over25Pct: "54%", avgCards: "4.8", avgCorners: "9.2" },
  { league: "Bundesliga", flag: "🇩🇪", avgGoals: "3.18", bttsPct: "64%", homeWinPct: "48%", drawPct: "20%", over25Pct: "68%", avgCards: "3.8", avgCorners: "10.1" },
  { league: "Serie A", flag: "🇮🇹", avgGoals: "2.58", bttsPct: "48%", homeWinPct: "42%", drawPct: "28%", over25Pct: "50%", avgCards: "4.5", avgCorners: "9.6" },
  { league: "Ligue 1", flag: "🇫🇷", avgGoals: "2.70", bttsPct: "54%", homeWinPct: "43%", drawPct: "25%", over25Pct: "56%", avgCards: "4.0", avgCorners: "9.8" }
];

const DAILY_TIPS = [
  { type: "Double of the Day", matches: ["Bayern Munich vs Dortmund", "Liverpool vs Chelsea"], odd: "2.68", text: "Combined win odds on Bayern (1.45) & Liverpool Win (1.85) representing high value counter-press metrics." },
  { type: "Risk of the Day", matches: ["Arsenal vs Man City"], odd: "3.40", text: "Arsenal Win + Both Teams To Score (BTTS). Arsenal's central block favors them, but City is likely to score late." },
  { type: "Value of the Day", matches: ["Juventus vs PSG"], odd: "3.20", text: "Draw (X) pick. Juventus deep block is highly resilient, PSG transition lacks wide crossing options." }
];

const HOT_TRENDS = [
  { team: "Real Madrid", trend: "Undefeated in last 15 La Liga games", icon: "🔥" },
  { team: "Bayer Leverkusen", trend: "0 losses this season in Bundesliga", icon: "🛡️" },
  { team: "Bayern Munich", trend: "Averaging 3.2 goals per game", icon: "⚽" },
  { team: "Sporting CP", trend: "Won last 6 home fixtures", icon: "📈" }
];

const VALUE_BETS = [
  { match: "Liverpool vs Chelsea", market: "Over 2.5 Goals", bookmakerOdds: "1.92", modelProbability: "68%", modelOdds: "1.47", ev: "+30.6%" },
  { match: "Real Madrid vs Barcelona", market: "Home Win (1)", bookmakerOdds: "2.15", modelProbability: "55%", modelOdds: "1.82", ev: "+18.1%" },
  { match: "Bayern Munich vs Dortmund", market: "Home Win & Over 2.5", bookmakerOdds: "1.90", modelProbability: "62%", modelOdds: "1.61", ev: "+17.9%" }
];

const COUNTRY_LEAGUES_DATA = [
  { country: "Africa", emoji: "🌍", leagues: ["CAF Champions League", "CAF Confederation Cup", "Africa Cup of Nations"] },
  { country: "Albania", emoji: "🇦🇱", leagues: ["Superliga", "Kupa e Shqipërisë"] },
  { country: "Algeria", emoji: "🇩🇿", leagues: ["Ligue Professionnelle 1", "Algerian Cup"] },
  { country: "Andorra", emoji: "🇦🇩", leagues: ["Primera Divisió", "Copa Constitució"] },
  { country: "Angola", emoji: "🇦🇴", leagues: ["Girabola"] },
  { country: "Argentina", emoji: "🇦🇷", leagues: ["Primera División", "Copa Argentina", "Primera B Nacional"] },
  { country: "Armenia", emoji: "🇦🇲", leagues: ["Premier League", "Armenian Cup"] },
  { country: "Aruba", emoji: "🇦🇼", leagues: ["Division di Honor"] },
  { country: "Asia", emoji: "🌏", leagues: ["AFC Champions League", "AFC Cup", "AFC Asian Cup"] },
  { country: "Australia", emoji: "🇦🇺", leagues: ["A-League", "Australia Cup"] },
  { country: "Austria", emoji: "🇦🇹", leagues: ["Bundesliga", "2. Liga", "Austrian Cup"] },
  { country: "Azerbaijan", emoji: "🇦🇿", leagues: ["Premier League", "Azerbaijan Cup"] },
  { country: "Bahrain", emoji: "🇧🇭", leagues: ["Premier League", "King's Cup"] },
  { country: "Bangladesh", emoji: "🇧🇩", leagues: ["Premier League"] },
  { country: "Belarus", emoji: "🇧🇾", leagues: ["Vysheyshaya Liga", "Belarusian Cup"] },
  { country: "Belgium", emoji: "🇧🇪", leagues: ["Pro League", "Challenger Pro League", "Belgian Cup"] },
  { country: "Benin", emoji: "🇧🇯", leagues: ["Ligue 1"] },
  { country: "Bolivia", emoji: "🇧🇴", leagues: ["Primera División"] },
  { country: "Bosnia and Herzegovina", emoji: "🇧🇦", leagues: ["Premier League", "Bosnian Cup"] },
  { country: "Botswana", emoji: "🇧🇼", leagues: ["Premier League"] },
  { country: "Brazil", emoji: "🇧🇷", leagues: ["Série A", "Série B", "Copa do Brasil", "Campeonato Paulista"] },
  { country: "Bulgaria", emoji: "🇧🇬", leagues: ["First League", "Bulgarian Cup"] },
  { country: "Burkina Faso", emoji: "🇧🇫", leagues: ["Premier League"] },
  { country: "Burundi", emoji: "🇧🇮", leagues: ["Premier League"] },
  { country: "Cambodia", emoji: "🇰🇭", leagues: ["Premier League"] },
  { country: "Cameroon", emoji: "🇨🇲", leagues: ["Elite One"] },
  { country: "Canada", emoji: "🇨🇦", leagues: ["Canadian Premier League", "Canadian Championship"] },
  { country: "Chile", emoji: "🇨🇱", leagues: ["Primera División", "Copa Chile"] },
  { country: "China", emoji: "🇨🇳", leagues: ["Super League", "FA Cup"] },
  { country: "Colombia", emoji: "🇨🇴", leagues: ["Primera A", "Copa Colombia"] },
  { country: "Congo", emoji: "🇨🇬", leagues: ["Ligue 1"] },
  { country: "Costa Rica", emoji: "🇨🇷", leagues: ["Primera División"] },
  { country: "Croatia", emoji: "🇭🇷", leagues: ["HNL", "Croatian Cup"] },
  { country: "Cuba", emoji: "🇨🇺", leagues: ["Campeonato Nacional"] },
  { country: "Cyprus", emoji: "🇨🇾", leagues: ["First Division", "Cypriot Cup"] },
  { country: "Czech Republic", emoji: "🇨🇿", leagues: ["First League", "Czech Cup"] },
  { country: "Denmark", emoji: "🇩🇰", leagues: ["Superliga", "1st Division", "Danish Cup"] },
  { country: "Dominican Republic", emoji: "🇩🇴", leagues: ["LDF"] },
  { country: "Ecuador", emoji: "🇪🇨", leagues: ["Serie A", "Copa Ecuador"] },
  { country: "Egypt", emoji: "🇪🇬", leagues: ["Premier League", "Egypt Cup"] },
  { country: "El Salvador", emoji: "🇸🇻", leagues: ["Primera División"] },
  { country: "England", emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", leagues: ["Premier League", "Championship", "League One", "League Two", "FA Cup", "EFL Cup"] },
  { country: "Estonia", emoji: "🇪🇪", leagues: ["Meistriliiga", "Estonian Cup"] },
  { country: "Ethiopia", emoji: "🇪🇹", leagues: ["Premier League"] },
  { country: "Europe", emoji: "🇪🇺", leagues: ["UEFA Champions League", "UEFA Europa League", "UEFA Conference League", "UEFA Nations League", "Euros"] },
  { country: "Faroe Islands", emoji: "🇫🇴", leagues: ["Premier League", "Faroe Islands Cup"] },
  { country: "Finland", emoji: "🇫🇮", leagues: ["Veikkausliiga", "Finnish Cup"] },
  { country: "France", emoji: "🇫🇷", leagues: ["Ligue 1", "Ligue 2", "Coupe de France"] },
  { country: "Gabon", emoji: "🇬🇦", leagues: ["Championnat National D1"] },
  { country: "Georgia", emoji: "🇬🇪", leagues: ["Erovnuli Liga", "Georgian Cup"] },
  { country: "Germany", emoji: "🇩🇪", leagues: ["Bundesliga", "2. Bundesliga", "DFB-Pokal"] },
  { country: "Ghana", emoji: "🇬🇭", leagues: ["Premier League"] },
  { country: "Greece", emoji: "🇬🇷", leagues: ["Super League 1", "Greek Cup"] },
  { country: "Guatemala", emoji: "🇬🇹", leagues: ["Liga Nacional"] },
  { country: "Guinea", emoji: "🇬🇳", leagues: ["Ligue 1 Pro"] },
  { country: "Honduras", emoji: "🇭🇳", leagues: ["Liga Nacional"] },
  { country: "Hong Kong", emoji: "🇭🇰", leagues: ["Premier League", "FA Cup"] },
  { country: "Hungary", emoji: "🇭🇺", leagues: ["NB I", "Hungarian Cup"] },
  { country: "Iceland", emoji: "🇮🇸", leagues: ["Besta deild karla", "Icelandic Cup"] },
  { country: "India", emoji: "🇮🇳", leagues: ["Super League", "I-League", "Super Cup"] },
  { country: "Indonesia", emoji: "🇮🇩", leagues: ["Liga 1", "Piala Indonesia"] },
  { country: "Iran", emoji: "🇮🇷", leagues: ["Pro League", "Hazfi Cup"] },
  { country: "Iraq", emoji: "🇮🇶", leagues: ["Stars League", "Iraq FA Cup"] },
  { country: "Ireland", emoji: "🇮🇪", leagues: ["Premier Division", "First Division", "FAI Cup"] },
  { country: "Israel", emoji: "🇮🇱", leagues: ["Premier League", "State Cup"] },
  { country: "Italy", emoji: "🇮🇹", leagues: ["Serie A", "Serie B", "Coppa Italia"] },
  { country: "Ivory Coast", emoji: "🇨🇮", leagues: ["Ligue 1"] },
  { country: "Jamaica", emoji: "🇯🇲", leagues: ["Premier League"] },
  { country: "Japan", emoji: "🇯🇵", leagues: ["J1 League", "J2 League", "Emperor's Cup", "J.League Cup"] },
  { country: "Jordan", emoji: "🇯🇴", leagues: ["Pro League", "Jordan FA Cup"] },
  { country: "Kazakhstan", emoji: "🇰🇿", leagues: ["Premier League", "Kazakhstan Cup"] },
  { country: "Kenya", emoji: "🇰🇪", leagues: ["Premier League", "FKF Cup"] },
  { country: "Kosovo", emoji: "🇽🇰", leagues: ["Superliga"] },
  { country: "Kuwait", emoji: "🇰🇼", leagues: ["Premier League", "Emir Cup"] },
  { country: "Kyrgyzstan", emoji: "🇰🇬", leagues: ["Premier League"] },
  { country: "Latvia", emoji: "🇱🇻", leagues: ["Virsliga", "Latvian Cup"] },
  { country: "Lebanon", emoji: "🇱🇧", leagues: ["Premier League", "FA Cup"] },
  { country: "Liberia", emoji: "🇱🇷", leagues: ["First Division"] },
  { country: "Lithuania", emoji: "🇱🇹", leagues: ["A Lyga", "Lithuanian Cup"] },
  { country: "Luxembourg", emoji: "🇱🇺", leagues: ["National Division", "Luxembourg Cup"] },
  { country: "Macau", emoji: "🇲🇴", leagues: ["Elite League"] },
  { country: "North Macedonia", emoji: "🇲🇰", leagues: ["First League"] },
  { country: "Madagascar", emoji: "🇲🇬", leagues: ["Pro League"] },
  { country: "Malawi", emoji: "🇲🇼", leagues: ["Super League"] },
  { country: "Malaysia", emoji: "🇲🇾", leagues: ["Super League", "Malaysia Cup"] },
  { country: "Maldives", emoji: "🇲🇻", leagues: ["Dhivehi Premier League"] },
  { country: "Mali", emoji: "🇲🇱", leagues: ["Première Division"] },
  { country: "Malta", emoji: "🇲🇹", leagues: ["Premier League", "FA Trophy"] },
  { country: "Mauritania", emoji: "🇲🇷", leagues: ["Super D1"] },
  { country: "Mauritius", emoji: "🇲🇺", leagues: ["MFA League"] },
  { country: "Mexico", emoji: "🇲🇽", leagues: ["Liga MX", "Liga de Expansión MX", "Copa MX"] },
  { country: "Moldova", emoji: "🇲🇩", leagues: ["Super Liga", "Moldovan Cup"] },
  { country: "Mongolia", emoji: "🇲🇳", leagues: ["National Premier League"] },
  { country: "Montenegro", emoji: "🇲🇪", leagues: ["First League", "Montenegrin Cup"] },
  { country: "Morocco", emoji: "🇲🇦", leagues: ["Botola Pro 1", "Throne Cup"] },
  { country: "Myanmar", emoji: "🇲🇲", leagues: ["National League"] },
  { country: "Namibia", emoji: "🇳🇦", leagues: ["Premier League"] },
  { country: "Nepal", emoji: "🇳🇵", leagues: ["Super League"] },
  { country: "Netherlands", emoji: "🇳🇱", leagues: ["Eredivisie", "Eerste Divisie", "KNVB Cup"] },
  { country: "New Zealand", emoji: "🇳🇿", leagues: ["National League", "Chatham Cup"] },
  { country: "Nicaragua", emoji: "🇳🇮", leagues: ["Liga Primera"] },
  { country: "Niger", emoji: "🇳🇪", leagues: ["Ligue 1"] },
  { country: "Nigeria", emoji: "🇳🇬", leagues: ["NPFL", "FA Cup"] },
  { country: "Northern Ireland", emoji: "🏴󠁡󠁲󠁵󠁸󠁿", leagues: ["NIFL Premiership", "Irish Cup"] },
  { country: "Norway", emoji: "🇳🇴", leagues: ["Eliteserien", "1. divisjon", "Norwegian Cup"] },
  { country: "Oman", emoji: "🇴🇲", leagues: ["Professional League", "Sultan Qaboos Cup"] },
  { country: "Palestine", emoji: "🇵🇸", leagues: ["West Bank League", "Gaza Strip League"] },
  { country: "Panama", emoji: "🇵🇦", leagues: ["LPF"] },
  { country: "Paraguay", emoji: "🇵🇾", leagues: ["Primera División"] },
  { country: "Peru", emoji: "🇵🇪", leagues: ["Liga 1"] },
  { country: "Philippines", emoji: "🇵🇭", leagues: ["Football League"] },
  { country: "Poland", emoji: "🇵🇱", leagues: ["Ekstraklasa", "I Liga", "Polish Cup"] },
  { country: "Portugal", emoji: "🇵🇹", leagues: ["Primeira Liga", "Liga Portugal 2", "Taça de Portugal", "Taça da Liga"] },
  { country: "Qatar", emoji: "🇶🇦", leagues: ["Stars League", "Emir Cup"] },
  { country: "Romania", emoji: "🇷🇴", leagues: ["Liga I", "Romanian Cup"] },
  { country: "Russia", emoji: "🇷🇺", leagues: ["Premier League", "Russian Cup"] },
  { country: "Rwanda", emoji: "🇷🇼", leagues: ["Premier League"] },
  { country: "San Marino", emoji: "🇸🇲", leagues: ["Campionato Sammarinese", "Coppa Titano"] },
  { country: "Saudi Arabia", emoji: "🇸🇦", leagues: ["Pro League", "King Cup"] },
  { country: "Scotland", emoji: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", leagues: ["Premiership", "Championship", "Scottish Cup", "League Cup"] },
  { country: "Senegal", emoji: "🇸🇳", leagues: ["Ligue 1"] },
  { country: "Serbia", emoji: "🇷🇸", leagues: ["SuperLiga", "Serbian Cup"] },
  { country: "Singapore", emoji: "🇸🇬", leagues: ["Premier League", "Singapore Cup"] },
  { country: "Slovakia", emoji: "🇸🇰", leagues: ["Super Liga", "Slovak Cup"] },
  { country: "Slovenia", emoji: "🇸🇮", leagues: ["PrvaLiga", "Slovenian Cup"] },
  { country: "Somalia", emoji: "🇸🇴", leagues: ["First Division"] },
  { country: "South Africa", emoji: "🇿🇦", leagues: ["Premier Division", "Nedbank Cup"] },
  { country: "South Korea", emoji: "🇰🇷", leagues: ["K League 1", "K League 2", "FA Cup"] },
  { country: "Spain", emoji: "🇪🇸", leagues: ["La Liga", "La Liga 2", "Copa del Rey"] },
  { country: "Sudan", emoji: "🇸🇩", leagues: ["Premier League"] },
  { country: "Sweden", emoji: "🇸🇪", leagues: ["Allsvenskan", "Superettan", "Svenska Cupen"] },
  { country: "Switzerland", emoji: "🇨🇭", leagues: ["Super League", "Challenge League", "Swiss Cup"] },
  { country: "Syria", emoji: "🇸🇾", leagues: ["Premier League"] },
  { country: "Taiwan", emoji: "🇹🇼", leagues: ["Premier League"] },
  { country: "Tajikistan", emoji: "🇹🇯", leagues: ["Vysshaya Liga"] },
  { country: "Tanzania", emoji: "🇹🇿", leagues: ["Premier League"] },
  { country: "Thailand", emoji: "🇹🇭", leagues: ["Thai League 1", "Thai FA Cup"] },
  { country: "Togo", emoji: "🇹🇬", leagues: ["Championnat National"] },
  { country: "Tunisia", emoji: "🇹🇳", leagues: ["Ligue Professionnelle 1"] },
  { country: "Turkey", emoji: "🇹🇷", leagues: ["Süper Lig", "1. Lig", "Turkish Cup"] },
  { country: "Uganda", emoji: "🇺🇬", leagues: ["Premier League"] },
  { country: "Ukraine", emoji: "🇺🇦", leagues: ["Premier League", "Ukrainian Cup"] },
  { country: "United Arab Emirates", emoji: "🇦🇪", leagues: ["Pro League", "President's Cup"] },
  { country: "Uruguay", emoji: "🇺🇾", leagues: ["Primera División"] },
  { country: "USA", emoji: "🇺🇸", leagues: ["MLS", "USL Championship", "US Open Cup"] },
  { country: "Uzbekistan", emoji: "🇺🇿", leagues: ["Super League", "Uzbekistan Cup"] },
  { country: "Venezuela", emoji: "🇻🇪", leagues: ["Primera División"] },
  { country: "Vietnam", emoji: "🇻🇳", leagues: ["V.League 1", "Vietnamese Cup"] },
  { country: "Wales", emoji: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", leagues: ["Cymru Premier", "Welsh Cup"] },
  { country: "World", emoji: "🌎", leagues: ["World Cup", "Copa América", "Club World Cup", "Friendlies", "Women's World Cup"] }
];

const TOP_LEAGUES_DATA = [
  { name: "Premier League", emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", country: "England" },
  { name: "Championship", emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", country: "England" },
  { name: "FA Cup", emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", country: "England" },
  { name: "EFL Cup", emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", country: "England" },
  { name: "La Liga", emoji: "🇪🇸", country: "Spain" },
  { name: "La Liga 2", emoji: "🇪🇸", country: "Spain" },
  { name: "Bundesliga", emoji: "🇩🇪", country: "Germany" },
  { name: "2. Bundesliga", emoji: "🇩🇪", country: "Germany" },
  { name: "Serie A", emoji: "🇮🇹", country: "Italy" },
  { name: "Serie B", emoji: "🇮🇹", country: "Italy" },
  { name: "Ligue 1", emoji: "🇫🇷", country: "France" },
  { name: "Ligue 2", emoji: "🇫🇷", country: "France" },
  { name: "Eredivisie", emoji: "🇳🇱", country: "Netherlands" },
  { name: "Primeira Liga", emoji: "🇵🇹", country: "Portugal" },
  { name: "Süper Lig", emoji: "🇹🇷", country: "Turkey" },
  { name: "Scottish Premiership", emoji: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", country: "Scotland" },
  { name: "Belgian Pro League", emoji: "🇧🇪", country: "Belgium" },
  { name: "Brasileirão", emoji: "🇧🇷", country: "Brazil" },
  { name: "Liga Profesional", emoji: "🇦🇷", country: "Argentina" },
  { name: "Liga MX", emoji: "🇲🇽", country: "Mexico" },
  { name: "MLS", emoji: "🇺🇸", country: "USA" },
  { name: "Saudi Pro League", emoji: "🇸🇦", country: "Saudi Arabia" },
  { name: "NPFL", emoji: "🇳🇬", country: "Nigeria" },
  { name: "DStv Premiership", emoji: "🇿🇦", country: "South Africa" },
  { name: "Egyptian Premier", emoji: "🇪🇬", country: "Egypt" },
  { name: "Champions League", emoji: "🇪🇺", country: "Europe" },
  { name: "Europa League", emoji: "🇪🇺", country: "Europe" },
  { name: "Conference League", emoji: "🇪🇺", country: "Europe" },
  { name: "Copa Libertadores", emoji: "🌎", country: "South America" },
  { name: "AFCON", emoji: "🏆", country: "Africa" },
  { name: "World Cup", emoji: "🏆", country: "World" }
];

try { if (typeof MATCH_DATA !== 'undefined') window.MATCH_DATA = MATCH_DATA; } catch (e) {}
try { if (typeof MATCHES_DATA !== 'undefined') window.MATCHES_DATA = MATCHES_DATA; else if (typeof MATCH_DATA !== 'undefined') window.MATCHES_DATA = MATCH_DATA; } catch (e) {}
try { if (typeof MATCH_STATS_DATA !== 'undefined') window.MATCH_STATS_DATA = MATCH_STATS_DATA; } catch (e) {}
try { if (typeof LEAGUE_STATS_DATA !== 'undefined') window.LEAGUE_STATS_DATA = LEAGUE_STATS_DATA; } catch (e) {}
try { if (typeof DAILY_TIPS !== 'undefined') window.DAILY_TIPS = DAILY_TIPS; } catch (e) {}
try { if (typeof HOT_TRENDS !== 'undefined') window.HOT_TRENDS = HOT_TRENDS; } catch (e) {}
try { if (typeof VALUE_BETS !== 'undefined') window.VALUE_BETS = VALUE_BETS; } catch (e) {}
try { if (typeof COUNTRY_LEAGUES_DATA !== 'undefined') window.COUNTRY_LEAGUES_DATA = COUNTRY_LEAGUES_DATA; } catch (e) {}
try { if (typeof TOP_LEAGUES_DATA !== 'undefined') window.TOP_LEAGUES_DATA = TOP_LEAGUES_DATA; } catch (e) {}

// Auto-Export Window Bindings for data.js

