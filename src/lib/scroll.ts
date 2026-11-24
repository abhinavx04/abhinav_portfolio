// The site's smooth scroller (Lenis), once MotionField has started it. Anything that scrolls the
// page on purpose (the film timeline, for one) goes through scrollToY, so it moves with the same
// feel as the wheel instead of a second, competing animation.

type SmoothScroller = { scrollTo: (target: number, options?: { duration?: number }) => void };

let scroller: SmoothScroller | null = null;

export function setSmoothScroller(next: SmoothScroller | null) {
  scroller = next;
}

export function scrollToY(y: number) {
  if (scroller) {
    scroller.scrollTo(y, { duration: 1.1 });
    return;
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
}
