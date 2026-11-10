import { siteUrl } from "@/lib/site";

export const dynamic = "force-static";

const body = `# STADS – Students' Association for Data Analytics & Statistics Mannheim e.V.

> STADS is the student association for Data Science at the University of Mannheim, founded in 2017, with 250+ members and 30+ events per semester. It is a registered association (e.V.) and an accredited student initiative at the University of Mannheim.

STADS organizes the STADS Datathon, workshops with industry partners, guest lectures, weekly Monday Sessions, a Data Bootcamp and a Python course. Its members study diverse fields; companies can partner for recruiting, Datathon sponsorship, workshops and lectures.

## Pages

- [Home](${siteUrl}/): Overview of STADS and its program
- [Datathon](${siteUrl}/datathon): The STADS Datathon, a two-day hackathon where around 100 students solve real-world data challenges in teams
- [For Students](${siteUrl}/for-students): What members get and how membership works
- [For Companies](${siteUrl}/for-companies): Partnering with STADS (recruiting, Datathon sponsorship, workshops, lectures)
- [Events](${siteUrl}/events): Recurring formats: Monday Sessions, Workshops, Datathon, Guest Lectures, Data Bootcamp, Python Course
- [Our Team](${siteUrl}/our-team): Board and departments
- [Join Us](${siteUrl}/join-us): How to become a member

## Contact

- Email: info@stads.de
- Address: Schloss, 68131 Mannheim, Germany
- [Instagram](https://www.instagram.com/stadsmannheim)
- [LinkedIn](https://www.linkedin.com/company/stadsmannheim/)
- [Impressum](${siteUrl}/impressum)
`;

export function GET() {
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
