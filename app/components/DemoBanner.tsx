// app/components/DemoBanner.tsx

"use client"

export default function DemoBanner() {
  return (
    <div className="w-full bg-yellow-100 border-b border-yellow-200">
      <div className="max-w-7xl mx-auto px-6 py-2 text-sm text-yellow-900 flex items-center justify-between">
        <span>
          <strong>Demo Mode</strong> — UI-only data. Login: <b>demo@local</b> / <b>demo</b>
        </span>
        <span className="text-xs opacity-80">
          No real data • No emails • No backend
        </span>
      </div>
    </div>
  )
}
