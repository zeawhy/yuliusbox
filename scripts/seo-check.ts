#!/usr/bin/env node
/**
 * SEO Validation Script for YuliusBox
 *
 * Fetches all URLs from /sitemap.xml against BASE_URL (default http://localhost:3100)
 * and verifies that every page satisfies:
 *   1. HTTP status 200
 *   2. Title <= 60 characters
 *   3. Meta description <= 160 characters
 *   4. og:image is present and its URL returns HTTP 200
 *   5. Canonical link points to the page itself
 *   6. No noindex directive (neither in X-Robots-Tag header nor in <meta name="robots">)
 *   7. Page contains at least one <h1> tag
 *
 * Exit code:
 *   0 if all pages pass
 *   1 if any page fails
 */

interface PageIssue {
  url: string;
  errors: string[];
}

const BASE_URL = (process.env.BASE_URL || "http://localhost:3100").replace(/\/+$/, "");

function decodeHtml(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/\s+/g, " ")
    .trim();
}

function getMeta(html: string, nameOrProp: string, keyAttr: "name" | "property" = "name"): string | null {
  // Matches: <meta name="..." content="..."> or <meta property="..." content="...">
  const regex = new RegExp(`<meta\\s+[^>]*${keyAttr}=["']${nameOrProp}["'][^>]*content=["']([^"']*)["'][^>]*>`, "i");
  const m = html.match(regex);
  if (m) return decodeHtml(m[1]);

  // Matches reversed attribute order: <meta content="..." name="...">
  const revRegex = new RegExp(`<meta\\s+[^>]*content=["']([^"']*)["'][^>]*${keyAttr}=["']${nameOrProp}["'][^>]*>`, "i");
  const revMatch = html.match(revRegex);
  if (revMatch) return decodeHtml(revMatch[1]);

  return null;
}

function getCanonical(html: string): string | null {
  const regex = /<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["'][^>]*>/i;
  const m = html.match(regex);
  if (m) return decodeHtml(m[1]);

  const revRegex = /<link\s+[^>]*href=["']([^"']*)["'][^>]*rel=["']canonical["'][^>]*>/i;
  const revMatch = html.match(revRegex);
  if (revMatch) return decodeHtml(revMatch[1]);

  return null;
}

async function verifyImageUrl(rawOgUrl: string, baseUrl: string): Promise<{ ok: boolean; status?: number; error?: string }> {
  try {
    const urlObj = new URL(rawOgUrl, baseUrl);
    // If the image URL points to the production domain, point it to the local test server
    if (urlObj.hostname === "www.yuliusbox.com" || urlObj.hostname === "yuliusbox.com") {
      const baseObj = new URL(baseUrl);
      urlObj.protocol = baseObj.protocol;
      urlObj.host = baseObj.host;
    }

    let res = await fetch(urlObj.href, { method: "HEAD" });
    if (res.status === 405) {
      // Fallback to GET if server does not accept HEAD
      res = await fetch(urlObj.href, { method: "GET" });
    }
    return { ok: res.status === 200, status: res.status };
  } catch (e: any) {
    return { ok: false, error: e?.message || String(e) };
  }
}

async function checkPage(loc: string, index: number, total: number): Promise<PageIssue | null> {
  const errors: string[] = [];
  const parsedLoc = new URL(loc);
  const targetUrl = `${BASE_URL}${parsedLoc.pathname}${parsedLoc.search}`;

  let res: Response;
  try {
    res = await fetch(targetUrl);
  } catch (err: any) {
    return {
      url: loc,
      errors: [`Failed to fetch page (${targetUrl}): ${err.message}`],
    };
  }

  if (res.status !== 200) {
    errors.push(`Page returned HTTP status ${res.status}`);
  }

  // 1. Check response header for X-Robots-Tag noindex
  const xRobots = res.headers.get("x-robots-tag");
  if (xRobots && /noindex/i.test(xRobots)) {
    errors.push(`X-Robots-Tag header contains noindex: "${xRobots}"`);
  }

  const html = await res.text();

  // 2. Check title
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!titleMatch) {
    errors.push("Missing <title> tag");
  } else {
    const title = decodeHtml(titleMatch[1]);
    if (title.length === 0) {
      errors.push("Empty <title> tag");
    } else if (title.length > 60) {
      errors.push(`Title exceeds 60 characters (${title.length} chars): "${title}"`);
    }
  }

  // 3. Check meta description
  const desc = getMeta(html, "description", "name");
  if (!desc) {
    errors.push('Missing <meta name="description"> tag');
  } else {
    if (desc.length === 0) {
      errors.push("Empty meta description");
    } else if (desc.length > 160) {
      errors.push(`Meta description exceeds 160 characters (${desc.length} chars): "${desc}"`);
    }
  }

  // 4. Check og:image
  const ogImage = getMeta(html, "og:image", "property");
  if (!ogImage) {
    errors.push('Missing <meta property="og:image"> tag');
  } else {
    const imgCheck = await verifyImageUrl(ogImage, BASE_URL);
    if (!imgCheck.ok) {
      errors.push(
        imgCheck.error
          ? `og:image fetch error (${ogImage}): ${imgCheck.error}`
          : `og:image URL returned HTTP ${imgCheck.status}: ${ogImage}`
      );
    }
  }

  // 5. Check canonical
  const canonical = getCanonical(html);
  if (!canonical) {
    errors.push('Missing <link rel="canonical"> tag');
  } else {
    const canonicalObj = new URL(canonical, BASE_URL);
    const normPagePath = parsedLoc.pathname.replace(/\/+$/, "") || "/";
    const normCanonicalPath = canonicalObj.pathname.replace(/\/+$/, "") || "/";
    if (normPagePath !== normCanonicalPath) {
      errors.push(`Canonical path "${normCanonicalPath}" does not match page path "${normPagePath}"`);
    }
  }

  // 6. Check meta robots for noindex
  const metaRobots = getMeta(html, "robots", "name");
  if (metaRobots && /noindex/i.test(metaRobots)) {
    errors.push(`Meta robots contains noindex: "${metaRobots}"`);
  }

  // 7. Check <h1>
  const h1Match = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  if (!h1Match) {
    errors.push("Missing <h1> tag");
  } else {
    const textContent = h1Match[1].replace(/<[^>]*>/g, "").trim();
    if (textContent.length === 0 && !/<(img|svg)\b/i.test(h1Match[1])) {
      errors.push("Empty <h1> tag");
    }
  }

  const prefix = `[${index}/${total}]`;
  if (errors.length > 0) {
    console.log(`❌ ${prefix} ${parsedLoc.pathname} (${errors.length} issue${errors.length > 1 ? "s" : ""})`);
    return { url: loc, errors };
  } else {
    console.log(`✅ ${prefix} ${parsedLoc.pathname}`);
    return null;
  }
}

async function main() {
  console.log(`Starting SEO checks against BASE_URL: ${BASE_URL}`);
  const sitemapUrl = `${BASE_URL}/sitemap.xml`;

  let sitemapXml: string;
  try {
    const res = await fetch(sitemapUrl);
    if (res.status !== 200) {
      console.error(`❌ Failed to fetch ${sitemapUrl}: HTTP ${res.status}`);
      process.exit(1);
    }
    sitemapXml = await res.text();
  } catch (err: any) {
    console.error(`❌ Network error fetching ${sitemapUrl}: ${err.message}`);
    console.error("Make sure your local Next.js server is running (`npm run build && next start -p 3100`)");
    process.exit(1);
  }

  const locMatches = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)];
  const urls = locMatches.map((m) => m[1].trim()).filter(Boolean);

  if (urls.length === 0) {
    console.error(`❌ No URLs found in sitemap at ${sitemapUrl}`);
    process.exit(1);
  }

  console.log(`Found ${urls.length} URLs in /sitemap.xml. Beginning validation...\n`);

  const issues: PageIssue[] = [];
  let passedCount = 0;

  for (let i = 0; i < urls.length; i++) {
    const issue = await checkPage(urls[i], i + 1, urls.length);
    if (issue) {
      issues.push(issue);
    } else {
      passedCount++;
    }
  }

  console.log("\n==========================================");
  console.log(`Summary: ${passedCount}/${urls.length} pages passed.`);
  console.log("==========================================");

  if (issues.length > 0) {
    console.error(`\n❌ SEO validation failed with ${issues.length} problematic page(s):\n`);
    for (const issue of issues) {
      console.error(`• ${issue.url}`);
      for (const err of issue.errors) {
        console.error(`    - ${err}`);
      }
    }
    process.exit(1);
  } else {
    console.log(`\n🎉 All ${passedCount} pages passed all SEO checks successfully!\n`);
    process.exit(0);
  }
}

main().catch((err) => {
  console.error("Unhandled error running seo-check:", err);
  process.exit(1);
});
