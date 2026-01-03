"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/alerts", label: "Alerts" },
  { href: "/export", label: "Export" },
];

export default function NavClient() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-6 px-8 py-4 text-black">
      <div className="font-semibold text-lg">Precious Metals</div>

      <div className="flex gap-4">
        {LINKS.map((link) => {
          const active = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm ${
                active
                  ? "font-semibold underline"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
