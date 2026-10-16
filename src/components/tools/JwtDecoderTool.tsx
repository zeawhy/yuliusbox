"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
    ShieldCheck, KeyRound, AlertTriangle, Copy, Check, Eraser,
    Clock3, Fingerprint, FileJson, ChevronDown, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LocalTrustNote } from "@/components/tools/LocalTrustNote";
import { useLanguage } from "@/context/LanguageContext";
import { trackToolEvent } from "@/lib/analytics";

interface DecodedPart {
    raw: string;
    json: Record<string, unknown> | null;
    pretty: string;
}

interface DecodeResult {
    header: DecodedPart;
    payload: DecodedPart;
    signature: string;
    error: string | null;
}

function base64UrlDecode(segment: string): string {
    const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    const binary = atob(padded);
    // Decode UTF-8 correctly (claims can contain non-ASCII text)
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
}

function decodeSegment(segment: string): DecodedPart {
    const raw = segment.trim();
    try {
        const text = base64UrlDecode(raw);
        const json = JSON.parse(text) as Record<string, unknown>;
        return { raw, json, pretty: JSON.stringify(json, null, 2) };
    } catch {
        return { raw, json: null, pretty: "" };
    }
}

function decodeJwt(token: string): DecodeResult {
    const cleaned = token.trim();
    const parts = cleaned.split(".");
    if (parts.length !== 3 || parts.some((p) => p.length === 0)) {
        return {
            header: { raw: "", json: null, pretty: "" },
            payload: { raw: "", json: null, pretty: "" },
            signature: "",
            error: "not-three-parts",
        };
    }
    const header = decodeSegment(parts[0]);
    const payload = decodeSegment(parts[1]);
    if (!header.json || !payload.json) {
        return {
            header,
            payload,
            signature: parts[2],
            error: "invalid-json",
        };
    }
    return { header, payload, signature: parts[2], error: null };
}

/** Human-readable relative time, e.g. "in 3 hours" / "2 days ago". */
function relativeTime(tsSeconds: number, nowSeconds: number): string {
    const diff = tsSeconds - nowSeconds;
    const abs = Math.abs(diff);
    const units: Array<[number, string]> = [
        [31536000, "year"],
        [2592000, "month"],
        [86400, "day"],
        [3600, "hour"],
        [60, "minute"],
    ];
    for (const [secs, name] of units) {
        if (abs >= secs) {
            const n = Math.floor(abs / secs);
            const label = n === 1 ? name : `${name}s`;
            return diff >= 0 ? `in ${n} ${label}` : `${n} ${label} ago`;
        }
    }
    return diff >= 0 ? "in a few seconds" : "just now";
}

const CLAIM_DESCRIPTIONS: Record<string, string> = {
    iss: "Issuer — who created and signed this token.",
    sub: "Subject — who the token is about (usually a user ID).",
    aud: "Audience — who the token is intended for (your app/service).",
    exp: "Expiration time — the token must be rejected after this moment.",
    iat: "Issued at — when the token was created.",
    nbf: "Not before — the token must be rejected before this moment.",
    jti: "JWT ID — a unique identifier for this token (useful for revocation).",
    alg: "Signing algorithm used for the signature.",
    typ: "Token type — almost always “JWT”.",
};

const TIMESTAMP_CLAIMS = new Set(["exp", "iat", "nbf"]);

const SAMPLE_TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
    "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE3OTk5OTk5OTksImF1ZCI6Inl1bGl1c2JveC1kZW1vIn0." +
    "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

function JsonBlock({ title, icon, part }: { title: string; icon: React.ReactNode; part: DecodedPart }) {
    const { t } = useLanguage();
    const [copied, setCopied] = useState(false);
    const copy = async () => {
        try {
            await navigator.clipboard.writeText(part.pretty);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            /* clipboard unavailable */
        }
    };
    return (
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                <p className="flex items-center gap-2 text-white font-semibold text-sm">
                    {icon}
                    {title}
                </p>
                <button
                    onClick={copy}
                    className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-200 transition-colors"
                >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? t("Copied", "已复制") : t("Copy", "复制")}
                </button>
            </div>
            <pre className="p-4 text-xs sm:text-sm text-emerald-300/90 overflow-x-auto font-mono whitespace-pre-wrap break-words">
                {part.pretty}
            </pre>
        </div>
    );
}

function TimestampRow({ claim, value, now }: { claim: string; value: unknown; now: number }) {
    const { t } = useLanguage();
    if (typeof value !== "number" || !Number.isFinite(value)) {
        return (
            <p className="text-sm text-zinc-500">
                <span className="font-mono text-zinc-400">{claim}:</span> {String(value)}{" "}
                <span className="text-amber-400/80">({t("not a valid Unix timestamp", "不是有效的 Unix 时间戳")})</span>
            </p>
        );
    }
    const date = new Date(value * 1000);
    const isPast = value < now;
    const tone =
        claim === "exp" && isPast
            ? "text-red-400"
            : claim === "nbf" && !isPast
              ? "text-amber-400"
              : "text-emerald-400";
    return (
        <p className="text-sm text-zinc-400">
            <span className="font-mono text-zinc-200 font-medium">{claim}:</span>{" "}
            <span className="text-zinc-300">{date.toLocaleString()}</span>{" "}
            <span className={cn("font-medium", tone)}>· {relativeTime(value, now)}</span>
            {claim === "exp" && isPast && (
                <span className="ml-2 inline-flex items-center gap-1 text-red-400 font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5" />{t("EXPIRED", "已过期")}
                </span>
            )}
        </p>
    );
}

export function JwtDecoderTool() {
    const { t } = useLanguage();
    const [input, setInput] = useState("");
    const [showClaims, setShowClaims] = useState(false);

    const hasTrackedView = useRef(false);
    useEffect(() => {
        if (!hasTrackedView.current) {
            hasTrackedView.current = true;
            trackToolEvent("tool_view", { tool: "jwt-decoder" });
        }
    }, []);

    const prevInputRef = useRef("");
    useEffect(() => {
        if (!input.trim() || input === prevInputRef.current) return;
        const timer = setTimeout(() => {
            prevInputRef.current = input;
            trackToolEvent("process_started", { tool: "jwt-decoder" });
            const res = decodeJwt(input);
            if (res.error) {
                trackToolEvent("process_error", {
                    tool: "jwt-decoder",
                    errorCode: res.error.replace(/-/g, "_"),
                });
            } else {
                trackToolEvent("process_success", { tool: "jwt-decoder" });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [input]);

    const result = useMemo(() => (input.trim() ? decodeJwt(input) : null), [input]);
    const now = useMemo(() => Math.floor(Date.now() / 1000), [result]);

    const payloadEntries = result?.payload.json ? Object.entries(result.payload.json) : [];
    const timestampEntries = payloadEntries.filter(([k]) => TIMESTAMP_CLAIMS.has(k));
    const otherEntries = payloadEntries.filter(([k]) => !TIMESTAMP_CLAIMS.has(k));

    const clear = () => setInput("");

    return (
        <div className="w-full flex flex-col gap-6">
            {/* Privacy banner */}
            <div className="rounded-2xl border border-emerald-900/60 bg-emerald-950/30 p-4 sm:p-5 flex gap-3 items-start">
                <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-sm space-y-1">
                    <p className="text-emerald-300 font-semibold">
                        {t("Your token never leaves this browser.", "Token 只在你的浏览器里解析。")}
                    </p>
                    <p className="text-zinc-400">
                        {t(
                            "Decoding happens 100% locally — 0 bytes uploaded to any server. Never paste a production token into a website you don't trust.",
                            "解析 100% 在本地完成——0 字节上传到任何服务器。永远别把生产环境的 token 粘贴进你不信任的网站。"
                        )}
                    </p>
                </div>
            </div>

            {/* Input */}
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 sm:p-5">
                <label htmlFor="jwt-input" className="flex items-center gap-2 text-white font-semibold text-sm mb-3">
                    <KeyRound className="w-4 h-4 text-emerald-400" />
                    {t("Paste your JWT", "粘贴你的 JWT")}
                </label>
                <textarea
                    id="jwt-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwi…"
                    spellCheck={false}
                    rows={4}
                    className="w-full rounded-xl bg-black/50 border border-zinc-800 focus:border-emerald-500/60 outline-none p-3 font-mono text-xs sm:text-sm text-zinc-200 placeholder:text-zinc-600 break-all resize-y"
                />
                <div className="mt-3 flex flex-wrap gap-2">
                    <button
                        onClick={() => setInput(SAMPLE_TOKEN)}
                        className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium transition-colors flex items-center gap-1.5"
                    >
                        <Sparkles className="w-4 h-4" />
                        {t("Try a sample token", "试试示例 token")}
                    </button>
                    {input && (
                        <button
                            onClick={clear}
                            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium transition-colors flex items-center gap-1.5"
                        >
                            <Eraser className="w-4 h-4" />
                            {t("Clear", "清空")}
                        </button>
                    )}
                </div>
            </div>

            <LocalTrustNote />

            {/* Error state */}
            {result?.error === "not-three-parts" && (
                <div className="rounded-2xl border border-red-900/60 bg-red-950/30 p-4 flex gap-3 items-start">
                    <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-300">
                        {t(
                            "That doesn't look like a JWT. A valid token has exactly three base64url parts separated by dots: header.payload.signature.",
                            "这不像一个 JWT。合法的 token 恰好由三段 base64url 组成，以点分隔：header.payload.signature。"
                        )}
                    </p>
                </div>
            )}
            {result?.error === "invalid-json" && (
                <div className="rounded-2xl border border-amber-900/60 bg-amber-950/30 p-4 flex gap-3 items-start">
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-300">
                        {t(
                            "The token has three parts, but the header or payload isn't valid JSON. It may be truncated, or use a non-JWT encoding (e.g. an opaque session token).",
                            "这个 token 有三段，但 header 或 payload 不是合法 JSON。它可能被截断了，或者根本不是 JWT（比如不透明的 session token）。"
                        )}
                    </p>
                </div>
            )}

            {/* Decoded output */}
            {result && !result.error && (
                <div className="flex flex-col gap-6">
                    {/* Header + Payload */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <JsonBlock
                            title={t("Header", "头部")}
                            icon={<FileJson className="w-4 h-4 text-sky-400" />}
                            part={result.header}
                        />
                        <JsonBlock
                            title={t("Payload (claims)", "载荷（声明）")}
                            icon={<Fingerprint className="w-4 h-4 text-violet-400" />}
                            part={result.payload}
                        />
                    </div>

                    {/* Timestamps */}
                    {timestampEntries.length > 0 && (
                        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 sm:p-5">
                            <p className="flex items-center gap-2 text-white font-semibold text-sm mb-3">
                                <Clock3 className="w-4 h-4 text-amber-400" />
                                {t("Time claims — in your local timezone", "时间声明——已转为你本地时区")}
                            </p>
                            <div className="space-y-2">
                                {timestampEntries.map(([k, v]) => (
                                    <TimestampRow key={k} claim={k} value={v} now={now} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Other claims with descriptions */}
                    {otherEntries.length > 0 && (
                        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 sm:p-5">
                            <p className="text-white font-semibold text-sm mb-3">
                                {t("What the claims mean", "这些声明的含义")}
                            </p>
                            <dl className="space-y-2.5">
                                {otherEntries.map(([k, v]) => (
                                    <div key={k} className="text-sm">
                                        <dt className="font-mono text-zinc-200">
                                            {k}
                                            <span className="text-zinc-500 font-sans">: </span>
                                            <span className="text-zinc-400 break-words">
                                                {typeof v === "object" ? JSON.stringify(v) : String(v)}
                                            </span>
                                        </dt>
                                        {CLAIM_DESCRIPTIONS[k] && (
                                            <dd className="text-zinc-500 text-xs mt-0.5 ml-1">
                                                {t(CLAIM_DESCRIPTIONS[k], CLAIM_DESCRIPTIONS[k])}
                                            </dd>
                                        )}
                                    </div>
                                ))}
                            </dl>
                        </div>
                    )}

                    {/* Signature */}
                    <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 sm:p-5">
                        <p className="flex items-center gap-2 text-white font-semibold text-sm mb-2">
                            <ShieldCheck className="w-4 h-4 text-zinc-500" />
                            {t("Signature (format only)", "签名（仅格式展示）")}
                        </p>
                        <p className="font-mono text-xs text-zinc-500 break-all bg-black/40 rounded-lg p-3 border border-zinc-800">
                            {result.signature}
                        </p>
                        <p className="text-xs text-zinc-500 mt-3 flex gap-1.5 items-start">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500" />
                            <span>
                                {t(
                                    "This page only displays the signature — it cannot verify it. Real signature verification requires the signer's secret key (HMAC) or public key (RSA/ECDSA), which you should never paste into a website. A decodable token is not a valid token.",
                                    "本页面只展示签名格式，无法验签。真正的验签需要签名方的密钥（HMAC 的 secret 或 RSA/ECDSA 的公钥），而密钥绝不应该粘进任何网站。能解码 ≠ 签名有效。"
                                )}
                            </span>
                        </p>
                    </div>
                </div>
            )}

            {/* Claim reference */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 sm:p-5">
                <button
                    onClick={() => setShowClaims(!showClaims)}
                    className="w-full flex items-center justify-between text-left"
                >
                    <span className="text-white font-semibold text-sm">
                        {t("JWT cheat sheet: parts & registered claims", "JWT 速查：三段结构与标准声明")}
                    </span>
                    <ChevronDown className={cn("w-4 h-4 text-zinc-500 transition-transform", showClaims && "rotate-180")} />
                </button>
                {showClaims && (
                    <div className="mt-4 text-sm text-zinc-400 space-y-3">
                        <p>
                            {t(
                                "A JWT is three base64url-encoded parts joined by dots. The header names the signing algorithm (alg), the payload carries claims (statements about the user/session), and the signature proves the first two parts haven't been tampered with.",
                                "JWT 由三段 base64url 编码以点连接：header 声明签名算法（alg），payload 携带声明（关于用户/会话的断言），signature 证明前两段未被篡改。"
                            )}
                        </p>
                        <dl className="grid gap-2 sm:grid-cols-2">
                            {Object.entries(CLAIM_DESCRIPTIONS).map(([k, desc]) => (
                                <div key={k} className="rounded-lg bg-black/30 border border-zinc-800/60 p-3">
                                    <dt className="font-mono text-zinc-200 text-xs">{k}</dt>
                                    <dd className="text-zinc-500 text-xs mt-1">{t(desc, desc)}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                )}
            </div>
        </div>
    );
}
