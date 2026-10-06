import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useInView,
  useReducedMotion,
  useVelocity,
} from "framer-motion";
import { useRef, type ReactNode } from "react";

function wrap(min: number, max: number, v: number) {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
}

/** Infinite marquee whose speed, direction and skew react to scroll velocity. */
export function VelocityMarquee({
  children,
  baseVelocity = 3,
  className = "",
}: {
  children: ReactNode;
  baseVelocity?: number;
  className?: string;
}) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });
  const skew = useTransform(smoothVelocity, [-2000, 2000], [8, -8]);
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);
  const direction = useRef(1);
  const reduce = useReducedMotion();
  // only run the per-frame update while the band is on (or near) screen
  const box = useRef<HTMLDivElement>(null);
  const visible = useInView(box, { margin: "200px 0px" });

  useAnimationFrame((_, delta) => {
    // data-freeze-motion on <html> holds marquees still (used for screenshot/QA runs)
    if (!visible || reduce || document.documentElement.hasAttribute("data-freeze-motion")) return;
    let moveBy = direction.current * baseVelocity * (delta / 1000);
    const vf = velocityFactor.get();
    if (vf < 0) direction.current = -1;
    else if (vf > 0) direction.current = 1;
    moveBy += direction.current * moveBy * vf;
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div ref={box} className={`overflow-hidden whitespace-nowrap flex ${className}`}>
      <motion.div
        className="gpu flex whitespace-nowrap"
        style={reduce ? undefined : { x, skewX: skew }}
      >
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="flex shrink-0 items-center" aria-hidden={i > 0}>
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
