// POST /api/event - server-side copy of browser events (Meta Conversions API), deduplicated by event_id.
const { sendMetaEvent, parseBody } = require("./_lib/meta");

const ALLOWED = new Set(["OutboundClick"]);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end();
  }
  const b = parseBody(req);
  if (b.consent !== true || !ALLOWED.has(b.event_name) || !b.event_id) return res.status(204).end();

  await sendMetaEvent({
    req,
    eventName: b.event_name,
    eventId: String(b.event_id).slice(0, 80),
    sourceUrl: String(b.source_url || "").slice(0, 500),
    customData: { category: String(b.category || "").slice(0, 80) },
  });
  return res.status(204).end();
};
