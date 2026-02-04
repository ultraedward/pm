"use client";

import { useEffect, useState } from "react";

type ActivityItem = {
  id: string;
  metal: string;
  price: number;
  triggeredAt: string;
};

export default function AlertActivityPage() {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/alerts/history", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        setItems(data.items ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div>Loading alert activity…</div>;
  }

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Alert Activity</h1>

      {items.length === 0 && <p>No alerts yet.</p>}

      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="border border-gray-800 rounded p-3"
          >
            <div>
              <strong>{item.metal.toUpperCase()}</strong> triggered at{" "}
              ${item.price.toFixed(2)}
            </div>
            <div className="text-sm text-gray-400">
              {new Date(item.triggeredAt).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}