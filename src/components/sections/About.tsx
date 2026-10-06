import {
  animate,
  interpolate,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import portrait from "@/assets/portrait.jpg";
import { Eyebrow, ScrollLitText } from "../fx/Reveal";
import { VelocityMarquee } from "../fx/VelocityMarquee";

/** Counts up from 0 once the number scrolls into view (instantly final with reduced motion). */
function Counter({ to, suffix = "+" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setN(to);
      return;
    }
    const controls = animate(0, to, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduce, to]);
  return (
    <span ref={ref} className="tabular-nums" aria-label={`${to}${suffix}`}>
      <span aria-hidden>
        {n}
        <span className="text-highlight">{suffix}</span>
      </span>
    </span>
  );
}

const stats = [
  { to: 3, label: "Years in GoHighLevel" },
  { to: 100, label: "Funnels built and launched" },
  { to: 80, label: "CRM systems set up" },
  { to: 100, label: "Automations built from scratch" },
];

const band = [
  "GoHighLevel",
  "Funnels",
  "Automations",
  "CRM Systems",
  "SaaS Builds",
  "Zapier",
  "Make",
  "HubSpot",
];

function Band({ reverse = false }: { reverse?: boolean }) {
  return (
    <VelocityMarquee baseVelocity={reverse ? -2 : 2}>
      {band.map((b) => (
        <span key={b} className="flex items-center gap-8 pr-8 font-mega text-5xl md:text-7xl">
          {b}
          <svg viewBox="0 0 24 24" className="size-8 md:size-10" aria-hidden>
            <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" fill="currentColor" />
          </svg>
        </span>
      ))}
    </VelocityMarquee>
  );
}

const mixClip = interpolate(
  [0, 0.45],
  ["inset(30% 30% 30% 30% round 50%)", "inset(0% 0% 0% 0% round 24px)"],
);

/* the photo frame keeps the original theme yellow regardless of page theme */
const PHOTO_BACKDROP = "oklch(0.88 0.18 95)";

export function About() {
  const imgRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: imgRef, offset: ["start end", "end start"] });
  // exactly the original reveal (oval -> rounded rect), mixed with framer's own interpolator but
  // through a function transform so it stays off the native scroll-timeline path
  const clip = useTransform(scrollYProgress, mixClip);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.35, 1]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-6, 6]);

  return (
    <>
      {/* crossing marquee bands */}
      {/* rotated bands are wider than the viewport: clip them here, not on <body>.
          The gap equals their combined tilt across the width (tan 3° + tan 2° ≈ 0.087 / 2), so the
          bands converge at the left edge without ever covering each other's text. */}
      <div className="relative z-10 overflow-x-clip py-16 md:py-24">
        <div className="-rotate-3 bg-secondary text-secondary-foreground py-4 md:py-5 shadow-glow">
          <Band />
        </div>
        <div className="rotate-2 mt-[calc(4.4vw+0.25rem)] bg-foreground text-background py-4 md:py-5 opacity-95">
          <Band reverse />
        </div>
      </div>

      <section id="about" className="relative overflow-x-clip px-4 md:px-10 py-24 md:py-40">
        <Eyebrow index="01" label="About me" />

        <div className="mt-12 grid lg:grid-cols-[1.4fr_1fr] gap-16 items-start">
          <div>
            <ScrollLitText
              className="font-display text-3xl sm:text-4xl md:text-6xl font-bold leading-[1.08] tracking-tight"
              text="Most businesses don't have a lead problem. They have a *follow-up *problem. I build the systems that fix it."
            />

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.9 }}
              className="mt-12 max-w-2xl text-muted-foreground text-lg leading-relaxed"
            >
              I&apos;m Bakht Ali Niazi. Since 2023 I&apos;ve launched 100+ funnels, set up 80+ CRM
              systems and built 100+ automations from scratch, from quick two-step follow-ups to 30+
              complete lead-to-close systems. Two white-label agencies, Markelop (Mexico) and
              Convertio, trusted me as their senior GHL expert. Today I hold the same seat at VA Hub
              Pro, and I still work directly with my own freelance clients.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="mt-5 max-w-2xl text-muted-foreground text-lg leading-relaxed"
            >
              Real estate, insurance, home services, education, travel: I&apos;ve built GHL SaaS
              systems for all of them. Three years in design and two in Amazon e-commerce taught me
              two rules I still build by: a funnel has to look the part, and every system has to
              answer to revenue.
            </motion.p>

            <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-border pt-10">
              {stats.map((st) => (
                <div key={st.label}>
                  <p className="font-mega text-6xl sm:text-7xl md:text-8xl">
                    <Counter to={st.to} />
                  </p>
                  <p className="mt-3 text-xs tracking-[0.25em] uppercase text-muted-foreground">
                    {st.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div ref={imgRef} className="relative lg:sticky lg:top-28">
            <motion.div
              style={{ clipPath: clip, rotate, backgroundColor: PHOTO_BACKDROP }}
              className="relative aspect-[4/5] overflow-hidden"
            >
              <motion.img
                src={portrait}
                alt="Bakht Ali Niazi"
                width={1600}
                height={1600}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ scale: imgScale, y: imgY }}
              />
            </motion.div>
            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 120, damping: 12, delay: 0.3 }}
              className="absolute -left-6 -bottom-6 grid size-28 place-items-center rounded-full bg-foreground text-background text-center font-display text-xs font-bold uppercase leading-tight tracking-wider"
            >
              GHL
              <br />
              Expert
              <br />
              Since '23
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
