"use client";

import { useEffect } from "react";

/**
 * Collapses the drip navbar once the page leaves the top (signature animation 6.2, second half).
 * One IntersectionObserver on a sentinel at the top of the page: no scroll listeners. The drips
 * themselves retract and return with a CSS transition, which reverses from wherever it is.
 */
export function NavScroll() {
  useEffect(() => {
    const sentinel = document.querySelector("[data-top-sentinel]");
    const header = document.querySelector<HTMLElement>("header[data-navbar]");
    if (!sentinel || !header) return;
    const io = new IntersectionObserver(([entry]) => {
      header.toggleAttribute("data-collapsed", !entry.isIntersecting);
    });
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);
  return null;
}
