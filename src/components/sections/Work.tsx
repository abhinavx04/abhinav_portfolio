import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { githubMoreLabel, projects } from "@/content/projects";
import { site } from "@/content/site";
import { sectionTitle, linkQuiet } from "@/components/ui/styles";
import { TagList } from "@/components/ui/Tag";

/**
 * Work: a ruled index of row-cards (DESIGN.md). The whole row is one link; hover is a solid
 * surface fill plus the arrow stepping up and right. No shadows.
 */
export function Work() {
  return (
    <section id="work" aria-labelledby="work-title" className="container-site py-20 sm:py-32 lg:py-40">
      <h2 id="work-title" className={sectionTitle}>
        Work
      </h2>

      <ol className="mt-12 border-b border-border sm:mt-16">
        {projects.map((p) => (
          <li key={p.slug} className="border-t border-border">
            <Link
              href={`/work/${p.slug}`}
              className="group -mx-4 grid gap-5 rounded-ui px-4 py-8 transition-colors duration-200 hover:bg-surface sm:-mx-6 sm:px-6 sm:py-10 md:grid-cols-12 md:gap-8"
            >
              <div className="md:col-span-5">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-title font-black uppercase">{p.title}</h3>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="mt-0.5 size-6 shrink-0 text-orange transition-transform duration-200 ease-[var(--ease-settle)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 md:hidden"
                  />
                </div>
                <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-ui font-semibold text-text-muted">
                  {p.context}
                  {p.status && (
                    <span className="rounded-ui bg-orange px-2 py-1 leading-none text-on-orange">{p.status}</span>
                  )}
                </p>
              </div>

              <div className="md:col-span-6">
                <p className="max-w-[52ch] text-text">{p.outcome}</p>
                <div className="mt-5">
                  <TagList items={p.tags} label={`${p.title} tech`} />
                </div>
              </div>

              <div className="hidden justify-end md:col-span-1 md:flex">
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-7 text-orange transition-transform duration-200 ease-[var(--ease-settle)] group-hover:-translate-y-1 group-hover:translate-x-1"
                />
              </div>
            </Link>
          </li>
        ))}
      </ol>

      <p className="mt-10">
        <a href={site.links.github} className={linkQuiet}>
          {githubMoreLabel} →
        </a>
      </p>
    </section>
  );
}
