// app/dashboard/alerts/new/page.tsx

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import CreateAlertForm from "./create-alert-form";

export default async function NewAlertPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-xl rounded-xl bg-white p-6 shadow">
        <h1 className="text-2xl font-semibold">Create Alert</h1>
        <p className="mt-2 text-sm text-gray-600">
          Get notified when a metal crosses a price threshold.
        </p>

        <div className="mt-6">
          <CreateAlertForm />
        </div>
      </div>
    </main>
  );
}
