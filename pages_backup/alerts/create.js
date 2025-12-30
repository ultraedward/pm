// pages/alerts/create.js
import Link from "next/link";
import { useMemo, useState } from "react";

const METALS = [
  { value: "XAU", label: "Gold (XAU)" },
  { value: "XAG", label: "Silver (XAG)" },
  { value: "XPT", label: "Platinum (XPT)" },
  { value: "XPD", label: "Palladium (XPD)" },
];

export default function CreateAlertPage() {
  const [metal, setMetal] = useState("XAU");
  const [direction, setDirection] = useState("above");
  const [target, setTarget] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const targetNum = Number(target);

  const isValidEmail = useMemo(() => {
    return typeof email === "string" && email.includes("@") && email.includes(".");
  }, [email]);

  const isValidTarget = useMemo(() => {
    return target && !Number.isNaN(targetNum) && targetNum > 0;
  }, [target, targetNum]);

  const isValid = isValidEmail && isValidTarget;

  async function submit(e) {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          metal,
          direction,
          target: targetNum,
        }),
      });

      if (!res.ok) throw new Error("Failed to create alert");

      setSuccess(true);
      setTarget("");
    } catch {
      setError("Could not create alert. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <section className="section sectionTight">
        <div className="shell">
          <div className="pageHeader">
            <div>
              <div className="eyebrow">Create</div>
              <h1 className="pageTitle">Set a price alert</h1>
              <p className="pageSub">
                Choose a metal and a target. Above = rises past target. Below = falls past target.
              </p>
            </div>

            <div className="pageHeaderRight">
              <Link href="/alerts" className="btn btnGhostLink">
                ← Back to Alerts
              </Link>
              <Link href="/" className="btn btnGhostLink">
                Prices
              </Link>
            </div>
          </div>

          <form className="card formCard formNike" onSubmit={submit} aria-label="Create alert form">
            <div className="field">
              <label className="label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                className="input"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="help">We’ll email you when the price crosses your target.</div>
            </div>

            <div className="grid2">
              <div className="field">
                <label className="label" htmlFor="metal">
                  Metal
                </label>
                <select
                  id="metal"
                  className="input"
                  value={metal}
                  onChange={(e) => setMetal(e.target.value)}
                >
                  {METALS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label className="label" htmlFor="direction">
                  Condition
                </label>
                <select
                  id="direction"
                  className="input"
                  value={direction}
                  onChange={(e) => setDirection(e.target.value)}
                >
                  <option value="above">Above (price rises past target)</option>
                  <option value="below">Below (price falls past target)</option>
                </select>
              </div>
            </div>

            <div className="field">
              <label className="label" htmlFor="target">
                Target price
              </label>
              <input
                id="target"
                className="input"
                type="number"
                step="0.01"
                inputMode="decimal"
                placeholder="e.g. 2100.00"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              />
              <div className="help">
                Example: “Notify me when {metal} goes {direction} $
                {direction === "above" ? "2100" : "1800"}”
              </div>
            </div>

            {error && (
              <div className="alert alertError" role="alert">
                {error}
              </div>
            )}

            {success && (
              <div className="alert alertSuccess" role="status" aria-live="polite">
                ✅ Alert created.{" "}
                <Link href="/alerts" className="inlineLink">
                  View alerts
                </Link>
              </div>
            )}

            <div className="formActions">
              <button className="btn btnPrimary btnLg" type="submit" disabled={!isValid || loading}>
                {loading ? "Creating…" : "Create alert"}
              </button>
              <Link href="/alerts" className="btn btnGhostLink btnLg">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
