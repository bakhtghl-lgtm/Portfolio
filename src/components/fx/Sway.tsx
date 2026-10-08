import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import type { ReactNode } from "react";
import { useMedia } from "./useMedia";

/**
 * "Jhoola": while you scroll the content trails a little behind (offset by scroll velocity);
 * when you stop, a slow under-damped spring carries it past rest and lets it swing back and
 * settle. 0 at rest. Desktop pointers only; off for reduced motion.
 */
export function Sway({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const fine = useMedia("(pointer: fine)");
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const target = useTransform(velocity, (v) => Math.max(-44, Math.min(44, v * 0.022)));
  // ~1.2s period, damping ratio ~0.3: one clear swing past rest, a smaller one back, then still
  const swing = useSpring(target, { stiffness: 28, damping: 3.2, mass: 1, restDelta: 0.2 });
  const y = useTransform(swing, (v) => Math.round(v));

  if (reduce || !fine) return <>{children}</>;
  return (
    <motion.div data-sway className="gpu" style={{ y }}>
      {children}
    </motion.div>
  );
}
