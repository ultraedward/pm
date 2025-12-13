import { prisma } from "../../lib/prisma.js";
import { getSessionFromReq } from "../../lib/auth.js";

export default async function handler(req, res) {
  const session = await getSessionFromReq(req);
  if (!session?.user?.id) return res.status(401).json({ ok: false });

  if (req.method === "GET") {
    const alerts = await prisma.alert.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" }
    });
    return res.status(200).json(alerts);
  }

  if (req.method === "POST") {
    const { metal, threshold } = req.body || {};
    const alert = await prisma.alert.create({
      data: { userId: session.user.id, metal: String(metal), threshold: Number(threshold) }
    });
    return res.status(200).json(alert);
  }

  if (req.method === "PATCH") {
    const { id, isActive } = req.body || {};
    const alert = await prisma.alert.update({
      where: { id: String(id) },
      data: { isActive: Boolean(isActive) }
    });
    return res.status(200).json(alert);
  }

  return res.status(405).end();
}
