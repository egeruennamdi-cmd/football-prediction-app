/**
 * DeepPredictBet — Authoritative Bookmaker Registry & Converter Architecture
 * Single Source of Truth for:
 * - Dynamic Supported Bookmaker Count & Conversion Routes
 * - Standardized Product Language & Marketing Copy
 * - Bookmaker Dropdowns, Roles & Regional Variants
 * - Temporary Availability & Maintenance Gating
 * - Visual Supported Bookmakers Directory
 */

// =========================================================================
// 1. OFFICIAL PERMANENT PRODUCT LANGUAGE CONSTANTS
// =========================================================================
export const BOOKING_CODE_CONVERTER_HEADLINE = "Convert booking codes between supported bookmakers";
export const BOOKING_CODE_CONVERTER_DESCRIPTION = "Move your selections between available bookmakers without rebuilding your betslip manually.";
export const BOOKING_CODE_CONVERTER_ALT_DESCRIPTION = "Convert your booking code from one supported bookmaker to another without rebuilding your selections manually.";

// =========================================================================
// 2. AUTHORITATIVE BOOKMAKER REGISTRY (96 GENUINE INTEGRATIONS)
// =========================================================================
export const BOOKMAKER_REGISTRY = [
  {
    "id": "188bet",
    "name": "188BET",
    "emoji": "🌏",
    "primaryRegion": "Asia / Global",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "188bet",
        "label": "188BET -Asia",
        "region": "Asia",
        "emoji": "🌏"
      }
    ]
  },
  {
    "id": "1xbet",
    "name": "1xbet",
    "emoji": "🇧🇫",
    "primaryRegion": "Burkina Faso",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "1xbet:bf",
        "label": "1xbet -Burkina Faso",
        "region": "Burkina Faso",
        "emoji": "🇧🇫"
      },
      {
        "code": "1xbet:bj",
        "label": "1xbet -Benin",
        "region": "Benin",
        "emoji": "🇧🇯"
      },
      {
        "code": "1xbet:ci",
        "label": "1xbet -Côte D'Ivoire",
        "region": "Côte D'Ivoire",
        "emoji": "🇨🇮"
      },
      {
        "code": "1xbet:cm",
        "label": "1xbet -Cameroon",
        "region": "Cameroon",
        "emoji": "🇨🇲"
      },
      {
        "code": "1xbet:et",
        "label": "1xbet -Ethiopia",
        "region": "Ethiopia",
        "emoji": "🇪🇹"
      },
      {
        "code": "1xbet:gh",
        "label": "1xbet -Ghana",
        "region": "Ghana",
        "emoji": "🇬🇭"
      },
      {
        "code": "1xbet:in",
        "label": "1xbet -India",
        "region": "India",
        "emoji": "🇮🇳"
      },
      {
        "code": "1xbet:ke",
        "label": "1xbet -Kenya",
        "region": "Kenya",
        "emoji": "🇰🇪"
      },
      {
        "code": "1xbet:ml",
        "label": "1xbet -Mali",
        "region": "Mali",
        "emoji": "🇲🇱"
      },
      {
        "code": "1xbet:mw",
        "label": "1xbet -Malawi",
        "region": "Malawi",
        "emoji": "🇲🇼"
      },
      {
        "code": "1xbet:mz",
        "label": "1xbet -Mozambique",
        "region": "Mozambique",
        "emoji": "🇲🇿"
      },
      {
        "code": "1xbet:ng",
        "label": "1xbet -Nigeria",
        "region": "Nigeria",
        "emoji": "🇳🇬"
      },
      {
        "code": "1xbet:rw",
        "label": "1xbet -Rwanda",
        "region": "Rwanda",
        "emoji": "🇷🇼"
      },
      {
        "code": "1xbet:sn",
        "label": "1xbet -Senegal",
        "region": "Senegal",
        "emoji": "🇸🇳"
      },
      {
        "code": "1xbet:tz",
        "label": "1xbet -Tanzania",
        "region": "Tanzania",
        "emoji": "🇹🇿"
      },
      {
        "code": "1xbet:ug",
        "label": "1xbet -Uganda",
        "region": "Uganda",
        "emoji": "🇺🇬"
      },
      {
        "code": "1xbet:xx",
        "label": "1xbet -Global",
        "region": "Global",
        "emoji": "🌐"
      },
      {
        "code": "1xbet:za",
        "label": "1xbet -South Africa",
        "region": "South Africa",
        "emoji": "🇿🇦"
      },
      {
        "code": "1xbet:zm",
        "label": "1xbet -Zambia",
        "region": "Zambia",
        "emoji": "🇿🇲"
      }
    ]
  },
  {
    "id": "1xbit",
    "name": "1xbit",
    "emoji": "💎",
    "primaryRegion": "Crypto",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "1xbit",
        "label": "1xbit -Crypto",
        "region": "Crypto",
        "emoji": "💎"
      }
    ]
  },
  {
    "id": "20bet",
    "name": "20bet",
    "emoji": "🌐",
    "primaryRegion": "Global",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "20bet:xx",
        "label": "20bet -Global",
        "region": "Global",
        "emoji": "🌐"
      }
    ]
  },
  {
    "id": "22bet",
    "name": "22bet",
    "emoji": "🌐",
    "primaryRegion": "Global",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "22bet",
        "label": "22bet -Global",
        "region": "Global",
        "emoji": "🌐"
      },
      {
        "code": "_22bet_gh",
        "label": "22bet -Ghana",
        "region": "Ghana",
        "emoji": "🇬🇭"
      },
      {
        "code": "_22bet_ke",
        "label": "22bet -Kenya",
        "region": "Kenya",
        "emoji": "🇰🇪"
      },
      {
        "code": "_22bet_ng",
        "label": "22bet -Nigeria",
        "region": "Nigeria",
        "emoji": "🇳🇬"
      }
    ]
  },
  {
    "id": "888sport",
    "name": "888sport",
    "emoji": "🇬🇧",
    "primaryRegion": "Global",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "888sport",
        "label": "888sport -Global",
        "region": "Global",
        "emoji": "🇬🇧"
      }
    ]
  },
  {
    "id": "888starz",
    "name": "888starz",
    "emoji": "🌐",
    "primaryRegion": "Global",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "888starz:xx",
        "label": "888starz -Global",
        "region": "Global",
        "emoji": "🌐"
      }
    ]
  },
  {
    "id": "afropari",
    "name": "Afropari",
    "emoji": "🌍",
    "primaryRegion": "Africa",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "afropari",
        "label": "Afropari -Africa",
        "region": "Africa",
        "emoji": "🌍"
      }
    ]
  },
  {
    "id": "bangbet",
    "name": "Bangbet",
    "emoji": "🇬🇭",
    "primaryRegion": "Ghana",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "bangbet:gh",
        "label": "Bangbet -Ghana",
        "region": "Ghana",
        "emoji": "🇬🇭"
      },
      {
        "code": "bangbet:ke",
        "label": "Bangbet -Kenya",
        "region": "Kenya",
        "emoji": "🇰🇪"
      },
      {
        "code": "bangbet:ng",
        "label": "Bangbet -Nigeria",
        "region": "Nigeria",
        "emoji": "🇳🇬"
      }
    ]
  },
  {
    "id": "bcgame",
    "name": "BC.Game",
    "emoji": "💎",
    "primaryRegion": "Crypto",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "bcgame",
        "label": "BC.Game -Crypto",
        "region": "Crypto",
        "emoji": "💎"
      }
    ]
  },
  {
    "id": "bet365",
    "name": "Bet365",
    "emoji": "🇬🇧",
    "primaryRegion": "Global/UK",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "bet365",
        "label": "Bet365 -Global/UK",
        "region": "Global/UK",
        "emoji": "🇬🇧"
      }
    ]
  },
  {
    "id": "bet9ja",
    "name": "Bet9ja",
    "emoji": "🇳🇬",
    "primaryRegion": "Nigeria",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "bet9ja",
        "label": "Bet9ja -Nigeria",
        "region": "Nigeria",
        "emoji": "🇳🇬"
      }
    ]
  },
  {
    "id": "betandyou",
    "name": "Betandyou",
    "emoji": "🌐",
    "primaryRegion": "Global",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "betandyou",
        "label": "Betandyou -Global",
        "region": "Global",
        "emoji": "🌐"
      }
    ]
  },
  {
    "id": "betano",
    "name": "Betano",
    "emoji": "🇧🇷",
    "primaryRegion": "Brazil",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "betano:br",
        "label": "Betano -Brazil",
        "region": "Brazil",
        "emoji": "🇧🇷"
      },
      {
        "code": "betano:ng",
        "label": "Betano -Nigeria",
        "region": "Nigeria",
        "emoji": "🇳🇬"
      },
      {
        "code": "betano:pt",
        "label": "Betano -Portugal/Europe",
        "region": "Portugal/Europe",
        "emoji": "🇵🇹"
      }
    ]
  },
  {
    "id": "betclic",
    "name": "Betclic",
    "emoji": "🇫🇷",
    "primaryRegion": "France",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "betclic:fr",
        "label": "Betclic -France",
        "region": "France",
        "emoji": "🇫🇷"
      },
      {
        "code": "betclic:pt",
        "label": "Betclic -Portugal",
        "region": "Portugal",
        "emoji": "🇵🇹"
      }
    ]
  },
  {
    "id": "betfair",
    "name": "Betfair Exchange",
    "emoji": "🇬🇧",
    "primaryRegion": "Global",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "betfair",
        "label": "Betfair Exchange",
        "region": "Global",
        "emoji": "🇬🇧"
      }
    ]
  },
  {
    "id": "betgr8",
    "name": "Betgr8",
    "emoji": "🌐",
    "primaryRegion": "Global",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "betgr8:xx",
        "label": "Betgr8 -Global",
        "region": "Global",
        "emoji": "🌐"
      }
    ]
  },
  {
    "id": "betika",
    "name": "Betika",
    "emoji": "🇨🇩",
    "primaryRegion": "Congo",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "betika:cd",
        "label": "Betika -Congo",
        "region": "Congo",
        "emoji": "🇨🇩"
      },
      {
        "code": "betika:et",
        "label": "Betika -Ethiopia",
        "region": "Ethiopia",
        "emoji": "🇪🇹"
      },
      {
        "code": "betika:gh",
        "label": "Betika -Ghana",
        "region": "Ghana",
        "emoji": "🇬🇭"
      },
      {
        "code": "betika:ke",
        "label": "Betika -Kenya",
        "region": "Kenya",
        "emoji": "🇰🇪"
      },
      {
        "code": "betika:mz",
        "label": "Betika -Mozambique",
        "region": "Mozambique",
        "emoji": "🇲🇿"
      },
      {
        "code": "betika:tz",
        "label": "Betika -Tanzania",
        "region": "Tanzania",
        "emoji": "🇹🇿"
      },
      {
        "code": "betika:zm",
        "label": "Betika -Zambia",
        "region": "Zambia",
        "emoji": "🇿🇲"
      }
    ]
  },
  {
    "id": "betjam",
    "name": "Betjam",
    "emoji": "🌐",
    "primaryRegion": "Global",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "betjam",
        "label": "Betjam -Global",
        "region": "Global",
        "emoji": "🌐"
      }
    ]
  },
  {
    "id": "betking",
    "name": "BetKing",
    "emoji": "🇬🇭",
    "primaryRegion": "Ghana",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "betking:gh",
        "label": "BetKing -Ghana",
        "region": "Ghana",
        "emoji": "🇬🇭"
      },
      {
        "code": "betking:ke",
        "label": "BetKing -Kenya",
        "region": "Kenya",
        "emoji": "🇰🇪"
      },
      {
        "code": "betking:ng",
        "label": "BetKing -Nigeria",
        "region": "Nigeria",
        "emoji": "🇳🇬"
      }
    ]
  },
  {
    "id": "betlion",
    "name": "BetLion",
    "emoji": "🇰🇪",
    "primaryRegion": "Kenya",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "betlion:ke",
        "label": "BetLion -Kenya",
        "region": "Kenya",
        "emoji": "🇰🇪"
      },
      {
        "code": "betlion:zm",
        "label": "BetLion -Zambia",
        "region": "Zambia",
        "emoji": "🇿🇲"
      }
    ]
  },
  {
    "id": "betmgm",
    "name": "BetMGM",
    "emoji": "🇺🇸",
    "primaryRegion": "USA",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "betmgm",
        "label": "BetMGM -USA",
        "region": "USA",
        "emoji": "🇺🇸"
      }
    ]
  },
  {
    "id": "betnacional",
    "name": "Betnacional",
    "emoji": "🇧🇷",
    "primaryRegion": "Brazil",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "betnacional",
        "label": "Betnacional -Brazil",
        "region": "Brazil",
        "emoji": "🇧🇷"
      }
    ]
  },
  {
    "id": "betpawa",
    "name": "Betpawa",
    "emoji": "🇬🇭",
    "primaryRegion": "Ghana",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "betpawa:gh",
        "label": "Betpawa -Ghana",
        "region": "Ghana",
        "emoji": "🇬🇭"
      },
      {
        "code": "betpawa:ke",
        "label": "Betpawa -Kenya",
        "region": "Kenya",
        "emoji": "🇰🇪"
      },
      {
        "code": "betpawa:ng",
        "label": "Betpawa -Nigeria",
        "region": "Nigeria",
        "emoji": "🇳🇬"
      },
      {
        "code": "betpawa:tz",
        "label": "Betpawa -Tanzania",
        "region": "Tanzania",
        "emoji": "🇹🇿"
      },
      {
        "code": "betpawa:ug",
        "label": "Betpawa -Uganda",
        "region": "Uganda",
        "emoji": "🇺🇬"
      },
      {
        "code": "betpawa:zm",
        "label": "Betpawa -Zambia",
        "region": "Zambia",
        "emoji": "🇿🇲"
      }
    ]
  },
  {
    "id": "betway",
    "name": "Betway",
    "emoji": "🇬🇭",
    "primaryRegion": "Ghana",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "betway:gh",
        "label": "Betway -Ghana",
        "region": "Ghana",
        "emoji": "🇬🇭"
      },
      {
        "code": "betway:ke",
        "label": "Betway -Kenya",
        "region": "Kenya",
        "emoji": "🇰🇪"
      },
      {
        "code": "betway:ng",
        "label": "Betway -Nigeria",
        "region": "Nigeria",
        "emoji": "🇳🇬"
      },
      {
        "code": "betway:tz",
        "label": "Betway -Tanzania",
        "region": "Tanzania",
        "emoji": "🇹🇿"
      },
      {
        "code": "betway:ug",
        "label": "Betway -Uganda",
        "region": "Uganda",
        "emoji": "🇺🇬"
      },
      {
        "code": "betway:uk",
        "label": "Betway -UK",
        "region": "UK",
        "emoji": "🇬🇧"
      },
      {
        "code": "betway:za",
        "label": "Betway -South Africa",
        "region": "South Africa",
        "emoji": "🇿🇦"
      },
      {
        "code": "betway:zm",
        "label": "Betway -Zambia",
        "region": "Zambia",
        "emoji": "🇿🇲"
      }
    ]
  },
  {
    "id": "betwinner",
    "name": "BetWinner",
    "emoji": "🇬🇭",
    "primaryRegion": "Ghana",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "betwinner:gh",
        "label": "BetWinner -Ghana",
        "region": "Ghana",
        "emoji": "🇬🇭"
      },
      {
        "code": "betwinner:ke",
        "label": "BetWinner -Kenya",
        "region": "Kenya",
        "emoji": "🇰🇪"
      },
      {
        "code": "betwinner:ng",
        "label": "BetWinner -Nigeria",
        "region": "Nigeria",
        "emoji": "🇳🇬"
      },
      {
        "code": "betwinner:ug",
        "label": "BetWinner -Uganda",
        "region": "Uganda",
        "emoji": "🇺🇬"
      },
      {
        "code": "betwinner:xx",
        "label": "BetWinner -Global",
        "region": "Global",
        "emoji": "🌐"
      }
    ]
  },
  {
    "id": "bk8",
    "name": "BK8",
    "emoji": "🌏",
    "primaryRegion": "Southeast Asia",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "bk8",
        "label": "BK8 -Southeast Asia",
        "region": "Southeast Asia",
        "emoji": "🌏"
      }
    ]
  },
  {
    "id": "bovada",
    "name": "Bovada",
    "emoji": "🇺🇸",
    "primaryRegion": "USA",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "bovada",
        "label": "Bovada -USA",
        "region": "USA",
        "emoji": "🇺🇸"
      }
    ]
  },
  {
    "id": "bwin",
    "name": "bwin",
    "emoji": "🇩🇪",
    "primaryRegion": "Germany/Europe",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "bwin",
        "label": "bwin -Germany/Europe",
        "region": "Germany/Europe",
        "emoji": "🇩🇪"
      }
    ]
  },
  {
    "id": "caesars",
    "name": "Caesars Sportsbook",
    "emoji": "🇺🇸",
    "primaryRegion": "USA",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "caesars",
        "label": "Caesars Sportsbook -USA",
        "region": "USA",
        "emoji": "🇺🇸"
      }
    ]
  },
  {
    "id": "caliente",
    "name": "Caliente",
    "emoji": "🇲🇽",
    "primaryRegion": "Mexico",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "caliente",
        "label": "Caliente -Mexico",
        "region": "Mexico",
        "emoji": "🇲🇽"
      }
    ]
  },
  {
    "id": "cloudbet",
    "name": "Cloudbet",
    "emoji": "💎",
    "primaryRegion": "Crypto",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "cloudbet",
        "label": "Cloudbet -Crypto",
        "region": "Crypto",
        "emoji": "💎"
      }
    ]
  },
  {
    "id": "codere",
    "name": "Codere",
    "emoji": "🇪🇸",
    "primaryRegion": "Spain",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "codere:es",
        "label": "Codere -Spain",
        "region": "Spain",
        "emoji": "🇪🇸"
      },
      {
        "code": "codere:mx",
        "label": "Codere -Mexico",
        "region": "Mexico",
        "emoji": "🇲🇽"
      }
    ]
  },
  {
    "id": "dafabet",
    "name": "Dafabet",
    "emoji": "🌏",
    "primaryRegion": "Asia",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "dafabet",
        "label": "Dafabet -Asia",
        "region": "Asia",
        "emoji": "🌏"
      }
    ]
  },
  {
    "id": "db",
    "name": "Db Bet",
    "emoji": "🌐",
    "primaryRegion": "Global",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "db_bet",
        "label": "Db Bet -Global",
        "region": "Global",
        "emoji": "🌐"
      }
    ]
  },
  {
    "id": "draftkings",
    "name": "DraftKings",
    "emoji": "🇺🇸",
    "primaryRegion": "USA",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "draftkings",
        "label": "DraftKings -USA",
        "region": "USA",
        "emoji": "🇺🇸"
      }
    ]
  },
  {
    "id": "easybet",
    "name": "Easybet",
    "emoji": "🇿🇦",
    "primaryRegion": "South Africa",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "easybet:za",
        "label": "Easybet -South Africa",
        "region": "South Africa",
        "emoji": "🇿🇦"
      }
    ]
  },
  {
    "id": "easywin",
    "name": "Easywin",
    "emoji": "🇳🇬",
    "primaryRegion": "Nigeria",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "easywin:ng",
        "label": "Easywin -Nigeria",
        "region": "Nigeria",
        "emoji": "🇳🇬"
      }
    ]
  },
  {
    "id": "estrelabet",
    "name": "EstrelaBet",
    "emoji": "🇧🇷",
    "primaryRegion": "Brazil",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "estrelabet",
        "label": "EstrelaBet -Brazil",
        "region": "Brazil",
        "emoji": "🇧🇷"
      }
    ]
  },
  {
    "id": "fanduel",
    "name": "FanDuel",
    "emoji": "🇺🇸",
    "primaryRegion": "USA",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "fanduel",
        "label": "FanDuel -USA",
        "region": "USA",
        "emoji": "🇺🇸"
      }
    ]
  },
  {
    "id": "fansport",
    "name": "Fansport",
    "emoji": "🇳🇬",
    "primaryRegion": "Nigeria",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "fansport:ng",
        "label": "Fansport -Nigeria",
        "region": "Nigeria",
        "emoji": "🇳🇬"
      }
    ]
  },
  {
    "id": "football",
    "name": "Football",
    "emoji": "🇬🇭",
    "primaryRegion": "Ghana",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "football:gh",
        "label": "Football -Ghana",
        "region": "Ghana",
        "emoji": "🇬🇭"
      },
      {
        "code": "football:ng",
        "label": "Football -Nigeria",
        "region": "Nigeria",
        "emoji": "🇳🇬"
      }
    ]
  },
  {
    "id": "fortebet",
    "name": "ForteBet",
    "emoji": "🇺🇬",
    "primaryRegion": "Uganda",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "fortebet:ug",
        "label": "ForteBet -Uganda",
        "region": "Uganda",
        "emoji": "🇺🇬"
      }
    ]
  },
  {
    "id": "galsport",
    "name": "Gal Sport Betting",
    "emoji": "🇹🇿",
    "primaryRegion": "Tanzania",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "galsport:tz",
        "label": "Gal Sport Betting -Tanzania",
        "region": "Tanzania",
        "emoji": "🇹🇿"
      },
      {
        "code": "galsport:ug",
        "label": "Gal Sport Betting -Uganda",
        "region": "Uganda",
        "emoji": "🇺🇬"
      },
      {
        "code": "galsport:zm",
        "label": "Gal Sport Betting -Zambia",
        "region": "Zambia",
        "emoji": "🇿🇲"
      },
      {
        "code": "gsb:tz",
        "label": "Gsb -Tanzania",
        "region": "Tanzania",
        "emoji": "🇹🇿"
      },
      {
        "code": "gsb:ug",
        "label": "Gsb -Uganda",
        "region": "Uganda",
        "emoji": "🇺🇬"
      },
      {
        "code": "gsb:zm",
        "label": "Gsb -Zambia",
        "region": "Zambia",
        "emoji": "🇿🇲"
      }
    ]
  },
  {
    "id": "goldpari",
    "name": "Goldpari",
    "emoji": "🌐",
    "primaryRegion": "Global",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "goldpari",
        "label": "Goldpari -Global",
        "region": "Global",
        "emoji": "🌐"
      }
    ]
  },
  {
    "id": "helabet",
    "name": "Helabet",
    "emoji": "🇰🇪",
    "primaryRegion": "Kenya",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "helabet:ke",
        "label": "Helabet -Kenya",
        "region": "Kenya",
        "emoji": "🇰🇪"
      },
      {
        "code": "helabet:xx",
        "label": "Helabet -Global",
        "region": "Global",
        "emoji": "🌐"
      }
    ]
  },
  {
    "id": "hollywoodbet",
    "name": "Hollywoodbets",
    "emoji": "🇲🇿",
    "primaryRegion": "Mozambique",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "hollywoodbet:mz",
        "label": "Hollywoodbets -Mozambique",
        "region": "Mozambique",
        "emoji": "🇲🇿"
      },
      {
        "code": "hollywoodbet:uk",
        "label": "Hollywoodbets -UK",
        "region": "UK",
        "emoji": "🇬🇧"
      },
      {
        "code": "hollywoodbet:za",
        "label": "Hollywoodbets -South Africa",
        "region": "South Africa",
        "emoji": "🇿🇦"
      }
    ]
  },
  {
    "id": "ilot",
    "name": "iLOT Bet",
    "emoji": "🇳🇬",
    "primaryRegion": "Nigeria",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "ilot:ng",
        "label": "iLOT Bet -Nigeria",
        "region": "Nigeria",
        "emoji": "🇳🇬"
      }
    ]
  },
  {
    "id": "interbet",
    "name": "Interbet",
    "emoji": "🇿🇦",
    "primaryRegion": "South Africa",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "interbet:za",
        "label": "Interbet -South Africa",
        "region": "South Africa",
        "emoji": "🇿🇦"
      }
    ]
  },
  {
    "id": "ladbrokes",
    "name": "Ladbrokes",
    "emoji": "🇬🇧",
    "primaryRegion": "UK",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "ladbrokes",
        "label": "Ladbrokes -UK",
        "region": "UK",
        "emoji": "🇬🇧"
      }
    ]
  },
  {
    "id": "linebet",
    "name": "Linebet",
    "emoji": "🇮🇳",
    "primaryRegion": "India",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "linebet:in",
        "label": "Linebet -India",
        "region": "India",
        "emoji": "🇮🇳"
      },
      {
        "code": "linebet:ng",
        "label": "Linebet -Nigeria",
        "region": "Nigeria",
        "emoji": "🇳🇬"
      },
      {
        "code": "linebet:xx",
        "label": "Linebet -Global",
        "region": "Global",
        "emoji": "🌐"
      }
    ]
  },
  {
    "id": "livescorebet",
    "name": "LiveScore Bet",
    "emoji": "🇳🇬",
    "primaryRegion": "Nigeria",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "livescorebet:ng",
        "label": "LiveScore Bet -Nigeria",
        "region": "Nigeria",
        "emoji": "🇳🇬"
      },
      {
        "code": "livescorebet:uk",
        "label": "LiveScore Bet -UK",
        "region": "UK",
        "emoji": "🇬🇧"
      }
    ]
  },
  {
    "id": "luckybet",
    "name": "Luckybet",
    "emoji": "🇳🇬",
    "primaryRegion": "Nigeria",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "luckybet:ng",
        "label": "Luckybet -Nigeria",
        "region": "Nigeria",
        "emoji": "🇳🇬"
      }
    ]
  },
  {
    "id": "luckypari",
    "name": "Luckypari",
    "emoji": "🇰🇪",
    "primaryRegion": "Kenya",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "luckypari:ke",
        "label": "Luckypari -Kenya",
        "region": "Kenya",
        "emoji": "🇰🇪"
      },
      {
        "code": "luckypari:ng",
        "label": "Luckypari -Nigeria",
        "region": "Nigeria",
        "emoji": "🇳🇬"
      }
    ]
  },
  {
    "id": "marathonbet",
    "name": "Marathonbet",
    "emoji": "🌐",
    "primaryRegion": "Global",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "marathonbet",
        "label": "Marathonbet -Global",
        "region": "Global",
        "emoji": "🌐"
      }
    ]
  },
  {
    "id": "megapari",
    "name": "Megapari",
    "emoji": "🇬🇭",
    "primaryRegion": "Ghana",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "megapari:gh",
        "label": "Megapari -Ghana",
        "region": "Ghana",
        "emoji": "🇬🇭"
      },
      {
        "code": "megapari:ng",
        "label": "Megapari -Nigeria",
        "region": "Nigeria",
        "emoji": "🇳🇬"
      },
      {
        "code": "megapari:xx",
        "label": "Megapari -Global",
        "region": "Global",
        "emoji": "🌐"
      }
    ]
  },
  {
    "id": "melbet",
    "name": "Melbet",
    "emoji": "🇧🇯",
    "primaryRegion": "Benin",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "melbet:bj",
        "label": "Melbet -Benin",
        "region": "Benin",
        "emoji": "🇧🇯"
      },
      {
        "code": "melbet:gh",
        "label": "Melbet -Ghana",
        "region": "Ghana",
        "emoji": "🇬🇭"
      },
      {
        "code": "melbet:ke",
        "label": "Melbet -Kenya",
        "region": "Kenya",
        "emoji": "🇰🇪"
      },
      {
        "code": "melbet:ng",
        "label": "Melbet -Nigeria",
        "region": "Nigeria",
        "emoji": "🇳🇬"
      },
      {
        "code": "melbet:ug",
        "label": "Melbet -Uganda",
        "region": "Uganda",
        "emoji": "🇺🇬"
      },
      {
        "code": "melbet:xx",
        "label": "Melbet -Global",
        "region": "Global",
        "emoji": "🌐"
      },
      {
        "code": "melbet:zm",
        "label": "Melbet -Zambia",
        "region": "Zambia",
        "emoji": "🇿🇲"
      }
    ]
  },
  {
    "id": "meridianbet",
    "name": "Meridianbet",
    "emoji": "🇳🇬",
    "primaryRegion": "Nigeria",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "meridianbet:ng",
        "label": "Meridianbet -Nigeria",
        "region": "Nigeria",
        "emoji": "🇳🇬"
      },
      {
        "code": "meridianbet:tz",
        "label": "Meridianbet -Tanzania",
        "region": "Tanzania",
        "emoji": "🇹🇿"
      }
    ]
  },
  {
    "id": "merrybet",
    "name": "Merrybet",
    "emoji": "🇳🇬",
    "primaryRegion": "Nigeria",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "merrybet",
        "label": "Merrybet -Nigeria",
        "region": "Nigeria",
        "emoji": "🇳🇬"
      }
    ]
  },
  {
    "id": "mozzart",
    "name": "Mozzart Bet",
    "emoji": "🇰🇪",
    "primaryRegion": "Kenya",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "mozzart:ke",
        "label": "Mozzart Bet -Kenya",
        "region": "Kenya",
        "emoji": "🇰🇪"
      },
      {
        "code": "mozzart:ng",
        "label": "Mozzart Bet -Nigeria",
        "region": "Nigeria",
        "emoji": "🇳🇬"
      },
      {
        "code": "mozzart:rs",
        "label": "Mozzart Bet -Serbia",
        "region": "Serbia",
        "emoji": "🇷🇸"
      }
    ]
  },
  {
    "id": "msport",
    "name": "MSport",
    "emoji": "🇬🇭",
    "primaryRegion": "Ghana",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "msport:gh",
        "label": "MSport -Ghana",
        "region": "Ghana",
        "emoji": "🇬🇭"
      },
      {
        "code": "msport:ng",
        "label": "MSport -Nigeria",
        "region": "Nigeria",
        "emoji": "🇳🇬"
      },
      {
        "code": "msport:ug",
        "label": "MSport -Uganda",
        "region": "Uganda",
        "emoji": "🇺🇬"
      }
    ]
  },
  {
    "id": "mybetafrica",
    "name": "Mybetafrica",
    "emoji": "🇬🇭",
    "primaryRegion": "Ghana",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "mybetafrica:gh",
        "label": "Mybetafrica -Ghana",
        "region": "Ghana",
        "emoji": "🇬🇭"
      }
    ]
  },
  {
    "id": "mzansibet",
    "name": "Mzansibet",
    "emoji": "🇿🇦",
    "primaryRegion": "South Africa",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "mzansibet:za",
        "label": "Mzansibet -South Africa",
        "region": "South Africa",
        "emoji": "🇿🇦"
      }
    ]
  },
  {
    "id": "nairabet",
    "name": "NairaBET",
    "emoji": "🇳🇬",
    "primaryRegion": "Nigeria",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "nairabet",
        "label": "NairaBET -Nigeria",
        "region": "Nigeria",
        "emoji": "🇳🇬"
      }
    ]
  },
  {
    "id": "novibet",
    "name": "Novibet",
    "emoji": "🇬🇷",
    "primaryRegion": "Greece/Europe",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "novibet:gr",
        "label": "Novibet -Greece/Europe",
        "region": "Greece/Europe",
        "emoji": "🇬🇷"
      },
      {
        "code": "novibet:uk",
        "label": "Novibet -UK",
        "region": "UK",
        "emoji": "🇬🇧"
      }
    ]
  },
  {
    "id": "odibets",
    "name": "Odibets",
    "emoji": "🇬🇭",
    "primaryRegion": "Ghana",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "odibets:gh",
        "label": "Odibets -Ghana",
        "region": "Ghana",
        "emoji": "🇬🇭"
      },
      {
        "code": "odibets:ke",
        "label": "Odibets -Kenya",
        "region": "Kenya",
        "emoji": "🇰🇪"
      }
    ]
  },
  {
    "id": "paddypower",
    "name": "Paddy Power",
    "emoji": "🇮🇪",
    "primaryRegion": "UK/Ireland",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "paddypower",
        "label": "Paddy Power -UK/Ireland",
        "region": "UK/Ireland",
        "emoji": "🇮🇪"
      }
    ]
  },
  {
    "id": "parimatch",
    "name": "PariMatch",
    "emoji": "🇨🇾",
    "primaryRegion": "Cyprus",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "parimatch:cy",
        "label": "PariMatch -Cyprus",
        "region": "Cyprus",
        "emoji": "🇨🇾"
      },
      {
        "code": "parimatch:in",
        "label": "PariMatch -India",
        "region": "India",
        "emoji": "🇮🇳"
      },
      {
        "code": "parimatch:tz",
        "label": "PariMatch -Tanzania",
        "region": "Tanzania",
        "emoji": "🇹🇿"
      },
      {
        "code": "parimatch:ua",
        "label": "PariMatch -Ukraine",
        "region": "Ukraine",
        "emoji": "🇺🇦"
      },
      {
        "code": "parimatch:uk",
        "label": "PariMatch -UK",
        "region": "UK",
        "emoji": "🇬🇧"
      }
    ]
  },
  {
    "id": "paripesa",
    "name": "Paripesa",
    "emoji": "🇬🇭",
    "primaryRegion": "Ghana",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "paripesa:gh",
        "label": "Paripesa -Ghana",
        "region": "Ghana",
        "emoji": "🇬🇭"
      },
      {
        "code": "paripesa:ke",
        "label": "Paripesa -Kenya",
        "region": "Kenya",
        "emoji": "🇰🇪"
      },
      {
        "code": "paripesa:ng",
        "label": "Paripesa -Nigeria",
        "region": "Nigeria",
        "emoji": "🇳🇬"
      },
      {
        "code": "paripesa:xx",
        "label": "Paripesa -Global",
        "region": "Global",
        "emoji": "🌐"
      }
    ]
  },
  {
    "id": "paripulse",
    "name": "Paripulse",
    "emoji": "🇮🇳",
    "primaryRegion": "India",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "paripulse:in",
        "label": "Paripulse -India",
        "region": "India",
        "emoji": "🇮🇳"
      },
      {
        "code": "paripulse:ng",
        "label": "Paripulse -Nigeria",
        "region": "Nigeria",
        "emoji": "🇳🇬"
      }
    ]
  },
  {
    "id": "pixbet",
    "name": "Pixbet",
    "emoji": "🇧🇷",
    "primaryRegion": "Brazil",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "pixbet",
        "label": "Pixbet -Brazil",
        "region": "Brazil",
        "emoji": "🇧🇷"
      }
    ]
  },
  {
    "id": "planbet",
    "name": "Planbet",
    "emoji": "🌐",
    "primaryRegion": "Global",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "planbet:xx",
        "label": "Planbet -Global",
        "region": "Global",
        "emoji": "🌐"
      }
    ]
  },
  {
    "id": "playabetcoza",
    "name": "Playabetcoza",
    "emoji": "🇿🇦",
    "primaryRegion": "South Africa",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "playabetcoza:za",
        "label": "Playabetcoza -South Africa",
        "region": "South Africa",
        "emoji": "🇿🇦"
      }
    ]
  },
  {
    "id": "pointsbet",
    "name": "PointsBet",
    "emoji": "🇺🇸",
    "primaryRegion": "USA",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "pointsbet",
        "label": "PointsBet -USA",
        "region": "USA",
        "emoji": "🇺🇸"
      }
    ]
  },
  {
    "id": "premierbet",
    "name": "Premier Bet",
    "emoji": "🇦🇴",
    "primaryRegion": "Angola",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "premierbet:ao",
        "label": "Premier Bet -Angola",
        "region": "Angola",
        "emoji": "🇦🇴"
      },
      {
        "code": "premierbet:cm",
        "label": "Premier Bet -Cameroon",
        "region": "Cameroon",
        "emoji": "🇨🇲"
      },
      {
        "code": "premierbet:cd",
        "label": "Premier Bet -Congo",
        "region": "Congo",
        "emoji": "🇨🇩"
      },
      {
        "code": "premierbet:gh",
        "label": "Premier Bet -Ghana",
        "region": "Ghana",
        "emoji": "🇬🇭"
      },
      {
        "code": "premierbet:mw",
        "label": "Premier Bet -Malawi",
        "region": "Malawi",
        "emoji": "🇲🇼"
      },
      {
        "code": "premierbet:mz",
        "label": "Premier Bet -Mozambique",
        "region": "Mozambique",
        "emoji": "🇲🇿"
      },
      {
        "code": "premierbet:sn",
        "label": "Premier Bet -Senegal",
        "region": "Senegal",
        "emoji": "🇸🇳"
      },
      {
        "code": "premierbet:tz",
        "label": "Premier Bet -Tanzania",
        "region": "Tanzania",
        "emoji": "🇹🇿"
      },
      {
        "code": "premierbet:ug",
        "label": "Premier Bet -Uganda",
        "region": "Uganda",
        "emoji": "🇺🇬"
      },
      {
        "code": "premierbet:zm",
        "label": "Premier Bet -Zambia",
        "region": "Zambia",
        "emoji": "🇿🇲"
      }
    ]
  },
  {
    "id": "sbobet",
    "name": "SBOBET",
    "emoji": "🌏",
    "primaryRegion": "Asia",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "sbobet",
        "label": "SBOBET -Asia",
        "region": "Asia",
        "emoji": "🌏"
      }
    ]
  },
  {
    "id": "secretbet",
    "name": "Secretbet",
    "emoji": "🌐",
    "primaryRegion": "Global",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "secretbet",
        "label": "Secretbet -Global",
        "region": "Global",
        "emoji": "🌐"
      }
    ]
  },
  {
    "id": "skybet",
    "name": "SkyBet",
    "emoji": "🇬🇧",
    "primaryRegion": "UK",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "skybet",
        "label": "SkyBet -UK",
        "region": "UK",
        "emoji": "🇬🇧"
      }
    ]
  },
  {
    "id": "soccabet",
    "name": "Soccabet",
    "emoji": "🇬🇭",
    "primaryRegion": "Ghana",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "soccabet:gh",
        "label": "Soccabet -Ghana",
        "region": "Ghana",
        "emoji": "🇬🇭"
      }
    ]
  },
  {
    "id": "sportingbet",
    "name": "Sportingbet",
    "emoji": "🇧🇷",
    "primaryRegion": "Brazil",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "sportingbet:br",
        "label": "Sportingbet -Brazil",
        "region": "Brazil",
        "emoji": "🇧🇷"
      },
      {
        "code": "sportingbet:za",
        "label": "Sportingbet -South Africa",
        "region": "South Africa",
        "emoji": "🇿🇦"
      }
    ]
  },
  {
    "id": "sportpesa",
    "name": "Sportpesa",
    "emoji": "🇰🇪",
    "primaryRegion": "Kenya",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "sportpesa:ke",
        "label": "Sportpesa -Kenya",
        "region": "Kenya",
        "emoji": "🇰🇪"
      },
      {
        "code": "sportpesa:tz",
        "label": "Sportpesa -Tanzania",
        "region": "Tanzania",
        "emoji": "🇹🇿"
      },
      {
        "code": "sportpesa:uk",
        "label": "Sportpesa -UK",
        "region": "UK",
        "emoji": "🇬🇧"
      },
      {
        "code": "sportpesa:xx",
        "label": "Sportpesa -Global",
        "region": "Global",
        "emoji": "🌐"
      },
      {
        "code": "sportpesa:za",
        "label": "Sportpesa -South Africa",
        "region": "South Africa",
        "emoji": "🇿🇦"
      }
    ]
  },
  {
    "id": "sportsbetau",
    "name": "Sportsbet",
    "emoji": "🇦🇺",
    "primaryRegion": "Australia",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "sportsbetau",
        "label": "Sportsbet -Australia",
        "region": "Australia",
        "emoji": "🇦🇺"
      }
    ]
  },
  {
    "id": "sportybet",
    "name": "SportyBet",
    "emoji": "🇬🇭",
    "primaryRegion": "Ghana",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "sportybet:gh",
        "label": "SportyBet -Ghana",
        "region": "Ghana",
        "emoji": "🇬🇭"
      },
      {
        "code": "sportybet:ke",
        "label": "SportyBet -Kenya",
        "region": "Kenya",
        "emoji": "🇰🇪"
      },
      {
        "code": "sportybet:mx",
        "label": "SportyBet -Mexico",
        "region": "Mexico",
        "emoji": "🇲🇽"
      },
      {
        "code": "sportybet:ng",
        "label": "SportyBet -Nigeria",
        "region": "Nigeria",
        "emoji": "🇳🇬"
      },
      {
        "code": "sportybet:tz",
        "label": "SportyBet -Tanzania",
        "region": "Tanzania",
        "emoji": "🇹🇿"
      },
      {
        "code": "sportybet:ug",
        "label": "SportyBet -Uganda",
        "region": "Uganda",
        "emoji": "🇺🇬"
      },
      {
        "code": "sportybet:za",
        "label": "SportyBet -South Africa",
        "region": "South Africa",
        "emoji": "🇿🇦"
      },
      {
        "code": "sportybet:zm",
        "label": "SportyBet -Zambia",
        "region": "Zambia",
        "emoji": "🇿🇲"
      }
    ]
  },
  {
    "id": "stake",
    "name": "Stake.com",
    "emoji": "💎",
    "primaryRegion": "Crypto",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "stake",
        "label": "Stake.com -Crypto",
        "region": "Crypto",
        "emoji": "💎"
      }
    ]
  },
  {
    "id": "sunbet",
    "name": "Sunbet",
    "emoji": "🇿🇦",
    "primaryRegion": "South Africa",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "sunbet:za",
        "label": "Sunbet -South Africa",
        "region": "South Africa",
        "emoji": "🇿🇦"
      }
    ]
  },
  {
    "id": "supersport",
    "name": "SuperSportBet",
    "emoji": "🇿🇦",
    "primaryRegion": "South Africa",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "supersport",
        "label": "SuperSportBet -South Africa",
        "region": "South Africa",
        "emoji": "🇿🇦"
      }
    ]
  },
  {
    "id": "unibet",
    "name": "Unibet",
    "emoji": "🇦🇺",
    "primaryRegion": "Australia",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "unibet:au",
        "label": "Unibet -Australia",
        "region": "Australia",
        "emoji": "🇦🇺"
      },
      {
        "code": "unibet:eu",
        "label": "Unibet -Europe",
        "region": "Europe",
        "emoji": "🇪🇺"
      },
      {
        "code": "unibet:uk",
        "label": "Unibet -UK",
        "region": "UK",
        "emoji": "🇬🇧"
      }
    ]
  },
  {
    "id": "vascobet",
    "name": "Vascobet",
    "emoji": "🇧🇷",
    "primaryRegion": "Brazil",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "vascobet:br",
        "label": "Vascobet -Brazil",
        "region": "Brazil",
        "emoji": "🇧🇷"
      }
    ]
  },
  {
    "id": "wasafibet",
    "name": "Wasafibet",
    "emoji": "🇹🇿",
    "primaryRegion": "Tanzania",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "wasafibet:tz",
        "label": "Wasafibet -Tanzania",
        "region": "Tanzania",
        "emoji": "🇹🇿"
      }
    ]
  },
  {
    "id": "williamhill",
    "name": "William Hill",
    "emoji": "🇪🇸",
    "primaryRegion": "Spain",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "williamhill:es",
        "label": "William Hill -Spain",
        "region": "Spain",
        "emoji": "🇪🇸"
      },
      {
        "code": "williamhill:it",
        "label": "William Hill -Italy",
        "region": "Italy",
        "emoji": "🇮🇹"
      },
      {
        "code": "williamhill:uk",
        "label": "William Hill -UK",
        "region": "UK",
        "emoji": "🇬🇧"
      }
    ]
  },
  {
    "id": "winmasters",
    "name": "Winmasters",
    "emoji": "🇬🇷",
    "primaryRegion": "Greece",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "winmasters:gr",
        "label": "Winmasters -Greece",
        "region": "Greece",
        "emoji": "🇬🇷"
      },
      {
        "code": "winmasters:ro",
        "label": "Winmasters -Romania",
        "region": "Romania",
        "emoji": "🇷🇴"
      }
    ]
  },
  {
    "id": "winna",
    "name": "Winna",
    "emoji": "🇰🇪",
    "primaryRegion": "Kenya",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "winna:ke",
        "label": "Winna -Kenya",
        "region": "Kenya",
        "emoji": "🇰🇪"
      }
    ]
  },
  {
    "id": "winwin",
    "name": "Winwin",
    "emoji": "🌐",
    "primaryRegion": "Global",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "winwin",
        "label": "Winwin -Global",
        "region": "Global",
        "emoji": "🌐"
      }
    ]
  },
  {
    "id": "worldsportsbetting",
    "name": "World Sports Betting",
    "emoji": "🇿🇦",
    "primaryRegion": "South Africa",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "worldsportsbetting:za",
        "label": "World Sports Betting -South Africa",
        "region": "South Africa",
        "emoji": "🇿🇦"
      }
    ]
  },
  {
    "id": "xparibet",
    "name": "Xparibet",
    "emoji": "🌐",
    "primaryRegion": "Global",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "xparibet",
        "label": "Xparibet -Global",
        "region": "Global",
        "emoji": "🌐"
      }
    ]
  },
  {
    "id": "yesplay",
    "name": "YesPlay",
    "emoji": "🇿🇦",
    "primaryRegion": "South Africa",
    "status": "active",
    "conversionRole": "both",
    "isGenuine": true,
    "variants": [
      {
        "code": "yesplay:za",
        "label": "YesPlay -South Africa",
        "region": "South Africa",
        "emoji": "🇿🇦"
      }
    ]
  }
];

// Index maps for high-performance O(1) lookups
const BOOKMAKERS_BY_ID = new Map();
const BOOKMAKERS_BY_CODE = new Map();

BOOKMAKER_REGISTRY.forEach(bookie => {
  BOOKMAKERS_BY_ID.set(bookie.id.toLowerCase(), bookie);
  if (Array.isArray(bookie.variants)) {
    bookie.variants.forEach(variant => {
      BOOKMAKERS_BY_CODE.set(variant.code.toLowerCase(), {
        ...variant,
        brandId: bookie.id,
        brandName: bookie.name,
        brandStatus: bookie.status,
        conversionRole: bookie.conversionRole
      });
    });
  }
});

// =========================================================================
// 3. CORE QUERY & COUNT METHODS
// =========================================================================

/**
 * Retrieves all genuine supported bookmakers with optional filtering.
 * @param {Object} options
 * @param {boolean} [options.includeUnavailable=false] - Whether to include temporarily unavailable bookmakers.
 * @param {string} [options.role=null] - Filter by 'source' or 'target' support.
 * @param {string} [options.region=null] - Filter by region name.
 * @param {string} [options.search=''] - Search term for brand or variant.
 * @returns {Array<Object>}
 */
export function getSupportedBookmakers(options = {}) {
  const { includeUnavailable = false, role = null, region = null, search = '' } = options;
  const q = String(search || '').toLowerCase().trim();

  return BOOKMAKER_REGISTRY.filter(b => {
    // 1. Availability filter
    if (!includeUnavailable && b.status !== 'active') return false;

    // 2. Conversion direction/role filter
    if (role) {
      if (b.conversionRole !== 'both' && b.conversionRole !== role) return false;
    }

    // 3. Region filter
    if (region && region !== 'all') {
      const reg = region.toLowerCase();
      const matchesRegion = b.primaryRegion.toLowerCase().includes(reg) ||
        b.variants.some(v => v.region.toLowerCase().includes(reg));
      if (!matchesRegion) return false;
    }

    // 4. Search query filter
    if (q) {
      const matchName = b.name.toLowerCase().includes(q);
      const matchId = b.id.toLowerCase().includes(q);
      const matchVariant = b.variants.some(v => v.label.toLowerCase().includes(q) || v.code.toLowerCase().includes(q));
      if (!matchName && !matchId && !matchVariant) return false;
    }

    return true;
  });
}

/**
 * Returns dynamic count of genuine, actively enabled bookmakers.
 * Does NOT count inactive, duplicate, or unverified regional aliases.
 * @returns {number}
 */
export function getSupportedBookmakerCount() {
  return getSupportedBookmakers({ includeUnavailable: false }).length;
}

/**
 * Returns total registered bookmakers (including temporarily unavailable).
 * @returns {number}
 */
export function getTotalRegisteredBookmakerCount() {
  return BOOKMAKER_REGISTRY.length;
}

/**
 * Calculates actual available conversion routes (Source -> Target combinations).
 * Distinguishes bookmaker count from conversion routes.
 * @returns {number}
 */
export function getAvailableConversionRoutesCount() {
  const sources = getSupportedBookmakers({ includeUnavailable: false, role: 'source' }).length;
  const targets = getSupportedBookmakers({ includeUnavailable: false, role: 'target' }).length;
  if (sources <= 1 || targets <= 1) return 0;
  // Each source can convert to any other target bookmaker (excluding self)
  return sources * (targets - 1);
}

/**
 * Looks up a bookmaker brand by canonical ID.
 * @param {string} id
 * @returns {Object|null}
 */
export function getBookmakerById(id) {
  if (!id) return null;
  return BOOKMAKERS_BY_ID.get(String(id).toLowerCase().trim()) || null;
}

/**
 * Looks up a bookmaker variant by its platform code (e.g., 'sportybet:ng').
 * @param {string} code
 * @returns {Object|null}
 */
export function getBookmakerByCode(code) {
  if (!code) return null;
  return BOOKMAKERS_BY_CODE.get(String(code).toLowerCase().trim()) || null;
}

/**
 * Formats a user-friendly label for any bookmaker variant code.
 * @param {string} code
 * @returns {string}
 */
export function formatBookieLabel(code) {
  if (!code) return "1xBet";
  const variant = getBookmakerByCode(code);
  if (variant && variant.label) {
    return variant.label;
  }
  // Fallback: check DOM select option if present
  if (typeof document !== 'undefined') {
    const opt = document.querySelector(`select.betcode-select option[value="${code}"]`);
    if (opt && opt.textContent) {
      return opt.textContent.replace(/^[^\w\s\(\)]+/, '').trim();
    }
  }
  // Clean string fallback
  const brand = code.split(':')[0].replace(/^_/, '').replace(/_.*$/, '');
  const foundBrand = getBookmakerById(brand);
  return foundBrand ? foundBrand.name : code;
}

/**
 * Updates a bookmaker's availability status dynamically.
 * Useful when an upstream gateway enters maintenance.
 * @param {string} id - Bookmaker ID
 * @param {'active'|'temporarily_unavailable'} newStatus
 * @param {string} [notice] - Maintenance explanation
 */
export function setBookmakerStatus(id, newStatus, notice = null) {
  const bookie = getBookmakerById(id);
  if (bookie) {
    bookie.status = newStatus;
    bookie.maintenanceNotice = notice;
    updateAllDynamicBookmakerCounts();
  }
}

// =========================================================================
// 4. DYNAMIC DOM SYNCHRONIZATION
// =========================================================================

/**
 * Synchronizes all dynamic coverage elements in the DOM with the live count.
 */
export function updateAllDynamicBookmakerCounts() {
  if (typeof document === 'undefined') return;

  const count = getSupportedBookmakerCount();
  const routes = getAvailableConversionRoutesCount();

  // 1. Elements with class .dyn-bookmaker-count
  document.querySelectorAll('.dyn-bookmaker-count').forEach(el => {
    el.textContent = String(count);
  });

  // 2. FAQ dynamic count container
  const faqCountEl = document.getElementById('faq-supported-bookmaker-count');
  if (faqCountEl) faqCountEl.textContent = String(count);

  // 3. Secondary tool badge on homepage
  const secToolBadge = document.getElementById('sec-tool-converter-badge');
  if (secToolBadge) secToolBadge.textContent = `${count} Bookmakers`;

  // 4. Hero coverage indicators
  const heroCoverageEl = document.getElementById('converter-hero-coverage-indicator');
  if (heroCoverageEl) {
    heroCoverageEl.innerHTML = `
      <span class="coverage-pill" style="display: inline-flex; align-items: center; gap: 8px; background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.3); padding: 5px 12px; border-radius: 20px; font-size: 0.78rem; font-weight: 700; color: #34d399;">
        <span style="width: 7px; height: 7px; border-radius: 50%; background: #10b981; display: inline-block;"></span>
        <strong>[${count}]</strong> bookmakers currently supported
      </span>
    `;
  }

  // 5. Dynamic routes indicator if present
  document.querySelectorAll('.dyn-routes-count').forEach(el => {
    el.textContent = routes.toLocaleString();
  });
}

// =========================================================================
// 5. VISUAL SUPPORTED BOOKMAKERS DIRECTORY
// =========================================================================

let currentDirectoryRegion = 'all';

/**
 * Renders the authoritative visual representation of coverage into a container.
 * @param {string|HTMLElement} container
 * @param {string} [searchQuery='']
 * @param {string} [regionFilter='all']
 */
export function renderSupportedBookmakersDirectory(container, searchQuery = '', regionFilter = 'all') {
  currentDirectoryRegion = regionFilter;
  const targetEl = typeof container === 'string' ? document.getElementById(container) : container;
  if (!targetEl) return;

  const bookmakers = getSupportedBookmakers({
    includeUnavailable: true,
    region: regionFilter,
    search: searchQuery
  });

  const activeCount = bookmakers.filter(b => b.status === 'active').length;
  const totalCount = bookmakers.length;

  targetEl.innerHTML = `
    <div class="bookmakers-dir-wrap" style="display: flex; flex-direction: column; gap: 14px;">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
        <div>
          <h4 style="margin: 0; font-family: var(--font-display); font-size: 1.05rem; font-weight: 800; color: #ffffff;">Supported Bookmakers Directory</h4>
          <span style="font-size: 0.75rem; color: #34d399; font-weight: 700;">
            ${activeCount} currently active &amp; verified • Real-time Market Mapping
          </span>
        </div>
        <div style="font-size: 0.75rem; color: #94a3b8; background: rgba(15, 23, 42, 0.6); padding: 4px 10px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.08);">
          Showing ${totalCount} bookmaker brands
        </div>
      </div>

      <!-- Region Filter Tabs -->
      <div style="display: flex; gap: 6px; flex-wrap: wrap; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px;">
        ${['all', 'africa', 'europe', 'north america', 'latin america', 'asia'].map(reg => {
          const isActive = (regionFilter || 'all').toLowerCase() === reg;
          const label = reg === 'all' ? 'All Regions' : reg.charAt(0).toUpperCase() + reg.slice(1);
          return `
            <button type="button" onclick="window.filterSupportedBookmakersDirectory(document.getElementById('search-supported-bookmakers-input')?.value || '', '${reg}')"
              style="background: ${isActive ? '#10b981' : 'rgba(255,255,255,0.06)'}; color: ${isActive ? '#ffffff' : '#94a3b8'}; border: 1px solid ${isActive ? '#10b981' : 'rgba(255,255,255,0.1)'}; padding: 4px 10px; border-radius: 6px; font-size: 0.72rem; font-weight: 700; cursor: pointer; text-transform: capitalize;">
              ${label}
            </button>
          `;
        }).join('')}
      </div>

      <div class="bookmakers-dir-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 10px; max-height: 440px; overflow-y: auto; padding-right: 4px;">
        ${bookmakers.map(b => {
          const isActive = b.status === 'active';
          const statusColor = isActive ? '#10b981' : '#f59e0b';
          const statusLabel = isActive ? 'Active' : 'Temporarily Unavailable';
          const roleLabel = b.conversionRole === 'both' ? 'Source &amp; Target' : (b.conversionRole === 'source' ? 'Source Only' : 'Target Only');

          return `
            <div class="bookmaker-dir-card" style="background: rgba(15, 23, 42, 0.85); border: 1px solid ${isActive ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.3)'}; border-radius: 10px; padding: 12px; display: flex; flex-direction: column; justify-content: space-between; gap: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="font-size: 1.3rem;">${b.emoji}</span>
                  <div>
                    <div style="font-weight: 800; font-size: 0.88rem; color: #ffffff;">${b.name}</div>
                    <div style="font-size: 0.7rem; color: #94a3b8;">${b.primaryRegion}</div>
                  </div>
                </div>
                <span style="display: inline-flex; align-items: center; gap: 4px; font-size: 0.65rem; font-weight: 800; color: ${statusColor}; background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 8px; border: 1px solid ${statusColor}44;">
                  <span style="width: 5px; height: 5px; border-radius: 50%; background: ${statusColor};"></span>
                  ${statusLabel}
                </span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 6px; font-size: 0.68rem; color: #64748b;">
                <span>${roleLabel}</span>
                <span>${b.variants.length} regional endpoint${b.variants.length > 1 ? 's' : ''}</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

export function openSupportedBookmakersModal() {
  const modal = document.getElementById('supported-bookmakers-modal');
  if (modal) {
    modal.style.display = 'flex';
    renderSupportedBookmakersDirectory('supported-bookmakers-directory-container');
    const input = document.getElementById('search-supported-bookmakers-input');
    if (input) {
      input.value = '';
      input.focus();
    }
  }
}

export function closeSupportedBookmakersModal(event, force = false) {
  if (force || (event && event.target && event.target.id === 'supported-bookmakers-modal')) {
    const modal = document.getElementById('supported-bookmakers-modal');
    if (modal) modal.style.display = 'none';
  }
}

export function toggleSupportedBookmakersModal() {
  const modal = document.getElementById('supported-bookmakers-modal');
  if (modal && modal.style.display === 'flex') {
    closeSupportedBookmakersModal(null, true);
  } else {
    openSupportedBookmakersModal();
  }
}

export function filterSupportedBookmakersDirectory(query, region = null) {
  const activeRegion = region !== null ? region : currentDirectoryRegion;
  renderSupportedBookmakersDirectory('supported-bookmakers-directory-container', query, activeRegion);
}

// Auto-run on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateAllDynamicBookmakerCounts);
  } else {
    setTimeout(updateAllDynamicBookmakerCounts, 0);
  }
}

// Attach to global window/globalThis for script tag usage
const targetGlobal = typeof window !== 'undefined' ? window : globalThis;
targetGlobal.BOOKING_CODE_CONVERTER_HEADLINE = BOOKING_CODE_CONVERTER_HEADLINE;
targetGlobal.BOOKING_CODE_CONVERTER_DESCRIPTION = BOOKING_CODE_CONVERTER_DESCRIPTION;
targetGlobal.BOOKING_CODE_CONVERTER_ALT_DESCRIPTION = BOOKING_CODE_CONVERTER_ALT_DESCRIPTION;
targetGlobal.BOOKMAKER_REGISTRY = BOOKMAKER_REGISTRY;
targetGlobal.getSupportedBookmakers = getSupportedBookmakers;
targetGlobal.getSupportedBookmakerCount = getSupportedBookmakerCount;
targetGlobal.getTotalRegisteredBookmakerCount = getTotalRegisteredBookmakerCount;
targetGlobal.getAvailableConversionRoutesCount = getAvailableConversionRoutesCount;
targetGlobal.getBookmakerById = getBookmakerById;
targetGlobal.getBookmakerByCode = getBookmakerByCode;
targetGlobal.formatBookieLabel = formatBookieLabel;
targetGlobal.setBookmakerStatus = setBookmakerStatus;
targetGlobal.updateAllDynamicBookmakerCounts = updateAllDynamicBookmakerCounts;
targetGlobal.renderSupportedBookmakersDirectory = renderSupportedBookmakersDirectory;
targetGlobal.openSupportedBookmakersModal = openSupportedBookmakersModal;
targetGlobal.closeSupportedBookmakersModal = closeSupportedBookmakersModal;
targetGlobal.toggleSupportedBookmakersModal = toggleSupportedBookmakersModal;
targetGlobal.filterSupportedBookmakersDirectory = filterSupportedBookmakersDirectory;
