import { Suspense } from "react"
import ChartsClient from "./ChartsClient"

export const dynamic = "force-dynamic"

export default function ChartsPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading charts…</div>}>
      <ChartsClient />
    </Suspense>
  )
}
