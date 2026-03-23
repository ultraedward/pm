"use client";

import { useEffect, useState } from "react";

type Prediction = {
  id: string;
  direction: string;
  correct: boolean | null;
  voided: boolean;
  basePrice: number;
  resultPrice: number | null;
};

type State = {
  today: Prediction | null;
  yesterday: Prediction | null;
  streak: number;
  winRate: number | null;
  total: number;
};

export function PredictionCard({ goldSpot }: { goldSpot: number }) {
  const [state, setState] = useState<State | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    const res = await fetch("/api/predict");
    if (res.ok) setState(await res.json());
    setLoading(false);
  }

  async function predict(direction: "up" | "down") {
    setSubmitting(true);
    await fetch("/api/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ direction }),
    });
    await load();
    setSubmitting(false);
  }

  useEffect(() => { load(); }, []);

  if (loading) return null;
  if (!state) return null;

  const { today, yesterday, streak, winRate, total } = state;

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD" });

  return (
    <div
      className="rounded-2xl border p-5 space-y-4"
      style={{ borderColor: "rgba(212,175,55,0.12)", background: "rgba(0,0,0,0.2)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
            Daily Prediction
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-600">
          {streak > 0 && (
            <span className="font-semibold text-amber-400">
              🔥 {streak} streak
            </span>
          )}
          {winRate !== null && (
            <span>{winRate}% win rate · {total} played</span>
          )}
        </div>
      </div>

      {/* Yesterday's result */}
      {yesterday && yesterday.correct !== null && (() => {
        const isFlat = yesterday.voided;
        return (
          <div
            className={`rounded-xl px-4 py-2.5 text-xs font-medium flex items-center justify-between ${
              isFlat
                ? "bg-white/5 border border-white/10 text-gray-500"
                : yesterday.correct
                ? "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                : "bg-white/5 border border-white/10 text-gray-500"
            }`}
          >
            <span>
              {isFlat
                ? "➖ Flat day — gold didn't move"
                : yesterday.correct
                ? "✓ Correct yesterday"
                : "✗ Wrong yesterday"}{" "}
              {!isFlat && `— Gold ${yesterday.direction === "up" ? "went up" : "went down"} `}
              {!isFlat && yesterday.resultPrice && yesterday.basePrice
                ? `${yesterday.resultPrice > yesterday.basePrice ? "+" : ""}${(
                    ((yesterday.resultPrice - yesterday.basePrice) / yesterday.basePrice) * 100
                  ).toFixed(2)}%`
                : ""}
            </span>
            {yesterday.resultPrice && (
              <span className="tabular-nums">{fmt(yesterday.resultPrice)}</span>
            )}
          </div>
        );
      })()}

      {/* Today's question */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-white">
          Will gold be higher or lower tomorrow?
          <span className="ml-2 text-xs font-normal text-gray-600 tabular-nums">
            Spot {fmt(goldSpot)}
          </span>
        </p>

        {today ? (
          // Already predicted today
          <div className="flex items-center gap-3">
            <div
              className="flex-1 rounded-full border border-amber-500/30 bg-amber-500/10 py-2.5 text-center text-sm font-bold text-amber-400"
            >
              {today.direction === "up" ? "↑ You predicted Higher" : "↓ You predicted Lower"}
            </div>
            <p className="text-xs text-gray-600">Result tomorrow</p>
          </div>
        ) : (
          // Not yet predicted
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => predict("up")}
              disabled={submitting}
              className="rounded-full border border-white/10 py-3 text-sm font-bold text-white hover:border-amber-500/40 hover:bg-amber-500/10 hover:text-amber-400 transition-all disabled:opacity-40"
            >
              ↑ Higher
            </button>
            <button
              onClick={() => predict("down")}
              disabled={submitting}
              className="rounded-full border border-white/10 py-3 text-sm font-bold text-white hover:border-amber-500/40 hover:bg-amber-500/10 hover:text-amber-400 transition-all disabled:opacity-40"
            >
              ↓ Lower
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
