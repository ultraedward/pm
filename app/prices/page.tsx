import { getRecentPrices } from "@/lib/prices/getRecentPrices";
import { PriceList } from "@/components/PriceList";

export default async function PricesPage() {
  const prices = await getRecentPrices();

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Prices</h1>
        <p className="text-sm text-gray-400">
          Recent precious metals prices.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <PriceList title="Gold" prices={prices.gold} />
        <PriceList title="Silver" prices={prices.silver} />
      </div>
    </div>
  );
}