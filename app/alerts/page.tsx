import AlertHistory from "@/app/components/AlertHistory";

export default function AlertsPage() {
  return (
    <div className="min-h-screen bg-white text-black p-8">
      <h1 className="text-3xl font-semibold mb-6">Alert History</h1>
      <AlertHistory />
    </div>
  );
}
