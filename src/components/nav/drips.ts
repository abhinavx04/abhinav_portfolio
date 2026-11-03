// Shape data for the melting orange skirt under the navbar (DESIGN.md, "Signature").
//
// Lobes are soft sags in % of the viewport, so they always overlap at any width.
// Drips hang from the lowest point of a lobe and are fixed in px, so bulbs never stretch.

export type Lobe = { x: number; w: number; l: number };
export type Drip = { lobe: number; w: number; l: number; phone?: boolean };

/** x = centre in %, w = width in %, l = sag depth in px. */
export const LOBES: Lobe[] = [
  { x: 3, w: 15, l: 13 },
  { x: 15.5, w: 14, l: 18 },
  { x: 28.5, w: 15, l: 11 },
  { x: 41, w: 13, l: 20 },
  { x: 54, w: 15, l: 12 },
  { x: 67, w: 14, l: 19 },
  { x: 80, w: 15, l: 14 },
  { x: 93.5, w: 15, l: 17 },
];

/** lobe = index it hangs from, w = neck width px, l = length below the lobe in px. */
export const DRIPS: Drip[] = [
  { lobe: 1, w: 20, l: 60 },
  { lobe: 2, w: 16, l: 30, phone: false },
  { lobe: 3, w: 18, l: 42, phone: false },
  { lobe: 5, w: 22, l: 66 },
  { lobe: 6, w: 16, l: 34, phone: false },
  { lobe: 7, w: 19, l: 48 },
];

/** Lobe path in a 100 x l box (stretched with preserveAspectRatio="none"). */
export function lobePath(l: number) {
  // Flat tangent where it leaves the bar and at its lowest point; 1px band above y=0 hides seams.
  return `M0 0C22 0 30 ${l} 50 ${l}C70 ${l} 78 0 100 0V-1H0Z`;
}

const FILLET = 9;

/** Teardrop drip: soft shoulders, straight neck, bulb ~1.3x the neck. */
export function dripGeometry({ w, l }: Drip): { d: string; width: number; height: number } {
  const r = FILLET;
  const nw = w / 2;
  const br = (w * 1.3) / 2;
  const width = 2 * (nw + r);
  const cx = width / 2;
  const height = r + l;
  const bulbTop = height - 2 * br;
  const f = (n: number) => Math.round(n * 100) / 100;
  const d = [
    `M${f(cx - nw - r)} 0`,
    `Q${f(cx - nw)} 0 ${f(cx - nw)} ${r}`,
    `L${f(cx - nw)} ${f(Math.max(r, bulbTop - 2))}`,
    `C${f(cx - nw)} ${f(bulbTop + br * 0.35)} ${f(cx - br)} ${f(bulbTop + br * 0.5)} ${f(cx - br)} ${f(height - br)}`,
    `A${f(br)} ${f(br)} 0 0 0 ${f(cx + br)} ${f(height - br)}`,
    `C${f(cx + br)} ${f(bulbTop + br * 0.5)} ${f(cx + nw)} ${f(bulbTop + br * 0.35)} ${f(cx + nw)} ${f(Math.max(r, bulbTop - 2))}`,
    `L${f(cx + nw)} ${r}`,
    `Q${f(cx + nw)} 0 ${f(cx + nw + r)} 0`,
    `V-1H${f(cx - nw - r)}Z`,
  ].join("");
  return { d, width, height };
}
