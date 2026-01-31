/*
  Warnings:

  - You are about to drop the column `lastError` on the `EmailLog` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `EmailLog` table. All the data in the column will be lost.
  - You are about to drop the column `providerId` on the `EmailLog` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "EmailLog_status_idx";

-- AlterTable
ALTER TABLE "EmailLog" DROP COLUMN "lastError",
DROP COLUMN "provider",
DROP COLUMN "providerId",
ADD COLUMN     "error" TEXT;
