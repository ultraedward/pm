// app/components/AdminOnly.tsx
// FULL FILE — COPY / PASTE

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type Props = {
  children: React.ReactNode;
};

/**
 * Server-side admin gate.
 * No client auth. No useSession(). No CLIENT_FETCH_ERROR.
 */
export default async function AdminOnly({ children }: Props) {
  const session = await getServerSession(authOptions);

  // Not signed in → hide content
  if (!session?.user?.email) {
    return null;
  }

  // Adjust this check however you want
  const isAdmin =
    session.user.email.endsWith("@gmail.com") || // example
    session.user.email === "you@example.com";

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
}
