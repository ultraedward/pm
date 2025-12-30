"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import ThemeSwitcher from "./ThemeSwitcher";

const LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/alerts", label: "Alerts" },
  { href: "/notifications", label: "Notifications" },
  { href: "/history", label: "History" },
  { href: "/system", label: "System" },
  { href: "/export", label: "Export" },
];

export default function NavClient() {
  const path = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/signin");
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800 bg-black">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
        <span className="font-bold tracking-wide">PM Tracker</span>

        <div className="hidden md:flex items-center gap-6">
          {LINKS.map((l) => {
            const active = path === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm ${
                  active
                    ? "text-white border-b-2 border-white pb-1"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <ThemeSwitcher />
          <button
            onClick={logout}
            className="text-sm text-gray-400 hover:text-white"
          >
            Log out
          </button>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 rounded border border-gray-800"
          aria-label="Menu"
        >
          ☰
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-800 bg-black">
          <div className="px-4 py-3 flex flex-col gap-3">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`py-2 ${
                  path === l.href
                    ? "text-white"
                    : "text-gray-400"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-2 flex items-center justify-between">
              <ThemeSwitcher />
              <button
                onClick={logout}
                className="text-sm text-gray-400"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
