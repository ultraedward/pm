import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/requireUser";
import { prisma } from "@/lib/prisma";

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
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-2xl px-6 py-12 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Account</h1>
          <Link
            href="/dashboard"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Dashboard
          </Link>
        </div>

        {/* Profile */}
        <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Profile</p>
          <p className="text-lg font-semibold mt-3">{dbUser.name ?? "User"}</p>
          <p className="text-sm text-gray-400">{dbUser.email}</p>
          <p className="text-xs text-gray-600 mt-1">
            Member since {new Date(dbUser.createdAt).toLocaleDateString(undefined, { month: "long", year: "numeric" })}
          </p>
        </div>

        {/* Plan */}
        <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Plan</p>
              <div className="mt-3 flex items-center gap-2">
                <p className="text-lg font-semibold">{isPro ? "Pro" : "Free"}</p>
                {isPro && (
                  <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-400">
                    Active
                  </span>
                )}
              </div>
              {isPro ? (
                <p className="mt-1 text-sm text-gray-400">
                  {dbUser.stripeCurrentPeriodEnd
                    ? `Renews ${new Date(dbUser.stripeCurrentPeriodEnd).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}`
                    : "Unlimited alerts"}
                </p>
              ) : (
                <p className="mt-1 text-sm text-gray-400">
                  1 alert included ·{" "}
                  <Link href="/pricing" className="text-yellow-400 hover:underline">
                    Upgrade for unlimited
                  </Link>
                </p>
              )}
            </div>

            {isPro ? (
              <form action="/api/billing/portal" method="POST">
                <button
                  type="submit"
                  className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors"
                >
                  Manage billing
                </button>
              </form>
            ) : (
              <Link
                href="/pricing"
                className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-semibold text-black hover:bg-yellow-400 transition-colors shrink-0"
              >
                Upgrade to Pro
              </Link>
            )}
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/alerts"
            className="rounded-2xl border border-gray-800 bg-gray-950 p-5 hover:border-gray-700 transition-colors"
          >
            <p className="text-2xl font-bold">{alertCount}</p>
            <p className="text-sm text-gray-400 mt-1">
              {alertCount === 1 ? "Alert" : "Alerts"}
            </p>
            <p className="text-xs text-gray-600 mt-0.5">
              {isPro ? "Unlimited plan" : `${Math.max(0, 1 - alertCount)} of 1 remaining`}
            </p>
          </Link>

          <Link
            href="/dashboard/holdings"
            className="rounded-2xl border border-gray-800 bg-gray-950 p-5 hover:border-gray-700 transition-colors"
          >
            <p className="text-2xl font-bold">{holdingCount}</p>
            <p className="text-sm text-gray-400 mt-1">
              {holdingCount === 1 ? "Holding" : "Holdings"}
            </p>
            <p className="text-xs text-gray-600 mt-0.5">View portfolio →</p>
          </Link>
        </div>

        {/* Sign out */}
        <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Sign out</p>
            <p className="text-xs text-gray-500 mt-0.5">
              You'll be returned to the home page.
            </p>
          </div>
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="rounded-lg border border-red-900 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-950 transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}
