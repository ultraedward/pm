"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Trigger = {
  id: string;
  price: number;
  triggeredAt: Date;
};

type Alert = {
  id: string;
  metal: string;
  price: number;
  direction: string;
  active: boolean;
  triggers: Trigger[];
  createdAt: Date;
};

const METAL_DOTS: Record<string, string> = {
  gold:      "#D4AF37",
  silver:    "#C0C0C0",
  platinum:  "#E5E4E2",
  palladium: "#9FA8C7",
};

export function AlertsTable({ alerts, spots = {} }: { alerts: Alert[]; spots?: Record<string, number> }) {
  const [openId, setOpenId]     = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [, startTransition]     = useTransition();
  const router = useRouter();

  async function handleToggle(alertId: string) {
    setLoadingId(alertId);
    try {
      await fetch(`/api/alerts/${alertId}/toggle`, { method: "POST" });
      startTransition(() => router.refresh());
    } finally {
      setLoadingId(null);
    }
  }

  async function handleDelete(alertId: string) {
    if (!confirm("Delete this alert?")) return;
    setLoadingId(alertId);
    try {
      await fetch(`/api/alerts/${alertId}/delete`, { method: "POST" });
      startTransition(() => router.refresh());
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => {
        const triggerCount  = alert.triggers.length;
        const lastTriggered = triggerCount > 0 ? alert.triggers[0].triggeredAt : null;
        const isOpen        = openId === alert.id;
        const isLoading     = loadingId === alert.id;
        const dot           = METAL_DOTS[alert.metal] ?? "#888";

        const current     = spots[alert.metal];
        const target      = alert.price;
        const diff        = current ? Math.abs(target - current) : null;
        const pct         = current && diff !== null ? (diff / current) * 100 : null;
        const isTriggered = current
          ? (alert.direction === "above" ? current >= target : current <= target)
          : false;
        const approaching = pct !== null && pct < 5 && !isTriggered;

        return (
          <div
            key={alert.id}
            className="rounded-2xl border p-5 space-y-4"
            style={{ borderColor: "var(--border)" }}
          >
            {/* Row 1: title + status badge */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: dot }} />
                <span className="text-base font-black tracking-tight capitalize truncate">
                  {alert.metal} {alert.direction === "above" ? "≥" : "≤"} ${alert.price.toLocaleString()}
                </span>
              </div>
              <span className={`shrink-0 text-xs px-2.5 py-1 rounded-full font-semibold ${
                alert.active
                  ? "text-emerald-400 border border-emerald-400/20 bg-emerald-400/5"
                  : "text-gray-500 border border-white/10 bg-white/5"
              }`}>
                {alert.active ? "Active" : "Paused"}
              </span>
            </div>

            {/* Row 2: current price + distance */}
            {current && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">
                  Spot <span className="tabular-nums text-gray-200 font-medium">
                    ${current.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </span>
                <span className="text-gray-700">·</span>
                {isTriggered ? (
                  <span className="text-emerald-400 font-semibold">At threshold</span>
                ) : diff !== null && pct !== null ? (
                  <span className={approaching ? "text-amber-400 font-medium" : "text-gray-500"}>
                    ${diff.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} away ({pct.toFixed(1)}%)
                  </span>
                ) : null}
              </div>
            )}

            {/* Row 3: trigger count */}
            <div className="text-xs text-gray-600">
              {triggerCount} trigger{triggerCount !== 1 && "s"}
              {lastTriggered && (
                <> · Last {new Date(lastTriggered).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</>
              )}
            </div>

            {/* Row 4: actions */}
            <div className="flex items-center gap-2 pt-1 border-t" style={{ borderColor: "var(--border)" }}>
              <button
                onClick={() => handleToggle(alert.id)}
                disabled={isLoading}
                className="flex-1 rounded-full border py-2 text-xs font-semibold text-gray-300 hover:bg-white/5 hover:text-white transition disabled:opacity-40"
                style={{ borderColor: "var(--border)" }}
              >
                {isLoading ? "…" : alert.active ? "Pause" : "Resume"}
              </button>

              {triggerCount > 0 && (
                <button
                  onClick={() => setOpenId(isOpen ? null : alert.id)}
                  className="flex-1 rounded-full border py-2 text-xs font-semibold text-gray-300 hover:bg-white/5 hover:text-white transition"
                  style={{ borderColor: "var(--border)" }}
                >
                  {isOpen ? "Hide" : "History"}
                </button>
              )}

              <button
                onClick={() => handleDelete(alert.id)}
                disabled={isLoading}
                className="flex-1 rounded-full border border-red-500/20 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition disabled:opacity-40"
              >
                {isLoading ? "…" : "Delete"}
              </button>
            </div>

            {/* Expandable trigger history */}
            {isOpen && (
              <div className="border-t pt-3 space-y-2" style={{ borderColor: "var(--border)" }}>
                {alert.triggers.map((trigger) => (
                  <div key={trigger.id} className="flex justify-between text-xs text-gray-400">
                    <span className="tabular-nums">${trigger.price.toLocaleString()}</span>
                    <span className="text-gray-600">
                      {new Date(trigger.triggeredAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
