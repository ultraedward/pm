import { ImageResponse } from "next/og";
import { fetchAllSpotPrices } from "@/lib/prices/fetchSpotPrices";

// Not edge runtime: fetchAllSpotPrices() reads from Postgres via Prisma,
// which needs the Node runtime (no edge driver adapter configured). Was
// previously fetching PRICE_WORKER_URL live at image-render time — that
// bypassed the once-daily DB-read path every other page uses (see commit
// 1a72417), so the OG image's price could drift from what the actual page
// shows. Now reads the same stored value as the page itself.
export const alt = "Silver Price Today — Spot Price | Lode";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function fetchSilverPrice(): Promise<number | null> {
  const spots = await fetchAllSpotPrices();
  return spots.silver;
}

function fmtPrice(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default async function OGImage() {
  const price = await fetchSilverPrice();
  const priceStr = price ? fmtPrice(price) : "—";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "#000000",
          padding: "72px 80px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient silver glow */}
        <div
          style={{
            position: "absolute",
            top: "-150px",
            right: "-150px",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(192,192,192,0.18) 0%, transparent 70%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: "-200px",
            left: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(192,192,192,0.06) 0%, transparent 70%)",
          }}
        />

        {/* Label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#d1d5db",
            }}
          />
          <span
            style={{
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.18em",
              color: "#d1d5db",
              textTransform: "uppercase",
            }}
          >
            Silver · XAG · Spot price
          </span>
        </div>

        {/* Page title */}
        <div
          style={{
            fontSize: "52px",
            fontWeight: 900,
            color: "rgba(255,255,255,0.55)",
            letterSpacing: "-0.02em",
            lineHeight: 1,
            marginBottom: "16px",
          }}
        >
          Silver Price Today
        </div>

        {/* Big price */}
        <div
          style={{
            fontSize: "110px",
            fontWeight: 900,
            color: "#e5e7eb",
            letterSpacing: "-0.04em",
            lineHeight: 1,
            marginBottom: "8px",
          }}
        >
          {priceStr}
        </div>

        {/* Per oz label */}
        <div
          style={{
            fontSize: "22px",
            fontWeight: 400,
            color: "rgba(255,255,255,0.35)",
            letterSpacing: "0.02em",
            marginBottom: "48px",
          }}
        >
          per troy ounce
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <span
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "rgba(255,255,255,0.25)",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            lode.rocks
          </span>
          <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "15px" }}>·</span>
          <span
            style={{
              fontSize: "15px",
              color: "rgba(255,255,255,0.25)",
            }}
          >
            Prices · Alerts · Portfolio
          </span>
        </div>

        {/* Bottom silver line */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(to right, #9ca3af, #e5e7eb, transparent)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
