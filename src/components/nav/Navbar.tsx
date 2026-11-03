import Link from "next/link";
import { nav, site } from "@/content/site";
import { DripSkirt } from "./DripSkirt";
import { MobileMenu } from "./MobileMenu";

/**
 * Signature element: a solid orange bar that melts into drips (DESIGN.md, "Signature").
 * Server component; only the mobile menu is interactive.
 */
export function Navbar() {
  return (
    <header data-navbar className="on-orange fixed inset-x-0 top-0 z-50">
      <div className="bg-orange text-on-orange">
        <div className="container-site flex h-[var(--bar-h)] items-center justify-between gap-6">
          <Link
            href="/"
            className="press text-[1.0625rem] font-black uppercase leading-none tracking-[-0.02em] sm:text-lg"
          >
            {site.shortName}
            <span className="sr-only">, home</span>
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-8 sm:flex">
            <ul className="flex items-center gap-7">
              {nav.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    data-nav-link={item.id}
                    className="nav-link relative py-2 text-ui font-semibold"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={site.links.resume}
              className="press rounded-ui bg-on-orange px-4 py-2 text-ui font-semibold text-text transition-colors duration-150 hover:bg-bg"
            >
              Resume
            </a>
          </nav>

          <MobileMenu />
        </div>
      </div>
      <DripSkirt />
    </header>
  );
}
