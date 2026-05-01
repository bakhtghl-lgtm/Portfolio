import { Home, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";
import { Section, SectionTag } from "../Section";

export function Intro() {
  return (
    <Section id="intro">
      <SectionTag icon={<Home className="size-3.5" />} label="Introduce" />
      <h1 className="mt-8 font-display font-bold text-5xl md:text-7xl leading-[1.05] tracking-tight">
        Say Hi from <span className="text-gradient-yellow">Bakht Ali</span>,
        <br />
        GoHighLevel{" "}
        <span className="relative inline-block">
          Expert
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="absolute -bottom-2 left-0 right-0 h-1.5 bg-secondary origin-left rounded-full"
          />
        </span>
      </h1>
      <p className="mt-8 max-w-xl text-muted-foreground text-lg leading-relaxed">
        I build high-converting funnels, automations, and CRM systems
        <br />
        that turn clicks into customers.
      </p>

      <div className="mt-16 flex items-center gap-6 justify-start">
        <motion.a
          href="#portfolio"
          aria-label="Scroll to portfolio"
          className="relative size-24 sm:size-28 md:size-32 rounded-full border border-border flex items-center justify-center group"
        >
          <motion.svg
            viewBox="0 0 100 100"
            className="absolute inset-0 size-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          >
            <defs>
              <path id="circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
            </defs>
            <text className="fill-muted-foreground text-[10px] tracking-[0.4em] uppercase">
              <textPath href="#circle">My Projects • My Projects • </textPath>
            </text>
          </motion.svg>
          <motion.span
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="size-10 sm:size-11 md:size-12 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center shadow-glow group-hover:scale-110 transition"
          >
            <ArrowDown className="size-5" />
          </motion.span>
        </motion.a>
      </div>
    </Section>
  );
}
