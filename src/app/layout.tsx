import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
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
    <html lang="en" className={manrope.variable}>
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        {/* Scroll-reveal starts hidden for animation. Without JavaScript nothing would ever reveal it, so show everything. */}
        <noscript><style>{`[style*="opacity:0"]{opacity:1!important;transform:none!important}[style*="clip-path"]{clip-path:none!important}[style*="translateY(110%)"]{transform:none!important}`}</style></noscript>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(hospitalJsonLd()) }} />
        <AppShell>
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
          <MobileActionBar />
        </AppShell>
      </body>
    </html>
  );
}
