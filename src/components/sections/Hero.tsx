import Image from "next/image";
import { site } from "@/content/site";
import { buttonPrimary, linkQuiet } from "@/components/ui/styles";

const WORDS = [
  { text: "Abhinav", accent: true },
  { text: "Rajesh", accent: false },
  { text: "Pillai", accent: false },
];

/** Deterministic "slight angle" per letter, between -9 and +9 degrees. */
const tilt = (i: number) => ((i * 37) % 19) - 9;

/**
 * Hero: the name as a poster, laid over the crew from the film.
 * Depth: the crew plate drifts behind on scroll (data-parallax) and leans toward the pointer
 * (data-tilt); the name comes forward. Signature animation 6.1 (letter drop) stays pure CSS.
 */
export function Hero() {
  let index = 0;
  return (
    <section
      aria-label="Introduction"
      data-parallax-scope
      className="relative overflow-x-clip"
    >
      {/* Crew plate. Phone: a band above the name. Desktop: behind the name, to the right. */}
      <div
        data-parallax="0.35"
        className="pointer-events-none relative mx-auto mt-[calc(var(--bar-h)+var(--skirt-h)-1rem)] aspect-[1376/768] w-[min(100%,46rem)] lg:absolute lg:right-[-3vw] lg:top-[calc(var(--bar-h)+1.5rem)] lg:mt-0 lg:w-[58vw] lg:max-w-[66rem]"
      >
        <div data-tilt="5" className="h-full w-full">
          <div className="hero-plate-in hero-anim h-full w-full">
            <div className="hero-float hero-plate-mask relative h-full w-full">
              <Image
                src="/hero/crew.webp"
                alt="The crew from RUNTIME: the Thinker, the Director and the Speedster"
                fill
                priority
                sizes="(min-width: 1024px) 66vw, 100vw"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container-site relative flex flex-col justify-end pb-16 pt-6 sm:pb-24 lg:min-h-[100svh] lg:pt-[calc(var(--bar-h)+var(--skirt-h)+2rem)]">
        <h1 data-parallax="-0.12" className="text-display-xl font-black uppercase">
          <span className="sr-only">{site.name}</span>
          <span aria-hidden="true">
            {WORDS.map((word) => (
              <span key={word.text} className={`block ${word.accent ? "text-orange" : ""}`}>
                {[...word.text].map((ch) => {
                  const i = index++;
                  return (
                    <span
                      key={i}
                      className="hero-letter hero-anim"
                      style={{ "--i": i, "--r": `${tilt(i)}deg` } as React.CSSProperties}
                    >
                      {ch}
                    </span>
                  );
                })}
              </span>
            ))}
          </span>
        </h1>

        <div className="mt-10 grid gap-8 sm:mt-14 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="hero-after hero-anim text-ui font-semibold text-text-muted">{site.roles.join(" · ")}</p>
            {/* The page's LCP element: visible from the first paint, it only rises into place. */}
            <p className="hero-rise hero-anim mt-3 max-w-[30ch] text-title font-semibold text-text">{site.tagline}</p>
          </div>
          <div className="hero-after hero-anim flex flex-wrap items-center gap-x-7 gap-y-3 md:col-span-5">
            <a href="#work" className={buttonPrimary}>
              See my work
            </a>
            <a href={site.links.resume} className={linkQuiet}>
              Resume
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
