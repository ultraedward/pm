import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BottomNavClient } from "./BottomNavClient";

export default async function BottomNav() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;
  return <BottomNavClient />;
}
