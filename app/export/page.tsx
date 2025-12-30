export const dynamic = "force-dynamic";

export default function ExportPage() {
  return (
    <main className="p-8 bg-black text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Export Data</h1>

      <div className="space-y-4 max-w-md">
        <a
          href="/api/export/prices"
          className="block border border-gray-800 rounded-lg p-4 bg-gray-900 hover:bg-gray-800"
        >
          Download Prices (CSV)
        </a>

        <a
          href="/api/export/alerts"
          className="block border border-gray-800 rounded-lg p-4 bg-gray-900 hover:bg-gray-800"
        >
          Download Alerts (CSV)
        </a>
      </div>
    </main>
  );
}
