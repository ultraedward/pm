import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Precious Metals — Spot prices, alerts, and portfolio tracking";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
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
            top: "-200px",
            right: "-200px",
            width: "700px",
            height: "700px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(251,191,36,0.18) 0%, transparent 70%)",
          }}
        />

        {/* Metal symbols row */}
        <div
          style={{
            display: "flex",
            gap: "32px",
            marginBottom: "48px",
          }}
        >
          {[
            { symbol: "XAU", label: "GOLD",      color: "#fbbf24" },
            { symbol: "XAG", label: "SILVER",    color: "#d1d5db" },
            { symbol: "XPT", label: "PLATINUM",  color: "#a78bfa" },
            { symbol: "XPD", label: "PALLADIUM", color: "#34d399" },
          ].map(({ symbol, label, color }) => (
            <div
              key={symbol}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  color: color,
                  textTransform: "uppercase",
                }}
              >
                {label}
              </span>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.35)",
                  fontFamily: "monospace",
                }}
              >
                {symbol}
              </span>
            </div>
          ))}
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: "72px",
            fontWeight: 900,
            color: "#ffffff",
            lineHeight: 1,
            letterSpacing: "-0.04em",
            marginBottom: "20px",
          }}
        >
          Precious Metals
        </div>

        {/* Subheadline */}
        <div
          style={{
            fontSize: "24px",
            fontWeight: 400,
            color: "rgba(255,255,255,0.45)",
            letterSpacing: "-0.01em",
            marginBottom: "36px",
          }}
        >
          Spot prices · Price alerts · Portfolio tracking
        </div>

        {/* CTA pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "#f59e0b",
            borderRadius: "999px",
            padding: "12px 28px",
          }}
        >
          <span
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "#000000",
              letterSpacing: "0.03em",
              textTransform: "uppercase",
            }}
          >
            Start tracking free
          </span>
          <span style={{ fontSize: "15px", color: "#000000" }}>→</span>
        </div>

        {/* Bottom gold line */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: "linear-gradient(to right, #f59e0b, #fbbf24, transparent)",
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
