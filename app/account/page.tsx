import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/requireUser";
import { prisma } from "@/lib/prisma";
import { SignOutButton } from "@/components/SignOutButton";
import { SiteFooter } from "@/components/SiteFooter";
import { CurrencyPicker } from "@/components/CurrencyPicker";
import { hasProAccess } from "@/lib/entitlements";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await requireUser();

  const [dbUser, alertCount, holdingCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: user.id },
      select: {
        email: true,
        name: true,
        createdAt: true,
        preferredCurrency: true,
        subscriptionStatus: true,
        proUntil: true,
      },
    }),
    prisma.alert.count({ where: { userId: user.id } }),
    prisma.holding.count({ where: { userId: user.id } }),
  ]);

  const isPro = dbUser ? hasProAccess({ stripeStatus: dbUser.subscriptionStatus, proUntil: dbUser.proUntil }) : false;
  const isTrial = isPro && !dbUser?.subscriptionStatus && !!dbUser?.proUntil;
  const trialDaysLeft = isTrial && dbUser?.proUntil
    ? Math.max(0, Math.ceil((new Date(dbUser.proUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  if (!dbUser?.email) redirect("/");

  return (
    <>
    <main className="bg-surface text-white">
      <div className="mx-auto max-w-xl px-6 py-16 space-y-10">

        {/* Header */}
        <div>
          <p className="label mb-2">Account</p>
          <h1 className="text-3xl font-black tracking-tight">{dbUser.name ?? "User"}</h1>
          <p className="text-sm text-gray-500 mt-1">{dbUser.email}</p>
        </div>

        {/* Usage */}
        <div className="space-y-3">
          <p className="label">Activity</p>
          <div className="grid grid-cols-2 divide-x border overflow-hidden" style={{ borderColor: "var(--border)" }}>
            <Link href="/dashboard/alerts" className="group px-6 py-4 hover:bg-white/5 transition-colors">
              <p className="text-2xl font-black tabular-nums">{alertCount}</p>
              <p className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors">{alertCount === 1 ? "Alert" : "Alerts"} →</p>
            </Link>
            <Link href="/dashboard/holdings" className="group px-6 py-4 hover:bg-white/5 transition-colors">
              <p className="text-2xl font-black tabular-nums">{holdingCount}</p>
              <p className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors">{holdingCount === 1 ? "Holding" : "Holdings"} →</p>
            </Link>
          </div>
        </div>

        {/* Currency preference */}
        <div className="space-y-3">
          <p className="label">Currency</p>
          <p className="text-sm text-gray-500">
            Prices, portfolio values, and alert thresholds are shown in your preferred currency.
            All conversions use live exchange rates.
          </p>
          <CurrencyPicker current={dbUser.preferredCurrency ?? "USD"} />
        </div>

        {/* Email notifications */}
        <div className="space-y-3">
          <p className="label">Email</p>
          <p className="text-sm text-gray-500">
            Price alert emails are sent when your target is hit. The weekly digest arrives each Monday. Manage preferences via the unsubscribe link in any email.
          </p>
        </div>

        {/* Plan */}
        <div className="space-y-3">
          <p className="label">Plan</p>
          {isPro ? (
            <div className="border px-5 py-4 space-y-3" style={{ borderColor: "var(--gold-glow)", background: "var(--gold-dim)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold" style={{ color: "var(--gold)" }}>
                    {isTrial ? "Lode Pro — Trial" : "Lode Pro"}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Extended charts, CSV export, annual tax snapshot.</p>
                </div>
                {!isTrial && (
                  <Link href="/api/billing/portal" className="text-xs font-bold uppercase tracking-widest transition-colors hover:text-white" style={{ color: "var(--text-dim)" }}>
                    Manage →
                  </Link>
                )}
              </div>
              {isTrial && trialDaysLeft !== null && (
                <div className="flex items-center justify-between">
                  <p className="text-xs" style={{ color: "var(--gold)" }}>
                    {trialDaysLeft === 0 ? "Trial ends today" : `${trialDaysLeft} day${trialDaysLeft === 1 ? "" : "s"} left in trial`}
                  </p>
                  <Link
                    href="/pricing"
                    className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 border transition-colors hover:bg-white/5"
                    style={{ borderColor: "var(--gold-glow)", color: "var(--gold)" }}
                  >
                    Upgrade →
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between border px-5 py-4" style={{ borderColor: "var(--border)" }}>
              <div>
                <p className="text-sm font-bold text-white">Free</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Unlimited alerts, portfolio tracker, melt calculators.</p>
              </div>
              <Link
                href="/pricing"
                className="shrink-0 text-xs font-bold uppercase tracking-widest px-4 py-2 border transition-colors hover:bg-white/5"
                style={{ borderColor: "var(--gold-glow)", color: "var(--gold)" }}
              >
                Upgrade →
              </Link>
            </div>
          )}
        </div>

        {/* Footer row — sign out + feedback */}
        <div className="flex items-center justify-between border-t pt-6" style={{ borderColor: "var(--border)" }}>
          <SignOutButton />
          <a
            href="mailto:hello@lode.rocks?subject=Lode Feedback"
            className="text-xs text-gray-600 hover:text-gray-300 transition-colors"
          >
            Send feedback →
          </a>
        </div>

      </div>
      <SiteFooter />
      </main>
  </>
  );
}
