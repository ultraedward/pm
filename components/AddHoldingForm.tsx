"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddHoldingForm() {
  const router = useRouter();

  const [metal, setMetal] = useState("gold");
  const [ounces, setOunces] = useState("");
  const [costBasis, setCostBasis] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/holdings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        metal,
        ounces: parseFloat(ounces),
        costBasis: costBasis ? parseFloat(costBasis) : null,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      setLoading(false);
      return;
    }

    router.refresh();
    setOunces("");
    setCostBasis("");
    setLoading(false);
  }

  return (
    <div className="p-6 bg-neutral-900 rounded-xl mb-8">
      <h2 className="text-xl font-semibold mb-4">
        Add Holding
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={metal}
          onChange={(e) => setMetal(e.target.value)}
          className="w-full p-3 rounded bg-neutral-800"
        >
          <option value="gold">Gold</option>
          <option value="silver">Silver</option>
        </select>

        <input
          type="number"
          step="0.01"
          placeholder="Ounces"
          value={ounces}
          onChange={(e) => setOunces(e.target.value)}
          required
          className="w-full p-3 rounded bg-neutral-800"
        />

        <input
          type="number"
          step="0.01"
          placeholder="Cost Basis (optional)"
          value={costBasis}
          onChange={(e) => setCostBasis(e.target.value)}
          className="w-full p-3 rounded bg-neutral-800"
        />

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-500 text-black font-semibold py-3 rounded hover:bg-yellow-400 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Holding"}
        </button>
      </form>
    </div>
  );
}