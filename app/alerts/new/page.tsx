import { requireUser } from "@/lib/requireUser";
import { prisma } from "@/lib/prisma";
import { CreateAlertForm } from "@/components/CreateAlertForm";
import { type SupportedCurrency, SUPPORTED_CURRENCIES } from "@/lib/fx";
import Link from "next/link";

// Passed to the client form — keeps process.env server-side only
const AFFILIATE_AUGUSTA_URL = process.env.AFFILIATE_AUGUSTA_URL ?? null;

export default async function NewAlertPage() {
  const user = await requireUser();

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { preferredCurrency: true },
  });

  const currency: SupportedCurrency = SUPPORTED_CURRENCIES.includes(
    dbUser?.preferredCurrency as SupportedCurrency
  )
    ? (dbUser!.preferredCurrency as SupportedCurrency)
    : "USD";

  return (
    <main className="min-h-screen bg-surface px-4 py-6 sm:p-8 text-white">
      <div className="mx-auto max-w-xl space-y-8">
        <div>
          <Link
            href="/dashboard/alerts"
            className="text-xs font-medium uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
          >
            ← Alerts
          </Link>
          <h1 className="mt-3 text-3xl font-black tracking-tight">New Alert</h1>
          <p className="mt-1 text-sm text-gray-500">
            Get an email when your target price is hit — checked daily.
          </p>
        </div>
        <CreateAlertForm currency={currency} iraUrl={AFFILIATE_AUGUSTA_URL} />
      </div>
    </main>
  );
}
