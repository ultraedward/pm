// app/dashboard/components/CurrentPrices.tsx
// FULL SHEET — COPY / PASTE ENTIRE FILE
// Click a card to open the full chart for that metal

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type PriceRow = {
  metal: string;
  price: number;
  createdAt: string;
};

type CurrentPrice = {
  metal: string;
  price: number;
  createdAt: string;
  changePct: number | null;
};

const REFRESH_MS = 60_000;
const SPARK_POINTS = 20;

export default function CurrentPrices() {
  const [current, setCurrent] = useState<CurrentPrice[]>([]);
  const [history, setHistory] = useState<PriceRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [curRes, histRes] = await Promise.all([
      fetch("/api/prices/current", { cache: "no-store" }),
      fetch("/api/export/prices", { cache: "no-store" }),
    ]);

    const cur = await curRes.json();
    const hist = await histRes.json();

    if (cur.ok) setCurrent(cur.prices);
    if (hist.ok) setHistory(hist.prices);

    setLoading(false);
  };

  useEffect(() => {
    load();
    const id = setInterval(load, REFRESH_MS);
    return () => clearInterval(id);
  }, []);

  const seriesByMetal = useMemo(() => {
    const map: Record<string, PriceRow[]> = {};
    for (const row of history) {
      map[row.metal] ||= [];
      map[row.metal].push(row);
    }
    for (const k of Object.keys(map)) {
      map[k] = map[k]
        .sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt))
        .slice(-SPARK_POINTS);
    }
    return map;
  }, [history]);

  if (loading) {
    return (
      <div className="rounded-xl border p-4 text-sm text-gray-500">
        Loading prices…
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {current.map((p) => {
        const up = p.changePct !== null && p.changePct >= 0;
        const series = seriesByMetal[p.metal] || [];
        const values = series.map((x) => x.price);

        return (
          <Link
            key={p.metal}
            href={`/dashboard/charts?metal=${p.metal}`}
            className="rounded-xl border p-4 bg-white shadow-sm hover:shadow-md transition block"
          >
            <div className="text-xs uppercase text-gray-500">
              {p.metal}
            </div>

            <div className="text-2xl font-semibold">
              ${p.price.toFixed(2)}
            </div>

            {p.changePct !== null && (
              <div
                className={`text-sm mt-1 font-medium ${
                  up ? "text-green-600" : "text-red-600"
                }`}
              >
                {up ? "▲" : "▼"}{" "}
                {Math.abs(p.changePct).toFixed(2)}%
                <span className="text-xs text-gray-400 ml-1">
                  (24h)
                </span>
              </div>
            )}

            <Sparkline values={values} up={up} />

            <div className="text-xs text-gray-400 mt-1">
              Click for full chart
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function Sparkline({
  values,
  up,
}: {
  values: number[];
  up: boolean;
}) {
  if (values.length < 2) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * 100;
      const y = 100 - ((v - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox="0 0 100 100"
      className="mt-2 h-10 w-full"
      preserveAspectRatio="none"
    >
      <polyline
        fill="none"
        stroke={up ? "#16a34a" : "#dc2626"}
        strokeWidth="3"
        points={points}
      />
    </svg>
  );
}
