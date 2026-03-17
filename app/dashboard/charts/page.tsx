import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ChartsClient } from "./ChartsClient";

export const dynamic = "force-dynamic";

export default async function ChartsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  return (
    <main className="min-h-screen bg-surface p-8 text-white">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <p className="label mb-1">Charts</p>
          <h1 className="text-3xl font-black tracking-tight">Price History</h1>
        </div>
        <ChartsClient />
      </div>
    </main>
  );
}
