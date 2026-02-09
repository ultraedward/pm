import Link from "next/link";
import { requireUser } from "@/lib/requireUser";
import { getUserAlerts } from "@/lib/alerts/getUserAlerts";
import { AlertsTable } from "@/components/AlertsTable";

export default async function AlertsPage() {
  const user = await requireUser();
  const alerts = await getUserAlerts(user.id);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Alerts</h1>

        <Link
          href="/alerts/new"
          className="rounded bg-white px-3 py-1.5 text-sm font-medium text-black hover:bg-gray-200"
        >
          + Create alert
        </Link>
      </div>

      <div className="rounded border border-gray-800 bg-gray-900 p-4 text-sm">
        <strong>Free plan:</strong> Up to 3 alerts.
        <Link
          href="/pricing"
          className="ml-2 underline text-gray-300 hover:text-white"
        >
          Upgrade for unlimited alerts →
        </Link>
      </div>

      <AlertsTable alerts={alerts} />
    </div>
  );
}