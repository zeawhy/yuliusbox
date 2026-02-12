"use client";

import { useState, useMemo } from "react";
import { Copy, Check, FileText, Shield, User, Mail, Globe, Apple, Smartphone, Layout, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

interface GeneratorState {
    companyName: string;
    appName: string;
    contactEmail: string;
    platforms: string[];
    adNetworks: string[];
}

export default function PrivacyPolicyGenerator() {
    const { language } = useLanguage();
    const [state, setState] = useState<GeneratorState>({
        companyName: "",
        appName: "",
        contactEmail: "",
        platforms: ["iOS", "Android"],
        adNetworks: [],
    });
    const [activeTab, setActiveTab] = useState<"privacy" | "terms">("privacy");
    const [copied, setCopied] = useState(false);

    const t = {
        title: { en: "Privacy & Terms Generator", cn: "隐私协议 & 服务条款生成器" },
        inputs: { en: "Configuration", cn: "配置信息" },
        preview: { en: "Document Preview", cn: "文档预览" },
        company: { en: "Company / Developer Name", cn: "公司 / 开发者名称" },
        app: { en: "App / Website Name", cn: "应用 / 网站名称" },
        email: { en: "Contact Email", cn: "联系邮箱" },
        platform: { en: "Platforms", cn: "适用平台" },
        ads: { en: "Ad Networks", cn: "广告合作伙伴" },
        copy: { en: "Copy to Clipboard", cn: "复制到剪贴板" },
    };

    const templates = useMemo(() => {
        const { companyName, appName, contactEmail, platforms, adNetworks } = state;
        const company = companyName || "[COMPANY_NAME]";
        const app = appName || "[APP_NAME]";
        const email = contactEmail || "[EMAIL]";
        const platformStr = platforms.join(", ") || "[PLATFORMS]";

        const adClauses = adNetworks.map(network => {
            if (network === "AdMob") return "- [AdMob](https://support.google.com/admob/answer/6128543?hl=en)";
            if (network === "Facebook") return "- [Meta Audience Network](https://www.facebook.com/about/privacy/update/printable)";
            return "";
        }).join("\n");

        const privacy = `
# Privacy Policy

This privacy policy applies to the **${app}** app (herein referred to as "Application") for mobile devices that was created by **${company}** (herein referred to as "Service Provider") as a **${platformStr}** service. This service is intended for use "AS IS".

## Information Collection and Use

The Application collects information when you download and use it. This information may include information such as:
- Your device's Internet Protocol address (e.g. IP address)
- The sections of the Application that you visit, the time and date of your visit, and the time spent on those pages
- The time spent on the Application
- The operating system you use on your mobile device

The Application does not gather precise information about the location of your mobile device.

## Third Party Access

Only aggregated, anonymized data is periodically transmitted to external services to aid the Service Provider in improving the Application and their service. The Service Provider may share your information with third parties in the ways that are described in this privacy statement.

${adNetworks.length > 0 ? `Please note that the Application utilizes third-party services that have their own Privacy Policy about handling data. Below are the links to the Privacy Policy of the third-party service providers used by the Application:

${adClauses}
` : ""}

## Retention of Data

The Service Provider will retain User Provided data for as long as you use the Application and for a reasonable time thereafter. If you'd like them to delete User Provided Data that you have provided via the Application, please contact them at **${email}** and they will respond in a reasonable time.

## Children

The Service Provider does not use the Application to knowingly solicit data from or market to children under the age of 13.

## Security

The Service Provider is concerned about safeguarding the confidentiality of your information. The Service Provider provides physical, electronic, and procedural safeguards to protect information the Service Provider processes and maintains.

## Changes

This Privacy Policy may be updated from time to time for any reason. The Service Provider will notify you of any changes to the Privacy Policy by updating this page with the new Privacy Policy. You are advised to consult this Privacy Policy regularly for any changes, as continued use is deemed approval of all changes.

## Contact Us

If you have any questions regarding privacy while using the Application, or have questions about the practices, please contact the Service Provider via email at **${email}**.
        `.trim();

        const terms = `
# Terms and Conditions

These terms and conditions apply to the **${app}** app (herein referred to as "Application") for mobile devices that was created by **${company}** (herein referred to as "Service Provider") as a **${platformStr}** service.

## Usage License

By downloading or using the Application, these terms will automatically apply to you - you should make sure therefore that you read them carefully before using the Application. You are not allowed to copy, or modify the Application, any part of the Application, or our trademarks in any way. You are not allowed to attempt to extract the source code of the Application, and you also shouldn't try to translate the Application into other languages, or make derivative versions.

## Changes to This Terms and Conditions

The Service Provider may update their Terms and Conditions from time to time. Thus, you are advised to review this page periodically for any changes. The Service Provider will notify you of any changes by posting the new Terms and Conditions on this page.

These terms and conditions are effective as of 2026-02-12.

## Independent Development

The Application is developed independently and is not affiliated with, endorsed by, or sponsored by any official platforms. All trademarks and registered trademarks are the property of their respective owners.

## Disclaimer

The Application is provided "as is", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the Application or the use or other dealings in the Application.

## Contact Us

If you have any questions or suggestions about the Terms and Conditions, do not hesitate to contact the Service Provider at **${email}**.
        `.trim();

        return { privacy, terms };
    }, [state]);

    const handleCopy = () => {
        const text = activeTab === "privacy" ? templates.privacy : templates.terms;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const togglePlatform = (p: string) => {
        setState(prev => ({
            ...prev,
            platforms: prev.platforms.includes(p)
                ? prev.platforms.filter(x => x !== p)
                : [...prev.platforms, p]
        }));
    };

    const toggleAdNetwork = (n: string) => {
        setState(prev => ({
            ...prev,
            adNetworks: prev.adNetworks.includes(n)
                ? prev.adNetworks.filter(x => x !== n)
                : [...prev.adNetworks, n]
        }));
    };

    return (
        <div className="w-full flex flex-col lg:flex-row gap-8 items-start">
            {/* Left: Inputs */}
            <div className="w-full lg:w-1/3 flex flex-col gap-6 animate-in fade-in slide-in-from-left-4 duration-500">
                <div className="bg-zinc-900/50 rounded-3xl border border-zinc-800 p-6 shadow-xl">
                    <div className="flex items-center gap-2 mb-6 text-zinc-400">
                        <Smartphone className="w-4 h-4" />
                        <h2 className="font-bold uppercase tracking-widest text-[10px]">{language === "en" ? t.inputs.en : t.inputs.cn}</h2>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="space-y-2">
                            <label className="text-xs text-zinc-500 font-medium">{language === "en" ? t.company.en : t.company.cn}</label>
                            <input
                                type="text"
                                value={state.companyName}
                                onChange={e => setState(s => ({ ...s, companyName: e.target.value }))}
                                placeholder="e.g. YuliusBox Dev"
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-zinc-500 font-medium">{language === "en" ? t.app.en : t.app.cn}</label>
                            <input
                                type="text"
                                value={state.appName}
                                onChange={e => setState(s => ({ ...s, appName: e.target.value }))}
                                placeholder="e.g. Photo Master"
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-zinc-500 font-medium">{language === "en" ? t.email.en : t.email.cn}</label>
                            <input
                                type="email"
                                value={state.contactEmail}
                                onChange={e => setState(s => ({ ...s, contactEmail: e.target.value }))}
                                placeholder="support@yuliusbox.com"
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all font-medium"
                            />
                        </div>

                        <div className="space-y-3 mt-2">
                            <label className="text-xs text-zinc-500 font-medium">{language === "en" ? t.platform.en : t.platform.cn}</label>
                            <div className="flex flex-wrap gap-2">
                                {["iOS", "Android", "Web"].map(p => (
                                    <button
                                        key={p}
                                        onClick={() => togglePlatform(p)}
                                        className={cn(
                                            "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all",
                                            state.platforms.includes(p)
                                                ? "bg-blue-500/10 border-blue-500 text-blue-400"
                                                : "bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                                        )}
                                    >
                                        {p === "iOS" && <Apple className="w-3 h-3" />}
                                        {p === "Android" && <Smartphone className="w-3 h-3" />}
                                        {p === "Web" && <Globe className="w-3 h-3" />}
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3 mt-2">
                            <label className="text-xs text-zinc-500 font-medium">{language === "en" ? t.ads.en : t.ads.cn}</label>
                            <div className="flex flex-wrap gap-2">
                                {["AdMob", "Facebook"].map(n => (
                                    <button
                                        key={n}
                                        onClick={() => toggleAdNetwork(n)}
                                        className={cn(
                                            "px-3 py-1.5 rounded-lg border text-xs font-bold transition-all",
                                            state.adNetworks.includes(n)
                                                ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                                                : "bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                                        )}
                                    >
                                        {n}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Preview */}
            <div className="w-full lg:w-2/3 flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-500 delay-100">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-900/50 p-2 rounded-2xl border border-zinc-800 shadow-xl">
                    <div className="flex gap-1">
                        <button
                            onClick={() => setActiveTab("privacy")}
                            className={cn(
                                "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                                activeTab === "privacy" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
                            )}
                        >
                            Privacy Policy
                        </button>
                        <button
                            onClick={() => setActiveTab("terms")}
                            className={cn(
                                "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                                activeTab === "terms" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
                            )}
                        >
                            Terms & Conditions
                        </button>
                    </div>

                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-black text-xs font-black rounded-xl hover:bg-zinc-200 transition-all shadow-lg active:scale-95"
                    >
                        {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        {language === "en" ? t.copy.en : t.copy.cn}
                    </button>
                </div>

                <div className="bg-zinc-950 border border-zinc-800 rounded-[2rem] p-8 sm:p-12 h-[600px] overflow-y-auto custom-scrollbar relative">
                    <div className="prose prose-invert prose-blue max-w-none text-zinc-400 whitespace-pre-wrap font-sans">
                        {activeTab === "privacy" ? templates.privacy : templates.terms}
                    </div>

                    {/* Fading bottom overlay */}
                    <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none" />
                </div>
            </div>
        </div>
    );
}
