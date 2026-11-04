// Shared intro state. The decision is made once, before first paint, by INTRO_SCRIPT (inlined in
// <head>), and exposed as window.__intro so client code never has to guess.

export const INTRO_KEY = "runtime-intro-seen";
export const REVEALED_EVENT = "intro:revealed";

export type IntroMode = "play" | "skip";

declare global {
  interface Window {
    __intro?: IntroMode;
    __introDone?: boolean;
  }
}

/**
 * Runs synchronously in <head>. Plays the intro only on "/" for first-time visitors without
 * reduced motion. ?intro=play forces it (Replay intro); ?intro=skip suppresses it (testing,
 * resume links). Storage errors fall back to "skip" so the page is never blocked.
 */
export const INTRO_SCRIPT = `(function(){var m="skip";try{var q=new URLSearchParams(location.search).get("intro");if(location.pathname==="/"){if(q==="play")m="play";else if(q!=="skip"&&!localStorage.getItem("${INTRO_KEY}")&&!matchMedia("(prefers-reduced-motion: reduce)").matches)m="play"}}catch(e){}window.__intro=m;document.documentElement.setAttribute("data-intro",m)})()`;

export function markIntroSeen() {
  try {
    localStorage.setItem(INTRO_KEY, "1");
  } catch {
    // Storage unavailable (private mode, blocked cookies): the intro may show again. Harmless.
  }
}

export function forgetIntro() {
  try {
    localStorage.removeItem(INTRO_KEY);
  } catch {
    // See markIntroSeen.
  }
}

/** Calls `cb` once the page is revealed: immediately if there is no intro or it already ended. */
export function onIntroRevealed(cb: () => void): () => void {
  if (window.__intro !== "play" || window.__introDone) {
    cb();
    return () => {};
  }
  window.addEventListener(REVEALED_EVENT, cb, { once: true });
  return () => window.removeEventListener(REVEALED_EVENT, cb);
}
