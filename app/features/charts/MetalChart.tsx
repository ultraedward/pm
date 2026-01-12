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
  Legend,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend
);

type Props = {
  data: unknown;
  metal: string;
};

export default function MetalChart({ data, metal }: Props) {
  const safe = Array.isArray(data)
    ? data
        .filter(
          (d: any) =>
            d &&
            typeof d.price === "number" &&
            typeof d.timestamp === "string"
        )
        .map((d: any) => ({
          x: new Date(d.timestamp),
          y: d.price,
        }))
    : [];

  if (safe.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center border rounded text-muted-foreground">
        No data
      </div>
    );
  }

  return (
    <div className="h-64 border rounded p-2">
      <Line
        data={{
          datasets: [
            {
              label: metal,
              data: safe,
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
            y: { beginAtZero: false },
          },
          plugins: {
            legend: { display: false },
          },
        }}
      />
    </div>
  );
}
