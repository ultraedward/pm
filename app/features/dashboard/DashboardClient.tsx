"use client";

import MetalChart from "@/app/features/charts/MetalChart";
import TimeRangeSelector from "@/app/features/dashboard/TimeRangeSelector";

export default function DashboardClient({
  current,
  grouped,
  hours,
}: {
  current: any;
  grouped: Record<string, any[]>;
  hours: number;
}) {
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
          value={hours as any}
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
