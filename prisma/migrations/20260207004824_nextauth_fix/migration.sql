-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name" TEXT,
ALTER COLUMN "email" DROP NOT NULL;
