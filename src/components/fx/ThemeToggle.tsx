import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState, type MouseEvent } from "react";
import { flushSync } from "react-dom";

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

type ViewTransitionDoc = Document & {
  startViewTransition?: (update: () => void) => { ready: Promise<void> };
};

/**
 * Light/dark switch. Light is the default; the choice is remembered. Where the browser supports
 * view transitions the new theme opens as a circle from the button, otherwise it switches at once.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("light");
  useEffect(() => setTheme(isDark() ? "dark" : "light"), []);

  const toggle = (e: MouseEvent<HTMLButtonElement>) => {
    const next: Theme = isDark() ? "light" : "dark";
    const doc = document as ViewTransitionDoc;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!doc.startViewTransition || reduce) {
      apply(next);
      setTheme(next);
      return;
    }
    const r = e.currentTarget.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const vt = doc.startViewTransition(() => {
      apply(next);
      flushSync(() => setTheme(next));
    });
    vt.ready
      .then(() =>
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          {
            duration: 750,
            easing: "cubic-bezier(0.76, 0, 0.24, 1)",
            pseudoElement: "::view-transition-new(root)",
          },
        ),
      )
      .catch(() => {});
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
