import { Image, FileText, Blocks, LucideIcon, Mail, Table, Code, Database, Clock, FileJson, Shield, Eraser, Scissors, Zap, FileVideo, Globe } from "lucide-react";

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
}

export const toolsData: Tool[] = [
    {
        id: "screenshot-beautifier",
        category: "media",
        name: {
            en: "Screenshot Beautifier",
            cn: "截图美化工具"
        },
        description: {
            en: "Wrap your screenshots in a stylish browser window with gradients.",
            cn: "为您的截图添加精美的浏览器窗口和背景渐变。"
        },
        icon: Image,
        href: "/tools/screenshot-beautifier",
        popular: true,
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
    },
    {
        id: "id-watermark",
        category: "productivity",
        name: {
            en: "Secure ID Watermarker",
            cn: "证件安全水印"
        },
        description: {
            en: "Add security watermarks to ID cards locally. Prevent unauthorized use.",
            cn: "纯本地为身份证/照片添加安全水印，防止被滥用。"
        },
        icon: FileText,
        href: "/tools/id-watermark",
        popular: true,
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
    },
    {
        id: "video-downloader",
        category: "media",
        name: {
            en: "Social Media Video Downloader",
            cn: "无水印视频解析下载"
        },
        description: {
            en: "Extract and download videos from YouTube, TikTok, Instagram, Twitter, etc. without watermarks.",
            cn: "免费解析下载 YouTube, TikTok, Instagram, Twitter 等社交媒体的高清无水印视频。"
        },
        icon: FileVideo,
        href: "/tools/video-downloader",
        popular: true,
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
