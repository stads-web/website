import type { Metadata } from "next";
import { readContent } from "@/lib/content";
import PageTopFade from "@/components/PageTopFade";
import Leadership from "@/components/our-team/Leadership";
import Departments from "@/components/our-team/Departments";
import ContactCta from "@/components/ContactCta";
import type { LeadershipData, DepartmentsData, FinalCtaData } from "@/lib/types";

const title = "Our Team – STADS";
const description =
  "Meet the STADS board and the seven student-run departments behind IT, Cooperation, Marketing, Education, Finance, Teambuilding, and the Datathon.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description },
  twitter: { title, description },
};

const cta: FinalCtaData = {
  eyebrow: "Want to be part of it?",
  title: "Join a department.",
  ctaLabel: "See how to join",
  ctaHref: "/join-us",
};

export default function OurTeamPage() {
  const leadership = readContent<LeadershipData>("our-team/leadership.md");
  const departments = readContent<DepartmentsData>("our-team/departments.md");

  return (
    <main>
      <PageTopFade />
      <Leadership data={leadership.data} />
      <Departments data={departments.data} />
      <ContactCta data={cta} />
    </main>
  );
}
