"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { CSSProperties } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { onIntroRevealed } from "@/lib/intro";
import { scrollToY } from "@/lib/scroll";
import { filmIntro, stills } from "@/content/film";
import type { FlexCarouselControl } from "./FlexCarousel";

// The WebGL ribbon (ogl) is its own chunk: it never loads for visitors who keep the plain strip.
const FlexCarousel = dynamic(() => import("./FlexCarousel"), { ssr: false });

/** Scroll mode: the stage sticks and page scroll plays the frames. Must match globals.css (Film section). */
const SCROLL_QUERY = "(prefers-reduced-motion: no-preference) and (min-height: 32rem)";

const ITEMS = stills.map(({ src, alt, title }) => ({ src, alt, title }));
const LAST = stills.length - 1;
const pad = (n: number) => String(n).padStart(2, "0");
const COUNT = pad(stills.length);
const timecode = (seconds: number) => `${Math.floor(seconds / 60)}:${pad(Math.floor(seconds % 60))}`;
const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);

/**
 * Scroll position (in frames) to the frame on screen. Each frame rests, centred, for half of its
 * share of the scroll and the move to the next one eases in between, so wherever the visitor stops
 * reading the ribbon is either still on a frame or clearly on its way to the next.
 */
function dwell(raw: number) {
  const i = Math.min(Math.floor(raw), LAST);
  const t = clamp01((raw - i - 0.25) / 0.5);
  return Math.min(i + t * t * (3 - 2 * t), LAST);
}

/** A fractional frame to seconds into the film, so the playhead lands on each frame's real timestamp. */
function timeAt(frame: number) {
  const i = Math.min(Math.floor(frame), LAST - 1);
  return stills[i].time + (stills[i + 1].time - stills[i].time) * (frame - i);
}

function subscribeScrollMode(onChange: () => void) {
  const mq = window.matchMedia(SCROLL_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function canRunRibbon() {
  try {
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    if (nav.connection?.saveData) return false;
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
}

function remPx(value: string) {
  return parseFloat(value) * parseFloat(getComputedStyle(document.documentElement).fontSize || "16");
}

/**
 * RUNTIME's frames with a back story each, played by the page scroll.
 *
 * Scroll mode: the stage sticks under the bar and one driver maps scroll to a fractional frame. That
 * frame moves the ribbon (or the plain strip standing in for it), the playhead on the timeline, and
 * the story below. Dragging, swiping, the arrow keys and the timeline ticks pick a frame by scrolling
 * the page to it, so scroll stays the only thing that moves the ribbon.
 * Otherwise (reduced motion, a short landscape screen): a plain strip that swipes sideways, and a tap
 * on a frame or a tick shows its story.
 */
export function FilmReel() {
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const area = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLUListElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const control = useRef<FlexCarouselControl | null>(null);
  const range = useRef<{ start: number; end: number } | null>(null);
  const progress = useRef(0);
  const frame = useRef(0);
  const shownRef = useRef(0);
  const ribbonReady = useRef(false);
  const drive = useRef<(p: number) => void>(() => {});

  const scrollMode = useSyncExternalStore(
    subscribeScrollMode,
    () => window.matchMedia(SCROLL_QUERY).matches,
    () => false,
  );
  const [card, setCard] = useState({ frac: 0.62, lensW: 0.8, lensH: 0.8 });
  const [mount, setMount] = useState(false);
  const [ready, setReady] = useState(false);
  const [shown, setShown] = useState(0);

  const show = useCallback((i: number) => {
    if (shownRef.current === i) return;
    shownRef.current = i;
    setShown(i);
  }, []);

  // Cards fill 62% of the stage's height, but never more than 84% of its width (72% on phones). On a
  // narrow screen the ribbon's lens widens so the centred frame sits flat and only its neighbours curl.
  useEffect(() => {
    const el = area.current;
    if (!el || !scrollMode) return;
    const ro = new ResizeObserver(() => {
      const { width, height } = el.getBoundingClientRect();
      if (height <= 0) return;
      const narrow = width < 768;
      const frac = Math.round(Math.min(0.62, (width * (narrow ? 0.72 : 0.84) * 9) / 16 / height) * 1000) / 1000;
      // The lens is an ellipse: on phones it must clear the card's corners, not only its sides.
      const lensW = narrow ? 1.4 : 0.8;
      const lensH = narrow ? 1.2 : 0.8;
      setCard((c) => (c.frac === frac && c.lensW === lensW ? c : { frac, lensW, lensH }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [scrollMode]);

  // A new card size moves the strip's frame centres: place it again for the current scroll.
  useEffect(() => {
    drive.current(progress.current);
  }, [card, ready]);

  // The WebGL ribbon loads once the intro is over and the section is near.
  useEffect(() => {
    const el = track.current;
    if (!el || !scrollMode || !canRunRibbon()) return;
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
  }, [scrollMode]);

  // The driver: page scroll -> fractional frame -> ribbon, strip, playhead and story.
  useEffect(() => {
    const el = track.current;
    const st = stage.current;
    if (!el || !st || !scrollMode) return;
    const barH = () => remPx(getComputedStyle(document.documentElement).getPropertyValue("--bar-h"));

    drive.current = (p: number) => {
      progress.current = p;
      const f = dwell(p * LAST);
      frame.current = f;
      control.current?.seek(f);
      const ul = strip.current;
      if (ul) {
        const i = Math.min(Math.floor(f), LAST - 1);
        const a = ul.children[i] as HTMLElement | undefined;
        const b = ul.children[i + 1] as HTMLElement | undefined;
        if (a && b) {
          const ca = a.offsetLeft + a.offsetWidth / 2;
          const cb = b.offsetLeft + b.offsetWidth / 2;
          ul.style.transform = `translate3d(${(ul.clientWidth / 2 - (ca + (cb - ca) * (f - i))).toFixed(1)}px,0,0)`;
        }
      }
      if (fill.current) fill.current.style.transform = `scaleX(${(timeAt(f) / filmIntro.runtime).toFixed(4)})`;
      if (!ribbonReady.current) show(Math.round(f));
    };

    // Place everything for the current scroll right away; ScrollTrigger takes over once it loads.
    const rect = el.getBoundingClientRect();
    const start = window.scrollY + rect.top - barH();
    const end = start + rect.height - st.offsetHeight;
    range.current = { start, end };
    drive.current(clamp01((window.scrollY - start) / Math.max(1, end - start)));

    let cancelled = false;
    let kill = () => {};
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const trigger = ScrollTrigger.create({
        trigger: el,
        start: () => `top ${barH()}px`,
        end: () => `bottom ${barH() + st.offsetHeight}px`,
        invalidateOnRefresh: true,
        onUpdate: (self) => drive.current(self.progress),
        onRefresh: (self) => {
          range.current = { start: self.start, end: self.end };
          drive.current(self.progress);
        },
      });
      range.current = { start: trigger.start, end: trigger.end };
      drive.current(trigger.progress);
      kill = () => trigger.kill();
    });

    const ul = strip.current;
    return () => {
      cancelled = true;
      kill();
      drive.current = () => {};
      ul?.style.removeProperty("transform");
    };
  }, [scrollMode, show]);

  // Outside scroll mode the playhead follows the picked frame.
  useEffect(() => {
    if (scrollMode || !fill.current) return;
    fill.current.style.transform = `scaleX(${(stills[shown].time / filmIntro.runtime).toFixed(4)})`;
  }, [scrollMode, shown]);

  /** Scroll mode: scroll the page to where frame `i` rests. Otherwise: just show it. */
  const select = useCallback(
    (i: number) => {
      const r = range.current;
      if (!scrollMode || !r) {
        show(i);
        return;
      }
      scrollToY(r.start + (i / LAST) * (r.end - r.start));
    },
    [scrollMode, show],
  );

  const ribbonOn = mount && scrollMode;
  const ribbonShown = ribbonOn && ready;
  const still = stills[shown];

  return (
    <div ref={track} className="film-track mt-12 sm:mt-16" style={{ "--film-frames": LAST } as CSSProperties}>
      <div ref={stage} className="film-stage">
        <div ref={area} className="film-area relative">
          {!ribbonShown && (
            <ul
              ref={strip}
              className="film-strip"
              style={scrollMode ? ({ "--film-card": `${card.frac * 100}%` } as CSSProperties) : undefined}
            >
              {stills.map((s, i) => (
                <li key={s.src}>
                  <button
                    type="button"
                    aria-label={`Frame ${i + 1}: ${s.title}`}
                    aria-current={shown === i ? "true" : undefined}
                    onClick={() => select(i)}
                    className={`press relative block size-full touch-manipulation select-none overflow-hidden rounded-ui bg-surface outline-offset-4 transition-[opacity,transform] duration-150 ease-[var(--ease-settle)] ${
                      !scrollMode && shown !== i ? "opacity-50" : ""
                    }`}
                  >
                    <Image src={s.src} alt="" fill sizes="(min-width: 768px) 60vw, 84vw" className="object-cover" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          {ribbonOn && (
            <div className={`absolute inset-0 transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}>
              <FlexCarousel
                items={ITEMS}
                label={filmIntro.carouselLabel}
                preset="ribbon"
                intro="none"
                loop={false}
                cardHeight={card.frac}
                lensWidth={card.lensW}
                lensHeight={card.lensH}
                gap={20}
                radius={4}
                dispersion={0.25}
                autoplay={false}
                captions={false}
                captureWheel={false}
                focusOnClick={false}
                onControl={(c) => {
                  control.current = c;
                  c?.seek(frame.current);
                }}
                onNavigate={select}
                onChange={(i) => {
                  ribbonReady.current = true;
                  setReady(true);
                  show(i);
                }}
              />
            </div>
          )}
        </div>

        {/* The film's timeline: ticks sit at each frame's real timestamp, the playhead follows the frame. */}
        <div className="container-site mt-5 sm:mt-6">
          <div className="flex items-center gap-4 text-ui tabular-nums text-text-muted">
            {/* On phones the end times sit under the line, so the line gets the full width and close
                ticks (0:32 and 0:35) keep their 24px tap targets apart. */}
            <span aria-hidden="true" className="hidden sm:inline">
              0:00
            </span>
            <div role="group" aria-label={filmIntro.timelineLabel} className="relative h-6 flex-1">
              <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border" />
              <div
                ref={fill}
                className={`absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 origin-left bg-orange ${
                  scrollMode ? "" : "transition-transform duration-300 ease-[var(--ease-settle)]"
                }`}
                style={{ transform: `scaleX(${(stills[0].time / filmIntro.runtime).toFixed(4)})` }}
              />
              {stills.map((s, i) => (
                <button
                  key={s.src}
                  type="button"
                  onClick={() => select(i)}
                  aria-label={`Frame ${i + 1}, ${s.title}, at ${s.at}`}
                  aria-current={shown === i ? "true" : undefined}
                  style={{ left: `${(s.time / filmIntro.runtime) * 100}%` }}
                  className="group absolute top-0 grid h-6 w-[22px] -translate-x-1/2 touch-manipulation select-none place-items-center sm:w-6"
                >
                  <span
                    className={`block h-3 w-0.5 rounded-full transition-[background-color,scale] duration-150 ease-[var(--ease-settle)] group-hover:scale-y-150 ${
                      i <= shown ? "bg-orange" : "bg-text-muted"
                    } ${shown === i ? "scale-y-150" : ""}`}
                  />
                </button>
              ))}
            </div>
            <span aria-hidden="true" className="hidden sm:inline">
              {timecode(filmIntro.runtime)}
            </span>
          </div>
          <div aria-hidden="true" className="flex justify-between text-ui tabular-nums text-text-muted sm:hidden">
            <span>0:00</span>
            <span>{timecode(filmIntro.runtime)}</span>
          </div>
        </div>

        {/* What sighted visitors read; screen readers get every story from the list below instead. */}
        <div className="container-site mt-6 grid gap-2 sm:mt-8 md:grid-cols-12 md:gap-8" aria-hidden="true">
          <div key={`head-${shown}`} className="animate-[fade-up_320ms_var(--ease-settle)_backwards] md:col-span-4">
            <p className="text-ui font-semibold tabular-nums text-text-muted">
              Frame {pad(shown + 1)} of {COUNT}, at {still.at}
            </p>
            <p className="mt-1 text-title font-black uppercase">{still.title}</p>
          </div>
          <p
            key={`story-${shown}`}
            className="film-story max-w-[52ch] animate-[fade-up_320ms_var(--ease-settle)_backwards] md:col-span-7 md:pt-6"
          >
            {still.story}
          </p>
        </div>
        <ol className="sr-only">
          {stills.map((s) => (
            <li key={s.src}>
              <h3>{s.title}</h3>
              <p>
                At {s.at}: {s.story}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
