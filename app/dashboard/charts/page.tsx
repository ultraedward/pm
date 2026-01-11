// app/dashboard/charts/page.tsx
// FULL SHEET — REPLACE THIS FILE COMPLETELY

import Link from "next/link";
import { getServerSession } from "next-auth";

import ChartClient from "./chart-client";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

type RangeKey = "24h" | "7d" | "30d";

function rangeToMs(range: RangeKey) {
  if (range === "24h") return 24 * 60 * 60 * 1000;
  if (range === "30d") return 30 * 24 * 60 * 60 * 1000;
  return 7 * 24 * 60 * 60 * 1000;
}

export default async function ChartsPage({
  searchParams,
}: {
  searchParams?: { range?: string };
}) {
  const session = await getServerSession(authOptions);

  const range = (searchParams?.range as RangeKey) || "7d";
  const safeRange: RangeKey = ["24h", "7d", "30d"].includes(range)
    ? range
    : "7d";

  const since = new Date(Date.now() - rangeToMs(safeRange));

  const pricesRaw = await prisma.spotPriceCache.findMany({
    where: { createdAt: { gte: since } },
    orderBy: { createdAt: "asc" },
    take: 3000,
    select: { metal: true, price: true, createdAt: true },
  });

  const alertsRaw = session?.user?.id
    ? await prisma.alert.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        select: { metal: true, direction: true, target: true },
      })
    : [];

  const prices = pricesRaw.map((p) => ({
    metal: p.metal,
    price: Number(p.price),
    createdAt: p.createdAt,
  }));

  const alerts = alertsRaw.map((a) => ({
    metal: a.metal,
    direction: a.direction,
    target: Number(a.target),
  }));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Spot Price History</h1>
          <p className="text-sm text-gray-500">
            Showing {safeRange} of cached prices
            {session?.user?.email ? ` for ${session.user.email}` : ""}.
          </p>
        </div>

        <div className="flex gap-2">
          {([
            ["24h", "24h"],
            ["7d", "7d"],
            ["30d", "30d"],
          ] as const).map(([key, label]) => (
            <Link
              key={key}
              href={`/dashboard/charts?range=${key}`}
              className={`rounded px-3 py-1 text-sm border ${
                safeRange === key
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {prices.length === 0 ? (
        <div className="rounded border p-4 text-sm text-gray-500">
          No price history found in the DB for this range.
          <div className="mt-2">
            Try hitting <code className="px-1">/api/cron/move-prices</code> (or
            your cron) to backfill, then refresh.
          </div>
        </div>
      ) : (
        <ChartClient prices={prices} alerts={alerts} range={safeRange} />
      )}
    </div>
  );
}
