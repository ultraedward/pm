import { SiteFooter } from "@/components/SiteFooter";

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
};

const LAST_UPDATED = "April 11, 2026";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-surface px-6 py-24 text-white">
      <div className="mx-auto max-w-2xl space-y-12">

        <div>
          <p className="label mb-2">Legal</p>
          <h1 className="text-4xl font-black tracking-tight">Privacy Policy</h1>
          <p className="mt-3 text-sm text-gray-500">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="space-y-8 text-sm text-gray-400 leading-relaxed">

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">1. Information We Collect</h2>
            <p>When you sign in with Google, we receive your name and email address from Google OAuth. We store this information to identify your account and send you price alert notifications.</p>
            <p>Portfolio holdings you enter without signing in are stored only in your browser (localStorage) and never transmitted to our servers. If you create an account, your holdings are stored in our database solely to enable cross-device access — we have no other use for them. Price alert targets are stored in our database regardless of account status, only to trigger the notifications you configure.</p>
            <p>We use Stripe for payment processing. We do not store your credit card information — Stripe handles all payment data under their own privacy policy.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">2. How We Use Your Information</h2>
            <p>Your email address is used to send price alert notifications you have explicitly configured, and for transactional emails related to your subscription (receipts, cancellations).</p>
            <p>We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">3. Data Storage</h2>
            <p>Your data is stored in a PostgreSQL database hosted on Neon. All connections are encrypted in transit. We retain your data for as long as your account is active. You may request deletion at any time by contacting us.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">4. Third-Party Services</h2>
            <p>We use the following third-party services to operate the platform: Google OAuth for authentication, Stripe for billing, Neon for database hosting, Vercel for application hosting, and metals.dev (with Yahoo Finance as a fallback) for spot price data. Each service operates under its own privacy policy. None of these services receive your email or account information for the purpose of fetching prices — price requests are anonymous and contain no user data.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">5. Cookies</h2>
            <p>We use a single session cookie set by NextAuth to keep you signed in. We do not use tracking cookies or advertising cookies.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">6. Your Rights</h2>
            <p>You may request access to, correction of, or deletion of your personal data at any time. To do so, email us and we will respond within 30 days.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">7. Contact</h2>
            <p>Questions about this policy can be directed to <a href="mailto:hello@lode.rocks" className="text-amber-500 hover:text-amber-400 transition-colors">hello@lode.rocks</a>.</p>
          </section>

        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
