/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceDot,
} from "recharts";

import { useRouter } from "next/navigation";

type HistoryPoint = {
  price: number;
  timestamp: string;
};

export default function PriceChart({
  data,
  metal,
}: {
  data: HistoryPoint[];
  metal: "gold" | "silver";
}) {
  const strokeColor = metal === "gold" ? "#facc15" : "#e5e7eb";
  const latest = data[data.length - 1];

  const router = useRouter();

  const pollingRef = useRef(false);

  // Holdings calculator state (persisted)
  const storageKey = `holdings-${metal}`;
  const [ounces, setOunces] = useState<number>(0);

  useEffect(() => {
    // Live dashboard refresh every 10 seconds
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setOunces(Number(saved));
    } catch {}
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, String(ounces));
    } catch {}
  }, [ounces, storageKey]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (pollingRef.current) return;

      // pause polling if tab not visible
      if (document.visibilityState !== "visible") return;

      pollingRef.current = true;

      try {
        await fetch("/api/update-prices", { cache: "no-store" });
        router.refresh();
      } catch (e) {
        console.error("Live price refresh failed", e);
      } finally {
        pollingRef.current = false;
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [router]);

  const portfolioValue = latest ? ounces * latest.price : 0;

  return (
    <div className="space-y-4">

      {/* portfolio summary */}
      {latest && ounces > 0 && (
        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
          <div className="text-xs uppercase tracking-wide text-neutral-400">
            Your {metal} Holdings
          </div>

          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-sm text-neutral-400">
              {ounces.toLocaleString()} oz
            </span>

            <span className="text-lg font-semibold text-white">
              ${portfolioValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      )}

      {/* live ticker */}
      {latest && (
        <div className="flex items-center justify-between rounded-lg bg-neutral-900 px-4 py-2 text-sm">
          <span className="font-semibold uppercase tracking-wide">{metal}</span>
          <span className="font-mono">
            ${latest.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      )}

      {/* holdings calculator */}
      <div className="flex items-center gap-3 text-sm">
        <input
          type="number"
          placeholder={`Your ${metal} oz`}
          value={ounces || ""}
          onChange={(e) => setOunces(Number(e.target.value))}
          className="w-24 rounded bg-neutral-900 px-2 py-1 text-white outline-none"
        />

        <span className="text-neutral-400">Value:</span>

        <span className="font-mono">
          ${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>

      <ResponsiveContainer width="100%" height={200}>
      <LineChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id={`${metal}-gradient`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity={0.35} />
            <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
          </linearGradient>
          <filter id={`${metal}-glow`} height="200%" width="200%" x="-50%" y="-50%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* subtle horizontal grid lines for readability */}
        <CartesianGrid
          stroke="#222"
          strokeDasharray="3 3"
          vertical={false}
        />

        {/* time axis */}
        <XAxis
          dataKey="timestamp"
          minTickGap={30}
          tickFormatter={(tick) => {
            const date = new Date(tick);
            return date.toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            });
          }}
          stroke="#666"
          tick={{ fontSize: 12 }}
        />

        {/* price axis */}
        <YAxis
          domain={["dataMin - 5", "dataMax + 5"]}
          tickFormatter={(tick) => `$${Math.round(tick)}`}
          stroke="#666"
          tick={{ fontSize: 12 }}
          tickCount={6}
          width={60}
        />

        {/* animated price line */}
        <Area
          type="monotone"
          dataKey="price"
          stroke="none"
          fill={`url(#${metal}-gradient)`}
          isAnimationActive={true}
          animationDuration={400}
        />

        <Line
          type="monotone"
          dataKey="price"
          stroke={strokeColor}
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 5 }}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${metal}-glow)`}
          isAnimationActive={true}
          animationDuration={400}
          animationEasing="ease-out"
        />

        {latest && (
          <ReferenceDot
            x={latest.timestamp}
            y={latest.price}
            r={5}
            isFront
            shape={(props: any) => {
              const { cx, cy } = props;
              return (
                <g>
                  <circle cx={cx} cy={cy} r={4} fill={strokeColor} />
                  <circle cx={cx} cy={cy} r={4} fill={strokeColor} opacity={0.4}>
                    <animate
                      attributeName="r"
                      from="4"
                      to="12"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.4"
                      to="0"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              );
            }}
          />
        )}

        {/* trading-style hover tooltip */}
        <Tooltip
          cursor={{ stroke: strokeColor, strokeWidth: 1, strokeDasharray: "4 4" }}
          contentStyle={{
            background: "#111",
            border: "1px solid #333",
            borderRadius: "8px",
            padding: "8px 10px",
          }}
          labelFormatter={(label) => {
            const d = new Date(label);
            return d.toLocaleString();
          }}
          formatter={(value: number) => [
            `$${value.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
            "Price",
          ]}
          labelStyle={{ color: "#aaa", marginBottom: 4 }}
        />
      </LineChart>
      </ResponsiveContainer>
    </div>
  );
}