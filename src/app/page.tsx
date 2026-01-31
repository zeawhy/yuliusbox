import { toolsData } from "@/lib/tools-data";
import { ToolCard } from "@/components/ui/ToolCard";
import { Github, Twitter, Mail } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center p-4 sm:p-8 lg:p-24 max-w-7xl mx-auto">
      {/* Header */}
      <header className="w-full flex justify-between items-center py-6 mb-16 sm:mb-24">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-white select-none">YuliusBox</h1>
        </div>
        <nav>
          <Link
            href="https://github.com/zeawhy/yuliusbox"
            target="_blank"
            className="p-2 text-zinc-400 hover:text-white transition-colors block"
            aria-label="GitHub"
          >
            <Github className="w-6 h-6" />
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="w-full flex-1 flex flex-col items-start gap-16 sm:gap-24">
        <section className="flex flex-col gap-6 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white">
            Privacy-First Web Tools <br />
            <span className="text-zinc-500">for Productivity.</span>
          </h1>
          <p className="text-lg sm:text-xl text-zinc-400 leading-relaxed max-w-2xl">
            A collection of free, client-side, and secure utilities. <br className="hidden sm:block" />
            No ads, no tracking, just useful tools that respect your data.
          </p>
          <div className="flex gap-4 pt-4">
            <Link
              href="#tools"
              className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-semibold text-zinc-950 bg-white rounded-full hover:bg-zinc-200 hover:scale-105 transition-all duration-300"
            >
              Explore Tools
            </Link>
          </div>
        </section>

        {/* Tools Grid */}
        <section id="tools" className="w-full scroll-mt-32 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {toolsData.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 mt-24 border-t border-zinc-900 flex flex-col sm:flex-row justify-between items-center gap-6 text-zinc-500">
        <p className="text-sm">© 2024 YuliusBox. Built by Yulius.</p>
        <div className="flex gap-6">
          <Link href="#" className="hover:text-white transition-colors" aria-label="Twitter"><Twitter className="w-5 h-5" /></Link>
          <Link href="mailto:hello@example.com" className="hover:text-white transition-colors" aria-label="Email"><Mail className="w-5 h-5" /></Link>
        </div>
      </footer>
    </div>
  );
}
