"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  isLoggedIn: boolean;
  isPro: boolean;
};

export default function NavLinks({ isLoggedIn, isPro }: Props) {
  const pathname = usePathname();

  function linkClass(href: string) {
    // Exact match, except /dashboard which owns anything under it that isn't its own sub-route in the nav
    const isActive =
      pathname === href ||
      (href === "/dashboard" && pathname === "/dashboard") ||
      (href !== "/dashboard" && href !== "/" && pathname.startsWith(href));
    return `text-xs font-medium uppercase tracking-widest transition-colors ${
      isActive ? "text-white" : "text-gray-500 hover:text-white"
    }`;
  }

  return (
    <div className="hidden sm:flex items-center gap-8">
      {isLoggedIn ? (
        <>
          <Link href="/dashboard"        className={linkClass("/dashboard")}>Dashboard</Link>
          <Link href="/dashboard/charts" className={linkClass("/dashboard/charts")}>Charts</Link>
          <Link href="/alerts"           className={linkClass("/alerts")}>Alerts</Link>
          <Link href="/account"          className={linkClass("/account")}>Account</Link>
          {isPro ? (
            <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-medium uppercase tracking-widest text-amber-400 border border-amber-500/20">
              Pro
            </span>
          ) : (
            <Link href="/pricing" className="btn-gold px-4 py-1.5 text-xs">
              Upgrade
            </Link>
          )}
        </>
      ) : (
        <>
          <Link href="/pricing" className={linkClass("/pricing")}>Pricing</Link>
          <Link href="/login" className="rounded-full border border-white/20 px-4 py-1.5 text-xs font-medium text-white hover:bg-white/10 transition-colors">
            Sign in
          </Link>
        </>
      )}
    </div>
  );
}
