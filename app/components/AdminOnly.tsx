import { ReactNode } from "react";
import { getCurrentUser } from "@/lib/auth";

const ADMIN_EMAILS = [
  "ultra.edward@gmail.com"
];

export default async function AdminOnly({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) return null;
  if (!ADMIN_EMAILS.includes(user.email)) return null;

  return <>{children}</>;
}
