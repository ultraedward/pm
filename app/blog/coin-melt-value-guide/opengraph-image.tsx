/**
 * OG image for /blog/coin-melt-value-guide
 * Required by Google for Article rich results — without an image the article
 * is ineligible for rich treatment in News / Discover / regular SERP.
 */

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Coin Melt Value: What Your Gold & Silver Coins Are Really Worth";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0a0a0a",
          padding: "64px 72px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Gold ambient glow top-right */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            right: "-120px",
            width: "560px",
            height: "560px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(245,158,11,0.16) 0%, transparent 70%)",
          }}
        />

        {/* Top section */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Category label */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#f59e0b",
              }}
            />
            <span
              style={{
                color: "#6b7280",
                fontSize: "17px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              Gold &amp; Silver · Reference Guide
            </span>
          </div>

          {/* Headline — 2 lines for impact */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0px" }}>
            <span
              style={{
                color: "#ffffff",
                fontSize: "54px",
                fontWeight: 900,
                lineHeight: 1.08,
                letterSpacing: "-0.03em",
              }}
            >
              Coin Melt Value:
            </span>
            <span
              style={{
                color: "#f59e0b",
                fontSize: "54px",
                fontWeight: 900,
                lineHeight: 1.08,
                letterSpacing: "-0.03em",
              }}
            >
              What It&apos;s Really Worth
            </span>
          </div>

          {/* Subline */}
          <span style={{ color: "#6b7280", fontSize: "22px", marginTop: "4px" }}>
            Exact metal content · How to calculate it · Melt value vs. market price
          </span>
        </div>

        {/* Bottom: branding */}
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div
            style={{
              width: "100%",
              height: "2px",
              background: "linear-gradient(90deg, rgba(245,158,11,0.55) 0%, transparent 55%)",
              display: "flex",
            }}
          />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span
              style={{
                color: "#ffffff",
                fontSize: "20px",
                fontWeight: 900,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
              }}
            >
              Lode
            </span>
            <span style={{ color: "#374151", fontSize: "16px" }}>lode.rocks/blog</span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
