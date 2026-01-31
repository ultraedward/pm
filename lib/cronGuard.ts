import { prisma } from "@/lib/prisma";

export async function isCronEnabled(name: string): Promise<boolean> {
  const row = await prisma.cronControl.findUnique({
    where: { name },
  });

  if (!row) return true;
  return row.enabled;
}