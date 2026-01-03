"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Scatter,
} from "recharts";
import { useEffect, useMemo, useRef, useState } from "react";
import * as htmlToImage from "html-to-image";

type PricePoint = {
  timestamp: string;
  value: number;
};

type MetalSeries = {
  metal: string;
  symbol: string;
  data: PricePoint[];
};

type Alert = {
  id: string;
  metal: { symbol: string };
  targetPrice: number;
  direction: string;
  triggered: boolean;
  triggeredAt: string | null;
};

export default function MetalChart() {
  const chartRef = useRef<HTMLDivElement>(null);

  const [series, setSeries] = useState<MetalSeries[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [mode, setMode] = useState<"price" | "percent">("price");
  const [range, setRange] = useState<"24h" | "7d" | "30d">("30d");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [p, a] = await Promise.all([
        fetch(`/api/dashboard?range=${range}`).then((r) => r.json()),
        fetch("/api/alerts/history").then((r) => r.json()),
      ]);

      const s: MetalSeries[] = p.series ?? [];
      setSeries(s);
      setAlerts(a.alerts ?? []);

      const init: Record<string, boolean> = {};
      s.forEach((m) => (init[m.symbol] = true));
      setSelected(init);
      setLoading(false);
    };

    setLoading(true);
    load();
  }, [range]);

  const combinedData = useMemo(() => {
    const byTs: Record<string, any> = {};

    series.forEach((m) => {
      if (!selected[m.symbol]) return;
      const base = m.data[0]?.value ?? 1;

      m.data.forEach((p) => {
        byTs[p.timestamp] ??= { timestamp: p.timestamp };
        byTs[p.timestamp][m.symbol] =
          mode === "price"
            ? p.value
            : ((p.value - base) / base) * 100;
      });
    });

    return Object.values(byTs).sort(
      (a: any, b: any) =>
        new Date(a.timestamp).getTime() -
        new Date(b.timestamp).getTime()
    );
  }, [series, selected, mode]);

  const triggerDots = useMemo(() => {
    if (mode !== "price") return [];
    return alerts
      .filter((a) => a.triggered && a.triggeredAt)
      .map((a) => ({
        timestamp: a.triggeredAt!,
        [a.metal.symbol]: a.targetPrice,
      }));
  }, [alerts, mode]);

  const exportPNG = async () => {
    if (!chartRef.current) return;
    const dataUrl = await htmlToImage.toPng(chartRef.current, {
      pixelRatio: 2,
      backgroundColor: "#ffffff",
    });

    const link = document.createElement("a");
    link.download = `metals-${range}-${mode}.png`;
    link.href = dataUrl;
    link.click();
  };

  if (loading) return <div className="text-gray-500">Loading charts…</div>;

  const colors = ["#111827", "#2563eb", "#16a34a", "#dc2626", "#9333ea"];

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-4">
          {series.map((m) => (
            <label key={m.symbol} className="text-sm flex gap-1 items-center">
              <input
                type="checkbox"
                checked={!!selected[m.symbol]}
                onChange={(e) =>
                  setSelected((s) => ({
                    ...s,
                    [m.symbol]: e.target.checked,
                  }))
                }
              />
              {m.symbol}
            </label>
          ))}
        </div>

        <div className="flex gap-2 text-sm">
          {(["24h", "7d", "30d"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 border rounded ${
                range === r ? "bg-black text-white" : ""
              }`}
            >
              {r}
            </button>
          ))}

          <button
            onClick={() => setMode("price")}
            className={`px-3 py-1 border rounded ${
              mode === "price" ? "bg-black text-white" : ""
            }`}
          >
            Price
          </button>
          <button
            onClick={() => setMode("percent")}
            className={`px-3 py-1 border rounded ${
              mode === "percent" ? "bg-black text-white" : ""
            }`}
          >
            % Change
          </button>

          <button
            onClick={exportPNG}
            className="px-3 py-1 border rounded hover:bg-gray-50"
          >
            Export PNG
          </button>
        </div>
      </div>

      {/* Chart */}
      <div ref={chartRef} className="h-96 border rounded-xl p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={combinedData}>
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />

            {series.map((m, i) =>
              selected[m.symbol] ? (
                <Line
                  key={m.symbol}
                  dataKey={m.symbol}
                  stroke={colors[i % colors.length]}
                  dot={false}
                />
              ) : null
            )}

            {mode === "price" &&
              alerts
                .filter((a) => selected[a.metal.symbol])
                .map((a) => (
                  <ReferenceLine
                    key={a.id}
                    y={a.targetPrice}
                    stroke={a.triggered ? "#16a34a" : "#dc2626"}
                    strokeDasharray="4 4"
                  />
                ))}

            {mode === "price" &&
              series.map((m) =>
                selected[m.symbol] ? (
                  <Scatter
                    key={m.symbol}
                    data={triggerDots}
                    fill="#16a34a"
                  />
                ) : null
              )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
