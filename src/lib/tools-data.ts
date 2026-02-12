import { Image, FileText, Blocks, LucideIcon, Mail, Table, Code } from "lucide-react";

export interface Tool {
    id: string;
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
        id: "safe-zone-overlay",
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
        id: "more-tools",
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
