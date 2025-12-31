"use client";

import { signIn } from "next-auth/react";

export const dynamic = "force-dynamic";

export default function SignInPage() {
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
        Please sign in to continue.
      </p>

      <button
        onClick={() => signIn("credentials")}
        style={{
          width: "100%",
          padding: "12px 16px",
          background: "black",
          color: "white",
          borderRadius: 6,
          fontSize: 16,
          cursor: "pointer",
        }}
      >
        Sign in
      </button>
    </main>
  );
}
