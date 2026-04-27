import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import NavMobile from "@/components/NavMobile";
import NavLinks from "@/components/NavLinks";
import ThemeToggle from "@/components/ThemeToggle";

export default async function Navbar() {
  const session = await getServerSession(authOptions);

  const isLoggedIn = !!session?.user;

  return (
    <nav className="sticky top-0 z-40 border-b" style={{ borderColor: "var(--nav-border)", backgroundColor: "var(--nav-bg)", backdropFilter: "blur(12px)" }}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link href="/" className="font-black uppercase hover:opacity-60 transition-opacity" style={{ letterSpacing: "0.3em", fontSize: "13px", color: "var(--text)" }}>
          <span className="rainbow-text">Lode</span>
        </Link>

        {/* Desktop */}
        <NavLinks isLoggedIn={isLoggedIn} />

        {/* Theme toggle
            - Desktop: always visible (right of nav links)
            - Mobile logged-in: visible here (NavMobile is null when logged in)
            - Mobile logged-out: hidden here (NavMobile renders its own toggle) */}
        <div className={isLoggedIn ? "flex items-center" : "hidden sm:flex items-center"}>
          <ThemeToggle />
        </div>

        {/* Mobile */}
        <NavMobile isLoggedIn={isLoggedIn} />
      </div>
    </nav>
  );
}
