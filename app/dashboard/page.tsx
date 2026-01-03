import { PrismaClient } from "@prisma/client";
import AlertModal from "@/app/components/AlertModal";
import UpgradeButton from "@/app/components/UpgradeButton";
import BillingButton from "@/app/components/BillingButton";

const prisma = new PrismaClient();

function pctChange(latest: number, prev: number | null) {
  if (prev === null || prev === 0) return null;
  return ((latest - prev) / prev) * 100;
}

function fmtSigned(n: number) {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}`;
}

export default async function DashboardPage() {
  const user = await prisma.user.findFirst({
    select: { stripeStatus: true },
  });

  const pro = user?.stripeStatus === "active";

  const metals = await prisma.metal.findMany({
    orderBy: { name: "asc" },
    include: {
      prices: {
        orderBy: { timestamp: "desc" },
        take: 2, // latest + previous for % change
      },
    },
  });

  const snapshot = metals
    .map((m) => {
      const latest = m.prices?.[0]?.value ?? null;
      const prev = m.prices?.[1]?.value ?? null;
      const change = latest !== null && prev !== null ? pctChange(latest, prev) : null;

      return {
        id: m.id,
        name: m.name,
        symbol: m.symbol,
        latest,
        change,
      };
    })
    .filter((x) => x.latest !== null);

  return (
    <div className="min-h-screen bg-white text-black p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold">Dashboard</h1>

        <div className="flex items-center gap-3">
          {pro ? <BillingButton /> : <UpgradeButton />}
        </div>
      </div>

      {/* Current price + % change header */}
      <div className="border rounded-xl p-5 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">Market snapshot</div>
            <div className="text-lg font-semibold">Current price + % change</div>
          </div>

          <div className="text-xs text-gray-500">
            Change vs previous datapoint
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {snapshot.map((s) => (
            <div key={s.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">
                  {s.name} <span className="text-gray-500">({s.symbol})</span>
                </div>
              </div>

              <div className="mt-2 flex items-baseline justify-between">
                <div className="text-2xl font-semibold">
                  ${Number(s.latest).toFixed(2)}
                </div>

                {s.change === null ? (
                  <div className="text-sm text-gray-400">—</div>
                ) : (
                  <div
                    className={`text-sm font-semibold ${
                      s.change >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {fmtSigned(s.change)}%
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Metal cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metals.map((metal) => {
          const latest = metal.prices?.[0]?.value ?? null;
          const prev = metal.prices?.[1]?.value ?? null;
          const change = latest !== null && prev !== null ? pctChange(latest, prev) : null;

          return (
            <div
              key={metal.id}
              className="border rounded-xl p-6 flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium">{metal.name}</h2>
                <span className="text-sm text-gray-500">{metal.symbol}</span>
              </div>

              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-semibold">
                  {latest === null ? "--" : `$${latest.toFixed(2)}`}
                </div>

                {change === null ? (
                  <div className="text-sm text-gray-400">—</div>
                ) : (
                  <div
                    className={`text-sm font-semibold ${
                      change >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {fmtSigned(change)}%
                  </div>
                )}
              </div>

              <AlertModal metalId={metal.id} disabled={!pro} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
