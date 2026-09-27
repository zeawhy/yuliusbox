import { MetadataRoute } from "next";
import { toolsData } from "@/lib/tools-data";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://www.yuliusbox.com";

    // 1. Home page
    const routes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
        },
    ];

    // 2. Generate tool pages dynamically from toolsData, filtering out external and comingSoon items
    toolsData.forEach((tool) => {
        // Skip coming-soon tools or external links (e.g. https://www.heic2jpg-free.com)
        if (tool.comingSoon || !tool.href.startsWith("/")) {
            return;
        }

        routes.push({
            url: `${baseUrl}${tool.href}`,
        });
    });

    return routes;
}
