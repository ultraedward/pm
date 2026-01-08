// lib/requirePro.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export type RequireProResult = {
  user: {
    id: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
    isPro: boolean;
  };
};

/**
 * Server-side PRO gate. Use inside:
 * - Route handlers (app/api/*)
 * - Server components
 *
 * Throws on:
 * - Not signed in
 * - Not PRO
 */
export async function requirePro(): Promise<RequireProResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("AUTH_REQUIRED");
  }

  // next-auth session typing doesn't always include custom fields
  const isPro = Boolean((session.user as any).isPro);

  if (!isPro) {
    throw new Error("PRO_REQUIRED");
  }

  return {
    user: {
      id: session.user.id,
      email: session.user.email ?? null,
      name: session.user.name ?? null,
      image: session.user.image ?? null,
      isPro: true,
    },
  };
}
