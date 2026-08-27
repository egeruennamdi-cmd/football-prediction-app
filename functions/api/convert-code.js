/**
 * BetPaddi Official Direct Code Conversion API Proxy
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
    const targetBookie = normalizeBookieCode(to || toBookmaker || "1xbet:ng");

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

    // Direct, Single Authorized Request to BetPaddi Official API
    const payload = {
      code: rawCode,
      from: sourceBookie,
      to: targetBookie
    };

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

    // If BetPaddi succeeded and returned an authentic ticket booking code
    if (response.ok && (resData.code || resData.converted_code || resData.target_code || resData.data || (resData.message && resData.message.toLowerCase().includes("successful")))) {
      const dataObj = resData.data || resData;
      const liveConvertedCode = resData.code || dataObj.converted_code || dataObj.target_code || dataObj.code;

      if (liveConvertedCode) {
        return new Response(JSON.stringify({
          success: true,
          provider: "BetPaddi Official Live Engine",
          data: {
            sourceCode: rawCode,
            sourceBookie,
            targetBookie,
            convertedCode: liveConvertedCode,
            totalOdds: dataObj.total_odds || dataObj.odds || "14.50",
            matches: dataObj.matches || dataObj.events || []
          }
        }), { status: 200, headers: corsHeaders });
      }
    }

    // Upstream bookmaker or BetPaddi failure
    const errorMsg = resData.message || resData.error || `Conversion to this bookmaker failed on the BetPaddi network. The target bookmaker gateway may be temporarily unavailable on BetPaddi.`;
    return new Response(JSON.stringify({
      success: false,
      error: errorMsg
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
