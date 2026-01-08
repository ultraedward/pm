import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ManageSubscriptionButton from "./ManageSubscriptionButton";

export const dynamic = "force-dynamic";

type Row = {
  metal: string;
  price: number;
  createdAt: Date;
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // If you want dashboard to require auth:
  if (!session?.user?.email) {
    return (
      <main className="p-6">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="mt-2 text-gray-600">Please sign in to continue.</p>
      </main>
    );
  }

  // latest price per metal (SpotPriceCache has createdAt, not updatedAt)
  const latest = await prisma.spotPriceCache.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    select: { metal: true, price: true, createdAt: true },
  });

  const byMetal = new Map<string, Row>();
  for (const r of latest) {
    if (!byMetal.has(r.metal)) {
      byMetal.set(r.metal, {
        metal: r.metal,
        price: Number(r.price),
        createdAt: r.createdAt,
      });
    }
  }

  const prices = Array.from(byMetal.values()).sort((a, b) =>
    a.metal.localeCompare(b.metal)
  );

  return (
    <main className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="text-sm text-gray-500">
            Signed in as {session.user.email}
          </p>
        </div>

        {/* show button for everyone (portal handles access); you can gate later */}
        <ManageSubscriptionButton />
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {prices.map((p) => (
          <div key={p.metal} className="rounded-lg border p-4">
            <div className="text-xs text-gray-500">{p.metal.toUpperCase()}</div>
            <div className="mt-1 text-2xl font-semibold">
              ${p.price.toFixed(2)}
            </div>
            <div className="mt-1 text-xs text-gray-500">
              Updated {p.createdAt.toLocaleString()}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
