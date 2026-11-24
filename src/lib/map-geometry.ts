// Cottonwood's mock geography, in metres on a flat local grid with the site's
// centre at 0,0 (x east, y south, like SVG). Every static map in the prototype
// (Site Boundary, Proximity, Geospatial) draws from these, so the site, the
// creek and the roads sit in the same place on every step.
//
// The site polygon is the Gold Site Boundary shape scaled so its area is
// 359 ac (1,452,800 m²). Everything else is illustrative.

export type Pt = [number, number];

export const MI = 1609.344;

/** Site boundary, clockwise from the north-west corner. */
export const SITE: Pt[] = [
  [-758, -621], [-57, -621], [-57, -578], [636, -578], [644, -26], [610, 50],
  [572, 135], [610, 603], [92, 628], [-142, 467], [-197, 263], [-426, 280],
  [-741, 246], [-787, -247],
];

/** The four parcels the boundary is made of (APN order of the mock data). */
export const PARCELS: { apn: string; pts: Pt[]; label: Pt }[] = [
  { apn: '134-0120-012-0000', pts: [[-758, -621], [-57, -621], [-57, -578], [50, -578], [50, 0], [-787, 0], [-787, -247]], label: [-360, -300] },
  { apn: '134-0120-018-0000', pts: [[50, -578], [636, -578], [644, -26], [630, 0], [50, 0]], label: [340, -300] },
  { apn: '134-0130-004-0000', pts: [[50, 0], [630, 0], [610, 50], [572, 135], [610, 603], [92, 628], [-142, 467], [-160, 300], [50, 300]], label: [330, 330] },
  { apn: '134-0130-009-0000', pts: [[-787, 0], [50, 0], [50, 300], [-160, 300], [-197, 263], [-426, 280], [-741, 246]], label: [-420, 140] },
];

/** Neighbouring parcels shown in Select Parcels mode (not in the site). */
export const NEIGHBOR_PARCELS: { apn: string; acres: number; pts: Pt[]; label: Pt }[] = [
  { apn: '134-0120-021-0000', acres: 74.6, pts: [[-1100, -980], [-57, -980], [-57, -621], [-758, -621], [-1100, -621]], label: [-560, -800] },
  { apn: '134-0130-015-0000', acres: 88.3, pts: [[644, -578], [1000, -578], [1000, 135], [572, 135], [610, 50], [644, -26]], label: [810, -230] },
  { apn: '134-0130-022-0000', acres: 52.1, pts: [[-1100, 246], [-741, 246], [-426, 280], [-197, 263], [-142, 467], [-1100, 467]], label: [-640, 370] },
];

/** Polyline features. */
export const CREEK: Pt[] = [
  [-14000, -9800], [-8000, -6600], [-3600, -3300], [-2400, -2300], [-1500, -1500], [-900, -900], [-500, -420],
  [-150, -180], [250, -90], [700, 30], [1300, 230], [2200, 520], [3400, 1050],
  [5200, 1900], [8000, 3000], [12000, 4300],
];
export const TRANSMISSION: Pt[] = [[-6000, -8235], [9000, 9412]];
export const HIGHWAY: Pt[] = [[-14000, 2300], [-4000, 1720], [2000, 1350], [14000, 600]];
export const RAIL: Pt[] = [[-14000, 3300], [0, 2650], [14000, 1900]];
export const ROADS: { name: string; pts: Pt[]; label?: Pt; angle?: number }[] = [
  { name: 'Kiefer Blvd', pts: [[-14000, -1000], [14000, -1000]], label: [660, -1040] },
  { name: 'Excelsior Rd', pts: [[-1150, -14000], [-1150, 14000]], label: [-1190, 250], angle: -90 },
  { name: 'Grant Line Rd', pts: [[1050, -14000], [1050, 14000]], label: [1010, 300], angle: -90 },
  { name: 'Jackson Hwy', pts: HIGHWAY, label: [1500, 1330], angle: -4 },
];

/** Feature patches for the Geospatial layers (wetlands, fire perimeter). */
export const WETLANDS: { cx: number; cy: number; rx: number; ry: number }[] = [
  { cx: 330, cy: -110, rx: 160, ry: 90 },
  { cx: -2300, cy: -900, rx: 260, ry: 170 },
  { cx: 2700, cy: 900, rx: 330, ry: 190 },
];
export const FIRE_PERIMETER: Pt[] = [[1300, 1600], [1900, 1450], [2350, 2050], [2200, 2800], [1700, 2950], [1350, 2400]];

// ---- path helpers ----------------------------------------------------------

export const polyPath = (pts: Pt[]): string =>
  `M${pts.map(([x, y]) => `${x} ${y}`).join('L')}Z`;

export const linePath = (pts: Pt[]): string =>
  `M${pts.map(([x, y]) => `${x} ${y}`).join('L')}`;

/** Smooth path through points (Catmull-Rom to cubic Bézier). */
export const smoothPath = (pts: Pt[]): string => {
  if (pts.length < 3) return linePath(pts);
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0].toFixed(0)} ${c1[1].toFixed(0)} ${c2[0].toFixed(0)} ${c2[1].toFixed(0)} ${p2[0]} ${p2[1]}`;
  }
  return d;
};

export const SITE_PATH = polyPath(SITE);

/** Map views, as SVG viewBox [x, y, w, h] in metres. */
export const VIEWS = {
  boundary: [-1500, -1150, 3400, 2300] as const,
  proximity: [-10600, -9100, 20400, 18200] as const,
  geospatial: [-4400, -2700, 8800, 5600] as const,
  thumb: [-1600, -1300, 3200, 2600] as const,
  /** Site Profile's Proximity dropdown: the site and its 1 mi ring. */
  mini: [-3400, -2400, 6800, 4800] as const,
};
