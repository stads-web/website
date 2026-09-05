import type { Metadata } from "next";
import { readContent } from "@/lib/content";
import DatathonHero from "@/components/datathon/DatathonHero";
import DatathonAbout from "@/components/datathon/DatathonAbout";
import Weekend from "@/components/datathon/Weekend";
import History from "@/components/datathon/History";
import ChallengePartners from "@/components/datathon/ChallengePartners";
import DatathonCta from "@/components/datathon/DatathonCta";
import LogoMarquee from "@/components/motion/LogoMarquee";
import type {
  DatathonHeroData,
  DatathonAboutData,
  WeekendData,
  HistoryData,
  ChallengePartnersData,
  DatathonCtaData,
  PartnersData,
} from "@/lib/types";

export const metadata: Metadata = {
  title: "Datathon – STADS",
  description:
    "The STADS Datathon: 48 hours, real company datasets, and teams of students building data-driven solutions for an expert jury.",
};

export default function DatathonPage() {
  const hero = readContent<DatathonHeroData>("datathon/hero.md");
  const about = readContent<DatathonAboutData>("datathon/about.md");
  const weekend = readContent<WeekendData>("datathon/weekend.md");
  const history = readContent<HistoryData>("datathon/history.md");
  const partners = readContent<ChallengePartnersData>("datathon/partners.md");
  const cta = readContent<DatathonCtaData>("datathon/cta.md");
  const brands = readContent<PartnersData>("home/partners.md");
  const logos = [brands.data.featuredPartner, ...brands.data.partners];

  return (
    <main>
      <DatathonHero data={hero.data} />
      <DatathonAbout data={about.data} body={about.content} />
      <LogoMarquee logos={logos} className="border-y border-brand-100 py-8" />
      <Weekend data={weekend.data} />
      <History data={history.data} />
      <ChallengePartners data={partners.data} />
      <DatathonCta data={cta.data} />
    </main>
  );
}
