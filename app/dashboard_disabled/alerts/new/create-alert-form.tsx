// app/dashboard/alerts/new/create-alert-form.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateAlertForm() {
  const router = useRouter();

  const [metal, setMetal] = useState("gold");
  const [direction, setDirection] = useState("above");
  const [threshold, setThreshold] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/alerts/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        metal,
        direction,
        threshold: Number(threshold),
      }),
    });

    if (!res.ok) {
      setError("Failed to create alert");
      setLoading(false);
      return;
    }

    router.push("/dashboard/alerts");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Metal</label>
        <select
          value={metal}
          onChange={(e) => setMetal(e.target.value)}
          className="mt-1 w-full rounded border px-3 py-2"
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
          onChange={(e) => setDirection(e.target.value)}
          className="mt-1 w-full rounded border px-3 py-2"
        >
          <option value="above">Above</option>
          <option value="below">Below</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">
          Threshold Price ($)
        </label>
        <input
          type="number"
          step="0.01"
          required
          value={threshold}
          onChange={(e) => setThreshold(e.target.value)}
          className="mt-1 w-full rounded border px-3 py-2"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Alert"}
      </button>
    </form>
  );
}
