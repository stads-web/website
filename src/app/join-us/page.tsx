import type { Metadata } from "next";
import { ogBase, twitterBase } from "@/lib/site";
import { readContent } from "@/lib/content";
import PageTopFade from "@/components/PageTopFade";
import JoinHero from "@/components/join-us/JoinHero";
import Steps from "@/components/join-us/Steps";
import ContactCta from "@/components/ContactCta";
import type { JoinHeroData, JoinStepsData, FinalCtaData } from "@/lib/types";

const title = "Join STADS – Data Science Community at Uni Mannheim";
const description =
  "Join STADS in three steps: join our WhatsApp group, drop by a Monday Session and become an active member of the Data Science community at Uni Mannheim.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/join-us" },
  openGraph: {
    ...ogBase,
    title,
    description,
    url: "/join-us",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: { ...twitterBase, title, description },
};

export default function JoinUsPage() {
  const hero = readContent<JoinHeroData>("join-us/hero.md");
  const steps = readContent<JoinStepsData>("join-us/steps.md");
  const cta = readContent<FinalCtaData>("join-us/cta.md");

  return (
    <main>
      <PageTopFade />
      <JoinHero data={hero.data} />
      <Steps data={steps.data} />
      <ContactCta data={cta.data} />
    </main>
  );
}
