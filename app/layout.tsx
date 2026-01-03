import "./globals.css";

export const metadata = {
  title: "Precious Metals",
  description: "Precious Metals Tracker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
