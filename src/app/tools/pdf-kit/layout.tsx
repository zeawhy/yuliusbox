
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Free PDF Merger & Splitter - 100% Offline | YuliusBox",
    description: "Merge, split, compress, and organize PDF files directly in your browser. Secure local processing built for sensitive documents — nothing is ever uploaded.",
    keywords: ["merge pdf", "combine pdf files", "split pdf pages", "offline pdf tool"],
    alternates: {
        canonical: "/tools/pdf-kit",
    },
    openGraph: {
        url: "/tools/pdf-kit",
        siteName: "YuliusBox",
        type: "website",
        images: [
            {
                url: "/og/tools-pdf-kit.png",
                width: 1200,
                height: 630,
                alt: "Free PDF Merger & Splitter - 100% Offline",
            },
        ],
    },
};

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>{children}</>;
}
