import { animate, motion, useInView, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Eyebrow, MaskText } from "../fx/Reveal";

const skills = [
  { name: "Funnels", value: 92 },
  { name: "React", value: 90 },
  { name: "Email & SMS", value: 86 },
  { name: "Automations", value: 85 },
  { name: "CRM Pipelines", value: 80 },
  { name: "Chatbots", value: 78 },
  { name: "Integrations", value: 70 },
];

function Percent({ to, play }: { to: number; play: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!play) return;
    const controls = animate(0, to, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [play, to]);
  return <span>{n}%</span>;
}

function SkillRow({ name, value, i }: { name: string; value: number; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: i % 2 ? 80 : -80 }}
      animate={inView ? { opacity: 1, x: 0 } : undefined}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative border-t border-border overflow-hidden"
    >
      {/* yellow fill that wipes up on hover */}
      <span className="absolute inset-0 bg-secondary translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0" />
      <div className="relative flex items-center gap-4 md:gap-8 py-5 md:py-7 px-2 transition-colors duration-500 group-hover:text-secondary-foreground">
        <span className="w-10 text-xs font-bold tracking-widest text-muted-foreground group-hover:text-secondary-foreground/60">
          0{i + 1}
        </span>
        <h3 className="flex-1 font-mega text-4xl sm:text-6xl md:text-7xl transition-transform duration-500 group-hover:translate-x-4">
          {name}
        </h3>
        <div className="hidden md:block w-[28%] h-[6px] rounded-full bg-border/60 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-secondary group-hover:bg-secondary-foreground"
            initial={{ width: 0 }}
            animate={inView ? { width: `${value}%` } : undefined}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          />
        </div>
        <span className="w-20 text-right font-mega text-3xl md:text-5xl text-secondary group-hover:text-secondary-foreground">
          <Percent to={value} play={inView} />
        </span>
      </div>
    </motion.div>
  );
}

export function Skills() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["20%", "-40%"]);

  return (
    <section
      id="skills"
      ref={ref}
      className="relative px-4 md:px-10 py-24 md:py-40 overflow-hidden"
    >
      <motion.div
        aria-hidden
        style={{ x }}
        className="pointer-events-none absolute top-10 left-0 whitespace-nowrap font-mega text-[22vw] text-outline opacity-30"
      >
        Advantages Advantages
      </motion.div>

      <div className="relative">
        <Eyebrow index="03" label="My Skills" />
        <h2 className="mt-8 mb-16 font-mega text-[16vw] md:text-[9vw]">
          <MaskText lines={["My", <span className="text-secondary">Advantages</span>]} />
        </h2>
        <div className="border-b border-border">
          {skills.map((s, i) => (
            <SkillRow key={s.name} {...s} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
