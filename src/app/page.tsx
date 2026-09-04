import { readContent } from "@/lib/content";
import Hero from "@/components/Hero";
import Nutshell from "@/components/Nutshell";
import Partners from "@/components/Partners";
import Program from "@/components/Program";
import WhyJoin from "@/components/WhyJoin";
import Testimonials from "@/components/Testimonials";
import FinalCta from "@/components/FinalCta";
import type {
  HeroData,
  NutshellData,
  PartnersData,
  ProgramData,
  WhyJoinData,
  TestimonialsData,
  FinalCtaData,
} from "@/lib/types";

export default function Home() {
  const hero = readContent<HeroData>("home/hero.md");
  const nutshell = readContent<NutshellData>("home/nutshell.md");
  const partners = readContent<PartnersData>("home/partners.md");
  const program = readContent<ProgramData>("home/program.md");
  const whyJoin = readContent<WhyJoinData>("home/why-join.md");
  const testimonials = readContent<TestimonialsData>("home/testimonials.md");
  const finalCta = readContent<FinalCtaData>("home/final-cta.md");

  return (
    <main>
      <Hero data={hero.data} subtext={hero.paragraphs[0]} />
      <Nutshell data={nutshell.data} paragraph={nutshell.paragraphs[0]} />
      <Partners data={partners.data} />
      <Program data={program.data} />
      <WhyJoin data={whyJoin.data} />
      <Testimonials data={testimonials.data} />
      <FinalCta data={finalCta.data} />
    </main>
  );
}
