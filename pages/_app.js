// pages/_app.js
import "../styles/globals.css";
import Link from "next/link";
import { useRouter } from "next/router";

function Layout({ children }) {
  const router = useRouter();
  const navItems = [
    { href: "/", label: "Prices" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/alerts", label: "Alerts" },
    { href: "/watchlist", label: "Watchlist" },
    { href: "/charts", label: "Charts" },
    { href: "/learn", label: "Learn" },
  ];

  return (
    <>
      <nav className="nav">
        <div className="logo">Precious Metals</div>
        <div className="nav-links">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} legacyBehavior>
              <a
                className={router.pathname === item.href ? "active-nav" : ""}
              >
                {item.label}
              </a>
            </Link>
          ))}
        </div>
      </nav>
      <main className="container">{children}</main>
      <footer className="footer">
        © 2025 Precious Metals Tracker – All rights reserved.
      </footer>
    </>
  );
}

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
