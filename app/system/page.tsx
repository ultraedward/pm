// app/system/page.tsx

export const dynamic = "force-dynamic"

export default function SystemPage() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">System Status</h1>

      <div className="rounded-xl border p-6 bg-white space-y-2">
        <p className="text-sm text-gray-600">
          System status is temporarily unavailable.
        </p>
        <p className="text-xs text-gray-400">
          Cron and background services are disabled in build-safe mode.
        </p>
      </div>
    </div>
  )
}
