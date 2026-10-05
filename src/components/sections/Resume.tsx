import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { Eyebrow, MaskText } from "../fx/Reveal";

type TimelineItem = {
  title: string;
  org: string;
  points?: string[];
};

const timeline: { period: string; items: TimelineItem[] }[] = [
  {
    period: "2025 — Present",
    items: [
      {
        title: "GoHighLevel Automation Specialist",
        org: "Remote · Agency & SMB clients",
        points: [
          "Built appointment + lead workflows with email/SMS/WhatsApp touchpoints and internal notifications.",
          "Designed pipelines and stages with clear ownership, follow-up rules, and reporting.",
          "Integrated tools like Zapier/webhooks and CRMs to reduce manual data entry.",
        ],
      },
      {
        title: "Funnel Builder (Landing → Form → Thank-you)",
        org: "GoHighLevel funnels",
        points: [
          "Created multi-page funnels focused on clarity, proof, and conversion (mobile-first).",
          "Implemented forms, tagging/segmentation, and routing to the correct pipeline/user.",
          "Iterated layouts based on real feedback to improve opt-in and booking rates.",
        ],
      },
    ],
  },
  {
    period: "2023 — 2024",
    items: [
      {
        title: "GHL Setup & CRM Implementation",
        org: "Freelance / early client projects",
        points: [
          "Set up calendars, forms, tags, triggers, and basic follow-up sequences.",
          "Cleaned contact data and standardized fields for consistent reporting.",
        ],
      },
    ],
  },
  {
    period: "Education",
    items: [
      {
        title: "Bachelor's in Computer Science",
        org: "Multan University of Science and Technology",
        points: [
          "Strong foundation in problem-solving, systems thinking, and building reliable workflows.",
        ],
      },
    ],
  },
];

export function Resume() {
  const listRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 70%", "end 60%"] });
  const line = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <section id="resume" className="relative px-4 md:px-10 py-24 md:py-40">
      <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Eyebrow index="04" label="Resume" />
          <h2 className="mt-8 font-mega text-[16vw] md:text-[10vw] lg:text-[7vw]">
            <MaskText
              lines={["Education", "&", <span className="text-secondary">Experience</span>]}
            />
          </h2>
          <p className="mt-6 max-w-sm text-muted-foreground">
            From cleaning up contact data to architecting full multi-channel automation systems.
          </p>
        </div>

        <div ref={listRef} className="relative pl-10 md:pl-16">
          {/* rail + scroll-drawn progress */}
          <div className="absolute left-3 md:left-5 top-0 bottom-0 w-px bg-border" />
          <motion.div
            className="absolute left-3 md:left-5 top-0 bottom-0 w-[3px] -ml-px bg-secondary origin-top shadow-glow"
            style={{ scaleY: line }}
          />

          <div className="space-y-20">
            {timeline.map((block) => (
              <div key={block.period} className="relative">
                <motion.span
                  className="absolute -left-[34px] md:-left-[50px] top-3 size-4 rounded-full border-2 border-secondary bg-background"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1, backgroundColor: "rgba(246, 207, 58, 1)" }}
                  viewport={{ margin: "-45% 0px -45% 0px" }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                />
                <p className="font-mega text-5xl md:text-7xl text-outline mb-8">
                  <MaskText lines={[block.period]} />
                </p>
                <div className="space-y-6">
                  {block.items.map((it, i) => (
                    <motion.article
                      key={it.title}
                      initial={{ opacity: 0, y: 60, rotateX: -20 }}
                      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                      viewport={{ once: true, margin: "-10%" }}
                      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 }}
                      style={{ transformPerspective: 1000 }}
                      className="group relative overflow-hidden rounded-3xl border border-border bg-card-gradient p-6 md:p-8 transition-colors duration-500 hover:border-secondary/60"
                    >
                      <div className="absolute -right-20 -top-20 size-56 rounded-full bg-secondary/20 blur-3xl opacity-0 transition duration-700 group-hover:opacity-100" />
                      <h3 className="relative font-display text-2xl md:text-3xl font-semibold">
                        {it.title}
                      </h3>
                      <p className="relative mt-1 text-secondary text-sm font-medium tracking-wide">
                        {it.org}
                      </p>
                      {it.points?.length ? (
                        <ul className="relative mt-5 space-y-2.5 text-sm text-muted-foreground">
                          {it.points.map((p) => (
                            <li key={p} className="flex gap-3">
                              <span className="mt-2 h-px w-4 shrink-0 bg-secondary" />
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </motion.article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
