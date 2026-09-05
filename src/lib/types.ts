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
  benefits: string[];
}

export interface MembershipData {
  title: string;
  tiers: MembershipTier[];
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
