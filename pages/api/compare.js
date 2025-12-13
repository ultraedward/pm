import { prisma } from "../../lib/prisma.js";
import { getSessionFromReq } from "../../lib/auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { metal, spot, dealerPrice } = req.body || {};
  const premiumPct = ((Number(dealerPrice) - Number(spot)) / Number(spot)) * 100;

  const row = await prisma.comparison.create({
    data: { metal, spot: Number(spot), dealerPrice: Number(dealerPrice), premiumPct }
  });

  // optional alert check for logged-in user
  const session = await getSessionFromReq(req);
  if (session?.user?.id) {
    const alerts = await prisma.alert.findMany({
      where: { userId: session.user.id, metal, isActive: true }
    });
    const triggered = alerts.filter(a => premiumPct <= a.threshold).map(a => a.id);
    return res.status(200).json({ ...row, triggered });
  }

  res.status(200).json(row);
}
