import { Database, Layers, LayoutTemplate, Workflow, type LucideIcon } from "lucide-react";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Eyebrow } from "../fx/Reveal";
import { useInertialScroll } from "../fx/useInertialScroll";
import { useMedia } from "../fx/useMedia";

type Service = {
  icon: LucideIcon;
  title: string;
  short: string;
  desc: string;
  stat: number;
  suffix: string;
  unit: string;
  tags: string[];
  Visual: (p: { play: boolean; enter?: boolean }) => ReactNode;
};

const services: Service[] = [
  {
    icon: LayoutTemplate,
    title: "Funnels & Websites",
    short: "Funnels",
    desc: "Conversion-first GoHighLevel funnels and sites: a sharp offer, fast pages, and booking and payments wired in from day one.",
    stat: 350,
    suffix: "+",
    unit: "Funnels built",
    tags: ["Landing pages", "Booking", "Payments", "Websites"],
    Visual: FunnelScene,
  },
  {
    icon: Workflow,
    title: "Automation Workflows",
    short: "Automations",
    desc: "Speed-to-lead, nurture, reminders and win-backs that run without you, from two-step follow-ups to full lead-to-close systems.",
    stat: 800,
    suffix: "+",
    unit: "Built from scratch",
    tags: ["Speed-to-lead", "Nurture", "Reminders", "Win-backs"],
    Visual: FlowScene,
  },
  {
    icon: Database,
    title: "CRM & Pipeline Setup",
    short: "CRM",
    desc: "Pipelines, tags, custom fields, routing and reporting, set up so your team always knows who to call next and why.",
    stat: 200,
    suffix: "+",
    unit: "Systems set up",
    tags: ["Pipelines", "Custom fields", "Routing", "Reporting"],
    Visual: PipelineScene,
  },
  {
    icon: Layers,
    title: "GHL SaaS Builds",
    short: "SaaS",
    desc: "White-label GHL SaaS builds with snapshots, onboarding and automations, for real estate, insurance, home services, education and travel.",
    stat: 5,
    suffix: "",
    unit: "Industries served",
    tags: ["Snapshots", "Onboarding", "White-label", "Sub-accounts"],
    Visual: SaasScene,
  },
];

const EASE = [0.76, 0, 0.24, 1] as const;
const N = services.length;

/**
 * Services. Desktop: a pinned dark "control room"; scrolling steps through the four services,
 * each taking over the stage with its own live scene (a funnel converting, a workflow firing, a
 * pipeline moving, a SaaS stack assembling) and its headline number. Phones and reduced motion:
 * a stack of the same panels, each scene playing as it comes into view (static for reduced motion).
 */
export function Services() {
  const stacked = useMedia("(max-width: 767px), (prefers-reduced-motion: reduce)");
  return stacked ? <StackedServices /> : <PinnedServices />;
}

/* ------------------------------------------------------------------ pinned (desktop) */

function PinnedServices() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useInertialScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) =>
    setActive(Math.min(N - 1, Math.max(0, Math.floor(v * N * 0.9999)))),
  );
  // progress within the current service, for its rail bar
  const seg = useTransform(scrollYProgress, (v) => Math.min(1, Math.max(0, v * N - active)));
  const s = services[active];

  return (
    <section
      id="services"
      ref={ref}
      className="relative"
      style={{ height: `calc(100vh + ${N * 75}vh)` }}
    >
      <div className="surface-dark sticky top-0 h-screen overflow-hidden bg-background">
        <StageBackdrop index={active} />

        <div className="relative z-10 grid h-full grid-cols-[minmax(15rem,0.85fr)_2fr] gap-8 px-6 pb-10 pt-[calc(var(--header-h)+2rem)] lg:gap-14 lg:px-10">
          {/* left rail */}
          <div className="flex min-h-0 flex-col">
            <Eyebrow index="02" label="Services" />
            <h2 className="mt-5 font-mega text-[clamp(2.75rem,5.2vw,5.5rem)] leading-[0.92]">
              What I <span className="hl">Build</span>
            </h2>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Four ways I turn GoHighLevel into revenue. Every one is a system I&apos;ve shipped for
              paying clients, not a template.
            </p>

            <ol className="mt-auto space-y-1">
              {services.map((sv, i) => (
                <RailItem key={sv.title} s={sv} i={i} active={i === active} seg={seg} />
              ))}
            </ol>
          </div>

          {/* scene */}
          <div className="relative min-h-0">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={active}
                className="absolute inset-0 grid grid-rows-[auto_1fr] gap-6"
                initial={{ opacity: 0, y: 60, clipPath: "inset(18% 0% 0% 0% round 28px)" }}
                animate={{ opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0% round 28px)" }}
                exit={{ opacity: 0, y: -40, transition: { duration: 0.35, ease: EASE } }}
                transition={{ duration: 0.75, ease: EASE }}
              >
                <SceneHeader s={s} i={active} />
                <ScenePanel>
                  <s.Visual play />
                </ScenePanel>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* scroll cue + counter */}
        <div className="pointer-events-none absolute bottom-5 right-6 z-10 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground lg:right-10">
          <span className="text-highlight">{String(active + 1).padStart(2, "0")}</span> /{" "}
          {String(N).padStart(2, "0")}
        </div>
      </div>
    </section>
  );
}

function RailItem({
  s,
  i,
  active,
  seg,
}: {
  s: Service;
  i: number;
  active: boolean;
  seg: MotionValue<number>;
}) {
  return (
    <li className="relative py-2.5">
      <div
        className={`flex items-baseline gap-4 transition-[color,transform] duration-500 ${active ? "translate-x-2 text-foreground" : "text-muted-foreground"}`}
      >
        <span className="font-mono text-[11px] tracking-[0.2em]">0{i + 1}</span>
        <span className="font-mega text-2xl leading-none lg:text-3xl">{s.title}</span>
      </div>
      <div className="mt-2 h-px bg-border">
        <motion.div
          className="h-full origin-left bg-secondary"
          style={{ scaleX: active ? seg : 0 }}
        />
      </div>
    </li>
  );
}

function SceneHeader({ s, i }: { s: Service; i: number }) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-end gap-8">
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-secondary text-secondary-foreground">
            <s.icon className="size-5" />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            Service 0{i + 1}
          </span>
        </div>
        <h3 className="mask mt-4 font-mega text-[clamp(2.5rem,4.6vw,4.75rem)] leading-[0.95]">
          <motion.span
            className="block"
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
          >
            {s.title}
          </motion.span>
        </h3>
        <motion.p
          className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
        >
          {s.desc}
        </motion.p>
        <div className="mt-4 flex flex-wrap gap-2">
          {s.tags.map((t, k) => (
            <motion.span
              key={t}
              className="rounded-full border border-border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-foreground/85"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 + k * 0.06 }}
            >
              {t}
            </motion.span>
          ))}
        </div>
      </div>
      <Stat s={s} play />
    </div>
  );
}

/** The headline number counts up; the accent underline draws under it. */
function Stat({ s, play }: { s: Service; play: boolean }) {
  const n = useMotionValue(play ? 0 : s.stat);
  const shown = useTransform(n, (v) => Math.round(v).toString());
  useEffect(() => {
    if (!play) {
      n.set(s.stat);
      return;
    }
    n.set(0);
    const a = animate(n, s.stat, { duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 });
    return () => a.stop();
  }, [play, s.stat, n]);
  return (
    <div className="text-right">
      <p className="font-mega text-[clamp(4rem,7.5vw,8rem)] leading-[0.85] text-highlight tabular-nums">
        <motion.span>{shown}</motion.span>
        {s.suffix}
      </p>
      <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
        {s.unit}
      </p>
    </div>
  );
}

function ScenePanel({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-0 overflow-hidden rounded-[28px] border border-border bg-[oklch(1_0_0/0.03)]">
      {/* corner ticks: a technical frame */}
      {[
        "left-3 top-3",
        "right-3 top-3 rotate-90",
        "right-3 bottom-3 rotate-180",
        "left-3 bottom-3 -rotate-90",
      ].map((c) => (
        <span
          key={c}
          aria-hidden
          className={`absolute ${c} size-3 border-l-2 border-t-2 border-[var(--highlight)] opacity-70`}
        />
      ))}
      <div className="absolute inset-0 grid place-items-center p-6">{children}</div>
    </div>
  );
}

/** Dark stage: a fine grid, a slow scan line and an accent glow that drifts per service. */
function StageBackdrop({ index }: { index: number }) {
  // glow centres, in viewport units (the stage is one screen); moved by transform, not left/top
  const spots: [number, number][] = [
    [18, 30],
    [70, 25],
    [30, 75],
    [80, 70],
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
      <motion.div
        className="gpu absolute size-[42vw] rounded-full"
        style={{
          left: "-21vw",
          top: "-21vw",
          background:
            "radial-gradient(circle, oklch(var(--a-l) var(--a-c) var(--a-h) / 0.22), transparent 65%)",
        }}
        initial={false}
        animate={{ x: `${spots[index][0]}vw`, y: `${spots[index][1]}vh` }}
        transition={{ duration: 1.4, ease: EASE }}
      />
      <motion.div
        className="gpu absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--highlight)] to-transparent opacity-40"
        initial={{ top: "-2%" }}
        animate={{ top: "102%" }}
        transition={{ duration: 6, ease: "linear", repeat: Infinity }}
      />
      <span className="absolute -bottom-[0.18em] -right-[0.04em] font-mega text-[34vw] leading-none text-outline opacity-[0.12]">
        0{index + 1}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ stacked (phones, reduced motion) */

function StackedServices() {
  return (
    <section id="services" className="relative overflow-x-clip px-4 py-24 md:px-10">
      <Eyebrow index="02" label="Services" />
      <h2 className="mt-8 font-mega text-[clamp(3rem,calc((100vw-2rem)/3.4),8rem)]">
        What I
        <br />
        <span className="hl">Build</span>
      </h2>
      <p className="mt-6 max-w-sm text-muted-foreground">
        Four ways I turn GoHighLevel into revenue. Every one is a system I&apos;ve shipped for
        paying clients, not a template.
      </p>
      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {services.map((s, i) => (
          <StackedCard key={s.title} s={s} i={i} />
        ))}
      </div>
    </section>
  );
}

function StackedCard({ s, i }: { s: Service; i: number }) {
  const ref = useRef<HTMLElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  // the looping scene only runs while the card is on screen
  const visible = useInView(ref, { margin: "0px 0px -10% 0px" });
  const reduce = useMedia("(prefers-reduced-motion: reduce)");
  const play = seen && !reduce;
  return (
    <article
      ref={ref}
      className="surface-dark relative overflow-hidden rounded-[2rem] border border-border bg-card-gradient p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-secondary text-secondary-foreground">
            <s.icon className="size-5" />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Service 0{i + 1}
          </span>
        </div>
        <div className="text-right">
          <p className="font-mega text-5xl leading-[0.85] text-highlight tabular-nums">
            <StatNumber value={s.stat} play={play} />
            {s.suffix}
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            {s.unit}
          </p>
        </div>
      </div>
      <h3 className="mt-5 font-mega text-[clamp(2rem,9vw,3rem)] leading-[0.95]">{s.title}</h3>
      <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{s.desc}</p>
      <div className="relative mt-5 aspect-[16/11] overflow-hidden rounded-2xl border border-border bg-[oklch(1_0_0/0.03)]">
        <div className="absolute inset-0 grid place-items-center p-4">
          {/* phones: no entry cascade (every SVG change re-runs SVG layout); the looping parts run
              only while the card is on screen */}
          <s.Visual key={play ? "on" : "off"} play={play && visible} enter={false} />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {s.tags.map((t) => (
          <span
            key={t}
            className="rounded-full border border-border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-foreground/85"
          >
            {t}
          </span>
        ))}
      </div>
    </article>
  );
}

function StatNumber({ value, play }: { value: number; play: boolean }) {
  const n = useMotionValue(0);
  const shown = useTransform(n, (v) => Math.round(v).toString());
  const reduce = useMedia("(prefers-reduced-motion: reduce)");
  useEffect(() => {
    if (reduce) return n.set(value);
    if (!play) return;
    const a = animate(n, value, { duration: 1.4, ease: [0.22, 1, 0.36, 1] });
    return () => a.stop();
  }, [play, value, n, reduce]);
  return <motion.span>{shown}</motion.span>;
}

/* ------------------------------------------------------------------ scenes (SVG, 520 x 320) */

const ACC = "var(--secondary)";
const INK = "var(--secondary-foreground)";
const FG = "var(--foreground)";

function SceneSvg({ children, label }: { children: ReactNode; label: string }) {
  return (
    <svg
      viewBox="0 0 520 320"
      className="h-full max-h-full w-full max-w-[640px]"
      role="img"
      aria-label={label}
    >
      {children}
    </svg>
  );
}

/** Traffic pours into a funnel; fewer dots make it to each stage; the last ones are booked. */
function FunnelScene({ play, enter = true }: { play: boolean; enter?: boolean }) {
  const tiers = [
    { y: 30, w: 300, label: "Traffic" },
    { y: 120, w: 210, label: "Opt-in" },
    { y: 210, w: 120, label: "Booked call" },
  ];
  const drops = Array.from({ length: 8 }, (_, i) => i);
  return (
    <SceneSvg label="A funnel turning traffic into booked calls">
      {tiers.map((t, i) => (
        <g key={t.label}>
          <motion.path
            d={`M${190 - t.w / 2} ${t.y} H${190 + t.w / 2} L${190 + t.w / 2 - 40} ${t.y + 70} H${190 - t.w / 2 + 40} Z`}
            fill={i === 2 ? ACC : "oklch(1 0 0 / 0.04)"}
            fillOpacity={i === 2 ? 0.95 : 1}
            stroke={i === 2 ? ACC : FG}
            strokeOpacity={i === 2 ? 1 : 0.35}
            strokeWidth="1.5"
            initial={play && enter ? { opacity: 0, y: -20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
          />
          <line
            x1={190 + t.w / 2 + 6}
            y1={t.y + 35}
            x2="385"
            y2={t.y + 35}
            stroke={FG}
            strokeOpacity="0.25"
            strokeDasharray="3 4"
          />
          <text
            x="395"
            y={t.y + 40}
            fill={FG}
            fontSize="15"
            fontWeight="600"
            style={{ letterSpacing: "0.08em" }}
          >
            {t.label.toUpperCase()}
          </text>
          <text
            x="395"
            y={t.y + 58}
            fill={FG}
            fillOpacity="0.6"
            fontSize="11"
            fontFamily="monospace"
          >
            {["stage 1", "stage 2", "converted"][i]}
          </text>
        </g>
      ))}
      {play &&
        drops.map((d) => {
          const depth = d % 4 === 0 ? 3 : d % 2 === 0 ? 2 : 1; // most stop early, a few convert
          const x = 190 + ((d * 37) % 160) - 80;
          return (
            <motion.circle
              key={d}
              r="4.5"
              fill={depth === 3 ? INK : ACC}
              stroke={depth === 3 ? ACC : "none"}
              strokeWidth="2"
              cx={0}
              cy={0}
              // moved by transform, not cx/cy: geometry attributes re-run layout every frame
              initial={{ x, y: 0, opacity: 0 }}
              animate={{
                x: [x, x * 0.7 + 57, x * 0.4 + 114, 190],
                y: [8, 100, 190, 262],
                opacity: [0, 1, depth > 1 ? 1 : 0, depth > 2 ? 1 : 0],
              }}
              transition={{
                duration: 2.2,
                ease: "easeIn",
                repeat: Infinity,
                delay: d * 0.18,
                repeatDelay: 3.4,
              }}
            />
          );
        })}
      <text
        x="190"
        y="305"
        textAnchor="middle"
        fill={FG}
        fillOpacity="0.55"
        fontSize="11"
        fontFamily="monospace"
      >
        visitors → leads → booked
      </text>
    </SceneSvg>
  );
}

/** A lead comes in and the workflow fires: pulses run node to node. */
function FlowScene({ play, enter = true }: { play: boolean; enter?: boolean }) {
  const nodes = [
    { x: 20, y: 40, t: "New lead", s: "Form / ad" },
    { x: 190, y: 40, t: "Instant SMS", s: "< 60 sec" },
    { x: 360, y: 40, t: "Wait", s: "5 min" },
    { x: 360, y: 190, t: "Email + call", s: "Task to rep" },
    { x: 190, y: 190, t: "Booked?", s: "If / else" },
    { x: 20, y: 190, t: "Tag + pipeline", s: "Won stage" },
  ];
  const links = ["M160 70 H190", "M330 70 H360", "M430 100 V190", "M360 220 H330", "M190 220 H160"];
  return (
    <SceneSvg label="An automation workflow firing step by step">
      {links.map((d, i) => (
        <g key={d}>
          <path d={d} stroke={FG} strokeOpacity="0.25" strokeWidth="2" fill="none" />
          {play && (
            <motion.path
              d={d}
              stroke={ACC}
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0, pathOffset: 0 }}
              animate={{ pathLength: [0, 0.6, 0], pathOffset: [0, 0.2, 1] }}
              transition={{
                duration: 0.55,
                repeat: Infinity,
                repeatDelay: 4.4,
                delay: 0.4 + i * 0.5,
                ease: "easeInOut",
              }}
            />
          )}
        </g>
      ))}
      {nodes.map((n, i) => (
        <motion.g
          key={n.t}
          initial={play && enter ? { opacity: 0, scale: 0.85 } : false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
          style={{ transformOrigin: `${n.x + 70}px ${n.y + 30}px` }}
        >
          <rect
            x={n.x}
            y={n.y}
            width="140"
            height="60"
            rx="14"
            fill="oklch(1 0 0 / 0.05)"
            stroke={FG}
            strokeOpacity="0.3"
          />
          {play && (
            <motion.rect
              x={n.x}
              y={n.y}
              width="140"
              height="60"
              rx="14"
              fill={ACC}
              fillOpacity="0.14"
              stroke={ACC}
              strokeWidth="2.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.7, repeat: Infinity, repeatDelay: 4.25, delay: i * 0.5 }}
            />
          )}
          <circle cx={n.x + 18} cy={n.y + 30} r="5" fill={ACC} />
          <text x={n.x + 32} y={n.y + 27} fill={FG} fontSize="14" fontWeight="600">
            {n.t}
          </text>
          <text
            x={n.x + 32}
            y={n.y + 44}
            fill={FG}
            fillOpacity="0.6"
            fontSize="11"
            fontFamily="monospace"
          >
            {n.s}
          </text>
        </motion.g>
      ))}
    </SceneSvg>
  );
}

/** A kanban pipeline: a deal card travels New → Contacted → Booked → Won. */
function PipelineScene({ play, enter = true }: { play: boolean; enter?: boolean }) {
  const cols = ["New", "Contacted", "Booked", "Won"];
  const W = 118;
  const X = (i: number) => 16 + i * (W + 8);
  return (
    <SceneSvg label="A CRM pipeline moving a deal to won">
      {cols.map((c, i) => (
        <g key={c}>
          <rect
            x={X(i)}
            y="20"
            width={W}
            height="280"
            rx="14"
            fill="oklch(1 0 0 / 0.035)"
            stroke={FG}
            strokeOpacity="0.18"
          />
          <text
            x={X(i) + 14}
            y="46"
            fill={i === 3 ? ACC : FG}
            fontSize="13"
            fontWeight="700"
            style={{ letterSpacing: "0.12em" }}
          >
            {c.toUpperCase()}
          </text>
          {/* resting cards */}
          {Array.from({ length: 3 - Math.min(i, 2) }, (_, k) => (
            <g key={k}>
              <rect
                x={X(i) + 10}
                y={64 + k * 58}
                width={W - 20}
                height="46"
                rx="9"
                fill="oklch(1 0 0 / 0.06)"
              />
              <rect
                x={X(i) + 20}
                y={76 + k * 58}
                width={W - 54}
                height="7"
                rx="3.5"
                fill={FG}
                fillOpacity="0.45"
              />
              <rect
                x={X(i) + 20}
                y={90 + k * 58}
                width={W - 74}
                height="6"
                rx="3"
                fill={FG}
                fillOpacity="0.2"
              />
            </g>
          ))}
        </g>
      ))}
      {/* the moving deal */}
      <motion.g
        initial={false}
        animate={
          play
            ? { x: [0, 0, W + 8, W + 8, 2 * (W + 8), 2 * (W + 8), 3 * (W + 8), 3 * (W + 8)] }
            : { x: 3 * (W + 8) }
        }
        transition={
          play
            ? {
                duration: 6,
                times: [0, 0.12, 0.25, 0.37, 0.5, 0.62, 0.75, 1],
                ease: EASE,
                repeat: Infinity,
              }
            : undefined
        }
      >
        <rect x={X(0) + 6} y="236" width={W - 12} height="52" rx="10" fill={ACC} />
        <circle cx={X(0) + 24} cy="262" r="9" fill={INK} fillOpacity="0.85" />
        <rect
          x={X(0) + 40}
          y="252"
          width={W - 64}
          height="7"
          rx="3.5"
          fill={INK}
          fillOpacity="0.85"
        />
        <rect x={X(0) + 40} y="266" width={W - 80} height="6" rx="3" fill={INK} fillOpacity="0.5" />
      </motion.g>
    </SceneSvg>
  );
}

/** The SaaS stack assembles layer by layer; the industries it serves orbit it. */
function SaasScene({ play, enter = true }: { play: boolean; enter?: boolean }) {
  const layers = ["Sub-accounts", "Automations", "Onboarding", "Snapshots"];
  const inds = ["Real estate", "Insurance", "Home services", "Education", "Travel"];
  const top = (k: number) => 200 - k * 44;
  return (
    <SceneSvg label="A white-label SaaS stack serving five industries">
      {layers.map((l, k) => {
        const y = top(k);
        const isTop = k === layers.length - 1;
        return (
          <motion.g
            key={l}
            initial={play && enter ? { opacity: 0, y: -60 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.15 + k * 0.18 }}
          >
            <path
              d={`M150 ${y} L260 ${y - 40} L370 ${y} L260 ${y + 40} Z`}
              fill={isTop ? ACC : "oklch(1 0 0 / 0.06)"}
              stroke={isTop ? ACC : FG}
              strokeOpacity={isTop ? 1 : 0.4}
              strokeWidth="1.5"
            />
            <text
              x="260"
              y={y + 5}
              textAnchor="middle"
              fill={isTop ? INK : FG}
              fontSize="13"
              fontWeight="700"
              style={{ letterSpacing: "0.08em" }}
            >
              {l.toUpperCase()}
            </text>
          </motion.g>
        );
      })}
      {inds.map((t, i) => {
        const left = i % 2 === 0;
        const y = 50 + i * 52;
        return (
          <motion.g
            key={t}
            initial={play && enter ? { opacity: 0, x: left ? -20 : 20 } : false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.9 + i * 0.12 }}
          >
            <rect
              x={left ? 8 : 400}
              y={y - 14}
              width="112"
              height="26"
              rx="13"
              fill="oklch(1 0 0 / 0.05)"
              stroke={ACC}
              strokeOpacity="0.7"
            />
            <text
              x={left ? 64 : 456}
              y={y + 3}
              textAnchor="middle"
              fill={FG}
              fontSize="11"
              fontWeight="600"
            >
              {t}
            </text>
            <line
              x1={left ? 120 : 400}
              y1={y}
              x2={left ? 165 : 355}
              y2={Math.min(Math.max(y, 80), 230)}
              stroke={ACC}
              strokeOpacity="0.45"
              strokeDasharray="3 4"
            />
          </motion.g>
        );
      })}
    </SceneSvg>
  );
}
