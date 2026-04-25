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
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 px-6 py-5 text-center space-y-1">
        <p className="text-sm font-bold text-amber-400">You&apos;re in.</p>
        <p className="text-xs text-gray-500">Spot prices land in your inbox every Monday.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/5 bg-gray-950 px-6 py-5 space-y-3">
      <div>
        <p className="text-sm font-bold text-white">Get Monday spot prices — free</p>
        <p className="text-xs text-gray-500 mt-0.5">Gold, silver, platinum &amp; palladium in your inbox every week. No account needed.</p>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 min-w-0 rounded-full bg-black border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-gray-700 focus:outline-none focus:border-amber-500/50 transition-colors"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="rounded-full bg-amber-500 px-5 py-2.5 text-sm font-bold text-black hover:bg-amber-400 transition-colors disabled:opacity-60 whitespace-nowrap"
        >
          {state === "loading" ? "..." : "Subscribe"}
        </button>
      </form>
      {state === "error" && (
        <p className="text-xs text-red-400">Something went wrong — try again.</p>
      )}
    </div>
  );
}
