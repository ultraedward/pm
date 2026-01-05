// app/dashboard/charts/chart-client.tsx

"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";

type PricePoint = {
  metal: string;
  price: number;
  createdAt: string | Date;
};

type Alert = {
  metal: string;
  threshold: number;
  direction: string;
  active: boolean;
};

export default function ChartClient({
  prices,
  alerts,
}: {
  prices: PricePoint[];
  alerts: Alert[];
}) {
  const metals = Array.from(new Set(prices.map((p) => p.metal)));

  return (
    <div className="space-y-12">
      {metals.map((metal) => {
        const data = prices
          .filter((p) => p.metal === metal)
          .map((p) => ({
            date: new Date(p.createdAt).toLocaleDateString(),
            price: p.price,
          }));

        const metalAlerts = alerts.filter(
          (a) => a.metal === metal && a.active
        );

        return (
          <div key={metal} className="h-80">
            <h2 className="mb-2 text-lg font-medium capitalize">{metal}</h2>

            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis dataKey="date" />
                <YAxis domain={["auto", "auto"]} />
                <Tooltip />
                <Legend />

                <Line
                  type="monotone"
                  dataKey="price"
                  strokeWidth={2}
                  dot={false}
                />

                {metalAlerts.map((a, i) => (
                  <ReferenceLine
                    key={i}
                    y={a.threshold}
                    strokeDasharray="4 4"
                    label={{
                      value: `${a.direction} $${a.threshold}`,
                      position: "right",
                      fontSize: 10,
                    }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      })}
    </div>
  );
}
