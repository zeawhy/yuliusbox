import type { NextConfig } from "next";
import { NOINDEX_TOOL_PATHS } from "./src/lib/seo";

const nextConfig: NextConfig = {
  experimental: {
    turbopackUseSystemTlsCerts: true,
  },
  async redirects() {
    return [
      {
        // 裸域 301 跳转到 www，避免 www 与裸域双版本重复内容
        source: "/:path*",
        has: [{ type: "host", value: "yuliusbox.com" }],
        destination: "https://www.yuliusbox.com/:path*",
        permanent: true,
      },
      {
        source: "/image-to-svg",
        destination: "/tools/image-to-svg",
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
      {
        source: "/whisper.worker.js",
        headers: [
          {
            key: "Cross-Origin-Resource-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "credentialless",
          },
        ],
      },
      {
        source: "/transformers.min.js",
        headers: [
          {
            key: "Cross-Origin-Resource-Policy",
            value: "same-origin",
          },
        ],
      },

      // 2. Global Security Headers (without aggressive site-wide COEP)
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains",
          },
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
          {
            key: "Content-Security-Policy-Report-Only",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' https://stats.yuliusbox.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://adservice.google.com https://www.googletagservices.com https://static.cloudflareinsights.com https://ep2.adtrafficquality.google blob:",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self' https://stats.yuliusbox.com https://assets.zypass.dpdns.org https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google https://cloudflareinsights.com https://rdap.org https://*.rdap.org data: blob:",
              "worker-src 'self' blob:",
              "frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://ep2.adtrafficquality.google https://www.google.com",
              "object-src 'none'",
              "base-uri 'self'",
            ].join("; "),
          },
        ],
      },

      // 3. Narrowed COOP/COEP Headers: only apply to tools that genuinely require SharedArrayBuffer
      {
        source: "/tools/video-to-gif",
        headers: [
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "credentialless",
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
            value: "credentialless",
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
            value: "credentialless",
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
            value: "noindex, follow",
          },
        ],
      })),
    ];
  },
};

export default nextConfig;
