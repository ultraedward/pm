import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

async function getLatestPrice(metal: string) {
  return prisma.price.findFirst({
    where: { metal },
    orderBy: { timestamp: "desc" },
  });
}

/* ============================= */
/*        SERVER ACTIONS         */
/* ============================= */

async function addHolding(formData: FormData) {
  "use server";

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return;

  const metal = formData.get("metal") as string;
  const ounces = Number(formData.get("ounces"));
  const purchasePrice = Number(formData.get("purchasePrice"));
  const purchaseDate = new Date(formData.get("purchaseDate") as string);

  if (!metal || !ounces || !purchasePrice || !purchaseDate) return;

  await prisma.holding.create({
    data: {
      userId: user.id,
      metal,
      ounces,
      purchasePrice,
      purchaseDate,
    },
  });

  revalidatePath("/dashboard/holdings");
}

async function deleteHolding(id: string) {
  "use server";

  await prisma.holding.delete({
    where: { id },
  });

  revalidatePath("/dashboard/holdings");
}

/* ============================= */
/*            PAGE               */
/* ============================= */

export default async function HoldingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return (
      <div className="p-10 text-white">
        Unauthorized
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return (
      <div className="p-10 text-white">
        User not found
      </div>
    );
  }

  const holdings = await prisma.holding.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const goldPrice = await getLatestPrice("gold");
  const silverPrice = await getLatestPrice("silver");

  return (
    <main className="min-h-screen bg-black p-10 text-white">
      <div className="mx-auto max-w-5xl space-y-10">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Your Holdings</h1>
          <Link
            href="/dashboard"
            className="rounded bg-gray-800 px-4 py-2 hover:bg-gray-700"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* ============================= */}
        {/*        ADD HOLDING FORM       */}
        {/* ============================= */}

        <div className="rounded-xl border border-gray-800 bg-gray-950 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Add Holding</h2>

          <form action={addHolding} className="grid gap-4 md:grid-cols-4">
            
            <select
              name="metal"
              required
              className="rounded bg-gray-900 border border-gray-700 px-3 py-2"
            >
              <option value="">Select Metal</option>
              <option value="gold">Gold</option>
              <option value="silver">Silver</option>
            </select>

            <input
              name="ounces"
              type="number"
              step="0.01"
              placeholder="Ounces"
              required
              className="rounded bg-gray-900 border border-gray-700 px-3 py-2"
            />

            <input
              name="purchasePrice"
              type="number"
              step="0.01"
              placeholder="Price per oz"
              required
              className="rounded bg-gray-900 border border-gray-700 px-3 py-2"
            />

            <input
              name="purchaseDate"
              type="date"
              required
              className="rounded bg-gray-900 border border-gray-700 px-3 py-2"
            />

            <button
              type="submit"
              className="md:col-span-4 rounded bg-green-600 py-2 hover:bg-green-500"
            >
              Add Holding
            </button>
          </form>
        </div>

        {/* ============================= */}
        {/*         HOLDINGS LIST         */}
        {/* ============================= */}

        {holdings.length === 0 && (
          <div className="rounded-xl border border-gray-800 bg-gray-950 p-6">
            <p className="text-gray-400">No holdings yet.</p>
          </div>
        )}

        <div className="grid gap-6">
          {holdings.map((h) => {
            const currentPrice =
              h.metal === "gold"
                ? goldPrice?.price ?? 0
                : silverPrice?.price ?? 0;

            const value = h.ounces * currentPrice;
            const invested = h.ounces * h.purchasePrice;
            const gainLoss = value - invested;
            const percent =
              invested > 0 ? (gainLoss / invested) * 100 : 0;

            return (
              <div
                key={h.id}
                className="rounded-xl border border-gray-800 bg-gray-950 p-6 space-y-4"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="text-lg font-semibold capitalize">
                      {h.metal}
                    </p>
                    <p className="text-sm text-gray-400">
                      {h.ounces.toFixed(2)} oz @ $
                      {h.purchasePrice.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Purchased{" "}
                      {new Date(h.purchaseDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-semibold">
                      ${value.toFixed(2)}
                    </p>
                    <p
                      className={`text-sm ${
                        gainLoss >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {gainLoss >= 0 ? "+" : ""}
                      ${gainLoss.toFixed(2)} (
                      {percent.toFixed(2)}%)
                    </p>
                  </div>
                </div>

                <form action={() => deleteHolding(h.id)}>
                  <button
                    type="submit"
                    className="rounded bg-red-600 px-3 py-1 text-sm hover:bg-red-500"
                  >
                    Delete
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}