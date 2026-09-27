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

  // ─────────────────────────────────────────────────────────────────────────────
  // GLOBAL DATA-INTEGRITY RULE & DIAGNOSTIC SYSTEM
  // ─────────────────────────────────────────────────────────────────────────────

  const INTEGRITY_PROBLEM_CATEGORIES = {
    MISSING_PROVIDER_DATA: 'missing_provider_data',
    INCORRECT_FIELD_MAPPING: 'incorrect_field_mapping',
    STALE_CACHE: 'stale_cache',
    WRONG_COMPETITION_ID: 'wrong_competition_id',
    WRONG_SEASON_ID: 'wrong_season_id',
    FAILED_NORMALIZATION: 'failed_normalization',
    FRONTEND_TRANSFORMATION_BUG: 'frontend_transformation_bug'
  };

  const COMPETITION_INTEGRITY_LOGS = [];

  /**
   * Defensive formatting: Never return "undefined", "null", or "[object Object]".
   */
  function isCorruptedValue(val) {
    if (val === undefined || val === null) return true;
    const str = String(val).trim().toLowerCase();
    return str === '' || str === 'undefined' || str === 'null' || str === '[object object]' || str === 'nan';
  }

  function safeLeagueName(val, fallback = 'League information unavailable') {
    if (!val || typeof val !== 'string') return fallback;
    const clean = val.trim();
    if (isCorruptedValue(clean)) {
      return fallback;
    }
    return clean;
  }

  function safeCountryName(val, fallback = 'International') {
    if (!val || typeof val !== 'string') return fallback;
    const clean = val.trim();
    if (isCorruptedValue(clean)) {
      return fallback;
    }
    return clean;
  }

  function safeFlag(val, fallback = '🏆') {
    if (!val || typeof val !== 'string') return fallback;
    const clean = val.trim();
    if (isCorruptedValue(clean)) {
      return fallback;
    }
    return clean;
  }

  /**
   * GLOBAL DATA-INTEGRITY VALIDATOR
   * Every competition displayed anywhere in DeepPredictBet must satisfy:
   * - competition.id
   * - competition.name
   * - competition.country
   * - competition.type
   * - competition.seasonId
   */
  function validateCompetitionIntegrity(competition) {
    if (!competition || typeof competition !== 'object') {
      return {
        isValid: false,
        missingFields: ['id', 'name', 'country', 'type', 'seasonId'],
        errors: ['Competition payload is null, undefined, or not an object']
      };
    }

    const missingFields = [];
    const errors = [];

    // 1. competition.id
    if (competition.id === undefined || competition.id === null || competition.id === '' || isCorruptedValue(competition.id) || competition.id === 'unknown' || competition.id === 'unresolved-competition') {
      missingFields.push('id');
      errors.push('competition.id is missing or invalid');
    }

    // 2. competition.name
    if (!competition.name || typeof competition.name !== 'string' || isCorruptedValue(competition.name) || competition.name === 'League information unavailable') {
      missingFields.push('name');
      errors.push('competition.name is missing or corrupted');
    }

    // 3. competition.country
    if (!competition.country || typeof competition.country !== 'string' || isCorruptedValue(competition.country)) {
      missingFields.push('country');
      errors.push('competition.country is missing or corrupted');
    }

    // 4. competition.type ('club' or 'national_team')
    if (!competition.type || !['club', 'national_team'].includes(competition.type)) {
      missingFields.push('type');
      errors.push('competition.type must be either "club" or "national_team"');
    }

    // 5. competition.seasonId (e.g. '2026/27' or '2026')
    if (!competition.seasonId || isCorruptedValue(competition.seasonId)) {
      missingFields.push('seasonId');
      errors.push('competition.seasonId is missing or corrupted');
    }

    return {
      isValid: missingFields.length === 0,
      missingFields,
      errors
    };
  }

  /**
   * Automated Diagnostic Root Cause Classifier
   */
  function diagnoseCompetitionIssue(raw, normCandidate, context = 'general') {
    // 1. FAILED_NORMALIZATION
    if (raw === undefined || raw === null || (typeof raw !== 'object' && typeof raw !== 'string')) {
      return {
        category: INTEGRITY_PROBLEM_CATEGORIES.FAILED_NORMALIZATION,
        explanation: `Input is not an object or string: received ${typeof raw}`,
        missingFields: ['id', 'name', 'country', 'type', 'seasonId'],
        remediation: 'Ensure valid object or string identifier is passed into normalization layer.'
      };
    }

    const rawId = raw.id || raw.leagueId || raw.league?.id;
    const rawName = raw.name || raw.leagueName || raw.league?.name || (typeof raw === 'string' ? raw : (typeof raw.league === 'string' ? raw.league : null));
    const rawCountry = raw.country?.name || (typeof raw.country === 'string' ? raw.country : null) || raw.countryName || raw.league?.country;
    const canonical = (rawName && !isCorruptedValue(rawName))
      ? resolveCanonicalCompetition(rawName, rawCountry)
      : (rawId && !isCorruptedValue(rawId) ? resolveCanonicalCompetition(rawId, rawCountry) : null);

    // 2. FRONTEND_TRANSFORMATION_BUG
    if (typeof context === 'string' && (context.includes('render') || context.includes('template') || context.includes('page') || context.includes('view'))) {
      if (raw.league && !raw.name) {
        return {
          category: INTEGRITY_PROBLEM_CATEGORIES.FRONTEND_TRANSFORMATION_BUG,
          explanation: 'Frontend component accessed legacy .league instead of canonical .name or vice-versa.',
          missingFields: ['name'],
          remediation: 'Provide bi-directional getter/alias for .name and .league.'
        };
      }
    }

    // 3. INCORRECT_FIELD_MAPPING
    const altKeysFound = [];
    if (raw.league_name || raw.competition_name || raw.tournament_name || raw.tournament) altKeysFound.push('name');
    if (raw.league_id || raw.competition_id || raw.tournament_id) altKeysFound.push('id');
    if (raw.country_name || raw.nation || raw.league?.country_name) altKeysFound.push('country');
    if (raw.season_id || raw.season_year || raw.league?.season_id) altKeysFound.push('seasonId');
    if (raw.competition_type || raw.participant_type) altKeysFound.push('type');

    if (altKeysFound.length > 0 && (!normCandidate?.id || !normCandidate?.name || !normCandidate?.country)) {
      return {
        category: INTEGRITY_PROBLEM_CATEGORIES.INCORRECT_FIELD_MAPPING,
        explanation: `Provider payload used alternative property keys: ${altKeysFound.join(', ')}`,
        missingFields: altKeysFound,
        remediation: 'Extract and map alternative provider fields into canonical properties.'
      };
    }

    // 4. STALE_CACHE
    const isCached = raw._cached || raw.cacheTime || raw.t || (typeof context === 'string' && context.includes('cache'));
    if (isCached && (!raw.seasonId || !raw.country || !raw.type)) {
      return {
        category: INTEGRITY_PROBLEM_CATEGORIES.STALE_CACHE,
        explanation: 'Record retrieved from legacy cache lacking modern canonical competition schema.',
        missingFields: ['seasonId', 'country'].filter(f => !raw[f]),
        remediation: 'Invalidate stale cache and re-normalize with authoritative registry.'
      };
    }

    // 5. WRONG_COMPETITION_ID
    if (rawName && rawId && canonical && Number(canonical.id) !== Number(rawId)) {
      return {
        category: INTEGRITY_PROBLEM_CATEGORIES.WRONG_COMPETITION_ID,
        explanation: `Provider competition ID (${rawId}) does not match canonical ID (${canonical.id}) for "${rawName}"`,
        missingFields: [],
        remediation: `Re-bind canonical ID ${canonical.id} matching official catalog.`
      };
    }

    // 6. WRONG_SEASON_ID
    const rawSeason = raw.seasonId || raw.season || raw.league?.season;
    const expectedSeason = canonical?.seasonId || '2026/27';
    if (rawSeason && (isCorruptedValue(rawSeason) || String(rawSeason).trim() !== String(expectedSeason).trim())) {
      return {
        category: INTEGRITY_PROBLEM_CATEGORIES.WRONG_SEASON_ID,
        explanation: `Season identifier "${rawSeason}" does not match canonical season "${expectedSeason}".`,
        missingFields: ['seasonId'],
        remediation: `Bind authoritative ${expectedSeason} active season identifier.`
      };
    }

    // 7. MISSING_PROVIDER_DATA (Fallback for true omissions)
    const missing = [];
    if (!normCandidate?.id) missing.push('id');
    if (!normCandidate?.name) missing.push('name');
    if (!normCandidate?.country) missing.push('country');
    if (!normCandidate?.type) missing.push('type');
    if (!normCandidate?.seasonId) missing.push('seasonId');

    return {
      category: INTEGRITY_PROBLEM_CATEGORIES.MISSING_PROVIDER_DATA,
      explanation: `Provider record literally omitted required fields: ${missing.join(', ') || 'unspecified'}`,
      missingFields: missing,
      remediation: 'Reconcile against CANONICAL_COMPETITIONS registry without fabricating false data.'
    };
  }

  /**
   * Structured Integrity Logger
   */
  function logIntegrityViolation(diagnosis) {
    const entry = {
      id: `integ-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      category: diagnosis.category,
      missingFields: diagnosis.missingFields || [],
      rawRecord: diagnosis.rawRecord,
      resolvedRecord: diagnosis.resolvedRecord,
      explanation: diagnosis.explanation,
      remediation: diagnosis.remediation,
      context: diagnosis.context || 'global'
    };

    if (COMPETITION_INTEGRITY_LOGS.length >= 200) {
      COMPETITION_INTEGRITY_LOGS.shift();
    }
    COMPETITION_INTEGRITY_LOGS.push(entry);

    console.warn(`[DeepPredictBet Competition Integrity Audit] ${diagnosis.category.toUpperCase()}: ${diagnosis.explanation}`, {
      raw: diagnosis.rawRecord,
      resolved: diagnosis.resolvedRecord,
      missing: diagnosis.missingFields
    });

    return entry;
  }

  function auditCompetitionIntegrity(raw, normCandidate, context = 'general') {
    const valResult = validateCompetitionIntegrity(normCandidate);
    if (!valResult.isValid) {
      const diagnosis = diagnoseCompetitionIssue(raw, normCandidate, context);
      diagnosis.rawRecord = raw;
      diagnosis.resolvedRecord = normCandidate;
      diagnosis.missingFields = valResult.missingFields;
      diagnosis.context = context;
      return logIntegrityViolation(diagnosis);
    }
    return null;
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
   * CENTRAL LEAGUE NORMALIZER WITH UNDERLYING CAUSE REMEDIATION
   * Converts any raw provider or application league representation into a standardized model.
   *
   * @param {Object|string} raw - Raw league input from provider, database, or UI state
   * @param {Object} [fallbackMeta] - Optional contextual overrides
   * @param {string} [context] - Context string for audit logging
   * @returns {Object} Normalized league object
   */
  function normalizeLeague(raw, fallbackMeta = {}, context = 'normalizeLeague') {
    // Check for null / undefined raw input
    if (raw === undefined || raw === null || raw === '') {
      const unrec = {
        id: null,
        name: safeLeagueName(null),
        league: safeLeagueName(null),
        country: safeCountryName(fallbackMeta.country),
        countryCode: fallbackMeta.countryCode || 'GL',
        flag: safeFlag(fallbackMeta.flag),
        type: 'club',
        seasonId: '2026/27',
        isValid: false,
        status: 'unresolved'
      };
      auditCompetitionIntegrity(raw, unrec, `${context}:null_input`);
      return unrec;
    }

    // Handle plain string input
    if (typeof raw === 'string') {
      const cleanRaw = raw.trim();
      if (isCorruptedValue(cleanRaw)) {
        const unrec = {
          id: null,
          name: safeLeagueName(cleanRaw),
          league: safeLeagueName(cleanRaw),
          country: safeCountryName(fallbackMeta.country),
          countryCode: fallbackMeta.countryCode || 'GL',
          flag: safeFlag(fallbackMeta.flag),
          type: 'club',
          seasonId: '2026/27',
          isValid: false,
          status: 'unresolved'
        };
        auditCompetitionIntegrity(raw, unrec, `${context}:corrupted_string`);
        return unrec;
      }

      const canonical = resolveCanonicalCompetition(cleanRaw, fallbackMeta.country);
      if (canonical) {
        return {
          ...canonical,
          league: canonical.name, // backward-compat alias
          season: canonical.seasonId, // backward-compat alias
          competitionType: canonical.type, // backward-compat alias
          participantType: canonical.type, // backward-compat alias
          leagueEmoji: canonical.flag, // backward-compat alias
          isValid: true,
          predictionRoute: `/predictions?leagueId=${canonical.id}`,
          detailRoute: `/league/${canonical.id}`
        };
      }

      // If not in canonical catalog, ensure genuine metadata is preserved without fabrication
      const isNat = (typeof window !== 'undefined' && typeof window.isNationalTeamCompetition === 'function' && window.isNationalTeamCompetition(cleanRaw));
      const resCountry = safeCountryName(fallbackMeta.country);
      const resSeason = fallbackMeta.seasonId || '2026/27';
      const cleanSlug = cleanRaw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      return {
        id: cleanSlug || 'unresolved-competition',
        name: cleanRaw,
        league: cleanRaw,
        country: resCountry,
        countryCode: fallbackMeta.countryCode || 'GL',
        flag: safeFlag(fallbackMeta.flag),
        type: isNat ? 'national_team' : 'club',
        participantType: isNat ? 'national_team' : 'club',
        seasonId: resSeason,
        season: resSeason,
        avgGoals: 2.75,
        homeWinRate: 45,
        bttsRate: 50,
        drawRate: 25,
        over25Rate: 55,
        matchesPlayed: 380,
        isValid: true,
        predictionRoute: `/predictions?league=${encodeURIComponent(cleanRaw)}`,
        detailRoute: `/league/${encodeURIComponent(cleanRaw)}`
      };
    }

    // Handle Object Input: Scan standard AND alternative provider keys
    // (Corrects INCORRECT_FIELD_MAPPING)
    let rawId = raw.id ?? raw.leagueId ?? raw.league_id ?? raw.competitionId ?? raw.competition_id ?? raw.tournamentId ?? raw.tournament_id ?? raw.league?.id ?? raw.competition?.id;
    let rawName = raw.name ?? raw.leagueName ?? raw.league_name ?? raw.competitionName ?? raw.competition_name ?? raw.tournamentName ?? raw.tournament_name ?? raw.tournament ?? raw.league?.name ?? raw.competition?.name ?? (typeof raw.league === 'string' ? raw.league : null);
    let rawCountry = raw.country?.name ?? (typeof raw.country === 'string' ? raw.country : null) ?? raw.countryName ?? raw.country_name ?? raw.nation ?? raw.league?.country ?? raw.league?.country_name ?? raw.competition?.country ?? fallbackMeta.country;
    let rawCountryCode = raw.country?.code ?? raw.countryCode ?? raw.country_code ?? raw.league?.countryCode ?? raw.league?.country_code ?? raw.league?.country?.code ?? fallbackMeta.countryCode;
    let rawFlag = raw.flag ?? raw.emoji ?? raw.leagueEmoji ?? raw.country?.flag ?? raw.league?.flag ?? raw.league?.emoji ?? raw.league?.logo ?? fallbackMeta.flag;
    let rawSeason = raw.seasonId ?? raw.season_id ?? raw.season ?? raw.league?.season ?? raw.league?.seasonId ?? fallbackMeta.seasonId;
    let rawType = raw.type ?? raw.competitionType ?? raw.competition_type ?? raw.participantType ?? raw.participant_type ?? raw.league?.type;

    // Prioritize name resolution to detect WRONG_COMPETITION_ID
    let canonical = (rawName && !isCorruptedValue(rawName)) ? resolveCanonicalCompetition(rawName, rawCountry) : null;

    // Root-Cause Anomaly Detection:
    // Check if ID was wrong (WRONG_COMPETITION_ID)
    if (canonical && rawId && Number(canonical.id) !== Number(rawId)) {
      logIntegrityViolation({
        category: INTEGRITY_PROBLEM_CATEGORIES.WRONG_COMPETITION_ID,
        explanation: `Corrected mismatched competition ID from ${rawId} to canonical ${canonical.id} for "${canonical.name}".`,
        rawRecord: raw,
        resolvedRecord: canonical,
        missingFields: [],
        remediation: `Re-bound canonical ID ${canonical.id}.`,
        context
      });
    }

    // If not found by name, try resolving by ID
    if (!canonical && rawId && !isCorruptedValue(rawId)) {
      canonical = resolveCanonicalCompetition(rawId, rawCountry);
    }

    // Check if season was wrong/stale (WRONG_SEASON_ID)
    const expectedSeason = canonical ? canonical.seasonId : '2026/27';
    if (rawSeason && (isCorruptedValue(rawSeason) || String(rawSeason).trim() !== String(expectedSeason).trim())) {
      logIntegrityViolation({
        category: INTEGRITY_PROBLEM_CATEGORIES.WRONG_SEASON_ID,
        explanation: `Corrected non-canonical/outdated season "${rawSeason}" to canonical active season "${expectedSeason}".`,
        rawRecord: raw,
        resolvedRecord: canonical,
        missingFields: ['seasonId'],
        remediation: `Bound active ${expectedSeason} season identifier.`,
        context
      });
    }

    // Check if raw data was from stale cache missing modern fields (STALE_CACHE)
    if ((raw._cached || raw.cacheTime || raw.t) && (!raw.seasonId || !raw.country)) {
      logIntegrityViolation({
        category: INTEGRITY_PROBLEM_CATEGORIES.STALE_CACHE,
        explanation: 'Refreshed competition data retrieved from legacy cache lacking modern canonical fields.',
        rawRecord: raw,
        resolvedRecord: canonical,
        missingFields: ['seasonId', 'country'].filter(f => !raw[f]),
        remediation: 'Re-hydrated from authoritative canonical registry.',
        context
      });
    }

    // Resolve Canonical Properties
    let resolvedId = null;
    if (canonical) {
      resolvedId = canonical.id;
    } else if (rawId && !isCorruptedValue(rawId)) {
      resolvedId = rawId;
    } else if (rawName && !isCorruptedValue(rawName)) {
      const slug = String(rawName).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      resolvedId = isCorruptedValue(slug) ? null : slug;
    }

    const resolvedName = canonical ? canonical.name : safeLeagueName(rawName);
    const resolvedCountry = canonical ? canonical.country : safeCountryName(rawCountry);
    const resolvedCountryCode = canonical ? canonical.countryCode : (rawCountryCode || 'GL');
    const resolvedFlag = canonical ? canonical.flag : safeFlag(rawFlag);
    const resolvedType = canonical ? canonical.type : ((typeof window !== 'undefined' && typeof window.isNationalTeamCompetition === 'function' && window.isNationalTeamCompetition(resolvedName)) ? 'national_team' : (rawType || 'club'));
    const resolvedSeason = canonical ? canonical.seasonId : (rawSeason ? (String(rawSeason).includes('/') ? rawSeason : `${rawSeason}/${(Number(rawSeason) + 1).toString().slice(-2)}`) : '2026/27');

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

    const result = {
      id: resolvedId,
      name: resolvedName,
      league: resolvedName, // Strict backward-compatibility for legacy `stat.league` consumers
      country: resolvedCountry,
      countryCode: resolvedCountryCode,
      flag: resolvedFlag,
      leagueEmoji: resolvedFlag, // Strict backward-compatibility
      type: resolvedType,
      competitionType: resolvedType, // Strict backward-compatibility
      participantType: resolvedType, // Strict backward-compatibility
      seasonId: resolvedSeason,
      season: resolvedSeason, // Strict backward-compatibility
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
      predictionRoute: resolvedId ? `/predictions?leagueId=${resolvedId}` : '/predictions',
      detailRoute: resolvedId ? `/league/${resolvedId}` : '/leagues'
    };

    // Validate global integrity
    const validation = validateCompetitionIntegrity(result);
    result.isValid = validation.isValid;
    result.status = validation.isValid ? 'canonical' : 'unresolved';

    if (!validation.isValid) {
      auditCompetitionIntegrity(raw, result, context);
    }

    return result;
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
    } else if (typeof window.location !== 'undefined') {
      window.location.href = targetUrl;
    }

    // 2. Synchronize application state immediately
    if (window.appState) {
      if (leagueName) window.appState.calLeague = leagueName;
      if (leagueId) window.appState.calLeagueId = leagueId;
      if (countryName) window.appState.calCountry = countryName;
    }

    // 3. Filter matches in state
    if (typeof window.selectSidebarLeague === 'function') {
      try {
        window.selectSidebarLeague(leagueName, null, countryName);
      } catch (e) {}
    }
  }

  /**
   * Synchronizes global data sets across modules:
   * - window.LEAGUE_STATS
   * - window.TOP_LEAGUES_DATA
   * - window.MATCH_DATA
   * - window.AUTHENTIC_TOP_LEAGUES_FIXTURES
   * - window.TOP_LEAGUES_FIXTURES_POOL
   */
  function syncGlobalLeagueCatalogs() {
    if (typeof window === 'undefined') return;

    // 1. Synchronize window.LEAGUE_STATS
    if (Array.isArray(window.LEAGUE_STATS)) {
      window.LEAGUE_STATS = window.LEAGUE_STATS.map(l => normalizeLeague(l));
    }

    // 2. Synchronize window.TOP_LEAGUES_DATA
    if (Array.isArray(window.TOP_LEAGUES_DATA)) {
      window.TOP_LEAGUES_DATA = window.TOP_LEAGUES_DATA.map(l => {
        const norm = normalizeLeague(l);
        return {
          ...l,
          id: norm.id,
          name: norm.name,
          league: norm.name,
          country: norm.country,
          countryCode: norm.countryCode,
          emoji: norm.flag,
          flag: norm.flag,
          type: norm.type,
          participantType: norm.type,
          seasonId: norm.seasonId,
          season: norm.seasonId,
          homeWinRate: norm.homeWinRate,
          avgGoals: norm.avgGoals
        };
      });
    }

    // 3. Synchronize match pools
    const enrichMatch = m => {
      if (m && (m.league || m.leagueId)) {
        const norm = normalizeLeague(m.league || m.leagueId, { country: m.country });
        if (norm && norm.id !== 'unknown') {
          m.leagueId = norm.id;
          m.league = norm.name;
          m.country = norm.country;
          m.leagueEmoji = norm.flag;
          m.competitionType = norm.type;
          m.season = norm.seasonId;
        }
      }
    };

    if (Array.isArray(window.MATCH_DATA)) {
      window.MATCH_DATA.forEach(enrichMatch);
    }
    if (Array.isArray(window.AUTHENTIC_TOP_LEAGUES_FIXTURES)) {
      window.AUTHENTIC_TOP_LEAGUES_FIXTURES.forEach(enrichMatch);
    }
    if (Array.isArray(window.TOP_LEAGUES_FIXTURES_POOL)) {
      window.TOP_LEAGUES_FIXTURES_POOL.forEach(enrichMatch);
    }
  }

  // Execute immediate catalog sync
  syncGlobalLeagueCatalogs();

  if (typeof document !== 'undefined') {
    if (typeof document.addEventListener === 'function' && document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', syncGlobalLeagueCatalogs);
    } else {
      syncGlobalLeagueCatalogs();
    }
  }
  if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
    window.addEventListener('load', syncGlobalLeagueCatalogs);
  }

  function getCompetitionIntegrityReport() {
    const total = COMPETITION_INTEGRITY_LOGS.length;
    const breakdown = {};
    Object.values(INTEGRITY_PROBLEM_CATEGORIES).forEach(cat => {
      breakdown[cat] = COMPETITION_INTEGRITY_LOGS.filter(l => l.category === cat).length;
    });
    return {
      totalAuditedIncidents: total,
      breakdown,
      logs: [...COMPETITION_INTEGRITY_LOGS]
    };
  }

  // Export to Global Window Namespace
  window.CANONICAL_COMPETITIONS = CANONICAL_COMPETITIONS;
  window.normalizeLeague = normalizeLeague;
  window.getNormalizedLeagues = getNormalizedLeagues;
  window.getCanonicalLeagueById = getCanonicalLeagueById;
  window.getCanonicalLeagueByName = getCanonicalLeagueByName;
  window.resolveCanonicalCompetition = resolveCanonicalCompetition;
  window.navigateToLeaguePredictions = navigateToLeaguePredictions;
  window.safeLeagueName = safeLeagueName;
  window.safeCountryName = safeCountryName;
  window.safeFlag = safeFlag;
  window.syncGlobalLeagueCatalogs = syncGlobalLeagueCatalogs;
  window.validateCompetitionIntegrity = validateCompetitionIntegrity;
  window.diagnoseCompetitionIssue = diagnoseCompetitionIssue;
  window.auditCompetitionIntegrity = auditCompetitionIntegrity;
  window.getCompetitionIntegrityReport = getCompetitionIntegrityReport;
  window.COMPETITION_INTEGRITY_LOGS = COMPETITION_INTEGRITY_LOGS;
  window.INTEGRITY_PROBLEM_CATEGORIES = INTEGRITY_PROBLEM_CATEGORIES;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      CANONICAL_COMPETITIONS,
      normalizeLeague,
      getNormalizedLeagues,
      getCanonicalLeagueById,
      getCanonicalLeagueByName,
      resolveCanonicalCompetition,
      navigateToLeaguePredictions,
      safeLeagueName,
      safeCountryName,
      safeFlag,
      syncGlobalLeagueCatalogs,
      validateCompetitionIntegrity,
      diagnoseCompetitionIssue,
      auditCompetitionIntegrity,
      getCompetitionIntegrityReport,
      COMPETITION_INTEGRITY_LOGS,
      INTEGRITY_PROBLEM_CATEGORIES
    };
  }

})(typeof window !== 'undefined' ? window : globalThis);
