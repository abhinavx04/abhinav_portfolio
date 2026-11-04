import { skills } from "@/content/skills";

const ALL = skills.flatMap((g) => g.items);
const HALF = Math.ceil(ALL.length / 2);

function Line({ items, drift, accent }: { items: string[]; drift: string; accent?: boolean }) {
  // Repeated so the row always covers the screen while it drifts.
  const run = [...items, ...items];
  return (
    <div className="overflow-hidden">
      <p
        data-parallax-x={drift}
        aria-hidden="true"
        className={`strip-row gap-[0.6em] whitespace-nowrap text-[clamp(2rem,6.5vw,5.5rem)] font-black uppercase leading-[1.05] tracking-[-0.035em] ${accent ? "text-orange" : "text-text/20"}`}
      >
        {run.map((item, i) => (
          <span key={i} className="flex items-center gap-[0.6em]">
            {item}
            <span className="text-[0.45em] text-text/25">●</span>
          </span>
        ))}
      </p>
    </div>
  );
}

/** The stack as two big type rows drifting in opposite directions on scroll (decorative). */
export function StackBand() {
  return (
    <section aria-label="Stack" data-parallax-scope className="overflow-x-clip border-y border-border py-8 sm:py-12">
      {/* Screen readers get the stack once, as a plain list. */}
      <ul className="sr-only">
        {ALL.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <Line items={ALL.slice(0, HALF)} drift="0.3" />
      <Line items={ALL.slice(HALF)} drift="-0.3" accent />
    </section>
  );
}
