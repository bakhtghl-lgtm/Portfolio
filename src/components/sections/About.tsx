import { interpolate, motion, useInView, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import portrait from "@/assets/portrait.jpg";
import { Eyebrow, ScrollLitText } from "../fx/Reveal";
import { VelocityMarquee } from "../fx/VelocityMarquee";

function Counter({ to, suffix = "+" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const dur = 1600;
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min((t - t0) / dur, 1);
      setN(Math.floor(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, to]);
  return (
    <span ref={ref}>
      {n}
      <span className="text-highlight">{suffix}</span>
    </span>
  );
}

const band = ["Funnels", "Automations", "CRM Pipelines", "Email & SMS", "Chatbots", "Integrations"];

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
              text="Every successful business runs on a smart *automation *system. I turn messy processes into clean systems your team can actually run."
            />

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.9 }}
              className="mt-12 max-w-2xl text-muted-foreground text-lg leading-relaxed"
            >
              I'm Bakht Ali Niazi — a GoHighLevel specialist with 3+ years of hands-on experience
              building funnels, pipelines, and automation workflows for agencies and service
              businesses. My background in Computer Science helps me turn messy processes into clean
              systems: lead capture, follow-up, routing, and reporting that teams can actually run
              day-to-day.
            </motion.p>

            <div className="mt-16 grid grid-cols-2 gap-6 border-t border-border pt-10">
              <div>
                <p className="font-mega text-7xl md:text-9xl">
                  <Counter to={3} />
                </p>
                <p className="mt-3 text-xs tracking-[0.25em] uppercase text-muted-foreground">
                  Years of experience
                </p>
              </div>
              <div>
                <p className="font-mega text-7xl md:text-9xl">
                  <Counter to={50} />
                </p>
                <p className="mt-3 text-xs tracking-[0.25em] uppercase text-muted-foreground">
                  High-converting funnels delivered
                </p>
              </div>
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
