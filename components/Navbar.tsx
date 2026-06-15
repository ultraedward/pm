import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasProAccess } from "@/lib/entitlements";
import NavMobile from "@/components/NavMobile";
import NavLinks from "@/components/NavLinks";
import ThemeToggle from "@/components/ThemeToggle";

export default async function Navbar() {
  const session = await getServerSession(authOptions);

  const isLoggedIn = !!session?.user;

  let isPro = false;
  if (isLoggedIn && session?.user?.email) {
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { subscriptionStatus: true, proUntil: true },
    });
    isPro = hasProAccess({ stripeStatus: dbUser?.subscriptionStatus, proUntil: dbUser?.proUntil });
  }

  return (
    <nav aria-label="Main navigation" className="sticky top-0 z-40 border-b" style={{ borderColor: "var(--nav-border)", backgroundColor: "var(--nav-bg)", backdropFilter: "blur(12px)" }}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link href="/" className="font-black uppercase hover:opacity-50 transition-opacity" style={{ letterSpacing: "0.32em", fontSize: "13px", color: "var(--text)" }}>
          Lode
        </Link>

        {/* Desktop */}
        <NavLinks isLoggedIn={isLoggedIn} isPro={isPro} />

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
