"use client";

import { forgetIntro } from "@/lib/intro";

/** Footer link: full reload with ?intro=play so the pre-paint script runs the intro again. */
export function ReplayIntro() {
  return (
    <button
      type="button"
      onClick={() => {
        forgetIntro();
        // A full reload is required: the intro decision is made by the pre-paint script in
        // <head>, which a client-side router push would not re-run.
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.assign("/?intro=play");
      }}
      className="py-2 text-left font-semibold text-text underline decoration-border decoration-2 underline-offset-4 transition-colors duration-200 hover:decoration-orange"
    >
      Replay intro
    </button>
  );
}
