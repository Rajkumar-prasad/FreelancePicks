// Site-wide settings. Edit these values, then redeploy.
module.exports = {
  name: "FreelancePicks",
  url: "https://freelancepicks.com", // no trailing slash
  tagline: "Hand-picked freelancers for launching and growing your online store",
  description:
    "Price guides, vetting checklists and hand-picked freelancers for every step of launching an online store: logo, store setup, product photos, copy, tracking and ads.",

  author: {
    name: "Raj Kumar Prasad",
    role: "Performance marketer with 7+ years of experience running Google and Meta ads for ecommerce and lead generation brands",
    url: "https://rajkumarprasad.com",
  },

  contactEmail: "", // e.g. "hello@freelancepicks.com" - shown on the About page if set

  // Tracking. Leave empty until you have the IDs.
  metaPixelId: "", // e.g. "123456789012345" - also set META_PIXEL_ID in Vercel for CAPI
  ga4Id: "", // e.g. "G-XXXXXXXXXX"
  consentRequired: true, // show a cookie banner and load tracking only after the visitor accepts

  ogImage: "", // e.g. "/assets/og.png" (1200 x 630)
};
