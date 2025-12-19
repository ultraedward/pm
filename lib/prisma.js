import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

const prismaClient =
  globalForPrisma.__prismaClient__ ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__prismaClient__ = prismaClient;
}

// Support BOTH:
//   import prisma from "../lib/prisma.js"
//   import { prisma } from "../lib/prisma.js"
export const prisma = prismaClient;
export default prismaClient;
