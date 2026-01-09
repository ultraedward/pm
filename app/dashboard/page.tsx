import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import ManageSubscriptionButton from "./ManageSubscriptionButton"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p>Please sign in to continue.</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Dashboard</h1>

      <div className="rounded border p-4">
        <p className="font-medium">
          Signed in as {session.user.email}
        </p>

        <p className="mt-1">
          Plan:{" "}
          <span className="font-semibold">
            {session.user.isPro ? "PRO" : "FREE"}
          </span>
        </p>

        {session.user.isPro && (
          <div className="mt-4">
            <ManageSubscriptionButton />
          </div>
        )}
      </div>
    </div>
  )
}
