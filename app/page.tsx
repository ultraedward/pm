import MetalChart from "@/app/features/charts/MetalChart";

async function fetchHistory() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/prices/history?hours=24`,
    { cache: "no-store" }
  );
  return res.json();
}

async function fetchCurrent() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/prices/current`,
    { cache: "no-store" }
  );
  return res.json();
}

export default async function DashboardPage() {
  const [current, history] = await Promise.all([
    fetchCurrent(),
    fetchHistory(),
  ]);

  const grouped: Record<string, any[]> = {};
  history.data.forEach((p: any) => {
    grouped[p.metal] ??= [];
    grouped[p.metal].push({
      timestamp: new Date(p.timestamp).toLocaleTimeString(),
      price: p.price,
    });
  });

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold">Precious Metals</h1>
        <p className="text-sm text-muted-foreground">
          Source: {current.source} • Last updated:{" "}
          {current.updatedAt
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
