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

    if (!res.ok) {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
      return;
    }

    router.push("/dashboard/alerts");
  }

  const inputClass =
    "w-full rounded-lg bg-black border border-white/10 px-3 py-2.5 text-base text-white focus:outline-none focus:border-amber-500/50 transition-colors";

  return (
    <form onSubmit={submit} className="rounded-2xl border p-6 space-y-6" style={{ borderColor: "var(--border)", background: "rgba(0,0,0,0.3)" }}>

      {/* Metal picker — role="group" makes screen readers announce "Metal" before
          the individual button names, matching what a fieldset/legend would do */}
      <div className="space-y-2" role="group" aria-labelledby="alert-metal-label">
        <p id="alert-metal-label" className="label">Metal</p>
        <div className="grid grid-cols-2 gap-2">
          {METALS.map(({ value, label, dot }) => (
            <button
              key={value}
              type="button"
              onClick={() => setMetal(value)}
              aria-pressed={metal === value}
              className={`rounded-xl border px-4 py-3 text-sm font-semibold text-left transition-all ${
                metal === value
                  ? "border-white/10 bg-white/5 text-white"
                  : "border-white/5 bg-black text-gray-500 hover:border-white/10 hover:text-gray-300"
              }`}
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: dot }} />
                <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
              </div>
              <span aria-hidden="true" className="text-xs text-gray-600 font-mono pl-3">
                {value === "gold" ? "XAU" : value === "silver" ? "XAG" : value === "platinum" ? "XPT" : "XPD"}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Condition */}
      <div className="space-y-2" role="group" aria-labelledby="alert-condition-label">
        <p id="alert-condition-label" className="label">Condition</p>
        <div className="flex gap-2">
          {[
            { value: "above", label: "Goes above" },
            { value: "below", label: "Goes below" },
          ].map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setDirection(value)}
              aria-pressed={direction === value}
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

      {/* Target price — label linked to input via htmlFor/id */}
      <div className="space-y-2">
        <label htmlFor="alert-target-price" className="label">Target Price (USD / oz)</label>
        <div className="relative">
          <span aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-600">$</span>
          <input
            id="alert-target-price"
            type="number"
            inputMode="decimal"
            required
            value={price}
            onChange={e => setPrice(e.target.value)}
            placeholder="2500.00"
            aria-describedby={error ? "alert-form-error" : undefined}
            className={`${inputClass} pl-7`}
          />
        </div>
      </div>

      {error && (
        <p id="alert-form-error" role="alert" className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="btn-gold w-full py-3 text-sm disabled:opacity-50"
      >
        {submitting ? "Creating…" : "Create Alert"}
      </button>
    </form>
  );
}
