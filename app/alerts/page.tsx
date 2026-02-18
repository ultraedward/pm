import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";
import { getUserSubscription } from "@/lib/billing/getUserSubscription";
import Link from "next/link";

export default async function AlertsPage() {
  const user = await requireUser();

  const subscription = await getUserSubscription(
    user.id
  );

  const isPro =
    subscription?.status === "active";

  const alerts = await prisma.alert.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const activeAlerts = alerts.filter(
    (a) => a.active
  );

  return (
    <main className="min-h-screen bg-black p-10 text-white">
      <div className="mx-auto max-w-5xl space-y-10">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold">
            Alerts
          </h1>
          <p className="mt-2 text-neutral-400">
            Manage your gold and silver alerts.
          </p>
        </div>

        {/* Upgrade Banner (FREE LIMIT REACHED) */}
        {!isPro && activeAlerts.length >= 1 && (
          <div className="rounded-xl border border-yellow-500 bg-yellow-500/10 p-6">
            <h2 className="text-lg font-semibold text-yellow-400">
              Free Plan Limit Reached
            </h2>
            <p className="mt-2 text-sm text-yellow-300">
              Free accounts can create only 1 active
              alert.
            </p>
            <p className="mt-1 text-sm text-yellow-300">
              Upgrade to Pro for unlimited alerts,
              priority notifications, and advanced
              features.
            </p>

            <Link
              href="/pricing"
              className="mt-4 inline-block rounded bg-yellow-500 px-5 py-2 font-semibold text-black hover:bg-yellow-400 transition"
            >
              Upgrade to Pro
            </Link>
          </div>
        )}

        {/* Create Alert Button */}
        <div className="flex justify-between items-center">
          <p className="text-neutral-400 text-sm">
            {activeAlerts.length} active alert
            {activeAlerts.length !== 1 && "s"}
          </p>

          {(isPro ||
            activeAlerts.length < 1) && (
            <Link
              href="/alerts/new"
              className="rounded bg-white px-5 py-2 text-black font-semibold hover:bg-neutral-200 transition"
            >
              Create Alert
            </Link>
          )}
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {alerts.length === 0 && (
            <div className="rounded-xl border border-gray-800 bg-gray-950 p-6 text-center text-neutral-400">
              No alerts created yet.
            </div>
          )}

          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="rounded-xl border border-gray-800 bg-gray-950 p-6"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold capitalize">
                    {alert.metal}
                  </p>

                  {alert.type === "price" && (
                    <p className="text-sm text-neutral-400 mt-1">
                      Trigger when price goes{" "}
                      {alert.direction}{" "}
                      ${alert.price}
                    </p>
                  )}

                  {alert.type === "percent" && (
                    <p className="text-sm text-neutral-400 mt-1">
                      Trigger when price moves{" "}
                      {alert.direction}{" "}
                      {alert.percentValue}%
                    </p>
                  )}
                </div>

                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    alert.active
                      ? "bg-green-500/20 text-green-400"
                      : "bg-gray-700 text-gray-400"
                  }`}
                >
                  {alert.active
                    ? "Active"
                    : "Inactive"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}