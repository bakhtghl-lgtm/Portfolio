import { ArrowUpRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Eyebrow, MaskText } from "../fx/Reveal";
import { lockScroll } from "../fx/SmoothScroll";
import { useMedia } from "../fx/useMedia";
import { cn } from "@/lib/utils";
import appointmentWorkflow from "@/assets/portfolio-appointment-workflow.png";
import ghlZapierHubspotFlow from "@/assets/portfolio-ghl-zapier-hubspot.png";
import prospeccionActivaFlow from "@/assets/portfolio-prospeccion-activa.png";
import zapierHubspotCompanyFlow from "@/assets/portfolio-zapier-hubspot-company.png";
import funnelHomiva01 from "@/assets/funnel-homiva-01.png";
import funnelHomiva02 from "@/assets/funnel-homiva-02.png";
import funnelHomiva03 from "@/assets/funnel-homiva-03.png";
import funnelHomiva04 from "@/assets/funnel-homiva-04.png";
import funnelHomiva05 from "@/assets/funnel-homiva-05.png";
import funnelHomiva06 from "@/assets/funnel-homiva-06.png";
import funnelCassy01 from "@/assets/funnel-cassy-01.png";
import funnelCassy02 from "@/assets/funnel-cassy-02.png";
import funnelCassy03 from "@/assets/funnel-cassy-03.png";
import funnelCassy04 from "@/assets/funnel-cassy-04.png";
import funnelCassy05 from "@/assets/funnel-cassy-05.png";
import funnelCassy06 from "@/assets/funnel-cassy-06.png";
import funnelCassy07 from "@/assets/funnel-cassy-07.png";
import funnelCassy08 from "@/assets/funnel-cassy-08.png";
import funnelCassy09 from "@/assets/funnel-cassy-09.png";
import funnelProject301 from "@/assets/funnel-project3-01.png";
import funnelProject302 from "@/assets/funnel-project3-02.png";
import funnelProject303 from "@/assets/funnel-project3-03.png";
import funnelProject304 from "@/assets/funnel-project3-04.png";
import funnelProject305 from "@/assets/funnel-project3-05.png";
import funnelProject306 from "@/assets/funnel-project3-06.png";
import funnelProject307 from "@/assets/funnel-project3-07.png";
import funnelProject308 from "@/assets/funnel-project3-08.png";
import funnelNovexa01 from "@/assets/funnel-novexa-01.png";
import funnelNovexa02 from "@/assets/funnel-novexa-02.png";
import funnelNovexa03 from "@/assets/funnel-novexa-03.png";
import funnelNovexa04 from "@/assets/funnel-novexa-04.png";
import funnelNovexa05 from "@/assets/funnel-novexa-05.png";
import funnelNovexa06 from "@/assets/funnel-novexa-06.png";

type FlowStep = {
  title: string;
  body: string;
};

type PortfolioDetail = {
  whatItDoes: string;
  flow: FlowStep[];
};

type PortfolioItem = {
  title: string;
  tags: string[];
  hue: number;
  metric: string;
  imageUrl: string;
  imageThumbFit?: "cover" | "contain";
  gallery?: { src: string; alt: string }[];
  detail?: PortfolioDetail;
};

function FunnelIcon({ className = "size-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M3 5h18l-7 8v5l-4 2v-7L3 5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TagPill({ tag }: { tag: string }) {
  const isFunnels = tag.toLowerCase() === "funnels";
  return (
    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-background/70 backdrop-blur text-xs font-medium border border-border group-hover:border-secondary/40 transition">
      {isFunnels ? <FunnelIcon className="size-3.5 text-highlight" /> : null}
      <span>{tag}</span>
    </span>
  );
}

function PortfolioDetailBody({ detail }: { detail: PortfolioDetail }) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-highlight">
          What it does
        </p>
        <p className="mt-2 whitespace-pre-line break-words text-sm leading-relaxed text-foreground/90">
          {detail.whatItDoes}
        </p>
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-highlight">The flow</p>
        <ul className="mt-3 space-y-2">
          {detail.flow.map((step, idx) => (
            <li
              key={step.title}
              className="overflow-hidden rounded-xl border border-border/60 bg-background/50 px-3 py-2.5"
            >
              <div className="flex gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary/25 text-xs font-bold text-highlight">
                  {idx + 1}
                </span>
                <div className="min-w-0">
                  <p className="break-words text-sm font-semibold text-foreground">{step.title}</p>
                  <p className="mt-1 whitespace-pre-line break-words text-xs leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");
const coverOf = (p: PortfolioItem) => (p.gallery && p.gallery[0]?.src) || p.imageUrl;

/** Desktop: a big type index of projects with a sticky preview that wipes between screenshots. */
function ProjectIndex({ onOpen }: { onOpen: (p: PortfolioItem) => void }) {
  const listRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const seq = useRef(0);
  const [z, setZ] = useState(0);
  const n = projects.length;

  const activeRef = useRef(0);
  const select = (i: number) => {
    if (activeRef.current === i) return;
    activeRef.current = i;
    seq.current += 1;
    setZ(seq.current);
    setActive(i);
  };

  // Scrolling walks the preview toward the row at the reading line one project at a time,
  // with a short pause between steps, so every screenshot gets a beat on screen even when
  // the page is scrolled quickly. Hover/focus still jump straight to a project.
  const STEP_MS = 520;
  const target = useRef(0);
  const timer = useRef<number | null>(null);
  const tick = () => {
    const cur = activeRef.current;
    if (cur === target.current) {
      timer.current = null;
      return;
    }
    select(cur + Math.sign(target.current - cur));
    timer.current = window.setTimeout(tick, STEP_MS);
  };
  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    [],
  );

  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 55%", "end 55%"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    target.current = Math.min(n - 1, Math.max(0, Math.floor(v * n)));
    if (timer.current === null && target.current !== activeRef.current)
      timer.current = window.setTimeout(tick, 180);
  });
  const hover = (i: number) => {
    target.current = i;
    if (timer.current) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
    select(i);
  };

  // pointer tilt on the preview card
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotY = useSpring(
    useTransform(mx, (v) => v * 8),
    { stiffness: 90, damping: 16 },
  );
  const rotX = useSpring(
    useTransform(my, (v) => v * -6),
    { stiffness: 90, damping: 16 },
  );
  const imgX = useSpring(
    useTransform(mx, (v) => v * -10),
    { stiffness: 90, damping: 16 },
  );

  const p = projects[active];

  // decode every cover up front so switching projects never stalls on an image decode
  useEffect(() => {
    projects.forEach((proj) => {
      const img = new Image();
      img.src = coverOf(proj);
      img.decode?.().catch(() => {});
    });
  }, []);

  return (
    <div className="grid grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-14">
      <div ref={listRef} className="border-b border-border">
        {projects.map((proj, i) => {
          const on = i === active;
          return (
            <motion.button
              key={proj.title}
              type="button"
              data-cursor="View"
              onMouseEnter={() => hover(i)}
              onFocus={() => hover(i)}
              onClick={() => onOpen(proj)}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: (i % 4) * 0.05 }}
              className="group relative block w-full overflow-hidden border-t border-border text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--ring)]"
            >
              {/* yellow sweep behind the active row */}
              <motion.span
                aria-hidden
                className="absolute inset-0 origin-left bg-secondary"
                initial={false}
                animate={{ scaleX: on ? 1 : 0 }}
                transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
              />
              <span className="relative grid grid-cols-[3rem_minmax(0,1fr)_auto] items-center gap-6 px-3 py-9">
                <span
                  className={`font-mega text-2xl transition-colors ${on ? "text-secondary-foreground" : "text-muted-foreground"}`}
                >
                  {pad(i + 1)}
                </span>
                <span className="min-w-0">
                  <span
                    className={`block font-mega text-[clamp(1.75rem,2.6vw,2.75rem)] leading-[1] transition-transform duration-500 ${on ? "translate-x-3" : ""}`}
                  >
                    {proj.title}
                  </span>
                  <span
                    className={`mt-2 block text-xs font-semibold uppercase tracking-[0.2em] transition-colors ${on ? "text-secondary-foreground/75" : "text-muted-foreground"}`}
                  >
                    {proj.tags.join(" · ")}
                  </span>
                </span>
                <span
                  className={`grid size-11 place-items-center rounded-full border transition-all duration-500 ${on ? "rotate-45 border-secondary-foreground bg-secondary-foreground text-secondary" : "border-border text-foreground"}`}
                >
                  <ArrowUpRight className="size-5" />
                </span>
              </span>
            </motion.button>
          );
        })}
      </div>

      <div className="relative">
        <div
          className="sticky top-[calc(var(--header-h)+1.5rem)] h-[min(74vh,720px)]"
          style={{ perspective: 1200 }}
          onPointerMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            mx.set((e.clientX - r.left) / r.width - 0.5);
            my.set((e.clientY - r.top) / r.height - 0.5);
          }}
          onPointerLeave={() => {
            mx.set(0);
            my.set(0);
          }}
        >
          <motion.button
            type="button"
            data-cursor="Open"
            onClick={() => onOpen(p)}
            style={{ rotateX: rotX, rotateY: rotY }}
            className="gpu surface-dark relative block h-full w-full overflow-hidden rounded-[2rem] border border-border bg-card text-left shadow-[0_50px_100px_-50px_rgba(0,0,0,0.6)]"
          >
            {/* each new screenshot wipes up over the last one */}
            <AnimatePresence initial={false}>
              <motion.div
                key={active}
                className="absolute inset-0"
                style={{ zIndex: z }}
                initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
                animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                exit={{ opacity: 0, transition: { delay: 0.75, duration: 0 } }}
                transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `radial-gradient(circle at 30% 20%, oklch(0.88 0.18 ${p.hue} / 0.28), transparent 55%)`,
                  }}
                />
                {/* whole screenshot, never side-cropped */}
                <motion.img
                  src={coverOf(p)}
                  alt={`${p.title} preview`}
                  className="absolute inset-x-5 top-5 max-h-[58%] w-[calc(100%-2.5rem)] rounded-xl object-contain object-top shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]"
                  style={{ x: imgX }}
                  initial={{ scale: 1.12, y: 30 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                />
              </motion.div>
            </AnimatePresence>

            <div className="pointer-events-none absolute inset-0 z-[999] flex flex-col justify-between p-8">
              <span />
              <div>
                <div className="mb-4 flex items-end justify-between">
                  <span className="font-mega text-6xl leading-none text-outline [--outline-stroke:oklch(1_0_0/0.85)]">
                    {pad(active + 1)}
                    <span className="text-2xl">/{pad(n)}</span>
                  </span>
                  <span className="rounded-full bg-secondary px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-secondary-foreground">
                    {p.metric}
                  </span>
                </div>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={active}
                    initial={{ y: 24, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -16, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="font-mega text-4xl leading-[1] text-white"
                  >
                    {p.title}
                  </motion.p>
                </AnimatePresence>
                <span className="mt-5 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-secondary">
                  Explore project
                  <span className="grid size-9 place-items-center rounded-full bg-secondary text-secondary-foreground">
                    <ArrowUpRight className="size-4" />
                  </span>
                </span>
                <span className="mt-6 block h-[3px] w-full overflow-hidden rounded-full bg-white/15">
                  <motion.span
                    className="block h-full origin-left bg-secondary"
                    animate={{ scaleX: (active + 1) / n }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  />
                </span>
              </div>
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}

/** Phones and tablets: a swipeable, snapping row of tall project cards. */
function ProjectCarousel({ onOpen }: { onOpen: (p: PortfolioItem) => void }) {
  const rail = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);
  const n = projects.length;

  const step = () => {
    const el = rail.current;
    const card = el?.firstElementChild as HTMLElement | null;
    return card ? card.offsetWidth + 16 : 1;
  };
  const go = (i: number) => {
    const j = Math.min(n - 1, Math.max(0, i));
    rail.current?.scrollTo({ left: j * step(), behavior: "smooth" });
  };

  return (
    <div>
      <div
        ref={rail}
        onScroll={(e) => setIdx(Math.round(e.currentTarget.scrollLeft / step()))}
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 scroll-px-4 [scrollbar-width:none] md:-mx-10 md:scroll-px-10 md:px-10 [&::-webkit-scrollbar]:hidden"
        aria-label="Projects"
      >
        {projects.map((p, i) => (
          <motion.button
            key={p.title}
            type="button"
            onClick={() => onOpen(p)}
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: Math.min(i, 3) * 0.08 }}
            className="surface-dark group relative w-[82vw] max-w-[420px] shrink-0 snap-start overflow-hidden rounded-[1.75rem] border border-border bg-card text-left"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-black/30">
              <img
                src={coverOf(p)}
                alt={`${p.title} preview`}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-contain object-top"
              />
              <span className="absolute left-4 top-4 rounded-full bg-secondary px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-secondary-foreground">
                {p.metric}
              </span>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="font-mega text-[1.75rem] leading-[1]">{p.title}</p>
                <span className="font-mega text-4xl leading-none text-outline">{pad(i + 1)}</span>
              </div>
              <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {p.tags.join(" · ")}
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-highlight">
                Explore project <ArrowUpRight className="size-4" />
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <span className="font-mega text-2xl tabular-nums">
          {pad(idx + 1)}
          <span className="text-muted-foreground">/{pad(n)}</span>
        </span>
        <span className="h-[3px] flex-1 overflow-hidden rounded-full bg-foreground/10">
          <motion.span
            className="block h-full origin-left bg-secondary"
            animate={{ scaleX: (idx + 1) / n }}
            transition={{ duration: 0.4 }}
          />
        </span>
        <button
          type="button"
          aria-label="Previous project"
          onClick={() => go(idx - 1)}
          className="grid size-11 place-items-center rounded-full border border-border transition hover:bg-secondary disabled:opacity-40"
          disabled={idx === 0}
        >
          <ArrowUpRight className="size-5 -rotate-[135deg]" />
        </button>
        <button
          type="button"
          aria-label="Next project"
          onClick={() => go(idx + 1)}
          className="grid size-11 place-items-center rounded-full bg-foreground text-background transition hover:bg-secondary hover:text-secondary-foreground disabled:opacity-40"
          disabled={idx === n - 1}
        >
          <ArrowUpRight className="size-5 rotate-45" />
        </button>
      </div>
    </div>
  );
}

const projects: PortfolioItem[] = [
  {
    title: "Homiva — Real Estate Website Funnel",
    tags: ["Funnels", "Real Estate", "Website"],
    hue: 60,
    metric: "6 screens",
    imageUrl: funnelHomiva01,
    imageThumbFit: "contain",
    gallery: [
      { src: funnelHomiva01, alt: "Homiva funnel — Hero section" },
      { src: funnelHomiva02, alt: "Homiva funnel — Trust & guidance section" },
      { src: funnelHomiva03, alt: "Homiva funnel — Property types" },
      { src: funnelHomiva04, alt: "Homiva funnel — Latest properties carousel" },
      { src: funnelHomiva05, alt: "Homiva funnel — Services section" },
      { src: funnelHomiva06, alt: "Homiva funnel — Footer" },
    ],
  },
  {
    title: "Cassy Voice — AI Receptionist Funnel",
    tags: ["Funnels", "AI", "Landing Page"],
    hue: 205,
    metric: "9 screens",
    imageUrl: funnelCassy01,
    imageThumbFit: "contain",
    gallery: [
      { src: funnelCassy01, alt: "Cassy Voice funnel — Hero section" },
      { src: funnelCassy02, alt: "Cassy Voice funnel — Features section" },
      { src: funnelCassy03, alt: "Cassy Voice funnel — Customer messages section" },
      { src: funnelCassy04, alt: "Cassy Voice funnel — Setup steps section" },
      { src: funnelCassy05, alt: "Cassy Voice funnel — Tradesmen benefits section" },
      { src: funnelCassy06, alt: "Cassy Voice funnel — Works with your flow section" },
      { src: funnelCassy07, alt: "Cassy Voice funnel — FAQ section" },
      { src: funnelCassy08, alt: "Cassy Voice funnel — Results section (variant)" },
      { src: funnelCassy09, alt: "Cassy Voice funnel — CTA section" },
    ],
  },
  {
    title: "NexGen Fitness — Lead Capture Funnel",
    tags: ["Funnels", "Website", "Landing Page"],
    hue: 210,
    metric: "8 screens",
    imageUrl: funnelProject301,
    imageThumbFit: "contain",
    gallery: [
      { src: funnelProject301, alt: "Funnel project 3 — Screen 1" },
      { src: funnelProject302, alt: "Funnel project 3 — Screen 2" },
      { src: funnelProject303, alt: "Funnel project 3 — Screen 3" },
      { src: funnelProject304, alt: "Funnel project 3 — Screen 4" },
      { src: funnelProject305, alt: "Funnel project 3 — Screen 5" },
      { src: funnelProject306, alt: "Funnel project 3 — Screen 6" },
      { src: funnelProject307, alt: "Funnel project 3 — Screen 7" },
      { src: funnelProject308, alt: "Funnel project 3 — Screen 8" },
    ],
  },
  {
    title: "Novexa Marketing — Trades Funnel",
    tags: ["Funnels", "Marketing", "Website"],
    hue: 38,
    metric: "6 screens",
    imageUrl: funnelNovexa01,
    imageThumbFit: "contain",
    gallery: [
      { src: funnelNovexa01, alt: "Novexa funnel — Hero section" },
      { src: funnelNovexa02, alt: "Novexa funnel — Trades grid (part 1)" },
      { src: funnelNovexa03, alt: "Novexa funnel — Trades grid (part 2)" },
      { src: funnelNovexa04, alt: "Novexa funnel — Trades + CTA section" },
      { src: funnelNovexa05, alt: "Novexa funnel — All trades list" },
      { src: funnelNovexa06, alt: "Novexa funnel — FAQ + footer" },
    ],
  },
  {
    title: "Lead-Gen Funnel — Coaching Agency",
    tags: ["GoHighLevel", "Funnels", "Automation"],
    hue: 95,
    metric: "+38% conversion",
    imageUrl: appointmentWorkflow,
    imageThumbFit: "contain",
    detail: {
      whatItDoes:
        "Your workflow automatically confirms appointments to clients and keeps both your team and the client updated with reminders, using both email and WhatsApp at the right times.",
      flow: [
        {
          title: "Appointment booked (trigger)",
          body: "When a customer books an appointment on a specific calendar, the workflow starts automatically.",
        },
        {
          title: "Assign contact to a user",
          body: "The new appointment is assigned to a team member for follow-up.",
        },
        {
          title: "Wait 1 minute",
          body: "A short delay prevents instant actions and gives the system time to sync.",
        },
        {
          title: "Send confirmation email",
          body: "The client receives an email confirming the call/meeting is scheduled.",
        },
        {
          title: "Send WhatsApp confirmation",
          body: "The client also receives their appointment details via WhatsApp.",
        },
        {
          title: "Notify internal users",
          body: "Your internal team gets notified (email + WhatsApp) about the new appointment.",
        },
        {
          title: "Client reminders",
          body: "WhatsApp reminders are sent 24 hours before the appointment and again 1 hour before.",
        },
      ],
    },
  },
  {
    title: "CRM & Pipeline Setup — Real Estate",
    tags: ["GHL CRM", "Pipelines", "SMS"],
    hue: 60,
    metric: "180+ leads / mo",
    imageUrl: ghlZapierHubspotFlow,
    imageThumbFit: "contain",
    detail: {
      whatItDoes:
        "When someone books an appointment, their details are automatically passed (after a short wait) to Zapier for further processing, such as updating HubSpot.",
      flow: [
        {
          title: "Trigger",
          body: "The automation starts when a customer books an appointment on a specific calendar.",
        },
        {
          title: "Wait",
          body: "After the appointment is booked, the system waits for 1 minute.",
        },
        {
          title: "Send data to Zapier",
          body: "The workflow sends the contact’s details (name, email, phone, etc.) and meeting information to a Zapier webhook to trigger actions in HubSpot or other tools.",
        },
      ],
    },
  },
  {
    title: "Active prospecting → HubSpot",
    tags: ["Zapier", "Webhooks", "HubSpot"],
    hue: 48,
    metric: "Zap live",
    imageUrl: prospeccionActivaFlow,
    imageThumbFit: "contain",
    detail: {
      whatItDoes:
        'This workflow ("00. Prospeccion activa") routes new leads through tagging/survey triggers, sends lead + project data to Zapier, creates opportunities, and runs qualification + outreach follow-ups via Email/WhatsApp.',
      flow: [
        {
          title: "Triggers",
          body: "Starts when a Contact receives the tag “prospeccion activa” or when the survey (8EPtv4d1ezILUDzsxrXZ) is submitted.",
        },
        {
          title: "Send lead data via webhook",
          body: "Sends contact + project details to Zapier for downstream actions.",
        },
        {
          title: "Update & assign",
          body: "Updates contact fields (business unit, project source) and assigns the lead to a specific user.",
        },
        {
          title: "Create opportunities",
          body: "Creates new opportunities in two different pipelines and stages.",
        },
        {
          title: "Qualification + outreach branching",
          body: "Checks if the lead is qualified. If qualified, checks if contact is needed and chooses Email, WhatsApp, or both. Each path sends the initial message, waits for a reply, updates opportunity status on reply, and notifies the assigned user. If contact isn’t needed, the workflow ends.",
        },
        {
          title: "Not qualified branch",
          body: "If the lead is not qualified, the workflow follows the not-qualified path and stops further outreach/automation steps.",
        },
      ],
    },
  },
  {
    title: "Webhook → HubSpot company creation",
    tags: ["Zapier", "Webhooks", "HubSpot CRM"],
    hue: 38,
    metric: "Automation live",
    imageUrl: zapierHubspotCompanyFlow,
    imageThumbFit: "contain",
    detail: {
      whatItDoes:
        "This automation captures prospect data from an external webhook and automatically creates company records in HubSpot CRM.",
      flow: [
        {
          title: "Webhook trigger",
          body: "Receives incoming prospect information (name, company details, qualifications, contact preferences, project info).",
        },
        {
          title: "Create HubSpot company",
          body: "Converts the prospect data into a new HubSpot company record, mapping the key fields so your team can follow up immediately without manual data entry.",
        },
      ],
    },
  },
];

export function Portfolio() {
  const [activeProject, setActiveProject] = useState<PortfolioItem | null>(null);
  const activeIndex = activeProject
    ? projects.findIndex((p) => p.title === activeProject.title)
    : -1;
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [mediaZoomed, setMediaZoomed] = useState(false);
  const [workflowDetailsOpen, setWorkflowDetailsOpen] = useState(false);
  const wide = useMedia("(min-width: 1024px)");

  useEffect(() => {
    lockScroll(Boolean(activeProject));
    return () => lockScroll(false);
  }, [activeProject]);

  useEffect(() => {
    if (!activeProject) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveProject(null);
      if (!activeProject.gallery || activeProject.gallery.length <= 1) return;
      if (e.key === "ArrowLeft")
        setActiveMediaIndex(
          (i) => (i - 1 + activeProject.gallery!.length) % activeProject.gallery!.length,
        );
      if (e.key === "ArrowRight")
        setActiveMediaIndex((i) => (i + 1) % activeProject.gallery!.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeProject]);

  useEffect(() => {
    setActiveMediaIndex(0);
    setMediaZoomed(false);
    setWorkflowDetailsOpen(false);
  }, [activeProject]);

  useEffect(() => {
    setMediaZoomed(false);
  }, [activeMediaIndex]);

  return (
    <section
      id="portfolio"
      className="relative overflow-x-clip px-4 md:px-10 pt-24 md:pt-40 pb-24 md:pb-32"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-24">
        <div>
          <Eyebrow index="05" label="Portfolio" />
          <h2 className="mt-8 font-mega text-[clamp(2.5rem,calc((100vw-2rem)/3.8),11rem)] md:text-[min(11vw,11rem)]">
            <MaskText lines={["Featured", <span className="hl">Projects</span>]} />
          </h2>
        </div>
        <p className="max-w-xs text-muted-foreground md:text-right">
          Funnels, websites and automation systems. Scroll or hover to preview, click to open every
          screen and the full workflow.
        </p>
      </div>

      {wide ? (
        <ProjectIndex onOpen={setActiveProject} />
      ) : (
        <ProjectCarousel onOpen={setActiveProject} />
      )}

      {activeProject ? (
        <div
          className="surface-dark fixed inset-0 z-[80] flex items-center justify-center bg-background/80 p-3 backdrop-blur-md sm:p-6 md:p-8"
          onClick={() => setActiveProject(null)}
          role="presentation"
          data-lenis-prevent
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex max-h-[min(92vh,920px)] w-full max-w-7xl flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-secondary/[0.08] via-transparent to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-secondary/35 to-transparent" />

            <button
              type="button"
              className="absolute right-3 top-3 z-30 inline-flex size-11 items-center justify-center rounded-full border border-border/80 bg-background/90 text-foreground shadow-glow backdrop-blur-md transition hover:scale-105 hover:border-secondary/60 hover:bg-secondary hover:text-secondary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background md:right-4 md:top-4"
              onClick={() => setActiveProject(null)}
              aria-label="Close preview"
            >
              <X className="size-[18px] stroke-[2.5]" />
            </button>

            <div className="relative z-10 border-b border-border/80 px-4 pb-3 pt-4 pr-14 md:px-6 md:pb-4 md:pt-5 md:pr-16">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-highlight">
                Project
              </p>
              <h3 className="mt-1 font-display text-xl font-bold tracking-tight text-foreground md:text-3xl">
                {activeProject.title}
              </h3>
            </div>

            <div className="relative z-10 min-h-0 flex-1 overflow-hidden">
              {activeProject.detail ? (
                <>
                  {/* Mobile: preview first → small faded “See details” → details overlay */}
                  <div className="relative flex h-full min-h-0 flex-col md:hidden">
                    <div className="min-h-0 flex-1 bg-gradient-to-b from-muted/30 to-background/40 px-3 py-3">
                      <div
                        className={cn(
                          "relative mx-auto h-full w-full max-w-[880px] overflow-hidden rounded-3xl border border-border bg-card-gradient shadow-card",
                          mediaZoomed && !workflowDetailsOpen ? "overflow-auto" : "overflow-hidden",
                        )}
                        style={{
                          backgroundImage: `radial-gradient(circle at 30% 30%, oklch(0.88 0.18 ${activeProject.hue} / 0.20), transparent 60%), radial-gradient(circle at 70% 70%, oklch(0.4 0.05 270 / 0.35), transparent 60%)`,
                        }}
                      >
                        {(() => {
                          const items = activeProject.gallery?.length
                            ? activeProject.gallery
                            : [{ src: activeProject.imageUrl, alt: activeProject.title }];
                          const current = items[Math.min(activeMediaIndex, items.length - 1)];
                          return (
                            <button
                              type="button"
                              onClick={() => {
                                if (workflowDetailsOpen) return;
                                setMediaZoomed((z) => !z);
                              }}
                              className={cn(
                                "relative h-full w-full",
                                workflowDetailsOpen
                                  ? "cursor-default"
                                  : mediaZoomed
                                    ? "cursor-zoom-out"
                                    : "cursor-zoom-in",
                              )}
                              aria-label={
                                workflowDetailsOpen
                                  ? "Preview"
                                  : mediaZoomed
                                    ? "Zoom out"
                                    : "Zoom in"
                              }
                            >
                              <img
                                src={current.src}
                                alt={current.alt}
                                className={cn(
                                  "opacity-90",
                                  mediaZoomed
                                    ? "max-w-none max-h-none w-[160%] h-[160%] object-contain object-center"
                                    : "h-full w-full object-contain object-center",
                                )}
                              />
                            </button>
                          );
                        })()}

                        <div className="pointer-events-none absolute inset-0 bg-background/25" />
                        <div
                          className="pointer-events-none absolute inset-0 opacity-25"
                          style={{
                            backgroundImage:
                              "linear-gradient(oklch(1 0 0 / 0.05) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.05) 1px, transparent 1px)",
                            backgroundSize: "40px 40px",
                          }}
                        />

                        <div className="absolute top-4 left-4 rounded-full border border-secondary/30 bg-secondary/15 px-3 py-1.5 text-xs font-semibold tracking-wide text-highlight backdrop-blur">
                          {activeProject.metric}
                        </div>

                        {activeProject.gallery && activeProject.gallery.length > 1 ? (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                setActiveMediaIndex(
                                  (i) =>
                                    (i - 1 + activeProject.gallery!.length) %
                                    activeProject.gallery!.length,
                                )
                              }
                              className="pointer-events-auto absolute left-3 top-1/2 -translate-y-1/2 inline-flex size-11 items-center justify-center rounded-full border border-border bg-background/70 text-foreground backdrop-blur transition hover:border-secondary/50 hover:text-highlight"
                              aria-label="Previous screenshot"
                            >
                              ←
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setActiveMediaIndex((i) => (i + 1) % activeProject.gallery!.length)
                              }
                              className="pointer-events-auto absolute right-3 top-1/2 -translate-y-1/2 inline-flex size-11 items-center justify-center rounded-full border border-border bg-background/70 text-foreground backdrop-blur transition hover:border-secondary/50 hover:text-highlight"
                              aria-label="Next screenshot"
                            >
                              →
                            </button>
                          </>
                        ) : null}

                        <div className="pointer-events-none absolute top-4 right-4 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur">
                          {mediaZoomed ? "Scroll to pan • click to zoom out" : "Zoom to see"}
                        </div>

                        {!workflowDetailsOpen ? (
                          <div className="absolute inset-x-0 bottom-4 flex justify-center">
                            <motion.button
                              type="button"
                              onClick={() => {
                                setMediaZoomed(false);
                                setWorkflowDetailsOpen(true);
                              }}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                              className="pointer-events-auto rounded-full border border-border/70 bg-background/55 px-4 py-2 text-[11px] font-semibold text-muted-foreground backdrop-blur transition hover:border-secondary/50 hover:text-foreground"
                              aria-label="Open details"
                            >
                              <motion.span
                                animate={{ opacity: [0.7, 1, 0.7] }}
                                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                              >
                                See details
                              </motion.span>
                            </motion.button>
                          </div>
                        ) : null}

                        <AnimatePresence>
                          {workflowDetailsOpen ? (
                            <motion.div
                              key="workflow-details"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.18, ease: "easeOut" }}
                              className="absolute inset-0 z-20"
                            >
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.18, ease: "easeOut" }}
                                className="absolute inset-0 bg-background/60 backdrop-blur-sm"
                              />
                              <motion.div
                                initial={{ opacity: 0, y: 14, scale: 0.99 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.99 }}
                                transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                                className="absolute inset-0 overflow-hidden rounded-3xl border border-border/70 bg-background/85 backdrop-blur-md"
                              >
                                <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
                                  <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-highlight">
                                    Details
                                  </p>
                                  <button
                                    type="button"
                                    onClick={() => setWorkflowDetailsOpen(false)}
                                    className="rounded-full border border-border bg-background/70 px-3 py-1.5 text-[11px] font-semibold text-muted-foreground backdrop-blur transition hover:border-secondary/50 hover:text-foreground"
                                  >
                                    Back to preview
                                  </button>
                                </div>
                                <div className="h-[calc(100%-48px)] overflow-y-auto overscroll-contain px-4 py-4 pr-2 [scrollbar-gutter:stable]">
                                  <PortfolioDetailBody detail={activeProject.detail} />
                                  <div className="h-14" />
                                </div>
                              </motion.div>
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  {/* Desktop/tablet: keep the existing two-column layout */}
                  <div className="hidden h-full min-h-0 md:grid md:grid-cols-[minmax(0,1fr)_480px]">
                    <div className="order-1 min-h-0 bg-gradient-to-b from-muted/30 to-background/40 px-6 py-6">
                      <div
                        className="relative mx-auto h-full max-h-[560px] w-full max-w-[880px] overflow-hidden rounded-3xl border border-border bg-card-gradient shadow-card"
                        style={{
                          backgroundImage: `radial-gradient(circle at 30% 30%, oklch(0.88 0.18 ${activeProject.hue} / 0.20), transparent 60%), radial-gradient(circle at 70% 70%, oklch(0.4 0.05 270 / 0.35), transparent 60%)`,
                        }}
                      >
                        {(() => {
                          const items = activeProject.gallery?.length
                            ? activeProject.gallery
                            : [{ src: activeProject.imageUrl, alt: activeProject.title }];
                          const current = items[Math.min(activeMediaIndex, items.length - 1)];
                          return (
                            <button
                              type="button"
                              onClick={() => setMediaZoomed((z) => !z)}
                              className={cn(
                                "relative h-full w-full",
                                mediaZoomed ? "cursor-zoom-out" : "cursor-zoom-in",
                              )}
                              aria-label={mediaZoomed ? "Zoom out" : "Zoom in"}
                            >
                              <img
                                src={current.src}
                                alt={current.alt}
                                className={cn(
                                  "opacity-90",
                                  mediaZoomed
                                    ? "max-w-none max-h-none w-[160%] h-[160%] object-contain object-center"
                                    : "h-full w-full object-contain object-center",
                                )}
                              />
                            </button>
                          );
                        })()}
                        <div className="pointer-events-none absolute inset-0 bg-background/25" />
                        <div
                          className="pointer-events-none absolute inset-0 opacity-25"
                          style={{
                            backgroundImage:
                              "linear-gradient(oklch(1 0 0 / 0.05) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.05) 1px, transparent 1px)",
                            backgroundSize: "40px 40px",
                          }}
                        />

                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                          <div className="font-display text-7xl md:text-9xl font-bold opacity-10 tracking-tighter">
                            {activeIndex >= 0 ? `0${activeIndex + 1}` : ""}
                          </div>
                        </div>

                        <div className="absolute top-5 left-5 rounded-full border border-secondary/30 bg-secondary/15 px-3 py-1.5 text-xs font-semibold tracking-wide text-highlight backdrop-blur">
                          {activeProject.metric}
                        </div>

                        <div className="absolute bottom-5 left-5 flex flex-wrap gap-2">
                          {activeProject.tags.map((t) => (
                            <span
                              key={t}
                              className="rounded-full border border-border bg-background/70 px-4 py-1.5 text-xs font-medium backdrop-blur"
                            >
                              {t.toLowerCase() === "funnels" ? (
                                <span className="inline-flex items-center gap-2">
                                  <FunnelIcon className="size-3.5 text-highlight" />
                                  {t}
                                </span>
                              ) : (
                                t
                              )}
                            </span>
                          ))}
                        </div>

                        {activeProject.gallery && activeProject.gallery.length > 1 ? (
                          <>
                            <div className="absolute right-5 bottom-5 flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setActiveMediaIndex(
                                    (i) =>
                                      (i - 1 + activeProject.gallery!.length) %
                                      activeProject.gallery!.length,
                                  )
                                }
                                className="pointer-events-auto inline-flex size-10 items-center justify-center rounded-full border border-border bg-background/70 text-foreground backdrop-blur transition hover:border-secondary/50 hover:text-highlight"
                                aria-label="Previous screenshot"
                              >
                                ←
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setActiveMediaIndex(
                                    (i) => (i + 1) % activeProject.gallery!.length,
                                  )
                                }
                                className="pointer-events-auto inline-flex size-10 items-center justify-center rounded-full border border-border bg-background/70 text-foreground backdrop-blur transition hover:border-secondary/50 hover:text-highlight"
                                aria-label="Next screenshot"
                              >
                                →
                              </button>
                            </div>

                            <div className="absolute left-1/2 bottom-5 hidden -translate-x-1/2 gap-2 md:flex">
                              {activeProject.gallery.map((m, idx) => (
                                <button
                                  key={m.src}
                                  type="button"
                                  onClick={() => setActiveMediaIndex(idx)}
                                  className={cn(
                                    "pointer-events-auto size-2.5 rounded-full border border-border bg-background/60 backdrop-blur transition",
                                    idx === activeMediaIndex
                                      ? "border-secondary bg-secondary/70"
                                      : "hover:border-secondary/50",
                                  )}
                                  aria-label={`Open screenshot ${idx + 1}`}
                                />
                              ))}
                            </div>
                          </>
                        ) : null}

                        <div className="pointer-events-none absolute top-5 right-5 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur">
                          {mediaZoomed ? "Scroll to pan • click to zoom out" : "Zoom to see"}
                        </div>
                      </div>
                    </div>

                    <div className="relative order-2 h-full min-h-0 overflow-hidden border-l border-border/70 bg-background/55 backdrop-blur-xl">
                      <div className="absolute inset-0 overflow-y-auto overscroll-contain px-6 py-6 pr-2 [scrollbar-gutter:stable]">
                        <PortfolioDetailBody detail={activeProject.detail} />
                        <div className="h-14" />
                      </div>
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-background/90 via-background/60 to-transparent" />
                      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur">
                        Scroll to see more
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full min-h-0 bg-gradient-to-b from-muted/30 to-background/40 px-3 py-3 sm:px-5 sm:py-5 md:px-6 md:py-6">
                  <div
                    className={cn(
                      // Funnel/gallery preview: keep a medium, consistent size across projects.
                      "relative mx-auto w-full max-w-[1100px] h-[min(64vh,640px)] rounded-3xl border border-border bg-card-gradient shadow-card",
                      mediaZoomed ? "overflow-auto" : "overflow-hidden",
                    )}
                    style={{
                      backgroundImage: `radial-gradient(circle at 30% 30%, oklch(0.88 0.18 ${activeProject.hue} / 0.20), transparent 60%), radial-gradient(circle at 70% 70%, oklch(0.4 0.05 270 / 0.35), transparent 60%)`,
                    }}
                  >
                    {(() => {
                      const items = activeProject.gallery?.length
                        ? activeProject.gallery
                        : [{ src: activeProject.imageUrl, alt: activeProject.title }];
                      const current = items[Math.min(activeMediaIndex, items.length - 1)];
                      return (
                        <button
                          type="button"
                          onClick={() => setMediaZoomed((z) => !z)}
                          className={cn(
                            "relative h-full w-full",
                            mediaZoomed ? "cursor-zoom-out" : "cursor-zoom-in",
                          )}
                          aria-label={mediaZoomed ? "Zoom out" : "Zoom in"}
                        >
                          <img
                            src={current.src}
                            alt={current.alt}
                            className={cn(
                              "opacity-90",
                              mediaZoomed
                                ? "max-w-none max-h-none w-[160%] h-[160%] object-contain object-center"
                                : "h-full w-full object-contain object-center",
                            )}
                          />
                        </button>
                      );
                    })()}
                    <div className="pointer-events-none absolute inset-0 bg-background/25" />
                    <div
                      className="pointer-events-none absolute inset-0 opacity-25"
                      style={{
                        backgroundImage:
                          "linear-gradient(oklch(1 0 0 / 0.05) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.05) 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                      }}
                    />

                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <div className="font-display text-7xl md:text-9xl font-bold opacity-10 tracking-tighter">
                        {activeIndex >= 0 ? `0${activeIndex + 1}` : ""}
                      </div>
                    </div>

                    <div className="absolute top-5 left-5 rounded-full border border-secondary/30 bg-secondary/15 px-3 py-1.5 text-xs font-semibold tracking-wide text-highlight backdrop-blur">
                      {activeProject.metric}
                    </div>

                    {activeProject.gallery && activeProject.gallery.length > 1 ? (
                      <>
                        {/* Mobile: side arrows (no overlap with tags) */}
                        <button
                          type="button"
                          onClick={() =>
                            setActiveMediaIndex(
                              (i) =>
                                (i - 1 + activeProject.gallery!.length) %
                                activeProject.gallery!.length,
                            )
                          }
                          className="md:hidden pointer-events-auto absolute left-3 top-1/2 -translate-y-1/2 inline-flex size-11 items-center justify-center rounded-full border border-border bg-background/70 text-foreground backdrop-blur transition hover:border-secondary/50 hover:text-highlight"
                          aria-label="Previous screenshot"
                        >
                          ←
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setActiveMediaIndex((i) => (i + 1) % activeProject.gallery!.length)
                          }
                          className="md:hidden pointer-events-auto absolute right-3 top-1/2 -translate-y-1/2 inline-flex size-11 items-center justify-center rounded-full border border-border bg-background/70 text-foreground backdrop-blur transition hover:border-secondary/50 hover:text-highlight"
                          aria-label="Next screenshot"
                        >
                          →
                        </button>

                        {/* Desktop: bottom-right arrows */}
                        <div className="absolute right-5 bottom-5 hidden items-center gap-2 md:flex">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveMediaIndex(
                                (i) =>
                                  (i - 1 + activeProject.gallery!.length) %
                                  activeProject.gallery!.length,
                              )
                            }
                            className="pointer-events-auto inline-flex size-10 items-center justify-center rounded-full border border-border bg-background/70 text-foreground backdrop-blur transition hover:border-secondary/50 hover:text-highlight"
                            aria-label="Previous screenshot"
                          >
                            ←
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setActiveMediaIndex((i) => (i + 1) % activeProject.gallery!.length)
                            }
                            className="pointer-events-auto inline-flex size-10 items-center justify-center rounded-full border border-border bg-background/70 text-foreground backdrop-blur transition hover:border-secondary/50 hover:text-highlight"
                            aria-label="Next screenshot"
                          >
                            →
                          </button>
                        </div>

                        {/* Dots: also visible on mobile (scrollable if many) */}
                        <div className="absolute left-1/2 bottom-4 flex -translate-x-1/2 justify-center md:bottom-5">
                          <div className="flex max-w-[78vw] items-center gap-2 overflow-x-auto rounded-full border border-border/60 bg-background/40 px-3 py-2 backdrop-blur [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:max-w-none md:border-0 md:bg-transparent md:px-0 md:py-0">
                            {activeProject.gallery.map((m, idx) => (
                              <button
                                key={m.src}
                                type="button"
                                onClick={() => setActiveMediaIndex(idx)}
                                className={cn(
                                  "pointer-events-auto size-2.5 shrink-0 rounded-full border border-border bg-background/60 transition",
                                  idx === activeMediaIndex
                                    ? "border-secondary bg-secondary/70"
                                    : "hover:border-secondary/50",
                                )}
                                aria-label={`Open screenshot ${idx + 1}`}
                              />
                            ))}
                          </div>
                        </div>
                      </>
                    ) : null}

                    <div className="pointer-events-none absolute top-5 right-5 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur">
                      {mediaZoomed ? "Scroll to pan • click to zoom out" : "Zoom to see"}
                    </div>
                  </div>

                  {/* Tags below image on mobile to avoid overlap */}
                  <div className="mx-auto mt-4 w-full max-w-[1100px]">
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:justify-center">
                      {activeProject.tags.map((t) => (
                        <span
                          key={t}
                          className="shrink-0 rounded-full border border-border bg-background/70 px-4 py-1.5 text-xs font-medium backdrop-blur"
                        >
                          {t.toLowerCase() === "funnels" ? (
                            <span className="inline-flex items-center gap-2">
                              <FunnelIcon className="size-3.5 text-highlight" />
                              {t}
                            </span>
                          ) : (
                            t
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      ) : null}
    </section>
  );
}
