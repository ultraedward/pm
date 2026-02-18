"use client";

import { useEffect, useRef, useState } from "react";
import PriceChart from "./PriceChart";

export type HistoryPoint = {
  price: number;
  timestamp: string;
};

export type MetalData = {
  price: number;
  percentChange: number;
  lastUpdated: string | null;
  history1D: HistoryPoint[];
  history7D: HistoryPoint[];
  history30D: HistoryPoint[];
};

type Props = {
  gold: MetalData;
  silver: MetalData;
};

function AnimatedPrice({
  value,
  metal,
}: {
  value: number;
  metal: "gold" | "silver";
}) {
  const prev = useRef(value);
  const [flash, setFlash] = useState<"up" | "down" | null>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (value > prev.current) setFlash("up");
    if (value < prev.current) setFlash("down");

    const start = prev.current;
    const end = value;
    const duration = 400;
    const startTime = performance.now();

    function animate(now: number) {
      const progress = Math.min((now - startTime) / duration, 1);
      const current = start + (end - start) * progress;
      setDisplay(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);

    prev.current = value;

    const timeout = setTimeout(() => setFlash(null), 700);
    return () => clearTimeout(timeout);
  }, [value]);

  const baseColor =
    metal === "gold" ? "text-yellow-400" : "text-gray-300";

  const flashColor =
    flash === "up"
      ? "text-green-400"
      : flash === "down"
      ? "text-red-400"
      : baseColor;

  return (
    <div
      className={`text-4xl font-bold transition-colors duration-300 ${flashColor}`}
    >
      ${display.toFixed(2)}
    </div>
  );
}

function MetalCard({
  metal,
  data,
}: {
  metal: "gold" | "silver";
  data: MetalData;
}) {
  const isUp = data.percentChange >= 0;

  const percentColor = isUp
    ? "text-green-400"
    : "text-red-400";

  const gradient =
    metal === "gold"
      ? "from-yellow-500/20 to-transparent"
      : "from-gray-400/20 to-transparent";

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-950 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold capitalize">
          {metal}
        </h2>

        {data.lastUpdated && (
          <span className="text-xs text-gray-500">
            Updated {new Date(data.lastUpdated).toLocaleTimeString()}
          </span>
        )}
      </div>

      <AnimatedPrice value={data.price} metal={metal} />

      <div className={`text-sm font-medium ${percentColor}`}>
        {isUp ? "▲" : "▼"} {Math.abs(data.percentChange).toFixed(2)}%
      </div>

      <div
        className={`h-48 rounded-lg bg-gradient-to-b ${gradient}`}
      >
        <PriceChart
          history1D={data.history1D}
          history7D={data.history7D}
          history30D={data.history30D}
          metal={metal}
        />
      </div>
    </div>
  );
}

export default function MetalDashboard({
  gold,
  silver,
}: Props) {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <MetalCard metal="gold" data={gold} />
      <MetalCard metal="silver" data={silver} />
    </div>
  );
}