// FreelancePicks static site builder. No dependencies.
// Run: node build.js  ->  output in /dist
const fs = require("fs");
const path = require("path");

const site = require("./data/site");
const categories = require("./data/categories");
const aff = require("./data/affiliate-links");
const guides = require("./data/guides");

const OUT = path.join(__dirname, "dist");
const SRC = path.join(__dirname, "src");
const BUILD_DATE = new Date().toISOString().slice(0, 10);
const YEAR = new Date().getFullYear();
const sitemap = [];
const missingLinks = new Set();

// ---------- helpers ----------
const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const base = site.url.replace(/\/$/, "");
const abs = (p) => base + p;
const catBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));
const PROPER = ["Shopify", "WooCommerce", "Meta", "UGC", "Pixel"];
const lowerFirst = (str) => (PROPER.some((w) => str.startsWith(w)) ? str : str.charAt(0).toLowerCase() + str.slice(1));
const prettyDate = (iso) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    const s = path.join(from, e.name);
    const d = path.join(to, e.name);
    e.isDirectory() ? copyDir(s, d) : fs.copyFileSync(s, d);
  }
}

function affUrl(slug) {
  const u = (aff.categories && aff.categories[slug]) || aff.default || "";
  if (!u) missingLinks.add(slug);
  return u;
}

function affButton(slug, label, cls = "btn btn-primary") {
  const u = affUrl(slug);
  if (!u) {
    return `<a class="${cls} is-missing" href="#" data-aff data-missing data-category="${esc(slug)}" rel="sponsored nofollow">${esc(label)}</a>`;
  }
  return `<a class="${cls}" href="${esc(u)}" target="_blank" rel="sponsored nofollow noopener" data-aff data-category="${esc(slug)}">${esc(label)} <span aria-hidden="true">&#8599;</span></a>`;
}

function writePage(urlPath, html, { inSitemap = true, priority = "0.7" } = {}) {
  const file = urlPath === "/404" ? path.join(OUT, "404.html") : path.join(OUT, urlPath, "index.html");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  if (inSitemap) sitemap.push({ loc: abs(urlPath), priority });
}

const list = (items, cls = "") => `<ul${cls ? ` class="${cls}"` : ""}>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;

const authorSchema = {
  "@type": "Person",
  name: site.author.name,
  url: site.author.url,
  jobTitle: "Performance Marketer",
};

function breadcrumbs(items) {
  // items: [{name, path}]
  const html = `<nav class="crumbs" aria-label="Breadcrumb"><ol>${items
    .map((it, i) =>
      i === items.length - 1
        ? `<li aria-current="page">${esc(it.name)}</li>`
        : `<li><a href="${it.path}">${esc(it.name)}</a></li>`
    )
    .join("")}</ol></nav>`;
  const schema = {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) })),
  };
  return { html, schema };
}

function faqBlock(faqs) {
  if (!faqs || !faqs.length) return { html: "", schema: null };
  const html = `<section class="section" id="faq"><h2>Frequently asked questions</h2><div class="faq">${faqs
    .map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`)
    .join("")}</div></section>`;
  const schema = {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return { html, schema };
}

const disclosureNote = `<p class="disclosure-note">Some links on this page are affiliate links. If you hire through them we may earn a commission, at no extra cost to you. <a href="/affiliate-disclosure/">How we make money</a>.</p>`;

const kitCta = `<aside class="kit-cta">
  <div>
    <p class="eyebrow">Free download</p>
    <h2>The Store Launch Kit</h2>
    <p>A 20-point launch checklist plus a cost sheet that shows what to outsource and what each service should really cost.</p>
  </div>
  <a class="btn btn-accent" href="/free-store-launch-kit/">Get the free kit</a>
</aside>`;

// ---------- layout ----------
function layout({ title, description, urlPath, body, schema = [], noindex = false, ogType = "website", bodyAttrs = "", preload = "" }) {
  const fullTitle = urlPath === "/" ? title : `${title} | ${site.name}`;
  const canonical = abs(urlPath);
  const graph = schema.filter(Boolean);
  const ld = graph.length
    ? `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c")}</script>`
    : "";
  const og = site.ogImage
    ? `<meta property="og:image" content="${esc(abs(site.ogImage))}"><meta name="twitter:image" content="${esc(abs(site.ogImage))}">`
    : "";
  const fpConfig = JSON.stringify({
    pixelId: site.metaPixelId || "",
    ga4Id: site.ga4Id || "",
    consentRequired: site.consentRequired !== false,
  });

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(canonical)}">
${noindex ? '<meta name="robots" content="noindex, follow">' : ""}
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="${esc(site.name)}">
<meta name="twitter:card" content="summary_large_image">
${og}
<meta name="theme-color" content="#0d7a41">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/style.css">
${preload}
<script>document.documentElement.classList.add("js");window.FP=${fpConfig};</script>
<script src="/assets/main.js" defer></script>
${ld}
</head>
<body${bodyAttrs ? " " + bodyAttrs : ""}>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap header-inner">
    <a class="logo" href="/" aria-label="${esc(site.name)} home">
      <img src="/assets/favicon.svg" alt="" width="30" height="30"><span>Freelance<b>Picks</b></span>
    </a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="main-nav" aria-label="Open menu" data-nav-toggle>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path class="i-open" d="M4 7h16M4 12h16M4 17h16"/><path class="i-close" d="M6 6l12 12M18 6L6 18"/></svg>
    </button>
    <nav class="main-nav" id="main-nav" aria-label="Main">
      <a href="/hire/">Services</a>
      <a href="/guides/">Guides</a>
      <a href="/#how-it-works">How it works</a>
      <a href="/about/">About</a>
      <a class="nav-cta" href="/free-store-launch-kit/">Free launch kit</a>
    </nav>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="site-footer">
  <div class="wrap footer-grid">
    <div>
      <a class="logo logo-footer" href="/"><img src="/assets/favicon.svg" alt="" width="26" height="26"><span>Freelance<b>Picks</b></span></a>
      <p>${esc(site.tagline)}.</p>
      <p class="small">We may earn a commission when you hire through links on this site, at no extra cost to you.</p>
    </div>
    <div>
      <h3>Services</h3>
      <ul>${categories.map((c) => `<li><a href="/hire/${c.slug}/">${esc(c.name)}</a></li>`).join("")}</ul>
    </div>
    <div>
      <h3>Resources</h3>
      <ul>
        ${guides.map((g) => `<li><a href="/guides/${g.slug}/">${esc(g.title)}</a></li>`).join("")}
        <li><a href="/free-store-launch-kit/">Free Store Launch Kit</a></li>
      </ul>
      <h3>Site</h3>
      <ul>
        <li><a href="/about/">About</a></li>
        <li><a href="/affiliate-disclosure/">Affiliate disclosure</a></li>
        <li><a href="/privacy-policy/">Privacy policy</a></li>
        <li><button type="button" class="linklike" data-cookie-settings>Cookie settings</button></li>
      </ul>
    </div>
  </div>
  <div class="wrap footer-bottom"><p>&copy; ${YEAR} ${esc(site.name)}. Independent guide, not affiliated with or endorsed by any freelance marketplace.</p></div>
</footer>
<div class="consent" id="consent" role="dialog" aria-live="polite" aria-label="Cookie consent" hidden>
  <p>We use cookies for analytics and to measure our ads. You can change this anytime in Cookie settings. <a href="/privacy-policy/">Privacy policy</a></p>
  <div class="consent-actions">
    <button type="button" class="btn btn-ghost" data-consent="no">Decline</button>
    <button type="button" class="btn btn-primary" data-consent="yes">Accept</button>
  </div>
</div>
</body>
</html>`;
}

// ---------- components ----------
function categoryCard(c) {
  const std = c.pricing[1] || c.pricing[0];
  return `<a class="card cat-card" href="/hire/${c.slug}/">
  <h3>${esc(c.name)}</h3>
  <p>${esc(c.summary)}</p>
  <p class="card-price"><span>Typical:</span> ${esc(std.range)}</p>
  <span class="card-link">See guide and picks <span aria-hidden="true">&rarr;</span></span>
</a>`;
}

function pricingCards(c) {
  return `<div class="price-grid">${c.pricing
    .map(
      (p, i) => `<div class="price-card${i === 1 ? " is-featured" : ""}">
  ${i === 1 ? '<span class="badge">Most stores</span>' : ""}
  <h3>${esc(p.tier)}</h3>
  <p class="price">${esc(p.range)}</p>
  <p>${esc(p.gets)}</p>
</div>`
    )
    .join("")}</div>
<p class="note">Typical marketplace price ranges at the time of writing. Prices change, so always check the current packages on the seller's page.</p>`;
}

function renderPicks(c) {
  const picks = ((aff.picks || {})[c.slug] || []).filter((p) => p && p.url);
  if (!picks.length) {
    return `<div class="picks-empty">
  <p>We are reviewing sellers in this category and will list our top picks here. In the meantime, browse ${esc(
    lowerFirst(c.short)
  )} and use the checklist below to compare them.</p>
  ${affButton(c.slug, `Browse ${lowerFirst(c.short)}`)}
</div>`;
  }
  return `<div class="picks">${picks
    .map(
      (p, i) => `<div class="pick">
  <div class="pick-rank">#${i + 1}</div>
  <div class="pick-body">
    <h3>${esc(p.name)}</h3>
    ${p.bestFor ? `<p class="pick-best"><strong>Best for:</strong> ${esc(p.bestFor)}</p>` : ""}
    ${p.note ? `<p>${esc(p.note)}</p>` : ""}
    ${p.priceFrom ? `<p class="pick-price">From ${esc(p.priceFrom)}</p>` : ""}
  </div>
  <a class="btn btn-primary" href="${esc(p.url)}" target="_blank" rel="sponsored nofollow noopener" data-aff data-category="${esc(
        c.slug
      )}">View gig <span aria-hidden="true">&#8599;</span></a>
</div>`
    )
    .join("")}</div>`;
}

const byline = `<p class="byline">By <a href="/about/">${esc(site.author.name)}</a> &middot; Updated ${prettyDate(BUILD_DATE)}</p>`;

// ---------- pages ----------
const ICON = {
  all: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
  store: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9l1.5-5h13L20 9"/><path d="M4 9h16v11H4z"/><path d="M9 20v-6h6v6"/></svg>',
  content: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/></svg>',
  ads: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20V11M10 20V5M16 20v-6M2 20h20"/></svg>',
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  pause: '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="2" width="3.5" height="12" rx="1"/><rect x="9.5" y="2" width="3.5" height="12" rx="1"/></svg>',
};

const STAGES = [
  { id: "all", name: "All services", icon: "all", slugs: null },
  { id: "store", name: "Store setup", icon: "store", slugs: ["logo-designer", "shopify-developer", "woocommerce-developer"] },
  { id: "content", name: "Product content", icon: "content", slugs: ["product-photography", "product-description-writer", "product-video-ugc"] },
  { id: "ads", name: "Ads and tracking", icon: "ads", slugs: ["meta-pixel-capi-setup", "meta-ads-setup", "product-video-ugc"] },
];

const money = (n) => "$" + n.toLocaleString("en-US");
const sumRange = (slugs) => slugs.reduce((a, s) => [a[0] + catBySlug[s].costLow, a[1] + catBySlug[s].costHigh], [0, 0]);

const PLANS = [
  {
    name: "Lean launch",
    desc: "For testing a product idea on a small budget. You set up the store yourself and hire help for the parts that matter most.",
    slugs: ["logo-designer", "product-photography", "product-description-writer", "meta-pixel-capi-setup"],
    cta: ["Estimate your own budget", "/guides/store-launch-cost/", "btn btn-ghost btn-block"],
  },
  {
    name: "Full launch",
    popular: true,
    desc: "For launching with ads from day one. Specialists handle the store, product content, tracking and first campaigns.",
    slugs: ["shopify-developer", "logo-designer", "product-photography", "product-description-writer", "meta-pixel-capi-setup", "product-video-ugc", "meta-ads-setup"],
    cta: ["Get the free launch kit", "/free-store-launch-kit/", "btn btn-primary btn-block"],
  },
];

function picture(name, alt, w, h, cls = "") {
  return `<picture><source srcset="/assets/media/${name}.webp" type="image/webp"><img${cls ? ` class="${cls}"` : ""} src="/assets/media/${name}.jpg" alt="${esc(alt)}" width="${w}" height="${h}" loading="lazy" decoding="async"></picture>`;
}

function buildHome() {
  const faqs = [
    { q: "What is FreelancePicks?", a: "An independent guide for people launching and growing online stores. For each service, we explain what a good job includes, what it should cost and how to vet a seller, then point you to sellers worth considering." },
    { q: "Do you charge anything?", a: "No. The site is free to use. We may earn a commission when you hire through some of our links, which never changes your price." },
    { q: "How do you choose which sellers to recommend?", a: "We look at portfolio quality, relevant recent reviews, clear packages and delivery terms, and whether the seller follows safe practices like collaborator or partner access instead of asking for passwords." },
  ];
  const faq = faqBlock(faqs);
  const tile = (c) =>
    `<a class="tile" href="/hire/${c.slug}/"><span class="tile-name">${esc(c.name)}</span><span class="tile-meta">Typical ${esc(
      (c.pricing[1] || c.pricing[0]).range
    )}</span><span class="tile-go">See guide <span aria-hidden="true">&rarr;</span></span></a>`;

  const tabs = STAGES.map(
    (s, i) =>
      `<button class="tab" type="button" role="tab" id="tab-${s.id}" aria-controls="panel-${s.id}" aria-selected="${i === 0}"${
        i === 0 ? "" : ' tabindex="-1"'
      }>${ICON[s.icon]}<span>${esc(s.name)}</span></button>`
  ).join("");
  const panels = STAGES.map((s, i) => {
    const list = s.slugs ? s.slugs.map((x) => catBySlug[x]) : categories;
    return `<div class="tile-grid" role="tabpanel" id="panel-${s.id}" aria-labelledby="tab-${s.id}"${i === 0 ? "" : " hidden"}>${list
      .map(tile)
      .join("")}</div>`;
  }).join("");

  const logoPricing = catBySlug["logo-designer"].pricing;
  const first = categories[0];

  const plans = PLANS.map((p) => {
    const [lo, hi] = sumRange(p.slugs);
    return `<div class="plan${p.popular ? " is-popular" : ""}">
  ${p.popular ? '<span class="badge">Most popular</span>' : ""}
  <h3>${esc(p.name)}</h3>
  <p class="plan-desc">${esc(p.desc)}</p>
  <p class="plan-cost">${money(lo)} - ${money(hi)}</p>
  <p class="plan-cost-label">Typical freelance cost</p>
  <hr>
  <ul class="checks">${p.slugs.map((s) => `<li><a href="/hire/${s}/">${esc(catBySlug[s].name)}</a></li>`).join("")}</ul>
  <a class="${p.cta[2]}" href="${p.cta[1]}">${esc(p.cta[0])}</a>
</div>`;
  }).join("");

  const chips = ["shopify-developer", "logo-designer", "meta-pixel-capi-setup", "product-video-ugc"]
    .map((s) => `<a href="/hire/${s}/">${esc(catBySlug[s].name)}</a>`)
    .join("");

  const body = `
<div class="wrap">
  <a class="announce" href="/free-store-launch-kit/"><span class="announce-tag">Free</span> <span>The Store Launch Kit<span class="announce-long">: a 20-point checklist plus a cost sheet for everything you can outsource</span></span> <span class="announce-link">Get it <span aria-hidden="true">&rarr;</span></span></a>
  <section class="hero-media" aria-label="Introduction">
    <video class="hero-video" muted loop playsinline preload="none" poster="/assets/media/hero-poster.jpg" data-src-sm="/assets/media/hero-720.mp4" data-src-lg="/assets/media/hero.mp4" aria-hidden="true"></video>
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <h1>Hire the right freelancer for every step of your store launch</h1>
      <p>Honest price guides, vetting checklists and hand-picked sellers for logo design, store setup, product content, tracking and ads.</p>
      <form class="hero-search" action="/hire/" method="get" role="search" data-hero-search>
        <label class="sr-only" for="hero-q">What do you need help with?</label>
        <input id="hero-q" name="q" type="search" list="service-list" placeholder="e.g. logo, Shopify, ads" autocomplete="off">
        <datalist id="service-list">${categories.map((c) => `<option value="${esc(c.name)}"></option>`).join("")}</datalist>
        <button class="btn btn-primary" type="submit">Find help</button>
      </form>
      <div class="chips"><span>Popular:</span>${chips}</div>
    </div>
    <button class="video-toggle" type="button" data-video-toggle aria-label="Pause background video" hidden>${ICON.pause}</button>
  </section>
</div>

<section class="proof wrap" aria-label="What every guide includes">
  <p class="proof-label">Every hiring guide includes</p>
  <ul class="proof-list">${["Typical prices", "What a good package includes", "Vetting checklist", "Questions to ask", "Red flags to avoid"]
    .map((t) => `<li>${ICON.check}${esc(t)}</li>`)
    .join("")}</ul>
</section>

<section class="section wrap" id="services">
  <div class="section-head center"><h2>Find help for every step of your launch</h2></div>
  <div class="tabs" role="tablist" aria-label="Service groups" data-tabs>${tabs}</div>
  ${panels}
  <a class="more-link" href="/hire/">View all services <span aria-hidden="true">&rarr;</span></a>
</section>

<section class="section wrap start-grid">
  <div>
    <p class="pill-label"><span class="dot"></span>Quick start</p>
    <h2>Not sure what to hire first?</h2>
    <p class="lead">Pick where your store is right now and go straight to the guide that matters most.</p>
  </div>
  <div class="quiz-card">
    <div class="quiz-head"><h3>Where is your store right now?</h3><span class="quiz-step">Step 1 of 3</span></div>
    <div class="quiz-options">
      <a class="quiz-opt" href="/guides/what-to-outsource-first/"><strong>No store yet</strong><span>See what to outsource first</span></a>
      <a class="quiz-opt" href="/hire/meta-pixel-capi-setup/"><strong>Live, but no sales yet</strong><span>Fix tracking before ads</span></a>
      <a class="quiz-opt" href="/hire/product-photography/"><strong>Product pages need work</strong><span>Better photos and copy</span></a>
      <a class="quiz-opt" href="/hire/product-video-ugc/"><strong>Ready to scale ads</strong><span>Fresh video creatives</span></a>
    </div>
  </div>
</section>

<section class="section wrap" id="how-it-works">
  <div class="section-head"><h2>How it works</h2></div>
  <div class="how-grid">
    <article class="how-card">
      <div class="how-media how-brand"><div class="how-brand-inner"><span class="logo"><img src="/assets/favicon.svg" alt="" width="36" height="36"><span>Freelance<b>Picks</b></span></span><span class="how-pill">Pick a service</span></div></div>
      <h3>1. Pick the service you need</h3>
      <p>Browse by launch stage, or use the quick start above to find the guide that fits your store.</p>
    </article>
    <article class="how-card">
      <div class="how-media how-prices" aria-hidden="true">
        <p class="how-prices-title">${esc(first.name)}: typical prices</p>
        ${logoPricing
          .map((p, i) => `<div class="how-row${i === 1 ? " is-pick" : ""}"><span>${esc(p.tier)}</span><strong>${esc(p.range)}</strong></div>`)
          .join("")}
      </div>
      <h3>2. Know the fair price and what to check</h3>
      <p>Every guide shows what a good package includes, typical prices, a vetting checklist and red flags.</p>
    </article>
    <article class="how-card">
      <div class="how-media">${picture("store-editor", "A store owner editing an online store theme on a laptop", 1200, 800)}</div>
      <h3>3. Hire with confidence and launch</h3>
      <p>Compare our picks, start with a small order or sample, and keep all communication on the platform.</p>
    </article>
  </div>
</section>

<section class="section wrap">
  <div class="insights">
    <div>
      <h2>Know what freelancers really charge</h2>
      <p>Pick a service to see typical budget, standard and premium prices before you start comparing sellers.</p>
      <div class="price-explorer" data-price-explorer>
        <label class="sr-only" for="pe-select">Service</label>
        <select id="pe-select">${categories
          .map((c) => `<option value="${c.slug}" data-tiers="${esc(JSON.stringify(c.pricing.map((p) => p.range)))}">${esc(c.name)}</option>`)
          .join("")}</select>
        <dl class="pe-tiers">${first.pricing
          .map((p, i) => `<div><dt>${esc(p.tier)}</dt><dd data-tier="${i}">${esc(p.range)}</dd></div>`)
          .join("")}</dl>
        <a class="pe-link" href="/hire/${first.slug}/" data-pe-link>See the full ${esc(first.name)} guide <span aria-hidden="true">&rarr;</span></a>
      </div>
      <a class="btn btn-light" href="/guides/store-launch-cost/">Open the launch cost calculator</a>
    </div>
    <svg class="insights-art" viewBox="0 0 400 220" aria-hidden="true">
      <defs>
        <linearGradient id="curveFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9f27a" stop-opacity="0.45"/><stop offset="1" stop-color="#c9f27a" stop-opacity="0"/></linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="4"/></filter>
      </defs>
      <path d="M10 190 C 110 190, 140 40, 200 40 S 290 190, 390 190" fill="url(#curveFill)"/>
      <path d="M10 190 C 110 190, 140 40, 200 40 S 290 190, 390 190" fill="none" stroke="#c9f27a" stroke-width="5" filter="url(#glow)" opacity="0.7"/>
      <path d="M10 190 C 110 190, 140 40, 200 40 S 290 190, 390 190" fill="none" stroke="#e9ffc2" stroke-width="2"/>
      <line x1="200" y1="40" x2="200" y2="196" stroke="#c9f27a" stroke-dasharray="4 5" opacity="0.6"/>
      <circle cx="200" cy="40" r="6" fill="#c9f27a"/>
      <text x="200" y="24" fill="#e3ebe5" font-size="13" font-family="Inter, sans-serif" text-anchor="middle">Typical price</text>
      <text x="40" y="214" fill="#8d9a92" font-size="12" font-family="Inter, sans-serif">Budget</text>
      <text x="360" y="214" fill="#8d9a92" font-size="12" font-family="Inter, sans-serif" text-anchor="end">Premium</text>
    </svg>
  </div>
</section>

<section class="section wrap">
  <div class="section-head center">
    <h2>Choose how you want to launch</h2>
    <p>Two common ways to split the work. Every service links to its full hiring guide.</p>
  </div>
  <div class="plan-grid">${plans}</div>
  <a class="more-link" href="/guides/store-launch-cost/">Compare every service in the cost calculator <span aria-hidden="true">&rarr;</span></a>
</section>

<section class="section wrap">
  <div class="section-head"><h2>Latest guides</h2><p>Real prices, checklists and honest comparisons for store owners.</p></div>
  <div class="card-grid three">${guides
    .slice(-6)
    .reverse()
    .map(
      (g) => `<a class="card guide-card" href="/guides/${g.slug}/"><p class="eyebrow">${esc(g.label || "Guide")}</p><h3>${esc(
        g.title
      )}</h3><p>${esc(g.summary)}</p><span class="card-link">Read the guide <span aria-hidden="true">&rarr;</span></span></a>`
    )
    .join("")}</div>
  <a class="more-link" href="/guides/">All guides <span aria-hidden="true">&rarr;</span></a>
</section>

<section class="band">
  <div class="wrap">
    <div class="section-head">
      <h2>How we pick sellers</h2>
      <p>Cheap is easy to find. Reliable is harder. These are the things we check.</p>
    </div>
    <div class="feature-grid">
      <div class="feature"><span class="feature-num">01</span><h3>Real, relevant work</h3><p>Portfolios with live stores and work in niches close to yours, not stock images or templates.</p></div>
      <div class="feature"><span class="feature-num">02</span><h3>Clear packages</h3><p>What is included, how many revisions, which files you get and when it will be delivered.</p></div>
      <div class="feature"><span class="feature-num">03</span><h3>Safe access</h3><p>Sellers who use collaborator or partner access, never asking for your passwords.</p></div>
      <div class="feature"><span class="feature-num">04</span><h3>Recent reviews</h3><p>Consistent feedback from buyers with similar projects in the last few months.</p></div>
    </div>
  </div>
</section>

<section class="section wrap narrow">
  <div class="author-box">
    <div class="author-avatar" aria-hidden="true">RK</div>
    <div>
      <h2>Who is behind this site</h2>
      <p>${esc(site.author.name)} is a ${esc(site.author.role.charAt(0).toLowerCase() + site.author.role.slice(1))}. He has set up Shopify and WooCommerce stores, product catalogs and Meta Pixel and Conversions API tracking for clients, and built this site to help store owners hire with more confidence.</p>
      <p><a href="/about/">More about FreelancePicks</a></p>
    </div>
  </div>
</section>

<div class="wrap narrow">${faq.html}</div>

<section class="section wrap">
  <div class="cta-band">
    <h2>Launch your store with the right people</h2>
    <p>Get the free Store Launch Kit: a 20-point checklist plus a cost sheet that shows what to outsource and what it should cost.</p>
    <a class="btn btn-light btn-lg" href="/free-store-launch-kit/">Get the free kit</a>
  </div>
</section>
`;
  writePage(
    "/",
    layout({
      title: `${site.name}: Hire the Right Freelancer for Your Online Store`,
      description: site.description,
      urlPath: "/",
      body,
      preload: '<link rel="preload" as="image" href="/assets/media/hero-poster.jpg" fetchpriority="high">',
      schema: [
        { "@type": "WebSite", name: site.name, url: base + "/", description: site.description },
        { "@type": "Organization", name: site.name, url: base + "/", logo: abs("/assets/favicon.svg") },
        faq.schema,
      ],
    }),
    { priority: "1.0" }
  );
}

function buildHireIndex() {
  const bc = breadcrumbs([{ name: "Home", path: "/" }, { name: "Services", path: "/hire/" }]);
  const body = `
<div class="wrap">${bc.html}</div>
<section class="page-head wrap">
  <h1>Freelance services for online stores</h1>
  <p class="lead">Pick a service to see what a good job includes, typical prices, how to vet sellers and our hand-picked recommendations.</p>
</section>
<section class="section wrap"><div class="card-grid">${categories.map(categoryCard).join("")}</div></section>
<section class="section wrap">${kitCta}</section>
`;
  writePage(
    "/hire/",
    layout({
      title: "Freelance Services for Online Stores",
      description: "Price guides, vetting checklists and hand-picked freelancers for every step of launching an online store.",
      urlPath: "/hire/",
      body,
      schema: [
        bc.schema,
        {
          "@type": "ItemList",
          itemListElement: categories.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, url: abs(`/hire/${c.slug}/`) })),
        },
      ],
    }),
    { priority: "0.9" }
  );
}

function buildCategory(c) {
  const urlPath = `/hire/${c.slug}/`;
  const bc = breadcrumbs([
    { name: "Home", path: "/" },
    { name: "Services", path: "/hire/" },
    { name: c.name, path: urlPath },
  ]);
  const faq = faqBlock(c.faqs);
  const std = c.pricing[1] || c.pricing[0];
  const related = (c.related || []).map((s) => catBySlug[s]).filter(Boolean);

  const body = `
<div class="wrap">${bc.html}</div>
<div class="wrap layout-sidebar">
  <article class="content">
    <header class="page-head">
      <p class="eyebrow">Hiring guide</p>
      <h1>${esc(c.h1)}</h1>
      ${byline}
      <p class="lead">${esc(c.intro)}</p>
      <div class="hero-actions">
        ${affButton(c.slug, `Browse ${lowerFirst(c.short)}`)}
        <a class="btn btn-ghost" href="#pricing">See typical prices</a>
      </div>
      ${disclosureNote}
    </header>

    <nav class="toc" aria-label="On this page">
      <p>On this page</p>
      <ol>
        <li><a href="#when">When you need this</a></li>
        <li><a href="#included">What a good package includes</a></li>
        <li><a href="#pricing">What it costs</a></li>
        <li><a href="#picks">Our picks</a></li>
        <li><a href="#vetting">How to vet a seller</a></li>
        <li><a href="#questions">Questions to ask</a></li>
        <li><a href="#faq">FAQ</a></li>
      </ol>
    </nav>

    <section class="section" id="when"><h2>When you need this</h2>${list(c.when)}</section>
    <section class="section" id="included"><h2>What a good package includes</h2>${list(c.included, "checks")}</section>
    <section class="section" id="pricing"><h2>What it costs</h2>${pricingCards(c)}</section>
    <section class="section" id="picks"><h2>Our picks</h2>${renderPicks(c)}</section>
    <section class="section" id="vetting"><h2>How to vet a seller</h2>${list(c.vetting, "checks")}</section>
    <section class="section" id="questions"><h2>Questions to ask before you order</h2><ol class="numbered">${c.questions
      .map((q) => `<li>${esc(q)}</li>`)
      .join("")}</ol></section>
    <section class="section"><h2>Red flags to avoid</h2>${list(c.redFlags, "flags")}</section>
    <aside class="tip"><p class="tip-label">Pro tip</p><p>${esc(c.tip)}</p></aside>
    ${faq.html}
    <section class="section cta-box">
      <h2>Ready to compare ${esc(lowerFirst(c.short))}?</h2>
      <p>Use the checklist above, start with a small order or sample if you can, and keep all communication on the platform.</p>
      ${affButton(c.slug, `Browse ${lowerFirst(c.short)}`)}
    </section>
    ${
      related.length
        ? `<section class="section"><h2>Related services</h2><div class="card-grid three">${related.map(categoryCard).join("")}</div></section>`
        : ""
    }
    ${(() => {
      const rg = guides.filter((g) => (g.services || []).includes(c.slug));
      return rg.length
        ? `<section class="section"><h2>Guides for this service</h2><ul class="guide-links">${rg
            .map((g) => `<li><a href="/guides/${g.slug}/">${esc(g.title)}</a><span>${esc(g.summary)}</span></li>`)
            .join("")}</ul></section>`
        : "";
    })()}
  </article>

  <aside class="sidebar">
    <div class="side-card">
      <p class="eyebrow">At a glance</p>
      <h2>${esc(c.name)}</h2>
      <dl>
        <dt>Typical price</dt><dd>${esc(std.range)}</dd>
        <dt>Budget option</dt><dd>${esc(c.pricing[0].range)}</dd>
        <dt>Premium</dt><dd>${esc(c.pricing[2] ? c.pricing[2].range : "")}</dd>
      </dl>
      ${affButton(c.slug, `Browse ${lowerFirst(c.short)}`, "btn btn-primary btn-block")}
    </div>
    <div class="side-card side-kit">
      <h2>Free Store Launch Kit</h2>
      <p>Checklist plus a cost sheet for everything you can outsource.</p>
      <a class="btn btn-accent btn-block" href="/free-store-launch-kit/">Get it free</a>
    </div>
  </aside>
</div>
`;
  writePage(
    urlPath,
    layout({
      title: c.metaTitle,
      description: c.metaDesc,
      urlPath,
      body,
      ogType: "article",
      schema: [
        {
          "@type": "Article",
          headline: c.h1,
          description: c.metaDesc,
          dateModified: BUILD_DATE,
          author: authorSchema,
          publisher: { "@type": "Organization", name: site.name, url: base + "/" },
          mainEntityOfPage: abs(urlPath),
        },
        bc.schema,
        faq.schema,
      ],
    }),
    { priority: "0.9" }
  );
}

function buildGuidesIndex() {
  const bc = breadcrumbs([{ name: "Home", path: "/" }, { name: "Guides", path: "/guides/" }]);
  const body = `
<div class="wrap">${bc.html}</div>
<section class="page-head wrap">
  <h1>Guides for launching your store</h1>
  <p class="lead">Practical guides to help you decide what to outsource, what it costs and how to hire well.</p>
</section>
<section class="section wrap"><div class="card-grid two">${guides
    .map(
      (g) => `<a class="card guide-card" href="/guides/${g.slug}/"><p class="eyebrow">${esc(g.label || "Guide")}</p><h3>${esc(
        g.title
      )}</h3><p>${esc(g.summary)}</p><span class="card-link">Read the guide <span aria-hidden="true">&rarr;</span></span></a>`
    )
    .join("")}</div></section>
<section class="section wrap">${kitCta}</section>
`;
  writePage(
    "/guides/",
    layout({
      title: "Guides for Launching an Online Store",
      description: "Practical guides on what to outsource when launching an online store, what it costs and how to hire freelancers well.",
      urlPath: "/guides/",
      body,
      schema: [bc.schema],
    }),
    { priority: "0.8" }
  );
}

function calculatorHtml() {
  const rows = categories
    .map(
      (c, i) => `<label class="calc-row">
  <input type="checkbox" data-low="${c.costLow}" data-high="${c.costHigh}"${i < 4 ? " checked" : ""}>
  <span class="calc-name"><strong>${esc(c.name)}</strong><small>${esc(c.summary)}</small></span>
  <span class="calc-price">$${c.costLow.toLocaleString("en-US")} - $${c.costHigh.toLocaleString("en-US")}</span>
</label>`
    )
    .join("");
  return `<div class="calc" id="cost-calc">
  <div class="calc-rows">${rows}</div>
  <div class="calc-total" aria-live="polite">
    <p>Estimated freelance cost</p>
    <p class="calc-amount"><span id="calc-low">$0</span> - <span id="calc-high">$0</span></p>
    <p class="small">Mid-range marketplace prices. Excludes platform fees, apps, themes and ad budget.</p>
  </div>
</div>
<h2>Where each number comes from</h2>
<div class="table-wrap"><table>
<thead><tr><th>Service</th><th>Budget</th><th>Typical</th><th>Premium</th></tr></thead>
<tbody>${categories
    .map(
      (c) =>
        `<tr><td><a href="/hire/${c.slug}/">${esc(c.name)}</a></td><td>${esc(c.pricing[0].range)}</td><td>${esc(
          (c.pricing[1] || c.pricing[0]).range
        )}</td><td>${esc((c.pricing[2] || c.pricing[0]).range)}</td></tr>`
    )
    .join("")}</tbody>
</table></div>
<h2>How to keep launch costs down</h2>
<ul class="checks">
  <li>Start with a free theme and add paid features only when you need them</li>
  <li>Take product photos yourself in good natural light and pay only for editing</li>
  <li>Order samples or small batches before committing to big packages</li>
  <li>Get tracking right before you spend on ads, so ad money is not wasted</li>
</ul>
<p>Not sure what to hire first? Read <a href="/guides/what-to-outsource-first/">what to outsource first when launching an online store</a>.</p>`;
}

function buildGuide(g) {
  const urlPath = `/guides/${g.slug}/`;
  const bc = breadcrumbs([
    { name: "Home", path: "/" },
    { name: "Guides", path: "/guides/" },
    { name: g.title, path: urlPath },
  ]);
  const faq = faqBlock(g.faqs);
  const content = g.type === "calculator" ? calculatorHtml() : g.html;
  const relatedServices = (g.services || []).map((s) => catBySlug[s]).filter(Boolean);
  const sources = (g.sources || []).length
    ? `<section class="section sources"><h2>Sources</h2><p class="small">Prices and fees change. We checked these sources when this guide was last updated.</p><ol>${g.sources
        .map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener nofollow">${esc(s.title)}</a></li>`)
        .join("")}</ol></section>`
    : "";
  const body = `
<div class="wrap">${bc.html}</div>
<article class="wrap narrow content">
  <header class="page-head">
    <p class="eyebrow">${esc(g.label || "Guide")}</p>
    <h1>${esc(g.title)}</h1>
    ${byline}
    <p class="lead">${esc(g.intro)}</p>
    ${disclosureNote}
  </header>
  <div class="prose">${content}</div>
  ${faq.html}
  ${
    relatedServices.length
      ? `<section class="section"><h2>Hiring guides mentioned in this article</h2><div class="card-grid three">${relatedServices
          .map(categoryCard)
          .join("")}</div></section>`
      : ""
  }
  ${sources}
  <section class="section">${kitCta}</section>
</article>
`;
  writePage(
    urlPath,
    layout({
      title: g.metaTitle,
      description: g.metaDesc,
      urlPath,
      body,
      ogType: "article",
      schema: [
        {
          "@type": "Article",
          headline: g.title,
          description: g.metaDesc,
          dateModified: BUILD_DATE,
          author: authorSchema,
          publisher: { "@type": "Organization", name: site.name, url: base + "/" },
          mainEntityOfPage: abs(urlPath),
        },
        bc.schema,
        faq.schema,
      ],
    }),
    { priority: "0.8" }
  );
}

function simplePage({ urlPath, title, description, h1, html, noindex = false, inSitemap = true, bodyAttrs = "" }) {
  const bc = breadcrumbs([{ name: "Home", path: "/" }, { name: h1, path: urlPath }]);
  const body = `
<div class="wrap">${bc.html}</div>
<article class="wrap narrow content">
  <header class="page-head"><h1>${esc(h1)}</h1></header>
  <div class="prose">${html}</div>
</article>`;
  writePage(urlPath, layout({ title, description, urlPath, body, noindex, schema: [bc.schema], bodyAttrs }), {
    inSitemap: inSitemap && !noindex,
    priority: "0.4",
  });
}

function buildKitPages() {
  // Landing page
  const urlPath = "/free-store-launch-kit/";
  const body = `
<section class="kit-hero">
  <div class="wrap kit-grid">
    <div>
      <p class="eyebrow">Free download</p>
      <h1>The Store Launch Kit</h1>
      <p class="lead">Everything to set up before you launch an online store, plus what each task costs if you hire it out.</p>
      <ul class="checks">
        <li>A 20-point launch checklist across brand, store, products, tracking and marketing</li>
        <li>A cost sheet with typical freelance prices for every task</li>
        <li>What to outsource first, and what to keep doing yourself</li>
        <li>A designed 4-page PDF you can print and keep</li>
      </ul>
      <div class="kit-photo">${picture("store-editor", "A store owner editing an online store theme on a laptop", 1200, 800)}</div>
    </div>
    <form class="lead-form" data-lead-form data-success="/kit-thank-you/" novalidate>
      <h2>Get the kit free</h2>
      <label>First name<input type="text" name="first_name" autocomplete="given-name" maxlength="60"></label>
      <label>Email<input type="email" name="email" autocomplete="email" required></label>
      <label class="hp" aria-hidden="true">Company<input type="text" name="company" tabindex="-1" autocomplete="off"></label>
      <label class="agree"><input type="checkbox" name="agree" value="yes" required> I agree to the <a href="/privacy-policy/">privacy policy</a>. No newsletters or spam.</label>
      <button class="btn btn-accent btn-block btn-lg" type="submit">Get the free kit</button>
      <p class="form-msg" role="status" aria-live="polite"></p>
      <p class="small">You will get the download link right away on the next page.</p>
    </form>
  </div>
</section>
<section class="section wrap narrow">
  <div class="author-box">
    <div class="author-avatar" aria-hidden="true">RK</div>
    <div>
      <h2>Made by a performance marketer</h2>
      <p>${esc(site.author.name)} has spent 7+ years running Google and Meta ads for ecommerce brands and setting up stores and tracking. This kit is the checklist he wishes every new store owner had before spending on ads.</p>
    </div>
  </div>
</section>`;
  writePage(
    urlPath,
    layout({
      title: "Free Store Launch Kit: Checklist and Cost Sheet",
      description: "Free 20-point online store launch checklist plus a cost sheet showing what to outsource and what each freelance service should cost.",
      urlPath,
      body,
    }),
    { priority: "0.8" }
  );

  // Thank-you page: one download button (noindex)
  simplePage({
    urlPath: "/kit-thank-you/",
    title: "Download Your Store Launch Kit",
    description: "Download your free Store Launch Kit.",
    h1: "Your Store Launch Kit is ready",
    noindex: true,
    bodyAttrs: "data-lead-page",
    html: `
<div class="download-card">
  <div class="download-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 3v12M7 10l5 5 5-5M5 20h14"/></svg></div>
  <div>
    <p class="download-title">The Store Launch Kit <span>PDF, 4 pages</span></p>
    <ul class="checks">
      <li>The 20-point launch checklist</li>
      <li>The cost sheet with typical freelance prices</li>
      <li>What to outsource first, plus 6 safe-hiring rules</li>
    </ul>
    <a class="btn btn-primary btn-lg" href="/assets/store-launch-kit.pdf" download="FreelancePicks-Store-Launch-Kit.pdf" data-kit-download>Download the kit</a>
  </div>
</div>
<h2>Where to start</h2>
<p>Most stores get the best return from fixing <a href="/hire/meta-pixel-capi-setup/">tracking</a> and <a href="/hire/product-photography/">product images</a> first. Read <a href="/guides/what-to-outsource-first/">what to outsource first</a> for the full order, or estimate your budget with the <a href="/guides/store-launch-cost/">store launch cost calculator</a>.</p>`,
  });
}

function buildStaticPages() {
  simplePage({
    urlPath: "/about/",
    title: "About FreelancePicks",
    description: "Who runs FreelancePicks, how we choose sellers and how the site makes money.",
    h1: "About FreelancePicks",
    html: `
<p class="lead">FreelancePicks helps people launching and growing online stores hire freelancers with more confidence.</p>
<h2>Who runs this site</h2>
<p>FreelancePicks is run by <a href="${esc(site.author.url)}" rel="noopener" target="_blank">${esc(site.author.name)}</a>, a ${esc(
      site.author.role.charAt(0).toLowerCase() + site.author.role.slice(1)
    )}. His work includes Shopify and WooCommerce stores, product catalogs, Meta Pixel and Conversions API setups, and paid campaigns across Google, Meta and Snapchat.</p>
<p>Many new store owners waste their first budget on the wrong freelancers or the wrong tasks. This site is the practical guidance he gives clients, written down for everyone.</p>
<h2>What you will find here</h2>
<ul class="checks">
  <li>What a good job includes for each service</li>
  <li>Typical price ranges, so you know what is fair</li>
  <li>Vetting checklists, questions to ask and red flags</li>
  <li>Hand-picked sellers worth considering</li>
</ul>
<h2>How we choose sellers</h2>
<p>We look at portfolio quality and relevance, recent reviews from buyers with similar projects, clear packages and delivery terms, and safe working practices like collaborator or partner access. We do not accept payment from sellers to be listed.</p>
<h2>How we make money</h2>
<p>Some links on this site are affiliate links. If you hire through them, we may earn a commission at no extra cost to you. Read the full <a href="/affiliate-disclosure/">affiliate disclosure</a>.</p>
${site.contactEmail ? `<h2>Contact</h2><p>Email <a href="mailto:${esc(site.contactEmail)}">${esc(site.contactEmail)}</a>.</p>` : ""}`,
  });

  simplePage({
    urlPath: "/affiliate-disclosure/",
    title: "Affiliate Disclosure",
    description: "How FreelancePicks makes money through affiliate links.",
    h1: "Affiliate disclosure",
    html: `
<p>FreelancePicks is free to use. To keep it that way, some links on this site are affiliate links. This includes links to freelance marketplaces such as Fiverr.</p>
<p>If you click one of these links and make a purchase, we may earn a commission. You pay the same price either way.</p>
<p>Affiliate relationships never decide what we write. Price ranges, checklists and red flags are written to help you hire well, and we only recommend sellers we would consider ourselves. FreelancePicks is an independent site and is not affiliated with, endorsed by or sponsored by any freelance marketplace.</p>
<p>Affiliate links on this site are marked with rel="sponsored" for search engines.</p>`,
  });

  simplePage({
    urlPath: "/privacy-policy/",
    title: "Privacy Policy",
    description: "How FreelancePicks collects and uses data.",
    h1: "Privacy policy",
    html: `
<p>Last updated: ${prettyDate(BUILD_DATE)}</p>
<h2>What we collect</h2>
<ul>
  <li><strong>Kit downloads:</strong> when you request the Store Launch Kit, we collect your first name and email address. We do not send newsletters or marketing emails. You can ask us to delete your details at any time.</li>
  <li><strong>Analytics and advertising cookies:</strong> if you accept cookies, we use tools such as the Meta Pixel and Google Analytics to understand how the site is used and to measure our ads. These tools may set cookies and collect information such as pages visited, links clicked and device details.</li>
  <li><strong>Server events:</strong> if you accept cookies, some events (such as signing up or clicking an affiliate link) may also be sent from our server to Meta through the Conversions API. Email addresses are hashed before they are sent.</li>
</ul>
<h2>How we use it</h2>
<p>To give you the kit, to improve the site, and to measure which ads and pages are useful. We do not sell your personal information.</p>
<h2>Third parties</h2>
<p>If we store kit signups, they are kept with a third-party contact management provider. When you click an affiliate link, the marketplace you visit has its own privacy policy and may use cookies to track the referral.</p>
<h2>Your choices</h2>
<p>You can decline or change cookie consent at any time using Cookie settings in the footer. To ask about or delete your data, ${
      site.contactEmail ? `email <a href="mailto:${esc(site.contactEmail)}">${esc(site.contactEmail)}</a>` : "contact us through the About page"
    }.</p>`,
  });

  // 404
  const body404 = `<section class="page-head wrap narrow center"><h1>Page not found</h1><p class="lead">The page you are looking for does not exist or has moved.</p><div class="hero-actions center"><a class="btn btn-primary" href="/hire/">Browse services</a><a class="btn btn-ghost" href="/">Go home</a></div></section>`;
  writePage("/404", layout({ title: "Page not found", description: "Page not found.", urlPath: "/404/", body: body404, noindex: true }), {
    inSitemap: false,
  });
}

function buildSeoFiles() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemap.map((p) => `  <url><loc>${esc(p.loc)}</loc><lastmod>${BUILD_DATE}</lastmod><priority>${p.priority}</priority></url>`).join("\n")}
</urlset>
`;
  fs.writeFileSync(path.join(OUT, "sitemap.xml"), xml);
  fs.writeFileSync(path.join(OUT, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /kit-thank-you/\n\nSitemap: ${abs("/sitemap.xml")}\n`);
}

// ---------- run ----------
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
copyDir(path.join(SRC, "assets"), path.join(OUT, "assets"));

buildHome();
buildHireIndex();
categories.forEach(buildCategory);
buildGuidesIndex();
guides.forEach(buildGuide);
buildKitPages();
buildStaticPages();
buildSeoFiles();

console.log(`Built ${sitemap.length} indexable pages into /dist`);
if (missingLinks.size) {
  console.warn(`\nAffiliate links missing for: ${[...missingLinks].join(", ")}`);
  console.warn("Add them in data/affiliate-links.js. Buttons for these categories are disabled until then.\n");
}
