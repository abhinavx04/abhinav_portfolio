import { site } from "@/content/site";
import { buttonPrimary, linkQuiet } from "@/components/ui/styles";

/** Hero: the name as a poster. LCP element is the <h1> text, server-rendered. */
export function Hero() {
  return (
    <section
      aria-label="Introduction"
      className="container-site flex min-h-[100svh] flex-col justify-end pb-16 pt-[calc(var(--bar-h)+var(--skirt-h)+2rem)] sm:pb-24"
    >
      <h1 className="text-display-xl font-black uppercase">
        <span data-hero-word className="block text-orange">
          Abhinav
        </span>
        <span data-hero-word className="block">
          Rajesh
        </span>
        <span data-hero-word className="block">
          Pillai
        </span>
      </h1>

      <div data-hero-after className="mt-10 grid gap-8 sm:mt-14 md:grid-cols-12 md:items-end">
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
