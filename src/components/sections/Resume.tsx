import { Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { Section, SectionTag } from "../Section";

type TimelineItem = {
  title: string;
  org: string;
  points?: string[];
};

const timeline = [
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
  return (
    <Section id="resume">
      <div className="flex justify-center mb-8">
        <SectionTag icon={<Briefcase className="size-3.5" />} label="Resume" />
      </div>
      <h2 className="text-center font-display text-4xl md:text-6xl font-bold mb-16">
        Education & <span className="text-gradient-yellow">Experience</span>
      </h2>

      <div className="relative pl-8 md:pl-12 border-l border-border space-y-14">
        {timeline.map((block, bi) => (
          <motion.div
            key={bi}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: bi * 0.15 }}
            className="relative"
          >
            <span className="absolute -left-[37px] md:-left-[49px] top-2 size-3 rounded-full bg-secondary shadow-glow" />
            <p className="text-muted-foreground text-sm mb-6">{block.period}</p>
            <div className="space-y-6">
              {block.items.map((it, i) => (
                <motion.div
                  key={i}
                  whileHover={{ x: 6 }}
                  className="bg-card-gradient border border-border rounded-2xl p-6 hover:border-secondary/50 transition"
                >
                  <h4 className="font-display text-2xl font-semibold">{it.title}</h4>
                  <p className="mt-1 text-muted-foreground">{it.org}</p>
                  {it.points?.length ? (
                    <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                      {it.points.map((p) => (
                        <li key={p} className="flex gap-2">
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-secondary/70" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
