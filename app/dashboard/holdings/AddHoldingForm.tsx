"use client";

import { useState } from "react";

type Props = {
  onCreated?: () => void; // optional refresh hook
};

export default function AddHoldingForm({ onCreated }: Props) {
  const [metal, setMetal] = useState("gold");
  const [ounces, setOunces] = useState<string>("1");
  const [purchaseDate, setPurchaseDate] = useState<string>(() => {
    const d = new Date();
    // yyyy-mm-dd for <input type="date">
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });
  const [costBasis, setCostBasis] = useState<string>(""); // total paid (optional)
  const [notes, setNotes] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(null);
    setLoading(true);

    try {
      const res = await fetch("/api/holdings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metal,
          ounces: Number(ounces),
          purchaseDate, // keep as yyyy-mm-dd; API can new Date(purchaseDate)
          costBasis: costBasis === "" ? null : Number(costBasis),
          notes: notes.trim() === "" ? null : notes.trim(),
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed: ${res.status}`);
      }

      setOk("Holding added.");
      setNotes("");
      setCostBasis("");
      onCreated?.();
    } catch (err: any) {
      setError(err?.message ?? "Failed to add holding");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 max-w-xl rounded-xl border border-white/10 bg-white/5 p-4">
      <h2 className="text-lg font-semibold">Add Holding</h2>

      <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm text-white/70">Metal</label>
          <select
            className="mt-1 w-full rounded-md bg-black/40 p-2"
            value={metal}
            onChange={(e) => setMetal(e.target.value)}
          >
            <option value="gold">Gold</option>
            <option value="silver">Silver</option>
            <option value="platinum">Platinum</option>
            <option value="palladium">Palladium</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-white/70">Ounces</label>
          <input
            className="mt-1 w-full rounded-md bg-black/40 p-2"
            inputMode="decimal"
            value={ounces}
            onChange={(e) => setOunces(e.target.value)}
            placeholder="e.g. 1"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-white/70">Purchase date</label>
          <input
            className="mt-1 w-full rounded-md bg-black/40 p-2"
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm text-white/70">
            Cost basis (total paid) <span className="text-white/40">(optional)</span>
          </label>
          <input
            className="mt-1 w-full rounded-md bg-black/40 p-2"
            inputMode="decimal"
            value={costBasis}
            onChange={(e) => setCostBasis(e.target.value)}
            placeholder="e.g. 2450"
          />
        </div>

        <div>
          <label className="block text-sm text-white/70">
            Notes <span className="text-white/40">(optional)</span>
          </label>
          <input
            className="mt-1 w-full rounded-md bg-black/40 p-2"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Costco bar"
          />
        </div>

        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        {ok ? <p className="text-sm text-amber-400">{ok}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-white/15 px-4 py-2 hover:bg-white/20 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add holding"}
        </button>
      </form>
    </div>
  );
}