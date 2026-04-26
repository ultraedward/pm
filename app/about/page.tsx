import { SiteFooter } from "@/components/SiteFooter";

export const metadata = {
  title: "About Lode — Independent Precious Metals Price Tracker",
  description:
    "Lode is an independent precious metals price tracker — live spot prices, a coin melt calculator, a portfolio tracker, and email price alerts. Built for people who hold physical metal.",
  alternates: {
    canonical: "https://lode.rocks/about",
  },
  openGraph: {
    title: "About Lode — Independent Precious Metals Price Tracker",
    description:
      "An independent precious metals price tracker built for people who hold physical metal. No dealer affiliation, no ads.",
    url: "https://lode.rocks/about",
  },
};

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home",  "item": "https://lode.rocks" },
    { "@type": "ListItem", "position": 2, "name": "About", "item": "https://lode.rocks/about" },
  ],
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-surface px-6 py-24 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <div className="mx-auto max-w-2xl space-y-12">

        <div>
          <p className="label mb-2">About</p>
          <h1 className="text-4xl font-black tracking-tight">About Lode</h1>
          <p className="mt-3 text-sm text-gray-500">
            An independent precious metals price tracker, built for people who actually hold physical metal.
          </p>
        </div>

        {/* At-a-glance — the things a skeptical visitor needs to see first */}
        <section
          className="rounded-2xl border p-6 space-y-3 text-sm"
          style={{ borderColor: "var(--border)" }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-600">At a glance</p>
          <ul className="space-y-2 text-gray-300">
            <li><span className="text-white font-semibold">What it is:</span> live spot prices for gold, silver, platinum, palladium — plus a coin melt calculator, gram converter, portfolio tracker, and email price alerts.</li>
            <li><span className="text-white font-semibold">What it isn&rsquo;t:</span> a dealer, a broker, an exchange, or financial advice. We don&rsquo;t hold anything for you.</li>
            <li><span className="text-white font-semibold">How we fund it:</span> affiliate commissions on dealer clicks from the <a href="/compare" className="text-amber-500 hover:text-amber-400 transition-colors">compare</a> page. No ads, no data sales. Rankings sort by price, not by who pays us.</li>
            <li><span className="text-white font-semibold">How to verify it:</span> cross-check any spot price against Kitco or a broker terminal — numbers should match within pennies. See <a href="/methodology" className="text-amber-500 hover:text-amber-400 transition-colors">methodology</a>.</li>
          </ul>
        </section>

        <div className="space-y-8 text-sm text-gray-400 leading-relaxed">

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">What Lode does</h2>
            <p>
              Lode tracks live spot prices for gold, silver, platinum, and palladium. It lets you calculate coin melt values, convert between troy ounces and grams, track a physical-metal portfolio at current spot, and get an email when a price target you set is crossed.
            </p>
            <p>
              It&rsquo;s built as a small, focused tool for the person holding the metal — not the person selling it to you.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">What Lode is not</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Not a dealer, broker, or exchange. We hold no metal on your behalf.</li>
              <li>Not owned by a dealer, and not marketing copy dressed up as a tool.</li>
              <li>Not financial, investment, or tax advice. Everything here is informational.</li>
              <li>Not a data broker. The only data we collect is documented in the <a href="/privacy" className="text-amber-500 hover:text-amber-400 transition-colors">Privacy Policy</a>.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">How we make money</h2>
            <p>
              When you click a dealer link on the <a href="/compare" className="text-amber-500 hover:text-amber-400 transition-colors">compare</a> page and end up buying, Lode may earn an affiliate commission at no cost to you. That&rsquo;s disclosed on the page itself (the FTC requires it) and it&rsquo;s currently our only revenue stream — no ads, no tracking cookies sold to third parties, no data-broker relationships.
            </p>
            <p>
              <span className="text-white font-semibold">Commissions do not affect rankings.</span> The compare page sorts by estimated total cost — live spot × coin weight + a hand-maintained dealer premium. A cheaper dealer that pays us nothing still ranks ahead of a more expensive dealer that pays us.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">Who runs it</h2>
            <p>
              Lode is independently operated and self-funded. No investors, no advertisers. The operator is staying anonymous for now — we&rsquo;d rather be judged on the product than on a resume. Every part of the tool that matters (data sources, calculations, what we collect, how long we keep it) is documented publicly on this site so you can evaluate it directly rather than taking anyone&rsquo;s word for it.
            </p>
            <p>
              Questions, bug reports, or press:{" "}
              <a
                href="mailto:hello@lode.rocks"
                className="text-amber-500 hover:text-amber-400 transition-colors"
              >
                hello@lode.rocks
              </a>
              . A human reads every message.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">Dig deeper</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><a href="/methodology" className="text-amber-500 hover:text-amber-400 transition-colors">Methodology</a> — where prices come from and how calculations work.</li>
              <li><a href="/faq" className="text-amber-500 hover:text-amber-400 transition-colors">FAQ</a> — is this legit, who runs it, how alerts work, what happens to your data.</li>
              <li><a href="/privacy" className="text-amber-500 hover:text-amber-400 transition-colors">Privacy</a> — what we collect and what we don&rsquo;t.</li>
            </ul>
          </section>

        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
