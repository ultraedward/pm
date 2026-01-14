"use client";

import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <button
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        className="rounded bg-black px-6 py-3 text-white"
      >
        Sign in with Google
      </button>
    </div>
  );
}
