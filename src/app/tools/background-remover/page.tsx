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
        images: [
            {
                url: "/og/tools-background-remover.png",
                width: 1200,
                height: 630,
                alt: "Free AI Online Background Remover",
            },
        ],
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
            "Most cloud background removers ask you to upload your photo to their servers, process it remotely, and charge credits for full-resolution downloads. This tool takes the local route: an open-source neural segmentation model (@imgly/background-removal 1.4.5 powered by ONNX Runtime Web) runs directly inside your browser tab, isolates the foreground subject, and exports a full-resolution transparent PNG. Your photo never leaves your device, so there is no upload queue, no server retention, and no account wall.",
            "The trade-off is a one-time initial model download: on first use, your browser fetches the self-hosted segmentation model chunks from our same-origin /models/ directory (88.19 MB / 84.10 MiB across 22 content-addressed 4 MiB chunks for the default medium IS-Net model, plus ~10.65 MB for the SIMD-threaded ONNX Runtime WebAssembly binary) and the @imgly/background-removal@1.4.5 JavaScript wrapper from esm.sh. Once cached in browser storage, repeat cutouts initialize immediately and run entirely in local memory.",
        ],
        table: {
            caption: "Measured self-hosted model & WebAssembly runtime assets in /public/models/resources.json served from same-origin /models/*.",
            headers: [
                "Self-Hosted Asset (/public/models/)",
                "Chunk Count (4 MiB Blobs)",
                "Exact Byte Size",
                "Size (MiB / MB)",
                "Role in Local Pipeline",
            ],
            rows: [
                [
                    "/models/medium (default IS-Net tier)",
                    "22 chunks",
                    "88,188,479 B",
                    "84.10 MiB / 88.19 MB",
                    "High-precision 1024×1024 alpha-matting segmentation model",
                ],
                [
                    "/models/small (compact tier)",
                    "11 chunks",
                    "44,342,436 B",
                    "42.29 MiB / 44.34 MB",
                    "Lightweight segmentation model stored in bundle",
                ],
                [
                    "/onnxruntime-web/ort-wasm-simd-threaded.wasm",
                    "3 chunks",
                    "10,646,108 B",
                    "10.15 MiB / 10.65 MB",
                    "Multi-threaded SIMD WebAssembly execution engine (COOP/COEP active)",
                ],
                [
                    "/onnxruntime-web/ort-wasm-simd.wasm",
                    "3 chunks",
                    "10,549,605 B",
                    "10.06 MiB / 10.55 MB",
                    "Single-threaded SIMD WebAssembly fallback engine",
                ],
            ],
        },
    },
    {
        heading: "How YuliusBox compares to nobg.online, Clipout, NearBG, and CachePlex",
        paragraphs: [
            "Running background removal in the browser is no longer rare — nobg.online, Clipout (clipout.io), NearBG (nearbg.com), and CachePlex (cacheplex.com/background-remover/) all execute segmentation models locally on your device. On the basic privacy promise of zero image upload, all five tools tie.",
            "Where competitors have an edge: Clipout runs the 115 MB BiRefNet model with WebGPU support and allows dropping up to 50 images in a batch. NearBG and CachePlex use the compact U²-Netp model (~4–5 MB download) for near-instant initial startup and include manual Erase/Restore touch-up brushes and solid-color backdrop pickers directly inside the widget.",
            "Where YuliusBox differs: First, NearBG and CachePlex compute their saliency mask on a tiny 320×320 pixel grid via U²-Netp and upscale that low-resolution mask to your photo's dimensions, which softens hair strands, fur, and product contours. YuliusBox serves the full 88.19 MB medium IS-Net model from same-origin /models/ storage, preserving multi-megapixel edge transitions without requiring manual brush cleanup on every portrait. Second, unlike CachePlex — which caps users at '15 of 15 free today' and transmits a daily usage counter to its server — YuliusBox has zero daily usage limits and sends no usage count to any quota endpoint. Third, once your transparent PNG is generated, a built-in Compress handoff button passes the cutout Blob directly in memory to /tools/image-compressor so you can convert or shrink the cutout without saving and re-uploading.",
        ],
    },
    {
        heading: "Getting a clean cutout & verifying zero-upload execution in DevTools",
        paragraphs: [
            "The segmentation model performs best when the foreground subject has distinct lighting or depth separation from the background — portraits, e-commerce products, vehicles, and pets. Extremely cluttered scenes, motion blur, or hair strands against identically colored backdrops remain challenging for any automated matting network. Use the interactive before/after drag slider to inspect fine edges at full width before downloading.",
            "How to verify local execution in Browser DevTools: Open DevTools (F12) -> Network tab before selecting a photo. On your first run, you will see GET requests to /models/resources.json and the 4 MiB content-addressed model chunks from /models/<sha256>, plus the cross-origin isolation header Cross-Origin-Embedder-Policy: credentialless that unlocks multi-threaded SIMD WebAssembly (SharedArrayBuffer). Clear the Network log and select a second photo: zero network requests are made while the cutout is computed in local RAM.",
        ],
    },
];

const HOW_TO = [
    "Click \u201CSelect Image\u201D and choose a JPG, PNG or WebP photo from your device.",
    "Wait a few seconds while the ONNX segmentation model runs in your browser; first use downloads and caches the self-hosted model chunks (~88.2 MB medium model + ~10.6 MB SIMD WASM runtime).",
    "Drag the interactive comparison slider across the image to inspect edge matting around hair, fur, and product contours.",
    "Click \u201CDownload PNG\u201D to save the full-resolution transparent PNG, or click \u201CCompress\u201D to hand the cutout directly to the local Image Compressor in memory.",
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
        answer: "No. The segmentation model executes locally in your browser via ONNX Runtime WebAssembly and your image pixels never leave your device. The only network traffic on first use is downloading the static model chunks (88.19 MB for the default medium model and 10.65 MB for the SIMD WebAssembly runtime, served from /models/) and the open-source @imgly/background-removal library from esm.sh.",
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
