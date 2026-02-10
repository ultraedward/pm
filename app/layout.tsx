import "./globals.css";
import NavBar from "@/components/NavBar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white">
        <NavBar />
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}