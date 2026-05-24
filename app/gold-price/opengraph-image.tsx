import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Gold Price Today — Live Spot Price | Lode";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function fetchGoldPrice(): Promise<number | null> {
  const workerUrl = process.env.PRICE_WORKER_URL;
  if (!workerUrl) return null;
  try {
    const res = await fetch(workerUrl, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json() as Record<string, unknown>;
    if (!data.ok) return null;
    const price = (data as Record<string, number>).gold;
    return typeof price === "number" && price > 0 ? price : null;
  } catch {
    return null;
  }
}

function fmtPrice(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export default async function OGImage() {
  const price = await fetchGoldPrice();
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
        {/* Ambient gold glow */}
        <div
          style={{
            position: "absolute",
            top: "-150px",
            right: "-150px",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(251,191,36,0.22) 0%, transparent 70%)",
          }}
        />

        {/* Bottom glow accent */}
        <div
          style={{
            position: "absolute",
            bottom: "-200px",
            left: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 70%)",
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
              background: "#fbbf24",
            }}
          />
          <span
            style={{
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.18em",
              color: "#fbbf24",
              textTransform: "uppercase",
            }}
          >
            Gold · XAU · Live spot
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
          Gold Price Today
        </div>

        {/* Big price */}
        <div
          style={{
            fontSize: "110px",
            fontWeight: 900,
            color: "#fbbf24",
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

        {/* Bottom gold line */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(to right, #f59e0b, #fbbf24, transparent)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
