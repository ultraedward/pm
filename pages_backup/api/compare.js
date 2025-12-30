import { prisma } from "../../lib/prisma.js";
import { getSessionFromReq } from "../../lib/auth.js";
import { sendAlertEmail } from "../../lib/mailer.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { metal, spot, dealerPrice } = req.body;
  const premiumPct = ((dealerPrice - spot) / spot) * 100;

  const row = await prisma.comparison.create({
    data: {
      metal,
      spot: Number(spot),
      dealerPrice: Number(dealerPrice),
      premiumPct
    }
  });

  const session = await getSessionFromReq(req);

  if (session?.user?.id) {
    const alerts = await prisma.alert.findMany({
      where: {
        userId: session.user.id,
        metal,
        isActive: true
      }
    });

    for (const a of alerts) {
      if (premiumPct <= a.threshold) {
        await sendAlertEmail({
          to: session.user.email,
          metal,
          premium: premiumPct,
          threshold: a.threshold,
          spot: Number(spot),
          dealer: Number(dealerPrice)
        });
      }
    }
  }

  res.status(200).json(row);
}
