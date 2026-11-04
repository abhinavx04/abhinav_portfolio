"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// GSAP, ScrollTrigger and Lenis only drive scroll effects, so they load after the page has settled
// instead of competing with first paint.
const MotionField = dynamic(() => import("./MotionField").then((m) => m.MotionField), { ssr: false });

export function MotionFieldLoader() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let id = 0;
    const go = () => setReady(true);
    const arm = () => {
      if (typeof window.requestIdleCallback === "function") id = window.requestIdleCallback(go, { timeout: 2500 });
      else id = globalThis.setTimeout(go, 1200) as unknown as number;
    };
    // After the load event, then when the browser is idle.
    if (document.readyState === "complete") arm();
    else window.addEventListener("load", arm, { once: true });
    return () => {
      window.removeEventListener("load", arm);
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(id);
      else globalThis.clearTimeout(id);
    };
  }, []);
  return ready ? <MotionField /> : null;
}
