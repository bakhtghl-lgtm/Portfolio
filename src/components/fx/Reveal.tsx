import { animate, motion, useInView, useMotionValue, useReducedMotion } from "framer-motion";
import { cloneElement, isValidElement, useEffect, useRef, type ReactNode } from "react";
import { useMedia } from "./useMedia";

const EASE = [0.76, 0, 0.24, 1] as const;

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children);
  if (Array.isArray(node)) return node.map(textOf).join("");
  return "";
}

/** One letter that rises out of its mask; its position is computed in CSS from the heading's
 *  scroll progress (--mp) and the letter's own start (--s): see .mask-char in styles.css. */
function ScrubChar({ ch, start }: { ch: string; start: number }) {
  return (
    <span className="mask-char" style={{ "--s": start } as React.CSSProperties}>
      {ch === " " ? "\u00A0" : ch}
    </span>
  );
}

/**
 * Section headings: every letter rises from behind its line mask, staggered left to right, as
 * the heading comes into view. Static for reduced motion.
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
  // The letters rise on their own once the heading enters and always play through: tied to the
  // scroll position they froze mid-move whenever the scroll stopped, which read as the page
  // getting stuck. One value per heading is tweened 0 -> 1 and every letter derives its own
  // staggered offset from it in CSS (.mask-char), so a heading costs one style write per frame
  // while it plays (per-letter transitions promoted dozens of layers and cost phones frames).
  const seen = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  // touch screens: whole lines rise instead of single letters. A line moving as one block is a
  // pure compositor move (no repaint), where moving letters repaint the heading every frame
  const touch = useMedia("(pointer: coarse)");
  const mp = useMotionValue(0);
  useEffect(() => {
    if (!seen || touch) return;
    const a = animate(mp, 1, { duration: 1.35, ease: [0.33, 1, 0.68, 1] });
    return () => a.stop();
  }, [seen, mp, touch]);
  const total = Math.max(1, lines.map(textOf).join("").length);
  let k = 0;

  const split = (text: string) =>
    text.split("").map((ch) => {
      const start = (k++ / total) * 0.55;
      return <ScrubChar key={k} ch={ch} start={start} />;
    });

  const render = (line: ReactNode): ReactNode => {
    if (reduce || touch) return line;
    if (typeof line === "string") return split(line);
    if (isValidElement<{ children?: ReactNode }>(line))
      return cloneElement(line, undefined, split(textOf(line)));
    return line;
  };

  return (
    <motion.span
      ref={ref}
      className={`gpu block ${className}`}
      style={{ "--mp": mp } as unknown as React.CSSProperties}
    >
      <span className="sr-only">{lines.map(textOf).join(" ")}</span>
      {lines.map((line, i) => (
        <span key={i} aria-hidden className={`mask whitespace-nowrap ${lineClassName}`}>
          {touch && !reduce ? (
            <motion.span
              className="gpu block origin-bottom-left"
              initial={{ y: "115%", rotate: 4 }}
              animate={seen ? { y: "0%", rotate: 0 } : undefined}
              transition={{ duration: 1.05, ease: EASE, delay: i * 0.12 }}
            >
              {line}
            </motion.span>
          ) : (
            <span className="block">{render(line)}</span>
          )}
        </span>
      ))}
    </motion.span>
  );
}

/** The paragraph's words light up one after another, left to right, as it comes into view. */
export function ScrollLitText({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  const words = text.split(" ");
  return (
    <p ref={ref} className={`flex flex-wrap ${className}`}>
      {words.map((w, i) => (
        <OnceWord key={i} word={w} lit={seen} delay={i * 0.07} />
      ))}
    </p>
  );
}

function OnceWord({ word, lit, delay }: { word: string; lit: boolean; delay: number }) {
  const highlight = word.startsWith("*");
  const clean = word.replace(/\*/g, "");
  const t = { transition: "opacity 0.6s ease", transitionDelay: `${delay}s` };
  return (
    <span className="relative mr-[0.25em] mt-[0.1em]">
      <span
        className="text-foreground/55"
        style={highlight ? { ...t, opacity: lit ? `calc(1 - var(--fade-rest, 0))` : 1 } : undefined}
      >
        {clean}
      </span>
      <span
        aria-hidden
        style={{ ...t, opacity: lit ? 1 : 0 }}
        className={`pointer-events-none absolute inset-0 ${highlight ? "hl hl-body" : "text-foreground"}`}
      >
        {clean}
      </span>
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
