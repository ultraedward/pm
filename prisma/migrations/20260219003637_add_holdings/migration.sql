-- CreateTable
CREATE TABLE "Holding" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "metal" TEXT NOT NULL,
    "ounces" DOUBLE PRECISION NOT NULL,
    "costBasis" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Holding_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Holding" ADD CONSTRAINT "Holding_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
