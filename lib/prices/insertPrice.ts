import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function insertPrice(metal: string, price: number) {
  // Hard safety rails
  if (!metal || typeof metal !== 'string') {
    throw new Error('Invalid metal');
  }

  if (typeof price !== 'number' || Number.isNaN(price)) {
    throw new Error('Invalid price');
  }

  // Absolute sanity bounds
  if (price < 1 || price > 10000) {
    return { skipped: true, reason: 'price out of bounds' };
  }

  return prisma.priceHistory.create({
    data: {
      metal,
      price,
      timestamp: new Date(),
    },
  });
}