import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";

// Affiliate URL — kept server-side only. All three Augusta placements read
// from this env var so enabling/disabling is a single Vercel toggle.
const AUGUSTA_URL = process.env.AFFILIATE_AUGUSTA_URL ?? null;

// ── Last reviewed date ─────────────────────────────────────────────────────
const LAST_REVIEWED = "2026-05-08";

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
            "text": "Minimums vary by company. Augusta Precious Metals and Goldco both require $50,000. Birch Gold Group accepts accounts from $10,000. Most companies work best for rollovers of existing retirement accounts (401k, 403b, TSP, IRA) rather than new cash contributions.",
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
      "Education directors are not commissioned salespeople — paid to educate, not to close",
      "One-on-one web conference with Augusta's Harvard-trained economic analyst — no sales pressure",
      "Zero BBB complaints on record — A+ accredited, in business since 2012",
      "Pricing disclosed in writing before you open an account — no surprise fees",
      "Lifetime customer support — same dedicated agent for the life of your account",
    ],
    cons: [
      "Higher minimum ($50,000) — not suitable for smaller rollover accounts",
      "Focus is on premium coins over bullion bars",
    ],
  },
  {
    id:         "goldco",
    name:       "Goldco",
    tagline:    "Strong alternative — lower minimum, fast onboarding",
    verdict:    "A solid second choice with a lower minimum. Less educational depth than Augusta, but strong ratings and a straightforward process.",
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
    tagline:    "Lowest minimum — good for smaller accounts",
    verdict:    "The most accessible entry point with a $10k minimum. Longest track record in the category, though pricing transparency lags the top two.",
    bestFor:    "Investors starting with $10,000–$25,000 or adding to an existing IRA",
    bestForShort: "$10k+ accounts, longer time horizons",
    founded:    2003,
    minimum:    "$10,000",
    setupFee:   "Varies",
    annualFees: "$100–$200/yr",
    custodian:  "Equity Trust, GoldStar Trust",
    storage:    "Delaware Depository, Brinks",
    bbb:        "A+",
    google:     "4.8 / 5",
    trustpilot: "4.7 / 5",
    moneyMag:   null,
    affiliate:  false,
    pros: [
      "Lowest minimum in the category at $10,000",
      "Longest track record — operating since 2003",
      "Wide selection of IRS-approved metals",
    ],
    cons: [
      "Pricing not published online — requires a direct quote for exact fees",
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

                {c.affiliate && AUGUSTA_URL && (
                  <a
                    href={AUGUSTA_URL}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-amber-500 hover:text-amber-400 transition-colors"
                  >
                    Get the free guide →
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
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-36">
                    Company
                  </th>
                  {COMPANIES.map((c) => (
                    <th
                      key={c.id}
                      className="text-left px-4 py-3 text-xs font-bold"
                      style={{ color: c.affiliate ? "var(--gold-bright)" : "white" }}
                    >
                      {c.name.split(" ").slice(0, 2).join(" ")}
                      {c.affiliate && <span className="ml-1 text-gray-600 font-normal text-[10px]">★ partner</span>}
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
                    <td className="px-4 py-3 text-xs text-gray-500 font-medium">{row.label}</td>
                    {COMPANIES.map((c) => (
                      <td key={c.id} className="px-4 py-3 text-xs text-gray-300">
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

            {/* Who it's best for */}
            <div className="rounded-xl border border-white/5 bg-black/20 p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Best for</p>
              <p className="text-sm text-gray-300">{augusta.bestFor}</p>
            </div>

            {AUGUSTA_URL && (
              <div className="pt-1 space-y-2">
                <a
                  href={AUGUSTA_URL}
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

      {/* ── Other companies ──────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 py-4">
        <div className="mx-auto max-w-3xl space-y-4">
          <p className="label mb-2">Also reviewed</p>
          {COMPANIES.slice(1).map((c) => (
            <div
              key={c.id}
              className="rounded-2xl border p-5 space-y-3"
              style={{ borderColor: "var(--border)", background: "rgba(0,0,0,0.3)" }}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-bold text-white">{c.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Est. {c.founded} · Min {c.minimum}</p>
                </div>
                <div className="flex gap-2 text-[10px] text-gray-500">
                  <span>BBB {c.bbb}</span>
                  <span>⭐ {c.google}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{c.bestFor}</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">Strengths</p>
                  <ul className="space-y-1">
                    {c.pros.map((p) => (
                      <li key={p} className="text-xs text-gray-400 flex gap-1.5">
                        <span className="text-gray-600 flex-shrink-0">+</span>{p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">Consider</p>
                  <ul className="space-y-1">
                    {c.cons.map((con) => (
                      <li key={con} className="text-xs text-gray-400 flex gap-1.5">
                        <span className="text-gray-600 flex-shrink-0">–</span>{con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
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
                  "Compare dealer prices at lode.rocks/compare",
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
                desc:  "You have a 401k, 403b, 457, TSP, or existing IRA with at least $50,000.",
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
          {AUGUSTA_URL && (
            <div className="rounded-2xl border border-white/5 bg-gray-950 p-6 space-y-3">
              <p className="label">Not sure if you qualify?</p>
              <p className="text-sm text-gray-400 leading-relaxed">
                Augusta offers a free, no-pressure web conference with a gold IRA specialist who can review your specific
                account type and walk you through the rollover process. There&apos;s no obligation to open an account.
              </p>
              <a
                href={AUGUSTA_URL}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="inline-flex items-center gap-1 text-sm font-semibold text-amber-500 hover:text-amber-400 transition-colors"
              >
                Request the free guide →
              </a>
              <p className="text-xs text-gray-600 mt-1">Augusta Precious Metals · Paid partner</p>
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
                a: "Minimums vary: Augusta and Goldco both start at $50,000. Birch Gold accepts from $10,000. Noble Gold starts at $20,000. Most of the value comes from rolling over an existing retirement account (401k, 403b, TSP, IRA) rather than making new cash contributions, which are capped at IRS annual limits.",
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
          <div className="rounded-2xl border border-white/5 bg-gray-950 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <p className="label">Also tracking physical gold?</p>
              <p className="text-sm text-gray-400">
                Compare Silver Eagle, Gold Eagle, and Maple Leaf prices across APMEX, JM Bullion, SD Bullion,
                and Money Metals — sorted by total cost at today&apos;s spot.
              </p>
            </div>
            <Link
              href="/compare"
              className="flex-shrink-0 inline-flex items-center gap-1 text-sm font-semibold text-amber-500 hover:text-amber-400 transition-colors"
            >
              Compare bullion prices →
            </Link>
          </div>
        </div>
      </section>

      </main>
    <SiteFooter />
  </>
  );
}
