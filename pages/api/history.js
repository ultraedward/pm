import { prisma } from "../../lib/prisma.js";

export default async function handler(req, res) {
  const take = Math.min(Number(req.query.take || 50), 200);

  try {
    const rows = await prisma.comparison.findMany({
      orderBy: { createdAt: "desc" },
      take
    });
    res.status(200).json(rows);
  } catch {
    res.status(200).json([]);
  }
}
