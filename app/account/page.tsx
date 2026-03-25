import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/requireUser";
import { prisma } from "@/lib/prisma";
import { SignOutButton } from "@/components/SignOutButton";
import { SiteFooter } from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await requireUser();

  const [dbUser, alertCount, holdingCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: user.id },
      select: {
        email: true,
        name: true,
        subscriptionStatus: true,
        stripeCurrentPeriodEnd: true,
        createdAt: true,
      },
    }),
    prisma.alert.count({ where: { userId: user.id } }),
    prisma.holding.count({ where: { userId: user.id } }),
  ]);

  if (!dbUser?.email) redirect("/");

  const isPro = dbUser.subscriptionStatus === "active";

  return (
    <main className="min-h-screen bg-surface text-white">
      <div className="mx-auto max-w-xl px-6 py-16 space-y-12">

        {/* Header */}
        <div>
          <p className="label mb-2">Account</p>
          <h1 className="text-3xl font-black tracking-tight">{dbUser.name ?? "User"}</h1>
          <p className="text-sm text-gray-500 mt-1">{dbUser.email}</p>
        </div>

        {/* Plan */}
        <div className="space-y-4 border-t pt-8" style={{ borderColor: "var(--border)" }}>
          <p className="label">Plan</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-black tracking-tight">
                {isPro ? "Pro" : "Free"}
                {isPro && (
                  <span className="ml-2 text-xs font-semibold text-amber-400">Active</span>
                )}
              </p>
              <p className="text-sm text-gray-500 mt-0.5">
                {isPro
                  ? dbUser.stripeCurrentPeriodEnd
                    ? `Renews ${new Date(dbUser.stripeCurrentPeriodEnd).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}`
                    : "Unlimited alerts"
                  : "1 alert included"}
              </p>
            </div>
            {isPro ? (
              <form action="/api/billing/portal" method="POST">
                <button
                  type="submit"
                  className="rounded-full border border-white/10 px-5 py-3 text-sm font-medium text-gray-300 hover:bg-white/5 transition-colors min-h-[44px]"
                >
                  Manage billing
                </button>
              </form>
            ) : (
              <Link
                href="/pricing"
                className="rounded-full bg-amber-500 px-5 py-3 text-sm font-bold text-black hover:bg-amber-400 transition-colors min-h-[44px] flex items-center"
              >
                Upgrade to Pro
              </Link>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-4 border-t pt-8" style={{ borderColor: "var(--border)" }}>
          <p className="label">Usage</p>
          <div className="grid grid-cols-2 gap-x-8">
            <Link href="/dashboard/alerts" className="group space-y-1 py-3 border-b" style={{ borderColor: "var(--border)" }}>
              <p className="text-2xl font-black tabular-nums">{alertCount}</p>
              <p className="text-sm text-gray-500">{alertCount === 1 ? "Alert" : "Alerts"}</p>
              <p className="text-xs text-gray-700 group-hover:text-gray-500 transition-colors">
                {isPro ? "Unlimited" : `${Math.max(0, 3 - alertCount)} of 3 remaining`}
              </p>
            </Link>
            <Link href="/dashboard/holdings" className="group space-y-1 py-3 border-b" style={{ borderColor: "var(--border)" }}>
              <p className="text-2xl font-black tabular-nums">{holdingCount}</p>
              <p className="text-sm text-gray-500">{holdingCount === 1 ? "Holding" : "Holdings"}</p>
              <p className="text-xs text-gray-700 group-hover:text-gray-500 transition-colors">View portfolio →</p>
            </Link>
          </div>
        </div>

        {/* Emails */}
        <div className="space-y-3 border-t pt-8" style={{ borderColor: "var(--border)" }}>
          <p className="label">Emails</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-white">Weekly digest</p>
                <p className="text-xs text-gray-500 mt-0.5">Spot prices &amp; portfolio summary every Monday</p>
              </div>
              <span className="text-xs font-semibold text-amber-400">On</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-white">Price alerts</p>
                <p className="text-xs text-gray-500 mt-0.5">Email when a metal hits your target</p>
              </div>
              <span className="text-xs font-semibold text-amber-400">On</span>
            </div>
          </div>
        </div>

        {/* Feedback */}
        <div className="space-y-3 border-t pt-8" style={{ borderColor: "var(--border)" }}>
          <p className="label">Feedback</p>
          <p className="text-sm text-gray-500">Have a suggestion or found a bug? We&apos;d love to hear from you.</p>
          <a
            href="mailto:hello@lode.rocks?subject=Lode Feedback"
            className="inline-block rounded-full border border-white/10 px-5 py-2.5 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors min-h-[44px] leading-[1.25rem]"
          >
            Send feedback →
          </a>
        </div>

        {/* Sign out */}
        <div className="border-t pt-8" style={{ borderColor: "var(--border)" }}>
          <SignOutButton />
        </div>

      </div>
      <SiteFooter />
    </main>
  );
}
