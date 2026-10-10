'use client';

import { useLayoutEffect, useRef, useState } from 'react';

const YS = [0.08, 0.26, 0.46, 0.66, 0.84];
const XS = [28, 108, 20, 120, 48];
const ICON = 54;

type Pt = [number, number];

/** Catmull-Rom style smoothing, same maths as the Flutter painter. */
function smooth(pts: Pt[]): string {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = i === 0 ? pts[i] : pts[i - 1];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = i + 2 < pts.length ? pts[i + 2] : p2;
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${p2[0]},${p2[1]}`;
  }
  return d;
}

/** Blue ribbons linking the floating icons on the "center-icons" hero (wide screens only). */
export function PrivacyRibbons() {
  const ref = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useLayoutEffect(() => {
    const el = ref.current?.parentElement;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  let left = '';
  let right = '';
  if (size) {
    const l: Pt[] = YS.map((y, i) => [XS[i] + ICON / 2, size.h * y + ICON / 2]);
    const r: Pt[] = YS.map((y, i) => [size.w - XS[i] - ICON / 2, size.h * y + ICON / 2]);
    left = smooth(l);
    right = smooth(r);
  }

  return (
    <svg ref={ref} className="hp-ribbons" width="100%" height="100%" aria-hidden="true">
      {size && (
        <>
          <path d={left} fill="none" stroke="#DBEAFE" strokeWidth="28" strokeLinecap="round" strokeLinejoin="round" />
          <path d={right} fill="none" stroke="#DBEAFE" strokeWidth="28" strokeLinecap="round" strokeLinejoin="round" />
          <path d={left} fill="none" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
          <path d={right} fill="none" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}
