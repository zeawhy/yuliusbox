# YuliusBox AI Backend (Cloudflare Worker)

This directory contains the serverless backend code for YuliusBox's AI tools. It handles requests from the frontend and routes them to various AI providers (xAI, Alibaba Qwen).

## Prerequisites

- A Cloudflare account.
- `wrangler` CLI installed (`npm install -g wrangler`).
- API Keys for AI Providers:
    - **xAI (Grok)**: Get from [console.x.ai](https://console.x.ai/)
    - **Alibaba Cloud (Qwen)**: Get from [DashScope Console](https://dashscope.console.aliyun.com/)

## Deployment Instructions

1.  **Login to Cloudflare**:
    ```bash
    wrangler login
    ```

2.  **Initialize Worker (if not already done)**:
    ```bash
    wrangler init yuliusbox-ai-backend
    # Select "Hello World" worker to start, then replace content with worker.js
    ```

3.  **Configure Secrets**:
    Set your API keys securely in Cloudflare:
    ```bash
    wrangler secret put XAI_API_KEY
    # Paste your xAI API key when prompted

    wrangler secret put QWEN_API_KEY
    # Paste your Qwen API key when prompted
    ```

4.  **Deploy**:
    Copy the content of `worker.js` to your worker's main file (usually `src/index.js` or `worker.js`) and deploy:
    ```bash
    wrangler deploy
    ```

5.  **Get Worker URL**:
    After deployment, Cloudflare will provide a URL (e.g., `https://yuliusbox-ai-backend.your-subdomain.workers.dev`).
    
    Add this URL to your frontend `.env.local` file:
    ```env
    NEXT_PUBLIC_CF_WORKER_URL=https://yuliusbox-ai-backend.your-subdomain.workers.dev
    ```

    **Important for Production (Vercel)**:
    When deploying to Vercel, you must add this environment variable in your project settings:
    1. Go to Vercel Dashboard > Project > **Settings** > **Environment Variables**.
    2. Add `NEXT_PUBLIC_CF_WORKER_URL` with your worker URL.
    3. Redeploy your application.

## API Usage

The worker accepts `POST` requests with the following JSON body:

```json
{
  "type": "email" | "excel" | "regex",
  "userInput": "Your prompt here"
}
```

### Response Format

```json
{
  "result": "Generated text from AI..."
}
```
