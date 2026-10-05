import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { lockScroll, scrollToId } from "./fx/SmoothScroll";
import { Magnetic } from "./fx/Magnetic";
import { FacebookIcon, LinkedInIcon, facebookUrl, linkedinUrl, hireMeHref } from "./social";

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
  const [hidden, setHidden] = useState(false);
  const [time, setTime] = useState("");
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 200);
  });

  useEffect(() => {
    lockScroll(open);
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

      <motion.header
        className="fixed top-0 inset-x-0 z-50 px-4 md:px-10 pt-5"
        animate={{ y: hidden && !open ? "-120%" : "0%" }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => go("intro")}
            className={`group flex items-center gap-2 font-display text-lg font-bold tracking-tight transition-colors duration-500 ${open ? "text-secondary-foreground" : ""}`}
          >
            <span className="grid size-9 place-items-center rounded-full bg-secondary text-secondary-foreground text-sm transition-transform duration-500 group-hover:rotate-[360deg]">
              B
            </span>
            <span className="hidden sm:inline overflow-hidden h-[1.4em]">
              <span className="block transition-transform duration-500 group-hover:-translate-y-full">
                Bakht Ali®
              </span>
              <span className="block text-secondary transition-transform duration-500 group-hover:-translate-y-full">
                GHL Expert
              </span>
            </span>
          </button>

          <div className="flex items-center gap-3">
            <div
              className={`${open ? "md:hidden" : "md:flex"} hidden items-center gap-2 rounded-full glass px-4 py-2 text-[11px] uppercase tracking-[0.25em] text-muted-foreground`}
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-green-400" />
              </span>
              Available · Multan {time}
            </div>
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
      </motion.header>

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
            <div className="h-full overflow-y-auto px-6 md:px-16 pt-28 pb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-12">
              <nav className="flex flex-col">
                {links.map((l, i) => (
                  <div key={l.id} className="overflow-hidden">
                    <motion.button
                      type="button"
                      onClick={() => go(l.id)}
                      initial={{ y: "110%" }}
                      animate={{ y: "0%" }}
                      exit={{ y: "110%" }}
                      transition={{ duration: 0.8, ease: EASE, delay: 0.25 + i * 0.05 }}
                      className="group flex items-baseline gap-4 font-mega text-[13vw] sm:text-[10vw] lg:text-[7.2vw] text-left"
                    >
                      <span className="font-sans text-xs font-bold tracking-widest opacity-60">
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
                  <p className="mt-1">+92 325 1203232</p>
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
