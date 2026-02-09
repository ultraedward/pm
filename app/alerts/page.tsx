import Link from "next/link";
import { requireUser } from "@/lib/requireUser";
import { getUserAlerts } from "@/lib/alerts/getUserAlerts";
import { AlertsTable } from "@/components/AlertsTable";

export default async function AlertsPage() {
  const user = await requireUser();
  const alerts = await getUserAlerts(user.id);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Your Alerts</h1>

      <Link href="/alerts/new" className="underline">
        + Create Alert
      </Link>

      <AlertsTable alerts={alerts} />
    </div>
  );
}