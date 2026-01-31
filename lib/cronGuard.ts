import { prisma } from "./prisma";

export async function cronIsEnabled(): Promise<boolean> {
  const row = await prisma.cronControl.findUnique({
    where: { id: 1 },
  });

  // default to SAFE (disabled) if row missing
  return row?.cronEnabled ?? false;
}