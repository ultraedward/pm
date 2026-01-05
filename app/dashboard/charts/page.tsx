// app/dashboard/charts/page.tsx

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

type InfoSchemaTableRow = { table_name: string };
type InfoSchemaColumnRow = { column_name: string };

function pickTimeColumn(cols: string[]) {
  const preferred = [
    "createdAt",
    "created_at",
    "fetchedAt",
    "fetched_at",
    "timestamp",
    "time",
    "date",
    "updatedAt",
    "updated_at",
  ];
  const set = new Set(cols);
  for (const c of preferred) if (set.has(c)) return c;
  return null;
}

export default async function ChartsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  // Alerts are still Prisma-typed and stable
  const alerts = await prisma.alert.findMany({
    where: { user: { email: session.user.email } },
    select: {
      metal: true,
      threshold: true,
      direction: true,
      active: true,
    },
  });

  let prices: PriceRow[] = [];

  try {
    // 1) Find the actual spot price cache table (case-insensitive)
    const tables = (await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name ILIKE '%spot%price%cache%'
      ORDER BY table_name ASC
      LIMIT 10
    `) as InfoSchemaTableRow[];

    const table =
      tables.find((t) => t.table_name === "SpotPriceCache")?.table_name ??
      tables[0]?.table_name;

    if (!table) {
      // No table found: render empty charts without crashing
      return (
        <main className="min-h-screen bg-gray-50 p-8">
          <div className="mx-auto max-w-6xl rounded-xl bg-white p-6 shadow">
            <h1 className="text-2xl font-semibold">Charts</h1>
            <p className="mt-2 text-sm text-gray-600">
              No spot price cache table found in the database yet.
            </p>
            <div className="mt-6">
              <ChartClient prices={[]} alerts={alerts} />
            </div>
          </div>
        </main>
      );
    }

    // 2) Detect the timestamp column
    const columns = (await prisma.$queryRaw`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = ${table}
      ORDER BY ordinal_position ASC
    `) as InfoSchemaColumnRow[];

    const colNames = columns.map((c) => c.column_name);
    const timeCol = pickTimeColumn(colNames);

    if (!colNames.includes("metal") || !colNames.includes("price") || !timeCol) {
      return (
        <main className="min-h-screen bg-gray-50 p-8">
          <div className="mx-auto max-w-6xl rounded-xl bg-white p-6 shadow">
            <h1 className="text-2xl font-semibold">Charts</h1>
            <p className="mt-2 text-sm text-gray-600">
              Spot price cache table exists, but expected columns are missing
              (need metal, price, and a time column).
            </p>
            <div className="mt-6">
              <ChartClient prices={[]} alerts={alerts} />
            </div>
          </div>
        </main>
      );
    }

    // 3) Query last 30 days using validated identifiers
    const safeTable = `"${table.replace(/"/g, '""')}"`;
    const safeTimeCol = `"${timeCol.replace(/"/g, '""')}"`;

    // NOTE: identifiers cannot be parameterized, so we use Unsafe *only after* validating via information_schema
    const sql = `
      SELECT metal, price, ${safeTimeCol} AS "createdAt"
      FROM ${safeTable}
      WHERE ${safeTimeCol} >= NOW() - INTERVAL '30 days'
      ORDER BY ${safeTimeCol} ASC
    `;

    prices = (await prisma.$queryRawUnsafe(sql)) as PriceRow[];
  } catch {
    // Swallow and render empty chart rather than crashing the entire route
    prices = [];
  }

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
