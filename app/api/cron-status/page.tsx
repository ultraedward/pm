export const dynamic = "force-dynamic"

export default async function Page() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/cron-status`, { cache: "no-store" })
  const data = await res.json()

  return (
    <main style={{ padding: 32, fontFamily: "system-ui" }}>
      <h1>Cron Status</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  )
}
