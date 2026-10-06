import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import cutout from "@/assets/portrait-cutout.webp";
import { useIntroDone } from "../fx/Preloader";
import { scrollToId } from "../fx/SmoothScroll";
import { Magnetic } from "../fx/Magnetic";
import { WhatsAppIcon, whatsappHref } from "../social";

const EASE = [0.76, 0, 0.24, 1] as const;
const SOFT = [0.22, 1, 0.36, 1] as const;

const ramp = (v: number, a: number, b: number) => Math.min(1, Math.max(0, (v - a) / (b - a)));

/** Per-letter slide-up reveal inside a glyph-safe mask. */
function Letters({ text, play, delay = 0 }: { text: string; play: boolean; delay?: number }) {
  return (
    <span className="mask-inline">
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ y: "105%" }}
          animate={play ? { y: "0%" } : undefined}
          transition={{ duration: 1.05, ease: EASE, delay: delay + i * 0.035 }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

function Fade({
  play,
  delay,
  style,
  className = "",
  children,
}: {
  play: boolean;
  delay: number;
  style?: { opacity: MotionValue<number> };
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div className={className} style={style}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={play ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.9, ease: SOFT, delay }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/**
 * Poster hero: full-width GOHIGHLEVEL / EXPERT., portrait in front of the type on a yellow
 * panel. The stage pins while you scroll: the headline splits apart and the panel opens until
 * it fills the screen, handing over to the next section.
 */
export function Hero() {
  const play = useIntroDone();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // function transforms keep these off framer's native scroll-timeline path
  const panel = useTransform(p, (v) => (reduce ? 0 : ramp(v, 0.1, 0.72)));
  const line1X = useTransform(p, (v) => `${-ramp(v, 0, 0.85) * 22}%`);
  const line2X = useTransform(p, (v) => `${ramp(v, 0, 0.85) * 22}%`);
  const typeFade = useTransform(p, (v) => 1 - ramp(v, 0.5, 0.85));
  const uiFade = useTransform(p, (v) => 1 - ramp(v, 0, 0.22));
  const photoScale = useTransform(p, (v) => 1 - 0.07 * ramp(v, 0.1, 0.9));

  return (
    <section
      id="intro"
      ref={ref}
      className="relative"
      style={{ height: reduce ? "100svh" : "185svh" }}
    >
      <div className="hero-stage sticky top-0 h-[100svh] min-h-[560px] overflow-hidden">
        {/* yellow panel: a card behind the portrait that opens to full screen on scroll */}
        <motion.div
          aria-hidden
          className="hero-panel absolute inset-0 z-0 overflow-hidden"
          style={{ "--p": panel } as React.CSSProperties}
        >
          <motion.div
            className="absolute inset-0 bg-secondary"
            initial={{ y: "100%" }}
            animate={play ? { y: "0%" } : undefined}
            transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}
          />
        </motion.div>

        {/* headline: behind the portrait, in front of the panel */}
        <motion.h1
          className="absolute inset-x-0 top-[calc(var(--header-h)+env(safe-area-inset-top,0px)+0.5rem)] z-10 px-4 font-mega fs-hero leading-[0.92] text-foreground md:px-6"
          style={{ opacity: typeFade }}
        >
          <span className="sr-only">Bakht Ali, senior GoHighLevel expert</span>
          <motion.span aria-hidden className="block whitespace-nowrap" style={{ x: line1X }}>
            <Letters text="GOHIGHLEVEL" play={play} delay={0.1} />
          </motion.span>
          <motion.span aria-hidden className="block whitespace-nowrap" style={{ x: line2X }}>
            <Letters text="EXPERT" play={play} delay={0.3} />
            {/* the full stop is a yellow square, the one spot of colour in the type */}
            <motion.span
              className="ml-[0.06em] inline-block size-[0.17em] bg-secondary align-baseline"
              initial={{ scale: 0 }}
              animate={play ? { scale: 1 } : undefined}
              transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.95 }}
            />
          </motion.span>
        </motion.h1>

        {/* portrait, in front of the type */}
        <motion.div
          className="hero-photo absolute bottom-0 z-20 origin-bottom"
          style={{ scale: photoScale }}
        >
          <motion.img
            src={cutout}
            alt="Bakht Ali Niazi"
            width={1200}
            height={996}
            fetchPriority="high"
            className="block w-full"
            initial={{ opacity: 0, y: "18%" }}
            animate={play ? { opacity: 1, y: "0%" } : undefined}
            transition={{ duration: 1.3, ease: SOFT, delay: 0.45 }}
          />
        </motion.div>

        {/* services list + actions: under the headline on phones, bottom-left on desktop */}
        <Fade
          play={play}
          delay={1}
          style={{ opacity: uiFade }}
          className="absolute inset-x-4 z-30 top-[calc(var(--header-h)+env(safe-area-inset-top,0px)+1.75rem+1.9*max(2.5rem,min((100vw-2rem)/4.75,(100svh-20rem)/1.95)))] md:inset-x-6 lg:inset-x-auto lg:left-6 lg:top-auto lg:bottom-10"
        >
          <ul className="space-y-1 font-mega text-2xl leading-[1.05] md:text-3xl">
            {["Funnels & Websites", "Automations", "CRM & SaaS Systems"].map((s) => (
              <li key={s}>
                <span className="font-sans font-bold">/</span> {s}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <Magnetic strength={0.25}>
              <button
                type="button"
                onClick={() => scrollToId("contact")}
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-background transition hover:bg-secondary hover:text-secondary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
              >
                Start a project
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
              </button>
            </Magnetic>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-background/80 px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-foreground backdrop-blur transition hover:border-[#25D366] hover:bg-[#25D366] hover:text-[#0b2915]"
            >
              <WhatsAppIcon className="size-4" />
              WhatsApp
            </a>
          </div>
        </Fade>

        {/* vertical motto, right edge (desktop) */}
        <Fade
          play={play}
          delay={1.2}
          style={{ opacity: uiFade }}
          className="absolute right-6 top-[46%] z-30 hidden lg:block"
        >
          <div className="flex items-center gap-4 border-l border-foreground/25 pl-4">
            <ul className="space-y-2 text-[10px] font-semibold uppercase tracking-[0.55em] text-foreground/75">
              {["Build", "Design", "Automate", "Repeat"].map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </div>
        </Fade>
      </div>
    </section>
  );
}
