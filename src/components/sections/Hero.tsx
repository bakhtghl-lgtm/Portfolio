import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useId, useRef } from "react";
import cutout from "@/assets/portrait-cutout.webp";
import { useIntroDone } from "../fx/Preloader";
import { scrollToId } from "../fx/SmoothScroll";

const EASE = [0.76, 0, 0.24, 1] as const;

function ServiceList({ play, className = "" }: { play: boolean; className?: string }) {
  return (
    <motion.ul
      className={`space-y-1 font-mega leading-none ${className}`}
      initial="hidden"
      animate={play ? "show" : "hidden"}
      variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 1.1 } } }}
    >
      {["Funnel Building", "Automations", "CRM Systems"].map((s) => (
        <li key={s} className="mask">
          <motion.span
            className="block"
            variants={{ hidden: { y: "110%" }, show: { y: "0%" } }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <span className="text-highlight">/</span> {s}
          </motion.span>
        </li>
      ))}
    </motion.ul>
  );
}

function Intro({ className = "" }: { className?: string }) {
  return (
    <p className={`leading-relaxed text-muted-foreground ${className}`}>
      Say hi from <span className="text-foreground font-semibold">Bakht Ali</span> — I build
      high-converting funnels, automations, and CRM systems that turn clicks into customers.
    </p>
  );
}

function ScrollBadge({ className = "" }: { className?: string }) {
  const pathId = useId();
  return (
    <button
      type="button"
      onClick={() => scrollToId("portfolio")}
      aria-label="Scroll to portfolio"
      data-cursor="Work"
      className={`relative rounded-full bg-background/70 backdrop-blur border border-border grid place-items-center group ${className}`}
    >
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute inset-0 size-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      >
        <defs>
          <path id={pathId} d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <text className="fill-muted-foreground text-[10px] tracking-[0.4em] uppercase">
          <textPath href={`#${pathId}`}>My Projects • My Projects • </textPath>
        </text>
      </motion.svg>
      <span className="size-10 rounded-full bg-secondary text-secondary-foreground grid place-items-center shadow-glow transition group-hover:scale-125">
        <ArrowDown className="size-5" />
      </span>
    </button>
  );
}

function Letters({ text, play, delay = 0 }: { text: string; play: boolean; delay?: number }) {
  return (
    <span className="mask-inline">
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ y: "105%" }}
          animate={play ? { y: "0%" } : undefined}
          transition={{ duration: 1.1, ease: EASE, delay: delay + i * 0.035 }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

export function Hero() {
  const play = useIntroDone();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // scroll-out choreography: lines split apart, portrait sinks & shrinks, scene dims
  const line1X = useTransform(scrollYProgress, [0, 1], ["0%", "-35%"]);
  const line2X = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const portraitY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1, 0.82]);
  const glowScale = useTransform(scrollYProgress, [0, 1], [1, 2.4]);
  // function form: framer's accelerated scroll path mis-maps opacity offset arrays
  const dim = useTransform(scrollYProgress, (v) => Math.min(0.85, (v / 0.9) * 0.85));
  const sideY = useTransform(scrollYProgress, [0, 1], ["0%", "-120%"]);

  // pointer parallax: type and portrait drift in opposite directions
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 20 });
  const smy = useSpring(my, { stiffness: 60, damping: 20 });
  const textPX = useTransform(smx, (v) => v * -18);
  const textPY = useTransform(smy, (v) => v * -10);
  const imgPX = useTransform(smx, (v) => v * 22);
  const imgPY = useTransform(smy, (v) => v * 12);

  return (
    <section
      id="intro"
      ref={ref}
      className="relative h-[100svh] min-h-[640px] overflow-hidden"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        mx.set(e.clientX / window.innerWidth - 0.5);
        my.set(e.clientY / window.innerHeight - 0.5);
      }}
    >
      {/* backdrop grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "8vw 8vw",
          maskImage: "radial-gradient(ellipse at 50% 60%, black, transparent 75%)",
        }}
      />

      {/* yellow sun behind the portrait: wide soft bloom + hot core so the photo pops off the dark */}
      <motion.div
        className="absolute left-1/2 bottom-[-40vh] md:bottom-[-38vh] -translate-x-1/2 size-[150vw] md:size-[52vw] lg:size-[70vw] rounded-full"
        style={{
          scale: glowScale,
          background:
            "radial-gradient(circle, oklch(0.9 0.18 95) 0%, oklch(0.86 0.19 88 / 0.95) 30%, oklch(0.84 0.19 85 / 0.45) 52%, oklch(0.84 0.19 85 / 0) 72%)",
        }}
        initial={{ opacity: 0, y: 120 }}
        animate={play ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 1.6, ease: EASE, delay: 0.2 }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 bottom-[-10vh] -translate-x-1/2 size-[110vw] md:size-[38vw] lg:size-[48vw] rounded-full bg-secondary/35 blur-[90px]"
        initial={{ opacity: 0 }}
        animate={play ? { opacity: 1 } : undefined}
        transition={{ duration: 2, delay: 0.4 }}
      />

      {/* giant type — behind the portrait */}
      <motion.div
        className="absolute inset-x-0 top-[calc(var(--header-h)+env(safe-area-inset-top,0px)+0.75rem)] md:top-[12vh] px-4 md:px-6 font-mega text-foreground select-none"
        style={{ x: textPX, y: textPY }}
      >
        <motion.h1 style={{ x: line1X }} className="font-mega fs-hero whitespace-nowrap">
          <span className="sr-only">Bakht Ali — GoHighLevel Expert</span>
          <span aria-hidden>
            <Letters text="GOHIGHLEVEL" play={play} />
          </span>
        </motion.h1>
        <motion.div
          aria-hidden
          style={{ x: line2X }}
          className="font-mega fs-hero whitespace-nowrap text-right md:pr-[4vw]"
        >
          {/* black type on the yellow marker block, same accent style as every section heading */}
          <span className="hl">
            <Letters text="EXPERT" play={play} delay={0.25} />
            <motion.span
              className="inline-block"
              initial={{ scale: 0 }}
              animate={play ? { scale: 1 } : undefined}
              transition={{ type: "spring", stiffness: 260, damping: 12, delay: 1 }}
            >
              .
            </motion.span>
          </span>
        </motion.div>
      </motion.div>

      {/* portrait cut-out */}
      <motion.div
        className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[min(100vw,calc((100svh-24rem)*1.2))] min-w-[78vw] sm:w-[78vw] md:min-w-0 md:w-[min(80vw,84svh)] lg:w-[min(54vw,84svh)] max-w-[1000px] origin-bottom"
        style={{
          y: portraitY,
          scale: portraitScale,
          // let the photo dissolve into the page instead of a hard cut at the section edge
          maskImage: "linear-gradient(to bottom, #000 72%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, #000 72%, transparent 100%)",
        }}
      >
        <motion.div
          initial={{ y: "40%", opacity: 0 }}
          animate={play ? { y: "0%", opacity: 1 } : undefined}
          transition={{ duration: 1.4, ease: EASE, delay: 0.35 }}
        >
          <motion.img
            src={cutout}
            alt="Bakht Ali Niazi"
            width={1200}
            height={996}
            className="w-full h-auto [filter:drop-shadow(0_0_28px_oklch(0.88_0.18_95/0.5))_drop-shadow(0_30px_50px_rgba(0,0,0,0.22))]"
            style={{ x: imgPX, y: imgPY }}
            fetchPriority="high"
          />
        </motion.div>
      </motion.div>

      {/* crisp outline echo over the portrait so the letters the photo covers still read */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[calc(var(--header-h)+env(safe-area-inset-top,0px)+0.75rem)] md:top-[12vh] px-4 md:px-6 font-mega text-outline select-none"
        style={{ x: textPX, y: textPY }}
        initial={{ opacity: 0 }}
        animate={play ? { opacity: 1 } : undefined}
        transition={{ delay: 1.4, duration: 1 }}
      >
        <motion.div
          style={{ x: line1X }}
          className="font-mega fs-hero whitespace-nowrap text-outline"
        >
          <Letters text="GOHIGHLEVEL" play={play} />
        </motion.div>
        <motion.div
          style={{ x: line2X }}
          className="font-mega fs-hero whitespace-nowrap text-right md:pr-[4vw] text-outline"
        >
          {/* same box as the marker (padding) so the echo lines up; no fill, outline only */}
          <span className="hl text-outline" style={{ backgroundImage: "none" }}>
            <Letters text="EXPERT" play={play} delay={0.25} />
            <span className="inline-block opacity-0">.</span>
          </span>
        </motion.div>
      </motion.div>

      {/* bottom-left services list (lg+) */}
      <ServiceList
        play={play}
        className="hidden lg:block absolute left-8 bottom-12 z-10 text-3xl"
      />

      {/* phones + tablets: list + scroll button + intro under the headline, clear of the photo */}
      <motion.div
        className="lg:hidden absolute inset-x-4 md:inset-x-6 z-10 top-[calc(var(--header-h)+env(safe-area-inset-top,0px)+3.25rem+1.9*min(15.4vw,(100vw-2.5rem)/4.8))]"
        initial={{ opacity: 0 }}
        animate={play ? { opacity: 1 } : undefined}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <div className="flex items-start justify-between gap-4">
          <ServiceList play={play} className="text-xl md:text-3xl" />
          <ScrollBadge className="size-20 md:size-24 shrink-0" />
        </div>
        <Intro className="mt-3 max-w-[34ch] md:max-w-[44ch] text-[13px] md:text-base" />
      </motion.div>

      {/* right vertical motto */}
      <motion.div
        className="hidden lg:flex absolute right-8 top-[60%] z-10 items-center gap-4"
        style={{ y: sideY }}
        initial={{ opacity: 0, x: 30 }}
        animate={play ? { opacity: 1, x: 0 } : undefined}
        transition={{ delay: 1.3, duration: 0.8 }}
      >
        <span className="h-24 w-px bg-border" />
        <ul className="space-y-2 text-[10px] uppercase tracking-[0.6em] text-muted-foreground">
          {["Build", "Design", "Automate", "Repeat"].map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      </motion.div>

      {/* intro blurb + rotating projects badge (lg+) */}
      <motion.div
        className="hidden lg:flex absolute right-8 bottom-10 z-10 items-end gap-5"
        initial={{ opacity: 0, y: 30 }}
        animate={play ? { opacity: 1, y: 0 } : undefined}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        {/* dark scrim keeps the grey copy at AA where the yellow bloom reaches it */}
        <Intro className="hidden lg:block max-w-[290px] text-sm text-right rounded-2xl bg-background/75 px-4 py-3 backdrop-blur-md" />
        <ScrollBadge className="size-28" />
      </motion.div>

      <motion.div
        className="pointer-events-none absolute inset-0 z-20 bg-background"
        style={{ opacity: dim }}
      />
    </section>
  );
}
