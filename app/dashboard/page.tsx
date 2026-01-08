import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import ManageSubscriptionButton from "./ManageSubscriptionButton"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect("/api/auth/signin")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      email: true,
      isPro: true,
    },
  })

  if (!user) {
    redirect("/api/auth/signin")
  }

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <p className="text-sm text-muted-foreground">
        Signed in as {user.email}
      </p>

      {user.isPro ? (
        <ManageSubscriptionButton />
      ) : (
        <p className="text-sm">
          You are on the free plan.
        </p>
      )}
    </main>
  )
}
