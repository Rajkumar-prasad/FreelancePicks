const group = (title, items) =>
  `<h2>${title}</h2><ul class="kit-list">${items
    .map(([t, d, link]) => `<li><label><input type="checkbox"> <span><strong>${t}</strong><br><small>${d}</small></span></label>${link ? ` <a class="kit-link" href="${link[0]}">${link[1]}</a>` : ""}</li>`)
    .join("")}</ul>`;

module.exports = {
  slug: "shopify-store-launch-checklist",
  type: "article",
  label: "Checklist",
  title: "Shopify Store Launch Checklist: 30 Things to Check Before You Go Live",
  metaTitle: "Shopify Store Launch Checklist: 30 Things to Check Before Going Live",
  metaDesc:
    "A practical Shopify launch checklist: settings, products, checkout, shipping, tracking, SEO and a final test order. Tick items off as you go.",
  summary: "30 practical checks across settings, products, checkout, tracking and SEO, ending with a real test order.",
  intro:
    "Before you remove the password page and start sending traffic, run through these 30 checks. They catch the problems that cost new stores sales and ad money in the first weeks: broken checkout, missing policies, wrong shipping rates and tracking that does not fire.",
  services: ["shopify-developer", "meta-pixel-capi-setup", "product-description-writer"],
  sources: [
    { title: "Handling Duplicate Pixel and Conversions API Events - Meta for Developers", url: "https://developers.facebook.com/docs/marketing-api/conversions-api/deduplicate-pixel-and-server-events" },
  ],
  faqs: [
    { q: "How do I test checkout on Shopify before launch?", a: "Place a real test order. You can use Shopify Payments test mode or Shopify's test payment gateway, or place a real order with a card and refund it. Check the confirmation email, the order in your admin and the Purchase event in Meta Events Manager." },
    { q: "Do I need policy pages to launch?", a: "Yes. Shipping, returns or refunds, privacy and terms pages build trust, and payment providers and ad platforms expect them. Shopify includes templates in Settings > Policies, but edit them to match how your store really works." },
    { q: "When should I remove the password page?", a: "After every item in this checklist passes, including a real test order. Ads and search engines should only ever see a finished store." },
  ],
  html: `
<div class="answer"><p class="answer-label">How to use this checklist</p><p>Work top to bottom. Tick each item in your browser as you go. If an item would take you hours, the link next to it points to a hiring guide so you can hand it off. Want this as a printable kit with a cost sheet? Get the free <a href="/free-store-launch-kit/">Store Launch Kit</a>.</p></div>
${group("1. Store settings", [
  ["Store name, contact email and address are correct", "Customers see these in emails and on your policies.", null],
  ["Custom domain connected and set as primary", "Your .myshopify.com address should redirect to your own domain.", null],
  ["Sender email authenticated", "Authenticate your domain for email sending so order emails do not land in spam.", null],
  ["Currency, time zone and units set", "Mistakes here show up on every product and every report.", null],
  ["Staff and collaborator access reviewed", "Remove anyone who no longer needs access.", ["/hire/shopify-developer/", "Shopify help"]],
])}
${group("2. Products", [
  ["Every product has 4 or more good images", "Main white-background image, angles, details and an in-use or scale shot.", ["/hire/product-photography/", "Photo help"]],
  ["Descriptions answer real buyer questions", "What it is, who it is for, size, materials, care and what is in the box.", ["/hire/product-description-writer/", "Copy help"]],
  ["Prices, compare-at prices and variants checked", "Check every size and color combination, not just the first one.", null],
  ["Inventory tracking and stock levels set", "Decide whether to keep selling when out of stock.", null],
  ["Collections built and sorted", "Make it easy to browse from the homepage and menu.", null],
])}
${group("3. Checkout and payments", [
  ["Payment provider activated", "Shopify Payments or another provider, with your bank account verified.", null],
  ["Express checkout options turned on", "Options like Shop Pay, Apple Pay and Google Pay speed up mobile checkout.", null],
  ["Checkout branding matches your store", "Logo, colors and fonts on the checkout page.", null],
  ["Order confirmation and shipping emails customized", "Add your logo and a support email.", null],
])}
${group("4. Shipping and tax", [
  ["Shipping zones and rates set for every country you sell to", "Test a cart that should qualify for free shipping, if you offer it.", null],
  ["Product weights entered", "Calculated rates depend on them.", null],
  ["Tax settings reviewed", "Rules depend on where you sell. Ask an accountant if you are unsure.", null],
])}
${group("5. Pages and trust", [
  ["Shipping, returns, privacy and terms pages published", "Use Shopify's templates in Settings > Policies as a start, then edit them.", null],
  ["About and Contact pages written", "A real story and a way to reach you build trust.", null],
  ["Footer links to every policy page", "Reviewers for payment providers and ad platforms look for these.", null],
  ["Store tested on a real phone", "Most visitors will be on mobile. Check menu, product pages and cart.", null],
])}
${group("6. Tracking", [
  ["Meta Pixel installed with standard events", "PageView, ViewContent, AddToCart, InitiateCheckout and Purchase.", ["/hire/meta-pixel-capi-setup/", "Tracking help"]],
  ["Conversions API connected without double counting", "Browser and server events need matching event IDs so Meta can deduplicate them.", ["/guides/meta-pixel-vs-conversions-api/", "Read guide"]],
  ["Google Analytics 4 and Search Console connected", "Submit your sitemap in Search Console.", null],
])}
${group("7. SEO and marketing", [
  ["Homepage, collection and product SEO titles written", "Unique titles and meta descriptions, not just product names.", null],
  ["Image alt text added", "Describe the product in plain words.", null],
  ["Email signup and welcome email live", "Start building your list from the first visitor.", null],
])}
${group("8. Final test", [
  ["Place a real test order and refund it", "Check the confirmation email, the order in your admin and the Purchase event in Events Manager.", null],
  ["Remove the password page", "Only after every item above passes.", null],
])}
<aside class="tip"><p class="tip-label">Raj's tip</p><p>The test order is the step people skip, and it is the one that matters most. If the Purchase event does not show up once, with the right value and currency, fix it before you spend anything on ads. Otherwise Meta optimizes on bad data from day one.</p></aside>
<h2>What to hand off, and what to keep</h2>
<p>Settings, policies and pricing decisions should stay with you, because they depend on how you run your business. Skill-heavy, one-time jobs are good to outsource: <a href="/hire/shopify-developer/">store setup</a>, <a href="/hire/product-photography/">image editing</a> and <a href="/hire/meta-pixel-capi-setup/">tracking</a>. See <a href="/guides/shopify-store-setup-cost/">what Shopify setup costs</a> to plan the budget.</p>
`,
};
