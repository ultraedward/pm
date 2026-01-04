// lib/auth.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  const email = session?.user?.email?.toLowerCase();
  if (!email) return null;

  const user = await prisma.user.findFirst({
    where: { email },
    select: { id: true, email: true },
  });

  return user;
}
