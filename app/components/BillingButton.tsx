"use client";

import { useState } from "react";

export default function BillingButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openPortal = async () => {
    setLoading(true);
    setError(null);

    const res = await fetch("/api/stripe/portal", {
      method: "POST",
    });

    let data: any;
    try {
      data = await res.json();
    } catch {
      setError("Unexpected server response");
      setLoading(false);
      return;
    }

    if (!res.ok) {
      setError(data?.error ?? "Failed to open billing portal");
      setLoading(false);
      return;
    }

    window.location.href = data.url;
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={openPortal}
        disabled={loading}
        className="px-4 py-2 rounded-md border text-sm hover:bg-gray-50 disabled:opacity-50"
      >
        {loading ? "Opening…" : "Manage Billing"}
      </button>

      {error && (
        <div className="text-xs text-red-600">{error}</div>
      )}
    </div>
  );
}
