import { prisma } from "@/lib/prisma";

export async function deleteAlert(id: string) {
  await prisma.alert.delete({
    where: { id },
  });
}
