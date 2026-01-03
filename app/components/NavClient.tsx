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
    <nav className="w-full border-b bg-white">
      <div className="mx-auto max-w-6xl px-6 py-4 flex gap-6">
        {LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium ${
                active
                  ? "text-black border-b-2 border-black pb-1"
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
