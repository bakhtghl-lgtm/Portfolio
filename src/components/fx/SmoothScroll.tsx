import { useEffect } from "react";
import Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/** Inertia scrolling for the whole page. Skipped when the user prefers reduced motion. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      // lower lerp = longer glide after the wheel stops
      lerp: 0.07,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
      anchors: { offset: 0 },
      autoRaf: true,
    });
    window.__lenis = lenis;
    return () => {
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);
  return null;
}

/** Pause/resume page scrolling (e.g. while a modal or the menu is open). */
export function lockScroll(locked: boolean) {
  if (window.__lenis) {
    if (locked) window.__lenis.stop();
    else window.__lenis.start();
  } else {
    document.documentElement.style.overflow = locked ? "hidden" : "";
  }
}

/** Smooth-scroll so the section's top lands just below the sticky header. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const headerH = document.querySelector("header")?.getBoundingClientRect().height ?? 0;
  // ignore the sway wrapper's momentary offset so the target lands exactly under the header
  const sway = document.querySelector<HTMLElement>("[data-sway]");
  const swayY = sway ? new DOMMatrixReadOnly(getComputedStyle(sway).transform).m42 : 0;
  const top =
    id === "intro" ? 0 : el.getBoundingClientRect().top - swayY + window.scrollY - headerH;
  if (window.__lenis) window.__lenis.scrollTo(top, { duration: 1.4 });
  else window.scrollTo({ top, behavior: "smooth" });
}
