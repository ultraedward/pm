import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hasProAccess } from "@/lib/entitlements";
import { ChartsClient } from "./ChartsClient";

export const dynamic = "force-dynamic";

export default async function ChartsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { subscriptionStatus: true, proUntil: true },
  });

  const isPro = hasProAccess({
    stripeStatus: dbUser?.subscriptionStatus,
    proUntil: dbUser?.proUntil,
  });

  return (
    <main className="min-h-screen bg-surface p-8 text-white">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="label mb-1">Charts</p>
            <h1 className="text-3xl font-black tracking-tight">Price History</h1>
          </div>
          {!isPro && (
            <a
              href="/pricing"
              className="shrink-0 text-xs font-bold uppercase tracking-widest px-4 py-2.5 border transition-colors hover:bg-white/5"
              style={{ borderColor: "var(--gold-glow)", color: "var(--gold)" }}
            >
              Upgrade for 90d / All-time →
            </a>
          )}
        </div>
        <ChartsClient isPro={isPro} />
      </div>
    </main>
  );
}
