import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { readContent } from "@/lib/content";
import type { SiteData } from "@/lib/types";

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
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <Header site={site} />
        {children}
        <Footer site={site} />
        <Analytics />
      </body>
    </html>
  );
}
