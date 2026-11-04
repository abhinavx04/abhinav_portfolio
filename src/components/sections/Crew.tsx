import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { crew, crewIntro, type CrewMember } from "@/content/crew";
import { sectionTitle } from "@/components/ui/styles";
import { DirectorFigure, SpeedsterFigure, ThinkerFigure } from "@/components/crew/CrewPlaceholders";
import { AssembleGroup, AssembleItem } from "@/components/motion/Assemble";

// Signature animation 6.3: Director rises from below, Thinker from the left, Speedster from the right.
const FROM = { director: "below", thinker: "left", speedster: "right" } as const;

const PLACEHOLDER = {
  director: DirectorFigure,
  thinker: ThinkerFigure,
  speedster: SpeedsterFigure,
} as const;

/** Real art wins automatically once public/crew/<id>.webp exists (checked at build time). */
function hasArt(id: CrewMember["id"]) {
  return fs.existsSync(path.join(process.cwd(), "public", "crew", `${id}.webp`));
}

function CrewCard({ member }: { member: CrewMember }) {
  const lead = member.id === "director";
  const Placeholder = PLACEHOLDER[member.id];
  return (
    <AssembleItem
      from={FROM[member.id]}
      data-crew={member.id}
      // Phone: the Director comes first. Desktop: Thinker, Director (raised), Speedster.
      className={`flex flex-col rounded-ui border border-border bg-surface ${lead ? "order-first md:order-none md:-mt-10" : ""}`}
    >
      {/* Fixed aspect box: reserves space so the image can't shift layout. */}
      {hasArt(member.id) ? (
        // Real art: the character's scene from the film, full bleed. The image sits a little
        // oversized and drifts inside its frame on scroll, so each card has depth.
        <div data-parallax-scope className="relative aspect-[4/5] w-full overflow-hidden rounded-t-ui">
          <div data-parallax="0.14" className="absolute inset-x-0 -inset-y-[9%]">
            <Image
              src={`/crew/${member.id}.webp`}
              alt={member.alt}
              fill
              sizes="(min-width: 768px) 30vw, 90vw"
              className="object-cover"
            />
          </div>
        </div>
      ) : (
        <div className="relative mx-auto aspect-[4/5] w-full max-w-[17rem] px-6 pt-8">
          <div role="img" aria-label={member.alt} className="h-full w-full">
            <Placeholder />
          </div>
        </div>
      )}
      <div className="border-t border-border px-6 pb-7 pt-5">
        <p className="text-ui font-semibold text-text-muted">{member.label}</p>
        <h3 className="mt-1 text-title font-black uppercase">{member.role}</h3>
        <p className="mt-3 text-text-muted">{member.line}</p>
      </div>
    </AssembleItem>
  );
}

export function Crew() {
  return (
    // overflow-x clip: cards sliding in from the sides never cause horizontal scroll.
    <section id="crew" aria-labelledby="crew-title" className="container-site overflow-x-clip py-20 sm:py-32 lg:py-40">
      <h2 id="crew-title" className={sectionTitle}>
        {crewIntro.heading}
      </h2>
      <p className="mt-5 max-w-[42ch] text-title font-semibold text-text-muted">{crewIntro.sub}</p>

      <AssembleGroup className="mt-16 grid gap-6 md:mt-24 md:grid-cols-3 md:gap-5">
        {crew.map((m) => (
          <CrewCard key={m.id} member={m} />
        ))}
      </AssembleGroup>
    </section>
  );
}
