import sitemapLastmod from "@/lib/sitemap-lastmod.json";

const BASE_URL = "https://www.yuliusbox.com";
const lastmodMap = sitemapLastmod as Record<string, string>;

const CATEGORY_NORMALIZATION: Record<string, string> = {
    Utility: "UtilitiesApplication",
    UtilityApplication: "UtilitiesApplication",
};

const FAMILY_CATEGORY: Record<string, string> = {
    "image-compressor": "MultimediaApplication",
    "video-to-gif": "MultimediaApplication",
    "audio-to-text": "MultimediaApplication",
    "image-grid-splitter": "MultimediaApplication",
    "subtitle-tools": "MultimediaApplication",
    "codec-toolbox": "DeveloperApplication",
    "json-to-code": "DeveloperApplication",
    "excel-formula-bot": "BusinessApplication",
    "pdf-kit": "UtilitiesApplication",
    "pdf-redact-sign": "UtilitiesApplication",
    "exif-remover": "UtilitiesApplication",
    "id-watermark": "UtilitiesApplication",
};

export interface ToolSoftwareSchemaInput {
    /** Canonical route path starting with "/", e.g. "/tools/image-compressor" */
    path: string;
    name: string;
    description: string;
    applicationCategory?: string;
}

export function categoryForToolPath(path: string): string {
    const parts = path.split("/").filter(Boolean);
    if (parts[0] === "tools" && parts[1] && FAMILY_CATEGORY[parts[1]]) {
        return FAMILY_CATEGORY[parts[1]];
    }
    return "UtilitiesApplication";
}

export function buildToolSoftwareSchema({
    path,
    name,
    description,
    applicationCategory,
}: ToolSoftwareSchemaInput) {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    const url = `${BASE_URL}${normalizedPath}`;
    const rawCat = applicationCategory ?? categoryForToolPath(normalizedPath);
    const category = CATEGORY_NORMALIZATION[rawCat] ?? rawCat;
    const dateModified = lastmodMap[normalizedPath];

    return {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "@id": `${url}#software`,
        name,
        url,
        description,
        applicationCategory: category,
        operatingSystem: "Web",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        publisher: {
            "@id": `${BASE_URL}/#organization`,
        },
        ...(dateModified ? { dateModified } : {}),
    };
}

export function ToolSchemaScript(props: ToolSoftwareSchemaInput) {
    const jsonLd = buildToolSoftwareSchema(props);
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
