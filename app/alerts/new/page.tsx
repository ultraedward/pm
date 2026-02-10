import { requireUser } from "@/lib/requireUser";
import { canCreateAlert } from "@/lib/alerts/canCreateAlert";
import Link from "next/link";
import { CreateAlertForm } from "@/components/CreateAlertForm";

export default async function NewAlertPage() {
  const user = await requireUser();
  const allowed = await canCreateAlert(user.id);

  if (!allowed) {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Upgrade required</h1>

        <p className="text-gray-400">
          Free users can create up to 3 alerts.
        </p>

        <Link
          href="/pricing"
          className="inline-block rounded bg-white px-4 py-2 text-sm font-medium text-black hover:bg-gray-200"
        >
          Upgrade to Pro
        </Link>
      </div>
    );
  }

  return <CreateAlertForm />;
}