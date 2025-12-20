import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { alertId, targetPrice } = req.body;

  if (!alertId || !targetPrice) {
    return res.status(400).json({ error: "Missing fields" });
  }

  await prisma.alert.update({
    where: { id: alertId },
    data: { targetPrice },
  });

  res.status(200).json({ success: true });
}
