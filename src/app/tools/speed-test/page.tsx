import { Metadata } from "next";
import SpeedTest from "@/components/tools/SpeedTest";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { PrivacyBadge } from "@/components/tools/PrivacyBadge";
import { ToolSeoBody } from "@/components/tools/ToolSeoBody";
import { RelatedTools } from "@/components/tools/RelatedTools";

export const metadata: Metadata = {
    title: "Free Online Internet Speed Test - Check Your Connection Speed",
    description: "Fast and accurate internet speed test. Measure your ping, download, and upload speeds in seconds. 100% free and private.",
    keywords: ["speed test", "internet speed test", "check internet speed", "ping test", "download speed", "upload speed"],
    alternates: {
        canonical: "/tools/speed-test",
    },
    openGraph: {
        url: "/tools/speed-test",
        siteName: "YuliusBox",
        type: "website",
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Online Internet Speed Test",
    "description": "Measure your internet speed including download, upload, and latency.",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Web",
    "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
    }
};

const SECTIONS = [
    {
        heading: "What this test measures",
        paragraphs: [
            "The test runs three short measurements against a nearby test endpoint served from a Cloudflare worker: ping (how many milliseconds a tiny request takes to come back, which decides how responsive calls and games feel), download speed (how fast data arrives, in Mbps — this is what video streaming and file downloads depend on), and upload speed (how fast data leaves your device, which matters for video calls, backups and sending large files).",
            "Results describe the connection between your device and the test endpoint at that moment — not a guaranteed line speed. Wi-Fi quality, distance to the router, other devices on the network and your provider's congestion all move the numbers, so run the test twice and compare, ideally once close to the router and once where you actually work.",
        ],
    },
];

const HOW_TO = [
    "Close heavy downloads, streams and cloud backups on this device for a cleaner measurement.",
    "Press the start button and let the ping, download and upload phases run one after another.",
    "Read the three results: ping in milliseconds, download and upload in Mbps.",
    "Re-run the test at a different spot or time of day if the first result surprises you.",
];

const USE_CASES = [
    "Checking whether a new broadband plan delivers roughly the speeds it advertises.",
    "Diagnosing a laggy video call: high ping or low upload is usually the culprit.",
    "Comparing Wi-Fi coverage between rooms before deciding where to put a desk or a mesh node.",
];

const FAQS = [
    {
        question: "How does the test work?",
        answer: "Your browser exchanges test data with a measurement endpoint on a Cloudflare worker: small requests for ping, a larger download to time throughput, and an upload of generated data. The amount of data is modest and the results are calculated locally in the page.",
    },
    {
        question: "Why do my results change between runs?",
        answer: "Because the network changes between runs. Wi-Fi interference, other people streaming, provider congestion and even the test endpoint's load all shift the numbers. Trends across several runs mean more than any single measurement.",
    },
    {
        question: "What is a good ping, download and upload?",
        answer: "Ping under about 30 ms feels responsive for calls and games; 100 ms or more is noticeable. Download needs are household-dependent — roughly 25 Mbps handles one 4K stream — while upload of 10 Mbps or more keeps video calls and backups comfortable.",
    },
    {
        question: "Does the test use much of my data allowance?",
        answer: "Each run transfers a limited amount of test data to measure throughput — think in the range of a few photos, not a video. On a capped mobile plan, prefer running it on Wi-Fi.",
    },
];

export default function SpeedTestPage() {
    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-5xl mx-auto">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Header />
            <Breadcrumbs trail={[{ href: "/", label: "Home" }, { href: "/tools/speed-test", label: "Speed Test" }]} />
            <div className="w-full flex flex-col gap-8">
                <div className="w-full flex justify-center sm:justify-end">
                    <PrivacyBadge mode="api" />
                </div>
                <SpeedTest />
            </div>
            <ToolSeoBody sections={SECTIONS} howTo={HOW_TO} useCases={USE_CASES} faqs={FAQS} />
            <div className="w-full mt-12 sm:mt-16">
                <RelatedTools slug="speed-test" />
            </div>
            <Footer />
        </div>
    );
}
