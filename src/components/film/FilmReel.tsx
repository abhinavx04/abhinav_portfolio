"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { onIntroRevealed } from "@/lib/intro";
import { filmIntro, stills } from "@/content/film";

// The WebGL carousel (ogl) is its own chunk: it never loads for visitors who keep the static strip.
const FlexCarousel = dynamic(() => import("./FlexCarousel"), { ssr: false });

const ITEMS = stills.map(({ src, alt, title }) => ({ src, alt, title }));
const COUNT = String(stills.length).padStart(2, "0");

function canRunCarousel() {
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    if (nav.connection?.saveData) return false;
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
}

/**
 * The film's frames, with a back story for each. Everyone first gets a plain strip of frames (also
 * what reduced-motion, data-saver and no-WebGL visitors keep); once the section is near and the intro
 * is over, the liquid carousel loads over it at the same size. Opening a frame shows its story below.
 */
export function FilmReel() {
  const stage = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState(false);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(-1);

  useEffect(() => {
    const el = stage.current;
    if (!el || !canRunCarousel()) return;
    let io: IntersectionObserver | undefined;
    const stop = onIntroRevealed(() => {
      io = new IntersectionObserver(
        ([e]) => {
          if (!e.isIntersecting) return;
          io?.disconnect();
          setMount(true);
        },
        { rootMargin: "600px 0px" },
      );
      io.observe(el);
    });
    return () => {
      stop();
      io?.disconnect();
    };
  }, []);

  const shown = open >= 0 ? open : active;
  const still = stills[shown];

  return (
    <div className="mt-12 sm:mt-16">
      <div ref={stage} className="relative h-[clamp(17rem,40vw,36rem)]">
        {!ready && (
          // The static strip: frames scroll sideways, and each one opens its story.
          <ul className="flex h-full snap-x snap-mandatory items-center gap-3 overflow-x-auto px-[var(--gutter)] sm:gap-5">
            {stills.map((s, i) => (
              <li key={s.src} className="h-[62%] shrink-0 snap-center">
                <button
                  type="button"
                  aria-pressed={open === i}
                  aria-label={`${s.title}: ${s.alt}`}
                  onClick={() => setOpen(open === i ? -1 : i)}
                  className={`press relative block aspect-video h-full overflow-hidden rounded-ui bg-surface outline-offset-4 transition-opacity duration-200 ${
                    open >= 0 && open !== i ? "opacity-50" : ""
                  }`}
                >
                  <Image src={s.src} alt="" fill sizes="(min-width: 1024px) 40vw, 80vw" className="object-cover" />
                </button>
              </li>
            ))}
          </ul>
        )}
        {mount && (
          <div className={`absolute inset-0 transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}>
            <FlexCarousel
              items={ITEMS}
              label={filmIntro.carouselLabel}
              preset="ribbon"
              intro="none"
              cardHeight={0.62}
              gap={20}
              radius={4}
              dispersion={0.25}
              autoplay={false}
              captions={false}
              captureWheel={false}
              onChange={(i) => {
                setActive(i);
                setReady(true);
              }}
              onFocusChange={setOpen}
            />
          </div>
        )}
      </div>

      <div className="container-site mt-8 grid gap-3 sm:mt-10 md:grid-cols-12 md:gap-8" aria-live="polite">
        <div key={`head-${shown}`} className="animate-[fade-up_320ms_var(--ease-settle)_backwards] md:col-span-4">
          <p className="text-ui font-semibold tabular-nums text-text-muted">
            Frame {String(shown + 1).padStart(2, "0")} of {COUNT}, at {still.at}
          </p>
          <h3 className="mt-1 text-title font-black uppercase">{still.title}</h3>
        </div>
        <p
          key={`story-${open}`}
          className={`max-w-[52ch] animate-[fade-up_320ms_var(--ease-settle)_backwards] md:col-span-7 md:pt-6 ${
            open >= 0 ? "text-text" : "text-text-muted"
          }`}
        >
          {open >= 0 ? still.story : filmIntro.hint}
        </p>
      </div>
    </div>
  );
}
