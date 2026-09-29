import type { NextConfig } from "next";
import { NOINDEX_TOOL_PATHS } from "./src/lib/seo";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // 裸域 301 跳转到 www，避免 www 与裸域双版本重复内容
        source: "/:path*",
        has: [{ type: "host", value: "yuliusbox.com" }],
        destination: "https://www.yuliusbox.com/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      // 1. Immutable caching for content-hashed AI models & WASM runtimes (Fixes max-age=0 bandwidth waste)
      {
        source: "/models/:file*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "cross-origin",
          },
        ],
      },
      // Note: resources.json must be placed AFTER /models/:file* so Next.js "last header wins"
      // ensures the manifest gets a short revalidation cache rather than 1-year immutable caching.
      {
        source: "/models/resources.json",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=300, must-revalidate",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "cross-origin",
          },
        ],
      },
      {
        source: "/wasm/:file*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "cross-origin",
          },
        ],
      },

      // 2. Global Security Headers (without aggressive site-wide COEP)
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(self), geolocation=()",
          },
        ],
      },

      // 3. Narrowed COOP/COEP Headers: only apply to tools that genuinely require SharedArrayBuffer
      {
        source: "/tools/video-to-gif",
        headers: [
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
        ],
      },
      {
        source: "/tools/audio-to-text",
        headers: [
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
        ],
      },
      {
        source: "/tools/background-remover",
        headers: [
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
        ],
      },
      // 4. SEO: noindex low-priority tool pages (canonical list in src/lib/seo.ts).
      // Pages stay fully usable for direct visitors; search engines are told
      // not to index them. Re-index a tool by removing its path from the list.
      ...NOINDEX_TOOL_PATHS.map((path) => ({
        source: path,
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      })),
    ];
  },
};

export default nextConfig;
