// Side profiles (x forward, y up) for each body type; shared by the SVG silhouettes and the 3D models.
const P = {
  city: { L: 3.7, hood: 0.95, roof: 1.5, ws: [1.05, 0.35], rw: [-1.2, -1.75], tail: 1.05, g: 0.3, r: 0.3, w: 1.62 },
  compact: { L: 4.2, hood: 0.95, roof: 1.45, ws: [1.25, 0.45], rw: [-1.2, -1.95], tail: 1.0, g: 0.3, r: 0.31, w: 1.75 },
  sedan: { L: 4.7, hood: 0.9, roof: 1.42, ws: [1.25, 0.45], rw: [-0.8, -1.5], tail: 0.98, g: 0.3, r: 0.32, w: 1.8 },
  wagon: { L: 4.7, hood: 0.9, roof: 1.45, ws: [1.3, 0.5], rw: [-2.1, -2.3], tail: 1.35, g: 0.3, r: 0.32, w: 1.8 },
  coupe: { L: 4.5, hood: 0.85, roof: 1.3, ws: [1.2, 0.25], rw: [-0.6, -1.6], tail: 0.95, g: 0.28, r: 0.32, w: 1.8 },
  convertible: { L: 4.4, hood: 0.85, roof: 1.18, ws: [1.15, 0.6], rw: [-0.9, -1.1], tail: 0.95, g: 0.28, r: 0.32, w: 1.8, open: true },
  minivan: { L: 4.8, hood: 1.0, roof: 1.75, ws: [1.95, 0.95], rw: [-2.25, -2.4], tail: 1.6, g: 0.32, r: 0.33, w: 1.85 },
  suv: { L: 4.6, hood: 1.15, roof: 1.78, ws: [1.35, 0.55], rw: [-2.0, -2.25], tail: 1.55, g: 0.42, r: 0.4, w: 1.9 },
  pickup: { L: 5.3, hood: 1.2, roof: 1.85, ws: [1.5, 0.7], rw: [-0.55, -0.6], tail: 1.25, g: 0.45, r: 0.42, w: 2.0, bed: true },
  van: { L: 5.2, hood: 1.2, roof: 2.2, ws: [2.2, 1.6], rw: [-2.55, -2.6], tail: 2.15, g: 0.4, r: 0.36, w: 2.0 },
  sports: { L: 4.4, hood: 0.75, roof: 1.22, ws: [1.0, 0.05], rw: [-0.7, -1.7], tail: 0.9, g: 0.25, r: 0.33, w: 1.85 },
  supercar: { L: 4.5, hood: 0.62, roof: 1.1, ws: [1.2, 0.15], rw: [-0.6, -1.9], tail: 0.85, g: 0.22, r: 0.34, w: 1.95 },
};

export function profile(type) {
  return P[type] || P.compact;
}

export function bodyOutline(type) {
  const p = profile(type);
  const h = p.L / 2;
  const pts = [
    [h, p.g], [h + 0.04, p.hood - 0.2], [h - 0.3, p.hood], [p.ws[0], p.hood + 0.02],
    [p.ws[1], p.roof], [p.rw[0], p.roof],
  ];
  if (p.bed) pts.push([p.rw[0], p.tail + 0.05], [-h, p.tail + 0.05]);
  else pts.push([p.rw[1], p.tail], [-h + 0.12, p.tail - 0.03]);
  pts.push([-h, p.tail - 0.25], [-h, p.g]);
  return pts;
}

export function glassOutline(type) {
  const p = profile(type);
  const top = p.roof - 0.07;
  const belt = p.hood + 0.08;
  if (p.open) return [[p.ws[0] - 0.08, belt], [p.ws[1] + 0.02, top], [p.ws[1] - 0.06, top], [p.ws[0] - 0.22, belt]];
  const slope = t => t;
  return [
    [p.ws[0] - 0.1, belt], [p.ws[1] + 0.04, top], [slope(p.rw[0]) - 0.02, top],
    [p.bed ? p.rw[0] - 0.02 : p.rw[1] + 0.12, p.bed ? belt : Math.max(belt, p.tail + 0.05)],
  ];
}

export function wheels(type) {
  const p = profile(type);
  const x = p.L / 2 - 0.78;
  return [[x, p.r], [-x + (p.bed ? -0.05 : 0.05), p.r]].map(([cx, r]) => ({ cx, cy: r, r }));
}

export function silhouetteSvg(type) {
  const p = profile(type);
  const pad = 0.25;
  const W = p.L + pad * 2;
  const H = 2.45;
  const map = ([x, y]) => `${(x + p.L / 2 + pad).toFixed(3)},${(H - y).toFixed(3)}`;
  return {
    viewBox: `0 0 ${W.toFixed(2)} ${H}`,
    body: bodyOutline(type).map(map).join(' '),
    glass: glassOutline(type).map(map).join(' '),
    wheels: wheels(type).map(w => ({ cx: w.cx + p.L / 2 + pad, cy: H - w.cy, r: w.r })),
  };
}
