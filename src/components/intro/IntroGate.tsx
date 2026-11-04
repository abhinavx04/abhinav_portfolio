"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

// The intro is code-split: returning visitors and crawlers never download it.
const IntroSequence = dynamic(() => import("./IntroSequence"), { ssr: false });

const subscribe = () => () => {};
const getSnapshot = () => window.__intro === "play" && !window.__introDone;
const getServerSnapshot = () => false;

/**
 * Mounts the intro only when the pre-paint script decided to play it. Portalled to <body>:
 * the intro makes <main> inert while it runs, so it must not live inside <main> itself.
 */
export function IntroGate() {
  const play = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return play ? createPortal(<IntroSequence />, document.body) : null;
}
