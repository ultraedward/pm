/*
  Warnings:

  - You are about to drop the column `error` on the `EmailLog` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `EmailLog` table. All the data in the column will be lost.
  - You are about to drop the `SpotPriceCache` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "AlertTrigger" ALTER COLUMN "triggered" SET DEFAULT false;

-- AlterTable
ALTER TABLE "EmailLog" DROP COLUMN "error",
DROP COLUMN "provider";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "image" TEXT,
ADD COLUMN     "stripeStatus" TEXT NOT NULL DEFAULT 'free';

-- DropTable
DROP TABLE "SpotPriceCache";
