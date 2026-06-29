import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Precious Metals Guides & Resources",
  description:
    "In-depth guides on buying, valuing, and understanding precious metals. Junk silver, coin melt values, gold IRAs, and more — written for stackers and investors.",
  alternates: {
    canonical: "https://lode.rocks/blog",
  },
  openGraph: {
    title: "Precious Metals Guides & Resources",
    description:
      "In-depth guides on buying, valuing, and understanding precious metals. Junk silver, coin melt values, gold IRAs, and more.",
    url: "https://lode.rocks/blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Precious Metals Guides & Resources",
    description:
      "In-depth guides on buying, valuing, and understanding precious metals. Junk silver, coin melt values, gold IRAs, and more.",
  },
};

const blogJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home",              "item": "https://lode.rocks" },
        { "@type": "ListItem", "position": 2, "name": "Guides & Articles", "item": "https://lode.rocks/blog" },
      ],
    },
    {
      "@type": "CollectionPage",
      "@id": "https://lode.rocks/blog#page",
      "url": "https://lode.rocks/blog",
      "name": "Precious Metals Guides & Resources",
      "description": "In-depth guides on buying, valuing, and understanding precious metals — junk silver, coin melt values, gold IRAs, and more.",
      "isPartOf": { "@id": "https://lode.rocks/#site" },
      "hasPart": [
        {
          "@type": "Article",
          "@id": "https://lode.rocks/blog/junk-silver-guide#article",
          "headline": "The Complete Guide to Buying Junk Silver Coins (2026)",
          "url": "https://lode.rocks/blog/junk-silver-guide",
          "datePublished": "2026-05-01",
          "dateModified": "2026-05-20",
          "author": { "@type": "Organization", "name": "Lode", "url": "https://lode.rocks" },
          "image": {
            "@type": "ImageObject",
            "url": "https://lode.rocks/blog/junk-silver-guide/opengraph-image",
            "width": 1200,
            "height": 630,
          },
        },
        {
          "@type": "Article",
          "@id": "https://lode.rocks/blog/coin-melt-value-guide#article",
          "headline": "Coin Melt Value: What Your Gold & Silver Coins Are Really Worth (2026)",
          "url": "https://lode.rocks/blog/coin-melt-value-guide",
          "datePublished": "2026-06-29",
          "dateModified": "2026-06-29",
          "author": { "@type": "Organization", "name": "Lode", "url": "https://lode.rocks" },
          "image": {
            "@type": "ImageObject",
            "url": "https://lode.rocks/blog/coin-melt-value-guide/opengraph-image",
            "width": 1200,
            "height": 630,
          },
        },
      ],
    },
  ],
};

const articles = [
  {
    slug: "coin-melt-value-guide",
    title: "Coin Melt Value: What Your Gold & Silver Coins Are Really Worth (2026)",
    description:
      "Exact metal content for Gold Eagles, Silver Eagles, Krugerrands, Maples, Morgan Dollars, and more — plus how melt value differs from market price.",
    date: "June 2026",
    readTime: "11 min read",
    tags: ["Gold", "Silver", "Reference guide"],
  },
  {
    slug: "junk-silver-guide",
    title: "The Complete Guide to Buying Junk Silver Coins (2026)",
    description:
      "Everything you need to know about junk silver: what it is, which coins qualify, how to calculate melt value, where to buy it, and what premiums to expect.",
    date: "May 2026",
    readTime: "15 min read",
    tags: ["Silver", "Coins", "Beginner guide"],
  },
];

export default function BlogIndexPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <main
        className="overflow-x-hidden min-h-screen"
        style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
      >
        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="px-4 sm:px-6 pt-14 pb-10 sm:pt-20 sm:pb-12">
          <div className="mx-auto max-w-2xl space-y-3">
            <p className="label">Resources</p>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tighter leading-none">
              Guides &amp; Articles
            </h1>
            <p className="text-sm text-gray-500 pt-1">
              In-depth references for precious metals investors and stackers.
            </p>
          </div>
        </section>

        {/* ── Article list ─────────────────────────────────────────── */}
        <section className="px-4 sm:px-6 pb-16">
          <div className="mx-auto max-w-2xl space-y-4">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="block border p-6 transition-colors hover:border-gray-600 group"
                style={{ borderColor: "var(--border)", background: "rgba(0,0,0,0.15)" }}
              >
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="text-base font-black tracking-tight text-white leading-snug mb-2 group-hover:[color:var(--gold)] transition-colors">
                  {article.title}
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                  {article.description}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-700">
                  <span>{article.date}</span>
                  <span>·</span>
                  <span>{article.readTime}</span>
                  <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--gold)" }}>
                    Read →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Related tools ────────────────────────────────────────── */}
        <section className="border-t px-4 sm:px-6 py-12" style={{ borderColor: "var(--border)" }}>
          <div className="mx-auto max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-5">
              Related tools
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { href: "/junk-silver-calculator", label: "Junk Silver Calculator" },
                { href: "/coin-melt-calculator",   label: "Coin Melt Calculator" },
                { href: "/silver-price",            label: "Silver Price Today" },
                { href: "/compare",                 label: "Compare Dealers" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-xl border px-4 py-3 text-xs font-medium text-gray-400 hover:text-gray-200 hover:border-gray-600 transition-colors text-center"
                  style={{ borderColor: "var(--border)" }}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <SiteFooter />
      </main>
    </>
  );
}
