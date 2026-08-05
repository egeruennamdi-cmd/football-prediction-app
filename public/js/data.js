const MATCH_DATA = [
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
    topTips: ["uo15", "uo35", "uoht05", "uo2h15", "c75", "c85"]
  },
  {
    id: "match-2",
    date: "tomorrow",
    league: "La Liga",
    leagueEmoji: "🇪🇸",
    time: "Tomorrow, 20:00",
    isLive: false,
    homeTeam: {
      name: "Real Madrid",
      logo: "⚪",
      form: ["W", "W", "W", "L", "W"]
    },
    awayTeam: {
      name: "Barcelona",
      logo: "🔵🔴",
      form: ["W", "W", "W", "W", "D"]
    },
    scores: { home: null, away: null },
    predictions: { home: 44, draw: 26, away: 30 },
    confidence: "medium",
    confidenceVal: 72,
    insight: "El Clásico. Real Madrid is undefeated in their last 15 home fixtures.",
    isPremium: true,
    aiAnalysis: "PREMIUM SCOUT REPORT: Real Madrid is entering this Clásico with a slight tactical edge due to Barcelona's recent defensive vulnerabilities in wide areas against transitions. Real Madrid's transition efficiency index is 9.4/10 compared to Barcelona's transition defense rating of 6.2/10. Recommended Pick: Real Madrid to win (Draw No Bet) or BTTS (Both Teams To Score) as a banker option.",
    topTips: ["uo15", "uoht05", "bttsht", "c75", "c85", "c95"]
  },
  {
    id: "match-3",
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
    insight: "Liverpool has scored in 100% of their home games this season.",
    isPremium: false,
    aiAnalysis: "Liverpool's home form under the Anfield lights is formidable. Tactical analysis indicates Chelsea's midfield double pivot will struggle against Liverpool's counter-pressing intensity. Our algorithmic simulation estimates a 55% chance for a Home win, with Both Teams To Score (BTTS) checking out at 68% probability. Predicted score: 3-1.",
    topTips: ["uo15", "uo35", "uoht05", "c75", "c85", "c95", "c105"]
  },
  {
    id: "match-4",
    date: "today",
    league: "Bundesliga",
    leagueEmoji: "🇩🇪",
    time: "Today, 15:30",
    isLive: false,
    homeTeam: {
      name: "Bayern Munich",
      logo: "🔴⚪",
      form: ["W", "W", "W", "W", "W"]
    },
    awayTeam: {
      name: "Dortmund",
      logo: "🟡⚫",
      form: ["W", "L", "W", "D", "W"]
    },
    scores: { home: null, away: null },
    predictions: { home: 68, draw: 18, away: 14 },
    confidence: "high",
    confidenceVal: 90,
    insight: "Bayern is averaging 3.2 goals per game. Dortmund conceded in 4 away games.",
    isPremium: false,
    aiAnalysis: "Klassiker dynamics favor Bayern Munich. The model indicates Bayern's central attacking overload index is extremely high. Dortmund is likely to set up in a low block, but their recent struggles to defend crosses will be exploited by Bayern's active wing play. Take Bayern Win & Over 2.5 match goals.",
    topTips: ["uo15", "uoht15", "btts2h", "c75", "c85"]
  },
  {
    id: "match-5",
    date: "tomorrow",
    league: "Serie A",
    leagueEmoji: "🇮🇹",
    time: "Tomorrow, 19:45",
    isLive: false,
    homeTeam: {
      name: "Inter Milan",
      logo: "🔵⚫🐍",
      form: ["W", "D", "W", "W", "L"]
    },
    awayTeam: {
      name: "AC Milan",
      logo: "🔴⚫👿",
      form: ["L", "W", "W", "D", "W"]
    },
    scores: { home: null, away: null },
    predictions: { home: 52, draw: 28, away: 20 },
    confidence: "medium",
    confidenceVal: 75,
    insight: "Derby della Madonnina. Inter won 4 of the last 5 derbies.",
    isPremium: true,
    aiAnalysis: "PREMIUM SCOUT REPORT: Inter's 3-5-2 system creates superior defensive stability compared to Milan's vulnerable 4-2-3-1 spacing. AC Milan's defensive line has been caught out repeatedly this season by vertical runs. We expect Inter to dominate the midfield battle. Recommended Premium Bet: Inter Milan Match Winner.",
    topTips: ["uo15", "uo2h05", "c75", "c85", "c95"]
  },
  {
    id: "match-6",
    date: "tomorrow",
    league: "Champions League",
    leagueEmoji: "🇪🇺",
    time: "Tomorrow, 20:00",
    isLive: false,
    homeTeam: {
      name: "Juventus",
      logo: "⚫⚪🦓",
      form: ["W", "W", "D", "D", "W"]
    },
    awayTeam: {
      name: "PSG",
      logo: "🗼",
      form: ["W", "W", "W", "W", "D"]
    },
    scores: { home: null, away: null },
    predictions: { home: 35, draw: 30, away: 35 },
    confidence: "medium",
    confidenceVal: 65,
    insight: "Tactical deadlock expected. Both teams average low defensive lines.",
    isPremium: false,
    aiAnalysis: "This is a very evenly matched fixture. Juventus will likely sit deep and look to hit PSG on the counter. PSG's attacking firepower is superior, but their defensive discipline in away European fixtures remains questionable. A draw is highly probable here (30%), making 'Under 2.5 goals' the safest structural investment.",
    topTips: ["uo15", "c75", "c85", "c95", "c105"]
  },
  {
    id: "match-7",
    date: "yesterday",
    league: "Premier League",
    leagueEmoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    time: "FT",
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
    scores: { home: 2, away: 0 },
    predictions: { home: 45, draw: 30, away: 25 },
    confidence: "medium",
    confidenceVal: 74,
    insight: "Manchester United secured a clean sheet victory at Old Trafford.",
    isPremium: false,
    aiAnalysis: "Old Trafford dynamics. Manchester United's vertical transition index was high (8.2). Newcastle struggled to defend early crosses.",
    topTips: ["uo15", "uoht05", "c75"]
  },
  {
    id: "match-8",
    date: "yesterday",
    league: "La Liga",
    leagueEmoji: "🇪🇸",
    time: "FT",
    isLive: false,
    homeTeam: {
      name: "Atletico Madrid",
      logo: "🔴⚪🐻",
      form: ["W", "D", "W", "L", "W"]
    },
    awayTeam: {
      name: "Athletic Bilbao",
      logo: "🦁🔴",
      form: ["L", "W", "D", "W", "D"]
    },
    scores: { home: 1, away: 1 },
    predictions: { home: 40, draw: 35, away: 25 },
    confidence: "medium",
    confidenceVal: 70,
    insight: "A tight defensive draw under Simeone's resilient block.",
    isPremium: false,
    aiAnalysis: "Low block comparison. Both teams set up with high defensive lines in possession but dropped to structured 4-4-2 blocks, neutralizing offensive wing runs.",
    topTips: ["uo15", "c75", "c85", "c95"]
  },
  {
    id: "match-9",
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
      name: "Frankfurt",
      logo: "🦅",
      form: ["D", "L", "W", "L", "W"]
    },
    scores: { home: 3, away: 1 },
    predictions: { home: 65, draw: 22, away: 13 },
    confidence: "high",
    confidenceVal: 88,
    insight: "Leverkusen continues their unbeaten campaign with high goal intensity.",
    isPremium: true,
    aiAnalysis: "Alonso's patterns. Leverkusen operated with inverted wing-backs that created central 3v2 overloads, yielding a 3.10 Expected Goals (xG) output.",
    topTips: ["uo15", "uo35", "uoht05", "c75", "c85"]
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

window.MATCH_DATA = MATCH_DATA;
window.MATCHES_DATA = MATCHES_DATA;
window.MATCH_STATS_DATA = MATCH_STATS_DATA;
window.LEAGUE_STATS_DATA = LEAGUE_STATS_DATA;
window.DAILY_TIPS = DAILY_TIPS;
window.HOT_TRENDS = HOT_TRENDS;
window.VALUE_BETS = VALUE_BETS;
window.COUNTRY_LEAGUES_DATA = COUNTRY_LEAGUES_DATA;
window.TOP_LEAGUES_DATA = TOP_LEAGUES_DATA;


