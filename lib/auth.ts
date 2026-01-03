import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

type CurrentUser = {
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null;
  }

  const user = session.user as CurrentUser;

  if (!user.id) {
    return null;
  }

  return user;
}
