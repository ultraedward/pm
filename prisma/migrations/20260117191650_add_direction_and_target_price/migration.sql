/*
  Warnings:

  - You are about to drop the column `condition` on the `Alert` table. All the data in the column will be lost.
  - You are about to drop the column `threshold` on the `Alert` table. All the data in the column will be lost.
  - Added the required column `direction` to the `Alert` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetPrice` to the `Alert` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Alert" DROP COLUMN "condition",
DROP COLUMN "threshold",
ADD COLUMN     "direction" TEXT NOT NULL,
ADD COLUMN     "targetPrice" DOUBLE PRECISION NOT NULL;
