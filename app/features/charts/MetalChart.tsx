"use client";

import dynamic from "next/dynamic";

const Line = dynamic(
  () => import("react-chartjs-2").then((m) => m.Line),
  { ssr: false }
);

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip
);

export default function MetalChart({
  data,
  metal,
}: {
  data: any[];
  metal: string;
}) {
  if (!Array.isArray(data) || data.length < 2) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground border rounded">
        Waiting for data…
      </div>
    );
  }

  const points = data.map((p) => ({
    x: new Date(p.timestamp),
    y: p.price,
  }));

  return (
    <div className="h-64 border rounded p-2">
      <Line
        data={{
          datasets: [
            {
              label: metal,
              data: points,
              borderWidth: 2,
              pointRadius: 0,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          parsing: false,
          scales: {
            x: { type: "time", display: false },
          },
          plugins: { legend: { display: false } },
        }}
      />
    </div>
  );
}
