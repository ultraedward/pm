import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/requireUser";
import { prisma } from "@/lib/prisma";

export default async function AccountPage() {
  const user = await requireUser();

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      email: true,
      name: true,
      subscriptionStatus: true,
      stripeCurrentPeriodEnd: true,
    },
  });

  if (!dbUser?.email) {
    redirect("/");
  }

  const isPro = dbUser.subscriptionStatus === "active";

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Account</h1>

        <Link
          href="/alerts"
          className="rounded border border-gray-800 px-4 py-2 text-sm text-gray-200 hover:bg-gray-900"
        >
          Back to Alerts
        </Link>
      </div>

      <div className="rounded-xl border border-gray-800 bg-gray-950 p-6">
        <div className="text-sm text-gray-400">Signed in as</div>
        <div className="mt-1 text-lg font-semibold">
          {dbUser.name ?? "User"}
        </div>
        <div className="text-sm text-gray-300">{dbUser.email}</div>
      </div>

      <div className="rounded-xl border border-gray-800 bg-gray-950 p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-400">Plan</div>
            <div className="mt-1 text-xl font-semibold">
              {isPro ? "Pro" : "Free"}
            </div>

            {isPro && dbUser.stripeCurrentPeriodEnd ? (
              <div className="mt-1 text-sm text-gray-400">
                Renews{" "}
                {new Date(dbUser.stripeCurrentPeriodEnd).toLocaleDateString()}
              </div>
            ) : (
              <div className="mt-1 text-sm text-gray-400">
                Up to 3 alerts on Free
              </div>
            )}
          </div>

          <div className="flex gap-3">
            {isPro ? (
              <form action="/api/billing/portal" method="POST">
                <button
                  type="submit"
                  className="rounded bg-white px-4 py-2 text-sm font-medium text-black hover:bg-gray-200"
                >
                  Manage billing
                </button>
              </form>
            ) : (
              <Link
                href="/pricing"
                className="rounded bg-yellow-500 px-4 py-2 text-sm font-semibold text-black hover:bg-yellow-400"
              >
                Upgrade to Pro
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-800 bg-gray-950 p-6">
        <div className="text-sm font-medium">Security</div>
        <div className="mt-2 text-sm text-gray-400">
          If you rotated secrets (Neon / Metals API / Cron), you’re good. Keep
          everything sensitive encrypted in Vercel env.
        </div>
      </div>
    </div>
  );
}