// Builds the Store Launch Kit PDF from the same data as the website.
// Usage: node tools/build-kit-pdf.js [fontsDir]
//   fontsDir (optional): folder containing @fontsource/inter and @fontsource/plus-jakarta-sans
//   (npm install @fontsource/inter @fontsource/plus-jakarta-sans). Without it, system fonts are used.
// Output: src/assets/store-launch-kit.pdf (needs Playwright with Chromium installed).
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const site = require(path.join(ROOT, "data/site"));
const categories = require(path.join(ROOT, "data/categories"));
const groups = require(path.join(ROOT, "data/kit"));

const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const url = (p) => site.url.replace(/\/$/, "") + p;
const short = (p) => url(p).replace(/^https?:\/\//, "");
const bySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));
const money = (n) => "$" + n.toLocaleString("en-US");
const sum = (slugs) => slugs.reduce((a, s) => [a[0] + bySlug[s].costLow, a[1] + bySlug[s].costHigh], [0, 0]);

const fontsDir = process.argv[2];
let fontCss = "";
if (fontsDir) {
  const f = (pkg, file) => "file://" + path.join(fontsDir, "node_modules/@fontsource", pkg, "files", file);
  fontCss = `
@font-face{font-family:Inter;font-weight:400;src:url(${f("inter", "inter-latin-400-normal.woff2")})}
@font-face{font-family:Inter;font-weight:600;src:url(${f("inter", "inter-latin-600-normal.woff2")})}
@font-face{font-family:Inter;font-weight:700;src:url(${f("inter", "inter-latin-700-normal.woff2")})}
@font-face{font-family:Jakarta;font-weight:700;src:url(${f("plus-jakarta-sans", "plus-jakarta-sans-latin-700-normal.woff2")})}
@font-face{font-family:Jakarta;font-weight:800;src:url(${f("plus-jakarta-sans", "plus-jakarta-sans-latin-800-normal.woff2")})}`;
}

const logo = (fg = "#161a1d", accent = "#0d7a41") =>
  `<span class="logo" style="color:${fg}"><svg viewBox="0 0 64 64" width="26" height="26"><rect width="64" height="64" rx="16" fill="#0d7a41"/><path d="M18 33.5l9 9 19-20" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Freelance<b style="color:${accent}">Picks</b></span></span>`;

const footer = (n) => `<div class="foot"><span>${esc(site.name)} &middot; The Store Launch Kit</span><span>${short("/")} &middot; ${n}</span></div>`;

const lean = ["logo-designer", "product-photography", "product-description-writer", "meta-pixel-capi-setup"];
const full = ["shopify-developer", "logo-designer", "product-photography", "product-description-writer", "meta-pixel-capi-setup", "product-video-ugc", "meta-ads-setup"];
const [leanLo, leanHi] = sum(lean);
const [fullLo, fullHi] = sum(full);

const html = `<!doctype html><html><head><meta charset="utf-8"><title>The Store Launch Kit</title><style>
${fontCss}
@page{size:Letter;margin:0}
*{box-sizing:border-box}
body{margin:0;font-family:Inter,Arial,sans-serif;color:#161a1d;font-size:10.5pt;line-height:1.5}
h1,h2,h3{font-family:Jakarta,Inter,Arial,sans-serif;letter-spacing:-0.02em;margin:0}
a{color:#0d7a41;text-decoration:none}
.page{width:8.5in;height:11in;padding:0.6in 0.65in 0.75in;position:relative;page-break-after:always;overflow:hidden}
.page:last-child{page-break-after:auto}
.logo{display:inline-flex;align-items:center;gap:8px;font-family:Jakarta,Inter,sans-serif;font-weight:800;font-size:15pt;letter-spacing:-0.02em}
.foot{position:absolute;left:0.65in;right:0.65in;bottom:0.4in;display:flex;justify-content:space-between;font-size:8pt;color:#7a838a;border-top:1px solid #e3e7e2;padding-top:8px}
.cover{background:#111714;color:#d7e0da;padding:0.75in}
.cover .glow{position:absolute;right:-1.6in;top:-1.6in;width:5in;height:5in;border-radius:50%;background:radial-gradient(circle,rgba(201,242,122,.38),rgba(201,242,122,0) 70%)}
.cover .glow2{position:absolute;left:-1.5in;bottom:-2in;width:5in;height:5in;border-radius:50%;background:radial-gradient(circle,rgba(13,122,65,.55),rgba(13,122,65,0) 70%)}
.cover h1{color:#fff;font-size:44pt;line-height:1.02;margin:1.6in 0 0.2in;font-weight:800;position:relative}
.cover .sub{font-size:14pt;color:#c4d0c8;max-width:5.4in;position:relative}
.tag{display:inline-block;background:#c9f27a;color:#111714;font-weight:700;font-size:8.5pt;letter-spacing:.08em;text-transform:uppercase;padding:4px 10px;border-radius:6px}
.toc{position:relative;margin-top:0.7in;display:grid;gap:10px;max-width:5.6in}
.toc div{display:flex;gap:14px;align-items:baseline;border-top:1px solid #2a352f;padding-top:10px}
.toc b{font-family:Jakarta,sans-serif;color:#c9f27a;font-size:13pt;width:28px}
.toc span{color:#fff;font-weight:600}
.toc small{display:block;color:#9fb0a6;font-weight:400}
.by{position:absolute;left:0.75in;bottom:0.6in;font-size:9pt;color:#9fb0a6}
.by strong{color:#fff}
.head{display:flex;justify-content:space-between;align-items:center;margin-bottom:0.25in}
.part{font-size:8.5pt;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#0d7a41}
h2{font-size:22pt;margin:4px 0 6px}
.intro{color:#5f6870;margin:0 0 14px;max-width:6in}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px 18px}
.group{border:1px solid #e3e7e2;border-radius:12px;padding:12px 14px;break-inside:avoid}
.group h3{font-size:11.5pt;margin-bottom:6px;display:flex;align-items:center;gap:8px}
.group h3 i{font-style:normal;background:#e8f5ec;color:#0d7a41;border-radius:6px;font-size:8.5pt;padding:2px 7px;font-family:Inter,sans-serif;font-weight:700}
.item{display:flex;gap:9px;padding:4px 0;border-top:1px dashed #e3e7e2}
.item:first-of-type{border-top:0}
.box{flex:none;width:12px;height:12px;border:1.6px solid #9aa59e;border-radius:3px;margin-top:3px}
.hh{font-size:8pt;font-weight:600;white-space:nowrap}
.group.wide{grid-column:1 / -1}
.group.wide .items{display:grid;grid-template-columns:1fr 1fr;column-gap:18px}
.group.wide .item{border-top:1px dashed #e3e7e2}
.note{background:#f4f6f3;border-radius:10px;padding:10px 14px;font-size:9pt;color:#3a4148;margin-top:14px}
table{width:100%;border-collapse:collapse;font-size:9.5pt}
th,td{text-align:left;padding:7px 10px;border-bottom:1px solid #e3e7e2;vertical-align:top}
thead th{background:#f4f6f3;font-size:8.5pt;text-transform:uppercase;letter-spacing:.05em;color:#3a4148}
td.mid{font-weight:700;background:#f3faf5}
.plans{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:16px}
.plan{border:1px solid #e3e7e2;border-radius:12px;padding:14px}
.plan.pop{border:2px solid #0d7a41}
.plan h3{font-size:12pt}
.plan .cost{font-family:Jakarta,sans-serif;font-weight:800;font-size:18pt;margin:2px 0}
.plan p{margin:0;font-size:9pt;color:#5f6870}
.steps{display:grid;gap:6px}
.step{display:flex;gap:12px;align-items:center;border:1px solid #e3e7e2;border-radius:10px;padding:7px 12px;break-inside:avoid}
.step b{flex:none;width:26px;height:26px;border-radius:8px;background:#0d7a41;color:#fff;display:grid;place-items:center;font-family:Jakarta,sans-serif}
.step strong{display:block}
.step span{font-size:9pt;color:#5f6870}
.rules{display:grid;grid-template-columns:1fr 1fr;gap:6px 18px;margin-top:6px}
.rules div{font-size:9.5pt;padding-left:16px;position:relative}
.rules div:before{content:"";position:absolute;left:0;top:5px;width:8px;height:5px;border-left:2px solid #0d7a41;border-bottom:2px solid #0d7a41;transform:rotate(-45deg)}
.cta{margin-top:12px;background:linear-gradient(120deg,#0d7a41,#3fae5d);color:#eafbe9;border-radius:14px;padding:16px 20px}
.cta h3{color:#fff;font-size:13pt;margin-bottom:2px}
.cta a{color:#fff;font-weight:700;text-decoration:underline}
</style></head><body>

<section class="page cover">
  <div class="glow"></div><div class="glow2"></div>
  ${logo("#ffffff", "#c9f27a")}
  <h1>The Store<br>Launch Kit</h1>
  <p class="sub">Everything to set up before you launch an online store, and what each task costs if you hire it out.</p>
  <div class="toc">
    <div><b>1</b><p style="margin:0"><span>The 20-point launch checklist</span><small>Brand, store, products, tracking and marketing</small></p></div>
    <div><b>2</b><p style="margin:0"><span>The cost sheet</span><small>Typical freelance prices for every task, plus two launch plans</small></p></div>
    <div><b>3</b><p style="margin:0"><span>What to outsource first</span><small>The order that protects your budget, plus 6 safe-hiring rules</small></p></div>
  </div>
  <p class="by">By <strong>${esc(site.author.name)}</strong>, performance marketer &middot; <a href="${url("/")}" style="color:#c9f27a">${short("/")}</a></p>
</section>

<section class="page">
  <div class="head">${logo()}<span class="tag" style="background:#e8f5ec;color:#0d7a41">Part 1</span></div>
  <p class="part">Checklist</p>
  <h2>The 20-point launch checklist</h2>
  <p class="intro">Tick each item before you send traffic to your store. Where hiring help makes sense, you will find the guide for that service.</p>
  <div class="grid">
  ${groups
    .map(
      (g, gi) => `<div class="group${gi === groups.length - 1 ? " wide" : ""}"><h3><i>${String(gi + 1).padStart(2, "0")}</i>${esc(g.name)}</h3><div class="items">${g.items
        .map(
          ([t, slug]) =>
            `<div class="item"><span class="box"></span><div>${esc(t)}${
              slug ? ` <a class="hh" href="${url(`/hire/${slug}/`)}">Hire help &rarr;</a>` : ""
            }</div></div>`
        )
        .join("")}</div></div>`
    )
    .join("")}
  </div>
  <p class="note"><strong>Before you launch:</strong> place a real test order, check the confirmation email, and confirm the Purchase event shows up once in Meta Events Manager with the right value.</p>
  ${footer(2)}
</section>

<section class="page">
  <div class="head">${logo()}<span class="tag" style="background:#e8f5ec;color:#0d7a41">Part 2</span></div>
  <p class="part">Cost sheet</p>
  <h2>What each service costs</h2>
  <p class="intro">Typical freelance marketplace prices at the time of writing. Prices change, so check current packages before you order.</p>
  <table>
    <thead><tr><th>Service</th><th>Budget</th><th>Typical</th><th>Premium</th></tr></thead>
    <tbody>${categories
      .map(
        (c) =>
          `<tr><td><a href="${url(`/hire/${c.slug}/`)}"><strong>${esc(c.name)}</strong></a></td><td>${esc(c.pricing[0].range)}</td><td class="mid">${esc((c.pricing[1] || c.pricing[0]).range)}</td><td>${esc(
            (c.pricing[2] || c.pricing[0]).range
          )}</td></tr>`
      )
      .join("")}</tbody>
  </table>
  <div class="plans">
    <div class="plan"><h3>Lean launch</h3><p class="cost">${money(leanLo)} - ${money(leanHi)}</p><p>Logo, photo editing, product copy and tracking. You set up the store yourself.</p></div>
    <div class="plan pop"><h3>Full launch</h3><p class="cost">${money(fullLo)} - ${money(fullHi)}</p><p>Store setup, logo, photos, copy, tracking, UGC videos and Meta ads setup.</p></div>
  </div>
  <p class="note">Not included: your platform plan, theme, apps, domain, stock and ad budget. Get a custom estimate with the calculator at <a href="${url("/guides/store-launch-cost/")}">${short("/guides/store-launch-cost/")}</a>.</p>
  ${footer(3)}
</section>

<section class="page">
  <div class="head">${logo()}<span class="tag" style="background:#e8f5ec;color:#0d7a41">Part 3</span></div>
  <p class="part">Priorities</p>
  <h2>What to outsource first</h2>
  <p class="intro">Outsource work that is skill-heavy and done once. Keep work that depends on your knowledge of the product and your customers.</p>
  <div class="steps">
    ${[
      ["Tracking before ads", "Pixel and Conversions API, so you know which ads make money.", "meta-pixel-capi-setup"],
      ["Product images", "Images do most of the selling. Good phone photos plus editing go a long way.", "product-photography"],
      ["Store setup, if you are not technical", "A developer can save you weeks. Use collaborator access, never your password.", "shopify-developer"],
      ["A clean logo", "Original, readable at small sizes, with vector files.", "logo-designer"],
      ["Product copy", "Descriptions that answer real buyer questions and help SEO.", "product-description-writer"],
      ["Video creatives", "UGC and product videos are often the best-performing ads.", "product-video-ugc"],
      ["Ads setup, then management", "Start with a one-time setup and testing plan, then decide on monthly help.", "meta-ads-setup"],
    ]
      .map(
        ([t, d, s], i) => `<div class="step"><b>${i + 1}</b><div><strong>${esc(t)}</strong><span>${esc(d)} <a href="${url(`/hire/${s}/`)}">Guide</a></span></div></div>`
      )
      .join("")}
  </div>
  <h3 style="margin:16px 0 4px;font-size:12pt">6 rules for hiring safely</h3>
  <div class="rules">
    <div>Keep messages and payments on the platform</div>
    <div>Never share passwords. Use collaborator or partner access.</div>
    <div>Start with a small paid test or sample</div>
    <div>Agree on deliverables, revisions and deadline in writing</div>
    <div>Own your accounts: store, domain, ad account and pixel</div>
    <div>Check recent reviews from similar projects</div>
  </div>
  <div class="cta"><h3>Ready to hire?</h3>Every service has a full guide with prices, a vetting checklist and red flags at <a href="${url("/hire/")}">${short("/hire/")}</a></div>
  ${footer(4)}
</section>
</body></html>`;

const outHtml = path.join(ROOT, "tools", ".kit.html");
const outPdf = path.join(ROOT, "src", "assets", "store-launch-kit.pdf");
fs.writeFileSync(outHtml, html);

(async () => {
  let chromium;
  try {
    ({ chromium } = require("playwright"));
  } catch (e) {
    console.log(`Playwright not found. Open ${outHtml} in Chrome and print to PDF (Letter, no margins, background graphics on).`);
    return;
  }
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto("file://" + outHtml, { waitUntil: "networkidle" });
  await page.pdf({ path: outPdf, format: "Letter", printBackground: true, preferCSSPageSize: true });
  await browser.close();
  fs.unlinkSync(outHtml);
  console.log("Wrote " + path.relative(ROOT, outPdf));
})();
