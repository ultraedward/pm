"use client";

import { useState } from "react";

type Frequency =
  | "once"
  | "once_per_day"
  | "once_per_hour"
  | "trailing_stop";

export default function AlertForm() {
  const [metal, setMetal] = useState("gold");
  const [direction, setDirection] = useState<"above" | "below">("above");
  const [target, setTarget] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("once");
  const [trailingOffset, setTrailingOffset] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function submit() {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const res = await fetch("/api/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        metal,
        direction,
        target: Number(target),
        frequency,
        trailingOffset:
          frequency === "trailing_stop" ? Number(trailingOffset) : null,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to create alert");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setTarget("");
    setTrailingOffset("");
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">Alert created</p>}

      <div>
        <label className="block text-sm font-medium">Metal</label>
        <select
          value={metal}
          onChange={(e) => setMetal(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="gold">Gold</option>
          <option value="silver">Silver</option>
          <option value="platinum">Platinum</option>
          <option value="palladium">Palladium</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Direction</label>
        <select
          value={direction}
          onChange={(e) => setDirection(e.target.value as any)}
          className="w-full border p-2 rounded"
        >
          <option value="above">Above</option>
          <option value="below">Below</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Target Price</label>
        <input
          type="number"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Frequency</label>
        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as Frequency)}
          className="w-full border p-2 rounded"
        >
          <option value="once">Once</option>
          <option value="once_per_day">Once per day</option>
          <option value="once_per_hour">Once per hour</option>
          <option value="trailing_stop">Trailing stop</option>
        </select>
      </div>

      {frequency === "trailing_stop" && (
        <div>
          <label className="block text-sm font-medium">
            Trailing Offset (USD)
          </label>
          <input
            type="number"
            value={trailingOffset}
            onChange={(e) => setTrailingOffset(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <p className="text-xs text-gray-500 mt-1">
            Target will move as price improves
          </p>
        </div>
      )}

      <button
        disabled={loading}
        onClick={submit}
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Alert"}
      </button>
    </div>
  );
}