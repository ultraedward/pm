"use client";

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend
);

type Point = {
  timestamp?: string;
  t?: number;
  price?: number;
};

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
            typeof d === "object" &&
            typeof d.price === "number" &&
            (typeof d.timestamp === "string" || typeof d.t === "number")
        )
        .map((d: any) => ({
          x: d.t ?? new Date(d.timestamp).getTime(),
          y: d.price,
        }))
    : [];

  if (safe.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground border rounded">
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
              tension: 0.3,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          parsing: false,
          scales: {
            x: {
              type: "time",
              display: false,
            },
            y: {
              beginAtZero: false,
            },
          },
          plugins: {
            legend: { display: false },
          },
        }}
      />
    </div>
  );
}
