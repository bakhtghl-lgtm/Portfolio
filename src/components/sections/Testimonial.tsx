import { MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Section, SectionTag } from "../Section";

type TestimonialItem = {
  name: string;
  role?: string;
  company?: string;
  quote: string;
  project?: string;
};

const testimonials = [
  {
    name: "Tom B.",
    role: "Client",
    quote:
      "Honestly didn't think automations would make that big of a difference but after Bakht set everything up our missed follow-ups basically went to zero. He knew exactly what to do without a lot of explaining.",
  },
  {
    name: "Ashley",
    role: "Client",
    quote:
      "I came in with a messy setup and Bakht cleaned it all up. Funnel flows properly now and the email sequences are actually running. Would recommend him to anyone using GHL.",
  },
  {
    name: "Rachel S.",
    role: "Client",
    quote:
      "My website was a mess before. Bakht rebuilt it on GHL and connected my calendar for bookings. It looks professional now and clients can book without me being involved. Super smooth process working with him.",
  },
  {
    name: "Steve",
    role: "Client",
    quote:
      "We had old leads sitting doing nothing. Bakht put together an SMS workflow and we got responses from people we thought were long gone. Didn't take long either, was impressed.",
  },
  {
    name: "Natalie",
    role: "Client",
    quote:
      "Our no-show rate was a real problem. Since Bakht set up the reminder automations it's improved a lot. The lead capture form on the website is working well too. Happy we reached out.",
  },
  {
    name: "Marcus",
    role: "Client",
    quote:
      "Got my leads organized properly for the first time honestly. Bakht set up the pipeline and tags and now I can actually see where every lead is at. Really happy with it.",
  },
] satisfies TestimonialItem[];

function initials(name: string) {
  const parts = name
    .replace(/[.,—–-]/g, " ")
    .split(" ")
    .map((p) => p.trim())
    .filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return (first + last).toUpperCase();
}

export function Testimonial() {
  const [i, setI] = useState(0);
  const t = testimonials[i];
  const next = () => setI((p) => (p + 1) % testimonials.length);
  const prev = () => setI((p) => (p - 1 + testimonials.length) % testimonials.length);

  return (
    <Section id="testimonial">
      <div className="flex justify-center">
        <SectionTag icon={<MessageSquare className="size-3.5" />} label="Testimonial" />
      </div>
      <h2 className="mt-8 mb-12 text-center font-display text-4xl md:text-6xl font-bold leading-tight">
        Trusted by <span className="text-gradient-yellow">Hundred Clients</span>
      </h2>

      <div className="relative bg-card-gradient border border-border rounded-3xl p-7 sm:p-8 md:p-12 overflow-hidden min-h-[360px] sm:min-h-[420px] flex items-center justify-center">
        <div className="absolute -top-24 -right-24 size-72 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 size-72 rounded-full bg-secondary/5 blur-3xl pointer-events-none" />
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="relative flex flex-col items-center text-center"
          >
            <div className="relative mb-6">
              <div className="grid size-20 place-items-center rounded-full border-2 border-secondary/40 bg-secondary/10 shadow-glow">
                <span className="font-display text-lg font-semibold text-secondary">
                  {initials(t.name)}
                </span>
              </div>
            </div>
            <p className="font-display text-lg font-semibold">{t.name}</p>
            {t.role || t.company ? (
              <p className="text-sm text-muted-foreground mb-6">
                {t.role ? <span>{t.role}</span> : null}
                {t.role && t.company ? <span> · </span> : null}
                {t.company ? <span className="text-secondary font-medium">{t.company}</span> : null}
              </p>
            ) : (
              <div className="mb-6" />
            )}
            <p className="max-w-2xl text-lg md:text-xl leading-relaxed text-foreground/90">
              <span className="text-secondary text-3xl align-top mr-1">“</span>
              {t.quote}
              <span className="text-secondary text-3xl align-top ml-1">”</span>
            </p>
            {t.project ? (
              <p className="mt-8 text-xs tracking-[0.25em] uppercase text-muted-foreground">
                {t.project}
              </p>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center justify-center gap-4">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={prev}
          aria-label="Previous"
          className="size-11 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-secondary hover:border-secondary transition"
        >
          <ChevronLeft className="size-5" />
        </motion.button>
        <p className="text-sm text-muted-foreground tabular-nums">
          <span className="text-foreground font-semibold">{i + 1}</span>
          <span className="mx-2">/</span>
          {testimonials.length}
        </p>
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={next}
          aria-label="Next"
          className="size-11 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-secondary hover:border-secondary transition"
        >
          <ChevronRight className="size-5" />
        </motion.button>
      </div>
    </Section>
  );
}
