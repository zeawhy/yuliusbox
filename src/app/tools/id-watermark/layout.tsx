import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Add Watermark to ID Card - Protect Your Identity | YuliusBox",
    description: "Safely add watermarks to ID cards, passports, and driver licenses locally. Prevent identity theft and unauthorized use.",
    keywords: ["id card watermark", "protect id photo", "add watermark online", "身份证加水印"],
};

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return children;
}
