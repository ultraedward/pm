"use client";

import { useEffect, useState } from "react";

export function useUnreadAlerts() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/alerts/unread", {
          cache: "no-store",
        });

        if (!res.ok) return;

        const data = await res.json();
        if (!cancelled) setCount(data.unread ?? 0);
      } catch {
        if (!cancelled) setCount(0);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return count;
}