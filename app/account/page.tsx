import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/requireUser";
import { prisma } from "@/lib/prisma";
import { SignOutButton } from "@/components/SignOutButton";
import { SiteFooter } from "@/components/SiteFooter";
import { CurrencyPicker } from "@/components/CurrencyPicker";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await requireUser();

  const [dbUser, alertCount, holdingCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: user.id },
      select: {
        email: true,
        name: true,
        createdAt: true,
        preferredCurrency: true,
      },
    }),
    prisma.alert.count({ where: { userId: user.id } }),
    prisma.holding.count({ where: { userId: user.id } }),
  ]);

  if (!dbUser?.email) redirect("/");

  return (
    <>
    <main className="bg-surface text-white">
      <div className="mx-auto max-w-xl px-6 py-16 space-y-10">

        {/* Header */}
        <div>
          <p className="label mb-2">Account</p>
          <h1 className="text-3xl font-black tracking-tight">{dbUser.name ?? "User"}</h1>
          <p className="text-sm text-gray-500 mt-1">{dbUser.email}</p>
        </div>

        {/* Usage */}
        <div className="space-y-3">
          <p className="label">Activity</p>
          <div className="grid grid-cols-2 divide-x rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
            <Link href="/dashboard/alerts" className="group px-6 py-4 hover:bg-white/5 transition-colors">
              <p className="text-2xl font-black tabular-nums">{alertCount}</p>
              <p className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors">{alertCount === 1 ? "Alert" : "Alerts"} →</p>
            </Link>
            <Link href="/dashboard/holdings" className="group px-6 py-4 hover:bg-white/5 transition-colors">
              <p className="text-2xl font-black tabular-nums">{holdingCount}</p>
              <p className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors">{holdingCount === 1 ? "Holding" : "Holdings"} →</p>
            </Link>
          </div>
        </div>

        {/* Currency preference */}
        <div className="space-y-3">
          <p className="label">Currency</p>
          <p className="text-sm text-gray-500">
            Prices, portfolio values, and alert thresholds are shown in your preferred currency.
            All conversions use live exchange rates.
          </p>
          <CurrencyPicker current={dbUser.preferredCurrency ?? "USD"} />
        </div>

        {/* Email notifications */}
        <div className="space-y-3">
          <p className="label">Email</p>
          <p className="text-sm text-gray-500">
            Price alert emails are sent when your target is hit. The weekly digest arrives each Monday. Manage preferences via the unsubscribe link in any email.
          </p>
        </div>

        {/* Footer row — sign out + feedback */}
        <div className="flex items-center justify-between border-t pt-6" style={{ borderColor: "var(--border)" }}>
          <SignOutButton />
          <a
            href="mailto:hello@lode.rocks?subject=Lode Feedback"
            className="text-xs text-gray-600 hover:text-gray-300 transition-colors"
          >
            Send feedback →
          </a>
        </div>

      </div>
      </main>
    <SiteFooter />
  </>
  );
}
