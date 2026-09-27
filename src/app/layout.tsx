import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import clsx from "clsx";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.yuliusbox.com"),
  title: "YuliusBox - Privacy-First Web Tools",
  description: "A collection of free, client-side, and secure utilities for productivity.",
  alternates: {
    // NOTE: this canonical only applies to "/". Every route that wants to be
    // indexed must define its own `alternates.canonical`, otherwise it will
    // silently inherit "/" and tell Google it's a duplicate of the homepage.
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "YuliusBox",
    title: "YuliusBox - Privacy-First Web Tools",
    description: "A collection of free, client-side, and secure utilities for productivity.",
  },
  twitter: {
    // Keep only `card` here on purpose: no title/description, so each page's
    // Twitter card falls back to its own openGraph/metadata title instead of
    // inheriting the generic site-wide copy. Also "summary" (not
    // "summary_large_image") because the site has no OG images yet.
    card: "summary",
  },
  verification: {
    google: "ZJjClxLHZ6bdUogWf-dZvE5ggE74X6GK4gCkHpDMPxI",
  },
};

import { LanguageProvider } from "@/context/LanguageContext";
import { GoogleAnalytics } from '@next/third-parties/google';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={clsx(inter.className, "bg-zinc-950 text-white antialiased min-h-screen")}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <GoogleAnalytics gaId="G-CH0GSRDG6C" />
      </body>
    </html>
  );
}
