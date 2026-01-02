"use client";

import { useEffect, useState } from "react";
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
import { METAL_COLORS } from "./metalColors";

const METALS = ["Gold", "Silver", "Platinum", "Palladium"] as const;
type Metal = (typeof METALS)[number];

type Point = {
  time: string;
  [key: string]: number | string;
};

type AlertLine = {
  id: string;
  threshold: number;
  direction: "above" | "below";
};

type TriggerPoint = {
  id: string;
  metal: Metal;
  price: number;
  direction: "above" | "below";
  time: string;
};

export default function MultiMetalChart({
  hours,
  enabled,
  normalized,
}: {
  hours: number;
  enabled: Record<Metal, boolean>;
  normalized: boolean;
}) {
  const [rawData, setRawData] = useState<Point[]>([]);
  const [alerts, setAlerts] = useState<Record<Metal, AlertLine[]>>({
    Gold: [],
    Silver: [],
    Platinum: [],
    Palladium: [],
  });
  const [triggers, setTriggers] = useState<TriggerPoint[]>([]);

  useEffect(() => {
    async function loadPrices() {
      const responses = await Promise.all(
        METALS.map((metal) =>
          fetch(`/api/prices/history?metal=${metal}&hours=${hours}`)
            .then((r) => r.json())
            .then((d) => ({ metal, points: d.points || [] }))
        )
      );

      const map = new Map<string, Point>();

      for (const { metal, points } of responses) {
        for (const p of points) {
          if (!map.has(p.time)) map.set(p.time, { time: p.time });
          map.get(p.time)![metal] = p.price;
        }
      }

      setRawData(
        Array.from(map.values()).sort(
          (a, b) =>
            new Date(a.time).getTime() -
            new Date(b.time).getTime()
        )
      );
    }

    loadPrices();
  }, [hours]);

  useEffect(() => {
    async function loadAlerts() {
      const results = await Promise.all(
        METALS.map((metal) =>
          fetch(`/api/alerts/by-metal?metal=${metal}`)
            .then((r) => r.json())
            .then((d) => ({ metal, alerts: d.alerts || [] }))
        )
      );

      const next: Record<Metal, AlertLine[]> = {
        Gold: [],
        Silver: [],
        Platinum: [],
        Palladium: [],
      };

      for (const r of results) {
        next[r.metal as Metal] = r.alerts;
      }

      setAlerts(next);
    }

    loadAlerts();
  }, []);

  useEffect(() => {
    fetch(`/api/alerts/triggers?hours=${hours}`)
      .then((r) => r.json())
      .then((d) => setTriggers(d.triggers || []));
  }, [hours]);

  const data = normalized
    ? (() => {
        const bases: Partial<Record<Metal, number>> = {};
        rawData.forEach((row) => {
          METALS.forEach((m) => {
            if (
              enabled[m] &&
              bases[m] === undefined &&
              typeof row[m] === "number"
            ) {
              bases[m] = row[m] as number;
            }
          });
        });

        return rawData.map((row) => {
          const next: Point = { time: row.time };
          METALS.forEach((m) => {
            if (
              enabled[m] &&
              typeof row[m] === "number" &&
              bases[m]
            ) {
              next[m] =
                (((row[m] as number) - bases[m]!) /
                  bases[m]!) *
                100;
            }
          });
          return next;
        });
      })()
    : rawData;

  return (
    <div style={{ width: "100%", height: 380 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis
            dataKey="time"
            tickFormatter={(v) =>
              new Date(v).toLocaleDateString(undefined, {
                hour: "numeric",
                minute: "numeric",
              })
            }
          />
          <YAxis
            domain={["auto", "auto"]}
            tickFormatter={(v) =>
              normalized ? `${v.toFixed(1)}%` : v.toFixed(2)
            }
          />
          <Tooltip
            labelFormatter={(v) => new Date(v).toLocaleString()}
          />

          {/* Price lines */}
          {METALS.map(
            (metal) =>
              enabled[metal] && (
                <Line
                  key={metal}
                  type="monotone"
                  dataKey={metal}
                  stroke={METAL_COLORS[metal]}
                  strokeWidth={2}
                  dot={false}
                />
              )
          )}

          {/* Alert thresholds (price mode only) */}
          {!normalized &&
            METALS.map(
              (metal) =>
                enabled[metal] &&
                alerts[metal].map((alert) => (
                  <ReferenceLine
                    key={`${metal}-${alert.id}`}
                    y={alert.threshold}
                    stroke={
                      alert.direction === "above"
                        ? "#16a34a"
                        : "#dc2626"
                    }
                    strokeDasharray="4 4"
                  />
                ))
            )}

          {/* Alert trigger markers (price mode only) */}
          {!normalized &&
            METALS.map(
              (metal) =>
                enabled[metal] && (
                  <Scatter
                    key={`${metal}-triggers`}
                    data={triggers.filter(
                      (t) => t.metal === metal
                    )}
                    dataKey="price"
                    fill={METAL_COLORS[metal]}
                    shape={(props: any) => (
                      <circle
                        cx={props.cx}
                        cy={props.cy}
                        r={5}
                        fill={
                          props.payload.direction === "above"
                            ? "#16a34a"
                            : "#dc2626"
                        }
                      />
                    )}
                  />
                )
            )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
