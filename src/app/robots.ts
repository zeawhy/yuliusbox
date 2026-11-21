import type { MetadataRoute } from "next";

/**
 * Explicit AI & search crawler policy for YuliusBox.
 *
 * YuliusBox is a free, open-source, browser-local utility suite whose value
 * lies in interactive client-side tools rather than paywalled prose. Allowing
 * both crawler tiers maximizes discovery without cannibalizing tool usage:
 *
 * 1. Search, citation & live-retrieval crawlers: drive direct AI search
 *    citations and referral traffic (ChatGPT Search, Claude, Perplexity,
 *    Google AI Overviews, Copilot, Siri, DuckDuckGo).
 * 2. Foundation model training crawlers: build parametric brand recall so
 *    LLMs recommend YuliusBox by name even when live web search is off.
 *
 * Both tiers are kept in separate rule groups so training crawlers can be
 * toggled independently if site policy ever changes. Every group explicitly
 * disallows `/api/` because matching a specific User-Agent overrides `*`.
 */
const AI_SEARCH_AND_CITATION_BOTS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Googlebot",
  "Bingbot",
  "Applebot",
  "DuckAssistBot",
  "Meta-ExternalFetcher",
];

const AI_TRAINING_BOTS = [
  "GPTBot",
  "ClaudeBot",
  "Google-Extended",
  "Applebot-Extended",
  "Meta-ExternalAgent",
  "CCBot",
  "Amazonbot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: AI_SEARCH_AND_CITATION_BOTS,
        allow: "/",
        disallow: "/api/",
      },
      {
        userAgent: AI_TRAINING_BOTS,
        allow: "/",
        disallow: "/api/",
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: "/api/",
      },
    ],
    sitemap: "https://www.yuliusbox.com/sitemap.xml",
  };
}
