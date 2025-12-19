// pages/_app.js
import "../styles/globals.css";
import Link from "next/link";

function NavLink({ href, children }) {
  return (
    <Link href={href} className="navLink">
      {children}
    </Link>
  );
}

export default function App({ Component, pageProps }) {
  return (
    <>
      <header className="siteHeader">
        <div className="shell navShell">
          <Link href="/" className="brand">
            <span className="brandMark" aria-hidden="true">
              ◆
            </span>
            <span className="brandText">Precious Metals</span>
          </Link>

          <nav className="nav" aria-label="Primary">
            <NavLink href="/">Prices</NavLink>
            <NavLink href="/alerts">Alerts</NavLink>
            <NavLink href="/alerts/create">Create</NavLink>
            <NavLink href="/charts">Charts</NavLink>
          </nav>
        </div>
      </header>

      <Component {...pageProps} />

      <footer className="siteFooter">
        <div className="shell footerShell">
          <div className="footerLeft">
            <div className="footerBrand">Precious Metals</div>
            <div className="footerSub">Spot snapshots + price alerts.</div>
          </div>
          <div className="footerRight">
            <Link className="footerLink" href="/alerts/create">
              Create Alert
            </Link>
            <Link className="footerLink" href="/charts">
              Charts
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
