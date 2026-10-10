import { motion, useAnimationFrame, useMotionValue, useReducedMotion } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";
import { useMedia } from "./useMedia";

// velocity (px per 60fps frame) at which the offset reaches ~76% of its max
const SOFT = 30;
// mouse/trackpad: the content trails the wheel by up to this many px
const MAX = 34;
// touch: a smaller swing, and only once the finger lifts (a drag must stay glued to the finger)
const MAX_TOUCH = 18;
// damping ratio ~0.6: one soft swing past rest (~10%), then it's still, with no slow creep
const STIFFNESS = 85;
const DAMPING = 11;

/**
 * "Jhoola": the content trails a little behind the scroll and, when the scroll stops, eases
 * past rest once and settles. Sub-pixel throughout (whole-pixel steps read as stutter at the
 * end of the swing); exactly 0 at rest. Off for reduced motion.
 *
 * Mouse/trackpad follow Lenis's velocity. Touch follows the measured scroll speed of the
 * momentum glide after the finger lifts; while a finger is down the offset eases back to 0.
 */
export function Sway({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const fine = useMedia("(pointer: fine)");
  const y = useMotionValue(0);
  const vel = useRef(0);
  const touching = useRef(false);
  const lastY = useRef<number | null>(null);
  const touchV = useRef(0);

  useEffect(() => {
    const down = () => (touching.current = true);
    const up = () => (touching.current = false);
    window.addEventListener("touchstart", down, { passive: true });
    window.addEventListener("touchend", up, { passive: true });
    window.addEventListener("touchcancel", up, { passive: true });
    return () => {
      window.removeEventListener("touchstart", down);
      window.removeEventListener("touchend", up);
      window.removeEventListener("touchcancel", up);
    };
  }, []);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const dt = Math.min(delta, 64);

    let target: number;
    if (fine) {
      target = MAX * Math.tanh((window.__lenis?.velocity ?? 0) / SOFT);
    } else {
      // measured scroll speed, normalised to a 60fps frame and lightly smoothed
      const sy = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const step = lastY.current === null ? 0 : sy - lastY.current;
      lastY.current = sy;
      // a jump of hundreds of px in one frame is a programmatic jump, not a glide: ignore it
      const raw = dt === 0 || Math.abs(step) > 240 ? 0 : (step * 16.67) / dt;
      // iOS rubber-banding past either end is the browser's own bounce: don't add to it
      const atEdge = sy <= 0 || sy >= max - 1;
      touchV.current += ((atEdge ? 0 : raw) - touchV.current) * 0.3;
      target = touching.current ? 0 : MAX_TOUCH * Math.tanh(touchV.current / SOFT);
    }

    let pos = y.get();
    let v = vel.current;
    if (Math.abs(target) < 0.05 && Math.abs(pos) < 0.05 && Math.abs(v) < 0.5) {
      if (pos !== 0) y.set(0);
      vel.current = 0;
      return;
    }
    // fixed 4ms sub-steps keep the spring identical at 60, 120 or a stuttering frame rate
    let t = dt / 1000;
    while (t > 0) {
      const h = Math.min(t, 0.004);
      v += (STIFFNESS * (target - pos) - DAMPING * v) * h;
      pos += v * h;
      t -= h;
    }
    vel.current = v;
    y.set(pos);
  });

  // the wrapper is always rendered (only its motion is switched off), so the page below it
  // never remounts when the media query resolves after hydration
  return (
    <motion.div data-sway className={reduce ? undefined : "gpu"} style={{ y }}>
      {children}
    </motion.div>
  );
}
