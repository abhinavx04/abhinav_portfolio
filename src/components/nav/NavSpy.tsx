"use client";

import { useEffect } from "react";
import { nav } from "@/content/site";

/**
 * Marks the nav link for the section in view with aria-current. Renders nothing; keeps the
 * navbar itself a server component. One IntersectionObserver, no scroll listeners.
 */
export function NavSpy() {
  useEffect(() => {
    const sections = nav
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const visible = new Map<string, number>();
    const apply = () => {
      let best: string | null = null;
      let bestRatio = 0;
      for (const [id, ratio] of visible) {
        if (ratio > bestRatio) {
          best = id;
          bestRatio = ratio;
        }
      }
      document.querySelectorAll<HTMLElement>("[data-nav-link]").forEach((a) => {
        if (a.dataset.navLink === best) a.setAttribute("aria-current", "location");
        else a.removeAttribute("aria-current");
      });
    };

    // A band across the middle of the viewport decides which section is "current".
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0);
        apply();
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.01, 0.5, 1] },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return null;
}
