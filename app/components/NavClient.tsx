"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/alerts", label: "Alerts" },
  { href: "/export", label: "Export" },
];

export default function NavClient() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  return (
    <nav className="w-full border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Left */}
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Precious Metals
          </Link>

          <div className="hidden md:flex gap-4">
            {LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm transition ${
                    active
                      ? "font-semibold text-black"
                      : "text-neutral-500 hover:text-black"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {status === "loading" ? null : session ? (
            <>
              <span className="hidden sm:block text-sm text-neutral-500">
                {session.user?.email}
              </span>
              <button
                onClick={() => signOut()}
                className="rounded-md border px-3 py-1.5 text-sm hover:bg-neutral-100"
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn()}
              className="rounded-md bg-black px-4 py-1.5 text-sm text-white hover:bg-neutral-800"
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
