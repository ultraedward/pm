-- Add preferred currency to User (defaults to USD, non-breaking)
ALTER TABLE "User" ADD COLUMN "preferredCurrency" TEXT NOT NULL DEFAULT 'USD';

-- Add currency to Alert so we know what unit the price threshold was entered in
ALTER TABLE "Alert" ADD COLUMN "currency" TEXT NOT NULL DEFAULT 'USD';
