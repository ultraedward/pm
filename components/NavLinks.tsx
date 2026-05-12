"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  isLoggedIn: boolean;
};

export default function NavLinks({ isLoggedIn }: Props) {
  const pathname = usePathname();

  function isActive(href: string) {
    return (
      pathname === href ||
      (href === "/dashboard" && pathname === "/dashboard") ||
      (href !== "/dashboard" && href !== "/" && pathname.startsWith(href))
    );
  }

  function linkClass(href: string) {
    return `label transition-colors ${isActive(href) ? "" : "hover:!text-white"}`;
  }

  function activeStyle(href: string): React.CSSProperties | undefined {
    return isActive(href) ? { color: "var(--text)" } : undefined;
  }

  return (
    <div className="hidden sm:flex items-center gap-8">
      {isLoggedIn ? (
        <>
          <Link href="/dashboard" className={linkClass("/dashboard")} style={activeStyle("/dashboard")} aria-current={isActive("/dashboard") ? "page" : undefined}>Dashboard</Link>
          <Link href="/alerts"    className={linkClass("/alerts")}    style={activeStyle("/alerts")}    aria-current={isActive("/alerts")    ? "page" : undefined}>Alerts</Link>
          <Link href="/compare"   className={linkClass("/compare")}   style={activeStyle("/compare")}   aria-current={isActive("/compare")   ? "page" : undefined}>Compare</Link>
          <Link
            href="/account"
            className={`transition-colors ${pathname === "/account" ? "" : "text-gray-500 hover:text-white"}`}
            style={pathname === "/account" ? { color: "var(--text)" } : undefined}
            aria-label="Account"
            aria-current={pathname === "/account" ? "page" : undefined}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
              <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
            </svg>
          </Link>
        </>
      ) : (
        <>
          <Link href="/gold-price"   className={linkClass("/gold-price")}   style={activeStyle("/gold-price")}   aria-current={isActive("/gold-price")   ? "page" : undefined}>Gold Price</Link>
          <Link href="/silver-price" className={linkClass("/silver-price")} style={activeStyle("/silver-price")} aria-current={isActive("/silver-price") ? "page" : undefined}>Silver Price</Link>
          <Link href="/compare"      className={linkClass("/compare")}      style={activeStyle("/compare")}      aria-current={isActive("/compare")      ? "page" : undefined}>Compare</Link>
          <Link href="/gold-ira"     className={linkClass("/gold-ira")}     style={activeStyle("/gold-ira")}     aria-current={isActive("/gold-ira")     ? "page" : undefined}>Gold IRA</Link>
          <Link href="/login" className="btn-gold px-4 py-1.5 text-xs">
            Get started
          </Link>
        </>
      )}
    </div>
  );
}
