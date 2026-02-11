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
            const { type, userInput } = await request.json();
            let providerConfig = {};

            // 2. Model Routing Strategy
            switch (type) {
                case 'email': // Use xAI (Grok) for Native English Tone
                    providerConfig = {
                        url: "https://api.x.ai/v1/chat/completions",
                        apiKey: env.XAI_API_KEY,
                        model: "grok-beta",
                        systemPrompt: "You are a professional business communication expert. Rewrite the draft to be polite and professional. Return ONLY the rewritten text."
                    };
                    break;

                case 'excel': // Use Qwen for Logic/Code
                    providerConfig = {
                        url: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
                        apiKey: env.QWEN_API_KEY,
                        model: "qwen-turbo",
                        systemPrompt: "You are an Excel expert. Convert the user request into a formula. Return ONLY the formula code."
                    };
                    break;

                case 'regex': // Use Qwen for Logic/Code
                    providerConfig = {
                        url: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
                        apiKey: env.QWEN_API_KEY,
                        model: "qwen-turbo",
                        systemPrompt: "You are a Regex expert. Provide the regex pattern. Return ONLY the regex code."
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

            const data = await response.json();
            const resultText = data.choices?.[0]?.message?.content || "Error generating response";

            return new Response(JSON.stringify({ result: resultText }), {
                headers: { "Content-Type": "application/json", ...corsHeaders }
            });

        } catch (err) {
            return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
        }
    }
};
