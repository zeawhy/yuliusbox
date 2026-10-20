import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "File Encryptor — AES-256, No Upload | YuliusBox",
    description: "Encrypt any file with AES-256-GCM encryption in your browser. PBKDF2 key derivation and password-protected .enc files — 100% local, nothing ever uploaded.",
    keywords: [
        "file encryptor",
        "encrypt file online",
        "aes encryption",
        "aes-256-gcm",
        "password protect file",
        "secure file encryption",
        "decrypt file",
    ],
    alternates: {
        canonical: "/tools/file-encryptor",
    },
    openGraph: {
        url: "/tools/file-encryptor",
        siteName: "YuliusBox",
        type: "website",
        images: [
            {
                url: "/og/tools-file-encryptor.png",
                width: 1200,
                height: 630,
                alt: "File Encryptor — AES-256 File Encryption Online Free",
            },
        ],
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "File Encryptor — AES-256 File Encryption",
    url: "https://www.yuliusbox.com/tools/file-encryptor",
    description:
        "Encrypt and decrypt any file with AES-256-GCM in your browser. PBKDF2 key derivation, zero server uploads.",
    applicationCategory: "SecurityApplication",
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
