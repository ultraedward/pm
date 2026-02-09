import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white">
        <nav className="p-4 space-x-4 border-b border-gray-700">
          <a href="/prices" className="hover:underline">
            Prices
          </a>
          <a href="/alerts" className="hover:underline">
            Alerts
          </a>
        </nav>

        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}