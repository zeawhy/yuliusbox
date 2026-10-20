import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const CONTACT_EMAIL = "support@yuliusbox.com";

export const metadata: Metadata = {
    title: "SuiVault 隐私政策 | YuliusBox",
    description:
        "SuiVault（随存）隐私政策：本地优先的个人信息保险箱，所有记录仅存储在您的设备上——无账号、无服务器、无广告、无数据上报。",
    alternates: { canonical: "/suivault/privacy" },
    // Utility page for the SuiVault app listing — keep it out of the index
    // (and out of sitemap.xml) but let crawlers follow its links.
    robots: { index: false, follow: true },
    openGraph: {
        url: "/suivault/privacy",
        siteName: "YuliusBox",
        type: "website",
        images: [
            {
                url: "/og/privacy.png",
                width: 1200,
                height: 630,
                alt: "SuiVault Privacy Policy",
            },
        ],
    },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-3">{title}</h2>
            <div className="text-zinc-400 leading-relaxed space-y-3 text-[15px]">{children}</div>
        </section>
    );
}

const PERMISSIONS_ZH: [string, string][] = [
    ["相机", "仅用于拍摄证件照片，照片保存到应用私有目录，不会出现在系统相册"],
    ["相册", "仅用于从已有照片中选择证件照片"],
    ["指纹 / 面容", "仅用于应用锁解锁；生物信息由操作系统管理，不会离开您的设备"],
    ["网络", "仅在您启用 WebDAV 同步时使用"],
];

const PERMISSIONS_EN: [string, string][] = [
    ["Camera", "Capturing ID-document photos, saved to the app's private directory (not your public gallery)"],
    ["Photo gallery", "Selecting ID-document photos from your existing photos"],
    ["Biometric (fingerprint / face)", "Unlocking the app lock; biometric data is managed by your operating system and never leaves your device"],
    ["Internet", "Only used when you have enabled WebDAV sync"],
];

function PermissionTable({ rows }: { rows: [string, string][] }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <tbody>
                    {rows.map(([name, why]) => (
                        <tr key={name} className="border-b border-zinc-800/60">
                            <td className="py-2 pr-4 text-zinc-300 whitespace-nowrap align-top">
                                {name}
                            </td>
                            <td className="py-2">{why}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function ContactBlock() {
    return (
        <p>
            对本政策有任何疑问 / Questions about this policy:{" "}
            <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-zinc-200 underline underline-offset-4 hover:text-white"
            >
                {CONTACT_EMAIL}
            </a>
            .
        </p>
    );
}

export default function SuiVaultPrivacyPage() {
    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-5xl mx-auto">
            <Header />
            <article className="max-w-3xl mx-auto w-full flex-1">
                <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
                    SuiVault 隐私政策
                </h1>
                <p className="text-sm text-zinc-500 mb-10">
                    最后更新：2026年10月11日 ｜ Last updated: October 11, 2026
                    （英文版见下方 ｜ English version below）
                </p>

                {/* ================= 中文版 ================= */}

                <Section title="简述">
                    <p>
                        SuiVault（随存）是一款<strong className="text-zinc-200">本地优先</strong>的个人信息保险箱应用。
                        您在应用中保存的所有内容都<strong className="text-zinc-200">仅存储在您的设备上</strong>。
                        我们没有用户账号系统，不收集、不存储您的任何个人信息。
                    </p>
                </Section>

                <Section title="数据存储">
                    <p>
                        您的所有记录、卡片内容和照片均<strong className="text-zinc-200">仅存储在您的设备本地</strong>，
                        不会上传到我们运营的任何服务器。
                    </p>
                </Section>

                <Section title="同步（可选）">
                    <p>
                        如果您自行配置了 WebDAV 同步，数据将<strong className="text-zinc-200">直接在您的设备与您自己的服务器之间传输</strong>，
                        我们无法访问。同步配置信息仅保存在您的设备本地。如果您从未配置同步，应用不会使用网络。
                    </p>
                </Section>

                <Section title="权限使用说明">
                    <PermissionTable rows={PERMISSIONS_ZH} />
                    <p>应用的核心功能可完全离线使用，不需要任何权限。</p>
                </Section>

                <Section title="第三方">
                    <p>
                        应用内<strong className="text-zinc-200">无广告、无第三方 SDK、无数据统计上报</strong>。
                        没有任何数据会回传给我们。
                    </p>
                </Section>

                <Section title="数据删除">
                    <p>
                        您可以随时通过<strong className="text-zinc-200">「设置 → 清除全部数据」</strong>彻底删除本地所有数据
                        （包括所有记录、分类、标签和证件照片）。卸载应用也会删除全部本地数据。
                    </p>
                </Section>

                <Section title="儿童隐私">
                    <p>
                        SuiVault 是通用工具应用，不面向 13 岁以下儿童。我们不收集任何人的数据，包括儿童。
                    </p>
                </Section>

                <Section title="政策变更">
                    <p>
                        本政策如有变更，更新版本将发布在本页面，并在应用的「设置」中同步更新。
                    </p>
                </Section>

                <Section title="联系我们">
                    <ContactBlock />
                </Section>

                {/* ================= English version ================= */}

                <hr className="border-zinc-800 my-12" />

                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-10">
                    SuiVault Privacy Policy (English)
                </h2>

                <Section title="The short version">
                    <p>
                        SuiVault is a <strong className="text-zinc-200">local-first</strong> personal
                        information vault for Android. Everything you store in the app stays{" "}
                        <strong className="text-zinc-200">only on your device</strong>.
                        We have no user account system and we do not collect or store
                        any of your personal information.
                    </p>
                </Section>

                <Section title="Data storage">
                    <p>
                        All your records, card contents, and photos are stored{" "}
                        <strong className="text-zinc-200">only on your device</strong>.
                        They are never uploaded to any server operated by us.
                    </p>
                </Section>

                <Section title="Sync (optional)">
                    <p>
                        If you configure WebDAV sync yourself, your data is transferred{" "}
                        <strong className="text-zinc-200">
                            directly between your device and your own server
                        </strong>
                        . We cannot access it. Your sync settings are stored on your
                        device only. If you never configure sync, the app never uses
                        the network.
                    </p>
                </Section>

                <Section title="Permissions we request and why">
                    <PermissionTable rows={PERMISSIONS_EN} />
                    <p>No permission is required to use the app&apos;s core features offline.</p>
                </Section>

                <Section title="Third parties">
                    <p>
                        The app contains{" "}
                        <strong className="text-zinc-200">
                            no ads, no third-party SDKs, and no analytics or telemetry
                        </strong>
                        . Nothing is reported back to us.
                    </p>
                </Section>

                <Section title="Data deletion">
                    <p>
                        You can permanently erase everything — all records, categories,
                        tags, and ID photos — at any time via{" "}
                        <strong className="text-zinc-200">Settings → Clear all data</strong>.
                        Uninstalling the app also removes all local data.
                    </p>
                </Section>

                <Section title="Children's privacy">
                    <p>
                        SuiVault is a general-purpose utility app and is not directed at
                        children under 13. We collect no data from anyone, including
                        children.
                    </p>
                </Section>

                <Section title="Changes to this policy">
                    <p>
                        If this policy changes, the updated version will be published
                        at this URL and included in the app&apos;s Settings.
                    </p>
                </Section>

                <Section title="Contact">
                    <ContactBlock />
                </Section>
            </article>
            <Footer />
        </div>
    );
}
