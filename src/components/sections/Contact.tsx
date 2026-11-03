import { FileText } from "lucide-react";
import { site } from "@/content/site";
import { CopyEmail } from "./CopyEmail";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/SocialIcons";

const iconLink =
  "press inline-flex items-center gap-2.5 rounded-ui py-2 text-body font-semibold text-text-muted transition-colors duration-200 hover:text-text";

/** Contact: one big line, then the ways to reach me. No form. */
export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="container-site pb-24 pt-32 sm:pb-32 sm:pt-44 lg:pt-56">
      <h2
        id="contact-title"
        // Slightly smaller than the hero: "SOMETHING." must fit a 360px screen.
        className="text-[clamp(2.5rem,11vw,10.5rem)] font-black uppercase leading-[0.86] tracking-[-0.045em] text-balance"
      >
        Let&rsquo;s build something.
      </h2>

      <div className="mt-12 flex flex-col gap-10 sm:mt-16 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <a
            href={`mailto:${site.email}`}
            className="break-all text-title font-semibold text-text underline decoration-orange decoration-2 underline-offset-[6px] transition-colors duration-200 hover:text-orange-light"
          >
            {site.email}
          </a>
          <CopyEmail email={site.email} />
        </div>

        <ul className="flex flex-wrap items-center gap-x-8 gap-y-2">
          <li>
            <a href={site.links.linkedin} className={iconLink} rel="me noopener" target="_blank">
              <LinkedInIcon className="size-5" />
              LinkedIn
            </a>
          </li>
          <li>
            <a href={site.links.github} className={iconLink} rel="me noopener" target="_blank">
              <GitHubIcon className="size-5" />
              GitHub
            </a>
          </li>
          <li>
            <a href={site.links.resume} className={iconLink}>
              <FileText aria-hidden="true" className="size-5" />
              Resume
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
