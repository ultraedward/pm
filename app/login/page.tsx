"use client";

import { useEffect } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  useEffect(() => {
    const callbackUrl =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("callbackUrl") ||
          "/dashboard"
        : "/dashboard";

    signIn("credentials", {
      redirect: true,
      callbackUrl,
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
      Signing you in…
    </div>
  );
}
