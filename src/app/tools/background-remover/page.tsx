import { Metadata } from "next";
import BackgroundRemover from "@/components/tools/BackgroundRemover";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { PrivacyBadge } from "@/components/tools/PrivacyBadge";
import { ToolSeoBody } from "@/components/tools/ToolSeoBody";
import { RelatedTools } from "@/components/tools/RelatedTools";

export const metadata: Metadata = {
    title: "Free AI Online Background Remover - Private, In Your Browser",
    description: "Remove the background from any image with AI that runs in your browser. Your photo is processed on your device and is not uploaded. Free, no sign-up.",
    keywords: ["background remover", "remove bg", "ai background removal", "remove photo background", "transparent background generator", "free ai tool"],
    alternates: {
        canonical: "/tools/background-remover",
    },
    openGraph: {
        url: "/tools/background-remover",
        siteName: "YuliusBox",
        type: "website",
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "AI Online Background Remover",
    "description": "Automatically remove image backgrounds in the browser using AI.",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web",
    "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
    }
};

const SECTIONS = [
    {
        heading: "AI background removal that runs on your device",
        paragraphs: [
            "Most background removers ask you to upload your photo to their cloud, process it there and hand it back — fine for a product shot, less fine for a family picture or an unreleased design. This tool takes the other route: an AI segmentation model runs directly in your browser, finds the subject, and cuts it out as a transparent PNG. The photo itself never leaves your device, so there is no upload queue and nothing of yours sitting on a server afterwards.",
            "The trade-off is a one-time download: on first use the browser fetches the model files (roughly 20 MB, served with this site) and the open-source background-removal library, which loads from the esm.sh content delivery network. After that first load, cutting out a background typically takes a few seconds depending on your device, and repeat uses are faster because the model is cached.",
        ],
    },
    {
        heading: "Getting a clean cutout",
        paragraphs: [
            "The model works best when the subject is clearly separated from its background — a person, product, pet or object in reasonable focus, with some contrast against what is behind it. Busy scenes, hair-thin details against similar colours and heavy blur are harder for any automatic tool; those edges are where a quick manual tidy-up in an image editor still earns its keep. The built-in comparison slider lets you drag across the before and after to inspect the edges before you download.",
            "The result is a PNG with a real transparent background, ready to drop onto a new backdrop, a marketplace listing, a presentation slide or a thumbnail. If you need a different size or format afterwards, the image editor linked below can resize, crop and convert the cutout — also locally, in the same browser.",
        ],
    },
];

const HOW_TO = [
    "Click \u201CSelect Image\u201D and choose a JPG, PNG or WebP photo from your device.",
    "Wait a few seconds while the AI model processes the image in your browser; first use includes a one-time model download of about 20 MB.",
    "Drag the comparison slider to check the cutout against the original, especially around hair, fur and edges.",
    "Click \u201CDownload PNG\u201D to save the subject with a transparent background.",
    "Optionally open the PNG in the image editor to resize, crop or place it on a new background colour.",
];

const USE_CASES = [
    "Product photos for a marketplace listing: cut the item out and place it on a clean, consistent backdrop.",
    "Profile pictures and team photos that need a tidy, uniform background for a website or badge.",
    "YouTube thumbnails and social posts where a bold cutout of the subject reads better than the full scene.",
    "Stickers, collages and design mock-ups built from a person or object in an existing photo.",
    "Presentation slides where a product or person should sit directly on the slide background.",
];

const FAQS = [
    {
        question: "Is my photo uploaded to a server?",
        answer: "No. The AI model runs in your browser and your image is processed on your device; the image data is not uploaded. The only downloads are the tool's own files: the model (about 20 MB, served with this site) on first use, and the open-source processing library, which is loaded from the esm.sh CDN.",
    },
    {
        question: "Why does the first removal take longer?",
        answer: "On first use the browser has to download the AI model before it can run. Later removals reuse the cached model and are noticeably faster. A modest device may still need a few seconds per image, since the processing happens locally rather than on a server GPU.",
    },
    {
        question: "What format is the result?",
        answer: "The cutout downloads as a PNG with a transparent background, which keeps the edges clean and works in design tools, marketplaces, slides and documents. If you need JPG or WebP, convert the PNG with the image editor afterwards.",
    },
    {
        question: "What kinds of photos work best?",
        answer: "A clearly defined subject with reasonable contrast against its background — people, products, vehicles and pets work well. Very busy scenes, motion blur and fine details that blend into the background colour can produce rougher edges.",
    },
    {
        question: "Can I put a new background behind the subject?",
        answer: "The tool exports the subject on transparency, so you can place any colour or image behind it in an editor or design tool. This keeps the cutout reusable instead of baking in one background.",
    },
    {
        question: "Is there a limit on image size or number of photos?",
        answer: "There is no account and no per-day quota; you can process as many images as you like, one at a time. Extremely large photos use more memory because processing is local, so if a huge file struggles, resize a copy first.",
    },
];

export default function BackgroundRemoverPage() {
    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-5xl mx-auto">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Header />
            <Breadcrumbs trail={[{ href: "/", label: "Home" }, { href: "/tools/background-remover", label: "Background Remover" }]} />
            <div className="w-full flex flex-col gap-8">
                <div className="w-full flex justify-center sm:justify-end">
                    <PrivacyBadge mode="local" toolId="background-remover" />
                </div>
                <BackgroundRemover />
            </div>
            <ToolSeoBody sections={SECTIONS} howTo={HOW_TO} useCases={USE_CASES} faqs={FAQS} />
            <div className="w-full mt-12 sm:mt-16">
                <RelatedTools slug="background-remover" />
            </div>
            <Footer />
        </div>
    );
}
