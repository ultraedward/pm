import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import NavClient from "./components/NavClient";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <NavClient />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
