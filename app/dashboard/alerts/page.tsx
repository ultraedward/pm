import Link from "next/link";
import { requireUser } from "@/lib/requireUser";
import { getUserAlerts } from "@/lib/alerts/getUserAlerts";
import { canCreateAlert } from "@/lib/alerts/canCreateAlert";
import { AlertsTable } from "@/components/AlertsTable";
import { prisma } from "@/lib/prisma";
import { SiteFooter } from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

export default async function DashboardAlertsPage() {
  const user = await requireUser();
  const [alerts, plan, spotRows] = await Promise.all([
    getUserAlerts(user.id),
    canCreateAlert(user.id),
    prisma.price.findMany({
      where: { metal: { in: ["gold", "silver", "platinum", "palladium"] } },
      orderBy: { timestamp: "desc" },
      distinct: ["metal"],
    }),
  ]);

  const spots: Record<string, number> = Object.fromEntries(
    spotRows.map((r) => [r.metal, r.price])
  );

  const hasAlerts = alerts.length > 0;

  return (
    <main className="min-h-screen bg-surface px-4 py-8 sm:p-8 text-white">
      <div className="mx-auto max-w-4xl space-y-6">

        {/* Header */}
        <div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="label mb-1">Alerts</p>
              <h1 className="text-3xl font-black tracking-tight">Price Alerts</h1>
            </div>
            <Link
              href="/alerts/new"
              className="btn-gold shrink-0 px-5 py-2 text-sm"
            >
              + New alert
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-2">Get an email when a metal hits your target price — checked daily.</p>
        </div>

        {/* Plan Banner */}
        {!plan.isPro && (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-gray-300">
              <span className="font-semibold text-white">Free plan —</span>{" "}
              {plan.remaining === 0
                ? "All 3 free alerts used."
                : `${plan.remaining} of 3 free alert${plan.remaining !== 1 ? "s" : ""} remaining.`}
            </span>
            <Link
              href="/pricing"
              className="self-start sm:self-auto shrink-0 rounded-full bg-amber-500/20 px-4 py-1.5 text-xs font-bold text-amber-400 hover:bg-amber-500/30 transition-colors"
            >
              Upgrade for unlimited →
            </Link>
          </div>
        )}

        {/* Content */}
        {hasAlerts ? (
          <AlertsTable alerts={alerts} spots={spots} />
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-12 text-center space-y-4">
            <p className="text-xl font-black tracking-tight">No alerts yet</p>
            <p className="text-sm text-gray-400 max-w-sm mx-auto leading-relaxed">
              Get an email when gold, silver, platinum, or palladium crosses your target price — checked daily.
            </p>
            <div className="flex justify-center gap-3 pt-1">
              <Link href="/alerts/new" className="btn-gold px-6 py-2.5 text-sm">
                Set your first alert
              </Link>
              <Link
                href="/pricing"
                className="rounded-full border border-white/10 px-6 py-2.5 text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
              >
                View plans
              </Link>
            </div>
          </div>
        )}
      </div>
      <SiteFooter />
    </main>
  );
}
