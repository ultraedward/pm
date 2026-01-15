"use client";

import { useEffect, useState } from "react";

export default function AlertsPage() {
  const [status, setStatus] = useState<any>(null);
  const [runResult, setRunResult] = useState<any>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    fetch("/api/alerts/status")
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => {});
  }, []);

  async function runAlerts() {
    setRunning(true);
    setRunResult(null);

    const res = await fetch("/api/alerts/run", { method: "POST" });
    const json = await res.json();

    setRunResult(json);
    setRunning(false);
  }

  async function createTestAlert() {
    setRunning(true);
    setRunResult(null);

    const res = await fetch("/api/alerts/test", { method: "POST" });
    const json = await res.json();

    setRunResult(json);
    setRunning(false);
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Alerts</h1>

      {/* STATUS */}
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="font-semibold mb-2">System Status</h2>

        {!status ? (
          <p className="text-sm text-gray-500">Loading…</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-500">Total Alerts</div>
              <div className="font-medium">{status.totalAlerts}</div>
            </div>

            <div>
              <div className="text-gray-500">Total Triggers</div>
              <div className="font-medium">{status.totalTriggers}</div>
            </div>

            <div className="col-span-2">
              <div className="text-gray-500">Last Triggered</div>
              <div className="font-medium">
                {status.lastTriggeredAt
                  ? new Date(status.lastTriggeredAt).toLocaleString()
                  : "Never"}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ACTIONS */}
      <div className="rounded-xl border bg-white p-5 shadow-sm space-y-3">
        <h2 className="font-semibold">Actions</h2>

        <div className="flex gap-3">
          <button
            onClick={runAlerts}
            disabled={running}
            className="px-4 py-2 rounded-lg bg-black text-white disabled:opacity-50"
          >
            Run Alert Engine
          </button>

          <button
            onClick={createTestAlert}
            disabled={running}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
          >
            Create Test Alert (Instant Trigger)
          </button>
        </div>

        {runResult && (
          <pre className="mt-4 text-xs bg-gray-50 border rounded-lg p-3 overflow-auto">
{JSON.stringify(runResult, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
