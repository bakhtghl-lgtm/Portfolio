import { Workflow, LayoutTemplate, Database, Layers, ArrowUpRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";
import { Eyebrow } from "../fx/Reveal";
import { useMedia } from "../fx/useMedia";

const services = [
  {
    icon: LayoutTemplate,
    title: "Funnels & Websites",
    desc: "Conversion-first GoHighLevel funnels and sites: a sharp offer, fast pages, and booking and payments wired in from day one.",
    count: "100+ Funnels Built",
  },
  {
    icon: Workflow,
    title: "Automation Workflows",
    desc: "Speed-to-lead, nurture, reminders and win-backs that run without you, from two-step follow-ups to full lead-to-close systems.",
    count: "100+ Built From Scratch",
  },
  {
    icon: Database,
    title: "CRM & Pipeline Setup",
    desc: "Pipelines, tags, custom fields, routing and reporting, set up so your team always knows who to call next and why.",
    count: "80+ Systems Set Up",
  },
  {
    icon: Layers,
    title: "GHL SaaS Builds",
    desc: "White-label GHL SaaS builds with snapshots, onboarding and automations, for real estate, insurance, home services, education and travel.",
    count: "5 Industries Served",
  },
];

function Heading() {
  return (
    <div className="w-full md:w-[42vw] shrink-0">
      <Eyebrow index="02" label="Services" />
      {/* "WHAT I" is the longest line (~2.9em in Anton): sized to the column */}
      <h2 className="mt-8 font-mega text-[clamp(3rem,calc((100vw-2rem)/3.4),8rem)] md:text-[min(11vw,11rem)]">
        What I
        <br />
        <span className="hl">Build</span>
      </h2>
      <p className="mt-6 max-w-sm text-muted-foreground">
        Four ways I turn GoHighLevel into revenue. Every one is a system I&apos;ve shipped for
        paying clients, not a template.
      </p>
    </div>
  );
}

function ServiceCard({
  s,
  i,
  className = "",
}: {
  s: (typeof services)[number];
  i: number;
  className?: string;
}) {
  const yellow = i % 2 === 1;
  return (
    <motion.article
      whileHover={{ y: -12, rotate: yellow ? 1.5 : -1.5 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className={`@container group relative rounded-[2rem] p-7 md:p-10 flex flex-col justify-between gap-10 overflow-hidden border ${
        yellow
          ? "bg-secondary text-secondary-foreground border-secondary"
          : "surface-dark bg-card-gradient border-border"
      } ${className}`}
    >
      <div className="flex items-start justify-between">
        <div
          className={`grid size-16 place-items-center rounded-2xl transition-transform duration-700 group-hover:rotate-[360deg] ${
            yellow
              ? "bg-secondary-foreground text-secondary"
              : "bg-secondary text-secondary-foreground"
          }`}
        >
          <s.icon className="size-7" />
        </div>
        <span aria-hidden className="font-mega text-8xl md:text-[9rem] leading-[0.8] opacity-15">
          0{i + 1}
        </span>
      </div>

      <div>
        {/* longest word (OPTIMIZATION) is 4.92em: 16cqw keeps it inside the card padding */}
        <h3 className="font-mega text-[clamp(2rem,16cqw,3.75rem)] leading-[1] [overflow-wrap:normal]">
          {s.title}
        </h3>
        <p
          className={`mt-5 max-w-sm leading-relaxed ${yellow ? "opacity-80" : "text-muted-foreground"}`}
        >
          {s.desc}
        </p>
        <div
          className={`mt-8 pt-6 border-t flex items-center justify-between ${yellow ? "border-secondary-foreground/20" : "border-border"}`}
        >
          <span className="text-xs font-bold uppercase tracking-[0.3em]">{s.count}</span>
          <ArrowUpRight className="size-6 transition-transform duration-500 group-hover:rotate-45" />
        </div>
      </div>
    </motion.article>
  );
}

/** Vertical scroll drives a pinned horizontal track of service cards (md+); a plain stack on phones. */
export function Services() {
  const stacked = useMedia("(max-width: 767px), (prefers-reduced-motion: reduce)");
  return stacked ? <StackedServices /> : <PinnedServices />;
}

function StackedServices() {
  return (
    <section id="services" className="relative overflow-x-clip px-4 md:px-10 py-24">
      <Heading />
      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {services.map((s, i) => (
          <ServiceCard key={s.title} s={s} i={i} className="min-h-[380px]" />
        ))}
      </div>
    </section>
  );
}

function PinnedServices() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      setDistance(Math.max(0, trackRef.current.scrollWidth - document.documentElement.clientWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const bgText = useTransform(scrollYProgress, [0, 1], ["10%", "-60%"]);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative"
      style={{ height: `calc(100vh + ${distance}px)` }}
    >
      {/* padded by the header height so the pinned row is centred in the visible area */}
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center pt-[var(--header-h)]">
        <motion.div
          aria-hidden
          style={{ x: bgText }}
          className="pointer-events-none absolute bottom-[4vh] left-0 whitespace-nowrap font-mega text-[28vw] text-outline opacity-40"
        >
          What I Build
        </motion.div>

        <motion.div
          ref={trackRef}
          style={{ x }}
          className="relative flex items-center gap-10 pl-10 pr-[10vw] w-max"
        >
          <Heading />
          {services.map((s, i) => (
            <ServiceCard
              key={s.title}
              s={s}
              i={i}
              className="shrink-0 w-[60vw] lg:w-[34vw] h-[min(66vh,620px)] min-h-[440px]"
            />
          ))}
        </motion.div>

        <div className="absolute bottom-8 left-10 right-10 h-px bg-border">
          <motion.div className="h-full bg-secondary origin-left" style={{ scaleX: bar }} />
        </div>
      </div>
    </section>
  );
}
