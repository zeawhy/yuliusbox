import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Codec Toolbox — Base64, Hash & Time Tools | YuliusBox",
    description: "Base64 encode and decode text or files, generate MD5 and SHA hashes, and convert Unix timestamps. One free developer toolbox, 100% in-browser, no uploads.",
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

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>{children}</>;
}
