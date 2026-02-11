import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Precious Metals Prices & Alerts",
  description: "Track gold and silver prices. Set alerts. Move when it matters.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-black text-white">
      <body className="min-h-screen bg-black text-white antialiased">
        {children}
      </body>
    </html>
  );
}