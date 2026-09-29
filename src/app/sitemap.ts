import { MetadataRoute } from "next";
import { toolsData } from "@/lib/tools-data";
import { NOINDEX_TOOL_PATHS } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://www.yuliusbox.com";

    // 1. Home page
    const routes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
        },
    ];

    // 2. Generate tool pages dynamically from toolsData, filtering out external,
    // comingSoon, and noindexed items (canonical noindex list in src/lib/seo.ts)
    toolsData.forEach((tool) => {
        // Skip coming-soon tools or external links (e.g. https://www.heic2jpg-free.com)
        if (tool.comingSoon || !tool.href.startsWith("/")) {
            return;
        }
        // Skip tools hidden from search engines
        if (NOINDEX_TOOL_PATHS.includes(tool.href)) {
            return;
        }

        routes.push({
            url: `${baseUrl}${tool.href}`,
        });
    });

    return routes;
}
