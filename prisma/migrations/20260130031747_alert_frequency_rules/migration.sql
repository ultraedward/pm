/*
  Warnings:

  - You are about to drop the `Subscription` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "AlertFrequency" AS ENUM ('once', 'once_per_day', 'once_per_hour', 'trailing_stop');

-- AlterTable
ALTER TABLE "Alert" ADD COLUMN     "frequency" "AlertFrequency" NOT NULL DEFAULT 'once',
ADD COLUMN     "lastTriggeredAt" TIMESTAMP(3),
ADD COLUMN     "trailingOffset" DOUBLE PRECISION;

-- DropTable
DROP TABLE "Subscription";
