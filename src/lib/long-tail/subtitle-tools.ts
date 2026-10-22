import type { LongTailContent } from "../long-tail-content";

export const srtToVttConverter: LongTailContent = {
    id: "srt-to-vtt-converter",
    slug: "srt-to-vtt-converter",
    hubId: "subtitle-tools",
    href: "/tools/subtitle-tools/srt-to-vtt-converter",
    crumb: "SRT to VTT Converter",
    h1: "SRT to VTT Subtitle Converter — Free & Instant",
    subtitle:
        "Convert SubRip (SRT) subtitle files to standard WebVTT (VTT) for web players and HTML5 video. Also supports VTT to SRT. 100% in your browser.",
    metaTitle: "SRT to VTT Converter Online Free | YuliusBox",
    metaDescription:
        "Convert SRT subtitles to WebVTT format for HTML5 video and web players. Fast, 100% private in-browser conversion, zero file uploads.",
    keywords: [
        "srt to vtt",
        "convert srt to webvtt",
        "vtt to srt converter",
        "html5 subtitle converter",
        "free srt converter",
    ],
    howTo: [
        "Click \u201CSelect Subtitle File\u201D or drag your .srt file into the converter box above.",
        "The parser instantly transforms timestamp delimiters from commas to periods and prepends the standard WEBVTT header.",
        "Review the parsed subtitle cue list, timings, and word count statistics in the interactive preview table.",
        "Click \u201CDownload .vtt\u201D to save your converted file, or click \u201CCopy\u201D to paste directly into your code.",
    ],
    sections: [
        {
            heading: "SRT vs WebVTT: Key differences under the hood",
            paragraphs: [
                "SubRip (.srt) is the traditional standard for desktop media players and video editing software. It structures subtitles with sequential numeric indices, newline breaks, and comma-separated millisecond timestamps (e.g. 00:01:23,456).",
                "WebVTT (.vtt, Web Video Text Tracks) is the W3C standard designed specifically for HTML5 web video. WebVTT files must begin with a 'WEBVTT' header line, use periods instead of commas for milliseconds (e.g. 00:01:23.456), and support optional CSS cue styling (::cue), speaker tags (<v Alice>), and screen position coordinates.",
            ],
        },
        {
            heading: "Why HTML5 web video requires WebVTT",
            paragraphs: [
                "When embedding video on websites using the standard HTML5 <video> tag, browsers require the <track> element to supply captions. Web browsers natively parse WebVTT files to render subtitles over video elements on desktop and mobile devices without external JavaScript plugins.",
                "Converting your legacy SRT subtitles to clean WebVTT ensures smooth caption accessibility on Safari, Chrome, Firefox, and Edge.",
            ],
        },
        {
            heading: "Two-way conversion: VTT back to SRT",
            paragraphs: [
                "This converter is fully bi-directional. If you have WebVTT caption files downloaded from a web video platform and need to import them into Adobe Premiere Pro, DaVinci Resolve, or Final Cut Pro, drop the .vtt file in.",
                "The tool removes the WEBVTT header, converts periods back to commas, regenerates sequential cue numbers, and outputs a standard .srt file ready for your video editor.",
            ],
        },
        {
            heading: "Fast client-side processing with zero server uploads",
            paragraphs: [
                "Your subtitle files often contain unreleased video scripts, confidential meeting transcripts, or proprietary training material. Unlike traditional cloud converters that upload your text files to remote servers, YuliusBox parses and converts your subtitles 100% locally in your browser memory.",
            ],
        },
    ],
    faqs: [
        {
            question: "What is the main difference between SRT and WebVTT files?",
            answer: "SRT uses comma millisecond delimiters (00:00:01,500) and sequential numbering. WebVTT starts with a mandatory 'WEBVTT' header, uses dot millisecond delimiters (00:00:01.500), and supports CSS styling and web browser <track> tags.",
        },
        {
            question: "Can this tool convert WebVTT (.vtt) back into SRT (.srt)?",
            answer: "Yes. When you load a WebVTT file, the tool detects the format and provides a 'Convert to SRT' action, formatting the output with standard comma timestamps and sequential numbers.",
        },
        {
            question: "Will converting between formats shift or desynchronize audio timing?",
            answer: "No. The converter performs an exact numerical timestamp translation without altering start or end cue points. Your audio-visual synchronization remains identical to the original.",
        },
        {
            question: "How do I embed the converted WebVTT file in HTML5 video?",
            answer: "Add a <track> element inside your <video> tag: <track label=\"English\" kind=\"subtitles\" srclang=\"en\" src=\"subtitles.vtt\" default>. The browser handles rendering automatically.",
        },
    ],
    related: [
        {
            href: "/tools/subtitle-tools",
            label: "Burn subtitles permanently into video",
        },
        {
            href: "/tools/audio-to-text",
            label: "Transcribe audio to text with local Whisper AI",
        },
        {
            href: "/tools/video-to-gif",
            label: "Convert video to animated GIF",
        },
    ],
};

export const subtitleToolsPages: LongTailContent[] = [
    srtToVttConverter,
];
