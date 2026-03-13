import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import NavMobile from "@/components/NavMobile";

export default async function Navbar() {
  const session = await getServerSession(authOptions);

  let subscriptionStatus: string | null = null;
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { subscriptionStatus: true },
    });
    subscriptionStatus = user?.subscriptionStatus || null;
  }

  const isPro = subscriptionStatus === "active";
  const isLoggedIn = !!session?.user;

  return (
    <nav className="sticky top-0 z-40 border-b bg-black/80 backdrop-blur-md" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link href="/" className="text-sm font-black uppercase tracking-widest hover:text-amber-400 transition-colors">
          Precious Metals
        </Link>

        {/* Desktop */}
        <div className="hidden sm:flex items-center gap-8 text-xs font-medium uppercase tracking-widest">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="text-gray-500 hover:text-white transition-colors">Dashboard</Link>
              <Link href="/alerts"    className="text-gray-500 hover:text-white transition-colors">Alerts</Link>
              <Link href="/account"   className="text-gray-500 hover:text-white transition-colors">Account</Link>
              {isPro ? (
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-emerald-400 border border-emerald-500/20">
                  Pro
                </span>
              ) : (
                <Link href="/pricing" className="rounded-full bg-amber-500 px-4 py-1.5 text-black font-bold hover:bg-amber-400 transition-colors">
                  Upgrade
                </Link>
              )}
            </>
          ) : (
            <>
              <Link href="/pricing" className="text-gray-500 hover:text-white transition-colors">Pricing</Link>
              <Link href="/login"   className="rounded-full border border-white/20 px-4 py-1.5 text-white hover:bg-white/10 transition-colors">
                Sign in
              </Link>
            </>
          )}
        </div>

        {/* Mobile */}
        <NavMobile isLoggedIn={isLoggedIn} isPro={isPro} />
      </div>
    </nav>
  );
}
