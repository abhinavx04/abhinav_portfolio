import type { Metadata, Viewport } from "next";
import { inter } from "./fonts";
import { Navbar } from "@/components/nav/Navbar";
import { Footer } from "@/components/Footer";
import { site } from "@/content/site";
import { INTRO_SCRIPT } from "@/lib/intro";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name}, AI Generalist and Software Developer`, template: `%s | ${site.name}` },
  description: site.description,
  alternates: { canonical: "./" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.name,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#D97757",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the pre-paint script adds data-intro to <html> before React loads.
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Decides before first paint whether the intro plays, so there is never a flash. */}
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
      </head>
      <body>
        {/* Solid black cover shown instantly when the intro will play (CSS keys off data-intro). */}
        <div aria-hidden="true" className="intro-cover" />
        <a
          href="#main"
          className="sr-only z-[60] rounded-ui bg-text px-4 py-3 font-semibold text-bg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
