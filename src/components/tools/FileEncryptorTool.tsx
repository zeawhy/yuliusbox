"use client";

import { useState, useRef, useId } from "react";
import {
    Lock,
    Unlock,
    File as FileIcon,
    Upload,
    CheckCircle2,
    AlertTriangle,
    AlertCircle,
    Eye,
    EyeOff,
    ShieldCheck,
    Download,
    RotateCcw,
    Loader2,
    X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LocalTrustNote } from "@/components/tools/LocalTrustNote";
import { useLanguage } from "@/context/LanguageContext";

/**
 * File Encryptor binary format (YLBXENC1):
 * [0..7]   : Magic ASCII "YLBXENC1" (8 bytes)
 * [8..23]  : Salt (16 bytes random)
 * [24..35] : AES-GCM IV (12 bytes random)
 * [36..EOF]: AES-256-GCM ciphertext + 16-byte authentication tag
 */
const MAGIC_STRING = "YLBXENC1";
const PBKDF2_ITERATIONS = 210000;
const SALT_LENGTH = 16;
const IV_LENGTH = 12;
const HEADER_LENGTH = 8 + SALT_LENGTH + IV_LENGTH; // 36 bytes
const GCM_TAG_LENGTH = 16;
const LARGE_FILE_THRESHOLD = 1024 * 1024 * 1024; // 1 GB

interface PasswordStrength {
    score: number; // 0..3
    labelEn: string;
    labelCn: string;
    tipEn: string;
    tipCn: string;
    color: string;
    textColor: string;
}

function evaluatePasswordStrength(password: string): PasswordStrength {
    if (!password) {
        return {
            score: 0,
            labelEn: "None",
            labelCn: "未输入",
            tipEn: "Enter a password to protect your file.",
            tipCn: "请输入加密密码以保护文件。",
            color: "bg-zinc-700",
            textColor: "text-zinc-500",
        };
    }

    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasSymbol = /[^a-zA-Z0-9]/.test(password);
    const varietyCount = (hasLower ? 1 : 0) + (hasUpper ? 1 : 0) + (hasDigit ? 1 : 0) + (hasSymbol ? 1 : 0);

    let score = 1;
    let tipEn = "";
    let tipCn = "";

    if (password.length < 8) {
        score = 1;
        tipEn = "Too short. Use at least 8 characters (12+ recommended).";
        tipCn = "密码过短，至少需要 8 个字符（推荐 12 个以上）。";
    } else if (password.length >= 12 && varietyCount >= 3) {
        score = 3;
        tipEn = "Strong password! Make sure to save it safely.";
        tipCn = "强密码！请务必妥善记录或保管好。";
    } else if (password.length >= 16 && varietyCount >= 2) {
        score = 3;
        tipEn = "Long passphrase! Excellent resistance against brute force.";
        tipCn = "长密码！抗暴力破解能力极高。";
    } else if (password.length >= 8 && varietyCount >= 2) {
        score = 2;
        if (!hasSymbol) {
            tipEn = "Add symbols (!@#$...) and reach 12+ chars for strong security.";
            tipCn = "添加特殊符号 (!@#$...) 并扩充至 12 位可升级为强密码。";
        } else if (!hasUpper || !hasLower) {
            tipEn = "Mix uppercase and lowercase letters for greater entropy.";
            tipCn = "混合大小写字母以提高熵值和安全性。";
        } else {
            tipEn = "Use 12 or more characters for maximum protection.";
            tipCn = "增加至 12 位或更多字符可达最高安全等级。";
        }
    } else {
        score = 1;
        tipEn = "Weak password. Mix uppercase, lowercase, numbers, and symbols.";
        tipCn = "密码偏弱，建议混合大小写字母、数字和符号。";
    }

    if (score === 1) {
        return {
            score: 1,
            labelEn: "Weak",
            labelCn: "弱",
            tipEn,
            tipCn,
            color: "bg-red-500",
            textColor: "text-red-400",
        };
    } else if (score === 2) {
        return {
            score: 2,
            labelEn: "Medium",
            labelCn: "中等",
            tipEn,
            tipCn,
            color: "bg-amber-500",
            textColor: "text-amber-400",
        };
    } else {
        return {
            score: 3,
            labelEn: "Strong",
            labelCn: "强",
            tipEn,
            tipCn,
            color: "bg-emerald-500",
            textColor: "text-emerald-400",
        };
    }
}

function formatBytes(bytes: number): string {
    if (bytes <= 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const val = bytes / Math.pow(k, i);
    return `${val < 10 ? val.toFixed(2) : val < 100 ? val.toFixed(1) : val.toFixed(0)} ${sizes[i]}`;
}

function triggerBlobDownload(data: Uint8Array, filename: string) {
    const blob = new Blob([data as unknown as BlobPart], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 15000);
}

interface EncryptSuccessInfo {
    originalFilename: string;
    encryptedFilename: string;
    originalSize: number;
    encryptedSize: number;
    data: Uint8Array;
}

interface DecryptSuccessInfo {
    decryptedFilename: string;
    decryptedSize: number;
    data: Uint8Array;
}

export function FileEncryptorTool() {
    const { t, language } = useLanguage();
    const [activeTab, setActiveTab] = useState<"encrypt" | "decrypt">("encrypt");

    // Encrypt state
    const [encryptFile, setEncryptFile] = useState<File | null>(null);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [encryptError, setEncryptError] = useState<string | null>(null);
    const [encryptSuccess, setEncryptSuccess] = useState<EncryptSuccessInfo | null>(null);

    // Decrypt state
    const [decryptFile, setDecryptFile] = useState<File | null>(null);
    const [decryptPassword, setDecryptPassword] = useState("");
    const [showDecryptPassword, setShowDecryptPassword] = useState(false);
    const [decryptError, setDecryptError] = useState<string | null>(null);
    const [decryptSuccess, setDecryptSuccess] = useState<DecryptSuccessInfo | null>(null);

    // Shared execution state
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");
    const [isDragging, setIsDragging] = useState(false);

    // Refs for file inputs
    const encryptFileInputRef = useRef<HTMLInputElement>(null);
    const decryptFileInputRef = useRef<HTMLInputElement>(null);

    // Unique IDs for inputs
    const encPassId = useId();
    const encConfirmPassId = useId();
    const decPassId = useId();

    const strength = evaluatePasswordStrength(password);

    const handleEncryptFileSelect = (file: File) => {
        setEncryptFile(file);
        setEncryptError(null);
        setEncryptSuccess(null);
    };

    const handleDecryptFileSelect = (file: File) => {
        setDecryptFile(file);
        setDecryptError(null);
        setDecryptSuccess(null);
    };

    const handleEncrypt = async () => {
        if (!encryptFile) {
            setEncryptError(t("Please select a file to encrypt.", "请先选择需要加密的文件。"));
            return;
        }
        if (!password) {
            setEncryptError(t("Please enter an encryption password.", "请输入加密密码。"));
            return;
        }
        if (password !== confirmPassword) {
            setEncryptError(t("Passwords do not match.", "两次输入的密码不一致。"));
            return;
        }

        setIsProcessing(true);
        setEncryptError(null);
        setEncryptSuccess(null);
        setStatusMessage(t("Reading file into memory...", "正在读取文件数据..."));

        try {
            // Give browser thread a moment to update UI
            await new Promise((resolve) => setTimeout(resolve, 50));

            const fileBytes = await encryptFile.arrayBuffer();

            setStatusMessage(
                t(
                    `Deriving key with PBKDF2 (${PBKDF2_ITERATIONS.toLocaleString()} iterations)...`,
                    `正在通过 PBKDF2 派生密钥（${PBKDF2_ITERATIONS.toLocaleString()} 次计算）...`
                )
            );
            await new Promise((resolve) => setTimeout(resolve, 30));

            const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
            const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

            const textEncoder = new TextEncoder();
            const passwordBytes = textEncoder.encode(password);

            const baseKey = await crypto.subtle.importKey(
                "raw",
                passwordBytes,
                "PBKDF2",
                false,
                ["deriveKey"]
            );

            const aesKey = await crypto.subtle.deriveKey(
                {
                    name: "PBKDF2",
                    salt,
                    iterations: PBKDF2_ITERATIONS,
                    hash: "SHA-256",
                },
                baseKey,
                {
                    name: "AES-GCM",
                    length: 256,
                },
                false,
                ["encrypt"]
            );

            setStatusMessage(t("Encrypting data with AES-256-GCM...", "正在使用 AES-256-GCM 加密数据..."));
            await new Promise((resolve) => setTimeout(resolve, 30));

            const ciphertext = await crypto.subtle.encrypt(
                {
                    name: "AES-GCM",
                    iv,
                },
                aesKey,
                fileBytes
            );

            // Construct binary file: magic (8) + salt (16) + iv (12) + ciphertext (includes 16-byte tag)
            const magicBytes = textEncoder.encode(MAGIC_STRING);
            const cipherBytes = new Uint8Array(ciphertext);
            const outBuffer = new Uint8Array(magicBytes.length + salt.length + iv.length + cipherBytes.byteLength);

            outBuffer.set(magicBytes, 0);
            outBuffer.set(salt, 8);
            outBuffer.set(iv, 24);
            outBuffer.set(cipherBytes, 36);

            const downloadFilename = `${encryptFile.name}.enc`;
            triggerBlobDownload(outBuffer, downloadFilename);

            setEncryptSuccess({
                originalFilename: encryptFile.name,
                encryptedFilename: downloadFilename,
                originalSize: encryptFile.size,
                encryptedSize: outBuffer.byteLength,
                data: outBuffer,
            });
        } catch (err) {
            console.error("Encryption error:", err);
            setEncryptError(
                err instanceof Error
                    ? err.message
                    : t("Encryption failed. Please try again.", "加密失败，请重试。")
            );
        } finally {
            setIsProcessing(false);
            setStatusMessage("");
        }
    };

    const handleDecrypt = async () => {
        if (!decryptFile) {
            setDecryptError(t("Please select a .enc file to decrypt.", "请先选择需要解密的 .enc 文件。"));
            return;
        }
        if (!decryptPassword) {
            setDecryptError(t("Please enter the password for this file.", "请输入解密密码。"));
            return;
        }

        setIsProcessing(true);
        setDecryptError(null);
        setDecryptSuccess(null);
        setStatusMessage(t("Reading encrypted file...", "正在读取加密文件..."));

        try {
            await new Promise((resolve) => setTimeout(resolve, 50));

            const buffer = await decryptFile.arrayBuffer();

            // Validate minimum size: 8 magic + 16 salt + 12 iv + 16 gcm tag = 52 bytes
            if (buffer.byteLength < HEADER_LENGTH + GCM_TAG_LENGTH) {
                throw new Error(
                    t(
                        "File is too small to be a valid YuliusBox encrypted file.",
                        "文件过小，不是有效的 YuliusBox 加密文件。"
                    )
                );
            }

            // Verify Magic header
            const magicBytes = new Uint8Array(buffer.slice(0, 8));
            const magicStr = new TextDecoder().decode(magicBytes);
            if (magicStr !== MAGIC_STRING) {
                throw new Error(
                    t(
                        "Invalid file format: Not a YuliusBox encrypted file (YLBXENC1 header missing).",
                        "无效的文件格式：不是由 YuliusBox 加密的文件（缺少 YLBXENC1 头部标识）。"
                    )
                );
            }

            const salt = new Uint8Array(buffer.slice(8, 24));
            const iv = new Uint8Array(buffer.slice(24, 36));
            const ciphertext = new Uint8Array(buffer.slice(36));

            setStatusMessage(
                t(
                    `Deriving key with PBKDF2 (${PBKDF2_ITERATIONS.toLocaleString()} iterations)...`,
                    `正在通过 PBKDF2 派生密钥（${PBKDF2_ITERATIONS.toLocaleString()} 次计算）...`
                )
            );
            await new Promise((resolve) => setTimeout(resolve, 30));

            const textEncoder = new TextEncoder();
            const passwordBytes = textEncoder.encode(decryptPassword);

            const baseKey = await crypto.subtle.importKey(
                "raw",
                passwordBytes,
                "PBKDF2",
                false,
                ["deriveKey"]
            );

            const aesKey = await crypto.subtle.deriveKey(
                {
                    name: "PBKDF2",
                    salt,
                    iterations: PBKDF2_ITERATIONS,
                    hash: "SHA-256",
                },
                baseKey,
                {
                    name: "AES-GCM",
                    length: 256,
                },
                false,
                ["decrypt"]
            );

            setStatusMessage(t("Decrypting and verifying authentication tag...", "正在解密并验证认证标签..."));
            await new Promise((resolve) => setTimeout(resolve, 30));

            let plaintextBuffer: ArrayBuffer;
            try {
                plaintextBuffer = await crypto.subtle.decrypt(
                    {
                        name: "AES-GCM",
                        iv,
                    },
                    aesKey,
                    ciphertext
                );
            } catch {
                throw new Error(
                    t(
                        "Wrong password or corrupted file.",
                        "密码错误或文件已损坏 / 被篡改。"
                    )
                );
            }

            const origName = decryptFile.name;
            const outputFilename = origName.toLowerCase().endsWith(".enc")
                ? origName.slice(0, -4)
                : `${origName}.decrypted`;

            const plainBytes = new Uint8Array(plaintextBuffer);
            triggerBlobDownload(plainBytes, outputFilename);

            setDecryptSuccess({
                decryptedFilename: outputFilename,
                decryptedSize: plainBytes.byteLength,
                data: plainBytes,
            });
        } catch (err) {
            console.error("Decryption error:", err);
            setDecryptError(
                err instanceof Error
                    ? err.message
                    : t("Decryption failed. Please try again.", "解密失败，请重试。")
            );
        } finally {
            setIsProcessing(false);
            setStatusMessage("");
        }
    };

    const resetEncrypt = () => {
        setEncryptFile(null);
        setPassword("");
        setConfirmPassword("");
        setEncryptError(null);
        setEncryptSuccess(null);
        if (encryptFileInputRef.current) {
            encryptFileInputRef.current.value = "";
        }
    };

    const resetDecrypt = () => {
        setDecryptFile(null);
        setDecryptPassword("");
        setDecryptError(null);
        setDecryptSuccess(null);
        if (decryptFileInputRef.current) {
            decryptFileInputRef.current.value = "";
        }
    };

    return (
        <div className="w-full flex flex-col gap-6">
            {/* Local privacy banner */}
            <div className="rounded-2xl border border-emerald-900/60 bg-emerald-950/30 p-4 sm:p-5 flex gap-3 items-start">
                <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-sm space-y-1">
                    <p className="text-emerald-300 font-semibold">
                        {t("100% In-Browser Cryptography.", "100% 浏览器本地硬件级加密。")}
                    </p>
                    <p className="text-zinc-400">
                        {t(
                            "Zero bytes of your files or passwords are ever sent to any remote server. Encryption uses native W3C WebCrypto API directly on your CPU.",
                            "您的文件与密码绝不会上传至任何远程服务器。所有运算均基于浏览器原生 W3C WebCrypto API 在本机 CPU 完成。"
                        )}
                    </p>
                </div>
            </div>

            {/* Tab switch */}
            <div className="flex rounded-xl bg-zinc-950 p-1 border border-zinc-800">
                <button
                    type="button"
                    onClick={() => setActiveTab("encrypt")}
                    className={cn(
                        "flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2",
                        activeTab === "encrypt"
                            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/30"
                            : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                    )}
                >
                    <Lock className="w-4 h-4" />
                    {t("Encrypt File", "文件加密")}
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab("decrypt")}
                    className={cn(
                        "flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2",
                        activeTab === "decrypt"
                            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/30"
                            : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                    )}
                >
                    <Unlock className="w-4 h-4" />
                    {t("Decrypt File", "文件解密")}
                </button>
            </div>

            {/* ENCRYPT TAB */}
            {activeTab === "encrypt" && (
                <div className="space-y-6">
                    {/* Drag & drop / File selection */}
                    <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5 sm:p-6 space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-white font-semibold text-base flex items-center gap-2">
                                <FileIcon className="w-4 h-4 text-emerald-400" />
                                {t("1. Select Any File to Encrypt", "1. 选择需要加密的文件")}
                            </h2>
                            {encryptFile && (
                                <button
                                    type="button"
                                    onClick={resetEncrypt}
                                    className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 transition-colors"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    {t("Clear", "重置")}
                                </button>
                            )}
                        </div>

                        {!encryptFile ? (
                            <div
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setIsDragging(true);
                                }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    setIsDragging(false);
                                    if (e.dataTransfer.files?.[0]) {
                                        handleEncryptFileSelect(e.dataTransfer.files[0]);
                                    }
                                }}
                                onClick={() => encryptFileInputRef.current?.click()}
                                className={cn(
                                    "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3",
                                    isDragging
                                        ? "border-emerald-500 bg-emerald-950/20"
                                        : "border-zinc-800 hover:border-emerald-500/60 bg-black/30 hover:bg-zinc-800/30"
                                )}
                            >
                                <input
                                    ref={encryptFileInputRef}
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                            handleEncryptFileSelect(e.target.files[0]);
                                        }
                                    }}
                                />
                                <div className="w-12 h-12 rounded-xl bg-emerald-950/50 border border-emerald-900/60 flex items-center justify-center text-emerald-400">
                                    <Upload className="w-6 h-6" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-white">
                                        {t("Drop any file here or click to browse", "拖拽任意文件至此，或点击浏览")}
                                    </p>
                                    <p className="text-xs text-zinc-500">
                                        {t(
                                            "PDF, Images, ZIP, Office docs, Videos — any binary format supported",
                                            "支持 PDF、照片、压缩包、Office 文档、视频等所有格式"
                                        )}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-xl bg-black/40 border border-zinc-800 p-4 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-emerald-400 shrink-0">
                                        <FileIcon className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-white truncate">{encryptFile.name}</p>
                                        <p className="text-xs text-zinc-400">
                                            {formatBytes(encryptFile.size)}
                                            {encryptFile.type ? ` • ${encryptFile.type}` : ""}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={resetEncrypt}
                                    className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shrink-0"
                                    title={t("Remove file", "移除文件")}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        {encryptFile && encryptFile.size > LARGE_FILE_THRESHOLD && (
                            <div className="rounded-xl border border-amber-800/80 bg-amber-950/40 p-3.5 flex gap-2.5 items-start text-xs text-amber-300">
                                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="font-semibold">
                                        {t("Large File Notice (> 1 GB)", "超大文件提示（大于 1 GB）")}
                                    </p>
                                    <p className="text-amber-200/80">
                                        {t(
                                            "This file is over 1 GB. In-browser encryption requires sufficient RAM to hold the file in memory. On low-memory devices, processing might take longer or cause the tab to refresh.",
                                            "当前文件超过 1 GB。浏览器端加密需在内存中完整加载文件，低内存设备可能需要较长运算时间或导致标签页卡顿。"
                                        )}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Password configuration */}
                    <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5 sm:p-6 space-y-4">
                        <h2 className="text-white font-semibold text-base flex items-center gap-2">
                            <Lock className="w-4 h-4 text-emerald-400" />
                            {t("2. Set a Password", "2. 设置加密密码")}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Password input */}
                            <div className="space-y-1.5">
                                <label htmlFor={encPassId} className="text-xs font-medium text-zinc-300">
                                    {t("Password", "加密密码")}
                                </label>
                                <div className="relative">
                                    <input
                                        id={encPassId}
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder={t("Enter a strong password...", "输入加密密码...")}
                                        className="w-full rounded-xl bg-black/50 border border-zinc-800 focus:border-emerald-500/60 outline-none px-3.5 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-1"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password input */}
                            <div className="space-y-1.5">
                                <label htmlFor={encConfirmPassId} className="text-xs font-medium text-zinc-300">
                                    {t("Confirm Password", "确认密码")}
                                </label>
                                <div className="relative">
                                    <input
                                        id={encConfirmPassId}
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder={t("Re-type your password...", "再次输入密码...")}
                                        className={cn(
                                            "w-full rounded-xl bg-black/50 border outline-none px-3.5 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 pr-10",
                                            confirmPassword && confirmPassword !== password
                                                ? "border-red-500/80 focus:border-red-500"
                                                : confirmPassword && confirmPassword === password
                                                ? "border-emerald-500/80 focus:border-emerald-500"
                                                : "border-zinc-800 focus:border-emerald-500/60"
                                        )}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-1"
                                        tabIndex={-1}
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Password strength meter */}
                        <div className="pt-2 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-zinc-400">{t("Password Strength:", "密码强度：")}</span>
                                <span className={cn("font-semibold", strength.textColor)}>
                                    {language === "cn" ? strength.labelCn : strength.labelEn}
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-1.5 h-1.5 w-full">
                                <div
                                    className={cn(
                                        "h-full rounded-full transition-colors",
                                        strength.score >= 1 ? strength.color : "bg-zinc-800"
                                    )}
                                />
                                <div
                                    className={cn(
                                        "h-full rounded-full transition-colors",
                                        strength.score >= 2 ? strength.color : "bg-zinc-800"
                                    )}
                                />
                                <div
                                    className={cn(
                                        "h-full rounded-full transition-colors",
                                        strength.score >= 3 ? strength.color : "bg-zinc-800"
                                    )}
                                />
                            </div>
                            <p className="text-xs text-zinc-500">
                                {language === "cn" ? strength.tipCn : strength.tipEn}
                            </p>
                            {confirmPassword && confirmPassword !== password && (
                                <p className="text-xs text-red-400 flex items-center gap-1">
                                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                    {t("Passwords do not match.", "两次输入的密码不一致。")}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Encrypt Action Button */}
                    <div className="space-y-3">
                        <button
                            type="button"
                            disabled={!encryptFile || !password || password !== confirmPassword || isProcessing}
                            onClick={handleEncrypt}
                            className={cn(
                                "w-full py-3.5 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg",
                                !encryptFile || !password || password !== confirmPassword || isProcessing
                                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50"
                                    : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30 active:scale-[0.99]"
                            )}
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>{statusMessage || t("Encrypting...", "正在加密...")}</span>
                                </>
                            ) : (
                                <>
                                    <Lock className="w-4 h-4" />
                                    <span>{t("Encrypt & Download (.enc)", "加密并下载 (.enc)")}</span>
                                </>
                            )}
                        </button>

                        {encryptError && (
                            <div className="rounded-xl border border-red-900/70 bg-red-950/40 p-3.5 text-xs text-red-300 flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                                <span>{encryptError}</span>
                            </div>
                        )}

                        {encryptSuccess && (
                            <div className="rounded-2xl border border-emerald-900/70 bg-emerald-950/30 p-5 space-y-4">
                                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                                    {t("File Encrypted Successfully!", "文件加密成功！")}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                    <div className="bg-black/40 rounded-xl p-3 border border-zinc-800/80">
                                        <p className="text-zinc-500">{t("Original file:", "原始文件：")}</p>
                                        <p className="text-zinc-200 font-medium truncate mt-0.5">
                                            {encryptSuccess.originalFilename}
                                        </p>
                                        <p className="text-zinc-400 mt-1">{formatBytes(encryptSuccess.originalSize)}</p>
                                    </div>
                                    <div className="bg-black/40 rounded-xl p-3 border border-emerald-900/50">
                                        <p className="text-emerald-400">{t("Encrypted file (.enc):", "加密文件 (.enc)：")}</p>
                                        <p className="text-zinc-200 font-medium truncate mt-0.5">
                                            {encryptSuccess.encryptedFilename}
                                        </p>
                                        <p className="text-zinc-400 mt-1">
                                            {formatBytes(encryptSuccess.encryptedSize)}{" "}
                                            <span className="text-zinc-500">
                                                (+{encryptSuccess.encryptedSize - encryptSuccess.originalSize} B header/tag)
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-1">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            triggerBlobDownload(encryptSuccess.data, encryptSuccess.encryptedFilename)
                                        }
                                        className="py-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                                    >
                                        <Download className="w-3.5 h-3.5" />
                                        {t("Download Again", "再次下载")}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={resetEncrypt}
                                        className="py-2 px-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors"
                                    >
                                        {t("Encrypt Another File", "加密另一个文件")}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* DECRYPT TAB */}
            {activeTab === "decrypt" && (
                <div className="space-y-6">
                    {/* Drag & drop / File selection */}
                    <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5 sm:p-6 space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-white font-semibold text-base flex items-center gap-2">
                                <Unlock className="w-4 h-4 text-emerald-400" />
                                {t("1. Select an Encrypted File (.enc)", "1. 选择需要解密的加密文件 (.enc)")}
                            </h2>
                            {decryptFile && (
                                <button
                                    type="button"
                                    onClick={resetDecrypt}
                                    className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 transition-colors"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    {t("Clear", "重置")}
                                </button>
                            )}
                        </div>

                        {!decryptFile ? (
                            <div
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setIsDragging(true);
                                }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    setIsDragging(false);
                                    if (e.dataTransfer.files?.[0]) {
                                        handleDecryptFileSelect(e.dataTransfer.files[0]);
                                    }
                                }}
                                onClick={() => decryptFileInputRef.current?.click()}
                                className={cn(
                                    "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3",
                                    isDragging
                                        ? "border-emerald-500 bg-emerald-950/20"
                                        : "border-zinc-800 hover:border-emerald-500/60 bg-black/30 hover:bg-zinc-800/30"
                                )}
                            >
                                <input
                                    ref={decryptFileInputRef}
                                    type="file"
                                    accept=".enc,*"
                                    className="hidden"
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                            handleDecryptFileSelect(e.target.files[0]);
                                        }
                                    }}
                                />
                                <div className="w-12 h-12 rounded-xl bg-emerald-950/50 border border-emerald-900/60 flex items-center justify-center text-emerald-400">
                                    <Upload className="w-6 h-6" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-white">
                                        {t("Drop your .enc file here or click to browse", "拖拽 .enc 加密文件至此，或点击浏览")}
                                    </p>
                                    <p className="text-xs text-zinc-500">
                                        {t(
                                            "Select any file encrypted with YuliusBox (YLBXENC1 format)",
                                            "选择由 YuliusBox 加密生成的 .enc 格式文件"
                                        )}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-xl bg-black/40 border border-zinc-800 p-4 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-emerald-400 shrink-0">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-white truncate">{decryptFile.name}</p>
                                        <p className="text-xs text-zinc-400">{formatBytes(decryptFile.size)}</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={resetDecrypt}
                                    className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shrink-0"
                                    title={t("Remove file", "移除文件")}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Decrypt Password input */}
                    <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5 sm:p-6 space-y-4">
                        <h2 className="text-white font-semibold text-base flex items-center gap-2">
                            <Lock className="w-4 h-4 text-emerald-400" />
                            {t("2. Enter Decryption Password", "2. 输入解密密码")}
                        </h2>

                        <div className="space-y-1.5">
                            <label htmlFor={decPassId} className="text-xs font-medium text-zinc-300">
                                {t("Password", "解密密码")}
                            </label>
                            <div className="relative">
                                <input
                                    id={decPassId}
                                    type={showDecryptPassword ? "text" : "password"}
                                    value={decryptPassword}
                                    onChange={(e) => setDecryptPassword(e.target.value)}
                                    placeholder={t("Enter the password used to encrypt this file...", "输入加密该文件时设定的密码...")}
                                    className="w-full rounded-xl bg-black/50 border border-zinc-800 focus:border-emerald-500/60 outline-none px-3.5 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 pr-10"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && decryptFile && decryptPassword && !isProcessing) {
                                            handleDecrypt();
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowDecryptPassword(!showDecryptPassword)}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-1"
                                    tabIndex={-1}
                                >
                                    {showDecryptPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            <p className="text-xs text-zinc-500 mt-1">
                                {t(
                                    "PBKDF2 derives the AES-256 key from this password using the salt embedded in the .enc header.",
                                    "系统将使用嵌入在 .enc 文件头部的随机盐值与此密码共同派生 AES-256 密钥。"
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Decrypt Action Button */}
                    <div className="space-y-3">
                        <button
                            type="button"
                            disabled={!decryptFile || !decryptPassword || isProcessing}
                            onClick={handleDecrypt}
                            className={cn(
                                "w-full py-3.5 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg",
                                !decryptFile || !decryptPassword || isProcessing
                                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50"
                                    : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30 active:scale-[0.99]"
                            )}
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>{statusMessage || t("Decrypting...", "正在解密...")}</span>
                                </>
                            ) : (
                                <>
                                    <Unlock className="w-4 h-4" />
                                    <span>{t("Decrypt & Download File", "解密并下载文件")}</span>
                                </>
                            )}
                        </button>

                        {decryptError && (
                            <div className="rounded-xl border border-red-900/70 bg-red-950/40 p-4 text-xs text-red-300 flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="font-semibold text-red-200">
                                        {t("Decryption failed", "解密失败")}
                                    </p>
                                    <p>{decryptError}</p>
                                    <p className="text-red-400/80 mt-1">
                                        {t(
                                            "AES-256-GCM authenticated encryption mathematically validates that the password matches and that not a single byte of ciphertext was altered.",
                                            "AES-256-GCM 认证加密会在数学层面严格验证密码正确性，并确信密文数据未被篡改或损坏。"
                                        )}
                                    </p>
                                </div>
                            </div>
                        )}

                        {decryptSuccess && (
                            <div className="rounded-2xl border border-emerald-900/70 bg-emerald-950/30 p-5 space-y-4">
                                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                                    {t("File Decrypted Successfully!", "文件解密成功！")}
                                </div>
                                <div className="bg-black/40 rounded-xl p-3 border border-emerald-900/50 text-xs">
                                    <p className="text-emerald-400">{t("Restored file:", "恢复的文件：")}</p>
                                    <p className="text-zinc-200 font-medium truncate mt-0.5">
                                        {decryptSuccess.decryptedFilename}
                                    </p>
                                    <p className="text-zinc-400 mt-1">
                                        {t("Size:", "文件大小：")} {formatBytes(decryptSuccess.decryptedSize)}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-1">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            triggerBlobDownload(decryptSuccess.data, decryptSuccess.decryptedFilename)
                                        }
                                        className="py-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                                    >
                                        <Download className="w-3.5 h-3.5" />
                                        {t("Download Again", "再次下载")}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={resetDecrypt}
                                        className="py-2 px-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors"
                                    >
                                        {t("Decrypt Another File", "解密另一个文件")}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Cryptographic Guarantees & Honest Security Notes */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-5 space-y-3">
                <div className="flex items-center gap-2 text-white font-semibold text-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    {t("Security & Cryptographic Guarantees", "安全机制与密码学保证")}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-zinc-400">
                    <div className="rounded-xl bg-black/40 border border-zinc-800/80 p-3 space-y-1">
                        <p className="font-semibold text-zinc-200">
                            {t("AES-256-GCM Authenticated Encryption", "AES-256-GCM 认证加密")}
                        </p>
                        <p className="text-zinc-400">
                            {t(
                                "Provides both confidentiality and integrity. Any bit-flip or corrupted byte causes decryption to instantly reject.",
                                "兼具保密性与完整性校验。任何单个比特被篡改都会导致解密直接拒绝，杜绝密文篡改或注入。"
                            )}
                        </p>
                    </div>
                    <div className="rounded-xl bg-black/40 border border-zinc-800/80 p-3 space-y-1">
                        <p className="font-semibold text-zinc-200">
                            {t("PBKDF2 (210,000 Iterations)", "PBKDF2 密钥派生（21万次哈希）")}
                        </p>
                        <p className="text-zinc-400">
                            {t(
                                "Slows down GPU/ASIC brute-force attempts. A weak password is still vulnerable — check the strength meter.",
                                "大幅增加 GPU 暴力破解的时间成本。但弱密码依然容易被字典攻破，建议使用强度检测提示的高强度密码。"
                            )}
                        </p>
                    </div>
                    <div className="rounded-xl bg-black/40 border border-zinc-800/80 p-3 space-y-1">
                        <p className="font-semibold text-zinc-200">
                            {t("Zero Backdoors & Unrecoverable", "零后门与不可逆恢复")}
                        </p>
                        <p className="text-zinc-400">
                            {t(
                                "No master key or reset option exists. If you lose your password, the encrypted data is permanently lost.",
                                "无任何主密钥或万能钥匙。若遗忘密码，数据在数学上永久不可恢复，请务必妥善记录密码。"
                            )}
                        </p>
                    </div>
                    <div className="rounded-xl bg-black/40 border border-zinc-800/80 p-3 space-y-1">
                        <p className="font-semibold text-zinc-200">
                            {t("Native WebCrypto in Secure Context", "安全上下文原生 WebCrypto")}
                        </p>
                        <p className="text-zinc-400">
                            {t(
                                "Executes locally via your browser's crypto.subtle in HTTPS. 0 bytes ever leave your device or enter server logs.",
                                "基于 HTTPS 安全上下文下的浏览器标准 crypto.subtle 硬件级执行，零数据上传，支持离线运行。"
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {/* Geek trust note */}
            <LocalTrustNote />
        </div>
    );
}
