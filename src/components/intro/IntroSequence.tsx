"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { animate, motion, useMotionTemplate, useMotionValue, useReducedMotion } from "motion/react";
import { Volume2 } from "lucide-react";
import { REVEALED_EVENT, markIntroSeen } from "@/lib/intro";

type Stage = "loading" | "film" | "orb";

const FILMS = [
  { src: "/intro/intro.webm", type: 'video/webm; codecs="vp9, opus"' },
  { src: "/intro/intro.mp4", type: 'video/mp4; codecs="avc1.640028, mp4a.40.2"' },
];
const MIN_LOADER_MS = 1800; // the line never rushes, even on a fast connection
const BEHIND = ["#main", "header[data-navbar]", "footer", "a[href='#main']"];

const ease = [0.2, 0, 0, 1] as const; // the site's "settle" curve
const expandEase = [0.7, 0, 0.2, 1] as const; // slow start, fast middle, hard stop

/**
 * Loading line (downloads the whole film) → film → orange orb reveal → removed from the DOM.
 * The line's progress is the real download progress, so the film never stalls once it starts.
 * Sound needs a gesture: a tap or key press during the loader gives it; otherwise the film plays
 * muted (it has burned-in subtitles) with a "Tap for sound" button.
 * The landing page is already rendered underneath; this layer only covers it.
 * Esc at any point skips straight to the page.
 */
export default function IntroSequence() {
  const [stage, setStage] = useState<Stage>("loading");
  const [fromFilm, setFromFilm] = useState(false); // the orb grows over the film's last frame
  const [filmUrl, setFilmUrl] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const [done, setDone] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const finished = useRef(false);
  const reduced = useReducedMotion();

  // Loader line: 0 → 1 across the screen.
  const progress = useMotionValue(0);
  const lineOpacity = useMotionValue(1);

  // Orb: orange disc radius, and the radius of the hole that shows the live page.
  const orange = useMotionValue(0);
  const hole = useMotionValue(-1); // starts just below 0 so no 1px dot shows before the reveal
  const overlayOpacity = useMotionValue(1);
  const clipPath = useMotionTemplate`circle(${orange}px at 50% 50%)`;
  const mask = useMotionTemplate`radial-gradient(circle at 50% 50%, transparent ${hole}px, #000 calc(${hole}px + 1px))`;

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    video.current?.pause();
    markIntroSeen();
    for (const sel of BEHIND) document.querySelector(sel)?.removeAttribute("inert");
    document.documentElement.setAttribute("data-intro", "done");
    window.__introDone = true;
    // Drop ?intro=play / ?intro=skip so a refresh or a shared link behaves normally.
    const url = new URL(window.location.href);
    if (url.searchParams.has("intro")) {
      url.searchParams.delete("intro");
      window.history.replaceState(null, "", url.pathname + url.search + url.hash);
    }
    window.dispatchEvent(new Event(REVEALED_EVENT));
    setDone(true);
  }, []);

  const startOrb = useCallback(
    async (afterFilm = false) => {
      if (finished.current) return;
      video.current?.pause();
      setFromFilm(afterFilm);
      setStage("orb");
      animate(lineOpacity, 0, { duration: 0.2, ease });

      if (reduced) {
        await animate(overlayOpacity, 0, { duration: 0.3, ease });
        finish();
        return;
      }

      const cover = Math.hypot(window.innerWidth, window.innerHeight) / 2 + 24;
      // 1. A small orange circle appears in the centre.
      await animate(orange, 44, { type: "spring", bounce: 0, duration: 0.45 });
      // 2. One pulse.
      await animate(orange, [44, 58, 44], { duration: 0.42, ease, times: [0, 0.45, 1] });
      // 3. It expands to cover the screen; the page opens up just behind its edge.
      await Promise.all([
        animate(orange, cover, { duration: 0.95, ease: expandEase }),
        animate(hole, cover, { duration: 0.95, ease: expandEase, delay: 0.14 }),
      ]);
      finish();
    },
    [finish, hole, lineOpacity, orange, overlayOpacity, reduced],
  );

  // Lock the page underneath while the intro runs.
  useEffect(() => {
    document.documentElement.setAttribute("data-intro", "running");
    for (const sel of BEHIND) document.querySelector(sel)?.setAttribute("inert", "");
    // Focus the dialog itself: keyboard users start inside it, with no ring pulling the eye off the line.
    dialog.current?.focus();
    return () => {
      for (const sel of BEHIND) document.querySelector(sel)?.removeAttribute("inert");
    };
  }, []);

  // Esc skips everything, from any stage.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [finish]);

  // Download the whole film while the line runs. The line follows the real bytes, smoothed,
  // and takes at least MIN_LOADER_MS.
  useEffect(() => {
    const ctrl = new AbortController();
    const probe = document.createElement("video");
    const film = FILMS.find((f) => probe.canPlayType(f.type)) ?? FILMS[FILMS.length - 1];
    let loaded = 0;
    let blobUrl: string | null = null;
    let raf = 0;
    const t0 = performance.now();

    const tick = () => {
      const time = Math.min((performance.now() - t0) / MIN_LOADER_MS, 1);
      const target = Math.min(loaded, time);
      const cur = progress.get();
      const next = target >= 1 && cur > 0.995 ? 1 : cur + (target - cur) * 0.08;
      progress.set(next);
      if (next >= 1 && blobUrl) {
        setFilmUrl(blobUrl);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    (async () => {
      try {
        const res = await fetch(film.src, { signal: ctrl.signal });
        if (!res.ok || !res.body) throw new Error(`film ${res.status}`);
        const total = Number(res.headers.get("content-length")) || 0;
        const reader = res.body.getReader();
        const chunks: Uint8Array<ArrayBuffer>[] = [];
        let got = 0;
        for (;;) {
          const { done: end, value } = await reader.read();
          if (end) break;
          chunks.push(value);
          got += value.length;
          // Without a length the line creeps towards the end instead of jumping.
          loaded = total ? Math.min(got / total, 0.999) : 1 - 1 / (1 + got / 2_000_000);
        }
        blobUrl = URL.createObjectURL(new Blob(chunks, { type: film.type.split(";")[0] }));
        loaded = 1;
      } catch {
        if (ctrl.signal.aborted) return;
        // No film: skip straight to the orb.
        cancelAnimationFrame(raf);
        startOrb();
      }
    })();

    return () => {
      ctrl.abort();
      cancelAnimationFrame(raf);
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [progress, startOrb]);

  // Film downloaded: fade the line out and play. With no earlier tap, browsers block sound,
  // so fall back to muted with a "Tap for sound" button.
  useEffect(() => {
    const v = video.current;
    if (!filmUrl || !v || finished.current) return;
    animate(lineOpacity, 0, { duration: 0.35, ease });
    v.src = filmUrl;
    v.muted = false;
    v.play().then(
      () => {
        setMuted(false);
        setStage("film");
      },
      () => {
        v.muted = true;
        setMuted(true);
        v.play().then(
          () => setStage("film"),
          () => startOrb(),
        );
      },
    );
  }, [filmUrl, lineOpacity, startOrb]);

  function unmute() {
    const v = video.current;
    if (!v) return;
    v.muted = false;
    setMuted(false);
  }

  if (done) return null;

  const showVideo = stage === "film" || (stage === "orb" && fromFilm);

  return (
    <motion.div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-label="Intro"
      tabIndex={-1}
      className="fixed inset-0 z-[101] overflow-hidden outline-none"
      style={{
        opacity: overlayOpacity,
        maskImage: stage === "orb" && !reduced ? mask : undefined,
        WebkitMaskImage: stage === "orb" && !reduced ? mask : undefined,
      }}
    >
      <div className="absolute inset-0 bg-black" />

      <video
        ref={video}
        className={`intro-video absolute inset-0 h-full w-full bg-black transition-opacity duration-500 ${showVideo ? "opacity-100" : "opacity-0"}`}
        playsInline
        preload="none"
        onEnded={() => startOrb(true)}
        aria-hidden={stage !== "film"}
      />

      {/* Loader: one hairline drawn across the screen as the film downloads. */}
      <motion.div
        role="progressbar"
        aria-label="Loading intro"
        aria-valuemin={0}
        aria-valuemax={100}
        className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2"
        style={{ opacity: lineOpacity }}
      >
        <motion.div className="h-full origin-left bg-orange" style={{ scaleX: progress }} />
      </motion.div>

      <div className="absolute bottom-5 right-5 flex items-center gap-3 sm:bottom-6 sm:right-6">
        {stage === "film" && muted && (
          <button
            type="button"
            onClick={unmute}
            className="press inline-flex items-center gap-2 rounded-ui bg-text px-4 py-2.5 text-ui font-semibold text-bg"
          >
            <Volume2 aria-hidden="true" className="size-4" />
            Tap for sound
          </button>
        )}
        {stage !== "orb" && (
          <button
            type="button"
            onClick={() => startOrb()}
            className="press rounded-ui bg-bg px-4 py-2.5 text-ui font-semibold text-text ring-1 ring-border transition-colors hover:bg-surface"
          >
            Skip intro
          </button>
        )}
      </div>

      {/* Orange disc: grows from the centre during the orb stage. */}
      <motion.div aria-hidden="true" className="absolute inset-0 bg-orange" style={{ clipPath }} />
    </motion.div>
  );
}
