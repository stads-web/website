import type { Metadata } from "next";
import { ogBase, twitterBase } from "@/lib/site";
import { readContent } from "@/lib/content";
import { teamJsonLd } from "@/lib/team";
import Leadership from "@/components/our-team/Leadership";
import Departments from "@/components/our-team/Departments";
import TeamHero from "@/components/our-team/TeamHero";
import ContactCta from "@/components/ContactCta";
import type { LeadershipData, DepartmentsData, FinalCtaData } from "@/lib/types";

const title = "Our Team: Board & Departments – STADS Mannheim";

// Built from the board content so the names in the description never go stale.
export function generateMetadata(): Metadata {
  const board = readContent<LeadershipData>("our-team/leadership.md")
    .data.members.map((m) => m.name)
    .join(", ");
  const description = `STADS board: ${board}. Meet the seven student-run departments: IT, Cooperation, Marketing, Education, Finance, Teambuilding and the Datathon.`;

  return {
    title,
    description,
    alternates: { canonical: "/our-team" },
    openGraph: {
      ...ogBase,
      title,
      description,
      url: "/our-team",
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
    twitter: { ...twitterBase, title, description },
  };
}

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
      {/* Person data for search engines: name, role, portrait, LinkedIn. "<" is escaped so content can never close the tag. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(teamJsonLd()).replace(/</g, "\\u003c") }}
      />
      <TeamHero />
      <Leadership data={leadership.data} />
      <Departments data={departments.data} />
      <ContactCta data={cta} />
    </main>
  );
}
