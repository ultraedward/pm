import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function SiteFooter() {
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session?.user?.email;
  const year = new Date().getFullYear();

  return (
    <footer
      className={`border-t px-6 pt-7 pb-8 ${isLoggedIn ? "hidden sm:block" : "block"}`}
      style={{ borderColor: "var(--border)" }}
    >
      <div className="mx-auto max-w-6xl space-y-5">

        {/* Trust strip — logged-out only */}
        {!isLoggedIn && (
          <div
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pb-5 border-b"
            style={{ borderColor: "var(--border)" }}
          >
            {[
              "No tracking cookies",
              "No ad networks",
              "No data sales",
            ].map((item) => (
              <span key={item} className="inline-flex items-center gap-1.5 text-[11px]" style={{ color: "var(--text-muted)" }}>
                <span aria-hidden className="text-emerald-500">✓</span>
                {item}
              </span>
            ))}
            <Link
              href="/methodology"
              className="text-[11px] underline underline-offset-2 transition-colors hover:text-white"
              style={{ color: "var(--text-muted)", textDecorationColor: "var(--border-strong)" }}
            >
              Methodology
            </Link>
          </div>
        )}

        {/* ── Main row: brand · product links · copyright ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link
            href="/"
            className="font-black uppercase tracking-[0.28em] text-xs hover:opacity-60 transition-opacity"
            style={{ color: "var(--text)" }}
          >
            Lode
          </Link>

          {/* Product links — the ones people actually follow */}
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {[
              { href: "/compare",              label: "Compare"        },
              { href: "/coin-melt-calculator", label: "Melt Calculator" },
              { href: "/gold-ira",             label: "Gold IRA"       },
              { href: "/faq",                  label: "FAQ"            },
              { href: "/about",                label: "About"          },
              { href: "/contact",              label: "Contact"        },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-xs transition-colors hover:text-white"
                style={{ color: "var(--text-muted)" }}
              >
                {label}
              </Link>
            ))}
          </div>

          <span className="text-xs" style={{ color: "var(--text-dim)" }}>
            © {year} Lode
          </span>
        </div>

        {/* ── Legal row — smaller, visually subordinate ── */}
        <div
          className="flex flex-wrap items-center gap-x-5 gap-y-1.5 pt-4 border-t"
          style={{ borderColor: "var(--border)" }}
        >
          {[
            { href: "/privacy",     label: "Privacy Policy" },
            { href: "/terms",       label: "Terms of Service" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-[10px] font-medium uppercase tracking-wider transition-colors hover:text-white"
              style={{ color: "var(--text-dim)" }}
            >
              {label}
            </Link>
          ))}
        </div>

      </div>
    </footer>
  );
}
