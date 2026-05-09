import Link from "next/link";
import { requireUser } from "@/lib/requireUser";
import { getUserAlerts } from "@/lib/alerts/getUserAlerts";
import { AlertsTable } from "@/components/AlertsTable";
import { prisma } from "@/lib/prisma";
import { SiteFooter } from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

export default async function DashboardAlertsPage() {
  const user = await requireUser();
  const [alerts, spotRows] = await Promise.all([
    getUserAlerts(user.id),
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
    <>
    <main className="bg-surface px-4 py-8 sm:p-8 text-white">
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
            </div>
          </div>
        )}
      </div>
    </main>
    <SiteFooter />
    </>
  );
}
