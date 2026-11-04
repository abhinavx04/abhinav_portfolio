"use client";

import { motion, useReducedMotion } from "motion/react";
import type { TimelineItem } from "@/content/timeline";

const DRAW = 1.4; // seconds for the line to reach the last milestone
const ease = [0.2, 0, 0, 1] as const;

/**
 * Signature animation 6.4: a solid 2px orange line draws top to bottom when the timeline enters
 * the viewport, and each milestone appears as the line reaches it.
 */
export function Timeline({ items }: { items: TimelineItem[] }) {
  const reduced = useReducedMotion();
  const last = Math.max(items.length - 1, 1);

  return (
    <motion.div
      className="relative mt-6"
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.25 }}
    >
      <motion.span
        aria-hidden="true"
        data-reveal
        className="absolute bottom-2 left-[4.25rem] top-2 w-0.5 origin-top bg-orange sm:left-[5.25rem]"
        variants={
          reduced
            ? { hidden: { opacity: 0, scaleY: 1 }, shown: { opacity: 1, scaleY: 1, transition: { duration: 0.2 } } }
            : { hidden: { scaleY: 0 }, shown: { scaleY: 1, transition: { duration: DRAW, ease: "linear" } } }
        }
      />
      <ol className="flex flex-col gap-9">
        {items.map((t, i) => (
          <motion.li
            key={i}
            data-reveal
            className="grid grid-cols-[4.25rem_1fr] sm:grid-cols-[5.25rem_1fr]"
            variants={
              reduced
                ? { hidden: { opacity: 0, x: 0 }, shown: { opacity: 1, x: 0, transition: { duration: 0.2 } } }
                : {
                    hidden: { opacity: 0, x: -10 },
                    // Appears when the linear line reaches it (milestones are evenly spaced).
                    shown: { opacity: 1, x: 0, transition: { duration: 0.45, ease, delay: (i / last) * DRAW * 0.92 } },
                  }
            }
          >
            <span className="pt-0.5 text-ui font-black uppercase tabular-nums text-orange">{t.year}</span>
            <div className="relative pl-7">
              <span
                aria-hidden="true"
                className="absolute -left-[5px] top-1.5 size-3 rounded-full border-2 border-orange bg-bg"
              />
              <p className="font-semibold leading-snug text-text">{t.title}</p>
              <p className="text-text-muted">{t.org}</p>
              {t.period && <p className="mt-1 text-ui text-text-muted">{t.period}</p>}
              {t.detail && <p className="mt-2 text-text-muted">{t.detail}</p>}
            </div>
          </motion.li>
        ))}
      </ol>
    </motion.div>
  );
}
