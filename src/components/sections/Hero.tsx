import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useRef } from "react";
import cutout from "@/assets/portrait-cutout.webp";
import { useIntroDone } from "../fx/Preloader";
import { scrollToId } from "../fx/SmoothScroll";

const EASE = [0.76, 0, 0.24, 1] as const;

function Letters({ text, play, delay = 0 }: { text: string; play: boolean; delay?: number }) {
  return (
    <span className="inline-flex overflow-hidden">
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
  const dim = useTransform(scrollYProgress, [0, 0.9], [0, 0.85]);
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
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(1 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0) 1px, transparent 1px)",
          backgroundSize: "8vw 8vw",
          maskImage: "radial-gradient(ellipse at 50% 60%, black, transparent 75%)",
        }}
      />

      {/* yellow sun behind the portrait */}
      <motion.div
        className="absolute left-1/2 bottom-[-40vh] md:bottom-[-38vh] -translate-x-1/2 size-[150vw] md:size-[62vw] rounded-full"
        style={{
          scale: glowScale,
          background:
            "radial-gradient(circle, oklch(0.88 0.18 95) 0%, oklch(0.84 0.19 85 / 0.9) 38%, oklch(0.84 0.19 85 / 0) 70%)",
        }}
        initial={{ opacity: 0, y: 120 }}
        animate={play ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 1.6, ease: EASE, delay: 0.2 }}
      />

      {/* giant type — behind the portrait */}
      <motion.div
        className="absolute inset-x-0 top-[13vh] md:top-[12vh] px-3 md:px-6 font-mega text-foreground select-none"
        style={{ x: textPX, y: textPY }}
      >
        <motion.h1
          style={{ x: line1X }}
          className="font-mega text-[19vw] md:text-[15.4vw] whitespace-nowrap"
        >
          <span className="sr-only">Bakht Ali — GoHighLevel Expert</span>
          <span aria-hidden>
            <Letters text="GOHIGHLEVEL" play={play} />
          </span>
        </motion.h1>
        <motion.div
          aria-hidden
          style={{ x: line2X }}
          className="font-mega text-[19vw] md:text-[15.4vw] whitespace-nowrap text-right md:pr-[4vw]"
        >
          <Letters text="EXPERT" play={play} delay={0.25} />
          <motion.span
            className="inline-block text-secondary"
            initial={{ scale: 0 }}
            animate={play ? { scale: 1 } : undefined}
            transition={{ type: "spring", stiffness: 260, damping: 12, delay: 1 }}
          >
            .
          </motion.span>
        </motion.div>
      </motion.div>

      {/* portrait cut-out */}
      <motion.div
        className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[150vw] sm:w-[88vw] md:w-[60vw] lg:w-[54vw] max-w-[1000px] origin-bottom"
        style={{ y: portraitY, scale: portraitScale }}
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
            className="w-full h-auto drop-shadow-[0_40px_60px_rgba(0,0,0,0.55)]"
            style={{ x: imgPX, y: imgPY }}
            fetchPriority="high"
          />
        </motion.div>
      </motion.div>

      {/* outline echo of the type, in front of the portrait for depth */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[13vh] md:top-[12vh] px-3 md:px-6 font-mega text-outline select-none"
        style={{ x: textPX, y: textPY }}
        initial={{ opacity: 0 }}
        animate={play ? { opacity: 1 } : undefined}
        transition={{ delay: 1.4, duration: 1 }}
      >
        <motion.div
          style={{ x: line1X }}
          className="font-mega text-[19vw] md:text-[15.4vw] whitespace-nowrap"
        >
          <Letters text="GOHIGHLEVEL" play={play} />
        </motion.div>
        <motion.div
          style={{ x: line2X }}
          className="font-mega text-[19vw] md:text-[15.4vw] whitespace-nowrap text-right md:pr-[4vw]"
        >
          <Letters text="EXPERT" play={play} delay={0.25} />
          <span className="inline-block opacity-0">.</span>
        </motion.div>
      </motion.div>

      {/* bottom-left services list */}
      <motion.ul
        className="absolute left-4 md:left-8 top-[calc(13vh+40vw)] md:top-auto md:bottom-12 z-10 space-y-1 font-mega text-xl md:text-3xl leading-none"
        initial="hidden"
        animate={play ? "show" : "hidden"}
        variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 1.1 } } }}
      >
        {["Funnel Building", "Automations", "CRM Systems"].map((s) => (
          <li key={s} className="overflow-hidden">
            <motion.span
              className="block"
              variants={{ hidden: { y: "110%" }, show: { y: "0%" } }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              <span className="text-secondary">/</span> {s}
            </motion.span>
          </li>
        ))}
      </motion.ul>

      {/* right vertical motto */}
      <motion.div
        className="hidden md:flex absolute right-8 top-[60%] z-10 items-center gap-4"
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

      {/* intro blurb + rotating projects badge */}
      <motion.div
        className="absolute right-4 md:right-8 bottom-6 md:bottom-10 z-10 flex items-end gap-5"
        initial={{ opacity: 0, y: 30 }}
        animate={play ? { opacity: 1, y: 0 } : undefined}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <p className="hidden lg:block max-w-[260px] text-sm leading-relaxed text-muted-foreground text-right">
          Say hi from <span className="text-foreground font-semibold">Bakht Ali</span> — I build
          high-converting funnels, automations, and CRM systems that turn clicks into customers.
        </p>
        <button
          type="button"
          onClick={() => scrollToId("portfolio")}
          aria-label="Scroll to portfolio"
          data-cursor="Work"
          className="relative size-24 md:size-28 rounded-full bg-background/60 backdrop-blur border border-border grid place-items-center group"
        >
          <motion.svg
            viewBox="0 0 100 100"
            className="absolute inset-0 size-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          >
            <defs>
              <path id="hero-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
            </defs>
            <text className="fill-muted-foreground text-[10px] tracking-[0.4em] uppercase">
              <textPath href="#hero-circle">My Projects • My Projects • </textPath>
            </text>
          </motion.svg>
          <span className="size-10 rounded-full bg-secondary text-secondary-foreground grid place-items-center shadow-glow transition group-hover:scale-125">
            <ArrowDown className="size-5" />
          </span>
        </button>
      </motion.div>

      <motion.div
        className="pointer-events-none absolute inset-0 z-20 bg-background"
        style={{ opacity: dim }}
      />
    </section>
  );
}
