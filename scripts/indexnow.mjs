#!/usr/bin/env node
/**
 * Submit URLs to IndexNow (Bing, Yandex, etc.) so new/updated pages get
 * discovered within minutes instead of waiting for the next crawl.
 *
 * Usage:
 *   node scripts/indexnow.mjs                          # submit all sitemap URLs
 *   node scripts/indexnow.mjs <url1> <url2> ...         # submit specific URLs
 *
 * The key file public/<KEY>.txt must be deployed first — IndexNow verifies
 * key ownership by fetching it. Run this AFTER the deploy that includes it.
 */

const KEY = "62346f40e663defccea6d228bee14536";
const HOST = "www.yuliusbox.com";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

async function sitemapUrls() {
    const res = await fetch(`https://${HOST}/sitemap.xml`);
    if (!res.ok) throw new Error(`sitemap fetch failed: HTTP ${res.status}`);
    const xml = await res.text();
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
    // Only submit URLs under our host (skip external entries if any).
    return urls.filter((u) => {
        try {
            return new URL(u).host === HOST;
        } catch {
            return false;
        }
    });
}

async function submit(urlList) {
    const body = JSON.stringify({
        host: HOST,
        key: KEY,
        keyLocation: KEY_LOCATION,
        urlList,
    });
    const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body,
    });
    // 200 = OK, 202 = accepted (key validation pending — submit again later)
    if (res.status !== 200 && res.status !== 202) {
        const text = await res.text().catch(() => "");
        throw new Error(`IndexNow rejected: HTTP ${res.status} ${text.slice(0, 200)}`);
    }
    return res.status;
}

const args = process.argv.slice(2).filter((a) => a.startsWith("http"));
const urlList = args.length > 0 ? args : await sitemapUrls();
console.log(`Submitting ${urlList.length} URL(s) to IndexNow...`);
const status = await submit(urlList);
console.log(`Done. HTTP ${status} (${status === 202 ? "key validation pending, retry later" : "accepted"})`);
