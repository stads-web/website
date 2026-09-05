import type { Metadata } from "next";
import { readContent } from "@/lib/content";
import PageTopFade from "@/components/PageTopFade";
import Impact from "@/components/for-students/Impact";
import WhoWeAre from "@/components/for-students/WhoWeAre";
import Membership from "@/components/for-students/Membership";
import Faq from "@/components/for-students/Faq";
import ContactCta from "@/components/ContactCta";
import type {
  IntroData,
  WhoWeAreData,
  MembershipData,
  FaqData,
  FinalCtaData,
} from "@/lib/types";

export const metadata: Metadata = { title: "For Students – STADS" };

export default function ForStudentsPage() {
  const intro = readContent<IntroData>("for-students/intro.md");
  const whoWeAre = readContent<WhoWeAreData>("for-students/who-we-are.md");
  const membership = readContent<MembershipData>("for-students/membership.md");
  const faq = readContent<FaqData>("for-students/faq.md");
  const cta = readContent<FinalCtaData>("for-students/cta.md");

  return (
    <main>
      <PageTopFade />
      <Impact data={intro.data} body={intro.content} />
      <WhoWeAre data={whoWeAre.data} intro={whoWeAre.paragraphs[0]} />
      <Membership data={membership.data} />
      <Faq data={faq.data} />
      <ContactCta data={cta.data} />
    </main>
  );
}
