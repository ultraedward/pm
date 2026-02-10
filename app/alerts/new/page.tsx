import { redirect } from "next/navigation";
import { requireUser } from "@/lib/requireUser";
import { canCreateAlert } from "@/lib/alerts/canCreateAlert";
import { CreateAlertForm } from "@/components/CreateAlertForm";

export default async function NewAlertPage() {
  const user = await requireUser();
  const { allowed } = await canCreateAlert(user.id);

  if (!allowed) {
    redirect("/pricing");
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Create alert</h1>
      <CreateAlertForm />
    </div>
  );
}