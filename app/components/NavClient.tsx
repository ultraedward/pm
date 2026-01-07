"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/charts", label: "Charts" },
  { href: "/dashboard/alerts", label: "Alerts" },
];

export default function NavClient() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-4 p-4 border-b">
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`${
            pathname === link.href
              ? "font-semibold underline"
              : "text-gray-600"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
