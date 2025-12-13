-- CreateTable
CREATE TABLE "SpotPriceCache" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "metal" TEXT NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "change" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "PriceHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "metal" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "price" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "ApiLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "endpoint" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "success" BOOLEAN NOT NULL,
    "message" TEXT
);

-- CreateIndex
CREATE INDEX "SpotPriceCache_metal_idx" ON "SpotPriceCache"("metal");

-- CreateIndex
CREATE UNIQUE INDEX "PriceHistory_metal_date_key" ON "PriceHistory"("metal", "date");
