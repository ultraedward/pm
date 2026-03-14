"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const METALS = [
  { value: "gold",      label: "Gold",      dot: "#D4AF37" },
  { value: "silver",    label: "Silver",    dot: "#C0C0C0" },
  { value: "platinum",  label: "Platinum",  dot: "#E5E4E2" },
  { value: "palladium", label: "Palladium", dot: "#9FA8C7" },
];

export function CreateAlertForm() {
  const router = useRouter();

  const [metal, setMetal]         = useState("gold");
  const [direction, setDirection] = useState("above");
  const [price, setPrice]         = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const res = await fetch("/api/alerts/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ metal, direction, price: Number(price), type: "price" }),
    });

    if (res.status === 402) {
      const checkout = await fetch("/api/billing/checkout", { method: "POST" });
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

  const inputClass =
    "w-full rounded-lg bg-black border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors";

  return (
    <form onSubmit={submit} className="rounded-2xl border border-white/5 bg-gray-950 p-6 space-y-6">

      {/* Metal picker */}
      <div className="space-y-2">
        <label className="label">Metal</label>
        <div className="grid grid-cols-2 gap-2">
          {METALS.map(({ value, label, dot }) => (
            <button
              key={value}
              type="button"
              onClick={() => setMetal(value)}
              className={`rounded-xl border px-4 py-3 text-sm font-semibold text-left transition-all ${
                metal === value
                  ? "border-white/10 bg-white/5 text-white"
                  : "border-white/5 bg-black text-gray-500 hover:border-white/10 hover:text-gray-300"
              }`}
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: dot }} />
                <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
              </div>
              <span className="text-xs text-gray-600 font-mono pl-3">
                {value === "gold" ? "XAU" : value === "silver" ? "XAG" : value === "platinum" ? "XPT" : "XPD"}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Condition */}
      <div className="space-y-2">
        <label className="label">Condition</label>
        <div className="flex gap-2">
          {[
            { value: "above", label: "Goes above" },
            { value: "below", label: "Goes below" },
          ].map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setDirection(value)}
              className={`flex-1 rounded-full border py-2.5 text-sm font-semibold transition-all ${
                direction === value
                  ? "border-amber-500/40 bg-amber-500/10 text-white"
                  : "border-white/5 bg-black text-gray-500 hover:border-white/10 hover:text-gray-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Target price */}
      <div className="space-y-2">
        <label className="label">Target Price (USD / oz)</label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-600">$</span>
          <input
            type="number"
            inputMode="decimal"
            required
            value={price}
            onChange={e => setPrice(e.target.value)}
            placeholder="2500.00"
            className={`${inputClass} pl-7`}
          />
        </div>
      </div>

      {error && (
        <p className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-amber-500 py-3 text-sm font-bold text-black hover:bg-amber-400 transition-colors disabled:opacity-50"
      >
        {submitting ? "Creating…" : "Create Alert"}
      </button>
    </form>
  );
}
