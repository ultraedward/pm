// app/api/auth/[...nextauth]/route.ts
// FULL FILE — COPY / PASTE (FINAL)

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// 🔴 REQUIRED: NextAuth + Prisma MUST run on Node
export const runtime = "nodejs";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
