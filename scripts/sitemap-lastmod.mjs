/**
 * Prebuild: generate src/lib/sitemap-lastmod.json with honest lastmod dates
 * from git history.
 *
 * Why: src/app/sitemap.ts used to call execSync('git log...') + existsSync()
 * with dynamic paths at request time. Vercel's NFT file tracer cannot
 * statically resolve those, so it bundled the entire src/ and public/ trees
 * (incl. ~200MB of WASM/ML models) into the sitemap function > 250MB limit.
 * Now lastmod is computed once at build time into a static JSON import.
 */
import { execSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outPath = join(root, "src/lib/sitemap-lastmod.json");

const hrefsOf = (file) => {
    const src = readFileSync(join(root, file), "utf8");
    return [...src.matchAll(/href:\s*"(\/[^"]*)"/g)].map((m) => m[1]);
};

function gitLastMod(...candidates) {
    let latest = 0;
    for (const rel of candidates) {
        if (!existsSync(join(root, rel))) continue;
        try {
            const ts = parseInt(
                execSync(`git log -1 --format=%ct -- "${rel}"`, {
                    cwd: root,
                    timeout: 8000,
                })
                    .toString()
                    .trim(),
                10
            );
            if (ts > latest) latest = ts;
        } catch {
            /* git unavailable — skip */
        }
    }
    return latest > 0 ? new Date(latest * 1000).toISOString() : null;
}

function sourceFilesFor(routePath) {
    const cands =
        routePath === "/"
            ? ["src/app/page.tsx"]
            : [`src/app${routePath}/page.tsx`];
    const parts = routePath.split("/").filter(Boolean);
    if (parts[0] === "tools" && parts.length >= 2) {
        cands.push(`src/app/tools/${parts[1]}/page.tsx`);
        cands.push(`src/lib/long-tail/${parts[1]}.ts`);
    }
    cands.push("src/lib/tools-data.ts", "src/lib/seo.ts");
    return cands;
}

const allRoutes = [
    "/",
    ...hrefsOf("src/lib/tools-routes.ts"),
    ...hrefsOf("src/lib/long-tail-content.ts"),
    "/privacy",
    "/about",
    "/contact",
    "/terms",
    "/tools",
];

const result = {};
for (const rp of [...new Set(allRoutes)]) {
    const lm = gitLastMod(...sourceFilesFor(rp));
    if (lm) result[rp] = lm;
}

writeFileSync(outPath, JSON.stringify(result, null, 2) + "\n");
console.log(`sitemap-lastmod.json: ${Object.keys(result).length} routes`);
