// Flat placeholder figures, used until the real cut-outs exist in public/crew/.
// Same characters and colours as the film; deliberately simple shapes, no logos.

const SNEAKER = "#F4F4F2";
const INK = "#0B0B0F";

function Sneakers({ y, xs }: { y: number; xs: [number, number] }) {
  return (
    <g fill={SNEAKER}>
      {xs.map((x) => (
        <rect key={x} x={x} y={y} width="30" height="13" rx="6.5" />
      ))}
    </g>
  );
}

/** Me: vinyl toy, curly black hair, black hoodie, white sneakers, glass of chai. */
export function DirectorFigure() {
  return (
    <svg viewBox="0 0 200 250" className="h-full w-full" aria-hidden="true">
      {/* legs + sneakers */}
      <rect x="74" y="190" width="20" height="34" fill="#2A2A33" />
      <rect x="106" y="190" width="20" height="34" fill="#2A2A33" />
      <Sneakers y={220} xs={[68, 102]} />
      {/* hoodie */}
      <rect x="54" y="118" width="92" height="80" rx="22" fill="#050507" stroke="#2E2E38" strokeWidth="2" />
      <path d="M92 124v18M108 124v18" stroke={SNEAKER} strokeWidth="2.5" strokeLinecap="round" />
      {/* arm holding chai */}
      <rect x="132" y="130" width="22" height="46" rx="11" fill="#050507" stroke="#2E2E38" strokeWidth="2" />
      <path d="M140 150h24l-3 30h-18z" fill="#C98A4B" />
      <path d="M140 150h24l-1 7h-22z" fill="#F4E3C3" />
      {/* head */}
      <rect x="62" y="44" width="76" height="76" rx="30" fill="#B07A55" />
      <circle cx="86" cy="86" r="4.5" fill={INK} />
      <circle cx="114" cy="86" r="4.5" fill={INK} />
      <path d="M92 101q8 6 16 0" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* curly hair */}
      <g fill="#0E0E12">
        {[66, 80, 94, 108, 122, 134].map((x, i) => (
          <circle key={x} cx={x} cy={i % 2 ? 46 : 52} r="13" />
        ))}
        {[73, 88, 103, 118, 130].map((x) => (
          <circle key={x} cx={x} cy="36" r="12" />
        ))}
      </g>
    </svg>
  );
}

/** Claude Code: cream retro CRT-TV robot, terracotta screen face, knob antenna. */
export function ThinkerFigure() {
  return (
    <svg viewBox="0 0 200 250" className="h-full w-full" aria-hidden="true">
      {/* antenna */}
      <path d="M100 52V26" stroke="#EFE6D2" strokeWidth="4" strokeLinecap="round" />
      <circle cx="100" cy="22" r="8" fill="#EFE6D2" />
      {/* chunky legs + sneakers */}
      <rect x="70" y="178" width="24" height="44" rx="6" fill="#EFE6D2" />
      <rect x="106" y="178" width="24" height="44" rx="6" fill="#EFE6D2" />
      <Sneakers y={218} xs={[67, 103]} />
      {/* TV body */}
      <rect x="40" y="52" width="120" height="132" rx="20" fill="#EFE6D2" />
      <circle cx="138" cy="164" r="6" fill="#CFC4AC" />
      <circle cx="120" cy="164" r="6" fill="#CFC4AC" />
      {/* screen face */}
      <rect x="54" y="66" width="92" height="82" rx="14" fill="#D97757" />
      <circle cx="84" cy="100" r="6" fill="#1A1A1A" />
      <circle cx="116" cy="100" r="6" fill="#1A1A1A" />
      <path d="M90 118q10 8 20 0" stroke="#1A1A1A" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** Codex: violet juice box, big round eyes, striped bendy straw, noodle limbs. */
export function SpeedsterFigure() {
  return (
    <svg viewBox="0 0 200 250" className="h-full w-full" aria-hidden="true">
      {/* noodle arms and legs */}
      <g stroke="#B9A1FA" strokeWidth="5" fill="none" strokeLinecap="round">
        <path d="M58 132q-22 10-26 34" />
        <path d="M142 132q22-6 28-30" />
        <path d="M82 190q-4 18-6 30" />
        <path d="M118 190q4 18 8 30" />
      </g>
      <Sneakers y={218} xs={[60, 110]} />
      {/* straw: bendy, purple and white stripes */}
      <g strokeWidth="7" fill="none" strokeLinecap="round">
        <path d="M120 70V40q0-10 10-14l18-8" stroke="#F4F4F2" />
        <path d="M120 70V40q0-10 10-14l18-8" stroke="#8B5CF6" strokeDasharray="7 7" />
      </g>
      {/* box */}
      <rect x="56" y="66" width="88" height="128" rx="8" fill="#8B5CF6" />
      <path d="M56 74l10-14h68l10 14z" fill="#7445E8" />
      {/* big round eyes */}
      <circle cx="84" cy="116" r="15" fill="#F4F4F2" />
      <circle cx="116" cy="116" r="15" fill="#F4F4F2" />
      <circle cx="87" cy="119" r="7" fill={INK} />
      <circle cx="119" cy="119" r="7" fill={INK} />
      <path d="M90 150q10 7 20 0" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}
