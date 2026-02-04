"use client";

import { useEffect, useState } from "react";

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

const RANGES = ["24h", "7d", "30d"] as const;

export default function ChartsPage() {
  const [range, setRange] = useState<(typeof RANGES)[number]>("24h");
  const [data, setData] = useState<ChartResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Price Charts</h1>

      {/* Range selector */}
      <div className="flex gap-2">
        {RANGES.map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-3 py-1 rounded text-sm border ${
              r === range
                ? "bg-white text-black"
                : "text-gray-300 border-gray-600 hover:border-gray-400"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-gray-400">Loading price data…</div>
      )}

      {/* Error */}
      {error && (
        <div className="text-red-400">
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

      {/* Data preview (temporary, safe) */}
      {!loading && data && hasAnyData && (
        <pre className="bg-black border border-gray-700 rounded p-4 text-xs overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}