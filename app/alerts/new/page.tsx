import { redirect } from "next/navigation";
import { requireUser } from "@/lib/requireUser";
import { canCreateAlert } from "@/lib/alerts/canCreateAlert";
import { CreateAlertForm } from "@/components/CreateAlertForm";
import Link from "next/link";

export default async function NewAlertPage() {
  const user = await requireUser();
  const { allowed } = await canCreateAlert(user.id);

  if (!allowed) {
    redirect("/pricing");
  }

  return (
    <main className="min-h-screen bg-surface px-4 py-6 sm:p-8 text-white">
      <div className="mx-auto max-w-xl space-y-8">
        <div>
          <Link
            href="/dashboard/alerts"
            className="text-xs font-medium uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
          >
            ← Alerts
          </Link>
          <h1 className="mt-3 text-3xl font-black tracking-tight">New Alert</h1>
          <p className="mt-1 text-sm text-gray-500">
            Get an email when your target price is hit — checked daily.
          </p>
        </div>
        <CreateAlertForm />
      </div>
    </main>
  );
}
