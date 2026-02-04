import Link from "next/link";
import { useUnreadAlerts } from "@/lib/useUnreadAlerts";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const unread = useUnreadAlerts();

  return (
    <div className="flex min-h-screen">
      <nav className="w-64 border-r border-gray-800 p-4 space-y-4">
        <Link href="/dashboard" className="block">
          Dashboard
        </Link>

        <Link href="/dashboard/alerts" className="block">
          Alerts
        </Link>

        <Link
          href="/dashboard/alerts/activity"
          className="flex items-center gap-2"
        >
          <span>Activity</span>

          {unread !== null && unread > 0 && (
            <span className="ml-auto bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
              {unread}
            </span>
          )}
        </Link>

        <Link href="/dashboard/charts" className="block">
          Charts
        </Link>

        <Link href="/dashboard/system" className="block">
          System
        </Link>
      </nav>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}