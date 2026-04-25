"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

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
    { href: "/gram",    label: "Calculator" },
    { href: "/compare", label: "Compare"    },
    { href: "/pricing", label: "Pricing"    },
    { href: "/login",   label: "Get started free" },
  ];

  const links = isLoggedIn ? loggedInLinks : loggedOutLinks;

  // Logged-in users navigate via the bottom tab bar
  if (isLoggedIn) return null;

  return (
    <div className="sm:hidden flex items-center gap-2">
      {/* Theme toggle */}
      <ThemeToggle />

      {/* CTA — always visible on mobile */}
      <Link
        href="/login"
        className="btn-gold px-3 py-1.5 text-xs"
      >
        Get started
      </Link>

      {/* Hamburger button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle menu"
        className="flex flex-col justify-center items-center gap-1.5 p-2 transition-colors"
        style={{ borderRadius: 0 }}
      >
        <span
          className="block h-0.5 w-5 transition-all duration-200"
          style={{
            backgroundColor: "var(--text)",
            transform: open ? "translateY(8px) rotate(45deg)" : undefined,
          }}
        />
        <span
          className="block h-0.5 w-5 transition-all duration-200"
          style={{
            backgroundColor: "var(--text)",
            opacity: open ? 0 : 1,
          }}
        />
        <span
          className="block h-0.5 w-5 transition-all duration-200"
          style={{
            backgroundColor: "var(--text)",
            transform: open ? "translateY(-8px) rotate(-45deg)" : undefined,
          }}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute left-0 right-0 top-full z-50 px-6 py-4 space-y-1"
          style={{
            backgroundColor: "var(--dropdown-bg)",
            borderBottom: "1px solid var(--border-strong)",
          }}
        >
          {links.map(({ href, label }) => {
            const isActive = pathname === href;
            const isUpgrade = label === "Upgrade to Pro";
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 text-sm font-medium transition-colors"
                style={{
                  borderRadius: 0,
                  backgroundColor: isActive
                    ? "var(--surface-2)"
                    : isUpgrade
                    ? "var(--gold-dim)"
                    : "transparent",
                  color: isUpgrade
                    ? "var(--gold)"
                    : isActive
                    ? "var(--text)"
                    : "var(--text-muted)",
                }}
              >
                {label}
              </Link>
            );
          })}

          {isLoggedIn && isPro && (
            <div className="px-4 pt-2">
              <span
                className="px-3 py-1 text-xs font-medium"
                style={{ backgroundColor: "var(--gold-dim)", color: "var(--gold)" }}
              >
                PRO
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
