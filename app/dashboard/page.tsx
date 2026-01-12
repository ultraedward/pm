import dynamic from "next/dynamic";

const DashboardClient = dynamic(
  () => import("@/app/features/dashboard/DashboardClient"),
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
    <DashboardClient
      current={current}
      grouped={grouped}
      hours={safeHours}
    />
  );
}
