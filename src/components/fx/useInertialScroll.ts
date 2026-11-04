import { useMotionValue, useScroll, useSpring } from "framer-motion";
import { useState } from "react";

type Options = NonNullable<Parameters<typeof useScroll>[0]>;

/**
 * Scroll progress with inertia. Scroll-driven effects follow this instead of the raw position, so
 * when the visitor stops scrolling the animation glides on and settles (about 0.6s) rather than
 * freezing mid-move, which reads as the page getting stuck.
 *
 * Mouse/trackpad only: on touch screens the native momentum scroll already glides to a stop, and
 * a spring there is pure cost (it measurably drops frames on phones). Raw for reduced motion. The
 * choice is made once on mount: a spring stays attached to its first source, so it must never be
 * attached at all where it isn't wanted.
 */
export function useInertialScroll(options: Options) {
  const { scrollYProgress } = useScroll(options);
  const [inertia] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const idle = useMotionValue(0);
  const smooth = useSpring(inertia ? scrollYProgress : idle, {
    stiffness: 70,
    damping: 20,
    mass: 0.6,
    restDelta: 0.0002,
  });
  return { scrollYProgress: inertia ? smooth : scrollYProgress };
}
