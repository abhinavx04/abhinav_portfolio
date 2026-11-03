import { site } from "@/content/site";

// Phase 1 stand-in: proves the reserved navbar space and scroll behaviour.
// Replaced by the real sections in Phase 2.
export default function Home() {
  return (
    <>
      <section className="container-site flex min-h-dvh flex-col justify-center pb-20 pt-[calc(var(--bar-h)+var(--skirt-h))]">
        <h1 className="text-display-xl font-black uppercase">
          <span className="block text-orange">Abhinav</span>
          <span className="block">Rajesh</span>
          <span className="block">Pillai</span>
        </h1>
        <p className="mt-8 max-w-[38ch] text-body text-text-muted">{site.tagline}</p>
      </section>
      {["work", "about", "contact"].map((id) => (
        <section key={id} id={id} className="container-site min-h-[80dvh] border-t border-border py-40">
          <h2 className="text-display font-black uppercase">{id}</h2>
        </section>
      ))}
    </>
  );
}
