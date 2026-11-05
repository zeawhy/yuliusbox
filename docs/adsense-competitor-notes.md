# AdSense Reapplication — Phase 3 Competitor Full-Text Comparison & Benchmark Trace (2026-11-05)

## Methodology & Ground Rules
1. **Full-text extraction**: Each top-ranked competitor page for the 5 primary tool hubs (`video-to-gif`, `id-watermark`, `audio-to-text`, `image-compressor`, `background-remover`) was fetched and parsed in full (headings, body word count, architectural disclosures, pricing/quota gates, and technical claims).
2. **"Local processing" is NOT assumed to be a differentiator**: Where competitors also run client-side in the browser (via WebAssembly, WebGPU, ONNX Runtime Web, or HTML5 Canvas), we explicitly record a **tie** on zero-upload privacy and acknowledge where competitors offer UI features our tools do not.
3. **Creating verifiable differentiation through measured data**: Where product features overlap, we differentiate our pages with reproducible, traced measurements stored under `~/workspace/agy-briefs/measurements-20261105/`, exact code-level parameter disclosure, in-memory cross-tool handoffs (`HandoffButton` / `ContinueWith`), and step-by-step Browser DevTools self-verification guides.

---

## 1. `/tools/video-to-gif` (Pilot Page)

### Competitors Analyzed in Full
| Competitor URL | Word Count | Architecture | Key Features & Strengths | Limitations / Paywalls / Gaps |
|---|---:|---|---|---|
| `https://www.xconvert.com/convert-video-to-gif` | 2,185 words | **Server-side upload** ("upload your video to our servers... deleted automatically after a few hours") | Accepts 35+ legacy/broadcast formats (`MKV`, `AVI`, `MTS`, `FLV`, `WMV`, `3GP`, `MXF`); quality/max-file-size presets; format matrix table; GIF vs WebP/APNG/MP4 table (citing ezgif's 67-frame butterfly); approximate FPS/resolution cheat sheet (`500 KB–2 MB` ranges). | Requires uploading private screen recordings to remote servers; no trim control on conversion page (requires separate Video Cutter); no reproducible measured command traces. |
| `https://www.etinysoft.com/Total-Video2Gif.htm` | 581 words | **Paid desktop software** (`Total Video2Gif for Mac`, downloadable `.dmg` / Windows `.exe`) | Native desktop batch processing; start/end time and playback speed controls. | Not an in-browser web tool ("Buy Now — Use Immediately"); thin 581-word marketing landing page with zero technical or benchmark data. |
| `https://www.dropgif.com/` | 1,511 words | **Browser-local** ("0 bytes uploaded", works offline) | Interactive `0.1s` timeline trim handles; caption overlay; 1-bit transparent background cutout (eyedropper + on-device AI person cutout); meme templates; platform size-limit table (Slack, Discord, X web/mobile, Twitch emote, MMS, Google Slides). | **Paywall on resolution & FPS**: Free exports are capped at **480 px width** and **20 fps**; unlocking `1080px`, `60s`, or `30 fps` requires a paid Pro plan (`$4.99/mo`, `$29/yr`, or `$49` once). Zero disclosure of underlying encoder pipeline, resampling filter, or measured memory/size benchmarks. |
| `https://gifpanda.com/` | 997 words | **Browser-local** ("Local preview, trimming, and frame capture", "Browser-side GIF encoding") | Start/end trim handles; width presets (`360`–`960 px`); quality presets (`Small`, `Balanced`, `High`). | Relies on browser `<video>` decoding + frame capture rather than full FFmpeg stream demuxing; locks FPS selection to 5 fixed buttons capping at **18 FPS** (`8, 10, 12, 15, 18 FPS`); generic 997-word copy with zero measured benchmarks or memory boundary documentation. |

### Competitor Verdict & What `/tools/video-to-gif` Has That They Do Not
- **Where we admit a tie or competitor edge**: On zero-upload local processing, we **tie** with `dropgif.com` and `gifpanda.com`. We also explicitly acknowledge on-page that `xconvert.com` supports 35+ server-decoded legacy containers (`AVI`, `MKV`, `MXF`) and that `dropgif.com` / `gifpanda.com` provide interactive timeline trim handles.
- **Our verified differentiators added to `/tools/video-to-gif`**:
  1. **Unconstrained free width & continuous 1–30 FPS slider**: Unlike `dropgif.com` (which paywalls widths `>480 px` and frame rates `>20 fps` behind a `$4.99–$49` Pro tier) and `gifpanda.com` (which caps FPS presets at `18 fps`), YuliusBox allows arbitrary pixel width and `1–30 fps` completely free with no watermark.
  2. **Genuine `@ffmpeg/core@0.12.6` WebAssembly Lanczos pipeline disclosure**: Discloses the exact command executed in `VideoToGifTool.tsx` (`ffmpeg -i input.mp4 -t 10 -vf "fps=<fps>,scale=<width>:-1:flags=lanczos" output.gif`), why `-t 10` prevents WebAssembly heap OOM crashes, and why `SharedArrayBuffer` requires `Cross-Origin-Embedder-Policy: credentialless`.
  3. **Reproducible 8-run FFmpeg 8.1.2 benchmark table (`~/workspace/agy-briefs/measurements-20261105/video-to-gif/`)**: Replaced the unverified PR #53 numbers (`60.7KB→259.5KB / 2.3s` and `1.25MB→318KB / 3.4s`) with traced measurements across 4 generated H.264 test clips (`clip0_ui_720p_4s.mp4`, `clip1_720p_4s.mp4`, `clip2_1080p_5s.mp4`, `clip3_1080p_10s.mp4`), documenting exact byte sizes, frame counts (`ffprobe`), native CLI `rtime`/`utime`, peak RSS memory (`maxrss`), and why flat UI screencasts compress `48x` smaller (`7.6 KB` vs `363.3 KB` for 40 frames at `480x270`) than high-motion gradients under GIF89a LZW.
  4. **Step-by-step DevTools Network & MEMFS verification guide**: Explains how users can verify zero outbound video traffic in Chrome/Firefox DevTools (`unpkg.com/@ffmpeg/core@0.12.6` initial runtime load vs. offline conversion).

---

## 2. `/tools/id-watermark`

### Competitors Analyzed in Full
| Competitor URL | Word Count | Architecture | Key Features & Strengths | Limitations / Paywalls / Gaps |
|---|---:|---|---|---|
| `https://watermarkly.com/` & `/watermark-pdf/` | 2,462 words / 1,515 words | **Browser-local** | Batch watermarking across photos and multi-page PDFs; 900+ fonts; 90 colors/gradients; 36 visual effects (3D/shadows); logo overlays; cross-device template sync. | General photography/copyright tool; zero pre-built KYC/ID anti-fraud restriction templates (Rental, SIM Card, Loan, Identity Verification); no direct handoff to strip EXIF/GPS metadata; no measured JPEG vs PNG Canvas export benchmarks. |
| `https://www.canva.com/features/watermark-photos/` | 1,345 words | **Cloud design platform** ("With a Canva account, your working files are automatically saved online") | Full graphic design studio, custom brand logos, fonts, mobile app sync. | **Uploads sensitive ID photos to Canva's cloud** and requires account registration — unsuitable for protecting unwatermarked government ID cards or passports. |
| `https://www.filereadynow.com/blog/add-watermarks-to-photos-free-online-filereadynow-image-watermark` | 1,915 words | **Browser-local** (up to 20 files, 10 MB each) | Supports JPG, PNG, WebP, BMP; text or logo overlay; no signup. | Generic photographer copyright blog post ("protect copyright... semi-transparent logo in the corner"); zero ID-specific diagonal purpose-lock templates, zero scaling geometry formulas, and zero measured file-size data. |

### Competitor Verdict & What `/tools/id-watermark` Has That They Do Not
- **Where we admit a tie or competitor edge**: Both `watermarkly.com` and `filereadynow.com` process images locally in the browser (so local processing is a **tie** with those two), and `watermarkly.com` is stronger for bulk photographer batching, custom logos, and 900+ decorative fonts.
- **Our verified differentiators added to `/tools/id-watermark`**:
  1. **Purpose-built KYC & government ID fraud deterrence**: One-click dated restriction presets (`For rental application only - 2026`, `For SIM card application only - 2026`, `For loan application only - 2026`, `For identity verification only - 2026`) rendered across a `-45°` full-bleed diagonal grid (`cols = ceil(width / tileSize) + 2`, `rows = ceil(height / tileSize) + 2`).
  2. **Resolution-invariant proportional geometry (`width / 1000`)**: Documents the exact scaling math in `IdWatermarkClient.tsx` (`scale = img.width / 1000`, `fontSize = round(24 * scale)`, `gap = round(80 * scale)`), proving why a `1000x630` flatbed scan, a `1920x1200` smartphone photo, and a `3840x2400` 4K capture all receive the exact same `5×4` (20-tile) visual coverage density without obscuring OCR fields.
  3. **In-memory privacy chain (`HandoffButton` / `ContinueWith`)**: One-click in-memory blob transfer to `/tools/pdf-kit?tab=jpg-to-pdf` (to bundle front & back ID scans into one submission PDF) and `/tools/exif-remover` (to strip camera EXIF/GPS metadata).
  4. **Reproducible Chromium HTML5 Canvas benchmark table (`~/workspace/agy-briefs/measurements-20261105/id-watermark/`)**: Replaced the unverified PR #53 numbers (`842 KB → 798 KB / 1.78 MB`) with real headless Chromium 1248 Canvas 2D measurements and saved test images (`sample_id_1920x1200_input.jpg` `379,713 B` → `watermarked_id_1920x1200_q95.jpg` `436,640 B` in `40.8 ms` / `watermarked_id_1920x1200.png` `3,034,914 B` in `113.5 ms`).

---

## 3. `/tools/audio-to-text`

### Competitors Analyzed in Full
| Competitor URL | Word Count | Architecture | Key Features & Strengths | Limitations / Paywalls / Gaps |
|---|---:|---|---|---|
| `https://whisperwebfree.com/` | 1,172 words | **Browser-local** (WebGPU + WebAssembly) | Supports up to 300 MB / 20 min (or 1 GB / 1 hr large-file mode); exports `TXT`, `SRT`, `VTT`, `JSON`; includes 3 playable Google FLEURS dataset audio samples (English 10.56s, Spanish 12.84s, Arabic 8.16s) with explicit non-promise disclaimers; MP4-to-MP3 extractor. | Does not disclose exact ONNX encoder/decoder byte weights or pre-inference VAD silence trimming parameters. |
| `https://transcriber.tools.ryusei.io/en` | 3,575 words | **Browser-local** (WebGPU + WebAssembly) | Supports Whisper, SenseVoice, Haas-ja, Qwen3-ASR, Voxtral (40 MB–5.2 GB models); on-device speaker diarization; exports `TXT`, `Word`, `PDF`, `SRT`, `VTT`, `CSV`, `JSON`; interactive video-synced subtitle editor. | Heavy multi-gigabyte model downloads (up to 5.2 GB) can exhaust mobile/laptop browser storage; does not document exact 16 kHz PCM memory math or VAD silence guard parameters. |
| `https://www.pageonaut.com/` & `/category/text` | 3,147 words / 1,012 words | **Browser-local** utility directory | Clean multi-tool catalog with browser-local Whisper transcription and subtitle export. | Directory-style overview copy with no model byte breakdown or signal-processing architecture details. |
| `https://floi.dev/` | 8,789 words | **Browser-local** utility suite | 70+ local tools including Subtitle Generator, Audio Loudness Normaliser, and Remove Silence from Video. | Catalog hub page; lacks per-tier ONNX weight tables and VAD preprocessing documentation. |

### Competitor Verdict & What `/tools/audio-to-text` Has That They Do Not
- **Where we admit a tie or competitor edge**: All four competitors (`whisperwebfree.com`, `transcriber.tools.ryusei.io`, `pageonaut.com`, `floi.dev`) run Whisper locally in the browser with zero server uploads. Furthermore, `whisperwebfree.com` and `transcriber.tools.ryusei.io` offer WebGPU acceleration and `.srt`/`.vtt` exports, and `ryusei.io` offers speaker diarization, whereas YuliusBox currently runs CPU WebAssembly (`@xenova/transformers` v2) and exports `.txt` / clipboard text.
- **Our verified differentiators & PR #53 cleanup added to `/tools/audio-to-text`**:
  1. **PR #53 Number Cleanup**: Removed the unverified hardware timing claims (`1.8 seconds on an Apple Silicon M-series processor and 3.6 seconds on a standard Intel quad-core laptop`) and removed the single-sentence `0% Word Error Rate (WER)` claim. Added an explicit engineering explanation (matching `whisperwebfree.com`'s rigor) that single-sentence read-speech tests do not predict WER on noisy multi-speaker meetings or reverberant rooms.
  2. **Deterministic `trimSilence` VAD & `<3.0s` Hallucination Guard disclosure**: Documented the exact pre-inference signal pipeline in `AudioToTextTool.tsx` (`AudioContext({ sampleRate: 16000 })` → `64,000 bytes/sec` / `3.66 MiB/min` `Float32Array` → `20 ms` / `320-sample` energy window at `0.02` mean amplitude threshold with a `250 ms` / `4,000-sample` guard buffer and `0.5s` minimum speech threshold) plus `public/whisper.worker.js`'s `chunk_length_s: 30` and `stride_length_s: 5` sliding-window reconciliation.
  3. **Exact measured CDN byte weights (`~/workspace/agy-briefs/measurements-20261105/audio-to-text/`)**: Probed `https://assets.zypass.dpdns.org/models/v1/` via HTTP `HEAD` `Content-Length` and published the exact encoder, merged decoder, and tokenizer sizes for all three q8 tiers (`Xenova/whisper-tiny`: **43,335,389 B / 41.33 MiB**; `Xenova/whisper-base`: **79,391,103 B / 75.71 MiB**; `Xenova/whisper-small`: **251,588,457 B / 239.93 MiB**), replacing the old approximate `~39 MB / ~73 MB / ~240 MB` figures.

---

## 4. `/tools/image-compressor`

### Competitors Analyzed in Full
| Competitor URL | Word Count | Architecture | Key Features & Strengths | Limitations / Paywalls / Gaps |
|---|---:|---|---|---|
| `https://filekiwi.com/compress-image/` | 2,320 words | **Hybrid browser + 30-day storage** | Accepts `JPG`, `PNG`, `WebP`, `HEIC`, `AVIF`, `GIF`, `BMP`, `TIFF` up to 50 MB; quality slider `30%–95%`; keeps original if compressed is larger; ZIP download. | Explicitly states under upload box: **"Runs in your browser. A copy of your file is stored privately for 30 days."** |
| `https://teasoft.in/image-tool/compress-image/` | 2,733 words | **Browser-local** | Batch compress up to 50 files (100 MB each); supports `JPG`, `PNG`, `WebP`, `GIF`, `BMP`, `AVIF`; custom background color fill when converting transparent PNG to JPG; optional width limit. | Gated by Cloudflare Turnstile; does not offer dedicated byte-exact portal retry loops (`100,000 B`, `50,000 B`, `20,000 B`) or in-memory PDF handoff. |
| `https://miniwebtool.com/image-compressor/` | 2,447 words | **Browser-local** | Target file size presets (`Under 20 KB`, `50 KB`, `100 KB`, `200 KB`, `500 KB`, `1 MB`, `2 MB`, custom); visual before/after comparison. | **Daily quota & Pro paywall**: Displays **"3 free uses daily"** and gates bulk ZIP downloading behind **"Download everything as one ZIP with Pro"**. |
| `https://tinypng.com/` | 2,724 words | **Cloud server upload** | Smart lossy quantization for `AVIF`, `JXL`, `WebP`, `PNG`, and `JPEG`; WordPress/Figma plugins and CDN/API. | Uploads files to Tinify servers; free web tier caps batches at **20 images** and **5 MB max per file**; Web Pro/Ultra subscription required for larger files/batches. |

### Competitor Verdict & What `/tools/image-compressor` Has That They Do Not
- **Where we admit a tie or competitor edge**: On local browser execution, we **tie** with `teasoft.in` and `miniwebtool.com`. We also acknowledge that `teasoft.in` and `filekiwi.com` accept `AVIF`/`BMP` inputs and that `tinypng.com` uses specialized server-side palette quantization for 8-bit PNGs.
- **Our verified differentiators added to `/tools/image-compressor`**:
  1. **Zero 30-day copy retention, zero daily usage cap, and free ZIP export**: Unlike `filekiwi.com` (30-day private copy storage), `tinypng.com` (server upload + 20-file / 5 MB cap), and `miniwebtool.com` (3 free uses/day + paid Pro gate for ZIP download), YuliusBox runs 100% locally with unlimited batches up to 50 MB per image and free `JSZip` bulk download.
  2. **Strict decimal byte-ceiling retry loop (`targetSizeBytes`)**: Documents how `ImageCompressorTool.tsx` converts decimal portal caps (e.g., `100,000 bytes` rather than binary `102,400 bytes`) into `effectiveMaxSizeMB = targetSizeBytes / 1_048_576` and automatically retries at quality `0.60` and `0.40` if `browser-image-compression`'s initial pass exceeds the strict byte limit.
  3. **Reproducible Chromium Canvas benchmark table (`~/workspace/agy-briefs/measurements-20261105/image-compressor/`)**: Published measured byte sizes and encoding latencies across a 12 MP camera photo (`4000x3000 → 1920x1440`), a 1080p web hero photo (`1920x1080`), and a 1440p UI screenshot (`2560x1440 → 1920x1080`) for `JPEG q=0.80`, `JPEG q=0.70`, and `WebP q=0.80`.

---

## 5. `/tools/background-remover`

### Competitors Analyzed in Full
| Competitor URL | Word Count | Architecture | Key Features & Strengths | Limitations / Paywalls / Gaps |
|---|---:|---|---|---|
| `https://nobg.online/` | 2,325 words | **Browser-local** | Full-resolution PNG export; studio backdrop colors/gradients, drop/floor shadows, outlines; black-and-white / red mask inspection view (`M` key); erase/restore brushes; comparison table vs `remove.bg`, Canva, and Adobe Express. | Does not disclose the exact segmentation model architecture or chunk byte weights in `resources.json`. |
| `https://clipout.io/no-upload` | 432 words | **Browser-local** (WebGPU + WebAssembly) | Runs `BiRefNet` (`115 MB` GPU / `94 MB` CPU) via ONNX Runtime Web; batch processing up to **50 images at once**; works offline as PWA. | Thin 432-word landing page; no interactive before/after slider or in-memory handoff to an image compressor. |
| `https://nearbg.com/` | 818 words | **Browser-local** (WebAssembly) | Downloads compact `U2Netp` (`~4 MB`) from same origin; strict `connect-src 'self'` CSP; includes manual touch-up erase brush. | Computes saliency mask at a tiny **320×320 pixel resolution** and scales it up, softening fine hair strands, fur, and semi-transparent glass. |
| `https://www.cacheplex.com/background-remover/` | 1,808 words | **Browser-local** (ONNX Runtime Web) | Uses `U²-Netp` (`~5 MB`, `320×320` mask) with Soft/Balanced/Sharp edge modes, solid color picker, and Erase/Restore brush. | **Daily quota & server counter**: Restricted to **"15 of 15 free today"** and explicitly states: *"only a count of processed images is sent to our server for the daily free limit."* |

### Competitor Verdict & What `/tools/background-remover` Has That They Do Not
- **Where we admit a tie or competitor edge**: All four competitors (`nobg.online`, `clipout.io`, `nearbg.com`, `cacheplex.com`) run segmentation models locally in the browser (so zero-upload processing is a **5-way tie**). We also acknowledge on-page that `clipout.io` supports 50-image batching with `BiRefNet` and that `nobg.online`, `nearbg.com`, and `cacheplex.com` include manual touch-up brushes and solid-color background pickers.
- **Our verified differentiators & asset audit added to `/tools/background-remover`**:
  1. **Higher-resolution `1024×1024` IS-Net medium model vs. `320×320` U²-Netp**: Unlike `nearbg.com` and `cacheplex.com` (which compute a `320×320` U²-Netp mask and upscale it), YuliusBox self-hosts `@imgly/background-removal@1.4.5`'s full `88,188,479-byte` (`84.10 MiB / 88.19 MB`) `/models/medium` model on same-origin `/models/*`, preserving fine hair and product contours without requiring manual brush cleanup.
  2. **Zero daily cap and zero server quota telemetry**: Unlike `cacheplex.com` (which caps free users at 15 images/day and pings its server on every run), YuliusBox imposes no daily limit and sends zero quota telemetry.
  3. **Exact self-hosted asset table (`~/workspace/agy-briefs/measurements-20261105/background-remover/`)**: Corrected the old approximate `"~20 MB"` copy in `src/app/tools/background-remover/page.tsx` and `src/components/tools/BackgroundRemover.tsx` to the exact measured byte sizes in `public/models/resources.json` (`/models/medium`: `88,188,479 B` across 22 chunks; `/models/small`: `44,342,436 B` across 11 chunks; `ort-wasm-simd-threaded.wasm`: `10,646,108 B` across 3 chunks) and added a direct in-memory `Compress` handoff workflow.

---

## Summary of PR #53 Unverified Numbers Remediation
| Hub Page (`src/lib/hub-content.ts`) | Old Unverified PR #53 Claim | Action Taken | Replacement / Trace Location |
|---|---|---|---|
| `video-to-gif` (formerly ~line 248) | `60.7 KB → 259.5 KB in 2.3s` (720p 4s) and `1.25 MB → 318 KB in 3.4s` (1080p 5s) | **Re-measured & replaced** | Replaced with 8-run FFmpeg 8.1.2 (`-benchmark` + `ffprobe`) measurements across 4 generated H.264 test clips (`clip0_ui_720p_4s.mp4` `8,168 B → 7,739 B` in `0.247s`; `clip1_720p_4s.mp4` `1,522,576 B → 372,011 B` in `0.586s`; `clip2_1080p_5s.mp4` `3,841,283 B → 398,445 B` in `1.118s`; `clip3_1080p_10s.mp4` `7,668,259 B → 795,251 B` in `2.495s`). Trace saved in `~/workspace/agy-briefs/measurements-20261105/video-to-gif/`. |
| `audio-to-text` (formerly ~line 422) | `1.8s on Apple Silicon / 3.6s on Intel quad-core` and `0% Word Error Rate (WER)` on a 12s test sentence (`~73 MB` / `~39 MB` / `~240 MB` weights) | **Deleted unverified timings & single-sentence WER claim; replaced model & buffer sizes with traced measurements** | Deleted `1.8s / 3.6s` and `0% WER` claims; added explicit disclaimer that single-sentence read-speech does not predict multi-speaker/noisy meeting WER; replaced approximate model sizes with exact HTTP `Content-Length` byte measurements (`43,335,389 B` Tiny, `79,391,103 B` Base, `251,588,457 B` Small) and deterministic 16 kHz `Float32Array` PCM buffer & 30s/5s chunking math. Trace saved in `~/workspace/agy-briefs/measurements-20261105/audio-to-text/`. |
| `id-watermark` (formerly ~lines 519–521) | `sample-id-card.jpg` (`1920x1200`, `842 KB`) → `798 KB JPEG (95%)` or `1.78 MB PNG` | **Re-measured in headless Chromium Canvas 2D & replaced** | Executed exact `IdWatermarkClient.tsx` HTML5 Canvas 2D diagonal tiling pipeline in headless Chromium 1248 across `1000x630`, `1920x1200` (`379,713 B` input → `436,640 B` JPEG q=0.95 in `40.8 ms` / `3,034,914 B` PNG in `113.5 ms`), and `3840x2400`. Saved test images and JSON trace in `~/workspace/agy-briefs/measurements-20261105/id-watermark/`. |
