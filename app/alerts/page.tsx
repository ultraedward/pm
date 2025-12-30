// app/alerts/page.tsx

export const dynamic = "force-dynamic"

export default function AlertsPage() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">Alerts</h1>

      <div className="rounded-xl border p-6 bg-white">
        <p className="text-sm text-gray-600">
          Alerts are temporarily disabled in this build.
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Schema-backed alerts will be re-enabled once the Alert model is added.
        </p>
      </div>
    </div>
  )
}
