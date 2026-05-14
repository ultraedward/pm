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

  const fieldClass =
    "w-full rounded-lg px-3 py-2.5 text-sm text-white bg-white/5 border focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors";
  const fieldStyle = { borderColor: "var(--border)", backgroundColor: "var(--surface)" };
  const labelClass = "block text-xs font-semibold uppercase tracking-wider mb-1.5";
  const labelStyle = { color: "var(--text-muted)" };

  return (
    <div className="space-y-5">
      {error && (
        <p role="alert" className="text-sm rounded-lg px-3 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20">
          {error}
        </p>
      )}
      {success && (
        <p role="status" className="text-sm rounded-lg px-3 py-2.5 bg-amber-500/10 border border-amber-500/20" style={{ color: "var(--gold)" }}>
          Alert created — you&rsquo;ll get an email when spot crosses your target.
        </p>
      )}

      <div>
        <label htmlFor="alertform-metal" className={labelClass} style={labelStyle}>Metal</label>
        <select
          id="alertform-metal"
          value={metal}
          onChange={(e) => setMetal(e.target.value)}
          className={fieldClass}
          style={fieldStyle}
        >
          <option value="gold">Gold</option>
          <option value="silver">Silver</option>
          <option value="platinum">Platinum</option>
          <option value="palladium">Palladium</option>
        </select>
      </div>

      <div>
        <label htmlFor="alertform-direction" className={labelClass} style={labelStyle}>Direction</label>
        <select
          id="alertform-direction"
          value={direction}
          onChange={(e) => setDirection(e.target.value as "above" | "below")}
          className={fieldClass}
          style={fieldStyle}
        >
          <option value="above">Above — alert me when price rises past my target</option>
          <option value="below">Below — alert me when price drops to my target</option>
        </select>
      </div>

      <div>
        <label htmlFor="alertform-target" className={labelClass} style={labelStyle}>Target Price (USD / oz)</label>
        <input
          id="alertform-target"
          type="number"
          inputMode="decimal"
          placeholder="e.g. 3000"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className={fieldClass}
          style={fieldStyle}
        />
      </div>

      <div>
        <label htmlFor="alertform-frequency" className={labelClass} style={labelStyle}>Notification frequency</label>
        <select
          id="alertform-frequency"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as Frequency)}
          className={fieldClass}
          style={fieldStyle}
        >
          <option value="once">Once — fire once, then deactivate</option>
          <option value="once_per_day">Once per day — while price remains past target</option>
          <option value="once_per_hour">Once per hour — while price remains past target</option>
          <option value="trailing_stop">Trailing stop — target moves as price improves</option>
        </select>
      </div>

      {frequency === "trailing_stop" && (
        <div>
          <label htmlFor="alertform-trailing" className={labelClass} style={labelStyle}>
            Trailing Offset (USD)
          </label>
          <input
            id="alertform-trailing"
            type="number"
            inputMode="decimal"
            placeholder="e.g. 50"
            value={trailingOffset}
            onChange={(e) => setTrailingOffset(e.target.value)}
            aria-describedby="alertform-trailing-hint"
            className={fieldClass}
            style={fieldStyle}
          />
          <p id="alertform-trailing-hint" className="text-xs mt-1.5" style={{ color: "var(--text-dim)" }}>
            The target price moves up (for &ldquo;above&rdquo; alerts) as spot rises, locking in gains. Fire when price drops by this offset from its peak.
          </p>
        </div>
      )}

      <button
        disabled={loading}
        onClick={submit}
        className="btn-gold w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Creating…" : "Create Alert"}
      </button>
    </div>
  );
}