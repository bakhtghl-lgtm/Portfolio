import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

/**
 * Two-part cursor: a dot that tracks the pointer exactly and a ring that trails it.
 * Elements can set `data-cursor="View"` to morph the ring into a labelled yellow disc.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [hovering, setHovering] = useState(false);
  const [down, setDown] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 350, damping: 30, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 350, damping: 30, mass: 0.5 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");

    let lastTarget: EventTarget | null = null;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (e.target === lastTarget) return;
      lastTarget = e.target;
      const t = e.target as HTMLElement | null;
      const labelled = t?.closest<HTMLElement>("[data-cursor]");
      setLabel(labelled?.dataset.cursor ?? null);
      setHovering(Boolean(t?.closest("a, button, input, textarea, [role=button]")));
    };
    const dn = () => setDown(true);
    const up = () => setDown(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", dn);
    window.addEventListener("pointerup", up);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", dn);
      window.removeEventListener("pointerup", up);
    };
  }, [x, y]);

  if (!enabled) return null;

  const size = label ? 96 : hovering ? 56 : 36;

  return (
    <>
      <motion.div
        aria-hidden
        className={`cursor-fx pointer-events-none fixed left-0 top-0 z-[100] rounded-full border flex items-center justify-center ${label ? "" : "mix-blend-difference"}`}
        style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: size,
          height: size,
          scale: down ? 0.8 : 1,
          backgroundColor: label ? "rgba(246, 207, 58, 1)" : "rgba(246, 207, 58, 0)",
          borderColor: label ? "rgba(246, 207, 58, 1)" : "rgba(255, 255, 255, 0.85)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <AnimatePresence>
          {label ? (
            <motion.span
              key={label}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary-foreground"
            >
              {label}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </motion.div>
      <motion.div
        aria-hidden
        className="cursor-fx pointer-events-none fixed left-0 top-0 z-[101] size-2 rounded-full bg-secondary ring-1 ring-black/40"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: label ? 0 : 1 }}
      />
    </>
  );
}
