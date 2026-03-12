"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type PricePoint = {
  t: number;
  price: number;
};

type ChartResponse = {
  gold: PricePoint[];
  silver: PricePoint[];
  platinum: PricePoint[];
  palladium: PricePoint[];
};

type MergedPoint = {
  label: string;
  gold?: number;
  silver?: number;
  platinum?: number;
  palladium?: number;
};

const RANGES = ["24h", "7d", "30d"] as const;

const METAL_COLORS: Record<string, string> = {
  gold: "#f59e0b",
  silver: "#94a3b8",
  platinum: "#a78bfa",
  palladium: "#34d399",
};

const METALS = ["gold", "silver", "platinum", "palladium"] as const;

function formatLabel(t: number, range: string): string {
  const d = new Date(t);
  if (range === "24h") {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function mergeData(data: ChartResponse, range: string): MergedPoint[] {
  // Build a unified timeline from all available data points
  const allTimestamps = new Set<number>();
  for (const metal of METALS) {
    for (const pt of data[metal] ?? []) {
      allTimestamps.add(pt.t);
    }
  }

  const sorted = Array.from(allTimestamps).sort((a, b) => a - b);

  // Build lookup maps for each metal
  const maps: Record<string, Map<number, number>> = {};
  for (const metal of METALS) {
    maps[metal] = new Map((data[metal] ?? []).map((p) => [p.t, p.price]));
  }

  return sorted.map((t) => {
    const point: MergedPoint = { label: formatLabel(t, range) };
    for (const metal of METALS) {
      const val = maps[metal].get(t);
      if (val !== undefined) {
        point[metal] = val;
      }
    }
    return point;
  });
}

function fmtPrice(value: number) {
  return `$${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function ChartsPage() {
  const [range, setRange] = useState<(typeof RANGES)[number]>("7d");
  const [data, setData] = useState<ChartResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visibleMetals, setVisibleMetals] = useState<Set<string>>(
    new Set(["gold", "silver"])
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/charts/prices?range=${range}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`Failed to load prices (${res.status})`);
        }

        const json = await res.json();

        if (!cancelled) {
          setData(json);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message ?? "Unknown error");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [range]);

  const hasAnyData =
    data &&
    Object.values(data).some((arr) => Array.isArray(arr) && arr.length > 0);

  const merged = data && hasAnyData ? mergeData(data, range) : [];

  function toggleMetal(metal: string) {
    setVisibleMetals((prev) => {
      const next = new Set(prev);
      if (next.has(metal)) {
        if (next.size > 1) next.delete(metal);
      } else {
        next.add(metal);
      }
      return next;
    });
  }

  // Determine which metals actually have data
  const availableMetals = data
    ? METALS.filter((m) => (data[m]?.length ?? 0) > 0)
    : [];

  return (
    <div className="p-6 space-y-6 min-h-screen bg-black text-white">
      <h1 className="text-2xl font-semibold">Price Charts</h1>

      {/* Range selector */}
      <div className="flex gap-2">
        {RANGES.map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-3 py-1 rounded text-sm border transition-colors ${
              r === range
                ? "bg-white text-black border-white"
                : "text-gray-300 border-gray-600 hover:border-gray-400"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Metal toggles */}
      {availableMetals.length > 0 && (
        <div className="flex gap-3 flex-wrap">
          {availableMetals.map((metal) => (
            <button
              key={metal}
              onClick={() => toggleMetal(metal)}
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm border transition-colors ${
                visibleMetals.has(metal)
                  ? "border-transparent"
                  : "border-gray-700 opacity-40"
              }`}
              style={
                visibleMetals.has(metal)
                  ? {
                      backgroundColor: METAL_COLORS[metal] + "22",
                      borderColor: METAL_COLORS[metal],
                      color: METAL_COLORS[metal],
                    }
                  : {}
              }
            >
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ backgroundColor: METAL_COLORS[metal] }}
              />
              {metal.charAt(0).toUpperCase() + metal.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-2 text-gray-400">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-600 border-t-white" />
          Loading price data…
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-800 bg-red-950/30 p-4 text-red-400">
          Error loading prices: {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && data && !hasAnyData && (
        <div className="rounded-lg border border-gray-700 p-6 text-gray-400">
          <p className="text-lg font-medium">No price data yet</p>
          <p className="mt-1 text-sm">
            Prices will appear here once the daily ingestion runs.
          </p>
        </div>
      )}

      {/* Chart */}
      {!loading && merged.length > 0 && (
        <div className="rounded-xl border border-gray-800 bg-gray-950 p-6">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={merged}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis
                dataKey="label"
                tick={{ fill: "#9ca3af", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "#374151" }}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: "#9ca3af", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `$${v.toLocaleString()}`}
                width={70}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#f9fafb",
                }}
                formatter={(value: number, name: string) => [
                  fmtPrice(value),
                  name.charAt(0).toUpperCase() + name.slice(1),
                ]}
                labelStyle={{ color: "#9ca3af", marginBottom: "4px" }}
              />
              <Legend
                wrapperStyle={{ paddingTop: "16px", color: "#9ca3af" }}
                formatter={(value) =>
                  value.charAt(0).toUpperCase() + value.slice(1)
                }
              />
              {availableMetals.map((metal) =>
                visibleMetals.has(metal) ? (
                  <Line
                    key={metal}
                    type="monotone"
                    dataKey={metal}
                    stroke={METAL_COLORS[metal]}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                    connectNulls
                  />
                ) : null
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
