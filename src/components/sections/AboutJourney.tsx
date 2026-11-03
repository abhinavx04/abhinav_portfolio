import { about, timeline } from "@/content/timeline";
import { skills } from "@/content/skills";
import { sectionTitle } from "@/components/ui/styles";

/** About (left) + Journey timeline (right), skills row underneath. Stacks on phones. */
export function AboutJourney() {
  return (
    <section id="about" aria-labelledby="about-title" className="container-site py-20 sm:py-28 lg:py-32">
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <h2 id="about-title" className={sectionTitle}>
            About
          </h2>
          <p className="mt-8 max-w-[58ch] text-body text-text">{about}</p>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <h3 className="text-ui font-semibold text-text-muted">Journey</h3>
          {/* The orange line is its own element so Phase 5 can draw it (scaleY). */}
          <div className="relative mt-6">
            <span
              aria-hidden="true"
              data-timeline-line
              className="absolute bottom-2 left-[4.25rem] top-2 w-0.5 origin-top bg-orange sm:left-[5.25rem]"
            />
            <ol className="flex flex-col gap-9">
              {timeline.map((t, i) => (
                <li key={i} data-timeline-item className="grid grid-cols-[4.25rem_1fr] sm:grid-cols-[5.25rem_1fr]">
                  <span className="pt-0.5 text-ui font-black uppercase tabular-nums text-orange">{t.year}</span>
                  <div className="relative pl-7">
                    <span
                      aria-hidden="true"
                      className="absolute -left-[5px] top-1.5 size-3 rounded-full border-2 border-orange bg-bg"
                    />
                    <p className="font-semibold leading-snug text-text">{t.title}</p>
                    <p className="text-text-muted">{t.org}</p>
                    {t.period && <p className="mt-1 text-ui text-text-muted">{t.period}</p>}
                    {t.detail && <p className="mt-2 text-text-muted">{t.detail}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <div className="mt-20 border-t border-border pt-10 sm:mt-24">
        <h3 className="text-ui font-semibold text-text-muted">Skills</h3>
        <dl className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((s) => (
            <div key={s.group}>
              <dt className="font-semibold text-text">{s.group}</dt>
              <dd className="mt-3">
                {/* Quiet tags: grey outline, so they don't compete with the purple project tags. */}
                <ul className="flex flex-wrap gap-2">
                  {s.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-ui border border-border px-2.5 py-1 text-ui leading-none text-text-muted"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
