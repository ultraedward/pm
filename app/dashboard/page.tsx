export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import MetalDashboard from "@/components/MetalDashboard";
import Link from "next/link";

export default async function DashboardPage() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return <div className="p-10 text-white">Unauthorized</div>;
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { alerts: true },
    });

    if (!user) {
      return <div className="p-10 text-white">User not found</div>;
    }

    const goldPrice = await prisma.price.findFirst({
      where: { metal: "gold" },
      orderBy: { timestamp: "desc" },
    });

    const silverPrice = await prisma.price.findFirst({
      where: { metal: "silver" },
      orderBy: { timestamp: "desc" },
    });

    const holdings = await prisma.holding.findMany({
      where: { userId: user.id },
    });

    return (
      <main className="min-h-screen bg-black p-10 text-white">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-green-400 mt-4">
            Dashboard loaded successfully
          </p>
        </div>
      </main>
    );
  } catch (err: any) {
    console.error("DASHBOARD ERROR:", err);

    return (
      <main className="min-h-screen bg-black p-10 text-red-500">
        <h1 className="text-2xl font-bold">Dashboard Error</h1>
        <pre className="mt-4 text-sm">
          {JSON.stringify(err?.message || err, null, 2)}
        </pre>
      </main>
    );
  }
}