"use client";

import MetalChart, { Point } from "@/app/features/charts/MetalChart";

type Props = {
  charts: Record<string, Point[]>;
};

export default function DashboardClient({ charts }: Props) {
  return (
    <main className="space-y-6">
      {Object.entries(charts).map(([metal, data]) => (
        <section key={metal} className="space-y-2">
          <h2 className="text-lg font-semibold capitalize">{metal}</h2>
          <MetalChart metal={metal} data={data} />
        </section>
      ))}
    </main>
  );
}