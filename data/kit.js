// Store Launch Kit checklist. Used by the kit page (build.js) and the PDF (tools/build-kit-pdf.js).
// Each item: [text, service slug to link or null]
module.exports = [
  {
    name: "Brand",
    items: [
      ["Domain name bought and connected", null],
      ["Logo in vector, transparent PNG and square icon versions", "logo-designer"],
      ["Brand colors and fonts chosen", "logo-designer"],
      ["Professional email address on your domain", null],
    ],
  },
  {
    name: "Store",
    items: [
      ["Theme set up and tested on mobile", "shopify-developer"],
      ["Payments, shipping zones and taxes configured", "shopify-developer"],
      ["Policy pages: shipping, returns, privacy and terms", "shopify-developer"],
      ["About and Contact pages written", "product-description-writer"],
    ],
  },
  {
    name: "Products",
    items: [
      ["4 to 6 edited images per product", "product-photography"],
      ["Descriptions that answer buyer questions", "product-description-writer"],
      ["SEO titles and meta descriptions", "product-description-writer"],
      ["Variants, prices and stock checked", null],
    ],
  },
  {
    name: "Tracking",
    items: [
      ["Meta Pixel with standard events", "meta-pixel-capi-setup"],
      ["Conversions API with deduplication", "meta-pixel-capi-setup"],
      ["GA4 and Google Search Console connected", null],
      ["Test order placed and checked in Events Manager", "meta-pixel-capi-setup"],
    ],
  },
  {
    name: "Marketing",
    items: [
      ["Email signup popup and welcome email", null],
      ["Abandoned cart email", null],
      ["First 3 to 5 ad creatives, including video", "product-video-ugc"],
      ["Ad account, audiences and testing plan ready", "meta-ads-setup"],
    ],
  },
];
