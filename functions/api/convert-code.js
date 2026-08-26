/**
 * BetPaddi Live Code Conversion API Proxy
 * Cloudflare Pages Function: /api/convert-code
 */
const BETPADDI_API_KEY = "BP-52eb15ce2fd694bc2faf9987b18a160762f176082cb57d04";
const BETPADDI_CONVERT_URL = "https://betpaddi.com/api/v1/conversion/convert-code";

function normalizeBookieCode(raw) {
  if (!raw) return "sportybet:ng";
  const str = String(raw).trim();
  if (str.includes(":")) return str; // already formatted like sportybet:ng, 1xbet:ng
  const low = str.toLowerCase();
  if (low.includes("bet9ja")) return "bet9ja";
  if (low.includes("sporty")) return "sportybet:ng";
  if (low.includes("1x")) return "1xbet:ng";
  if (low.includes("king")) return "betking:ng";
  if (low.includes("msport")) return "msport:ng";
  if (low.includes("betano")) return "betano:ng";
  if (low.includes("22bet")) return "_22bet_ng";
  return str;
}

export async function onRequestPost(context) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
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

    // Call Real Official BetPaddi API
    const betpaddiPayload = {
      code: rawCode,
      from: sourceBookie,
      to: targetBookie
    };

    const response = await fetch(BETPADDI_CONVERT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${BETPADDI_API_KEY}`,
        "x-api-key": BETPADDI_API_KEY
      },
      body: JSON.stringify(betpaddiPayload)
    });

    const resData = await response.json().catch(() => ({}));

    // Check if BetPaddi returned converted data
    if (response.ok && (resData.status === "success" || resData.data || resData.converted_code || resData.target_code)) {
      const dataObj = resData.data || resData;
      const convertedCode = dataObj.converted_code || dataObj.target_code || dataObj.code || resData.converted_code;
      const totalOdds = dataObj.total_odds || dataObj.odds || "14.50";
      const matches = dataObj.matches || dataObj.events || [];

      return new Response(JSON.stringify({
        success: true,
        provider: "BetPaddi Official Engine",
        data: {
          sourceCode: rawCode,
          sourceBookie,
          targetBookie,
          convertedCode,
          totalOdds,
          matches
        }
      }), { status: 200, headers: corsHeaders });
    }

    // If BetPaddi returned an error message from upstream
    const errMsg = resData.message || resData.error || "Conversion failed. Please verify that this booking code is active on the source bookmaker and the matches have not kicked off yet.";
    return new Response(JSON.stringify({
      success: false,
      error: errMsg
    }), { status: 400, headers: corsHeaders });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message || "Network error while connecting to BetPaddi API."
    }), { status: 500, headers: corsHeaders });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key"
    }
  });
}
