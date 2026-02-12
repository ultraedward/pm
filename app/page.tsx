import { prisma } from "@/lib/prisma";

type PricePoint = {
  price: number;
  timestamp: Date;
};

async function getMetalData(metal: "gold" | "silver") {
  const prices: PricePoint[] = await prisma.price.findMany({
    where: { metal },
    orderBy: { timestamp: "asc" },
    take: 48, // last ~48 entries (depends on cron frequency)
  });

  if (!prices.length) {
    return {
      current: 0,
      changePercent: 0,
      history: [],
    };
  }

  const current = prices[prices.length - 1].price;
  const past = prices[0].price;

  const changePercent = ((current - past) / past) * 100;

  return {
    current,
    changePercent,
    history: prices.map((p) => p.price),
  };
}

function Sparkline({ data }: { data: number[] }) {
  if (!data.length) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((value, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 100 100" className="w-full h-16">
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        points={points}
      />
    </svg>
  );
}

function MetalCard({
  name,
  current,
  changePercent,
  history,
}: {
  name: string;
  current: number;
  changePercent: number;
  history: number[];
}) {
  const isUp = changePercent >= 0;

  return (
    <div className="panel p-6 space-y-4 hover:scale-[1.02] transition-transform">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold capitalize">{name}</h2>

        <span
          className={`text-sm font-medium ${
            isUp ? "text-green-400" : "text-red-400"
          }`}
        >
          {isUp ? "▲" : "▼"} {changePercent.toFixed(2)}%
        </span>
      </div>

      <div className="text-4xl font-bold tracking-tight">
        ${current.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </div>

      <div
        className={`${
          isUp ? "text-green-400" : "text-red-400"
        }`}
      >
        <Sparkline data={history} />
      </div>
    </div>
  );
}

export default async function HomePage() {
  const gold = await getMetalData("gold");
  const silver = await getMetalData("silver");

  return (
    <div className="mx-auto max-w-5xl p-8 space-y-10">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          Precious Metals
        </h1>
        <p className="text-gray-400">
          Real-time gold and silver tracking.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <MetalCard
          name="gold"
          current={gold.current}
          changePercent={gold.changePercent}
          history={gold.history}
        />

        <MetalCard
          name="silver"
          current={silver.current}
          changePercent={silver.changePercent}
          history={silver.history}
        />
      </div>
    </div>
  );
}