import type { Metadata } from "next";
import { readContent } from "@/lib/content";
import PageTopFade from "@/components/PageTopFade";
import JoinHero from "@/components/join-us/JoinHero";
import Steps from "@/components/join-us/Steps";
import ContactCta from "@/components/ContactCta";
import type { JoinHeroData, JoinStepsData, FinalCtaData } from "@/lib/types";

export const metadata: Metadata = { title: "Join STADS" };

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
