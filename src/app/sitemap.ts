import { MetadataRoute } from "next";
// NOTE: import from tools-routes, NOT tools-data — tools-data pulls in
// lucide-react which blows the sitemap function past Vercel's 250MB limit.
import { toolRoutes } from "@/lib/tools-routes";
import { NOINDEX_TOOL_PATHS } from "@/lib/seo";
import { longTailPages } from "@/lib/long-tail-content";
// Static lastmod map generated at build time by scripts/sitemap-lastmod.mjs.
// (Dynamic execSync/existsSync with variable paths made Vercel's NFT tracer
// bundle the entire src/ + public/ trees into this function.)
import lastmodMap from "@/lib/sitemap-lastmod.json";

/** Static informational pages (not tools). */
const STATIC_PAGES = ["/privacy", "/about", "/contact", "/terms", "/tools"];

function entry(
    url: string,
    routePath: string
): MetadataRoute.Sitemap[number] {
    const lastModified = (lastmodMap as Record<string, string>)[routePath];
    return lastModified ? { url, lastModified: new Date(lastModified) } : { url };
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
