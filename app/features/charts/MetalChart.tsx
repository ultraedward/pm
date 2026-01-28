"use client";

import dynamic from "next/dynamic";

export type Point = {
  x: number | string;
  y: number;
};

const Line = dynamic(
  () => import("react-chartjs-2").then((m) => m.Line),
  { ssr: false }
);

type Props = {
  metal: string;
  data: Point[];
};

export default function MetalChart({ metal, data }: Props) {
  if (!data?.length) {
    return (
      <div className="text-sm text-gray-500">
        No data available for {metal}
      </div>
    );
  }

  return (
    <Line
      data={{
        labels: data.map((p) => p.x),
        datasets: [
          {
            label: metal.toUpperCase(),
            data: data.map((p) => p.y),
            borderWidth: 2,
            tension: 0.3,
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: { display: true },
          y: { display: true },
        },
      }}
    />
  );
}