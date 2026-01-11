// app/dashboard/charts/chart-client.tsx
// FULL SHEET — COPY / PASTE ENTIRE FILE

"use client";

import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
  Scatter,
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

type AlertTrigger = {
  metal: string;
  price: number;
  triggeredAt: string | Date;
};

const COLORS: Record<string, string> = {
  gold: "#d4af37",
  silver: "#9ca3af",
  platinum: "#60a5fa",
  palladium: "#f472b6",
};

export default function ChartClient({
  prices,
  alerts,
  alertTriggers,
  range,
}: {
  prices: PricePoint[];
  alerts: Alert[];
  alertTriggers: AlertTrigger[];
  range: "24h" | "7d" | "30d";
}) {
  const metals = Array.from(new Set(prices.map((p) => p.metal)));

  const [activeMetals, setActiveMetals] = useState<string[]>(metals);
  const [normalized, setNormalized] = useState(false);

  /* ---------------- Base prices (for % normalize) ---------------- */
  const basePrices = useMemo(() => {
    const bases: Record<string, number> = {};
    metals.forEach((m) => {
      const first = prices.find((p) => p.metal === m);
      if (first) bases[m] = first.price;
    });
    return bases;
  }, [prices, metals]);

  /* ---------------- Chart data ---------------- */
  const data = useMemo(() => {
    const grouped: Record<number, any> = {};

    prices.forEach((p) => {
      const t = new Date(p.createdAt).getTime();
      grouped[t] ??= { t };

      grouped[t][p.metal] = normalized
        ? ((p.price - basePrices[p.metal]) / basePrices[p.metal]) * 100
        : p.price;
    });

    return Object.values(grouped).sort((a, b) => a.t - b.t);
  }, [prices, normalized, basePrices]);

  /* ---------------- Alert trigger points ---------------- */
  const triggerPoints = useMemo(() => {
    if (normalized) return [];

    return alertTriggers
      .filter((t) => activeMetals.includes(t.metal))
      .map((t) => ({
        t: new Date(t.triggeredAt).getTime(),
        price: t.price,
        metal: t.metal,
      }));
  }, [alertTriggers, activeMetals, normalized]);

  /* ---------------- Legend stats ---------------- */
  const latestStats = useMemo(() => {
    const stats: Record<string, { last: number; pct: number }> = {};

    metals.forEach((m) => {
      const mPrices = prices.filter((p) => p.metal === m);
      if (mPrices.length < 2) return;

      const first = mPrices[0].price;
      const last = mPrices.at(-1)!.price;

      stats[m] = {
        last,
        pct: ((last - first) / first) * 100,
      };
    });

    return stats;
  }, [prices, metals]);

  const tickFormatter = (ts: number) => {
    const d = new Date(ts);
    if (range === "24h")
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return d.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* CONTROLS */}
      <div className="flex flex-wrap items-center gap-4">
        {metals.map((m) => (
          <label key={m} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={activeMetals.includes(m)}
              onChange={() =>
                setActiveMetals((prev) =>
                  prev.includes(m)
                    ? prev.filter((x) => x !== m)
                    : [...prev, m]
                )
              }
            />
            <span className="capitalize">{m}</span>
          </label>
        ))}

        <label className="flex items-center gap-2 text-sm ml-auto">
          <input
            type="checkbox"
            checked={normalized}
            onChange={() => setNormalized((v) => !v)}
          />
          Normalize (% change)
        </label>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        {activeMetals.map((m) => {
          const stat = latestStats[m];
          if (!stat) return null;

          return (
            <div key={m} className="rounded border p-3">
              <div className="capitalize font-medium">{m}</div>
              <div>${stat.last.toFixed(2)}</div>
              <div
                className={
                  stat.pct >= 0 ? "text-green-600" : "text-red-600"
                }
              >
                {stat.pct >= 0 ? "+" : ""}
                {stat.pct.toFixed(2)}%
              </div>
            </div>
          );
        })}
      </div>

      {/* CHART */}
      <div className="h-[440px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis
              dataKey="t"
              type="number"
              domain={["dataMin", "dataMax"]}
              tickFormatter={tickFormatter}
              minTickGap={24}
            />
            <YAxis
              tickFormatter={(v) =>
                normalized ? `${v.toFixed(1)}%` : `$${v}`
              }
            />
            <Tooltip
              labelFormatter={(v) =>
                new Date(Number(v)).toLocaleString()
              }
              formatter={(v: number) =>
                normalized ? `${v.toFixed(2)}%` : `$${v.toFixed(2)}`
              }
            />
            <Legend />

            {/* PRICE LINES */}
            {activeMetals.map((m) => (
              <Line
                key={m}
                type="monotone"
                dataKey={m}
                stroke={COLORS[m] || "#000"}
                strokeWidth={2}
                dot={false}
              />
            ))}

            {/* ALERT THRESHOLDS */}
            {!normalized &&
              alerts
                .filter((a) => activeMetals.includes(a.metal))
                .map((a, i) => (
                  <ReferenceLine
                    key={`ref-${i}`}
                    y={a.target}
                    strokeDasharray="4 4"
                    stroke={COLORS[a.metal] || "#000"}
                    label={{
                      value: `${a.metal} ${a.direction} $${a.target}`,
                      fontSize: 10,
                    }}
                  />
                ))}

            {/* ALERT TRIGGER DOTS */}
            {!normalized &&
              activeMetals.map((m) => (
                <Scatter
                  key={`scatter-${m}`}
                  data={triggerPoints.filter((t) => t.metal === m)}
                  fill={COLORS[m] || "#000"}
                />
              ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
