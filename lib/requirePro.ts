// lib/requirePro.ts
// FULL SHEET — COPY / PASTE ENTIRE FILE
// Pro gating disabled until Stripe fields exist on User model

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Temporary no-op pro guard.
 * Always allows access as long as user is authenticated.
 */
export async function requirePro() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // Pro gating disabled for now
  return true;
}
