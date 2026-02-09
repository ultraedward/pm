import { requireUser } from "@/lib/requireUser";
import { CreateAlertForm } from "@/components/CreateAlertForm";

export default async function NewAlertPage() {
  await requireUser();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Create Alert</h1>
      <CreateAlertForm />
    </div>
  );
}