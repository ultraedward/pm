"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Prices", href: "/dashboard/prices" },
  { label: "Alerts", href: "/dashboard/alerts" },
  { label: "Charts", href: "/dashboard/charts" },
];

export default function NavClient() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-4">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={
            pathname === link.href
              ? "font-semibold underline"
              : "text-muted-foreground hover:text-foreground"
          }
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}