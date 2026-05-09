"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

type State = "idle" | "loading" | "sent" | "error";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setState("loading");
    try {
      const result = await signIn("email", {
        email: email.trim(),
        callbackUrl: "/dashboard",
        redirect: false,
      });
      setState(result?.error ? "error" : "sent");
    } catch {
      setState("error");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "var(--bg)" }}>
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <div
          className="h-[600px] w-[600px] rounded-full blur-[120px]"
          style={{ background: "radial-gradient(circle, #D4AF37 0%, transparent 70%)", opacity: 0.07 }}
        />
      </div>

      <div className="relative w-full max-w-sm space-y-10 text-center">
        {/* Wordmark + headline */}
        <div className="space-y-4 animate-fade-up">
          <p className="label" style={{ color: "var(--gold-bright)" }}>Lode</p>
          <h1
            className="font-black leading-none"
            style={{
              fontSize: "clamp(2.75rem, 10vw, 3.75rem)",
              letterSpacing: "-0.04em",
              color: "var(--text)",
            }}
          >
            Track your stack.
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Free alerts, portfolio tracking, and a weekly digest.
          </p>
        </div>

        {/* Auth */}
        {state === "sent" ? (
          /* ── Sent confirmation ── */
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-8 space-y-3">
              <p className="text-xl font-black tracking-tight" style={{ color: "var(--text)" }}>
                Check your inbox.
              </p>
              <p className="text-sm text-gray-500 leading-relaxed">
                We sent a sign-in link to{" "}
                <span className="text-gray-300 font-medium">{email}</span>.
                Click it to continue — no password needed.
              </p>
            </div>
            <button
              onClick={() => { setState("idle"); setEmail(""); }}
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
            >
              Use a different email
            </button>
          </div>
        ) : (
          /* ── Sign-in options ── */
          <div className="space-y-4 animate-fade-up animate-delay-100">
            {/* Google */}
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="google-signin-btn flex w-full items-center justify-center gap-3 rounded-full px-6 py-4 text-sm font-semibold transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
                <path d="M47.5 24.5c0-1.6-.1-3.2-.4-4.7H24v9h13.2c-.6 3-2.3 5.5-4.8 7.2v6h7.7c4.5-4.2 7.4-10.3 7.4-17.5z" fill="#4285F4"/>
                <path d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.7-6c-2.1 1.4-4.9 2.3-8.2 2.3-6.3 0-11.6-4.2-13.5-9.9H2.5v6.2C6.5 42.9 14.7 48 24 48z" fill="#34A853"/>
                <path d="M10.5 28.6A14.7 14.7 0 0 1 9.5 24c0-1.6.3-3.1.7-4.6v-6.2H2.5A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.5 10.8l8-6.2z" fill="#FBBC05"/>
                <path d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.4 30.5 0 24 0 14.7 0 6.5 5.1 2.5 13.2l8 6.2C12.4 13.7 17.7 9.5 24 9.5z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs text-gray-600">or</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Email magic link */}
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={state === "loading"}
                className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-500/40 transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={state === "loading" || !email.trim()}
                className="w-full rounded-full border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold text-gray-300 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {state === "loading" ? "Sending…" : "Send sign-in link"}
              </button>
            </form>

            {state === "error" && (
              <p className="text-xs text-red-400">Something went wrong — please try again.</p>
            )}

            <p className="text-xs text-gray-700 leading-relaxed">
              By continuing you agree to our{" "}
              <a href="/terms" className="hover:text-gray-400 transition-colors">Terms</a>
              {" "}and{" "}
              <a href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</a>.
              {" "}No password. No card.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
