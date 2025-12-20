import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

const prismaClient =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prismaClient;
}

/**
 * Named export (for: import { prisma } from ...)
 */
export const prisma = prismaClient;

/**
 * Default export (for: import prisma from ...)
 */
export default prismaClient;
