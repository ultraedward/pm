import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { isPromoActive, AMERICA_250_PROMO } from "@/lib/promo";

// Affiliate URLs — kept server-side only. Base URLs set in Vercel env vars.
// Sub-IDs appended per placement so we can see which CTA converts best
// in each affiliate dashboard (filter by sub_id in their reporting).
const AUGUSTA_BASE        = process.env.AFFILIATE_AUGUSTA_URL ?? null;
const AUGUSTA_CARD        = AUGUSTA_BASE ? `${AUGUSTA_BASE}&sub_id=card`        : null;
const AUGUSTA_DEEPDIVE    = AUGUSTA_BASE ? `${AUGUSTA_BASE}&sub_id=deepdive`    : null;
const AUGUSTA_ELIGIBILITY = AUGUSTA_BASE ? `${AUGUSTA_BASE}&sub_id=eligibility` : null;

// Birch Gold — bitira.hasoffers.com offer_id=28, aff_id=2046, 3% CPS
const BIRCH_BASE               = process.env.AFFILIATE_BIRCH_URL ?? null;
const BIRCH_CARD               = BIRCH_BASE ? `${BIRCH_BASE}&sub_id=card`               : null;
const BIRCH_CARD_PROMO         = BIRCH_BASE ? `${BIRCH_BASE}&sub_id=america250_ira_card` : null;
const BIRCH_DEEPDIVE           = BIRCH_BASE ? `${BIRCH_BASE}&sub_id=deepdive`            : null;
const BIRCH_DEEPDIVE_PROMO     = BIRCH_BASE ? `${BIRCH_BASE}&sub_id=america250_ira_deep` : null;
const BIRCH_ELIGIBILITY        = BIRCH_BASE ? `${BIRCH_BASE}&sub_id=eligibility`         : null;
const BIRCH_ELIGIBILITY_PROMO  = BIRCH_BASE ? `${BIRCH_BASE}&sub_id=america250_ira_elig` : null;

const promoActive = isPromoActive();

// Per-company CTA lookup — keeps COMPANIES array clean (no runtime values in `as const`)
// During the promo window, Birch URLs use promo-specific sub_ids for attribution.
const COMPANY_CTAS: Record<string, { card: string | null; deepdive: string | null; eligibility: string | null }> = {
  augusta: { card: AUGUSTA_CARD,                                          deepdive: AUGUSTA_DEEPDIVE,                                        eligibility: AUGUSTA_ELIGIBILITY                                        },
  birch:   { card: promoActive ? BIRCH_CARD_PROMO : BIRCH_CARD,          deepdive: promoActive ? BIRCH_DEEPDIVE_PROMO : BIRCH_DEEPDIVE,      eligibility: promoActive ? BIRCH_ELIGIBILITY_PROMO : BIRCH_ELIGIBILITY },
};

// ── Last reviewed date ─────────────────────────────────────────────────────
const LAST_REVIEWED = "2026-05-27";

function fmtReviewed(iso: string): string {
  const d = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric", timeZone: "UTC",
  });
}

// ── SEO metadata ───────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Best Gold IRA Companies 2026 — Reviewed & Compared",
  description:
    "Side-by-side comparison of the top Gold IRA companies — Augusta Precious Metals, Goldco, Birch Gold, and Noble Gold. Fees, minimums, ratings, and who each is best for.",
  alternates: { canonical: "https://lode.rocks/gold-ira" },
  keywords: [
    "best gold IRA companies",
    "gold IRA comparison",
    "gold IRA vs physical gold",
    "Augusta Precious Metals review",
    "Goldco review",
    "best gold IRA 2026",
    "gold IRA minimum investment",
    "self directed gold IRA",
    "gold IRA rollover",
    "top gold IRA companies",
  ],
  openGraph: {
    title: "Best Gold IRA Companies 2026 — Reviewed & Compared",
    description:
      "Side-by-side comparison of Augusta Precious Metals, Goldco, Birch Gold, and Noble Gold — fees, minimums, ratings, and who each is best for.",
    url: "https://lode.rocks/gold-ira",
  },
};

// ── Structured data ────────────────────────────────────────────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://lode.rocks/gold-ira#page",
      "url": "https://lode.rocks/gold-ira",
      "name": "Best Gold IRA Companies 2026 — Reviewed & Compared",
      "description":
        "Side-by-side comparison of the top Gold IRA companies — fees, minimums, ratings, and who each is best for.",
      "isPartOf": { "@id": "https://lode.rocks/#site" },
      "dateModified": LAST_REVIEWED,
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home",     "item": "https://lode.rocks" },
        { "@type": "ListItem", "position": 2, "name": "Gold IRA", "item": "https://lode.rocks/gold-ira" },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is a Gold IRA?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A Gold IRA is a self-directed individual retirement account that holds physical precious metals — gold, silver, platinum, or palladium — instead of (or alongside) traditional paper assets. The IRS allows these accounts under IRC § 408(m), provided the metals meet minimum fineness requirements and are held by an approved custodian and depository.",
          },
        },
        {
          "@type": "Question",
          "name": "How much do I need to open a Gold IRA?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Minimums vary by company. Birch Gold Group accepts accounts from $10,000. Noble Gold starts at $20,000. Goldco starts at $25,000. Augusta Precious Metals requires $50,000 but waives first-year fees on accounts over that threshold. Most companies work best for rollovers of existing retirement accounts (401k, 403b, TSP, IRA) rather than new cash contributions.",
          },
        },
        {
          "@type": "Question",
          "name": "Is a Gold IRA better than buying physical gold?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "It depends on your goal. A Gold IRA gives you IRS-recognized tax advantages (pre-tax growth for Traditional, tax-free growth for Roth) and professional storage, but requires a custodian, has storage fees, and restricts access until retirement age. Physical gold outside an IRA gives you direct possession and no custodian fees, but no tax shelter. Investors with large retirement balances often use a Gold IRA for the tax-deferred portion and hold some physical gold separately.",
          },
        },
        {
          "@type": "Question",
          "name": "Can I roll over a 401k into a Gold IRA?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Most employer-sponsored plans (401k, 403b, 457, TSP) can be rolled over into a self-directed IRA at any time after you leave that employer, or from age 59½ while still employed. The rollover is tax-free if done correctly (direct rollover to custodian). You have 60 days to complete an indirect rollover before it becomes a taxable distribution.",
          },
        },
        {
          "@type": "Question",
          "name": "What happens when I request Augusta's free Gold IRA guide?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You receive Augusta's educational materials by email or mail — a written breakdown of how gold IRAs work, IRS eligibility rules, and fee structures. You'll then be offered a complimentary one-on-one web conference with an Augusta education director, a specialist who reviews your specific account type. Education directors are not commissioned salespeople and are paid regardless of whether you open an account. There is no obligation at any step.",
          },
        },
      ],
    },
  ],
};

// ── Company data ───────────────────────────────────────────────────────────
const COMPANIES = [
  {
    id:          "augusta",
    name:        "Augusta Precious Metals",
    tagline:     "Best overall — highest-rated, most transparent",
    verdict:     "The strongest all-round choice: top ratings on every platform, lifetime account support, and genuinely transparent pricing.",
    bestFor:     "Investors rolling over $50k+ who want hands-on education and a dedicated account team",
    bestForShort: "$50k+ rollover, hands-on support",
    founded:     2012,
    minimum:     "$50,000",
    setupFee:    "Waived first year",
    annualFees:  "$180–$200/yr",
    custodian:   "Equity Trust, Kingdom Trust",
    storage:     "Delaware Depository, Brinks",
    bbb:         "A+",
    google:      "4.9 / 5",
    trustpilot:  "4.9 / 5",
    moneyMag:    "Best Overall",
    affiliate:   true,
    pros: [
      "Education directors are paid to educate, not sell — no commissioned salespeople, ever",
      "Free one-on-one web conference with a Harvard-trained economic analyst before you commit",
      "Zero BBB complaints on record · A+ accredited · Fees disclosed in writing before you open",
      "Lifetime support — same dedicated account agent from opening through retirement",
    ],
    cons: [
      "$50,000 minimum — not suitable for smaller rollover accounts",
      "Focuses on premium coins over bullion bars, which carry higher per-ounce premiums",
    ],
  },
  {
    id:         "goldco",
    name:       "Goldco",
    tagline:    "Strong alternative — lower minimum, fast onboarding",
    verdict:    "A solid second choice with a lower minimum. Straightforward process with fewer pre-purchase educational materials, but strong ratings across the board.",
    bestFor:    "First-time IRA investors or smaller rollover accounts ($25k–$50k)",
    bestForShort: "$25k–$50k rollover, first-timers",
    founded:    2006,
    minimum:    "$25,000",
    setupFee:   "$50",
    annualFees: "$175–$225/yr",
    custodian:  "Equity Trust, STRATA Trust",
    storage:    "Delaware Depository, Brinks",
    bbb:        "A+",
    google:     "4.8 / 5",
    trustpilot: "4.8 / 5",
    moneyMag:   null,
    affiliate:  false,
    pros: [
      "Lower $25,000 minimum — accessible to more rollover accounts",
      "Strong BBB and Trustpilot ratings",
      "Straightforward, fast onboarding process",
    ],
    cons: [
      "Pre-purchase education is lighter — fewer structured materials before account opening",
      "Fewer custodian options than some peers",
    ],
  },
  {
    id:         "birch",
    name:       "Birch Gold Group",
    tagline:    "Lowest minimum — best for accounts under $50k",
    verdict:    "The most accessible entry point with a $10k minimum and the longest track record in the category. Strong choice if your rollover is under the $50k Augusta threshold.",
    bestFor:    "Investors starting with $10,000–$50,000 or rolling over a smaller retirement account",
    bestForShort: "$10k–$50k rollover, longest track record",
    founded:    2003,
    minimum:    "$10,000",
    setupFee:   "$50 + $30 wire transfer",
    annualFees: "$200/yr",
    custodian:  "Equity Trust (works with any custodian)",
    storage:    "Delaware Depository, Brinks, IDS (TX, LA, NYC)",
    bbb:        "A+",
    google:     "4.8 / 5",
    trustpilot: "4.7 / 5",
    moneyMag:   null,
    affiliate:  true,
    pros: [
      "Lowest minimum in the category — $10,000 for both IRAs and cash purchases",
      "Longest track record of any major Gold IRA company — operating since 2003",
      "Up to $10,000 in free precious metals on qualified purchases · Buyback guarantee at no charge",
      "Six US storage locations — Delaware, Brinks, and IDS facilities in TX, LA, NYC, and CA",
    ],
    cons: [
      "Less structured pre-purchase education than Augusta",
      "Customer service reviews more mixed at scale",
    ],
  },
  {
    id:         "noble",
    name:       "Noble Gold",
    tagline:    "Texas storage option — unique for US-based segregated storage",
    verdict:    "Worth considering if Texas-based storage matters to you. High ratings despite being newer — though less track record than Augusta or Birch.",
    bestFor:    "Investors who want Texas-based storage or a newer company with strong ratings",
    bestForShort: "Texas storage preference, $20k+",
    founded:    2017,
    minimum:    "$20,000",
    setupFee:   "$80",
    annualFees: "$150–$225/yr",
    custodian:  "Equity Trust",
    storage:    "International Depository Services (Texas), Delaware Depository",
    bbb:        "A+",
    google:     "4.9 / 5",
    trustpilot: "4.9 / 5",
    moneyMag:   null,
    affiliate:  false,
    pros: [
      "Only major IRA company with Texas-based storage option",
      "High customer ratings despite being newer",
      "Competitive fees",
    ],
    cons: [
      "Founded 2017 — shorter track record than peers",
      "Smaller selection of custodian partners",
    ],
  },
] as const;

// ── Comparison table rows — keep to the 5 metrics that matter most
//    at a glance. Custodian/storage details live in the deep-dive sections.
const TABLE_ROWS: { label: string; key: keyof typeof COMPANIES[0] }[] = [
  { label: "Minimum",     key: "minimum" },
  { label: "Annual fees", key: "annualFees" },
  { label: "BBB",         key: "bbb" },
  { label: "Google",      key: "google" },
  { label: "Trustpilot",  key: "trustpilot" },
  { label: "Founded",     key: "founded" },
];

// ── Page ───────────────────────────────────────────────────────────────────
export default function GoldIraPage() {
  const augusta = COMPANIES[0];

  return (
    <>
    <main className="min-h-screen" style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 pt-14 pb-6 sm:pt-20">
        <div className="mx-auto max-w-3xl space-y-4">
          <p className="label">Gold IRA comparison</p>
          <h1
            className="font-black tracking-tight text-white"
            style={{ fontSize: "clamp(2rem, 5vw, 3rem)", letterSpacing: "-0.04em", lineHeight: "1.05" }}
          >
            Best Gold IRA Companies<br />
            <span style={{ color: "var(--gold-bright)" }}>2026, ranked.</span>
          </h1>
          <p className="text-sm text-gray-400 max-w-xl leading-relaxed">
            A self-directed Gold IRA lets you hold physical gold and silver inside a tax-advantaged retirement account.
            We reviewed the four most-recommended companies — here&apos;s how they compare on fees, minimums, ratings, and what they&apos;re actually best for.
          </p>

          {/* Trust + disclosure strip */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-gray-500 pt-1">
            <span>Reviewed {fmtReviewed(LAST_REVIEWED)}</span>
            <span className="text-gray-700">·</span>
            <span>
              Some links on this page are affiliate links — Lode may earn a commission if you request a guide or open an account,
              at no extra cost to you. Rankings are not influenced by affiliate relationships.
            </span>
          </div>
        </div>
      </section>

      {/* ── Quick pick cards ─────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 py-6">
        <div className="mx-auto max-w-3xl">
          <p className="label mb-4">Our picks</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {COMPANIES.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl border p-5 space-y-3 transition-colors"
                style={{
                  borderColor: c.affiliate ? "rgba(212,175,55,0.25)" : "var(--border)",
                  background: c.affiliate ? "rgba(212,175,55,0.04)" : "rgba(0,0,0,0.3)",
                }}
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-bold text-white">{c.name}</p>
                  {c.moneyMag ? (
                    <span className="flex-shrink-0 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400 uppercase tracking-wider">
                      {c.moneyMag}
                    </span>
                  ) : null}
                </div>

                {/* Verdict — the one thing to read */}
                <p className="text-xs text-gray-300 leading-relaxed">{c.verdict}</p>

                {/* Key numbers */}
                <div className="flex flex-wrap gap-3 text-xs">
                  <span className="rounded-lg border border-white/5 bg-black/30 px-2.5 py-1">
                    <span className="text-gray-500">Min </span>
                    <span className="text-white font-semibold">{c.minimum}</span>
                  </span>
                  <span className="rounded-lg border border-white/5 bg-black/30 px-2.5 py-1">
                    <span className="text-gray-500">BBB </span>
                    <span className="text-white font-semibold">{c.bbb}</span>
                  </span>
                  <span className="rounded-lg border border-white/5 bg-black/30 px-2.5 py-1">
                    <span className="text-gray-500">⭐ </span>
                    <span className="text-white font-semibold">{c.google}</span>
                  </span>
                </div>

                {/* Best for pill */}
                <p className="text-[11px] text-gray-500">
                  <span className="text-gray-600 uppercase tracking-wider font-semibold">Best for </span>
                  {c.bestForShort}
                </p>

                {c.id === "birch" && promoActive && (
                  <div className="rounded-xl border border-amber-500/25 bg-amber-500/[0.07] px-3 py-2 space-y-0.5">
                    <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">🇺🇸 America 250 · Limited offer</p>
                    <p className="text-[11px] text-gray-300 leading-snug">{AMERICA_250_PROMO.body}</p>
                  </div>
                )}
                {c.affiliate && COMPANY_CTAS[c.id]?.card && (
                  <a
                    href={COMPANY_CTAS[c.id].card!}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="inline-flex items-center gap-1 text-xs font-semibold link-gold"
                  >
                    {c.id === "birch"
                      ? promoActive ? "Claim America 250 offer →" : "Get a free info kit →"
                      : "Get the free guide →"}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison table ─────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 py-8">
        <div className="mx-auto max-w-3xl">
          <p className="label mb-4">Side-by-side comparison</p>
          <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: "var(--border)" }}>
            <table className="w-full text-sm" style={{ background: "rgba(0,0,0,0.3)" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-36">
                    Company
                  </th>
                  {COMPANIES.map((c) => (
                    <th
                      key={c.id}
                      className="text-left px-4 py-3 text-xs font-bold"
                      style={{ color: "var(--text)" }}
                    >
                      <span>{c.name.split(" ").slice(0, 2).join(" ")}</span>
                      {c.affiliate && (
                        <span className="ml-2 inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider" style={{ background: "rgba(0,0,0,0.12)", color: "var(--text-muted)", border: "1px solid rgba(0,0,0,0.1)" }}>
                          partner
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TABLE_ROWS.map((row, i) => (
                  <tr
                    key={row.key}
                    style={{
                      borderBottom: i < TABLE_ROWS.length - 1 ? "1px solid var(--border)" : undefined,
                      background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                    }}
                  >
                    <td className="px-4 py-3 text-xs text-gray-400 font-medium">{row.label}</td>
                    {COMPANIES.map((c) => (
                      <td key={c.id} className="px-4 py-3 text-xs text-gray-200">
                        {String(c[row.key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-gray-600 mt-2">
            Fees shown are typical ranges for standard accounts. Contact each company for exact pricing. Last reviewed {fmtReviewed(LAST_REVIEWED)}.
          </p>
        </div>
      </section>

      {/* ── Augusta deep dive (affiliate) ────────────────────────────────── */}
      <section className="px-4 sm:px-6 py-8">
        <div className="mx-auto max-w-3xl space-y-6">
          <div>
            <p className="label mb-1">Our top pick</p>
            <h2 className="text-2xl font-black tracking-tight text-white">Augusta Precious Metals</h2>
            <p className="text-sm text-gray-500 mt-1">Best overall Gold IRA company — highest rated, most transparent</p>
          </div>

          <div className="rounded-2xl border p-6 space-y-5" style={{ borderColor: "rgba(212,175,55,0.2)", background: "rgba(212,175,55,0.03)" }}>
            {/* Rating badges */}
            <div className="flex flex-wrap gap-3">
              {[
                { label: "BBB",         value: "A+ Accredited" },
                { label: "Complaints",  value: "Zero on record" },
                { label: "Google",      value: "4.9 / 5" },
                { label: "Trustpilot",  value: "4.9 / 5" },
                { label: "Money Mag",   value: "Best Overall" },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl border border-white/5 bg-black/30 px-3 py-2 text-center min-w-[80px]">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</p>
                  <p className="text-xs font-bold text-white mt-0.5">{value}</p>
                </div>
              ))}
            </div>

            {/* How it works — the 4-step process */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">How it works</p>
              <div className="space-y-3">
                {[
                  {
                    step: "1",
                    title: "Request the free guide",
                    desc: "Receive Augusta's educational materials — no commitment, no sales call.",
                  },
                  {
                    step: "2",
                    title: "One-on-one web conference",
                    desc: "Augusta's Harvard-trained economic analyst walks you through IRS rules, eligible metals, and fee structure. Education directors are not commissioned salespeople.",
                  },
                  {
                    step: "3",
                    title: "Open your account",
                    desc: "Augusta handles custodian paperwork. Your account is held by Equity Trust, an IRS-approved custodian.",
                  },
                  {
                    step: "4",
                    title: "Fund via rollover",
                    desc: "Direct transfer from your 401k, 403b, or IRA. Typically completes in 5–10 business days, tax-free.",
                  },
                ].map(({ step, title, desc }) => (
                  <div key={step} className="flex gap-3">
                    <span
                      className="flex-shrink-0 text-[10px] font-bold flex items-center justify-center mt-0.5"
                      style={{
                        width: 20, height: 20, borderRadius: "50%",
                        background: "rgba(245,158,11,0.1)",
                        border: "1px solid rgba(245,158,11,0.2)",
                        color: "rgb(245,158,11)",
                      }}
                    >
                      {step}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-white">{title}</p>
                      <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Why we recommend */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Why we recommend Augusta</p>
              <ul className="space-y-2">
                {augusta.pros.map((pro) => (
                  <li key={pro} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-amber-500 mt-0.5 flex-shrink-0">✓</span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>

            {/* What to consider */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Worth knowing</p>
              <ul className="space-y-2">
                {augusta.cons.map((con) => (
                  <li key={con} className="flex items-start gap-2 text-sm text-gray-400">
                    <span className="text-gray-600 mt-0.5 flex-shrink-0">–</span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>

            {AUGUSTA_DEEPDIVE && (
              <div className="pt-1 space-y-2">
                <a
                  href={AUGUSTA_DEEPDIVE}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-5 py-2.5 text-sm font-semibold text-amber-400 hover:bg-amber-500/15 hover:text-amber-300 transition-all"
                >
                  Get Augusta&apos;s free Gold IRA guide →
                </a>
                <p className="text-[11px] text-gray-600">Augusta Precious Metals · Paid partner · No commitment required</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Birch Gold deep dive (affiliate) ────────────────────────────── */}
      {BIRCH_DEEPDIVE && (
        <section className="px-4 sm:px-6 py-8">
          <div className="mx-auto max-w-3xl space-y-6">
            <div>
              <p className="label mb-1">Best for smaller rollovers</p>
              <h2 className="text-2xl font-black tracking-tight text-white">Birch Gold Group</h2>
              <p className="text-sm text-gray-500 mt-1">Lowest minimum in the category — strong choice for accounts under $50k</p>
            </div>

            <div className="rounded-2xl border p-6 space-y-5" style={{ borderColor: "rgba(212,175,55,0.15)", background: "rgba(212,175,55,0.02)" }}>
              {/* Rating badges */}
              <div className="flex flex-wrap gap-3">
                {[
                  { label: "BBB",        value: "A+ Accredited" },
                  { label: "Founded",    value: "2003" },
                  { label: "Google",     value: "4.8 / 5" },
                  { label: "Trustpilot", value: "4.7 / 5" },
                  { label: "Minimum",    value: "$10,000" },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-xl border border-white/5 bg-black/30 px-3 py-2 text-center min-w-[80px]">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</p>
                    <p className="text-xs font-bold text-white mt-0.5">{value}</p>
                  </div>
                ))}
              </div>

              {/* Why Birch */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Why Birch Gold</p>
                <ul className="space-y-2">
                  {[
                    "Lowest minimum in the category — $10,000 for both IRAs and cash purchases",
                    "Longest track record of any major Gold IRA company — operating since 2003",
                    "Up to $10,000 in free precious metals on qualified purchases · Buyback guarantee at no charge",
                    "Six US storage locations — Delaware, Brinks, and IDS facilities in TX, LA, NYC, and CA",
                  ].map((pro) => (
                    <li key={pro} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-amber-500 mt-0.5 flex-shrink-0">✓</span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Worth knowing */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Worth knowing</p>
                <ul className="space-y-2">
                  {[
                    "Less structured pre-purchase education than Augusta — lighter materials before account opening",
                    "Customer service reviews more mixed at scale than Augusta",
                  ].map((con) => (
                    <li key={con} className="flex items-start gap-2 text-sm text-gray-400">
                      <span className="text-gray-600 mt-0.5 flex-shrink-0">–</span>
                      {con}
                    </li>
                  ))}
                </ul>
              </div>

              {promoActive && BIRCH_DEEPDIVE_PROMO && (
                <div className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.06] p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span aria-hidden="true" className="text-base">🇺🇸</span>
                    <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">{AMERICA_250_PROMO.headline}</p>
                    <span className="ml-auto text-[10px] font-mono text-amber-500/60">Jun 8 – Jul 10</span>
                  </div>
                  <p className="text-sm text-gray-200 leading-relaxed">
                    For a limited time, every customer referred through Lode receives a <strong className="text-white">free America 250 collectible silver round</strong> for every $10,000 purchased — gold IRA rollovers and physical purchases both qualify.
                  </p>
                  <p className="text-[11px] text-gray-500">Available while supplies last · No extra cost · Ends July 10, 2026</p>
                </div>
              )}

              <div className="pt-1 space-y-2">
                <a
                  href={promoActive && BIRCH_DEEPDIVE_PROMO ? BIRCH_DEEPDIVE_PROMO : BIRCH_DEEPDIVE!}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-5 py-2.5 text-sm font-semibold text-amber-400 hover:bg-amber-500/15 hover:text-amber-300 transition-all"
                >
                  {promoActive ? "Claim America 250 offer →" : "Get Birch Gold’s free info kit →"}
                </a>
                <p className="text-[11px] text-gray-600">Birch Gold Group · Paid partner · No commitment required</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Other companies ──────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 py-4">
        <div className="mx-auto max-w-3xl space-y-4">
          <p className="label mb-2">Also reviewed</p>
          {COMPANIES.slice(1).filter((c) => c.id !== "birch" || !BIRCH_DEEPDIVE).map((c) => (
            <div
              key={c.id}
              className="rounded-2xl border p-5 space-y-3"
              style={{ borderColor: "var(--border)", background: "rgba(0,0,0,0.3)" }}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-bold text-white">{c.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Est. {c.founded} · Min {c.minimum} · BBB {c.bbb} · ⭐ {c.google}</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{c.verdict}</p>
              <ul className="space-y-1.5 pt-1">
                {c.pros.slice(0, 3).map((p) => (
                  <li key={p} className="text-xs text-gray-500 flex gap-1.5">
                    <span className="text-gray-600 flex-shrink-0 mt-0.5">✓</span>{p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── Gold IRA vs Physical Gold ─────────────────────────────────────── */}
      <section className="px-4 sm:px-6 py-10 mt-4" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-3xl space-y-6">
          <div>
            <p className="label mb-1">Gold IRA vs physical gold</p>
            <h2 className="text-xl font-black tracking-tight text-white">Which is right for you?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title:  "Gold IRA",
                best:   "Best if you have retirement funds to protect",
                points: [
                  "Tax-deferred or tax-free growth (Traditional or Roth)",
                  "Held by IRS-approved custodian — no home storage",
                  "Rollover existing 401k, 403b, TSP, or IRA",
                  "Annual storage and custodian fees ($150–$300/yr)",
                  "Restricted access before age 59½ (penalties apply)",
                  "Min. account sizes apply ($10k–$50k depending on company)",
                ],
              },
              {
                title:  "Physical Gold",
                best:   "Best if you want direct possession outside retirement",
                points: [
                  "You hold it — no custodian, no counterparty",
                  "No annual fees (cost is storage/insurance if you choose)",
                  "Accessible at any time with no penalties",
                  "No tax shelter — gains taxed as collectibles (28% max rate)",
                  "No minimum — buy one coin at a time if you want",
                  "Compare dealer prices at lode.rocks/compare →",
                ],
              },
            ].map(({ title, best, points }) => (
              <div
                key={title}
                className="rounded-2xl border p-5 space-y-3"
                style={{ borderColor: "var(--border)", background: "rgba(0,0,0,0.3)" }}
              >
                <div>
                  <p className="text-sm font-bold text-white">{title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{best}</p>
                </div>
                <ul className="space-y-1.5">
                  {points.map((pt) => (
                    <li key={pt} className="text-xs text-gray-400 flex gap-2">
                      <span className="text-gray-600 flex-shrink-0 mt-0.5">·</span>
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">
            Many serious precious metals investors do both — hold physical gold and silver for direct access and
            sovereignty, and roll over a portion of retirement savings into a Gold IRA for the tax shelter.
            If you&apos;re tracking a physical stack on lode.rocks already, a Gold IRA is worth considering for the
            tax-deferred portion once your retirement balance exceeds $50,000.
          </p>
        </div>
      </section>

      {/* ── How to qualify section ────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 py-10" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-3xl space-y-6">
          <div>
            <p className="label mb-1">Eligibility</p>
            <h2 className="text-xl font-black tracking-tight text-white">Do you qualify for a Gold IRA rollover?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                check: "Retirement account",
                desc:  "You have a 401k, 403b, 457, TSP, or existing IRA you can roll over. Minimums start at $10,000.",
              },
              {
                check: "Left your employer",
                desc:  "You've left the employer whose plan you'd roll over — or you're 59½+ (in-service rollover).",
              },
              {
                check: "US person",
                desc:  "You're a US citizen or resident. Gold IRAs are only available to US taxpayers.",
              },
            ].map(({ check, desc }) => (
              <div
                key={check}
                className="rounded-2xl border p-4 space-y-2"
                style={{ borderColor: "var(--border)", background: "rgba(0,0,0,0.3)" }}
              >
                <p className="text-xs font-bold text-white">{check}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          {(AUGUSTA_ELIGIBILITY || BIRCH_ELIGIBILITY) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {AUGUSTA_ELIGIBILITY && (
                <div className="rounded-2xl border border-white/5 bg-gray-950 p-6 space-y-3">
                  <p className="label">Have $50k+ to roll over?</p>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Augusta offers a free, no-pressure web conference with a Gold IRA specialist to review your account type and walk you through the process.
                  </p>
                  <a
                    href={AUGUSTA_ELIGIBILITY}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="inline-flex items-center gap-1 text-sm font-semibold link-gold"
                  >
                    Request Augusta&apos;s free guide →
                  </a>
                  <p className="text-xs text-gray-600 mt-1">Augusta Precious Metals · Paid partner</p>
                </div>
              )}
              {BIRCH_ELIGIBILITY && (
                <div className="rounded-2xl border border-white/5 bg-gray-950 p-6 space-y-3">
                  <p className="label">Starting with $10k–$50k?</p>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Birch Gold has the lowest minimum in the category at $10,000 and the longest track record. Request a free info kit with no obligation.
                  </p>
                  <a
                    href={BIRCH_ELIGIBILITY}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="inline-flex items-center gap-1 text-sm font-semibold link-gold"
                  >
                    Get Birch Gold&apos;s free info kit →
                  </a>
                  <p className="text-xs text-gray-600 mt-1">Birch Gold Group · Paid partner</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 py-10" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-3xl space-y-6">
          <p className="label">Common questions</p>
          <div className="space-y-4 text-sm text-gray-400 leading-relaxed">
            {[
              {
                q: "What is a Gold IRA?",
                a: "A Gold IRA is a self-directed individual retirement account that holds physical precious metals — gold, silver, platinum, or palladium — instead of (or alongside) paper assets. The IRS allows these under IRC § 408(m), provided metals meet minimum fineness requirements and are held by an approved custodian and depository.",
              },
              {
                q: "How much do I need to open a Gold IRA?",
                a: "Minimums vary by company. Birch Gold accepts accounts from $10,000. Noble Gold starts at $20,000. Goldco starts at $25,000. Augusta requires $50,000 but waives first-year fees on accounts over that threshold. Most of the value comes from rolling over an existing retirement account (401k, 403b, TSP, IRA) rather than making new cash contributions, which are capped at IRS annual limits.",
              },
              {
                q: "Can I roll over a 401k into a Gold IRA?",
                a: "Yes — most employer-sponsored plans can be rolled over after you leave that employer, or from age 59½ while still employed. A direct rollover (custodian to custodian) is tax-free. An indirect rollover gives you 60 days to complete the transfer before it becomes a taxable distribution.",
              },
              {
                q: "Is a Gold IRA better than buying physical gold?",
                a: "It depends on your goal. A Gold IRA gives you tax-deferred or tax-free growth but requires a custodian, has annual fees, and restricts access until retirement. Physical gold gives you direct possession and no custodian fees but no tax shelter. Many investors do both — a Gold IRA for the tax-advantaged portion and physical holdings outside retirement.",
              },
              {
                q: "What metals can go in a Gold IRA?",
                a: "The IRS allows gold (≥99.5% pure), silver (≥99.9%), platinum (≥99.95%), and palladium (≥99.95%). Eligible coins include American Gold and Silver Eagles, Canadian Maple Leafs, and certain bars from approved refiners. Collectibles, numismatic coins, and jewelry are not allowed.",
              },
              {
                q: "How are Gold IRA storage fees charged?",
                a: "Most companies charge an annual storage fee of $100–$200, plus a custodian fee of $50–$100 per year. Some, like Augusta, waive the first year. Storage is either commingled (your metal pooled with others) or segregated (your specific bars and coins stored separately, typically slightly more expensive).",
              },
              {
                q: "What happens when I request Augusta's free Gold IRA guide?",
                a: "You receive Augusta's educational materials by email or mail — a written breakdown of how gold IRAs work, IRS eligibility rules, and fee structures. You'll then be offered a complimentary one-on-one web conference with an Augusta education director, a specialist who reviews your specific account type and situation. Education directors are not commissioned salespeople; they're paid regardless of whether you open an account. There's no obligation at any step.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="space-y-1" style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
                <p className="font-semibold text-white text-sm">{q}</p>
                <p className="text-sm text-gray-400 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cross-link to physical compare ───────────────────────────────── */}
      <section className="px-4 sm:px-6 py-8" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-white/5 bg-gray-950 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <p className="label">Also tracking physical gold?</p>
                <p className="text-sm text-gray-400">
                  Compare Silver Eagle, Gold Eagle, and Maple Leaf prices across APMEX, JM Bullion, SD Bullion,
                  and Money Metals — sorted by total cost at today&apos;s spot.
                </p>
              </div>
              <Link
                href="/compare"
                className="flex-shrink-0 inline-flex items-center gap-1 text-sm font-semibold link-gold"
              >
                Compare bullion prices →
              </Link>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600 pt-1 border-t" style={{ borderColor: "var(--border)" }}>
              <span className="pt-3">Live spot prices:</span>
              <Link href="/gold-price"      className="pt-3 hover:text-amber-400 transition-colors" style={{ color: "var(--gold-bright)" }}>Gold price today →</Link>
              <Link href="/silver-price"    className="pt-3 text-gray-400 hover:text-gray-200 transition-colors">Silver price today →</Link>
              <Link href="/platinum-price"  className="pt-3 text-gray-400 hover:text-gray-200 transition-colors">Platinum price →</Link>
              <Link href="/palladium-price" className="pt-3 text-gray-400 hover:text-gray-200 transition-colors">Palladium price →</Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
      </main>
  </>
  );
}
