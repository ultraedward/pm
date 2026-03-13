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
  title: "Precious Metals — Live Gold, Silver & Spot Prices",
  description:
    "Track real-time gold, silver, platinum, and palladium spot prices. Set custom price alerts and monitor your precious metals portfolio — free to start.",
  openGraph: {
    title: "Precious Metals — Live Gold, Silver & Spot Prices",
    description:
      "Track real-time gold, silver, platinum, and palladium spot prices. Set custom price alerts and monitor your precious metals portfolio — free to start.",
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
