import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { lockScroll, scrollToId } from "./fx/SmoothScroll";
import { Magnetic } from "./fx/Magnetic";
import {
  FacebookIcon,
  LinkedInIcon,
  WhatsAppButton,
  facebookUrl,
  linkedinUrl,
  hireMeHref,
} from "./social";

const links = [
  { id: "intro", label: "Home" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "skills", label: "Skills" },
  { id: "resume", label: "Resume" },
  { id: "portfolio", label: "Work" },
  { id: "testimonial", label: "Clients" },
  { id: "contact", label: "Contact" },
];

const EASE = [0.76, 0, 0.24, 1] as const;

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [time, setTime] = useState("");
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  // transparent over the top of the hero, solid/blurred everywhere else
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > window.innerHeight * 0.6));

  useEffect(() => {
    lockScroll(open);
    const root = document.documentElement;
    if (open) root.setAttribute("data-menu-open", "");
    else root.removeAttribute("data-menu-open");
  }, [open]);

  useEffect(() => {
    const fmt = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Karachi",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date()),
      );
    fmt();
    const id = setInterval(fmt, 30_000);
    return () => clearInterval(id);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    // wait for the menu curtain to start closing before scrolling
    setTimeout(() => scrollToId(id), 350);
  };

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-secondary origin-left z-[60]"
        style={{ scaleX: progress }}
      />

      <header
        className="fixed top-0 inset-x-0 z-50"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        <div
          className={`flex items-center justify-between gap-3 px-4 md:px-10 transition-[padding,background-color,box-shadow,backdrop-filter] duration-500 ${
            scrolled && !open
              ? "py-2.5 bg-background/85 backdrop-blur-md shadow-[0_1px_0_var(--border),0_10px_30px_-20px_oklch(0_0_0/0.35)]"
              : "py-4 md:py-5"
          }`}
        >
          <button
            type="button"
            onClick={() => go("intro")}
            aria-label="Bakht Ali — back to top"
            className={`group flex min-w-0 items-center gap-2 font-display text-base sm:text-lg font-bold tracking-tight transition-colors duration-500 ${open ? "text-secondary-foreground" : "text-foreground"}`}
          >
            <span
              className={`grid size-9 shrink-0 place-items-center rounded-full text-sm transition-[transform,background-color,color] duration-500 group-hover:rotate-[360deg] ${
                open
                  ? "bg-secondary-foreground text-secondary"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              B
            </span>
            <span className="overflow-hidden h-[1.4em] whitespace-nowrap">
              <span className="block transition-transform duration-500 group-hover:-translate-y-full">
                Bakht Ali®
              </span>
              <span
                className={`block transition-transform duration-500 group-hover:-translate-y-full ${open ? "" : "text-highlight"}`}
              >
                GHL Expert
              </span>
            </span>
          </button>

          <div className="flex shrink-0 items-center gap-2 md:gap-3">
            <div
              className={`${open ? "lg:hidden" : "lg:flex"} hidden items-center gap-2 rounded-full glass px-4 py-2 text-[11px] uppercase tracking-[0.25em] text-muted-foreground`}
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-500 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-green-600" />
              </span>
              Available · Multan {time}
            </div>
            {!open ? (
              <button
                type="button"
                onClick={() => scrollToId("contact")}
                className="hidden md:inline-flex items-center rounded-full bg-secondary px-4 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-secondary-foreground transition hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
              >
                Hire me
              </button>
            ) : null}
            <Magnetic>
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                className="relative z-[70] flex items-center gap-3 rounded-full bg-foreground text-background pl-5 pr-2 py-2 text-xs font-bold uppercase tracking-[0.25em]"
              >
                <span className="overflow-hidden h-[1.3em]">
                  <motion.span
                    className="block"
                    animate={{ y: open ? "-50%" : "0%" }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    <span className="block h-[1.3em]">Menu</span>
                    <span className="block h-[1.3em]">Close</span>
                  </motion.span>
                </span>
                <span className="relative grid size-8 place-items-center rounded-full bg-secondary">
                  <motion.span
                    className="absolute h-[2px] w-3.5 bg-secondary-foreground"
                    animate={{ rotate: open ? 45 : 0, y: open ? 0 : -3 }}
                  />
                  <motion.span
                    className="absolute h-[2px] w-3.5 bg-secondary-foreground"
                    animate={{ rotate: open ? -45 : 0, y: open ? 0 : 3 }}
                  />
                </span>
              </button>
            </Magnetic>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            key="menu"
            className="fixed inset-0 z-40 bg-secondary text-secondary-foreground"
            initial={{ clipPath: "circle(0% at calc(100% - 4rem) 2.5rem)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 4rem) 2.5rem)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 4rem) 2.5rem)" }}
            transition={{ duration: 0.9, ease: EASE }}
            data-lenis-prevent
          >
            <div className="h-full overflow-y-auto px-6 md:px-16 pt-[calc(6.5rem+env(safe-area-inset-top,0px))] pb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-12">
              <nav className="flex flex-col">
                {links.map((l, i) => (
                  <div key={l.id} className="mask">
                    <motion.button
                      type="button"
                      onClick={() => go(l.id)}
                      initial={{ y: "110%" }}
                      animate={{ y: "0%" }}
                      exit={{ y: "110%" }}
                      transition={{ duration: 0.8, ease: EASE, delay: 0.25 + i * 0.05 }}
                      className="group flex items-center gap-4 font-mega text-[clamp(2.5rem,13vw,4.5rem)] sm:text-[clamp(3rem,10vw,6rem)] lg:text-[min(7.2vw,8rem,calc((100svh-11rem)/8.6))] leading-[0.95] text-left"
                    >
                      <span className="w-6 shrink-0 font-sans text-xs font-bold tracking-widest opacity-70">
                        0{i + 1}
                      </span>
                      <span className="relative">
                        {l.label}
                        <span className="absolute left-0 bottom-[0.08em] h-[0.08em] w-full bg-secondary-foreground origin-right scale-x-0 transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
                      </span>
                    </motion.button>
                  </div>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-6 text-sm font-medium lg:text-right"
              >
                <div>
                  <p className="text-[11px] uppercase tracking-[0.3em] opacity-60 mb-2">
                    Say hello
                  </p>
                  <a
                    href={hireMeHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-display text-2xl font-bold underline-offset-4 hover:underline"
                  >
                    bakht.ghl@gmail.com
                  </a>
                  <WhatsAppButton className="mt-4" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.3em] opacity-60 mb-2">Based in</p>
                  <p>Gulgasht, Multan, Pakistan</p>
                </div>
                <div className="flex gap-3 lg:justify-end">
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Facebook"
                    className="grid size-11 place-items-center rounded-full border border-secondary-foreground/30 hover:bg-secondary-foreground hover:text-secondary transition"
                  >
                    <FacebookIcon />
                  </a>
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                    className="grid size-11 place-items-center rounded-full border border-secondary-foreground/30 hover:bg-secondary-foreground hover:text-secondary transition"
                  >
                    <LinkedInIcon />
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
