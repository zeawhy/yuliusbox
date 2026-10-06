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
    images: [
      {
        url: "/og/home.png",
        width: 1200,
        height: 630,
        alt: "Free Online Tools That Run in Your Browser",
      },
    ],
  },
  twitter: {
    // Keep only `card` here on purpose: no title/description, so each page's
    // Twitter card falls back to its own openGraph/metadata title instead of
    // inheriting the generic site-wide copy.
    card: "summary_large_image",
  },
  verification: {
    google: "ZJjClxLHZ6bdUogWf-dZvE5ggE74X6GK4gCkHpDMPxI",
  },
};

import { LanguageProvider } from "@/context/LanguageContext";
import Script from "next/script";

// Umami (self-hosted, cookieless analytics). The tracking script is only
// injected once NEXT_PUBLIC_UMAMI_WEBSITE_ID is set, so the site works fine
// before the analytics server is deployed.
const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
const umamiUrl = process.env.NEXT_PUBLIC_UMAMI_URL || "https://stats.yuliusbox.com";

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
        {umamiWebsiteId && (
          <Script
            src={`${umamiUrl}/script.js`}
            data-website-id={umamiWebsiteId}
            data-domains="yuliusbox.com,www.yuliusbox.com"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
