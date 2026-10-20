import { Metadata } from "next";
import PrivacyPolicyGenerator from "@/components/tools/PrivacyPolicyGenerator";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { PrivacyBadge } from "@/components/tools/PrivacyBadge";
import { ToolSeoBody } from "@/components/tools/ToolSeoBody";
import { RelatedTools } from "@/components/tools/RelatedTools";

export const metadata: Metadata = {
    title: "Free Privacy Policy Generator for Apps & Websites (No Sign-up)",
    description: "Generate standard Privacy Policy and Terms of Service for your iOS/Android app or website instantly. GDPR compliant templates. 100% Free.",
    keywords: ["privacy policy generator", "terms of service generator", "app privacy policy", "gdpr privacy policy template", "free legal document generator"],
    alternates: {
        canonical: "/tools/privacy-generator",
    },
    openGraph: {
        url: "/tools/privacy-generator",
        siteName: "YuliusBox",
        type: "website",
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Free Privacy Policy Generator",
    "description": "Generate standard Privacy Policy and Terms of Service for your iOS/Android app or website instantly.",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web",
    "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
    }
};

const SECTIONS = [
    {
        heading: "A starting-point privacy policy and terms for your app or site",
        paragraphs: [
            "App stores and ad networks require a privacy policy URL before they will list or monetise your product, and \u201CI collect nothing\u201D still counts as a policy you have to write down. This generator builds a standard privacy policy — and, if you need it, terms of service — from a short form: your product name, company, contact email, and which common data practices apply, such as analytics, advertising or accounts. The result is a readable document you can copy or download and publish as your policy page.",
            "Be clear about what this is: a template-based starting point, generated locally in your browser from the options you select. It covers the clauses most small apps and websites need to disclose, but it is not legal advice and cannot know your exact situation. If you handle payments, health data, children's data or large-scale tracking, have the generated document reviewed by a qualified professional before you rely on it.",
        ],
    },
    {
        heading: "Generated locally — your details stay in this tab",
        paragraphs: [
            "The document is assembled in your browser from your form answers; nothing you type is sent to or stored on a server. That means you can safely enter your real product and company details, iterate on the wording, and regenerate as often as you like without creating an account or leaving copies of your drafts behind.",
            "When your practices change — you add an analytics tool, start showing ads, introduce accounts — come back, tick the new boxes and publish an updated policy with a new effective date. Keeping the policy in step with what the product actually does matters more than having the longest document.",
        ],
    },
];

const HOW_TO = [
    "Fill in your app or website name, the company or individual behind it, and a contact email for privacy questions.",
    "Select the options that match what your product actually does — data collected, analytics, advertising, third-party services and cookies.",
    "Choose whether to generate a privacy policy, terms of service, or both.",
    "Read the generated document carefully and delete or adjust anything that does not describe your product truthfully.",
    "Copy or download the text, publish it on a stable URL, and link that URL from your app store listing and your site footer.",
];

const USE_CASES = [
    "An indie developer who needs a privacy policy URL to submit an iOS or Android app for review.",
    "A small website or blog adding analytics or ads and needing to disclose that to visitors.",
    "A SaaS landing page that wants a terms of service covering accounts, acceptable use and liability basics.",
    "A hobby project graduating to a public launch and replacing its \u201Cno policy yet\u201D placeholder.",
    "Updating an existing policy after adding a new third-party service, using the generator to draft the new version.",
];

const FAQS = [
    {
        question: "Is the generated policy legally binding or legal advice?",
        answer: "No. The generator produces a template-based document from your answers; it is a practical starting point, not legal advice, and it cannot account for every law that may apply to you. For products handling payments, health or children's data, or operating at scale, have the document reviewed by a qualified legal professional.",
    },
    {
        question: "Is my information uploaded or stored?",
        answer: "No. The form and the document generation run entirely in your browser. The names, email addresses and options you enter are not sent to a server, and closing the tab discards them.",
    },
    {
        question: "Does the template mention GDPR-style rights?",
        answer: "The template includes the disclosures commonly expected in modern privacy policies — what is collected, why, third parties it may be shared with, retention, security, and user rights such as access and deletion requests via your contact email. Which rights legally apply depends on your users and your jurisdiction.",
    },
    {
        question: "Can I use the document for an app store submission?",
        answer: "Yes — publish the generated text on a public URL (your website or a docs page) and paste that URL into the privacy policy field of your store listing. Make sure the options you selected match the data practices you declared in the store's own data-safety forms.",
    },
    {
        question: "What if my app collects no data at all?",
        answer: "Still generate a policy: a short document stating that you collect nothing, and how to contact you, is exactly what stores ask for. Select no data-collection options and the template keeps the document minimal.",
    },
    {
        question: "How often should I update the policy?",
        answer: "Whenever your data practices change — a new analytics provider, ads, accounts, payments — regenerate or edit the policy, update its effective date, and keep the same public URL so store listings keep pointing at the current version.",
    },
];

export default function PrivacyGeneratorPage() {
    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-5xl mx-auto">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Header />
            <Breadcrumbs trail={[{ href: "/", label: "Home" }, { href: "/tools/privacy-generator", label: "Privacy Policy Generator" }]} />
            <div className="w-full flex flex-col gap-8">
                <div className="w-full flex justify-center sm:justify-end">
                    <PrivacyBadge mode="local" />
                </div>
                <PrivacyPolicyGenerator />
            </div>
            <ToolSeoBody sections={SECTIONS} howTo={HOW_TO} useCases={USE_CASES} faqs={FAQS} />
            <div className="w-full mt-12 sm:mt-16">
                <RelatedTools slug="privacy-generator" />
            </div>
            <Footer />
        </div>
    );
}
