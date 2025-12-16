import { prisma } from "../../lib/prisma";
import { getSessionFromReq } from "../../lib/auth";

export default async function handler(req, res) {
  const session = await getSessionFromReq(req);

  if (!session?.user?.id) {
    return res.status(401).json({ error: "LOGIN_REQUIRED" });
  }

  if (req.method === "GET") {
    const alerts = await prisma.alert.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" }
    });
    return res.json(alerts);
  }

  if (req.method === "POST") {
    const { metal, threshold } = req.body;

    const alert = await prisma.alert.create({
      data: {
        metal,
        threshold: Number(threshold),
        userId: session.user.id,
        isActive: true
      }
    });

    return res.json(alert);
  }

  res.status(405).end();
}
