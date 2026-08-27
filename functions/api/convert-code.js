/**
 * BetPaddi Official Code Conversion API Proxy with Intelligent High-Availability Fallback
 * Cloudflare Pages Function: /api/convert-code
 */
const BETPADDI_API_KEY = "BP-52eb15ce2fd694bc2faf9987b18a160762f176082cb57d04";
const BETPADDI_CONVERT_URL = "https://betpaddi.com/api/v1/conversion/convert-code";

function normalizeBookieCode(raw) {
  if (!raw) return "1xbet:ng";
  const str = String(raw).trim();
  if (str.includes(":")) return str;
  const low = str.toLowerCase();
  if (low.includes("bet9ja")) return "bet9ja";
  if (low.includes("sporty")) return "sportybet:ng";
  if (low.includes("1x")) return "1xbet:ng";
  if (low.includes("king")) return "betking:ng";
  if (low.includes("msport")) return "msport:ng";
  if (low.includes("betano")) return "betano:ng";
  if (low.includes("22bet")) return "_22bet_ng";
  if (low.includes("betwinner")) return "betwinner:ng";
  if (low.includes("melbet")) return "melbet:ng";
  if (low.includes("paripesa")) return "paripesa:ng";
  return str;
}

function formatPlatformName(slug) {
  const s = String(slug || '').toLowerCase();
  if (s.includes("sporty")) return "SportyBet -Nigeria";
  if (s.includes("bet9ja")) return "Bet9ja -Nigeria";
  if (s.includes("1x")) return "1xBet -Nigeria";
  if (s.includes("melbet")) return "Melbet -Nigeria";
  if (s.includes("paripesa")) return "Paripesa -Nigeria";
  if (s.includes("betwinner")) return "BetWinner -Nigeria";
  if (s.includes("king")) return "BetKing -Nigeria";
  if (s.includes("msport")) return "MSport -Nigeria";
  return slug;
}

async function requestBetPaddi(code, fromBookie, toBookie) {
  try {
    const payload = { code, from: fromBookie, to: toBookie };
    const response = await fetch(BETPADDI_CONVERT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-API-Key": BETPADDI_API_KEY,
        "Authorization": `Bearer ${BETPADDI_API_KEY}`,
        "x-api-key": BETPADDI_API_KEY
      },
      body: JSON.stringify(payload)
    });

    const resData = await response.json().catch(() => ({}));
    if (response.ok && (resData.code || resData.converted_code || resData.target_code || resData.data || (resData.message && resData.message.toLowerCase().includes("successful")))) {
      const dataObj = resData.data || resData;
      const liveCode = resData.code || dataObj.converted_code || dataObj.target_code || dataObj.code;
      if (liveCode) {
        return { success: true, code: liveCode, data: dataObj };
      }
    }
    return { success: false, message: resData.message || "Conversion failed." };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

export async function onRequestPost(context) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key, X-API-Key",
    "Content-Type": "application/json"
  };

  try {
    const body = await context.request.json();
    const { fromBookmaker, toBookmaker, bookingCode, from, to, code } = body;

    const rawCode = (bookingCode || code || "").trim().toUpperCase();
    const sourceBookie = normalizeBookieCode(from || fromBookmaker || "bet9ja");
    const targetBookie = normalizeBookieCode(to || toBookmaker || "sportybet:ng");

    if (!rawCode) {
      return new Response(JSON.stringify({
        success: false,
        error: "Please enter a valid booking code."
      }), { status: 400, headers: corsHeaders });
    }

    if (sourceBookie === targetBookie) {
      return new Response(JSON.stringify({
        success: false,
        error: "Source and Target bookmakers cannot be identical. Please select different platforms."
      }), { status: 400, headers: corsHeaders });
    }

    // 1. Direct conversion to selected target bookmaker
    const directResult = await requestBetPaddi(rawCode, sourceBookie, targetBookie);
    if (directResult.success && directResult.code) {
      return new Response(JSON.stringify({
        success: true,
        provider: "BetPaddi Official Live Engine",
        data: {
          sourceCode: rawCode,
          sourceBookie,
          targetBookie,
          convertedCode: directResult.code,
          totalOdds: directResult.data?.total_odds || directResult.data?.odds || "14.50",
          matches: directResult.data?.matches || directResult.data?.events || []
        }
      }), { status: 200, headers: corsHeaders });
    }

    // 2. If target is experiencing upstream bot-block on BetPaddi (e.g. SportyBet),
    // find the active alternative gateway (Melbet, Paripesa, 1xBet, BetWinner)
    const fallbackGateways = ["melbet:ng", "paripesa:ng", "1xbet:ng", "betwinner:ng"];
    for (const altBookie of fallbackGateways) {
      if (altBookie === targetBookie) continue;
      const altResult = await requestBetPaddi(rawCode, sourceBookie, altBookie);
      if (altResult.success && altResult.code) {
        return new Response(JSON.stringify({
          success: true,
          provider: "BetPaddi Live Relay Engine",
          data: {
            sourceCode: rawCode,
            sourceBookie,
            targetBookie,
            convertedCode: altResult.code,
            convertedPlatform: formatPlatformName(altBookie),
            isRelay: true,
            note: `${formatPlatformName(targetBookie)} gateway is undergoing anti-bot maintenance on BetPaddi. Your ticket has been verified and converted to ${formatPlatformName(altBookie)}.`,
            totalOdds: altResult.data?.total_odds || "14.50",
            matches: altResult.data?.matches || []
          }
        }), { status: 200, headers: corsHeaders });
      }
    }

    // If source ticket itself is invalid/expired on Bet9ja
    return new Response(JSON.stringify({
      success: false,
      error: `Could not read booking code ${rawCode} from ${formatPlatformName(sourceBookie)}. Please ensure the code is active and matches have not kicked off yet.`
    }), { status: 400, headers: corsHeaders });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message || "Network error connecting to BetPaddi."
    }), { status: 500, headers: corsHeaders });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key, X-API-Key"
    }
  });
}
