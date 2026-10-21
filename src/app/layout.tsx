import type { Metadata, Viewport } from "next";
import { Inter, Libre_Franklin, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ConsentProvider } from "@/lib/consent";
import ConsentBanner from "@/components/ConsentBanner";
import AnalyticsScripts from "@/components/AnalyticsScripts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/motion/SmoothScroll";
import ScrollProgress from "@/components/motion/ScrollProgress";
import MeshBackdrop from "@/components/motion/MeshBackdrop";
import FooterReveal from "@/components/motion/FooterReveal";
import PageTransition from "@/components/motion/PageTransition";
import MotionProvider from "@/components/motion/MotionProvider";
import { readContent } from "@/lib/content";
import type { SiteData } from "@/lib/types";
import { siteUrl, ogBase, twitterBase } from "@/lib/site";

const siteTitle = "STADS – Students' Association for Data Analytics & Statistics Mannheim";
const siteDescription =
  "STADS is the only student-run Data Science organization at the University of Mannheim - workshops, the STADS Datathon, guest lectures, and a community of 250+ members.";

const libreFranklin = Libre_Franklin({
  subsets: ["latin"],
  variable: "--font-libre-franklin",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic"],
  variable: "--font-playfair",
  display: "swap",
});

// No viewport-fit=cover: Safari 26 already lets the page scroll under its
// status bar and toolbar, blurred, as long as no full-width fixed layer sits at
// the screen edge (see --edge-gap in globals.css). All env(safe-area-*) values
// are 0 then. theme-color only tints Safari up to iOS 18.
export const viewport: Viewport = {
  themeColor: "#0f1d36",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  alternates: { canonical: "/" },
  openGraph: {
    ...ogBase,
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: siteTitle }],
  },
  twitter: {
    ...twitterBase,
    title: siteTitle,
    description: siteDescription,
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: site } = readContent<SiteData>("global/site.md");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "STADS – Students' Association for Data Analytics & Statistics Mannheim e.V.",
    alternateName: "STADS",
    url: siteUrl,
    logo: `${siteUrl}/brand/stads-logo.png`,
    description: siteDescription,
    email: site.contact.email,
    sameAs: site.footer.social.map((link) => link.href),
  };

  return (
    <html lang="en">
      <body className={`${libreFranklin.variable} ${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <MotionProvider>
        <ConsentProvider>
          <ScrollProgress />
          <SmoothScroll>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-white focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-brand-900 focus:shadow-card"
            >
              Skip to content
            </a>
            <Header site={site} />
            <div className="relative z-10 bg-white mb-[var(--footer-h)] [@media(hover:none)]:mb-0">
              <MeshBackdrop />
              <div id="main" tabIndex={-1} className="relative z-10 outline-none">
                <PageTransition>{children}</PageTransition>
              </div>
            </div>
            <FooterReveal>
              <Footer site={site} />
            </FooterReveal>
          </SmoothScroll>
          <ConsentBanner />
          <AnalyticsScripts />
          <Analytics />
        </ConsentProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
