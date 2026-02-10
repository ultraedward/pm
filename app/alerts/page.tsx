import Link from "next/link";
import { requireUser } from "@/lib/requireUser";
import { getUserAlerts } from "@/lib/alerts/getUserAlerts";
import { AlertsTable } from "@/components/AlertsTable";

export default async function AlertsPage() {
  const user = await requireUser();
  const alerts = await getUserAlerts(user.id);

  const hasAlerts = alerts.length > 0;

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Alerts</h1>

        <Link
          href="/alerts/new"
          className="rounded bg-white px-4 py-2 text-sm font-medium text-black hover:bg-gray-200"
        >
          + Create alert
        </Link>
      </div>

      {/* Plan notice */}
      <div className="rounded border border-gray-800 bg-gray-900 p-4 text-sm">
        <span className="font-medium">Free plan:</span> Up to 3 alerts.
        <Link
          href="/pricing"
          className="ml-2 text-blue-400 hover:underline"
        >
          Upgrade for unlimited alerts →
        </Link>
      </div>

      {/* Content */}
      {hasAlerts ? (
        <AlertsTable alerts={alerts} />
      ) : (
        <div className="rounded-lg border border-gray-800 bg-gray-900 p-10 text-center">
          <h2 className="mb-2 text-xl font-semibold">
            No alerts yet
          </h2>

          <p className="mb-6 text-gray-400">
            Create an alert to get notified when gold or silver prices move.
          </p>

          <div className="flex justify-center gap-4">
            <Link
              href="/alerts/new"
              className="rounded bg-white px-5 py-2 text-sm font-medium text-black hover:bg-gray-200"
            >
              Create your first alert
            </Link>

            <Link
              href="/pricing"
              className="rounded border border-gray-700 px-5 py-2 text-sm text-gray-300 hover:bg-gray-800"
            >
              View plans
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}