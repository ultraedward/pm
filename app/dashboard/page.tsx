import PriceHeader from "./PriceHeader";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Live spot prices */}
      <PriceHeader />

      {/* Placeholder sections (safe, no Prisma calls) */}
      <div className="rounded-lg border p-4 text-gray-500">
        Alerts module coming next
      </div>

      <div className="rounded-lg border p-4 text-gray-500">
        Charts module coming next
      </div>
    </div>
  );
}
