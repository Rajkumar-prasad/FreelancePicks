# FreelancePicks

Hiring guides and hand-picked freelancers for people launching online stores. Monetized with affiliate links, promoted with Meta Ads and SEO.

Static site with no dependencies, built by `build.js` and hosted on Vercel. Two small serverless functions handle email signups (systeme.io) and Meta Conversions API.

## Where to edit things

| What | File |
|---|---|
| **All affiliate links and gig picks** | `data/affiliate-links.js` |
| Site name, URL, author, Pixel ID, GA4 ID | `data/site.js` |
| Service pages content and prices | `data/categories.js` |
| Guides | `data/guides.js` |
| Design | `src/assets/style.css` |
| Tracking, consent, forms, calculator | `src/assets/main.js` |

Push to GitHub and Vercel redeploys automatically.

## Pages

- `/` home
- `/hire/` and 8 service pages at `/hire/<slug>/`
- `/guides/what-to-outsource-first/`
- `/guides/store-launch-cost/` (cost calculator)
- `/free-store-launch-kit/` (lead magnet signup) and `/kit-thank-you/` (the kit itself, noindex)
- `/about/`, `/affiliate-disclosure/`, `/privacy-policy/`, `404`
- `sitemap.xml` and `robots.txt` are generated on every build

## Deploy on Vercel

1. Vercel > Add New > Project > import `Rajkumar-prasad/FreelancePicks`.
2. Framework preset: **Other**. Build and output settings come from `vercel.json`.
3. Deploy, then add the domain `freelancepicks.com` under Settings > Domains.

## Environment variables (Vercel > Settings > Environment Variables)

| Name | Needed for |
|---|---|
| `SYSTEME_API_KEY` | Email signup. Without it the form shows "Signups are not open yet". |
| `SYSTEME_TAG_ID` | Optional. Tag applied to new signups, use it to trigger your email sequence. |
| `META_PIXEL_ID` | Conversions API (same ID as `metaPixelId` in `data/site.js`). |
| `META_CAPI_TOKEN` | Conversions API access token from Events Manager. |
| `META_TEST_EVENT_CODE` | Optional. Remove after testing. |

## Tracking

- Pixel and GA4 load only after the visitor accepts cookies (set `consentRequired: false` in `data/site.js` to load immediately).
- Events: `PageView`, `OutboundClick` (custom, fired on every affiliate click with the category), `Lead` (thank-you page).
- `Lead` and `OutboundClick` are also sent server-side through CAPI with the same `event_id`, so Meta deduplicates them.

## Before launch checklist

- [ ] Paste affiliate links in `data/affiliate-links.js` (the build prints any that are missing)
- [ ] Review every price range in `data/categories.js`
- [ ] Add your first gig picks with your own notes
- [ ] Set `metaPixelId` / `ga4Id`, and the Vercel env vars
- [ ] Create the email sequence in systeme.io and set `SYSTEME_TAG_ID`
- [ ] Add a 1200 x 630 `og.png` to `src/assets/` and set `ogImage` in `data/site.js`
- [ ] Confirm in your affiliate terms that paid social traffic is allowed
- [ ] Submit `https://freelancepicks.com/sitemap.xml` in Google Search Console

## Local preview

```
npm run preview
```
