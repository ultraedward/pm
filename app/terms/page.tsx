import { SiteFooter } from "@/components/SiteFooter";

export const metadata = {
  title: "Terms of Service",
  description:
    "Lode's terms of service — the rules governing use of our precious metals price tracker, portfolio tools, price alerts, and all other features.",
  alternates: {
    canonical: "https://lode.rocks/terms",
  },
  openGraph: {
    title: "Terms of Service | Lode",
    description:
      "The terms governing your use of Lode's precious metals price tracker, portfolio tools, and price alerts.",
    url: "https://lode.rocks/terms",
  },
};

const LAST_UPDATED = "March 12, 2026";

export default function TermsPage() {
  return (
    <main className="px-6 py-24" style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
      <div className="mx-auto max-w-2xl space-y-12">

        <div>
          <p className="label mb-2">Legal</p>
          <h1 className="text-4xl font-black tracking-tight">Terms of Service</h1>
          <p className="mt-3 text-sm text-gray-500">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="space-y-8 text-sm text-gray-400 leading-relaxed">

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">1. Acceptance of Terms</h2>
            <p>By accessing or using Lode ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">2. Description of Service</h2>
            <p>Lode provides live spot price tracking, price alerts, and portfolio tracking for gold, silver, platinum, and palladium. Spot prices are sourced from third-party data providers and are provided for informational purposes only. See the <a href="/methodology" className="text-amber-500 hover:text-amber-400 transition-colors">Methodology</a> page for data sources and refresh cadence.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">3. Not Financial Advice</h2>
            <p>Nothing on this platform constitutes financial, investment, or trading advice. Spot prices may be delayed or inaccurate. You are solely responsible for any investment decisions you make. Always consult a qualified financial advisor before making investment decisions.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">4. Accounts</h2>
            <p>You must sign in with a valid Google account to use the Service. You are responsible for maintaining the security of your account. You may not use the Service for any illegal or unauthorized purpose.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">5. Free Service</h2>
            <p>Lode is provided free of charge. All features — including unlimited price alerts, portfolio tracking, calculators, and the weekly digest — are available to all registered users at no cost.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">6. Availability</h2>
            <p>We strive for high availability but do not guarantee uninterrupted service. Price alerts depend on periodic data ingestion and may not fire instantly. We are not liable for missed alerts or delayed notifications.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">7. Termination</h2>
            <p>We reserve the right to suspend or terminate any account that violates these terms. You may delete your account at any time by contacting us.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">8. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, the Service is provided "as is" without warranty of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the Service.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">9. Contact</h2>
            <p>Questions about these terms can be directed to <a href="mailto:hello@lode.rocks" className="text-amber-500 hover:text-amber-400 transition-colors">hello@lode.rocks</a>.</p>
          </section>

        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
