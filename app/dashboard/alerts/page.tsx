import Link from "next/link";
import { requireUser } from "@/lib/requireUser";
import { getUserAlerts } from "@/lib/alerts/getUserAlerts";
import { canCreateAlert } from "@/lib/alerts/canCreateAlert";
import { AlertsTable } from "@/components/AlertsTable";

export const dynamic = "force-dynamic";

export default async function DashboardAlertsPage() {
  const user = await requireUser();
  const alerts = await getUserAlerts(user.id);
  const plan = await canCreateAlert(user.id);

  const hasAlerts = alerts.length > 0;

  return (
    <main className="min-h-screen bg-black p-8 text-white">
      <div className="mx-auto max-w-4xl space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="label mb-1">Alerts</p>
            <h1 className="text-3xl font-black tracking-tight">Price Alerts</h1>
          </div>
          <Link
            href="/alerts/new"
            className="rounded-full bg-amber-500 px-5 py-2 text-sm font-bold text-black hover:bg-amber-400 transition-colors"
          >
            + New alert
          </Link>
        </div>

        {/* Plan Banner */}
        {!plan.isPro && (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm flex items-center justify-between gap-4">
            <span className="text-gray-300">
              <span className="font-semibold text-white">Free plan —</span>{" "}
              {plan.remaining === 0 ? "No alerts remaining." : "1 free alert remaining."}
            </span>
            <Link
              href="/pricing"
              className="shrink-0 rounded-full bg-amber-500/20 px-4 py-1.5 text-xs font-bold text-amber-400 hover:bg-amber-500/30 transition-colors"
            >
              Upgrade for unlimited →
            </Link>
          </div>
        )}

        {/* Content */}
        {hasAlerts ? (
          <AlertsTable alerts={alerts} />
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 bg-gray-950 p-12 text-center space-y-5">
            <p className="text-xl font-black tracking-tight">No alerts set</p>
            <p className="text-sm text-gray-400 max-w-sm mx-auto leading-relaxed">
              You'll receive an email when a daily spot price crosses your target threshold.
            </p>
            <div className="flex justify-center gap-3">
              <Link
                href="/alerts/new"
                className="rounded-full bg-amber-500 px-6 py-2.5 text-sm font-bold text-black hover:bg-amber-400 transition-colors"
              >
                Set an alert
              </Link>
              <Link
                href="/pricing"
                className="rounded-full border border-white/10 px-6 py-2.5 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                View plans
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
