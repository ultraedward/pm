export default function ChartsLoading() {
  return (
    <main className="min-h-screen bg-black p-8 text-white">
      <div className="mx-auto max-w-5xl space-y-8 animate-pulse">
        {/* Header */}
        <div className="h-8 w-40 rounded-lg bg-white/5" />

        {/* Range selector */}
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-8 w-16 rounded-full bg-white/5" />
          ))}
        </div>

        {/* Metal toggles */}
        <div className="flex flex-wrap gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-8 w-24 rounded-full bg-white/5" />
          ))}
        </div>

        {/* Chart area */}
        <div className="rounded-xl border border-white/5 bg-gray-950 p-6">
          <div className="h-72 w-full rounded bg-white/5" />
        </div>
      </div>
    </main>
  );
}
