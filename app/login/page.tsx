"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-bold text-center">
          Sign in
        </h1>

        <input
          type="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded bg-zinc-900 border border-zinc-700"
        />

        <button
          onClick={() =>
            signIn("email", {
              email,
              callbackUrl: "/dashboard",
            })
          }
          className="w-full py-3 bg-white text-black font-semibold rounded"
        >
          Send magic link
        </button>
      </div>
    </div>
  );
}
