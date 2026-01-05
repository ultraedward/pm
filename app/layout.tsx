// app/layout.tsx

import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Precious Metals Tracker",
  description: "Track precious metals and set price alerts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
