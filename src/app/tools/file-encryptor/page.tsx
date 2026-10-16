"use client";

import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FileEncryptorTool } from "@/components/tools/FileEncryptorTool";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PrivacyBadge } from "@/components/tools/PrivacyBadge";

const FAQS = [
    {
        q: "What encryption algorithm does this tool use?",
        a: "This tool uses industry-standard AES-256-GCM (Galois/Counter Mode) authenticated encryption. Your password is never used directly as the cryptographic key; instead, a 256-bit AES key is derived using PBKDF2 (Password-Based Key Derivation Function 2) with SHA-256, a cryptographically secure 16-byte random salt, and 210,000 iterations (following modern OWASP recommendations). Each file encryption generates a fresh 12-byte initialization vector (IV / 96-bit nonce). All cryptography runs directly inside your browser via the standard W3C Web Cryptography API (crypto.subtle).",
    },
    {
        q: "I forgot my password — can you recover my file?",
        a: "No. Recovery is mathematically impossible. This tool operates under a strict zero-knowledge, zero-backdoor model. There are no master keys, no recovery questions, no escrow, and no copies of your password or files sent anywhere. If you forget or lose the password, the encrypted .enc file cannot be decrypted by anyone in the world.",
    },
    {
        q: "Are my files or passwords uploaded to any server?",
        a: "No, never. 0 bytes of your files or passwords ever leave your computer. Both encryption and decryption occur entirely within your web browser using client-side JavaScript and HTML5 File APIs. You can even load this page, disconnect your Wi-Fi or enable Airplane mode, and encrypt or decrypt your files completely offline.",
    },
    {
        q: "Can I decrypt my file on another device or computer?",
        a: "Yes. You can decrypt your .enc file on any device (Mac, Windows, Linux, iOS, Android) by opening this tool in any modern web browser and entering the correct password. Furthermore, because the binary format is completely open and documented, you can decrypt files using standard command-line tools or programming languages like Python, Node.js, Go, or Rust without visiting this website.",
    },
    {
        q: "What is the binary format of the .enc file?",
        a: "The .enc file uses a compact, self-contained binary layout:\n• Bytes 0–7 (8 bytes): Magic identifier ASCII 'YLBXENC1'\n• Bytes 8–23 (16 bytes): Random PBKDF2 salt\n• Bytes 24–35 (12 bytes): Random AES-GCM IV (96-bit nonce)\n• Bytes 36–end: AES-256-GCM ciphertext followed by the 16-byte authentication tag.\nThis header contains everything needed to re-derive the key and decrypt the payload when paired with your password.",
    },
    {
        q: "Are there any file size limits?",
        a: "Because all cryptographic transformations occur directly in your browser's RAM via the Web Cryptography API without disk streaming, file sizes are constrained by available browser memory. Files up to 500 MB encrypt and decrypt within seconds. Files larger than 1 GB can be processed on machines with ample RAM, but may cause tab memory warnings or slower performance on mobile devices.",
    },
];

const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: {
            "@type": "Answer",
            text: f.a,
        },
    })),
};

export default function FileEncryptorPage() {
    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center max-w-5xl mx-auto">
            <Header />
            <Breadcrumbs
                trail={[
                    { href: "/", label: "Home" },
                    { href: "/tools", label: "Tools" },
                    { href: "/tools/file-encryptor", label: "File Encryptor" },
                ]}
            />

            <div className="w-full flex flex-col gap-8">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                        File Encryptor — AES-256 Encrypt Files Online Free
                    </h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto text-base">
                        Encrypt any file with military-grade AES-256-GCM directly in your browser.
                        PBKDF2 key derivation, password protection, and zero server uploads — your files never leave your device.
                    </p>
                </div>

                <div className="relative w-full">
                    <PrivacyBadge mode="local" className="absolute top-3 right-3 z-10" />
                    <FileEncryptorTool />
                </div>

                <div className="prose prose-invert prose-zinc max-w-none text-zinc-400 text-sm space-y-6">
                    <h2 className="text-xl font-semibold text-white">
                        Why client-side file encryption is essential
                    </h2>
                    <p>
                        Cloud storage providers like Google Drive, Dropbox, iCloud, and OneDrive are convenient,
                        but they hold the encryption keys to your data. Whether through government subpoenas, accidental
                        insider leaks, account takeovers, or cloud misconfigurations, unencrypted files stored online are
                        inherently vulnerable.
                    </p>
                    <p>
                        Similarly, when sending confidential contracts, tax returns, source code, medical records, or
                        cryptocurrency seed backups via email, Slack, Teams, or messaging apps, your files traverse
                        third-party mail servers and caching proxies in plaintext. Encrypting your files client-side
                        with a strong password before uploading or transmitting ensures true end-to-end confidentiality:
                        even if the transmission channel or storage bucket is compromised, an attacker sees only
                        indistinguishable random noise.
                    </p>

                    <h2 className="text-xl font-semibold text-white">
                        AES-256-GCM: Authenticated encryption with tamper detection
                    </h2>
                    <p>
                        Many legacy encryption tools rely on CBC (Cipher Block Chaining) or unauthenticated CTR modes,
                        which only scramble content but cannot detect whether an attacker flipped bits in transit.
                        YuliusBox File Encryptor utilizes <strong>AES-256-GCM</strong> (Galois/Counter Mode).
                        GCM computes a cryptographic 128-bit authentication tag alongside the ciphertext.
                    </p>
                    <p>
                        If even a single byte of the encrypted file is altered, corrupted, or replaced,
                        the WebCrypto engine rejects decryption immediately. This guarantees both complete
                        confidentiality and cryptographic data integrity.
                    </p>

                    <h2 className="text-xl font-semibold text-white">
                        PBKDF2 key derivation &amp; password entropy
                    </h2>
                    <p>
                        Humans remember passwords, not 256-bit cryptographic keys. Converting a password into an encryption
                        key requires a deliberately slow key-stretching algorithm to thwart offline dictionary and
                        brute-force attacks.
                    </p>
                    <p>
                        We apply <strong>PBKDF2</strong> using HMAC-SHA-256 with <strong>210,000 iterations</strong> and
                        a unique 16-byte cryptographically secure random salt for every file. This means an adversary attempting
                        to crack your password with high-end GPUs must compute 210,000 SHA-256 rounds for every single password
                        guess. Use the built-in password strength meter to choose a passphrase of 12+ characters for maximum
                        security.
                    </p>

                    <h2 className="text-xl font-semibold text-white">Frequently asked questions</h2>
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
                    />
                    <div className="space-y-3">
                        {FAQS.map((f) => (
                            <details key={f.q} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                                <summary className="cursor-pointer text-white font-medium">{f.q}</summary>
                                <p className="mt-2 text-zinc-400 whitespace-pre-line leading-relaxed">{f.a}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
