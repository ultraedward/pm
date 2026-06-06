"use client";

import { useState } from "react";

export function EmailCapture({ source }: { source: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setState("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source }),
      });

      if (!res.ok) throw new Error();
      setState("success");
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div
        className="border px-6 py-5 text-center space-y-1"
        style={{ borderColor: "var(--gold-glow)", background: "var(--gold-dim)" }}
      >
        <p className="text-sm font-bold" style={{ color: "var(--gold)" }}>You&apos;re in.</p>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>Spot prices land in your inbox every Monday.</p>
      </div>
    );
  }

  return (
    <div
      className="border px-6 py-5 space-y-3"
      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
    >
      <div>
        <p className="text-sm font-bold" style={{ color: "var(--text)" }}>Get Monday spot prices — free</p>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Gold, silver, platinum &amp; palladium in your inbox every week. No account needed.</p>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        {/* sr-only label associates the input with its purpose for screen readers */}
        <label htmlFor="email-capture-input" className="sr-only">
          Email address
        </label>
        <input
          id="email-capture-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          aria-describedby={state === "error" ? "email-capture-error" : undefined}
          data-placeholder-muted
          className="flex-1 min-w-0 border px-4 py-2.5 text-sm focus:outline-none transition-colors"
          style={{ background: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--text)" }}
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="btn-gold px-5 py-2.5 text-[10px] disabled:opacity-60 whitespace-nowrap"
        >
          {state === "loading" ? (
            <><span aria-hidden="true">…</span><span className="sr-only">Subscribing…</span></>
          ) : "Subscribe"}
        </button>
      </form>
      {state === "error" && (
        <p id="email-capture-error" role="alert" className="text-xs text-red-400">Something went wrong — try again.</p>
      )}
    </div>
  );
}
