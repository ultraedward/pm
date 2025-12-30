import "./globals.css";
import type { ReactNode } from "react";
import Providers from "./providers";
import NavClient from "@/app/components/NavClient";

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <NavClient />
          {children}
        </Providers>
      </body>
    </html>
  );
}
