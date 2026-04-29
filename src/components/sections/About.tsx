import { User } from "lucide-react";
import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Section, SectionTag } from "../Section";

function Counter({ to, suffix = "+" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = 0;
    const dur = 1400;
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min((t - t0) / dur, 1);
      setN(Math.floor(start + (to - start) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, to]);
  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}

export function About() {
  return (
    <Section id="about">
      <div className="grid sm:grid-cols-2 gap-10 mb-16">
        <div>
          <h3 className="font-display text-6xl md:text-7xl font-bold text-gradient-yellow">
            <Counter to={3} />
          </h3>
          <p className="mt-3 text-xs tracking-[0.2em] uppercase text-muted-foreground">
            Years of
            <br />
            Experience
          </p>
        </div>
        <div>
          <h3 className="font-display text-6xl md:text-7xl font-bold text-gradient-yellow">
            <Counter to={50} />
          </h3>
          <p className="mt-3 text-xs tracking-[0.2em] uppercase text-muted-foreground">
            High-converting
            <br />
            funnels delivered
          </p>
        </div>
      </div>

      <SectionTag icon={<User className="size-3.5" />} label="About" />
      <h2 className="mt-8 font-display text-4xl md:text-6xl font-bold leading-tight">
        Every successful business runs on a smart{" "}
        <span className="text-gradient-yellow">automation system</span>
      </h2>
      <p className="mt-8 max-w-2xl text-muted-foreground text-lg leading-relaxed">
        I'm Bakht Ali Niazi — a GoHighLevel specialist with 3+ years of hands-on experience building funnels,
        pipelines, and automation workflows for agencies and service businesses. My background in Computer
        Science helps me turn messy processes into clean systems: lead capture, follow-up, routing, and reporting
        that teams can actually run day-to-day.
      </p>
    </Section>
  );
}
