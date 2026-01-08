// app/dashboard/page.tsx
"use client"

import { useSession } from "next-auth/react"

export default function DashboardPage() {
  const { data: session, status } = useSession()

  if (status === "loading") return <pre>Loading…</pre>

  return (
    <pre style={{ whiteSpace: "pre-wrap", color: "white" }}>
      {JSON.stringify(session, null, 2)}
    </pre>
  )
}
