"use client";

import { ReactNode } from "react";
import { useSession } from "next-auth/react";

const ADMIN_EMAILS = [
  "admin@example.com", // replace with real admin emails
];

export default function AdminOnly({
  children,
}: {
  children: ReactNode;
}) {
  const { data: session } = useSession();
  const user = session?.user;

  if (!user) return null;

  // Explicitly guard against null / undefined email
  if (!user.email) return null;

  if (!ADMIN_EMAILS.includes(user.email)) return null;

  return <>{children}</>;
}
