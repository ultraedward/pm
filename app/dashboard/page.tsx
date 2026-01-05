// app/dashboard/page.tsx

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import SignOutButton from "./sign-out-button";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow">
        <h1 className="text-2xl font-semibold">Dashboard</h1>

        <p className="mt-4 text-gray-700">
          Signed in as <strong>{session.user?.email}</strong>
        </p>

        <div className="mt-6 flex gap-3">
          <Link
            href="/dashboard/alerts"
            className="rounded bg-black px-4 py-2 text-sm text-white"
          >
            Alerts
          </Link>

          <Link
            href="/dashboard/charts"
            className="rounded bg-gray-200 px-4 py-2 text-sm"
          >
            Charts
          </Link>

          <SignOutButton />
        </div>
      </div>
    </main>
  );
}
