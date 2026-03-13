export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-black p-8 text-white">
      <div className="mx-auto max-w-5xl space-y-8 animate-pulse">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-8 w-36 rounded-lg bg-white/5" />
            <div className="h-4 w-52 rounded bg-white/5" />
          </div>
          <div className="h-9 w-36 rounded-lg bg-white/5" />
        </div>

        {/* Spot price tiles */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-xl border border-white/5 bg-gray-950 p-4 space-y-2">
              <div className="h-3 w-16 rounded bg-white/5" />
              <div className="h-6 w-24 rounded bg-white/5" />
            </div>
          ))}
        </div>

        {/* Portfolio card */}
        <div className="rounded-xl border border-white/5 bg-gray-950 p-6 space-y-2">
          <div className="h-4 w-32 rounded bg-white/5" />
          <div className="h-9 w-48 rounded bg-white/5" />
          <div className="h-4 w-40 rounded bg-white/5" />
        </div>

        {/* Chart */}
        <div className="rounded-xl border border-white/5 bg-gray-950 p-6">
          <div className="h-20 w-full rounded bg-white/5" />
        </div>

        {/* Calculator */}
        <div className="rounded-xl border border-white/5 bg-gray-950 p-6 space-y-4">
          <div className="h-4 w-40 rounded bg-white/5" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 rounded bg-white/5" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
