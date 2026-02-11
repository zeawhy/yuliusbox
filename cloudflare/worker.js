export default {
    async fetch(request, env, ctx) {
        // 1. CORS & Method Check
        const corsHeaders = {
            "Access-Control-Allow-Origin": "*", // Allow all for dev
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        };

        if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
        if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });

        try {
            const { type, userInput, language } = await request.json();
            const langInstruction = language === 'cn' ? " in Simplified Chinese" : " in English";
            let providerConfig = {};

            // 2. Model Routing Strategy
            switch (type) {
                case 'email': // Use xAI (Grok) for Native English Tone
                    providerConfig = {
                        url: "https://api.x.ai/v1/chat/completions",
                        apiKey: env.XAI_API_KEY || "", // Ensure apiKey is not undefined
                        model: "grok-3", // Update: "grok-beta" deprecated, using "grok-3"
                        systemPrompt: "You are a professional business communication expert. Rewrite the draft to be polite and professional. Keep the same language as the input (e.g., if input is Chinese, output Chinese; if English, output English). Return ONLY the rewritten text."
                    };

                    // Debugging Check:
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

                default:
                    return new Response(JSON.stringify({ error: "Invalid Type" }), { status: 400, headers: corsHeaders });
            }

            // 3. Unified API Call
            const response = await fetch(providerConfig.url, {
                method: "POST",
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

            // Parse response JSON correctly, handling potential errors
            let data;
            try {
                data = await response.json();
            } catch (jsonError) {
                return new Response(JSON.stringify({ error: `Failed to parse API response: ${jsonError.message}` }), { status: 500, headers: corsHeaders });
            }

            // Check for upstream API error status
            if (!response.ok) {
                const errorMsg = data.error?.message || JSON.stringify(data) || "Unknown Upstream API Error";
                return new Response(JSON.stringify({ error: `API Error: ${errorMsg}` }), { status: response.status, headers: corsHeaders });
            }

            // Check for "choices" array content
            const resultText = data.choices?.[0]?.message?.content;

            if (!resultText) {
                return new Response(JSON.stringify({ error: "No content generated. Full response: " + JSON.stringify(data) }), { status: 500, headers: corsHeaders });
            }

            return new Response(JSON.stringify({ result: resultText }), {
                headers: { "Content-Type": "application/json", ...corsHeaders }
            });

        } catch (err) {
            return new Response(JSON.stringify({ error: `Worker Exception: ${err.message}` }), { status: 500, headers: corsHeaders });
        }
    }
};
