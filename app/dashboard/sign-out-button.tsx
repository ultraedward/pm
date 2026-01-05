// app/dashboard/sign-out-button.tsx

"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="rounded-lg bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
    >
      Sign out
    </button>
  );
}
