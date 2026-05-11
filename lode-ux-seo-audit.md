# Lode.rocks — UX & SEO Audit
**Auditor:** Senior UX / Growth (Nike-style systems thinking)  
**Date:** May 10, 2026  
**Stack:** Next.js 14 App Router · Tailwind · Prisma · Vercel

---

## What Was Fixed in This Session

### 🔴 Critical Bug: Broken Sitemap Entry (404 in Crawl)
**File:** `app/sitemap.ts`  
`/blog/junk-silver-guide` was listed with priority 0.8 but the route doesn't exist — Googlebot was crawling a hard 404, wasting crawl budget and sending a quality signal. **Removed.**

### 🔴 Critical Bug: Fake SearchAction in JSON-LD
**File:** `app/layout.tsx`  
The site-wide JSON-LD included a `SearchAction` pointing to `/?q={search_term_string}` but there is no search functionality on the site. Google's structured data guidelines explicitly prohibit fake actions. This risked a manual quality action and confused the knowledge graph. **Removed.**

### 🟠 SEO Gap: Missing `/gold-price` Page (Highest-Volume Miss)
**New file:** `app/gold-price/page.tsx`  
"Gold price today" is the single highest-volume precious metals search term globally. The site had `/silver-price` but no equivalent gold page. Built from scratch with:
- Live price hero with 7D / 30D change pills
- `MetalPriceChart` component (gold color, gold data feed)
- Weight reference table (per troy oz, per gram, per kilo, per pennyweight, per grain)
- 30-day high / low stats from DB
- Full editorial section (what moves gold, gram conversions, dealer premiums, Gold IRA crosslink)
- FAQ JSON-LD (7 Q&As targeting high-volume queries)
- Email capture CTA for anonymous users
- `alternates.canonical`, full OG tags, rich keywords

### 🟠 SEO Gap: Generic `MetalPriceChart` Component
**New file:** `components/MetalPriceChart.tsx`  
`SilverPriceChart` hardcoded the silver color and `json.silver` API key. Refactored into a generic `MetalPriceChart` that accepts a `metal` prop. `SilverPriceChart` is now a thin backward-compatible wrapper. Future platinum/palladium pages can reuse this with zero new chart code.

### 🟡 SEO Fix: Gram Page Title Too Narrow
**File:** `app/gram/page.tsx`  
Old title: `"Sterling Silver Price Per Gram Calculator"` — the page covers gold AND silver at all karat levels. Searchers looking for "gold price per gram" saw this page in Google as silver-only.  
New title: `"Gold & Silver Price Per Gram Calculator — Live Spot"`. Description and OG tags aligned.

### 🟡 UX Fix: Logged-Out Nav Too Minimal
**Files:** `components/NavLinks.tsx`, `components/NavMobile.tsx`  
Nav previously showed only "Calculator" and "Compare" for anonymous visitors — hiding the two best SEO landing pages from nav discovery.  
Desktop now shows: **Gold Price · Silver Price · Compare · Gold IRA · Get started**  
Mobile drawer now shows: Gold Price · Silver Price · Compare · Calculator · Gold IRA · FAQ · Get started

### 🟡 UX Fix: Homepage Price Tiles Had No Links
**File:** `app/page.tsx`  
The homepage price panel had 4 metal tiles but only one tiny "Silver detail →" text link. Gold and Silver tiles are now wrapped in `<Link>` tags pointing to their detail pages. Added "Gold detail →" alongside "Silver detail →" in the panel header. This also improves internal PageRank distribution to the two highest-priority content pages.

### 🟡 SEO Fix: `/gold-price` Added to Sitemap
**File:** `app/sitemap.ts`  
New entry with `priority: 1.0` and `changeFrequency: "hourly"`, matching the treatment given to `/silver-price`.

---

## Remaining Recommendations (Priority Order)

### P1 — Build `/platinum-price` and `/palladium-price` Pages
The site tracks all four metals but only gold and silver have detail pages. "Platinum price today" and "palladium price today" are smaller but real search volumes. With `MetalPriceChart` now generic, building these pages is copy-paste from `gold-price/page.tsx` + metal-specific editorial.

### P1 — Create the Junk Silver Blog Post
The sitemap previously referenced `/blog/junk-silver-guide` — this was removed to stop the 404, but the content opportunity is real. "Junk silver value" and "junk silver calculator" are high-intent queries. A full editorial guide with internal links to `/junk-silver-calculator` and `/compare` would build topical authority. Add to sitemap when live.

### P2 — Put Current Price in `<title>` Tag for Live Price Pages
Competitors like Kitco and Goldprice.org put the current spot price in the browser tab title (e.g., `"Gold Price $4,679 | Lode"`). This increases CTR in repeat-visit bookmarks and browser tab bars. Requires a client-side `useEffect` that updates `document.title` after the price loads — or using Next.js `generateMetadata` with `revalidate: 60`.

### P2 — OG Images for Individual Pages
Only the homepage has a custom OG image (`/opengraph-image`). Pages like `/gold-price`, `/silver-price`, `/coin-melt-calculator`, and `/compare` use the default fallback. Dynamic OG images with the current price embedded (using `next/og` / `@vercel/og`) would significantly improve social share CTR.

### P2 — Add `dateModified` to `/gram` Sitemap Entry
`/gram` is listed with `lastModified: new Date("2026-04-13")` which is stale. If content is refreshed or the price reference tables are updated, bump this date — Googlebot uses it to prioritize recrawling.

### P3 — FAQ Rich Results for `/gold-price` and `/gram`
Both pages have FAQ-worthy content. The `/gold-price` page has FAQ JSON-LD (built in this session). The `/gram` page does not — add FAQ structured data covering "how much is 1 gram of gold worth?" and "how much is sterling silver per gram?" These unlock expandable Q&A rich results in the SERP.

### P3 — Internal Link: `/gram` → `/gold-price` and `/silver-price`
The gram calculator page has no contextual links back to the live price detail pages. A small "Today's live gold spot: $X.XX/ozt →" link above the calculator form would improve UX (users can see what the base rate is) and internal linking.

### P3 — Fix `PriceTile` Leftover Style
**File:** `app/page.tsx`, `PriceTile` component  
Each tile has `style={{ borderLeft: "2px solid transparent" }}` — this looks like an unfinished hover-highlight intent. Either add a hover color change (`borderLeftColor: dot` on hover) or remove the redundant style to clean up the DOM.

### P3 — Footer Visibility on Mobile for Logged-In Users
**File:** `components/SiteFooter.tsx`  
`className="... hidden sm:block"` when `isLoggedIn` — the footer is completely hidden on mobile for logged-in users. This means logged-in mobile users have no way to access Privacy Policy, Terms, or the About page. The bottom nav is a good substitute for main nav, but legal/info links should still be accessible. Consider a minimal footer even on mobile for logged-in users (just the legal links row).

### P4 — Add `author` Meta Tag and `logo` to Organization Schema
The `Organization` JSON-LD in `layout.tsx` is missing a `logo` property, which helps Google identify brand assets for the knowledge panel. Add `"logo": "https://lode.rocks/icon.png"` (or generate from `app/icon.tsx`). Also consider `<meta name="author" content="Lode">` in `<head>`.

### P4 — Reduce Alert Check Frequency (User Expectation)
The FAQ says "Alerts are checked once per day." The Gold Price Alerts page describes it as a "daily email check." These are consistent, but consider whether upgrading to hourly checks (or being explicit about the check time in ET) would meaningfully improve the product and justify a Pro feature tier upgrade.

---

## SEO Quick-Wins Still Available

| Query | Current Status | Opportunity |
|---|---|---|
| "gold price today" | No dedicated page ✅ **now fixed** | `/gold-price` page live |
| "gold price per gram" | Gram page title was silver-only ✅ **fixed** | Title updated |
| "platinum price today" | No page | Build `/platinum-price` |
| "palladium price today" | No page | Build `/palladium-price` |
| "junk silver value guide" | 404 in sitemap ✅ **fixed** | Build blog post |
| "best gold IRA companies 2026" | `/gold-ira` exists, well-optimized | Maintain |
| "compare silver dealers" | `/compare` exists | Add more coin types |

---

## Technical Health Summary

| Check | Status |
|---|---|
| Canonical tags | ✅ All pages |
| robots.txt | ✅ Correct (disallows /dashboard, /api, /login) |
| Sitemap | ✅ Fixed (removed 404, added /gold-price) |
| JSON-LD | ✅ Fixed (removed fake SearchAction) |
| OG tags | ✅ Homepage; ⚠️ missing per-page images on inner pages |
| Twitter card | ✅ summary_large_image on all pages |
| Breadcrumb schema | ✅ All content pages |
| FAQPage schema | ✅ /faq, /silver-price, /gold-price, /gold-ira |
| Mobile nav | ✅ Expanded with key pages |
| Focus ring | ✅ Global :focus-visible in globals.css |
| Skip-to-main | ✅ Present in layout |
| Reduced motion | ✅ Respected by all animations |
| HTTPS | ✅ Vercel enforced |
| Core Web Vitals | ⚠️ Not measured here — run Lighthouse or PageSpeed Insights |
