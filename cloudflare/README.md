# YuliusBox AI Backend (Cloudflare Worker)

This directory contains the serverless backend code for YuliusBox's AI tools. It handles requests from the frontend and routes them to various AI providers (xAI Grok-3, Alibaba Qwen-turbo) and handles network speed tests.

---

## ⚡ Option 1: Automatic Deployment via Git (Recommended)

You can link this worker directly to your GitHub repository so that every push to `main` automatically builds and deploys:

1. **Open Cloudflare Dashboard**:
   - Go to **Compute (Workers & Pages)** -> Select or create your Worker (e.g., `yuliusbox-ai-backend`).
2. **Connect to Git**:
   - Go to **Settings** -> **Build & Deploy** -> Click **Connect to Git**.
   - Select repository: `zeawhy/yuliusbox`.
   - Set **Production branch**: `main`.
   - Set **Root directory**: `cloudflare` *(Important: point to this folder)*.
   - Build configuration will automatically use [`wrangler.toml`](wrangler.toml).
3. **Configure Secrets**:
   - In Cloudflare Dashboard: **Settings** -> **Variables and Secrets**.
   - Add Secret: `XAI_API_KEY` (from [console.x.ai](https://console.x.ai/)).
   - Add Secret: `QWEN_API_KEY` (from [DashScope Console](https://dashscope.console.aliyun.com/)).
4. **Configure KV Limiter**:
   - Under **Settings** -> **Variables and Secrets** -> **KV Namespace Bindings**:
   - Variable Name: `LIMITER` -> Select your rate limiting KV namespace.

---

## 💻 Option 2: Manual CLI Deployment

### Prerequisites

- A Cloudflare account.
- `wrangler` CLI installed (`npm install -g wrangler` or `npx wrangler`).

### Deployment Steps

1. **Login to Cloudflare**:
   ```bash
   npx wrangler login
   ```

2. **Configure Secrets**:
   ```bash
   cd cloudflare
   npx wrangler secret put XAI_API_KEY
   npx wrangler secret put QWEN_API_KEY
   ```

3. **Deploy Worker**:
   ```bash
   npx wrangler deploy
   ```

4. **Connect URL to Frontend**:
   Add your worker URL to `.env.local` and your Vercel Project Environment Variables:
   ```env
   NEXT_PUBLIC_CF_WORKER_URL=https://yuliusbox-ai-backend.your-subdomain.workers.dev
   ```

---

## 🔒 Security & Anti-Abuse Features

- **Dynamic CORS Origin Verification**: Restricts cross-origin browser requests strictly to `*.yuliusbox.com`, `localhost`, and Vercel preview environments, preventing third-party websites from draining your AI tokens.
- **Input Length Guard**: Rejects payloads exceeding 4000 characters to prevent prompt injection and token runaway.
- **Upstream Timeout Protection**: 25-second abort controller prevents hanging connections.
- **IP Rate Limiting**: 10 requests per minute per IP via Cloudflare KV.
