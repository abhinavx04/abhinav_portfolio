import { site } from "@/content/site";

// Build-time year: the site is static, so it updates on the next deploy.
const YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="container-site flex flex-col gap-3 py-8 text-ui text-text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {YEAR} {site.name}
        </p>
        {/* "Replay intro" lands here in Phase 4, with the intro sequence. */}
        <p>Built with a Thinker and a Speedster.</p>
      </div>
    </footer>
  );
}
