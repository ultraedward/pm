import { SiteFooter } from "@/components/SiteFooter";

export const metadata = {
  title: "About — Lode",
  description:
    "Lode is an independent precious metals price tracker. Learn what we do, what we don't do, and how we operate — built for people who actually hold physical metal.",
  alternates: {
    canonical: "https://lode.rocks/about",
  },
  openGraph: {
    title: "About | Lode",
    description:
      "An independent precious metals price tracker. Built for people who hold physical metal.",
    url: "https://lode.rocks/about",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-surface px-6 py-24 text-white">
      <div className="mx-auto max-w-2xl space-y-12">

        <div>
          <p className="label mb-2">About</p>
          <h1 className="text-4xl font-black tracking-tight">About Lode</h1>
          <p className="mt-3 text-sm text-gray-500">
            An independent precious metals price tracker, built for people who actually hold physical metal.
          </p>
        </div>

        <div className="space-y-8 text-sm text-gray-400 leading-relaxed">

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">What Lode is</h2>
            <p>
              Lode tracks live spot prices for gold, silver, platinum, and palladium. It lets you calculate coin melt values, convert between troy ounces and grams, track a physical-metal portfolio, and get notified when prices cross a threshold you set.
            </p>
            <p>
              It&rsquo;s built as a small, focused tool — not a broker, not an exchange, not a news aggregator. If you&rsquo;re stacking, tracking a collection, or just want to see what your holdings are worth today, Lode is meant for you.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">What Lode is not</h2>
            <p>
              We want to be clear about a few things, because the precious-metals space has a lot of noise:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Lode does not buy, sell, or broker physical metal. We hold nothing on your behalf.</li>
              <li>Lode is not a dealer, not affiliated with any dealer, and receives no referral fees from dealers.</li>
              <li>Lode does not provide financial, investment, or tax advice. Prices and calculations are informational.</li>
              <li>Lode does not take custody of your funds, your identity documents, or your metal. The only data we collect is what&rsquo;s documented in our <a href="/privacy" className="text-amber-500 hover:text-amber-400 transition-colors">Privacy Policy</a>.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">Why we built it</h2>
            <p>
              Existing precious-metals trackers tended to fall into two camps: bloated portals stuffed with ads and dealer affiliate links, or thin price widgets with no way to track your own holdings or set a useful alert. We wanted something in between — fast, clean, and focused on the person holding the metal, not the person selling it to you.
            </p>
            <p>
              Lode is independently operated and self-funded. We have no investors, no advertisers, no dealer partnerships. That&rsquo;s a deliberate choice so the incentives stay aligned with the people using the tool.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">How we operate</h2>
            <p>
              Lode is a small independent project. For details on where our price data comes from, how calculations are done, and how often data refreshes, see the{" "}
              <a href="/methodology" className="text-amber-500 hover:text-amber-400 transition-colors">
                Methodology
              </a>{" "}
              page.
            </p>
            <p>
              Common questions about whether the tool is legit, how it compares to alternatives, and what happens to your data are answered on the{" "}
              <a href="/faq" className="text-amber-500 hover:text-amber-400 transition-colors">
                FAQ
              </a>{" "}
              page.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">Contact</h2>
            <p>
              Questions, feedback, bug reports, or press inquiries:{" "}
              <a
                href="mailto:hello@lode.rocks"
                className="text-amber-500 hover:text-amber-400 transition-colors"
              >
                hello@lode.rocks
              </a>
              . A human reads every message.
            </p>
          </section>

        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
