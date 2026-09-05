import type { Metadata } from "next";
import { readContent } from "@/lib/content";
import PageTopFade from "@/components/PageTopFade";
import PartneringIntro from "@/components/for-companies/PartneringIntro";
import Offerings from "@/components/for-companies/Offerings";
import ContactCta from "@/components/ContactCta";
import type { CompanyIntroData, OfferingsData, FinalCtaData } from "@/lib/types";

export const metadata: Metadata = { title: "For Companies – STADS" };

export default function ForCompaniesPage() {
  const intro = readContent<CompanyIntroData>("for-companies/intro.md");
  const offerings = readContent<OfferingsData>("for-companies/offerings.md");
  const cta = readContent<FinalCtaData>("for-companies/cta.md");

  return (
    <main>
      <PageTopFade />
      <PartneringIntro data={intro.data} body={intro.content} />
      <Offerings data={offerings.data} />
      <ContactCta data={cta.data} />
    </main>
  );
}
