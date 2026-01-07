import PriceHeader from "./PriceHeader";
import PriceChart from "./PriceChart";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <PriceHeader />

      <PriceChart />

      <div className="rounded-lg border p-4 text-gray-500">
        Alerts module coming next
      </div>
    </div>
  );
}
