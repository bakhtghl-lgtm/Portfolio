import { MessageSquare, Check } from "lucide-react";
import { motion } from "framer-motion";
import { Section, SectionTag } from "../Section";

const plans = [
  {
    name: "Starter",
    price: 49,
    tagline: "Have an existing GHL setup that needs polish?",
    perks: [
      "Funnel audit & optimization",
      "Up to 2 automation workflows",
      "Email/SMS template setup",
      "CRM pipeline configuration",
      "Basic integrations (Stripe, Calendly)",
      "Remote / Online delivery",
      "Support for 3 months",
    ],
    featured: false,
  },
  {
    name: "Premium",
    price: 99,
    tagline: "Full GoHighLevel build from scratch — leave it to me",
    perks: [
      "Complete GHL account setup",
      "Unlimited high-converting funnels",
      "Advanced automations & triggers",
      "Multi-channel campaigns (Email + SMS)",
      "Third-party integrations (Stripe, Calendly, Zapier)",
      "Conversion optimization & A/B testing",
      "Priority support for 12 months",
      "Onboarding & training included",
    ],
    featured: true,
  },
];

export function Pricing() {
  return (
    <Section id="pricing">
      <div className="flex justify-center mb-8">
        <SectionTag icon={<MessageSquare className="size-3.5" />} label="Pricing" />
      </div>
      <h2 className="text-center font-display text-4xl md:text-6xl font-bold mb-12">
        My <span className="text-gradient-yellow">Pricing</span>
      </h2>

      <div className="flex flex-col gap-6 md:flex-row md:items-stretch">
        {plans.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            whileHover={{ y: -8 }}
            className={`relative flex min-h-0 w-full min-w-0 flex-1 basis-0 flex-col rounded-3xl border p-8 bg-card-gradient ${p.featured ? "border-secondary/50 shadow-glow" : "border-border"}`}
          >
            {p.featured && (
              <span className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-[10px] font-bold tracking-widest uppercase">
                Popular
              </span>
            )}
            <div className="flex items-start justify-between mb-6">
              <h3 className="font-display text-2xl font-bold tracking-widest">
                {p.name.toUpperCase()}
              </h3>
              <p className="text-xs text-muted-foreground text-right max-w-[180px] leading-snug">
                {p.tagline}
              </p>
            </div>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="font-display text-6xl font-bold text-gradient-yellow">
                ${p.price}
              </span>
              <span className="text-muted-foreground">/ hour</span>
            </div>
            <div className="h-px bg-border mb-6" />
            <ul className="mb-8 flex min-h-0 flex-1 flex-col gap-3">
              {p.perks.map((perk) => (
                <li key={perk} className="flex gap-3 text-sm">
                  <Check className="size-4 text-secondary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{perk}</span>
                </li>
              ))}
            </ul>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`mt-auto w-full py-3.5 rounded-full font-semibold tracking-wide transition ${p.featured ? "bg-secondary text-secondary-foreground shadow-glow hover:brightness-110" : "border border-border hover:border-secondary hover:text-secondary"}`}
            >
              PICK THIS PACKAGE
            </motion.button>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
