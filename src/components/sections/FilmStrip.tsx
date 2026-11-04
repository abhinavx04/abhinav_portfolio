import Image from "next/image";
import { ReplayIntro } from "@/components/intro/ReplayIntro";
import { buttonPrimary } from "@/components/ui/styles";

// Frames from RUNTIME, the 41 second film that opens the site (public/film).
const STILLS = [
  { src: "/film/still-1-6.webp", alt: "Bengaluru at 2 AM, rain on a neon street" },
  { src: "/film/still-5-0.webp", alt: "A glass of chai beside a laptop: prod is down" },
  { src: "/film/still-13-4.webp", alt: "The Thinker, the Director and the Speedster walk down the server aisle" },
  { src: "/film/still-26-0.webp", alt: "A monster made of bugs towers over the crew" },
  { src: "/film/still-32-2.webp", alt: "Close up of the Director's eyes, lit red" },
  { src: "/film/still-35-0.webp", alt: "The monster bursts apart: deployed" },
  { src: "/film/still-38-6.webp", alt: "The crew walks away from a green explosion" },
];
const ROW_A = STILLS.slice(0, 4);
const ROW_B = STILLS.slice(3);

function Row({ stills, drift, offset }: { stills: typeof STILLS; drift: string; offset: string }) {
  return (
    <div className="overflow-hidden">
      <ul data-parallax-x={drift} className={`strip-row gap-3 sm:gap-5 ${offset}`}>
        {stills.map((s) => (
          <li key={s.src} className="relative aspect-video w-[68vw] shrink-0 overflow-hidden rounded-ui bg-surface sm:w-[42vw] lg:w-[30vw]">
            <Image src={s.src} alt={s.alt} fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 42vw, 68vw" className="object-cover" />
          </li>
        ))}
      </ul>
    </div>
  );
}

/** A scroll-driven strip of film stills: two rows drift in opposite directions as you scroll. */
export function FilmStrip() {
  return (
    <section aria-labelledby="film-title" data-parallax-scope className="overflow-x-clip py-20 sm:py-28">
      <div className="container-site flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-ui font-semibold text-text-muted">The film</p>
          <h2 id="film-title" className="mt-2 text-display font-black uppercase">Runtime</h2>
          <p className="mt-4 max-w-[44ch] text-body text-text-muted">
            A 41 second film about a 2 AM outage, the crew that fixes it, and who wrote the prompts.
          </p>
        </div>
        <ReplayIntro className={buttonPrimary}>Watch the film</ReplayIntro>
      </div>

      <div className="mt-12 flex flex-col gap-3 sm:mt-16 sm:gap-5">
        <Row stills={ROW_A} drift="0.22" offset="ml-[6vw]" />
        <Row stills={ROW_B} drift="-0.22" offset="-ml-[18vw]" />
      </div>
    </section>
  );
}
