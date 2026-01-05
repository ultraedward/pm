// app/login/page.tsx

"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm rounded-xl border p-6 text-center">
        <h1 className="mb-4 text-2xl font-semibold">
          Sign in
        </h1>

        <button
          onClick={() =>
            signIn("google", {
              callbackUrl: "/dashboard",
            })
          }
          className="w-full rounded-lg bg-black px-4 py-3 text-white hover:bg-gray-800"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
