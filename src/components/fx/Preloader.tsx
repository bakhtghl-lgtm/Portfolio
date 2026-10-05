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
const SEEN_KEY = "intro-seen";
const DURATION = 1300; // count-up; the curtain then lifts in 0.8s (0.45s when skipped)

function readSeen() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

/** First visit per session only; any click or key press skips it. */
export function Preloader() {
  const [count, setCount] = useState(0);
  const [wordIdx, setWordIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const [exitSpeed, setExitSpeed] = useState(0.8);

  useEffect(() => {
    let done = false;
    let raf = 0;
    const finish = (mode: "done" | "skip" | "instant" = "done") => {
      if (done) return;
      done = true;
      cancelAnimationFrame(raf);
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        /* storage blocked: loader simply shows again next visit */
      }
      setExitSpeed(mode === "instant" ? 0 : mode === "skip" ? 0.45 : 0.8);
      setVisible(false);
      lockScroll(false);
      finishIntro();
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (readSeen() || reduce) {
      finish("instant");
      return;
    }

    lockScroll(true);
    window.scrollTo(0, 0);
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - t0) / DURATION, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      setWordIdx(Math.min(words.length - 1, Math.floor(p * words.length)));
      if (p < 1) raf = requestAnimationFrame(tick);
      else finish();
    };
    raf = requestAnimationFrame(tick);

    const skip = () => finish("skip");
    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
      lockScroll(false);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="preloader"
          data-preloader
          className="surface-dark fixed inset-0 z-[200] bg-background"
          exit={{ y: "-100%" }}
          transition={{ duration: exitSpeed, ease: EASE }}
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
              transition={{ duration: exitSpeed, ease: EASE }}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col justify-between px-4 py-6 sm:p-6 md:p-10">
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.35em] text-muted-foreground">
              <span>bakhtaliniazi.com</span>
              <span>Portfolio ©2026</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="size-3 shrink-0 rounded-full bg-secondary animate-pulse" />
              {/* one word at a time; mask height = full line box so ascenders/descenders never clip */}
              <div className="relative h-[1.3em] flex-1 overflow-hidden font-display text-3xl md:text-5xl font-semibold leading-[1.3]">
                <AnimatePresence initial={false}>
                  <motion.span
                    key={wordIdx}
                    className="absolute inset-x-0 top-0 block whitespace-nowrap"
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    {words[wordIdx]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            <div className="flex items-end justify-between gap-6">
              <div className="flex flex-1 flex-col gap-4 mb-4">
                <button
                  type="button"
                  onClick={(e) => e.currentTarget.blur()}
                  className="self-start rounded-full border border-border px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-foreground transition hover:bg-secondary hover:text-secondary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
                >
                  Skip
                </button>
                <div className="h-px bg-border relative overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-secondary"
                    style={{ width: `${count}%` }}
                  />
                </div>
              </div>
              <span className="font-mega text-[28vw] md:text-[16vw] leading-[0.8] tabular-nums text-highlight">
                {count}
              </span>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
