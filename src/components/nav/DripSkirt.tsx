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
          className="absolute -top-px origin-top fill-orange"
          // Never narrower than 9rem: a drip needs a flat-enough sag bottom to hang from.
          style={{
            width: `max(${lobe.w}%, 9rem)`,
            left: `calc(${lobe.x}% - max(${lobe.w}%, 9rem) / 2)`,
            height: lobe.l + 1,
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
            className={`absolute origin-top fill-orange ${drip.phone === false ? "hidden sm:block" : ""}`}
            // Hangs from the lobe's lowest point. Centred with margin, not transform,
            // so motion can own `transform` in Phase 5.
            style={{ left: `${lobe.x}%`, top: lobe.l - 5, marginLeft: -width / 2 }}
          >
            <path d={d} />
          </svg>
        );
      })}
    </div>
  );
}
