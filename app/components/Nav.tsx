// /app/components/Nav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/alerts", label: "Alerts" },
  { href: "/history", label: "History" },
  { href: "/status", label: "Status" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="nav">
      <div className="brand">Precious Metals</div>

      <div className="links">
        {LINKS.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`link ${active ? "active" : ""}`}
            >
              {l.label}
            </Link>
          );
        })}
      </div>

      <style jsx>{`
        .nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          margin-bottom: 18px;
          background: #0b0d12;
          border-bottom: 1px solid #1f222a;
        }

        .brand {
          font-size: 14px;
          font-weight: 900;
          letter-spacing: 0.3px;
          color: #e9ecf1;
        }

        .links {
          display: flex;
          gap: 14px;
        }

        .link {
          font-size: 12px;
          font-weight: 800;
          padding: 8px 12px;
          border-radius: 999px;
          color: #b3b8c4;
          text-decoration: none;
          border: 1px solid transparent;
        }

        .link:hover {
          background: #111318;
          color: #e9ecf1;
        }

        .link.active {
          background: #1c202a;
          border-color: #3a3f4a;
          color: #e9ecf1;
        }
      `}</style>
    </nav>
  );
}
