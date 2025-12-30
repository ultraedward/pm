// app/history/page.tsx

export const dynamic = "force-dynamic"

export default function HistoryPage() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">History</h1>

      <div className="rounded-xl border p-6 bg-white">
        <p className="text-sm text-gray-600">
          Price history is temporarily disabled.
        </p>
        <p className="text-xs text-gray-400 mt-2">
          This page will be re-enabled once the Price / PriceHistory models are
          added to the Prisma schema.
        </p>
      </div>
    </div>
  )
}
