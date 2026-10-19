import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState, type MouseEvent } from "react";
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
 * Light/dark switch. Light is the default; the choice is remembered. Where the browser supports
 * view transitions the new theme opens as a circle from the button, otherwise it switches at once.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("light");
  useEffect(() => setTheme(isDark() ? "dark" : "light"), []);

  const toggle = (e: MouseEvent<HTMLButtonElement>) => {
    const next: Theme = isDark() ? "light" : "dark";
    const [x, y] = centreOf(e.currentTarget);
    revealFrom(x, y, () => {
      apply(next);
      setTheme(next);
    });
  };

  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={dark}
      title={dark ? "Light mode" : "Dark mode"}
      className={`relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-full border border-border bg-background/70 text-foreground backdrop-blur transition-colors hover:bg-secondary hover:text-secondary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)] ${className}`}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={theme}
          className="grid place-items-center"
          initial={{ y: 18, rotate: -90, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          exit={{ y: -18, rotate: 90, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {dark ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
