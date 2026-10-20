import { Metadata } from 'next';
import YouTubeOptimizer from './YouTubeClient';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { PrivacyBadge } from "@/components/tools/PrivacyBadge";
import { ToolSeoBody } from "@/components/tools/ToolSeoBody";
import { RelatedTools } from "@/components/tools/RelatedTools";

export const metadata: Metadata = {
    title: "Free YouTube Title Generator & SEO Optimizer (AI Powered) | YuliusBox",
    description: "Generate video title ideas and SEO tags for YouTube using AI. Get several title angles for one topic and a ready-to-paste tag list. Free, no sign-up.",
    keywords: ["youtube title generator", "video tag finder", "clickbait title maker", "youtube seo tool"],
    alternates: {
        canonical: "/tools/youtube-optimizer",
    },
    openGraph: {
        url: "/tools/youtube-optimizer",
        siteName: "YuliusBox",
        type: "website",
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "YouTube Title Optimizer",
    "url": "https://www.yuliusbox.com/tools/youtube-optimizer",
    "description": "Generate video title ideas and SEO tags for YouTube using AI.",
    "applicationCategory": "Utility",
    "operatingSystem": "Web",
    "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
    }
};

const SECTIONS = [
    {
        heading: "Turn one video topic into a shortlist of titles and tags",
        paragraphs: [
            "A viewer decides in about a second whether your video is worth a click, and the title does most of that work. This tool takes the plain topic of your video — \u201Chow to cook authentic pasta at home\u201D — and returns several title options written in different angles: how-to, curiosity, numbers, mistakes to avoid. Alongside them you get a list of SEO tags matched to the topic, ready to paste into the tags field when you upload.",
            "Treat the output as a strong first draft, not an autopilot. The best title for your video still has to promise exactly what the video delivers — a title that oversells may win the first click and lose the viewer in twenty seconds, which hurts the video more than a plainer title would. Pick the option that is both specific and true, then adjust a word or two so it sounds like you rather than like a template.",
        ],
    },
    {
        heading: "How the generator works, and what is sent where",
        paragraphs: [
            "When you press the button, the topic text you typed is sent to an AI service through our backend worker, which returns the title and tag suggestions that appear on this page. Only the text of your topic is sent — no files, and no connection to your YouTube account is needed or requested. Do not paste unreleased sponsorship terms, private names or anything else you would not type into an online AI chat.",
            "Tags matter less than they once did for discovery, but they still help with misspellings, synonyms and niche phrasing that your title and description do not cover. The generated list gives you those variants without the usual half hour of staring at the upload form.",
        ],
    },
];

const HOW_TO = [
    "Describe your video's topic in the input box — a sentence with the subject and the angle works better than a single keyword.",
    "Press \u201COptimize Now\u201D and wait a few seconds for the AI suggestions to come back.",
    "Compare the title options: look for the one that is specific, honest about the video's content and easy to read at a glance.",
    "Copy the titles you like and the tag list using the copy buttons.",
    "Paste the tags into your upload, set the title, and tweak the wording so it matches your channel's voice before publishing.",
];

const USE_CASES = [
    "A creator stuck between three working titles who wants fresh angles before a scheduled upload.",
    "A smaller channel in a niche — cooking, repairs, local language content — that needs tag ideas covering synonyms and misspellings.",
    "Repackaging an older video: generating a sharper title and tag set for a re-upload or a Shorts spin-off.",
    "A business channel turning each blog topic into a video and needing consistent, search-friendly titles.",
    "Brainstorming a series: running several related topics to find a repeatable title format for the playlist.",
];

const FAQS = [
    {
        question: "How does the title generator work?",
        answer: "You enter your video's topic, and that text is sent to an AI service via our backend worker, which returns several title suggestions in different styles plus a list of related tags. No video file is uploaded and no access to your YouTube account is involved.",
    },
    {
        question: "Is anything I type stored?",
        answer: "Your topic text is sent to the AI service to produce the suggestions for that one request. We do not ask you to store drafts or create an account, so avoid entering private information — treat the input like any online AI chat.",
    },
    {
        question: "Will these titles guarantee more views?",
        answer: "No tool can guarantee that. A clear, specific title can improve how often people choose your video when it is shown to them, but views also depend on the thumbnail, the topic's demand and how long people watch. Use the suggestions as editing material, and keep the title accurate to the video.",
    },
    {
        question: "How many tags should I use?",
        answer: "Use the relevant ones rather than all of them: tags help mainly with synonyms, misspellings and niche phrases. A focused list that matches the video's actual topic is better than padding the field with loosely related popular terms.",
    },
    {
        question: "Can I use it in languages other than English?",
        answer: "Yes — describe the topic in the language of your video and the suggestions come back in that language. The interface can also be switched between English and Chinese using the site language toggle.",
    },
    {
        question: "Is it free to use?",
        answer: "Yes, the generator is free and needs no sign-up. Each generation makes one AI request, so if a request fails, wait a moment and try again.",
    },
];

export default function Page() {
    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-5xl mx-auto">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Header />
            <Breadcrumbs trail={[{ href: "/", label: "Home" }, { href: "/tools/youtube-optimizer", label: "YouTube Title Optimizer" }]} />
            <div className="w-full flex flex-col gap-8">
                <div className="w-full flex justify-center sm:justify-end">
                    <PrivacyBadge mode="api" />
                </div>
                <YouTubeOptimizer />
            </div>
            <ToolSeoBody sections={SECTIONS} howTo={HOW_TO} useCases={USE_CASES} faqs={FAQS} />
            <div className="w-full mt-12 sm:mt-16">
                <RelatedTools slug="youtube-optimizer" />
            </div>
            <Footer />
        </div>
    );
}
