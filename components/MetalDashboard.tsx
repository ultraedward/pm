"use client";

type MetalData = {
  price: number;
  percentChange?: number | null;
  change24h?: number;
};

type Props = {
  gold: MetalData;
  silver: MetalData;
  isPro?: boolean;
};

function PriceDelta({ pct }: { pct: number | null | undefined }) {
  if (pct == null) return null;
  const isPositive = pct >= 0;
  return (
    <span
      className={`text-sm font-medium ${
        isPositive ? "text-green-400" : "text-red-400"
      }`}
    >
      {isPositive ? "▲" : "▼"} {Math.abs(pct).toFixed(2)}%
    </span>
  );
}

function MetalCard({
  label,
  data,
}: {
  label: string;
  data: MetalData;
}) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-950 p-6 space-y-2">
      <div className="text-sm text-gray-400 font-medium uppercase tracking-wider">
        {label}
      </div>
      <div className="text-3xl font-bold">
        ${data.price.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </div>
      <PriceDelta pct={data.percentChange ?? data.change24h} />
    </div>
  );
}

export default function MetalDashboard({ gold, silver, isPro }: Props) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <MetalCard label="Gold" data={gold} />
      <MetalCard label="Silver" data={silver} />
    </div>
  );
}
