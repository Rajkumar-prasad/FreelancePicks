module.exports = {
  slug: "meta-pixel-vs-conversions-api",
  type: "article",
  label: "Explainer",
  title: "Meta Pixel vs Conversions API: What's the Difference and Do You Need Both?",
  metaTitle: "Meta Pixel vs Conversions API: Differences, Deduplication and Setup",
  metaDesc:
    "What the Meta Pixel and Conversions API each do, why Meta recommends both, how deduplication works, and how to set them up on Shopify or WooCommerce.",
  summary: "What each one tracks, why you usually need both, and how deduplication stops double counting.",
  intro:
    "The Meta Pixel tracks events in your visitor's browser. The Conversions API (CAPI) sends the same events from your server. Most stores running Meta ads should use both, set up so each event is counted once.",
  services: ["meta-pixel-capi-setup", "meta-ads-setup", "shopify-developer"],
  sources: [
    { title: "Handling Duplicate Pixel and Conversions API Events - Meta for Developers", url: "https://developers.facebook.com/docs/marketing-api/conversions-api/deduplicate-pixel-and-server-events" },
  ],
  faqs: [
    { q: "Can I use the Conversions API without the Pixel?", a: "You can, but Meta recommends running the Conversions API alongside the Pixel. Together they give Meta the most complete picture of what happens on your site." },
    { q: "Will using both double count my purchases?", a: "Only if deduplication is not set up. When the browser event and the server event share the same event name and event ID, Meta keeps one and discards the duplicate." },
    { q: "Does Shopify set up the Conversions API automatically?", a: "Meta's Facebook and Instagram sales channel for Shopify can send server events through its data sharing settings. You still need to check that it is set to the right level and that no other app sends the same events." },
    { q: "How do I know my setup works?", a: "Use Test Events in Meta Events Manager while you browse your store and place a test order. Each event should show up from both the browser and the server, and be marked as deduplicated." },
  ],
  html: `
<div class="answer"><p class="answer-label">Quick answer</p><p>The <strong>Pixel</strong> is code that runs in the visitor's browser. The <strong>Conversions API</strong> is a direct connection from your server or platform to Meta. Browser tracking misses events because of ad blockers and privacy settings, so server events fill the gaps. Use both, with matching <strong>event IDs</strong> so Meta counts each event once.</p></div>

<h2>What the Meta Pixel does</h2>
<p>The Pixel is a piece of JavaScript on your website. When a visitor views a product, adds to cart or buys, the Pixel sends that event from their browser to Meta. It is quick to install and gives Meta browser signals such as its first-party cookies.</p>
<p>Its weakness is that it depends on the browser. Ad blockers, privacy features, slow connections and visitors leaving before the page finishes loading can all stop events from being sent.</p>

<h2>What the Conversions API does</h2>
<p>The Conversions API sends events from your server, store platform or a tracking service directly to Meta. It does not rely on the visitor's browser, so it can recover events the Pixel misses. It can also send hashed customer information, like a hashed email address from an order, which helps Meta match events to people.</p>

<h2>Side by side</h2>
<div class="table-wrap"><table>
<thead><tr><th></th><th>Meta Pixel</th><th>Conversions API</th></tr></thead>
<tbody>
<tr><td>Where it runs</td><td>Visitor's browser</td><td>Your server, platform or a tracking service</td></tr>
<tr><td>Affected by ad blockers</td><td>Yes</td><td>No</td></tr>
<tr><td>Setup effort</td><td>Low</td><td>Low with a native integration, higher for custom setups</td></tr>
<tr><td>Best for</td><td>Browser signals and quick setup</td><td>Reliability and better event matching</td></tr>
</tbody></table></div>

<h2>Why you need both</h2>
<p>Meta's own documentation recommends implementing the Conversions API alongside the Pixel for the best ad performance. Each covers the other's blind spots: the Pixel provides browser signals, and the server catches events the browser loses. More complete data helps Meta's delivery system find buyers and makes your reporting closer to reality.</p>

<h2>How deduplication works</h2>
<p>If the same purchase is sent from the browser and from the server, Meta needs to know it is one purchase, not two. Meta's recommended method:</p>
<ul class="checks">
  <li>Both events use the <strong>same event name</strong>, for example <code>Purchase</code>.</li>
  <li>Both events carry the <strong>same unique event ID</strong>. In the Pixel it is passed as <code>eventID</code>, and in the Conversions API as <code>event_id</code>.</li>
  <li>The events arrive within <strong>48 hours</strong> of each other.</li>
</ul>
<p>When those match, Meta generally keeps the event it received first and discards the duplicate. If the IDs do not match, both are counted and your reported purchases will be inflated.</p>

<h2>Ways to set it up</h2>
<ul>
  <li><strong>Shopify:</strong> Meta's Facebook and Instagram sales channel can send both browser and server events. Check the data sharing level in the channel settings.</li>
  <li><strong>WooCommerce:</strong> Meta's official plugin for WooCommerce supports the Conversions API. Make sure the theme or another plugin is not also adding a Pixel.</li>
  <li><strong>Server-side Google Tag Manager:</strong> more control and works across platforms, but needs hosting and more technical setup.</li>
  <li><strong>Partner and custom integrations:</strong> many platforms and tracking tools offer Conversions API connections, and developers can call the API directly.</li>
</ul>
<p>If this sounds like a lot, a tracking specialist can usually set up a native integration within a few days. Our <a href="/hire/meta-pixel-capi-setup/">guide to hiring for Pixel and Conversions API setup</a> lists what a correct job includes and typical prices.</p>

<h2>How to check it is working</h2>
<ol class="numbered">
  <li>Open <strong>Events Manager</strong> and go to <strong>Test events</strong>.</li>
  <li>Browse your store, add a product to the cart and place a test order.</li>
  <li>Check that each event appears from both the browser and the server, and that duplicates are marked as deduplicated.</li>
  <li>Check that the Purchase event shows the correct value and currency.</li>
  <li>Over the next days, review event match quality and any warnings in the Diagnostics tab.</li>
</ol>

<h2>Common mistakes</h2>
<ul class="flags">
  <li>Two Pixels installed: one in the theme code and one through an app</li>
  <li>Server events sent without event IDs, so every purchase counts twice</li>
  <li>Purchase events with a value of zero or the wrong currency</li>
  <li>Testing only on desktop, never on a phone</li>
</ul>

<aside class="tip"><p class="tip-label">Raj's tip</p><p>Before judging any campaign, compare a week of purchases in your store admin with purchases in Ads Manager. If the numbers are far apart in either direction, fix tracking first. No amount of creative testing can make up for bad data.</p></aside>

<p>Setting up a new store? Add tracking to your <a href="/guides/shopify-store-launch-checklist/">Shopify launch checklist</a> and read <a href="/hire/meta-ads-setup/">what a proper Meta ads setup includes</a>.</p>
`,
};
