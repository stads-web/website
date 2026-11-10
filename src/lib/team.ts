import { readContent } from "@/lib/content";
import { siteUrl } from "@/lib/site";
import type { DepartmentsData, LeadershipData } from "@/lib/types";

export interface TeamPerson {
  name: string;
  jobTitle: string;
  /** Site-relative path of the portrait, e.g. /images/team/vorstand-merle-dehmel.webp */
  photo?: string;
  linkedin?: string;
}

/**
 * Everyone with a name and a portrait on /our-team: the board and the
 * department leads, read from the same content files the page renders.
 * Single source for the Person structured data and the image sitemap.
 */
export function teamPeople(): TeamPerson[] {
  const board = readContent<LeadershipData>("our-team/leadership.md").data.members;
  const departments = readContent<DepartmentsData>("our-team/departments.md").data.items;

  return [
    ...board.map((m) => ({
      name: m.name,
      jobTitle: `${m.role} member`,
      photo: m.photo,
      linkedin: m.linkedin,
    })),
    ...departments
      .filter((d) => d.lead)
      .map((d) => ({
        name: d.lead as string,
        jobTitle: `Lead of the ${d.name} team`,
        photo: d.photo,
        linkedin: d.linkedin || undefined,
      })),
  ];
}

/** schema.org Person nodes, linked to the Organization node defined in the root layout. */
export function teamJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": teamPeople().map((p) => ({
      "@type": "Person",
      name: p.name,
      jobTitle: p.jobTitle,
      ...(p.photo ? { image: `${siteUrl}${p.photo}` } : {}),
      ...(p.linkedin ? { sameAs: [p.linkedin] } : {}),
      memberOf: { "@id": `${siteUrl}/#organization` },
      worksFor: { "@id": `${siteUrl}/#organization` },
    })),
  };
}
