import { motion, useAnimationFrame, useMotionValue, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { useMedia } from "./useMedia";

// Lenis velocity (px per frame) at which the offset reaches ~76% of MAX
const SOFT = 30;
const MAX = 34;
// damping ratio ~0.6: one soft swing past rest (~10%), then it's still, with no slow creep
const STIFFNESS = 85;
const DAMPING = 11;

/**
 * "Jhoola": while you scroll the content trails a little behind the scroll, and when you stop
 * it eases past rest once and settles. Sub-pixel throughout (whole-pixel steps read as
 * stutter at the end of the swing); exactly 0 at rest. Desktop pointers only; off for
 * reduced motion.
 */
export function Sway({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const fine = useMedia("(pointer: fine)");
  const y = useMotionValue(0);
  const vel = useRef(0);

  useAnimationFrame((_, delta) => {
    if (reduce || !fine) return;
    const lenisV = window.__lenis?.velocity ?? 0;
    // tanh saturates smoothly, so fast flicks never hit a hard limit and kink the motion
    const target = MAX * Math.tanh(lenisV / SOFT);
    let pos = y.get();
    let v = vel.current;
    if (target === 0 && Math.abs(pos) < 0.05 && Math.abs(v) < 0.5) {
      if (pos !== 0) y.set(0);
      vel.current = 0;
      return;
    }
    // fixed 4ms sub-steps keep the spring identical at 60, 120 or a stuttering frame rate
    let t = Math.min(delta, 64) / 1000;
    while (t > 0) {
      const h = Math.min(t, 0.004);
      v += (STIFFNESS * (target - pos) - DAMPING * v) * h;
      pos += v * h;
      t -= h;
    }
    vel.current = v;
    y.set(pos);
  });

  if (reduce || !fine) return <>{children}</>;
  return (
    <motion.div data-sway className="gpu" style={{ y }}>
      {children}
    </motion.div>
  );
}
