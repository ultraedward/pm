import AlertList from "./AlertList";

export default function AlertsPage() {
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Your Alerts</h1>
      <AlertList />
    </main>
  );
}