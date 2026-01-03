"use client";

import { useState } from "react";

export default function AlertModal({
  metalId,
  disabled,
}: {
  metalId: string;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [targetPrice, setTargetPrice] = useState("");
  const [direction, setDirection] = useState("above");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setError(null);

    const res = await fetch("/api/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        metalId,
        targetPrice: Number(targetPrice),
        direction,
      }),
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
      setError(data?.error ?? "Failed to create alert");
      setLoading(false);
      return;
    }

    setTargetPrice("");
    setOpen(false);
    setLoading(false);
  };

  if (disabled) {
    return (
      <button
        disabled
        className="px-4 py-2 rounded-md bg-gray-200 text-gray-500 cursor-not-allowed"
        title="Pro required"
      >
        Create Alert 🔒 Pro
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 rounded-md bg-black text-white"
      >
        Create Alert
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm flex flex-col gap-4">
            <h3 className="text-lg font-semibold">New Price Alert</h3>

            <input
              type="number"
              placeholder="Target price"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              className="border rounded-md px-3 py-2"
            />

            <select
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
              className="border rounded-md px-3 py-2"
            >
              <option value="above">Above</option>
              <option value="below">Below</option>
            </select>

            {error && (
              <div className="text-sm text-red-600">{error}</div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={submit}
                disabled={!targetPrice || loading}
                className="px-4 py-2 bg-black text-white rounded-md disabled:opacity-50"
              >
                {loading ? "Saving…" : "Save Alert"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
