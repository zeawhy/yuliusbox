import { Image, FileText, Blocks, LucideIcon } from "lucide-react";

export interface Tool {
    id: string;
    name: string;
    description: string;
    icon: LucideIcon;
    href: string;
    comingSoon?: boolean;
    popular?: boolean;
}

export const toolsData: Tool[] = [
    {
        id: "heic-2-jpg",
        name: "HEIC to JPG Free",
        description: "Convert HEIC/WebP photos to JPG instantly in your browser. 100% Local processing via WebAssembly.",
        icon: Image,
        href: "https://www.heic2jpg-free.com",
        popular: true,
    },
    {
        id: "image-compressor",
        name: "Bulk Image Compression",
        description: "Compress unlimited JPG/PNG/WebP images locally. High efficiency, privacy-first, and 100% free.",
        icon: Image, // Reusing Image icon or should I use Shrink/Minimize if available? Let's use Image for now as it fits. 
        // Actually, let's keep it simple.
        href: "/tools/image-compressor",
        popular: true,
    },
    {
        id: "pdf-toolkit",
        name: "PDF Toolkit",
        description: "Merge, Split, and Compress PDF files locally.",
        icon: FileText,
        href: "#",
        comingSoon: true,
    },
    {
        id: "more-tools",
        name: "More Tools...",
        description: "I am building new tools every weekend.",
        icon: Blocks,
        href: "#",
        comingSoon: true,
    }
];
