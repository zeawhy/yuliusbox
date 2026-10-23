import { Image, FileText, Blocks, LucideIcon, Mail, Table, Code, Database, Clock, FileJson, Shield, Eraser, Scissors, Zap, Globe, Grid3X3, KeyRound, FileSignature, EyeOff, Lock, Captions, Shapes, GitCompare, Binary, ScanEye, Video } from "lucide-react";

export type ToolCategory = "developer" | "media" | "productivity";

export interface Tool {
    id: string;
    category: ToolCategory;
    name: {
        en: string;
        cn: string;
    };
    description: {
        en: string;
        cn: string;
    };
    icon: LucideIcon;
    href: string;
    comingSoon?: boolean;
    popular?: boolean;
    /** Search keywords: name tokens + file extensions + action verbs + synonyms */
    keywords?: string[];
}

export const toolsData: Tool[] = [
    {
        id: "ai-video-cost-calculator",
        category: "media",
        name: {
            en: "AI Video Cost Calculator",
            cn: "AI 视频生成成本计算器",
        },
        description: {
            en: "Calculate and compare generation costs for FLUX 3 Max, Seedance 2.5, MiniMax H3, and Veo. Real-time pricing with promo countdowns.",
            cn: "计算并对比 FLUX 3 Max、Seedance、MiniMax H3 与 Veo 的生成成本。按秒计费，实时促销倒计时。",
        },
        icon: Video,
        href: "/ai-video-cost-calculator",
        popular: true,
        keywords: ["ai video", "video cost", "flux 3 max", "seedance", "minimax", "veo", "video generation pricing", "calculator", "fal ai"],
    },
    {
        id: "image-to-svg",
        category: "media",
        name: {
            en: "Free Image to SVG",
            cn: "图片转 SVG 矢量图",
        },
        description: {
            en: "Convert PNG, JPG, and WebP into crisp vector SVG in your browser. Processed in your browser — images are never uploaded.",
            cn: "纯本地将 PNG、JPG、WebP 转换为高质量 SVG 矢量图。基于 WebAssembly，离线可用，保护隐私。",
        },
        icon: Shapes,
        href: "/tools/image-to-svg",
        popular: true,
        keywords: [
            "image to svg",
            "png to svg",
            "jpg to svg",
            "svg converter",
            "vectorizer",
            "raster to vector",
            "trace image",
            "vtracer",
            "svg",
            "矢量图",
            "转svg",
        ],
    },
    {
        id: "heic-2-jpg",
        category: "media",
        name: {
            en: "HEIC to JPG Free",
            cn: "HEIC 转 JPG (免费版)"
        },
        description: {
            en: "Convert HEIC/WebP photos to JPG instantly in your browser. 100% Local processing via WebAssembly.",
            cn: "纯本地将 HEIC/WebP 图片转换为 JPG。基于 WebAssembly，保护隐私，无损转换。"
        },
        icon: Image,
        href: "https://www.heic2jpg-free.com",
        popular: true,
        keywords: ["heic", "heif", "jpg", "jpeg", "webp", "convert", "iphone photo", "apple photo", "image converter"],
    },
    {
        id: "image-compressor",
        category: "media",
        name: {
            en: "Bulk Image Compression",
            cn: "批量图片压缩"
        },
        description: {
            en: "Compress unlimited JPG/PNG/WebP images locally. High efficiency, privacy-first, and 100% free.",
            cn: "无限量图片本地压缩工具。支持 JPG/PNG/WebP，高效率、隐私优先、完全免费。"
        },
        icon: Image,
        href: "/tools/image-compressor",
        popular: true,
        keywords: ["compress", "image", "jpg", "png", "webp", "resize", "shrink", "reduce", "optimize", "photo", "bulk"],
    },
    {
        id: "screenshot-blur",
        category: "media",
        name: {
            en: "Screenshot Blur",
            cn: "截图隐私打码",
        },
        description: {
            en: "Blur, pixelate, or cover sensitive areas in screenshots before sharing. Multiple regions, undo support, PNG export — 100% in-browser.",
            cn: "分享截图前给敏感区域打码：高斯模糊/像素化/纯色块，多选区、可撤销，纯本地处理。",
        },
        icon: EyeOff,
        href: "/tools/screenshot-blur",
        keywords: [
            "blur",
            "pixelate",
            "mosaic",
            "censor",
            "screenshot",
            "anonymize",
            "redact image",
            "hide info",
            "png",
            "打码",
            "马赛克",
        ],
    },
    {
        id: "pdf-toolkit",
        category: "productivity",
        name: {
            en: "PDF Toolkit",
            cn: "PDF 工具箱"
        },
        description: {
            en: "Merge, Split, and Compress PDF files locally.",
            cn: "本地合并、拆分和压缩 PDF 文件。"
        },
        icon: FileText,
        href: "/tools/pdf-kit",
        comingSoon: false,
        keywords: ["pdf", "merge", "split", "compress", "combine", "join", "extract pages", "jpg to pdf", "pdf merge", "pdf split"],
    },
    {
        id: "pdf-redact-sign",
        category: "productivity",
        name: {
            en: "PDF Redact & Sign",
            cn: "PDF 涂黑脱敏 + 电子签名",
        },
        description: {
            en: "Black out sensitive text in PDFs (true rasterized redaction) and add handwritten or image signatures. 100% in-browser.",
            cn: "PDF 敏感信息彻底涂黑（光栅化真删除）+ 手写/图片签名，纯浏览器本地处理。",
        },
        icon: FileSignature,
        href: "/tools/pdf-redact-sign",
        keywords: [
            "pdf",
            "redact",
            "redaction",
            "blackout",
            "black out",
            "sanitize",
            "sign",
            "signature",
            "esign",
            "esignature",
            "pdf sign",
            "pdf signature",
            "handwritten signature",
        ],
    },
    {
        id: "file-encryptor",
        category: "productivity",
        name: {
            en: "File Encryptor",
            cn: "文件加密器",
        },
        description: {
            en: "Encrypt any file with AES-256-GCM in your browser. PBKDF2 key derivation, password-protected .enc files — nothing uploaded.",
            cn: "浏览器端 AES-256-GCM 文件加密，PBKDF2 派生密钥，密码保护，纯本地。",
        },
        icon: Lock,
        href: "/tools/file-encryptor",
        keywords: [
            "encrypt",
            "decrypt",
            "aes",
            "aes-256",
            "aes-256-gcm",
            "pbkdf2",
            "file encryption",
            "password protect",
            "secure file",
            "enc",
            ".enc",
        ],
    },
    {
        id: "video-to-gif",
        category: "media",
        name: {
            en: "Video to GIF",
            cn: "视频转 GIF"
        },
        description: {
            en: "Convert MP4/MOV to animated GIF locally using FFmpeg WASM.",
            cn: "使用 FFmpeg WASM 本地将 MP4/MOV 转换为 GIF 动图。"
        },
        icon: Blocks,
        href: "/tools/video-to-gif",
        popular: true,
        keywords: ["gif", "video", "mp4", "mov", "webm", "convert", "animate", "ffmpeg", "discord gif", "screen recording"],
    },
    {
        id: "id-watermark",
        category: "productivity",
        name: {
            en: "Secure ID Watermarker",
            cn: "证件安全水印"
        },
        description: {
            en: "Add security watermarks to ID cards locally to deter unauthorized use.",
            cn: "纯本地为身份证/照片添加安全水印，防止被滥用。"
        },
        icon: FileText,
        href: "/tools/id-watermark",
        popular: true,
        keywords: ["watermark", "id card", "id watermark", "identity", "protect", "stamp", "secure", "id photo"],
    },
    {
        id: "audio-to-text",
        category: "productivity",
        name: {
            en: "Local AI Transcription",
            cn: "离线语音转文字"
        },
        description: {
            en: "Convert Audio (MP3/WAV) to text locally using OpenAI Whisper (WASM).",
            cn: "基于 OpenAI Whisper (WASM) 纯本地将语音转换为文字。"
        },
        icon: FileText, // Or Mic if imported, but FileText is safe
        href: "/tools/audio-to-text",
        popular: true,
        keywords: ["transcribe", "audio", "mp3", "wav", "m4a", "speech to text", "whisper", "voice memo", "meeting", "podcast", "interview"],
    },
    {
        id: "excel-formula-bot",
        category: "productivity",
        name: {
            en: "Excel Formula Bot",
            cn: "Excel 公式生成器"
        },
        description: {
            en: "Convert natural language to complex Excel/Google Sheets formulas instantly.",
            cn: "用大白话生成 Excel/Google Sheets 复杂公式，不再需要死记硬背。"
        },
        icon: Table,
        href: "/tools/excel-formula-bot",
        popular: true,
        keywords: ["excel", "formula", "spreadsheet", "google sheets", "vlookup", "sumif", "countif", "xlookup", "excel bot", "formula generator"],
    },
    {
        id: "email-paraphraser",
        category: "productivity",
        name: {
            en: "Polite Email Paraphraser",
            cn: "职场邮件润色"
        },
        description: {
            en: "Rewrite your emails to be professional, polite, and persuasive.",
            cn: "一键将草稿润色为得体、专业的商务英语邮件。"
        },
        icon: Mail,
        href: "/tools/email-paraphraser",
        popular: true,
        keywords: ["email", "rewrite", "paraphrase", "polite", "professional", "business email", "formal", "rephraser"],
    },
    {
        id: "regex-generator",
        category: "developer",
        name: {
            en: "AI Regex Generator",
            cn: "正则生成器 & 解释器"
        },
        description: {
            en: "Generate and explain complex Regular Expressions using AI.",
            cn: "用 AI 生成和解释复杂的正则表达式，程序员必备神器。"
        },
        icon: Code,
        href: "/tools/regex-generator",
        popular: true,
        keywords: ["regex", "regular expression", "pattern", "match", "validate", "regexp", "regex builder"],
    },
    {
        id: "json-to-code",
        category: "developer",
        name: {
            en: "JSON to Code",
            cn: "JSON 转代码"
        },
        description: {
            en: "Convert JSON to TypeScript, Go, or Dart models instantly.",
            cn: "将 JSON 瞬间转换为 TypeScript、Go 或 Dart 模型类。"
        },
        icon: FileJson,
        href: "/tools/json-to-code",
        popular: true,
        keywords: ["json", "typescript", "golang", "dart", "model", "struct", "convert", "interface", "type generator"],
    },
    {
        id: "sql-builder",
        category: "developer",
        name: {
            en: "AI SQL Builder",
            cn: "AI SQL 生成器"
        },
        description: {
            en: "Generate optimized SQL queries from natural language.",
            cn: "支持 MySQL/PostgreSQL，通过自然语言生成 SQL。"
        },
        icon: Database,
        href: "/tools/sql-builder",
        popular: true,
        keywords: ["sql", "query", "mysql", "postgresql", "database", "select", "sql generator", "natural language sql"],
    },
    {
        id: "cron-generator",
        category: "developer",
        name: {
            en: "AI Cron Generator",
            cn: "AI Cron 表达式"
        },
        description: {
            en: "Convert natural language to Cron expressions easily.",
            cn: "通过自然语言快速生成 Cron 定时任务表达式。"
        },
        icon: Clock,
        href: "/tools/cron-generator",
        popular: true,
        keywords: ["cron", "cron expression", "schedule", "scheduler", "crontab", "task", "timer", "interval"],
    },
    {
        id: "privacy-generator",
        category: "developer",
        name: {
            en: "Privacy & Terms",
            cn: "隐私协议生成器"
        },
        description: {
            en: "Generate standard legal documents for your apps instantly.",
            cn: "一键生成符合 App Store 要求的隐私政策和服务条款。"
        },
        icon: Shield,
        href: "/tools/privacy-generator",
        popular: true,
        keywords: ["privacy policy", "terms of service", "legal", "gdpr", "app store", "privacy", "terms"],
    },
    {
        id: "safe-zone-overlay",
        category: "media",
        name: {
            en: "Social Media Safe Zone",
            cn: "社媒安全区域检测"
        },
        description: {
            en: "Preview TikTok/Reels/Shorts overlays to avoid blocked content.",
            cn: "预览 TikTok/Reels/Shorts 界面遮挡，确保关键内容可见。"
        },
        icon: Image,
        href: "/tools/safe-zone-overlay",
        popular: true,
        keywords: ["safe zone", "tiktok", "reels", "shorts", "overlay", "social media", "video safe zone", "preview"],
    },
    {
        id: "youtube-optimizer",
        category: "media",
        name: {
            en: "YouTube Title Optimizer",
            cn: "YouTube 标题优化"
        },
        description: {
            en: "Generate viral, high-CTR titles and SEO tags with AI.",
            cn: "AI 生成高点击率爆款标题和 SEO 标签。"
        },
        icon: Blocks,
        href: "/tools/youtube-optimizer",
        popular: true,
        keywords: ["youtube", "title", "seo", "tags", "thumbnail", "ctr", "viral", "youtube optimizer", "description"],
    },
    {
        id: "color-palette",
        category: "media",
        name: {
            en: "Color Palette Generator",
            cn: "AI 调色板生成器"
        },
        description: {
            en: "Extract perfect color palettes from any image instantly.",
            cn: "从图片中提取完美配色方案，一键复制 HEX 代码。"
        },
        icon: Table,
        href: "/tools/color-palette",
        popular: true,
        keywords: ["color palette", "color", "hex", "palette", "extract colors", "color picker", "design"],
    },
    {
        id: "background-remover",
        category: "media",
        name: {
            en: "AI Background Remover",
            cn: "AI 智能抠图"
        },
        description: {
            en: "Remove image backgrounds instantly in the browser. 100% Private.",
            cn: "纯本地 AI 智能抠图。隐私安全，一键去除背景。"
        },
        icon: Eraser,
        href: "/tools/background-remover",
        popular: true,
        keywords: ["background remover", "remove background", "cutout", "transparent", "bg remove", "photo background"],
    },
    {
        id: "image-editor",
        category: "media",
        name: {
            en: "Image Resizer & Crop",
            cn: "图片转换与裁剪"
        },
        description: {
            en: "Resize, crop, and convert image formats locally in your browser.",
            cn: "纯本地调整图片大小、裁剪区块及转换格式（JPG/PNG/WebP）。"
        },
        icon: Scissors,
        href: "/tools/image-editor",
        popular: true,
        keywords: ["resize", "crop", "image editor", "photo editor", "rotate", "convert", "jpg", "png", "webp"],
    },
    {
        id: "speed-test",
        category: "productivity",
        name: {
            en: "Internet Speed Test",
            cn: "网速测试"
        },
        description: {
            en: "Check your internet ping, download, and upload speeds.",
            cn: "测试网络延迟、下载与上传速度，Cloudflare 节点优化。"
        },
        icon: Zap,
        href: "/tools/speed-test",
        popular: true,
        keywords: ["speed test", "internet speed", "ping", "download speed", "upload speed", "bandwidth", "latency"],
    },
    {
        id: "word-to-pdf",
        category: "productivity",
        name: {
            en: "Word to PDF Converter",
            cn: "Word 转 PDF"
        },
        description: {
            en: "Convert Word documents (.doc, .docx) to PDF format securely in the cloud.",
            cn: "快速、精准、安全地将 Word 文档 (.doc, .docx) 转换为 PDF 格式。"
        },
        icon: FileText,
        href: "/tools/word-to-pdf",
        popular: true,
        keywords: ["word", "doc", "docx", "pdf", "convert", "word to pdf", "document"],
    },
    {
        id: "excel-to-pdf",
        category: "productivity",
        name: {
            en: "Excel to PDF Converter",
            cn: "Excel 转 PDF"
        },
        description: {
            en: "Convert Excel spreadsheets (.xlsx, .csv) to PDF format securely in the cloud.",
            cn: "快速、精准、安全地将 Excel 表格转换为 PDF 格式。"
        },
        icon: Table,
        href: "/tools/excel-to-pdf",
        popular: true,
        keywords: ["excel", "xlsx", "csv", "pdf", "convert", "excel to pdf", "spreadsheet"],
    },
    {
        id: "ppt-to-pdf",
        category: "productivity",
        name: {
            en: "PPT to PDF Converter",
            cn: "PPT 转 PDF"
        },
        description: {
            en: "Convert PowerPoint presentations (.pptx, .ppt) to PDF format securely.",
            cn: "快速、精准、安全地将幻灯片转换为 PDF 格式。"
        },
        icon: FileText,
        href: "/tools/ppt-to-pdf",
        popular: true,
        keywords: ["ppt", "pptx", "powerpoint", "pdf", "convert", "ppt to pdf", "slides", "presentation"],
    },
    {
        id: "url-to-pdf",
        category: "productivity",
        name: {
            en: "URL to PDF Converter",
            cn: "网页转 PDF"
        },
        description: {
            en: "Convert any public website or URL into a high-quality PDF document.",
            cn: "将任何公开的网页链接快速转换并保存为高质量的 PDF 文档。"
        },
        icon: Globe,
        href: "/tools/url-to-pdf",
        popular: true,
        keywords: ["url", "website", "webpage", "pdf", "convert", "url to pdf", "web to pdf", "html to pdf"],
    },
    {
        id: "image-grid-joiner",
        category: "media",
        name: {
            en: "Image Grid Joiner",
            cn: "图片拼图与网格拼接器"
        },
        description: {
            en: "Combine multiple images into a seamless grid instantly. 100% processing locally on your device.",
            cn: "瞬间将多张图片拼接到无缝网格中，纯本地处理。"
        },
        icon: Grid3X3,
        href: "/tools/image-grid-joiner",
        popular: true,
        keywords: ["grid", "joiner", "combine", "stitch", "collage", "mosaic", "image grid", "join images"],
    },
    {
        id: "image-grid-splitter",
        category: "media",
        name: {
            en: "Image Grid Splitter",
            cn: "图片网格切分器"
        },
        description: {
            en: "Split a single image into a grid of smaller pieces (e.g., 3x3). 100% local processing.",
            cn: "纯本地将单张图片切分为九宫格等多个等分小图，隐私安全。"
        },
        icon: Blocks, // Or any appropriate icon already imported
        href: "/tools/image-grid-splitter",
        popular: true,
        keywords: ["split", "grid splitter", "9grid", "slice", "cut image", "nine grid", "image splitter"],
    },
    {
        id: "domain-lookup",
        category: "developer",
        name: {
            en: "Domain Lookup",
            cn: "域名查询工具"
        },
        description: {
            en: "WHOIS/RDAP lookup: registrar, expiry, name servers, plus bulk availability checks across popular extensions.",
            cn: "WHOIS/RDAP 域名信息查询：注册商、到期时间、NS 记录，支持多后缀可用性与批量查询。"
        },
        icon: Globe,
        href: "/tools/domain-lookup",
        keywords: ["domain", "whois", "rdap", "dns", "registrar", "domain lookup", "availability", "name server"],
    },
    {
        id: "exif-remover",
        category: "media",
        name: {
            en: "EXIF Remover",
            cn: "EXIF 元数据清除"
        },
        description: {
            en: "View hidden photo metadata (camera, GPS, timestamps) and wipe it clean. AI-generation marker detection included.",
            cn: "查看照片隐藏元数据（相机、GPS、时间戳）并一键清除，附带 AI 生成标记检测。"
        },
        icon: Eraser,
        href: "/tools/exif-remover",
        popular: true,
        keywords: ["exif", "metadata", "remove metadata", "gps", "location", "privacy", "photo metadata", "strip exif"],
    },
    {
        id: "subtitle-tools",
        category: "media",
        name: {
            en: "Subtitle Tools",
            cn: "字幕工具",
        },
        description: {
            en: "Convert subtitles between SRT and VTT, or burn them into video — all locally in your browser.",
            cn: "SRT/VTT 字幕互转、把字幕烧录进视频——全程本地浏览器完成。",
        },
        icon: Captions,
        href: "/tools/subtitle-tools",
        keywords: [
            "subtitle",
            "srt",
            "vtt",
            "webvtt",
            "convert subtitle",
            "burn subtitles",
            "hardcode subtitles",
            "subtitle converter",
            "subtitle burn-in",
            "closed captions",
        ],
    },
    {
        id: "jwt-decoder",
        category: "developer",
        name: {
            en: "JWT Decoder",
            cn: "JWT 解码器"
        },
        description: {
            en: "Decode JSON Web Tokens in your browser: header, claims, and expiry times — with signature-format display. Nothing uploaded.",
            cn: "在浏览器中解码 JWT：头部、声明与过期时间，附签名格式展示。不上传任何数据。"
        },
        icon: KeyRound,
        href: "/tools/jwt-decoder",
        keywords: ["jwt", "json web token", "token", "decode", "bearer", "auth", "authentication", "claims"],
    },
    {
        id: "svg-optimizer",
        category: "developer",
        name: {
            en: "SVG Optimizer",
            cn: "SVG 优化器",
        },
        description: {
            en: "Shrink SVG files: remove editor bloat, comments, hidden elements, round precision — preview before/after.",
            cn: "压缩 SVG：清除编辑器冗余、注释、隐藏元素、数值精度取舍——支持前后对比预览。",
        },
        icon: Shapes,
        href: "/tools/svg-optimizer",
        keywords: ["svg", "optimize svg", "compress svg", "minify svg", "svg minifier", "remove svg bloat", "svg cleaner", "inkscape"],
    },
    {
        id: "text-diff",
        category: "developer",
        name: {
            en: "Text Diff",
            cn: "文本 Diff 对比",
        },
        description: {
            en: "Compare two texts side by side: line-level diff with character-level highlights, fully local.",
            cn: "左右对照比较两段文本：行级 diff + 字符级高亮，全程本地。",
        },
        icon: GitCompare,
        href: "/tools/text-diff",
        keywords: ["text diff", "diff", "compare text", "diff checker", "text compare", "file diff", "diff online", "line diff"],
    },
    {
        id: "codec-toolbox",
        category: "developer",
        name: {
            en: "Codec Toolbox",
            cn: "编解码工具箱"
        },
        description: {
            en: "Base64 encode/decode (URL-safe + file), MD5/SHA hash calculator, and Unix timestamp converter — 3 tools in 1, all local.",
            cn: "Base64 编解码（URL-safe+文件）、MD5/SHA 哈希计算、Unix 时间戳互转——三合一，全程本地。"
        },
        icon: Binary,
        href: "/tools/codec-toolbox",
        keywords: ["base64", "base64 encode", "base64 decode", "base64url", "url-safe base64", "md5", "sha1", "sha256", "sha512", "hash", "checksum", "unix timestamp", "epoch converter", "timestamp to date", "date to timestamp"],
    },
    {
        id: "log-sanitizer",
        category: "developer",
        name: {
            en: "Log Sanitizer",
            cn: "HAR/日志脱敏器"
        },
        description: {
            en: "Redact secrets from HAR files and logs before posting to issues: Bearer tokens, cookies, phones, ID numbers, emails, IPs — 100% local.",
            cn: "发 issue/工单前一键脱敏 HAR 与日志：Bearer token、Cookie、手机号、身份证、邮箱、IP——100% 本地处理。"
        },
        icon: ScanEye,
        href: "/tools/log-sanitizer",
        keywords: ["har", "har sanitizer", "redact har", "har file redactor", "log redactor", "mask secrets", "pii redaction", "sanitize logs", "redact secrets", "bearer token", "cookie redact", "日志脱敏", "har 脱敏"],
    },
    {
        id: "more-tools",
        category: "productivity",
        name: {
            en: "More Tools...",
            cn: "更多工具..."
        },
        description: {
            en: "I am building new tools every weekend.",
            cn: "我正在每个周末构建新工具。"
        },
        icon: Blocks,
        href: "#",
        comingSoon: true,
    }
];
