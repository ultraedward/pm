"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

type Props = {
  /** Heading shown above the form */
  heading?: string;
  /** Sub-copy under the heading */
  subtext?: string;
  /** Where to land after the magic-link click */
  callbackUrl?: string;
  /** Layout: "row" = email + button side-by-side, "stack" = stacked */
  layout?: "row" | "stack";
};

type State = "idle" | "loading" | "sent" | "error";

/**
 * Inline email-capture form that signs the user in via magic link without
 * navigating away from the current page. Also surfaces the Google OAuth
 * option as a one-click alternative.
 */
export function InlineSignup({
  heading,
  subtext,
  callbackUrl = "/dashboard?onboarding=1",
  layout = "row",
}: Props) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setState("loading");
    try {
      const result = await signIn("email", {
        email: email.trim(),
        callbackUrl,
        redirect: false,
      });
      setState(result?.error ? "error" : "sent");
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div
        className="border px-6 py-6 space-y-2 text-center max-w-sm"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <p className="font-black text-white text-lg tracking-tight">Check your inbox.</p>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
          Sign-in link sent to{" "}
          <span className="text-gray-300 font-medium">{email}</span>.
        </p>
        <button
          onClick={() => { setState("idle"); setEmail(""); }}
          className="text-xs text-gray-600 hover:text-gray-400 transition-colors pt-1"
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {heading && (
        <p className="font-black text-white" style={{ fontSize: "clamp(1.25rem, 3vw, 1.75rem)", letterSpacing: "-0.03em" }}>
          {heading}
        </p>
      )}
      {subtext && (
        <p className="text-sm max-w-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
          {subtext}
        </p>
      )}

      {/* Google one-click */}
      <button
        onClick={() => signIn("google", { callbackUrl })}
        className="flex items-center justify-center gap-3 px-5 py-3 text-sm font-semibold transition-colors border w-full sm:w-auto"
        style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--text)" }}
      >
        <svg width="16" height="16" viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <path d="M47.5 24.5c0-1.6-.1-3.2-.4-4.7H24v9h13.2c-.6 3-2.3 5.5-4.8 7.2v6h7.7c4.5-4.2 7.4-10.3 7.4-17.5z" fill="#4285F4"/>
          <path d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.7-6c-2.1 1.4-4.9 2.3-8.2 2.3-6.3 0-11.6-4.2-13.5-9.9H2.5v6.2C6.5 42.9 14.7 48 24 48z" fill="#34A853"/>
          <path d="M10.5 28.6A14.7 14.7 0 0 1 9.5 24c0-1.6.3-3.1.7-4.6v-6.2H2.5A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.5 10.8l8-6.2z" fill="#FBBC05"/>
          <path d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.4 30.5 0 24 0 14.7 0 6.5 5.1 2.5 13.2l8 6.2C12.4 13.7 17.7 9.5 24 9.5z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 max-w-xs">
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
        <span className="text-xs" style={{ color: "var(--text-dim)" }}>or</span>
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
      </div>

      {/* Email form */}
      <form
        onSubmit={handleSubmit}
        className={layout === "row"
          ? "flex flex-col sm:flex-row items-stretch gap-2 max-w-sm"
          : "flex flex-col gap-2 max-w-sm"
        }
      >
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={state === "loading"}
          className="flex-1 border px-4 py-3 text-sm focus:outline-none transition-colors disabled:opacity-50"
          style={{ background: "var(--input-bg, var(--surface))", borderColor: "var(--input-border, var(--border))", color: "var(--text)" }}
        />
        <button
          type="submit"
          disabled={state === "loading" || !email.trim()}
          className="btn-ghost px-5 py-3 text-xs whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {state === "loading" ? "Sending…" : "Send link →"}
        </button>
      </form>

      {state === "error" && (
        <p className="text-xs text-red-400">Something went wrong — please try again.</p>
      )}

      <p className="text-xs" style={{ color: "var(--text-dim)" }}>
        Free. No password. No card.
      </p>
    </div>
  );
}
