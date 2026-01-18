import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MacroMap - Track Your Nutrition",
  description: "Track macros, scan ingredients, and make informed food choices. No API key needed.",
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
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

import { ThemeProvider } from "./theme";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="apple-touch-icon" href="/MacroMap.github.io/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/MacroMap.github.io/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/MacroMap.github.io/icon-192.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/MacroMap.github.io/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="MacroMap" />
      </head>
      <body className="font-sans antialiased text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
