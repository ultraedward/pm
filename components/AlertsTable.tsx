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

export function AlertsTable({ alerts, spots = {} }: { alerts: Alert[]; spots?: Record<string, number> }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
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
    <div className="space-y-4">
      {alerts.map((alert) => {
        const triggerCount = alert.triggers.length;
        const lastTriggered =
          triggerCount > 0 ? alert.triggers[0].triggeredAt : null;

        const isOpen = openId === alert.id;
        const isLoading = loadingId === alert.id;

        return (
          <div
            key={alert.id}
            className="rounded-xl border border-gray-800 bg-gray-900 p-5 space-y-3 transition-all"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="text-lg font-semibold capitalize">
                  {alert.metal} {alert.direction === "above" ? "≥" : "≤"} $
                  {alert.price.toLocaleString()}
                </div>

                {/* Distance-to-trigger */}
                {spots[alert.metal] ? (() => {
                  const current = spots[alert.metal];
                  const target = alert.price;
                  const diff = target - current;
                  const pct = Math.abs((diff / current) * 100);
                  const isTriggered = alert.direction === "above" ? current >= target : current <= target;
                  const approaching = pct < 5;

                  return (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-gray-500">
                        Current <span className="tabular-nums text-gray-300">${current.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </span>
                      <span className="text-gray-700">·</span>
                      {isTriggered ? (
                        <span className="text-emerald-400 font-medium">At threshold</span>
                      ) : (
                        <span className={approaching ? "text-amber-400 font-medium" : "text-gray-500"}>
                          ${Math.abs(diff).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} away ({pct.toFixed(1)}%)
                        </span>
                      )}
                    </div>
                  );
                })() : null}

                <div className="text-sm text-gray-500">
                  {triggerCount} trigger{triggerCount !== 1 && "s"}
                  {lastTriggered && (
                    <> · Last: {new Date(lastTriggered).toLocaleString()}</>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {/* Active/Paused badge */}
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    alert.active
                      ? "bg-green-900/50 text-green-400 border border-green-800"
                      : "bg-gray-800 text-gray-400 border border-gray-700"
                  }`}
                >
                  {alert.active ? "Active" : "Paused"}
                </span>

                {/* History toggle */}
                {triggerCount > 0 && (
                  <button
                    onClick={() => setOpenId(isOpen ? null : alert.id)}
                    className="text-xs text-gray-400 hover:text-white transition"
                  >
                    {isOpen ? "Hide history" : "History"}
                  </button>
                )}

                {/* Toggle active */}
                <button
                  onClick={() => handleToggle(alert.id)}
                  disabled={isLoading}
                  className="text-xs px-2 py-1 rounded border border-gray-700 text-gray-300 hover:bg-gray-800 transition disabled:opacity-40"
                >
                  {isLoading ? "…" : alert.active ? "Pause" : "Resume"}
                </button>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(alert.id)}
                  disabled={isLoading}
                  className="text-xs px-2 py-1 rounded border border-red-900 text-red-400 hover:bg-red-950 transition disabled:opacity-40"
                >
                  {isLoading ? "…" : "Delete"}
                </button>
              </div>
            </div>

            {/* Expandable Trigger History */}
            {isOpen && (
              <div className="border-t border-gray-800 pt-3 space-y-2">
                {alert.triggers.map((trigger) => (
                  <div
                    key={trigger.id}
                    className="flex justify-between text-sm text-gray-300"
                  >
                    <span>${trigger.price.toLocaleString()}</span>
                    <span className="text-gray-500">
                      {new Date(trigger.triggeredAt).toLocaleString()}
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
