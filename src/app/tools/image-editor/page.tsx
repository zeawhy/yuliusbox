import { Metadata } from "next";
import ImageEditor from "@/components/tools/ImageEditor";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { PrivacyBadge } from "@/components/tools/PrivacyBadge";
import { ToolSeoBody } from "@/components/tools/ToolSeoBody";
import { RelatedTools } from "@/components/tools/RelatedTools";

export const metadata: Metadata = {
    title: "AI Online Image Resizer & Cropper - Edit Photos Instantly",
    description: "Resize, crop, and convert images (JPG, PNG, WebP) online. Fast, private, and free. No uploads to servers.",
    keywords: ["image resizer", "image cropper", "edit photo online", "convert jpg to webp", "resize png", "crop image"],
    alternates: {
        canonical: "/tools/image-editor",
    },
    openGraph: {
        url: "/tools/image-editor",
        siteName: "YuliusBox",
        type: "website",
        images: [
            {
                url: "/og/tools-image-editor.png",
                width: 1200,
                height: 630,
                alt: "Online Image Resizer & Cropper",
            },
        ],
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Online Image Resizer & Cropper",
    "description": "Resize and crop images directly in your browser.",
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
        heading: "Resize, crop and convert in one place",
        paragraphs: [
            "Three small jobs come up again and again with images: the file is the wrong size for an upload form, the framing needs trimming, or the format is not the one a site accepts. This editor handles all three together. Crop to the part of the photo that matters — freehand, or locked to an aspect ratio such as 1:1, 4:3 or 16:9 — then set the exact output width and height in pixels, pick JPG, PNG or WebP, adjust quality, and export. Doing the crop and the resize in a single pass also avoids the quality loss of saving and re-opening the image several times.",
            "Common targets are easy to hit precisely: a 1200×630 sharing image, a square profile photo, a passport-style crop, or a WebP version of a heavy PNG for a web page. The aspect-ratio lock keeps width and height in proportion while you type either value, so portraits do not come out stretched.",
        ],
    },
    {
        heading: "Edited on your device, never uploaded",
        paragraphs: [
            "The editor runs entirely in your browser using the canvas built into it. Your image is loaded from your device, edited in the page and exported straight back to your downloads — at no point is the photo sent to a server. That makes the tool safe for personal pictures, screenshots with private content and unreleased product images alike, and it works offline once the page has loaded.",
            "Because everything is local, very large photos are limited only by your device's memory. If a huge camera file feels sluggish, resize it in steps — export once at a moderate size, then edit that copy — or simply close other heavy tabs while you work.",
        ],
    },
];

const HOW_TO = [
    "Click \u201CSelect Image\u201D and open a JPG, PNG or WebP file from your device.",
    "Drag the crop handles to frame the part you want to keep; choose an aspect ratio preset if the destination requires one.",
    "Enter the target width or height in pixels — with the aspect lock on, the other dimension updates automatically.",
    "Choose the output format (JPG, PNG or WebP) and, for JPG and WebP, the quality level.",
    "Export and download the finished image, then check it once at full size before using it.",
];

const USE_CASES = [
    "Making a photo fit an upload limit or an exact pixel size required by a form, marketplace or CMS.",
    "Cropping a square profile picture or a 16:9 cover image from a larger photo.",
    "Converting PNG screenshots to WebP or JPG so they load faster on a website or blog.",
    "Preparing product images to a consistent size before listing them in a shop.",
    "Trimming margins and white borders from scans and screenshots before sharing them.",
];

const FAQS = [
    {
        question: "Is my image uploaded to a server?",
        answer: "No. Loading, cropping, resizing and exporting all happen in your browser with its built-in canvas tools. Your image never leaves your device, and the editor keeps working if you disconnect after the page loads.",
    },
    {
        question: "Which formats can I open and export?",
        answer: "You can open JPG, PNG and WebP images, and export in any of those three formats. Choose PNG for graphics that need transparency or crisp text, JPG for photographs, and WebP when you want a smaller file for the web.",
    },
    {
        question: "How do I keep the image from looking stretched?",
        answer: "Keep the aspect-ratio lock on while resizing: changing the width adjusts the height proportionally (and the other way round). Cropping to the destination's aspect ratio first also prevents the squashed look in profile and cover slots.",
    },
    {
        question: "What quality setting should I use?",
        answer: "For photographs, a JPG or WebP quality around 85–92% is a good balance: files shrink a lot with little visible change. Use 100% or PNG when the image will be edited further or contains fine text and line art.",
    },
    {
        question: "Can I enlarge a small image?",
        answer: "You can set larger output dimensions, but enlarging cannot invent detail that is not in the original, so the result will look soft. It is fine for mild upsizing; for a much bigger print, start from a larger source image if you have one.",
    },
    {
        question: "Does editing reduce image quality?",
        answer: "Exporting as JPG or WebP re-compresses the image once. Doing your crop, resize and conversion in this single session — rather than saving repeatedly in different tools — keeps that to one generation of loss.",
    },
];

export default function ImageEditorPage() {
    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-5xl mx-auto">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Header />
            <Breadcrumbs trail={[{ href: "/", label: "Home" }, { href: "/tools/image-editor", label: "Image Editor" }]} />
            <div className="w-full flex flex-col gap-8">
                <div className="w-full flex justify-center sm:justify-end">
                    <PrivacyBadge mode="local" />
                </div>
                <ImageEditor />
            </div>
            <ToolSeoBody sections={SECTIONS} howTo={HOW_TO} useCases={USE_CASES} faqs={FAQS} />
            <div className="w-full mt-12 sm:mt-16">
                <RelatedTools slug="image-editor" />
            </div>
            <Footer />
        </div>
    );
}
