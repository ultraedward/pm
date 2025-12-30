"use client";

import { useState } from "react";

export default function SignInPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit() {
    setError("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!res.ok) {
      setError("Invalid password");
      return;
    }

    window.location.href = "/";
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="border border-gray-800 bg-gray-900 rounded-xl p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4">PM Tracker</h1>

        <input
          type="password"
          placeholder="Access password"
          className="w-full mb-4 bg-black border border-gray-700 p-3 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <div className="text-red-500 text-sm mb-3">
            {error}
          </div>
        )}

        <button
          onClick={submit}
          className="w-full bg-white text-black py-2 rounded font-semibold"
        >
          Enter
        </button>
      </div>
    </main>
  );
}
