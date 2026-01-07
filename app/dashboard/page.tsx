import PriceHeader from "./PriceHeader";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return (
    <div className="p-6">
      <PriceHeader />

      <div className="mt-8 text-gray-500">
        Dashboard content continues here.
      </div>
    </div>
  );
}
