import { MetadataRoute } from "next";
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
// NOTE: import from tools-routes, NOT tools-data — tools-data pulls in
// lucide-react which blows the sitemap function past Vercel's 250MB limit.
import { toolRoutes } from "@/lib/tools-routes";
import { NOINDEX_TOOL_PATHS } from "@/lib/seo";
import { longTailPages } from "@/lib/long-tail-content";

/** Static informational pages (not tools). */
const STATIC_PAGES = ["/privacy", "/about", "/contact", "/terms", "/tools"];

/**
 * Honest lastmod from git history: the most recent commit touching any of the
 * candidate source files for a route. Returns undefined when git history is
 * unavailable (shallow clones), in which case Next.js omits lastModified.
 */
function gitLastMod(...candidates: string[]): Date | undefined {
    const root = process.cwd();
    let latest = 0;
    for (const rel of candidates) {
        if (!existsSync(join(root, rel))) continue;
        try {
            const out = execSync(`git log -1 --format=%ct -- "${rel}"`, {
                cwd: root,
                timeout: 8000,
            })
                .toString()
                .trim();
            const ts = parseInt(out, 10);
            if (ts > latest) latest = ts;
        } catch {
            /* git unavailable for this file — skip */
        }
    }
    return latest > 0 ? new Date(latest * 1000) : undefined;
}

/** Candidate source files that render a given route path. */
function sourceFilesFor(routePath: string): string[] {
    const cands: string[] = [];
    if (routePath === "/") {
        cands.push("src/app/page.tsx");
    } else {
        cands.push(`src/app${routePath}/page.tsx`);
    }
    // Long-tail pages may be rendered by the hub page or a content module.
    const parts = routePath.split("/").filter(Boolean);
    if (parts[0] === "tools" && parts.length >= 2) {
        cands.push(`src/app/tools/${parts[1]}/page.tsx`);
        cands.push(`src/lib/long-tail/${parts[1]}.ts`);
    }
    cands.push("src/lib/tools-data.ts", "src/lib/seo.ts");
    return cands;
}

function entry(url: string, routePath: string): MetadataRoute.Sitemap[number] {
    const lastModified = gitLastMod(...sourceFilesFor(routePath));
    return lastModified ? { url, lastModified } : { url };
}

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://www.yuliusbox.com";

    // 1. Home page
    const routes: MetadataRoute.Sitemap = [entry(baseUrl, "/")];

    // 2. Generate tool pages from the lightweight route index (see tools-routes.ts
    // for why we don't import tools-data here), filtering noindexed items
    // (canonical noindex list in src/lib/seo.ts)
    toolRoutes.forEach((tool) => {
        // Skip tools hidden from search engines
        if (NOINDEX_TOOL_PATHS.includes(tool.href)) {
            return;
        }

        routes.push(entry(`${baseUrl}${tool.href}`, tool.href));
    });

    // 3. Indexed long-tail scenario pages
    longTailPages.forEach((page) => {
        routes.push(entry(`${baseUrl}${page.href}`, page.href));
    });

    // 4. Static informational pages
    STATIC_PAGES.forEach((path) => {
        routes.push(entry(`${baseUrl}${path}`, path));
    });

    return routes;
}
