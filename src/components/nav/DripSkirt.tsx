import { DRIPS, LOBES, dripGeometry, lobePath } from "./drips";

/** The melting orange edge under the navbar. Decorative, so hidden from assistive tech. */
export function DripSkirt() {
  return (
    <div
      aria-hidden="true"
      data-drip-skirt
      // overflow-x clip: edge shapes never cause horizontal scroll; overflow-y stays visible.
      className="pointer-events-none relative h-[var(--skirt-h)] overflow-x-clip"
    >
      {LOBES.map((lobe, i) => (
        <svg
          key={`lobe-${i}`}
          data-drip
          viewBox={`0 -1 100 ${lobe.l + 1}`}
          preserveAspectRatio="none"
          className="drip absolute -top-px origin-top fill-orange"
          // Never narrower than 9rem: a drip needs a flat-enough sag bottom to hang from.
          style={{
            width: `max(${lobe.w}%, 9rem)`,
            left: `calc(${lobe.x}% - max(${lobe.w}%, 9rem) / 2)`,
            height: lobe.l + 1,
            // Melt timing (globals.css, .drip): sags first, slightly out of step.
            ["--d" as string]: `${i * 35}ms`,
            ["--t" as string]: "620ms",
          }}
        >
          <path d={lobePath(lobe.l)} />
        </svg>
      ))}

      {DRIPS.map((drip, i) => {
        const { d, width, height } = dripGeometry(drip);
        const lobe = LOBES[drip.lobe];
        return (
          <svg
            key={`drip-${i}`}
            data-drip
            width={width}
            height={height + 1}
            viewBox={`0 -1 ${width} ${height + 1}`}
            className={`drip absolute fill-orange ${drip.phone === false ? "hidden sm:block" : ""}`}
            // Hangs from the lobe's lowest point. Centred with margin, so `transform` is free
            // for the melt. It scales from the bar edge (not its own top) and starts with its
            // lobe, so it never detaches from the sag mid-animation.
            style={{
              left: `${lobe.x}%`,
              top: lobe.l - 5,
              marginLeft: -width / 2,
              transformOrigin: `50% ${-(lobe.l - 5)}px`,
              // Longer drips take longer to ooze down.
              ["--d" as string]: `${drip.lobe * 35 + 40}ms`,
              ["--t" as string]: `${620 + drip.l * 5}ms`,
            }}
          >
            <path d={d} />
          </svg>
        );
      })}
    </div>
  );
}
