import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { createPortal } from "react-dom";
import { useIntroDone } from "./Preloader";
import { centreOf, revealFrom } from "./reveal";
import { applyTheme, isDark, type Theme } from "./ThemeToggle";
import { useMedia } from "./useMedia";

/*
 * Light/dark as a pull-cord lamp: a loose cord hangs from the top of the screen with a bulb on the
 * end. The bulb is lit in light mode and off in dark mode. Pull the bulb down (drag, or just tap
 * it) and the cord stretches, snaps back and the theme flips. The cord is a small Verlet rope:
 * gravity keeps it hanging, page scrolling jostles it, and it swings and settles like a real
 * cord. The simulation only runs while something moves; at rest it costs nothing.
 * With reduced motion the cord never moves on its own (no drop-in, no sway on scroll), but the
 * visitor's own pull or tap still plays out: that motion is theirs, not ours.
 */

const POINTS = 14; // rope nodes, anchor included
const STEP = 1 / 120; // fixed physics step (s)
const GRAVITY = 2100; // px/s²
const AIR = 0.979; // velocity kept per step: a loose cord that still settles in a few seconds
const ITERATIONS = 14; // constraint passes per step
const BULB_INV_MASS = 0.3; // the bulb is heavier than the cord
const W = 220; // stage size around the cord (px)
const H = 300;
const AX = W / 2; // anchor: top centre of the stage = top edge of the screen
const PULL_TOGGLE = 1.16; // pulled past this share of the rest length: the switch clicks
const MAX_STRETCH = 1.5; // a drag can stretch the cord this far
const BULB_DROP = 17; // cord end -> bulb centre (px)

type P = { x: number; y: number; px: number; py: number };

export function ThemeCord({ visible = true }: { visible?: boolean }) {
  const slot = useRef<HTMLSpanElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const cordPath = useRef<SVGPathElement>(null);
  const bulb = useRef<SVGGElement>(null);
  const hit = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");
  const [anchorX, setAnchorX] = useState<number | null>(null);
  const intro = useIntroDone();
  const reduce = useMedia("(prefers-reduced-motion: reduce)");
  const phone = useMedia("(max-width: 767px)");
  const rest = phone ? 44 : 78; // hanging cord length (px), bulb below it

  // simulation state lives in refs: it changes every frame and never needs a React render
  const sim = useRef({
    pts: [] as P[],
    seg: rest / (POINTS - 1), // current segment length (stretches while pulled)
    segV: 0,
    segRest: rest / (POINTS - 1),
    drag: null as null | { x: number; y: number; sx: number; sy: number; t: number; moved: number },
    tug: null as null | { t: number; fx: number; fy: number },
    acc: 0,
    last: 0,
    raf: 0,
    still: 0,
    scrollY: 0,
  });

  useEffect(() => {
    setMounted(true);
    setTheme(isDark() ? "dark" : "light");
  }, []);

  // anchor = centre of the slot this component holds in the header row
  useLayoutEffect(() => {
    if (!mounted || !slot.current) return;
    const measure = () => {
      const r = slot.current?.getBoundingClientRect();
      if (r) setAnchorX(Math.round(r.left + r.width / 2));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (slot.current.parentElement) ro.observe(slot.current.parentElement);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [mounted]);

  // (re)build the rope: it starts gathered at the anchor and drops into place when the intro ends
  useEffect(() => {
    const s = sim.current;
    s.segRest = rest / (POINTS - 1);
    s.seg = s.segRest;
    s.segV = 0;
    const hangStraight = reduce || !intro;
    s.pts = Array.from({ length: POINTS }, (_, i) => {
      const y = hangStraight ? i * s.segRest : i * 0.6;
      const x = AX + (hangStraight ? 0 : i * 0.9);
      return { x, y, px: x, py: y };
    });
    s.scrollY = window.scrollY;
    draw();
    if (!reduce && intro) wake();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rest, reduce, intro]);

  // page scrolling jostles the cord
  useEffect(() => {
    if (reduce) return;
    const onScroll = () => wake();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  useEffect(() => () => cancelAnimationFrame(sim.current.raf), []);

  // the stage mounts (or moves) after the rope is built: paint it in place
  useLayoutEffect(() => {
    draw();
  }, [anchorX, mounted]);

  function wake() {
    const s = sim.current;
    s.still = 0;
    if (!s.raf) {
      s.last = performance.now();
      s.raf = requestAnimationFrame(frame);
    }
  }

  function frame(now: number) {
    const s = sim.current;
    s.raf = 0;
    const dt = Math.min(0.05, (now - s.last) / 1000);
    s.last = now;

    // the page moved under a cord that hangs from the screen: the cord lags and sways
    const sy = window.scrollY;
    const d = Math.max(-70, Math.min(70, sy - s.scrollY));
    s.scrollY = sy;
    if (d !== 0 && !reduce) {
      const dir = d > 0 ? 1 : -1;
      for (let i = 1; i < POINTS; i++) {
        const f = i / (POINTS - 1);
        s.pts[i].y -= d * 0.12 * f;
        s.pts[i].x += Math.abs(d) * 0.02 * f * dir;
      }
    }

    if (s.tug) {
      const k = Math.min(1, (now - s.tug.t) / 110);
      const e = 1 - Math.pow(1 - k, 3);
      const ty = rest * 1.3;
      const x = s.tug.fx + (AX - s.tug.fx) * e;
      const y = s.tug.fy + (ty - s.tug.fy) * e;
      s.drag = { x, y, sx: x, sy: y, t: now, moved: 0 };
      s.seg = Math.max(s.segRest, Math.hypot(x - AX, y) / (POINTS - 1));
      if (k >= 1) {
        s.tug = null;
        s.drag = null;
        s.segV = 0;
        flip();
      }
    }

    s.acc += dt;
    while (s.acc >= STEP) {
      step();
      s.acc -= STEP;
    }
    draw();

    // sleep once everything has settled
    let energy = Math.abs(s.segV) + Math.abs(s.seg - s.segRest) * 4;
    for (let i = 1; i < POINTS; i++) {
      const p = s.pts[i];
      energy += Math.abs(p.x - p.px) + Math.abs(p.y - p.py);
    }
    s.still = energy < 0.04 && !s.drag && !s.tug ? s.still + 1 : 0;
    if (s.still < 30) s.raf = requestAnimationFrame(frame);
  }

  function step() {
    const s = sim.current;
    const pts = s.pts;
    // the cord's length springs back after a pull (a little boing)
    if (!s.drag) {
      // ~0.8 damping ratio: it snaps back with a hint of bounce but never shrinks into a kink
      s.segV += ((s.segRest - s.seg) * 900 - s.segV * 48) * STEP;
      s.seg += s.segV * STEP;
    }
    for (let i = 1; i < POINTS; i++) {
      const p = pts[i];
      const vx = (p.x - p.px) * AIR;
      const vy = (p.y - p.py) * AIR;
      p.px = p.x;
      p.py = p.y;
      p.x += vx;
      p.y += vy + GRAVITY * STEP * STEP;
    }
    const end = pts[POINTS - 1];
    for (let k = 0; k < ITERATIONS; k++) {
      pts[0].x = AX;
      pts[0].y = 0;
      for (let i = 0; i < POINTS - 1; i++) {
        const a = pts[i];
        const b = pts[i + 1];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.hypot(dx, dy) || 0.0001;
        const wa = i === 0 ? 0 : 1;
        const wb = i + 1 === POINTS - 1 ? BULB_INV_MASS : 1;
        const diff = (dist - s.seg) / dist / (wa + wb);
        a.x += dx * diff * wa;
        a.y += dy * diff * wa;
        b.x -= dx * diff * wb;
        b.y -= dy * diff * wb;
      }
      if (s.drag) {
        end.x = s.drag.x;
        end.y = s.drag.y;
      }
    }
  }

  function draw() {
    const pts = sim.current.pts;
    if (!pts.length || !cordPath.current || !bulb.current) return;
    // Catmull-Rom through the nodes, as cubic Béziers: a smooth cord
    let d = `M${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] ?? pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] ?? p2;
      const c1x = p1.x + (p2.x - p0.x) / 6;
      const c1y = p1.y + (p2.y - p0.y) / 6;
      const c2x = p2.x - (p3.x - p1.x) / 6;
      const c2y = p2.y - (p3.y - p1.y) / 6;
      d += `C${c1x.toFixed(2)} ${c1y.toFixed(2)} ${c2x.toFixed(2)} ${c2y.toFixed(2)} ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
    }
    cordPath.current.setAttribute("d", d);
    const a = pts[pts.length - 2];
    const b = pts[pts.length - 1];
    const ang = Math.atan2(b.y - a.y, b.x - a.x);
    const deg = (ang * 180) / Math.PI - 90;
    bulb.current.setAttribute(
      "transform",
      `translate(${b.x.toFixed(2)} ${b.y.toFixed(2)}) rotate(${deg.toFixed(2)})`,
    );
    if (hit.current) {
      const cx = b.x + Math.cos(ang) * BULB_DROP;
      const cy = b.y + Math.sin(ang) * BULB_DROP;
      hit.current.style.transform = `translate(${(cx - 24).toFixed(1)}px, ${(cy - 24).toFixed(1)}px)`;
    }
  }

  function flip() {
    const next: Theme = isDark() ? "light" : "dark";
    const [x, y] = hit.current ? centreOf(hit.current) : [innerWidth - 60, 60];
    revealFrom(x, y, () => {
      applyTheme(next);
      setTheme(next);
    });
  }

  // a tap / Enter: a hand gives the bulb one firm tug (eased, ~110ms), lets go, and the switch
  // clicks; the cord stretches and springs back on its own
  function tug() {
    const s = sim.current;
    if (s.tug || s.drag) return;
    const end = s.pts[POINTS - 1];
    s.tug = { t: performance.now(), fx: end.x, fy: end.y };
    wake();
  }

  function local(e: PointerEvent) {
    const r = stage.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function onDown(e: PointerEvent<HTMLButtonElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = local(e);
    sim.current.drag = { x: p.x, y: p.y, sx: p.x, sy: p.y, t: performance.now(), moved: 0 };
    wake();
  }

  function onMove(e: PointerEvent<HTMLButtonElement>) {
    const s = sim.current;
    if (!s.drag) return;
    let { x, y } = local(e);
    // the grab point is the bulb; the cord end sits a bulb-length above it
    y -= BULB_DROP;
    const dx = x - AX;
    const dy = y;
    const dist = Math.hypot(dx, dy);
    const max = rest * MAX_STRETCH;
    if (dist > max) {
      x = AX + (dx / dist) * max;
      y = (dy / dist) * max;
    }
    s.drag.moved = Math.max(s.drag.moved, Math.hypot(x - s.drag.sx, y + BULB_DROP - s.drag.sy));
    s.drag.x = x;
    s.drag.y = y;
    // pulled past its length the cord stretches evenly (otherwise it just bends)
    s.seg = Math.max(s.segRest, Math.min(dist, max) / (POINTS - 1));
    wake();
  }

  function onUp(e: PointerEvent<HTMLButtonElement>) {
    const s = sim.current;
    if (!s.drag) return;
    const { moved, y, t } = s.drag;
    s.drag = null;
    s.segV = 0;
    if (e.currentTarget.hasPointerCapture(e.pointerId))
      e.currentTarget.releasePointerCapture(e.pointerId);
    wake();
    if (moved < 6 && performance.now() - t < 450) tug();
    else if (y > rest * PULL_TOGGLE) flip();
  }

  function onKey(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      tug();
    }
  }

  const dark = theme === "dark";

  return (
    <>
      {/* keeps the cord's place in the header row; the cord itself hangs from the screen top */}
      <span ref={slot} aria-hidden className="block h-10 w-8 shrink-0 md:w-10" />
      {mounted && anchorX !== null
        ? createPortal(
            <div
              ref={stage}
              className={`pointer-events-none fixed top-0 z-[55] transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
              style={{ left: anchorX - W / 2, width: W, height: H }}
            >
              <svg
                width={W}
                height={H}
                viewBox={`0 0 ${W} ${H}`}
                className="absolute inset-0 overflow-visible"
                aria-hidden
              >
                <defs>
                  <radialGradient id="cord-glow">
                    <stop offset="0" style={{ stopColor: "var(--secondary)" }} stopOpacity="0.55" />
                    <stop
                      offset="0.45"
                      style={{ stopColor: "var(--secondary)" }}
                      stopOpacity="0.22"
                    />
                    <stop offset="1" style={{ stopColor: "var(--secondary)" }} stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="cord-glass-on" cx="0.42" cy="0.38" r="0.75">
                    <stop offset="0" stopColor="#fffef6" />
                    <stop offset="0.5" stopColor="#fff1bf" />
                    <stop offset="1" style={{ stopColor: "var(--secondary)" }} />
                  </radialGradient>
                  <linearGradient id="cord-metal" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#8d7a4f" />
                    <stop offset="0.45" stopColor="#e7d29a" />
                    <stop offset="1" stopColor="#7a6740" />
                  </linearGradient>
                  <linearGradient id="cord-socket" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#1d1f23" />
                    <stop offset="0.5" stopColor="#4a4e57" />
                    <stop offset="1" stopColor="#1d1f23" />
                  </linearGradient>
                </defs>
                <path
                  ref={cordPath}
                  fill="none"
                  stroke="var(--foreground)"
                  strokeOpacity="0.78"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
                <g ref={bulb}>
                  {/* warm halo while the lamp is on */}
                  <circle
                    cy="22"
                    r="40"
                    fill="url(#cord-glow)"
                    className="transition-opacity duration-500"
                    style={{ opacity: dark ? 0 : 1 }}
                  />
                  {/* cord end cap, then the socket with its threads */}
                  <rect x="-2.6" y="-1.5" width="5.2" height="4" rx="1.2" fill="url(#cord-metal)" />
                  <rect x="-6.5" y="2.2" width="13" height="10" rx="2.2" fill="url(#cord-socket)" />
                  <path d="M-6.2 5.2H6.2M-6.2 8.2H6.2" stroke="#6b707a" strokeWidth="0.8" />
                  {/* glass */}
                  <path
                    d="M-5.6 12 C-5.6 15 -11.5 17.5 -11.5 25 C-11.5 32 -6.3 36.5 0 36.5 C6.3 36.5 11.5 32 11.5 25 C11.5 17.5 5.6 15 5.6 12 Z"
                    fill={dark ? "oklch(1 0 0 / 0.14)" : "url(#cord-glass-on)"}
                    stroke={dark ? "oklch(1 0 0 / 0.75)" : "oklch(0.55 0.08 80 / 0.55)"}
                    strokeWidth="0.9"
                  />
                  {/* filament */}
                  <path
                    d="M-2.6 13 L-2 21.5 Q-1.4 25.5 0 23.2 Q1.4 25.5 2 21.5 L2.6 13"
                    fill="none"
                    stroke={dark ? "oklch(0.85 0.01 270)" : "#ff8a1f"}
                    strokeWidth={dark ? 0.9 : 1.2}
                    strokeLinecap="round"
                    className="transition-[stroke] duration-500"
                  />
                  {/* glass highlight */}
                  <path
                    d="M-7.2 22 C-7.6 26 -6 30 -3.4 31.6"
                    fill="none"
                    stroke="#fff"
                    strokeOpacity="0.7"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                </g>
              </svg>
              <button
                ref={hit}
                type="button"
                role="switch"
                aria-checked={dark}
                aria-label="Dark mode (lamp cord)"
                title={dark ? "Pull for light mode" : "Pull for dark mode"}
                tabIndex={visible ? 0 : -1}
                onPointerDown={onDown}
                onPointerMove={onMove}
                onPointerUp={onUp}
                onPointerCancel={onUp}
                onKeyDown={onKey}
                onClick={(e) => {
                  // pointer taps are handled on pointerup; keyboard "clicks" come through onKey
                  if (e.detail === 0) e.preventDefault();
                }}
                className={`group absolute left-0 top-0 size-12 cursor-grab touch-none rounded-full focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-[var(--ring)] active:cursor-grabbing ${visible ? "pointer-events-auto" : "pointer-events-none"}`}
              >
                <span className="pointer-events-none absolute right-full top-1/2 mr-0.5 -translate-y-1/2 whitespace-nowrap rounded-full bg-foreground px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-background opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  Pull
                </span>
              </button>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
