import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ToolsDirectory } from "@/components/tools/ToolsDirectory";

export const metadata: Metadata = {
    title: "All Free Online Tools — YuliusBox",
    description:
        "Browse all free YuliusBox tools. Most tools run entirely in your browser — a few server-powered tools are the exception, and each one is clearly labeled.",
    alternates: { canonical: "https://www.yuliusbox.com/tools" },
    openGraph: {
        url: "/tools",
        siteName: "YuliusBox",
        type: "website",
        images: [
            {
                url: "/og/tools.png",
                width: 1200,
                height: 630,
                alt: "All Free Online Tools \u2014 YuliusBox",
            },
        ],
    },

};

export default function ToolsIndexPage() {
    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-7xl mx-auto">
            <Header />
            <Breadcrumbs trail={[{ href: "/", label: "Home" }, { href: "/tools", label: "All Tools" }]} />

            <main className="w-full flex flex-col gap-8">
                <div className="text-center space-y-4 pt-2">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                        All Tools
                    </h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto">
                        Every free YuliusBox tool in one place. Most tools run entirely in your
                        browser — a few server-powered tools are the exception, and each one is clearly labeled.
                    </p>
                </div>

                <ToolsDirectory />
            </main>

            <Footer />
        </div>
    );
}
