import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  /**
   * We treat alerts triggered AFTER the user's last visit
   * to the activity page as "unread".
   *
   * For now, unread = all triggers in last 24h.
   * (We’ll make this smarter in Step 6.)
   */
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const unreadCount = await prisma.alertTrigger.count({
    where: {
      alert: {
        userId: session.user.id,
      },
      triggeredAt: {
        gte: since,
      },
    },
  });

  return NextResponse.json({ unread: unreadCount });
}