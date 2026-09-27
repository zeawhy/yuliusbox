export default {
    async fetch(request, env, ctx) {
        // 1. Dynamic CORS Protection
        const origin = request.headers.get("Origin") || "";
        const isAllowedOrigin =
            !origin ||
            origin.includes("yuliusbox.com") ||
            origin.includes("localhost") ||
            origin.includes("127.0.0.1") ||
            origin.endsWith(".vercel.app");

        const corsHeaders = {
            "Access-Control-Allow-Origin": isAllowedOrigin && origin ? origin : "https://www.yuliusbox.com",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        };

        if (request.method === "OPTIONS") {
            return new Response(null, { headers: corsHeaders });
        }

        // Block unauthorized third-party cross-origin requests
        if (origin && !isAllowedOrigin) {
            return new Response(JSON.stringify({ error: "Forbidden origin" }), {
                status: 403,
                headers: { "Content-Type": "application/json" }
            });
        }

        // === Speed Test Endpoints ===
        const url = new URL(request.url);

        // 1. Download Test (Generate random data)
        if (url.pathname === '/api/speed/download') {
            const size = 1024 * 1024 * 5; // 5MB chunks
            const garbage = new Uint8Array(size).fill(65); // Fill with 'A'
            return new Response(garbage, { headers: { ...corsHeaders, "Content-Type": "application/octet-stream" } });
        }

        // 2. Upload Test (Accept data and discard)
        if (url.pathname === '/api/speed/upload' && request.method === 'POST') {
            await request.arrayBuffer();
            return new Response("OK", { headers: corsHeaders });
        }

        // 3. Ping Test (Lightweight)
        if (url.pathname === '/api/speed/ping' || url.pathname === '/api/speed/ping/') {
            return new Response("pong", { headers: corsHeaders });
        }

        if (request.method !== "POST") {
            return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
        }

        // === Rate Limiting Block ===
        const clientIP = request.headers.get("CF-Connecting-IP") || "unknown";
        const RATE_LIMIT = 10;  // Limit: 10 requests
        const WINDOW_SEC = 60;  // Window: 60 seconds

        if (request.method === "POST") {
            try {
                const key = `rate_limit_${clientIP}`;

                if (env.LIMITER) {
                    let count = await env.LIMITER.get(key);
                    count = count ? parseInt(count) : 0;

                    if (count >= RATE_LIMIT) {
                        return new Response(JSON.stringify({ error: "Too many requests. Please try again later." }), {
                            status: 429,
                            headers: { "Content-Type": "application/json", ...corsHeaders }
                        });
                    }

                    // Increment Count non-blocking
                    ctx.waitUntil(
                        env.LIMITER.put(key, count + 1, { expirationTtl: WINDOW_SEC })
                    );
                } else {
                    console.warn("LIMITER KV not bound. Skipping rate limit check.");
                }
            } catch (err) {
                console.error("Rate Limit Error:", err);
            }
        }

        try {
            const requestBody = await request.json().catch(() => ({}));
            const { type, userInput, language } = requestBody;

            // Input payload validation
            if (!userInput || typeof userInput !== "string") {
                return new Response(JSON.stringify({ error: "Missing or invalid 'userInput'" }), {
                    status: 400,
                    headers: { "Content-Type": "application/json", ...corsHeaders }
                });
            }

            // Guard against prompt injection / abuse length
            if (userInput.length > 4000) {
                return new Response(JSON.stringify({ error: "Input is too long (max 4000 characters)" }), {
                    status: 400,
                    headers: { "Content-Type": "application/json", ...corsHeaders }
                });
            }

            const langInstruction = language === 'cn' ? " in Simplified Chinese" : " in English";
            let providerConfig = {};

            // 2. Model Routing Strategy
            switch (type) {
                case 'email': // Use xAI (Grok) for Native English Tone
                    providerConfig = {
                        url: "https://api.x.ai/v1/chat/completions",
                        apiKey: env.XAI_API_KEY || "",
                        model: "grok-3",
                        systemPrompt: "You are a professional business communication expert. Rewrite the draft to be polite and professional. Keep the same language as the input (e.g., if input is Chinese, output Chinese; if English, output English). Return ONLY the rewritten text."
                    };

                    if (!providerConfig.apiKey) {
                        return new Response(JSON.stringify({ error: "Missing XAI_API_KEY in Cloudflare Worker secrets." }), { status: 500, headers: corsHeaders });
                    }
                    break;

                case 'excel': // Use Qwen for Logic/Code
                    providerConfig = {
                        url: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
                        apiKey: env.QWEN_API_KEY || "",
                        model: "qwen-turbo",
                        systemPrompt: "You are an Excel expert. Convert the user request into a formula. Return ONLY the formula code."
                    };
                    break;

                case 'regex': // Use Qwen for Logic/Code
                    providerConfig = {
                        url: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
                        apiKey: env.QWEN_API_KEY || "",
                        model: "qwen-turbo",
                        systemPrompt: `You are a Regex expert. If the user asks to generate a regex, return ONLY the regex pattern code. If the user asks to explain a regex, provide a clear, concise explanation${langInstruction}.`
                    };
                    break;

                case 'youtube': // Use xAI for Creative/Viral Content
                    providerConfig = {
                        url: "https://api.x.ai/v1/chat/completions",
                        apiKey: env.XAI_API_KEY || "",
                        model: "grok-3",
                        systemPrompt: "You are a YouTube expert. Generate 5 high-CTR, viral titles and 10 SEO tags for the user's video topic. Return a valid JSON object with keys 'titles' (array of strings) and 'tags' (array of strings). Do not return markdown blocks."
                    };
                    break;

                case 'sql': // Use Qwen for Logic
                    const dialect = requestBody.dialect || "SQL";
                    providerConfig = {
                        url: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
                        apiKey: env.QWEN_API_KEY || "",
                        model: "qwen-turbo",
                        systemPrompt: `You are an expert Database Administrator. Convert the user's natural language request into a valid ${dialect} query. Return ONLY the SQL code block. No markdown wrapper, no explanation.`
                    };
                    break;

                case 'cron': // Use Qwen for Logic
                    providerConfig = {
                        url: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
                        apiKey: env.QWEN_API_KEY || "",
                        model: "qwen-turbo",
                        systemPrompt: "You are a Cron Job expert. Convert the natural language requirement into a Cron expression and a human-readable explanation. Return a valid JSON object with keys 'expression' (e.g. '*/5 * * * *') and 'description' (in the user's language). No markdown blocks."
                    };
                    break;

                default:
                    return new Response(JSON.stringify({ error: "Invalid Type" }), { status: 400, headers: corsHeaders });
            }

            // 3. Upstream Call with 25s timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 25000);

            const response = await fetch(providerConfig.url, {
                method: "POST",
                signal: controller.signal,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${providerConfig.apiKey}`
                },
                body: JSON.stringify({
                    model: providerConfig.model,
                    messages: [
                        { role: "system", content: providerConfig.systemPrompt },
                        { role: "user", content: userInput }
                    ],
                    temperature: 0.3
                })
            });

            clearTimeout(timeoutId);

            let data;
            try {
                data = await response.json();
            } catch (jsonError) {
                return new Response(JSON.stringify({ error: `Failed to parse API response: ${jsonError.message}` }), { status: 500, headers: corsHeaders });
            }

            if (!response.ok) {
                const errorMsg = data.error?.message || JSON.stringify(data) || "Unknown Upstream API Error";
                return new Response(JSON.stringify({ error: `API Error: ${errorMsg}` }), { status: response.status, headers: corsHeaders });
            }

            const resultText = data.choices?.[0]?.message?.content;

            if (!resultText) {
                return new Response(JSON.stringify({ error: "No content generated. Full response: " + JSON.stringify(data) }), { status: 500, headers: corsHeaders });
            }

            return new Response(JSON.stringify({ result: resultText }), {
                headers: { "Content-Type": "application/json", ...corsHeaders }
            });

        } catch (err) {
            if (err.name === "AbortError") {
                return new Response(JSON.stringify({ error: "AI upstream generation timed out." }), { status: 504, headers: corsHeaders });
            }
            return new Response(JSON.stringify({ error: `Worker Exception: ${err.message}` }), { status: 500, headers: corsHeaders });
        }
    }
};
