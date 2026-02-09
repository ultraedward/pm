import { requireUser } from "@/lib/requireUser";
import { CreateAlertForm } from "@/components/CreateAlertForm";

export default async function NewAlertPage() {
  await requireUser();

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Create alert</h1>
      <CreateAlertForm />
    </div>
  );
}