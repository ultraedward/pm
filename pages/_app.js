// FILE: pages/_app.js
import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  const demo = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

  return (
    <>
      {demo && (
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            background: "#0b0b0b",
            color: "#fff",
            padding: "10px 16px",
            textAlign: "center",
            fontSize: 12,
            letterSpacing: 1,
          }}
        >
          DEMO MODE — FAKE DATA (Preview/Dev Only)
        </div>
      )}
      <Component {...pageProps} />
    </>
  );
}
