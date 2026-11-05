import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import clsx from "clsx";

const inter = Inter({ subsets: ["latin"] });

export const viewport = {
  themeColor: "#09090b",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.yuliusbox.com"),
  title: "YuliusBox - Privacy-First Web Tools",
  description: "Free online tools that run in your browser: compress images, merge PDFs, convert video to GIF, and transcribe audio. No uploads, no accounts, no tracking.",
  alternates: {
    // NOTE: this canonical only applies to "/". Every route that wants to be
    // indexed must define its own `alternates.canonical`, otherwise it will
    // silently inherit "/" and tell Google it's a duplicate of the homepage.
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "YuliusBox",
    title: "YuliusBox - Privacy-First Web Tools",
    description: "A collection of free, client-side, and secure utilities for productivity.",
    images: [
      {
        url: "/og/home.png",
        width: 1200,
        height: 630,
        alt: "Free Online Tools That Run in Your Browser",
      },
    ],
  },
  twitter: {
    // Keep only `card` here on purpose: no title/description, so each page's
    // Twitter card falls back to its own openGraph/metadata title instead of
    // inheriting the generic site-wide copy.
    card: "summary_large_image",
  },
  verification: {
    google: "ZJjClxLHZ6bdUogWf-dZvE5ggE74X6GK4gCkHpDMPxI",
  },
};

import { LanguageProvider } from "@/context/LanguageContext";
import Script from "next/script";

// Site-wide structured data: WebSite + Organization (tool hub layouts carry
// their own per-tool SoftwareApplication JSON-LD; do not duplicate those here).
const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "YuliusBox",
      url: "https://www.yuliusbox.com",
      description:
        "Most tools run entirely in your browser — a few server-powered tools are the exception, and each one is clearly labeled.",
      inLanguage: "en",
    },
    {
      "@type": "Organization",
      name: "YuliusBox",
      url: "https://www.yuliusbox.com",
      logo: "https://www.yuliusbox.com/og/home.png",
      description:
        "Most tools run entirely in your browser — a few server-powered tools are the exception, and each one is clearly labeled.",
      sameAs: ["https://github.com/zeawhy/yuliusbox"],
      contactPoint: {
        "@type": "ContactPoint",
        email: "support@yuliusbox.com",
        contactType: "customer support",
        availableLanguage: "English",
      },
    },
  ],
};

// Umami (self-hosted, cookieless analytics). The tracking script is only
// injected once NEXT_PUBLIC_UMAMI_WEBSITE_ID is set, so the site works fine
// before the analytics server is deployed.
const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
const umamiUrl = process.env.NEXT_PUBLIC_UMAMI_URL || "https://stats.yuliusbox.com";

// Inject credentialless attribute on AdSense/DoubleClick iframes on COEP pages.
// DoubleClick does not return COEP response headers; nested iframes on pages with
// Cross-Origin-Embedder-Policy: credentialless require the 'credentialless' attribute
// before navigation to avoid CoepFrameResourceNeedsCoepHeader (ERR_BLOCKED_BY_RESPONSE).
// Scoped strictly to the 3 COEP pages and known ad network domains.
const adsenseCredentiallessScript = `(function(){
  if(typeof window==='undefined')return;
  var COEP_PAGES=['/tools/video-to-gif','/tools/audio-to-text','/tools/background-remover'];
  var AD_DOMAINS=[
    'doubleclick.net',
    'googleads.g.doubleclick.net',
    'googlesyndication.com',
    'pagead2.googlesyndication.com',
    'googleadservices.com',
    'adtrafficquality.google'
  ];
  function shouldApply(url){
    if(!url||typeof url!=='string')return false;
    var path=window.location.pathname.replace(/\\/+$/,'')||'/';
    if(COEP_PAGES.indexOf(path)===-1)return false;
    for(var i=0;i<AD_DOMAINS.length;i++){
      if(url.indexOf(AD_DOMAINS[i])!==-1)return true;
    }
    return false;
  }
  function applyCredentialless(el){
    try{
      el.setAttribute('credentialless','');
      el.credentialless=true;
    }catch(e){}
  }
  try{
    var desc=Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype,'src');
    if(desc&&desc.set){
      var origSet=desc.set;
      Object.defineProperty(HTMLIFrameElement.prototype,'src',{
        set:function(val){
          if(shouldApply(val)){
            applyCredentialless(this);
          }
          return origSet.call(this,val);
        },
        get:desc.get,
        configurable:true,
        enumerable:true
      });
    }
  }catch(e){}
  try{
    var origSetAttr=Element.prototype.setAttribute;
    Element.prototype.setAttribute=function(name,val){
      if(this instanceof HTMLIFrameElement&&typeof name==='string'&&name.toLowerCase()==='src'){
        if(shouldApply(val)){
          applyCredentialless(this);
        }
      }
      return origSetAttr.call(this,name,val);
    };
  }catch(e){}
  try{
    var origSetAttrNS=Element.prototype.setAttributeNS;
    Element.prototype.setAttributeNS=function(ns,name,val){
      if(this instanceof HTMLIFrameElement&&typeof name==='string'&&name.toLowerCase()==='src'){
        if(shouldApply(val)){
          applyCredentialless(this);
        }
      }
      return origSetAttrNS.call(this,ns,name,val);
    };
  }catch(e){}
})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* AdSense iframe credentialless compatibility on COEP pages */}
        <script
          dangerouslySetInnerHTML={{ __html: adsenseCredentiallessScript }}
        />
        {/* Google AdSense 网站验证 - 必须直接写在 head 静态 HTML 中 */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2743968200342987"
          crossOrigin="anonymous"
        />
      </head>
      <body className={clsx(inter.className, "bg-zinc-950 text-white antialiased min-h-screen")}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        <LanguageProvider>
          {children}
        </LanguageProvider>
        {umamiWebsiteId && (
          <Script
            src={`${umamiUrl}/script.js`}
            data-website-id={umamiWebsiteId}
            data-domains="yuliusbox.com,www.yuliusbox.com"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
