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
      <div className="mx-auto max-w-xl px-6 py-16 space-y-10">

        {/* Header */}
        <div>
          <p className="label mb-2">Account</p>
          <h1 className="text-3xl font-black tracking-tight">{dbUser.name ?? "User"}</h1>
          <p className="text-sm text-gray-500 mt-1">{dbUser.email}</p>
        </div>

        {/* Plan + usage — one card */}
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between px-6 py-5">
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
                  : `${Math.max(0, 1 - alertCount)} of 1 alert remaining`}
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
                Upgrade
              </Link>
            )}
          </div>
          <div className="grid grid-cols-2 divide-x border-t" style={{ borderColor: "var(--border)" }}>
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

        {/* Email preferences — just two rows, no chrome */}
        <div className="space-y-3">
          <p className="label">Email</p>
          <div className="divide-y rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between px-5 py-3">
              <p className="text-sm text-white">Price alerts</p>
              <span className="text-xs font-semibold text-amber-400">On</span>
            </div>
            <div className="flex items-center justify-between px-5 py-3">
              <p className={`text-sm ${isPro ? "text-white" : "text-gray-500"}`}>Weekly digest</p>
              {isPro
                ? <span className="text-xs font-semibold text-amber-400">On</span>
                : <Link href="/pricing" className="text-xs font-semibold text-gray-500 hover:text-amber-400 transition-colors">Pro</Link>
              }
            </div>
          </div>
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
  );
}
