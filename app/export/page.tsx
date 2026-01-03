export default function ExportPage() {
  return (
    <div className="min-h-screen bg-white text-black p-8">
      <h1 className="text-3xl font-semibold mb-6">Export Data</h1>

      <div className="space-y-4 max-w-md">
        <a
          href="/api/export/prices"
          className="block px-4 py-3 border rounded-md hover:bg-gray-50"
        >
          Download Prices (CSV) 🔒 Pro
        </a>

        <a
          href="/api/export/alerts"
          className="block px-4 py-3 border rounded-md hover:bg-gray-50"
        >
          Download Alerts (CSV) 🔒 Pro
        </a>
      </div>
    </div>
  );
}
