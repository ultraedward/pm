import { useEffect, useState } from "react";
import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  const isDemo = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

  useEffect(() => {
    const id = setInterval(() => {
      setLastUpdate(Date.now());
    }, 3000);

    return () => clearInterval(id);
  }, []);

  return (
    <>
      <Component {...pageProps} />

      {/* Power Tester Footer */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "6px 12px",
          fontSize: 11,
          background: "#fafafa",
          borderTop: "1px solid #e5e5e5",
          display: "flex",
          justifyContent: "space-between",
          color: "#555",
          zIndex: 100,
        }}
      >
        <span>
          ENV: <strong>{isDemo ? "DEMO" : "PROD"}</strong>
        </span>
        <span>
          Last update:{" "}
          <strong>
            {Math.round((Date.now() - lastUpdate) / 1000)}s ago
          </strong>
        </span>
      </div>
    </>
  );
}
