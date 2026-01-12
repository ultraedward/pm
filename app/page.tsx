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

  const grouped: Record<string, any[]> = {};

  history.forEach((p: any) => {
    if (!p || typeof p !== "object") return;
    if (typeof p.price !== "number") return;
    if (!p.metal) return;

    grouped[p.metal] ??= [];
    grouped[p.metal].push(p);
  });

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

      {Object.entries(grouped).map(([metal, data]) => (
        <div key={metal}>
          <h2 className="text-lg font-semibold capitalize">{metal}</h2>
          <MetalChart metal={metal} data={data} />
        </div>
      ))}
    </div>
  );
}
