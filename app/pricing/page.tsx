import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function PricingPage() {
  const session = await getServerSession(authOptions);

  let isPro = false;
  if (session?.user?.email) {
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { subscriptionStatus: true },
    });
    isPro = dbUser?.subscriptionStatus === "active";
  }

  return (
    <main className="min-h-screen bg-black px-6 py-24 text-white">
      <div className="mx-auto max-w-4xl space-y-16">

        {/* Header */}
        <div className="text-center space-y-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Pricing</p>
          <h1 className="text-5xl font-black tracking-tight">
            Simple, transparent pricing
          </h1>
          <p className="text-gray-400 max-w-md mx-auto">
            Start free. Upgrade when you need more power.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2">

          {/* Free */}
          <div className="rounded-2xl border border-white/10 bg-gray-950 p-8 space-y-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Free</p>
              <div className="flex items-end gap-1">
                <span className="text-5xl font-black">$0</span>
                <span className="text-gray-500 mb-1">/month</span>
              </div>
              <p className="text-sm text-gray-400 mt-2">For casual tracking</p>
            </div>

            <ul className="space-y-3 text-sm text-gray-300">
              {["Up to 3 price alerts", "Gold, silver, platinum & palladium", "Email notifications", "Portfolio tracker"].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="text-amber-500">✓</span> {f}
                </li>
              ))}
            </ul>

            <div>
              {session ? (
                isPro ? (
                  <div className="rounded-full border border-white/10 py-2.5 text-center text-sm text-gray-500">
                    Not your plan
                  </div>
                ) : (
                  <div className="rounded-full border border-white/10 py-2.5 text-center text-sm text-gray-400">
                    Current plan
                  </div>
                )
              ) : (
                <Link
                  href="/login"
                  className="block rounded-full border border-white/10 py-2.5 text-center text-sm text-white hover:bg-white/5 transition-colors"
                >
                  Get started free
                </Link>
              )}
            </div>
          </div>

          {/* Pro */}
          <div className="relative rounded-2xl border border-amber-500/40 bg-gray-950 p-8 space-y-8 overflow-hidden">
            {/* Radial glow */}
            <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />

            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-amber-500">Pro</p>
                <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-semibold text-amber-400 uppercase tracking-wide">
                  Most popular
                </span>
              </div>
              <div className="flex items-end gap-1">
                <span className="text-5xl font-black">$9</span>
                <span className="text-gray-500 mb-1">/month</span>
              </div>
              <p className="text-sm text-gray-400 mt-2">For serious traders</p>
            </div>

            <ul className="relative space-y-3 text-sm text-gray-300">
              {[
                "Everything in Free",
                "Unlimited alerts",
                "Percent change alerts",
                "Faster alert evaluation",
                "Priority email delivery",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="text-amber-500">✓</span> {f}
                </li>
              ))}
            </ul>

            <div className="relative">
              {isPro ? (
                <div className="rounded-full bg-amber-500/20 py-2.5 text-center text-sm font-semibold text-amber-400">
                  Active plan
                </div>
              ) : session ? (
                <form action="/api/billing/checkout" method="POST">
                  <button
                    type="submit"
                    className="w-full rounded-full bg-amber-500 py-2.5 text-sm font-bold text-black hover:bg-amber-400 transition-colors"
                  >
                    Upgrade to Pro
                  </button>
                </form>
              ) : (
                <Link
                  href="/login"
                  className="block rounded-full bg-amber-500 py-2.5 text-center text-sm font-bold text-black hover:bg-amber-400 transition-colors"
                >
                  Start with Pro
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-sm text-gray-600">
          Questions? Email{" "}
          <a href="mailto:support@pm-iota-wheat.vercel.app" className="text-gray-400 hover:text-white transition-colors">
            support
          </a>{" "}
          anytime. Cancel or change plans at any time.
        </p>

      </div>
    </main>
  );
}
