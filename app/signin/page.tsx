"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export const dynamic = "force-dynamic";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    setLoading(true);
    await signIn("credentials", {
      email,
      callbackUrl: "/dashboard",
    });
  }

  return (
    <main
      style={{
        padding: 32,
        maxWidth: 420,
        margin: "80px auto",
        border: "1px solid #e5e5e5",
        borderRadius: 8,
      }}
    >
      <h1 style={{ fontSize: 24, marginBottom: 12 }}>Sign in</h1>
      <p style={{ color: "#666", marginBottom: 24 }}>
        Enter any email to continue (dev mode).
      </p>

      <input
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          width: "100%",
          padding: "10px 12px",
          marginBottom: 16,
          borderRadius: 6,
          border: "1px solid #ccc",
          fontSize: 14,
        }}
      />

      <button
        onClick={handleSignIn}
        disabled={!email || loading}
        style={{
          width: "100%",
          padding: "12px 16px",
          background: email ? "black" : "#999",
          color: "white",
          borderRadius: 6,
          fontSize: 16,
          cursor: email ? "pointer" : "not-allowed",
        }}
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </main>
  );
}
