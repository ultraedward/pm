"use client";

import { useEffect, useState } from "react";

type HistoryItem = {
  id: string;
  metal: string | null;
  target: number | null;
  direction: string | null;
  status: string;
  sentAt: string;
};

export default function AlertActivityPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/alerts/history");
        const data = await res.json();
        setHistory(Array.isArray(data.history) ? data.history : []);
      } catch {
        setHistory([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <p>Loading alert activity…</p>;

  if (history.length === 0) {
    return <p>No alerts have been triggered yet.</p>;
  }

  return (
    <ul className="space-y-3">
      {history.map((h) => (
        <li
          key={h.id}
          className="rounded border p-3 flex justify-between"
        >
          <div>
            <p className="font-medium">
              {h.metal?.toUpperCase()} {h.direction} ${h.target?.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">
              Status: {h.status}
            </p>
          </div>
          <div className="text-sm text-gray-400">
            {new Date(h.sentAt).toLocaleString()}
          </div>
        </li>
      ))}
    </ul>
  );
}