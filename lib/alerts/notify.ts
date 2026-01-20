import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function notifyTrigger(triggerId: string) {
  await prisma.alertTrigger.update({
    where: { id: triggerId },
    data: { deliveredAt: new Date() }
  });

  console.log('NOTIFIED:', triggerId);
}
