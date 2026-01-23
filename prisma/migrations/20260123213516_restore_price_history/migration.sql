/*
  Warnings:

  - You are about to drop the column `targetPrice` on the `Alert` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Alert` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[alertId,price]` on the table `AlertTrigger` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `target` to the `Alert` table without a default value. This is not possible if the table is not empty.
  - Made the column `price` on table `AlertTrigger` required. This step will fail if there are existing NULL values in that column.
  - Made the column `triggeredAt` on table `AlertTrigger` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Alert" DROP CONSTRAINT "Alert_userId_fkey";

-- DropIndex
DROP INDEX "AlertTrigger_alertId_idx";

-- AlterTable
ALTER TABLE "Alert" DROP COLUMN "targetPrice",
DROP COLUMN "userId",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "target" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "AlertTrigger" ALTER COLUMN "price" SET NOT NULL,
ALTER COLUMN "triggeredAt" SET NOT NULL,
ALTER COLUMN "deliveredAt" SET DATA TYPE TIMESTAMP(3);

-- DropTable
DROP TABLE "User";

-- CreateIndex
CREATE UNIQUE INDEX "AlertTrigger_alertId_price_key" ON "AlertTrigger"("alertId", "price");
