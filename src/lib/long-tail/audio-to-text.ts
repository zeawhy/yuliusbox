import type { LongTailContent } from "../long-tail-content";

/**
 * audio-to-text long-tail pages.
 * Shared component: AudioToTextTool (takes NO props) — pages are
 * differentiated purely through genuinely different content.
 *
 * Verified against src/app/tools/audio-to-text/page.tsx:
 * - File input accept="audio/*"; UI states "Supports MP3, WAV, M4A".
 * - Output = plain-text transcript: Copy to clipboard + "Export TXT"
 *   (transcription-<ts>.txt). NO SRT, NO timestamps, NO speaker diarization.
 * - Model tiers: tiny (Fast) / base (Balanced, default) / small (High accuracy);
 *   model files download once on first use, then cached; choice remembered.
 * - Whisper runs locally via WebAssembly (ONNX runtime) — works offline after
 *   the model loads. Language: auto / English / Chinese; auto-detect misfires
 *   on very short clips (tool warns under 3 seconds).
 * - Built-in mic recording via MediaRecorder.
 * Content below never promises SRT, timestamps, or speaker labels.
 */

export const transcribeMp3ToText: LongTailContent = {
    id: "transcribe-mp3-to-text",
    slug: "transcribe-mp3-to-text",
    hubId: "audio-to-text",
    href: "/tools/audio-to-text/transcribe-mp3-to-text/",
    crumb: "Transcribe MP3 to Text",
    h1: "Transcribe MP3 to Text — Free & Private",
    subtitle:
        "Drop in any MP3 — podcasts, lectures, voice recordings — and get a text transcript in your browser. Nothing is uploaded, ever.",
    metaTitle: "Transcribe MP3 to Text Free — Private & Local | YuliusBox",
    metaDescription:
        "Transcribe MP3 to text free in your browser. Whisper AI runs 100% locally — no upload, no account. Copy or download the transcript as TXT.",
    keywords: [
        "transcribe mp3 to text",
        "mp3 to text converter",
        "convert mp3 to text free",
        "mp3 transcription online",
        "audio to text mp3",
    ],
    howTo: [
        "Drop your MP3 into the uploader above — the Whisper model loads once, then stays cached in your browser.",
        "Pick a tier: tiny for quick drafts, base for the best balance, small for maximum accuracy on difficult audio.",
        "Copy the transcript or download it as a TXT file. Your audio never left your device.",
    ],
    sections: [
        {
            heading: "MP3: the universal transcription format",
            paragraphs: [
                "Nearly every recording in the world ends up as an MP3: podcast episodes, lecture captures, phone call recordings, voice memos exported from apps, downloaded audio from the web. It's the format everything agrees on — which is why a transcription tool that handles MP3 natively covers the vast majority of real-world jobs with zero conversion friction.",
                "This tool accepts MP3 directly — no converting to WAV first, no renaming tricks. The browser decodes the file locally and feeds it straight to Whisper. If your recording lives in another supported format (WAV, M4A), that works too, but MP3 is the path of least resistance and the format this page is optimized around.",
            ],
        },
        {
            heading: "Picking the right model tier for your MP3",
            paragraphs: [
                "Three Whisper sizes are available, and the choice depends on your audio, not your ambition. Tiny is the sprinter: fast to load, fast to transcribe, and perfectly good for clear single-speaker recordings — quick voice notes, clean dictation, well-recorded narration. Base is the balanced default most people should start with: noticeably better on accents, background noise, and imperfect recordings.",
                "Small is the precision instrument for difficult audio — overlapping voices, heavy accents, technical jargon, distant microphones. It downloads a larger model and wants a capable device; older phones will chug. A practical rule: start with base, and only re-run the tricky files on small. Your choice is remembered, so the tool adapts to your hardware once.",
            ],
        },
        {
            heading: "Honest accuracy expectations",
            paragraphs: [
                "On clear, single-speaker MP3s — a podcast with a decent mic, a lecture recorded near the speaker — Whisper's accuracy is excellent, comparable to commercial services, because it is the same model family they use. Proper nouns, brand names, and unusual terms are the weak spot: Whisper guesses phonetically, so verify names against the audio before quoting them anywhere public.",
                "Difficult audio degrades gracefully but visibly: background music beds confuse it, crosstalk merges speakers into one voice, and heavy compression artifacts (low-bitrate MP3s, speakerphone recordings) cost accuracy. The single biggest lever is the recording itself — a clean source on the tiny tier beats a noisy source on small every time. Set the language explicitly instead of auto-detect when you know it; auto-detection is convenient but less reliable.",
            ],
        },
        {
            heading: "What the transcript looks like",
            paragraphs: [
                "The output is plain running text — a faithful rendering of what was said, which you can copy to the clipboard or download as a TXT file. There are no timestamps and no speaker labels; this is a deliberate simplicity, and it shapes the workflow: the transcript is a draft for notes, quotes, show notes, and searchable archives, not a finished subtitle file.",
                "For most MP3 jobs that's exactly right. Podcasters paste it into their notes app to write show notes; students turn lecture audio into study documents; anyone with a folder of old voice recordings finally gets a searchable archive. Edit lightly, verify quotes against the audio, and you're done — no account, no per-minute fee, no waiting room.",
            ],
        },
        {
            heading: "Why local matters for MP3s",
            paragraphs: [
                "People transcribe MP3s that are often sensitive: unreleased podcast episodes, recorded calls, personal voice journals, client interviews. The standard workflow — uploading that audio to a stranger's server — is a privacy compromise most people accept only because they don't know there's an alternative. Here the alternative is the whole product: the file is decoded and transcribed by your own device's CPU.",
                "You can verify the claim yourself: open your browser's network inspector, drop in an MP3 after the model has loaded once, and watch — no audio data leaves. For pre-release content, confidential recordings, and anything you'd rather not have sitting in a third party's logs, that architectural difference is the entire point.",
            ],
        },
    ],
    faqs: [
        {
            question: "Is there a file size or length limit for MP3s?",
            answer: "No hard limit, but be realistic: the whole audio is decoded into memory and processed on your device, so a multi-hour MP3 will take a while and needs a decent machine. For very long files, split them into 30–60 minute parts for smoother processing.",
        },
        {
            question: "Does MP3 bitrate or quality affect the transcript?",
            answer: "Somewhat. Standard 128kbps+ MP3s transcribe fine; heavily compressed low-bitrate files or speakerphone recordings lose accuracy. Don't re-compress an already-compressed MP3 before transcribing — you can't add quality back, and each re-encode throws away a little more detail.",
        },
        {
            question: "Can I get subtitles with timestamps (SRT)?",
            answer: "Not currently — the tool outputs plain text (copy or TXT download), with no timestamps. It works well for notes, quotes, and searchable archives; timestamped subtitles are on the roadmap.",
        },
        {
            question: "Does it work offline?",
            answer: "Yes, after the first use. The Whisper model files download once and are cached in your browser; after that, you can disconnect from the internet and transcription keeps working entirely on-device.",
        },
    ],
    related: [
        {
            href: "/tools/audio-to-text",
            label: "Audio to Text — all formats and tiers",
        },
        {
            href: "/tools/audio-to-text/transcribe-meeting-recordings/",
            label: "Transcribe meeting recordings",
        },
        {
            href: "/tools/audio-to-text/transcribe-interviews-free/",
            label: "Transcribe interviews free",
        },
        {
            href: "/tools/audio-to-text/private-voice-transcription/",
            label: "Private voice transcription",
        },
    ],
};

export const transcribeIphoneVoiceMemos: LongTailContent = {
    id: "transcribe-iphone-voice-memos",
    slug: "transcribe-iphone-voice-memos",
    hubId: "audio-to-text",
    href: "/tools/audio-to-text/transcribe-iphone-voice-memos/",
    crumb: "Transcribe iPhone Voice Memos",
    h1: "Transcribe iPhone Voice Memos to Text — Free",
    subtitle:
        "Your Voice Memos app records great audio but keeps it locked away. Export the .m4a, drop it here, and get searchable text — privately, in your browser.",
    metaTitle: "Transcribe iPhone Voice Memos to Text — Free | YuliusBox",
    metaDescription:
        "Transcribe iPhone Voice Memos free. Export the .m4a from the app, drop it in your browser, get text via local Whisper AI. No upload, no account.",
    keywords: [
        "transcribe iphone voice memos",
        "voice memo to text",
        "convert voice memo to text",
        "iphone voice memo transcription",
        "m4a to text free",
    ],
    howTo: [
        "In the Voice Memos app, tap your recording, tap the ••• menu, then Share → Save to Files to export the .m4a.",
        "Open this page on your computer, drop the .m4a into the uploader — M4A is fully supported, no conversion needed.",
        "Copy the transcript or download it as TXT, then paste it into Notes or Notion where it's searchable.",
    ],
    sections: [
        {
            heading: "The Voice Memos trap: great audio, zero searchability",
            paragraphs: [
                "iPhone's Voice Memos app is one of the best pocket recorders ever made — one tap, excellent microphones, automatic file management. But a hundred voice memos is a write-only archive: ideas, quotes, reminders, and half-formed thoughts sealed inside audio files you will never listen to again. The memos aren't the problem; the lack of text is.",
                "Transcription breaks the seal. A memo becomes a paragraph you can search, skim, quote, and file — which transforms Voice Memos from a junk drawer into a genuine second brain. The only missing step has been a transcription path that doesn't upload your personal recordings to a cloud service, and that's what this page provides.",
            ],
        },
        {
            heading: "Getting the .m4a out of your iPhone",
            paragraphs: [
                "Apple doesn't make the export obvious, but it's two taps: open the memo, tap the ••• button, choose Share, then Save to Files. The file lands in your iCloud Drive or On My iPhone as an .m4a — from there, AirDrop it to your Mac, access it via iCloud Drive on a PC, or open this page directly in mobile Safari and upload it from the Files app.",
                "The .m4a format needs no conversion — the tool decodes iPhone audio natively in the browser, so what you exported is exactly what you transcribe. If a memo is very long, consider trimming it in the Voice Memos app first (Edit Recording → Trim): shorter files process faster and use less memory on your device.",
            ],
        },
        {
            heading: "Recording memos that transcribe well",
            paragraphs: [
                "Voice Memos already records clean audio, but two habits make transcripts dramatically better. First, hold the phone reasonably close when the idea matters — a memo recorded across a noisy room will transcribe like a memo recorded across a noisy room. Second, speak in complete thoughts: the tool warns about clips under three seconds because very short fragments genuinely transcribe poorly.",
                "Skip the urge to whisper-record in meetings or lectures from the back row; distance is the enemy of accuracy. For anything important, a quick test helps: record ten seconds, transcribe it, and check — if the test is clean, the full memo will be too.",
            ],
        },
        {
            heading: "From transcript to searchable notes",
            paragraphs: [
                "The output is plain text — copy it or download the TXT file, then paste it wherever your notes live. The highest-value workflow is boring and effective: transcript goes under the memo's title in Notes, Notion, or Obsidian, and suddenly every idea you've ever dictated is full-text searchable. Months later, you'll find the quote you half-remember with a keyword search instead of scrubbing through audio.",
                "One workflow note: the transcript has no timestamps, so it won't tell you where in the memo something was said — but since the whole memo is now text, you rarely need to go back to the audio at all. Keep the .m4a files as the archive of record; the text is the working copy.",
            ],
        },
        {
            heading: "Your memos stay yours",
            paragraphs: [
                "Voice memos are personal by nature — half-formed ideas, private reminders, conversations you recorded for your own reference. Uploading them to a transcription service means handing that intimacy to a company's servers, retention policies, and data practices. This tool runs Whisper locally in your browser instead: the .m4a is decoded and transcribed on your own device.",
                "After the model files download once, the whole thing even works offline — a fitting setup for the most personal recordings you own. No account, no upload queue, no trace of your memos anywhere but your machine.",
            ],
        },
    ],
    faqs: [
        {
            question: "How do I export a voice memo from my iPhone?",
            answer: "Open the memo in the Voice Memos app, tap •••, then Share → Save to Files. This exports the recording as an .m4a file, which you can AirDrop to a Mac, access via iCloud Drive on a PC, or upload directly from mobile Safari.",
        },
        {
            question: "Can I transcribe directly on my iPhone in Safari?",
            answer: "The page works in mobile browsers, but a computer is smoother: the Whisper model files are a sizable one-time download (use Wi-Fi, not mobile data), and larger models need desktop-class hardware. For occasional short memos on the go, the tiny tier on a recent iPhone is workable.",
        },
        {
            question: "What about Android voice recordings?",
            answer: "They work too — Android recorders typically produce .m4a or .mp3 files, both supported. Transfer the file to your computer or upload it from your phone's browser the same way.",
        },
        {
            question: "The share sheet won't send my 2-hour memo. What now?",
            answer: "Very long memos can choke the share sheet. Trim the recording in the Voice Memos app (Edit Recording → Trim) to the section you need, or split it into parts — shorter files also transcribe faster and use less memory.",
        },
    ],
    related: [
        {
            href: "/tools/audio-to-text",
            label: "Audio to Text — all formats and tiers",
        },
        {
            href: "/tools/audio-to-text/transcribe-mp3-to-text/",
            label: "Transcribe MP3 to text",
        },
        {
            href: "/tools/audio-to-text/private-voice-transcription/",
            label: "Private voice transcription",
        },
    ],
};

export const transcribeMeetingRecordings: LongTailContent = {
    id: "transcribe-meeting-recordings",
    slug: "transcribe-meeting-recordings",
    hubId: "audio-to-text",
    href: "/tools/audio-to-text/transcribe-meeting-recordings/",
    crumb: "Transcribe Meeting Recordings",
    h1: "Transcribe Meeting Recordings to Text — Free",
    subtitle:
        "Turn Zoom and Teams recordings into readable notes without uploading them anywhere. Honest guidance on long files, accuracy, and the note-taking workflow.",
    metaTitle: "Transcribe Meeting Recordings to Text — Free | YuliusBox",
    metaDescription:
        "Transcribe Zoom & Teams meeting recordings free in your browser. Local Whisper AI, no upload. Honest notes on long files and accuracy included.",
    keywords: [
        "transcribe meeting recordings",
        "meeting transcription free",
        "zoom recording to text",
        "transcribe zoom meeting",
        "meeting notes transcription",
    ],
    howTo: [
        "Download your meeting's audio file (Zoom's audio-only .m4a recording is ideal) and drop it into the uploader above.",
        "Choose the base tier for the best balance, or small for maximum accuracy if your machine is up to it — then let it process.",
        "Copy the transcript into your doc, add speaker names and action items as you review, and download the TXT for your records.",
    ],
    sections: [
        {
            heading: "Where meeting audio actually lives",
            paragraphs: [
                "Zoom makes this easy: enable audio-only recording and you get a compact .m4a file per meeting, ready to transcribe as-is. Teams is trickier — it records video (.mp4), and this tool is built for audio files, so grab the audio-only track or use a local recording instead of the cloud video. Either way, start from the actual recording file rather than re-recording playback through your mic; every generation of re-recording costs accuracy.",
                "One habit pays for itself: download the recording to your machine first. Transcribing from a local file is faster and more reliable than streaming, and it means the sensitive content of your meeting never passes through anything but your own browser.",
            ],
        },
        {
            heading: "The honest truth about long files",
            paragraphs: [
                "Here's what most transcription tools won't tell you: browser-based Whisper decodes the entire audio file into memory and processes it on your CPU, so an hour-long meeting is genuinely heavy work. Expect minutes of processing for tens of minutes of audio — longer on older machines — and keep the tab open and your laptop awake while it runs. This isn't a limitation of the tool so much as physics: accurate speech recognition takes compute.",
                "Two practical moves help. First, split marathon recordings into 30–60 minute segments; shorter files process more smoothly and a failure costs you one segment, not the whole meeting. Second, use the base tier rather than small for routine meetings — the accuracy difference on clear conference audio is small, and base finishes noticeably faster.",
            ],
        },
        {
            heading: "A note-taking workflow that actually works",
            paragraphs: [
                "The transcript is the raw material, not the notes. The workflow that works: transcribe, paste the text into your meeting doc, then do one review pass adding what the tool can't — speaker names (there are no speaker labels in the output), decisions, and action items with owners. That single pass takes ten minutes and produces notes people actually read, versus a raw transcript nobody opens.",
                "Resist the temptation to skip the review. Whisper is excellent but it won't catch that \"Q3\" was actually \"Q4\" in a mumbly aside, and it has no idea which voice belongs to whom. The transcript gives you 90% of the value — the capture — and your review supplies the 10% that makes it trustworthy.",
            ],
        },
        {
            heading: "Accuracy in the real conference room",
            paragraphs: [
                "Meeting audio is transcription's obstacle course: crosstalk, laptop fans, people talking over each other, someone presenting from a kitchen. Set the language explicitly instead of auto-detect — meetings are long enough that detection usually works, but explicit is strictly more reliable. If the recording has a consistent problem (one remote participant is always quiet), that participant's sections will simply be weaker; no setting fixes a bad source.",
                "The single biggest upgrade is free: whoever records should use Zoom's audio-only recording or a decent microphone rather than a laptop mic across the room. And brief the team once — \"the meeting is being transcribed, please don't all talk at once\" — which improves both the transcript and the meeting.",
            ],
        },
        {
            heading: "Confidential meetings stay confidential",
            paragraphs: [
                "Board discussions, HR conversations, unreleased strategy — the meetings most worth transcribing are the ones you'd least want uploaded to a transcription service. Local processing resolves the tension completely: the audio is decoded and transcribed by your own device, with no account, no server, and no retention policy to read. Verify it with your browser's network inspector if you're the cautious type.",
                "One responsibility stays with you: the TXT file you download is now a sensitive document. Store it where your meeting notes live, with the same access controls — the tool kept the audio private in transit, but the transcript's afterlife is your workflow's job.",
            ],
        },
    ],
    faqs: [
        {
            question: "How long does it take to transcribe a one-hour meeting?",
            answer: "It depends on your machine — expect minutes to tens of minutes on the base tier, longer on small. Keep the tab open and the computer awake while it processes. Splitting long recordings into 30–60 minute segments makes processing smoother and limits what a hiccup can cost you.",
        },
        {
            question: "Does it label who is speaking?",
            answer: "No — the output is plain running text with no speaker diarization and no timestamps. For meeting notes, do one review pass adding speaker names, decisions, and action items; that pass is what turns a transcript into notes people actually use.",
        },
        {
            question: "Can I transcribe a Teams recording (.mp4)?",
            answer: "This tool is built for audio files (MP3, WAV, M4A). For Teams, use an audio-only recording or extract the audio track first rather than uploading the video file. Zoom's audio-only .m4a recordings work directly with no conversion.",
        },
        {
            question: "Can I record the meeting directly in the browser instead?",
            answer: "Yes — there's a built-in mic recording button. But transcribing the actual meeting recording file is always better quality than re-recording playback through a microphone. Use direct recording only for quick captures, not as a substitute for the real file.",
        },
    ],
    related: [
        {
            href: "/tools/audio-to-text",
            label: "Audio to Text — all formats and tiers",
        },
        {
            href: "/tools/audio-to-text/transcribe-mp3-to-text/",
            label: "Transcribe MP3 to text",
        },
        {
            href: "/tools/audio-to-text/transcribe-interviews-free/",
            label: "Transcribe interviews free",
        },
        {
            href: "/tools/audio-to-text/private-voice-transcription/",
            label: "Private voice transcription",
        },
    ],
};

export const transcribeInterviewsFree: LongTailContent = {
    id: "transcribe-interviews-free",
    slug: "transcribe-interviews-free",
    hubId: "audio-to-text",
    href: "/tools/audio-to-text/transcribe-interviews-free/",
    crumb: "Transcribe Interviews Free",
    h1: "Transcribe Interviews to Text — Free",
    subtitle:
        "Journalists, researchers, and podcasters: turn interview recordings into accurate, quotable text — free, unlimited, and completely private.",
    metaTitle: "Transcribe Interviews to Text — Free & Local | YuliusBox",
    metaDescription:
        "Transcribe interviews free in your browser. Local Whisper AI, no per-minute fees, no upload. Accuracy tips for journalists and researchers included.",
    keywords: [
        "transcribe interviews free",
        "interview transcription free",
        "transcribe interview audio to text",
        "journalist transcription tool",
        "research interview transcription",
    ],
    howTo: [
        "Transfer your interview recording (MP3, WAV, or M4A) to your computer and drop it into the uploader above.",
        "Set the language explicitly and pick the small tier for maximum accuracy on important interviews — base is fine for clear audio.",
        "Copy the transcript into your editor, verify every quote against the audio, and download the TXT for your records.",
    ],
    sections: [
        {
            heading: "Why interviews demand better transcription",
            paragraphs: [
                "An interview transcript isn't notes — it's evidence. Journalists quote from it, researchers code it, podcasters cut from it. That means accuracy requirements are higher than for a casual voice memo: a misheard name becomes a printed error, a dropped \"not\" reverses a meaning. Free, unlimited, private transcription removes the cost barrier that used to force people to transcribe only the \"important\" interviews.",
                "Because there's no per-minute fee and no quota, the economics flip: transcribe everything, decide what's quotable later. The interview you almost didn't transcribe is invariably the one with the perfect quote buried at minute forty.",
            ],
        },
        {
            heading: "Recording for transcription, not just for listening",
            paragraphs: [
                "Transcription quality is decided at recording time. Put the recorder close to the subject — a phone on the table between you beats a phone in your pocket by a mile — and prefer quiet rooms over cafés. If you're doing this regularly, a cheap lapel mic is the best money you'll ever spend on accuracy; even wired earbuds as a mic outperform a distant phone.",
                "Do a ten-second test at the start of every important interview: record, play back, listen for clarity. And state names and spellings on the recording itself (\"Could you spell your surname for the transcript?\") — future-you, hunting for the correct spelling of a source's name at midnight, will be grateful.",
            ],
        },
        {
            heading: "Choosing accuracy settings that matter",
            paragraphs: [
                "For interviews that will be quoted, use the small tier if your machine handles it — it's meaningfully better on the hard cases interviews produce: accented English, overlapping speech, domain jargon, emotional speech that speeds up and trails off. For clear, close-mic'd conversations, base is honestly fine and much faster.",
                "Set the language explicitly rather than trusting auto-detect; interviews in a known language should be tagged as such. And transcribe the full recording rather than excerpts — context helps Whisper resolve ambiguous words, and you'll want the surrounding material when you verify quotes anyway.",
            ],
        },
        {
            heading: "The editing pass: from transcript to quotable text",
            paragraphs: [
                "Treat the transcript as a 95%-accurate draft, because that's what it is. The editing pass has three jobs: verify every quote you'll publish against the original audio (proper nouns especially — Whisper guesses phonetically and guesses wrong), add speaker labels yourself since the output has none, and clean up the verbal tics that read terribly in print but sound natural in speech.",
                "Build the habit of keeping audio and text side by side during the edit. The transcript tells you where to look; the audio tells you what's true. Never publish a quote you haven't re-heard — this is journalism's oldest rule, and AI transcription doesn't retire it.",
            ],
        },
        {
            heading: "Consent, ethics, and your sources' privacy",
            paragraphs: [
                "Recording someone creates obligations. Get consent before you record — in many jurisdictions it's legally required, and everywhere it's ethically required. Tell sources how the recording will be used, and honor off-the-record requests completely, not performatively.",
                "Local transcription helps on the privacy side: your source's voice and words are processed on your device, never uploaded to a transcription company's servers. For sensitive interviews — whistleblowers, vulnerable populations, embargoed material — that architectural privacy isn't a nice-to-have; it's part of protecting your sources. Store recordings and transcripts securely, and know your outlet's or institution's data-handling rules.",
            ],
        },
    ],
    faqs: [
        {
            question: "How accurate is it on names and proper nouns?",
            answer: "This is Whisper's known weak spot — it renders unfamiliar names phonetically and sometimes invents plausible-sounding ones. Always verify names, places, and technical terms against the audio before quoting. Asking sources to spell their names on the recording is the best prevention.",
        },
        {
            question: "Can it identify different speakers in the interview?",
            answer: "No — there's no speaker diarization, so the transcript is one continuous text. For two-person interviews, adding speaker labels during your editing pass is quick; for multi-person panels, verify against the audio as you label.",
        },
        {
            question: "Does it handle non-English interviews?",
            answer: "Yes — Whisper supports 90+ languages. Set the language explicitly instead of auto-detect for the most reliable results, especially for shorter clips where auto-detection is less certain.",
        },
        {
            question: "Is there really no cost or limit?",
            answer: "Really. Everything runs on your device, so there are no per-minute fees, no monthly quotas, and no accounts. Transcribing a three-hour interview costs exactly as much as a three-minute one: nothing but your computer's time.",
        },
    ],
    related: [
        {
            href: "/tools/audio-to-text",
            label: "Audio to Text — all formats and tiers",
        },
        {
            href: "/tools/audio-to-text/transcribe-mp3-to-text/",
            label: "Transcribe MP3 to text",
        },
        {
            href: "/tools/audio-to-text/transcribe-meeting-recordings/",
            label: "Transcribe meeting recordings",
        },
        {
            href: "/tools/audio-to-text/private-voice-transcription/",
            label: "Private voice transcription",
        },
    ],
};

export const privateVoiceTranscription: LongTailContent = {
    id: "private-voice-transcription",
    slug: "private-voice-transcription",
    hubId: "audio-to-text",
    href: "/tools/audio-to-text/private-voice-transcription/",
    crumb: "Private Voice Transcription",
    h1: "Private Voice-to-Text — Nothing Uploaded",
    subtitle:
        "Transcribe sensitive recordings — therapy notes, legal calls, medical dictation — with AI that runs entirely on your device. No server ever hears a word.",
    metaTitle: "Private Voice-to-Text — Nothing Uploaded | YuliusBox",
    metaDescription:
        "Private voice transcription in your browser. Whisper AI runs 100% on-device — no upload, no account, no logs. For therapy, legal & medical audio.",
    keywords: [
        "private voice transcription",
        "private speech to text",
        "secure audio transcription",
        "confidential transcription online",
        "offline voice to text",
    ],
    howTo: [
        "Open this page and let the Whisper model load once — after that first download, everything runs on your device.",
        "Drop your recording into the uploader above (MP3, WAV, or M4A). It is decoded and transcribed locally.",
        "Copy the transcript or download the TXT, then store it with the same care you'd give any sensitive document.",
    ],
    sections: [
        {
            heading: "Speech is the most sensitive data you handle",
            paragraphs: [
                "A voice recording carries two layers of sensitivity at once: the content of what's said, and the biometric identity of who's saying it. Therapy sessions, legal client calls, medical dictation, HR conversations — the recordings people most need transcribed are exactly the ones that should never sit on a third party's servers, subject to someone else's retention policy, breach risk, and business model.",
                "The standard transcription workflow asks you to accept that trade silently: upload first, ask questions never. This page exists for everyone who'd rather not make it. The audio never leaves your machine because there's simply nowhere for it to go — no account, no upload endpoint, no processing queue.",
            ],
        },
        {
            heading: "How on-device transcription actually works",
            paragraphs: [
                "The engine is OpenAI's Whisper — the same model family behind many commercial transcription products — running directly in your browser via WebAssembly (ONNX runtime). On your first visit, the model files download once and are cached in your browser; from then on, your audio is decoded and transcribed by your own CPU, and the text appears as if by magic.",
                "Skeptical? You should be — privacy claims are cheap. Verify it: open your browser's network inspector, drop in a recording after the model has loaded, and watch the network tab stay silent. After that first model download, you can even disconnect from the internet entirely and transcription keeps working. That's not a metaphor for privacy; it's the mechanism.",
            ],
        },
        {
            heading: "What \"nothing uploaded\" does and doesn't cover",
            paragraphs: [
                "Let's be precise, because precision is the point. Covered: your audio file is never transmitted anywhere; there's no account tying transcripts to you; no server logs your usage. The only network activity is the one-time download of the model weights themselves — standard files from a CDN, containing no information about you or your recordings.",
                "Not covered: the security of your own device (encrypt your drive, lock your screen), and the afterlife of the transcript — once you download the TXT or copy the text, protecting it is your workflow's job, same as any sensitive document. Local transcription removes the cloud-transfer risk completely; it doesn't replace basic device hygiene.",
            ],
        },
        {
            heading: "Who this is really for",
            paragraphs: [
                "Therapists turning session recordings into clinical notes. Lawyers transcribing client calls without routing privileged conversations through a vendor. Doctors dictating notes that contain patient information. HR professionals documenting sensitive conversations. Journalists protecting sources. Anyone whose recordings carry legal, ethical, or personal weight beyond the ordinary.",
                "For these users, the accuracy story is secondary — Whisper's three tiers (tiny for speed, base for balance, small for precision) handle the transcription quality — and the privacy architecture is the product. When the question is \"can I use a transcription tool for this at all,\" on-device is the answer that makes it a yes.",
            ],
        },
        {
            heading: "A note on compliance, honestly stated",
            paragraphs: [
                "Removing the cloud transfer eliminates the biggest single risk in most privacy frameworks — but no tool can certify your whole workflow compliant. Whether you're thinking about HIPAA, GDPR, attorney-client privilege, or your institution's ethics board, local processing is a strong foundation, not a complete answer: your device security, storage practices, and consent procedures still matter.",
                "What we can say plainly: with on-device transcription, there's no vendor to vet, no data processing agreement to sign, no subprocessor list to audit — because there's no vendor in the loop at all. For many professional workflows, that simplicity is worth more than any compliance badge.",
            ],
        },
    ],
    faqs: [
        {
            question: "Is the one-time model download a privacy risk?",
            answer: "No — it's a standard download of AI model weight files from a CDN, identical for every user. It contains no information about you, and your audio is never part of it. After that first download, transcription works fully offline.",
        },
        {
            question: "Can I use this completely offline?",
            answer: "Yes, after the first visit. Once the Whisper model files are cached in your browser, disconnect from the internet and everything keeps working — upload a file, transcribe, export the TXT. Nothing needs the network again.",
        },
        {
            question: "Does this make my workflow HIPAA/GDPR compliant?",
            answer: "Local processing removes the cloud-transfer risk, which is the hardest part of most compliance puzzles — there's no vendor, no data processing agreement, no subprocessor to audit. But compliance covers your whole workflow (device security, storage, consent), so treat this as a strong foundation, not a legal guarantee.",
        },
        {
            question: "What happens to my transcript if I close the tab?",
            answer: "It's gone unless you saved it — transcripts live only in the page's memory. Copy the text or download the TXT file before closing, and store it with the same care you'd give any sensitive document.",
        },
    ],
    related: [
        {
            href: "/tools/audio-to-text",
            label: "Audio to Text — all formats and tiers",
        },
        {
            href: "/tools/audio-to-text/transcribe-interviews-free/",
            label: "Transcribe interviews free",
        },
        {
            href: "/tools/audio-to-text/transcribe-meeting-recordings/",
            label: "Transcribe meeting recordings",
        },
        {
            href: "/tools/audio-to-text/transcribe-iphone-voice-memos/",
            label: "Transcribe iPhone voice memos",
        },
    ],
};

export const audioToTextPages: LongTailContent[] = [
    transcribeMp3ToText,
    transcribeIphoneVoiceMemos,
    transcribeMeetingRecordings,
    transcribeInterviewsFree,
    privateVoiceTranscription,
];
