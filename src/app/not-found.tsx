import Link from "next/link";
import { buttonPrimary } from "@/components/ui/styles";

export const metadata = { title: "Page not found" };

/** 404, in the film's language: the build that didn't deploy. */
export default function NotFound() {
  return (
    <section className="container-site flex min-h-[100svh] flex-col justify-end pb-24 pt-[calc(var(--bar-h)+var(--skirt-h)+2rem)]">
      <p className="text-ui font-semibold text-text-muted">Error 404</p>
      <h1 className="mt-4 text-display-xl font-black uppercase">
        Not
        <br />
        deployed.
      </h1>
      <p className="mt-8 max-w-[40ch] text-title font-semibold text-text-muted">
        This page doesn&rsquo;t exist. The rest of the site does.
      </p>
      <p className="mt-10">
        <Link href="/" className={buttonPrimary}>
          Back to the homepage
        </Link>
      </p>
    </section>
  );
}
