import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Precious Metals Tracker",
  description: "Track metals, alerts, and price movements",
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
