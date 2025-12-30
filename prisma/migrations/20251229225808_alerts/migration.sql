-- CreateEnum
CREATE TYPE "AlertCondition" AS ENUM ('ABOVE', 'BELOW');

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "metalId" TEXT NOT NULL,
    "condition" "AlertCondition" NOT NULL,
    "targetPrice" DOUBLE PRECISION NOT NULL,
    "triggered" BOOLEAN NOT NULL DEFAULT false,
    "triggeredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_metalId_fkey" FOREIGN KEY ("metalId") REFERENCES "Metal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
