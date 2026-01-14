"use client"

export default function PaywallModal({
  onClose,
}: {
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-full max-w-md rounded-lg bg-neutral-900 p-6 space-y-4">
        <h2 className="text-xl font-semibold">
          Export CSV
        </h2>

        <p className="text-sm text-gray-400">
          CSV export is available on the Pro plan.
          Download historical prices, percent changes,
          and alert hits for deeper analysis.
        </p>

        <ul className="text-sm text-gray-300 list-disc pl-5 space-y-1">
          <li>Unlimited CSV exports</li>
          <li>All time ranges (24h / 7d / 30d)</li>
          <li>Alert hit tracking</li>
          <li>Priority data refresh</li>
        </ul>

        <div className="flex gap-3 pt-4">
          <button
            className="flex-1 rounded bg-white text-black py-2 text-sm font-medium hover:bg-gray-200"
            onClick={() => {
              alert("Stripe checkout comes next 🙂")
            }}
          >
            Upgrade – $9/month
          </button>

          <button
            className="flex-1 rounded border border-gray-600 py-2 text-sm hover:bg-gray-800"
            onClick={onClose}
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}
