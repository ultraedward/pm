import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserAlerts } from "@/lib/alerts/getUserAlerts";
import { canCreateAlert } from "@/lib/alerts/canCreateAlert";
import { AlertsTable } from "@/components/AlertsTable";

export default async function AlertsPage() {
  const session = await getServerSession(authOptions);

if (!session?.user) {
  redirect("/api/auth/signin?callbackUrl=/alerts");
}

// NextAuth sessions usually do not include user.id
// so we use email as the stable identifier
const user = { id: session.user.email! };
  const alerts = await getUserAlerts(user.id);
  const plan = await canCreateAlert(user.id);

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

      {/* Plan Banner */}
      {!plan.isPro && (
        <div className="rounded-lg border border-yellow-600 bg-yellow-950/30 p-4 text-sm">
          <span className="font-semibold">
            Free Plan:
          </span>{" "}
          {plan.remaining} of 3 alerts remaining.

          <Link
            href="/pricing"
            className="ml-3 font-medium text-yellow-400 hover:underline"
          >
            Upgrade for unlimited alerts →
          </Link>
        </div>
      )}

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