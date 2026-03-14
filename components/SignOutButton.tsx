"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="text-sm text-red-500 hover:text-red-400 transition-colors"
    >
      Sign out
    </button>
  );
}
