import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Lode — Know what your stack is worth. Live gold, silver, platinum & palladium spot prices.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const METALS = [
  { label: "GOLD",      price: "$4,274", pct: "+1.23%", up: true,  color: "#D4AF37" },
  { label: "SILVER",    price: "$63.04",  pct: "−0.84%", up: false, color: "#C0C0C0" },
  { label: "PLATINUM",  price: "$1,762",  pct: "−0.94%", up: false, color: "#E5E4E2" },
  { label: "PALLADIUM", price: "$1,287",  pct: "−1.98%", up: false, color: "#9FA8C7" },
];

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0907",
          padding: "56px 72px 48px",
          fontFamily: "system-ui, -apple-system, 'Helvetica Neue', sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >

        {/* Ghost gold price — ambient texture in top-right */}
        <div
          style={{
            position: "absolute",
            right: "-60px",
            top: "-20px",
            fontSize: "380px",
            fontWeight: 900,
            letterSpacing: "-0.06em",
            lineHeight: 1,
            color: "#D4AF37",
            opacity: 0.045,
            userSelect: "none",
            whiteSpace: "nowrap",
          }}
        >
          $4,274
        </div>

        {/* Left gold accent rule */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: "15%",
            bottom: "15%",
            width: "3px",
            background: "linear-gradient(to bottom, transparent 0%, #D4AF37 30%, #D4AF37 70%, transparent 100%)",
            opacity: 0.5,
          }}
        />

        {/* Bottom gold gradient line */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: "linear-gradient(to right, #D4AF37 0%, #fbbf24 40%, transparent 100%)",
          }}
        />

        {/* ── TOP: wordmark + url ─────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span
            style={{
              fontSize: "15px",
              fontWeight: 900,
              letterSpacing: "0.22em",
              color: "#D4AF37",
              textTransform: "uppercase",
            }}
          >
            LODE
          </span>
          <div
            style={{
              width: "1px",
              height: "13px",
              background: "rgba(255,255,255,0.15)",
            }}
          />
          <span
            style={{
              fontSize: "13px",
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.06em",
            }}
          >
            lode.rocks
          </span>
        </div>

        {/* ── MIDDLE: headline ───────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <div
            style={{
              fontSize: "86px",
              fontWeight: 900,
              color: "#ffffff",
              letterSpacing: "-0.04em",
              lineHeight: 0.9,
            }}
          >
            Know what your
          </div>
          <div
            style={{
              fontSize: "86px",
              fontWeight: 900,
              color: "#D4AF37",
              letterSpacing: "-0.04em",
              lineHeight: 0.9,
            }}
          >
            stack is worth.
          </div>
        </div>

        {/* ── BOTTOM: price tiles + feature tags ─────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

          {/* Price tiles */}
          <div style={{ display: "flex", gap: "8px" }}>
            {METALS.map(({ label, price, pct, up, color }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  flex: 1,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  padding: "18px 20px",
                }}
              >
                {/* Metal label + dot */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div
                    style={{
                      width: "7px",
                      height: "7px",
                      borderRadius: "50%",
                      background: color,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      color: "rgba(255,255,255,0.35)",
                    }}
                  >
                    {label}
                  </span>
                </div>

                {/* Price */}
                <span
                  style={{
                    fontSize: "30px",
                    fontWeight: 900,
                    color: "#ffffff",
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {price}
                </span>

                {/* Pct change */}
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: up ? "#34d399" : "#f87171",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {pct} 24H
                </span>
              </div>
            ))}
          </div>

          {/* Feature tags */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            {[
              "Price alerts",
              "Melt calculator",
              "Dealer comparison",
              "Portfolio tracker",
              "Free forever",
            ].map((tag, i) => (
              <div key={tag} style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                {i > 0 && (
                  <div
                    style={{
                      width: "1px",
                      height: "12px",
                      background: "rgba(255,255,255,0.1)",
                    }}
                  />
                )}
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.28)",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  {tag}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    ),
    { ...size }
  );
}
