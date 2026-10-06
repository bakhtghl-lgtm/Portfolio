import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { cloneElement, isValidElement, useRef, type ReactNode } from "react";

const EASE = [0.76, 0, 0.24, 1] as const;

const ramp = (v: number, a: number, b: number) => Math.min(1, Math.max(0, (v - a) / (b - a)));

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children);
  if (Array.isArray(node)) return node.map(textOf).join("");
  return "";
}

/** One letter that rises out of its mask as the heading scrolls into view (scrubbed). */
function ScrubChar({
  ch,
  p,
  range,
}: {
  ch: string;
  p: MotionValue<number>;
  range: [number, number];
}) {
  const y = useTransform(p, (v) => `${(1 - ramp(v, range[0], range[1])) * 115}%`);
  const rotate = useTransform(p, (v) => (1 - ramp(v, range[0], range[1])) * 14);
  return (
    <motion.span className="inline-block origin-bottom-left" style={{ y, rotate }}>
      {ch === " " ? "\u00A0" : ch}
    </motion.span>
  );
}

/**
 * Section headings: every letter rises from behind its line mask, staggered left to right and
 * tied to scroll position (scrubs back on scroll up). Fully assembled once the heading's top
 * reaches 55% of the viewport. Static for reduced motion.
 */
export function MaskText({
  lines,
  className = "",
  lineClassName = "",
}: {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 95%", "start 55%"] });
  const total = Math.max(1, lines.map(textOf).join("").length);
  let k = 0;

  const split = (text: string) =>
    text.split("").map((ch) => {
      const start = (k++ / total) * 0.55;
      return <ScrubChar key={k} ch={ch} p={scrollYProgress} range={[start, start + 0.45]} />;
    });

  const render = (line: ReactNode): ReactNode => {
    if (reduce) return line;
    if (typeof line === "string") return split(line);
    if (isValidElement<{ children?: ReactNode }>(line))
      return cloneElement(line, undefined, split(textOf(line)));
    return line;
  };

  return (
    <span ref={ref} className={`block ${className}`}>
      <span className="sr-only">{lines.map(textOf).join(" ")}</span>
      {lines.map((line, i) => (
        <span key={i} aria-hidden className={`mask whitespace-nowrap ${lineClassName}`}>
          <span className="block">{render(line)}</span>
        </span>
      ))}
    </span>
  );
}

/** Each word brightens as the paragraph scrolls through the viewport. */
export function ScrollLitText({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  // fully lit by the time the paragraph's end reaches the middle of the screen
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end 0.55"] });
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
  // function form keeps this off framer's native scroll-timeline path (it mis-maps opacity ranges)
  const opacity = useTransform(progress, (v) =>
    Math.min(1, Math.max(0, (v - range[0]) / (range[1] - range[0]))),
  );
  const highlight = word.startsWith("*");
  const clean = word.replace(/\*/g, "");
  return (
    <span className="relative mr-[0.25em] mt-[0.1em]">
      {/* readable resting state (>= 3:1); the lit layer fades in over it as you scroll */}
      <span className="text-foreground/55">{clean}</span>
      <motion.span
        aria-hidden
        style={{ opacity }}
        className={`pointer-events-none absolute inset-0 ${highlight ? "hl hl-body" : "text-foreground"}`}
      >
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
      <span className="text-highlight">{index}</span>
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
