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
  direction: string;
  target: number;
};

export default function ChartClient({
  prices,
  alerts,
  range,
}: {
  prices: PricePoint[];
  alerts: Alert[];
  range: "24h" | "7d" | "30d";
}) {
  const metals = Array.from(new Set(prices.map((p) => p.metal)));

  const tickFormatter = (ts: number) => {
    const d = new Date(ts);
    if (range === "24h")
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return d.toLocaleDateString();
  };

  return (
    <div className="space-y-12">
      {metals.map((metal) => {
        const data = prices
          .filter((p) => p.metal === metal)
          .map((p) => ({
            t: new Date(p.createdAt).getTime(),
            price: p.price,
          }));

        const metalAlerts = alerts.filter((a) => a.metal === metal);

        return (
          <div key={metal} className="h-80">
            <h2 className="mb-2 text-lg font-medium capitalize">{metal}</h2>

            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis
                  dataKey="t"
                  type="number"
                  domain={["dataMin", "dataMax"]}
                  tickFormatter={tickFormatter}
                  minTickGap={24}
                />
                <YAxis domain={["auto", "auto"]} />
                <Tooltip
                  labelFormatter={(value) =>
                    new Date(Number(value)).toLocaleString()
                  }
                />
                <Legend />

                <Line type="monotone" dataKey="price" strokeWidth={2} dot={false} />

                {metalAlerts.map((a, i) => (
                  <ReferenceLine
                    key={i}
                    y={a.target}
                    strokeDasharray="4 4"
                    label={{
                      value: `${a.direction} $${a.target}`,
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
