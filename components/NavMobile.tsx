"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  isLoggedIn: boolean;
  isPro: boolean;
};

export default function NavMobile({ isLoggedIn, isPro }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const loggedInLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/alerts",    label: "Alerts"    },
    { href: "/account",   label: "Account"   },
    ...(!isPro ? [{ href: "/pricing", label: "Upgrade to Pro" }] : []),
  ];

  const loggedOutLinks = [
    { href: "/pricing", label: "Pricing" },
    { href: "/login",   label: "Sign in"  },
  ];

  const links = isLoggedIn ? loggedInLinks : loggedOutLinks;

  return (
    <div className="sm:hidden">
      {/* Hamburger button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle menu"
        className="flex flex-col justify-center items-center gap-1.5 p-2 rounded-lg hover:bg-gray-900 transition-colors"
      >
        <span
          className={`block h-0.5 w-5 bg-white transition-all duration-200 ${
            open ? "translate-y-2 rotate-45" : ""
          }`}
        />
        <span
          className={`block h-0.5 w-5 bg-white transition-all duration-200 ${
            open ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block h-0.5 w-5 bg-white transition-all duration-200 ${
            open ? "-translate-y-2 -rotate-45" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 right-0 top-full z-50 border-b border-gray-800 bg-black px-6 py-4 space-y-1">
          {links.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`block rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-400 hover:bg-gray-900 hover:text-white"
                } ${
                  label === "Upgrade to Pro"
                    ? "mt-2 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 hover:text-amber-300"
                    : ""
                }`}
              >
                {label}
              </Link>
            );
          })}

          {isLoggedIn && isPro && (
            <div className="px-4 pt-2">
              <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
                PRO
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
