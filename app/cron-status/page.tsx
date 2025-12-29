export const dynamic = "force-dynamic"

async function getStatus() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/cron-status`,
    { cache: "no-store" }
  )
  return res.json()
}

export default async function Page() {
  const data = await getStatus()

  return (
    <main style={{ padding: 32, fontFamily: "system-ui", maxWidth: 640 }}>
      <h1>Cron Status</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  )
}
