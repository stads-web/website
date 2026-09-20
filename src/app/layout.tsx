import type { Metadata } from "next";
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
import Grain from "@/components/motion/Grain";
import MeshBackdrop from "@/components/motion/MeshBackdrop";
import FooterReveal from "@/components/motion/FooterReveal";
import PageTransition from "@/components/motion/PageTransition";
import Preloader from "@/components/motion/Preloader";
import { readContent } from "@/lib/content";
import type { SiteData } from "@/lib/types";

const siteUrl = "https://website-stads1.vercel.app";
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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName: "STADS",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: siteTitle }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
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
    logo: `${siteUrl}/images/stads_logo_dark.webp`,
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
        <ConsentProvider>
          <Preloader />
          <ScrollProgress />
          <Grain />
          <SmoothScroll>
            <Header site={site} />
            <div className="relative z-10 bg-white mb-[var(--footer-h)]">
              <MeshBackdrop />
              <div className="relative z-10">
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
      </body>
    </html>
  );
}
