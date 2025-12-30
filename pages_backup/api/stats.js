import { prisma } from "../../lib/prisma";
import { getSession } from "../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await getSession(req);

    if (!session?.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = session.user.id;

    // These MUST be independent and safe
    const [alertsTotal, alertsActive, subscription] = await Promise.all([
      prisma.alert.count({ where: { userId } }),
      prisma.alert.count({ where: { userId, status: "active" } }),
      prisma.subscription.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return res.status(200).json({
      alertsTotal: alertsTotal || 0,
      alertsActive: alertsActive || 0,
      subscriptionStatus: subscription?.status || "none",
    });
  } catch (error) {
    console.error("Stats API error:", error);
    return res.status(200).json({
      alertsTotal: 0,
      alertsActive: 0,
      subscriptionStatus: "unknown",
    });
  }
}
