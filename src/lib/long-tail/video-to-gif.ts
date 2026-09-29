import type { LongTailContent } from "../long-tail-content";

/**
 * video-to-gif long-tail pages.
 * Shared component: VideoToGifTool (props: gifFps, gifWidth, gifMaxMB).
 *
 * Behavior to describe (do NOT claim anything else):
 * - Converts video clips to GIF in the browser: upload a clip, set FPS
 *   (default 10) and width (default 480px), convert, download.
 * - Accepts MP4, MOV (QuickTime), WebM, and existing GIF files.
 * - The output GIF's file size is displayed next to the download button.
 * - gifFps/gifWidth set the STARTING slider values only.
 * - gifMaxMB shows an ADVISORY line "Tuned for sharing under X MB — check
 *   the output size before posting". It does NOT auto-iterate to hit the
 *   size. Be honest about that on every page that uses it.
 */
const videoToGifForDiscord: LongTailContent = {
    id: "video-to-gif-for-discord",
    slug: "video-to-gif-for-discord",
    hubId: "video-to-gif",
    href: "/tools/video-to-gif/video-to-gif-for-discord/",
    crumb: "Video to GIF for Discord",
    h1: "Video to GIF for Discord — Under the 8MB Limit",
    subtitle:
        "Turn any clip into a Discord-friendly GIF that fits the 8MB free upload limit. Your video never leaves your browser, and the output size is shown before you download.",
    metaTitle: "Video to GIF for Discord — Under 8MB Limit Free | YuliusBox",
    metaDescription:
        "Convert video to GIF for Discord under the 8MB limit. Free online converter with size preview — no upload, no signup. Perfect for emojis and reaction GIFs.",
    keywords: [
        "video to gif for discord",
        "discord gif maker 8mb",
        "convert video to gif under 8mb",
        "discord gif converter",
    ],
    preset: { gifFps: 10, gifWidth: 480, gifMaxMB: 8 },
    howTo: [
        "Drop your video clip into the uploader above — it stays on your device.",
        "The FPS and width sliders start at Discord-friendly values; lower either one if the previewed size is too big.",
        "Check the output size shown next to the download button, then download and post it straight into Discord.",
    ],
    sections: [
        {
            heading: "Discord's 8MB ceiling (and why your GIF keeps failing)",
            paragraphs: [
                "Discord's free tier caps uploads at 8MB (Nitro raises it to 10MB or more depending on the plan). A 10-second phone clip at 1080p can easily be 20–40MB, and most screen-captured \"GIFs\" people find online are actually MP4 files — Discord shows those as videos, not looping animations. If you want a true GIF that autoplays inline in chat, it has to be a real .gif file under the limit.",
                "GIFs are also famously inefficient: every frame is a full image, so the same 5 seconds of video can be ten times bigger as a GIF than as an MP4. That's why this page starts the sliders at Discord-friendly values — 10 FPS and 480 pixels wide — instead of defaults that look great and upload nowhere.",
            ],
        },
        {
            heading: "How the 8MB advisory works (read this)",
            paragraphs: [
                "Honesty first: this tool does NOT automatically force your GIF under 8MB. The preset tunes the starting FPS and width toward a Discord-safe size and shows an advisory line — \"Tuned for sharing under 8 MB — check the output size before posting\" — but the conversion is exactly the same encoder the main tool uses. The final number you see next to the download button is the real output size, and it is your job to check it.",
                "If the result is over 8MB, the fix is simple: drag the FPS slider down (8 FPS still reads fine for reaction clips) or narrow the width to 360px or 320px, then re-convert. Two seconds of tweaking beats re-uploading a rejected file. Shorter clips help enormously — a 3-second reaction loop converts to a fraction of a 10-second one.",
            ],
        },
        {
            heading: "What makes a good Discord GIF",
            paragraphs: [
                "Discord renders GIFs at chat-column width, so detail matters less than motion. For emoji-style reactions and server stickers, 320–480px wide at 8–12 FPS is the sweet spot: text stays readable, loops feel snappy, and files stay small. Heavy gradients, confetti, and film-grain backgrounds all inflate GIF size because the format can't compress noisy frames well.",
                "Keep clips short — under 5 seconds is ideal. A punchy 3-second reaction loop gets used a hundred times; a 15-second clip gets posted once and never again. If your source is a long recording, trim it to the best moment in your editor or recorder first, then convert just that slice.",
            ],
        },
        {
            heading: "Why convert in your browser instead of a bot or app",
            paragraphs: [
                "Discord bots that \"convert for you\" need your file uploaded to someone's server, and many free converter sites re-compress your upload on hardware you don't control. Clips people turn into Discord GIFs are often personal — gaming moments with voice chat, screen captures of DMs, funny outtakes. Running the conversion locally means the file never crosses a network at all.",
                "There is also no account, no watermark, and no \"convert 3 files per day\" paywall here. You can batch through a dozen candidate clips to find the one reaction that lands, check each output size, and keep only the winners.",
            ],
        },
        {
            heading: "Nitro, Tenor, and when GIF isn't the answer",
            paragraphs: [
                "If you have Nitro, the limit question mostly disappears — 10MB (or higher on some tiers) covers almost any reasonable reaction GIF at these settings. The GIFs you send from Discord's built-in Tenor picker don't count against your limit at all, so for common reactions, searching Tenor in the chat box is faster than converting anything.",
                "And sometimes a video is simply better: if the clip has sound you care about, or it's longer than about 8 seconds, post the MP4. Discord embeds videos beautifully and they autoplay too. Reserve true GIFs for the loopable, silent, reaction-shaped moments — that's where the format earns its (bloated) file size.",
            ],
        },
    ],
    faqs: [
        {
            question: "Will the GIF be automatically compressed to under 8MB?",
            answer: "No — and pages that promise that are lying to you. This page starts the FPS and width sliders at Discord-friendly values and shows an advisory reminder plus the real output size next to the download button. You check the number; if it's over 8MB, lower the FPS or width and convert again. It usually takes one retry.",
        },
        {
            question: "What FPS and width should I use for Discord GIFs?",
            answer: "Start with the page defaults: 10 FPS and 480px wide. For reaction-style clips, 8–12 FPS at 320–480px wide almost always lands under 8MB for clips under 5 seconds. Going below 6 FPS starts to look choppy for anything with fast motion.",
        },
        {
            question: "Can I use this for Discord server emojis?",
            answer: "Yes, with one caveat: Discord emojis cap at 256KB and display at 32×32 pixels, which is a much tighter target than chat GIFs. Use a very short clip (1–2 seconds), drop to 8 FPS and 128px wide, and check the output size — it may take a couple of tries to get under 256KB.",
        },
        {
            question: "Does the GIF keep transparency or sound?",
            answer: "GIF has no sound, ever — if your clip's audio matters, post the video file instead. Transparency only survives if your source video actually has an alpha channel (rare outside of motion-graphics exports); ordinary camera and screen clips convert as fully opaque GIFs.",
        },
    ],
    related: [
        {
            href: "/tools/video-to-gif",
            label: "Video to GIF — full manual FPS and width control",
        },
        {
            href: "/tools/video-to-gif/compress-gif-online/",
            label: "Compress an existing GIF to a smaller file",
        },
        {
            href: "/tools/video-to-gif/screen-recording-to-gif/",
            label: "Turn screen recordings into GIFs",
        },
        {
            href: "/tools/image-compressor/convert-image-to-webp/",
            label: "Compress images to WebP for the web",
        },
    ],
};

const convertMovToGif: LongTailContent = {
    id: "convert-mov-to-gif",
    slug: "convert-mov-to-gif",
    hubId: "video-to-gif",
    href: "/tools/video-to-gif/convert-mov-to-gif/",
    crumb: "Convert MOV to GIF",
    h1: "Convert MOV to GIF Online — Free",
    subtitle:
        "iPhone screen recordings and camera clips are MOV files. Turn them into shareable GIFs in your browser — no app install, no upload, no watermark.",
    metaTitle: "Convert MOV to GIF Online Free — iPhone Clips | YuliusBox",
    metaDescription:
        "Turn MOV files (iPhone recordings, QuickTime clips) into GIFs online, free. Runs 100% in your browser — no upload, no signup, no watermark.",
    keywords: [
        "convert mov to gif",
        "mov to gif online",
        "iphone screen recording to gif",
        "mov to gif converter free",
    ],
    howTo: [
        "Drop your .mov file into the uploader above — it never leaves your device.",
        "Pick an FPS and width for the GIF (10 FPS / 480px is a good starting point for short clips).",
        "Convert, check the output size next to the download button, and download the GIF.",
    ],
    sections: [
        {
            heading: "Why MOV clips are awkward to share",
            paragraphs: [
                "Apple devices record in MOV (QuickTime) format: iPhone screen recordings, camera clips shot on iPhone or iPad, and exports from iMovie and QuickTime Player. MOV is fine inside the Apple ecosystem, but step outside it and the friction starts — many forums, chat platforms, and documentation tools either refuse MOV uploads or play them badly, and embedding a 50MB screen recording in a bug report is nobody's idea of a good time.",
                "GIF is the pragmatic escape hatch: it plays everywhere, loops automatically, and needs no player. Converting MOV to GIF turns a heavyweight Apple-native file into a lightweight, universally readable animation you can drop into Slack, GitHub issues, Discord, or a slide deck.",
            ],
        },
        {
            heading: "The catch: MOV files are huge, GIFs are bigger",
            paragraphs: [
                "A one-minute iPhone screen recording can be 60–100MB. GIF encoding expands size roughly tenfold versus modern video codecs, so converting a long MOV straight to GIF is how you get a 200MB \"GIF\" that no platform will accept. The single most important step of MOV-to-GIF conversion is trimming the clip before you convert.",
                "Keep it under 10 seconds — under 5 if you can. iPhone's Photos app lets you trim the clip before you even open this page: open the recording, tap Edit, drag the handles to the moment that matters, and save. Converting the trimmed slice keeps the GIF small and the message focused.",
            ],
        },
        {
            heading: "Choosing FPS and width for MOV sources",
            paragraphs: [
                "iPhone recordings are 60fps and often 1170px+ wide — both far more than a GIF needs. For screen recordings with UI text, prioritize width over FPS: 480px wide at 10 FPS keeps on-screen text readable while cutting frames to a sixth of the original. For camera clips of real-world action, prioritize FPS: 12–15 FPS at 360–480px wide keeps motion smooth.",
                "Whatever you choose, the output size shown next to the download button is the truth. If it's too big, shorten the clip first (biggest win), then lower FPS, then narrow the width — in that order, because each step trades less of what makes the GIF readable.",
            ],
        },
        {
            heading: "Private by construction",
            paragraphs: [
                "MOV clips are personal by nature: screen recordings of your banking app, camera clips of your family, product walkthroughs with your name in the corner. Many free MOV converters upload the file to a server, process it, and hope you trust their deletion policy.",
                "This page does the entire conversion in your browser's own video and canvas pipeline. The MOV never travels over the network — you can verify that with your browser's network inspector while it converts. Nothing to delete later because nothing was ever uploaded.",
            ],
        },
        {
            heading: "When GIF is the wrong output",
            paragraphs: [
                "Not every MOV deserves to become a GIF. If the clip has narration or sound you need, post the MOV (or re-export it as MP4 for compatibility). If it's a tutorial longer than ~15 seconds, a hosted video link beats a 100MB GIF. And if you're sharing within the Apple ecosystem — AirDrop to a friend's iPhone, embedding in Keynote — the original MOV is already the right format.",
                "GIF earns its place for short, silent, loopable moments: a 4-second UI bug reproduction, a reaction clip, a before/after animation. For those, convert here, check the size, and post the GIF with confidence.",
            ],
        },
    ],
    faqs: [
        {
            question: "Can I convert an iPhone screen recording directly?",
            answer: "Yes. iPhone screen recordings save as .mov, which this tool accepts. For best results, trim the recording in the Photos app first (Edit → drag the handles) so you're only converting the few seconds that matter — a trimmed clip converts faster and produces a much smaller GIF.",
        },
        {
            question: "My MOV is 2 minutes long. Can I convert the whole thing?",
            answer: "Technically yes, but you shouldn't. A 2-minute MOV would become a GIF hundreds of megabytes in size — unplayable in chat and rejected by every platform. Trim it to the best 5–10 seconds first; if you need the full recording shared, post the video file instead of a GIF.",
        },
        {
            question: "Will the GIF keep the iPhone recording's quality?",
            answer: "It keeps the visible content faithfully, but GIF is limited to 256 colors per frame, so gradients and subtle shading will show banding that the MOV didn't have. For UI recordings and text this is invisible; for cinematic camera footage it's noticeable. That's a GIF format limit, not a tool limit — no converter can fix it.",
        },
        {
            question: "Is my MOV uploaded to a server during conversion?",
            answer: "No. The conversion runs entirely in your browser using your device's own media pipeline. Your clip never leaves your computer or phone — check your browser's network tab during conversion if you want proof.",
        },
    ],
    related: [
        {
            href: "/tools/video-to-gif",
            label: "Video to GIF — full manual FPS and width control",
        },
        {
            href: "/tools/video-to-gif/video-to-gif-for-discord/",
            label: "Make Discord-ready GIFs under 8MB",
        },
        {
            href: "/tools/video-to-gif/screen-recording-to-gif/",
            label: "Turn screen recordings into GIFs",
        },
        {
            href: "/tools/image-compressor",
            label: "Image Compressor — shrink photos for the web",
        },
    ],
};

const webmToGifConverter: LongTailContent = {
    id: "webm-to-gif-converter",
    slug: "webm-to-gif-converter",
    hubId: "video-to-gif",
    href: "/tools/video-to-gif/webm-to-gif-converter/",
    crumb: "WebM to GIF Converter",
    h1: "Convert WebM to GIF Online — Free",
    subtitle:
        "WebM clips from Loom, OBS, and browser recorders don't play everywhere. Convert them to universally-readable GIFs in your browser — free, no upload.",
    metaTitle: "Convert WebM to GIF Online Free — No Upload | YuliusBox",
    metaDescription:
        "Turn WebM videos (Loom, OBS, screen recorders) into GIFs online, free. Browser-local conversion — no upload, no signup, no watermark.",
    keywords: [
        "webm to gif",
        "convert webm to gif",
        "webm to gif converter",
        "loom recording to gif",
    ],
    howTo: [
        "Drop your .webm file into the uploader above — it stays on your device.",
        "Set the FPS and width for the GIF (10 FPS / 480px suits most screen captures).",
        "Convert, check the output size next to the download button, and download the GIF.",
    ],
    sections: [
        {
            heading: "Where WebM comes from (and where it breaks)",
            paragraphs: [
                "WebM is the default export of a huge slice of the modern recording stack: Loom's downloads, OBS Studio's default recording format, Chrome's built-in screen recorder, and most browser-based capture tools all hand you a .webm file. It's an excellent format — small files, good quality, open codecs (VP8/VP9).",
                "The problem is acceptance. PowerPoint, Keynote, many email clients, older forums, and a long tail of internal company tools either can't play WebM or handle it badly. Safari's WebM support has historically lagged too. When the place you're posting doesn't speak WebM, GIF is the format everyone understands.",
            ],
        },
        {
            heading: "Why WebM-to-GIF feels lossy (and what to do)",
            paragraphs: [
                "Converting WebM to GIF always feels like a step down, because it is: you're going from an efficient modern codec with millions of colors to a 1987 format with 256 colors per frame. Smooth gradients — the kind Loom's blurred backgrounds and OBS's webcam overlays are full of — will show banding in the GIF that the WebM never had.",
                "Two mitigations actually help. First, keep the GIF's width generous (480–640px) so edges and text stay crisp; banding bothers people less when the image is sharp. Second, don't over-compress the FPS: 10–12 FPS hides more color banding than 6 FPS does, because the eye forgives gradient steps in moving images. If the GIF is too big at those settings, shorten the clip rather than crushing the quality.",
            ],
        },
        {
            heading: "OBS and Loom workflows that end in GIF",
            paragraphs: [
                "OBS users: record the segment as WebM (the default), then trim ruthlessly. A GIF audience wants the 5-second bug reproduction or the satisfying before/after — not the 3-minute session. Many OBS users already record \"GIF-first\": short takes, mouse movements deliberate, on-screen actions paced for a loop.",
                "Loom users: download the video as WebM from the share menu, then convert the best slice here. This is a common pattern for docs teams — a Loom walkthrough becomes three looping GIFs embedded in the help article, each showing one step, while the full Loom link stays below for anyone who wants narration.",
            ],
        },
        {
            heading: "Transparency: VP9 alpha doesn't survive",
            paragraphs: [
                "A niche but real gotcha: WebM supports an alpha channel (transparency), and some motion-graphics exports use it. GIF also supports transparency — but the two systems don't map cleanly, and this tool converts the WebM as opaque video. If your WebM has transparency you need to keep, you'll need a desktop editor, not a format converter.",
                "For the 99% case — screen recordings, webcam clips, gameplay — there's no transparency involved and this doesn't matter. Mentioned here only so the 1% doesn't discover it by surprise.",
            ],
        },
        {
            heading: "Converted locally, like everything here",
            paragraphs: [
                "WebM files from screen recorders often contain exactly what you were doing: your inbox, your codebase, your unreleased product. Uploading that to a random converter site is a needless risk, and many \"free\" converters monetize precisely by being careless with uploads.",
                "This page decodes your WebM and re-encodes the GIF entirely in your browser. The file never crosses the network — confirm it in the network inspector during a conversion. No account, no watermark, no per-day limit on how many clips you convert.",
            ],
        },
    ],
    faqs: [
        {
            question: "Why does my WebM look worse as a GIF?",
            answer: "GIF is limited to 256 colors per frame while your WebM (VP9) has millions, so smooth gradients show banding. It's a format limit every converter shares. Keeping width at 480px+ and FPS at 10–12 hides most of the banding; shortening the clip keeps the file small without crushing quality.",
        },
        {
            question: "Can I convert a Loom recording to GIF?",
            answer: "Yes — download the Loom video as WebM from its share menu, then drop it here. Trim to the best 5–10 second slice for a GIF-sized file. Docs teams commonly turn one Loom walkthrough into several looping GIFs for help articles.",
        },
        {
            question: "Does the converter keep the WebM's audio?",
            answer: "No — GIF has no audio track at all. If your clip's narration matters, keep it as WebM/MP4. Convert to GIF only for short, silent, visual moments.",
        },
        {
            question: "My WebM has transparency. Will the GIF keep it?",
            answer: "No — this tool converts WebM as opaque video, so VP9 alpha channels don't survive. For transparency-preserving animation, use a desktop editor (or export as APNG/WebP instead). Standard screen and camera recordings have no transparency, so this affects almost nobody.",
        },
    ],
    related: [
        {
            href: "/tools/video-to-gif",
            label: "Video to GIF — full manual FPS and width control",
        },
        {
            href: "/tools/video-to-gif/screen-recording-to-gif/",
            label: "Turn screen recordings into GIFs",
        },
        {
            href: "/tools/video-to-gif/convert-mov-to-gif/",
            label: "Convert MOV clips to GIF",
        },
        {
            href: "/tools/screenshot-beautifier",
            label: "Screenshot Beautifier — polished stills for docs",
        },
    ],
};

const screenRecordingToGif: LongTailContent = {
    id: "screen-recording-to-gif",
    slug: "screen-recording-to-gif",
    hubId: "video-to-gif",
    href: "/tools/video-to-gif/screen-recording-to-gif/",
    crumb: "Screen Recording to GIF",
    h1: "Turn Screen Recordings into GIFs — Free",
    subtitle:
        "Looping GIFs beat static screenshots for READMEs, docs, and bug reports. Convert your screen captures to crisp, text-readable GIFs in your browser.",
    metaTitle: "Screen Recording to GIF — Free for Docs & Demos | YuliusBox",
    metaDescription:
        "Turn screen recordings into crisp GIFs for READMEs, docs, and bug reports. Free online converter — runs in your browser, no upload, no watermark.",
    keywords: [
        "screen recording to gif",
        "convert screen capture to gif",
        "gif for github readme",
        "screen recorder gif maker",
    ],
    howTo: [
        "Drop your screen recording into the uploader above — it never leaves your device.",
        "Keep the width at 480px or higher so on-screen text stays readable; 10 FPS is enough for UI demos.",
        "Convert, check the output size next to the download button, and embed the GIF in your docs or issue.",
    ],
    sections: [
        {
            heading: "Why GIFs win for technical communication",
            paragraphs: [
                "A screenshot shows a state; a GIF shows a behavior. For GitHub README demos, documentation, and bug reports, that difference is everything: a 5-second loop of the bug reproducing communicates more than three annotated screenshots and a paragraph. Readers see the clicks, the timing, the exact sequence — no video player required, no \"click to play\" friction.",
                "GIFs also embed everywhere screenshots do: Markdown READMEs, GitHub issues, Stack Overflow answers, Notion docs, Jira tickets. Video embeds in those places are either unsupported or degrade into download links. A GIF just plays, inline, on every platform, forever.",
            ],
        },
        {
            heading: "Crisp text: the one setting that matters",
            paragraphs: [
                "Screen-recording GIFs live or die on text readability. The rule: prioritize width over frame rate. UI motion is slow — cursors, menus, form fills — so 8–10 FPS captures it perfectly, and the frames you save can be spent on pixels. 480px wide is the minimum for readable UI text; 640px is better for dense interfaces like IDEs and dashboards.",
                "Record with this in mind too: zoom your browser or app to 125–150% before recording, and keep the capture region tight around the action. A full 4K desktop shrunk to a 480px GIF turns every menu label into mush; a focused 800px region at the same output width stays razor sharp.",
            ],
        },
        {
            heading: "A workflow for README and docs GIFs",
            paragraphs: [
                "The pattern that works: record the interaction once, slowly and deliberately — pause half a beat before each click so the loop reads clearly. Trim to the essential 3–8 seconds. Convert at 10 FPS / 480–640px wide. Check the size: GitHub renders images up to 10MB in Markdown, but a 2–4MB GIF loads faster and respects your readers' bandwidth.",
                "Loop discipline matters. Cut the clip so the end flows back into the start — no awkward jump to an unrelated frame. A clean loop reads as one continuous demonstration; a sloppy loop reads as a mistake. Most screen recorders let you trim the tail; use it.",
            ],
        },
        {
            heading: "Bug reports: the GIF as evidence",
            paragraphs: [
                "For bug reports, a GIF does something a video can't: it plays inline in the issue tracker without anyone pressing play. Maintainers triage dozens of issues; the one with a 4-second looping reproduction gets understood in seconds. Include the full interaction — the setup click, the trigger, the broken result — and keep the cursor visible.",
                "One caution: screen recordings leak context. Before converting, check the frames for open tabs, API keys in environment variables, customer names in the background. Trim or re-record rather than shipping secrets inside your evidence. The conversion here is local, but the GIF you publish is public.",
            ],
        },
        {
            heading: "File size and where GIF stops working",
            paragraphs: [
                "Mind the platform limits: GitHub Markdown images cap around 10MB, Stack Overflow lower. If your GIF is too big, shorten the clip first — halving duration halves the size with zero quality loss. Then reduce FPS to 8, then width to 480. Never sacrifice text readability to save a megabyte; a blurry demo GIF is worse than none.",
                "And know when to graduate to video: tutorials over ~15 seconds, anything with narration, or demos where fine detail matters (sub-pixel rendering, color grading) belong in a hosted video with a thumbnail link. GIF is for the short, silent, loopable proof — used there, it's unbeatable.",
            ],
        },
    ],
    faqs: [
        {
            question: "What FPS should I use for screen recording GIFs?",
            answer: "8–10 FPS is the sweet spot for UI demos — cursors, clicks, and form fills all read clearly. Spend your size budget on width (480–640px) instead of frames; text readability matters far more than smoothness for documentation GIFs.",
        },
        {
            question: "How do I keep text readable in the GIF?",
            answer: "Three things: record at 125–150% UI zoom, capture a tight region around the action (not the full desktop), and convert at 480px wide or more. A focused 800px capture region at 480px output looks dramatically sharper than a 4K desktop shrunk to the same size.",
        },
        {
            question: "What's the size limit for GIFs on GitHub?",
            answer: "GitHub renders images up to about 10MB in Markdown and issues, but aim for 2–4MB so pages load fast. If your GIF is over the limit, shorten the clip first (halving duration halves the size), then drop FPS to 8, then width to 480px.",
        },
        {
            question: "Can I use this for Stack Overflow answers?",
            answer: "Yes — inline GIFs are excellent in answers because they play without a click. Keep them short (under 8 seconds), focused on the exact step, and small enough to load quickly. A GIF that demonstrates the fix beats a code block alone for UI questions.",
        },
    ],
    related: [
        {
            href: "/tools/video-to-gif",
            label: "Video to GIF — full manual FPS and width control",
        },
        {
            href: "/tools/video-to-gif/convert-mov-to-gif/",
            label: "Convert iPhone MOV recordings to GIF",
        },
        {
            href: "/tools/video-to-gif/webm-to-gif-converter/",
            label: "Convert WebM recordings to GIF",
        },
        {
            href: "/tools/screenshot-beautifier/code-screenshot-generator/",
            label: "Beautiful code screenshots for docs",
        },
    ],
};

const compressGifOnline: LongTailContent = {
    id: "compress-gif-online",
    slug: "compress-gif-online",
    hubId: "video-to-gif",
    href: "/tools/video-to-gif/compress-gif-online/",
    crumb: "Compress GIF Online",
    h1: "Compress GIF Online — Make GIFs Smaller",
    subtitle:
        "Got a bloated GIF that's too big to post? Re-encode it at lower FPS or width to shrink it — in your browser, with the output size shown before you download.",
    metaTitle: "Compress GIF Online Free — Shrink GIF File Size | YuliusBox",
    metaDescription:
        "Reduce GIF file size online, free. Re-encode at lower FPS or width and preview the exact output size — all in your browser, no upload.",
    keywords: [
        "compress gif online",
        "reduce gif file size",
        "shrink gif",
        "make gif smaller",
    ],
    preset: { gifFps: 10, gifWidth: 480 },
    howTo: [
        "Drop your oversized GIF into the uploader above — it never leaves your device.",
        "The sliders start at 10 FPS / 480px; lower either one to shrink the file.",
        "Check the new output size next to the download button, then download the smaller GIF.",
    ],
    sections: [
        {
            heading: "Why your GIF is enormous",
            paragraphs: [
                "GIFs bloat for predictable reasons: too many frames (30 FPS source), too many pixels (1080p source), too many seconds (a 20-second \"GIF\"), or too much visual noise (confetti, film grain, camera shake — the format compresses noise terribly). A GIF with all four problems can weigh 50MB while saying nothing a 3MB version couldn't.",
                "Most bloated GIFs arrive second-hand: downloaded from a converter that defaulted to max quality, exported from a video editor at full resolution, or screen-captured at 60fps. The original video is long gone, so re-encoding the GIF itself is the only practical fix — which is exactly what this page does.",
            ],
        },
        {
            heading: "How re-encoding shrinks a GIF (honest trade-offs)",
            paragraphs: [
                "This page treats your GIF as a video source and re-encodes it at the FPS and width you choose. Dropping 30 FPS to 10 cuts roughly two-thirds of the frames; narrowing 1080px to 480px cuts over three-quarters of the pixels. Combined, a 40MB GIF routinely becomes 3–5MB — small enough for Discord, Slack, and forums.",
                "The honest trade: re-encoding is lossy. Motion gets choppier below ~8 FPS, fine detail softens as width drops, and GIF's 256-color palette gets re-quantized, which can add banding to gradients that were smooth in the bloated original. Start at the page defaults (10 FPS / 480px) and only go lower while the GIF still looks like itself.",
            ],
        },
        {
            heading: "The hierarchy of fixes: duration first",
            paragraphs: [
                "Before touching quality, ask whether the GIF needs all its seconds. Trimming a 12-second GIF to its best 4 seconds cuts the size by two-thirds with zero visual loss — no other setting comes close. If your GIF tool can't trim, this is the moment to go back to the original video and re-export just the good part.",
                "Which brings up the real advice: whenever you still have the source video, re-convert from that instead of re-encoding the GIF. Every GIF generation loses color information; re-encoding a GIF is a second lossy generation. The page accepts MP4, MOV, and WebM for exactly this reason — the video is always the better starting point.",
            ],
        },
        {
            heading: "What the sliders do (and don't do)",
            paragraphs: [
                "The FPS slider sets how many frames per second the output keeps; the width slider sets the output pixel width (aspect ratio preserved). The preset starts both at sensible middle values — 10 FPS, 480px — rather than the extremes, so your first conversion is usually close to right.",
                "What the sliders don't do: there's no automatic \"make it exactly 2MB\" mode, and no magic that keeps full quality at a tenth of the size. The output size shown next to the download button is the real number — iterate on the sliders until it fits your platform's limit, checking the preview each time.",
            ],
        },
        {
            heading: "Platform limits cheat sheet",
            paragraphs: [
                "Know your target before you compress: Discord free uploads cap at 8MB, Slack at 1GB (but large GIFs won't animate inline well past ~20MB), most forums cap attachments at 2–8MB, and email providers start rejecting or refusing to animate GIFs past a few megabytes. iMessage handles large GIFs fine; WhatsApp compresses them into videos anyway.",
                "A practical rule: aim for half your platform's limit. A 4MB GIF posts instantly on an 8MB-limit platform; an 7.9MB GIF on the same platform uploads slowly and sometimes fails on flaky connections. The size preview on this page makes targeting easy — convert, read the number, adjust, repeat.",
            ],
        },
    ],
    faqs: [
        {
            question: "Will compressing make my GIF look bad?",
            answer: "At 10 FPS / 480px, most GIFs look essentially the same at a fraction of the size. Quality visibly drops below ~8 FPS (choppy motion) or under ~320px wide (soft detail). The trick is stopping at the first settings that fit your size limit — don't compress further than you need to.",
        },
        {
            question: "Can you compress a GIF to an exact file size?",
            answer: "No — and be suspicious of tools that claim to. This page shows you the exact output size after each conversion so you can iterate the sliders until it fits. Usually one or two tries gets you under Discord's 8MB or any forum limit.",
        },
        {
            question: "Should I compress the GIF or re-convert from the video?",
            answer: "Re-convert from the video whenever you still have it — it's a first-generation encode with full color information. Re-encoding an existing GIF is a second lossy generation. Use this page for GIFs whose source video is gone (downloaded GIFs, old captures).",
        },
        {
            question: "Why is my GIF still big after compressing?",
            answer: "Usually it's duration: a 20-second GIF at any reasonable quality is still huge. Trim to the essential seconds first. If it's already short, the content may be inherently noisy (confetti, grain, shaky camera) — GIF compresses noise terribly, and the only fix is lower FPS/width or accepting a bigger file.",
        },
    ],
    related: [
        {
            href: "/tools/video-to-gif",
            label: "Video to GIF — convert clips with full control",
        },
        {
            href: "/tools/video-to-gif/video-to-gif-for-discord/",
            label: "Make Discord-ready GIFs under 8MB",
        },
        {
            href: "/tools/video-to-gif/screen-recording-to-gif/",
            label: "Turn screen recordings into GIFs",
        },
        {
            href: "/tools/image-compressor/convert-image-to-webp/",
            label: "Compress still images to WebP",
        },
    ],
};

export const videoToGifPages: LongTailContent[] = [
    videoToGifForDiscord,
    convertMovToGif,
    webmToGifConverter,
    screenRecordingToGif,
    compressGifOnline,
];
