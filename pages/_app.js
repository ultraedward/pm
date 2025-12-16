import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <nav
        style={{
          padding: "12px 24px",
          borderBottom: "1px solid #334155",
          background: "#020617",
          color: "#e5e7eb",
          display: "flex",
          gap: 16
        }}
      >
        <a href="/" style={{ color: "#e5e7eb" }}>Prices</a>
        <a href="/alerts" style={{ color: "#e5e7eb" }}>Alerts</a>
        <a href="/pricing" style={{ color: "#e5e7eb" }}>Pricing</a>
        <a href="/account" style={{ color: "#e5e7eb" }}>Account</a>
      </nav>

      <Component {...pageProps} />
    </>
  );
}
