import { LayoutGrid, ArrowUpRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Section, SectionTag } from "../Section";
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
      {isFunnels ? <FunnelIcon className="size-3.5 text-secondary" /> : null}
      <span>{tag}</span>
    </span>
  );
}

function PortfolioDetailBody({ detail }: { detail: PortfolioDetail }) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-secondary">
          What it does
        </p>
        <p className="mt-2 whitespace-pre-line break-words text-sm leading-relaxed text-foreground/90">
          {detail.whatItDoes}
        </p>
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-secondary">The flow</p>
        <ul className="mt-3 space-y-2">
          {detail.flow.map((step, idx) => (
            <li
              key={step.title}
              className="overflow-hidden rounded-xl border border-border/60 bg-background/50 px-3 py-2.5"
            >
              <div className="flex gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary/25 text-xs font-bold text-secondary">
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
    <Section id="portfolio">
      <SectionTag icon={<LayoutGrid className="size-3.5" />} label="Portfolio" />
      <h2 className="mt-8 mb-12 font-display text-4xl md:text-6xl font-bold">
        Featured <span className="text-gradient-yellow">Projects</span>
      </h2>

      <div className="space-y-10">
        {projects.map((p, i) => (
          <motion.button
            type="button"
            key={p.title}
            onClick={() => setActiveProject(p)}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="block w-full text-left group"
          >
            <motion.div
              whileHover={{ y: -10, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="relative aspect-[16/10] rounded-3xl overflow-hidden border border-border bg-card-gradient cursor-pointer"
              style={{
                backgroundImage: `radial-gradient(circle at 30% 30%, oklch(0.88 0.18 ${p.hue} / 0.3), transparent 60%), radial-gradient(circle at 70% 70%, oklch(0.4 0.05 270 / 0.4), transparent 60%)`,
              }}
            >
              <img
                src={(p.gallery && p.gallery[0]?.src) || p.imageUrl}
                alt={`${p.title} preview`}
                className={cn(
                  "absolute inset-0 h-full w-full opacity-80 transition duration-700 group-hover:scale-[1.02] group-hover:opacity-95",
                  p.imageThumbFit === "contain"
                    ? "object-contain object-top p-2 md:p-4"
                    : "object-cover",
                )}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-background/25" />
              <div
                className="absolute inset-0 opacity-20 group-hover:opacity-40 transition duration-700"
                style={{
                  backgroundImage:
                    "linear-gradient(oklch(1 0 0 / 0.05) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.05) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1500" />

              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className="font-display text-7xl md:text-9xl font-bold opacity-10 tracking-tighter group-hover:opacity-20 transition duration-500">
                  {`0${i + 1}`}
                </div>
              </motion.div>

              <div className="absolute top-6 left-6 px-3 py-1.5 rounded-full bg-secondary/15 border border-secondary/30 backdrop-blur text-xs font-semibold text-secondary tracking-wide">
                {p.metric}
              </div>

              <motion.div
                whileHover={{ rotate: 45 }}
                className="absolute top-6 right-6 size-12 rounded-full glass flex items-center justify-center group-hover:bg-secondary group-hover:text-secondary-foreground transition duration-500"
              >
                <ArrowUpRight className="size-5" />
              </motion.div>

              <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <TagPill key={t} tag={t} />
                ))}
              </div>
            </motion.div>
            <h3 className="mt-5 font-display text-2xl md:text-3xl font-semibold group-hover:text-secondary transition flex items-center gap-3">
              {p.title}
              <motion.span className="inline-block opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition duration-500">
                →
              </motion.span>
            </h3>
          </motion.button>
        ))}
      </div>

      {activeProject ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/75 p-3 backdrop-blur-md sm:p-6 md:p-8"
          onClick={() => setActiveProject(null)}
          role="presentation"
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
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-secondary">
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
                                workflowDetailsOpen ? "cursor-default" : mediaZoomed ? "cursor-zoom-out" : "cursor-zoom-in",
                              )}
                              aria-label={
                                workflowDetailsOpen ? "Preview" : mediaZoomed ? "Zoom out" : "Zoom in"
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

                        <div className="absolute top-4 left-4 rounded-full border border-secondary/30 bg-secondary/15 px-3 py-1.5 text-xs font-semibold tracking-wide text-secondary backdrop-blur">
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
                              className="pointer-events-auto absolute left-3 top-1/2 -translate-y-1/2 inline-flex size-11 items-center justify-center rounded-full border border-border bg-background/70 text-foreground backdrop-blur transition hover:border-secondary/50 hover:text-secondary"
                              aria-label="Previous screenshot"
                            >
                              ←
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setActiveMediaIndex((i) => (i + 1) % activeProject.gallery!.length)
                              }
                              className="pointer-events-auto absolute right-3 top-1/2 -translate-y-1/2 inline-flex size-11 items-center justify-center rounded-full border border-border bg-background/70 text-foreground backdrop-blur transition hover:border-secondary/50 hover:text-secondary"
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
                                  <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-secondary">
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

                        <div className="absolute top-5 left-5 rounded-full border border-secondary/30 bg-secondary/15 px-3 py-1.5 text-xs font-semibold tracking-wide text-secondary backdrop-blur">
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
                                  <FunnelIcon className="size-3.5 text-secondary" />
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
                                className="pointer-events-auto inline-flex size-10 items-center justify-center rounded-full border border-border bg-background/70 text-foreground backdrop-blur transition hover:border-secondary/50 hover:text-secondary"
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
                                className="pointer-events-auto inline-flex size-10 items-center justify-center rounded-full border border-border bg-background/70 text-foreground backdrop-blur transition hover:border-secondary/50 hover:text-secondary"
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

                    <div className="absolute top-5 left-5 rounded-full border border-secondary/30 bg-secondary/15 px-3 py-1.5 text-xs font-semibold tracking-wide text-secondary backdrop-blur">
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
                                (i - 1 + activeProject.gallery!.length) % activeProject.gallery!.length,
                            )
                          }
                          className="md:hidden pointer-events-auto absolute left-3 top-1/2 -translate-y-1/2 inline-flex size-11 items-center justify-center rounded-full border border-border bg-background/70 text-foreground backdrop-blur transition hover:border-secondary/50 hover:text-secondary"
                          aria-label="Previous screenshot"
                        >
                          ←
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setActiveMediaIndex((i) => (i + 1) % activeProject.gallery!.length)
                          }
                          className="md:hidden pointer-events-auto absolute right-3 top-1/2 -translate-y-1/2 inline-flex size-11 items-center justify-center rounded-full border border-border bg-background/70 text-foreground backdrop-blur transition hover:border-secondary/50 hover:text-secondary"
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
                            className="pointer-events-auto inline-flex size-10 items-center justify-center rounded-full border border-border bg-background/70 text-foreground backdrop-blur transition hover:border-secondary/50 hover:text-secondary"
                            aria-label="Previous screenshot"
                          >
                            ←
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setActiveMediaIndex((i) => (i + 1) % activeProject.gallery!.length)
                            }
                            className="pointer-events-auto inline-flex size-10 items-center justify-center rounded-full border border-border bg-background/70 text-foreground backdrop-blur transition hover:border-secondary/50 hover:text-secondary"
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
                              <FunnelIcon className="size-3.5 text-secondary" />
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
    </Section>
  );
}
