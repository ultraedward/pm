import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Precious Metals — Spot Prices, Alerts & Portfolio Tracker",
  description:
    "Daily spot prices for gold, silver, platinum, and palladium. Set price alerts and track your holdings in one place. Free to start.",
  openGraph: {
    title: "Precious Metals — Spot Prices, Alerts & Portfolio Tracker",
    description:
      "Daily spot prices for gold, silver, platinum, and palladium. Set price alerts and track your holdings in one place. Free to start.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Precious Metals — Spot Prices, Alerts & Portfolio Tracker",
    description:
      "Daily spot prices for gold, silver, platinum, and palladium. Set price alerts and track your holdings in one place. Free to start.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`bg-black text-white ${inter.variable}`}>
      <body className="min-h-screen bg-black text-white antialiased font-sans">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
