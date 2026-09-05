import type { Metadata } from "next";
import { readContent } from "@/lib/content";
import DatathonHero from "@/components/datathon/DatathonHero";
import DatathonAbout from "@/components/datathon/DatathonAbout";
import Hours from "@/components/datathon/Hours";
import History from "@/components/datathon/History";
import ChallengePartners from "@/components/datathon/ChallengePartners";
import DatathonCta from "@/components/datathon/DatathonCta";
import type {
  DatathonHeroData,
  DatathonAboutData,
  HoursData,
  HistoryData,
  ChallengePartnersData,
  DatathonCtaData,
} from "@/lib/types";

export const metadata: Metadata = {
  title: "Datathon – STADS",
  description:
    "The STADS Datathon: 48 hours, real company datasets, and teams of students building data-driven solutions for an expert jury.",
};

export default function DatathonPage() {
  const hero = readContent<DatathonHeroData>("datathon/hero.md");
  const about = readContent<DatathonAboutData>("datathon/about.md");
  const hours = readContent<HoursData>("datathon/hours.md");
  const history = readContent<HistoryData>("datathon/history.md");
  const partners = readContent<ChallengePartnersData>("datathon/partners.md");
  const cta = readContent<DatathonCtaData>("datathon/cta.md");

  return (
    <main>
      <DatathonHero data={hero.data} />
      <DatathonAbout data={about.data} body={about.content} />
      <Hours data={hours.data} />
      <History data={history.data} />
      <ChallengePartners data={partners.data} />
      <DatathonCta data={cta.data} />
    </main>
  );
}
