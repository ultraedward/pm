"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Metal = "gold" | "silver" | "platinum" | "palladium";
type Range = "7d" | "30d" | "90d";
type Point = { t: number; price: number };

const METAL_COLOR: Record<Metal, string> = {
  gold:      "#D4AF37",
  silver:    "#C0C0C0",
  platinum:  "#E5E4E2",
  palladium: "#9FA8C7",
};

const RANGES: { key: Range; label: string }[] = [
  { key: "7d",  label: "7D"  },
  { key: "30d", label: "30D" },
  { key: "90d", label: "90D" },
];

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
}

function fmtDate(ts: number) {
  const d = new Date(ts);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl border px-3 py-2 text-sm shadow-xl"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      <p className="text-gray-500 text-xs mb-1">
        {new Date(label).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </p>
      <p className="font-black tabular-nums text-white">
        {fmt(payload[0].value)}
        <span className="text-gray-500 font-normal"> /ozt</span>
      </p>
    </div>
  );
}

interface Props {
  metal: Metal;
}

export function MetalPriceChart({ metal }: Props) {
  const color = METAL_COLOR[metal];
  const gradId = `${metal}-grad`;

  const [range, setRange] = useState<Range>("30d");
  const [data, setData] = useState<Point[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/charts/prices?range=${range}`)
      .then((r) => r.json())
      .then((json) => {
        setData(json[metal] ?? []);
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [range, metal]);

  const prices = data.map((d) => d.price);
  const high   = prices.length ? Math.max(...prices) : null;
  const low    = prices.length ? Math.min(...prices) : null;
  const first  = prices[0] ?? null;
  const last   = prices[prices.length - 1] ?? null;
  const change = first && last ? last - first : null;
  const pct    = first && change != null ? (change / first) * 100 : null;
  const up     = change != null && change >= 0;

  return (
    <div className="space-y-4">
      {/* Range tabs */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-600 uppercase tracking-widest font-bold">Price history</p>
        <div className="flex gap-1">
          {RANGES.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setRange(key)}
              className="px-3 py-1 rounded-lg text-xs font-bold transition-colors"
              style={{
                background: range === key ? "rgba(212,175,55,0.15)" : "transparent",
                color:      range === key ? "var(--gold-bright)" : "var(--text-dim)",
                border:     `1px solid ${range === key ? "rgba(212,175,55,0.3)" : "transparent"}`,
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ borderColor: "var(--border)", background: "rgba(0,0,0,0.2)", height: 200 }}
      >
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <span className="text-xs text-gray-700">Loading…</span>
          </div>
        ) : data.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <span className="text-xs text-gray-700">No data yet</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 8 }}>
              <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={color} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={color} stopOpacity={0}   />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="t"
                type="number"
                scale="time"
                domain={["dataMin", "dataMax"]}
                tickFormatter={fmtDate}
                tick={{ fontSize: 10, fill: "#4b5563" }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
                minTickGap={40}
              />
              <YAxis
                domain={["auto", "auto"]}
                tickFormatter={(v) => `$${v.toFixed(0)}`}
                tick={{ fontSize: 10, fill: "#4b5563" }}
                axisLine={false}
                tickLine={false}
                width={52}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="price"
                stroke={color}
                strokeWidth={2}
                fill={`url(#${gradId})`}
                dot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Range stats */}
      {!loading && data.length > 1 && change != null && pct != null && high && low && (
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: `${range} change`, val: `${up ? "+" : ""}${fmt(change)}`, sub: `${up ? "+" : ""}${pct.toFixed(2)}%`, accent: true },
            { label: `${range} high`,   val: fmt(high),  sub: null, accent: false },
            { label: `${range} low`,    val: fmt(low),   sub: null, accent: false },
            { label: "Data points",     val: String(data.length), sub: null, accent: false },
          ].map(({ label, val, sub, accent }) => (
            <div
              key={label}
              className="rounded-xl border p-3 space-y-0.5"
              style={{ borderColor: "var(--border)", background: "rgba(0,0,0,0.2)" }}
            >
              <p className="text-[10px] uppercase tracking-widest text-gray-600">{label}</p>
              <p
                className="text-sm font-black tabular-nums"
                style={{ color: accent ? (up ? "#4ade80" : "#f87171") : "white" }}
              >
                {val}
              </p>
              {sub && (
                <p className="text-xs tabular-nums" style={{ color: up ? "#4ade80" : "#f87171" }}>
                  {sub}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
