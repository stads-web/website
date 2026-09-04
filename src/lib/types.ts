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

export interface PartnersData {
  title: string;
  subtitle: string;
  trustLine: string;
  featuredPartner: string;
  partners: string[];
}

export interface ProgramItem {
  title: string;
  href: string;
  image: string;
  imageAlt: string;
  size: "small" | "large";
}

export interface ProgramData {
  title: string;
  titleAccent: string;
  ctaLabel: string;
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
