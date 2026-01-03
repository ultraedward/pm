import prisma from "@/lib/prisma";

export async function getAuthSession() {
  const user = await prisma.user.findFirst({
    select: {
      id: true,
      email: true,
    },
  });

  if (!user) return null;

  return {
    user: {
      id: user.id,
      email: user.email,
    },
  };
}
