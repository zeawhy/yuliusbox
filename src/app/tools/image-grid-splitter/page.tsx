import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { PrivacyBadge } from "@/components/tools/PrivacyBadge";
import { ToolSeoBody } from "@/components/tools/ToolSeoBody";
import { RelatedTools } from "@/components/tools/RelatedTools";
import ImageGridSplitterClient from "./ImageGridSplitterClient";

const SECTIONS = [
    {
        heading: "Split one image into a grid of equal tiles",
        paragraphs: [
            "A grid post turns a single picture into a small mosaic across a social profile: nine square tiles that only make sense together when someone opens your profile page. This splitter cuts one image into a grid of equal pieces — the classic 3×3, a wide 3×1 banner row, or any rows-and-columns combination up to 20×20 — and packages the tiles as a ZIP, numbered in posting order so you can upload them one by one without guessing which piece goes where.",
            "The optional edge trim shaves a small percentage from every tile's border. That counters the gaps social apps show between grid posts: trimming a percent or two makes the combined mosaic look closer to continuous once the tiles sit side by side in the app's own grid spacing.",
        ],
    },
    {
        heading: "Processed on your device, at full resolution",
        paragraphs: [
            "Everything happens in your browser. The image is drawn onto a canvas at its original pixel size, sliced tile by tile from those original pixels, and bundled into a ZIP on your device — the file is never uploaded to a server, so original-resolution photos, unreleased artwork and personal pictures are all safe to split here. PNG and WebP inputs export as PNG tiles to preserve transparency; other images export as high-quality JPEG tiles.",
            "Because the slicing uses the image's real pixels rather than a scaled preview, tiles keep the sharpness of the source. For profile grids, start from the highest-resolution version you have: a 3×3 grid divides each dimension by three, so a 3000-pixel-wide original gives you crisp 1000-pixel tiles.",
        ],
    },
];

const HOW_TO = [
    "Click \u201CSelect Image\u201D or drag a JPG, PNG or WebP image onto the tool.",
    "Set the number of columns and rows for your grid — 3×3 for a classic profile mosaic, 3 columns × 1 row for a banner strip.",
    "Optionally adjust Edge Trim (start with 1%) if you want to compensate for the gaps a social app shows between posts.",
    "Use the preview to confirm the cut lines fall where you want them, then press \u201CSplit Image & Download ZIP\u201D.",
    "Unzip the tiles and post them in the numbered order, starting from the last number so the first tile ends up at the top-left of your profile.",
];

const USE_CASES = [
    "Building a 3×3 Instagram profile mosaic from a single poster, artwork or photo.",
    "Splitting a wide banner into a 3×1 row that reads as one image across a profile.",
    "Cutting a large image into tiles for printing a poster across several smaller sheets.",
    "Dividing a map, chart or infographic into sections for a multi-image post or carousel.",
    "Slicing textures or game assets into an even grid for further editing.",
];

const FAQS = [
    {
        question: "Is my image uploaded anywhere?",
        answer: "No. The image is loaded into your browser, sliced on a canvas at full resolution, and zipped on your device. No image data is sent to a server, which you can confirm by using the tool with your network disconnected after the page has loaded.",
    },
    {
        question: "What grid sizes can I make?",
        answer: "Any combination from 1×1 up to 20 columns and 20 rows. The 3×3 grid is the most common for profile mosaics, and 3×1 or 4×1 strips work well for banners.",
    },
    {
        question: "What does Edge Trim do?",
        answer: "It removes a small percentage from each tile's edges before export. Social apps display grid posts with thin gaps between them, which breaks a continuous image; trimming roughly 0.5–2% makes the combined result look tighter. Leave it at 0% if you need pixel-exact tiles.",
    },
    {
        question: "In what order should I post the tiles?",
        answer: "Tiles are numbered in reading order (1 is top-left). Feeds show the newest post first, so post the highest number first and the tile numbered 1 last — then tile 1 lands at the top-left of your profile grid.",
    },
    {
        question: "Which formats are supported?",
        answer: "JPG, PNG and WebP images can be split. PNG and WebP sources export as PNG tiles so transparency survives; JPEG sources export as JPEG tiles at full quality.",
    },
    {
        question: "Why do my tiles look small?",
        answer: "Each tile is one grid cell of the original image, so a 3×3 split of a 900-pixel-wide photo produces 300-pixel tiles. Start from the largest version of the image you have for sharper tiles.",
    },
];

export default function ImageGridSplitterPage() {
    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-5xl mx-auto">
            <Header />
            <Breadcrumbs trail={[{ href: "/", label: "Home" }, { href: "/tools/image-grid-splitter", label: "Image Grid Splitter" }]} />
            <div className="w-full flex flex-col gap-8">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Image Grid Splitter</h1>
                    <p className="text-zinc-400 max-w-xl mx-auto">
                        Split a single image into a grid of tiles — 3×3 for profile mosaics or any size up to 20×20 — entirely in your browser, at full resolution.
                    </p>
                </div>
                <div className="w-full flex justify-center sm:justify-end">
                    <PrivacyBadge mode="local" />
                </div>
                <ImageGridSplitterClient />
            </div>
            <ToolSeoBody sections={SECTIONS} howTo={HOW_TO} useCases={USE_CASES} faqs={FAQS} />
            <div className="w-full mt-12 sm:mt-16">
                <RelatedTools slug="image-grid-splitter" />
            </div>
            <Footer />
        </div>
    );
}
