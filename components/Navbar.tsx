import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import NavMobile from "@/components/NavMobile";
import NavLinks from "@/components/NavLinks";

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
          Lode
        </Link>

        {/* Desktop */}
        <NavLinks isLoggedIn={isLoggedIn} isPro={isPro} />

        {/* Mobile */}
        <NavMobile isLoggedIn={isLoggedIn} isPro={isPro} />
      </div>
    </nav>
  );
}
