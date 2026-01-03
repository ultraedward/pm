"use client";

import { useState } from "react";

export default function UpgradeButton() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const upgrade = async () => {
    setLoading(true);
    setError(null);

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
    });

    let data: any = null;
    try {
      data = await res.json();
    } catch {
      setError("Unexpected server response");
      setLoading(false);
      return;
    }

    if (!res.ok) {
      setError(data?.error ?? "Upgrade failed");
      setLoading(false);
      return;
    }

    if (data?.url) {
      window.location.href = data.url;
    } else {
      setError("Invalid checkout response");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={upgrade}
        disabled={loading}
        className="px-4 py-2 rounded-md bg-black text-white disabled:opacity-50"
      >
        {loading ? "Loading…" : "Upgrade to Pro"}
      </button>

      {error && (
        <div className="text-xs text-red-600">{error}</div>
      )}
    </div>
  );
}
