import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "PDF Redact & Sign — Black Out & Sign Free | YuliusBox",
    description: "Black out sensitive text in PDFs with true rasterized redaction, then add a handwritten or image signature. Free and private — everything runs in-browser.",
    keywords: [
        "pdf redact",
        "pdf redaction tool",
        "black out pdf text",
        "pdf signature",
        "sign pdf online",
        "esign pdf",
        "redact pdf free",
        "sanitize pdf",
        "electronic signature",
    ],
    alternates: {
        canonical: "/tools/pdf-redact-sign",
    },
    openGraph: {
        url: "/tools/pdf-redact-sign",
        siteName: "YuliusBox",
        type: "website",
        images: [
            {
                url: "/og/tools-pdf-redact-sign.png",
                width: 1200,
                height: 630,
                alt: "PDF Redact & Sign — Black Out Sensitive Text & Add Signature Online Free",
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
