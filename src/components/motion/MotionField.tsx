"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { onIntroRevealed } from "@/lib/intro";

/**
 * One motion layer for the whole site, on one clock (GSAP's ticker):
 *  - Lenis smooth scroll, paused while the intro covers the page.
 *  - [data-parallax="0.2"]   vertical depth: positive drifts behind (slower), negative comes forward.
 *                            0 offset when its scope is centred in the viewport, so nothing is shifted
 *                            at load for a section that starts on screen.
 *  - [data-parallax-x="0.3"] horizontal drift with scroll (film strip, marquee rows); sign = direction.
 *  - [data-tilt]             follows the pointer a few degrees (fine pointers only).
 * A scope is the closest [data-parallax-scope] ancestor, else the element itself.
 * Everything is off under reduced motion: no smooth scroll, no parallax, no tilt.
 */
export function MotionField() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const lenis = new Lenis({ anchors: true, lerp: 0.11, wheelMultiplier: 0.95 });
      lenis.on("scroll", ScrollTrigger.update);
      const raf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      // The intro locks the page: keep Lenis still until the orb has opened it.
      const html = document.documentElement;
      if (html.dataset.intro === "play" || html.dataset.intro === "running") lenis.stop();
      const stopWaiting = onIntroRevealed(() => {
        lenis.start();
        ScrollTrigger.refresh();
      });

      const scopeOf = (el: Element) => el.closest("[data-parallax-scope]") ?? el;

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const speed = parseFloat(el.dataset.parallax ?? "0");
        const range = () => window.innerHeight * 0.35 * speed;
        gsap.fromTo(
          el,
          { y: () => -range() },
          {
            y: () => range(),
            ease: "none",
            scrollTrigger: { trigger: scopeOf(el), start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax-x]").forEach((el) => {
        const speed = parseFloat(el.dataset.parallaxX ?? "0");
        const range = () => window.innerWidth * 0.5 * speed;
        gsap.fromTo(
          el,
          { x: () => range() },
          {
            x: () => -range(),
            ease: "none",
            scrollTrigger: { trigger: scopeOf(el), start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true },
          },
        );
      });

      let untilt = () => {};
      if (window.matchMedia("(pointer: fine)").matches) {
        const tilts = gsap.utils.toArray<HTMLElement>("[data-tilt]").map((el) => ({
          rx: gsap.quickTo(el, "rotationX", { duration: 0.9, ease: "power3.out" }),
          ry: gsap.quickTo(el, "rotationY", { duration: 0.9, ease: "power3.out" }),
          tx: gsap.quickTo(el, "x", { duration: 1.1, ease: "power3.out" }),
          deg: parseFloat(el.dataset.tilt || "6"),
        }));
        gsap.set("[data-tilt]", { transformPerspective: 1100 });
        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          for (const t of tilts) {
            t.ry(nx * t.deg);
            t.rx(-ny * t.deg * 0.6);
            t.tx(nx * t.deg * 3);
          }
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        untilt = () => window.removeEventListener("pointermove", onMove);
      }

      return () => {
        untilt();
        stopWaiting();
        gsap.ticker.remove(raf);
        lenis.destroy();
      };
    });

    return () => mm.revert();
  }, []);

  return null;
}
