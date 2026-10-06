import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Eyebrow, MaskText } from "../fx/Reveal";
import { VelocityMarquee } from "../fx/VelocityMarquee";
import { useMedia } from "../fx/useMedia";

type TestimonialItem = {
  name: string;
  role?: string;
  quote: string;
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
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

function Card({
  t,
  yellow,
  className = "mx-3",
}: {
  t: TestimonialItem;
  yellow?: boolean;
  className?: string;
}) {
  return (
    <figure
      className={`w-[80vw] sm:w-[460px] shrink-0 whitespace-normal rounded-[2rem] border p-7 md:p-9 transition-transform duration-500 hover:-rotate-2 hover:scale-[1.03] ${
        yellow
          ? "bg-secondary text-secondary-foreground border-secondary"
          : "surface-dark bg-card-gradient border-border"
      } ${className}`}
    >
      <span className={`font-mega text-7xl leading-none ${yellow ? "" : "text-highlight"}`}>“</span>
      <blockquote
        className={`-mt-4 text-base md:text-lg leading-relaxed ${yellow ? "" : "text-foreground/90"}`}
      >
        {t.quote}
      </blockquote>
      <figcaption className="mt-7 flex items-center gap-3">
        <span
          className={`grid size-11 place-items-center rounded-full font-display text-sm font-bold ${
            yellow
              ? "bg-secondary-foreground text-secondary"
              : "bg-secondary text-secondary-foreground"
          }`}
        >
          {initials(t.name)}
        </span>
        <span>
          <span className="block font-display font-semibold">{t.name}</span>
          <span
            className={`block text-xs uppercase tracking-[0.25em] ${yellow ? "opacity-70" : "text-muted-foreground"}`}
          >
            {t.role}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

export function Testimonial() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [-4, 4]);
  const half = Math.ceil(testimonials.length / 2);
  // phones and reduced motion get a swipeable, snapping row where a whole card is always readable
  const swipe = useMedia("(max-width: 767px), (prefers-reduced-motion: reduce)");

  return (
    <section id="testimonial" ref={ref} className="relative py-24 md:py-40 overflow-x-clip">
      <div className="px-4 md:px-10 flex flex-col items-center text-center">
        <Eyebrow index="06" label="Testimonials" />
        {/* HUNDRED CLIENTS = 6.29em */}
        <h2 className="mt-8 font-mega text-[clamp(2.25rem,calc((100vw-2rem)/6.7),9rem)] md:text-[min(9vw,9rem)]">
          <MaskText lines={["Trusted by", <span className="hl">Hundred Clients</span>]} />
        </h2>
      </div>

      {swipe ? (
        <div
          className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 scroll-px-4 [scrollbar-width:none]"
          aria-label="Client testimonials"
        >
          {testimonials.map((t, i) => (
            <Card
              key={t.name}
              t={t}
              yellow={i % 3 === 1}
              className="snap-start w-[min(85vw,420px)]"
            />
          ))}
        </div>
      ) : (
        <motion.div style={{ rotate }} className="mt-16 space-y-6 py-6">
          <VelocityMarquee baseVelocity={-1.2}>
            {testimonials
              .slice(0, half)
              .concat(testimonials.slice(0, half))
              .map((t, i) => (
                <Card key={i} t={t} yellow={i % 3 === 1} />
              ))}
          </VelocityMarquee>
          <VelocityMarquee baseVelocity={1.2}>
            {testimonials
              .slice(half)
              .concat(testimonials.slice(half))
              .map((t, i) => (
                <Card key={i} t={t} yellow={i % 3 === 2} />
              ))}
          </VelocityMarquee>
        </motion.div>
      )}
    </section>
  );
}
