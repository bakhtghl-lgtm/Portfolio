import { Shapes } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Section, SectionTag } from "../Section";

const skills = [
  {
    name: "Funnels",
    value: 92,
    svg: (
      <svg viewBox="0 0 48 48" className="size-12" fill="none">
        <rect x="8" y="6" width="14" height="14" rx="2" fill="#F24E1E" />
        <rect x="22" y="6" width="14" height="14" rx="7" fill="#A259FF" />
        <rect x="8" y="20" width="14" height="14" rx="2" fill="#F24E1E" />
        <rect x="22" y="20" width="14" height="14" rx="7" fill="#1ABCFE" />
        <rect x="8" y="34" width="14" height="14" rx="7" fill="#0ACF83" />
      </svg>
    ),
  },
  {
    name: "Automations",
    value: 85,
    svg: (
      <svg viewBox="0 0 48 48" className="size-12" fill="none">
        <path d="M24 4 L42 14 V34 L24 44 L6 34 V14 Z" fill="#fff" />
        <path d="M24 4 L42 14 L24 24 Z" fill="#bbb" />
        <path d="M6 14 L24 24 V44 L6 34 Z" fill="#888" />
      </svg>
    ),
  },
  {
    name: "CRM Pipelines",
    value: 80,
    svg: (
      <svg viewBox="0 0 48 48" className="size-12" fill="none">
        <path
          d="M10 14 H38 L34 24 H14 Z M14 24 H34 L31 32 H17 Z M17 32 H31 L28 40 H20 Z"
          fill="#fff"
        />
      </svg>
    ),
  },
  {
    name: "React",
    value: 90,
    svg: (
      <svg viewBox="0 0 48 48" className="size-12" fill="none" stroke="#fff" strokeWidth="1.5">
        <circle cx="24" cy="24" r="3" fill="#fff" />
        <ellipse cx="24" cy="24" rx="20" ry="8" />
        <ellipse cx="24" cy="24" rx="20" ry="8" transform="rotate(60 24 24)" />
        <ellipse cx="24" cy="24" rx="20" ry="8" transform="rotate(120 24 24)" />
      </svg>
    ),
  },
  {
    name: "Email & SMS",
    value: 86,
    svg: (
      <svg viewBox="0 0 48 48" className="size-12" fill="#fff">
        <path
          d="M6 12 H42 V36 H6 Z M6 12 L24 26 L42 12"
          stroke="#fff"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    ),
  },
  {
    name: "Chatbots",
    value: 78,
    svg: (
      <svg viewBox="0 0 48 48" className="size-12" fill="none">
        <path
          d="M10 14a8 8 0 0 1 8-8h12a8 8 0 0 1 8 8v8a8 8 0 0 1-8 8H22l-6.5 6a1 1 0 0 1-1.7-.7V30a8 8 0 0 1-3.8-6.8V14Z"
          stroke="#fff"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle cx="20" cy="20" r="2" fill="#fff" />
        <circle cx="26" cy="20" r="2" fill="#fff" />
        <circle cx="32" cy="20" r="2" fill="#fff" />
      </svg>
    ),
  },
  {
    name: "Integrations",
    value: 70,
    svg: (
      <svg viewBox="0 0 48 48" className="size-12" fill="none" stroke="#fff" strokeWidth="2">
        <path d="M18 14 L10 22 L18 30 M30 18 L38 26 L30 34 M28 12 L20 36" />
      </svg>
    ),
  },
];

function SkillOval({
  name,
  value,
  svg,
  delay,
}: {
  name: string;
  value: number;
  svg: React.ReactNode;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-4"
    >
      <motion.div
        whileHover={{ y: -6, scale: 1.03 }}
        transition={{ type: "spring", stiffness: 250, damping: 18 }}
        className="group relative w-full aspect-[5/6] rounded-[50%] border border-border bg-card-gradient flex flex-col items-center justify-center gap-3 hover:border-secondary/60 hover:shadow-glow transition-all duration-500 overflow-hidden"
      >
        <div className="absolute inset-0 rounded-[50%] bg-gradient-to-br from-secondary/0 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 transition duration-700" />
        <motion.div
          whileHover={{ rotate: [0, -8, 8, 0] }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          {svg}
        </motion.div>
        <span className="relative z-10 font-display text-2xl font-bold text-secondary">
          {value}%
        </span>
      </motion.div>
      <p className="text-sm font-medium text-muted-foreground">{name}</p>
    </motion.div>
  );
}

export function Skills() {
  return (
    <Section id="skills">
      <SectionTag icon={<Shapes className="size-3.5" />} label="My Skills" />
      <h2 className="mt-8 mb-12 font-display text-4xl md:text-6xl font-bold">
        My <span className="text-gradient-yellow">Advantages</span>
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
        {skills.map((s, i) => (
          <SkillOval key={s.name} {...s} delay={i * 0.08} />
        ))}
      </div>
    </Section>
  );
}
