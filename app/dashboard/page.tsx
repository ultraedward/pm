import UpgradeButton from "./UpgradeButton";

export default function DashboardPage() {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Dashboard</h1>

      <p>You are on the free plan.</p>

      <UpgradeButton />
    </main>
  );
}
