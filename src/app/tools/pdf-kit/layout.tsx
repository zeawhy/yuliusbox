import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Free PDF Merger & Splitter - 100% Offline | YuliusBox",
    description: "Merge, split, and organize PDF files directly in your browser. Secure local processing for your sensitive documents.",
    keywords: ["merge pdf", "combine pdf files", "split pdf pages", "offline pdf tool"],
};

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return children;
}
