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
    <header
      style={{
        borderBottom: "1px solid #e5e5e5",
        background: "#fff",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <nav
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Link href="/" style={{ fontWeight: 700, fontSize: 18 }}>
            Precious Metals
          </Link>

          <div style={{ display: "flex", gap: 16 }}>
            {LINKS.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  style={{
                    fontSize: 14,
                    color: active ? "#000" : "#666",
                    fontWeight: active ? 600 : 400,
                    textDecoration: "none",
                  }}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          {status === "loading" ? null : session ? (
            <button
              onClick={() => signOut()}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: "1px solid #ccc",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              Sign out
            </button>
          ) : (
            <button
              onClick={() => signIn()}
              style={{
                padding: "6px 14px",
                borderRadius: 6,
                border: "none",
                background: "#000",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Sign in
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
