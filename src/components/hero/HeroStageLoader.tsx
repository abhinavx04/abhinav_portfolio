"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { onIntroRevealed } from "@/lib/intro";

// The 3D scene (three.js, the models) is its own chunk: it never loads for visitors who won't see it.
const HeroStage = dynamic(() => import("./HeroStage"), { ssr: false });

function canRun3D() {
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
    if (nav.connection?.saveData) return false;
    if ((nav.hardwareConcurrency ?? 4) < 4 || (nav.deviceMemory ?? 8) < 4) return false;
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Lays the live 3D crew over the still image in the hero. The still is what everyone sees first (and what
 * reduced-motion, data-saver and low-power visitors keep); the scene starts after the intro, when the
 * browser is idle, and fades in over it once its first frames are drawn.
 */
export function HeroStageLoader() {
  const box = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState(false);
  const [visible, setVisible] = useState(true);
  const [shown, setShown] = useState(false);
  const gaveUp = useRef(false);

  useEffect(() => {
    if (!canRun3D() || gaveUp.current) return;
    let cancel = () => {};
    const stop = onIntroRevealed(() => {
      // Start on the visitor's first move, tap, scroll or key press (or after 8s): the page itself loads
      // first, and the ~1 MB of 3D code never competes with it.
      const events = ["pointermove", "pointerdown", "scroll", "keydown", "touchstart"] as const;
      let started = false;
      let timer = 0;
      const start = () => {
        if (started) return;
        started = true;
        events.forEach((e) => window.removeEventListener(e, start));
        globalThis.clearTimeout(timer);
        const go = () => setMount(true);
        if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(go, { timeout: 1500 });
        else globalThis.setTimeout(go, 300);
      };
      events.forEach((e) => window.addEventListener(e, start, { passive: true, once: true }));
      timer = globalThis.setTimeout(start, 8000) as unknown as number;
      cancel = () => {
        started = true;
        events.forEach((e) => window.removeEventListener(e, start));
        globalThis.clearTimeout(timer);
      };
    });
    return () => {
      stop();
      cancel();
    };
  }, []);

  // Stop drawing when the hero is off screen.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={box}
      aria-hidden="true"
      className={`absolute inset-0 transition-opacity duration-[900ms] ease-out ${shown ? "opacity-100" : "opacity-0"}`}
    >
      {mount && (
        <HeroStage
          active={visible}
          // ?stage=force keeps the scene on whatever the machine (used for testing without a GPU).
          onSlow={
            typeof window !== "undefined" && window.location.search.includes("stage=force")
              ? undefined
              : () => {
                  gaveUp.current = true;
                  setMount(false);
                  setShown(false);
                  box.current?.closest("[data-hero-plate]")?.removeAttribute("data-stage");
                }
          }
          onReady={() => {
            setShown(true);
            // The still steps aside once the live scene is on screen.
            box.current?.closest("[data-hero-plate]")?.setAttribute("data-stage", "on");
          }}
        />
      )}
    </div>
  );
}
