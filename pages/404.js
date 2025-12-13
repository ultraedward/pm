import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container">
      <h1>404 – Page Not Found</h1>
      <p className="info">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link href="/" legacyBehavior>
        <a className="submit-btn">Go back to home</a>
      </Link>
    </div>
  );
}
