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
  const [openId, setOpenId]       = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [, startTransition]       = useTransition();
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

        // Progress bar fill: 100% = at threshold, 0% = far away (cap pct at 100)
        const progressFill = pct !== null ? Math.max(0, Math.min(100, 100 - pct)) : 0;

        // Dynamic border based on state
        const borderStyle = isTriggered
          ? "rgba(52,211,153,0.35)"   // emerald glow
          : approaching
            ? "rgba(245,158,11,0.35)" // amber glow
            : "var(--border)";

        return (
          <div
            key={alert.id}
            className="rounded-2xl border p-5 space-y-4 transition-colors"
            style={{ borderColor: borderStyle }}
          >
            {/* Row 1: Metal + direction + status */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: dot }} />
                <span className="text-base font-black tracking-tight capitalize truncate">
                  {alert.metal}
                </span>
                <span className="text-sm text-gray-500 font-medium">
                  {alert.direction === "above" ? "↑ above" : "↓ below"}{" "}
                  <span className="tabular-nums text-gray-300">${alert.price.toLocaleString()}</span>
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {isTriggered && (
                  <span className="text-xs px-2.5 py-1 rounded-full font-semibold text-emerald-400 border border-emerald-400/20 bg-emerald-400/5">
                    At threshold
                  </span>
                )}
                {approaching && !isTriggered && (
                  <span className="text-xs px-2.5 py-1 rounded-full font-semibold text-amber-400 border border-amber-400/20 bg-amber-400/5">
                    Approaching
                  </span>
                )}
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                  alert.active
                    ? "text-emerald-400 border border-emerald-400/20 bg-emerald-400/5"
                    : "text-gray-500 border border-white/10 bg-white/5"
                }`}>
                  {alert.active ? "Active" : "Paused"}
                </span>
              </div>
            </div>

            {/* Distance row + progress bar */}
            {current && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    Spot{" "}
                    <span className="tabular-nums text-gray-200 font-medium">
                      ${current.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </span>
                  {!isTriggered && diff !== null && pct !== null && (
                    <span className={approaching ? "text-amber-400 font-medium" : "text-gray-500"}>
                      ${diff.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} away · {pct.toFixed(1)}%
                    </span>
                  )}
                  {isTriggered && (
                    <span className="text-emerald-400 font-semibold">Threshold reached</span>
                  )}
                </div>

                {/* Progress bar */}
                {!isTriggered && (
                  <div className="h-0.5 w-full rounded-full bg-white/5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        approaching ? "bg-amber-500/70" : "bg-white/20"
                      }`}
                      style={{ width: `${progressFill}%` }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Meta row: trigger count */}
            <div className="text-xs text-gray-500">
              {triggerCount === 0 ? "Never triggered" : (
                <>
                  Triggered {triggerCount} time{triggerCount !== 1 && "s"}
                  {lastTriggered && (
                    <> · Last <span className="text-gray-400">
                      {new Date(lastTriggered).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                    </span></>
                  )}
                </>
              )}
            </div>

            {/* Action row */}
            <div className="flex items-center gap-2 pt-1 border-t" style={{ borderColor: "var(--border)" }}>
              <button
                onClick={() => handleToggle(alert.id)}
                disabled={isLoading}
                className="rounded-full border px-4 py-1.5 text-xs font-semibold text-gray-300 hover:bg-white/5 hover:text-white transition disabled:opacity-40"
                style={{ borderColor: "var(--border)" }}
              >
                {isLoading ? "…" : alert.active ? "Pause" : "Resume"}
              </button>

              {triggerCount > 0 && (
                <button
                  onClick={() => setOpenId(isOpen ? null : alert.id)}
                  className="rounded-full border px-4 py-1.5 text-xs font-semibold text-gray-300 hover:bg-white/5 hover:text-white transition"
                  style={{ borderColor: "var(--border)" }}
                >
                  {isOpen ? "Hide history" : `History (${triggerCount})`}
                </button>
              )}

              {/* Spacer */}
              <div className="flex-1" />

              {/* Delete — less prominent, right-aligned */}
              <button
                onClick={() => handleDelete(alert.id)}
                disabled={isLoading}
                className="text-xs font-medium text-gray-600 hover:text-red-400 transition disabled:opacity-40"
              >
                {isLoading ? "…" : "Delete"}
              </button>
            </div>

            {/* Expandable trigger history */}
            {isOpen && (
              <div className="rounded-xl border p-3 space-y-2" style={{ borderColor: "var(--border)", background: "rgba(0,0,0,0.2)" }}>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Trigger history</p>
                {alert.triggers.map((trigger) => (
                  <div key={trigger.id} className="flex justify-between text-xs">
                    <span className="tabular-nums text-gray-300 font-medium">${trigger.price.toLocaleString()}</span>
                    <span className="text-gray-500">
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
