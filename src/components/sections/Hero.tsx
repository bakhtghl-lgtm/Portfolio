import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight, LayoutTemplate, Workflow } from "lucide-react";
import { useRef } from "react";
import cutout from "@/assets/portrait-cutout.webp";
import { useIntroDone } from "../fx/Preloader";
import { scrollToId } from "../fx/SmoothScroll";
import { Magnetic } from "../fx/Magnetic";
import { WhatsAppButton } from "../social";

const EASE = [0.76, 0, 0.24, 1] as const;
const SOFT = [0.22, 1, 0.36, 1] as const;

const proof = [
  { value: "100+", label: "Funnels launched" },
  { value: "80+", label: "CRM systems set up" },
  { value: "100+", label: "Automations built" },
];

const stack = ["GoHighLevel", "Zapier", "Make", "HubSpot", "Zoho CRM", "Closebot"];

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
          transition={{ duration: 1, ease: EASE, delay: delay + i * 0.03 }}
        >
          {ch === " " ? " " : ch}
        </motion.span>
      ))}
    </span>
  );
}

/** Fade-and-rise for the supporting copy, sequenced after the headline. */
function Rise({
  play,
  delay,
  className = "",
  children,
}: {
  play: boolean;
  delay: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={play ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.9, ease: SOFT, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Small floating proof card pinned to the portrait. */
function Chip({
  icon,
  title,
  sub,
  className,
  play,
  delay,
  float,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
  className: string;
  play: boolean;
  delay: number;
  float: number;
}) {
  return (
    <motion.div
      className={`absolute z-20 ${className}`}
      initial={{ opacity: 0, scale: 0.85, y: 16 }}
      animate={play ? { opacity: 1, scale: 1, y: 0 } : undefined}
      transition={{ type: "spring", stiffness: 160, damping: 16, delay }}
    >
      <motion.div
        animate={{ y: [0, -float, 0] }}
        transition={{ duration: 5 + float / 4, repeat: Infinity, ease: "easeInOut" }}
        className="flex items-center gap-3 rounded-2xl border border-border bg-background/95 py-2.5 pl-2.5 pr-4 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.35)] backdrop-blur"
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-secondary-foreground">
          {icon}
        </span>
        <span className="leading-tight">
          <span className="block font-display text-sm font-bold text-foreground">{title}</span>
          <span className="block text-xs text-muted-foreground">{sub}</span>
        </span>
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  const play = useIntroDone();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // gentle scroll-out: copy drifts up and fades, portrait sinks a little slower (depth)
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const copyFade = useTransform(scrollYProgress, (v) => 1 - Math.min(1, v * 1.4));
  const photoY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  // pointer tilt on the portrait card
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotY = useSpring(
    useTransform(mx, (v) => v * 6),
    { stiffness: 80, damping: 18 },
  );
  const rotX = useSpring(
    useTransform(my, (v) => v * -5),
    { stiffness: 80, damping: 18 },
  );

  return (
    <section
      id="intro"
      ref={ref}
      className="relative overflow-x-clip"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        mx.set(e.clientX / window.innerWidth - 0.5);
        my.set(e.clientY / window.innerHeight - 0.5);
      }}
    >
      {/* quiet dot grid, fading out toward the edges */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: "radial-gradient(var(--foreground) 1px, transparent 1.2px)",
          backgroundSize: "22px 22px",
          maskImage: "radial-gradient(ellipse 70% 60% at 60% 45%, black, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 60% 45%, black, transparent 80%)",
        }}
      />

      <div className="relative mx-auto grid min-h-[100svh] max-w-[1440px] items-center gap-12 px-4 pb-16 pt-[calc(var(--header-h)+env(safe-area-inset-top,0px)+2.5rem)] md:px-10 lg:grid-cols-[1.12fr_0.88fr] lg:gap-10 lg:pb-20">
        {/* ── copy ─────────────────────────────────────────── */}
        <motion.div style={{ y: copyY, opacity: copyFade }} className="relative z-10 min-w-0">
          <Rise play={play} delay={0.1}>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-border bg-background/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground backdrop-blur">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-500 opacity-70" />
                <span className="relative inline-flex size-2 rounded-full bg-green-600" />
              </span>
              <span className="sm:hidden">Open for projects</span>
              <span className="hidden sm:inline">Senior GHL Expert · Open for projects</span>
            </span>
          </Rise>

          {/* GOHIGHLEVEL = 4.66em: sized to the copy column */}
          <h1 className="mt-7 font-mega text-[clamp(3.25rem,calc((100vw-2rem)/5),8rem)] lg:text-[min(9.4vw,10.5rem)]">
            <span className="sr-only">Bakht Ali, senior GoHighLevel expert</span>
            <span aria-hidden className="block whitespace-nowrap">
              <Letters text="GOHIGHLEVEL" play={play} delay={0.15} />
            </span>
            <span aria-hidden className="block whitespace-nowrap">
              <span className="hl">
                <Letters text="EXPERT." play={play} delay={0.4} />
              </span>
            </span>
          </h1>

          <Rise play={play} delay={0.75}>
            <p className="mt-7 max-w-[34rem] text-lg leading-relaxed text-muted-foreground md:text-xl">
              I build the <span className="font-semibold text-foreground">funnels</span>,{" "}
              <span className="font-semibold text-foreground">automations</span> and{" "}
              <span className="font-semibold text-foreground">CRM systems</span> that turn cold
              clicks into booked calls, and keep following up long after your team logs off.
            </p>
          </Rise>

          <Rise play={play} delay={0.9} className="mt-9 flex flex-wrap items-center gap-3">
            <Magnetic strength={0.25}>
              <button
                type="button"
                onClick={() => scrollToId("contact")}
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-bold uppercase tracking-[0.15em] text-background transition hover:bg-secondary hover:text-secondary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
              >
                Start a project
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
              </button>
            </Magnetic>
            <WhatsAppButton label="WhatsApp me" className="py-3.5" />
            <button
              type="button"
              onClick={() => scrollToId("portfolio")}
              className="group inline-flex items-center gap-2 px-2 py-3 text-sm font-semibold text-foreground underline decoration-secondary decoration-[3px] underline-offset-[6px] transition hover:decoration-foreground"
            >
              See my work
              <ArrowDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" />
            </button>
          </Rise>

          <Rise play={play} delay={1.05}>
            <dl className="mt-12 grid max-w-[34rem] grid-cols-3 divide-x divide-border border-t border-border pt-6">
              {proof.map((p) => (
                <div key={p.label} className="px-4 first:pl-0">
                  <dt className="sr-only">{p.label}</dt>
                  <dd>
                    <span className="block font-mega text-4xl leading-none md:text-5xl">
                      {p.value}
                    </span>
                    <span className="mt-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      {p.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </Rise>
        </motion.div>

        {/* ── portrait card ────────────────────────────────── */}
        <motion.div
          style={{ y: photoY, perspective: 1200 }}
          className="relative mx-auto w-full max-w-[340px] sm:max-w-[420px] lg:max-w-[520px]"
        >
          {/* soft yellow bloom behind the card */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -inset-[12%] rounded-full bg-secondary/40 blur-[80px]"
            initial={{ opacity: 0 }}
            animate={play ? { opacity: 1 } : undefined}
            transition={{ duration: 1.6, delay: 0.3 }}
          />
          <motion.div
            style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
            className="relative aspect-[5/6]"
          >
            {/* the yellow card starts below the head, so the portrait pops out of it */}
            <motion.div
              className="absolute inset-x-0 bottom-0 top-[24%] overflow-hidden rounded-[2rem] bg-secondary shadow-[0_40px_80px_-40px_rgba(0,0,0,0.45)]"
              initial={{ clipPath: "inset(100% 0% 0% 0% round 32px)" }}
              animate={play ? { clipPath: "inset(0% 0% 0% 0% round 32px)" } : undefined}
              transition={{ duration: 1.2, ease: EASE, delay: 0.25 }}
            >
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.14]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(135deg, var(--secondary-foreground) 0 1px, transparent 1px 14px)",
                }}
              />
              <span
                aria-hidden
                className="absolute -right-3 bottom-3 font-mega text-[9rem] leading-none text-secondary-foreground/10"
              >
                GHL
              </span>
            </motion.div>

            {/* cut-out portrait: clipped to the card's rounded bottom, free above it */}
            {/* 128% wide so the head rises out of the card; side insets (11% each) trim the
                overflow back to the card's edges, the bottom keeps the card's rounded corners */}
            <div
              className="absolute bottom-0 left-[-14%] w-[128%]"
              style={{ clipPath: "inset(-60% 11% 0% 11% round 0 0 32px 32px)" }}
            >
              <motion.img
                src={cutout}
                alt="Bakht Ali Niazi"
                width={1200}
                height={996}
                fetchPriority="high"
                className="block w-full max-w-none"
                initial={{ opacity: 0, y: 60 }}
                animate={play ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 1.3, ease: SOFT, delay: 0.5 }}
              />
            </div>

            <Chip
              play={play}
              delay={1.15}
              float={7}
              className="-left-2 bottom-[30%] sm:-left-10 sm:bottom-auto sm:top-[38%]"
              icon={<LayoutTemplate className="size-5" />}
              title="100+ funnels"
              sub="Built & launched in GHL"
            />
            <Chip
              play={play}
              delay={1.3}
              float={5}
              className="-right-2 bottom-[6%] sm:-right-8 sm:bottom-[12%]"
              icon={<Workflow className="size-5" />}
              title="Senior GHL Expert"
              sub="VA Hub Pro · Remote"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* stack strip */}
      <Rise
        play={play}
        delay={1.2}
        className="relative mx-auto max-w-[1440px] px-4 pb-10 md:px-10 lg:-mt-6"
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border pt-5 text-sm">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            Works with
          </span>
          {stack.map((s) => (
            <span key={s} className="font-display font-semibold text-foreground/80">
              {s}
            </span>
          ))}
        </div>
      </Rise>
    </section>
  );
}
