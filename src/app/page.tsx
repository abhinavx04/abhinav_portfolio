import { Hero } from "@/components/sections/Hero";
import { Crew } from "@/components/sections/Crew";
import { Work } from "@/components/sections/Work";
import { AboutJourney } from "@/components/sections/AboutJourney";
import { Contact } from "@/components/sections/Contact";
import { StackBand } from "@/components/sections/StackBand";
import { FilmStrip } from "@/components/sections/FilmStrip";
import { MotionField } from "@/components/motion/MotionField";
import { NavSpy } from "@/components/nav/NavSpy";
import { IntroGate } from "@/components/intro/IntroGate";
import { site } from "@/content/site";

// Structured data: tells search engines who this site is about.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  jobTitle: "AI Generalist Intern",
  worksFor: { "@type": "Organization", name: "Plivo" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "SRM Institute of Science and Technology" },
  sameAs: [site.links.linkedin, site.links.github],
};

export default function Home() {
  return (
    <>
      <Hero />
      <StackBand />
      <Crew />
      <FilmStrip />
      <Work />
      <AboutJourney />
      <Contact />
      <NavSpy />
      <MotionField />
      <IntroGate />
      <script
        type="application/ld+json"
        // Escape "<" so content can never close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
