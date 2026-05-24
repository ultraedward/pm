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

        {/* ── Main link grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pb-2">
          {/* Spot prices */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-dim)" }}>Spot Prices</p>
            {[
              { href: "/gold-price",      label: "Gold Price"      },
              { href: "/silver-price",    label: "Silver Price"    },
              { href: "/platinum-price",  label: "Platinum Price"  },
              { href: "/palladium-price", label: "Palladium Price" },
            ].map(({ href, label }) => (
              <Link key={href} href={href} className="block text-xs transition-colors hover:text-white" style={{ color: "var(--text-muted)" }}>
                {label}
              </Link>
            ))}
          </div>

          {/* Tools */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-dim)" }}>Tools</p>
            {[
              { href: "/compare",              label: "Compare Dealers"    },
              { href: "/coin-melt-calculator", label: "Coin Melt Value"    },
              { href: "/junk-silver-calculator", label: "Junk Silver"      },
              { href: "/gram",                 label: "Price Per Gram"     },
            ].map(({ href, label }) => (
              <Link key={href} href={href} className="block text-xs transition-colors hover:text-white" style={{ color: "var(--text-muted)" }}>
                {label}
              </Link>
            ))}
          </div>

          {/* Investing */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-dim)" }}>Investing</p>
            {[
              { href: "/gold-ira",          label: "Gold IRA Guide"      },
              { href: "/gold-price-alerts", label: "Price Alerts"        },
              { href: "/portfolio-tracker", label: "Portfolio Tracker"   },
              { href: "/blog",              label: "Guides & Articles"   },
            ].map(({ href, label }) => (
              <Link key={href} href={href} className="block text-xs transition-colors hover:text-white" style={{ color: "var(--text-muted)" }}>
                {label}
              </Link>
            ))}
          </div>

          {/* Company */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-dim)" }}>Company</p>
            {[
              { href: "/about",       label: "About"       },
              { href: "/methodology", label: "Methodology" },
              { href: "/faq",         label: "FAQ"         },
              { href: "/contact",     label: "Contact"     },
            ].map(({ href, label }) => (
              <Link key={href} href={href} className="block text-xs transition-colors hover:text-white" style={{ color: "var(--text-muted)" }}>
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* ── Bottom row: brand + copyright ── */}
        <div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t"
          style={{ borderColor: "var(--border)" }}
        >
          <Link
            href="/"
            className="font-black uppercase tracking-[0.28em] text-xs hover:opacity-60 transition-opacity"
            style={{ color: "var(--text)" }}
          >
            Lode
          </Link>
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
