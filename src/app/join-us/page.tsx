import type { Metadata } from "next";
import { readContent } from "@/lib/content";
import PageTopFade from "@/components/PageTopFade";
import JoinHero from "@/components/join-us/JoinHero";
import Steps from "@/components/join-us/Steps";
import ContactCta from "@/components/ContactCta";
import type { JoinHeroData, JoinStepsData, FinalCtaData } from "@/lib/types";

const title = "Join Us – STADS";
const description =
  "Ready to join STADS? Three simple steps: join the WhatsApp group, drop by a Monday Session, and become an active member of the team.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description },
  twitter: { title, description },
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
