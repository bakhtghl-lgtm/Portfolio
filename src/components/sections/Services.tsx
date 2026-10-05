import { Workflow, LayoutTemplate, MailPlus, TrendingUp, ArrowUpRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";
import { Eyebrow } from "../fx/Reveal";

const services = [
  {
    icon: LayoutTemplate,
    title: "Funnel Building",
    desc: "High-converting GoHighLevel funnels & landing pages built to capture and close.",
    count: "20+ Funnels",
  },
  {
    icon: Workflow,
    title: "Automation Workflows",
    desc: "Smart triggers, pipelines, and CRM logic that nurture leads on autopilot.",
    count: "50+ Workflows",
  },
  {
    icon: MailPlus,
    title: "Email & SMS Campaigns",
    desc: "Multi-channel sequences that re-engage leads and drive measurable revenue.",
    count: "100+ Campaigns",
  },
  {
    icon: TrendingUp,
    title: "Conversion Optimization",
    desc: "A/B tests, integrations, and pipeline tuning — up to 35% lift for clients.",
    count: "+35% Avg. Lift",
  },
];

/** Vertical scroll drives a pinned horizontal track of service cards. */
export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      setDistance(Math.max(0, trackRef.current.scrollWidth - window.innerWidth));
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
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
        <motion.div
          aria-hidden
          style={{ x: bgText }}
          className="pointer-events-none absolute bottom-[4vh] left-0 whitespace-nowrap font-mega text-[28vw] text-outline opacity-40"
        >
          Specializations
        </motion.div>

        <motion.div
          ref={trackRef}
          style={{ x }}
          className="relative flex items-center gap-6 md:gap-10 pl-4 md:pl-10 pr-[10vw] w-max"
        >
          <div className="w-[85vw] md:w-[42vw] shrink-0">
            <Eyebrow index="02" label="Services" />
            <h2 className="mt-8 font-mega text-[18vw] md:text-[9vw]">
              My
              <br />
              <span className="text-secondary">Speciali</span>
              <br />
              zations
            </h2>
            <p className="mt-6 max-w-sm text-muted-foreground">
              Keep scrolling — every service is a system I've shipped for real clients.
            </p>
          </div>

          {services.map((s, i) => {
            const yellow = i % 2 === 1;
            return (
              <motion.article
                key={s.title}
                whileHover={{ y: -12, rotate: yellow ? 1.5 : -1.5 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                className={`group relative shrink-0 w-[80vw] sm:w-[60vw] md:w-[34vw] h-[62vh] md:h-[66vh] rounded-[2rem] p-7 md:p-10 flex flex-col justify-between overflow-hidden border ${
                  yellow
                    ? "bg-secondary text-secondary-foreground border-secondary"
                    : "bg-card-gradient border-border"
                }`}
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
                  <span className="font-mega text-8xl md:text-[9rem] opacity-15">0{i + 1}</span>
                </div>

                <div>
                  <h3 className="font-mega text-5xl md:text-6xl">{s.title}</h3>
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
          })}
        </motion.div>

        <div className="absolute bottom-8 left-4 right-4 md:left-10 md:right-10 h-px bg-border">
          <motion.div className="h-full bg-secondary origin-left" style={{ scaleX: bar }} />
        </div>
      </div>
    </section>
  );
}
