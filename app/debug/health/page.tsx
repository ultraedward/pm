export const dynamic = "force-dynamic";

async function fetchHealth(path: string) {
  try {
    const res = await fetch(path, { cache: "no-store" });
    return await res.json();
  } catch {
    return { ok: false };
  }
}

export default async function HealthDebugPage() {
  const basic = await fetchHealth("/api/health");
  const deep = await fetchHealth("/api/health/deep");

  return (
    <div style={{ padding: 24 }}>
      <h1>System Health</h1>

      <pre>{JSON.stringify(basic, null, 2)}</pre>
      <pre>{JSON.stringify(deep, null, 2)}</pre>
    </div>
  );
}