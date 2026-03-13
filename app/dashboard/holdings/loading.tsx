export default function HoldingsLoading() {
  return (
    <main className="min-h-screen bg-black p-10 text-white">
      <div className="mx-auto max-w-5xl space-y-8 animate-pulse">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="h-8 w-44 rounded-lg bg-white/5" />
          <div className="h-9 w-32 rounded-lg bg-white/5" />
        </div>

        {/* Chart card */}
        <div className="rounded-xl border border-white/5 bg-gray-950 p-6 space-y-4">
          <div className="h-4 w-40 rounded bg-white/5" />
          <div className="h-36 w-full rounded bg-white/5" />
        </div>

        {/* Allocation card */}
        <div className="rounded-xl border border-white/5 bg-gray-950 p-6 space-y-4">
          <div className="h-4 w-44 rounded bg-white/5" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between">
                <div className="h-3 w-16 rounded bg-white/5" />
                <div className="h-3 w-10 rounded bg-white/5" />
              </div>
              <div className="h-3 w-full rounded-full bg-white/5" />
            </div>
          ))}
        </div>

        {/* Holding cards */}
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-xl border border-white/5 bg-gray-950 p-6">
            <div className="flex justify-between">
              <div className="space-y-2">
                <div className="h-5 w-20 rounded bg-white/5" />
                <div className="h-3 w-32 rounded bg-white/5" />
                <div className="h-3 w-24 rounded bg-white/5" />
              </div>
              <div className="space-y-2 text-right">
                <div className="h-5 w-24 rounded bg-white/5" />
                <div className="h-3 w-20 rounded bg-white/5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
