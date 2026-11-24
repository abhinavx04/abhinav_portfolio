import { ReplayIntro } from "@/components/intro/ReplayIntro";
import { FilmReel } from "@/components/film/FilmReel";
import { buttonPrimary } from "@/components/ui/styles";
import { filmIntro } from "@/content/film";

/** Frames from RUNTIME, the 41 second film that opens the site: open one to read its back story. */
export function FilmStrip() {
  return (
    <section aria-labelledby="film-title" className="overflow-x-clip py-20 sm:py-28">
      <div className="container-site flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-ui font-semibold text-text-muted">{filmIntro.eyebrow}</p>
          <h2 id="film-title" className="mt-2 text-display font-black uppercase">
            {filmIntro.heading}
          </h2>
          <p className="mt-4 max-w-[44ch] text-body text-text-muted">{filmIntro.sub}</p>
        </div>
        <ReplayIntro className={buttonPrimary}>Watch the film</ReplayIntro>
      </div>

      <FilmReel />
    </section>
  );
}
