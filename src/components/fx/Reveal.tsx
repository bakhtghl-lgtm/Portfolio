import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef, type ReactNode } from "react";

const EASE = [0.76, 0, 0.24, 1] as const;

/** Splits text into lines/words that slide up from behind a mask when scrolled into view. */
export function MaskText({
  lines,
  className = "",
  lineClassName = "",
  delay = 0,
  stagger = 0.08,
  once = true,
}: {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
}) {
  return (
    <span className={`block ${className}`}>
      {lines.map((line, i) => (
        <span key={i} className={`block overflow-hidden pb-[0.06em] ${lineClassName}`}>
          <motion.span
            className="block"
            initial={{ y: "110%", rotate: 4 }}
            whileInView={{ y: "0%", rotate: 0 }}
            viewport={{ once, margin: "-10% 0px" }}
            transition={{ duration: 1, ease: EASE, delay: delay + i * stagger }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/** Each word brightens as the paragraph scrolls through the viewport. */
export function ScrollLitText({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.4"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className={`flex flex-wrap ${className}`}>
      {words.map((w, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return <LitWord key={i} progress={scrollYProgress} range={[start, end]} word={w} />;
      })}
    </p>
  );
}

function LitWord({
  progress,
  range,
  word,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  word: string;
}) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const highlight = word.startsWith("*");
  const clean = word.replace(/\*/g, "");
  return (
    <span className="relative mr-[0.25em] mt-[0.1em]">
      <motion.span style={{ opacity }} className={highlight ? "text-secondary" : undefined}>
        {clean}
      </motion.span>
    </span>
  );
}

/** Small uppercase label with a drawn line, used above section titles. */
export function Eyebrow({ index, label }: { index: string; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.35em] text-muted-foreground"
    >
      <span className="text-secondary">{index}</span>
      <motion.span
        className="h-px w-16 bg-secondary origin-left"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: EASE, delay: 0.2 }}
      />
      {label}
    </motion.div>
  );
}
