import Link from "next/link";
import { requireUser } from "@/lib/requireUser";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const sessionUser = await requireUser();

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      subscriptionStatus: true,
    },
  });

  const [activeAlertsCount, totalAlertsCount] = await Promise.all([
    prisma.alert.count({
      where: { userId: sessionUser.id, active: true },
    }),
    prisma.alert.count({
      where: { userId: sessionUser.id },
    }),
  ]);

  const isPro = user?.subscriptionStatus === "active";

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-400">
          Welcome back. Here’s a quick snapshot of your account.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
          <p className="text-sm text-gray-400">Active alerts</p>
          <p className="mt-2 text-3xl font-bold">
            {activeAlertsCount}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {totalAlertsCount} total alerts
          </p>
        </div>

        <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
          <p className="text-sm text-gray-400">Plan</p>
          <p className="mt-2 text-3xl font-bold">
            {isPro ? "Pro" : "Free"}
          </p>

          {!isPro && (
            <Link
              href="/pricing"
              className="mt-3 inline-block text-sm text-blue-400 hover:underline"
            >
              Upgrade for unlimited alerts →
            </Link>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/prices"
          className="rounded-lg border border-gray-800 bg-black p-4 hover:bg-gray-900"
        >
          <h3 className="font-medium">Prices</h3>
          <p className="mt-1 text-sm text-gray-400">
            View recent gold & silver prices
          </p>
        </Link>

        <Link
          href="/alerts"
          className="rounded-lg border border-gray-800 bg-black p-4 hover:bg-gray-900"
        >
          <h3 className="font-medium">Alerts</h3>
          <p className="mt-1 text-sm text-gray-400">
            Manage your price alerts
          </p>
        </Link>

        <Link
          href="/alerts/new"
          className="rounded-lg border border-gray-800 bg-black p-4 hover:bg-gray-900"
        >
          <h3 className="font-medium">Create alert</h3>
          <p className="mt-1 text-sm text-gray-400">
            Get notified when prices move
          </p>
        </Link>
      </div>
    </div>
  );
}