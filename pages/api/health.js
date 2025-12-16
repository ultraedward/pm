import { prisma } from "../../lib/prisma.js";

export default async function handler(req, res) {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ ok: true });
  } catch {
    res.status(500).json({ ok: false });
  }
}
