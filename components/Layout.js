import TopNav from "./TopNav";

export default function Layout({ children }) {
  return (
    <>
      <TopNav />
      <div className="container">{children}</div>
      <div className="footerbar">
        <div className="footerbar-inner">
          <span>
            System: <strong>{process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" ? "DEMO" : "PROD"}</strong>
          </span>
          <span>
            Build: <strong>{process.env.NEXT_PUBLIC_VERCEL_ENV || "local"}</strong>
          </span>
        </div>
      </div>
      <div style={{ height: 46 }} />
    </>
  );
}
