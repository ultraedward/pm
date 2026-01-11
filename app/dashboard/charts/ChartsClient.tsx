// app/dashboard/charts/ChartsClient.tsx
"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

type RangeKey = "24h" | "7d" | "30d"

export default function ChartsClient() {
  const params = useSearchParams()
  const range = (params.get("range") as RangeKey) || "24h"

  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/dashboard?range=${range}`)
      .then(r => r.json())
      .then(d => setData(d))
      .finally(() => setLoading(false))
  }, [range])

  if (loading) return <div className="p-6 text-sm text-gray-500">Fetching data…</div>

  return (
    <div className="p-6">
      <pre className="text-xs bg-gray-100 p-4 rounded">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}
