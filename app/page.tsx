import MetalChart from "@/app/features/charts/MetalChart";

async function fetchHistory() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/prices/history?hours=24`,
      { cache: "no-store" }
    );
    const json = await res.json();
    return Array.isArray(json) ? json : [];
  } catch {
    return [];
  }
}

async function fetchCurrent() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/prices/current`,
      { cache: "no-store" }
    );
    return await res.json();
  } catch {
    return {};
  }
}

export default async function DashboardPage() {
  const [current, history] = await Promise.all([
    fetchCurrent(),
    fetchHistory(),
  ]);

  const metals = Array.from(
    new Set(
      history
        .filter((p: any) => p && typeof p.metal === "string")
        .map((p: any) => p.metal)
    )
  );

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold">Precious Metals</h1>
        <p className="text-sm text-muted-foreground">
          Source: {current?.source ?? "mock"} • Last updated:{" "}
          {current?.updatedAt
            ? new Date(current.updatedAt).toLocaleString()
            : "N/A"}
        </p>
      </div>

      {metals.map((metal) => (
        <div key={metal}>
          <h2 className="text-lg font-semibold capitalize">{metal}</h2>
          <MetalChart metal={metal} data={[]} />
        </div>
      ))}
    </div>
  );
}
