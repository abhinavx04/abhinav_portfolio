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
 * Hero: the name as a poster. Signature animation 6.1 is pure CSS (globals.css, .hero-letter),
 * so it starts at first paint without waiting for JavaScript, and pauses under the intro.
 */
export function Hero() {
  let index = 0;
  return (
    <section
      aria-label="Introduction"
      className="container-site flex min-h-[100svh] flex-col justify-end pb-16 pt-[calc(var(--bar-h)+var(--skirt-h)+2rem)] sm:pb-24"
    >
      <h1 className="text-display-xl font-black uppercase">
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

      <div className="hero-after hero-anim mt-10 grid gap-8 sm:mt-14 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <p className="text-ui font-semibold text-text-muted">{site.roles.join(" · ")}</p>
          <p className="mt-3 max-w-[30ch] text-title font-semibold text-text">{site.tagline}</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-7 gap-y-3 md:col-span-5">
          <a href="#work" className={buttonPrimary}>
            See my work
          </a>
          <a href={site.links.resume} className={linkQuiet}>
            Resume
          </a>
        </div>
      </div>
    </section>
  );
}
