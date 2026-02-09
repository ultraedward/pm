import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function requireUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return session.user;
}