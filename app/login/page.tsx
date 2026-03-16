"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-surface flex items-center justify-center px-6">
      {/* Ambient glow — stronger */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[600px] w-[600px] rounded-full blur-[120px]" style={{ background: "radial-gradient(circle, #D4AF37 0%, transparent 70%)", opacity: 0.08 }} />
      </div>

      <div className="relative w-full max-w-sm space-y-12 text-center">
        {/* Wordmark + headline */}
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--gold-bright)" }}>
            Lode
          </p>
          <h1 className="text-5xl font-black tracking-tightest text-white leading-none">
            Sign in
          </h1>
          <p className="text-sm text-gray-500">
            Gold, silver, platinum, and palladium — tracked.
          </p>
        </div>

        {/* Action */}
        <div className="space-y-4">
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="flex w-full items-center justify-center gap-3 rounded-full bg-white px-6 py-4 text-sm font-semibold text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
              <path d="M47.5 24.5c0-1.6-.1-3.2-.4-4.7H24v9h13.2c-.6 3-2.3 5.5-4.8 7.2v6h7.7c4.5-4.2 7.4-10.3 7.4-17.5z" fill="#4285F4"/>
              <path d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.7-6c-2.1 1.4-4.9 2.3-8.2 2.3-6.3 0-11.6-4.2-13.5-9.9H2.5v6.2C6.5 42.9 14.7 48 24 48z" fill="#34A853"/>
              <path d="M10.5 28.6A14.7 14.7 0 0 1 9.5 24c0-1.6.3-3.1.7-4.6v-6.2H2.5A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.5 10.8l8-6.2z" fill="#FBBC05"/>
              <path d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.4 30.5 0 24 0 14.7 0 6.5 5.1 2.5 13.2l8 6.2C12.4 13.7 17.7 9.5 24 9.5z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-xs text-gray-700 leading-relaxed">
            By signing in you agree to our{" "}
            <a href="/terms" className="hover:text-gray-400 transition-colors">Terms</a>
            {" "}and{" "}
            <a href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</a>.
            {" "}Your account is created on first sign-in.
          </p>
        </div>
      </div>
    </main>
  );
}
