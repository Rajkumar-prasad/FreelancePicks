// POST /api/subscribe  - adds the email to systeme.io and sends a Lead event to Meta CAPI.
// Env vars (Vercel > Project > Settings > Environment Variables):
//   SYSTEME_API_KEY   required - systeme.io > Settings > Public API keys
//   SYSTEME_TAG_ID    optional - numeric tag ID to apply (use it to start your email sequence)
//   META_PIXEL_ID, META_CAPI_TOKEN, META_TEST_EVENT_CODE (optional, for CAPI)
const { sendMetaEvent, parseBody } = require("./_lib/meta");

const SYSTEME = "https://api.systeme.io/api";

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = parseBody(req);
  const email = String(body.email || "").trim().toLowerCase();
  const firstName = String(body.first_name || "").trim().slice(0, 60);

  // Honeypot: bots fill the hidden "company" field. Pretend success.
  if (body.company) return res.status(200).json({ ok: true });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  const key = process.env.SYSTEME_API_KEY;
  if (!key) {
    console.error("SYSTEME_API_KEY is not set");
    return res.status(503).json({ error: "Signups are not open yet. Please try again soon." });
  }

  const headers = { "X-API-Key": key, "Content-Type": "application/json", Accept: "application/json" };
  let contactId = null;

  try {
    const contact = { email };
    if (firstName) contact.fields = [{ slug: "first_name", value: firstName }];
    const r = await fetch(`${SYSTEME}/contacts`, { method: "POST", headers, body: JSON.stringify(contact) });
    const text = await r.text();
    let json = {};
    try { json = JSON.parse(text); } catch (e) {}

    if (r.ok) {
      contactId = json.id || null;
    } else if (r.status === 422) {
      // Most likely the contact already exists. Look it up so we can still tag it.
      const lookup = await fetch(`${SYSTEME}/contacts?email=${encodeURIComponent(email)}`, { headers });
      const lj = await lookup.json().catch(() => ({}));
      const item = (lj.items || [])[0];
      if (!item) {
        console.error("systeme.io 422", text);
        return res.status(400).json({ error: "We could not add that email. Please check it and try again." });
      }
      contactId = item.id;
    } else {
      console.error("systeme.io error", r.status, text);
      return res.status(502).json({ error: "Something went wrong. Please try again in a minute." });
    }

    const tagId = Number(process.env.SYSTEME_TAG_ID);
    if (contactId && tagId) {
      const t = await fetch(`${SYSTEME}/contacts/${contactId}/tags`, { method: "POST", headers, body: JSON.stringify({ tagId }) });
      if (!t.ok && t.status !== 422) console.error("systeme.io tag error", t.status, await t.text());
    }
  } catch (err) {
    console.error("systeme.io request failed", err);
    return res.status(502).json({ error: "Something went wrong. Please try again in a minute." });
  }

  if (body.consent === true && body.event_id) {
    await sendMetaEvent({
      req,
      eventName: "Lead",
      eventId: String(body.event_id).slice(0, 80),
      sourceUrl: String(body.source_url || "").slice(0, 500),
      email,
      firstName,
      customData: { content_name: "Store Launch Kit" },
    });
  }

  return res.status(200).json({ ok: true });
};
