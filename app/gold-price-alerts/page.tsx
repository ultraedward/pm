import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Gold Price Alerts — Get Notified When Gold Hits Your Target",
  description:
    "Set custom gold price alerts and get email notifications the moment spot price hits your target. Also covers silver, platinum, and palladium. No app required — works in any inbox.",
  keywords: [
    "gold price alert",
    "gold price notification",
    "gold spot price alert",
    "silver price alert",
    "precious metals price alert",
    "gold price email alert",
    "gold price tracker alert",
    "set gold price alert",
    "gold price target notification",
  ],
  alternates: {
    canonical: "https://lode.rocks/gold-price-alerts",
  },
  openGraph: {
    title: "Gold Price Alerts — Get Notified When Gold Hits Your Target",
    description:
      "Set custom price targets for gold, silver, platinum, or palladium and receive email alerts the moment spot price crosses your threshold.",
    url: "https://lode.rocks/gold-price-alerts",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://lode.rocks/gold-price-alerts#app",
      "name": "Gold & Silver Price Alerts — Lode",
      "url": "https://lode.rocks/gold-price-alerts",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "description":
        "Set custom price targets for gold, silver, platinum, and palladium. Receive email alerts the moment spot price hits your threshold.",
      "featureList": [
        "Gold spot price alerts",
        "Silver price alerts",
        "Platinum and palladium alerts",
        "Email delivery — no app required",
        "Above and below threshold triggers",
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do gold price alerts work on Lode?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You set a target price — for example, 'alert me when gold drops below $2,800 per troy oz.' Lode checks spot prices every 15 minutes. The moment gold crosses your threshold, you receive an email notification. No app download required.",
          },
        },
        {
          "@type": "Question",
          "name": "Can I get silver price alerts too?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Lode supports price alerts for gold (XAU), silver (XAG), platinum (XPT), and palladium (XPD). You can set multiple alerts across any combination of metals.",
          },
        },
        {
          "@type": "Question",
          "name": "How often are spot prices checked for alerts?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Lode checks spot prices every 15 minutes. When a price crosses your target threshold, the alert email is sent within the next check cycle — typically within 15 minutes of the price move.",
          },
        },
        {
          "@type": "Question",
          "name": "Do I need to install an app to get gold price alerts?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No app needed. Lode sends alerts to your email inbox. Create a free account, set your target price, and the notification arrives in your email the moment spot price triggers your threshold.",
          },
        },
      ],
    },
  ],
};

const FEATURES = [
  {
    icon: "🔔",
    title: "Above or below — your choice",
    body: "Alert when gold breaks above a resistance level or falls below a buy-the-dip target. Both directions supported.",
  },
  {
    icon: "📬",
    title: "Email delivery, no app needed",
    body: "Alerts land in your inbox. No push notification permissions, no app download, no browser tabs to keep open.",
  },
  {
    icon: "⏱️",
    title: "Checked every 15 minutes",
    body: "Spot prices are pulled from live market feeds and checked every 15 minutes — so you hear about moves within the hour.",
  },
  {
    icon: "🥈",
    title: "All four metals covered",
    body: "Gold, silver, platinum, and palladium. Set as many alerts as you need across any combination of metals.",
  },
];

const HOW_IT_WORKS = [
  { step: "1", title: "Create a free account", body: "Sign in with your Google or email account — takes under 30 seconds." },
  { step: "2", title: "Set your target price", body: "Pick a metal, enter a price target, choose above or below. Done." },
  { step: "3", title: "Get notified", body: "Lode emails you the moment spot price crosses your threshold — while you sleep, work, or stack." },
];

export default function GoldPriceAlertsPage() {
  return (
    <main className="min-h-screen bg-surface text-white overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative px-4 sm:px-6 pt-14 pb-12 sm:pt-20 sm:pb-16">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute left-1/2 top-0 h-96 w-[600px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-10 blur-3xl"
            style={{ background: "radial-gradient(circle, #D4AF37 0%, transparent 70%)" }}
          />
        </div>
        <div className="relative z-10 mx-auto max-w-2xl text-center space-y-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-600">Price Alerts · Gold · Silver · Platinum</p>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter leading-tight">
            Gold Price Alerts<br />
            <span style={{ color: "var(--gold-bright)" }}>Delivered to Your Inbox</span>
          </h1>
          <p className="text-base text-gray-400 max-w-lg mx-auto leading-relaxed">
            Set a target price for gold, silver, platinum, or palladium. Get an email the moment spot price hits it —
            no app, no noise, just the alert you asked for.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/login" className="btn-gold px-10">
              Set a free alert
            </Link>
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
              View live spot prices →
            </Link>
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────── */}
      <section className="border-t px-4 sm:px-6 py-14" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-3xl space-y-10">
          <h2 className="text-2xl font-black tracking-tight text-center">How it works</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map(({ step, title, body }) => (
              <div key={step} className="flex flex-col gap-3">
                <div
                  className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-black"
                  style={{ background: "rgba(212,175,55,0.15)", color: "var(--gold-bright)" }}
                >
                  {step}
                </div>
                <p className="font-bold text-white">{title}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────── */}
      <section className="border-t px-4 sm:px-6 py-14" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-4xl space-y-10">
          <h2 className="text-2xl font-black tracking-tight text-center">What you get</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {FEATURES.map(({ icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl border p-6 space-y-2"
                style={{ borderColor: "var(--border)" }}
              >
                <p className="text-2xl">{icon}</p>
                <p className="font-bold text-white">{title}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <section className="border-t px-4 sm:px-6 py-14" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-2xl space-y-8">
          <h2 className="text-2xl font-black tracking-tight text-center">Common questions</h2>
          <div className="space-y-6">
            {(jsonLd["@graph"][1] as { mainEntity: { name: string; acceptedAnswer: { text: string } }[] }).mainEntity.map((qa) => (
              <div key={qa.name} className="space-y-2">
                <p className="font-bold text-white">{qa.name}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{qa.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="border-t px-6 py-16 text-center space-y-5" style={{ borderColor: "var(--border)" }}>
        <p className="text-2xl font-black tracking-tight">Never miss a gold price move again</p>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          Create a free account and set your first alert in under a minute.
        </p>
        <Link href="/login" className="btn-gold px-10 inline-block">
          Set a free alert
        </Link>
      </section>

      <SiteFooter />
    </main>
  );
}
