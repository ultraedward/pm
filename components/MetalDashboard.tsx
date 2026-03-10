"use client";

type MetalData = {
  price: number;
  change24h?: number;
};

type Props = {
  gold: MetalData;
  silver: MetalData;
  isPro?: boolean;
};

export default function MetalDashboard({ gold, silver, isPro }: Props) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="p-6 rounded-xl border">
        <div className="text-sm text-gray-500">Gold</div>
        <div className="text-3xl font-bold">${gold.price.toFixed(2)}</div>
      </div>

      <div className="p-6 rounded-xl border">
        <div className="text-sm text-gray-500">Silver</div>
        <div className="text-3xl font-bold">${silver.price.toFixed(2)}</div>
      </div>
    </div>
  );
}