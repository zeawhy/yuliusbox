"use client";

import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ExifRemoverTool } from "@/components/tools/ExifRemoverTool";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const FAQS = [
    {
        q: "What is EXIF data?",
        a: "EXIF (Exchangeable Image File Format) is metadata your camera or phone embeds in every photo: camera make and model, shooting date and time, exposure settings, and sometimes precise GPS coordinates. It's invisible in normal viewing but trivially readable by anyone who downloads the file.",
    },
    {
        q: "Does removing EXIF reduce image quality?",
        a: "The tool re-encodes your image from raw pixel data — JPEG and WebP at 95% quality (visually identical), PNG losslessly. The pixels stay the same; only the hidden metadata is discarded. For maximum fidelity, always keep your original file archived.",
    },
    {
        q: "Can you detect AI-generated images?",
        a: "As a heuristic, not a verdict. The tool scans the Software tag and XMP data for known AI-generator markers (Stable Diffusion, DALL-E, Midjourney, Firefly, C2PA credentials, and similar). A match suggests AI involvement; no match proves nothing — markers can be stripped or forged.",
    },
    {
        q: "Are my photos uploaded anywhere?",
        a: "Never. Both reading and cleaning happen entirely in your browser. You can verify this by monitoring network activity — no image data leaves your device.",
    },
    {
        q: "Which formats are supported?",
        a: "JPG/JPEG, PNG, and WebP. The cleaned copy keeps the same format as the original (PNG stays PNG, WebP stays WebP).",
    },
];

export default function ExifRemoverPage() {
    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-5xl mx-auto">
            <Header />
            <Breadcrumbs trail={[{ href: "/", label: "Home" }, { href: "/tools/exif-remover", label: "EXIF Remover" }]} />

            <div className="w-full flex flex-col gap-8">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                        Remove EXIF Data from Photos — Free Online
                    </h1>
                    <p className="text-zinc-400 max-w-xl mx-auto">
                        See the hidden metadata inside your photos — camera, timestamps, GPS location —
                        then wipe it all with one click. 100% in your browser, nothing uploaded.
                    </p>
                </div>

                <ExifRemoverTool />

                <div className="prose prose-invert prose-zinc max-w-none text-zinc-400 text-sm space-y-4">
                    <h2 className="text-xl font-semibold text-white">What your photos reveal about you</h2>
                    <p>
                        Every photo taken on a modern phone is two files in one: the image you see, and a
                        hidden ledger of metadata describing how, when, and where it was captured. Camera
                        make and model, exact shooting time, exposure settings — and, unless you disabled
                        it, GPS coordinates accurate to a few meters. Posting an original photo to a forum,
                        marketplace listing, or social profile publishes all of that alongside it. Real-estate
                        photos have exposed sellers&apos; home addresses; product shots have leaked
                        unreleased hardware locations.
                    </p>
                    <h2 className="text-xl font-semibold text-white">How the cleaner works</h2>
                    <p>
                        The tool first reads the file with a metadata parser and shows you a plain-language
                        summary: device, dates, software, and a red flag if GPS coordinates are present. When
                        you hit clean, the image is redrawn from raw pixel data onto a canvas and re-encoded
                        — a process that physically cannot carry EXIF, XMP, IPTC, or ICC data over, because
                        the output stream is built from pixels alone. The result is visually identical and
                        metadata-free.
                    </p>
                    <h2 className="text-xl font-semibold text-white">Frequently asked questions</h2>
                    <div className="space-y-3">
                        {FAQS.map((f) => (
                            <details key={f.q} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                                <summary className="cursor-pointer text-white font-medium">{f.q}</summary>
                                <p className="mt-2">{f.a}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
