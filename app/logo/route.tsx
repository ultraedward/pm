import { ImageResponse } from "next/og";

// Static logo endpoint for structured data (Organization.logo in app/layout.tsx).
// Google requires a stable, square image URL — this mirrors the favicon's
// gold-coin mark at a size suitable for knowledge-panel use (min 112x112,
// square, square-fitting).
export const runtime = "edge";

const SIZE = 512;

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: SIZE,
          height: SIZE,
          background: "#0a0907",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: SIZE * 0.56,
            height: SIZE * 0.56,
            borderRadius: "50%",
            background: "radial-gradient(circle at 35% 35%, #F0CC5A, #B8962E)",
          }}
        />
      </div>
    ),
    { width: SIZE, height: SIZE }
  );
}
