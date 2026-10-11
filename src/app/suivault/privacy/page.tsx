import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// TODO(delivery): replace with the user's real Play contact email before
// merging (the play-listing checklist leaves this to the user; the
// support@yuliusbox.com address on the site is an unverified placeholder).
const CONTACT_EMAIL = "__CONTACT_EMAIL__";

export const metadata: Metadata = {
    title: "SuiVault Privacy Policy | YuliusBox",
    description:
        "SuiVault （随存） is a local-first personal information vault for Android. All records are stored only on your device — no accounts, no servers, no ads, no analytics.",
    alternates: { canonical: "/suivault/privacy" },
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

const PERMISSIONS: [string, string][] = [
    ["Camera", "Capturing ID-document photos, saved to the app's private directory (not your public gallery)"],
    ["Photo gallery", "Selecting ID-document photos from your existing photos"],
    ["Biometric (fingerprint / face)", "Unlocking the app lock; biometric data is managed by your operating system and never leaves your device"],
    ["Internet", "Only used when you have enabled WebDAV sync"],
];

export default function SuiVaultPrivacyPage() {
    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-5xl mx-auto">
            <Header />
            <article className="max-w-3xl mx-auto w-full flex-1">
                <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
                    SuiVault Privacy Policy
                </h1>
                <p className="text-sm text-zinc-500 mb-10">Last updated: October 11, 2026</p>

                <Section title="The short version">
                    <p>
                        SuiVault （随存） is a local-first personal information vault for
                        Android. Everything you store in the app stays{" "}
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
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-800">
                                    <th className="py-2 pr-4 text-zinc-200 font-semibold whitespace-nowrap">
                                        Permission
                                    </th>
                                    <th className="py-2 text-zinc-200 font-semibold">Used for</th>
                                </tr>
                            </thead>
                            <tbody>
                                {PERMISSIONS.map(([name, why]) => (
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
                    <p>
                        Questions about this policy:{" "}
                        <a
                            href={`mailto:${CONTACT_EMAIL}`}
                            className="text-zinc-200 underline underline-offset-4 hover:text-white"
                        >
                            {CONTACT_EMAIL}
                        </a>
                        .
                    </p>
                </Section>
            </article>
            <Footer />
        </div>
    );
}
