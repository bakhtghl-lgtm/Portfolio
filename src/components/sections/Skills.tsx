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
      {/* number | name | bar | %  — the bar drops to its own row on phones */}
      <div className="relative grid grid-cols-[2rem_minmax(0,1fr)_auto] md:grid-cols-[2.5rem_minmax(0,1fr)_minmax(0,28%)_auto] items-center gap-x-4 md:gap-x-8 gap-y-3 py-5 md:py-7 px-2 transition-colors duration-500 group-hover:text-secondary-foreground">
        <span className="text-xs font-bold tracking-widest text-muted-foreground group-hover:text-secondary-foreground/70">
          0{i + 1}
        </span>
        <h3 className="min-w-0 font-mega text-[clamp(1.75rem,7.5vw,4.5rem)] leading-[1] transition-transform duration-500 group-hover:translate-x-4">
          {name}
        </h3>
        <div className="col-start-2 col-span-2 row-start-2 md:col-start-3 md:col-span-1 md:row-start-1 h-[6px] rounded-full bg-foreground/10 group-hover:bg-secondary-foreground/15 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-secondary group-hover:bg-secondary-foreground"
            initial={{ width: 0 }}
            animate={inView ? { width: `${value}%` } : undefined}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          />
        </div>
        {/* min width fits "100%" so the counter never reflows or clips while it runs */}
        <span className="col-start-3 row-start-1 md:col-start-4 min-w-[2.2em] text-right whitespace-nowrap tabular-nums font-mega text-3xl md:text-5xl leading-[1] text-highlight group-hover:text-secondary-foreground">
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
      className="relative px-4 md:px-10 py-24 md:py-40 overflow-x-clip"
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
        <h2 className="mt-8 mb-16 font-mega text-[clamp(2.5rem,calc((100vw-2rem)/4.7),9rem)] md:text-[min(9vw,9rem)]">
          <MaskText lines={["My", <span className="text-highlight">Advantages</span>]} />
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
