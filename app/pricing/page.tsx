import { requireUser } from "@/lib/requireUser";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function PricingPage() {
  const user = await requireUser();

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      subscriptionStatus: true,
    },
  });

  const isPro = dbUser?.subscriptionStatus === "active";

  return (
    <div className="mx-auto max-w-6xl p-8">
      <h1 className="mb-12 text-center text-4xl font-bold">
        Pricing
      </h1>

      <div className="grid gap-8 md:grid-cols-2">
        {/* FREE PLAN */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-8">
          <h2 className="text-2xl font-semibold">Free</h2>
          <p className="mt-2 text-gray-400">
            For casual tracking
          </p>

          <div className="mt-6 text-4xl font-bold">
            $0
            <span className="text-lg font-normal text-gray-400">
              /month
            </span>
          </div>

          <ul className="mt-8 space-y-3 text-sm text-gray-300">
            <li>• Up to 3 alerts</li>
            <li>• Price alerts only</li>
            <li>• Email notifications</li>
          </ul>

          <div className="mt-8">
            {isPro ? (
              <div className="rounded bg-gray-800 py-2 text-center text-sm">
                You're on Pro
              </div>
            ) : (
              <div className="rounded bg-gray-800 py-2 text-center text-sm">
                Current plan
              </div>
            )}
          </div>
        </div>

        {/* PRO PLAN */}
        <div className="relative rounded-xl border border-yellow-500 bg-black p-8 shadow-lg shadow-yellow-500/10">
          <div className="absolute -top-3 right-6 rounded-full bg-yellow-500 px-3 py-1 text-xs font-semibold text-black">
            MOST POPULAR
          </div>

          <h2 className="text-2xl font-semibold text-yellow-400">
            Pro
          </h2>

          <p className="mt-2 text-gray-400">
            For serious traders
          </p>

          <div className="mt-6 text-4xl font-bold">
            $9
            <span className="text-lg font-normal text-gray-400">
              /month
            </span>
          </div>

          <ul className="mt-8 space-y-3 text-sm text-gray-300">
            <li>• Unlimited alerts</li>
            <li>• Percent change alerts</li>
            <li>• Faster alert evaluation</li>
            <li>• Priority email delivery</li>
          </ul>

          <div className="mt-8">
            {isPro ? (
              <div className="rounded bg-yellow-500 py-2 text-center text-sm font-semibold text-black">
                Active
              </div>
            ) : (
              <form action="/api/billing/checkout" method="POST">
                <button
                  type="submit"
                  className="w-full rounded bg-yellow-500 py-2 font-semibold text-black hover:bg-yellow-400"
                >
                  Upgrade to Pro
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="mt-16 text-center text-sm text-gray-500">
        Questions? Email support anytime.
      </div>
    </div>
  );
}