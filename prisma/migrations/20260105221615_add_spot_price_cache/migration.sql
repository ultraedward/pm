-- CreateTable
CREATE TABLE "SpotPriceCache" (
    "id" TEXT NOT NULL,
    "metal" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SpotPriceCache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SpotPriceCache_metal_createdAt_idx" ON "SpotPriceCache"("metal", "createdAt");
