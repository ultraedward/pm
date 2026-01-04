import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/* ---------------- SERVER ACTIONS ---------------- */

export async function toggleAlert(id: string) {
  "use server";
  const alert = await prisma.alert.findUnique({ where: { id } });
  if (!alert) return;

  await prisma.alert.update({
    where: { id },
    data: { enabled: !alert.enabled },
  });

  revalidatePath("/dashboard");
}

export async function deleteAlert(id: string) {
  "use server";
  await prisma.alert.delete({ where: { id } });
  revalidatePath("/dashboard");
}

export async function createAlert(formData: FormData) {
  "use server";

  const metal = formData.get("metal") as string;
  const direction = formData.get("direction") as string;
  const threshold = Number(formData.get("threshold"));

  const user = await getCurrentUser();
  if (!user) return;

  await prisma.alert.create({
    data: {
      userId: user.id,
      metal,
      direction,
      threshold,
      enabled: true,
    },
  });

  revalidatePath("/dashboard");
}

/* ---------------- PAGE ---------------- */

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const alerts = await prisma.alert.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Account type: <span className="font-medium">Free</span>
        </p>
      </div>

      <form
        action={createAlert}
        className="border rounded-lg p-4 grid grid-cols-1 md:grid-cols-4 gap-3"
      >
        <select name="metal" required className="border rounded px-3 py-2">
          <option value="gold">Gold</option>
          <option value="silver">Silver</option>
          <option value="platinum">Platinum</option>
        </select>

        <select name="direction" required className="border rounded px-3 py-2">
          <option value="above">Above</option>
          <option value="below">Below</option>
        </select>

        <input
          name="threshold"
          type="number"
          step="0.01"
          placeholder="Price"
          required
          className="border rounded px-3 py-2"
        />

        <button className="bg-black text-white rounded px-4 py-2">
          Add Alert
        </button>
      </form>

      <div className="space-y-3">
        {alerts.length === 0 && (
          <p className="text-sm text-gray-500">
            No alerts yet. Create one above.
          </p>
        )}

        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-center justify-between border rounded-lg px-4 py-3"
          >
            <div className="text-sm">
              <div className="font-medium capitalize">
                {alert.metal} {alert.direction} {alert.threshold}
              </div>
              <div className="text-gray-500">
                Status: {alert.enabled ? "On" : "Off"}
              </div>
            </div>

            <div className="flex gap-2">
              <form action={toggleAlert.bind(null, alert.id)}>
                <button className="text-sm px-3 py-1 border rounded">
                  {alert.enabled ? "Disable" : "Enable"}
                </button>
              </form>

              <form action={deleteAlert.bind(null, alert.id)}>
                <button className="text-sm px-3 py-1 border rounded text-red-600">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
