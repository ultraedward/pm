// app/page.tsx

export const dynamic = "force-dynamic"

export default function HomePage() {
  return (
    <main className="p-10 space-y-6">
      <h1 className="text-4xl font-bold">Precious Metals Tracker</h1>

      <div className="rounded-xl border p-6 bg-white">
        <p className="text-sm text-gray-600">
          Live metal data is temporarily disabled.
        </p>
        <p className="text-xs text-gray-400 mt-2">
          This homepage will be re-enabled once the Metal / Price models exist
          in the Prisma schema.
        </p>
      </div>
    </main>
  )
}
