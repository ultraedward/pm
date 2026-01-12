import dynamic from "next/dynamic";

const MetalChart = dynamic(
  () => import("@/app/features/charts/MetalChart"),
  { ssr: false }
);

const TimeRangeSelector = dynamic(
  () => import("@/app/features/dashboard/TimeRangeSelector"),
  { ssr: false }
);

async function fetchHistory(hours: number) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/prices/history?hours=${hours}`,
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

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { hours?: string };
}) {
  const hours = Number(searchParams.hours ?? 24);
  const safeHours = hours === 168 || hours === 720 ? hours : 24;

  const [current, history] = await Promise.all([
    fetchCurrent(),
    fetchHistory(safeHours),
  ]);

  const grouped: Record<string, any[]> = {};
  history.forEach((p: any) => {
    if (!p || typeof p.price !== "number" || !p.metal) return;
    grouped[p.metal] ??= [];
    grouped[p.metal].push(p);
  });

  return (
    <main className="p-6 space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Source: {current?.source ?? "mock"} • Updated:{" "}
          {current?.updatedAt
            ? new Date(current.updatedAt).toLocaleString()
            : "N/A"}
        </p>

        <TimeRangeSelector
          value={safeHours as any}
          onChange={(v) => {
            const url = new URL(window.location.href);
            url.searchParams.set("hours", String(v));
            window.location.href = url.toString();
          }}
        />
      </header>

      {Object.entries(grouped).map(([metal, data]) => (
        <section key={metal} className="space-y-2">
          <h2 className="text-lg font-semibold capitalize">{metal}</h2>
          <MetalChart metal={metal} data={data} />
        </section>
      ))}
    </main>
  );
}
