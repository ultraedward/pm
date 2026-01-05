/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Alert` table. All the data in the column will be lost.
  - You are about to drop the column `direction` on the `Alert` table. All the data in the column will be lost.
  - You are about to drop the column `enabled` on the `Alert` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `AlertTrigger` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `stripeCustomerId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `stripeStatus` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `EmailLog` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `metal` to the `AlertTrigger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `AlertTrigger` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EmailLog" DROP CONSTRAINT "EmailLog_userId_fkey";

-- AlterTable
ALTER TABLE "Alert" DROP COLUMN "createdAt",
DROP COLUMN "direction",
DROP COLUMN "enabled";

-- AlterTable
ALTER TABLE "AlertTrigger" DROP COLUMN "createdAt",
ADD COLUMN     "metal" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "triggered" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "password",
DROP COLUMN "stripeCustomerId",
DROP COLUMN "stripeStatus",
ADD COLUMN     "emailVerified" TIMESTAMP(3),
ADD COLUMN     "image" TEXT;

-- DropTable
DROP TABLE "EmailLog";

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

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertTrigger" ADD CONSTRAINT "AlertTrigger_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
