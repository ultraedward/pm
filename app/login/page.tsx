"use client";

import { useEffect } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  useEffect(() => {
    signIn("credentials", {
      redirect: true,
      callbackUrl: "/dashboard",
    });
  }, []);

  return (
    <div className="flex items-center justify-center h-screen text-gray-500">
      Dev login…
    </div>
  );
}
