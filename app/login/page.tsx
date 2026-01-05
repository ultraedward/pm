"use client";

import { Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

function LoginInner() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const error = searchParams.get("error");

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-semibold text-center">Login</h1>

        {error && (
          <p className="text-red-500 text-sm text-center">
            Authentication failed. Try again.
          </p>
        )}

        <button
          onClick={() =>
            signIn("credentials", {
              callbackUrl,
            })
          }
          className="w-full py-2 rounded bg-white text-black font-medium hover:bg-gray-200 transition"
        >
          Sign in (DEV)
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}
