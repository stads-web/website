import type { Metadata } from "next";
import { Inter, Libre_Franklin, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/motion/SmoothScroll";
import ScrollProgress from "@/components/motion/ScrollProgress";
import Grain from "@/components/motion/Grain";
import MeshBackdrop from "@/components/motion/MeshBackdrop";
import FooterReveal from "@/components/motion/FooterReveal";
import PageTransition from "@/components/motion/PageTransition";
import { readContent } from "@/lib/content";
import type { SiteData } from "@/lib/types";

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
  title: "STADS – Students' Association for Data Analytics & Statistics Mannheim",
  description:
    "STADS is the only student-run Data Science organization at the University of Mannheim - workshops, the STADS Datathon, guest lectures, and a community of 250+ members.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: site } = readContent<SiteData>("global/site.md");

  return (
    <html lang="en">
      <body className={`${libreFranklin.variable} ${inter.variable} ${playfair.variable} font-sans antialiased`}>
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
        <Analytics />
      </body>
    </html>
  );
}
