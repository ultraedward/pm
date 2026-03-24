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
          <Link href="/dashboard" className={linkClass("/dashboard")}>Dashboard</Link>
          <Link href="/alerts"    className={linkClass("/alerts")}>Alerts</Link>
          {isPro ? (
            <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-medium uppercase tracking-widest text-amber-400 border border-amber-500/20">
              Pro
            </span>
          ) : (
            <Link href="/pricing" className="btn-gold px-4 py-1.5 text-xs">
              Upgrade
            </Link>
          )}
          <Link
            href="/account"
            className={`transition-colors ${
              pathname === "/account"
                ? "text-white"
                : "text-gray-500 hover:text-white"
            }`}
            aria-label="Account"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
            </svg>
          </Link>
        </>
      ) : (
        <>
          <Link href="/gram"    className={linkClass("/gram")}>Calculator</Link>
          <Link href="/pricing" className={linkClass("/pricing")}>Pricing</Link>
          <Link href="/login" className="rounded-full border border-white/20 px-4 py-1.5 text-xs font-medium text-white hover:bg-white/10 transition-colors">
            Sign in
          </Link>
        </>
      )}
    </div>
  );
}
