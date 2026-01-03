import prisma from "@/lib/prisma";

export default async function DashboardPage() {
  // Fetch full user record (schema-safe)
  const user = await prisma.user.findFirst();

  // Derive "pro" safely without assuming schema
  const stripeStatus =
    (user as any)?.stripeStatus ||
    (user as any)?.stripe_status ||
    null;

  const pro = stripeStatus === "active";

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <p className="text-sm text-muted-foreground">
        Account type:{" "}
        <span className="font-medium">
          {pro ? "Pro" : "Free"}
        </span>
      </p>

      {pro ? (
        <div className="rounded-lg border p-4">
          <p className="font-medium">Pro features enabled</p>
        </div>
      ) : (
        <div className="rounded-lg border p-4">
          <p className="font-medium">Upgrade to Pro to unlock features</p>
        </div>
      )}
    </div>
  );
}
