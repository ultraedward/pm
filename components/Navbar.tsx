import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

  return (
    <nav className="border-b border-gray-900 bg-black">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Precious Metals
        </Link>

        <div className="flex items-center gap-6 text-sm">
          <Link href="/dashboard" className="text-gray-400 hover:text-white">
            Dashboard
          </Link>

          <Link href="/alerts" className="text-gray-400 hover:text-white">
            Alerts
          </Link>

          {session?.user && (
            <>
              {isPro ? (
                <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
                  PRO
                </span>
              ) : (
                <Link
                  href="/pricing"
                  className="rounded-full bg-yellow-500 px-3 py-1 text-xs font-semibold text-black hover:bg-yellow-400"
                >
                  Upgrade
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}