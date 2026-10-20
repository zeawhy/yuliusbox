"use client";

import { Suspense } from "react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ExifRemoverTool } from "@/components/tools/ExifRemoverTool";
import { ExifRemoverScenario } from "@/components/tools/ExifRemoverScenario";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PrivacyBadge } from "@/components/tools/PrivacyBadge";
import { useLanguage } from "@/context/LanguageContext";

const FAQS = [
    {
        q: "What is EXIF data?",
        a: "EXIF (Exchangeable Image File Format) is metadata your camera or phone embeds in every photo: camera make and model, shooting date and time, exposure settings, and sometimes precise GPS coordinates. It's invisible in normal viewing but trivially readable by anyone who downloads the file.",
    },
    {
        q: "Does removing EXIF reduce image quality?",
        a: "For JPEGs, the tool removes the EXIF segment directly without re-encoding, so the original compression and quality are kept. Other formats are re-encoded from pixel data (JPEG/WebP at 95% quality, PNG losslessly). The pixels stay the same; the hidden metadata is removed from the downloaded copy. Always keep your original file archived.",
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
    const { language } = useLanguage();

    const t = {
        title: {
            en: "Remove EXIF Data from Photos — Free Online",
            cn: "清除照片 EXIF 拍照元数据 — 本地免费隐私脱敏",
        },
        desc: {
            en: "See hidden metadata inside your photos — camera, timestamps, GPS location — then remove it with one click. Runs in your browser, nothing uploaded.",
            cn: "查看照片暗藏的敏感元数据（相机型号、拍摄时间、GPS 经纬度），再一键移除。在本地浏览器运行，不上传云端。",
        },
    };

    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-5xl mx-auto">
            <Header />
            <Breadcrumbs trail={[{ href: "/", label: "Home" }, { href: "/tools/exif-remover", label: "EXIF Remover" }]} />

            <div className="w-full flex flex-col gap-8">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                        {language === "en" ? t.title.en : t.title.cn}
                    </h1>
                    <p className="text-zinc-400 max-w-xl mx-auto">
                        {language === "en" ? t.desc.en : t.desc.cn}
                    </p>
                </div>

                <div className="w-full flex flex-col gap-3">
                    <div className="flex flex-wrap justify-end"><PrivacyBadge mode="local" /></div>
                    
                    <Suspense fallback={null}>
                        <ExifRemoverTool />
                    </Suspense>
                </div>

                <ExifRemoverScenario />

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
                        you hit clean, JPEG EXIF segments are removed directly from the file without
                        re-encoding; other formats are redrawn from pixel data onto a canvas and re-encoded,
                        so the downloaded copy carries no EXIF, GPS, IPTC or XMP metadata. Removing metadata
                        can&apos;t hide landmarks, faces or text visible in the photo itself.
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
