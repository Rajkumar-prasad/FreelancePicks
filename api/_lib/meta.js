// Meta Conversions API helper. Files in api/_lib are not deployed as endpoints.
const crypto = require("crypto");

const sha256 = (v) => crypto.createHash("sha256").update(String(v).trim().toLowerCase()).digest("hex");

function parseCookies(header) {
  const out = {};
  String(header || "")
    .split(";")
    .forEach((part) => {
      const i = part.indexOf("=");
      if (i > -1) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
    });
  return out;
}

function parseBody(req) {
  let b = req.body;
  if (typeof b === "string") {
    try { b = JSON.parse(b); } catch (e) { b = {}; }
  }
  return b && typeof b === "object" ? b : {};
}

async function sendMetaEvent({ req, eventName, eventId, sourceUrl, email, firstName, customData }) {
  const pixelId = process.env.META_PIXEL_ID;
  const token = process.env.META_CAPI_TOKEN;
  if (!pixelId || !token) return { skipped: true };

  const cookies = parseCookies(req.headers.cookie);
  const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  const userData = { client_user_agent: req.headers["user-agent"] || undefined };
  if (ip) userData.client_ip_address = ip;
  if (email) userData.em = [sha256(email)];
  if (firstName) userData.fn = [sha256(firstName)];
  if (cookies._fbp) userData.fbp = cookies._fbp;
  if (cookies._fbc) userData.fbc = cookies._fbc;

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: "website",
        event_source_url: sourceUrl,
        user_data: userData,
        custom_data: customData || {},
      },
    ],
  };
  if (process.env.META_TEST_EVENT_CODE) payload.test_event_code = process.env.META_TEST_EVENT_CODE;

  const version = process.env.META_API_VERSION || "v23.0";
  try {
    const r = await fetch(`https://graph.facebook.com/${version}/${pixelId}/events?access_token=${encodeURIComponent(token)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!r.ok) console.error("Meta CAPI error", r.status, await r.text());
    return { ok: r.ok, status: r.status };
  } catch (err) {
    console.error("Meta CAPI request failed", err);
    return { ok: false };
  }
}

module.exports = { sendMetaEvent, parseBody };
