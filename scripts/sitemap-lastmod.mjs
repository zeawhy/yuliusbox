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
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outPath = join(root, "src/lib/sitemap-lastmod.json");

const hrefsOf = (file) => {
    if (!existsSync(join(root, file))) return [];
    const src = readFileSync(join(root, file), "utf8");
    return [...src.matchAll(/href:\s*"(\/[^"]*)"/g)].map((m) => m[1]);
};

function gitLastMod(...candidates) {
    let latest = 0;
    let fallbackMtime = 0;
    for (const rel of candidates) {
        const fullPath = join(root, rel);
        if (!existsSync(fullPath)) continue;
        try {
            const mtime = statSync(fullPath).mtimeMs / 1000;
            if (mtime > fallbackMtime) fallbackMtime = mtime;

            const ts = parseInt(
                execSync(`git log -1 --format=%ct -- "${rel}"`, {
                    cwd: root,
                    timeout: 8000,
                })
                    .toString()
                    .trim(),
                10
            );
            if (!isNaN(ts) && ts > latest) latest = ts;
        } catch {
            /* git unavailable or untracked — skip */
        }
    }
    const finalTs = latest > 0 ? latest : fallbackMtime;
    return finalTs > 0 ? new Date(finalTs * 1000).toISOString() : null;
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
    return cands;
}

// Collect all tool routes
const toolRoutes = hrefsOf("src/lib/tools-routes.ts");

// Collect all long-tail routes from all files under src/lib/long-tail/
const ltDir = join(root, "src/lib/long-tail");
const ltRoutes = [];
if (existsSync(ltDir)) {
    const files = readdirSync(ltDir).filter((f) => f.endsWith(".ts"));
    for (const f of files) {
        ltRoutes.push(...hrefsOf(`src/lib/long-tail/${f}`));
    }
}

const allRoutes = [
    "/",
    ...toolRoutes,
    ...ltRoutes,
    "/privacy",
    "/about",
    "/contact",
    "/terms",
    "/tools",
];

const result = {};
for (const rp of [...new Set(allRoutes)]) {
    const lm = gitLastMod(...sourceFilesFor(rp));
    if (lm) {
        result[rp] = lm;
    } else {
        result[rp] = new Date().toISOString();
    }
}

writeFileSync(outPath, JSON.stringify(result, null, 2) + "\n");
console.log(`sitemap-lastmod.json: ${Object.keys(result).length} routes`);
