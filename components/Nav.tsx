"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Nav() {
  const pathname = usePathname();

  function linkClass(href: string) {
    const isActive =
      pathname === href || pathname.startsWith(href + "/");

    return isActive
      ? "font-semibold underline"
      : "hover:underline text-gray-300";
  }

  return (
    <nav className="flex items-center gap-6 border-b border-gray-700 p-4 text-sm">
      <Link href="/prices" className={linkClass("/prices")}>
        Prices
      </Link>

      <Link href="/alerts" className={linkClass("/alerts")}>
        Alerts
      </Link>

      <Link href="/pricing" className={linkClass("/pricing")}>
        Pricing
      </Link>
    </nav>
  );
}