"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

type From = "below" | "left" | "right";

const OFFSET: Record<From, { x?: number; y?: number }> = {
  below: { y: 140 },
  left: { x: -180 },
  right: { x: 180 },
};

// One shared clock: every card lands at the same instant and stops dead (DESIGN.md motion verb).
const LOCK = { duration: 0.7, ease: [0.2, 0, 0, 1] } as const;

/** Signature animation 6.3: the crew slides in from three directions and locks into a row. */
export function AssembleGroup({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <motion.ul
      className={className}
      initial="apart"
      whileInView="together"
      viewport={{ once: true, amount: 0.3 }}
    >
      {children}
    </motion.ul>
  );
}

export function AssembleItem({
  from,
  className,
  children,
  ...rest
}: { from: From; className?: string; children: React.ReactNode } & Record<`data-${string}`, string>) {
  const reduced = useReducedMotion();
  const variants: Variants = reduced
    ? // x/y are reset explicitly: the server renders the full-motion start position.
      { apart: { opacity: 0, x: 0, y: 0 }, together: { opacity: 1, x: 0, y: 0, transition: { duration: 0.2 } } }
    : {
        // Not clickable while offset: an invisible card must not cover the section below it.
        apart: { opacity: 0, pointerEvents: "none", ...OFFSET[from] },
        together: { opacity: 1, x: 0, y: 0, pointerEvents: "auto", transition: LOCK },
      };
  return (
    <motion.li variants={variants} className={className} data-reveal {...rest}>
      {children}
    </motion.li>
  );
}
