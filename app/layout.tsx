import "./globals.css";
import type { ReactNode } from "react";
import Nav from "@/app/components/Nav";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-black">
        <Nav />
        {children}
      </body>
    </html>
  );
}
