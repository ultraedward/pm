"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await signIn("credentials", {
      password,
      redirect: true,
      callbackUrl: "/dashboard",
    });

    if (res?.error) {
      setError("Invalid password");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4"
      >
        <h1 className="text-xl font-semibold">Login</h1>

        <input
          type="password"
          placeholder="Password"
          className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          className="w-full py-2 bg-white text-black rounded"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
