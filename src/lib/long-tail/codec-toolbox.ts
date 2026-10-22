import type { LongTailContent } from "../long-tail-content";

export const unixTimestampConverter: LongTailContent = {
    id: "unix-timestamp-converter",
    slug: "unix-timestamp-converter",
    hubId: "codec-toolbox",
    href: "/tools/codec-toolbox/unix-timestamp-converter",
    crumb: "Unix Timestamp Converter",
    h1: "Unix Epoch Timestamp Converter — Seconds & Milliseconds",
    subtitle:
        "Convert between Unix epoch timestamps and human dates instantly. Auto-detects seconds vs milliseconds with UTC, local time, and ISO 8601 support.",
    metaTitle: "Unix Timestamp Converter Online Free | YuliusBox",
    metaDescription:
        "Convert Unix epoch timestamps to human-readable dates and back. Supports seconds, milliseconds, UTC, local time, and ISO 8601. 100% local.",
    keywords: [
        "unix timestamp converter",
        "epoch to date",
        "convert timestamp to utc",
        "epoch converter seconds milliseconds",
        "timestamp to iso 8601",
    ],
    howTo: [
        "Paste or type any numeric timestamp into the input field, or click \u201CCurrent Time\u201D to load the live clock.",
        "The parser automatically detects whether your input is in 10-digit Unix seconds or 13-digit milliseconds.",
        "View the converted date simultaneously in your local timezone, universal UTC, and standard ISO 8601 format.",
        "Use the reverse date picker below to convert any calendar date and time back into Unix epoch seconds or milliseconds.",
    ],
    sections: [
        {
            heading: "Understanding Unix epoch time: seconds vs milliseconds",
            paragraphs: [
                "Unix epoch time measures the number of seconds elapsed since 00:00:00 UTC on January 1, 1970 (not counting leap seconds). Standard POSIX environments, Linux kernel syscalls, Python time.time(), and SQL databases conventionally store 10-digit integers representing seconds.",
                "In contrast, JavaScript Date.now(), Java System.currentTimeMillis(), and high-precision distributed tracers record 13-digit integers representing milliseconds. Passing a 13-digit millisecond value into a system expecting seconds results in bizarre dates thousands of years in the future (year 55,000+ AD). This tool detects number length automatically and displays the correct epoch scale.",
            ],
        },
        {
            heading: "Timezone conversion: Local time, UTC, and ISO 8601",
            paragraphs: [
                "Distributed application servers, cloud databases, and API gateways almost universally log timestamps in Coordinated Universal Time (UTC) or ISO 8601 strings with a trailing 'Z' identifier. Meanwhile, customer tickets and developer terminals report events in local wall-clock time.",
                "This converter displays your timestamp converted into both your browser's local timezone and standard UTC, alongside formatted ISO 8601 and relative time offsets (e.g. '3 hours ago').",
            ],
        },
        {
            heading: "Essential for developer debugging and auth tokens",
            paragraphs: [
                "Software engineers encounter epoch timestamps daily: inspecting exp (expiration) and iat (issued at) claims in JSON Web Tokens (JWTs), tuning Redis TTL cache lifetimes, analyzing database audit records, and querying time-series metrics. Having a zero-latency, local converter eliminates context switching during production incident response.",
            ],
        },
        {
            heading: "100% local processing in your web browser",
            paragraphs: [
                "Timestamps from production incident logs, customer sessions, or authentication tokens may carry sensitive timing telemetry. Our converter runs entirely within your browser using native JavaScript Intl and Date APIs. Zero bytes are transmitted to any server.",
            ],
        },
    ],
    faqs: [
        {
            question: "What is the difference between Unix seconds and milliseconds?",
            answer: "Unix seconds measure time as a 10-digit integer (e.g. 1770000000). Unix milliseconds measure time as a 13-digit integer (e.g. 1770000000000). JavaScript and Java typically use milliseconds, while Unix shells, C, and Python default to seconds.",
        },
        {
            question: "Why does my timestamp show a year like 55000+?",
            answer: "This happens when a 13-digit millisecond timestamp is accidentally interpreted as seconds. The parser assumes 1,000 times more seconds have passed, shooting the date into the distant future. This tool automatically checks digit count to avoid this mistake.",
        },
        {
            question: "What is the Year 2038 Problem (Y2038)?",
            answer: "On January 19, 2038, 32-bit signed integers will overflow because their maximum value (2,147,483,647 seconds) will be reached. Modern 64-bit systems handle timestamps safely for billions of years.",
        },
        {
            question: "Are timestamps converted in UTC or local timezone?",
            answer: "Both. The tool renders your timestamp in your computer's local timezone as well as Coordinated Universal Time (UTC) and RFC 3339 / ISO 8601 notation.",
        },
    ],
    related: [
        {
            href: "/tools/codec-toolbox",
            label: "Base64 & Cryptographic Hashes",
        },
        {
            href: "/tools/jwt-decoder",
            label: "Decode JWT tokens and check exp dates",
        },
        {
            href: "/tools/log-sanitizer",
            label: "Sanitize production server logs",
        },
    ],
};

export const codecToolboxPages: LongTailContent[] = [
    unixTimestampConverter,
];
