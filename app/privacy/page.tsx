import { SiteFooter } from "@/components/SiteFooter";
import { PRICE_SOURCES } from "@/lib/priceSourceInfo";

export const metadata = {
  title: "Privacy Policy",
  description:
    "Lode's privacy policy — how we collect, use, and protect your data when you use our precious metals price tracker, portfolio tools, and price alerts.",
  alternates: {
    canonical: "https://lode.rocks/privacy",
  },
  openGraph: {
    title: "Privacy Policy | Lode",
    description:
      "How Lode collects, uses, and protects your data when you use our precious metals tracker and price alerts.",
    url: "https://lode.rocks/privacy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Lode",
    description:
      "How Lode collects, uses, and protects your data when you use our precious metals tracker and price alerts.",
  },
};

const LAST_UPDATED = "April 20, 2026";

export default function PrivacyPage() {
  return (
    <>
    <main className="px-6 pt-12 sm:pt-24" style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
      <div className="mx-auto max-w-2xl space-y-12 pb-20 sm:pb-28">

        <div>
          <p className="label mb-2">Legal</p>
          <h1 className="text-4xl font-black tracking-tight">Privacy Policy</h1>
          <p className="mt-3 text-sm text-gray-500">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>

          <section className="space-y-3">
            <h2 className="text-base font-bold" style={{ color: "var(--text)" }}>1. Information We Collect</h2>
            <p>When you sign in with Google, we receive your name and email address from Google OAuth. We store this information to identify your account and send you price alert notifications.</p>
            <p>Portfolio holdings you enter without signing in are stored only in your browser (localStorage) and never transmitted to our servers. If you create an account, your holdings are stored in our database solely to enable cross-device access — we have no other use for them. Price alert targets are stored in your account, only to trigger the notifications you configure.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold" style={{ color: "var(--text)" }}>2. How We Use Your Information</h2>
            <p>Your email address is used to send price alert notifications you have explicitly configured, and to deliver the weekly digest if you have subscribed to it.</p>
            <p>We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold" style={{ color: "var(--text)" }}>3. Data Storage</h2>
            <p>Your data is stored in a PostgreSQL database hosted on Neon, encrypted in transit. We retain it for as long as your account is active. When you delete your account, your data is removed within 30 days.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold" style={{ color: "var(--text)" }}>4. Third-Party Services</h2>
            <p>We use the following third-party services to operate the platform: Google OAuth (authentication), Resend (transactional email), Neon (database hosting), Vercel (application hosting), and Cloudflare Workers (price data proxy). Each operates under its own privacy policy. Price requests are anonymous — your email or account information is never sent to price data providers.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold" style={{ color: "var(--text)" }}>5. Affiliate Links and Tracking</h2>
            <p>The dealer comparison page on lode.rocks contains affiliate links. When you click a dealer link, one of our affiliate networks may set a cookie in your browser to record the referral and attribute any resulting purchase to us. This allows us to earn a commission at no additional cost to you. Rankings and prices on the compare page are not affected by affiliate relationships — we sort strictly by estimated total cost.</p>
            <p>We currently use two affiliate networks depending on the dealer:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li><strong className="text-gray-300">Awin Ltd</strong> — used for SD Bullion, JM Bullion, and Money Metals. Awin's privacy policy and opt-out are available at <a href="https://www.awin.com/gb/privacy" target="_blank" rel="noopener noreferrer" className="link-gold">awin.com/gb/privacy</a>.</li>
              <li><strong className="text-gray-300">FlexOffers.com, LLC</strong> — used for APMEX. FlexOffers' privacy policy is available at <a href="https://www.flexoffers.com/privacy-policy/" target="_blank" rel="noopener noreferrer" className="link-gold">flexoffers.com/privacy-policy</a>.</li>
            </ul>
            <p>Each network's own privacy policy governs how they collect and process data from their tracking cookies.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold" style={{ color: "var(--text)" }}>6. Cookies</h2>
            <p>We use a single session cookie set by NextAuth to keep you signed in. Beyond that, we do not set advertising or analytics tracking cookies ourselves. If you click an affiliate dealer link, Awin or FlexOffers may set a third-party tracking cookie as described in section 5 above.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold" style={{ color: "var(--text)" }}>7. Your Rights</h2>
            <p>You may request access to, correction of, or deletion of your personal data at any time. To do so, email us and we will respond within 30 days.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold" style={{ color: "var(--text)" }}>8. Contact</h2>
            <p>Questions about this policy can be directed to <a href="mailto:hello@lode.rocks" className="link-gold">hello@lode.rocks</a>.</p>
          </section>

        </div>
      </div>
      <SiteFooter />
      </main>
  </>
  );
}
