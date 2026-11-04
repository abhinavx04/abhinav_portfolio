import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { site } from "@/content/site";

const DIR = path.join(process.cwd(), "public", "photos");
const EXT = /\.(webp|jpe?g|png|avif)$/i;

/** Photos the owner has added to public/photos (read at build time). Nothing renders without them. */
function photos() {
  try {
    return fs.readdirSync(DIR).filter((f) => EXT.test(f)).sort().slice(0, 3);
  } catch {
    return [];
  }
}

// Collage slots: each sits at its own depth, so they separate as you scroll.
const SLOTS = [
  { box: "col-span-7 row-span-2 aspect-[4/5]", depth: "0.18" },
  { box: "col-span-5 mt-10 aspect-[3/4]", depth: "-0.1" },
  { box: "col-span-5 aspect-square", depth: "0.06" },
];

export function Photos() {
  const files = photos();
  if (files.length === 0) return null;
  return (
    <div data-parallax-scope className="mt-12 grid grid-cols-12 gap-3 sm:gap-4">
      {files.map((f, i) => (
        <div key={f} data-parallax={SLOTS[i].depth} className={`relative overflow-hidden rounded-ui bg-surface ${SLOTS[i].box}`}>
          <Image
            src={`/photos/${f}`}
            alt={`${site.shortName}`}
            fill
            sizes="(min-width: 1024px) 24rem, 60vw"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
