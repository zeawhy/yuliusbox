# AdSense Readiness — yuliusbox.com (2026-11-05)

Branch: `fix/adsense-reapplication` (from main `04ad4bf`, PR #53). This document
records the human-judgement answers behind the reapplication work. Machine
checks are in `docs/adsense-gate-report.md`.

## 1. URL disposition (73 sitemap URLs)

Full per-URL table with evidence: `docs/adsense-reapplication-decisions.md`.

- **58 Submitted and indexed: KEEP as-is.** All pass the text-depth check.
- **13 Discovered – currently not indexed (variant pages): KEEP, 0 redirects.**
  Each has independent H2s and 559–929 words of main content, and the
  `check_duplicates.py` run finds no near-duplicate groups (5-word shingle
  Jaccard vs parent hub: 0.00–1.34%). The cause of non-indexing is missing
  crawl signals, not thin content: most had no strong internal link pointing
  at them. Fixed by adding links from `/`, `/tools`, the parent hub preset
  bar (`HubBody.tsx`), and the parent hub `related` arrays. No 301 was used:
  each variant runs a distinct preset (different target size, tab, or
  format), so redirecting to the parent would be a soft-404 risk.
- **1 Crawled – currently not indexed (`/tools/word-to-pdf`, crawled
  2026-10-21): KEEP and deepen.** It does not overlap `/tools/pdf-kit`:
  `pdf-lib` cannot parse `.doc`/`.docx`; word-to-pdf uses a server-side
  headless LibreOffice/Gotenberg pipeline, matching its already-indexed
  siblings `excel-to-pdf`, `ppt-to-pdf`, and `url-to-pdf`. Page deepened
  947 → 1,868 words with SSR technical documentation, and linked from `/`,
  `/tools`, `/tools/pdf-kit`, and `/tools/pdf-redact-sign`. A client copy
  mismatch was also fixed (limits corrected to 30 MB / 5 req/min to match
  the API route).
- **1 URL unknown to Google (`/tools/video-to-gif/video-to-gif-for-discord`,
  1,026 words): KEEP and link.** It was effectively an orphan (one inbound
  link on the whole site). Now linked prominently from `/`, `/tools`, and
  the video-to-gif parent.
- **9 intentional `noindex` utility pages: UNTOUCHED.** They live under
  `/tools/`, which is already excluded from AdSense auto ads; the AdSense
  script loading on them does not serve ads, so no code change was made
  (deliberately: touching the site-verification snippet carries more risk
  than benefit).

No URL was 301-redirected or 410-deleted in this round. The earlier proposal
to bulk-merge all 38 variant pages was rejected on measured evidence:
`check_duplicates.py` over all 73 URLs reports no near-duplicate groups,
and the variant pages each carry distinct presets and prose.

## 2. Competitor comparison (5 main pages)

Full-text comparisons: `docs/adsense-competitor-notes.md`. Headline
conclusions, including admitted ties:

- **video-to-gif** — Ties dropgif.com / gifpanda.com on zero-upload local
  processing; xconvert.com covers more legacy containers server-side.
  Differentiators added: free arbitrary width + continuous 1–30 fps
  (dropgif paywalls >480 px / >20 fps; gifpanda caps at 18 fps presets),
  exact `@ffmpeg/core` WASM Lanczos pipeline disclosure, an 8-run traced
  FFmpeg 8.1.2 benchmark table, and a DevTools Network self-verification
  guide.
- **id-watermark** — Ties watermarkly.com / filereadynow.com on local
  processing; watermarkly is stronger for photographer batching. Ours is
  the only one with purpose-built KYC/ID restriction presets (rental, SIM,
  loan, verification) on a −45° full-bleed diagonal grid, resolution-
  invariant proportional geometry, and an in-memory handoff to pdf-kit
  and exif-remover.
- **audio-to-text** — Ties all four local-Whisper competitors on
  zero-upload; whisperwebfree.com and ryusei.io offer WebGPU, .srt/.vtt
  export, and speaker diarization, which ours does not. Differentiators:
  exact `trimSilence` VAD pipeline disclosure, exact measured ONNX byte
  weights for all three tiers, and deterministic PCM/chunking math.
- **image-compressor** — Ties teasoft.in / miniwebtool.com on local
  execution. Differentiators: no 30-day copy retention (filekiwi stores
  one), no daily cap and free ZIP export (miniwebtool: 3/day, ZIP behind
  Pro), and a strict decimal byte-ceiling retry loop for portal caps.
- **background-remover** — Five-way tie on zero-upload local segmentation.
  Differentiators: 1024×1024 IS-Net medium model vs competitors' 320×320
  U²-Netp masks, zero daily cap and zero quota telemetry (cacheplex:
  15/day + server counter), and an exact self-hosted asset table.
- **Remaining tool parent pages** (codec-toolbox, domain-lookup,
  excel-to-pdf, image-editor, image-grid-splitter, image-to-svg,
  json-to-code, jwt-decoder, log-sanitizer, ppt-to-pdf, subtitle-tools,
  svg-optimizer, text-diff, url-to-pdf, youtube-optimizer,
  ai-video-cost-calculator): each checked against text-depth data and
  deepened with local-architecture explanation and measured data where
  thin; traces in `measurements-20261105/other-tools/`.

## 3. PR #53 unverified numbers — outcome

All three groups in `src/lib/hub-content.ts` are resolved. Traces:
`~/workspace/agy-briefs/measurements-20261105/` (not committed to the repo;
kept as audit evidence alongside the briefs).

| Group | Outcome |
|---|---|
| video-to-gif: 60.7 KB → 259.5 KB in 2.3 s (and 1.25 MB → 318 KB in 3.4 s) | Re-measured with system FFmpeg 8.1.2 at the stated parameters (10 fps, 480 px, Lanczos) on 4 generated H.264 clips; replaced with traced numbers (e.g. 8,168 B → 7,739 B, 40 frames, rtime 0.247 s). Logs, GIFs, `summary.json`, `env.txt` saved. |
| audio-to-text: 1.8 s / 3.6 s / 0% WER | Deleted. Timings had no reproducible trace; a single-sentence 0% WER is not a general accuracy claim and is now explicitly disclaimed on-page. Replaced with exact ONNX byte weights measured via HTTP HEAD Content-Length (Tiny 43,335,389 B; Base 79,391,103 B; Small 251,588,457 B) plus deterministic 16 kHz PCM/chunking math. |
| id-watermark: 842 KB → 798 KB / 1.78 MB | Re-measured by running the exact Canvas 2D tiling pipeline in headless Chromium on 1000×630, 1920×1200, and 3840×2400 inputs; replaced (1920×1200: 379,713 B in → 436,640 B JPEG q=0.95 in 40.8 ms / 3,034,914 B PNG in 113.5 ms). Test images + `summary.json` saved. |

Also corrected in this round: background-remover model size copy
("~20 MB" → measured 88.2 MB medium / 44.3 MB small, from
`public/models/resources.json`).

## 4. Aggregate pages and footer

- `/`: 438 → 1,184 words SSR editorial (how to choose general hub vs
  preset tool, category summary, multi-tool workflows), 11 H2s.
- `/tools`: 502 → 1,683 words SSR editorial (scenario & target-size
  presets linking all 15 unindexed/unknown targets, category breakdown,
  local vs server-assisted selection guide, chained workflows), 7 H2s.
- Footer: the mail-to icon now links to `/contact` instead of
  `mailto:support@yuliusbox.com`, fixing the Auditor completeness WARN
  (Cloudflare email obfuscation rewrote the address to
  `/cdn-cgi/l/email-protection`, a 404). In-body mailto links on
  about/contact/privacy/terms are unchanged (they are real contact
  channels, not the broken icon).

## 5. Stale / contradictory claims check (2026-11-05)

- No "coming soon" or placeholder pages; no lorem text.
- One stale example year fixed: id-watermark FAQ example "2024" → "2026"
  (EN + CN strings in `IdWatermarkClient.tsx`).
- FLUX 3 Max 75% launch discount text ("Through November 7, 2026") is
  still live at the time of writing and the calculator self-adjusts after
  expiry; flagged here so it is re-checked after 2026-11-07 rather than
  edited now.
- Privacy page already contains the AdSense cookie disclosure section
  ("Third-party advertising and Google AdSense", with Google Ads Settings
  opt-out link) — verified present, no change needed.
- COEP: `next.config.ts` still sets `credentialless` for the three tool
  pages; response headers verified live on localhost
  (`Cross-Origin-Embedder-Policy: credentialless` on video-to-gif,
  audio-to-text, background-remover). Umami script is env-gated
  (`NEXT_PUBLIC_UMAMI_WEBSITE_ID`) and untouched; layout.tsx AdSense
  iframe credentialless patch intact.

## 6. Known limitations (honest)

- Weekly traffic is low (~115 PV/week), so natural recrawl is slow. The
  gate therefore requires `lastCrawlTime` evidence after deployment
  (see gate report), not a waiting period.
- `ADS-CONTENT-OVERLAP` (similarity vs top web results) is not measurable
  by the Auditor scripts; the Phase 3 manual full-text competitor
  comparison is the coverage for it.
- The competitor pages' claims (prices, quotas, model sizes) are
  third-party data captured 2026-11-05; they can change without notice.
- Measurements were taken on this VM (FFmpeg 8.1.2, headless Chromium);
  absolute timings are hardware-dependent and are presented with their
  conditions, not as universal guarantees.
