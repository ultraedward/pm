"use client";

import Link from "next/link";
import { useUnreadAlerts } from "@/lib/useUnreadAlerts";

export default function DashboardNav() {
  const unread = useUnreadAlerts();

  return (
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

      <Link href="/dashboard/prices" className="block">
        Prices
      </Link>

      <Link href="/dashboard/charts" className="block">
        Charts
      </Link>
    </nav>
  );
}