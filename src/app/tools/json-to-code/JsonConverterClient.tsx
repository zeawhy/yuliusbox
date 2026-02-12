"use client";

import { useState, useRef } from "react";
import { ArrowLeft, Copy, Check, Code, FileJson, Languages, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

type OutputLanguage = "typescript" | "go" | "dart";

export default function JsonConverterClient() {
    const { language } = useLanguage();
    const [jsonInput, setJsonInput] = useState("");
    const [outputLanguage, setOutputLanguage] = useState<OutputLanguage>("typescript");
    const [result, setResult] = useState("");
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState("");

    const t = {
        back: { en: "Back to Tools", cn: "返回工具列表" },
        title: { en: "JSON to Code Converter", cn: "JSON 转代码工具" },
        subtitle: { en: "Convert JSON to TypeScript, Go, or Dart models instantly.", cn: "将 JSON 瞬间转换为 TypeScript、Go 或 Dart 模型类。" },
        inputLabel: { en: "JSON Input", cn: "JSON 输入" },
        outputLabel: { en: "Generated Code", cn: "生成的代码" },
        placeholder: { en: "Paste your JSON here...", cn: "在此粘贴 JSON 文本..." },
        copy: { en: "Copy Code", cn: "复制代码" },
        convert: { en: "Convert", cn: "转换" },
    };

    const toPascalCase = (str: string) => {
        return str.replace(/(_|-|^)([a-z0-9])/g, (_, __, char) => char.toUpperCase());
    };

    const getType = (val: any): string => {
        if (val === null) return "any";
        if (Array.isArray(val)) return "array";
        return typeof val;
    };

    const convertToTypeScript = (obj: any, rootName = "Root"): string => {
        let result = `interface ${toPascalCase(rootName)} {\n`;
        for (const key in obj) {
            const val = obj[key];
            const type = getType(val);
            if (type === "object") {
                result += `  ${key}: {\n`;
                for (const subKey in val) {
                    result += `    ${subKey}: ${getType(val[subKey])};\n`;
                }
                result += `  };\n`;
            } else if (type === "array") {
                const itemType = val.length > 0 ? getType(val[0]) : "any";
                result += `  ${key}: ${itemType === "object" ? "any" : itemType}[];\n`;
            } else {
                result += `  ${key}: ${type};\n`;
            }
        }
        result += `}\n`;
        return result;
    };

    const convertToGo = (obj: any, rootName = "Root"): string => {
        let result = `type ${toPascalCase(rootName)} struct {\n`;
        for (const key in obj) {
            const val = obj[key];
            const type = getType(val);
            let goType = "string";
            if (type === "number") goType = Number.isInteger(val) ? "int" : "float64";
            if (type === "boolean") goType = "bool";
            if (type === "object") goType = "map[string]interface{}";
            if (type === "array") {
                const itemType = val.length > 0 ? (getType(val[0]) === "number" ? "int" : getType(val[0])) : "interface{}";
                goType = `[]${itemType}`;
            }
            result += `    ${toPascalCase(key)} ${goType} \`json:"${key}"\`\n`;
        }
        result += `}\n`;
        return result;
    };

    const convertToDart = (obj: any, rootName = "Root"): string => {
        const className = toPascalCase(rootName);
        let result = `class ${className} {\n`;
        for (const key in obj) {
            const val = obj[key];
            const type = getType(val);
            let dartType = "dynamic";
            if (type === "string") dartType = "String";
            if (type === "number") dartType = Number.isInteger(val) ? "int" : "double";
            if (type === "boolean") dartType = "bool";
            if (type === "object") dartType = "Map<String, dynamic>";
            if (type === "array") dartType = "List<dynamic>";
            result += `  final ${dartType} ${key};\n`;
        }
        result += `\n  ${className}({\n`;
        for (const key in obj) {
            result += `    required this.${key},\n`;
        }
        result += `  });\n\n`;
        result += `  factory ${className}.fromJson(Map<String, dynamic> json) {\n`;
        result += `    return ${className}(\n`;
        for (const key in obj) {
            result += `      ${key}: json['${key}'],\n`;
        }
        result += `    );\n  }\n}\n`;
        return result;
    };

    const handleConvert = () => {
        setError("");
        if (!jsonInput.trim()) return;

        try {
            const parsed = JSON.parse(jsonInput);
            let code = "";
            if (outputLanguage === "typescript") code = convertToTypeScript(parsed);
            else if (outputLanguage === "go") code = convertToGo(parsed);
            else if (outputLanguage === "dart") code = convertToDart(parsed);
            setResult(code);
        } catch (err) {
            setError("Invalid JSON format");
            setResult("");
        }
    };

    const handleCopy = () => {
        if (!result) return;
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="w-full mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
                <Link href="/" className="flex items-center text-zinc-400 hover:text-white transition-colors w-fit mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" /> {language === "en" ? t.back.en : t.back.cn}
                </Link>
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-zinc-800 rounded-xl border border-zinc-700">
                        <FileJson className="w-8 h-8 text-yellow-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">{language === "en" ? t.title.en : t.title.cn}</h1>
                        <p className="text-zinc-400 mt-1">{language === "en" ? t.subtitle.en : t.subtitle.cn}</p>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800">
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                        <Languages className="w-4 h-4" /> {language === "en" ? "Target:" : "目标语言:"}
                    </span>
                    <div className="flex p-1 bg-zinc-950 rounded-lg border border-zinc-800">
                        {(["typescript", "go", "dart"] as OutputLanguage[]).map((lang) => (
                            <button
                                key={lang}
                                onClick={() => setOutputLanguage(lang)}
                                className={cn(
                                    "px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize",
                                    outputLanguage === lang ? "bg-zinc-800 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
                                )}
                            >
                                {lang}
                            </button>
                        ))}
                    </div>
                </div>
                <button
                    onClick={handleConvert}
                    className="w-full sm:w-auto px-8 py-2 bg-white text-black rounded-lg font-bold hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
                >
                    <ArrowRight className="w-4 h-4" /> {language === "en" ? t.convert.en : t.convert.cn}
                </button>
            </div>

            {/* Split Editor UI */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[500px]">
                {/* Input Pane */}
                <div className="flex flex-col gap-3 relative group">
                    <div className="flex items-center justify-between px-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{language === "en" ? t.inputLabel.en : t.inputLabel.cn}</label>
                        {error && <span className="text-xs text-red-500 animate-pulse">{error}</span>}
                    </div>
                    <div className="flex-1 min-h-[400px] rounded-2xl border border-zinc-800 bg-zinc-950 focus-within:border-zinc-600 transition-all overflow-hidden flex flex-col">
                        <textarea
                            value={jsonInput}
                            onChange={(e) => setJsonInput(e.target.value)}
                            placeholder={language === "en" ? t.placeholder.en : t.placeholder.cn}
                            className="w-full flex-1 bg-transparent p-6 font-mono text-sm text-zinc-300 placeholder-zinc-700 focus:outline-none resize-none leading-relaxed"
                        />
                    </div>
                </div>

                {/* Output Pane */}
                <div className="flex flex-col gap-3 relative group">
                    <div className="flex items-center justify-between px-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{language === "en" ? t.outputLabel.en : t.outputLabel.cn}</label>
                        {result && (
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors bg-zinc-800 px-3 py-1.5 rounded-full"
                            >
                                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                {language === "en" ? t.copy.en : t.copy.cn}
                            </button>
                        )}
                    </div>
                    <div className="flex-1 min-h-[400px] rounded-2xl border border-zinc-800 bg-zinc-900/30 overflow-hidden flex flex-col relative">
                        {result ? (
                            <pre className="w-full flex-1 p-6 font-mono text-sm text-emerald-400 overflow-auto leading-relaxed animate-in fade-in slide-in-from-right-4 duration-500">
                                {result}
                            </pre>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-zinc-700 p-8 text-center">
                                <Code className="w-12 h-12 mb-4 opacity-10" />
                                <p className="text-sm opacity-50">
                                    {language === "en" ? "Generated code will appear here." : "生成的模型代码将显示在这里。"}
                                </p>
                            </div>
                        )}
                        <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-zinc-900/20 to-transparent pointer-events-none" />
                    </div>
                </div>
            </div>
        </div>
    );
}
