// POST /api/subscribe - called when someone requests the Store Launch Kit.
// It never sends emails. It only:
//   1. Optionally saves the contact to systeme.io as a list of leads (if SYSTEME_API_KEY is set)
//   2. Sends a Lead event to Meta Conversions API (if the visitor accepted cookies and META_* vars are set)
// The visitor always gets the download page, even if saving fails.
//
// Env vars (Vercel > Project > Settings > Environment Variables), all optional:
//   SYSTEME_API_KEY   save kit signups as contacts in systeme.io (no emails are sent by this site)
//   META_PIXEL_ID, META_CAPI_TOKEN, META_TEST_EVENT_CODE   for Conversions API
const { sendMetaEvent, parseBody } = require("./_lib/meta");

const SYSTEME = "https://api.systeme.io/api";

async function saveContact(email, firstName) {
  const key = process.env.SYSTEME_API_KEY;
  if (!key) return;
  const headers = { "X-API-Key": key, "Content-Type": "application/json", Accept: "application/json" };
  const contact = { email };
  if (firstName) contact.fields = [{ slug: "first_name", value: firstName }];
  try {
    const r = await fetch(`${SYSTEME}/contacts`, { method: "POST", headers, body: JSON.stringify(contact) });
    // 422 usually means the contact already exists, which is fine.
    if (!r.ok && r.status !== 422) console.error("systeme.io error", r.status, await r.text());
  } catch (err) {
    console.error("systeme.io request failed", err);
  }
}

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

  const tasks = [saveContact(email, firstName)];
  if (body.consent === true && body.event_id) {
    tasks.push(
      sendMetaEvent({
        req,
        eventName: "Lead",
        eventId: String(body.event_id).slice(0, 80),
        sourceUrl: String(body.source_url || "").slice(0, 500),
        email,
        firstName,
        customData: { content_name: "Store Launch Kit" },
      })
    );
  }
  await Promise.allSettled(tasks);

  return res.status(200).json({ ok: true });
};
