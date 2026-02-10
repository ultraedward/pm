import Link from "next/link";
import { requireUser } from "@/lib/requireUser";
import { canCreateAlert } from "@/lib/alerts/canCreateAlert";
import { CreateAlertForm } from "@/components/CreateAlertForm";

export default async function NewAlertPage() {
  const user = await requireUser();
  const allowed = await canCreateAlert(user.id);

  if (!allowed) {
    return (
      <div className="mx-auto max-w-xl space-y-6 p-6">
        <h1 className="text-2xl font-bold">Alert limit reached</h1>

        <p className="text-gray-400">
          Free accounts can create up to <strong>3 alerts</strong>.
        </p>

        <div className="rounded border border-gray-800 bg-gray-900 p-4 text-sm">
          Upgrade to Pro to unlock unlimited alerts and advanced features.
        </div>

        <div className="flex gap-4">
          <Link
            href="/pricing"
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Upgrade to Pro
          </Link>

          <Link
            href="/alerts"
            className="rounded border border-gray-700 px-4 py-2 text-sm hover:bg-gray-900"
          >
            Back to alerts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Create alert</h1>
        <p className="mt-1 text-gray-400 text-sm">
          Get notified when prices cross your target.
        </p>
      </div>

      <CreateAlertForm />

      <div className="text-sm text-gray-500">
        Alerts check prices automatically and notify you when triggered.
      </div>
    </div>
  );
}