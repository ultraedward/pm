// app/dashboard/page.tsx

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import SignOutButton from "./sign-out-button";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow">
        <h1 className="text-2xl font-semibold">Dashboard</h1>

        <p className="mt-4 text-gray-700">
          Signed in as{" "}
          <strong>{session.user?.email}</strong>
        </p>

        <div className="mt-6">
          <SignOutButton />
        </div>
      </div>
    </main>
  );
}
