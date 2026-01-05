// app/dashboard/charts/page.tsx

export const runtime = "nodejs";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import ChartClient from "./chart-client";

export default async function ChartsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  // Last 30 days of prices (per metal)
  const prices = await prisma.price.findMany({
    where: {
      createdAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    },
    orderBy: { createdAt: "asc" },
    select: {
      metal: true,
      price: true,
      createdAt: true,
    },
  });

  // User alerts (threshold overlays)
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
          30-day price history with your alert thresholds
        </p>

        <div className="mt-6">
          <ChartClient prices={prices} alerts={alerts} />
        </div>
      </div>
    </main>
  );
}
