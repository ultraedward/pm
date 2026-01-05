// app/dashboard/charts/page.tsx

export const runtime = "nodejs";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import ChartClient from "./chart-client";

type PriceRow = {
  metal: string;
  price: number;
  createdAt: Date;
};

export default async function ChartsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  // 🔴 Use raw SQL to avoid missing Prisma model typing
  const prices = (await prisma.$queryRaw`
    SELECT metal, price, "createdAt"
    FROM "SpotPriceCache"
    WHERE "createdAt" >= NOW() - INTERVAL '30 days'
    ORDER BY "createdAt" ASC
  `) as PriceRow[];

  const alerts = await prisma.alert.findMany({
    where: { user: { email: session.user.email } },
    select: {
      metal: true,
      threshold: true,
      direction: true,
      active: true,
    },
  });

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl rounded-xl bg-white p-6 shadow">
        <h1 className="text-2xl font-semibold">Charts</h1>
        <p className="mt-2 text-sm text-gray-600">
          30-day spot price history with your alert thresholds
        </p>

        <div className="mt-6">
          <ChartClient prices={prices} alerts={alerts} />
        </div>
      </div>
    </main>
  );
}
