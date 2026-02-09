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

        <Link href="/alerts/new" className="underline">
          + Create alert
        </Link>
      </div>

      <div className="rounded border border-gray-800 bg-gray-900 p-4 text-sm">
        <strong>Free plan:</strong> Up to 3 alerts.
        <span className="ml-2 text-gray-400">
          Upgrade anytime for unlimited alerts.
        </span>
      </div>

      <AlertsTable alerts={alerts} />
    </div>
  );
}