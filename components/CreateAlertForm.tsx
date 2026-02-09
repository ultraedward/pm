"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CreateAlertForm() {
  const router = useRouter();

  const [metal, setMetal] = useState("gold");
  const [direction, setDirection] = useState("above");
  const [price, setPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const res = await fetch("/api/alerts/create", {
      method: "POST",
      body: JSON.stringify({
        metal,
        direction,
        price: Number(price),
      }),
    });

    if (res.status === 402) {
      const checkout = await fetch("/api/billing/checkout", {
        method: "POST",
      });
      const data = await checkout.json();
      window.location.href = data.url;
      return;
    }

    if (!res.ok) {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
      return;
    }

    router.push("/alerts");
  }

  return (
    <form
      onSubmit={submit}
      className="max-w-sm space-y-5 rounded-lg border border-gray-800 p-6"
    >
      <div>
        <label className="block text-sm font-medium mb-1">Metal</label>
        <select
          value={metal}
          onChange={e => setMetal(e.target.value)}
          className="w-full rounded border border-gray-700 bg-black p-2"
        >
          <option value="gold">Gold</option>
          <option value="silver">Silver</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Condition</label>
        <select
          value={direction}
          onChange={e => setDirection(e.target.value)}
          className="w-full rounded border border-gray-700 bg-black p-2"
        >
          <option value="above">Price goes above</option>
          <option value="below">Price goes below</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Target price</label>
        <input
          type="number"
          inputMode="decimal"
          required
          value={price}
          onChange={e => setPrice(e.target.value)}
          placeholder="e.g. 2500"
          className="w-full rounded border border-gray-700 bg-black p-2"
        />
      </div>

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded bg-white py-2 font-medium text-black hover:bg-gray-200 disabled:opacity-50"
      >
        {submitting ? "Creating…" : "Create alert"}
      </button>
    </form>
  );
}