import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  const demo = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

  return (
    <>
      {demo && (
        <div
          style={{
            background: "#111",
            color: "#fff",
            padding: "8px 16px",
            textAlign: "center",
            fontSize: 13,
            letterSpacing: 0.5,
          }}
        >
          DEMO MODE — FAKE DATA
        </div>
      )}
      <Component {...pageProps} />
    </>
  );
}
