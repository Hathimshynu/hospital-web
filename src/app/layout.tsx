import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { GlobalEffects } from "@/components/layout/GlobalEffects";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { hospital } from "@/data/hospital";
import { hospitalJsonLd, jsonLdScript } from "@/lib/jsonld";
import { siteUrl } from "@/lib/utils";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: hospital.seo.title, template: `%s | ${hospital.name}` },
  description: hospital.seo.description,
  keywords: hospital.seo.keywords,
  applicationName: hospital.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website", siteName: hospital.name, title: hospital.seo.title,
    description: hospital.seo.description, url: siteUrl, locale: "en_IN",
  },
  twitter: { card: "summary_large_image", title: hospital.seo.title, description: hospital.seo.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover", // lets the fixed action bar respect iPhone safe areas
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={manrope.variable} suppressHydrationWarning>
      <head>
        {/* Marks JS as available BEFORE first paint so reveal styles only apply when JS can reveal them. Without JS everything is visible. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(hospitalJsonLd()) }} />
        <div id="top-sentinel" aria-hidden="true" className="pointer-events-none absolute left-0 top-0 h-16 w-px" />
        <div aria-hidden="true" className="scroll-progress fixed inset-x-0 top-0 z-[120] h-[3px] bg-gradient-to-r from-brand-600 to-brand-400" />
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
        <MobileActionBar />
        <GlobalEffects />
      </body>
    </html>
  );
}
