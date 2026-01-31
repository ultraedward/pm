"use client";

import { useEffect, useState } from "react";

export function useProStatus() {
  const [pro, setPro] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    fetch("/api/pro/status")
      .then((res) => res.json())
      .then((data) => {
        if (mounted) setPro(Boolean(data.pro));
      })
      .catch(() => {
        if (mounted) setPro(false);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { pro, loading };
}