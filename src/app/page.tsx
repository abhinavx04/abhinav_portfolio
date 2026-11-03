import { Hero } from "@/components/sections/Hero";
import { Crew } from "@/components/sections/Crew";
import { Work } from "@/components/sections/Work";
import { AboutJourney } from "@/components/sections/AboutJourney";
import { Contact } from "@/components/sections/Contact";
import { NavSpy } from "@/components/nav/NavSpy";

export default function Home() {
  return (
    <>
      <Hero />
      <Crew />
      <Work />
      <AboutJourney />
      <Contact />
      <NavSpy />
    </>
  );
}
