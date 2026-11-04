"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { animate, motion, useMotionTemplate, useMotionValue, useReducedMotion } from "motion/react";
import { Volume2 } from "lucide-react";
import { REVEALED_EVENT, markIntroSeen } from "@/lib/intro";

type Stage = "splash" | "film" | "card" | "orb";

const ENTER = "ENTER MY WORLD";
const AUTOPLAY_AFTER_MS = 6000;
const BEHIND = ["#main", "header[data-navbar]", "footer", "a[href='#main']"];

const ease = [0.2, 0, 0, 1] as const; // the site's "settle" curve
const expandEase = [0.7, 0, 0.2, 1] as const; // slow start, fast middle, hard stop

/**
 * Splash ("Play intro") → film → "ENTER MY WORLD" → orange orb reveal → removed from the DOM.
 * The landing page is already rendered underneath; this layer only covers it.
 * Esc at any point skips straight to the page.
 */
export default function IntroSequence() {
  const [stage, setStage] = useState<Stage>("splash");
  const [muted, setMuted] = useState(false);
  const [done, setDone] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const interacted = useRef(false);
  const finished = useRef(false);
  const reduced = useReducedMotion();

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

  const startOrb = useCallback(async () => {
    if (finished.current) return;
    interacted.current = true;
    video.current?.pause();
    setStage("orb");

    if (reduced) {
      await animate(overlayOpacity, 0, { duration: 0.3, ease });
      finish();
      return;
    }

    const cover = Math.hypot(window.innerWidth, window.innerHeight) / 2 + 24;
    // 1. The words collapse into a small orange circle.
    await animate(orange, 44, { type: "spring", bounce: 0, duration: 0.45 });
    // 2. One pulse.
    await animate(orange, [44, 58, 44], { duration: 0.42, ease, times: [0, 0.45, 1] });
    // 3. It expands to cover the screen; the page opens up just behind its edge.
    await Promise.all([
      animate(orange, cover, { duration: 0.95, ease: expandEase }),
      animate(hole, cover, { duration: 0.95, ease: expandEase, delay: 0.14 }),
    ]);
    finish();
  }, [finish, hole, orange, overlayOpacity, reduced]);

  const toCard = useCallback(() => {
    if (finished.current) return;
    video.current?.pause();
    setStage((s) => (s === "orb" ? s : "card"));
  }, []);

  // Lock the page underneath while the intro runs.
  useEffect(() => {
    document.documentElement.setAttribute("data-intro", "running");
    for (const sel of BEHIND) document.querySelector(sel)?.setAttribute("inert", "");
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

  // A missing or broken video goes straight to the "ENTER MY WORLD" card.
  useEffect(() => {
    const v = video.current;
    const sources = v?.querySelectorAll("source");
    const last = sources?.[sources.length - 1];
    if (!v || !last) return;
    last.addEventListener("error", toCard);
    v.addEventListener("error", toCard);
    // The error may have fired before hydration attached the listener.
    if (v.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) toCard();
    return () => {
      last.removeEventListener("error", toCard);
      v.removeEventListener("error", toCard);
    };
  }, [toCard]);

  // Nobody tapped within 6s: start the film muted and offer sound.
  useEffect(() => {
    if (stage !== "splash") return;
    const t = window.setTimeout(() => {
      const v = video.current;
      if (interacted.current || !v) return;
      v.muted = true;
      setMuted(true);
      v.play().then(
        () => setStage("film"),
        () => {}, // autoplay blocked even muted: stay on the splash
      );
    }, AUTOPLAY_AFTER_MS);
    return () => window.clearTimeout(t);
  }, [stage]);

  function playWithSound() {
    const v = video.current;
    interacted.current = true;
    if (!v) return toCard();
    v.muted = false;
    setMuted(false);
    setStage("film");
    // play() must be called inside the click for sound to be allowed.
    v.play().catch(() => {
      v.muted = true;
      setMuted(true);
      v.play().catch(toCard);
    });
  }

  function unmute() {
    const v = video.current;
    if (!v) return;
    v.muted = false;
    setMuted(false);
  }

  if (done) return null;

  const showVideo = stage === "splash" || stage === "film";

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Intro"
      className="fixed inset-0 z-[101] overflow-hidden"
      style={{
        opacity: overlayOpacity,
        maskImage: stage === "orb" && !reduced ? mask : undefined,
        WebkitMaskImage: stage === "orb" && !reduced ? mask : undefined,
      }}
    >
      <div className="absolute inset-0 bg-black" />

      {showVideo && (
        <video
          ref={video}
          className={`intro-video absolute inset-0 h-full w-full bg-black ${stage === "film" ? "opacity-100" : "opacity-0"}`}
          preload="metadata"
          playsInline
          poster="/intro/poster.webp"
          onEnded={toCard}
          aria-hidden={stage !== "film"}
        >
          <source src="/intro/intro.webm" type="video/webm" />
          <source src="/intro/intro.mp4" type="video/mp4" />
        </video>
      )}

      {stage === "splash" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 px-6 text-text">
          <button
            type="button"
            onClick={playWithSound}
            autoFocus
            className="press rounded-ui border-2 border-text px-8 py-4 text-ui font-black uppercase tracking-[0.08em] transition-colors duration-200 hover:bg-text hover:text-bg sm:text-body"
          >
            <span aria-hidden="true">▶&nbsp;&nbsp;</span>Play intro
          </button>
          <p className="max-w-[30ch] text-center text-ui text-text-muted">43 seconds, with sound.</p>
          <button
            type="button"
            onClick={startOrb}
            className="absolute bottom-6 right-6 py-2 text-ui font-semibold text-text-muted underline underline-offset-4 transition-colors hover:text-text"
          >
            Skip
          </button>
        </div>
      )}

      {stage === "film" && (
        <div className="absolute bottom-5 right-5 flex items-center gap-3 sm:bottom-6 sm:right-6">
          {muted && (
            <button
              type="button"
              onClick={unmute}
              className="press inline-flex items-center gap-2 rounded-ui bg-text px-4 py-2.5 text-ui font-semibold text-bg"
            >
              <Volume2 aria-hidden="true" className="size-4" />
              Tap for sound
            </button>
          )}
          <button
            type="button"
            onClick={startOrb}
            className="press rounded-ui bg-bg px-4 py-2.5 text-ui font-semibold text-text ring-1 ring-border transition-colors hover:bg-surface"
          >
            Skip intro
          </button>
        </div>
      )}

      {/* Orange disc: grows from the centre during the orb stage. */}
      <motion.div aria-hidden="true" className="absolute inset-0 bg-orange" style={{ clipPath }} />

      {(stage === "card" || stage === "orb") && (
        <div className="absolute inset-0 grid place-items-center px-6">
          <button
            type="button"
            onClick={startOrb}
            disabled={stage === "orb"}
            autoFocus
            aria-label="Enter my world"
            className="press text-center text-[clamp(2.25rem,8vw,6.5rem)] font-black uppercase leading-[0.9] tracking-[-0.035em] text-text"
          >
            {ENTER.split(" ").map((word, w, words) => (
              <span key={w} className="inline-block whitespace-nowrap">
                {[...word].map((ch, i) => {
                  const index = words.slice(0, w).join("").length + i;
                  return (
                    <motion.span
                      key={i}
                      aria-hidden="true"
                      className="inline-block"
                      initial={{ opacity: 0 }}
                      animate={
                        stage === "orb"
                          ? { opacity: 0, scale: 0.2, transition: { duration: 0.25, ease } }
                          : { opacity: 1, transition: { duration: 0.35, ease, delay: 0.15 + index * 0.045 } }
                      }
                    >
                      {ch}
                    </motion.span>
                  );
                })}
                {w < words.length - 1 && <span aria-hidden="true">&nbsp;</span>}
              </span>
            ))}
          </button>
        </div>
      )}
    </motion.div>
  );
}
