"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import {
    ShieldCheck,
    FileText,
    UploadCloud,
    Copy,
    Check,
    Eraser,
    Download,
    Sparkles,
    AlertTriangle,
    SlidersHorizontal,
    FileCode,
    CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LocalTrustNote } from "@/components/tools/LocalTrustNote";
import { useLanguage } from "@/context/LanguageContext";
import { trackToolEvent } from "@/lib/analytics";

export interface RedactionRule {
    id: string;
    labelEn: string;
    labelCn: string;
    descEn: string;
    descCn: string;
}

export const REDACTION_RULES: RedactionRule[] = [
    {
        id: "bearer",
        labelEn: "Authorization Bearer Token",
        labelCn: "Authorization Bearer 令牌",
        descEn: "Replaces Bearer tokens with 'Bearer ***' in headers and log text",
        descCn: "将请求头与日志中的 Bearer token 替换为 'Bearer ***'",
    },
    {
        id: "cookie",
        labelEn: "Cookie / Set-Cookie",
        labelCn: "Cookie / Set-Cookie",
        descEn: "Preserves cookie keys and masks all values as '***'",
        descCn: "保留 Cookie 名称，所有值替换为 '***'",
    },
    {
        id: "phone",
        labelEn: "Chinese Mobile Phone (11 digits)",
        labelCn: "中国手机号（11 位）",
        descEn: "Preserves first 3 and last 4 digits (e.g. 138****5678), strict boundary checks",
        descCn: "保留前 3 后 4，中间打码为 ****（严格数字边界避免误伤长数字与时间戳）",
    },
    {
        id: "idCard",
        labelEn: "Chinese Resident ID (18 digits)",
        labelCn: "中国身份证号（18 位）",
        descEn: "Preserves first 6 and last 4 digits (validates GB 11643 checksum to avoid false positives)",
        descCn: "保留前 6 后 4，中间打码为 ********（通过 GB 11643 加权校验防误伤）",
    },
    {
        id: "email",
        labelEn: "Email Address",
        labelCn: "电子邮箱地址",
        descEn: "Masks username and keeps domain (e.g. j***@example.com)",
        descCn: "用户名打码并保留首字符与域名（如 a***@example.com）",
    },
    {
        id: "ip",
        labelEn: "IP Address (IPv4 / IPv6)",
        labelCn: "IP 地址 (IPv4 / IPv6)",
        descEn: "Masks IPv4 to '192.*.*.*' and IPv6 to '2001:db8:*:*:*'",
        descCn: "IPv4 保留首段 (如 192.*.*.*)，IPv6 保留前两段其余打码",
    },
    {
        id: "urlQuery",
        labelEn: "Sensitive URL Query & Keys",
        labelCn: "URL Query 及表单敏感参数",
        descEn: "Masks values for token, secret, password, key, auth, etc.",
        descCn: "匹配 token, secret, password, passwd, key, auth 等敏感参数值并打码为 ***",
    },
];

type RuleStates = Record<string, boolean>;

const DEFAULT_RULE_STATES: RuleStates = {
    bearer: true,
    cookie: true,
    phone: true,
    idCard: true,
    email: true,
    ip: true,
    urlQuery: true,
};

interface SanitizeCounts {
    bearer: number;
    cookie: number;
    phone: number;
    idCard: number;
    email: number;
    ip: number;
    urlQuery: number;
}

const EMPTY_COUNTS: SanitizeCounts = {
    bearer: 0,
    cookie: 0,
    phone: 0,
    idCard: 0,
    email: 0,
    ip: 0,
    urlQuery: 0,
};

/**
 * Validates Chinese Resident ID Card according to GB 11643-1999.
 * Checks birth date reasonableness and 18th check character to avoid false positives.
 */
function isValidChineseIdCard(id: string): boolean {
    if (!/^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/.test(id)) {
        return false;
    }

    const provinceCode = parseInt(id.slice(0, 2), 10);
    const validProvinces = [
        11, 12, 13, 14, 15, 21, 22, 23, 31, 32, 33, 34, 35, 36, 37, 41, 42, 43, 44, 45, 46, 50, 51, 52, 53, 54, 61, 62, 63, 64, 65, 71, 81, 82, 91,
    ];
    if (!validProvinces.includes(provinceCode)) return false;

    const year = parseInt(id.slice(6, 10), 10);
    const month = parseInt(id.slice(10, 12), 10);
    const day = parseInt(id.slice(12, 14), 10);
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
        return false;
    }

    const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    const checkCodes = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"];
    let sum = 0;
    for (let i = 0; i < 17; i++) {
        sum += parseInt(id[i], 10) * weights[i];
    }
    const expected = checkCodes[sum % 11];
    return id[17].toUpperCase() === expected;
}

function sanitizeCookieHeader(raw: string): string {
    return raw
        .split(";")
        .map((part) => {
            const trimmed = part.trim();
            if (!trimmed) return part;
            const eqIdx = trimmed.indexOf("=");
            if (eqIdx === -1) return part;
            const name = trimmed.slice(0, eqIdx);
            const leadingSpaces = part.match(/^\s*/)?.[0] || "";
            return `${leadingSpaces}${name}=***`;
        })
        .join(";");
}

function sanitizeSetCookieHeader(raw: string): string {
    const eqIdx = raw.indexOf("=");
    if (eqIdx === -1) return raw;
    const name = raw.slice(0, eqIdx);
    const after = raw.slice(eqIdx + 1);
    const semiIdx = after.indexOf(";");
    if (semiIdx === -1) {
        return `${name}=***`;
    }
    const attributes = after.slice(semiIdx);
    return `${name}=***${attributes}`;
}

const SENSITIVE_QUERY_KEY_REGEX = /^(token|key|secret|password|passwd|pwd|auth|access_token|api_key)$/i;

interface HarParsed {
    log?: {
        entries?: Array<{
            request?: {
                method?: string;
                url?: string;
                headers?: Array<{ name: string; value: string }>;
                queryString?: Array<{ name: string; value: string }>;
                cookies?: Array<{ name: string; value: string }>;
                postData?: {
                    mimeType?: string;
                    text?: string;
                    params?: Array<{ name: string; value?: string }>;
                };
            };
            response?: {
                status?: number;
                headers?: Array<{ name: string; value: string }>;
                cookies?: Array<{ name: string; value: string }>;
                content?: {
                    mimeType?: string;
                    text?: string;
                };
            };
        }>;
    };
}

function isHarObject(val: unknown): val is HarParsed {
    if (typeof val !== "object" || val === null) return false;
    const candidate = val as HarParsed;
    return (
        typeof candidate.log === "object" &&
        candidate.log !== null &&
        Array.isArray(candidate.log.entries)
    );
}

function sanitizeTextContent(
    text: string,
    rules: RuleStates,
    initialCounts: SanitizeCounts
): { text: string; counts: SanitizeCounts } {
    let result = text;
    const counts = { ...initialCounts };

    // 1. Bearer Token
    if (rules.bearer) {
        const bearerRegex = /(Bearer\s+)[^\s"'>\],;]+/gi;
        result = result.replace(bearerRegex, (_match, prefix) => {
            counts.bearer++;
            return `${prefix}***`;
        });
    }

    // 2. Cookie / Set-Cookie
    if (rules.cookie) {
        result = result.replace(/(Cookie:\s*)([^\r\n]+)/gi, (_m, prefix, val) => {
            counts.cookie++;
            return `${prefix}${sanitizeCookieHeader(val)}`;
        });
        result = result.replace(/(Set-Cookie:\s*)([^\r\n]+)/gi, (_m, prefix, val) => {
            counts.cookie++;
            return `${prefix}${sanitizeSetCookieHeader(val)}`;
        });
        result = result.replace(
            /(["'](?:Cookie|cookie|Set-Cookie|set-cookie)["']\s*:\s*["'])([^"']+)(["'])/g,
            (_m, prefix, val, suffix) => {
                counts.cookie++;
                const sanitized = prefix.toLowerCase().includes("set-cookie")
                    ? sanitizeSetCookieHeader(val)
                    : sanitizeCookieHeader(val);
                return `${prefix}${sanitized}${suffix}`;
            }
        );
    }

    // 3. Chinese Mobile Phone (11 digits)
    if (rules.phone) {
        const phoneRegex = /(?<!\d)(1[3-9]\d)\d{4}(\d{4})(?!\d)/g;
        result = result.replace(phoneRegex, (_m, p1, p2) => {
            counts.phone++;
            return `${p1}****${p2}`;
        });
    }

    // 4. Chinese Resident ID (18 digits, validated with GB 11643)
    if (rules.idCard) {
        const idCardRegex = /(?<![0-9a-zA-Z])([1-9]\d{5}\d{8}\d{3}[0-9Xx])(?![0-9a-zA-Z])/g;
        result = result.replace(idCardRegex, (match) => {
            if (isValidChineseIdCard(match)) {
                counts.idCard++;
                return `${match.slice(0, 6)}********${match.slice(14)}`;
            }
            return match;
        });
    }

    // 5. Email
    if (rules.email) {
        const emailRegex = /(?<![a-zA-Z0-9._%+-])([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(?![a-zA-Z0-9.-])/g;
        result = result.replace(emailRegex, (_m, user, domain) => {
            counts.email++;
            if (user.length <= 1) {
                return `***@${domain}`;
            }
            return `${user[0]}***@${domain}`;
        });
    }

    // 6. IP Address (IPv4 & IPv6)
    if (rules.ip) {
        const ipv4Regex = /(?<![\w.-])((?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d))(?![.\w-])/g;
        result = result.replace(ipv4Regex, (match) => {
            counts.ip++;
            const firstOctet = match.split(".")[0];
            return `${firstOctet}.*.*.*`;
        });

        const ipv6Regex = /(?<![\w:])([0-9a-fA-F]{1,4}:[0-9a-fA-F]{1,4}):(?:[0-9a-fA-F]{1,4}:*)+(?![\w:])/g;
        result = result.replace(ipv6Regex, (_m, prefix) => {
            counts.ip++;
            return `${prefix}:*:*:*`;
        });
    }

    // 7. Sensitive URL Query & Key Parameters
    if (rules.urlQuery) {
        const urlParamRegex = /(?<=[?&](?:token|key|secret|password|passwd|pwd|auth|access_token|api_key)=)[^&\s"'`<>]+/gi;
        result = result.replace(urlParamRegex, () => {
            counts.urlQuery++;
            return "***";
        });

        const jsonParamRegex = /(["'](?:token|key|secret|password|passwd|pwd|auth|access_token|api_key)["']\s*:\s*["'])[^"']+(["'])/gi;
        result = result.replace(jsonParamRegex, (_m, p1, p2) => {
            counts.urlQuery++;
            return `${p1}***${p2}`;
        });

        const formParamRegex = /(?<=(?:^|[\s,;{}])(?:token|key|secret|password|passwd|pwd|auth|access_token|api_key)\s*[:=]\s*["']?)[^"'\s,;{}&]+/gi;
        result = result.replace(formParamRegex, () => {
            counts.urlQuery++;
            return "***";
        });
    }

    return { text: result, counts };
}

function processHar(
    rawText: string,
    rules: RuleStates
): { text: string; counts: SanitizeCounts; entryCount: number; isHar: boolean } {
    try {
        const parsed = JSON.parse(rawText) as unknown;
        if (!isHarObject(parsed) || !parsed.log?.entries) {
            const fallback = sanitizeTextContent(rawText, rules, EMPTY_COUNTS);
            return { text: fallback.text, counts: fallback.counts, entryCount: 0, isHar: false };
        }

        const entries = parsed.log.entries;
        const counts: SanitizeCounts = { ...EMPTY_COUNTS };

        for (const entry of entries) {
            // Request URL query
            if (entry.request?.url && rules.urlQuery) {
                const urlMatchRegex = /([?&])(token|key|secret|password|passwd|pwd|auth|access_token|api_key)=([^&#\s]*)/gi;
                entry.request.url = entry.request.url.replace(urlMatchRegex, (_m, prefix, key) => {
                    counts.urlQuery++;
                    return `${prefix}${key}=***`;
                });
            }

            // Request Headers
            if (Array.isArray(entry.request?.headers)) {
                for (const h of entry.request.headers) {
                    const lower = h.name.toLowerCase();
                    if (lower === "authorization" && rules.bearer) {
                        if (/Bearer\s+\S+/i.test(h.value)) {
                            h.value = h.value.replace(/Bearer\s+\S+/i, "Bearer ***");
                            counts.bearer++;
                        }
                    } else if (lower === "cookie" && rules.cookie) {
                        h.value = sanitizeCookieHeader(h.value);
                        counts.cookie++;
                    } else if (SENSITIVE_QUERY_KEY_REGEX.test(lower) && rules.urlQuery) {
                        h.value = "***";
                        counts.urlQuery++;
                    }
                }
            }

            // Request QueryString
            if (Array.isArray(entry.request?.queryString) && rules.urlQuery) {
                for (const q of entry.request.queryString) {
                    if (SENSITIVE_QUERY_KEY_REGEX.test(q.name)) {
                        q.value = "***";
                        counts.urlQuery++;
                    }
                }
            }

            // Request Cookies
            if (Array.isArray(entry.request?.cookies) && rules.cookie) {
                for (const c of entry.request.cookies) {
                    c.value = "***";
                    counts.cookie++;
                }
            }

            // Request PostData
            if (entry.request?.postData) {
                if (Array.isArray(entry.request.postData.params) && rules.urlQuery) {
                    for (const p of entry.request.postData.params) {
                        if (SENSITIVE_QUERY_KEY_REGEX.test(p.name)) {
                            p.value = "***";
                            counts.urlQuery++;
                        }
                    }
                }
            }

            // Response Headers
            if (Array.isArray(entry.response?.headers)) {
                for (const h of entry.response.headers) {
                    const lower = h.name.toLowerCase();
                    if (lower === "set-cookie" && rules.cookie) {
                        h.value = sanitizeSetCookieHeader(h.value);
                        counts.cookie++;
                    } else if (SENSITIVE_QUERY_KEY_REGEX.test(lower) && rules.urlQuery) {
                        h.value = "***";
                        counts.urlQuery++;
                    }
                }
            }

            // Response Cookies
            if (Array.isArray(entry.response?.cookies) && rules.cookie) {
                for (const c of entry.response.cookies) {
                    c.value = "***";
                    counts.cookie++;
                }
            }
        }

        // Serialize structured HAR back to string
        const serialized = JSON.stringify(parsed, null, 2);

        // Run deep general text redaction for postData.text, content.text, and any body strings
        const pass2 = sanitizeTextContent(serialized, rules, counts);

        return {
            text: pass2.text,
            counts: pass2.counts,
            entryCount: entries.length,
            isHar: true,
        };
    } catch {
        // Not JSON, treat as raw text
        const fallback = sanitizeTextContent(rawText, rules, EMPTY_COUNTS);
        return { text: fallback.text, counts: fallback.counts, entryCount: 0, isHar: false };
    }
}

const SAMPLE_LOG = `[2026-10-16 10:24:18.420] INFO [http-client] Sending request:
GET /v2/account/profile?userId=10293&token=ghp_39d8f921abcf90124fe&api_key=sk_live_998811 HTTP/1.1
Host: api.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
Cookie: session_id=s%3A8492048f02ba; uid=10293; locale=zh-CN; remember_token=sec_abc12345
X-Forwarded-For: 203.0.113.195, 10.0.0.1
Client-IPv6: 2001:0db8:85a3:0000:0000:8a2e:0370:7334

[2026-10-16 10:24:18.685] HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Set-Cookie: auth_session=sess_9876543210; Path=/; Domain=.example.com; Secure; HttpOnly
Set-Cookie: user_pref=night_mode; Path=/

{
  "code": 0,
  "message": "success",
  "data": {
    "user_id": 10293,
    "username": "developer_alex",
    "email": "alex.morgan@company.com",
    "short_email": "x@service.org",
    "phone": "13800138000",
    "id_card": "11010119900307239X",
    "server_node": "192.168.1.100",
    "backup_ip": "172.16.254.1",
    "access_token": "oauth2_token_sample_secret_998877",
    "created_at": 1712345678901
  }
}`;

export function LogSanitizerTool() {
    const { t } = useLanguage();
    const [rawInput, setRawInput] = useState("");
    const [fileName, setFileName] = useState<string | null>(null);
    const [rules, setRules] = useState<RuleStates>(DEFAULT_RULE_STATES);
    const [copied, setCopied] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const hasTrackedView = useRef(false);
    useEffect(() => {
        if (!hasTrackedView.current) {
            hasTrackedView.current = true;
            trackToolEvent("tool_view", { tool: "log-sanitizer" });
        }
    }, []);

    const prevInputRef = useRef("");
    useEffect(() => {
        if (!rawInput.trim() || rawInput === prevInputRef.current) return;
        const timer = setTimeout(() => {
            prevInputRef.current = rawInput;
            trackToolEvent("process_started", { tool: "log-sanitizer" });
            try {
                processHar(rawInput, rules);
                trackToolEvent("process_success", { tool: "log-sanitizer" });
            } catch {
                trackToolEvent("process_error", { tool: "log-sanitizer", errorCode: "sanitize_failed" });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [rawInput, rules]);

    const isLargeFile = useMemo(() => rawInput.length > 2 * 1024 * 1024, [rawInput]);

    const sanitizedData = useMemo(() => {
        if (!rawInput.trim()) {
            return {
                text: "",
                counts: EMPTY_COUNTS,
                entryCount: 0,
                isHar: false,
            };
        }
        return processHar(rawInput, rules);
    }, [rawInput, rules]);

    const totalRedacted = useMemo(() => {
        return Object.values(sanitizedData.counts).reduce((acc, curr) => acc + curr, 0);
    }, [sanitizedData.counts]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        trackToolEvent("file_selected", { tool: "log-sanitizer", detail: "count:1" });
        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result;
            if (typeof content === "string") {
                setRawInput(content);
            }
        };
        reader.readAsText(file);
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (!file) return;
        trackToolEvent("file_selected", { tool: "log-sanitizer", detail: "count:1" });
        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result;
            if (typeof content === "string") {
                setRawInput(content);
            }
        };
        reader.readAsText(file);
    }, []);

    const toggleRule = (ruleId: string) => {
        setRules((prev) => ({
            ...prev,
            [ruleId]: !prev[ruleId],
        }));
    };

    const copyResult = async () => {
        if (!sanitizedData.text) return;
        try {
            await navigator.clipboard.writeText(sanitizedData.text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            /* clipboard unavailable */
        }
    };

    const downloadResult = () => {
        if (!sanitizedData.text) return;
        trackToolEvent("download_clicked", { tool: "log-sanitizer", detail: sanitizedData.isHar ? "format:har" : "format:txt" });
        const isHar = sanitizedData.isHar;
        let exportName = "sanitized-log.txt";
        let mime = "text/plain;charset=utf-8";

        if (fileName) {
            const dotIdx = fileName.lastIndexOf(".");
            if (dotIdx !== -1) {
                const base = fileName.slice(0, dotIdx);
                const ext = fileName.slice(dotIdx);
                exportName = `${base}-sanitized${ext}`;
            } else {
                exportName = `${fileName}-sanitized.txt`;
            }
        } else if (isHar) {
            exportName = "sanitized.har";
            mime = "application/json;charset=utf-8";
        }

        const blob = new Blob([sanitizedData.text], { type: mime });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = exportName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const clearAll = () => {
        setRawInput("");
        setFileName(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const loadSample = () => {
        setRawInput(SAMPLE_LOG);
        setFileName("sample-access.log");
    };

    // Highlight redacted strings (e.g. *** or ****)
    const renderedHighlighted = useMemo(() => {
        if (!sanitizedData.text) return null;
        // For performance on huge logs (> 300KB), render raw text directly to avoid DOM explosion
        if (sanitizedData.text.length > 300000) {
            return sanitizedData.text;
        }

        const parts = sanitizedData.text.split(/(\*{3,})/g);
        return parts.map((part, index) => {
            if (part.startsWith("***")) {
                return (
                    <mark
                        key={index}
                        className="bg-amber-400/20 text-amber-300 font-bold px-1 py-0.5 rounded border border-amber-400/30"
                    >
                        {part}
                    </mark>
                );
            }
            return part;
        });
    }, [sanitizedData.text]);

    return (
        <div className="w-full flex flex-col gap-6">
            {/* Privacy banner */}
            <div className="rounded-2xl border border-emerald-900/60 bg-emerald-950/30 p-4 sm:p-5 flex gap-3 items-start">
                <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-sm space-y-1">
                    <p className="text-emerald-300 font-semibold">
                        {t(
                            "100% Client-Side Redaction — 0 bytes uploaded to any server.",
                            "100% 浏览器本地脱敏——0 字节上传到任何服务器。"
                        )}
                    </p>
                    <p className="text-zinc-400">
                        {t(
                            "Redaction runs entirely inside your browser memory. Your sensitive files and logs never touch our backend, making it completely safe to prepare HAR archives before posting to GitHub issues or support tickets.",
                            "所有脱敏逻辑 100% 在你的浏览器本地完成。原始日志与 HAR 绝不会发送到任何服务器，脱敏后的内容可放心贴入 GitHub issue、工单或社区求助。"
                        )}
                    </p>
                </div>
            </div>

            {/* Input card */}
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 sm:p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <label htmlFor="log-input" className="flex items-center gap-2 text-white font-semibold text-sm">
                        <FileText className="w-4 h-4 text-emerald-400" />
                        {t("Paste Raw Log or HAR Text", "粘贴原始日志或 HAR 文本")}
                    </label>

                    <div className="flex items-center gap-2">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".har,.json,.log,.txt"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="file-upload"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-medium transition-colors flex items-center gap-1.5"
                        >
                            <UploadCloud className="w-3.5 h-3.5 text-emerald-400" />
                            {fileName ? fileName : t("Upload .har / .log", "上传 .har / .log 文件")}
                        </button>
                    </div>
                </div>

                {/* Dropzone container */}
                <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    className="relative group rounded-xl border border-dashed border-zinc-800 hover:border-emerald-500/50 transition-colors"
                >
                    <textarea
                        id="log-input"
                        value={rawInput}
                        onChange={(e) => {
                            setRawInput(e.target.value);
                            setFileName(null);
                        }}
                        placeholder={t(
                            "Paste HAR content, curl output, HTTP headers, or server logs here... Or drag & drop a .har / .json / .log file.",
                            "在此粘贴 HAR 内容、curl 报文、HTTP headers 或服务日志... 也支持直接拖拽 .har / .json / .log 文件。"
                        )}
                        spellCheck={false}
                        rows={7}
                        className="w-full rounded-xl bg-black/50 border-0 focus:ring-1 focus:ring-emerald-500/60 outline-none p-3.5 font-mono text-xs sm:text-sm text-zinc-200 placeholder:text-zinc-600 resize-y"
                    />
                </div>

                {/* File size warning */}
                {isLargeFile && (
                    <div className="rounded-xl border border-amber-900/60 bg-amber-950/30 p-3 flex gap-2.5 items-start">
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-300">
                            {t(
                                "Large file detected (>2MB). Processing runs completely in browser memory and may take a few moments.",
                                "检测到大文件（>2MB）。脱敏完全在浏览器本地内存运行，处理可能需要几秒钟。"
                            )}
                        </p>
                    </div>
                )}

                {/* Action buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={loadSample}
                            className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5"
                        >
                            <Sparkles className="w-4 h-4 text-emerald-400" />
                            {t("Try Sample Log", "试用示例日志")}
                        </button>
                        {rawInput && (
                            <button
                                type="button"
                                onClick={clearAll}
                                className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5"
                            >
                                <Eraser className="w-4 h-4" />
                                {t("Clear", "清空")}
                            </button>
                        )}
                    </div>

                    {sanitizedData.isHar && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-sky-500/30 bg-sky-500/10 text-sky-300">
                            <FileCode className="w-3.5 h-3.5" />
                            <span>
                                {t("HAR Archive Mode", "HAR 结构模式")}: {sanitizedData.entryCount} {t("entries processed", "条请求已处理")}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <LocalTrustNote />

            {/* Redaction Rules Configuration */}
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3 border-b border-zinc-800/80 pb-3">
                    <div className="flex items-center gap-2">
                        <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
                        <h2 className="text-white font-semibold text-sm">
                            {t("Redaction Rules (Instant Toggle)", "脱敏规则（实时生效）")}
                        </h2>
                    </div>
                    <span className="text-xs text-zinc-500">
                        {t("All enabled by default", "默认全部开启")}
                    </span>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                    {REDACTION_RULES.map((rule) => {
                        const checked = !!rules[rule.id];
                        const hitCount = sanitizedData.counts[rule.id as keyof SanitizeCounts] || 0;
                        return (
                            <label
                                key={rule.id}
                                className={cn(
                                    "flex items-start gap-3 p-2.5 rounded-xl border transition-colors cursor-pointer select-none",
                                    checked
                                        ? "border-zinc-800 bg-black/30 hover:border-zinc-700"
                                        : "border-zinc-800/40 bg-black/10 opacity-60 hover:opacity-100"
                                )}
                            >
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => toggleRule(rule.id)}
                                    className="mt-1 rounded border-zinc-700 text-emerald-500 focus:ring-emerald-500/20 bg-zinc-800 accent-emerald-500 cursor-pointer"
                                />
                                <div className="text-xs space-y-0.5 flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-1">
                                        <p className="text-zinc-200 font-medium truncate">
                                            {t(rule.labelEn, rule.labelCn)}
                                        </p>
                                        {hitCount > 0 && (
                                            <span className="shrink-0 text-[10px] px-1.5 py-0.2 rounded-full font-mono font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                                                +{hitCount}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-zinc-500 line-clamp-1">
                                        {t(rule.descEn, rule.descCn)}
                                    </p>
                                </div>
                            </label>
                        );
                    })}
                </div>
            </div>

            {/* Redaction Output */}
            {sanitizedData.text ? (
                <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden flex flex-col">
                    {/* Header stats & actions */}
                    <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between flex-wrap gap-3 bg-zinc-900/80">
                        <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="text-white font-semibold text-sm flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                {t("Sanitized Output", "脱敏结果")}
                            </span>
                            <span
                                className={cn(
                                    "text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold border",
                                    totalRedacted > 0
                                        ? "bg-amber-400/10 text-amber-300 border-amber-400/30"
                                        : "bg-zinc-800 text-zinc-400 border-zinc-700"
                                )}
                            >
                                {totalRedacted} {t("items redacted", "处已脱敏")}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={copyResult}
                                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors flex items-center gap-1.5"
                            >
                                {copied ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                )}
                                {copied ? t("Copied", "已复制") : t("Copy Output", "复制结果")}
                            </button>

                            <button
                                type="button"
                                onClick={downloadResult}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm"
                            >
                                <Download className="w-3.5 h-3.5" />
                                {t("Download Sanitized", "下载脱敏文件")}
                            </button>
                        </div>
                    </div>

                    {/* Output display */}
                    <div className="p-4 bg-black/40">
                        <pre className="font-mono text-xs sm:text-sm text-zinc-300 whitespace-pre-wrap break-all overflow-x-auto max-h-[550px] leading-relaxed">
                            {renderedHighlighted}
                        </pre>
                    </div>

                    {/* Footer note on highlight */}
                    <div className="px-4 py-2 border-t border-zinc-800/60 bg-zinc-900/50 flex items-center justify-between text-[11px] text-zinc-500">
                        <span>
                            {t(
                                "Tip: Asterisks (***) indicate values sanitized according to active rules.",
                                "提示：高亮的星号 (***) 表示已根据勾选规则脱敏的信息。"
                            )}
                        </span>
                        {sanitizedData.text.length > 300000 && (
                            <span className="text-amber-500">
                                {t("Rendered without HTML markup for high performance", "大文本已使用纯文本渲染以确保流畅")}
                            </span>
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    );
}
