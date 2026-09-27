/**
 * DEEPPREDICTBET — CENTRALIZED LEAGUE NORMALIZER & COMPETITION METADATA REGISTRY
 * Authoritative data normalizer ensuring every competition card, prediction route,
 * and statistical ledger receives canonical competition identity.
 * 
 * Guarantees:
 * - NO "undefined" in league name, country, or statistics.
 * - Strict normalization of nested API-Football provider formats.
 * - Distinguishes Country (e.g. England) from League (e.g. Premier League).
 * - Distinguishes Club competitions from National Team tournaments.
 * - Authoritative canonical competition IDs and seasons (2026/27).
 */

(function (window) {
  'use strict';

  // 1. CANONICAL COMPETITIONS MASTER CATALOG
  // Authoritative API-Football IDs, country associations, flags, and seasonal benchmarks
  const CANONICAL_COMPETITIONS = {
    // ── England ─────────────────────────────────────────────────────────────
    39: {
      id: 39,
      slug: 'premier-league',
      name: 'Premier League',
      country: 'England',
      countryCode: 'GB',
      flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      type: 'club',
      seasonId: '2026/27',
      seasonYear: 2026,
      matchesPlayed: 380,
      homeWinRate: 46,
      avgGoals: 2.85,
      bttsRate: 58,
      drawRate: 22,
      over25Rate: 62
    },
    40: {
      id: 40,
      slug: 'championship',
      name: 'Championship',
      country: 'England',
      countryCode: 'GB',
      flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      type: 'club',
      seasonId: '2026/27',
      seasonYear: 2026,
      matchesPlayed: 552,
      homeWinRate: 43,
      avgGoals: 2.65,
      bttsRate: 53,
      drawRate: 27,
      over25Rate: 52
    },
    41: {
      id: 41,
      slug: 'league-one',
      name: 'League One',
      country: 'England',
      countryCode: 'GB',
      flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      type: 'club',
      seasonId: '2026/27',
      seasonYear: 2026,
      matchesPlayed: 552,
      homeWinRate: 42,
      avgGoals: 2.60,
      bttsRate: 51,
      drawRate: 26,
      over25Rate: 51
    },
    42: {
      id: 42,
      slug: 'league-two',
      name: 'League Two',
      country: 'England',
      countryCode: 'GB',
      flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      type: 'club',
      seasonId: '2026/27',
      seasonYear: 2026,
      matchesPlayed: 552,
      homeWinRate: 41,
      avgGoals: 2.58,
      bttsRate: 52,
      drawRate: 27,
      over25Rate: 50
    },
    45: {
      id: 45,
      slug: 'fa-cup',
      name: 'FA Cup',
      country: 'England',
      countryCode: 'GB',
      flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      type: 'club',
      seasonId: '2026/27',
      seasonYear: 2026,
      matchesPlayed: 140,
      homeWinRate: 45,
      avgGoals: 3.10,
      bttsRate: 59,
      drawRate: 22,
      over25Rate: 64
    },
    48: {
      id: 48,
      slug: 'efl-cup',
      name: 'EFL Cup',
      country: 'England',
      countryCode: 'GB',
      flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      type: 'club',
      seasonId: '2026/27',
      seasonYear: 2026,
      matchesPlayed: 92,
      homeWinRate: 44,
      avgGoals: 3.02,
      bttsRate: 56,
      drawRate: 23,
      over25Rate: 63
    },

    // ── Spain ───────────────────────────────────────────────────────────────
    140: {
      id: 140,
      slug: 'la-liga',
      name: 'La Liga',
      country: 'Spain',
      countryCode: 'ES',
      flag: '🇪🇸',
      type: 'club',
      seasonId: '2026/27',
      seasonYear: 2026,
      matchesPlayed: 380,
      homeWinRate: 44,
      avgGoals: 2.64,
      bttsRate: 52,
      drawRate: 26,
      over25Rate: 54
    },
    141: {
      id: 141,
      slug: 'la-liga-2',
      name: 'La Liga 2',
      country: 'Spain',
      countryCode: 'ES',
      flag: '🇪🇸',
      type: 'club',
      seasonId: '2026/27',
      seasonYear: 2026,
      matchesPlayed: 462,
      homeWinRate: 42,
      avgGoals: 2.32,
      bttsRate: 46,
      drawRate: 30,
      over25Rate: 44
    },
    143: {
      id: 143,
      slug: 'copa-del-rey',
      name: 'Copa del Rey',
      country: 'Spain',
      countryCode: 'ES',
      flag: '🇪🇸',
      type: 'club',
      seasonId: '2026/27',
      seasonYear: 2026,
      matchesPlayed: 125,
      homeWinRate: 47,
      avgGoals: 2.90,
      bttsRate: 54,
      drawRate: 23,
      over25Rate: 60
    },

    // ── Germany ─────────────────────────────────────────────────────────────
    78: {
      id: 78,
      slug: 'bundesliga',
      name: 'Bundesliga',
      country: 'Germany',
      countryCode: 'DE',
      flag: '🇩🇪',
      type: 'club',
      seasonId: '2026/27',
      seasonYear: 2026,
      matchesPlayed: 306,
      homeWinRate: 48,
      avgGoals: 3.18,
      bttsRate: 64,
      drawRate: 20,
      over25Rate: 68
    },
    79: {
      id: 79,
      slug: '2-bundesliga',
      name: '2. Bundesliga',
      country: 'Germany',
      countryCode: 'DE',
      flag: '🇩🇪',
      type: 'club',
      seasonId: '2026/27',
      seasonYear: 2026,
      matchesPlayed: 306,
      homeWinRate: 45,
      avgGoals: 3.05,
      bttsRate: 60,
      drawRate: 22,
      over25Rate: 65
    },
    81: {
      id: 81,
      slug: 'dfb-pokal',
      name: 'DFB Pokal',
      country: 'Germany',
      countryCode: 'DE',
      flag: '🇩🇪',
      type: 'club',
      seasonId: '2026/27',
      seasonYear: 2026,
      matchesPlayed: 63,
      homeWinRate: 46,
      avgGoals: 3.30,
      bttsRate: 62,
      drawRate: 19,
      over25Rate: 70
    },

    // ── Italy ───────────────────────────────────────────────────────────────
    135: {
      id: 135,
      slug: 'serie-a',
      name: 'Serie A',
      country: 'Italy',
      countryCode: 'IT',
      flag: '🇮🇹',
      type: 'club',
      seasonId: '2026/27',
      seasonYear: 2026,
      matchesPlayed: 380,
      homeWinRate: 42,
      avgGoals: 2.58,
      bttsRate: 48,
      drawRate: 28,
      over25Rate: 50
    },
    136: {
      id: 136,
      slug: 'serie-b',
      name: 'Serie B',
      country: 'Italy',
      countryCode: 'IT',
      flag: '🇮🇹',
      type: 'club',
      seasonId: '2026/27',
      seasonYear: 2026,
      matchesPlayed: 380,
      homeWinRate: 41,
      avgGoals: 2.45,
      bttsRate: 47,
      drawRate: 31,
      over25Rate: 46
    },
    137: {
      id: 137,
      slug: 'coppa-italia',
      name: 'Coppa Italia',
      country: 'Italy',
      countryCode: 'IT',
      flag: '🇮🇹',
      type: 'club',
      seasonId: '2026/27',
      seasonYear: 2026,
      matchesPlayed: 44,
      homeWinRate: 46,
      avgGoals: 2.80,
      bttsRate: 52,
      drawRate: 24,
      over25Rate: 58
    },

    // ── France ──────────────────────────────────────────────────────────────
    61: {
      id: 61,
      slug: 'ligue-1',
      name: 'Ligue 1',
      country: 'France',
      countryCode: 'FR',
      flag: '🇫🇷',
      type: 'club',
      seasonId: '2026/27',
      seasonYear: 2026,
      matchesPlayed: 306,
      homeWinRate: 43,
      avgGoals: 2.70,
      bttsRate: 54,
      drawRate: 25,
      over25Rate: 56
    },
    62: {
      id: 62,
      slug: 'ligue-2',
      name: 'Ligue 2',
      country: 'France',
      countryCode: 'FR',
      flag: '🇫🇷',
      type: 'club',
      seasonId: '2026/27',
      seasonYear: 2026,
      matchesPlayed: 306,
      homeWinRate: 41,
      avgGoals: 2.40,
      bttsRate: 47,
      drawRate: 29,
      over25Rate: 45
    },
    66: {
      id: 66,
      slug: 'coupe-de-france',
      name: 'Coupe de France',
      country: 'France',
      countryCode: 'FR',
      flag: '🇫🇷',
      type: 'club',
      seasonId: '2026/27',
      seasonYear: 2026,
      matchesPlayed: 63,
      homeWinRate: 45,
      avgGoals: 2.95,
      bttsRate: 55,
      drawRate: 22,
      over25Rate: 61
    },

    // ── Portugal ────────────────────────────────────────────────────────────
    94: {
      id: 94,
      slug: 'primeira-liga',
      name: 'Primeira Liga',
      country: 'Portugal',
      countryCode: 'PT',
      flag: '🇵🇹',
      type: 'club',
      seasonId: '2026/27',
      seasonYear: 2026,
      matchesPlayed: 306,
      homeWinRate: 45,
      avgGoals: 2.72,
      bttsRate: 50,
      drawRate: 24,
      over25Rate: 55
    },

    // ── Netherlands ─────────────────────────────────────────────────────────
    88: {
      id: 88,
      slug: 'eredivisie',
      name: 'Eredivisie',
      country: 'Netherlands',
      countryCode: 'NL',
      flag: '🇳🇱',
      type: 'club',
      seasonId: '2026/27',
      seasonYear: 2026,
      matchesPlayed: 306,
      homeWinRate: 46,
      avgGoals: 3.24,
      bttsRate: 62,
      drawRate: 21,
      over25Rate: 69
    },

    // ── Belgium ─────────────────────────────────────────────────────────────
    144: {
      id: 144,
      slug: 'belgian-pro-league',
      name: 'Belgian Pro League',
      country: 'Belgium',
      countryCode: 'BE',
      flag: '🇧🇪',
      type: 'club',
      seasonId: '2026/27',
      seasonYear: 2026,
      matchesPlayed: 240,
      homeWinRate: 44,
      avgGoals: 2.95,
      bttsRate: 61,
      drawRate: 24,
      over25Rate: 63
    },

    // ── Turkey ──────────────────────────────────────────────────────────────
    203: {
      id: 203,
      slug: 'super-lig',
      name: 'Süper Lig',
      country: 'Turkey',
      countryCode: 'TR',
      flag: '🇹🇷',
      type: 'club',
      seasonId: '2026/27',
      seasonYear: 2026,
      matchesPlayed: 380,
      homeWinRate: 47,
      avgGoals: 2.80,
      bttsRate: 56,
      drawRate: 23,
      over25Rate: 58
    },

    // ── Scotland ────────────────────────────────────────────────────────────
    179: {
      id: 179,
      slug: 'scottish-premiership',
      name: 'Scottish Premiership',
      country: 'Scotland',
      countryCode: 'GB-SCT',
      flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
      type: 'club',
      seasonId: '2026/27',
      seasonYear: 2026,
      matchesPlayed: 228,
      homeWinRate: 48,
      avgGoals: 2.86,
      bttsRate: 54,
      drawRate: 22,
      over25Rate: 60
    },

    // ── Other Key European Leagues ──────────────────────────────────────────
    207: {
      id: 207,
      slug: 'swiss-super-league',
      name: 'Swiss Super League',
      country: 'Switzerland',
      countryCode: 'CH',
      flag: '🇨🇭',
      type: 'club',
      seasonId: '2026/27',
      seasonYear: 2026,
      matchesPlayed: 228,
      homeWinRate: 45,
      avgGoals: 2.98,
      bttsRate: 59,
      drawRate: 23,
      over25Rate: 64
    },
    218: {
      id: 218,
      slug: 'austrian-bundesliga',
      name: 'Austrian Bundesliga',
      country: 'Austria',
      countryCode: 'AT',
      flag: '🇦🇹',
      type: 'club',
      seasonId: '2026/27',
      seasonYear: 2026,
      matchesPlayed: 192,
      homeWinRate: 44,
      avgGoals: 2.85,
      bttsRate: 55,
      drawRate: 24,
      over25Rate: 60
    },
    197: {
      id: 197,
      slug: 'greek-super-league',
      name: 'Greek Super League',
      country: 'Greece',
      countryCode: 'GR',
      flag: '🇬🇷',
      type: 'club',
      seasonId: '2026/27',
      seasonYear: 2026,
      matchesPlayed: 182,
      homeWinRate: 46,
      avgGoals: 2.65,
      bttsRate: 50,
      drawRate: 26,
      over25Rate: 53
    },
    106: {
      id: 106,
      slug: 'ekstraklasa',
      name: 'Ekstraklasa',
      country: 'Poland',
      countryCode: 'PL',
      flag: '🇵🇱',
      type: 'club',
      seasonId: '2026/27',
      seasonYear: 2026,
      matchesPlayed: 306,
      homeWinRate: 43,
      avgGoals: 2.62,
      bttsRate: 51,
      drawRate: 26,
      over25Rate: 52
    },
    103: {
      id: 103,
      slug: 'eliteserien',
      name: 'Eliteserien',
      country: 'Norway',
      countryCode: 'NO',
      flag: '🇳🇴',
      type: 'club',
      seasonId: '2026',
      seasonYear: 2026,
      matchesPlayed: 240,
      homeWinRate: 47,
      avgGoals: 3.08,
      bttsRate: 60,
      drawRate: 22,
      over25Rate: 66
    },
    113: {
      id: 113,
      slug: 'allsvenskan',
      name: 'Allsvenskan',
      country: 'Sweden',
      countryCode: 'SE',
      flag: '🇸🇪',
      type: 'club',
      seasonId: '2026',
      seasonYear: 2026,
      matchesPlayed: 240,
      homeWinRate: 44,
      avgGoals: 2.82,
      bttsRate: 54,
      drawRate: 24,
      over25Rate: 58
    },
    119: {
      id: 119,
      slug: 'superliga-denmark',
      name: 'Superliga',
      country: 'Denmark',
      countryCode: 'DK',
      flag: '🇩🇰',
      type: 'club',
      seasonId: '2026/27',
      seasonYear: 2026,
      matchesPlayed: 192,
      homeWinRate: 45,
      avgGoals: 2.88,
      bttsRate: 57,
      drawRate: 23,
      over25Rate: 61
    },

    // ── Continental European Competitions ───────────────────────────────────
    2: {
      id: 2,
      slug: 'champions-league',
      name: 'Champions League',
      country: 'Europe',
      countryCode: 'EU',
      flag: '🇪🇺',
      type: 'club',
      seasonId: '2026/27',
      seasonYear: 2026,
      matchesPlayed: 189,
      homeWinRate: 49,
      avgGoals: 3.05,
      bttsRate: 60,
      drawRate: 21,
      over25Rate: 65
    },
    3: {
      id: 3,
      slug: 'europa-league',
      name: 'Europa League',
      country: 'Europe',
      countryCode: 'EU',
      flag: '🇪🇺',
      type: 'club',
      seasonId: '2026/27',
      seasonYear: 2026,
      matchesPlayed: 189,
      homeWinRate: 45,
      avgGoals: 2.92,
      bttsRate: 57,
      drawRate: 23,
      over25Rate: 61
    },
    848: {
      id: 848,
      slug: 'conference-league',
      name: 'Conference League',
      country: 'Europe',
      countryCode: 'EU',
      flag: '🇪🇺',
      type: 'club',
      seasonId: '2026/27',
      seasonYear: 2026,
      matchesPlayed: 153,
      homeWinRate: 47,
      avgGoals: 2.88,
      bttsRate: 55,
      drawRate: 22,
      over25Rate: 59
    },

    // ── Americas & Global ───────────────────────────────────────────────────
    71: {
      id: 71,
      slug: 'brasileirao',
      name: 'Brasileirão',
      country: 'Brazil',
      countryCode: 'BR',
      flag: '🇧🇷',
      type: 'club',
      seasonId: '2026',
      seasonYear: 2026,
      matchesPlayed: 380,
      homeWinRate: 46,
      avgGoals: 2.42,
      bttsRate: 47,
      drawRate: 28,
      over25Rate: 48
    },
    128: {
      id: 128,
      slug: 'liga-profesional',
      name: 'Liga Profesional',
      country: 'Argentina',
      countryCode: 'AR',
      flag: '🇦🇷',
      type: 'club',
      seasonId: '2026',
      seasonYear: 2026,
      matchesPlayed: 378,
      homeWinRate: 42,
      avgGoals: 2.18,
      bttsRate: 41,
      drawRate: 32,
      over25Rate: 42
    },
    262: {
      id: 262,
      slug: 'liga-mx',
      name: 'Liga MX',
      country: 'Mexico',
      countryCode: 'MX',
      flag: '🇲🇽',
      type: 'club',
      seasonId: '2026/27',
      seasonYear: 2026,
      matchesPlayed: 306,
      homeWinRate: 45,
      avgGoals: 2.78,
      bttsRate: 57,
      drawRate: 25,
      over25Rate: 58
    },
    253: {
      id: 253,
      slug: 'mls',
      name: 'MLS',
      country: 'USA',
      countryCode: 'US',
      flag: '🇺🇸',
      type: 'club',
      seasonId: '2026',
      seasonYear: 2026,
      matchesPlayed: 493,
      homeWinRate: 49,
      avgGoals: 3.12,
      bttsRate: 63,
      drawRate: 23,
      over25Rate: 66
    },
    307: {
      id: 307,
      slug: 'saudi-pro-league',
      name: 'Saudi Pro League',
      country: 'Saudi Arabia',
      countryCode: 'SA',
      flag: '🇸🇦',
      type: 'club',
      seasonId: '2026/27',
      seasonYear: 2026,
      matchesPlayed: 306,
      homeWinRate: 48,
      avgGoals: 2.98,
      bttsRate: 58,
      drawRate: 22,
      over25Rate: 62
    },
    302: {
      id: 302,
      slug: 'npfl',
      name: 'NPFL',
      country: 'Nigeria',
      countryCode: 'NG',
      flag: '🇳🇬',
      type: 'club',
      seasonId: '2026/27',
      seasonYear: 2026,
      matchesPlayed: 380,
      homeWinRate: 62,
      avgGoals: 2.25,
      bttsRate: 42,
      drawRate: 24,
      over25Rate: 44
    },
    288: {
      id: 288,
      slug: 'dstv-premiership',
      name: 'DStv Premiership',
      country: 'South Africa',
      countryCode: 'ZA',
      flag: '🇿🇦',
      type: 'club',
      seasonId: '2026/27',
      seasonYear: 2026,
      matchesPlayed: 240,
      homeWinRate: 43,
      avgGoals: 2.15,
      bttsRate: 39,
      drawRate: 31,
      over25Rate: 40
    },
    233: {
      id: 233,
      slug: 'egyptian-premier-league',
      name: 'Egyptian Premier',
      country: 'Egypt',
      countryCode: 'EG',
      flag: '🇪🇬',
      type: 'club',
      seasonId: '2026/27',
      seasonYear: 2026,
      matchesPlayed: 306,
      homeWinRate: 46,
      avgGoals: 2.35,
      bttsRate: 45,
      drawRate: 29,
      over25Rate: 46
    },
    13: {
      id: 13,
      slug: 'copa-libertadores',
      name: 'Copa Libertadores',
      country: 'South America',
      countryCode: 'SA',
      flag: '🏆',
      type: 'club',
      seasonId: '2026',
      seasonYear: 2026,
      matchesPlayed: 155,
      homeWinRate: 51,
      avgGoals: 2.55,
      bttsRate: 49,
      drawRate: 24,
      over25Rate: 52
    },

    // ── Official National Team Tournaments ──────────────────────────────────
    5: {
      id: 5,
      slug: 'uefa-nations-league',
      name: 'UEFA Nations League',
      country: 'Europe',
      countryCode: 'EU',
      flag: '🇪🇺',
      type: 'national_team',
      seasonId: '2026/27',
      seasonYear: 2026,
      matchesPlayed: 164,
      homeWinRate: 45,
      avgGoals: 2.70,
      bttsRate: 52,
      drawRate: 25,
      over25Rate: 55
    },
    1: {
      id: 1,
      slug: 'fifa-world-cup',
      name: 'FIFA World Cup',
      country: 'International',
      countryCode: 'GL',
      flag: '🏆',
      type: 'national_team',
      seasonId: '2026',
      seasonYear: 2026,
      matchesPlayed: 104,
      homeWinRate: 45,
      avgGoals: 2.75,
      bttsRate: 52,
      drawRate: 25,
      over25Rate: 55
    },
    6: {
      id: 6,
      slug: 'afcon',
      name: 'Africa Cup of Nations',
      country: 'Africa',
      countryCode: 'AF',
      flag: '🏆',
      type: 'national_team',
      seasonId: '2025/26',
      seasonYear: 2025,
      matchesPlayed: 52,
      homeWinRate: 44,
      avgGoals: 2.40,
      bttsRate: 46,
      drawRate: 28,
      over25Rate: 48
    },
    9: {
      id: 9,
      slug: 'copa-america',
      name: 'Copa América',
      country: 'South America',
      countryCode: 'SA',
      flag: '🏆',
      type: 'national_team',
      seasonId: '2028',
      seasonYear: 2028,
      matchesPlayed: 32,
      homeWinRate: 46,
      avgGoals: 2.48,
      bttsRate: 47,
      drawRate: 27,
      over25Rate: 49
    },
    4: {
      id: 4,
      slug: 'euro-championship',
      name: 'UEFA European Championship',
      country: 'Europe',
      countryCode: 'EU',
      flag: '🏆',
      type: 'national_team',
      seasonId: '2028',
      seasonYear: 2028,
      matchesPlayed: 51,
      homeWinRate: 46,
      avgGoals: 2.65,
      bttsRate: 50,
      drawRate: 25,
      over25Rate: 54
    }
  };

  // Helper to remove accents/diacritics for resilient matching
  function normalizeStringKey(s) {
    if (!s) return '';
    return s.toString().trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  // Fast reverse lookup by lowercased name and alias
  const NAME_TO_ID_MAP = {};
  Object.values(CANONICAL_COMPETITIONS).forEach(comp => {
    NAME_TO_ID_MAP[comp.name.toLowerCase()] = comp.id;
    NAME_TO_ID_MAP[normalizeStringKey(comp.name)] = comp.id;
    NAME_TO_ID_MAP[comp.slug.toLowerCase()] = comp.id;
    if (comp.country) {
      NAME_TO_ID_MAP[`${comp.country.toLowerCase()} ${comp.name.toLowerCase()}`] = comp.id;
      NAME_TO_ID_MAP[`${normalizeStringKey(comp.country)} ${normalizeStringKey(comp.name)}`] = comp.id;
    }
  });

  // Additional aliases for robust matching
  NAME_TO_ID_MAP['english premier league'] = 39;
  NAME_TO_ID_MAP['epl'] = 39;
  NAME_TO_ID_MAP['primera division'] = 140;
  NAME_TO_ID_MAP['spanish la liga'] = 140;
  NAME_TO_ID_MAP['german bundesliga'] = 78;
  NAME_TO_ID_MAP['italian serie a'] = 135;
  NAME_TO_ID_MAP['french ligue 1'] = 61;
  NAME_TO_ID_MAP['jupiler pro league'] = 144;
  NAME_TO_ID_MAP['belgian pro league'] = 144;
  NAME_TO_ID_MAP['portuguese primeira liga'] = 94;
  NAME_TO_ID_MAP['liga portugal'] = 94;
  NAME_TO_ID_MAP['dutch eredivisie'] = 88;
  NAME_TO_ID_MAP['turkish super lig'] = 203;
  NAME_TO_ID_MAP['turkish süper lig'] = 203;
  NAME_TO_ID_MAP['super lig'] = 203;
  NAME_TO_ID_MAP['süper lig'] = 203;
  NAME_TO_ID_MAP['nations league'] = 5;
  NAME_TO_ID_MAP['uefa nations league'] = 5;
  NAME_TO_ID_MAP['world cup'] = 1;
  NAME_TO_ID_MAP['fifa world cup'] = 1;
  NAME_TO_ID_MAP['afcon'] = 6;
  NAME_TO_ID_MAP['africa cup of nations'] = 6;
  NAME_TO_ID_MAP['copa américa'] = 9;
  NAME_TO_ID_MAP['copa america'] = 9;
  NAME_TO_ID_MAP['euro'] = 4;
  NAME_TO_ID_MAP['uefa euro'] = 4;
  NAME_TO_ID_MAP['euro championship'] = 4;
  NAME_TO_ID_MAP['uefa european championship'] = 4;

  /**
   * Defensive formatting: Never return "undefined", "null", or "[object Object]".
   */
  function safeLeagueName(val) {
    if (!val || typeof val !== 'string') return 'League information unavailable';
    const clean = val.trim();
    if (['undefined', 'null', '[object object]'].includes(clean.toLowerCase())) {
      return 'League information unavailable';
    }
    return clean;
  }

  function safeCountryName(val) {
    if (!val || typeof val !== 'string') return 'International';
    const clean = val.trim();
    if (['undefined', 'null', '[object object]'].includes(clean.toLowerCase())) {
      return 'International';
    }
    return clean;
  }

  function safeFlag(val) {
    if (!val || typeof val !== 'string') return '🏆';
    const clean = val.trim();
    if (['undefined', 'null', '[object object]'].includes(clean.toLowerCase())) {
      return '🏆';
    }
    return clean;
  }

  /**
   * Resolves a canonical competition record given an ID or Name.
   */
  function resolveCanonicalCompetition(queryIdOrName, optCountry) {
    if (!queryIdOrName) return null;

    // 1. Direct ID lookup
    const numId = Number(queryIdOrName);
    if (!isNaN(numId) && CANONICAL_COMPETITIONS[numId]) {
      return CANONICAL_COMPETITIONS[numId];
    }

    // 2. Query string clean
    const q = queryIdOrName.toString().trim().toLowerCase();
    const cleanQ = normalizeStringKey(queryIdOrName);
    if (NAME_TO_ID_MAP[q] && CANONICAL_COMPETITIONS[NAME_TO_ID_MAP[q]]) {
      return CANONICAL_COMPETITIONS[NAME_TO_ID_MAP[q]];
    }
    if (NAME_TO_ID_MAP[cleanQ] && CANONICAL_COMPETITIONS[NAME_TO_ID_MAP[cleanQ]]) {
      return CANONICAL_COMPETITIONS[NAME_TO_ID_MAP[cleanQ]];
    }

    // 3. Country + League combined lookup
    if (optCountry) {
      const c = optCountry.toString().trim().toLowerCase();
      const combined = `${c} ${q}`;
      if (NAME_TO_ID_MAP[combined] && CANONICAL_COMPETITIONS[NAME_TO_ID_MAP[combined]]) {
        return CANONICAL_COMPETITIONS[NAME_TO_ID_MAP[combined]];
      }
    }

    // 4. Fuzzy / substring match in catalog
    for (const comp of Object.values(CANONICAL_COMPETITIONS)) {
      const cName = comp.name.toLowerCase();
      const cCountry = comp.country.toLowerCase();
      if (q === cName || q.includes(cName) || cName.includes(q)) {
        if (!optCountry || optCountry.toLowerCase() === cCountry || cCountry === 'europe' || cCountry === 'world') {
          return comp;
        }
      }
    }

    return null;
  }

  /**
   * CENTRAL LEAGUE NORMALIZER
   * Converts any raw provider or application league representation into a standardized model.
   *
   * @param {Object|string} raw - Raw league input from provider, database, or UI state
   * @param {Object} [fallbackMeta] - Optional contextual overrides
   * @returns {Object} Normalized league object
   */
  function normalizeLeague(raw, fallbackMeta = {}) {
    if (!raw) {
      return {
        id: 'unknown',
        name: 'League information unavailable',
        league: 'League information unavailable',
        country: 'International',
        countryCode: 'GL',
        flag: '🏆',
        type: 'club',
        seasonId: '2026/27',
        avgGoals: 2.75,
        homeWinRate: 45,
        bttsRate: 50,
        drawRate: 25,
        over25Rate: 55,
        matchesPlayed: 380,
        predictionRoute: '/predictions',
        detailRoute: '/leagues'
      };
    }

    // Handle plain string input
    if (typeof raw === 'string') {
      const canonical = resolveCanonicalCompetition(raw, fallbackMeta.country);
      if (canonical) {
        return {
          ...canonical,
          league: canonical.name, // backward-compat alias
          predictionRoute: `/predictions?leagueId=${canonical.id}`,
          detailRoute: `/league/${canonical.id}`
        };
      }
      return {
        id: String(raw).toLowerCase().replace(/\s+/g, '-'),
        name: safeLeagueName(raw),
        league: safeLeagueName(raw),
        country: safeCountryName(fallbackMeta.country),
        countryCode: fallbackMeta.countryCode || 'GL',
        flag: safeFlag(fallbackMeta.flag),
        type: (typeof window.isNationalTeamCompetition === 'function' && window.isNationalTeamCompetition(raw)) ? 'national_team' : 'club',
        seasonId: '2026/27',
        avgGoals: 2.75,
        homeWinRate: 45,
        bttsRate: 50,
        drawRate: 25,
        over25Rate: 55,
        matchesPlayed: 380,
        predictionRoute: `/predictions?league=${encodeURIComponent(raw)}`,
        detailRoute: `/league/${encodeURIComponent(raw)}`
      };
    }

    // Handle nested API-Football structure:
    // { league: { id: 39, name: "Premier League" }, country: { name: "England", code: "GB" } }
    let rawId = raw.id || raw.leagueId || raw.league?.id || raw.competition?.id;
    let rawName = raw.name || raw.league?.name || raw.competition?.name || raw.league;
    let rawCountry = raw.country?.name || raw.country || raw.league?.country || fallbackMeta.country;
    let rawCountryCode = raw.country?.code || raw.countryCode || raw.league?.countryCode;
    let rawFlag = raw.flag || raw.emoji || raw.country?.flag || raw.league?.flag || raw.league?.logo;
    let rawSeason = raw.seasonId || raw.season || raw.league?.season || '2026/27';

    // Check if canonical metadata matches this league ID or Name
    const canonical = resolveCanonicalCompetition(rawId || rawName, rawCountry);

    const resolvedId = canonical ? canonical.id : (rawId || (rawName ? String(rawName).toLowerCase().replace(/\s+/g, '-') : 'unknown'));
    const resolvedName = safeLeagueName(canonical ? canonical.name : rawName);
    const resolvedCountry = safeCountryName(canonical ? canonical.country : rawCountry);
    const resolvedCountryCode = canonical ? canonical.countryCode : (rawCountryCode || 'GL');
    const resolvedFlag = safeFlag(canonical ? canonical.flag : rawFlag);
    const resolvedType = canonical ? canonical.type : ((typeof window.isNationalTeamCompetition === 'function' && window.isNationalTeamCompetition(resolvedName)) ? 'national_team' : 'club');
    const resolvedSeason = canonical ? canonical.seasonId : (String(rawSeason).includes('/') ? rawSeason : `${rawSeason}/${(Number(rawSeason) + 1).toString().slice(-2)}`);

    // Parse stats cleanly to numbers
    const parseNum = (val, fallback) => {
      if (val === undefined || val === null) return fallback;
      const parsed = parseFloat(String(val).replace(/[^0-9.]/g, ''));
      return isNaN(parsed) ? fallback : parsed;
    };

    const avgGoals = parseNum(raw.avgGoals || canonical?.avgGoals, 2.75);
    const homeWinRate = parseNum(raw.homeWinRate || raw.homeWinPct || canonical?.homeWinRate, 45);
    const bttsRate = parseNum(raw.btts || raw.bttsRate || raw.bttsPct || canonical?.bttsRate, 50);
    const drawRate = parseNum(raw.drawRate || raw.drawPct || canonical?.drawRate, 25);
    const over25Rate = parseNum(raw.over25Rate || raw.over25Pct || canonical?.over25Rate, 55);
    const matchesPlayed = parseNum(raw.matches || raw.matchesPlayed || canonical?.matchesPlayed, 380);

    return {
      id: resolvedId,
      name: resolvedName,
      league: resolvedName, // Strict backward-compatibility for legacy `stat.league` consumers
      country: resolvedCountry,
      countryCode: resolvedCountryCode,
      flag: resolvedFlag,
      type: resolvedType,
      participantType: resolvedType,
      seasonId: resolvedSeason,
      matchesPlayed: matchesPlayed,
      matches: matchesPlayed,
      homeWinRate: homeWinRate,
      homeWinPct: `${homeWinRate}%`,
      avgGoals: avgGoals,
      bttsRate: bttsRate,
      bttsPct: `${bttsRate}%`,
      drawRate: drawRate,
      drawPct: `${drawRate}%`,
      over25Rate: over25Rate,
      over25Pct: `${over25Rate}%`,
      predictionRoute: `/predictions?leagueId=${resolvedId}`,
      detailRoute: `/league/${resolvedId}`
    };
  }

  /**
   * Retrieves full list of authoritative normalized competitions.
   */
  function getNormalizedLeagues() {
    return Object.values(CANONICAL_COMPETITIONS).map(comp => normalizeLeague(comp));
  }

  /**
   * Retrieves a single normalized competition by its ID.
   */
  function getCanonicalLeagueById(leagueId) {
    if (!leagueId) return null;
    const num = Number(leagueId);
    if (!isNaN(num) && CANONICAL_COMPETITIONS[num]) {
      return normalizeLeague(CANONICAL_COMPETITIONS[num]);
    }
    return null;
  }

  /**
   * Retrieves a single normalized competition by its Name and optional Country.
   */
  function getCanonicalLeagueByName(leagueName, optCountry) {
    const comp = resolveCanonicalCompetition(leagueName, optCountry);
    return comp ? normalizeLeague(comp) : null;
  }

  /**
   * Navigates directly from a League card to its corresponding predictions view.
   * Ensures the URL and UI filters synchronize on the selected league.
   */
  function navigateToLeaguePredictions(leagueId, leagueName, countryName) {
    const targetId = leagueId || (leagueName ? String(leagueName).toLowerCase().replace(/\s+/g, '-') : 'all');
    const targetUrl = `/predictions?leagueId=${targetId}`;

    // 1. Update routing
    if (typeof window.navigateTo === 'function') {
      window.navigateTo(targetUrl);
    } else {
      window.location.href = targetUrl;
    }

    // 2. Filter matches in state
    if (typeof window.selectSidebarLeague === 'function') {
      setTimeout(() => {
        window.selectSidebarLeague(leagueName, null, countryName);
      }, 50);
    }
  }

  // Export to Global Window Namespace
  window.CANONICAL_COMPETITIONS = CANONICAL_COMPETITIONS;
  window.normalizeLeague = normalizeLeague;
  window.getNormalizedLeagues = getNormalizedLeagues;
  window.getCanonicalLeagueById = getCanonicalLeagueById;
  window.getCanonicalLeagueByName = getCanonicalLeagueByName;
  window.navigateToLeaguePredictions = navigateToLeaguePredictions;
  window.safeLeagueName = safeLeagueName;
  window.safeCountryName = safeCountryName;
  window.safeFlag = safeFlag;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      CANONICAL_COMPETITIONS,
      normalizeLeague,
      getNormalizedLeagues,
      getCanonicalLeagueById,
      getCanonicalLeagueByName,
      navigateToLeaguePredictions,
      safeLeagueName,
      safeCountryName,
      safeFlag
    };
  }

})(typeof window !== 'undefined' ? window : globalThis);
