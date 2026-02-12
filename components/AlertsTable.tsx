"use client";

import { useState } from "react";

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

export function AlertsTable({ alerts }: { alerts: Alert[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {alerts.map((alert) => {
        const triggerCount = alert.triggers.length;
        const lastTriggered =
          triggerCount > 0 ? alert.triggers[0].triggeredAt : null;

        const isOpen = openId === alert.id;

        return (
          <div
            key={alert.id}
            className="panel p-5 space-y-3 transition-all"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold capitalize">
                  {alert.metal} {alert.direction === "above" ? "≥" : "≤"} $
                  {alert.price.toLocaleString()}
                </div>

                <div className="text-sm text-gray-400">
                  {triggerCount} trigger
                  {triggerCount !== 1 && "s"}
                  {lastTriggered && (
                    <> • Last: {new Date(lastTriggered).toLocaleString()}</>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    alert.active
                      ? "bg-green-900 text-green-400"
                      : "bg-gray-800 text-gray-400"
                  }`}
                >
                  {alert.active ? "Active" : "Paused"}
                </span>

                {triggerCount > 0 && (
                  <button
                    onClick={() =>
                      setOpenId(isOpen ? null : alert.id)
                    }
                    className="text-sm text-gray-400 hover:text-white transition"
                  >
                    {isOpen ? "Hide history" : "View history"}
                  </button>
                )}
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
                    <span>
                      ${trigger.price.toLocaleString()}
                    </span>
                    <span>
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