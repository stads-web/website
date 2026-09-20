import type { Metadata } from "next";
import { readContent } from "@/lib/content";
import CompaniesHero from "@/components/for-companies/CompaniesHero";
import PartneringIntro from "@/components/for-companies/PartneringIntro";
import Offerings from "@/components/for-companies/Offerings";
import TrustWall from "@/components/for-companies/TrustWall";
import CompanyContact from "@/components/for-companies/CompanyContact";
import type {
  CompaniesHeroData,
  CompanyIntroData,
  OfferingsData,
  TrustWallData,
  CompanyContactData,
  PartnersData,
} from "@/lib/types";

const title = "For Companies – STADS";
const description =
  "Partner with STADS, the University of Mannheim's student Data Science association, through guest lectures, workshops, the Datathon, or sponsorship.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description },
  twitter: { title, description },
};

export default function ForCompaniesPage() {
  const hero = readContent<CompaniesHeroData>("for-companies/hero.md");
  const intro = readContent<CompanyIntroData>("for-companies/intro.md");
  const offerings = readContent<OfferingsData>("for-companies/offerings.md");
  const trust = readContent<TrustWallData>("for-companies/trust.md");
  const contact = readContent<CompanyContactData>("for-companies/contact.md");
  const brands = readContent<PartnersData>("home/partners.md");
  const logos = [brands.data.featuredPartner, ...brands.data.partners];

  return (
    <main>
      <CompaniesHero data={hero.data} />
      <PartneringIntro data={intro.data} body={intro.content} />
      <Offerings data={offerings.data} />
      <TrustWall data={trust.data} logos={logos} />
      <CompanyContact data={contact.data} />
    </main>
  );
}
