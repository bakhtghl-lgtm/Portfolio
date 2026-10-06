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
        title: "Senior GoHighLevel Expert",
        org: "VA Hub Pro · Remote",
        points: [
          "Lead GoHighLevel builds for the agency's clients: funnels, automations, CRM setup and SaaS snapshots.",
          "Turn client briefs into working systems and own them from first call to go-live.",
        ],
      },
      {
        title: "Freelance GoHighLevel Consultant",
        org: "Direct clients · Since 2023",
        points: [
          "A long roster of freelance clients across real estate, insurance, home services, education and travel.",
          "End-to-end GHL SaaS systems: snapshots, onboarding flows, automations and reporting.",
        ],
      },
    ],
  },
  {
    period: "2023 — 2025",
    items: [
      {
        title: "Senior GoHighLevel Expert",
        org: "Markelop (Mexico) & Convertio · White-label agencies",
        points: [
          "The go-to GHL builder behind two white-label agencies, delivering under their brands.",
          "Shipped funnels, pipelines and automation systems for their clients, from quick fixes to full builds.",
        ],
      },
    ],
  },
  {
    period: "2021 — 2023",
    items: [
      {
        title: "Amazon Seller Services: FBA, FBM & Private Label",
        org: "E-commerce services",
        points: [
          "Provided FBA, FBM and private label services to Amazon sellers.",
          "Learned how revenue really moves: listings, inventory and the numbers behind every sale.",
        ],
      },
    ],
  },
  {
    period: "2018 — 2021",
    items: [
      {
        title: "Adobe Creative Work",
        org: "Design · Adobe Creative Suite",
        points: [
          "Three years of design work in Adobe, the eye for layout that shapes every funnel I build today.",
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
          "A foundation in problem-solving and systems thinking: the logic behind every workflow I build.",
        ],
      },
    ],
  },
];

export function Resume() {
  const listRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 70%", "end 85%"] });
  const line = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <section id="resume" className="relative overflow-x-clip px-4 md:px-10 py-24 md:py-40">
      <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20">
        <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          <Eyebrow index="04" label="Resume" />
          {/* EXPERIENCE = 4.18em: sized to the column so it never clips */}
          <h2 className="mt-8 font-mega text-[clamp(2.5rem,calc((100vw-2rem)/4.6),9rem)] md:text-[min(10vw,9rem)] lg:text-[min(6.4vw,8rem)]">
            <MaskText lines={["Education", "&", <span className="hl">Experience</span>]} />
          </h2>
          <p className="mt-6 max-w-sm text-muted-foreground">
            From design to e-commerce to senior GoHighLevel builds: eight years of learning what
            makes a business actually grow.
          </p>
        </div>

        <div ref={listRef} className="relative min-w-0 pl-10 md:pl-16">
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
                {/* solid colour so the period label always reads; sized to fit "2025 — PRESENT" */}
                <p className="font-mega text-[clamp(1.75rem,calc((100vw-6rem)/6.2),4.5rem)] lg:text-[min(4.5rem,calc((55vw-10rem)/6.2))] text-muted-foreground mb-8">
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
                      className="surface-dark group relative overflow-hidden rounded-3xl border border-border bg-card-gradient p-6 md:p-8 transition-colors duration-500 hover:border-secondary/60"
                    >
                      <div className="absolute -right-20 -top-20 size-56 rounded-full bg-secondary/20 blur-3xl opacity-0 transition duration-700 group-hover:opacity-100" />
                      <h3 className="relative font-display text-2xl md:text-3xl font-semibold">
                        {it.title}
                      </h3>
                      <p className="relative mt-1 text-highlight text-sm font-medium tracking-wide">
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
