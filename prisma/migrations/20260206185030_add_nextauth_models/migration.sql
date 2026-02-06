/*
  Warnings:

  - You are about to drop the column `createdAt` on the `AlertTrigger` table. All the data in the column will be lost.
  - You are about to drop the column `lastError` on the `EmailLog` table. All the data in the column will be lost.
  - You are about to drop the column `sentAt` on the `EmailLog` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `EmailLog` table. All the data in the column will be lost.
  - You are about to drop the `CronControl` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CronLock` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PriceHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subscription` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "Alert_metal_idx";

-- DropIndex
DROP INDEX "Alert_userId_idx";

-- DropIndex
DROP INDEX "AlertTrigger_alertId_idx";

-- DropIndex
DROP INDEX "AlertTrigger_triggeredAt_idx";

-- DropIndex
DROP INDEX "EmailLog_alertId_idx";

-- DropIndex
DROP INDEX "EmailLog_status_idx";

-- DropIndex
DROP INDEX "EmailLog_userId_idx";

-- AlterTable
ALTER TABLE "AlertTrigger" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "EmailLog" DROP COLUMN "lastError",
DROP COLUMN "sentAt",
DROP COLUMN "userId",
ALTER COLUMN "status" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerified" TIMESTAMP(3),
ADD COLUMN     "image" TEXT;

-- DropTable
DROP TABLE "CronControl";

-- DropTable
DROP TABLE "CronLock";

-- DropTable
DROP TABLE "PriceHistory";

-- DropTable
DROP TABLE "Subscription";

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
