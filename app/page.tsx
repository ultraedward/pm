import { requireUser } from "@/lib/requireUser";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const sessionUser = await requireUser();

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      subscriptionStatus: true,
    },
  });

  const isPro = user?.subscriptionStatus === "active";

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">
      <h1 className="text-3xl font-bold">Precious Metals Tracker</h1>

      {isPro ? (
        <p className="text-green-400">Pro account active ✅</p>
      ) : (
        <p className="text-yellow-400">Free plan</p>
      )}
    </div>
  );
}