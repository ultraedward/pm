"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  return (
    <div style={{ padding: 40 }}>
      <h1>Login</h1>

      <button
        onClick={() =>
          signIn("email", {
            callbackUrl: "/dashboard",
          })
        }
      >
        Login with Email
      </button>
    </div>
  );
}
