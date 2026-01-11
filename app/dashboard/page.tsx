// app/dashboard/page.tsx
// FULL SHEET — COPY / PASTE ENTIRE FILE

import CurrentPrices from "./components/CurrentPrices";

export const metadata = {
  title: "Dashboard | Precious Metals Tracker",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Live precious metal prices and alerts
        </p>
      </div>

      {/* Current Prices */}
      <section>
        <h2 className="text-lg font-medium mb-3">
          Current Metal Prices
        </h2>
        <CurrentPrices />
      </section>
    </div>
  );
}
