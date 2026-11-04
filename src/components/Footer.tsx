import { site } from "@/content/site";
import { ReplayIntro } from "@/components/intro/ReplayIntro";

// Build-time year: the site is static, so it updates on the next deploy.
const YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="container-site flex flex-col gap-3 py-8 text-ui text-text-muted sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
          <p>
            © {YEAR} {site.name}
          </p>
          <ReplayIntro />
        </div>
        <p>Built with a Thinker and a Speedster.</p>
      </div>
    </footer>
  );
}
