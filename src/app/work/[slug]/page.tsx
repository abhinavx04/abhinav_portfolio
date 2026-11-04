import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getProject, projects, type Project } from "@/content/projects";
import { TagList } from "@/components/ui/Tag";

// Fail the build if anything ever makes these pages render per request.
export const ensureStatic = "navigation";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Page not found" };
  return {
    title: project.title,
    description: project.outcome,
    // openGraph is replaced, not merged, per page: repeat the image or the page loses it.
    openGraph: {
      title: project.title,
      description: project.outcome,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: project.title }],
    },
  };
}

/** One labelled step of the case study: label column left, content right. */
function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-4 border-t border-border py-10 sm:py-12 md:grid-cols-12 md:gap-8">
      <h2 className="text-ui font-semibold text-text-muted md:col-span-3">{title}</h2>
      <div className="md:col-span-8 md:col-start-5">{children}</div>
    </section>
  );
}

function Metric({ metric }: { metric: NonNullable<Project["metric"]> }) {
  return (
    <figure>
      <div className="flex items-baseline gap-5 font-black tabular-nums leading-none tracking-[-0.04em]">
        <span className="text-[clamp(3rem,9vw,6rem)] text-text-muted">{metric.from}</span>
        <ArrowRight aria-hidden="true" className="size-8 shrink-0 self-center text-orange sm:size-10" />
        <span className="text-[clamp(3rem,9vw,6rem)] text-orange">{metric.to}</span>
      </div>
      <figcaption className="mt-3 text-ui font-semibold text-text-muted">
        {metric.label}, before and after
      </figcaption>
    </figure>
  );
}

export default async function ProjectPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <article className="container-site pb-24 pt-[calc(var(--bar-h)+var(--skirt-h)+2rem)] sm:pb-32">
      <Link
        href="/#work"
        className="group press -ml-1 inline-flex items-center gap-2 py-2 pl-1 pr-2 text-ui font-semibold text-text-muted transition-colors duration-200 hover:text-text"
      >
        <ArrowLeft
          aria-hidden="true"
          className="size-4 transition-transform duration-200 ease-[var(--ease-settle)] group-hover:-translate-x-1"
        />
        All work
      </Link>

      <header className="mt-10 pb-14 sm:mt-14 sm:pb-20">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-ui font-semibold text-text-muted">
          {project.context}
          {project.status && (
            <span className="rounded-ui bg-orange px-2 py-1 leading-none text-on-orange">{project.status}</span>
          )}
        </p>
        <h1 className="mt-4 text-display font-black uppercase text-balance">{project.title}</h1>
        <p className="mt-8 max-w-[44ch] text-title font-semibold text-text">{project.outcome}</p>
      </header>

      <Step title="Problem">
        <p className="max-w-[62ch]">{project.problem}</p>
      </Step>

      <Step title="What I built">
        <ul className="flex max-w-[62ch] flex-col gap-3">
          {project.built.map((item) => (
            <li key={item} className="grid grid-cols-[1.25rem_1fr]">
              <span aria-hidden="true" className="mt-[0.7em] h-0.5 w-2.5 bg-orange" />
              {item}
            </li>
          ))}
        </ul>
      </Step>

      {project.role && (
        <Step title="My role">
          <p className="max-w-[62ch]">{project.role}</p>
        </Step>
      )}

      <Step title="Stack">
        <TagList items={project.stack} label={`${project.title} stack`} />
      </Step>

      <Step title="Result">
        {/* The figure replaces the sentence when there is one; the outcome line already says it. */}
        {project.metric ? (
          <Metric metric={project.metric} />
        ) : (
          <p className="max-w-[62ch]">{project.result}</p>
        )}
      </Step>

      <Step title="Status">
        <p className="max-w-[62ch] text-text-muted">{project.statusNote}</p>
        {project.links && project.links.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {project.links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="font-semibold underline decoration-orange decoration-2 underline-offset-[6px]"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </Step>

      <nav aria-label="Next project" className="border-t border-border pt-12 sm:pt-16">
        <Link href={`/work/${next.slug}`} className="group block">
          <span className="text-ui font-semibold text-text-muted">Next project</span>
          <span className="mt-3 flex items-center gap-4 text-display font-black uppercase">
            <span className="text-balance transition-colors duration-200 group-hover:text-orange">
              {next.title}
            </span>
            <ArrowRight
              aria-hidden="true"
              className="size-10 shrink-0 text-orange transition-transform duration-200 ease-[var(--ease-settle)] group-hover:translate-x-1.5 sm:size-14"
            />
          </span>
        </Link>
      </nav>
    </article>
  );
}
