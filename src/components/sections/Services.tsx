import { AlignLeft, Workflow, LayoutTemplate, MailPlus, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Section, SectionTag } from "../Section";

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

export function Services() {
  return (
    <Section id="services">
      <SectionTag icon={<AlignLeft className="size-3.5" />} label="Services" />
      <h2 className="mt-8 mb-12 font-display text-4xl md:text-6xl font-bold">
        My <span className="text-gradient-yellow">Specializations</span>
      </h2>

      <div className="grid sm:grid-cols-2 gap-5">
        {services.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -6 }}
            className="group relative bg-card-gradient border border-border rounded-3xl p-7 hover:border-secondary/60 transition-all duration-500 overflow-hidden"
          >
            {/* animated glow */}
            <div className="absolute -right-16 -top-16 size-56 rounded-full bg-secondary/15 blur-3xl opacity-0 group-hover:opacity-100 transition duration-700" />
            {/* sweep line */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

            <div className="relative flex flex-col h-full">
              <div className="flex items-center justify-between mb-5">
                <div className="size-14 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center group-hover:bg-secondary group-hover:text-secondary-foreground transition-all duration-500 group-hover:rotate-6">
                  <s.icon className="size-6 text-secondary group-hover:text-secondary-foreground transition" />
                </div>
                <span className="font-display text-4xl font-bold text-foreground/10 group-hover:text-secondary/30 transition">{`0${i + 1}`}</span>
              </div>
              <h3 className="font-display text-2xl font-semibold mb-2 group-hover:text-secondary transition">
                {s.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed flex-1">{s.desc}</p>
              <div className="mt-6 pt-5 border-t border-border/60">
                <p className="text-xs tracking-[0.25em] uppercase text-secondary font-semibold">
                  {s.count}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
