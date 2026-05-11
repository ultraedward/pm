"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

type Props = {
  isLoggedIn: boolean;
};

export default function NavMobile({ isLoggedIn }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const loggedInLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/alerts",    label: "Alerts"    },
    { href: "/account",   label: "Account"   },
  ];

  const loggedOutLinks = [
    { href: "/gold-price",   label: "Gold Price"   },
    { href: "/silver-price", label: "Silver Price"  },
    { href: "/compare",      label: "Compare"       },
    { href: "/gram",         label: "Calculator"    },
    { href: "/gold-ira",     label: "Gold IRA"      },
    { href: "/faq",          label: "FAQ"           },
    { href: "/login",        label: "Get started"   },
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
        className="btn-gold px-4 py-2.5 text-xs min-h-[44px] flex items-center"
      >
        Get started
      </Link>

      {/* Hamburger button — aria-expanded tells screen readers whether the
          menu is currently open; aria-controls points to the dropdown id */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-nav-menu"
        className="flex flex-col justify-center items-center gap-1.5 p-2 transition-colors"
        style={{ borderRadius: 0 }}
      >
        <span
          aria-hidden="true"
          className="block h-0.5 w-5 transition-all duration-200"
          style={{
            backgroundColor: "var(--text)",
            transform: open ? "translateY(8px) rotate(45deg)" : undefined,
          }}
        />
        <span
          aria-hidden="true"
          className="block h-0.5 w-5 transition-all duration-200"
          style={{
            backgroundColor: "var(--text)",
            opacity: open ? 0 : 1,
          }}
        />
        <span
          aria-hidden="true"
          className="block h-0.5 w-5 transition-all duration-200"
          style={{
            backgroundColor: "var(--text)",
            transform: open ? "translateY(-8px) rotate(-45deg)" : undefined,
          }}
        />
      </button>

      {/* Dropdown — role="navigation" makes it a landmark; hidden when closed
          via display (not conditional render) so aria-expanded stays accurate */}
      <nav
        id="mobile-nav-menu"
        aria-label="Mobile navigation"
        className="absolute left-0 right-0 top-full z-50 px-6 py-4 space-y-1"
        style={{
          backgroundColor: "var(--dropdown-bg)",
          borderBottom: "1px solid var(--border-strong)",
          display: open ? "block" : "none",
        }}
      >
        {links.map(({ href, label }) => {
          const isActivePath = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              aria-current={isActivePath ? "page" : undefined}
              className="block px-4 py-3 text-sm font-medium transition-colors"
              style={{
                borderRadius: 0,
                backgroundColor: isActivePath ? "var(--surface-2)" : "transparent",
                color: isActivePath ? "var(--text)" : "var(--text-muted)",
              }}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
