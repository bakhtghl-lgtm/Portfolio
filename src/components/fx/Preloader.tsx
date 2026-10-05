import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useSyncExternalStore } from "react";
import { lockScroll } from "./SmoothScroll";

// Tiny shared store so the hero can wait for the curtain before playing its intro.
let introDone = false;
const listeners = new Set<() => void>();
function finishIntro() {
  introDone = true;
  listeners.forEach((l) => l());
}
export function useIntroDone() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => introDone,
    () => false,
  );
}

const words = ["Funnels", "Automations", "Pipelines", "Campaigns", "Bakht Ali"];
const EASE = [0.76, 0, 0.24, 1] as const;

export function Preloader() {
  const [count, setCount] = useState(0);
  const [wordIdx, setWordIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    lockScroll(true);
    window.scrollTo(0, 0);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dur = reduce ? 300 : 2200;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * 100));
      setWordIdx(Math.min(words.length - 1, Math.floor(p * words.length)));
      if (p < 1) raf = requestAnimationFrame(tick);
      else
        setTimeout(() => {
          setVisible(false);
          lockScroll(false);
          finishIntro();
        }, 250);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      lockScroll(false);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[200] bg-background text-foreground"
          exit={{ y: "-100%" }}
          transition={{ duration: 1.1, ease: EASE }}
        >
          {/* curved bottom edge that flattens as the curtain lifts */}
          <svg
            className="absolute top-full left-0 w-full h-[18vh] fill-background"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            <motion.path
              initial={{ d: "M0 0 L100 0 Q50 0 0 0 Z" }}
              exit={{ d: "M0 0 L100 0 Q50 100 0 0 Z" }}
              transition={{ duration: 1.1, ease: EASE }}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-10">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
              <span>bakhtaliniazi.com</span>
              <span>Portfolio ©2026</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="size-3 rounded-full bg-secondary animate-pulse" />
              <div className="h-[1.1em] overflow-hidden font-display text-3xl md:text-5xl font-semibold">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={wordIdx}
                    className="block"
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.45, ease: EASE }}
                  >
                    {words[wordIdx]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            <div className="flex items-end justify-between gap-6">
              <div className="h-px flex-1 bg-border relative overflow-hidden mb-4">
                <div
                  className="absolute inset-y-0 left-0 bg-secondary"
                  style={{ width: `${count}%` }}
                />
              </div>
              <span className="font-mega text-[28vw] md:text-[16vw] tabular-nums text-secondary">
                {count}
              </span>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
