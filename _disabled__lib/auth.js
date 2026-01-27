import { prisma } from "./prisma";
import { cookies } from "next/headers";

export async function getCurrentUser() {
  const email = cookies().get("pm_user")?.value;
  if (!email) return null;

  return prisma.user.findUnique({ where: { email } });
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return user;
}
