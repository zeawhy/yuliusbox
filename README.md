<div align="center">

# 🧰 YuliusBox

**Privacy-First, Client-Side Web Productivity Toolkit**

A collection of free, secure, and client-side utilities. No tracking, no unnecessary cloud uploads — processing happens right in your browser whenever possible.

[![Next.js](https://img.shields.io/badge/Next.js-16.1+-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## 🌟 Key Features & Tool Matrix

### 🎙️ Audio & Video (Client-Side WASM)
- **Local AI Audio Transcription**: Speech-to-text directly in the browser via OpenAI Whisper (ONNX Web / WebAssembly).
- **Video to GIF Converter**: Convert MP4/MOV to high-quality animated GIFs powered by local FFmpeg WASM.
- **Social Media Video Downloader**: Clean extraction of public videos with multi-layer SSRF protection and caching.

### 🖼️ Image & Media Tools (Privacy-First)
- **AI Background Remover**: 100% private in-browser AI cutout for portrait and product photos.
- **Bulk Image Compressor**: Lossless/lossy compression for JPG, PNG, and WebP.
- **Image Grid Splitter / Joiner**: Lossless 3x3 grid slicing and seamless stitching for social media.
- **ID Card Watermarker**: Add localized copyright and security watermarks directly on HTML5 Canvas.
- **Screenshot Beautifier**: Wrap screenshots in customizable gradient backgrounds and browser frames.
- **Color Palette Extractor**: Extract dominant color swatches and copy HEX codes with one click.

### 📄 Document & PDF Suite
- **PDF Toolkit**: Merge, split, and clean metadata locally using `pdf-lib`.
- **Office to PDF Suite**: High-fidelity Word (`.docx`), Excel (`.xlsx`), PPT (`.pptx`), and URL-to-PDF conversion powered by Gotenberg.

### ⚡ Developer & Productivity AI
- **AI Email Paraphraser**: Polish business emails with custom tone presets (Grok-3 / Qwen).
- **Excel Formula Bot**: Generate complex Excel and Google Sheets formulas from plain language.
- **AI Regex & SQL Generator**: Generate and explain regular expressions and SQL queries.
- **AI Cron Generator**: Natural language to standard Cron expressions.
- **Speed Test**: Low-latency network ping, upload, and download speed testing.

---

## 🏗️ Technical Architecture

YuliusBox leverages a hybrid computing model to maximize client-side privacy while preserving low server costs:

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Browser                         │
│  - Client-side WASM (FFmpeg, Whisper ONNX, Canvas)          │
│  - Zero data leakage for media processing                   │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
        API / Conversion                 AI & Speed Test
               │                               │
               ▼                               ▼
┌──────────────────────────────┐ ┌────────────────────────────┐
│   Next.js 16 (Vercel / Node) │ │  Cloudflare Workers        │
│  - Next.js 16 App Router     │ │  - Edge AI model routing   │
│  - SSRF-protected API Routes │ │    (xAI Grok-3 / Qwen)     │
│  - Upstash Redis Rate Limit  │ │  - Speed test endpoints    │
└──────┬───────────────┬───────┘ └────────────────────────────┘
       │               │
  Document Conv.  Video Parser
       │               │
       ▼               ▼
┌──────────────┐ ┌────────────────────────────────────────────┐
│  Gotenberg   │ │  VPS Video Microservice (FastAPI + yt-dlp) │
│ (LibreOffice)│ │  - Metadata extraction & stream resolution │
└──────────────┘ └────────────────────────────────────────────┘
```

---

## 🔒 Security & Performance Highlights

- **SSRF Defense-in-Depth**: Strict IP validation for proxy endpoints blocking RFC 1918 private subnets, cloud metadata (`169.254.169.254`), and loopbacks.
- **Anti-Spoofing Rate Limiting**: Client IP extraction prioritizes platform headers (`x-real-ip`, `cf-connecting-ip`) to prevent `X-Forwarded-For` tampering.
- **Immutable Static Caching**: Content-hashed AI models and WASM binaries configured with `Cache-Control: public, max-age=31536000, immutable`.
- **Targeted Cross-Origin Isolation**: `Cross-Origin-Embedder-Policy` (COEP) is scoped strictly to tools requiring `SharedArrayBuffer`, preventing breakage of third-party assets on other pages.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20.9.0+ (required by Next.js 16)
- npm, pnpm, or bun

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/zeawhy/yuliusbox.git
   cd yuliusbox
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Upstash Redis credentials, Gotenberg endpoint, and Cloudflare Worker URL.

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📦 Deployment

### Frontend (Vercel)
Deploy with standard Next.js deployment. Ensure environment variables from `.env.example` are added in the Vercel project dashboard.

### AI Backend (Cloudflare Worker)
See instructions in [`cloudflare/README.md`](cloudflare/README.md).

### Video Microservice (VPS)
```bash
cd vps-worker
pip install -r requirements.txt
python main.py
```
*(Or build and run via Docker using `Dockerfile`)*

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
