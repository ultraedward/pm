"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import PriceDelta from "./PriceDelta";

type Point = { time: string; price: number };
type Card = {
  id: string;
  name: string;
  latestPrice: number;
  deltaPct: number;
  data: Point[];
};

export default function LiveDashboardClient() {
  const [cards, setCards] = useState<Card[] | null>(null);

  async function load() {
    const res = await fetch("/api/dashboard");
    setCards(await res.json());
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, []);

  if (!cards) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="panel h-48" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {cards.map((c) => (
        <div key={c.id} className="panel p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{c.name}</h2>
            <PriceDelta delta={c.deltaPct} />
          </div>

          <div className="text-2xl font-bold mt-1">
            ${c.latestPrice.toFixed(2)}
          </div>

          <div className="h-28 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={c.data}>
                <XAxis dataKey="time" hide />
                <YAxis hide domain={["auto", "auto"]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="var(--accent)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  );
}
