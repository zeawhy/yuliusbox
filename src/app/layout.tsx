import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import clsx from "clsx";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "YuliusBox - Privacy-First Web Tools",
  description: "A collection of free, client-side, and secure utilities for productivity.",
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
