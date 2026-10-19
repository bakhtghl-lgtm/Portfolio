import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { centreOf, revealFrom } from "./reveal";

export const THEME_KEY = "theme";
type Theme = "light" | "dark";

// phone browser bar colour per theme (the page background)
const BAR = { light: "#faf9f4", dark: "#0b0c0e" } as const;

/** Runs in <head> before first paint, so a returning dark-mode visitor never sees a light flash. */
export const themeInitScript = `try{if(localStorage.getItem("${THEME_KEY}")==="dark"){document.documentElement.classList.add("dark");var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content","${BAR.dark}")}}catch(e){}`;

const isDark = () => document.documentElement.classList.contains("dark");

function apply(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", BAR[theme]);
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* private mode: the choice just isn't remembered */
  }
}

/**
 * Light/dark switch: a sliding knob (sun / moon) with the current mode written beside it. Light is
 * the default; the choice is remembered. Where the browser supports view transitions the new theme
 * opens as a circle from the knob, otherwise it switches at once.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("light");
  useEffect(() => setTheme(isDark() ? "dark" : "light"), []);
  const knob = useRef<HTMLSpanElement>(null);

  const toggle = (e: MouseEvent<HTMLButtonElement>) => {
    const next: Theme = isDark() ? "light" : "dark";
    const [x, y] = centreOf(knob.current ?? e.currentTarget);
    revealFrom(x, y, () => {
      apply(next);
      setTheme(next);
    });
  };

  const dark = theme === "dark";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="Dark mode"
      onClick={toggle}
      className={`group relative flex h-10 w-[5.75rem] shrink-0 items-center rounded-full border border-border bg-background/70 p-1 text-foreground backdrop-blur transition-colors hover:border-foreground/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)] ${className}`}
    >
      {/* the mode's name sits on the free side of the track */}
      <span
        aria-hidden
        className={`absolute inset-y-0 grid w-[3.25rem] place-items-center text-[10px] font-bold uppercase tracking-[0.18em] transition-[left,opacity] duration-500 ${
          dark ? "left-1" : "left-[2.35rem]"
        }`}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={theme}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
          >
            {dark ? "Dark" : "Light"}
          </motion.span>
        </AnimatePresence>
      </span>
      <motion.span
        ref={knob}
        aria-hidden
        className="relative z-10 grid size-8 place-items-center rounded-full bg-foreground text-background shadow-[0_2px_8px_-2px_oklch(0_0_0/0.35)]"
        initial={false}
        animate={{ x: dark ? 50 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={theme}
            className="grid place-items-center"
            initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0.4, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {dark ? <Moon className="size-4" /> : <Sun className="size-4" />}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </button>
  );
}
