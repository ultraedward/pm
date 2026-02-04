import { ReactNode } from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="min-h-screen flex bg-black text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-800 p-4 space-y-6">
        <div className="text-xl font-semibold">
          Precious Metals
        </div>

        <nav className="flex flex-col space-y-2 text-sm">
          <Link
            href="/dashboard"
            className="rounded px-3 py-2 hover:bg-gray-800"
          >
            Dashboard
          </Link>

          <Link
            href="/dashboard/alerts"
            className="rounded px-3 py-2 hover:bg-gray-800"
          >
            Alerts
          </Link>

          <Link
            href="/dashboard/alerts/activity"
            className="rounded px-3 py-2 hover:bg-gray-800"
          >
            Alert Activity
          </Link>

          <Link
            href="/dashboard/settings"
            className="rounded px-3 py-2 hover:bg-gray-800"
          >
            Settings
          </Link>
        </nav>

        <div className="pt-6 border-t border-gray-800 text-xs text-gray-400">
          Signed in as
          <div className="mt-1 text-white truncate">
            {session.user?.email}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}