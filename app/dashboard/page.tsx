// app/dashboard/page.tsx
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import UpgradeButton from "./UpgradeButton"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return <div>Please sign in</div>
  }

  // 🔴 THIS IS THE FIX
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isPro: true },
  })

  const isPro = user?.isPro === true

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Dashboard</h1>

      <p>
        Signed in as <strong>{session.user.email}</strong>
      </p>

      <p>
        Plan:{" "}
        <strong className={isPro ? "text-green-600" : "text-gray-500"}>
          {isPro ? "PRO" : "FREE"}
        </strong>
      </p>

      {!isPro && <UpgradeButton />}
    </main>
  )
}
