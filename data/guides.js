// Guides. Each one becomes a page at /guides/<slug>/.
// type "article" uses the html below. type "calculator" is rendered by build.js.

const baseGuides = [
  {
    slug: "what-to-outsource-first",
    type: "article",
    label: "Planning",
    services: ["meta-pixel-capi-setup", "product-photography", "shopify-developer"],
    title: "What to Outsource First When Launching an Online Store",
    metaTitle: "What to Outsource First When Launching an Online Store",
    metaDesc:
      "A practical priority list for new store owners: which tasks to hire out first, which to keep, and an example launch budget.",
    summary: "A priority list of what to hire out first, what to keep doing yourself, and an example budget.",
    intro:
      "When you launch a store, everything feels urgent. But your budget is limited, and some tasks pay you back far more than others. This guide gives you a simple order to follow.",
    faqs: [
      { q: "What should I outsource first for a new online store?", a: "Tracking and product images usually give the best return first, followed by store setup if you are not technical. Fix those before spending on ads." },
      { q: "How much does it cost to launch a store with freelancers?", a: "Many small stores launch for roughly $700 to $2,000 in freelance costs, depending on how much they do themselves. Use the store launch cost calculator for your own estimate." },
    ],
    html: `
<h2>The simple rule</h2>
<p>Outsource work that is <strong>skill-heavy and done once</strong>, like store setup or tracking. Keep work that depends on <strong>your knowledge of the product and customer</strong>, like choosing products, pricing and answering customer emails.</p>

<h2>The priority order</h2>
<ol class="steps">
  <li>
    <h3>1. Tracking before ads</h3>
    <p>If you plan to run ads, get your <a href="/hire/meta-pixel-capi-setup/">Meta Pixel and Conversions API set up</a> first. It is one of the cheapest jobs on this list, and without it you cannot tell which ads actually make sales.</p>
  </li>
  <li>
    <h3>2. Product images</h3>
    <p>Images do most of the selling. Even good phone photos with <a href="/hire/product-photography/">professional editing</a> can lift how your store looks overnight.</p>
  </li>
  <li>
    <h3>3. Store setup, if you are not technical</h3>
    <p>A <a href="/hire/shopify-developer/">Shopify developer</a> or <a href="/hire/woocommerce-developer/">WooCommerce developer</a> can save you weeks. If you are comfortable with tech, a simple free theme set up by you is fine to start.</p>
  </li>
  <li>
    <h3>4. A clean logo</h3>
    <p>You need something clean and readable, not a full brand agency. A <a href="/hire/logo-designer/">mid-range logo package</a> with vector files is enough for launch.</p>
  </li>
  <li>
    <h3>5. Product copy</h3>
    <p>Once you know your customer, a <a href="/hire/product-description-writer/">product copywriter</a> can turn your notes into descriptions that answer buyer questions and help with SEO.</p>
  </li>
  <li>
    <h3>6. Video creatives</h3>
    <p>When you are ready for ads, <a href="/hire/product-video-ugc/">UGC and product videos</a> are often the creatives that perform best on Meta and TikTok.</p>
  </li>
  <li>
    <h3>7. Ads setup or management</h3>
    <p>Hire a <a href="/hire/meta-ads-setup/">Meta ads specialist</a> once tracking works and you have creatives to test. Start with a one-time setup and testing plan before paying for monthly management.</p>
  </li>
</ol>

<h2>What to keep doing yourself</h2>
<ul class="checks">
  <li>Choosing products and setting prices</li>
  <li>Answering customer messages, at least in the beginning, so you learn what buyers care about</li>
  <li>Reviewing ad results every week, even if someone else runs the ads</li>
  <li>Approving anything that makes a claim about your product</li>
</ul>

<h2>Example launch budget: $1,000</h2>
<p>This is an example split for a small store that does some work in-house. Your numbers will differ.</p>
<div class="table-wrap">
<table>
  <thead><tr><th>Task</th><th>Example spend</th></tr></thead>
  <tbody>
    <tr><td>Store setup (standard package)</td><td>$300</td></tr>
    <tr><td>Logo (standard package)</td><td>$100</td></tr>
    <tr><td>Product image editing (around 30 images)</td><td>$150</td></tr>
    <tr><td>Pixel and Conversions API setup</td><td>$100</td></tr>
    <tr><td>Product descriptions (10 products)</td><td>$100</td></tr>
    <tr><td>1 to 2 UGC videos</td><td>$250</td></tr>
    <tr><th>Total</th><th>$1,000</th></tr>
  </tbody>
</table>
</div>
<p>Want a number for your own store? Try the <a href="/guides/store-launch-cost/">store launch cost calculator</a>.</p>
`,
  },

  {
    slug: "store-launch-cost",
    type: "calculator",
    label: "Calculator",
    title: "How Much Does It Cost to Launch an Online Store?",
    metaTitle: "Online Store Launch Cost Calculator: What Freelancers Charge",
    metaDesc:
      "Estimate what it costs to launch an online store with freelancers. Tick the services you need and see a realistic price range.",
    summary: "Tick the services you need and get a realistic cost range for your launch.",
    intro:
      "Tick the services you plan to hire out. The calculator adds up typical mid-range marketplace prices, so you get a realistic range instead of a guess.",
    faqs: [
      { q: "Is this calculator accurate?", a: "It uses typical mid-range marketplace prices at the time of writing. Real quotes depend on your scope, catalog size and the seller you choose, so treat it as a planning range." },
      { q: "Does this include platform and ad costs?", a: "No. It covers freelance services only. Add your platform plan, theme or plugins, domain, apps and ad budget separately." },
    ],
  },
];

// Articles live in data/articles/. Add new ones to data/articles/index.js.
module.exports = [...baseGuides, ...require("./articles")];
