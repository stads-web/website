export interface CtaLink {
  label: string;
  href: string;
}

export interface HeroData {
  headerImage: string;
  headerImageAlt: string;
  taglineAccent: string;
  taglineBold: string;
  primaryCta: CtaLink;
  secondaryCta: CtaLink;
}

export interface Stat {
  value: string;
  label: string;
}

export interface NutshellData {
  title: string;
  statsHeading: string;
  stats: Stat[];
  ctaLabel: string;
  ctaHref: string;
}

export interface Partner {
  name: string;
  logo: string;
  box: "blue" | "white";
}

export interface PartnersData {
  title: string;
  subtitle: string;
  trustLine: string;
  featuredPartner: Partner;
  partners: Partner[];
}

export interface ProgramItem {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

export interface ProgramData {
  title: string;
  titleAccent: string;
  items: ProgramItem[];
}

export interface WhyJoinItem {
  icon: string;
  heading: string;
  text: string;
}

export interface WhyJoinData {
  title: string;
  subtitle: string;
  items: WhyJoinItem[];
}

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
}

export interface TestimonialsData {
  title: string;
  subtitle: string;
  items: Testimonial[];
}

export interface FinalCtaData {
  eyebrow: string;
  title: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: "instagram-logo" | "linkedin-logo";
}

export interface IntroData {
  title: string;
  image: string;
  imageAlt: string;
  whatsappLabel: string;
  whatsappCta: string;
  whatsappHref: string;
}

export interface TextSection {
  heading: string;
  text: string;
}

export interface WhoWeAreData {
  title: string;
  sections: TextSection[];
}

export interface MembershipTier {
  name: string;
  note: string;
  featured?: boolean;
}

export interface MembershipBenefit {
  label: string;
  tiers: boolean[];
}

export interface MembershipData {
  title: string;
  intro: string;
  tiers: MembershipTier[];
  benefits: MembershipBenefit[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqData {
  items: FaqItem[];
}

export interface CompanyIntroData {
  title: string;
  image: string;
  imageAlt: string;
}

export interface OfferingItem {
  heading: string;
  text: string;
  image: string;
  imageAlt: string;
  imageSide: "left" | "right";
}

export interface OfferingsData {
  title: string;
  items: OfferingItem[];
}

export interface TeamMember {
  name: string;
  initials: string;
  role: string;
  photo?: string;
}

export interface LeadershipData {
  eyebrow: string;
  title: string;
  intro: string;
  members: TeamMember[];
}

export interface Department {
  name: string;
  icon: string;
  initials: string;
  lead?: string;
  photo?: string;
  text: string;
}

export interface DepartmentsData {
  eyebrow: string;
  title: string;
  intro: string;
  items: Department[];
}

export interface EventFormat {
  name: string;
  icon: string;
  cadence: string;
  text: string;
}

export interface EventsData {
  eyebrow: string;
  title: string;
  intro: string;
  formats: EventFormat[];
  ctaLabel: string;
  ctaHref: string;
}

export interface JoinStep {
  title: string;
  text: string;
}

export interface JoinHeroData {
  eyebrow: string;
  title: string;
  intro: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface JoinStepsData {
  title: string;
  steps: JoinStep[];
}

export interface DatathonHeroData {
  eyebrow: string;
  title: string;
  subline: string;
  facts: Stat[];
  primaryCta: CtaLink;
  secondaryCta: CtaLink;
  image: string;
  imageAlt: string;
}

export interface DatathonAboutData {
  title: string;
  videoTitle: string;
  videoCredit: string;
  videoEmbed: string;
  videoLink: string;
  videoPoster: string;
  videoPosterAlt: string;
  stats: Stat[];
}

export interface WeekendBeat {
  label: string;
  text: string;
}

export interface WeekendData {
  eyebrow: string;
  title: string;
  beats: WeekendBeat[];
  outro: string;
}

export interface Edition {
  period: string;
  name: string;
  metric: string;
  metricLabel: string;
  partners: string[];
  text: string;
}

export interface HistoryData {
  eyebrow: string;
  title: string;
  intro: string;
  editions: Edition[];
}

export interface ChallengePartnersData {
  eyebrow: string;
  title: string;
  names: string[];
}

export interface DatathonCtaData {
  eyebrow: string;
  title: string;
  text: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface SiteData {
  nav: CtaLink[];
  joinCta: CtaLink;
  footer: {
    pages: CtaLink[];
    extras: CtaLink[];
    social: SocialLink[];
    copyright: string;
  };
  contact: {
    email: string;
  };
}
