import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Bulk Image Compressor - Compress JPG/PNG to 80% Smaller | YuliusBox",
    description: "Free unlimited bulk image compression. Reduce file size locally in your browser without losing quality. No upload limits.",
    keywords: ["compress image", "reduce jpg size", "image optimizer online", "privacy first compressor"],
};

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return children;
}
