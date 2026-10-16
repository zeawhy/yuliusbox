import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Codec Toolbox — Base64 Encoder/Decoder, Hash & Timestamp Converter Online Free | YuliusBox",
    description:
        "All-in-one developer utility for Base64 text and file encoding/decoding, MD5/SHA-256/SHA-512 cryptographic hashing, and Unix timestamp epoch conversion. 100% in-browser, free, unlimited, 0 bytes uploaded.",
    keywords: [
        "base64 encode",
        "base64 decode",
        "base64url",
        "base64 to file",
        "md5 hash",
        "sha256",
        "sha1",
        "sha512",
        "unix timestamp converter",
        "epoch converter",
        "timestamp to date",
        "在线 base64 编解码",
        "哈希计算工具",
        "时间戳转换器",
    ],
    alternates: {
        canonical: "/tools/codec-toolbox",
    },
    openGraph: {
        url: "/tools/codec-toolbox",
        siteName: "YuliusBox",
        type: "website",
        images: [
            {
                url: "/og/tools-codec-toolbox.png",
                width: 1200,
                height: 630,
                alt: "Codec Toolbox \u2014 Base64 Encoder/Decoder, Hash & Timestamp Converter Online Free",
            },
        ],
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Codec Toolbox — Base64, Hash & Timestamp Converter",
    url: "https://www.yuliusbox.com/tools/codec-toolbox",
    description:
        "Base64 encoder/decoder, cryptographic hashing (MD5, SHA-1, SHA-256, SHA-512), and Unix epoch timestamp converter running 100% client-side in the browser. Free, unlimited, 0 bytes uploaded.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
    },
};

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {children}
        </>
    );
}
