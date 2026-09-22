# Bug: Gold page shows stale/incorrect 30-day high

**Found:** 2026-08-19, during Reddit campaign data verification
**Page:** https://lode.rocks/gold-price
**Severity:** Medium — displays a factually wrong stat on a public page

## Issue

The "30-Day High" stat on the gold price page is lower than the live spot price shown on the same page. Since the current price is inside the 30-day window, the high should always be >= current price.

- Live spot price: **$4,555.40**
- 30-Day High shown: **$4,488.40** (should be >= $4,555.40)
- 30-Day Low shown: $4,020.30 (this one's fine — consistent with a 30D change of +$535.10 / +13.31%)

The "Price History" chart on the same page also displayed **"No data yet"** for gold, while the equivalent chart on the silver page rendered normally with real data points. That strongly suggests the gold page's historical-data fetch/cache is broken or stale, and the 30-day high/low box is likely reading from that same broken source (low happened to still be accurate only because it wasn't recently exceeded).

## Not affected (verified consistent)

- Silver page (`/silver-price`): 30-day high $66.25 >= spot $66.02 ✓, price history chart rendered with data points ✓
- Homepage spot ticker and `/compare` melt price both matched the silver page's live price
- Gold 7D (+1.49%) and 30D (+13.31%) change figures are internally consistent with each other and with the 30-day low ($4,020.30 + $535.10 = $4,555.40 ✓)

## Suggested fix

Check whatever job/cache populates gold's historical price series (used for both the chart and the high/low box) — it looks like it stopped updating at some point while spot price continued updating live. Silver's equivalent pipeline is working, so comparing the two should show where they diverge.

## Repro

1. Go to https://lode.rocks/gold-price
2. Compare "Gold Price Today" (top) to "30-Day High" (below the chart)
3. Note current price exceeds the stated high; chart shows "No data yet"
