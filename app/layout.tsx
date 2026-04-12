import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "./theme";

export const metadata: Metadata = {
  title: "MacroMap - Track Your Macros",
  description: "Track your macros, scan nutrition labels, and build your personal food library. Free, no API key needed.",
  manifest: "/MacroMap.github.io/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MacroMap",
  },
  icons: {
    icon: [
      { url: "/MacroMap.github.io/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/MacroMap.github.io/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/MacroMap.github.io/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="apple-touch-icon" href="/MacroMap.github.io/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="MacroMap" />
      </head>
      <body
        className="font-sans antialiased"
        style={{
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
