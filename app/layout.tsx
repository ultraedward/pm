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
  title: "Precious Metals — Live Prices & Alerts",
  description:
    "Track gold, silver, platinum, and palladium spot prices. Set price alerts. Monitor your portfolio.",
  openGraph: {
    title: "Precious Metals — Live Prices & Alerts",
    description:
      "Track gold, silver, platinum, and palladium spot prices. Set price alerts. Monitor your portfolio.",
    type: "website",
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
