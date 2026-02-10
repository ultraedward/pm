import Link from "next/link";
import { requireUser } from "@/lib/requireUser";
import { prisma } from "@/lib/prisma";

export default async function NavBar() {
  const sessionUser = await requireUser();

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      subscriptionStatus: true,
    },
  });

  const isPro = user?.subscriptionStatus === "active";

  return (
    <nav className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
      {/* Left */}
      <div className="flex items-center space-x-6">
        <Link href="/" className="font-semibold">
          Precious Metals
        </Link>

        <Link href="/prices" className="text-sm text-gray-300 hover:text-white">
          Prices
        </Link>

        <Link href="/alerts" className="text-sm text-gray-300 hover:text-white">
          Alerts
        </Link>
      </div>

      {/* Right */}
      <div className="flex items-center space-x-4">
        {isPro ? (
          <>
            <span className="rounded bg-green-600/20 px-2 py-1 text-xs text-green-400">
              Pro
            </span>

            <form action="/api/billing/portal" method="POST">
              <button className="text-sm text-gray-300 hover:text-white underline">
                Manage billing
              </button>
            </form>
          </>
        ) : (
          <>
            <span className="rounded bg-gray-700 px-2 py-1 text-xs text-gray-300">
              Free
            </span>

            <Link
              href="/pricing"
              className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium hover:bg-blue-500"
            >
              Upgrade
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}